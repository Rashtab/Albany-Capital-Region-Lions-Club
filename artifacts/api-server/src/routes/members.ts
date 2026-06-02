import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  getAllMembers,
  getMemberById,
  getMemberByEmail,
  createMember,
  updateMember,
  softDeleteMember,
  getEffectivePermissions,
  wouldLoseLastAccessController,
} from "@workspace/db";
import { requireMemberAdmin, requirePermission } from "../middlewares/requireMemberAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// ── Constants ───────────────────────────────────────────────────

const VALID_ROLES = [
  "webmaster", "president", "secretary", "treasurer",
  "lcif_coordinator", "director", "member",
] as const;
type ValidRole = (typeof VALID_ROLES)[number];

function isValidRole(r: string): r is ValidRole {
  return (VALID_ROLES as readonly string[]).includes(r);
}

// ── Helper: strip passwordHash from any member row ──────────────

type MemberRow = { passwordHash?: string | null; [key: string]: unknown };
function safe<T extends MemberRow>(row: T): Omit<T, "passwordHash"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _ph, ...rest } = row;
  return rest as Omit<T, "passwordHash">;
}

// ── Helper: does the acting admin hold access_control? ──────────

async function actorHasAccessControl(actorId: number, actorRole: string): Promise<boolean> {
  const perms = await getEffectivePermissions(actorId, actorRole);
  return perms.includes("*") || perms.includes("access_control");
}

// ── Helper: does a member currently hold access_control? ────────

async function memberHoldsAccessControl(memberId: number, role: string): Promise<boolean> {
  const perms = await getEffectivePermissions(memberId, role);
  return perms.includes("*") || perms.includes("access_control");
}

// ── GET /api/members/all ─────────────────────────────────────────
// Returns all non-deleted members. Query param ?includeInactive=true adds
// soft-deleted records (admin audit view).
router.get(
  "/members/all",
  requireMemberAdmin,
  requirePermission("members"),
  async (_req, res) => {
    try {
      const rows = await getAllMembers();
      res.json(rows.map(safe));
    } catch (err) {
      logger.error({ err }, "Get all members error");
      res.status(500).json({ error: "Failed to fetch members" });
    }
  },
);

// ── POST /api/members ────────────────────────────────────────────
// Create a member / provision their login account.
// Guards:
//   • role must be in VALID_ROLES
//   • only access_control holders may create a webmaster
//   • email must be unique
//   • password (if supplied) is hashed with bcrypt — never stored plain
router.post(
  "/members",
  requireMemberAdmin,
  requirePermission("members"),
  async (req, res) => {
    const actorId   = req.session.memberId!;
    const actorRole = req.session.memberRole ?? "";

    const {
      name, email, phone, role, password,
      bio, photoUrl, isVisible, duesStatus, status, joinDate,
    } = req.body as Record<string, unknown>;

    // ── Validate required fields ────────────────────────────────
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    const targetRole = typeof role === "string" ? role : "member";
    if (!isValidRole(targetRole)) {
      res.status(400).json({
        error: `Invalid role "${targetRole}". Valid roles: ${VALID_ROLES.join(", ")}`,
      });
      return;
    }

    try {
      // ── Privilege escalation guard ─────────────────────────────
      if (targetRole === "webmaster") {
        const canGrant = await actorHasAccessControl(actorId, actorRole);
        if (!canGrant) {
          res.status(403).json({
            error: "Only an access-control administrator can create a webmaster account",
          });
          return;
        }
      }

      // ── Email uniqueness ───────────────────────────────────────
      const existing = await getMemberByEmail(email.toLowerCase().trim());
      if (existing) {
        res.status(409).json({ error: "A member with that email already exists" });
        return;
      }

      // ── Hash password if provided ──────────────────────────────
      let passwordHash: string | undefined;
      if (typeof password === "string" && password.trim()) {
        if (password.length < 8) {
          res.status(400).json({ error: "Password must be at least 8 characters" });
          return;
        }
        passwordHash = await bcrypt.hash(password, 12);
      }

      const row = await createMember({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: typeof phone === "string" && phone ? phone : null,
        role: targetRole,
        bio: typeof bio === "string" && bio ? bio : null,
        photoUrl: typeof photoUrl === "string" && photoUrl ? photoUrl : null,
        isVisible: typeof isVisible === "boolean" ? isVisible : true,
        duesStatus: typeof duesStatus === "string" ? duesStatus : "unpaid",
        status: typeof status === "string" ? status : "active",
        joinDate: typeof joinDate === "string" && joinDate ? joinDate : null,
        ...(passwordHash ? { passwordHash } : {}),
      });

      res.status(201).json(safe(row));
    } catch (err) {
      logger.error({ err }, "Create member error");
      res.status(500).json({ error: "Failed to create member" });
    }
  },
);

