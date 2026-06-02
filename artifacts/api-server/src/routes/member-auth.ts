declare module "express-session" {
  interface SessionData {
    memberId?: number;
    memberEmail?: string;
    memberName?: string;
    memberRole?: string;
  }
}

import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  getMemberByEmail,
  updateMember,
  getEffectivePermissions,
  wouldLoseLastAccessController,
} from "@workspace/db";
import { requireMemberAdmin } from "../middlewares/requireMemberAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

const PORTAL_ROLES = [
  "president", "secretary", "treasurer", "webmaster",
  "lcif_coordinator", "member",
];

function isPortalRole(role: string | null | undefined): boolean {
  return PORTAL_ROLES.includes(role ?? "");
}

// POST /api/admin/login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    const member = await getMemberByEmail(email.toLowerCase().trim());
    if (!member || !isPortalRole(member.role)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (!member.passwordHash) {
      res.status(401).json({ error: "No password set for this account. Contact the webmaster." });
      return;
    }
    const ok = await bcrypt.compare(password, member.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const permissions = await getEffectivePermissions(member.id, member.role ?? "");
    req.session.memberId = member.id;
    req.session.memberEmail = member.email ?? "";
    req.session.memberName = member.name;
    req.session.memberRole = member.role ?? "";
    req.log.info({ memberId: member.id, role: member.role }, "Admin member logged in");
    res.json({ id: member.id, name: member.name, email: member.email, role: member.role, permissions });
  } catch (err) {
    logger.error({ err }, "Admin login error");
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/admin/me
router.get("/admin/me", (req, res) => {
  if (!req.session.memberId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  // Re-fetch permissions live so they reflect any runtime changes
  const { memberId, memberEmail, memberName, memberRole } = req.session;
  getEffectivePermissions(memberId, memberRole ?? "")
    .then((permissions) => {
      res.json({ id: memberId, name: memberName, email: memberEmail, role: memberRole, permissions });
    })
    .catch((err) => {
      logger.error({ err }, "Error fetching permissions for /admin/me");
      res.status(500).json({ error: "Failed to fetch session" });
    });
});

// POST /api/admin/logout
router.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "Logout error");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("lions_sid");
    res.json({ success: true });
  });
});

// POST /api/admin/set-password
// First-time: no currentPassword needed. Subsequent: currentPassword required.
router.post("/admin/set-password", async (req, res) => {
  const { email, newPassword, currentPassword } = req.body as {
    email?: string; newPassword?: string; currentPassword?: string;
  };
  if (!email || !newPassword) {
    res.status(400).json({ error: "email and newPassword are required" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }
  try {
    const member = await getMemberByEmail(email.toLowerCase().trim());
    if (!member || !isPortalRole(member.role)) {
      res.status(404).json({ error: "Member not found or not a portal role" });
      return;
    }
    if (member.passwordHash) {
      if (!currentPassword) {
        res.status(400).json({ error: "currentPassword is required to change an existing password" });
        return;
      }
      const ok = await bcrypt.compare(currentPassword, member.passwordHash);
      if (!ok) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }
    }
    const hash = await bcrypt.hash(newPassword, 12);
    await updateMember(member.id, { passwordHash: hash });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    logger.error({ err }, "Set password error");
    res.status(500).json({ error: "Failed to set password" });
  }
});

// ── Permissions API ────────────────────────────────────────────
// These are protected by requireMemberAdmin + access_control permission
// (enforced in the route handlers themselves since we import requirePermission separately)

import {
  getAllRolePermissions,
  setRolePermissions,
  getAllMemberPermissionOverrides,
  setMemberPermissionOverride,
  removeMemberPermissionOverride,
} from "@workspace/db";
import { requirePermission } from "../middlewares/requireMemberAdmin.js";

// GET /api/admin/role-permissions — all role→permission mappings
router.get("/admin/role-permissions", requireMemberAdmin, requirePermission("access_control"), async (_req, res) => {
  try {
    const rows = await getAllRolePermissions();
    // Group by role: { role: permission[] }
    const map: Record<string, string[]> = {};
    for (const { role, permission } of rows) {
      (map[role] ??= []).push(permission);
    }
    res.json(map);
  } catch (err) {
    logger.error({ err }, "Get role permissions error");
    res.status(500).json({ error: "Failed to fetch role permissions" });
  }
});

// PUT /api/admin/role-permissions/:role — replace all permissions for a role
router.put("/admin/role-permissions/:role", requireMemberAdmin, requirePermission("access_control"), async (req, res) => {
  const role = String(req.params.role);
  const { permissions } = req.body as { permissions?: string[] };
  if (!Array.isArray(permissions)) {
    res.status(400).json({ error: "permissions must be an array of strings" });
    return;
  }
  try {
    // Lockout guard: if removing access_control (or *) from this role, check safety
    const removingAC = !permissions.includes("access_control") && !permissions.includes("*");
    if (removingAC) {
      const wouldLose = await wouldLoseLastAccessController(undefined, role);
      if (wouldLose) {
        res.status(409).json({ error: "Cannot remove the last access-control administrator" });
        return;
      }
    }
    await setRolePermissions(String(role), permissions);
    res.json({ success: true, role, permissions });
  } catch (err) {
    logger.error({ err }, "Set role permissions error");
    res.status(500).json({ error: "Failed to update role permissions" });
  }
});

// GET /api/admin/member-permissions — all per-member overrides
router.get("/admin/member-permissions", requireMemberAdmin, requirePermission("access_control"), async (_req, res) => {
  try {
    const rows = await getAllMemberPermissionOverrides();
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Get member permissions error");
    res.status(500).json({ error: "Failed to fetch member permissions" });
  }
});

// PUT /api/admin/member-permissions/:memberId/:permission — set or update an override
router.put(
  "/admin/member-permissions/:memberId/:permission",
  requireMemberAdmin,
  requirePermission("access_control"),
  async (req, res) => {
    const memberId = Number(req.params.memberId);
    const permission = String(req.params.permission);
    const { granted } = req.body as { granted?: boolean };
    if (typeof granted !== "boolean") {
      res.status(400).json({ error: "granted must be a boolean" });
      return;
    }
    try {
      // Lockout guard: if revoking access_control from a member, check safety
      if ((permission === "access_control" || permission === "*") && !granted) {
        const wouldLose = await wouldLoseLastAccessController(memberId);
        if (wouldLose) {
          res.status(409).json({ error: "Cannot remove the last access-control administrator" });
          return;
        }
      }
      await setMemberPermissionOverride(memberId, permission, granted);
      res.json({ success: true, memberId, permission, granted });
    } catch (err) {
      logger.error({ err }, "Set member permission override error");
      res.status(500).json({ error: "Failed to update member permission" });
    }
  },
);

// DELETE /api/admin/member-permissions/:memberId/:permission — remove override
router.delete(
  "/admin/member-permissions/:memberId/:permission",
  requireMemberAdmin,
  requirePermission("access_control"),
  async (req, res) => {
    const memberId = Number(req.params.memberId);
    const permission = String(req.params.permission);
    try {
      await removeMemberPermissionOverride(memberId, permission);
      res.json({ success: true });
    } catch (err) {
      logger.error({ err }, "Remove member permission override error");
      res.status(500).json({ error: "Failed to remove member permission" });
    }
  },
);

export default router;
