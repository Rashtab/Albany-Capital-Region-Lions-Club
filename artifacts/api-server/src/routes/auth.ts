import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsers } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, verifyToken } from "../lib/auth.js";
import { logger } from "../lib/logger.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// POST /api/auth/setup — create first admin (only works if none exist)
router.post("/auth/setup", async (req, res) => {
  try {
    const existing = await db.select().from(adminUsers).limit(1);
    if (existing.length > 0) {
      res.status(403).json({ error: "Admin already exists. Use login." });
      return;
    }
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email, and password are required" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(adminUsers).values({ name, email, passwordHash, role: "admin" }).returning();
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    logger.error({ err }, "Auth setup error");
    res.status(500).json({ error: "Setup failed" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    logger.error({ err }, "Auth login error");
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/auth/me", (req, res) => {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = verifyToken(auth.slice(7));
    res.json({ user: payload });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// PUT /api/auth/profile — update name, email, and/or password (admin only)
router.put("/auth/profile", requireAdmin, async (req, res) => {
  try {
    const { id } = (req as Request & { admin: { id: number } }).admin;
    const { name, email, currentPassword, newPassword } = req.body as {
      name?: string; email?: string; currentPassword?: string; newPassword?: string;
    };

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const updates: Partial<{ name: string; email: string; passwordHash: string }> = {};

    if (name && name.trim()) updates.name = name.trim();

    if (email && email.trim() && email.trim() !== user.email) {
      const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.trim())).limit(1);
      if (existing && existing.id !== id) {
        res.status(409).json({ error: "That email is already in use" });
        return;
      }
      updates.email = email.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: "Current password is required to set a new password" });
        return;
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }
      if (newPassword.length < 8) {
        res.status(400).json({ error: "New password must be at least 8 characters" });
        return;
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "Nothing to update" });
      return;
    }

    const [updated] = await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id)).returning();
    const token = signToken({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
    logger.info({ id }, "Admin profile updated");
    res.json({ token, user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } });
  } catch (err) {
    logger.error({ err }, "Update profile error");
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
