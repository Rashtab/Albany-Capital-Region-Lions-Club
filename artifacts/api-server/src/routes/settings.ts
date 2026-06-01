import { Router } from "express";
import { getSettings } from "@workspace/db";

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

export default router;
