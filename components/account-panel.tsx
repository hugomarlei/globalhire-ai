"use client";

import Link from "next/link";
import { AlertTriangle, BarChart3, Copy, CreditCard, Gift, KeyRound, Loader2, LogOut, Settings, ShieldCheck, Trash2, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { getAppUrl } from "@/lib/app-url";
import { useLanguage } from "@/components/language-provider";
import { accountPanelCopy, subscriptionPageCopy } from "@/lib/i18n-account-subscription";
import { intlLocaleForUi } from "@/lib/i18n-history-ats";
import { getLocalizedPlanRow } from "@/lib/plan-copy";
import type { PlanId } from "@/lib/plans";

type AccountTab = "account" | "subscription" | "referrals";

export function AccountPanel({
  email,
  planId,
  monthlyLimitValue,
  subscriptionStatus,
  currentPeriodEnd,
  initialTab = "account"
}: {
  email: string;
  planId: PlanId;
  monthlyLimitValue: number;
  subscriptionStatus: string;
  currentPeriodEnd?: string | null;
  initialTab?: AccountTab;
}) {
  const { locale } = useLanguage();
  const t = accountPanelCopy[locale];
  const planRow = useMemo(() => getLocalizedPlanRow(locale, planId), [locale, planId]);
  const planName = planRow.name;
  const sub = subscriptionPageCopy[locale];
  const monthlyLimit = monthlyLimitValue >= 9999 ? sub.unlimited : String(monthlyLimitValue);

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [error, setError] = useState("");
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const referralLink = useMemo(() => {
    return `${getAppUrl()}/cadastro?ref=${encodeURIComponent(email)}`;
  }, [email]);

  function formatDate(value?: string | null) {
    if (!value) return t.periodUnknown;
    return new Intl.DateTimeFormat(intlLocaleForUi(locale), { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
  }

  const statusLabel = t.subscriptionStatuses[subscriptionStatus] ?? subscriptionStatus;

  async function openPortal() {
    setLoadingPortal(true);
    setError("");
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await response.json();
    setLoadingPortal(false);

    if (!response.ok) {
      setError(data.error || t.portalError);
      return;
    }

    window.location.href = data.url;
  }

  async function copyReferral() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    window.setTimeout(() => setCopiedReferral(false), 1800);
  }

  async function deleteAccount() {
    setDeletingAccount(true);
    setError("");
    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: deleteConfirmation })
    });
    const data = await response.json().catch(() => ({}));
    setDeletingAccount(false);

    if (!response.ok) {
      setError(data.error || t.deleteError);
      return;
    }

    window.location.href = "/";
  }

  const tabs: Array<{ id: AccountTab; label: string; Icon: React.ElementType }> = [
    { id: "account", label: t.tabAccount, Icon: UserCircle },
    { id: "subscription", label: t.tabSubscription, Icon: CreditCard },
    { id: "referrals", label: t.tabReferrals, Icon: Gift }
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t.pageTitle}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`focus-ring inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                activeTab === id ? "bg-primary text-primary-foreground" : "border border-border bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
      {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}

      {activeTab === "account" ? (
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <div className="flex items-center gap-2">
              <UserCircle className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{t.userDataTitle}</h2>
            </div>
            <div className="mt-5 grid gap-4">
              <Field label={t.emailLabel}>
                <input className={inputClass} value={email} readOnly />
              </Field>
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{t.currentPlanLabel}</p>
                <p className="mt-1 text-2xl font-semibold">{planName}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <KeyRound className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{t.securityTitle}</h2>
            </div>
            <div className="mt-5 grid gap-3">
              <Link href="/recuperar-senha" className="focus-ring rounded-md border border-border bg-muted p-4 text-sm text-foreground hover:bg-muted/80">
                {t.resetPasswordLink}
              </Link>
              <Link href="/configuracoes" className="focus-ring inline-flex items-center gap-2 rounded-md border border-border bg-muted p-4 text-sm text-foreground hover:bg-muted/80">
                <Settings size={17} />
                {t.settingsPrefsLink}
              </Link>
              <form action="/api/auth/signout" method="post">
                <Button type="submit" className="w-full border border-border bg-muted text-foreground shadow-none hover:bg-muted/80 dark:shadow-none">
                  <LogOut size={17} />
                  {t.signOut}
                </Button>
              </form>
            </div>
          </Card>
          <Card className="border-coral/35 lg:col-span-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-coral" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{t.deleteTitle}</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{t.deleteBody}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label={t.deleteFieldLabel}>
                <input className={inputClass} value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} />
              </Field>
              <Button
                onClick={deleteAccount}
                disabled={deletingAccount || deleteConfirmation !== t.deletePhrase}
                className="border border-coral/40 bg-coral/15 text-coral hover:bg-coral/20"
              >
                {deletingAccount ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
                {t.deleteButton}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === "subscription" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-brand-500/35">
            <div className="flex items-center gap-2">
              <CreditCard className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{t.subscriptionTitle}</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{t.currentPlanLabel}</p>
                <p className="text-xl font-semibold">{planName}</p>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{t.monthlyLimitLabel}</p>
                <p className="text-xl font-semibold">{monthlyLimit}</p>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{t.statusLabel}</p>
                <p className="text-xl font-semibold">{statusLabel}</p>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{t.nextBillingLabel}</p>
              <p className="mt-1 font-semibold">{formatDate(currentPeriodEnd)}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/assinatura#planos" className="bg-primary text-primary-foreground hover:brightness-105">
                {t.viewPlans}
              </Button>
              <Button onClick={openPortal} disabled={loadingPortal} className="border border-border bg-muted text-foreground shadow-none hover:bg-muted/80 dark:shadow-none">
                {loadingPortal ? <Loader2 className="animate-spin" size={17} /> : <CreditCard size={17} />}
                {loadingPortal ? t.opening : t.manageSubscription}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{t.paymentHistoryTitle}</h2>
            </div>
            <div className="mt-5 rounded-md border border-dashed border-border bg-muted p-5 text-sm leading-6 text-muted-foreground">{t.paymentHistoryBody}</div>
          </Card>
        </div>
      ) : null}

      {activeTab === "referrals" ? (
        <Card>
          <div className="flex items-center gap-2">
            <Gift className="text-brand-500" size={22} />
            <h2 className="text-xl font-semibold text-foreground">{t.referralsTitle}</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t.referralsBody}</p>
          <div className="mt-5 flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center">
            <input className={inputClass} value={referralLink || t.loadingLink} readOnly />
            <Button onClick={copyReferral} className="shrink-0 bg-primary text-primary-foreground hover:brightness-105">
              <Copy size={17} />
              {copiedReferral ? t.copied : t.copyLink}
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[t.referralStat1, t.referralStat2, t.referralStat3].map((item) => (
              <div key={item} className="rounded-md border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{item}</p>
                <p className="mt-1 text-2xl font-semibold">0</p>
              </div>
            ))}
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck size={16} />
            {t.referralsFootnote}
          </p>
        </Card>
      ) : null}
    </div>
  );
}
