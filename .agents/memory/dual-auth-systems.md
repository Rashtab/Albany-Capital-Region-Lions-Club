---
name: Dual admin auth systems
description: Two parallel admin auth systems coexist — JWT+admin_users (old) and session+members (new)
---

## Rule
The project has **two separate admin auth systems** that must not be conflated:

**Old system (JWT + admin_users table)**
- Routes: `POST /api/auth/login`, `GET /api/auth/me`
- Middleware: `requireAdmin` (checks `Authorization: Bearer <token>`)
- Frontend: `apiFetch` in `lib/auth.ts`, token stored in `localStorage`
- Used by: existing admin CRUD pages at `/admin/blog`, `/admin/events`, `/admin/magazine`, `/admin/gallery`

**New system (session + members table)**
- Routes: `POST/GET/POST /api/admin/login|me|logout`, `POST /api/admin/set-password`
- Middleware: `requireMemberAdmin`, `requirePermission(perm)` in `middlewares/requireMemberAdmin.ts`
- Frontend: `adminFetch` (credentials:include) in `lib/adminAuth.ts`
- Session cookie name: `lions_sid`
- Used by: new admin portal pages

**Why:** User requested migration from admin_users to members table with session-based auth. Old CRUD pages left intact during transition.

**How to apply:** Any new admin management screen must use the new session system (`requireMemberAdmin` middleware + `adminFetch` on frontend). Do not mix the two systems.

## RBAC permissions
- `president`, `webmaster` → `['all']`
- `secretary` → `['members', 'events', 'content']`
- `treasurer` → `['donations', 'sponsors']`

## Initial credentials (all use: Lions2026!)
- carlos.rivera@albanylionsclub.org — president
- priya.nair@albanylionsclub.org — secretary  
- james.okafor@albanylionsclub.org — treasurer
