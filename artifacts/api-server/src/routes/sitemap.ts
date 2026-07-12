import { Router } from "express";
import { db, blogPosts, projects } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router = Router();

const CANONICAL_ORIGIN =
  process.env["CANONICAL_ORIGIN"] ?? "https://albanylionsclub.org";

const STATIC_PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/leadership", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/events", priority: "0.9", changefreq: "weekly" },
  { path: "/calendar", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "weekly" },
  { path: "/magazine", priority: "0.7", changefreq: "monthly" },
  { path: "/sponsors", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.7", changefreq: "monthly" },
  { path: "/donate", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/sponsors/magazine-advertisers-2026", priority: "0.5", changefreq: "yearly" },
];

function urlEntry(loc: string, priority: string, changefreq: string, lastmod?: string): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function toW3cDate(d: Date | string | null | undefined): string | undefined {
  if (!d) return undefined;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return undefined;
  return date.toISOString().split("T")[0];
}

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const [posts, projectRows] = await Promise.all([
      db
        .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt, publishedAt: blogPosts.publishedAt })
        .from(blogPosts)
        .where(and(eq(blogPosts.published, true), eq(blogPosts.status, "published"), isNull(blogPosts.deletedAt))),
      db
        .select({ slug: projects.slug, updatedAt: projects.updatedAt })
        .from(projects)
        .where(and(eq(projects.status, "published"), isNull(projects.deletedAt))),
    ]);

    const entries: string[] = [];

    for (const page of STATIC_PAGES) {
      entries.push(urlEntry(`${CANONICAL_ORIGIN}${page.path}`, page.priority, page.changefreq));
    }

    for (const post of posts) {
      const lastmod = toW3cDate(post.updatedAt ?? post.publishedAt);
      entries.push(urlEntry(`${CANONICAL_ORIGIN}/blog/${post.slug}`, "0.7", "monthly", lastmod));
    }

    for (const project of projectRows) {
      const lastmod = toW3cDate(project.updatedAt);
      entries.push(urlEntry(`${CANONICAL_ORIGIN}/projects/${project.slug}`, "0.8", "monthly", lastmod));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    logger.error({ err }, "Failed to generate sitemap");
    res.status(500).send("<?xml version=\"1.0\"?><error>Failed to generate sitemap</error>");
  }
});

export default router;
