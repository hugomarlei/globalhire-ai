import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

const sections = [
  {
    title: "1. Uso do serviço",
    text:
      "A GlobalHire AI oferece ferramentas de IA generativa para apoiar criação e otimização de currículo ATS, carta de apresentação, resumo de LinkedIn, mensagens profissionais, preparação para entrevista, tradução e análise ATS."
  },
  {
    title: "2. Resultados de IA",
    text:
      "Os resultados podem conter erros, omissões, interpretações inadequadas ou sugestões que não se aplicam ao seu caso. Você deve revisar todo conteúdo antes de enviar a recrutadores, empresas ou plataformas de candidatura."
  },
  {
    title: "3. Sem garantia de contratação",
    text:
      "Otimização ATS, aumento de compatibilidade, recomendações e documentos gerados não garantem emprego, entrevista, resposta de recrutador, aprovação em triagem ou contratação."
  },
  {
    title: "4. Assinaturas e cancelamento",
    text:
      "Planos pagos são cobrados de forma recorrente conforme a oferta exibida no checkout. Pagamentos, cartões, recibos e cancelamentos são processados com segurança pelo Stripe. O cancelamento interrompe renovações futuras, respeitando o período já pago quando aplicável."
  },
  {
    title: "5. Uso aceitável",
    text:
      "Você concorda em não usar a plataforma para fraude, falsificação de experiência, criação de conteúdo enganoso, violação de direitos de terceiros, tentativa de invasão, automação abusiva ou qualquer atividade ilegal."
  },
  {
    title: "6. Conteúdo do usuário",
    text:
      "Você mantém a propriedade do conteúdo que envia, incluindo currículo, descrição de vaga e informações profissionais. Ao usar o serviço, você nos autoriza a processar esse conteúdo para entregar as funcionalidades solicitadas."
  },
  {
    title: "7. Limitação de responsabilidade",
    text:
      "A GlobalHire AI é uma ferramenta de apoio. Decisões de candidatura, revisão final, veracidade das informações e uso dos documentos são responsabilidade do usuário, dentro dos limites permitidos pela legislação brasileira."
  },
  {
    title: "8. Legislação e contato",
    text:
      "Estes termos são regidos pela legislação brasileira. Para dúvidas, suporte ou questões contratuais, entre em contato pelo e-mail contato@globalhireai.com.br."
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-500">GlobalHire AI</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Termos de Uso</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Última atualização: 10 de maio de 2026. Estes termos definem regras básicas para uso da GlobalHire AI.
            Antes do lançamento público, recomendamos validação jurídica final.
          </p>
          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/68">{section.text}</p>
              </section>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
