"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, BookOpenText, BriefcaseBusiness, ChevronDown, FileClock, Gauge, Globe2, Languages, LayoutDashboard, LifeBuoy, Linkedin, LogOut, MailPlus, Menu, MessageSquareText, MessagesSquare, Settings, ShieldCheck, UserCircle, Video } from "lucide-react";
import { Button, inputClass } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { dashboardCopy, locales, navCopy, type Locale } from "@/lib/i18n";
import { appNavStrings } from "@/lib/i18n-app-wide";

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
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-foreground sm:flex-nowrap sm:px-6 sm:py-6">
      <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-foreground">
        <Image
          src="/branding/logo-symbol.svg"
          alt=""
          width={36}
          height={36}
          className="size-9 rounded-lg shadow-[0_0_0_1px_rgb(var(--primary)/0.2)]"
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

function initials(email?: string) {
  return (email || "GH").slice(0, 2).toUpperCase();
}

export function AppNav({ isAdmin = false, email = "" }: { isAdmin?: boolean; email?: string }) {
  const { locale } = useLanguage();
  const copy = navCopy[locale];
  const n = appNavStrings[locale];
  const dash = dashboardCopy[locale];
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };
  const groups = [
    {
      label: n.tools,
      items: [
        { href: "/gerador", label: n.toolAts, Icon: BriefcaseBusiness },
        { href: "/gerador?tipo=cover_letter", label: n.toolCover, Icon: MailPlus },
        { href: "/gerador?tipo=linkedin_summary", label: n.toolLinkedin, Icon: Linkedin },
        { href: "/gerador?tipo=recruiter_message", label: n.toolRecruiter, Icon: MessagesSquare },
        { href: "/gerador?tipo=interview_prep", label: n.toolInterview, Icon: Video },
        { href: "/gerador?tipo=translate_resume", label: n.toolTranslate, Icon: Languages }
      ]
    },
    {
      label: n.analyze,
      items: [
        { href: "/ats-score", label: n.atsScore, Icon: Gauge },
        { href: "/ats-score?modo=keywords#keywords", label: n.keywords, Icon: BookOpenText }
      ]
    },
    {
      label: n.documents,
      items: [
        { href: "/historico", label: n.history, Icon: FileClock },
        { href: "/historico?tab=documentos", label: n.myDocuments, Icon: MessageSquareText }
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

  const navItem = "rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground";
  const dropPanel =
    "rounded-xl border border-border bg-card p-2 text-card-foreground shadow-lg backdrop-blur-md dark:shadow-soft";
  const dropLink =
    "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition hover:bg-muted hover:text-foreground";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 text-foreground backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
          <Image
            src="/branding/logo-symbol.svg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-lg shadow-[0_0_0_1px_rgb(var(--primary)/0.2)]"
            priority
          />
          <span>
            <span className="block leading-5">GlobalHire AI</span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">{n.tagline}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          <Link href="/dashboard" className={`inline-flex items-center gap-1 ${navItem}`}>
            <LayoutDashboard size={16} />
            {copy.dashboard}
          </Link>
          {groups.map((group) => (
            <div key={group.label} className="group relative">
              <button type="button" className={`focus-ring inline-flex items-center gap-1 ${navItem}`}>
                {group.label}
                <ChevronDown size={15} />
              </button>
              <div
                className={`invisible absolute left-0 top-full z-50 w-64 translate-y-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${dropPanel}`}
              >
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
            <Link href="/admin" className={navItem}>
              {copy.admin}
            </Link>
          ) : null}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle labels={themeLabels} />
          <LanguageSelector />
          <div className="group relative">
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 py-1 pl-1 pr-3 text-sm text-foreground transition hover:bg-muted"
            >
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initials(email)}</span>
              {n.account}
              <ChevronDown size={15} />
            </button>
            <div
              className={`invisible absolute right-0 top-full z-50 w-64 translate-y-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${dropPanel}`}
            >
              <p className="px-3 py-2 text-xs text-muted-foreground">{email}</p>
              {accountLinks.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className={dropLink}>
                  <Icon size={17} className="text-primary" />
                  {label}
                </Link>
              ))}
              <form action="/api/auth/signout" method="post" className="border-t border-border pt-2">
                <button type="submit" className={`${dropLink} w-full`}>
                  <LogOut size={17} className="text-primary" />
                  {copy.logout}
                </button>
              </form>
            </div>
          </div>
        </div>
        <details className="group relative lg:hidden">
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
  );
}
