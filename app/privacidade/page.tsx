import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

const sections = [
  {
    title: "1. Dados que coletamos",
    text:
      "Coletamos nome, e-mail, dados de login, plano contratado, informações de pagamento processadas pelo Stripe e dados profissionais que você decide enviar, como currículo, histórico profissional, descrição de vaga, idioma, país-alvo e preferências de uso."
  },
  {
    title: "2. Currículos, vagas e uso de IA",
    text:
      "Os currículos, descrições de vaga e materiais enviados são usados para gerar documentos profissionais, ATS Score, cartas, mensagens e recomendações. Para isso, parte do conteúdo pode ser processada por modelos de IA via Groq/OpenAI-compatible API. Recomendamos não enviar dados sensíveis desnecessários, como dados de saúde, documentos pessoais, religião, filiação política ou informações financeiras."
  },
  {
    title: "3. Provedores usados",
    text:
      "Usamos Supabase para autenticação e armazenamento, Stripe para pagamentos e assinaturas, Cloudflare para segurança, DNS e possível roteamento de e-mail, Groq para processamento de IA e Microsoft Clarity para analytics apenas quando você aceitar cookies analíticos."
  },
  {
    title: "4. Cookies e analytics",
    text:
      "Cookies essenciais são usados para login, segurança e funcionamento do serviço. Cookies analíticos são opcionais e ajudam a entender uso, navegação e pontos de melhoria. Você pode aceitar, rejeitar ou alterar sua preferência pelo rodapé do site."
  },
  {
    title: "5. Retenção e exclusão",
    text:
      "Mantemos dados pelo tempo necessário para operar sua conta, histórico, assinaturas, segurança e obrigações legais. Você pode solicitar exclusão dos seus dados ou usar a opção de exclusão de conta quando disponível no painel. Algumas informações transacionais podem ser preservadas quando exigidas por lei."
  },
  {
    title: "6. Direitos conforme a LGPD",
    text:
      "Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento e revogação de consentimento, conforme a Lei Geral de Proteção de Dados."
  },
  {
    title: "7. Segurança",
    text:
      "Aplicamos medidas razoáveis de segurança, autenticação, proteção de rotas, variáveis secretas no servidor, logs técnicos limitados e processamento por provedores reconhecidos. Nenhum sistema é totalmente imune a falhas, por isso revise os dados que envia."
  },
  {
    title: "8. Contato",
    text:
      "Para dúvidas de privacidade, solicitações LGPD ou exclusão de dados, entre em contato pelo e-mail privacy@globalhireai.com.br."
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-500">GlobalHire AI</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Política de Privacidade</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Última atualização: 10 de maio de 2026. Esta política explica como tratamos dados pessoais no uso da
            GlobalHire AI. Ela é um modelo operacional para MVP e deve ser revisada juridicamente antes de campanhas
            públicas em escala.
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
