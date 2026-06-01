import { eq, isNull, and } from "drizzle-orm";
import { db } from "..";
import { pages } from "../schema";
import type { InsertPage } from "../schema/pages";

export async function getAllPages() {
  return db.select().from(pages)
    .where(isNull(pages.deletedAt))
    .orderBy(pages.slug);
}

export async function getPublishedPages() {
  return db.select().from(pages)
    .where(and(eq(pages.status, "published"), isNull(pages.deletedAt)))
    .orderBy(pages.slug);
}

export async function getPageBySlug(slug: string) {
  const [row] = await db.select().from(pages)
    .where(and(eq(pages.slug, slug), isNull(pages.deletedAt)));
  return row ?? null;
}

export async function createPage(data: InsertPage) {
  const [row] = await db.insert(pages).values(data).returning();
  return row;
}

export async function updatePage(id: number, data: Partial<InsertPage>) {
  const [row] = await db.update(pages)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(pages.id, id), isNull(pages.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeletePage(id: number) {
  await db.update(pages)
    .set({ deletedAt: new Date() })
    .where(eq(pages.id, id));
}
