"use client";

import Link from "next/link";
import { BriefcaseBusiness, Globe2, LogOut } from "lucide-react";
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

  return (
    <header className="border-b border-white/10 bg-ink/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-white text-ink">
            <BriefcaseBusiness size={18} />
          </span>
          GlobalHire AI
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/70">
          <LanguageSelector />
          <Link href="/dashboard" className="hover:text-white">
            {copy.dashboard}
          </Link>
          <Link href="/historico" className="hover:text-white">
            {copy.history}
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="hover:text-white">
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
