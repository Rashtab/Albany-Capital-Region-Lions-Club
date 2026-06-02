---
name: Session+RBAC auth system
description: How admin auth works after JWT retirement — session cookies, DB-backed permissions, lockout guard.
---

## Architecture

- **Session**: `express-session` with cookie name `lions_sid`, httpOnly, sameSite:lax, 7-day maxAge. Cookie not marked secure because Replit proxy terminates TLS.
- **Identity**: `members` table (not `admin_users`). Portal roles: president, vice_president, secretary, treasurer, webmaster, lcif_coordinator, director, member.
- **Permissions**: `role_permissions` table (role → permission rows) + `member_permissions` table (per-member granted/revoked overrides). No hardcoded maps.
- **Wildcard**: role with `*` permission passes every `requirePermission` check.

## Key files
- `artifacts/api-server/src/routes/member-auth.ts` — login, me, logout, set-password, permissions API
- `artifacts/api-server/src/middlewares/requireMemberAdmin.ts` — `requireMemberAdmin` + `requirePermission(perm)` middleware
- `lib/db/src/dal/permissions.ts` — `getEffectivePermissions`, `wouldLoseLastAccessController`, all CRUD for both tables
- `artifacts/albany-lions/src/lib/adminAuth.ts` — frontend: `adminFetch`, `adminFetchForm`, `fetchAdminMe`, `adminLogin`, `adminLogout`

## Permission resolution
1. Load `role_permissions` rows for the member's role
2. Apply `member_permissions` overrides (granted=true adds, granted=false removes)
3. If role has `*`, the resolved set includes `*` → middleware fast-paths to allow

## Lockout guard
`wouldLoseLastAccessController` — called before any change that removes `access_control` or `*` from a role or member. Returns `true` (dangerous) if no other active non-deleted member would retain `access_control` after the change.

## Default role seeds
- webmaster → `["*"]`
- president → content, projects, events, members, sponsors, donations, documents, settings, access_control
- secretary → content, projects, events, members, documents
- treasurer → donations, sponsors
- lcif_coordinator → donations, projects, events
- director → content, events
- member → (none)

## Webmaster account
- Email: `WebAdmin@albanylionsclub.org`
- Default password: `Lions2026!`
- Role: `webmaster` (full `*` permission)
- Not visible in public member roster (`is_visible = false`)

**Why:** Old JWT+admin_users system was parallel to the members table. Unified to single identity source to support fine-grained RBAC and runtime permission editing without code deploys.
