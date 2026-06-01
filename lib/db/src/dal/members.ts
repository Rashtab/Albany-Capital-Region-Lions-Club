import { eq, isNull, and, asc } from "drizzle-orm";
import { db } from "..";
import { members } from "../schema";
import type { InsertMember } from "../schema/members";

export async function getAllMembers() {
  return db.select().from(members)
    .where(isNull(members.deletedAt))
    .orderBy(asc(members.name));
}

export async function getVisibleMembers() {
  return db.select().from(members)
    .where(and(
      eq(members.isVisible, true),
      eq(members.status, "active"),
      isNull(members.deletedAt),
    ))
    .orderBy(asc(members.role), asc(members.name));
}

export async function getMemberById(id: number) {
  const [row] = await db.select().from(members)
    .where(and(eq(members.id, id), isNull(members.deletedAt)));
  return row ?? null;
}

export async function getMemberByEmail(email: string) {
  const [row] = await db.select().from(members)
    .where(and(eq(members.email, email), isNull(members.deletedAt)));
  return row ?? null;
}

export async function createMember(data: InsertMember) {
  const [row] = await db.insert(members).values(data).returning();
  return row;
}

export async function updateMember(id: number, data: Partial<InsertMember>) {
  const [row] = await db.update(members)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(members.id, id), isNull(members.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeleteMember(id: number) {
  await db.update(members)
    .set({ deletedAt: new Date(), status: "inactive" })
    .where(eq(members.id, id));
}
