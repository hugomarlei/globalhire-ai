-- GlobalHire AI - schema drift introspection
-- Objetivo: gerar um snapshot real do Supabase para comparar com supabase/schema.sql.
-- Como usar: Supabase Dashboard > SQL Editor > New query > cole tudo > Run.
-- Este script é somente leitura.

select
  'tables' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(t) order by t.table_name)) as snapshot
from (
  select
    table_schema,
    table_name,
    table_type
  from information_schema.tables
  where table_schema = 'public'
) t;

select
  'columns' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(c) order by c.table_name, c.ordinal_position)) as snapshot
from (
  select
    table_name,
    ordinal_position,
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
  from information_schema.columns
  where table_schema = 'public'
    and table_name in ('profiles', 'subscriptions', 'generations', 'usage_limits', 'documents', 'rate_limits', 'usage_events', 'audit_logs')
) c;

select
  'constraints' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(c) order by c.table_name, c.constraint_name)) as snapshot
from (
  select
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    pg_get_constraintdef(pc.oid) as definition
  from information_schema.table_constraints tc
  join pg_constraint pc on pc.conname = tc.constraint_name
  join pg_namespace pn on pn.oid = pc.connamespace and pn.nspname = tc.table_schema
  where tc.table_schema = 'public'
    and tc.table_name in ('profiles', 'subscriptions', 'generations', 'usage_limits', 'documents', 'rate_limits', 'usage_events', 'audit_logs')
) c;

select
  'indexes' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(i) order by i.tablename, i.indexname)) as snapshot
from (
  select
    tablename,
    indexname,
    indexdef
  from pg_indexes
  where schemaname = 'public'
    and tablename in ('profiles', 'subscriptions', 'generations', 'usage_limits', 'documents', 'rate_limits', 'usage_events', 'audit_logs')
) i;

select
  'rls' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(r) order by r.relname)) as snapshot
from (
  select
    c.relname,
    c.relrowsecurity,
    c.relforcerowsecurity
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relname in ('profiles', 'subscriptions', 'generations', 'usage_limits', 'documents', 'rate_limits', 'usage_events', 'audit_logs')
) r;

select
  'policies' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(p) order by p.tablename, p.policyname)) as snapshot
from (
  select
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
  from pg_policies
  where schemaname = 'public'
    and tablename in ('profiles', 'subscriptions', 'generations', 'usage_limits', 'documents', 'rate_limits', 'usage_events', 'audit_logs')
) p;

select
  'triggers' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(t) order by t.event_object_table, t.trigger_name)) as snapshot
from (
  select
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
  from information_schema.triggers
  where trigger_schema in ('public', 'auth')
    and (
      event_object_table in ('profiles', 'subscriptions', 'documents', 'users')
      or trigger_name = 'on_auth_user_created'
    )
) t;

select
  'usage_limits_data' as section,
  jsonb_pretty(jsonb_agg(to_jsonb(u) order by u.plan)) as snapshot
from public.usage_limits u;
