# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the Albany Capital Region Lions Club website and a shared API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Albany Capital Region Lions Club Website (`artifacts/albany-lions`)
- **Type**: React + Vite (frontend-only, no backend)
- **Preview path**: `/`
- **Stack**: React, Vite, Tailwind CSS, shadcn/ui, framer-motion, wouter
- **Branding**: Lions Club Blue (#0A3DAB) + Gold (#F9C910)
- **Pages**: Home, About, Leadership, Events, Sponsors, Gallery, Donate, Contact
- **Data file**: `artifacts/albany-lions/src/data/clubData.ts` — all club content lives here
- **README**: `artifacts/albany-lions/README.md` — instructions for non-technical updates

### API Server (`artifacts/api-server`)
- **Type**: Express 5 REST API
- **Preview path**: `/api`
- **Port**: 8080

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Key Files

- `artifacts/albany-lions/src/data/clubData.ts` — all club content (officers, events, sponsors, etc.)
- `artifacts/albany-lions/src/index.css` — Lions Club theme colors
- `artifacts/albany-lions/src/components/layout.tsx` — shared header + footer
- `artifacts/albany-lions/src/pages/` — all 8 website pages

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
