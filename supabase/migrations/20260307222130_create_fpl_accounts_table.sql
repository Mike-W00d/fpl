-- Create fpl_accounts table
create table public.fpl_accounts (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  fpl_team_id integer not null,
  created_at timestamptz default now() not null,

  unique (user_id, fpl_team_id)
);

-- Enable RLS
alter table public.fpl_accounts enable row level security;

-- Users can read their own FPL accounts
create policy "Users can read own fpl accounts"
  on public.fpl_accounts for select
  using (auth.uid() = user_id);

-- Users can insert their own FPL accounts
create policy "Users can insert own fpl accounts"
  on public.fpl_accounts for insert
  with check (auth.uid() = user_id);

-- Users can delete their own FPL accounts
create policy "Users can delete own fpl accounts"
  on public.fpl_accounts for delete
  using (auth.uid() = user_id);
