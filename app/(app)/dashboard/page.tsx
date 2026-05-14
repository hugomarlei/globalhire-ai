import type { Metadata } from "next";
import Link from "next/link";
import type React from "react";
import { BarChart3, BriefcaseBusiness, CreditCard, ExternalLink, FileText, Gauge, Globe2, Languages, Linkedin, MailPlus, Target } from "lucide-react";
import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppUrl } from "@/lib/app-url";
import { navCopy } from "@/lib/i18n";
import { dashboardPageCopy, deliveryLabel } from "@/lib/i18n-app-wide";
import { getLocalizedPlanRow } from "@/lib/plan-copy";
import { allowedGenerationTypes, effectivePlanFromSubscription, hasAdminBypass, plans } from "@/lib/plans";
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

const ALL_GENERATION_TYPES: GenerationType[] = [
  "ats_resume",
  "cover_letter",
  "linkedin_summary",
  "recruiter_message",
  "interview_prep",
  "translate_resume"
];

const careerLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/jobs/", Icon: Linkedin },
  { label: "Indeed", href: "https://www.indeed.com/", Icon: BriefcaseBusiness },
  { label: "Glassdoor", href: "https://www.glassdoor.com/Job/", Icon: Gauge },
  { label: "InfoJobs", href: "https://www.infojobs.com.br/", Icon: Target },
  { label: "Gupy", href: "https://portal.gupy.io/", Icon: Globe2 }
];

const toolIcons: Record<GenerationType, React.ElementType> = {
  ats_resume: FileText,
  cover_letter: MailPlus,
  linkedin_summary: Linkedin,
  recruiter_message: BriefcaseBusiness,
  interview_prep: Gauge,
  translate_resume: Languages
};

function mostUsedType(items: Array<{ type: string }>) {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.type, (counts.get(item.type) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
}

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
  const usagePercent = plan.monthlyLimit >= 9999 ? 100 : Math.min(100, Math.round((used / plan.monthlyLimit) * 100));
  const topType = mostUsedType(items);
  const languages = Array.from(new Set(items.map((item) => item.language).filter(Boolean)));
  const countries = Array.from(new Set(items.map((item) => item.target_country).filter(Boolean)));
  const countsByType = ALL_GENERATION_TYPES.map((type) => ({
    type,
    label: deliveryLabel(locale, type),
    count: items.filter((item) => item.type === type).length
  }));
  const latest = items.slice(0, 5);
  const availableTools = allowedGenerationTypes(planId);

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CreditCard className="text-brand-500" size={22} />
          <p className="mt-3 text-sm text-muted-foreground">{d.currentPlan}</p>
          <p className="text-2xl font-semibold">{isBypassAccount ? d.eliteTest : localizedPlanName}</p>
          <Link href="/assinatura#planos" className="mt-3 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-500 dark:hover:text-brand-400">{d.viewPlans}</Link>
        </Card>
        <Card>
          <Gauge className="text-mint" size={22} />
          <p className="mt-3 text-sm text-muted-foreground">{d.monthlyUsage}</p>
          <p className="text-2xl font-semibold">{used}/{plan.monthlyLimit >= 9999 ? "∞" : plan.monthlyLimit}</p>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-brand-500" style={{ width: `${usagePercent}%` }} />
          </div>
        </Card>
      </div>

      {isBypassAccount ? (
        <Card className="border-brand-500/60">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-50">{d.adminBypassTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{d.adminBypassBody}</p>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-center gap-2">
          <BarChart3 className="text-brand-500" size={22} />
          <h2 className="text-xl font-semibold text-foreground">{d.intelTitle}</h2>
        </div>
        {!items.length ? (
          <div className="mt-5 rounded-md border border-dashed border-border bg-muted p-5 text-sm text-muted-foreground">
            {d.intelEmpty}
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{d.docsGenerated}</p>
              <p className="mt-2 text-2xl font-semibold">{items.length}</p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{d.topType}</p>
              <p className="mt-2 text-xl font-semibold">
                {topType ? deliveryLabel(locale, topType[0] as GenerationType) || topType[0] : d.noData}
              </p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{d.lastDoc}</p>
              <p className="mt-2 text-xl font-semibold">
                {latest[0] ? new Date(latest[0].created_at).toLocaleDateString(dateLocale) : d.noData}
              </p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{d.languagesUsed}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{languages.slice(0, 4).join(", ") || d.noData}</p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{d.targetCountries}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{countries.slice(0, 4).join(", ") || d.noData}</p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{d.atsScoreCard}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{d.atsScoreHint}</p>
            </div>
          </div>
        )}
        {items.length ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {countsByType.filter((item) => item.count > 0).map((item) => (
              <div key={item.type} className="rounded-md border border-border bg-card p-3 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <strong className="ml-2 text-foreground">{item.count}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-xl font-semibold text-foreground">{d.toolsTitle}</h2>
          <div className="mt-4 grid gap-2">
            {availableTools.map((type) => {
              const Icon = toolIcons[type];
              return (
                <Link key={type} href={type === "ats_resume" ? "/gerador" : `/gerador?tipo=${type}`} className="flex items-center gap-3 rounded-md border border-border p-3 text-sm text-foreground hover:bg-muted">
                  <Icon className="text-brand-500" size={17} />
                  {deliveryLabel(locale, type)}
                </Link>
              );
            })}
            {planId === "free" || planId === "starter" || planId === "pro" || planId === "elite" ? (
              <Link href="/ats-score" className="flex items-center gap-3 rounded-md border border-border p-3 text-sm text-foreground hover:bg-muted">
                <Gauge className="text-brand-500" size={17} />
                {d.atsKeywords}
              </Link>
            ) : (
              <Link href="/assinatura#planos" className="rounded-md border border-brand-500/30 bg-brand-500/10 p-3 text-sm text-brand-800 hover:bg-brand-500/15 dark:text-brand-50">
                {d.unlockAts}
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-foreground">{d.careerTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{d.careerLead}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {careerLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md border border-border p-3 text-sm text-foreground hover:bg-muted">
                <span className="inline-flex items-center gap-2"><Icon className="text-brand-500" size={17} /> {label}</span>
                <ExternalLink size={15} />
              </a>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-foreground">{d.activityTitle}</h2>
        <div className="mt-4 grid gap-2">
          {latest.map((item) => (
            <Link key={item.id} href="/historico" className="flex items-center justify-between rounded-md border border-border p-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <span>
                {deliveryLabel(locale, item.type as GenerationType) || item.type} · {item.language} · {item.target_country}
              </span>
              <span className="text-muted-foreground">{new Date(item.created_at).toLocaleDateString(dateLocale)}</span>
            </Link>
          ))}
          {!latest.length ? <p className="text-sm text-muted-foreground">{d.activityEmpty}</p> : null}
        </div>
      </Card>
    </div>
  );
}
