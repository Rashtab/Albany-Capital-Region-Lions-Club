import { Router } from "express";
import {
  getActiveSponsors,
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  softDeleteSponsor,
} from "@workspace/db";
import { requireMemberAdmin, requirePermission } from "../middlewares/requireMemberAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/sponsors — active sponsors only, public
router.get("/sponsors", async (req, res) => {
  try {
    const rows = await getActiveSponsors();
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch sponsors");
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

// GET /api/sponsors/all — all (incl. inactive), admin
router.get(
  "/sponsors/all",
  requireMemberAdmin,
  requirePermission("sponsors"),
  async (_req, res) => {
    try {
      const rows = await getAllSponsors();
      res.json(rows);
    } catch (err) {
      logger.error({ err }, "Get all sponsors error");
      res.status(500).json({ error: "Failed to fetch sponsors" });
    }
  },
);

// POST /api/sponsors — create, admin
router.post(
  "/sponsors",
  requireMemberAdmin,
  requirePermission("sponsors"),
  async (req, res) => {
    try {
      const {
        name, tier, logoUrl, website,
        contactName, contactEmail, contactPhone,
        sortOrder, status,
      } = req.body as Record<string, unknown>;

      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "name is required" });
        return;
      }

      const row = await createSponsor({
        name: String(name),
        tier: typeof tier === "string" ? tier : "bronze",
        logoUrl: typeof logoUrl === "string" && logoUrl ? logoUrl : null,
        website: typeof website === "string" && website ? website : null,
        contactName: typeof contactName === "string" && contactName ? contactName : null,
        contactEmail: typeof contactEmail === "string" && contactEmail ? contactEmail : null,
        contactPhone: typeof contactPhone === "string" && contactPhone ? contactPhone : null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        status: typeof status === "string" ? status : "active",
      });
      res.status(201).json(row);
    } catch (err) {
      logger.error({ err }, "Create sponsor error");
      res.status(500).json({ error: "Failed to create sponsor" });
    }
  },
);

// PUT /api/sponsors/:id — update, admin
router.put(
  "/sponsors/:id",
  requireMemberAdmin,
  requirePermission("sponsors"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existing = await getSponsorById(id);
      if (!existing) { res.status(404).json({ error: "Sponsor not found" }); return; }

      const {
        name, tier, logoUrl, website,
        contactName, contactEmail, contactPhone,
        sortOrder, status,
      } = req.body as Record<string, unknown>;

      const updated = await updateSponsor(id, {
        ...(typeof name === "string" && name ? { name } : {}),
        ...(typeof tier === "string" ? { tier } : {}),
        ...(logoUrl !== undefined ? { logoUrl: typeof logoUrl === "string" && logoUrl ? logoUrl : null } : {}),
        ...(website !== undefined ? { website: typeof website === "string" && website ? website : null } : {}),
        ...(contactName !== undefined ? { contactName: typeof contactName === "string" && contactName ? contactName : null } : {}),
        ...(contactEmail !== undefined ? { contactEmail: typeof contactEmail === "string" && contactEmail ? contactEmail : null } : {}),
        ...(contactPhone !== undefined ? { contactPhone: typeof contactPhone === "string" && contactPhone ? contactPhone : null } : {}),
        ...(typeof sortOrder === "number" ? { sortOrder } : {}),
        ...(typeof status === "string" ? { status } : {}),
      });
      res.json(updated);
    } catch (err) {
      logger.error({ err }, "Update sponsor error");
      res.status(500).json({ error: "Failed to update sponsor" });
    }
  },
);

// DELETE /api/sponsors/:id — soft delete, admin
router.delete(
  "/sponsors/:id",
  requireMemberAdmin,
  requirePermission("sponsors"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existing = await getSponsorById(id);
      if (!existing) { res.status(404).json({ error: "Sponsor not found" }); return; }
      await softDeleteSponsor(id);
      res.json({ success: true });
    } catch (err) {
      logger.error({ err }, "Delete sponsor error");
      res.status(500).json({ error: "Failed to delete sponsor" });
    }
  },
);

export default router;
