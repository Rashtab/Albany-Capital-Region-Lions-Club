import { Router } from "express";
import { db, blogPosts } from "@workspace/db";
import { eq, desc, and, isNull } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/blog — published, non-deleted posts (public)
// Guard: published = true AND status = 'published' AND deleted_at IS NULL
router.get("/blog", async (_req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.status, "published"),
          isNull(blogPosts.deletedAt),
        ),
      )
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
    const posts = await db
      .select()
      .from(blogPosts)
      .where(isNull(blogPosts.deletedAt))
      .orderBy(desc(blogPosts.createdAt));
    res.json(posts);
  } catch (err) {
    logger.error({ err }, "Get all blog posts error");
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/blog/:slug — single published, non-deleted post (public)
// Guard: slug matches AND published = true AND status = 'published' AND deleted_at IS NULL
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
          isNull(blogPosts.deletedAt),
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
    const [existing] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt)))
      .limit(1);
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
    }).where(and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt))).returning();
    res.json(post);
  } catch (err) {
    logger.error({ err }, "Update blog post error");
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/blog/:id — soft delete (admin)
router.delete("/blog/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db
      .update(blogPosts)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete blog post error");
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
