import { eq, inArray } from "drizzle-orm";
import { db } from "..";
import { siteSettings } from "../schema";

export async function getSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
  return row?.value ?? null;
}

export async function getSettings(keys: string[]): Promise<Record<string, string | null>> {
  const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, keys));
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(keys.map((k) => [k, map[k] ?? null]));
}

export async function getAllSettings() {
  return db.select().from(siteSettings).orderBy(siteSettings.key);
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

export async function initSettings(
  defaults: Record<string, { value: string; label: string; description?: string }>,
): Promise<void> {
  for (const [key, { value, label, description }] of Object.entries(defaults)) {
    await db
      .insert(siteSettings)
      .values({ key, value, label, description })
      .onConflictDoNothing();
  }
}
