import { Router } from "express";
import { db, magazines } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/magazines (public)
router.get("/magazines", async (_req, res) => {
  try {
    const list = await db.select().from(magazines).orderBy(desc(magazines.year));
    res.json(list);
  } catch (err) {
    logger.error({ err }, "Get magazines error");
    res.status(500).json({ error: "Failed to fetch magazines" });
  }
});

// POST /api/magazines (admin)
router.post("/magazines", requireAdmin, async (req, res) => {
  try {
    const { title, year, fileUrl, description, isCurrent } = req.body;
    if (!title || !year || !fileUrl) {
      res.status(400).json({ error: "title, year, and fileUrl are required" });
      return;
    }
    // If marking as current, unmark others
    if (isCurrent) {
      await db.update(magazines).set({ isCurrent: false });
    }
    const [mag] = await db.insert(magazines).values({
      title, year: Number(year), fileUrl, description, isCurrent: Boolean(isCurrent),
    }).returning();
    res.status(201).json(mag);
  } catch (err) {
    logger.error({ err }, "Create magazine error");
    res.status(500).json({ error: "Failed to create magazine" });
  }
});

// PUT /api/magazines/:id (admin)
router.put("/magazines/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, year, fileUrl, description, isCurrent } = req.body;
    if (isCurrent) {
      await db.update(magazines).set({ isCurrent: false });
    }
    const [mag] = await db.update(magazines).set({
      title, year: Number(year), fileUrl, description, isCurrent: Boolean(isCurrent),
    }).where(eq(magazines.id, id)).returning();
    if (!mag) { res.status(404).json({ error: "Magazine not found" }); return; }
    res.json(mag);
  } catch (err) {
    logger.error({ err }, "Update magazine error");
    res.status(500).json({ error: "Failed to update magazine" });
  }
});

// DELETE /api/magazines/:id (admin)
router.delete("/magazines/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(magazines).where(eq(magazines.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete magazine error");
    res.status(500).json({ error: "Failed to delete magazine" });
  }
});

export default router;
