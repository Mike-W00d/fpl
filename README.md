# FPL App

Fantasy Premier League app built with Next.js (App Router), TailwindCSS, shadcn/ui, and Supabase.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui (new-york style)
- **Auth & DB:** Supabase (supabase-ssr with cookie-based auth)
- **Validation:** Zod schemas for FPL API responses
- **Icons:** lucide-react

## Local Development

```bash
# Start Next.js dev server (uses remote Supabase)
npm run dev

# Start local Supabase + Next.js dev server
npm run dev:local
```

### Local Supabase

```bash
npm run db:start    # Start local Supabase instance
npm run db:stop     # Stop local Supabase instance
```

Once running, Supabase Studio is available at [localhost:54323](http://localhost:54323).

## Database Migrations

```bash
# Create a new migration
npx supabase migration new <name>

# Reset local DB and re-run all migrations + seed
npm run db:reset

# Push migrations to remote Supabase
npx supabase db push

# Pull remote schema changes as a migration
npx supabase db pull
```

## Test Users

The seed file (`supabase/seed.sql`) creates three test accounts for local development:

| Email             | Password      | Name            |
|-------------------|---------------|-----------------|
| alice@test.com    | password123   | Alice Johnson   |
| bob@test.com      | password123   | Bob Smith       |
| charlie@test.com  | password123   | Charlie Davies  |

These are only available when running against the local Supabase instance (after `npm run db:start` or `npm run db:reset`).
