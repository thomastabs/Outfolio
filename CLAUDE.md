# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Outfolio — public portfolio/case-study platform for OutSystems (and other low-code) developers. Lets developers turn project work into rich, shareable case studies for recruiters and technical reviewers.

All app code lives in `frontend/` (repo root has no other apps).

## Apex spec files

`apex.md` (framework docs) and `apex-context-files/` (this project's locked specs — requirements, tech stack, API/data contracts, UX brief) are **gitignored**, kept local-only. They currently describe an **older stack** (Next.js + FastAPI + PostgreSQL + Redis + Celery) that predates the current frontend rewrite and doesn't match the backend (which doesn't exist yet in this repo). Treat those spec files as **stale/in-flux** until they're regenerated to match the stack below — don't trust `tech-stack.md`/`technical-spec.md`/`runtime-spec.md` at face value; confirm against the actual repo first, and flag any contradiction rather than building around it silently.

## Commands (run from `frontend/`)

- `pnpm install` — install deps (this project uses pnpm, see `pnpm-lock.yaml`)
- `pnpm dev` — start dev server (`next dev`)
- `pnpm build` — production build (`next build`)
- `pnpm start` — run a production build (`next start`)
- `pnpm lint` — eslint over the repo

No test runner is configured. `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`.

## Architecture

### Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — no `tailwind.config.js`; theme tokens live in `app/globals.css` via `@theme inline` and CSS custom properties (OKLCH color values), plus `tw-animate-css` for animation utilities
- **shadcn/ui**, `base-nova` style, built on **`@base-ui/react`** primitives — **not Radix**. `rsc: true` in `components.json`.
- **lucide-react** for icons; `class-variance-authority` / `clsx` / `tailwind-merge` for variant and class handling (the `cn()` helper in `frontend/lib/utils.ts`)
- **Geist** / **Geist Mono** fonts via `next/font/google`, wired in `frontend/app/layout.tsx`
- `@vercel/analytics` — only mounted when `NODE_ENV === "production"`

### No backend yet

There is currently **no database, auth, or API layer** in this repo. All data (`developers`, `projects`) is served from `frontend/lib/mock-data.ts` — static arrays plus `getDeveloper`, `getProject`, `getProjectsByDeveloper`, `getFeaturedProjects` lookup helpers, and `categories`/`platforms` constant lists. When implementing real persistence/auth, this file is what gets replaced — check call sites in `app/` first since pages currently import directly from it.

### Routing (App Router)

File-based routing under `frontend/app/`:
- `app/page.tsx` → `/` (landing/home)
- `app/discover/page.tsx` → `/discover` (browse projects — client component, filters via `useState`/`useMemo`)
- `app/new/page.tsx` → `/new` (create project flow — client component)
- `app/developer/[username]/page.tsx` → developer public profile (server component; uses `notFound()` for missing users)
- `app/project/[slug]/page.tsx` → project case-study page (server component; uses `notFound()` for missing projects)
- `app/layout.tsx` — root layout: fonts, `<Analytics />`, global metadata/viewport

Pages default to server components; anything using hooks/state/refs is explicitly marked `"use client"` (see `app/discover/page.tsx`, `app/new/page.tsx`, `components/like-button.tsx`). Follow that split when adding pages — don't make a page a client component just to import one that needs it; push `"use client"` down to the smallest component that needs interactivity.

### Path aliases

`@/*` maps to `frontend/*` (see `tsconfig.json` and `components.json`) — note this is the repo-relative root, not `frontend/src/*`.

### Styling

Tailwind v4 tokens defined in `frontend/app/globals.css` (`@theme inline` block + `:root`/`.dark` OKLCH variables), imported alongside `shadcn/tailwind.css`. Light/dark handled via `.dark` class and a `prefers-color-scheme` media fallback for un-set themes. Stick to the existing shadcn color tokens (`background`, `foreground`, `primary`, `muted`, `accent`, `sidebar-*`, `chart-*`, etc.) rather than introducing new ad-hoc CSS variables.

### Components

- `components/site-header.tsx`, `components/site-footer.tsx` — shared chrome across pages
- `components/project-card.tsx` — project summary card (used on home + discover + developer profile)
- `components/like-button.tsx` — client component, local-only like state (no backend persistence yet)
- `components/ui/*` — shadcn primitives (Base UI-backed): avatar, badge, button, card, dropdown-menu, input, label, select, separator, tabs, textarea, tooltip
