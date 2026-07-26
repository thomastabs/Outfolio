# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Outfolio — public portfolio/case-study platform for OutSystems (and other low-code) developers. Lets developers turn project work into rich, shareable case studies for recruiters and technical reviewers.

## Apex spec files

`apex.md` (framework docs) and `apex-context-files/` (this project's locked specs — requirements, tech stack, API/data contracts, UX brief) are **gitignored**, kept local-only. They are the source of truth for endpoint contracts (`EP-n`), data model (`ENT-n`), and runtime layout (`RT-n`) — confirm against them before adding new API surface, but also confirm against the actual repo first: specs have drifted from reality before (see `decisions.md` for logged corrections) and may again.

## Repo layout

Two independent apps, no shared workspace config:
- `frontend/` — Next.js 16 UI (pnpm)
- `backend/` — Express 4 API (npm/node, own `package.json`/`tsconfig.json`)
- `backend/supabase/` — Supabase CLI project (migrations + `config.toml`), colocated with `backend/` since it's the only layer querying Postgres directly today

## Commands

**Frontend** (run from `frontend/`):
- `pnpm install` — install deps (`pnpm-lock.yaml`)
- `pnpm dev` — dev server (`next dev`)
- `pnpm build` — production build
- `pnpm lint` — eslint

`next.config.mjs` sets `typescript.ignoreBuildErrors: true` — `next build` does **not** type-check. Run `npx tsc --noEmit -p tsconfig.json` separately to actually catch type errors.

**Backend** (run from `backend/`):
- `npm install` — install deps
- `npm run build` — `tsc -p tsconfig.json`
- `npm test` — vitest (no test files exist yet)

**Supabase** (run from `backend/`):
- `npx supabase link --project-ref qomwalqhlzaypjeqzzuc` — link CLI to the hosted project
- `npx supabase db push` — apply pending migrations to the linked remote project
- `npx supabase start` — local Docker-based stack (Postgres/Auth/Storage) for offline testing; requires Docker daemon running

No test runner is wired into CI for either app; verification so far has been manual (`tsc`, `next build`, `supabase migration list` against the real project).

## Architecture

### Frontend stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — no `tailwind.config.js`; theme tokens live in `app/globals.css` via `@theme inline` and CSS custom properties (OKLCH color values), plus `tw-animate-css` for animation utilities
- **shadcn/ui**, `base-nova` style, built on **`@base-ui/react`** primitives — **not Radix**. `rsc: true` in `components.json`.
- **lucide-react** for icons; `class-variance-authority` / `clsx` / `tailwind-merge` for variant and class handling (the `cn()` helper in `frontend/lib/utils.ts`)
- **Geist** / **Geist Mono** fonts via `next/font/google`, wired in `frontend/app/layout.tsx`
- `@vercel/analytics` — only mounted when `NODE_ENV === "production"`

### Backend stack

- **Node.js 20 + Express 4**, one file per route under `backend/api/v1/...`, each exporting a small Express app as its default export (Vercel's Node runtime can invoke an Express app instance directly as a serverless function — no `serverless-http` needed)
- **Supabase** (`@supabase/supabase-js`) for Postgres, Auth, and Storage. `backend/lib/supabaseClient.ts` exports `supabaseAdmin`, a service-role client (bypasses RLS) for admin operations like `auth.admin.createUser` — never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend code.
- Auth is fully owned by **Supabase Auth** (`auth.users`). App tables never store passwords or hashes — see `apex-context-files/decisions.md` (2026-07-26): a hand-rolled `password_hash` column was explicitly rejected in favor of `supabase.auth.admin.createUser` / `signInWithPassword`. The app's `public.users` table only mirrors `user_id` (FK to `auth.users.id`) plus profile fields.

### Data layer

- `backend/supabase/migrations/` — SQL migrations, applied via `supabase db push` against the linked hosted project (`qomwalqhlzaypjeqzzuc`)
- `public.users` table: `user_id` (PK, FK to `auth.users.id`), `username`/`email` (unique), profile fields (`name`, `bio`, `experience_years`, `certifications`, `links`, `visibility_settings`). RLS enabled; SELECT/INSERT/UPDATE/DELETE restricted to `auth.uid() = user_id`, granted to `authenticated` only (not `anon`) — matches NFR-5 (account data is not public).
- `frontend/lib/mock-data.ts` still backs the rest of the UI (`developers`, `projects` listings) — not yet wired to Supabase. Check call sites in `app/` before assuming any given page already reads from Postgres.

### API endpoints implemented so far

- `POST /api/v1/auth/register` (`backend/api/v1/auth/register.ts`) — creates the Supabase Auth user first, then inserts the `public.users` profile row keyed by the returned auth id; rolls back the auth user if the profile insert fails. Returns 400/409/422/500 per `EP-1`.

### Routing (frontend, App Router)

File-based routing under `frontend/app/`:
- `app/page.tsx` → `/` (landing/home)
- `app/discover/page.tsx` → `/discover` (browse projects — client component, filters via `useState`/`useMemo`)
- `app/new/page.tsx` → `/new` (create project flow — client component)
- `app/register/page.tsx` → `/register` (registration form, server component wrapping the client `RegistrationForm`)
- `app/developer/[username]/page.tsx` → developer public profile (server component; uses `notFound()` for missing users)
- `app/project/[slug]/page.tsx` → project case-study page (server component; uses `notFound()` for missing projects)
- `app/layout.tsx` — root layout: fonts, `<Analytics />`, global metadata/viewport

Pages default to server components; anything using hooks/state/refs is explicitly marked `"use client"` (see `app/discover/page.tsx`, `app/new/page.tsx`, `components/like-button.tsx`, `components/auth/RegistrationForm.tsx`). Follow that split when adding pages — don't make a page a client component just to import one that needs it; push `"use client"` down to the smallest component that needs interactivity.

### Path aliases

`@/*` maps to `frontend/*` (see `frontend/tsconfig.json` and `frontend/components.json`) — repo-relative to `frontend/`, not a `src/` root. `backend/` has no path alias; its route files use relative imports (e.g. `../../../lib/supabaseClient.js`, `.js` extension required since `backend/tsconfig.json` uses `NodeNext` module resolution).

### Styling

Tailwind v4 tokens defined in `frontend/app/globals.css` (`@theme inline` block + `:root`/`.dark` OKLCH variables), imported alongside `shadcn/tailwind.css`. Light/dark handled via `.dark` class and a `prefers-color-scheme` media fallback for un-set themes. Stick to the existing shadcn color tokens (`background`, `foreground`, `primary`, `muted`, `accent`, `sidebar-*`, `chart-*`, etc.) rather than introducing new ad-hoc CSS variables.

### Components

- `components/site-header.tsx`, `components/site-footer.tsx` — shared chrome across pages
- `components/project-card.tsx` — project summary card (used on home + discover + developer profile)
- `components/like-button.tsx` — client component, local-only like state (no backend persistence yet)
- `components/auth/RegistrationForm.tsx` — client component, calls `POST /api/v1/auth/register`, maps 409/422 to inline field errors
- `components/ui/*` — shadcn primitives (Base UI-backed): avatar, badge, button, card, dropdown-menu, input, label, select, separator, tabs, textarea, tooltip
