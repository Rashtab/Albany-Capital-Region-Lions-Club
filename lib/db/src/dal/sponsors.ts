import { eq, isNull, and, asc } from "drizzle-orm";
import { db } from "..";
import { sponsors } from "../schema";
import type { InsertSponsor } from "../schema/sponsors";

export async function getAllSponsors() {
  return db.select().from(sponsors)
    .where(isNull(sponsors.deletedAt))
    .orderBy(asc(sponsors.tier), asc(sponsors.sortOrder), asc(sponsors.name));
}

export async function getActiveSponsors() {
  return db.select().from(sponsors)
    .where(and(eq(sponsors.status, "active"), isNull(sponsors.deletedAt)))
    .orderBy(asc(sponsors.tier), asc(sponsors.sortOrder), asc(sponsors.name));
}

export async function getSponsorById(id: number) {
  const [row] = await db.select().from(sponsors)
    .where(and(eq(sponsors.id, id), isNull(sponsors.deletedAt)));
  return row ?? null;
}

export async function createSponsor(data: InsertSponsor) {
  const [row] = await db.insert(sponsors).values(data).returning();
  return row;
}

export async function updateSponsor(id: number, data: Partial<InsertSponsor>) {
  const [row] = await db.update(sponsors)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(sponsors.id, id), isNull(sponsors.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeleteSponsor(id: number) {
  await db.update(sponsors)
    .set({ deletedAt: new Date(), status: "inactive" })
    .where(eq(sponsors.id, id));
}
