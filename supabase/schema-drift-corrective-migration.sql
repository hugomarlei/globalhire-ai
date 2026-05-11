-- GlobalHire AI - safe corrective migration for schema drift
-- NÃO foi executado automaticamente.
-- Como usar: rode primeiro supabase/schema-drift-introspection.sql e revise o relatório.
-- Depois, se fizer sentido, aplique este arquivo no Supabase SQL Editor.

begin;

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free',
  is_admin boolean not null default false,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  plan text not null default 'free',
  status text not null default 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions
  add column if not exists stripe_price_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false;

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  language text not null,
  target_country text not null,
  input_resume text not null,
  job_description text,
  output text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  plan text not null,
  monthly_generations integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  generation_id uuid references public.generations(id) on delete set null,
  title text not null,
  content text not null,
  document_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_plan_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_plan_check
      check (plan in ('free', 'starter', 'pro', 'elite')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'subscriptions_plan_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_plan_check
      check (plan in ('free', 'starter', 'pro', 'elite')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'generations_type_check'
      and conrelid = 'public.generations'::regclass
  ) then
    alter table public.generations
      add constraint generations_type_check
      check (type in ('ats_resume', 'cover_letter', 'linkedin_summary', 'recruiter_message', 'interview_prep', 'translate_resume')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'usage_limits_plan_check'
      and conrelid = 'public.usage_limits'::regclass
  ) then
    alter table public.usage_limits
      add constraint usage_limits_plan_check
      check (plan in ('free', 'starter', 'pro', 'elite')) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'subscriptions_stripe_subscription_id_key'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_stripe_subscription_id_key unique (stripe_subscription_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'usage_limits_plan_key'
      and conrelid = 'public.usage_limits'::regclass
  ) then
    alter table public.usage_limits
      add constraint usage_limits_plan_key unique (plan);
  end if;
end $$;

insert into public.usage_limits (plan, monthly_generations)
values
  ('free', 1),
  ('starter', 10),
  ('pro', 9999),
  ('elite', 9999)
on conflict (plan) do update set monthly_generations = excluded.monthly_generations;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute procedure public.touch_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at before update on public.subscriptions
for each row execute procedure public.touch_updated_at();

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at before update on public.documents
for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.generations enable row level security;
alter table public.usage_limits enable row level security;
alter table public.documents enable row level security;
alter table public.rate_limits enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read own subscription" on public.subscriptions;
create policy "Users can read own subscription" on public.subscriptions
for select using (auth.uid() = user_id);

drop policy if exists "Users can read own generations" on public.generations;
create policy "Users can read own generations" on public.generations
for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own generations" on public.generations;
create policy "Users can insert own generations" on public.generations
for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own generations" on public.generations;
create policy "Users can delete own generations" on public.generations
for delete using (auth.uid() = user_id);

drop policy if exists "Everyone can read usage limits" on public.usage_limits;
create policy "Everyone can read usage limits" on public.usage_limits
for select using (true);

drop policy if exists "Users can read own documents" on public.documents;
create policy "Users can read own documents" on public.documents
for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own documents" on public.documents;
create policy "Users can insert own documents" on public.documents
for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own documents" on public.documents;
create policy "Users can update own documents" on public.documents
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own documents" on public.documents;
create policy "Users can delete own documents" on public.documents
for delete using (auth.uid() = user_id);

create index if not exists generations_user_created_idx on public.generations(user_id, created_at desc);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);
create index if not exists rate_limits_reset_at_idx on public.rate_limits(reset_at);

commit;
