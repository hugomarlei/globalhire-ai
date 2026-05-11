-- GlobalHire AI - distributed rate limit storage
-- Como usar: Supabase Dashboard > SQL Editor > New query > cole tudo > Run.

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

create index if not exists rate_limits_reset_at_idx on public.rate_limits(reset_at);

-- Sem policies públicas: a aplicação acessa esta tabela somente pelo servidor com SUPABASE_SERVICE_ROLE_KEY.
