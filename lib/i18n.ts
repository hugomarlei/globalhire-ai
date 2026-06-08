export type Locale = "pt-BR" | "en" | "es" | "fr";

export const locales: Array<{ value: Locale; label: string; outputLabel: string }> = [
  { value: "pt-BR", label: "Português (Brasil)", outputLabel: "Português do Brasil" },
  { value: "en", label: "English (US)", outputLabel: "English" },
  { value: "es", label: "Español", outputLabel: "Español" },
  { value: "fr", label: "Français", outputLabel: "Français" }
];

export const dashboardCopy: Record<Locale, {
  generatorTitle: string;
  interfaceLanguage: string;
  resume: string;
  resumePlaceholder: string;
  jobDescription: string;
  jobDescriptionPlaceholder: string;
  outputLanguage: string;
  targetCountry: string;
  deliveryType: string;
  generate: string;
  generating: string;
  finalDocument: string;
  pdfTemplate: string;
  pdf: string;
  emptyOutput: string;
  appliedImprovements: string;
  emptyImprovements: string;
  watermarkNotice: string;
  errorFallback: string;
  deliveryTypes: Record<string, string>;
  themeTitle: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  historyDownloadText: string;
  historyExportUnavailable: string;
}> = {
  "pt-BR": {
    generatorTitle: "Gerador GlobalHire AI",
    interfaceLanguage: "Idioma da interface",
    resume: "Cole seu currículo",
    resumePlaceholder: "Cole aqui seu currículo atual...",
    jobDescription: "Cole a descrição da vaga",
    jobDescriptionPlaceholder: "Cole aqui a vaga desejada...",
    outputLanguage: "Idioma do documento",
    targetCountry: "País-alvo",
    deliveryType: "O que você quer criar?",
    generate: "Gerar com IA",
    generating: "Gerando...",
    finalDocument: "Documento final",
    pdfTemplate: "Template PDF",
    pdf: "PDF",
    emptyOutput: "Seu documento aparecerá aqui depois da geração.",
    appliedImprovements: "Melhorias aplicadas",
    emptyImprovements: "As melhorias aplicadas aparecerão aqui, separadas do PDF do currículo.",
    watermarkNotice: "PDFs do plano grátis saem com marca d'água GlobalHire AI. Planos pagos exportam sem marca d'água.",
    errorFallback: "Não foi possível gerar agora.",
    deliveryTypes: {
      ats_resume: "Otimizar currículo ATS",
      cover_letter: "Gerar carta de apresentação",
      linkedin_summary: "Gerar resumo de LinkedIn",
      recruiter_message: "Mensagem para recrutador",
      interview_prep: "Guia para entrevista",
      translate_resume: "Traduzir currículo"
    },
    themeTitle: "Aparência",
    themeLight: "Claro",
    themeDark: "Escuro",
    themeSystem: "Sistema (dispositivo)",
    historyDownloadText: "Baixar PDF",
    historyExportUnavailable: "Não há texto salvo para exportar."
  },
  en: {
    generatorTitle: "GlobalHire AI Generator",
    interfaceLanguage: "Interface language",
    resume: "Paste your resume",
    resumePlaceholder: "Paste your current resume here...",
    jobDescription: "Paste the job description",
    jobDescriptionPlaceholder: "Paste the target job here...",
    outputLanguage: "Document language",
    targetCountry: "Target country",
    deliveryType: "What do you want to create?",
    generate: "Generate with AI",
    generating: "Generating...",
    finalDocument: "Final document",
    pdfTemplate: "PDF template",
    pdf: "PDF",
    emptyOutput: "Your document will appear here after generation.",
    appliedImprovements: "Applied improvements",
    emptyImprovements: "Applied improvements will appear here, separate from the resume PDF.",
    watermarkNotice: "Free plan PDFs include a GlobalHire AI watermark. Paid plans export without a watermark.",
    errorFallback: "We could not generate this right now.",
    deliveryTypes: {
      ats_resume: "Optimize ATS resume",
      cover_letter: "Generate cover letter",
      linkedin_summary: "Generate LinkedIn summary",
      recruiter_message: "Recruiter message",
      interview_prep: "Interview guide",
      translate_resume: "Translate resume"
    },
    themeTitle: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    historyDownloadText: "Download PDF",
    historyExportUnavailable: "No saved text to export."
  },
  es: {
    generatorTitle: "Generador GlobalHire AI",
    interfaceLanguage: "Idioma de la interfaz",
    resume: "Pega tu currículum",
    resumePlaceholder: "Pega aquí tu currículum actual...",
    jobDescription: "Pega la descripción de la vacante",
    jobDescriptionPlaceholder: "Pega aquí la vacante deseada...",
    outputLanguage: "Idioma del documento",
    targetCountry: "País objetivo",
    deliveryType: "¿Qué quieres crear?",
    generate: "Generar con IA",
    generating: "Generando...",
    finalDocument: "Documento final",
    pdfTemplate: "Plantilla PDF",
    pdf: "PDF",
    emptyOutput: "Tu documento aparecerá aquí después de la generación.",
    appliedImprovements: "Mejoras aplicadas",
    emptyImprovements: "Las mejoras aplicadas aparecerán aquí, separadas del PDF del currículum.",
    watermarkNotice: "Los PDF del plan gratuito incluyen marca de agua GlobalHire AI. Los planes de pago exportan sin marca de agua.",
    errorFallback: "No fue posible generar ahora.",
    deliveryTypes: {
      ats_resume: "Optimizar currículum ATS",
      cover_letter: "Generar carta de presentación",
      linkedin_summary: "Generar resumen de LinkedIn",
      recruiter_message: "Mensaje para reclutador",
      interview_prep: "Guía para entrevista",
      translate_resume: "Traducir currículum"
    },
    themeTitle: "Apariencia",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema (dispositivo)",
    historyDownloadText: "Descargar PDF",
    historyExportUnavailable: "No hay texto guardado para exportar."
  },
  fr: {
    generatorTitle: "Générateur GlobalHire AI",
    interfaceLanguage: "Langue de l'interface",
    resume: "Collez votre CV",
    resumePlaceholder: "Collez ici votre CV actuel...",
    jobDescription: "Collez la description du poste",
    jobDescriptionPlaceholder: "Collez ici l'offre ciblée...",
    outputLanguage: "Langue du document",
    targetCountry: "Pays cible",
    deliveryType: "Que voulez-vous créer ?",
    generate: "Générer avec l'IA",
    generating: "Génération...",
    finalDocument: "Document final",
    pdfTemplate: "Modèle PDF",
    pdf: "PDF",
    emptyOutput: "Votre document apparaîtra ici après la génération.",
    appliedImprovements: "Améliorations appliquées",
    emptyImprovements: "Les améliorations appliquées apparaîtront ici, séparées du PDF du CV.",
    watermarkNotice: "Les PDF du plan gratuit incluent un filigrane GlobalHire AI. Les plans payants exportent sans filigrane.",
    errorFallback: "Impossible de générer le document pour le moment.",
    deliveryTypes: {
      ats_resume: "Optimiser le CV ATS",
      cover_letter: "Générer une lettre de motivation",
      linkedin_summary: "Générer un résumé LinkedIn",
      recruiter_message: "Message au recruteur",
      interview_prep: "Guide d’entretien",
      translate_resume: "Traduire le CV"
    },
    themeTitle: "Apparence",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système (appareil)",
    historyDownloadText: "Télécharger PDF",
    historyExportUnavailable: "Aucun texte enregistré à exporter."
  }
};

