# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the Albany Capital Region Lions Club website and a shared API server with full CMS capabilities.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken + bcryptjs), token stored in localStorage
- **File uploads**: multer → `artifacts/albany-lions/public/uploads/`
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle)

## Artifacts

### Albany Capital Region Lions Club Website (`artifacts/albany-lions`)
- **Type**: React + Vite
- **Preview path**: `/`
- **Stack**: React, Vite, Tailwind CSS, shadcn/ui, framer-motion, wouter, date-fns
- **Branding**: Lions Club Blue (#0A3DAB) + Gold (#F9C910)
- **Pages**: Home, About, Leadership, Events, Sponsors, Gallery, Donate, Contact, Blog, Calendar, Magazine, Magazine Advertisers
- **Admin pages**: `/admin/login`, `/admin/setup`, `/admin` (dashboard), `/admin/blog`, `/admin/events`, `/admin/magazine`, `/admin/gallery`
- **Data file**: `artifacts/albany-lions/src/data/clubData.ts` — static club content (members, sponsors, etc.)
- **Auth helpers**: `artifacts/albany-lions/src/lib/auth.ts` — JWT storage + fetch helpers
- **Magazine PDF**: `artifacts/albany-lions/public/magazines/magazine-2026.pdf`
- **Uploads**: `artifacts/albany-lions/public/uploads/images/` and `/pdfs/`

### API Server (`artifacts/api-server`)
- **Type**: Express 5 REST API
- **Preview path**: `/api`
- **Port**: 8080
- **Routes**:
  - `GET/POST /api/auth/login` — admin login → JWT
  - `POST /api/auth/setup` — first-time admin setup (only if no admin exists)
  - `GET /api/auth/me` — verify token
  - `GET /api/blog` — published posts (public)
  - `GET /api/blog/all` — all posts including drafts (admin)
  - `GET /api/blog/:slug` — single post (public)
  - `POST /api/blog`, `PUT /api/blog/:id`, `DELETE /api/blog/:id` — CRUD (admin)
  - `GET /api/calendar` — all events (public)
  - `POST /api/calendar`, `PUT /api/calendar/:id`, `DELETE /api/calendar/:id` — CRUD (admin)
  - `GET /api/magazines` — all magazines (public)
  - `POST /api/magazines`, `PUT /api/magazines/:id`, `DELETE /api/magazines/:id` — CRUD (admin)
  - `GET /api/gallery` — all gallery items (public)
  - `POST /api/gallery`, `DELETE /api/gallery/:id` — CRUD (admin)
  - `POST /api/upload` — file upload (admin), saves to `public/uploads/`
  - `POST /api/contact` — contact form email

## Database Tables (lib/db)

- `admin_users` — admin accounts (email, passwordHash, role)
- `blog_posts` — blog posts (title, slug, content, excerpt, coverImageUrl, category, published)
- `calendar_events` — events (title, description, eventDate, eventTime, location, category)
- `magazines` — magazine PDFs (title, year, fileUrl, description, isCurrent)
- `gallery_items` — gallery photos (title, imageUrl, category, eventDate)

## Admin Account

- First-time setup: visit `/admin/setup`
- Default admin: `admin@albanylionsclub.org` / `Lions2026!` (change after first login)
- Admin link: in footer of the website

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Key Files

- `artifacts/albany-lions/src/data/clubData.ts` — static content (officers, sponsors, etc.)
- `artifacts/albany-lions/src/lib/auth.ts` — auth token helpers + apiFetch
- `artifacts/albany-lions/src/components/layout.tsx` — shared header + footer + nav
- `artifacts/albany-lions/src/pages/` — all website pages
- `artifacts/albany-lions/src/pages/admin/` — admin dashboard pages
- `artifacts/api-server/src/routes/` — all API routes
- `artifacts/api-server/src/middlewares/requireAdmin.ts` — JWT auth middleware
- `lib/db/src/schema/index.ts` — database schema

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
