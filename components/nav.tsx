"use client";

import Link from "next/link";
import { BarChart3, BookOpenText, BriefcaseBusiness, ChevronDown, FileClock, Gauge, Globe2, LayoutDashboard, Linkedin, LogOut, MailPlus, Menu, MessageSquareText, Settings, UserCircle } from "lucide-react";
import { Button, inputClass } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import { locales, navCopy, type Locale } from "@/lib/i18n";

function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <label className="flex items-center gap-2 text-white/70">
      <Globe2 size={17} />
      <select
        aria-label="Language"
        className={`${inputClass} h-10 min-h-10 w-[132px] py-1 text-xs`}
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

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold text-white">
        <span className="grid size-9 place-items-center rounded-md bg-white text-ink">
          <BriefcaseBusiness size={18} />
        </span>
        GlobalHire AI
      </Link>
      <nav className="flex items-center gap-3 text-sm text-white/70">
        <LanguageSelector />
        <Link href="/login" className="hidden hover:text-white sm:inline">
          {copy.login}
        </Link>
        <Button href="/cadastro" className="h-10 px-4">
          {copy.signup}
        </Button>
      </nav>
    </header>
  );
}

function initials(email?: string) {
  return (email || "GH").slice(0, 2).toUpperCase();
}

export function AppNav({ isAdmin = false, email = "" }: { isAdmin?: boolean; email?: string }) {
  const { locale } = useLanguage();
  const copy = navCopy[locale];
  const groups = [
    {
      label: "Criar",
      items: [
        { href: "/gerador", label: "Gerador de currículo", Icon: BriefcaseBusiness },
        { href: "/gerador?tipo=cover_letter", label: "Carta de apresentação", Icon: MailPlus },
        { href: "/gerador?tipo=linkedin_summary", label: "LinkedIn", Icon: Linkedin }
      ]
    },
    {
      label: "Analisar",
      items: [
        { href: "/ats-score", label: "ATS Score", Icon: Gauge },
        { href: "/ats-score#keywords", label: "Palavras-chave", Icon: BookOpenText }
      ]
    },
    {
      label: "Documentos",
      items: [
        { href: "/historico", label: "Histórico", Icon: FileClock },
        { href: "/historico?tab=all", label: "Meus documentos", Icon: MessageSquareText }
      ]
    }
  ];
  const accountLinks = [
    { href: "/conta", label: "Minha conta", Icon: UserCircle },
    { href: "/assinatura", label: "Assinatura", Icon: BarChart3 },
    { href: "/historico", label: "Histórico", Icon: FileClock },
    { href: "/configuracoes", label: "Configurações", Icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-white text-ink">
            <BriefcaseBusiness size={18} />
          </span>
          GlobalHire AI
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
            <div className="mb-3"><LanguageSelector /></div>
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