export const navCopy: Record<Locale, {
  login: string;
  signup: string;
  dashboard: string;
  history: string;
  admin: string;
  adminGrowth: string;
  logout: string;
}> = {
  "pt-BR": {
    login: "Entrar",
    signup: "Criar conta",
    dashboard: "Dashboard",
    history: "Histórico",
    admin: "Admin",
    adminGrowth: "Growth",
    logout: "Sair"
  },
  en: {
    login: "Log in",
    signup: "Create account",
    dashboard: "Dashboard",
    history: "History",
    admin: "Admin",
    adminGrowth: "Growth",
    logout: "Log out"
  },
  es: {
    login: "Iniciar sesión",
    signup: "Crear cuenta",
    dashboard: "Panel",
    history: "Historial",
    admin: "Admin",
    adminGrowth: "Growth",
    logout: "Salir"
  },
  fr: {
    login: "Connexion",
    signup: "Créer un compte",
    dashboard: "Tableau de bord",
    history: "Historique",
    admin: "Admin",
    adminGrowth: "Growth",
    logout: "Déconnexion"
  }
};

export const landingCopy: Record<Locale, {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  previewItems: string[];
  previewLabel: string;
  previewText: string;
  featureCards: Array<{ title: string; text: string }>;
  howItWorks: string;
  steps: Array<{ title: string; text: string }>;
  benefitsTitle: string;
  benefits: string[];
  pricingTitle: string;
  scoreTitle: string;
  scoreText: string;
  freePlan: string;
  paidPlan: string;
  startNow: string;
  faqTitle: string;
  faqs: Array<[string, string]>;
  finalCtaTitle: string;
  logoutBanner: string;
  shareLabel: string;
  shareLinkedIn: string;
  shareWhatsApp: string;
  shareCopyText: string;
  shareCopied: string;
  honestyLine: string;
  truthCards: Array<[string, string]>;
  featuresSectionTitle: string;
  featuresSectionLead: string;
  whoTitle: string;
  whoLines: string[];
  pricingLead: string;
  planCta: string;
  recommendedBadge: string;
  stats: Array<[string, string]>;
  scoreMockLabel: string;
  scoreMockSubtitle: string;
  scoreBefore: string;
  scoreAfter: string;
  scoreHintTitle: string;
  scoreHintBody: string;
  finalCtaButton: string;
  pricingDisclaimer: string;
  heroTagline: string;
  pricingSectionTitle: string;
  howItWorksCards: Array<{ title: string; text: string }>;
  marketingFaqs: Array<[string, string]>;
}> = {
  "pt-BR": {
    eyebrow: "Para talentos globais mirando oportunidades internacionais",
    headline: "Pare de enviar currículos ignorados.",
    subheadline: "Crie currículos internacionais otimizados para ATS, cartas de apresentação e LinkedIn em minutos com IA.",
    primaryCta: "Criar meu currículo grátis",
    secondaryCta: "Ver planos",
    previewItems: ["Resumo global", "Palavras-chave para vagas remotas", "Tom por país", "Mensagem para recrutador"],
    previewLabel: "Resultado",
    previewText: "Resumo profissional otimizado para vagas remotas internacionais, ATS e clareza para recrutadores.",
    featureCards: [
      { title: "Problema", text: "Currículos bons podem falhar quando não conversam com ATS, idioma, país e expectativa do recrutador." },
      { title: "Solução", text: "A IA transforma seu material em entregas prontas para vaga, país e idioma." },
      { title: "Inteligência", text: "Histórico, aplicações por setor e vaga, ATS Score e índices de melhoria para orientar cada candidatura." }
    ],
    howItWorks: "Como funciona",
    steps: [
      { title: "Base", text: "Cole seu currículo atual." },
      { title: "Vaga", text: "Adicione a descrição da vaga." },
      { title: "Direção", text: "Escolha idioma, país e entrega." },
      { title: "Documento", text: "Receba uma versão pronta para candidatura." }
    ],
    benefitsTitle: "Benefícios",
    benefits: ["Currículos com palavras-chave para ATS", "Cartas alinhadas a cada vaga", "LinkedIn com posicionamento internacional", "Mensagens para recrutadores sem travar", "Preparação para entrevistas em outro idioma", "Adaptação por região: Brasil, Estados Unidos e Europa"],
    pricingTitle: "Preços simples",
    scoreTitle: "Aumente seu ATS Score antes de aplicar.",
    scoreText: "Planos pagos liberam mais gerações, exportação sem marca d'água e otimizações contínuas por vaga.",
    freePlan: "Grátis",
    paidPlan: "Pro/Elite",
    startNow: "Começar agora",
    faqTitle: "FAQ",
    faqs: [["Preciso saber inglês?", "Não. A plataforma ajuda a traduzir, adaptar e melhorar seu material para o idioma escolhido."], ["O currículo fica pronto para ATS?", "Sim. A IA prioriza clareza, palavras-chave da vaga e formato legível por sistemas de recrutamento."], ["Posso cancelar quando quiser?", "Sim. As assinaturas mensais podem ser canceladas pelo Stripe."], ["Funciona para vagas remotas?", "Sim. O produto foi pensado para profissionais buscando vagas remotas e internacionais."]],
    finalCtaTitle: "Sua próxima vaga internacional começa pelo documento certo.",
    logoutBanner: "Você saiu da sua conta. Volte quando quiser para continuar suas candidaturas.",
    shareLabel: "Compartilhar",
    shareLinkedIn: "Compartilhar no LinkedIn",
    shareWhatsApp: "Compartilhar no WhatsApp",
    shareCopyText: "Copiar texto",
    shareCopied: "Texto copiado",
    honestyLine: "Tecnologia para competir melhor. Sem promessa de entrevista, emprego ou contratação.",
    truthCards: [
      ["O problema", "Muitos currículos são rejeitados antes de chegar ao recrutador porque não conversam com a vaga nem com filtros ATS."],
      ["A solução", "A IA compara seu currículo com a descrição da vaga e reescreve seus materiais com linguagem mais clara, específica e alinhada."],
      ["O limite honesto", "A ferramenta aumenta qualidade e aderência, mas a decisão final continua sendo humana e depende do processo seletivo."]
    ],
    featuresSectionTitle: "Funcionalidades",
    featuresSectionLead: "Tudo para transformar uma candidatura genérica em um pacote profissional consistente.",
    whoTitle: "Para quem é",
    whoLines: [
      "Profissionais buscando vagas remotas ou internacionais.",
      "Candidatos multilíngues que precisam adaptar currículo e LinkedIn.",
      "Pessoas que querem entender melhor ATS, palavras-chave e aderência à vaga."
    ],
    pricingLead: "Comece com uma geração premium gratuita. Depois escolha o plano que combina com seu volume de candidaturas.",
    planCta: "Começar",
    recommendedBadge: "Recomendado",
    stats: [
      ["ATS", "match por vaga"],
      ["6", "ferramentas IA"],
      ["Global", "idioma e mercado"]
    ],
    scoreMockLabel: "ATS Score simulado",
    scoreMockSubtitle: "Antes e depois da otimização",
    scoreBefore: "Currículo genérico",
    scoreAfter: "Versão alinhada",
    scoreHintTitle: "Sinal de clareza profissional",
    scoreHintBody:
      "Antes: \"Responsável por relatórios e reuniões.\" Depois: \"Conduziu análises de performance comercial, priorizou indicadores de receita e apoiou decisões executivas em ambiente internacional.\"",
    finalCtaButton: "Criar meu currículo grátis",
    pricingDisclaimer: "Valores em BRL. Ofertas sujeitas a alteração.",
    heroTagline: "Get Hired Smarter. · Documentos de carreira com IA para oportunidades globais",
    pricingSectionTitle: "Planos claros para começar",
    howItWorksCards: [
      { title: "Cole ou envie seu currículo", text: "Use PDF, DOCX ou texto manual. Você mantém controle sobre o que envia." },
      { title: "Cole a descrição da vaga", text: "A IA identifica palavras-chave, responsabilidades, senioridade e contexto da oportunidade." },
      { title: "Receba uma versão otimizada", text: "Gere currículo, carta, LinkedIn e materiais profissionais com foco em ATS e clareza." }
    ],
    marketingFaqs: [
      [
        "A GlobalHire AI garante entrevista ou emprego?",
        "Não. A plataforma melhora a clareza, aderência e estrutura dos seus materiais, mas nenhuma ferramenta pode garantir entrevista, aprovação ou contratação."
      ],
      [
        "Meus dados profissionais são usados pela IA?",
        "Sim, apenas para processar a solicitação que você faz, como otimizar currículo ou gerar carta. Evite enviar dados sensíveis desnecessários."
      ],
      ["Posso usar para vagas fora do Brasil?", "Sim. Você pode adaptar idioma, país-alvo e estilo do documento para candidaturas internacionais."],
      ["Qual plano devo começar?", "O Free permite uma degustação premium. O Starter é bom para uso pontual, Pro para candidaturas recorrentes e Elite para otimização máxima."]
    ]
  },
  en: {
    eyebrow: "For global talent pursuing international opportunities",
    headline: "Stop sending resumes that get ignored.",
    subheadline: "Create ATS-optimized international resumes, cover letters and LinkedIn summaries in minutes with AI.",
    primaryCta: "Create my resume for free",
    secondaryCta: "View plans",
    previewItems: ["Global resume summary", "Remote-work keywords", "Country-specific tone", "Recruiter message"],
    previewLabel: "Result",
    previewText: "Professional summary optimized for international remote roles, ATS screening and recruiter clarity.",
    featureCards: [{ title: "Problem", text: "Strong resumes can fail when they do not match ATS systems, language, country expectations and recruiter intent." }, { title: "Solution", text: "AI turns your material into job-ready assets adapted to each role, country and language." }, { title: "Intelligence", text: "History, applications by sector and role, ATS Score and improvement indexes to guide every application." }],
    howItWorks: "How it works",
    steps: [{ title: "Base", text: "Paste your current resume." }, { title: "Role", text: "Add the job description." }, { title: "Direction", text: "Choose language, country and output." }, { title: "Document", text: "Receive an application-ready version." }],
    benefitsTitle: "Benefits",
    benefits: ["ATS keyword optimization", "Cover letters tailored to each role", "International LinkedIn positioning", "Recruiter messages without friction", "Interview preparation in another language", "Regional adaptation: Brazil, United States and Europe"],
    pricingTitle: "Simple pricing",
    scoreTitle: "Raise your ATS Score before applying.",
    scoreText: "Paid plans unlock more generations, watermark-free exports and continuous job-specific optimization.",
    freePlan: "Free",
    paidPlan: "Pro/Elite",
    startNow: "Start now",
    faqTitle: "FAQ",
    faqs: [["Do I need to know English?", "No. The platform helps translate, adapt and improve your material for the selected language."], ["Will my resume be ATS-ready?", "Yes. The AI prioritizes clarity, role keywords and formats that recruiting systems can read."], ["Can I cancel anytime?", "Yes. Monthly subscriptions can be cancelled through Stripe."], ["Does it work for remote jobs?", "Yes. The product is designed for professionals pursuing remote and international roles."]],
    finalCtaTitle: "Your next international opportunity starts with the right document.",
    logoutBanner: "You have signed out. Come back anytime to continue your applications.",
    shareLabel: "Share",
    shareLinkedIn: "Share on LinkedIn",
    shareWhatsApp: "Share on WhatsApp",
    shareCopyText: "Copy text",
    shareCopied: "Text copied",
    honestyLine: "Technology to compete better. No promise of interviews, hiring or employment.",
    truthCards: [
      ["The problem", "Many resumes are rejected before they reach the recruiter because they do not match the role or ATS filters."],
      ["The solution", "AI compares your resume with the job description and rewrites your materials with clearer, more specific language."],
      ["The honest limit", "The tool improves quality and fit, but the final decision remains human and depends on the hiring process."]
    ],
    featuresSectionTitle: "Features",
    featuresSectionLead: "Everything you need to turn a generic application into a consistent professional package.",
    whoTitle: "Who it is for",
    whoLines: [
      "Professionals targeting remote or international roles.",
      "Multilingual candidates who need to adapt resume and LinkedIn.",
      "People who want to understand ATS, keywords and job fit better."
    ],
    pricingLead: "Start with one free premium generation. Then pick the plan that matches your application volume.",
    planCta: "Get started",
    recommendedBadge: "Recommended",
    stats: [
      ["ATS", "role match"],
      ["6", "AI tools"],
      ["Global", "language & market"]
    ],
    scoreMockLabel: "Simulated ATS score",
    scoreMockSubtitle: "Before and after optimization",
    scoreBefore: "Generic resume",
    scoreAfter: "Aligned version",
    scoreHintTitle: "Professional clarity signal",
    scoreHintBody:
      "Before: \"Responsible for reports and meetings.\" After: \"Led commercial performance analyses, prioritized revenue indicators and supported executive decisions in an international environment.\"",
    finalCtaButton: "Create my resume for free",
    pricingDisclaimer: "Prices in BRL. Offers subject to change.",
    heroTagline: "Get Hired Smarter. · Career documents with AI for global opportunities",
    pricingSectionTitle: "Clear plans to get started",
    howItWorksCards: [
      { title: "Paste or upload your resume", text: "Use PDF, DOCX or plain text. You stay in control of what you share." },
      { title: "Paste the job description", text: "The AI identifies keywords, responsibilities, seniority level and role context." },
      { title: "Get an optimized version", text: "Generate resume, cover letter, LinkedIn and professional materials focused on ATS and clarity." }
    ],
    marketingFaqs: [
      [
        "Does GlobalHire AI guarantee interviews or a job?",
        "No. The platform improves clarity, fit and structure of your materials, but no tool can guarantee interviews, approval or hiring."
      ],
      [
        "Are my professional details used by the AI?",
        "Yes, only to process the request you make, such as optimizing a resume or generating a letter. Avoid sending unnecessary sensitive data."
      ],
      ["Can I use it for roles outside Brazil?", "Yes. You can adapt language, target country and document style for international applications."],
      ["Which plan should I start with?", "Free includes one premium preview. Starter works for occasional use, Pro for frequent applications and Elite for maximum optimization."]
    ]
  },
  es: {
    eyebrow: "Para talento global que busca oportunidades internacionales",
    headline: "Deja de enviar currículums ignorados.",
    subheadline: "Crea currículums internacionales optimizados para ATS, cartas de presentación y resúmenes de LinkedIn en minutos con IA.",
    primaryCta: "Crear mi currículum gratis",
    secondaryCta: "Ver planes",
    previewItems: ["Resumen global", "Palabras clave para trabajo remoto", "Tono por país", "Mensaje para reclutador"],
    previewLabel: "Resultado",
    previewText: "Resumen profesional optimizado para roles remotos internacionales, ATS y claridad para reclutadores.",
    featureCards: [{ title: "Problema", text: "Un buen currículum puede fallar si no se adapta al ATS, idioma, país y expectativas del reclutador." }, { title: "Solución", text: "La IA transforma tu material en documentos listos para cada vacante, país e idioma." }, { title: "Inteligencia", text: "Historial, postulaciones por sector y vacante, ATS Score e índices de mejora para orientar cada candidatura." }],
    howItWorks: "Cómo funciona",
    steps: [{ title: "Base", text: "Pega tu currículum actual." }, { title: "Vacante", text: "Añade la descripción de la vacante." }, { title: "Dirección", text: "Elige idioma, país y entrega." }, { title: "Documento", text: "Recibe una versión lista para postular." }],
    benefitsTitle: "Beneficios",
    benefits: ["Currículums con palabras clave para ATS", "Cartas alineadas a cada vacante", "Posicionamiento internacional en LinkedIn", "Mensajes para reclutadores sin bloqueo", "Preparación de entrevistas en otro idioma", "Adaptación regional: Brasil, Estados Unidos y Europa"],
    pricingTitle: "Precios simples",
    scoreTitle: "Mejora tu ATS Score antes de postular.",
    scoreText: "Los planes de pago liberan más generaciones, exportación sin marca de agua y optimizaciones continuas por vacante.",
    freePlan: "Gratis",
    paidPlan: "Pro/Elite",
    startNow: "Empezar ahora",
    faqTitle: "FAQ",
    faqs: [["¿Necesito saber inglés?", "No. La plataforma ayuda a traducir, adaptar y mejorar tu material para el idioma elegido."], ["¿El currículum queda listo para ATS?", "Sí. La IA prioriza claridad, palabras clave de la vacante y un formato legible por sistemas de reclutamiento."], ["¿Puedo cancelar cuando quiera?", "Sí. Las suscripciones mensuales pueden cancelarse en Stripe."], ["¿Funciona para trabajos remotos?", "Sí. El producto está pensado para profesionales que buscan puestos remotos e internacionales."]],
    finalCtaTitle: "Tu próxima oportunidad internacional empieza con el documento correcto.",
    logoutBanner: "Has cerrado sesión. Vuelve cuando quieras para seguir con tus candidaturas.",
    shareLabel: "Compartir",
    shareLinkedIn: "Compartir en LinkedIn",
    shareWhatsApp: "Compartir en WhatsApp",
    shareCopyText: "Copiar texto",
    shareCopied: "Texto copiado",
    honestyLine: "Tecnología para competir mejor. Sin promesa de entrevista, contratación o empleo.",
    truthCards: [
      ["El problema", "Muchos currículums se rechazan antes de llegar al reclutador porque no conectan con la vacante ni con los filtros ATS."],
      ["La solución", "La IA compara tu currículum con la descripción del puesto y reescribe tus materiales con un lenguaje más claro y alineado."],
      ["El límite honesto", "La herramienta mejora calidad y encaje, pero la decisión final sigue siendo humana y depende del proceso."],
    ],
    featuresSectionTitle: "Funcionalidades",
    featuresSectionLead: "Todo para transformar una candidatura genérica en un paquete profesional consistente.",
    whoTitle: "Para quién es",
    whoLines: [
      "Profesionales que buscan roles remotos o internacionales.",
      "Candidatos multilingües que necesitan adaptar currículum y LinkedIn.",
      "Personas que quieren entender mejor ATS, palabras clave y ajuste a la vacante."
    ],
    pricingLead: "Empieza con una generación premium gratuita. Luego elige el plan que encaje con tu volumen de candidaturas.",
    planCta: "Empezar",
    recommendedBadge: "Recomendado",
    stats: [
      ["ATS", "match con la vacante"],
      ["6", "herramientas IA"],
      ["Global", "idioma y mercado"]
    ],
    scoreMockLabel: "ATS Score simulado",
    scoreMockSubtitle: "Antes y después de la optimización",
    scoreBefore: "Currículum genérico",
    scoreAfter: "Versión alineada",
    scoreHintTitle: "Señal de claridad profesional",
    scoreHintBody:
      "Antes: \"Responsable de informes y reuniones.\" Después: \"Lideró análisis de desempeño comercial, priorizó indicadores de ingresos y apoyó decisiones ejecutivas en un entorno internacional.\"",
    finalCtaButton: "Crear mi currículum gratis",
    pricingDisclaimer: "Precios en BRL. Ofertas sujetas a cambios.",
    heroTagline: "Get Hired Smarter. · Documentos de carrera con IA para oportunidades globales",
    pricingSectionTitle: "Planes claros para empezar",
    howItWorksCards: [
      { title: "Pega o sube tu currículum", text: "Usa PDF, DOCX o texto manual. Tú decides qué compartes." },
      { title: "Pega la descripción de la vacante", text: "La IA identifica palabras clave, responsabilidades, seniority y contexto del rol." },
      { title: "Recibe una versión optimizada", text: "Genera currículum, carta, LinkedIn y materiales con foco en ATS y claridad." }
    ],
    marketingFaqs: [
      [
        "¿GlobalHire AI garantiza entrevista o empleo?",
        "No. La plataforma mejora claridad, encaje y estructura de tus materiales, pero ninguna herramienta puede garantizar entrevista, aprobación o contratación."
      ],
      [
        "¿Mis datos profesionales los usa la IA?",
        "Sí, solo para procesar la solicitud que haces, como optimizar currículum o generar carta. Evita enviar datos sensibles innecesarios."
      ],
      ["¿Puedo usarlo para vacantes fuera de Brasil?", "Sí. Puedes adaptar idioma, país objetivo y estilo del documento para candidaturas internacionales."],
      ["¿Con qué plan empiezo?", "Free incluye una prueba premium. Starter para uso puntual, Pro para candidaturas frecuentes y Elite para máxima optimización."]
    ]
  },
  fr: {
    eyebrow: "Pour les talents mondiaux visant des opportunités internationales",
    headline: "Arrêtez d'envoyer des CV ignorés.",
    subheadline: "Créez des CV internationaux optimisés ATS, des lettres de motivation et des résumés LinkedIn en quelques minutes avec l'IA.",
    primaryCta: "Créer mon CV gratuitement",
    secondaryCta: "Voir les offres",
    previewItems: ["Résumé global", "Mots-clés pour postes à distance", "Ton adapté au pays", "Message au recruteur"],
    previewLabel: "Résultat",
    previewText: "Résumé professionnel optimisé pour les postes internationaux à distance, l'ATS et la clarté pour les recruteurs.",
    featureCards: [{ title: "Problème", text: "Un bon CV peut échouer s'il ne correspond pas à l'ATS, à la langue, au pays et aux attentes du recruteur." }, { title: "Solution", text: "L'IA transforme votre contenu en documents prêts pour chaque poste, pays et langue." }, { title: "Intelligence", text: "Historique, candidatures par secteur et poste, ATS Score et indices d'amélioration pour guider chaque candidature." }],
    howItWorks: "Comment ça marche",
    steps: [{ title: "Base", text: "Collez votre CV actuel." }, { title: "Poste", text: "Ajoutez la description du poste." }, { title: "Direction", text: "Choisissez la langue, le pays et le livrable." }, { title: "Document", text: "Recevez une version prête à candidater." }],
    benefitsTitle: "Avantages",
    benefits: ["CV avec mots-clés ATS", "Lettres adaptées à chaque poste", "Positionnement LinkedIn international", "Messages recruteurs sans blocage", "Préparation d'entretien dans une autre langue", "Adaptation régionale : Brésil, États-Unis et Europe"],
    pricingTitle: "Tarifs simples",
    scoreTitle: "Améliorez votre ATS Score avant de postuler.",
    scoreText: "Les offres payantes débloquent plus de générations, l'export sans filigrane et l'optimisation continue par poste.",
    freePlan: "Gratuit",
    paidPlan: "Pro/Elite",
    startNow: "Commencer",
    faqTitle: "FAQ",
    faqs: [["Dois-je parler anglais ?", "Non. La plateforme aide à traduire, adapter et améliorer votre contenu dans la langue choisie."], ["Le CV est-il prêt pour l'ATS ?", "Oui. L'IA privilégie la clarté, les mots-clés du poste et un format lisible par les systèmes de recrutement."], ["Puis-je annuler à tout moment ?", "Oui. Les abonnements mensuels peuvent être annulés via Stripe."], ["Est-ce adapté aux postes à distance ?", "Oui. Le produit est conçu pour les professionnels visant des postes à distance et internationaux."]],
    finalCtaTitle: "Votre prochaine opportunité internationale commence par le bon document.",
    logoutBanner: "Vous êtes déconnecté. Revenez quand vous voulez pour poursuivre vos candidatures.",
    shareLabel: "Partager",
    shareLinkedIn: "Partager sur LinkedIn",
    shareWhatsApp: "Partager sur WhatsApp",
    shareCopyText: "Copier le texte",
    shareCopied: "Texte copié",
    honestyLine: "Technologie pour mieux concourir. Aucune promesse d'entretien, d'embauche ou d'emploi.",
    truthCards: [
      ["Le problème", "De nombreux CV sont rejetés avant d'atteindre le recruteur car ils ne correspondent pas au poste ni aux filtres ATS."],
      ["La solution", "L'IA compare votre CV à la description du poste et réécrit vos supports avec un langage plus clair et ciblé."],
      ["La limite honnête", "L'outil améliore la qualité et l'adéquation, mais la décision finale reste humaine et dépend du processus de recrutement."]
    ],
    featuresSectionTitle: "Fonctionnalités",
    featuresSectionLead: "Tout pour transformer une candidature générique en un dossier professionnel cohérent.",
    whoTitle: "Pour qui",
    whoLines: [
      "Professionnels visant des postes à distance ou internationaux.",
      "Candidats multilingues qui doivent adapter CV et LinkedIn.",
      "Personnes qui veulent mieux comprendre l'ATS, les mots-clés et l'adéquation au poste."
    ],
    pricingLead: "Commencez par une génération premium gratuite. Choisissez ensuite l'offre adaptée à votre volume de candidatures.",
    planCta: "Commencer",
    recommendedBadge: "Recommandé",
    stats: [
      ["ATS", "adéquation au poste"],
      ["6", "outils IA"],
      ["Global", "langue & marché"]
    ],
    scoreMockLabel: "Score ATS simulé",
    scoreMockSubtitle: "Avant et après optimisation",
    scoreBefore: "CV générique",
    scoreAfter: "Version alignée",
    scoreHintTitle: "Signal de clarté professionnelle",
    scoreHintBody:
      "Avant : « Responsable des rapports et des réunions. » Après : « A conduit des analyses de performance commerciale, a priorisé les indicateurs de revenu et a soutenu les décisions exécutives dans un contexte international. »",
    finalCtaButton: "Créer mon CV gratuitement",
    pricingDisclaimer: "Prix en BRL. Offres susceptibles d'évoluer.",
    heroTagline: "Get Hired Smarter. · Documents de carrière avec IA pour des opportunités mondiales",
    pricingSectionTitle: "Des offres claires pour commencer",
    howItWorksCards: [
      { title: "Collez ou envoyez votre CV", text: "PDF, DOCX ou texte brut. Vous gardez le contrôle sur ce que vous partagez." },
      { title: "Collez la description du poste", text: "L'IA identifie les mots-clés, responsabilités, niveau de séniorité et le contexte du rôle." },
      { title: "Recevez une version optimisée", text: "Générez CV, lettre, LinkedIn et supports professionnels orientés ATS et clarté." }
    ],
    marketingFaqs: [
      [
        "GlobalHire AI garantit-elle un entretien ou un emploi ?",
        "Non. La plateforme améliore clarté, adéquation et structure de vos supports, mais aucun outil ne peut garantir entretien, validation ou embauche."
      ],
      [
        "Mes données professionnelles sont-elles utilisées par l'IA ?",
        "Oui, uniquement pour traiter votre demande (optimiser un CV, générer une lettre, etc.). Évitez d'envoyer des données sensibles inutiles."
      ],
      ["Puis-je l'utiliser pour des postes hors du Brésil ?", "Oui. Vous pouvez adapter langue, pays cible et style du document pour des candidatures internationales."],
      ["Quelle offre choisir pour commencer ?", "Free inclut un aperçu premium. Starter pour un usage ponctuel, Pro pour des candidatures régulières et Elite pour une optimisation maximale."]
    ]
  }
};

