---
globs: "**/*.tsx"
---

# FPL App — Design & Style Guide for TSX Files

## Aesthetic Direction

This is a **sports data app**. The design should feel like a premium sports analytics dashboard — clean, data-dense where needed, but never cluttered. Think: sharp editorial typography, confident use of whitespace, and a colour palette rooted in the Premier League's identity.

**Tone:** Utilitarian-luxe. Functional precision with considered polish. Not playful, not corporate — authoritative and modern.

## Colour & Theming

- Use the existing shadcn/ui CSS variable system (`hsl(var(--...))`) via Tailwind classes (`bg-primary`, `text-muted-foreground`, etc.). Never hardcode colour values in components.
- **FPL-specific semantic colours** — when adding new CSS variables for FPL-domain concepts, use these as a guide:
  - Green (points/gains): `--fpl-positive` — a rich, saturated green, not neon
  - Red (losses/drops): `--fpl-negative` — a deep, serious red
  - Gold/amber (captain, top performer): `--fpl-highlight`
  - Premier League purple as a sparing accent, not a primary surface colour
- Prefer **high contrast** between data and chrome. Data values should pop; containers should recede.
- Dark mode is first-class. Always verify both themes look intentional, not just inverted.

## Typography

- The app uses **Geist Sans** (loaded via `next/font/google`). Use it consistently — do not import additional fonts without discussion.
- **Hierarchy matters in data-heavy UI:**
  - Player names, scores, and key stats: `font-semibold` or `font-bold`, sized for scanability
  - Labels, column headers: `text-xs` or `text-sm`, `text-muted-foreground`, `uppercase tracking-wide` for table headers
  - Large hero numbers (e.g. total points, gameweek score): use `text-3xl` to `text-5xl` with `font-bold` and `tabular-nums`
- Use `tabular-nums` (Tailwind: `tabular-nums` or `font-variant-numeric: tabular-nums`) on any numeric data so columns align.
- Avoid walls of text. Let data breathe.

## Spacing & Layout

- **Page-level:** max-width container (`max-w-5xl mx-auto px-4 sm:px-6`) for content. Full-bleed backgrounds are fine for section breaks.
- **Vertical rhythm:** use consistent spacing steps — `gap-4`, `gap-6`, `gap-8` between sections. Avoid arbitrary values.
- **Cards as primary containers:** use `<Card>` from shadcn/ui for discrete data blocks (team summary, gameweek breakdown, league table). Keep `rounded-lg` radius consistent.
- **Dense data layouts:** tables and stat grids can use tighter spacing (`p-2`, `gap-2`) — this is expected for sports data. Don't over-pad tabular content.
- **Responsive approach:** mobile-first. Stack on small screens, use grid layouts on `md:` and up. Common patterns:
  - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - Stat rows: `flex items-center justify-between`

## Component Patterns

- **Use shadcn/ui components** (`Card`, `Badge`, `Button`, `DropdownMenu`, etc.) as the foundation. Don't rebuild what exists.
- **Icons:** use `lucide-react` exclusively. Keep icons at `16px` (`size={16}`) for inline use, `20px`–`24px` for standalone/nav.
- **Badges for status/chips:** use `<Badge>` with `variant` for things like chip status (Wildcard, Bench Boost), position labels (GKP, DEF, MID, FWD), or form indicators.
- **Tables:** use native `<table>` with Tailwind styling (not a heavy table component). Align numbers right, text left. Stripe rows with `even:bg-muted/50` or similar subtle alternation.
- **Loading states:** use skeleton placeholders (`bg-muted animate-pulse rounded`) that match the shape of the content they replace. Never show empty white space while loading.
- **Empty states:** always handle zero-data gracefully with a concise message and muted styling. No broken layouts.

## Interaction & Motion

- **Restrained motion.** This is a data app, not a marketing site. Animations should serve clarity, not decoration.
- Page transitions: none (let Next.js handle navigation).
- Acceptable motion: subtle hover states on interactive cards (`hover:bg-accent/50 transition-colors`), button feedback, accordion/collapse reveals.
- **No entrance animations on data.** Tables, stats, and numbers should appear immediately — users come here to scan quickly.
- Dropdown menus and popovers: use Radix defaults via shadcn, which already have appropriate enter/exit transitions.

## Data Display Conventions

- **Gameweek points:** bold, prominent, right-aligned in tables.
- **Price changes:** show with `▲`/`▼` indicators and colour-coded (`text-fpl-positive`/`text-fpl-negative`).
- **Rank/position numbers:** use `#` prefix, `tabular-nums`, right-aligned.
- **Percentages:** one decimal place max. Use `text-muted-foreground` for the `%` symbol to reduce visual noise.
- **Chips:** always displayed as `<Badge>` with distinct styling per chip type.

## File & Component Structure

- Keep components focused — one concern per file.
- Co-locate page-specific components in the route folder (e.g. `app/(root)/leagues/_components/`). Shared UI stays in `components/`.
- Server components by default. Only add `"use client"` when the component genuinely needs browser APIs, state, or event handlers.
- Props over context for data passing. Keep the component tree explicit.
