import {
  pgTable, serial, text, timestamp, jsonb, date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const CAUSE_AREAS = [
  "sight",
  "hunger",
  "youth",
  "environment",
  "diabetes",
  "disaster_relief",
  "community",
] as const;
export type CauseArea = (typeof CAUSE_AREAS)[number];

export interface ImpactMetrics {
  peopleServed?: number;
  hoursVolunteered?: number;
  fundsRaised?: number;
  itemsCollected?: number;
  [key: string]: number | undefined;
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  causeArea: text("cause_area").notNull(),
  description: text("description"),
  projectDate: date("project_date"),
  impactMetrics: jsonb("impact_metrics").$type<ImpactMetrics>(),
  partnerOrgs: text("partner_orgs").array(),
  gallery: jsonb("gallery").$type<GalleryImage[]>(),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
