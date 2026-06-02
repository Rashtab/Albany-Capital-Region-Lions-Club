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
import { getEffectivePermissions } from "@workspace/db";

/**
 * Gate: requires a valid admin session (any role with portal access).
 * Attach before requirePermission on every admin-only route.
 */
export function requireMemberAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.memberId || !req.session.memberRole) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

/**
 * Gate: requires the session member to hold a specific permission.
 * Reads live from role_permissions + member_permissions tables.
 * A holder of the wildcard permission '*' passes every check.
 *
 * Usage:
 *   router.post("/blog", requireMemberAdmin, requirePermission("content"), handler)
 */
export function requirePermission(permission: string) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { memberId, memberRole } = req.session;
    if (!memberId || !memberRole) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const perms = await getEffectivePermissions(memberId, memberRole);
      if (perms.includes("*") || perms.includes(permission)) {
        next();
        return;
      }
      res.status(403).json({
        error: `Forbidden: '${permission}' permission required`,
      });
    } catch (err) {
      req.log.error({ err }, "Permission check failed");
      res.status(500).json({ error: "Permission check failed" });
    }
  };
}
