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
- `pnpm build` — production build (now genuinely type-checks — see below)
- `pnpm lint` — eslint
- `pnpm test` — vitest (jsdom + React Testing Library)

`next.config.mjs`'s `typescript.ignoreBuildErrors` was `true` (silently skipping type errors) until 2026-07-26; it's now `false`, so `next build` actually fails on type errors. `npx tsc --noEmit -p tsconfig.json` still works as a faster standalone check.

**Backend** (run from `backend/`):
- `npm install` — install deps
- `npm run build` — `tsc -p tsconfig.json`
- `npm test` — vitest (node environment, no DOM)

**Supabase** (run from `backend/`):
- `npx supabase link --project-ref qomwalqhlzaypjeqzzuc` — link CLI to the hosted project
- `npx supabase db push` — apply pending migrations to the linked remote project
- `npx supabase start` — local Docker-based stack (Postgres/Auth/Storage) for offline testing; requires Docker daemon running

Both apps now have real vitest suites (backend: route handlers with `supabaseAdmin` mocked; frontend: `RegistrationForm`/`LoginForm`/`ProfileEditForm` with `fetch` and `next/navigation` mocked) — unit-level, not integration tests against a live Supabase instance or a running app. Neither is wired into CI yet. **`frontend/pnpm-lock.yaml` may be out of sync** with `package.json` — the sandbox this was built in can't run pnpm (`corepack pnpm` throws `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`), so dependency verification there used a throwaway `npm install`, never committed. Run `pnpm install` locally once to regenerate the lockfile properly.

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
- `backend/lib/auth.ts` exports `requireAuth`, an Express middleware shared by every `auth:bearer` route: reads `Authorization: Bearer <token>`, validates it via `supabaseAdmin.auth.getUser(token)`, and attaches `req.userId`. Route handlers import it rather than re-checking bearer tokens themselves.

### Session handling (frontend ↔ backend)

There is no cross-service routing configured yet (no `next.config.mjs` rewrite, no `vercel.json`) — `BACKEND_URL` (`frontend/lib/session.ts`, defaults to `http://localhost:3001`) is how any frontend server-side code reaches the backend. **Known gap:** `RegistrationForm` and `LoginForm` still `fetch("/api/v1/auth/...")` as a bare relative path, which only resolves if something proxies `/api/v1/*` to the backend — nothing does yet. That's pre-existing from stories 9431617/9431618, not fixed here; worth a dedicated infra task.

The auth token is a Supabase session JWT, stored as an **HttpOnly cookie** (`outfolio_token`, see `frontend/lib/session.ts`) set by `frontend/app/api/session/route.ts` right after login. This exists because a server component (like `app/profile/page.tsx`) can't read `localStorage`, and because HttpOnly means client JS can't read the cookie either (so a client component can't attach the header itself). The pattern that falls out of this:
- Server components read the cookie directly via `next/headers`' `cookies()` and attach the header themselves (see `app/profile/page.tsx`'s `fetchProfile`).
- Client components that need to call an authed backend endpoint go through a same-origin Next.js Route Handler that reads the cookie server-side and forwards the request with the header added (see `frontend/app/api/profile/route.ts` proxying to `PUT /api/v1/users/me/profile`). Don't have a client component try to attach `Authorization` itself — it has no way to read the token.
- No refresh-token handling exists; the cookie's `maxAge` (1h) just matches Supabase's default access-token TTL. Revisit when a session-refresh or logout story lands.

### Data layer

- `backend/supabase/migrations/` — SQL migrations, applied via `supabase db push` against the linked hosted project (`qomwalqhlzaypjeqzzuc`)
- `public.users` table: `user_id` (PK, FK to `auth.users.id`), `username`/`email` (unique), profile fields (`name`, `bio`, `experience_years`, `certifications`, `links`, `visibility_settings`). RLS enabled; SELECT/INSERT/UPDATE/DELETE restricted to `auth.uid() = user_id`, granted to `authenticated` only (not `anon`) — matches NFR-5 (account data is not public).
- `frontend/lib/mock-data.ts` still backs the rest of the UI (`developers`, `projects` listings) — not yet wired to Supabase. Check call sites in `app/` before assuming any given page already reads from Postgres.

### API endpoints implemented so far

- `POST /api/v1/auth/register` (`backend/api/v1/auth/register.ts`) — creates the Supabase Auth user first, then inserts the `public.users` profile row keyed by the returned auth id; rolls back the auth user if the profile insert fails. Returns 400/409/422/500 per `EP-1`.
- `POST /api/v1/auth/login` (`backend/api/v1/auth/login.ts`) — resolves `username` → `email` against `public.users`, then delegates to `supabase.auth.signInWithPassword`. Checks username existence (404) before attempting sign-in (401), so an unregistered username never falls through to a generic invalid-credentials message. Returns `{ token, userId }` per `EP-2`.
- `GET /api/v1/users/me/profile` (`backend/api/v1/users/me/profile.ts`) — `requireAuth`-gated, returns the authenticated user's profile fields (camelCase) per `EP-3`.
- `PUT /api/v1/users/me/profile` (same file) — `requireAuth`-gated, partial update. `name` is treated as required on every call despite `EP-4` marking it `name?:string` — the dev pack's own steps/Test Assertions and `SC-2` both demand 400 on a missing name; all other fields are genuinely optional/partial. Rejects the whole update (422) if any `links[].url` is invalid — no partial save.

