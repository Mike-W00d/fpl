ALTER TABLE fpl_account_leagues
ADD COLUMN current_rank integer,
ADD COLUMN rank_last_updated timestamptz;
