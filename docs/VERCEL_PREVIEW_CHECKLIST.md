# Preview / staging na Vercel (branch não-main)

Objetivo: validar builds e comportamento em **URL de Preview**, sem alterar o deployment de produção em `https://www.globalhireai.com.br`.

## Pré-requisitos

- Repositório no GitHub conectado à Vercel (já existente).
- Em **Vercel → Project → Settings → Git**: Production Branch normalmente é `main`. Qualquer **outra branch** com push gera **Preview**.

## 1. Publicar a branch com GitHub Desktop (exato)

1. Abra **GitHub Desktop** e selecione o repositório **globalhire-ai** (pasta `…/2026-05-07 copie/voc-meu-cto-product-manager-desenvolvedor`).
2. Confirme no topo que a branch atual é **`staging/pre-go-live-sync`** (menu *Current Branch*).
3. Se aparecer “**Publish branch**”: clique para criar `staging/pre-go-live-sync` no remoto.  
   Se a branch já existir no GitHub: use **Push origin** (ou *Push*).
4. **Não** faça merge para `main` neste passo.

> Não envie `main` até concluir os testes em Preview, se quiser manter produção estável até aprovação final.

## 2. Onde ver o Preview na Vercel

1. Aceda a [vercel.com](https://vercel.com) → seu **Team** → projeto **GlobalHire AI** (nome pode variar).
2. Abra o separador **Deployments**.
3. Localize o deployment gerado pelo último push da branch `staging/pre-go-live-sync` (badge **Preview**).
4. Clique no deployment → **Visit** (ou copie o domínio `*.vercel.app` indicado).

## 3. Checklist de validação na URL Preview

Marque após verificar:

- [ ] A URL abre (200) e o certificado HTTPS é válido.
- [ ] Não confundir com **Production**: o domínio deve ser o de **preview** (ex.: `…-git-staging-…vercel.app` ou alias de preview).
- [ ] Login / signup (se testar): usar **conta de teste**; preferir Supabase **dev** se o projeto Preview apontar para envs de desenvolvimento. Se Preview usar as **mesmas** envs de produção, tenha cuidado com dados reais.
- [ ] Fluxo crítico mínimo: homepage, `/login`, `/cadastro` carregam.
- [ ] Consola do browser: sem erros graves de CSP (avisos de terceiros podem existir).
- [ ] Confirmar em **Vercel → Deployment → Environment** que este build usou **Preview** envs (se configurou variáveis diferentes por ambiente).

## 4. Variáveis de ambiente Preview vs Production

- Em **Settings → Environment Variables**, confira quais variáveis estão marcadas para **Preview** e para **Production**.
- Recomendação: para testes arriscados, usar chaves **Stripe test** e projeto Supabase **staging** nas envs de Preview apenas (não é alteração feita neste repo; configuração no painel).

## 5. Após validar

- Abrir **Pull Request** de `staging/pre-go-live-sync` → `main` quando estiver pronto (revisão + CI verde).
- Merge só após aprovação explícita do fluxo de release.

## Relacionados

- Relatório de comparação de pastas: [`STAGING_FOLDER_SYNC_REPORT.md`](./STAGING_FOLDER_SYNC_REPORT.md)
- Log de verificação de produção: [`PRODUCTION_VERIFICATION_LOG.md`](./PRODUCTION_VERIFICATION_LOG.md)
