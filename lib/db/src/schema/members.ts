import {
  pgTable, serial, text, boolean, timestamp, date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const MEMBER_ROLES = [
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "webmaster",
  "director",
  "member",
] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const DUES_STATUSES = ["paid", "unpaid", "waived"] as const;
export type DuesStatus = (typeof DUES_STATUSES)[number];

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  role: text("role").default("member"),
  joinDate: date("join_date"),
  duesStatus: text("dues_status").default("unpaid"),
  isVisible: boolean("is_visible").default(true),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  passwordHash: text("password_hash"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
