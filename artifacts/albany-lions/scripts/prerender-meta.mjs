/**
 * Post-build prerender script.
 *
 * 1. Generates per-route HTML files for all static public routes so that
 *    the static file server serves them directly with baked-in metadata
 *    (before the catch-all /index.html rewrite).
 *
 * 2. Queries the database for all published blog posts and projects, and
 *    generates a per-slug HTML file for each.  For dynamic-content routes
 *    (/blog/:slug, /projects/:slug) the script also injects the actual page
 *    body into <div id="root"> so that non-JS crawlers (social bots, AI
 *    crawlers, Google's deferred rendering queue) can read the real content
 *    from the initial HTML response.
 *
 *    Because main.tsx uses createRoot (not hydrateRoot), React replaces
 *    whatever is in #root on client load — no hydration-mismatch concerns.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist", "public");
const indexPath = path.join(distDir, "index.html");

const SITE_NAME = "Albany Capital Region Lions Club";
const SITE_URL = "https://albanylionsclub.org";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

// ── Static route metadata ────────────────────────────────────────────────────

/** @type {Record<string, { title: string; description: string; ogType?: string }>} */
const staticRoutes = {
  "/": {
    title: SITE_NAME,
    description:
      "The Albany Capital Region Lions Club serves Albany and Schenectady through vision care, hunger relief, youth programs, and community service. Join us — We Serve, We Lead, We Impact.",
  },
  "/about": {
    title: `About Us | ${SITE_NAME}`,
    description:
      "Learn about the Albany Capital Region Lions Club — our mission, vision, history, and commitment to serving the Albany and Schenectady communities as part of Lions Clubs International.",
  },
  "/leadership": {
    title: `Leadership | ${SITE_NAME}`,
    description:
      "Meet the officers, directors, and members leading the Albany Capital Region Lions Club. Our dedicated leadership team drives our service programs across Albany and Schenectady.",
  },
  "/events": {
    title: `Events & Programs | ${SITE_NAME}`,
    description:
      "Upcoming events and programs from the Albany Capital Region Lions Club. Join us for community service projects, fundraisers, and social gatherings in Albany and Schenectady.",
  },
  "/blog": {
    title: `Club Blog | ${SITE_NAME}`,
    description:
      "News, stories, and updates from the Albany Capital Region Lions Club. Read about our community service events, member spotlights, and club announcements.",
  },
  "/calendar": {
    title: `Event Calendar | ${SITE_NAME}`,
    description:
      "Browse the Albany Capital Region Lions Club event calendar. Find upcoming meetings, service projects, and community events in the Albany and Schenectady area.",
  },
  "/magazine": {
    title: `Club Magazine | ${SITE_NAME}`,
    description:
      "Read the Albany Capital Region Lions Club magazine. Featuring club news, member stories, community impact reports, and highlights from our service programs.",
  },
  "/projects": {
    title: `Community Projects | ${SITE_NAME}`,
    description:
      "Explore community service projects led by the Albany Capital Region Lions Club — vision care, hunger relief, youth programs, environmental initiatives, and more.",
  },
  "/sponsors": {
    title: `Sponsors & Partnerships | ${SITE_NAME}`,
    description:
      "Support the Albany Capital Region Lions Club as a sponsor. View our 2026 sponsorship packages — Platinum, Gold, Silver, Bronze, and Friend — and partner with us to serve our community.",
  },
  "/gallery": {
    title: `Photo Gallery | ${SITE_NAME}`,
    description:
      "Photo gallery from Albany Capital Region Lions Club events — charter night, community service projects, Eid celebrations, fundraisers, and more moments from our club community.",
  },
  "/donate": {
    title: `Donate & Support | ${SITE_NAME}`,
    description:
      "Support the Albany Capital Region Lions Club with a tax-deductible donation. Your gift funds vision care, hunger relief, youth programs, and community service in Albany and Schenectady.",
  },
  "/contact": {
    title: `Contact Us | ${SITE_NAME}`,
    description:
      "Get in touch with the Albany Capital Region Lions Club. Whether you want to join, volunteer, donate, or partner with us — we'd love to hear from you.",
  },
  "/sponsors/magazine-advertisers-2026": {
    title: `Magazine Advertisers 2026 | ${SITE_NAME}`,
    description:
      "Advertisers featured in the 2026 Albany Capital Region Lions Club magazine. Thank you to our business partners for their support of our community service mission.",
  },
};

