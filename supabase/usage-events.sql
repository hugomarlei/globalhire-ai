-- GlobalHire AI - optional operational logs
-- Como usar: Supabase Dashboard > SQL Editor > New query > cole tudo > Run.
-- Este arquivo prepara tabelas seguras para analytics internos sem salvar currículos ou vagas completas.

create extension if not exists "pgcrypto";

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  feature text,
  plan text,
  status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.usage_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Users can read own usage events" on public.usage_events;
create policy "Users can read own usage events" on public.usage_events
for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own usage events" on public.usage_events;

-- usage_events e audit_logs devem ser escritos apenas por rotas server-side usando service role.
-- Nenhuma policy pública de insert é criada por padrão para evitar métricas manipuláveis pelo frontend.

create index if not exists usage_events_user_created_idx on public.usage_events(user_id, created_at desc);
create index if not exists usage_events_name_created_idx on public.usage_events(event_name, created_at desc);
create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_user_id, created_at desc);
