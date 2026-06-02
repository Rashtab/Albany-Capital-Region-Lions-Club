// Session data type augmentation — must live in a module file
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
import { getMemberByEmail, updateMember } from "@workspace/db";
import { logger } from "../lib/logger.js";

const router = Router();

const ALLOWED_ROLES = ["president", "secretary", "treasurer", "webmaster", "lcif_coordinator"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

const ROLE_PERMISSIONS: Record<AllowedRole, string[]> = {
  president: ["all"],
  webmaster: ["all"],
  secretary: ["members", "events", "content"],
  treasurer: ["donations", "sponsors"],
  lcif_coordinator: ["donations", "events"],
};

function getPermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role as AllowedRole] ?? [];
}

function isAllowedRole(role: string | null | undefined): role is AllowedRole {
  return ALLOWED_ROLES.includes(role as AllowedRole);
}

// POST /admin/login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    const member = await getMemberByEmail(email.toLowerCase().trim());
    if (!member || !isAllowedRole(member.role)) {
      // Generic message — don't reveal whether the account exists
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (!member.passwordHash) {
      res.status(401).json({
        error: "No password set for this account. Ask the webmaster to run the initial password setup.",
      });
      return;
    }
    const ok = await bcrypt.compare(password, member.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    req.session.memberId = member.id;
    req.session.memberEmail = member.email ?? "";
    req.session.memberName = member.name;
    req.session.memberRole = member.role ?? "";
    const payload = {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      permissions: getPermissions(member.role ?? ""),
    };
    req.log.info({ memberId: member.id, role: member.role }, "Admin member logged in");
    res.json(payload);
  } catch (err) {
    logger.error({ err }, "Admin login error");
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /admin/me — verify session and return current member
router.get("/admin/me", (req, res) => {
  if (!req.session.memberId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({
    id: req.session.memberId,
    name: req.session.memberName,
    email: req.session.memberEmail,
    role: req.session.memberRole,
    permissions: getPermissions(req.session.memberRole ?? ""),
  });
});

// POST /admin/logout
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

// POST /admin/set-password
// — If the member has no password yet: sets it without requiring currentPassword (first-time setup)
// — If they already have a password: requires currentPassword to change it
router.post("/admin/set-password", async (req, res) => {
  const { email, newPassword, currentPassword } = req.body as {
    email?: string;
    newPassword?: string;
    currentPassword?: string;
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
    if (!member || !isAllowedRole(member.role)) {
      res.status(404).json({ error: "Member not found or not an admin role" });
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

export default router;