const CAUSE_LABELS = {
  sight: "Vision Care",
  hunger: "Hunger Relief",
  youth: "Youth Programs",
  environment: "Environment",
  diabetes: "Diabetes Awareness",
  disaster_relief: "Disaster Relief",
  community: "Community Service",
};

// ── HTML helpers ─────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Inject route-specific metadata into an HTML string.
 *
 * Strategy: remove any existing description/og/twitter/canonical tags that
 * may or may not be present in the built HTML, then insert a fresh, complete
 * set before </head>. This is more robust than regex-replacing existing tags
 * because the Vite build output may not include all static tags from the
 * source index.html.
 */
function injectMeta(html, { title, description, canonicalUrl, ogImage, ogType = "website", bodyHtml, jsonLd }) {
  const img = ogImage || OG_IMAGE;
  let out = html;

  // 1. Replace <title>
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(title)}</title>`);

  // 2. Strip any existing description / og:* / twitter:* / canonical tags
  out = out.replace(/[ \t]*<meta name="description"[^>]*>\n?/g, "");
  out = out.replace(/[ \t]*<meta property="og:[^>]*>\n?/g, "");
  out = out.replace(/[ \t]*<meta name="twitter:[^>]*>\n?/g, "");
  out = out.replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, "");
  out = out.replace(/[ \t]*<!-- Open Graph -->\n?/g, "");
  out = out.replace(/[ \t]*<!-- Twitter Card -->\n?/g, "");

  // 3. Build metadata block
  const metaBlock = [
    `    <meta name="description" content="${escAttr(description)}" />`,
    `    <!-- Open Graph -->`,
    `    <meta property="og:type" content="${escAttr(ogType)}" />`,
    `    <meta property="og:site_name" content="Albany Capital Region Lions Club" />`,
    `    <meta property="og:title" content="${escAttr(title)}" />`,
    `    <meta property="og:description" content="${escAttr(description)}" />`,
    `    <meta property="og:image" content="${escAttr(img)}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:url" content="${escAttr(canonicalUrl)}" />`,
    `    <!-- Twitter Card -->`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escAttr(title)}" />`,
    `    <meta name="twitter:description" content="${escAttr(description)}" />`,
    `    <meta name="twitter:image" content="${escAttr(img)}" />`,
    `    <link rel="canonical" href="${escAttr(canonicalUrl)}" />`,
  ];

  // 4. Append structured data JSON-LD if provided
  if (jsonLd) {
    metaBlock.push(
      `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    );
  }

  out = out.replace("</head>", `${metaBlock.join("\n")}\n  </head>`);

  // 5. Inject body content into <div id="root"> if provided.
  //    main.tsx uses createRoot (not hydrateRoot), so React fully replaces
  //    this on client load — no hydration mismatch.  Non-JS crawlers read
  //    the prerendered body text from the initial HTTP response.
  if (bodyHtml) {
    out = out.replace(
      '<div id="root"></div>',
      `<div id="root">${bodyHtml}</div>`,
    );
  }

  return out;
}

function writeRouteFile(route, html) {
  if (route === "/") {
    fs.writeFileSync(indexPath, html, "utf-8");
    console.log(`  [ok] / → index.html`);
  } else {
    const parts = route.split("/").filter(Boolean);
    const routeDir = path.join(distDir, ...parts);
    fs.mkdirSync(routeDir, { recursive: true });
    const outPath = path.join(routeDir, "index.html");
    fs.writeFileSync(outPath, html, "utf-8");
    console.log(`  [ok] ${route} → ${parts.join("/")}/index.html`);
  }
}

// ── Body content builders ────────────────────────────────────────────────────

/**
 * Build crawler-visible body HTML for a blog post.
 * The markup is intentionally minimal — styled HTML is not needed because
 * crawlers only care about the text content.  Semantic elements (h1, p,
 * article) help search engines understand structure.
 */
function buildBlogPostBody(post) {
  const dateStr = formatDate(post.publishedAt);
  const contentParas = (post.content || "")
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => `<p>${escHtml(p.trim())}</p>`)
    .join("\n");

  const tagsHtml =
    Array.isArray(post.tags) && post.tags.length > 0
      ? `<div><strong>Tags:</strong> ${post.tags.map(escHtml).join(", ")}</div>`
      : "";

  return `
<article style="max-width:800px;margin:0 auto;padding:2rem 1rem;font-family:sans-serif">
  <nav><a href="/blog">← Back to Blog</a></nav>
  ${post.category ? `<div><strong>${escHtml(post.category)}</strong></div>` : ""}
  ${dateStr ? `<time datetime="${escAttr(post.publishedAt || "")}">${escHtml(dateStr)}</time>` : ""}
  <h1>${escHtml(post.title)}</h1>
  ${post.authorName ? `<p>By <strong>${escHtml(post.authorName)}</strong></p>` : ""}
  ${post.excerpt ? `<blockquote><p>${escHtml(post.excerpt)}</p></blockquote>` : ""}
  <section>
    ${contentParas}
  </section>
  ${tagsHtml}
</article>`;
}

/**
 * Build crawler-visible body HTML for a project page.
 */
function buildProjectBody(proj) {
  const causeLabel = CAUSE_LABELS[proj.causeArea] ?? proj.causeArea ?? "Community Service";
  const dateStr = proj.projectDate ? formatDate(proj.projectDate + "T00:00:00") : "";

  const metrics = proj.impactMetrics;
  const metricsHtml =
    metrics && typeof metrics === "object" && Object.keys(metrics).length > 0
      ? `<section>
        <h2>Impact</h2>
        <ul>
          ${metrics.peopleServed ? `<li>${escHtml(String(metrics.peopleServed))} people served</li>` : ""}
          ${metrics.hoursVolunteered ? `<li>${escHtml(String(metrics.hoursVolunteered))} volunteer hours</li>` : ""}
          ${metrics.fundsRaised ? `<li>$${escHtml(String(metrics.fundsRaised))} raised</li>` : ""}
          ${metrics.itemsCollected ? `<li>${escHtml(String(metrics.itemsCollected))} items collected</li>` : ""}
        </ul>
      </section>`
      : "";

  const partnersHtml =
    Array.isArray(proj.partnerOrgs) && proj.partnerOrgs.length > 0
      ? `<section>
        <h2>Partner Organizations</h2>
        <ul>${proj.partnerOrgs.map((o) => `<li>${escHtml(o)}</li>`).join("")}</ul>
      </section>`
      : "";

  return `
<article style="max-width:800px;margin:0 auto;padding:2rem 1rem;font-family:sans-serif">
  <nav><a href="/projects">← Back to Projects</a></nav>
  <div><strong>${escHtml(causeLabel)}</strong></div>
  <h1>${escHtml(proj.title)}</h1>
  ${dateStr ? `<time datetime="${escAttr(proj.projectDate || "")}">${escHtml(dateStr)}</time>` : ""}
  ${proj.description ? `<section><p>${escHtml(proj.description)}</p></section>` : ""}
  ${metricsHtml}
  ${partnersHtml}
</article>`;
}

// ── Database helpers ─────────────────────────────────────────────────────────

/**
 * Fetch published blog posts for prerendering.
 * Includes content, author, tags, and dates needed for body generation.
 */
async function fetchBlogPosts(pool) {
  const { rows } = await pool.query(
    `SELECT slug, title, excerpt, content, cover_image_url AS "coverImageUrl",
            category, author_name AS "authorName", tags,
            published_at AS "publishedAt"
     FROM blog_posts
     WHERE published = true AND status = 'published' AND deleted_at IS NULL
     ORDER BY published_at DESC`,
  );
  return rows;
}

/**
 * Fetch published projects for prerendering.
 * Includes description, impact metrics, partner orgs, and gallery.
 */
async function fetchProjects(pool) {
  const { rows } = await pool.query(
    `SELECT slug, title, description, gallery, cause_area AS "causeArea",
            project_date AS "projectDate",
            impact_metrics AS "impactMetrics",
            partner_orgs AS "partnerOrgs"
     FROM projects
     WHERE status = 'published' AND deleted_at IS NULL
     ORDER BY created_at DESC`,
  );
  return rows;
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!fs.existsSync(indexPath)) {
  console.error(`[prerender-meta] dist/public/index.html not found at ${indexPath}`);
  console.error("[prerender-meta] Run vite build before this script.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, "utf-8");
let count = 0;

// 1. Static routes — metadata only (body content is in the React bundle)
console.log("\n[prerender-meta] Static routes:");
for (const [route, meta] of Object.entries(staticRoutes)) {
  const canonicalUrl = `${SITE_URL}${route}`;
  const html = injectMeta(baseHtml, {
    title: meta.title,
    description: meta.description,
    canonicalUrl,
    ogType: meta.ogType ?? "website",
  });
  writeRouteFile(route, html);
  count++;
}

// 2. Dynamic routes from the database
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.warn(
    "\n[prerender-meta] DATABASE_URL not set — skipping dynamic route prerender.",
  );
  console.warn(
    "[prerender-meta] Set DATABASE_URL at build time to prerender /blog/:slug and /projects/:slug pages.",
  );
} else {
  const pool = new Pool({ connectionString: dbUrl });
  try {
    // Blog posts
    console.log("\n[prerender-meta] Blog posts:");
    let blogCount = 0;
    try {
      const posts = await fetchBlogPosts(pool);
      for (const post of posts) {
        const slug = post.slug;
        const title = `${post.title} | ${SITE_NAME}`;
        const description =
          post.excerpt ||
          `Read "${post.title}" on the Albany Capital Region Lions Club blog — news, stories, and updates from our community.`;
        const ogImage = post.coverImageUrl || OG_IMAGE;
        const canonicalUrl = `${SITE_URL}/blog/${slug}`;

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": description,
          "image": ogImage,
          "url": canonicalUrl,
          "datePublished": post.publishedAt || undefined,
          "author": post.authorName
            ? { "@type": "Person", "name": post.authorName }
            : { "@type": "Organization", "name": SITE_NAME },
          "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": { "@type": "ImageObject", "url": OG_IMAGE },
          },
        };

        const bodyHtml = buildBlogPostBody(post);

        const html = injectMeta(baseHtml, {
          title,
          description,
          canonicalUrl,
          ogImage,
          ogType: "article",
          bodyHtml,
          jsonLd,
        });
        writeRouteFile(`/blog/${slug}`, html);
        count++;
        blogCount++;
      }
      if (blogCount === 0) {
        console.log("  (no published posts found)");
      }
    } catch (err) {
      console.warn(`  [warn] Could not fetch blog posts: ${err.message}`);
    }

    // Projects
    console.log("\n[prerender-meta] Projects:");
    let projCount = 0;
    try {
      const projs = await fetchProjects(pool);
      for (const proj of projs) {
        const slug = proj.slug;
        const causeLabel = CAUSE_LABELS[proj.causeArea] ?? "community service";
        const title = `${proj.title} | ${SITE_NAME}`;
        const description =
          proj.description ||
          `Learn about "${proj.title}" — a ${causeLabel} project by the Albany Capital Region Lions Club.`;
        const gallery = proj.gallery;
        const ogImage =
          (Array.isArray(gallery) && gallery[0]?.url) ? gallery[0].url : OG_IMAGE;
        const canonicalUrl = `${SITE_URL}/projects/${slug}`;

        const bodyHtml = buildProjectBody(proj);

        const html = injectMeta(baseHtml, {
          title,
          description,
          canonicalUrl,
          ogImage,
          bodyHtml,
        });
        writeRouteFile(`/projects/${slug}`, html);
        count++;
        projCount++;
      }
      if (projCount === 0) {
        console.log("  (no published projects found)");
      }
    } catch (err) {
      console.warn(`  [warn] Could not fetch projects: ${err.message}`);
    }
  } finally {
    await pool.end();
  }
}

console.log(`\n[prerender-meta] Done — ${count} HTML files generated.\n`);
