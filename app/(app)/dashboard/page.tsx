import type { Metadata } from "next";
import Link from "next/link";
import type React from "react";
import { ArrowRight, BriefcaseBusiness, ExternalLink, Gauge, Globe2, Linkedin, Target } from "lucide-react";
import { ProgressHeader, TaskCard } from "@/components/application-workspace";
import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppUrl } from "@/lib/app-url";
import { navCopy } from "@/lib/i18n";
import { dashboardPageCopy, deliveryLabel } from "@/lib/i18n-app-wide";
import { getLocalizedPlanRow } from "@/lib/plan-copy";
import { effectivePlanFromSubscription, hasAdminBypass, plans } from "@/lib/plans";
import { getServerLocale } from "@/lib/server-locale";
import { createAdminClient, createClient } from "@/lib/supabase-server";
import { syncLatestStripeSubscriptionForUser } from "@/lib/stripe-subscription";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import type { GenerationType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const nav = navCopy[locale];
  return {
    title: `${nav.dashboard} | GlobalHire AI`,
    alternates: { canonical: `${getAppUrl()}/dashboard` }
  };
}

const careerLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/jobs/", Icon: Linkedin },
  { label: "Indeed", href: "https://www.indeed.com/", Icon: BriefcaseBusiness },
  { label: "Glassdoor", href: "https://www.glassdoor.com/Job/", Icon: Gauge },
  { label: "InfoJobs", href: "https://www.infojobs.com.br/", Icon: Target },
  { label: "Gupy", href: "https://portal.gupy.io/", Icon: Globe2 }
];

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getServerLocale();
  const d = dashboardPageCopy[locale];
  const dateLocale = locale === "pt-BR" ? "pt-BR" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US";
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const params = searchParams ? await searchParams : {};

  if (params.subscription === "updated" || params.billing === "updated" || params.checkout === "success") {
    await syncLatestStripeSubscriptionForUser({
      supabase: createAdminClient(),
      userId: user.id
    }).catch((error) => console.error("dashboard_subscription_sync_error", error));
  }

  const subscription = await getLatestActiveSubscription(supabase, user.id);

  const isBypassAccount = hasAdminBypass(profile?.email || user.email);
  const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, profile?.email || user.email);
  const plan = plans[planId] || plans.free;
  const localizedPlanName = getLocalizedPlanRow(locale, planId).name;
  const since = new Date();
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [{ count }, { data: generations }] = await Promise.all([
    supabase.from("generations").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since.toISOString()),
    supabase
      .from("generations")
      .select("id,type,language,target_country,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)
  ]);

  const items = generations || [];
  const used = count || 0;
  const latest = items.slice(0, 5);
  const cockpitSteps = [
    {
      title: "Prepare um currículo base",
      body: "Cadastre dados, experiências e habilidades uma vez para adaptar por vaga.",
      href: "/resumes",
      action: "Abrir construtor",
      done: Boolean(items.length)
    },
    {
      title: "Cole uma vaga-alvo",
      body: "Use o ATS Score para encontrar lacunas antes de gerar uma nova versão.",
      href: "/ats-score",
      action: "Analisar vaga",
      done: items.some((item) => item.type === "ats_resume")
    },
    {
      title: "Exporte e acompanhe",
      body: "Baixe PDF/TXT, copie mensagens e registre o que foi enviado.",
      href: "/historico",
      action: "Ver histórico",
      done: latest.length >= 3
    }
  ];
  const completedSteps = cockpitSteps.filter((step) => step.done).length;
  const completeness = Math.round((completedSteps / cockpitSteps.length) * 100);
  const dashboardScore = Math.min(100, Math.round((used ? 24 : 0) + completedSteps * 24 + Math.min(items.length, 8) * 3));

  return (
    <div className="grid gap-6">
      {params.subscription === "updated" || params.billing === "updated" || params.checkout === "success" || params.checkout === "cancelled" ? (
        <Card className={params.checkout === "cancelled" ? "border-coral/40" : "border-brand-500/50"}>
          <p className="text-sm font-semibold text-foreground">
            {params.checkout === "success"
              ? d.paymentConfirmed
              : params.checkout === "cancelled"
                ? d.checkoutCancelled
                : d.subscriptionUpdated}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {params.checkout === "cancelled" ? d.checkoutCancelledBody : d.subscriptionUpdatedBody}
          </p>
        </Card>
      ) : null}

      <ProgressHeader
        score={dashboardScore}
        completeness={completeness}
        status="Workspace de candidatura"
        nextStep={cockpitSteps.find((step) => !step.done)?.title || "Exportar e acompanhar"}
        items={cockpitSteps.map((step) => ({ label: step.title.replace("Prepare um ", "").replace("Cole uma ", ""), done: step.done }))}
        action={
          <Link href="/resumes" className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105">
            Abrir documento <ArrowRight size={16} />
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,rgba(13,148,136,0.12),rgba(255,255,255,0)_54%)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.10)] dark:bg-[linear-gradient(135deg,rgba(45,212,191,0.12),rgba(17,18,21,0.96)_58%)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Jornada GlobalHire</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground">
            Transforme currículo, vaga e score em uma candidatura pronta.
          </h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/75 p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Plano</p>
              <p className="mt-1 truncate text-base font-semibold">{isBypassAccount ? d.eliteTest : localizedPlanName}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/75 p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Uso mensal</p>
              <p className="mt-1 text-base font-semibold">{used}/{plan.monthlyLimit >= 9999 ? "∞" : plan.monthlyLimit}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/75 p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Documentos</p>
              <p className="mt-1 text-base font-semibold">{items.length}</p>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">{d.activityTitle}</h2>
          <div className="mt-4 grid gap-2">
            {latest.map((item) => (
              <Link key={item.id} href="/historico" className="flex items-center justify-between rounded-xl border border-border p-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <span className="truncate">
                  {deliveryLabel(locale, item.type as GenerationType) || item.type}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString(dateLocale)}</span>
              </Link>
            ))}
            {!latest.length ? <p className="text-sm text-muted-foreground">{d.activityEmpty}</p> : null}
          </div>
        </Card>
      </section>

      {isBypassAccount ? (
        <Card className="border-brand-500/60">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-50">{d.adminBypassTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{d.adminBypassBody}</p>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          {cockpitSteps.map((step, index) => (
            <TaskCard key={step.title} href={step.href} eyebrow={`Etapa ${index + 1}`} title={step.title} body={step.body} status={step.done ? "done" : index === completedSteps ? "active" : "idle"}>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {step.action} <ArrowRight size={14} />
              </span>
            </TaskCard>
          ))}
        </div>

        <Card className="rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">{d.careerTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{d.careerLead}</p>
          <div className="mt-4 grid gap-2">
            {careerLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted">
                <span className="inline-flex items-center gap-2"><Icon className="text-brand-500" size={17} /> {label}</span>
                <ExternalLink size={15} />
              </a>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
