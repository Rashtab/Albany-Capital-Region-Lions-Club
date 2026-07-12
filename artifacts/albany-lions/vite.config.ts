import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import type { Plugin } from "vite";

const rawPort = process.env.PORT;
const isBuild = process.env.npm_lifecycle_event === "build";

const port = rawPort ? Number(rawPort) : 3000;

if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

if (!rawPort && !isBuild) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const basePath = process.env.BASE_PATH ?? "/";

// ── Metadata injection ───────────────────────────────────────────────────────
// Route-specific metadata for the dev-server transformIndexHtml hook.
// This mirrors prerender-meta.mjs so crawlers and social bots get correct
// <title>, <meta name="description">, og:*, and twitter:* tags in the
// initial HTML during development as well as in production (via the prerender
// build step).

const SITE_NAME = "Albany Capital Region Lions Club";
const SITE_URL = "https://albanylionsclub.org";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const staticRouteMeta: Record<string, { title: string; description: string }> = {
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

function escHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escAttr(str: string) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * Inject route-specific metadata into an HTML string.
 *
 * Strategy: remove any existing description/og/twitter/canonical tags that
 * may or may not be present in the source HTML, then insert a fresh complete
 * set before </head>. This avoids silent no-ops when expected tags are absent.
 */
function injectMeta(
  html: string,
  opts: { title: string; description: string; canonicalUrl: string; ogImage?: string; ogType?: string },
): string {
  const { title, description, canonicalUrl, ogImage = OG_IMAGE, ogType = "website" } = opts;
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

  // 3. Insert fresh metadata block before </head>
  const block = [
    `    <meta name="description" content="${escAttr(description)}" />`,
    `    <!-- Open Graph -->`,
    `    <meta property="og:type" content="${escAttr(ogType)}" />`,
    `    <meta property="og:site_name" content="Albany Capital Region Lions Club" />`,
    `    <meta property="og:title" content="${escAttr(title)}" />`,
    `    <meta property="og:description" content="${escAttr(description)}" />`,
    `    <meta property="og:image" content="${escAttr(ogImage)}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:url" content="${escAttr(canonicalUrl)}" />`,
    `    <!-- Twitter Card -->`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escAttr(title)}" />`,
    `    <meta name="twitter:description" content="${escAttr(description)}" />`,
    `    <meta name="twitter:image" content="${escAttr(ogImage)}" />`,
    `    <link rel="canonical" href="${escAttr(canonicalUrl)}" />`,
  ].join("\n");

  out = out.replace("</head>", `${block}\n  </head>`);

  return out;
}

/** Attempt to fetch dynamic metadata for /blog/:slug from the local API. */
async function fetchBlogMeta(
  slug: string,
  apiBase: string,
): Promise<{ title: string; description: string; ogImage?: string } | null> {
  try {
    const res = await fetch(`${apiBase}/api/blog/${slug}`);
    if (!res.ok) return null;
    const post = await res.json() as { title?: string; excerpt?: string; coverImageUrl?: string };
    if (!post?.title) return null;
    return {
      title: `${post.title} | ${SITE_NAME}`,
      description:
        post.excerpt ??
        `Read "${post.title}" on the Albany Capital Region Lions Club blog — news, stories, and updates from our community.`,
      ogImage: post.coverImageUrl ?? undefined,
    };
  } catch {
    return null;
  }
}

/** Attempt to fetch dynamic metadata for /projects/:slug from the local API. */
async function fetchProjectMeta(
  slug: string,
  apiBase: string,
): Promise<{ title: string; description: string; ogImage?: string } | null> {
  try {
    const res = await fetch(`${apiBase}/api/projects/${slug}`);
    if (!res.ok) return null;
    const project = await res.json() as { title?: string; description?: string; gallery?: Array<{ url: string }> };
    if (!project?.title) return null;
    return {
      title: `${project.title} | ${SITE_NAME}`,
      description:
        project.description ??
        `Learn about "${project.title}" — a community service project by the Albany Capital Region Lions Club.`,
      ogImage: project.gallery?.[0]?.url ?? undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Vite plugin that injects route-specific metadata into the HTML served by
 * the dev server. In production the same effect is achieved by the
 * scripts/prerender-meta.mjs build step which generates per-route HTML files.
 */
function metaInjectPlugin(): Plugin {
  return {
    name: "meta-inject",
    apply: "serve",
    transformIndexHtml: {
      order: "pre",
      async handler(html, ctx) {
        const rawUrl = ctx.originalUrl ?? "/";
        // Strip query string and hash; normalise trailing slash
        const urlPath = rawUrl.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

        // 1. Static route exact match
        const staticMeta = staticRouteMeta[urlPath];
        if (staticMeta) {
          return injectMeta(html, {
            ...staticMeta,
            canonicalUrl: `${SITE_URL}${urlPath}`,
          });
        }

        // 2. /blog/:slug — try to fetch from the running API
        const blogMatch = urlPath.match(/^\/blog\/([^/]+)$/);
        if (blogMatch) {
          const slug = blogMatch[1];
          // Derive API base from server address; fall back to localhost
          const apiPort = process.env.API_PORT ?? "8080";
          const apiBase = `http://localhost:${apiPort}`;
          const meta = await fetchBlogMeta(slug, apiBase);
          if (meta) {
            return injectMeta(html, {
              ...meta,
              canonicalUrl: `${SITE_URL}/blog/${slug}`,
              ogType: "article",
            });
          }
          // Fallback for unknown/unpublished posts
          return injectMeta(html, {
            title: `Blog | ${SITE_NAME}`,
            description: "Read news and stories from the Albany Capital Region Lions Club.",
            canonicalUrl: `${SITE_URL}/blog/${slug}`,
            ogType: "article",
          });
        }

        // 3. /projects/:slug — try to fetch from the running API
        const projectMatch = urlPath.match(/^\/projects\/([^/]+)$/);
        if (projectMatch) {
          const slug = projectMatch[1];
          const apiPort = process.env.API_PORT ?? "8080";
          const apiBase = `http://localhost:${apiPort}`;
          const meta = await fetchProjectMeta(slug, apiBase);
          if (meta) {
            return injectMeta(html, {
              ...meta,
              canonicalUrl: `${SITE_URL}/projects/${slug}`,
            });
          }
          return injectMeta(html, {
            title: `Project | ${SITE_NAME}`,
            description: "Discover community service projects by the Albany Capital Region Lions Club.",
            canonicalUrl: `${SITE_URL}/projects/${slug}`,
          });
        }

        // 4. No match — return unchanged (index.html fallback metadata applies)
        return html;
      },
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    metaInjectPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  optimizeDeps: {
    exclude: ["pdfjs-dist"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
