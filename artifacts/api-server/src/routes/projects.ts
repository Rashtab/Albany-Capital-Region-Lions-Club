import { Router } from "express";
import { getPublishedProjects, getProjectBySlug } from "@workspace/db";

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

router.get("/projects/:slug", async (req, res) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project || project.status !== "published") {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch project");
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

export default router;
