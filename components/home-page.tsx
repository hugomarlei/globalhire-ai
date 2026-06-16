"use client";

import { ArrowRight, CheckCircle2, FileText, Gauge, Globe2, Languages, MessageSquareText, ShieldCheck, Sparkles, Target, Wand2, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LogoutShareActions } from "@/components/logout-share-actions";
import { PublicNav } from "@/components/nav";
import { PublicBand, PublicCard, PublicKicker, PublicPageShell, PublicSection } from "@/components/public-page-shell";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import type { StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

const userApproval = [
  {
    quote:
      "Eu finalmente consegui enxergar por que meu currículo parecia bom para mim, mas não conversava com a vaga.",
    author: "Profissional em recolocação",
    context: "Usou score de aderência e reescrita por vaga"
  },
  {
    quote:
      "A diferença foi sair de um texto genérico para uma candidatura com mais evidência, palavras certas e menos improviso.",
    author: "Candidato a vaga internacional",
    context: "Gerou currículo adaptado e mensagem para recrutador"
  },
  {
    quote:
      "O mais útil foi comparar lacunas antes de enviar. Eu parei de mandar o mesmo currículo para toda oportunidade.",
    author: "Profissional técnico B2B",
    context: "Usou análise ATS e preview do documento"
  }
];

const productSteps = [
  ["Lê a vaga", "Extrai requisitos, senioridade, responsabilidades e termos recorrentes."],
  ["Mapeia lacunas", "Mostra o que seu currículo ainda não sinaliza com clareza."],
  ["Reescreve com evidência", "Melhora a narrativa usando apenas experiência real do candidato."],
  ["Gera materiais", "Cria currículo, carta, LinkedIn, mensagem, tradução e preparo para entrevista."],
  ["Mostra alinhamento", "Exibe score simulado para orientar revisão antes do envio."],
  ["Mantém rastreabilidade", "Salva histórico de candidaturas e documentos gerados."]
];

const atsSignals = [
  "Palavras-chave da vaga",
  "Competências obrigatórias",
  "Senioridade esperada",
  "Idioma e mercado",
  "Clareza de impacto",
  "Formato legível para ATS"
];

const tools: Array<[string, string, LucideIcon]> = [
  ["Currículo ATS por vaga", "Transforma seu currículo em uma versão mais aderente a uma oportunidade específica.", FileText],
  ["Reescrita de currículo", "Refina resumo e experiências sem inventar cargos, métricas ou resultados.", Wand2],
  ["Score de aderência", "Mostra um match estimado para orientar ajustes antes da candidatura.", Gauge],
  ["Carta de apresentação", "Conecta sua experiência ao contexto da empresa e da vaga.", FileText],
  ["LinkedIn profissional", "Reposiciona seu resumo para recrutadores e oportunidades internacionais.", Globe2],
  ["Mensagem para recrutador", "Cria uma abordagem curta, educada e relevante para iniciar conversa.", MessageSquareText],
  ["Tradução de currículo", "Adapta idioma e tom sem perder a estrutura do documento.", Languages],
  ["Preparação para entrevista", "Organiza perguntas prováveis, respostas e riscos para você treinar melhor.", Target]
];

const audiences = [
  "Brasileiros buscando recolocação com mais estratégia.",
  "Profissionais tentando vagas remotas ou internacionais.",
  "Candidatos que enviam currículo e quase nunca recebem retorno.",
  "Pessoas que precisam adaptar documento por país, idioma ou vaga.",
  "Quem quer entender como ATS, recrutador e IA avaliam uma candidatura."
];

const faqs = [
  [
    "A GlobalHire AI garante entrevista?",
    "Não. A plataforma melhora clareza, aderência e apresentação dos seus materiais, mas entrevista depende da empresa, da vaga, do mercado e da concorrência."
  ],
  [
    "O score é garantia de aprovação?",
    "Não. O score é uma pontuação simulada de alinhamento com a vaga. Ele ajuda a revisar melhor, mas não representa aprovação automática em ATS ou recrutamento."
  ],
  [
    "A IA inventa experiências?",
    "Não deve inventar. A geração foi desenhada para reescrever com base no que você informa. Mesmo assim, você deve revisar tudo antes de enviar."
  ],
  [
    "Posso usar para vagas no Brasil?",
    "Sim. A GlobalHire AI funciona para vagas no Brasil, vagas remotas e processos internacionais."
  ],
  [
    "Posso usar para vagas internacionais?",
    "Sim. Você pode ajustar idioma, país-alvo e tom do documento para diferentes mercados."
  ],
  [
    "O plano gratuito inclui quais ferramentas?",
    "O Free libera acesso de degustação às principais ferramentas para você testar currículo, análise, reescrita e materiais de candidatura."
  ],
  [
    "Meus dados ficam protegidos?",
    "A plataforma usa autenticação, políticas de privacidade e provedores reconhecidos. Evite enviar dados sensíveis desnecessários e revise as políticas legais antes de usar."
  ]
];

function HeroMockup() {
  return (
    <div className="rounded-lg border border-border/80 bg-card p-3 shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
      <div className="rounded-lg border border-border/80 bg-background p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-sm font-semibold text-foreground">Análise de candidatura</p>
            <p className="mt-1 text-xs text-muted-foreground">Gerente Comercial - Automação Industrial</p>
          </div>
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Match estimado 89%
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-medium text-muted-foreground">Currículo enviado</p>
            <div className="mt-3 space-y-2">
              <span className="block h-2 rounded bg-muted" />
              <span className="block h-2 w-5/6 rounded bg-muted" />
              <span className="block h-2 w-2/3 rounded bg-muted" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-medium text-muted-foreground">Vaga analisada</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["B2B", "CRM", "KPI", "Canais"].map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
            <p className="text-xs font-medium text-primary">Pontos ausentes</p>
            <ul className="mt-2 space-y-1 text-xs text-foreground">
              <li>Gestão de canais</li>
              <li>Carteira e forecast</li>
              <li>Negociação complexa</li>
            </ul>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-semibold text-muted-foreground">Antes</p>
            <p className="mt-2 text-sm text-foreground">Responsável por relatórios e reuniões.</p>
          </div>
          <div className="rounded-lg border border-primary/35 bg-primary/10 p-3">
            <p className="text-xs font-semibold text-primary">Depois</p>
            <p className="mt-2 text-sm text-foreground">
              Produziu análises comerciais semanais para liderança, consolidando indicadores de receita e apoiando decisões estratégicas com base em dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage({ stripeCatalog }: { stripeCatalog: StripePriceCatalogJson | null }) {
  const { locale } = useLanguage();
  const [showLogoutBanner, setShowLogoutBanner] = useState(false);
  void stripeCatalog;

  useEffect(() => {
    setShowLogoutBanner(new URLSearchParams(window.location.search).get("logout") === "success");
  }, []);

  return (
    <PublicPageShell>
      <PublicNav />
      {showLogoutBanner ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm text-muted-foreground">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-foreground">Você saiu da sua conta. Volte quando quiser para continuar suas candidaturas.</span>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button href="/cadastro" className="h-9 px-3">
                  Criar candidatura grátis
                </Button>
                <LogoutShareActions />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:pb-20 lg:pt-20">
        <div className="max-w-3xl">
          <PublicKicker>Carreira, IA e recrutamento no mesmo campo de jogo</PublicKicker>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.04] text-foreground sm:text-5xl lg:text-6xl">
            E se você apresentasse o seu melhor de uma maneira diferente?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A GlobalHire AI analisa a vaga, entende os critérios de triagem e transforma seu currículo para aumentar o match com a vaga.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/cadastro" className="h-12 px-6">
              Criar candidatura grátis <ArrowRight size={18} />
            </Button>
            <Button
              href="#como-funciona"
              className="h-12 border border-border bg-card px-6 text-foreground shadow-none hover:bg-muted"
            >
              Ver como funciona
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Sem promessa de emprego. Com mais clareza, aderência e estratégia.
          </p>
        </div>
        <HeroMockup />
      </section>

      <PublicBand className="py-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <PublicKicker>Relatos de uso</PublicKicker>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              Aprovação vem de clareza, não de promessa.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              A experiência foi desenhada para mostrar o que muda entre um currículo genérico e uma candidatura alinhada à vaga. Resultados variam por mercado, perfil e processo seletivo.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {userApproval.map((item) => (
              <figure key={item.author} className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
                <div className="flex gap-1 text-primary" aria-label="Avaliação positiva">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Sparkles key={index} size={14} fill="currentColor" strokeWidth={1.5} />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-6 text-foreground">“{item.quote}”</blockquote>
                <figcaption className="mt-4 border-t border-border pt-3">
                  <p className="text-sm font-semibold text-foreground">{item.author}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.context}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </PublicBand>

      <PublicSection>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <PublicKicker>O problema</PublicKicker>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Seu currículo pode estar bom e ainda assim ser ignorado.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Hoje, muitas candidaturas passam por filtros, sistemas ATS e triagens automatizadas antes de chegarem a uma pessoa. O problema não é apenas ter experiência. É apresentar essa experiência na linguagem certa para a vaga certa.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PublicCard>
              <p className="text-sm font-semibold text-muted-foreground">Currículo genérico</p>
              <p className="mt-3 text-4xl font-semibold text-foreground">42%</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Baixa aderência porque a experiência não conversa com os requisitos da vaga.</p>
            </PublicCard>
            <PublicCard className="border-primary/35 bg-primary/10">
              <p className="text-sm font-semibold text-primary">Currículo adaptado</p>
              <p className="mt-3 text-4xl font-semibold text-foreground">89%</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Mais clareza, palavras-chave reais e impacto profissional melhor sinalizado.</p>
            </PublicCard>
          </div>
        </div>
      </PublicSection>

      <PublicBand tone="dark" id="como-funciona">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <PublicKicker dark>Como funciona</PublicKicker>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Uma camada de inteligência entre você e a vaga.
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-300">
              A plataforma cruza seu histórico com a descrição da oportunidade para mostrar onde sua candidatura precisa ficar mais forte.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {productSteps.map(([title, text]) => (
              <PublicCard key={title} dark>
                <CheckCircle2 className="text-teal-300" size={18} />
                <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
              </PublicCard>
            ))}
          </div>
        </div>
      </PublicBand>

      <PublicSection>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <PublicKicker>Antes e depois</PublicKicker>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Reescrever não é enfeitar. É transformar responsabilidade em evidência.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              O texto não inventa experiência. Ele tira sua contribuição do modo genérico e mostra valor profissional com mais precisão.
            </p>
          </div>
          <div className="grid gap-3">
            <PublicCard>
              <p className="text-sm font-semibold text-muted-foreground">Antes</p>
              <p className="mt-3 text-xl font-medium text-foreground">Responsável por relatórios e reuniões.</p>
            </PublicCard>
            <PublicCard className="border-primary/35 bg-primary/10">
              <p className="text-sm font-semibold text-primary">Depois</p>
              <p className="mt-3 text-xl font-medium leading-8 text-foreground">
                Produziu análises comerciais semanais para liderança, consolidando indicadores de receita e apoiando decisões estratégicas com base em dados.
              </p>
            </PublicCard>
          </div>
        </div>
      </PublicSection>

      <PublicBand tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <PublicKicker dark>Inteligência ATS</PublicKicker>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              O que a IA procura, a sua candidatura precisa sinalizar.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {atsSignals.map((signal) => (
                <div key={signal} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-zinc-200">
                  {signal}
                </div>
              ))}
            </div>
          </div>
          <PublicCard dark className="border-teal-300/25 bg-teal-300/[0.06]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal-300">Pontuação de alinhamento</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">Exemplo ilustrativo baseado em score simulado de aderência.</p>
              </div>
              <ShieldCheck className="text-teal-300" size={24} />
            </div>
            <div className="mt-6 grid gap-4">
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Antes</span>
                  <span>42%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[42%] rounded-full bg-zinc-400" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Depois</span>
                  <span>89%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[89%] rounded-full bg-teal-300" />
                </div>
              </div>
            </div>
            <p className="mt-5 text-xs leading-5 text-zinc-400">
              Não representa garantia de entrevista, aprovação ou passagem automática em ATS.
            </p>
          </PublicCard>
        </div>
      </PublicBand>

      <PublicSection>
        <div className="max-w-3xl">
          <PublicKicker>Ferramentas reais</PublicKicker>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Tudo que você precisa para sair do currículo genérico.
          </h2>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map(([title, text, Icon]) => (
            <PublicCard key={title}>
              <Icon className="text-primary" size={20} />
              <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </PublicCard>
          ))}
        </div>
      </PublicSection>

      <PublicBand>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <PublicKicker>Para quem</PublicKicker>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Feito para quem precisa competir melhor.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-border/80 bg-card/80 p-4 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </PublicBand>

      <PublicSection className="text-center">
        <div className="mx-auto max-w-3xl">
          <Sparkles className="mx-auto text-primary" size={28} />
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Antes de enviar o próximo currículo, veja como ele conversa com a vaga.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Crie uma candidatura grátis, veja seu score de aderência e gere uma versão mais estratégica dos seus documentos.
          </p>
          <Button href="/cadastro" className="mt-8 h-12 px-7">
            Começar grátis <ArrowRight size={18} />
          </Button>
        </div>
      </PublicSection>

      <PublicBand>
        <div className="mx-auto max-w-4xl">
          <PublicKicker>FAQ</PublicKicker>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">Perguntas diretas antes de começar.</h2>
          <div className="mt-8 grid gap-3">
            {faqs.map(([question, answer]) => (
              <PublicCard key={question}>
                <h3 className="font-semibold text-foreground">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
              </PublicCard>
            ))}
          </div>
        </div>
      </PublicBand>

      <SiteFooter locale={locale} />
    </PublicPageShell>
  );
}
