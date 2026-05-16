export type LpSlug = "curriculo-ats" | "curriculo-rejeitado" | "conseguir-entrevista";

export type LpPageContent = {
  slug: LpSlug;
  path: `/lp/${LpSlug}`;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  proofTitle: string;
  proofItems: string[];
  benefits: string[];
};

export const lpPages: Record<LpSlug, LpPageContent> = {
  "curriculo-ats": {
    slug: "curriculo-ats",
    path: "/lp/curriculo-ats",
    metaTitle: "Currículo otimizado para ATS com IA",
    metaDescription:
      "Passe nos filtros automáticos de recrutamento. Gere currículo ATS, score e palavras-chave alinhadas à vaga em minutos.",
    headline: "Seu currículo precisa passar no ATS antes de chegar ao recrutador",
    subheadline:
      "A GlobalHire AI adapta seu CV à vaga, destaca palavras-chave e mostra o score ATS — sem enrolação e sem planilha.",
    ctaLabel: "Criar currículo ATS grátis",
    proofTitle: "Profissionais em transição de carreira já usam",
    proofItems: ["Score ATS em segundos", "Palavras-chave da vaga", "Exportação pronta para aplicar"],
    benefits: [
      "Análise ATS gratuita para começar",
      "Sugestões objetivas, não texto genérico",
      "Focado em vagas remotas e internacionais"
    ]
  },
  "curriculo-rejeitado": {
    slug: "curriculo-rejeitado",
    path: "/lp/curriculo-rejeitado",
    metaTitle: "Currículo rejeitado? Corrija com ATS",
    metaDescription:
      "Muitas candidaturas somem no filtro automático. Descubra o que falta no seu CV e ajuste com IA em poucos minutos.",
    headline: "Enviou dezenas de CVs e não teve retorno? O ATS pode estar bloqueando",
    subheadline:
      "Veja o que os sistemas de triagem não estão lendo no seu currículo e gere uma versão alinhada à descrição da vaga.",
    ctaLabel: "Diagnosticar meu currículo",
    proofTitle: "O que muda na prática",
    proofItems: ["Match com a vaga em %", "Termos que faltam no CV", "Versão otimizada para reaplicar"],
    benefits: [
      "Entenda por que o CV não avança",
      "Ajuste rápido sem reescrever tudo",
      "Mesma plataforma para carta e LinkedIn"
    ]
  },
  "conseguir-entrevista": {
    slug: "conseguir-entrevista",
    path: "/lp/conseguir-entrevista",
    metaTitle: "Mais entrevistas com currículo e mensagens com IA",
    metaDescription:
      "Melhore currículo ATS, carta de apresentação e mensagem para recrutador. Ferramentas práticas para conseguir mais respostas.",
    headline: "Mais respostas de recrutadores começam com material certo",
    subheadline:
      "Currículo ATS, carta personalizada e mensagem para LinkedIn — tudo alinhado à vaga que você quer, em um só fluxo.",
    ctaLabel: "Começar agora — é grátis",
    proofTitle: "Kit completo para candidatura",
    proofItems: ["Currículo + carta + LinkedIn", "Simulação de entrevista", "Tradução para vagas no exterior"],
    benefits: [
      "1 uso premium grátis por mês",
      "Feito para profissionais em busca ativa",
      "Upgrade só quando fizer sentido"
    ]
  }
};

export function getLpPage(slug: string): LpPageContent | null {
  if (slug in lpPages) return lpPages[slug as LpSlug];
  return null;
}
