# CLAUDE.md
## Project Overview

Fantasy Premier League (FPL) app built with Next.js (App Router), TailwindCSS and Supabase, Uses Zod schemas to validate responses from the FPL API

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

### Routing

All routes live under `app/(root)/` using a route group. The root layout (`app/(root)/layout.tsx`) sets up the Geist font and `next-themes` ThemeProvider.

- `app/(root)/auth/` — auth pages from Supabase (login, sign-up, forgot-password, update-password, confirm, error, sign-up-success)

### Supabase Integration

Three Supabase client factories, each for a different context:
- `lib/supabase/client.ts` — browser client (`createBrowserClient`)
- `lib/supabase/server.ts` — server component/action client (`createServerClient` with cookies)
- `lib/supabase/proxy.ts` — middleware session refresh (used by `proxy.ts`)

**Important:** Never store Supabase clients in global variables (Fluid compute compatibility). Always create a new client per request/function call.

### FPL API Schemas

Zod schemas for FPL API responses in `lib/zod/schemas/`:
- `entrySummary.ts` — `/api/entry/{team_id}/` (team info, leagues, cup)
- `entryHistory.ts` — `/api/entry/{team_id}/history/` (gameweek history, past seasons, chips)
- `leagueStandings.ts` — `/api/leagues-classic/{league_id}/standings/` (league table with pagination)

### UI

- shadcn/ui (new-york style) with Radix primitives — components in `components/ui/`
- Tailwind CSS v3 with CSS variables for theming
- Icon library: lucide-react
- Path alias: `@/*` maps to project root
