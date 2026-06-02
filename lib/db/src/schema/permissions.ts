import {
  pgTable, serial, text, boolean, integer, timestamp,
} from "drizzle-orm/pg-core";
import { members } from "./members";

export const ALL_PERMISSIONS = [
  "content",
  "projects",
  "events",
  "members",
  "sponsors",
  "donations",
  "documents",
  "settings",
  "access_control",
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number] | "*";

// Role → permission rows (editable at runtime, not hardcoded)
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  permission: text("permission").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type RolePermission = typeof rolePermissions.$inferSelect;

// Per-member overrides: granted=true adds, granted=false revokes
export const memberPermissions = pgTable("member_permissions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id),
  permission: text("permission").notNull(),
  granted: boolean("granted").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type MemberPermission = typeof memberPermissions.$inferSelect;