### Routing (frontend, App Router)

File-based routing under `frontend/app/`:
- `app/page.tsx` → `/` (landing/home)
- `app/discover/page.tsx` → `/discover` (browse projects — client component, filters via `useState`/`useMemo`)
- `app/new/page.tsx` → `/new` (create project flow — client component)
- `app/register/page.tsx` → `/register` (registration form, server component wrapping the client `RegistrationForm`)
- `app/login/page.tsx` → `/login` (login form, server component wrapping the client `LoginForm`)
- `app/profile/page.tsx` → `/profile` (server component; reads the session cookie, redirects to `/login` if missing/rejected, fetches `GET /api/v1/users/me/profile`, renders the editable `ProfileEditForm`)
- `app/api/session/route.ts` → `POST /api/session` (sets the HttpOnly session cookie after login)
- `app/api/profile/route.ts` → `PUT /api/profile` (proxies to the backend PUT endpoint, attaching the Bearer header from the cookie)
- `app/developer/[username]/page.tsx` → developer public profile (server component; uses `notFound()` for missing users)
- `app/project/[slug]/page.tsx` → project case-study page (server component; uses `notFound()` for missing projects)
- `app/layout.tsx` — root layout: fonts, `<Analytics />`, global metadata/viewport

Pages default to server components; anything using hooks/state/refs is explicitly marked `"use client"` (see `app/discover/page.tsx`, `app/new/page.tsx`, `components/like-button.tsx`, `components/auth/RegistrationForm.tsx`, `components/auth/LoginForm.tsx`, `components/profile/ProfileEditForm.tsx`). Follow that split when adding pages — don't make a page a client component just to import one that needs it; push `"use client"` down to the smallest component that needs interactivity.

A server-component page **cannot** pass a function prop to a client child — functions aren't serializable across the RSC boundary. This has come up twice: `LoginForm` handles its own post-login redirect (to `/profile`) internally via `useRouter` rather than `app/login/page.tsx` passing a callback, and `ProfileEditForm` calls `router.refresh()` itself after a successful save rather than `app/profile/page.tsx` passing a refresh callback. Default to this pattern — client component owns its own post-action navigation/refresh — whenever the parent page needs to stay a server component.

### Path aliases

`@/*` maps to `frontend/*` (see `frontend/tsconfig.json` and `frontend/components.json`) — repo-relative to `frontend/`, not a `src/` root. `backend/` has no path alias; its route files use relative imports (e.g. `../../../lib/supabaseClient.js`, `.js` extension required since `backend/tsconfig.json` uses `NodeNext` module resolution).

### Styling

Tailwind v4 tokens defined in `frontend/app/globals.css` (`@theme inline` block + `:root`/`.dark` OKLCH variables), imported alongside `shadcn/tailwind.css`. Light/dark handled via `.dark` class and a `prefers-color-scheme` media fallback for un-set themes. Stick to the existing shadcn color tokens (`background`, `foreground`, `primary`, `muted`, `accent`, `sidebar-*`, `chart-*`, etc.) rather than introducing new ad-hoc CSS variables.

### Testing

`frontend/vitest.config.ts` does **not** set `globals: true` — test files import `describe`/`it`/`expect`/`vi` explicitly from `"vitest"` rather than relying on ambient globals. Because of that, React Testing Library's automatic per-test `cleanup()` (which detects a global `afterEach`) doesn't fire on its own; `frontend/vitest.setup.ts` registers it manually (`afterEach(cleanup)`). Skipping this silently leaves previous tests' DOM trees mounted, which surfaces as confusing "found multiple elements" errors in a *later* test in the same file, not the one that actually leaked.

### Components

- `components/site-header.tsx`, `components/site-footer.tsx` — shared chrome across pages
- `components/project-card.tsx` — project summary card (used on home + discover + developer profile)
- `components/like-button.tsx` — client component, local-only like state (no backend persistence yet)
- `components/auth/RegistrationForm.tsx` — client component, calls `POST /api/v1/auth/register`, maps 409/422 to inline field errors
- `components/auth/LoginForm.tsx` — client component, calls `POST /api/v1/auth/login`, maps 401/404 to inline errors, persists the session cookie via `POST /api/session`, redirects to `/profile` via `useRouter` on success
- `components/profile/ProfileEditForm.tsx` — client component, editable name/bio/experienceYears/certifications/links (tag-input pattern reused from `app/new/page.tsx`); validates client-side, submits via `PUT /api/profile` (same-origin proxy, not the backend directly), maps 400/422 to inline errors, calls `router.refresh()` on success
- `components/ui/*` — shadcn primitives (Base UI-backed): avatar, badge, button, card, dropdown-menu, input, label, select, separator, tabs, textarea, tooltip
