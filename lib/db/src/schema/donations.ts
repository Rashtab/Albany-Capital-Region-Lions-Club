import {
  pgTable, serial, text, boolean, timestamp, numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const FUND_DESIGNATIONS = [
  "general",
  "sight",
  "hunger",
  "youth",
  "environment",
  "diabetes",
  "disaster_relief",
] as const;
export type FundDesignation = (typeof FUND_DESIGNATIONS)[number];

export const DONATION_STATUSES = ["pending", "completed", "refunded", "failed"] as const;
export type DonationStatus = (typeof DONATION_STATUSES)[number];

export const RECURRING_INTERVALS = ["monthly", "quarterly", "annually"] as const;
export type RecurringInterval = (typeof RECURRING_INTERVALS)[number];

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  fundDesignation: text("fund_designation").default("general"),
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  donorPhone: text("donor_phone"),
  isAnonymous: boolean("is_anonymous").default(false),
  isRecurring: boolean("is_recurring").default(false),
  recurringInterval: text("recurring_interval"),
  status: text("status").default("pending"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
