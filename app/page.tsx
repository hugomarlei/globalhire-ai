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
    <main className="brand-shell relative min-h-screen overflow-hidden text-white">
      <div className="brand-grid pointer-events-none absolute inset-0" />
      <PublicNav />
      {showLogoutBanner ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 rounded-lg border border-brand-500/25 bg-brand-500/10 p-4 text-sm text-white/78 sm:flex-row sm:items-center sm:justify-between">
            <span>{copy.logoutBanner}</span>
            <div className="flex flex-wrap gap-2">
              <Button href="/cadastro" className="h-9 px-3">
                {copy.primaryCta}
              </Button>
              <a
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/8 px-3 text-sm font-semibold text-white hover:bg-white/12"
              >
                {copy.shareLabel}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20 lg:pt-20">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-50">
            {copy.heroTagline}
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">{copy.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">{copy.subheadline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/cadastro">
              {copy.primaryCta} <ArrowRight size={18} />
            </Button>
            <Button href="#precos" className="border border-white/12 bg-white/8 text-white shadow-none hover:bg-white/12">
              {copy.secondaryCta}
            </Button>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            {copy.stats.map(([value, label]) => (
              <div key={value} className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
                <p className="text-xl font-semibold text-brand-500">{value}</p>
                <p className="mt-1 text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/50">{copy.honestyLine}</p>
        </div>

        <Card className="relative overflow-hidden p-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
          <div className="rounded-lg border border-white/10 bg-ink/85 p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">{copy.scoreMockLabel}</p>
                <p className="mt-1 text-xl font-semibold">{copy.scoreMockSubtitle}</p>
              </div>
              <Gauge className="text-brand-500" size={28} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/55">{copy.scoreBefore}</p>
                <p className="mt-3 text-4xl font-semibold text-white/70">42%</p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[42%] rounded-full bg-white/35" />
                </div>
              </div>
              <div className="rounded-md border border-brand-500/30 bg-brand-500/10 p-4">
                <p className="text-sm text-brand-50">{copy.scoreAfter}</p>
                <p className="mt-3 text-4xl font-semibold text-brand-500">91%</p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[91%] rounded-full bg-brand-500" />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-brand-500/20 bg-white p-4 text-ink">
              <p className="text-xs font-semibold uppercase text-brand-700">{copy.scoreHintTitle}</p>
              <p className="mt-2 text-sm leading-6">{copy.scoreHintBody}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="relative border-y border-white/10 bg-white/[0.035] py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
          {copy.truthCards.map(([title, text]) => (
            <Card key={title} className="hover:border-brand-500/35">
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{copy.howItWorks}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.howItWorksCards.map((step, index) => {
            const Icon = howIcons[index] ?? FileText;
            return (
              <Card key={step.title} className="hover:-translate-y-1 hover:border-brand-500/35">
                <span className="grid size-11 place-items-center rounded-md border border-brand-500/40 bg-brand-500/10 text-brand-500">
                  <Icon size={20} />
                </span>
                <p className="mt-4 text-lg font-semibold">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold">{copy.featuresSectionTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">{copy.featuresSectionLead}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.benefits.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.055] p-4 shadow-soft">
                <CheckCircle2 className="shrink-0 text-mint" size={18} />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-white/[0.035] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold">{copy.whoTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.whoLines.map((text) => (
              <Card key={text} className="hover:border-brand-500/35">
                <Globe2 className="text-brand-500" size={24} />
                <p className="mt-4 text-sm leading-6 text-white/72">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{copy.pricingSectionTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">{copy.pricingLead}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {[free, ...paid].map((plan) => (
            <Card
              key={plan.id}
              className={`flex h-full flex-col ${plan.id === "pro" ? "border-brand-500/60 shadow-glow" : "hover:border-white/20"}`}
            >
              {plan.id === "pro" ? (
                <p className="mb-3 text-xs font-semibold uppercase text-brand-500">{copy.recommendedBadge}</p>
              ) : null}
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="shrink-0 text-mint" size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button href="/cadastro" className="mt-auto w-full">
                {copy.planCta}
              </Button>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/45">{copy.pricingDisclaimer}</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{copy.faqTitle}</h2>
        <div className="mt-8 space-y-3">
          {copy.marketingFaqs.map(([question, answer]) => (
            <Card key={question}>
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <Sparkles className="mx-auto text-brand-500" size={30} />
        <h2 className="mt-4 text-4xl font-semibold">{copy.finalCtaTitle}</h2>
        <Button href="/cadastro" className="mt-8">
          {copy.finalCtaButton}
        </Button>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
