"use client";

import Link from "next/link";
import { BarChart3, BriefcaseBusiness, FileClock, Gauge, Globe2, LayoutDashboard, LogOut, Settings, UserCircle } from "lucide-react";
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

export function AppNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const { locale } = useLanguage();
  const copy = navCopy[locale];
  const links = [
    { href: "/dashboard", label: copy.dashboard, Icon: LayoutDashboard },
    { href: "/gerador", label: "Gerador", Icon: BriefcaseBusiness },
    { href: "/ats-score", label: "ATS Score", Icon: Gauge },
    { href: "/historico", label: copy.history, Icon: FileClock },
    { href: "/assinatura", label: "Assinatura", Icon: BarChart3 },
    { href: "/conta", label: "Conta", Icon: UserCircle },
    { href: "/configuracoes", label: "Configurações", Icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-white text-ink">
            <BriefcaseBusiness size={18} />
          </span>
          GlobalHire AI
        </Link>
        <nav className="flex max-w-full items-center gap-2 overflow-x-auto text-sm text-white/70">
          <LanguageSelector />
          {links.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-2 hover:bg-white/8 hover:text-white">
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin" className="shrink-0 rounded-md px-2 py-2 hover:bg-white/8 hover:text-white">
              {copy.admin}
            </Link>
          ) : null}
          <form action="/api/auth/signout" method="post">
            <button className="flex items-center gap-1 hover:text-white" type="submit">
              <LogOut size={16} />
              {copy.logout}
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
