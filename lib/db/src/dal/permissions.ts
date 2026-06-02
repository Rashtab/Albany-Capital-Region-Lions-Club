import { eq, and } from "drizzle-orm";
import { db } from "..";
import { rolePermissions, memberPermissions } from "../schema/permissions";
import type { Permission } from "../schema/permissions";

// ── Role permissions ───────────────────────────────────────────

export async function getRolePermissions(role: string): Promise<string[]> {
  const rows = await db
    .select({ permission: rolePermissions.permission })
    .from(rolePermissions)
    .where(eq(rolePermissions.role, role));
  return rows.map((r) => r.permission);
}

export async function getAllRolePermissions(): Promise<{ role: string; permission: string }[]> {
  const rows = await db
    .select({ role: rolePermissions.role, permission: rolePermissions.permission })
    .from(rolePermissions);
  return rows;
}

export async function setRolePermissions(role: string, permissions: string[]): Promise<void> {
  await db.delete(rolePermissions).where(eq(rolePermissions.role, role));
  if (permissions.length > 0) {
    await db.insert(rolePermissions).values(
      permissions.map((p) => ({ role, permission: p })),
    );
  }
}

export async function addRolePermission(role: string, permission: string): Promise<void> {
  const existing = await db
    .select()
    .from(rolePermissions)
    .where(and(eq(rolePermissions.role, role), eq(rolePermissions.permission, permission)))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(rolePermissions).values({ role, permission });
  }
}

export async function removeRolePermission(role: string, permission: string): Promise<void> {
  await db
    .delete(rolePermissions)
    .where(and(eq(rolePermissions.role, role), eq(rolePermissions.permission, permission)));
}

// ── Member overrides ───────────────────────────────────────────

export async function getMemberPermissionOverrides(
  memberId: number,
): Promise<{ permission: string; granted: boolean }[]> {
  const rows = await db
    .select({ permission: memberPermissions.permission, granted: memberPermissions.granted })
    .from(memberPermissions)
    .where(eq(memberPermissions.memberId, memberId));
  return rows;
}

export async function getAllMemberPermissionOverrides(): Promise<
  { memberId: number; permission: string; granted: boolean }[]
> {
  const rows = await db
    .select({
      memberId: memberPermissions.memberId,
      permission: memberPermissions.permission,
      granted: memberPermissions.granted,
    })
    .from(memberPermissions);
  return rows;
}

export async function setMemberPermissionOverride(
  memberId: number,
  permission: string,
  granted: boolean,
): Promise<void> {
  const existing = await db
    .select()
    .from(memberPermissions)
    .where(
      and(
        eq(memberPermissions.memberId, memberId),
        eq(memberPermissions.permission, permission),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(memberPermissions)
      .set({ granted, updatedAt: new Date() })
      .where(
        and(
          eq(memberPermissions.memberId, memberId),
          eq(memberPermissions.permission, permission),
        ),
      );
  } else {
    await db.insert(memberPermissions).values({ memberId, permission, granted });
  }
}

export async function removeMemberPermissionOverride(
  memberId: number,
  permission: string,
): Promise<void> {
  await db
    .delete(memberPermissions)
    .where(
      and(
        eq(memberPermissions.memberId, memberId),
        eq(memberPermissions.permission, permission),
      ),
    );
}

// ── Effective permission resolution ───────────────────────────
// Resolves the final permission set for a member:
//   1. Start from their role's permissions in role_permissions
//   2. Apply member_permissions overrides (granted=true adds, granted=false removes)
//   3. If role has '*', member has all permissions (overrides with granted=false still apply)

export async function getEffectivePermissions(
  memberId: number,
  role: string,
): Promise<string[]> {
  const [rolePerms, overrides] = await Promise.all([
    getRolePermissions(role),
    getMemberPermissionOverrides(memberId),
  ]);

  const hasWildcard = rolePerms.includes("*");

  // Start from role set
  const permSet = new Set<string>(hasWildcard ? [] : rolePerms);

  // Apply overrides
  for (const { permission, granted } of overrides) {
    if (granted) {
      permSet.add(permission);
    } else {
      permSet.delete(permission);
    }
  }

  if (hasWildcard) {
    // Wildcard role: signal to caller with '*' present
    // We keep it as '*' so the middleware can fast-path it
    permSet.add("*");
  }

  return Array.from(permSet);
}

// ── Lockout guard ──────────────────────────────────────────────
// Returns true if at least one non-deleted, active member (other than excludeMemberId)
// will retain access_control (or *) after the proposed change.

export async function wouldLoseLastAccessController(
  excludeMemberId?: number,
  excludeRole?: string,
): Promise<boolean> {
  // Get all role_permissions rows that grant access_control or *
  const privilegedRoles = await db
    .select({ role: rolePermissions.role })
    .from(rolePermissions)
    .where(
      // We check in code since OR isn't trivial with drizzle across values
      eq(rolePermissions.permission, "access_control"),
    );
  const wildcardRoles = await db
    .select({ role: rolePermissions.role })
    .from(rolePermissions)
    .where(eq(rolePermissions.permission, "*"));

  const acRoles = new Set([
    ...privilegedRoles.map((r) => r.role),
    ...wildcardRoles.map((r) => r.role),
  ]);

  // If excludeRole is being stripped, remove it from the set temporarily
  if (excludeRole) acRoles.delete(excludeRole);

  // Count active members (not soft-deleted) in those roles,
  // excluding excludeMemberId, who don't have a granted=false override on access_control
  // We do this in application code for clarity
  const { members: membersTable } = await import("../schema/members");
  const { isNull } = await import("drizzle-orm");

  const candidates = await db
    .select({
      id: membersTable.id,
      role: membersTable.role,
    })
    .from(membersTable)
    .where(
      and(
        isNull(membersTable.deletedAt),
        eq(membersTable.status, "active"),
      ),
    );

  for (const candidate of candidates) {
    if (excludeMemberId && candidate.id === excludeMemberId) continue;
    const candidateRole = candidate.role ?? "";
    // Does their role grant access_control or *?
    if (!acRoles.has(candidateRole)) continue;
    // Check if they have a granted=false override stripping it
    const overrides = await getMemberPermissionOverrides(candidate.id);
    const revoked = overrides.some(
      (o) => (o.permission === "access_control" || o.permission === "*") && !o.granted,
    );
    if (!revoked) return false; // found at least one controller — safe
  }

  return true; // no remaining controller found
}

export type { Permission };