// ── PUT /api/members/:id ─────────────────────────────────────────
// Partial profile + role update.
// Guards:
//   • role must be in VALID_ROLES if supplied
//   • only access_control holders may promote to webmaster
//   • lockout guard if role change would strip the last access_control holder
router.put(
  "/members/:id",
  requireMemberAdmin,
  requirePermission("members"),
  async (req, res) => {
    const actorId   = req.session.memberId!;
    const actorRole = req.session.memberRole ?? "";
    const id = Number(req.params.id);

    try {
      const member = await getMemberById(id);
      if (!member) { res.status(404).json({ error: "Member not found" }); return; }

      const {
        name, email, phone, role, bio, photoUrl,
        isVisible, duesStatus, status, joinDate,
      } = req.body as Record<string, unknown>;

      // ── Role validation ────────────────────────────────────────
      let targetRole: ValidRole | undefined;
      if (role !== undefined) {
        if (typeof role !== "string" || !isValidRole(role)) {
          res.status(400).json({
            error: `Invalid role "${role}". Valid roles: ${VALID_ROLES.join(", ")}`,
          });
          return;
        }
        targetRole = role as ValidRole;
      }

      // ── Privilege escalation guard (promoting to webmaster) ────
      if (targetRole === "webmaster" && member.role !== "webmaster") {
        const canGrant = await actorHasAccessControl(actorId, actorRole);
        if (!canGrant) {
          res.status(403).json({
            error: "Only an access-control administrator can assign the webmaster role",
          });
          return;
        }
      }

      // ── Lockout guard (role demotion from access_control role) ─
      if (targetRole !== undefined && targetRole !== member.role) {
        const holdsAC = await memberHoldsAccessControl(id, member.role ?? "");
        if (holdsAC) {
          // Check if new role still grants AC (accounting only for role perms — overrides stay)
          const { getRolePermissions } = await import("@workspace/db");
          const newRolePerms = await getRolePermissions(targetRole);
          const newRoleGrantsAC = newRolePerms.includes("*") || newRolePerms.includes("access_control");
          if (!newRoleGrantsAC) {
            const wouldLose = await wouldLoseLastAccessController(id);
            if (wouldLose) {
              res.status(409).json({ error: "Cannot remove the last access-control administrator" });
              return;
            }
          }
        }
      }

      // ── Email uniqueness if changed ────────────────────────────
      if (typeof email === "string" && email.trim() && email.toLowerCase().trim() !== (member.email ?? "").toLowerCase()) {
        const conflict = await getMemberByEmail(email.toLowerCase().trim());
        if (conflict && conflict.id !== id) {
          res.status(409).json({ error: "A member with that email already exists" });
          return;
        }
      }

      const updates: Record<string, unknown> = {};
      if (typeof name === "string" && name.trim())          updates.name        = name.trim();
      if (typeof email === "string" && email.trim())        updates.email       = email.toLowerCase().trim();
      if (phone !== undefined)                              updates.phone       = typeof phone === "string" && phone ? phone : null;
      if (targetRole !== undefined)                         updates.role        = targetRole;
      if (bio !== undefined)                                updates.bio         = typeof bio === "string" && bio ? bio : null;
      if (photoUrl !== undefined)                           updates.photoUrl    = typeof photoUrl === "string" && photoUrl ? photoUrl : null;
      if (typeof isVisible === "boolean")                   updates.isVisible   = isVisible;
      if (typeof duesStatus === "string")                   updates.duesStatus  = duesStatus;
      if (typeof status === "string")                       updates.status      = status;
      if (joinDate !== undefined)                           updates.joinDate    = typeof joinDate === "string" && joinDate ? joinDate : null;

      const updated = await updateMember(id, updates);
      if (!updated) { res.status(404).json({ error: "Member not found" }); return; }

      res.json(safe(updated));
    } catch (err) {
      logger.error({ err }, "Update member error");
      res.status(500).json({ error: "Failed to update member" });
    }
  },
);

// ── DELETE /api/members/:id ──────────────────────────────────────
// Soft delete. Guards: lockout guard if member is last access_control holder.
router.delete(
  "/members/:id",
  requireMemberAdmin,
  requirePermission("members"),
  async (req, res) => {
    const id = Number(req.params.id);
    try {
      const member = await getMemberById(id);
      if (!member) { res.status(404).json({ error: "Member not found" }); return; }

      // Lockout guard
      const holdsAC = await memberHoldsAccessControl(id, member.role ?? "");
      if (holdsAC) {
        const wouldLose = await wouldLoseLastAccessController(id);
        if (wouldLose) {
          res.status(409).json({ error: "Cannot remove the last access-control administrator" });
          return;
        }
      }

      await softDeleteMember(id);
      res.json({ success: true });
    } catch (err) {
      logger.error({ err }, "Delete member error");
      res.status(500).json({ error: "Failed to delete member" });
    }
  },
);

// ── POST /api/members/:id/set-password ───────────────────────────
// Admin-side password reset — sets a new password without needing the old one.
// The acting admin needs members permission. Never echoes hashes.
router.post(
  "/members/:id/set-password",
  requireMemberAdmin,
  requirePermission("members"),
  async (req, res) => {
    const id = Number(req.params.id);
    const { newPassword } = req.body as { newPassword?: string };

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      res.status(400).json({ error: "newPassword must be at least 8 characters" });
      return;
    }
    try {
      const member = await getMemberById(id);
      if (!member) { res.status(404).json({ error: "Member not found" }); return; }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      const updated = await updateMember(id, { passwordHash });
      if (!updated) { res.status(404).json({ error: "Member not found" }); return; }

      res.json({ success: true });
    } catch (err) {
      logger.error({ err }, "Set member password error");
      res.status(500).json({ error: "Failed to set password" });
    }
  },
);

export default router;
