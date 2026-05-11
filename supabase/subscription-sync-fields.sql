-- GlobalHire AI - subscription sync fields
-- Rode este SQL se o projeto Supabase já foi criado antes de 2026-05-11.

alter table public.subscriptions
  add column if not exists current_period_start timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false;
