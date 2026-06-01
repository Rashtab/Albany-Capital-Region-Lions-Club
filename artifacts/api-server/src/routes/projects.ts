import { Router } from "express";
import { getPublishedProjects } from "@workspace/db";

const router = Router();

router.get("/projects", async (req, res) => {
  try {
    const causeArea =
      typeof req.query.causeArea === "string" ? req.query.causeArea : undefined;
    const rows = await getPublishedProjects(causeArea);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch projects");
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

export default router;
