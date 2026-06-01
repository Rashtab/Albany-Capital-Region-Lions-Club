import { Router } from "express";
import { getActiveSponsors } from "@workspace/db";

const router = Router();

router.get("/sponsors", async (req, res) => {
  try {
    const rows = await getActiveSponsors();
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch sponsors");
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

export default router;
