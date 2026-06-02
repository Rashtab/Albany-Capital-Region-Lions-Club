import { Router } from "express";
import { db, galleryItems } from "@workspace/db";
import { eq, desc, and, isNull } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/gallery — non-deleted items (public)
// Guard: deleted_at IS NULL
router.get("/gallery", async (_req, res) => {
  try {
    const items = await db
      .select()
      .from(galleryItems)
      .where(isNull(galleryItems.deletedAt))
      .orderBy(desc(galleryItems.createdAt));
    res.json(items);
  } catch (err) {
    logger.error({ err }, "Get gallery error");
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

// POST /api/gallery (admin)
router.post("/gallery", requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl, category, eventDate } = req.body;
    if (!title || !imageUrl) {
      res.status(400).json({ error: "title and imageUrl are required" });
      return;
    }
    const [item] = await db.insert(galleryItems).values({
      title, imageUrl, category, eventDate: eventDate || null,
    }).returning();
    res.status(201).json(item);
  } catch (err) {
    logger.error({ err }, "Create gallery item error");
    res.status(500).json({ error: "Failed to create gallery item" });
  }
});

// DELETE /api/gallery/:id — soft delete (admin)
router.delete("/gallery/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db
      .update(galleryItems)
      .set({ deletedAt: new Date() })
      .where(and(eq(galleryItems.id, id), isNull(galleryItems.deletedAt)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete gallery item error");
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;
