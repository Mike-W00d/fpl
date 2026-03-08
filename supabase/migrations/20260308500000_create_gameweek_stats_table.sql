create table public.gameweek_stats (
  gameweek_number    integer primary key,
  highest_score      integer not null,
  average_score      integer not null,
  most_played_chip   text,
  chip_played_amount integer,
  created_at         timestamptz not null default now()
);

alter table public.gameweek_stats enable row level security;

create policy "Authenticated users can read gameweek stats"
  on public.gameweek_stats for select
  using (auth.role() = 'authenticated');
