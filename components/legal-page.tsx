import Link from "next/link";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections
}: {
  eyebrow?: string;
  title: string;
  updatedAt: string;
  intro: string[];
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-10">
          <p className="text-sm font-semibold text-brand-500">{eyebrow || "GlobalHire AI"}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm font-medium text-white/50">Última atualização: {updatedAt}</p>
          <div className="mt-6 grid gap-4 text-sm leading-7 text-white/70">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 space-y-9">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <div className="mt-3 grid gap-3 text-sm leading-7 text-white/70">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul className="grid gap-2 pl-5">
                      {section.bullets.map((item) => (
                        <li key={item} className="list-disc">{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
          <nav className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-6 text-sm text-white/55" aria-label="Links legais">
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/refund-policy" className="hover:text-white">Cancelamento e reembolso</Link>
            <Link href="/data-processing" className="hover:text-white">Tratamento de dados</Link>
            <Link href="/support" className="hover:text-white">Suporte</Link>
          </nav>
        </Card>
      </article>
      <AutoSiteFooter />
    </main>
  );
}
