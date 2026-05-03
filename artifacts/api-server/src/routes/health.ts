import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  adminUsers,
  blogPosts,
  calendarEvents,
  magazines,
  galleryItems,
} from "@workspace/db/schema";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/seed", async (req, res) => {
  const SEED_TOKEN = process.env.SEED_SECRET ?? "lions-seed-2026";
  if (req.query.token !== SEED_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const passwordHash = await bcrypt.hash("Lions2026!", 12);

    await db.insert(adminUsers).values({
      name: "Club Admin",
      email: "admin@albanylionsclub.org",
      passwordHash,
      role: "admin",
    }).onConflictDoNothing();

    await db.insert(calendarEvents).values([
      {
        title: "Charter Night & Installation Ceremony",
        description: "You are cordially invited to celebrate the Grand Launch and Chartering Ceremony of the Albany Capital Region Lions Club. Join Lions District 20-R2 for an afternoon of warm camaraderie, elevated inspiration, and the momentous Chartering of our esteemed new Lions Club. Be a part of a historic beginning as we unite to Serve, Inspire, and Impact Lives together. RSVP: President Lion Tahmina Sonia +1 (845) 216-5523",
        eventDate: "2026-05-03",
        eventTime: "1:00 PM – 6:00 PM",
        location: "Holiday Inn Express & Suites, 16 Wolf Rd, Albany, NY 12205",
        category: "Milestone",
        registrationLink: "mailto:lionsclubalbanycapitalregion@gmail.com",
      },
      {
        title: "Club Monthly Meeting",
        description: "Regular monthly meeting for all members. Agenda includes community project updates and new member introductions.",
        eventDate: "2026-05-20",
        eventTime: "7:00 PM",
        location: "Albany Public Library, Albany NY",
        category: "Meeting",
        registrationLink: null,
      },
      {
        title: "Vision Screening Drive",
        description: "Free vision screenings for children and adults in partnership with local optometrists. No appointment needed.",
        eventDate: "2026-06-07",
        eventTime: "10:00 AM",
        location: "Arbor Hill Community Center, Albany NY",
        category: "Health",
        registrationLink: null,
      },
    ]).onConflictDoNothing();

    await db.insert(blogPosts).values([
      {
        title: "Welcome to the Albany Capital Region Lions Club Blog",
        slug: "welcome-to-our-club-blog",
        content: `We are thrilled to announce the launch of the Albany Capital Region Lions Club blog — a place where we will share stories, updates, and highlights from our growing community.\n\nOur club was chartered in 2026 as the newest chapter of Lions Clubs International in the Capital Region of New York. In just our first year, we have welcomed 23 dedicated members who share a passion for service and community impact.\n\nThrough this blog, you can expect regular updates about our service projects, event recaps, member spotlights, and much more. We invite you to follow along as we build something truly special here in Albany.\n\nWe serve. We lead. We improve lives. That is the Lions promise — and it is one we take seriously every day.`,
        excerpt: "Announcing the launch of our club blog, where we will share stories, updates, and highlights from the Albany Capital Region Lions Club community.",
        coverImageUrl: null,
        category: "Announcements",
        published: true,
        publishedAt: new Date("2026-05-03T01:30:01.265Z"),
      },
    ]).onConflictDoNothing();

    await db.insert(magazines).values([
      {
        title: "Charter Night Magazine 2026",
        year: 2026,
        fileUrl: "/magazines/magazine-2026.pdf",
        description: "Inaugural Charter Night magazine documenting the founding of Albany Capital Region Lions Club, featuring member profiles, sponsor ads, and our mission statement.",
        isCurrent: true,
      },
    ]).onConflictDoNothing();

    await db.insert(galleryItems).values([
      {
        title: "Charter Night & Installation Ceremony",
        imageUrl: "/uploads/images/charter-night-poster.png",
        category: "Charter Night",
        eventDate: "2026-05-03",
      },
    ]).onConflictDoNothing();

    return res.json({
      success: true,
      message: "Production database seeded successfully.",
      seeded: { adminUsers: 1, calendarEvents: 3, blogPosts: 1, magazines: 1, galleryItems: 1 },
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
