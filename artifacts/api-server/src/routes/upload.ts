import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf";
    const dir = isPdf
      ? "artifacts/albany-lions/public/uploads/pdfs"
      : "artifacts/albany-lions/public/uploads/images";
    cb(null, dir);
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

// POST /api/upload — upload a file (admin only)
router.post("/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const isPdf = req.file.mimetype === "application/pdf";
  const subPath = isPdf ? "uploads/pdfs" : "uploads/images";
  const url = `/${subPath}/${req.file.filename}`;
  logger.info({ filename: req.file.filename }, "File uploaded");
  res.json({ url, filename: req.file.filename, mimetype: req.file.mimetype });
});

export default router;
