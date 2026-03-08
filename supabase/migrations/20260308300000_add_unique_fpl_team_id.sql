alter table public.fpl_accounts
  add constraint fpl_accounts_fpl_team_id_key unique (fpl_team_id);
