import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { members, rolePermissions, siteSettings } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger.js";

const INITIAL_MEMBERS = [
  { name: "Tahmina Sharif Sonia",    email: "tahmina.sonia@albanylionsclub.org", role: "president" },
  { name: "Anika Subah Ahmad Upoma", email: "upoma.ahmed@albanylionsclub.org",   role: "secretary" },
  { name: "Abdus Salam",             email: "abdus.salam@albanylionsclub.org",   role: "treasurer" },
  { name: "Rashtab Mahmud",          email: "rashtab.mahmud@albanylionsclub.org", role: "lcif_coordinator" },
  { name: "Web Administrator",       email: "WebAdmin@albanylionsclub.org",      role: "webmaster" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  webmaster:       ["*"],
  president:       ["content", "projects", "events", "members", "sponsors", "donations", "documents", "settings", "access_control"],
  secretary:       ["content", "events", "members"],
  treasurer:       ["donations", "documents"],
  lcif_coordinator:["donations", "projects", "events"],
  director:        ["content", "events"],
};

const SITE_SETTINGS_DEFAULTS = [
  { key: "hero_headline",    value: "We Serve • We Lead • We Impact" },
  { key: "hero_subtext",     value: "A proud chapter of Lions Clubs International, serving the Albany and Schenectady communities with vision care, hunger relief, and youth programs." },
  { key: "meeting_location", value: "3311 East Lydius St, Schenectady, NY 12303" },
  { key: "meeting_schedule", value: "Third Tuesday of every month at 6:30 PM" },
  { key: "contact_email",    value: "lionsclubalbany@gmail.com" },
  { key: "contact_phone",    value: "845-216-5523" },
  { key: "club_founded",     value: "2026" },
  { key: "district",         value: "20-R2" },
  { key: "member_count",     value: "24" },
  { key: "facebook_url",     value: "https://facebook.com/albanylionsclub" },
  { key: "instagram_url",    value: "https://instagram.com/albanylionsclub" },
  { key: "donate_url",       value: "/donate" },
  { key: "join_form_url",    value: "/contact" },
];

const DEFAULT_PASSWORD = "AlbanyLions@2026";

/**
 * Creates the connect-pg-simple session table if it doesn't exist.
 * Must run before the HTTP server starts so express-session can save sessions.
 * We do this manually because connect-pg-simple's createTableIfMissing reads
 * a bundled table.sql file that esbuild does not copy into dist/.
 */
async function ensureSessionTable(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid"    varchar         NOT NULL COLLATE "default",
      "sess"   json            NOT NULL,
      "expire" timestamp(6)   NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    )
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "user_sessions" ("expire")
  `);
}

export async function seedIfEmpty(): Promise<void> {
  try {
    // Always ensure session table exists (safe to call on every boot)
    await ensureSessionTable();

    const [{ count }] = await db
      .select({ count: sql<string>`count(*)` })
      .from(members);

    if (Number(count) > 0) {
      logger.info({ count: Number(count) }, "Members already exist — skipping startup seed");
      return;
    }

    logger.info("Empty database detected — seeding initial admin members and defaults");
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    for (const m of INITIAL_MEMBERS) {
      await db.insert(members).values({
        name: m.name,
        email: m.email,
        role: m.role,
        passwordHash: hash,
        status: "active",
        isVisible: true,
      }).onConflictDoNothing();
    }

    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      await db.insert(rolePermissions)
        .values(perms.map((p) => ({ role, permission: p })));
    }

    for (const row of SITE_SETTINGS_DEFAULTS) {
      await db.insert(siteSettings)
        .values({ key: row.key, value: row.value, label: row.key, description: "" })
        .onConflictDoNothing();
    }

    logger.info({ count: INITIAL_MEMBERS.length }, "Startup seed complete");
  } catch (err) {
    logger.error({ err }, "Startup seed failed (non-fatal — server will still start)");
  }
}
