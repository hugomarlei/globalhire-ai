-- =============================================================================
-- GlobalHire AI — DRY RUN: contagens apenas (não apaga dados)
-- =============================================================================
-- Rode no SQL Editor do Supabase (ou psql) para inspecionar volume antes do
-- controlled_test_data_cleanup.sql. Mensagens aparecem em "Messages" / NOTICE.
-- =============================================================================

do $dry$
declare
  tbl text;
  cnt bigint;
  known_tables text[] := array[
    'profiles',
    'subscriptions',
    'generations',
    'documents',
    'rate_limits',
    'usage_limits',
    'usage_events',
    'audit_logs'
  ];
begin
  raise notice '=== Contagens por tabela (public) ===';
  foreach tbl in array known_tables
  loop
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = tbl
    ) then
      execute format('select count(*)::bigint from public.%I', tbl) into cnt;
      raise notice '% : % rows', tbl, cnt;
    else
      raise notice '% : (tabela ausente neste projeto)', tbl;
    end if;
  end loop;
end
$dry$;

-- Perfis que correspondem ao operador preservado no script principal
select
  count(*) filter (
    where lower(trim(coalesce(email, ''))) = 'hugomarcianoleite@gmail.com'
  ) as profiles_matching_hugomarcianoleite,
  count(*) filter (
    where lower(trim(coalesce(email, ''))) = 'hugo.master21@gmail.com'
  ) as profiles_matching_hugo_master21,
  count(*) as profiles_total
from public.profiles;

-- Quantos perfis SERIAM removidos com PRESERVED_EMAILS = apenas hugomarcianoleite@
select count(*) as profiles_would_delete_non_preserved
from public.profiles p
where not (lower(trim(coalesce(p.email, ''))) = 'hugomarcianoleite@gmail.com');

-- Lembrete operacional (não é query ao Stripe)
select
  'Apagar subscriptions no Postgres não cancela assinaturas no Stripe; '
  || 'revise o Dashboard Stripe para contas de teste.' as stripe_note;
