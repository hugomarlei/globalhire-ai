import Link from "next/link";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "contato@globalhireai.com.br";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold">Central de suporte</h1>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Precisa de ajuda com login, assinatura, geração de documentos ou cancelamento? Fale com o suporte pelo
            e-mail abaixo.
          </p>
          <a href={`mailto:${supportEmail}`} className="mt-5 inline-flex rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-ink">
            {supportEmail}
          </a>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Como cancelar assinatura?", "Acesse sua conta, entre em Assinatura e clique em Gerenciar assinatura para abrir o portal Stripe."],
            ["A IA garante emprego?", "Não. A IA ajuda a melhorar documentos e compatibilidade, mas não garante entrevista ou contratação."],
            ["PDF escaneado funciona?", "PDF escaneado pode falhar porque não possui texto selecionável. Cole o texto manualmente nesses casos."],
            ["Onde vejo termos e privacidade?", "Os links legais ficam no rodapé e também nesta central."]
          ].map(([title, text]) => (
            <Card key={title}>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-brand-500">
          <Link href="/termos">Termos</Link>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/refund-policy">Cancelamento e reembolso</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </section>
    </main>
  );
}
