import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import contactRouter from "./contact.js";
import authRouter from "./auth.js";
import blogRouter from "./blog.js";
import calendarRouter from "./calendar.js";
import magazinesRouter from "./magazines.js";
import galleryRouter from "./gallery.js";
import uploadRouter from "./upload.js";
const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(authRouter);
router.use(blogRouter);
router.use(calendarRouter);
router.use(magazinesRouter);
router.use(galleryRouter);
router.use(uploadRouter);

export default router;
