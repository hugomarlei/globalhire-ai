-- =============================================================================
-- GlobalHire AI — controlled test / pre-launch data cleanup (DATA ONLY)
-- =============================================================================
-- Objetivo: remover dados operacionais de contas de teste mantendo schema,
-- RLS, policies, buckets (não tocados aqui), triggers e configuração Stripe
-- no painel (este script NÃO chama API Stripe).
--
-- O que NÃO faz:
--   - Não DROP/TRUNCATE de schema, não altera RLS/policies, buckets, migrations.
--   - Não apaga auth.users automaticamente (bloco opcional comentado no final).
--   - Não mexe em public.usage_limits (dados de configuração de planos).
--
-- O que faz:
--   - Esvazia public.rate_limits (estado efêmero).
--   - Apaga public.usage_events e public.audit_logs se as tabelas existirem.
--   - Apaga todos os public.profiles exceto e-mails na lista PRESERVED_EMAILS
--     abaixo. Filhos com ON DELETE CASCADE (subscriptions, generations,
--     documents) são removidos pelo PostgreSQL automaticamente.
--
-- AVISO — Stripe:
--   Linhas em public.subscriptions serão removidas para usuários não preservados.
--   Clientes/assinaturas podem continuar existindo no Stripe até você cancelar
--   ou arquivar no Dashboard. Webhooks podem recriar linhas ao logar de novo.
--   Execute apenas em ambiente de staging / projeto de teste com backup.
--
-- Pré-requisito:
--   Deve existir pelo menos um public.profiles cujo e-mail (normalizado) está
--   em PRESERVED_EMAILS (ex.: conta do operador de go-live).
--
-- PKs são UUID; não há SERIAL — RESTART IDENTITY não se aplica.
--
-- NÃO execute em produção sem backup e revisão explícita da lista de e-mails.
-- =============================================================================

begin;

do $body$
declare
  -- E-mails cujos perfis (e dados em CASCADE) NÃO serão apagados.
  -- Adicione outros somente se precisar manter contas beta reais.
  preserved_emails text[] := array[
    'hugomarcianoleite@gmail.com'
  ];
  keep_count int;
begin
  -- Normaliza para comparação segura (trim + lower).
  select count(*) into keep_count
  from public.profiles p
  where lower(trim(coalesce(p.email, ''))) = any (
    select lower(trim(e)) from unnest(preserved_emails) as u(e)
  );

  if keep_count < 1 then
    raise exception
      'controlled_test_data_cleanup: nenhum perfil encontrado para PRESERVED_EMAILS. Abortando para evitar DELETE total acidental.';
  end if;

  -- -------------------------------------------------------------------------
  -- 1) Rate limits (sem FK para profiles; seguro esvaziar)
  -- -------------------------------------------------------------------------
  delete from public.rate_limits;

  -- -------------------------------------------------------------------------
  -- 2) Eventos / auditoria opcionais (evita linhas órfãs com user_id NULL
  --    após remoção de perfis, pois FK é ON DELETE SET NULL neste repo)
  -- -------------------------------------------------------------------------
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'usage_events'
  ) then
    execute 'delete from public.usage_events';
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'audit_logs'
  ) then
    execute 'delete from public.audit_logs';
  end if;

  -- -------------------------------------------------------------------------
  -- 3) Perfis de teste — CASCADE remove subscriptions, generations, documents
  --    ligados por user_id → profiles(id).
  -- -------------------------------------------------------------------------
  delete from public.profiles p
  where not (
    lower(trim(coalesce(p.email, ''))) = any (
      select lower(trim(e)) from unnest(preserved_emails) as u(e)
    )
  );

  -- -------------------------------------------------------------------------
  -- 4) Higiene de flags nos perfis restantes (alinhado a cleanup_admin_flags)
  -- -------------------------------------------------------------------------
  update public.profiles
  set is_blocked = false;

  update public.profiles
  set is_admin = (lower(trim(coalesce(email, ''))) = 'hugomarcianoleite@gmail.com');

  -- -------------------------------------------------------------------------
  -- 5) Pós-condição: todo perfil remanescente deve estar na allowlist
  -- -------------------------------------------------------------------------
  if exists (
    select 1 from public.profiles p
    where not (
      lower(trim(coalesce(p.email, ''))) = any (
        select lower(trim(e)) from unnest(preserved_emails) as u(e)
      )
    )
  ) then
    raise exception 'controlled_test_data_cleanup: ainda existem perfis fora de PRESERVED_EMAILS (falha de consistência).';
  end if;
end
$body$;

commit;


-- =============================================================================
-- OPTIONAL: DELETE TEST AUTH USERS  (NÃO EXECUTE SEM REVISÃO MANUAL)
-- =============================================================================
-- Contexto: após o script acima, auth.users pode ainda conter logins órfãos
-- (sem linha em public.profiles). O trigger handle_new_user recria profile no
-- próximo sign-in; limpar auth.users evita reentrada acidental com a mesma conta.
--
-- Riscos:
--   - Irreversível sem backup; invalida sessões OAuth / magic link.
--   - NUNCA use WHERE genérico em produção sem listar IDs ou e-mails alvo.
--   - Supabase recomenda operar no Dashboard (Authentication > Users) ou API
--     Admin com lista explícita de testadores.
--
-- Exemplo SEGURO (substitua pela lista real de e-mails de teste):
--
-- begin;
-- delete from auth.users u
-- where lower(trim(coalesce(u.email::text, ''))) in (
--   lower('hugo.master21@gmail.com')
--   -- adicione outros e-mails de teste aqui
-- )
--   and lower(trim(coalesce(u.email::text, ''))) <> 'hugomarcianoleite@gmail.com';
-- commit;
--
-- Depois: verifique Authentication no Dashboard e confirme que apenas contas
-- desejadas permaneceram.
-- =============================================================================
