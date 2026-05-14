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
    <main className="brand-shell relative min-h-screen overflow-hidden text-shell-fg">
      <div className="brand-grid pointer-events-none absolute inset-0" />
      <PublicNav />
      {showLogoutBanner ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/8 p-4 text-sm text-shell-muted sm:flex-row sm:items-center sm:justify-between">
            <span>{copy.logoutBanner}</span>
            <div className="flex flex-wrap gap-2">
              <Button href="/cadastro" className="h-9 px-3">
                {copy.primaryCta}
              </Button>
              <a
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-9 items-center justify-center rounded-xl border border-shell-line/15 bg-shell-glass/12 px-3 text-sm font-semibold text-shell-fg transition hover:bg-shell-glass/18"
              >
                {copy.shareLabel}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-12 sm:px-6 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28 lg:pt-24">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-brand-500/22 bg-brand-500/10 px-3 py-1.5 text-sm font-semibold text-brand-700 dark:text-brand-100">
            {copy.heroTagline}
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-medium tracking-tight text-shell-fg sm:text-5xl lg:text-[3.35rem] lg:leading-[1.06]">
            {copy.headline}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-shell-muted/95">{copy.subheadline}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/cadastro" className="h-12 rounded-xl px-6">
              {copy.primaryCta} <ArrowRight size={18} />
            </Button>
            <Button
              href="#precos"
              className="h-12 rounded-xl border border-shell-line/18 bg-shell-glass/10 text-shell-fg shadow-none transition hover:bg-shell-glass/16"
            >
              {copy.secondaryCta}
            </Button>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {copy.stats.map(([value, label]) => (
              <div key={value} className="rounded-xl border border-shell-line/12 bg-shell-glass/6 p-3.5 sm:p-4">
                <p className="text-xl font-semibold text-brand-600 dark:text-brand-500">{value}</p>
                <p className="mt-1.5 text-xs leading-snug text-shell-subtle">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-shell-subtle/90">{copy.honestyLine}</p>
        </div>

        <Card className="relative overflow-hidden rounded-2xl p-5 shadow-soft">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
          <div className="rounded-xl border border-white/12 bg-ink/92 p-5 text-white shadow-inner backdrop-blur-sm dark:border-white/10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-white/60">{copy.scoreMockLabel}</p>
                <p className="mt-1 text-xl font-semibold text-white">{copy.scoreMockSubtitle}</p>
              </div>
              <Gauge className="shrink-0 text-brand-400" size={28} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/12 bg-black/25 p-4">
                <p className="text-sm text-white/70">{copy.scoreBefore}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-white/90">42%</p>
                <div className="mt-4 h-2 rounded-full bg-white/12">
                  <div className="h-2 w-[42%] rounded-full bg-white/35" />
                </div>
              </div>
              <div className="rounded-lg border border-brand-500/35 bg-brand-500/15 p-4">
                <p className="text-sm text-brand-50">{copy.scoreAfter}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-brand-200">91%</p>
                <div className="mt-4 h-2 rounded-full bg-white/12">
                  <div className="h-2 w-[91%] rounded-full bg-brand-400" />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-brand-500/22 bg-brand-50/95 p-4 text-ink dark:border-brand-500/28 dark:bg-brand-50/15 dark:text-brand-50">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-100">{copy.scoreHintTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-graphite/88 dark:text-brand-50/90">{copy.scoreHintBody}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="relative border-y border-shell-line/10 bg-shell-band/4 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 md:gap-6">
          {copy.truthCards.map(([title, text]) => (
            <Card key={title} className="rounded-2xl transition hover:border-brand-500/35">
              <h2 className="font-display mt-1 text-xl font-medium text-shell-fg">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-shell-muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28">
        <h2 className="font-display text-3xl font-medium tracking-tight text-shell-fg sm:text-[2rem]">{copy.howItWorks}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {copy.howItWorksCards.map((step, index) => {
            const Icon = howIcons[index] ?? FileText;
            return (
              <Card key={step.title} className="rounded-2xl transition hover:border-brand-500/35">
                <span className="grid size-12 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon size={20} />
                </span>
                <p className="font-display mt-5 text-lg font-medium text-shell-fg">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-shell-muted">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-shell-fg sm:text-[2rem]">{copy.featuresSectionTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-shell-muted">{copy.featuresSectionLead}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {copy.benefits.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-xl border border-shell-line/12 bg-shell-glass/6 p-4 transition hover:border-shell-line/20"
              >
                <CheckCircle2 className="shrink-0 text-brand-600 dark:text-brand-400" size={18} />
                <span className="text-sm leading-snug text-shell-fg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-shell-line/10 bg-shell-band/4 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-medium tracking-tight text-shell-fg sm:text-[2rem]">{copy.whoTitle}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {copy.whoLines.map((text) => (
              <Card key={text} className="rounded-2xl transition hover:border-brand-500/35">
                <Globe2 className="text-brand-600 dark:text-brand-400" size={24} />
                <p className="mt-4 text-sm leading-relaxed text-shell-muted">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28">
        <h2 className="font-display text-3xl font-medium tracking-tight text-shell-fg sm:text-[2rem]">{copy.pricingSectionTitle}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-shell-muted">{copy.pricingLead}</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-4 lg:gap-6">
          {[free, ...paid].map((plan) => (
            <Card
              key={plan.id}
              className={`flex h-full flex-col rounded-2xl transition ${
                plan.id === "pro" ? "border-brand-500/55 shadow-glow ring-1 ring-brand-500/15" : "hover:border-shell-line/22"
              }`}
            >
              {plan.id === "pro" ? (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">{copy.recommendedBadge}</p>
              ) : null}
              <h3 className="font-display text-2xl font-medium text-shell-fg">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-shell-fg">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-sm text-shell-muted">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" size={17} />
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
        <p className="mt-6 text-xs leading-relaxed text-shell-subtle">{copy.pricingDisclaimer}</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 sm:pb-28">
        <h2 className="font-display text-3xl font-medium tracking-tight text-shell-fg sm:text-[2rem]">{copy.faqTitle}</h2>
        <div className="mt-10 space-y-4">
          {copy.marketingFaqs.map(([question, answer]) => (
            <Card key={question} className="rounded-2xl">
              <h3 className="font-medium text-shell-fg">{question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-shell-muted">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-28 text-center sm:px-6 sm:pb-32">
        <Sparkles className="mx-auto text-brand-600 dark:text-brand-400" size={30} />
        <h2 className="font-display mt-6 text-3xl font-medium tracking-tight text-shell-fg sm:text-[2.25rem]">{copy.finalCtaTitle}</h2>
        <Button href="/cadastro" className="mt-10 rounded-xl px-8">
          {copy.finalCtaButton}
        </Button>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
