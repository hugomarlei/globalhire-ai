"use client";

import { ArrowRight, CheckCircle2, FileText, Gauge, Globe2, Sparkles, Target, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";
import { Button, Card } from "@/components/ui";
import { getAppUrl } from "@/lib/app-url";
import { landingCopy } from "@/lib/i18n";
import { getLocalizedPlans } from "@/lib/plan-copy";

const howIcons = [FileText, Target, Wand2] as const;

export default function Home() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  const { free, paid } = useMemo(() => getLocalizedPlans(locale), [locale]);
  const [showLogoutBanner, setShowLogoutBanner] = useState(false);

  useEffect(() => {
    setShowLogoutBanner(new URLSearchParams(window.location.search).get("logout") === "success");
  }, []);

  const shareHref = useMemo(() => {
    const url = encodeURIComponent(getAppUrl());
    return `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
  }, []);

  return (
    <main className="brand-shell relative min-h-screen overflow-hidden text-foreground">
      <div className="brand-grid pointer-events-none absolute inset-0" />
      <PublicNav />
      {showLogoutBanner ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span className="text-foreground">{copy.logoutBanner}</span>
            <div className="flex flex-wrap gap-2">
              <Button href="/cadastro" className="h-9 px-3">
                {copy.primaryCta}
              </Button>
              <a
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-9 items-center justify-center rounded-xl border border-border bg-muted/50 px-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                {copy.shareLabel}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:pb-32 lg:pt-28">
        <div>
          <p className="mb-7 inline-flex max-w-prose rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm sm:normal-case sm:tracking-normal">
            {copy.heroTagline}
          </p>
          <h1 className="font-display max-w-4xl text-[2.25rem] font-medium leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.2rem] lg:leading-[1.05]">
            {copy.headline}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-relaxed text-muted-foreground">{copy.subheadline}</p>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
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
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {copy.stats.map(([value, label]) => (
              <div key={value} className="rounded-xl border border-border bg-muted/35 p-3.5 sm:p-4">
                <p className="text-xl font-semibold text-primary">{value}</p>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{copy.honestyLine}</p>
        </div>

        <Card className="relative overflow-hidden rounded-2xl p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="rounded-xl border border-border/80 bg-ink/93 p-5 text-white shadow-inner">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-white/70">{copy.scoreMockLabel}</p>
                <p className="mt-1 text-xl font-semibold text-white">{copy.scoreMockSubtitle}</p>
              </div>
              <Gauge className="shrink-0 text-primary" size={28} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-black/30 p-4">
                <p className="text-sm font-medium text-white/90">{copy.scoreBefore}</p>
                <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight text-white">42%</p>
                <div className="mt-4 h-2 rounded-full bg-white/15">
                  <div className="h-2 w-[42%] rounded-full bg-white/55" />
                </div>
              </div>
              <div className="rounded-lg border border-emerald-300/45 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 p-4 shadow-inner">
                <p className="text-sm font-semibold text-white">{copy.scoreAfter}</p>
                <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight text-white">91%</p>
                <div className="mt-4 h-2 rounded-full bg-black/30">
                  <div className="h-2 w-[91%] rounded-full bg-emerald-200" />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-white/25 bg-white p-4 text-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">{copy.scoreHintTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{copy.scoreHintBody}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="relative border-y border-border/60 bg-muted/25 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {copy.truthCards.map(([title, text]) => (
            <Card key={title} className="rounded-2xl transition hover:border-primary/35">
              <h2 className="font-display mt-1 text-xl font-medium text-card-foreground">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.howItWorks}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {copy.howItWorksCards.map((step, index) => {
            const Icon = howIcons[index] ?? FileText;
            return (
              <Card key={step.title} className="rounded-2xl transition hover:border-primary/35">
                <span className="grid size-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <p className="font-display mt-6 text-lg font-medium text-card-foreground">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.featuresSectionTitle}</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{copy.featuresSectionLead}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {copy.benefits.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition hover:border-border"
              >
                <CheckCircle2 className="shrink-0 text-primary" size={18} />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-border/60 bg-muted/25 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.whoTitle}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {copy.whoLines.map((text) => (
              <Card key={text} className="rounded-2xl transition hover:border-primary/35">
                <Globe2 className="text-primary" size={24} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.pricingSectionTitle}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy.pricingLead}</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {[free, ...paid].map((plan) => (
            <Card
              key={plan.id}
              className={`flex h-full flex-col rounded-2xl ${
                plan.id === "pro" ? "border-primary/50 shadow-glow ring-1 ring-primary/20" : "transition hover:border-border"
              }`}
            >
              {plan.id === "pro" ? (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">{copy.recommendedBadge}</p>
              ) : null}
              <h3 className="font-display text-2xl font-medium text-card-foreground">{plan.name}</h3>
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
        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{copy.pricingDisclaimer}</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 sm:pb-32">
        <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{copy.faqTitle}</h2>
        <div className="mt-10 space-y-4">
          {copy.marketingFaqs.map(([question, answer]) => (
            <Card key={question} className="rounded-2xl">
              <h3 className="font-medium text-card-foreground">{question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-32 text-center sm:px-6">
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
