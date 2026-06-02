import { Router } from "express";
import { db, calendarEvents } from "@workspace/db";
import { eq, asc, and, isNull } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { logger } from "../lib/logger.js";

const router = Router();

// GET /api/calendar — non-deleted events (public)
// Guard: deleted_at IS NULL
router.get("/calendar", async (_req, res) => {
  try {
    const events = await db
      .select()
      .from(calendarEvents)
      .where(isNull(calendarEvents.deletedAt))
      .orderBy(asc(calendarEvents.eventDate));
    res.json(events);
  } catch (err) {
    logger.error({ err }, "Get calendar events error");
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST /api/calendar (admin)
router.post("/calendar", requireAdmin, async (req, res) => {
  try {
    const { title, description, eventDate, eventTime, location, category, registrationLink, posterUrl } = req.body;
    if (!title || !eventDate) {
      res.status(400).json({ error: "title and eventDate are required" });
      return;
    }
    const [event] = await db.insert(calendarEvents).values({
      title, description, eventDate, eventTime, location, category, registrationLink, posterUrl,
    }).returning();
    res.status(201).json(event);
  } catch (err) {
    logger.error({ err }, "Create calendar event error");
    res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /api/calendar/:id (admin)
router.put("/calendar/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, eventDate, eventTime, location, category, registrationLink, posterUrl } = req.body;
    const [event] = await db
      .update(calendarEvents)
      .set({ title, description, eventDate, eventTime, location, category, registrationLink, posterUrl })
      .where(and(eq(calendarEvents.id, id), isNull(calendarEvents.deletedAt)))
      .returning();
    if (!event) { res.status(404).json({ error: "Event not found" }); return; }
    res.json(event);
  } catch (err) {
    logger.error({ err }, "Update calendar event error");
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/calendar/:id — soft delete (admin)
router.delete("/calendar/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db
      .update(calendarEvents)
      .set({ deletedAt: new Date() })
      .where(and(eq(calendarEvents.id, id), isNull(calendarEvents.deletedAt)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete calendar event error");
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
