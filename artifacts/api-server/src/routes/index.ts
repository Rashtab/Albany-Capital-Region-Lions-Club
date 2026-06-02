import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import contactRouter from "./contact.js";
import memberAuthRouter from "./member-auth.js";
import blogRouter from "./blog.js";
import calendarRouter from "./calendar.js";
import magazinesRouter from "./magazines.js";
import galleryRouter from "./gallery.js";
import uploadRouter from "./upload.js";
import sponsorsRouter from "./sponsors.js";
import settingsRouter from "./settings.js";
import projectsRouter from "./projects.js";
import membersRouter from "./members.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(memberAuthRouter);
router.use(blogRouter);
router.use(calendarRouter);
router.use(magazinesRouter);
router.use(galleryRouter);
router.use(uploadRouter);
router.use(sponsorsRouter);
router.use(settingsRouter);
router.use(projectsRouter);
router.use(membersRouter);

export default router;
