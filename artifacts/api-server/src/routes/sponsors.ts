import { Router } from "express";
import { getActiveSponsors } from "@workspace/db";
import { requireMemberAdmin, requirePermission } from "../middlewares/requireMemberAdmin.js";

const router = Router();

// GET /api/sponsors — public
router.get("/sponsors", async (req, res) => {
  try {
    const rows = await getActiveSponsors();
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch sponsors");
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

// Future write routes for sponsors will use requirePermission("sponsors")
// Placeholder kept here for consistency; no write endpoints exist yet.
export { requireMemberAdmin, requirePermission };

export default router;
