export type Locale = "pt-BR" | "pt-PT" | "en" | "es" | "fr" | "de";

export const locales: Array<{ value: Locale; label: string; outputLabel: string }> = [
  { value: "pt-BR", label: "Português (Brasil)", outputLabel: "Português do Brasil" },
  { value: "pt-PT", label: "Português (Portugal)", outputLabel: "Português de Portugal" },
  { value: "en", label: "English", outputLabel: "English" },
  { value: "es", label: "Español", outputLabel: "Español" },
  { value: "fr", label: "Français", outputLabel: "Français" },
  { value: "de", label: "Deutsch", outputLabel: "Deutsch" }
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
    deliveryType: "Tipo de entrega",
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
      interview_prep: "Simular entrevista",
      translate_resume: "Traduzir/adaptar currículo"
    }
  },
  "pt-PT": {
    generatorTitle: "Gerador GlobalHire AI",
    interfaceLanguage: "Idioma da interface",
    resume: "Cole o seu currículo",
    resumePlaceholder: "Cole aqui o seu currículo atual...",
    jobDescription: "Cole a descrição da vaga",
    jobDescriptionPlaceholder: "Cole aqui a vaga pretendida...",
    outputLanguage: "Idioma do documento",
    targetCountry: "País-alvo",
    deliveryType: "Tipo de entrega",
    generate: "Gerar com IA",
    generating: "A gerar...",
    finalDocument: "Documento final",
    pdfTemplate: "Template PDF",
    pdf: "PDF",
    emptyOutput: "O seu documento aparecerá aqui depois da geração.",
    appliedImprovements: "Melhorias aplicadas",
    emptyImprovements: "As melhorias aplicadas aparecerão aqui, separadas do PDF do currículo.",
    watermarkNotice: "PDFs do plano gratuito incluem marca de água GlobalHire AI. Planos pagos exportam sem marca de água.",
    errorFallback: "Não foi possível gerar agora.",
    deliveryTypes: {
      ats_resume: "Otimizar currículo ATS",
      cover_letter: "Gerar carta de apresentação",
      linkedin_summary: "Gerar resumo de LinkedIn",
      recruiter_message: "Mensagem para recrutador",
      interview_prep: "Simular entrevista",
      translate_resume: "Traduzir/adaptar currículo"
    }
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
    deliveryType: "Delivery type",
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
      interview_prep: "Interview simulation",
      translate_resume: "Translate/adapt resume"
    }
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
    deliveryType: "Tipo de entrega",
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
      interview_prep: "Simular entrevista",
      translate_resume: "Traducir/adaptar currículum"
    }
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
    deliveryType: "Type de livrable",
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
      interview_prep: "Simuler un entretien",
      translate_resume: "Traduire/adapter le CV"
    }
  },
  de: {
    generatorTitle: "GlobalHire AI Generator",
    interfaceLanguage: "Sprache der Oberfläche",
    resume: "Lebenslauf einfügen",
    resumePlaceholder: "Fügen Sie hier Ihren aktuellen Lebenslauf ein...",
    jobDescription: "Stellenbeschreibung einfügen",
    jobDescriptionPlaceholder: "Fügen Sie hier die gewünschte Stelle ein...",
    outputLanguage: "Dokumentsprache",
    targetCountry: "Zielland",
    deliveryType: "Lieferart",
    generate: "Mit KI generieren",
    generating: "Wird generiert...",
    finalDocument: "Finales Dokument",
    pdfTemplate: "PDF-Vorlage",
    pdf: "PDF",
    emptyOutput: "Ihr Dokument erscheint hier nach der Generierung.",
    appliedImprovements: "Umgesetzte Verbesserungen",
    emptyImprovements: "Die umgesetzten Verbesserungen erscheinen hier, getrennt vom Lebenslauf-PDF.",
    watermarkNotice: "PDFs im kostenlosen Plan enthalten ein GlobalHire AI-Wasserzeichen. Bezahlte Pläne exportieren ohne Wasserzeichen.",
    errorFallback: "Die Generierung ist derzeit nicht möglich.",
    deliveryTypes: {
      ats_resume: "ATS-Lebenslauf optimieren",
      cover_letter: "Anschreiben erstellen",
      linkedin_summary: "LinkedIn-Zusammenfassung erstellen",
      recruiter_message: "Nachricht an Recruiter",
      interview_prep: "Vorstellungsgespräch simulieren",
      translate_resume: "Lebenslauf übersetzen/anpassen"
    }
  }
};

