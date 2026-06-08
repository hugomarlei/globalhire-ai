"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, ChevronDown, FileClock, FileText, Gauge, Globe2, LayoutDashboard, LifeBuoy, LogOut, Menu, RefreshCw, Settings, ShieldCheck, UserCircle } from "lucide-react";
import { useState } from "react";
import { brandIcon } from "@/lib/brand-assets";
import { dashboardCopy, locales, navCopy, type Locale } from "@/lib/i18n";
import { appNavStrings } from "@/lib/i18n-app-wide";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, inputClass } from "@/components/ui";

function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <label className="flex min-w-0 items-center gap-2 text-muted-foreground">
      <Globe2 size={17} className="shrink-0 text-foreground/80" />
      <select
        aria-label={appNavStrings[locale].languageAria}
        className={`${inputClass} h-10 min-h-10 w-full min-w-[11rem] max-w-[15rem] py-1 text-xs sm:w-44`}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        {locales.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PublicNav() {
  const { locale } = useLanguage();
  const copy = navCopy[locale];
  const dash = dashboardCopy[locale];
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-5 text-foreground backdrop-blur-xl sm:flex-nowrap sm:border-0 sm:px-6 sm:py-6">
      <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-foreground">
        <Image
          src={brandIcon.nav}
          alt=""
          width={36}
          height={36}
          className="size-9 rounded-2xl bg-card/40 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.35)] dark:ring-white/10"
          priority
        />
        <span className="min-w-0">
          <span className="block truncate leading-5">GlobalHire AI</span>
          <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">{appNavStrings[locale].tagline}</span>
        </span>
      </Link>
      <nav className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground sm:gap-3">
        <Link
          href="/login"
          className="focus-ring inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card/90 px-3 font-semibold text-card-foreground shadow-sm transition hover:bg-muted dark:bg-card/95 sm:px-4"
        >
          {copy.login}
        </Link>
        <Button href="/cadastro" className="h-10 rounded-xl px-3 sm:px-4">
          {copy.signup}
        </Button>
      </nav>
      <div className="order-3 flex w-full flex-wrap items-center justify-end gap-2 sm:order-none sm:w-auto sm:justify-end">
        <ThemeToggle labels={themeLabels} />
        <LanguageSelector />
      </div>
    </header>
  );
}

export function AppNav({ isAdmin = false, email = "" }: { isAdmin?: boolean; email?: string }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const { locale } = useLanguage();
  const copy = navCopy[locale];
  const n = appNavStrings[locale];
  const dash = dashboardCopy[locale];
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };
  const groups = [
    {
      label: n.tools,
      items: [
        { href: "/ats-score", label: n.atsAnalysis, Icon: Gauge },
        { href: "/resumes", label: n.resumeBuilder, Icon: FileText },
        { href: "/gerador", label: n.resumeRewrite, Icon: RefreshCw }
      ]
    },
    {
      label: n.documents,
      items: [
        { href: "/historico", label: n.history, Icon: FileClock }
      ]
    }
  ];
  const accountLinks = [
    { href: "/conta", label: n.myAccount, Icon: UserCircle },
    { href: "/assinatura", label: n.subscription, Icon: BarChart3 },
    { href: "/historico", label: n.history, Icon: FileClock },
    { href: "/configuracoes", label: n.settings, Icon: Settings },
    { href: "/support", label: n.support, Icon: LifeBuoy },
    { href: "/privacidade", label: n.privacy, Icon: ShieldCheck }
  ];

  const navItem = "rounded-xl px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground";
  const dropPanel =
    "rounded-xl border border-border bg-card p-2 text-card-foreground shadow-lg backdrop-blur-md dark:shadow-soft";
  const dropLink =
    "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition hover:bg-muted hover:text-foreground";

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border/80 bg-background/88 px-4 py-5 text-foreground shadow-[1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-xl dark:bg-background/82 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-2xl px-2 py-2 font-semibold text-foreground">
          <Image
            src={brandIcon.nav}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-2xl bg-card/40 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.35)] dark:ring-white/10"
            priority
          />
          <span>
            <span className="block leading-5">GlobalHire AI</span>
            <span className="block text-[11px] font-medium text-muted-foreground">{n.tagline}</span>
          </span>
        </Link>
        <nav className="mt-7 grid flex-1 gap-1 overflow-y-auto pb-4 pr-1 text-sm">
          <Link href="/dashboard" className={`inline-flex items-center gap-1 ${navItem}`}>
            <LayoutDashboard size={16} />
            {copy.dashboard}
          </Link>
          {groups.map((group) => (
            <div key={group.label} className="mt-4">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
              <div className="grid gap-1">
                {group.items.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className={dropLink}>
                    <Icon size={17} className="text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {isAdmin ? (
            <div className="mt-4">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Admin</p>
              <Link href="/admin" className={navItem}>
                {copy.admin}
              </Link>
            </div>
          ) : null}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setAccountOpen((current) => !current)}
              className="focus-ring flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-muted/45 px-3 py-3 text-left text-xs text-muted-foreground transition hover:bg-muted"
              aria-expanded={accountOpen}
            >
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-primary">{n.account}</span>
                <span className="block truncate">{email || n.account}</span>
              </span>
              <ChevronDown size={16} className={`shrink-0 transition ${accountOpen ? "rotate-180" : ""}`} />
            </button>
            {accountOpen ? (
              <div className="mt-2 grid gap-1">
                {accountLinks.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className={dropLink}>
                    <Icon size={17} className="text-primary" />
                    {label}
                  </Link>
                ))}
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className={`${dropLink} w-full`}>
                    <LogOut size={17} className="text-primary" />
                    {copy.logout}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </nav>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl dark:bg-background/75 lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
            <Image src={brandIcon.nav} alt="" width={36} height={36} className="size-9 rounded-2xl bg-card/40 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5" priority />
            <span>
              <span className="block leading-5">GlobalHire AI</span>
              <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">{n.tagline}</span>
            </span>
          </Link>
          <details className="group relative">
          <summary className="focus-ring flex list-none items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2 text-sm text-foreground">
            <Menu size={18} />
            {n.menu}
          </summary>
          <div className={`absolute right-0 top-full z-50 mt-2 max-h-[78vh] w-[min(92vw,360px)] overflow-auto p-3 ${dropPanel}`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <ThemeToggle labels={themeLabels} />
              <LanguageSelector />
            </div>
            <Link href="/dashboard" className={dropLink}>
              <LayoutDashboard size={17} className="text-primary" />
              {copy.dashboard}
            </Link>
            {isAdmin ? (
              <div className="mt-2 border-t border-border pt-2">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.admin}</p>
                <Link href="/admin" className={dropLink}>
                  <ShieldCheck size={17} className="text-primary" />
                  {copy.admin}
                </Link>
              </div>
            ) : null}
            {groups.map((group) => (
              <div key={group.label} className="mt-2 border-t border-border pt-2">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                {group.items.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className={dropLink}>
                    <Icon size={17} className="text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{n.account}</p>
              {accountLinks.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className={dropLink}>
                  <Icon size={17} className="text-primary" />
                  {label}
                </Link>
              ))}
              <form action="/api/auth/signout" method="post">
                <button type="submit" className={`${dropLink} w-full`}>
                  <LogOut size={17} className="text-primary" />
                  {copy.logout}
                </button>
              </form>
            </div>
          </div>
        </details>
        </div>
      </header>
    </>
  );
}
