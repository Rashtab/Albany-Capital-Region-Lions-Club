import { Router } from "express";
import { db, blogPosts } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/blog — published posts only (public)
// Guard: published = true AND status != 'draft'
router.get("/blog", async (_req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.published, true), eq(blogPosts.status, "published")))
      .orderBy(desc(blogPosts.publishedAt));
    res.json(posts);
  } catch (err) {
    logger.error({ err }, "Get blog posts error");
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/blog/all — all posts including drafts (admin only)
router.get("/blog/all", requireAdmin, async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json(posts);
  } catch (err) {
    logger.error({ err }, "Get all blog posts error");
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/blog/:slug — single published post (public)
// Guard: published = true AND status = 'published' — never exposes drafts
router.get("/blog/:slug", async (req, res) => {
  try {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.slug, req.params.slug),
          eq(blogPosts.published, true),
          eq(blogPosts.status, "published"),
        ),
      )
      .limit(1);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    logger.error({ err }, "Get blog post error");
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /api/blog — create post (admin)
router.post("/blog", requireAdmin, async (req, res) => {
  try {
    const { title, slug, content, excerpt, coverImageUrl, category, published, authorName, tags } = req.body;
    if (!title || !slug || !content) {
      res.status(400).json({ error: "title, slug, and content are required" });
      return;
    }
    const now = new Date();
    const isPublished = Boolean(published);
    const [post] = await db.insert(blogPosts).values({
      title, slug, content, excerpt, coverImageUrl, category,
      authorName: authorName ?? null,
      tags: Array.isArray(tags) ? tags : [],
      published: isPublished,
      status: isPublished ? "published" : "draft",
      publishedAt: isPublished ? now : null,
    }).returning();
    res.status(201).json(post);
  } catch (err) {
    logger.error({ err }, "Create blog post error");
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT /api/blog/:id — update post (admin)
router.put("/blog/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, content, excerpt, coverImageUrl, category, published, authorName, tags } = req.body;
    const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (!existing) { res.status(404).json({ error: "Post not found" }); return; }
    const now = new Date();
    const isPublished = Boolean(published);
    const [post] = await db.update(blogPosts).set({
      title, slug, content, excerpt, coverImageUrl, category,
      authorName: authorName ?? null,
      tags: Array.isArray(tags) ? tags : [],
      published: isPublished,
      status: isPublished ? "published" : "draft",
      publishedAt: isPublished && !existing.publishedAt ? now : existing.publishedAt,
      updatedAt: now,
    }).where(eq(blogPosts.id, id)).returning();
    res.json(post);
  } catch (err) {
    logger.error({ err }, "Update blog post error");
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/blog/:id (admin)
router.delete("/blog/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete blog post error");
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
