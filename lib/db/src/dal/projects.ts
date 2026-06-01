import { eq, isNull, and, desc } from "drizzle-orm";
import { db } from "..";
import { projects } from "../schema";
import type { InsertProject } from "../schema/projects";

export async function getAllProjects(causeArea?: string) {
  if (causeArea) {
    return db.select().from(projects)
      .where(and(isNull(projects.deletedAt), eq(projects.causeArea, causeArea)))
      .orderBy(desc(projects.projectDate));
  }
  return db.select().from(projects)
    .where(isNull(projects.deletedAt))
    .orderBy(desc(projects.projectDate));
}

export async function getPublishedProjects(causeArea?: string) {
  if (causeArea) {
    return db.select().from(projects)
      .where(and(eq(projects.status, "published"), isNull(projects.deletedAt), eq(projects.causeArea, causeArea)))
      .orderBy(desc(projects.projectDate));
  }
  return db.select().from(projects)
    .where(and(eq(projects.status, "published"), isNull(projects.deletedAt)))
    .orderBy(desc(projects.projectDate));
}

export async function getProjectBySlug(slug: string) {
  const [row] = await db.select().from(projects)
    .where(and(eq(projects.slug, slug), isNull(projects.deletedAt)));
  return row ?? null;
}

export async function createProject(data: InsertProject) {
  const [row] = await db.insert(projects).values(data).returning();
  return row;
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const [row] = await db.update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeleteProject(id: number) {
  await db.update(projects)
    .set({ deletedAt: new Date(), status: "archived" })
    .where(eq(projects.id, id));
}
