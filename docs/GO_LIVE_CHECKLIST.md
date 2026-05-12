# GlobalHire AI - Go-Live Checklist

## Referências

- Relatório de sync pasta antiga vs repo: [`STAGING_FOLDER_SYNC_REPORT.md`](./STAGING_FOLDER_SYNC_REPORT.md)
- Preview Vercel (branch): [`VERCEL_PREVIEW_CHECKLIST.md`](./VERCEL_PREVIEW_CHECKLIST.md)
- Introspection Supabase (somente leitura): [`../supabase/schema-drift-introspection.sql`](../supabase/schema-drift-introspection.sql)
- CI no repositório: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

## Antes de Abrir ao Público

### Produto e UX

- [ ] Deploy da rodada final concluído.
- [ ] Home mobile mostra `Entrar` e `Criar conta`.
- [ ] Turnstile funciona sem refresh completo.
- [ ] Cadastro testado.
- [ ] Login e-mail/senha testado.
- [ ] Login Google testado.
- [ ] Geração IA testada.
- [ ] ATS Score testado.
- [ ] Upload PDF/DOCX testado.
- [ ] Histórico e exclusão granular testados.
- [ ] Checkout e webhook testados.
- [ ] Supabase introspection revisada (rodar SQL de drift; comparar com `supabase/schema.sql`).
- [ ] CSP sem erros no console.
- [ ] Analytics sem PII.
- [ ] Políticas legais acessíveis.

### Painéis (sem versionar secrets)

- [ ] **Vercel (Production):** todos os **nomes** de variáveis obrigatórias presentes; último deploy verde; domínio `www` ativo.
- [ ] **Stripe Live:** webhook URL produção; eventos necessários; `STRIPE_WEBHOOK_SECRET` live na Vercel; price IDs live coerentes com planos.
- [ ] **Supabase:** Auth URL / Redirect URLs = `https://www.globalhireai.com.br`; RLS e policies conferidas via introspection.
- [ ] **Google OAuth:** redirect e JavaScript origins = `https://www.globalhireai.com.br` (e localhost só se necessário em dev).
- [ ] **Cloudflare:** DNS, proxy, SSL mode; regras que possam injetar CORS — anotar no [`PRODUCTION_VERIFICATION_LOG.md`](./PRODUCTION_VERIFICATION_LOG.md).
- [ ] **GA4 / Clarity:** antes e depois do banner de cookies; DebugView / recording sem currículo ou vaga.

### HTTP público (sanidade)

Reexecutar e, se mudar algo, acrescentar linha no log:

```bash
curl -sSIL "https://www.globalhireai.com.br/" | head -n 45
```

## Pós-Go-Live

- [ ] Monitorar logs Vercel.
- [ ] Monitorar falhas Turnstile.
- [ ] Monitorar Stripe webhooks.
- [ ] Monitorar conversão signup > geração > checkout.
