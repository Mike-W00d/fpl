-- Add indexes for common query patterns
create index if not exists idx_fpl_accounts_user_id on public.fpl_accounts(user_id);
create index if not exists idx_fpl_account_leagues_fpl_account_id on public.fpl_account_leagues(fpl_account_id);
