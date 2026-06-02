import { Router } from "express";
import { db, magazines } from "@workspace/db";
import { eq, desc, and, isNull } from "drizzle-orm";
import { requireMemberAdmin, requirePermission } from "../middlewares/requireMemberAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/magazines — non-deleted magazines (public)
router.get("/magazines", async (_req, res) => {
  try {
    const list = await db.select().from(magazines).where(isNull(magazines.deletedAt)).orderBy(desc(magazines.year));
    res.json(list);
  } catch (err) {
    logger.error({ err }, "Get magazines error");
    res.status(500).json({ error: "Failed to fetch magazines" });
  }
});

// POST /api/magazines (admin, content permission)
router.post("/magazines", requireMemberAdmin, requirePermission("content"), async (req, res) => {
  try {
    const { title, year, fileUrl, description, isCurrent } = req.body;
    if (!title || !year || !fileUrl) { res.status(400).json({ error: "title, year, and fileUrl are required" }); return; }
    if (isCurrent) {
      await db.update(magazines).set({ isCurrent: false }).where(isNull(magazines.deletedAt));
    }
    const [mag] = await db.insert(magazines).values({ title, year: Number(year), fileUrl, description, isCurrent: Boolean(isCurrent) }).returning();
    res.status(201).json(mag);
  } catch (err) {
    logger.error({ err }, "Create magazine error");
    res.status(500).json({ error: "Failed to create magazine" });
  }
});

// PUT /api/magazines/:id (admin, content permission)
router.put("/magazines/:id", requireMemberAdmin, requirePermission("content"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, year, fileUrl, description, isCurrent } = req.body;
    if (isCurrent) {
      await db.update(magazines).set({ isCurrent: false }).where(isNull(magazines.deletedAt));
    }
    const [mag] = await db.update(magazines).set({ title, year: Number(year), fileUrl, description, isCurrent: Boolean(isCurrent) }).where(and(eq(magazines.id, id), isNull(magazines.deletedAt))).returning();
    if (!mag) { res.status(404).json({ error: "Magazine not found" }); return; }
    res.json(mag);
  } catch (err) {
    logger.error({ err }, "Update magazine error");
    res.status(500).json({ error: "Failed to update magazine" });
  }
});

// DELETE /api/magazines/:id — soft delete (admin, content permission)
router.delete("/magazines/:id", requireMemberAdmin, requirePermission("content"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.update(magazines).set({ deletedAt: new Date() }).where(and(eq(magazines.id, id), isNull(magazines.deletedAt)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete magazine error");
    res.status(500).json({ error: "Failed to delete magazine" });
  }
});

export default router;
