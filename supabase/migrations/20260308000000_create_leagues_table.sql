-- Create leagues table
create table public.leagues (
  league_id integer primary key,
  name text not null,
  total_entrants integer not null default 0,
  scoring_type text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.leagues enable row level security;

-- All authenticated users can read leagues
create policy "Authenticated users can read leagues"
  on public.leagues for select
  using (auth.uid() is not null);

-- Authenticated users can insert leagues
create policy "Authenticated users can insert leagues"
  on public.leagues for insert
  with check (auth.uid() is not null);

-- Authenticated users can update leagues (required for upsert)
create policy "Authenticated users can update leagues"
  on public.leagues for update
  using (auth.uid() is not null);