export const footerCopy: Record<Locale, {
  copyright: string;
  cookiePreferences: string;
  privacy: string;
  terms: string;
  cookies: string;
  refund: string;
  dataProcessing: string;
  support: string;
  cnpjLine: string;
}> = {
  "pt-BR": {
    copyright: "© 2026 GlobalHire AI. Todos os direitos reservados.",
    cookiePreferences: "Preferências de cookies",
    privacy: "Privacidade",
    terms: "Termos",
    cookies: "Cookies",
    refund: "Reembolso",
    dataProcessing: "Dados",
    support: "Suporte",
    cnpjLine: "CNPJ 66.634.493/0001-20"
  },
  en: {
    copyright: "© 2026 GlobalHire AI. All rights reserved.",
    cookiePreferences: "Cookie preferences",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    refund: "Refund policy",
    dataProcessing: "Data processing",
    support: "Support",
    cnpjLine: "CNPJ 66.634.493/0001-20"
  },
  es: {
    copyright: "© 2026 GlobalHire AI. Todos los derechos reservados.",
    cookiePreferences: "Preferencias de cookies",
    privacy: "Privacidad",
    terms: "Términos",
    cookies: "Cookies",
    refund: "Reembolso",
    dataProcessing: "Datos",
    support: "Soporte",
    cnpjLine: "CNPJ 66.634.493/0001-20"
  },
  fr: {
    copyright: "© 2026 GlobalHire AI. Tous droits réservés.",
    cookiePreferences: "Préférences cookies",
    privacy: "Confidentialité",
    terms: "Conditions",
    cookies: "Cookies",
    refund: "Remboursement",
    dataProcessing: "Données",
    support: "Assistance",
    cnpjLine: "CNPJ 66.634.493/0001-20"
  }
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "pt-BR" || value === "en" || value === "es" || value === "fr";
}
