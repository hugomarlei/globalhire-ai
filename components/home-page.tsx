"use client";

import { ArrowRight, CheckCircle2, FileText, Gauge, Globe2, Sparkles, Target, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";
import { Button, Card } from "@/components/ui";
import { LogoutShareActions } from "@/components/logout-share-actions";
import { landingCopy } from "@/lib/i18n";
import { getLocalizedPlans } from "@/lib/plan-copy";
import type { StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

const howIcons = [FileText, Target, Wand2] as const;

export function HomePage({ stripeCatalog }: { stripeCatalog: StripePriceCatalogJson | null }) {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  // stripeCatalog null → getLocalizedPlans falls back to static plan-copy prices; diagnose with Vercel logs (stripe_pricing_diag).
  const { free, paid } = useMemo(() => getLocalizedPlans(locale, stripeCatalog), [locale, stripeCatalog]);
  const [showLogoutBanner, setShowLogoutBanner] = useState(false);

  useEffect(() => {
    setShowLogoutBanner(new URLSearchParams(window.location.search).get("logout") === "success");
  }, []);

  return (
    <main className="brand-shell relative min-h-screen overflow-hidden text-foreground">
      <div className="brand-grid pointer-events-none absolute inset-0" />
      <PublicNav />
      {showLogoutBanner ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm text-muted-foreground">
            <span className="text-foreground">{copy.logoutBanner}</span>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href="/cadastro" className="h-9 w-full px-3 sm:w-auto">
                {copy.primaryCta}
              </Button>
              <LogoutShareActions />
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:pb-20 lg:pt-24">
        <div className="space-y-8">
          <p className="inline-flex max-w-prose rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy.heroTagline}
          </p>
          <div className="space-y-5">
            <h1 className="font-display max-w-4xl text-[2.25rem] font-medium leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.04]">
              {copy.headline}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{copy.subheadline}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/cadastro" className="h-12 rounded-xl px-6">
              {copy.primaryCta} <ArrowRight size={18} />
            </Button>
            <Button
              href="#precos"
              className="h-12 rounded-xl border border-border bg-muted/50 text-foreground shadow-none hover:bg-muted"
            >
              {copy.secondaryCta}
            </Button>
          </div>
          <div className="grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {copy.stats.map(([value, label]) => (
              <div key={`${value}-${label}`} className="rounded-2xl border border-border bg-card/70 p-3.5 shadow-sm sm:p-4">
                <p className="text-xl font-semibold tracking-tight text-primary">{value}</p>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy.honestyLine}</p>
        </div>

        <Card className="overflow-hidden rounded-[28px] border-border/80 bg-card/95 p-0 shadow-[0_24px_100px_rgba(0,0,0,0.24)]">
          <div className="border-b border-border/70 bg-muted/20 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.previewLabel}</p>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">{copy.previewText}</p>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {copy.scoreMockLabel}
              </span>
            </div>
          </div>
          <div className="grid gap-4 p-5">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">Fluxo de candidatura</p>
                <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                  {copy.steps.length} etapas
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {copy.steps.map((step, index) => {
                  const Icon = howIcons[index] ?? FileText;
                  return (
                    <div key={step.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {copy.previewItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Score</p>
                  <Gauge className="text-primary" size={18} aria-hidden />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">18 → 82</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Visão clara do progresso antes da exportação.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Próximo passo</p>
                  <Target className="text-primary" size={18} aria-hidden />
                </div>
                <p className="mt-4 text-lg font-semibold text-foreground">Revisar seção mais fraca</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A IA aponta o que ajustar sem esconder o documento.</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="relative border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {copy.featuresSectionTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy.featuresSectionLead}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.featureCards.map((feature, index) => (
              <Card key={feature.title} className="rounded-3xl border-border/70 bg-card/80 p-5 shadow-sm transition hover:border-primary/25">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Sparkles className="text-primary/70" size={18} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-card-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:gap-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.scoreMockLabel}</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.scoreTitle}</h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.scoreText}</p>
            <div className="rounded-2xl border border-border bg-card/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.scoreHintTitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.scoreHintBody}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-3xl border-border/70 bg-card/85 p-5 shadow-sm transition hover:border-border">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.scoreBefore}</p>
                <Target className="text-primary/60" size={18} aria-hidden />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">Currículo genérico</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">42%</p>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div className="h-2 w-[42%] rounded-full bg-muted-foreground/40" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Texto legível, mas ainda sem contexto suficiente para destacar a candidatura.
              </p>
            </Card>
            <Card className="rounded-3xl border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-5 shadow-[0_20px_60px_rgba(45,212,191,0.10)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.scoreAfter}</p>
                <Wand2 className="text-primary" size={18} aria-hidden />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">Versão alinhada</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">82%</p>
              <div className="mt-4 h-2 rounded-full bg-primary/15">
                <div className="h-2 w-[82%] rounded-full bg-primary" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Mais contexto, mais foco e uma leitura mais fácil para o recrutador.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.howItWorks}</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                O fluxo certo, em poucos passos
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              O processo fica mais previsível quando a tela mostra a ordem certa: base, vaga, revisão e saída final.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.howItWorksCards.map((step, index) => {
              const Icon = howIcons[index] ?? FileText;
              return (
                <Card key={step.title} className="rounded-3xl border-border/70 bg-card/80 p-5 shadow-sm transition hover:border-primary/25">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-card-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.benefitsTitle}</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Benefícios práticos</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.featuresSectionLead}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {copy.benefits.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card/75 p-4 shadow-sm transition hover:border-primary/25"
              >
                <CheckCircle2 className="shrink-0 text-primary" size={18} />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.whoTitle}</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Para quem o fluxo faz mais diferença
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.whoLines.map((text) => (
              <Card key={text} className="rounded-3xl border-border/70 bg-card/80 p-5 shadow-sm transition hover:border-primary/25">
                <Globe2 className="text-primary" size={24} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.pricingTitle}</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {copy.pricingSectionTitle}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{copy.pricingLead}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {[free, ...paid].map((plan) => (
            <Card
              key={plan.id}
              className={`flex h-full flex-col rounded-3xl border-border/70 bg-card/80 p-5 shadow-sm ${
                plan.id === "pro" ? "border-primary/50 ring-1 ring-primary/15" : "transition hover:border-primary/25"
              }`}
            >
              {plan.id === "pro" ? (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.recommendedBadge}</p>
              ) : null}
              <h3 className="text-2xl font-semibold tracking-tight text-card-foreground">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-card-foreground">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button href="/cadastro" className="mt-auto w-full rounded-xl">
                {copy.planCta}
              </Button>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{copy.pricingDisclaimer}</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.faqTitle}</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Perguntas que valem antes de começar
          </h2>
        </div>
        <div className="mt-8 space-y-4">
          {copy.marketingFaqs.map(([question, answer]) => (
            <Card key={question} className="rounded-3xl border-border/70 bg-card/80 p-5 shadow-sm">
              <h3 className="font-medium text-card-foreground">{question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6 lg:pb-32">
        <Sparkles className="mx-auto text-primary" size={30} />
        <h2 className="font-display mt-8 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.finalCtaTitle}</h2>
        <Button href="/cadastro" className="mt-10 rounded-xl px-8">
          {copy.finalCtaButton}
        </Button>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
