create table public.fpl_account_leagues (
  fpl_account_id bigint not null references public.fpl_accounts(id) on delete cascade,
  league_id integer not null references public.leagues(league_id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (fpl_account_id, league_id)
);

alter table public.fpl_account_leagues enable row level security;

-- Users can read their own junction rows
create policy "Users can read own fpl_account_leagues"
  on public.fpl_account_leagues for select
  using (
    fpl_account_id in (
      select id from public.fpl_accounts where user_id = auth.uid()
    )
  );

-- Users can insert their own junction rows
create policy "Users can insert own fpl_account_leagues"
  on public.fpl_account_leagues for insert
  with check (
    fpl_account_id in (
      select id from public.fpl_accounts where user_id = auth.uid()
    )
  );
