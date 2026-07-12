---
name: connect-pg-simple + esbuild session table
description: connect-pg-simple's createTableIfMissing reads a table.sql asset that esbuild does not copy — causes ENOENT on every session save, breaking login silently.
---

## Rule
Never pass `createTableIfMissing: true` to `connect-pg-simple` when the server is bundled with esbuild.

**Why:** `createTableIfMissing` reads `<dist>/table.sql` at runtime. esbuild bundles JS only; non-JS assets are not copied to `dist/`. Every session save throws `ENOENT: no such file or directory, open '.../dist/table.sql'`. The login POST returns 200 (session created in memory), but the next request returns 401 because the session was never written to the DB.

**How to apply:** In `startup-seed.ts`, call `CREATE TABLE IF NOT EXISTS "user_sessions"` via Drizzle raw SQL on every boot (before `app.listen`). This is idempotent and safe. The `connect-pg-simple` store config omits `createTableIfMissing` entirely.
