import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middlewares/requireAdmin.js";
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

router.post("/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const isPdf = req.file.mimetype === "application/pdf";
  const url = `/api/uploads/${isPdf ? "pdfs" : "images"}/${req.file.filename}`;
  logger.info({ filename: req.file.filename }, "File uploaded");
  res.json({ url, filename: req.file.filename, mimetype: req.file.mimetype });
});

export default router;
