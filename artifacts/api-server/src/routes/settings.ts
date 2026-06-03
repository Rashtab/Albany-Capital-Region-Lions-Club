import { Router } from "express";
import { getSettings, setSetting } from "@workspace/db";
import { requireMemberAdmin, requirePermission } from "../middlewares/requireMemberAdmin.js";

const router = Router();

const DEFAULTS: Record<string, string> = {
  mission_statement:
    "To empower volunteers to serve their communities, meet humanitarian needs, encourage peace and promote international understanding through Lions Clubs.",
  club_description:
    "The Albany Capital Region Lions Club is a newly chartered chapter of Lions Clubs International, proudly serving the greater Albany and Schenectady area of New York's Capital Region. Our diverse, passionate members come together under the banner of \u2018We Serve\u2019 to make a lasting difference \u2014 from vision care and youth programs to hunger relief and community development.",
  club_vision: "To be the global leader in community and humanitarian service.",
  contact_email: "lionsclubalbanycapitalregion@gmail.com",
  contact_phone: "845.216.5523",
  hero_headline: "Albany Capital Region Lions Club",
  hero_subtext: "We Serve \u2022 We Lead \u2022 We Impact",
  meeting_location: "3311 East Lydius St, Schenectady, NY 12303",
  meeting_schedule: "Every 2nd Saturday at 10:00 AM",
  club_founded: "2026",
  district: "District 20-R2, New York",
  member_count: "25+",
  facebook_url: "https://www.facebook.com/albanycapitalregionlionsclub",
  instagram_url: "https://www.instagram.com/albanycapitalregionlionsclub/",
  donate_url: "",
  join_form_url: "",
};

const PUBLIC_KEYS = Object.keys(DEFAULTS);

// ── GET /api/site-settings — public (unchanged) ─────────────────
router.get("/site-settings", async (req, res) => {
  try {
    const raw = await getSettings(PUBLIC_KEYS);
    const result: Record<string, string> = {};
    for (const key of PUBLIC_KEYS) {
      result[key] = raw[key] ?? DEFAULTS[key] ?? "";
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch site settings");
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// ── GET /api/admin/site-settings — admin read ───────────────────
// Returns effective values (DB value if set, DEFAULTS fallback if null)
// for all known PUBLIC_KEYS. Also returns the DEFAULTS map so the
// client can detect which fields are using fallbacks vs explicit values.
router.get(
  "/admin/site-settings",
  requireMemberAdmin,
  requirePermission("settings"),
  async (req, res) => {
    try {
      const raw = await getSettings(PUBLIC_KEYS);
      const values: Record<string, string> = {};
      const usingDefault: Record<string, boolean> = {};

      for (const key of PUBLIC_KEYS) {
        if (raw[key] !== null) {
          values[key] = raw[key] as string;
          usingDefault[key] = false;
        } else {
          values[key] = DEFAULTS[key] ?? "";
          usingDefault[key] = true;
        }
      }

      res.json({ values, defaults: DEFAULTS, usingDefault });
    } catch (err) {
      req.log.error({ err }, "Failed to fetch admin site settings");
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  },
);

// ── PUT /api/admin/site-settings — upsert settings ─────────────
// Body: { key: value, ... } — all keys must be in PUBLIC_KEYS.
// Blank string is a valid deliberate value (saves "" to DB, overrides DEFAULTS).
// Unknown keys are rejected to prevent orphan settings.
router.put(
  "/admin/site-settings",
  requireMemberAdmin,
  requirePermission("settings"),
  async (req, res) => {
    const body = req.body as Record<string, unknown>;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      res.status(400).json({ error: "Body must be a JSON object of key/value pairs" });
      return;
    }

    const submitted = Object.keys(body);
    if (submitted.length === 0) {
      res.status(400).json({ error: "No settings provided" });
      return;
    }

    // Reject unknown keys
    const unknown = submitted.filter((k) => !PUBLIC_KEYS.includes(k));
    if (unknown.length > 0) {
      res.status(400).json({
        error: `Unknown setting key${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}`,
      });
      return;
    }

    // Validate all values are strings
    for (const [key, val] of Object.entries(body)) {
      if (typeof val !== "string") {
        res.status(400).json({ error: `Value for "${key}" must be a string` });
        return;
      }
    }

    try {
      for (const [key, val] of Object.entries(body)) {
        await setSetting(key, val as string);
      }
      res.json({ success: true, updated: submitted });
    } catch (err) {
      req.log.error({ err }, "Failed to update site settings");
      res.status(500).json({ error: "Failed to save settings" });
    }
  },
);

export { requireMemberAdmin, requirePermission };
export default router;