export const navCopy: Record<Locale, {
  login: string;
  signup: string;
  dashboard: string;
  history: string;
  admin: string;
  logout: string;
}> = {
  "pt-BR": { login: "Login", signup: "Criar conta", dashboard: "Dashboard", history: "Histórico", admin: "Admin", logout: "Sair" },
  "pt-PT": { login: "Login", signup: "Criar conta", dashboard: "Dashboard", history: "Histórico", admin: "Admin", logout: "Sair" },
  en: { login: "Log in", signup: "Create account", dashboard: "Dashboard", history: "History", admin: "Admin", logout: "Log out" },
  es: { login: "Iniciar sesión", signup: "Crear cuenta", dashboard: "Panel", history: "Historial", admin: "Admin", logout: "Salir" },
  fr: { login: "Connexion", signup: "Créer un compte", dashboard: "Tableau de bord", history: "Historique", admin: "Admin", logout: "Déconnexion" },
  de: { login: "Anmelden", signup: "Konto erstellen", dashboard: "Dashboard", history: "Verlauf", admin: "Admin", logout: "Abmelden" }
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
    benefits: ["Currículos com palavras-chave para ATS", "Cartas alinhadas a cada vaga", "LinkedIn com posicionamento internacional", "Mensagens para recrutadores sem travar", "Preparação para entrevistas em outro idioma", "Adaptação por país: EUA, Canadá e Europa"],
    pricingTitle: "Preços simples",
    scoreTitle: "Aumente seu ATS Score antes de aplicar.",
    scoreText: "Planos pagos liberam mais gerações, exportação sem marca d'água e otimizações contínuas por vaga.",
    freePlan: "Grátis",
    paidPlan: "Pro/Elite",
    startNow: "Começar agora",
    faqTitle: "FAQ",
    faqs: [["Preciso saber inglês?", "Não. A plataforma ajuda a traduzir, adaptar e melhorar seu material para o idioma escolhido."], ["O currículo fica pronto para ATS?", "Sim. A IA prioriza clareza, palavras-chave da vaga e formato legível por sistemas de recrutamento."], ["Posso cancelar quando quiser?", "Sim. As assinaturas mensais podem ser canceladas pelo Stripe."], ["Funciona para vagas remotas?", "Sim. O produto foi pensado para profissionais buscando vagas remotas e internacionais."]],
    finalCtaTitle: "Sua próxima vaga internacional começa pelo documento certo."
  },
  "pt-PT": {
    eyebrow: "Para talento global à procura de oportunidades internacionais",
    headline: "Pare de enviar currículos ignorados.",
    subheadline: "Crie currículos internacionais otimizados para ATS, cartas de apresentação e LinkedIn em minutos com IA.",
    primaryCta: "Criar o meu currículo grátis",
    secondaryCta: "Ver planos",
    previewItems: ["Resumo global", "Palavras-chave para trabalho remoto", "Tom por país", "Mensagem para recrutador"],
    previewLabel: "Resultado",
    previewText: "Resumo profissional otimizado para funções remotas internacionais, ATS e clareza para recrutadores.",
    featureCards: [
      { title: "Problema", text: "Bons currículos podem falhar quando não comunicam com ATS, idioma, país e expectativas do recrutador." },
      { title: "Solução", text: "A IA transforma o seu material em entregas prontas para vaga, país e idioma." },
      { title: "Inteligência", text: "Histórico, candidaturas por setor e vaga, ATS Score e índices de melhoria para orientar cada candidatura." }
    ],
    howItWorks: "Como funciona",
    steps: [{ title: "Base", text: "Cole o seu currículo atual." }, { title: "Vaga", text: "Adicione a descrição da vaga." }, { title: "Direção", text: "Escolha idioma, país e entrega." }, { title: "Documento", text: "Receba uma versão pronta para candidatura." }],
    benefitsTitle: "Benefícios",
    benefits: ["Currículos com palavras-chave para ATS", "Cartas alinhadas a cada vaga", "LinkedIn com posicionamento internacional", "Mensagens para recrutadores sem bloqueios", "Preparação para entrevistas noutro idioma", "Adaptação por país: EUA, Canadá e Europa"],
    pricingTitle: "Preços simples",
    scoreTitle: "Aumente o seu ATS Score antes de se candidatar.",
    scoreText: "Planos pagos desbloqueiam mais gerações, exportação sem marca de água e otimizações contínuas por vaga.",
    freePlan: "Grátis",
    paidPlan: "Pro/Elite",
    startNow: "Começar agora",
    faqTitle: "FAQ",
    faqs: [["Preciso de saber inglês?", "Não. A plataforma ajuda a traduzir, adaptar e melhorar o seu material para o idioma escolhido."], ["O currículo fica pronto para ATS?", "Sim. A IA prioriza clareza, palavras-chave da vaga e formato legível por sistemas de recrutamento."], ["Posso cancelar quando quiser?", "Sim. As assinaturas mensais podem ser canceladas pelo Stripe."], ["Funciona para vagas remotas?", "Sim. O produto foi pensado para profissionais que procuram vagas remotas e internacionais."]],
    finalCtaTitle: "A sua próxima vaga internacional começa pelo documento certo."
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
    benefits: ["ATS keyword optimization", "Cover letters tailored to each role", "International LinkedIn positioning", "Recruiter messages without friction", "Interview preparation in another language", "Country adaptation for the US, Canada and Europe"],
    pricingTitle: "Simple pricing",
    scoreTitle: "Raise your ATS Score before applying.",
    scoreText: "Paid plans unlock more generations, watermark-free exports and continuous job-specific optimization.",
    freePlan: "Free",
    paidPlan: "Pro/Elite",
    startNow: "Start now",
    faqTitle: "FAQ",
    faqs: [["Do I need to know English?", "No. The platform helps translate, adapt and improve your material for the selected language."], ["Will my resume be ATS-ready?", "Yes. The AI prioritizes clarity, role keywords and formats that recruiting systems can read."], ["Can I cancel anytime?", "Yes. Monthly subscriptions can be cancelled through Stripe."], ["Does it work for remote jobs?", "Yes. The product is designed for professionals pursuing remote and international roles."]],
    finalCtaTitle: "Your next international opportunity starts with the right document."
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
    benefits: ["Currículums con palabras clave para ATS", "Cartas alineadas a cada vacante", "Posicionamiento internacional en LinkedIn", "Mensajes para reclutadores sin bloqueo", "Preparación de entrevistas en otro idioma", "Adaptación por país: EE. UU., Canadá y Europa"],
    pricingTitle: "Precios simples",
    scoreTitle: "Mejora tu ATS Score antes de postular.",
    scoreText: "Los planes de pago liberan más generaciones, exportación sin marca de agua y optimizaciones continuas por vacante.",
    freePlan: "Gratis",
    paidPlan: "Pro/Elite",
    startNow: "Empezar ahora",
    faqTitle: "FAQ",
    faqs: [["¿Necesito saber inglés?", "No. La plataforma ayuda a traducir, adaptar y mejorar tu material para el idioma elegido."], ["¿El currículum queda listo para ATS?", "Sí. La IA prioriza claridad, palabras clave de la vacante y un formato legible por sistemas de reclutamiento."], ["¿Puedo cancelar cuando quiera?", "Sí. Las suscripciones mensuales pueden cancelarse en Stripe."], ["¿Funciona para trabajos remotos?", "Sí. El producto está pensado para profesionales que buscan puestos remotos e internacionales."]],
    finalCtaTitle: "Tu próxima oportunidad internacional empieza con el documento correcto."
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
    benefits: ["CV avec mots-clés ATS", "Lettres adaptées à chaque poste", "Positionnement LinkedIn international", "Messages recruteurs sans blocage", "Préparation d'entretien dans une autre langue", "Adaptation par pays : États-Unis, Canada et Europe"],
    pricingTitle: "Tarifs simples",
    scoreTitle: "Améliorez votre ATS Score avant de postuler.",
    scoreText: "Les offres payantes débloquent plus de générations, l'export sans filigrane et l'optimisation continue par poste.",
    freePlan: "Gratuit",
    paidPlan: "Pro/Elite",
    startNow: "Commencer",
    faqTitle: "FAQ",
    faqs: [["Dois-je parler anglais ?", "Non. La plateforme aide à traduire, adapter et améliorer votre contenu dans la langue choisie."], ["Le CV est-il prêt pour l'ATS ?", "Oui. L'IA privilégie la clarté, les mots-clés du poste et un format lisible par les systèmes de recrutement."], ["Puis-je annuler à tout moment ?", "Oui. Les abonnements mensuels peuvent être annulés via Stripe."], ["Est-ce adapté aux postes à distance ?", "Oui. Le produit est conçu pour les professionnels visant des postes à distance et internationaux."]],
    finalCtaTitle: "Votre prochaine opportunité internationale commence par le bon document."
  },
  de: {
    eyebrow: "Für globale Talente auf dem Weg zu internationalen Chancen",
    headline: "Hören Sie auf, Lebensläufe zu versenden, die ignoriert werden.",
    subheadline: "Erstellen Sie ATS-optimierte internationale Lebensläufe, Anschreiben und LinkedIn-Zusammenfassungen in wenigen Minuten mit KI.",
    primaryCta: "Lebenslauf kostenlos erstellen",
    secondaryCta: "Pläne ansehen",
    previewItems: ["Globales Profil", "Keywords für Remote-Rollen", "Länderspezifischer Ton", "Recruiter-Nachricht"],
    previewLabel: "Ergebnis",
    previewText: "Berufliches Profil, optimiert für internationale Remote-Rollen, ATS-Prüfung und Klarheit für Recruiter.",
    featureCards: [{ title: "Problem", text: "Ein guter Lebenslauf kann scheitern, wenn er nicht zu ATS, Sprache, Land und Recruiter-Erwartungen passt." }, { title: "Lösung", text: "KI verwandelt Ihr Material in bewerbungsfertige Dokumente für Rolle, Land und Sprache." }, { title: "Intelligenz", text: "Verlauf, Bewerbungen nach Branche und Rolle, ATS Score und Verbesserungsindizes zur Steuerung jeder Bewerbung." }],
    howItWorks: "So funktioniert es",
    steps: [{ title: "Basis", text: "Fügen Sie Ihren aktuellen Lebenslauf ein." }, { title: "Rolle", text: "Fügen Sie die Stellenbeschreibung hinzu." }, { title: "Richtung", text: "Wählen Sie Sprache, Land und Ausgabe." }, { title: "Dokument", text: "Erhalten Sie eine bewerbungsfertige Version." }],
    benefitsTitle: "Vorteile",
    benefits: ["Lebensläufe mit ATS-Keywords", "Anschreiben passend zu jeder Rolle", "Internationale LinkedIn-Positionierung", "Recruiter-Nachrichten ohne Blockade", "Interviewvorbereitung in einer anderen Sprache", "Anpassung nach Land: USA, Kanada und Europa"],
    pricingTitle: "Einfache Preise",
    scoreTitle: "Erhöhen Sie Ihren ATS Score vor der Bewerbung.",
    scoreText: "Bezahlte Pläne schalten mehr Generierungen, Exporte ohne Wasserzeichen und kontinuierliche Optimierungen pro Stelle frei.",
    freePlan: "Kostenlos",
    paidPlan: "Pro/Elite",
    startNow: "Jetzt starten",
    faqTitle: "FAQ",
    faqs: [["Muss ich Englisch können?", "Nein. Die Plattform hilft, Ihr Material in die gewählte Sprache zu übersetzen, anzupassen und zu verbessern."], ["Ist der Lebenslauf ATS-ready?", "Ja. Die KI priorisiert Klarheit, Stellen-Keywords und ein Format, das Recruiting-Systeme lesen können."], ["Kann ich jederzeit kündigen?", "Ja. Monatliche Abos können über Stripe gekündigt werden."], ["Funktioniert es für Remote-Jobs?", "Ja. Das Produkt ist für Fachkräfte gedacht, die Remote- und internationale Rollen suchen."]],
    finalCtaTitle: "Ihre nächste internationale Chance beginnt mit dem richtigen Dokument."
  }
};
