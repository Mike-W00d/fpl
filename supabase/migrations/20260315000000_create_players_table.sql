create table public.players (
  element_id     integer primary key,
  web_name       text not null,
  element_type   integer not null,
  updated_at     timestamptz not null default now()
);

alter table public.players disable row level security;
