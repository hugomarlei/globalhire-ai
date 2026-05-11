# 12. Checklists Finais

## Checklist de produção

- [ ] `NEXT_PUBLIC_APP_URL=https://www.globalhireai.com.br` na Vercel.
- [ ] Supabase Site URL configurada.
- [ ] Google OAuth redirect URLs configuradas.
- [ ] Stripe webhook em produção configurado.
- [ ] Stripe Price IDs começam com `price_`.
- [ ] Turnstile aceita `www.globalhireai.com.br`.
- [ ] `/sitemap.xml` responde XML válido.
- [ ] `/robots.txt` responde e aponta para sitemap.
- [ ] Login, checkout, webhook e geração testados.
- [ ] Logs Vercel revisados após deploy.

## Checklist compliance/LGPD

- [ ] Política de Privacidade publicada.
- [ ] Termos de Uso publicados.
- [ ] Política de Cookies publicada.
- [ ] Banner de consentimento funcionando.
- [ ] Analytics bloqueado antes do consentimento.
- [ ] Canal `privacy@globalhireai.com.br` ativo.
- [ ] Rotina de exclusão de conta testada.
- [ ] Retenção de dados definida.
- [ ] DPAs/termos de fornecedores revisados.
- [ ] Registro de solicitações LGPD criado.

## Checklist SEO

- [ ] Metadata global revisada.
- [ ] Metadata específica em páginas públicas principais.
- [ ] OG image real em `public/brand/og-image.png`.
- [ ] Favicon real em `public/brand/favicon.ico`.
- [ ] Sitemap enviado ao Google Search Console.
- [ ] JSON-LD validado.
- [ ] Páginas privadas bloqueadas.
- [ ] Lighthouse produção executado.

## Checklist segurança

- [x] Headers/CSP implementados.
- [ ] Segredos apenas em Vercel server env.
- [ ] RLS revisado.
- [x] Rate limit distribuído implementado com Supabase e fallback local.
- [x] CSRF/Origin check em endpoints sensíveis.
- [ ] Sentry com scrub PII.
- [ ] Audit logs administrativos.
- [ ] Backup Supabase testado.
- [ ] Admin bypass restrito/removido em produção.

## Checklist analytics

- [ ] GA4 configurado.
- [ ] PostHog configurado.
- [ ] Clarity configurado.
- [ ] Eventos chegando sem PII.
- [ ] Consentimento rejeitado bloqueia scripts.
- [ ] Clarity masking validado visualmente.
- [ ] Funil signup → geração → upgrade criado.
