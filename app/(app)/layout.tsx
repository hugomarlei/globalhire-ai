import Link from "next/link";
import { AppNav } from "@/components/nav";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#050806_0%,#07120E_100%)] text-white">
      <AppNav isAdmin={Boolean(profile?.is_admin)} email={user.email || ""} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 py-6 text-xs text-white/45 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© 2026 GlobalHire AI</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/support" className="hover:text-white">Suporte</Link>
          <Link href="/termos" className="hover:text-white">Termos</Link>
          <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
          <Link href="/data-processing" className="hover:text-white">Tratamento de dados</Link>
        </div>
      </footer>
    </main>
  );
}
