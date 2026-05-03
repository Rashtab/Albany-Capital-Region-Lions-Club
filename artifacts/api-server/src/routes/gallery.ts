import { Router } from "express";
import { db, galleryItems } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/gallery (public)
router.get("/gallery", async (_req, res) => {
  try {
    const items = await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
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
    const [item] = await db.insert(galleryItems).values({ title, imageUrl, category, eventDate: eventDate || null }).returning();
    res.status(201).json(item);
  } catch (err) {
    logger.error({ err }, "Create gallery item error");
    res.status(500).json({ error: "Failed to create gallery item" });
  }
});

// DELETE /api/gallery/:id (admin)
router.delete("/gallery/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(galleryItems).where(eq(galleryItems.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete gallery item error");
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;
