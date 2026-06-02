// Session type augmentation reference (must be imported as a module)
import type {} from "express-session";

declare module "express-session" {
  interface SessionData {
    memberId?: number;
    memberEmail?: string;
    memberName?: string;
    memberRole?: string;
  }
}

import type { Request, Response, NextFunction } from "express";

const ALLOWED_ROLES = ["president", "secretary", "treasurer", "webmaster"];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  president: ["all"],
  webmaster: ["all"],
  secretary: ["members", "events", "content"],
  treasurer: ["donations", "sponsors"],
};

function getPermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Requires a valid session for a member with an allowed admin role.
 * Attach to any admin-only route.
 */
export function requireMemberAdmin(req: Request, res: Response, next: NextFunction): void {
  const { memberId, memberRole } = req.session;
  if (!memberId || !ALLOWED_ROLES.includes(memberRole ?? "")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

/**
 * Requires the session member to have a specific permission (or 'all').
 * Use after requireMemberAdmin.
 *
 * Example: router.delete("/...", requireMemberAdmin, requirePermission("content"), handler)
 */
export function requirePermission(permission: string) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const perms = getPermissions(req.session.memberRole ?? "");
    if (!perms.includes("all") && !perms.includes(permission)) {
      res.status(403).json({ error: "Forbidden: insufficient permissions for this action" });
      return;
    }
    next();
  };
}
