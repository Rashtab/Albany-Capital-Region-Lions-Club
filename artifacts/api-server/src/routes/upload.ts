import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireMemberAdmin, requirePermission } from "../middlewares/requireMemberAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const IMAGES_DIR = path.join(UPLOADS_ROOT, "images");
const PDFS_DIR = path.join(UPLOADS_ROOT, "pdfs");

fs.mkdirSync(IMAGES_DIR, { recursive: true });
fs.mkdirSync(PDFS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, file.mimetype === "application/pdf" ? PDFS_DIR : IMAGES_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, "-").toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF and image files are allowed"));
  },
});

// POST /api/upload — content OR documents permission (covers images for blog/gallery and PDFs for docs)
router.post(
  "/upload",
  requireMemberAdmin,
  async (req, res, next) => {
    // Allow if member has content OR documents (checked in sequence to share the handler)
    const { getEffectivePermissions } = await import("@workspace/db");
    const { memberId, memberRole } = req.session;
    if (!memberId || !memberRole) { res.status(401).json({ error: "Unauthorized" }); return; }
    try {
      const perms = await getEffectivePermissions(memberId, memberRole);
      if (perms.includes("*") || perms.includes("content") || perms.includes("documents") || perms.includes("events")) {
        next();
      } else {
        res.status(403).json({ error: "Forbidden: content, documents, or events permission required" });
      }
    } catch {
      res.status(500).json({ error: "Permission check failed" });
    }
  },
  upload.single("file"),
  (req, res) => {
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
    const isPdf = req.file.mimetype === "application/pdf";
    const url = `/api/uploads/${isPdf ? "pdfs" : "images"}/${req.file.filename}`;
    logger.info({ filename: req.file.filename }, "File uploaded");
    res.json({ url, filename: req.file.filename, mimetype: req.file.mimetype });
  },
);

export default router;
