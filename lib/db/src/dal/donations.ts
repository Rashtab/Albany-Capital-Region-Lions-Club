import { eq, sum, count, desc } from "drizzle-orm";
import { db } from "..";
import { donations } from "../schema";
import type { InsertDonation } from "../schema/donations";

export async function getAllDonations(status?: string) {
  if (status) {
    return db.select().from(donations)
      .where(eq(donations.status, status))
      .orderBy(desc(donations.createdAt));
  }
  return db.select().from(donations).orderBy(desc(donations.createdAt));
}

export async function getDonationById(id: number) {
  const [row] = await db.select().from(donations).where(eq(donations.id, id));
  return row ?? null;
}

export async function createDonation(data: InsertDonation) {
  const [row] = await db.insert(donations).values(data).returning();
  return row;
}

export async function updateDonationStatus(
  id: number,
  status: string,
  transactionId?: string,
) {
  const [row] = await db.update(donations)
    .set({ status, ...(transactionId ? { transactionId } : {}) })
    .where(eq(donations.id, id))
    .returning();
  return row ?? null;
}

export async function getDonationStats() {
  const [row] = await db
    .select({ total: sum(donations.amount), count: count() })
    .from(donations)
    .where(eq(donations.status, "completed"));
  return row ?? { total: "0", count: 0 };
}
