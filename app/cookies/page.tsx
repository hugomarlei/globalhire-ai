import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-500">GlobalHire AI</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Política de Cookies</h1>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Usamos cookies essenciais para login, segurança e funcionamento da conta. Cookies analíticos, como
            Microsoft Clarity e PostHog, só devem ser carregados quando você aceitar analytics no banner de privacidade.
          </p>
          <div className="mt-8 grid gap-4">
            <section>
              <h2 className="text-lg font-semibold">Essenciais</h2>
              <p className="mt-2 text-sm leading-7 text-white/68">
                Necessários para autenticação, sessão, proteção de rotas e segurança. Não podem ser desativados sem
                comprometer o funcionamento da plataforma.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Analytics</h2>
              <p className="mt-2 text-sm leading-7 text-white/68">
                Ajudam a entender navegação e melhoria do produto. Campos sensíveis de currículo, vaga, upload, e-mail,
                telefone e endereço devem ser mascarados e não enviados como eventos.
              </p>
            </section>
          </div>
        </Card>
      </section>
    </main>
  );
}
