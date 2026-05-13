"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, BookOpenText, BriefcaseBusiness, ChevronDown, FileClock, Gauge, Globe2, Languages, LayoutDashboard, LifeBuoy, Linkedin, LogOut, MailPlus, Menu, MessageSquareText, MessagesSquare, Settings, ShieldCheck, UserCircle, Video } from "lucide-react";
import { Button, inputClass } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { dashboardCopy, locales, navCopy, type Locale } from "@/lib/i18n";

function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <label className="flex min-w-0 items-center gap-2 text-white/70">
      <Globe2 size={17} className="shrink-0" />
      <select
        aria-label="Language"
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
  const { resolvedDark } = useTheme();
  const copy = navCopy[locale];
  const dash = dashboardCopy[locale];
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:px-6 sm:py-5">
      <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-white">
        <Image src="/branding/logo-symbol.svg" alt="" width={36} height={36} className="size-9 rounded-md shadow-glow" priority />
        <span className="min-w-0">
          <span className="block truncate leading-5">GlobalHire AI</span>
          <span className="hidden text-[11px] font-medium text-white/45 sm:block">Get Hired Smarter.</span>
        </span>
      </Link>
      <nav className="flex shrink-0 items-center gap-2 text-sm text-white/70 sm:gap-3">
        <Link href="/login" className="focus-ring inline-flex h-10 items-center justify-center rounded-md border border-white/12 bg-white/7 px-3 font-semibold text-white hover:bg-white/12 sm:px-4">
          {copy.login === "Login" ? "Entrar" : copy.login}
        </Link>
        <Button href="/cadastro" className="h-10 px-3 sm:px-4">
          {copy.signup}
        </Button>
      </nav>
      <div className="order-3 flex w-full flex-wrap items-center justify-end gap-2 sm:order-none sm:w-auto sm:justify-end">
        <ThemeToggle
          labels={themeLabels}
          palette={resolvedDark ? "ink" : "paper"}
          className={resolvedDark ? "border-white/10 bg-white/6" : "border-graphite/15 bg-white/90 shadow-sm"}
        />
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
  const dash = dashboardCopy[locale];
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };
  const groups = [
    {
      label: "Ferramentas",
      items: [
        { href: "/gerador", label: "Currículo ATS", Icon: BriefcaseBusiness },
        { href: "/gerador?tipo=cover_letter", label: "Carta de apresentação", Icon: MailPlus },
        { href: "/gerador?tipo=linkedin_summary", label: "Resumo LinkedIn", Icon: Linkedin },
        { href: "/gerador?tipo=recruiter_message", label: "Mensagem para recrutador", Icon: MessagesSquare },
        { href: "/gerador?tipo=interview_prep", label: "Simular entrevista", Icon: Video },
        { href: "/gerador?tipo=translate_resume", label: "Traduzir currículo", Icon: Languages }
      ]
    },
    {
      label: "Analisar",
      items: [
        { href: "/ats-score", label: "ATS Score", Icon: Gauge },
        { href: "/ats-score?modo=keywords#keywords", label: "Palavras-chave", Icon: BookOpenText }
      ]
    },
    {
      label: "Documentos",
      items: [
        { href: "/historico", label: "Histórico", Icon: FileClock },
        { href: "/historico?tab=documentos", label: "Meus documentos", Icon: MessageSquareText }
      ]
    }
  ];
  const accountLinks = [
    { href: "/conta", label: "Minha conta", Icon: UserCircle },
    { href: "/assinatura", label: "Assinatura", Icon: BarChart3 },
    { href: "/historico", label: "Histórico", Icon: FileClock },
    { href: "/configuracoes", label: "Configurações", Icon: Settings },
    { href: "/support", label: "Suporte", Icon: LifeBuoy },
    { href: "/privacidade", label: "Privacidade", Icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src="/branding/logo-symbol.svg" alt="" width={36} height={36} className="size-9 rounded-md shadow-glow" priority />
          <span>
            <span className="block leading-5">GlobalHire AI</span>
            <span className="hidden text-[11px] font-medium text-white/45 sm:block">Get Hired Smarter.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm text-white/70 lg:flex">
          <Link href="/dashboard" className="inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-white/8 hover:text-white">
            <LayoutDashboard size={16} />
            {copy.dashboard}
          </Link>
          {groups.map((group) => (
            <div key={group.label} className="group relative">
              <button className="focus-ring inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-white/8 hover:text-white">
                {group.label}
                <ChevronDown size={15} />
              </button>
              <div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-lg border border-white/10 bg-[#07120E] p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {group.items.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-3 text-white/75 hover:bg-white/8 hover:text-white">
                    <Icon size={17} className="text-brand-500" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {isAdmin ? (
            <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-white/8 hover:text-white">
              {copy.admin}
            </Link>
          ) : null}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle labels={themeLabels} />
          <LanguageSelector />
          <div className="group relative">
            <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 py-1 pl-1 pr-3 text-sm text-white/80 hover:bg-white/12">
              <span className="grid size-8 place-items-center rounded-full bg-brand-500 text-xs font-bold text-ink">{initials(email)}</span>
              Conta
              <ChevronDown size={15} />
            </button>
            <div className="invisible absolute right-0 top-full w-64 translate-y-2 rounded-lg border border-white/10 bg-[#07120E] p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="px-3 py-2 text-xs text-white/45">{email}</p>
              {accountLinks.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-3 text-white/75 hover:bg-white/8 hover:text-white">
                  <Icon size={17} className="text-brand-500" />
                  {label}
                </Link>
              ))}
              <form action="/api/auth/signout" method="post" className="border-t border-white/10 pt-2">
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-white/75 hover:bg-white/8 hover:text-white" type="submit">
                  <LogOut size={17} className="text-brand-500" />
                  {copy.logout}
                </button>
              </form>
            </div>
          </div>
        </div>
        <details className="group relative lg:hidden">
          <summary className="focus-ring flex list-none items-center gap-2 rounded-md border border-white/10 bg-white/7 px-3 py-2 text-sm text-white/80">
            <Menu size={18} />
            Menu
          </summary>
          <div className="absolute right-0 top-full mt-2 max-h-[78vh] w-[min(92vw,360px)] overflow-auto rounded-lg border border-white/10 bg-[#07120E] p-3 shadow-soft">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <ThemeToggle labels={themeLabels} />
              <LanguageSelector />
            </div>
            <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-3 text-white/75 hover:bg-white/8 hover:text-white">
              <LayoutDashboard size={17} className="text-brand-500" />
              {copy.dashboard}
            </Link>
            {groups.map((group) => (
              <div key={group.label} className="mt-2 border-t border-white/10 pt-2">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/35">{group.label}</p>
                {group.items.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-3 text-white/75 hover:bg-white/8 hover:text-white">
                    <Icon size={17} className="text-brand-500" />
                    {label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/35">Conta</p>
              {accountLinks.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-3 text-white/75 hover:bg-white/8 hover:text-white">
                  <Icon size={17} className="text-brand-500" />
                  {label}
                </Link>
              ))}
              <form action="/api/auth/signout" method="post">
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-white/75 hover:bg-white/8 hover:text-white" type="submit">
                  <LogOut size={17} className="text-brand-500" />
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
