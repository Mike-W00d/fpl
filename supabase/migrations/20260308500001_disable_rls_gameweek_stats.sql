drop policy "Authenticated users can read gameweek stats" on public.gameweek_stats;

alter table public.gameweek_stats disable row level security;
