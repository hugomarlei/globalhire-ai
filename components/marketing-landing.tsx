"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { PublicNav } from "@/components/nav";
import { AutoSiteFooter } from "@/components/site-footer";
import { Button, Card } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import type { LpPageContent } from "@/lib/lp-content";
import { buildCadastroHref } from "@/lib/utm";

const primaryCtaClass =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition duration-200 hover:brightness-[1.05]";

export function MarketingLanding({ page }: { page: LpPageContent }) {
  const ctaHref = buildCadastroHref(page.slug, "hero");

  useEffect(() => {
    trackEvent("lp_viewed", { lp_slug: page.slug, lp_path: page.path });
  }, [page.slug, page.path]);

  function onCtaClick() {
    trackEvent("lp_cta_clicked", { lp_slug: page.slug, lp_path: page.path });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">GlobalHire AI</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {page.headline}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{page.subheadline}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={ctaHref} onClick={onCtaClick} className={primaryCtaClass}>
            {page.ctaLabel} <ArrowRight size={18} />
          </Link>
          <Button
            href="/ats-score"
            className="h-12 border border-border bg-muted/50 px-6 text-foreground shadow-none hover:bg-muted"
          >
            Ver score ATS
          </Button>
        </div>
        <Card className="mt-10 border-primary/25 bg-primary/5">
          <p className="text-sm font-semibold text-foreground">{page.proofTitle}</p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {page.proofItems.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-500" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {page.benefits.map((benefit) => (
            <li key={benefit} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {benefit}
            </li>
          ))}
        </ul>
      </section>
      <AutoSiteFooter />
    </main>
  );
}
