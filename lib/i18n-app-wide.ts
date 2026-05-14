import type { Locale } from "@/lib/i18n";
import { dashboardCopy } from "@/lib/i18n";
import { generatorUiCopy, type PdfTemplateKey } from "@/lib/i18n-generator";
import type { GenerationType } from "@/lib/types";

/** Cookie consent + preferências (4 idiomas). */
export type CookieConsentStrings = {
  title: string;
  body: string;
  essentialsTitle: string;
  essentialsBody: string;
  analyticsTitle: string;
  analyticsBody: string;
  legalPrefix: string;
  privacyLink: string;
  legalMid: string;
  termsLink: string;
  legalSuffix: string;
  acceptAll: string;
  rejectAnalytics: string;
  preferences: string;
};

export const cookieConsentCopy: Record<Locale, CookieConsentStrings> = {
  "pt-BR": {
    title: "Preferências de privacidade",
    body: "Usamos cookies essenciais e tecnologias similares para login, segurança, análise de uso e melhoria da experiência. Analytics, como Microsoft Clarity, só será carregado com seu consentimento.",
    essentialsTitle: "Essenciais",
    essentialsBody: "Necessários para login, segurança e funcionamento da conta. Sempre ativos.",
    analyticsTitle: "Analytics",
    analyticsBody: "Ajuda a entender uso do produto sem armazenar currículos completos nos logs.",
    legalPrefix: "Veja a",
    privacyLink: "Política de Privacidade",
    legalMid: "e os",
    termsLink: "Termos de Uso",
    legalSuffix: ".",
    acceptAll: "Aceitar todos",
    rejectAnalytics: "Rejeitar analytics",
    preferences: "Preferências"
  },
  en: {
    title: "Privacy preferences",
    body: "We use essential cookies and similar technologies for login, security, usage insights and product quality. Analytics (such as Microsoft Clarity) load only with your consent.",
    essentialsTitle: "Essential",
    essentialsBody: "Required for login, security and core account features. Always on.",
    analyticsTitle: "Analytics",
    analyticsBody: "Helps us understand product usage without storing full resumes in logs.",
    legalPrefix: "Read our",
    privacyLink: "Privacy Policy",
    legalMid: "and",
    termsLink: "Terms of Use",
    legalSuffix: ".",
    acceptAll: "Accept all",
    rejectAnalytics: "Reject analytics",
    preferences: "Preferences"
  },
  es: {
    title: "Preferencias de privacidad",
    body: "Usamos cookies esenciales y tecnologías similares para inicio de sesión, seguridad y mejora del producto. Analytics (p. ej. Microsoft Clarity) solo se cargan con tu consentimiento.",
    essentialsTitle: "Esenciales",
    essentialsBody: "Necesarios para inicio de sesión, seguridad y funcionamiento de la cuenta. Siempre activos.",
    analyticsTitle: "Analytics",
    analyticsBody: "Ayuda a entender el uso del producto sin guardar CV completos en los registros.",
    legalPrefix: "Consulta la",
    privacyLink: "Política de privacidad",
    legalMid: "y los",
    termsLink: "Términos de uso",
    legalSuffix: ".",
    acceptAll: "Aceptar todo",
    rejectAnalytics: "Rechazar analytics",
    preferences: "Preferencias"
  },
  fr: {
    title: "Préférences de confidentialité",
    body: "Nous utilisons des cookies essentiels et technologies similaires pour la connexion, la sécurité et l'amélioration du produit. Les analytics (ex. Microsoft Clarity) ne se chargent qu'avec votre consentement.",
    essentialsTitle: "Essentiels",
    essentialsBody: "Nécessaires à la connexion, à la sécurité et au fonctionnement du compte. Toujours actifs.",
    analyticsTitle: "Analytics",
    analyticsBody: "Aide à comprendre l'usage du produit sans stocker des CV complets dans les journaux.",
    legalPrefix: "Voir la",
    privacyLink: "Politique de confidentialité",
    legalMid: "et les",
    termsLink: "Conditions d'utilisation",
    legalSuffix: ".",
    acceptAll: "Tout accepter",
    rejectAnalytics: "Refuser les analytics",
    preferences: "Préférences"
  }
};

export type AppNavStrings = {
  tagline: string;
  tools: string;
  analyze: string;
  documents: string;
  account: string;
  menu: string;
  languageAria: string;
  toolAts: string;
  toolCover: string;
  toolLinkedin: string;
  toolRecruiter: string;
  toolInterview: string;
  toolTranslate: string;
  atsScore: string;
  keywords: string;
  history: string;
  myDocuments: string;
  myAccount: string;
  subscription: string;
  settings: string;
  support: string;
  privacy: string;
};

export const appNavStrings: Record<Locale, AppNavStrings> = {
  "pt-BR": {
    tagline: "Get Hired Smarter.",
    tools: "Ferramentas",
    analyze: "Analisar",
    documents: "Documentos",
    account: "Conta",
    menu: "Menu",
    languageAria: "Idioma",
    toolAts: "Currículo ATS",
    toolCover: "Carta de apresentação",
    toolLinkedin: "Resumo LinkedIn",
    toolRecruiter: "Mensagem para recrutador",
    toolInterview: "Simular entrevista",
    toolTranslate: "Traduzir currículo",
    atsScore: "ATS Score",
    keywords: "Palavras-chave",
    history: "Histórico",
    myDocuments: "Meus documentos",
    myAccount: "Minha conta",
    subscription: "Assinatura",
    settings: "Configurações",
    support: "Suporte",
    privacy: "Privacidade"
  },
  en: {
    tagline: "Get Hired Smarter.",
    tools: "Tools",
    analyze: "Analyze",
    documents: "Documents",
    account: "Account",
    menu: "Menu",
    languageAria: "Language",
    toolAts: "ATS resume",
    toolCover: "Cover letter",
    toolLinkedin: "LinkedIn summary",
    toolRecruiter: "Recruiter message",
    toolInterview: "Interview prep",
    toolTranslate: "Translate resume",
    atsScore: "ATS Score",
    keywords: "Keywords",
    history: "History",
    myDocuments: "My documents",
    myAccount: "My account",
    subscription: "Subscription",
    settings: "Settings",
    support: "Support",
    privacy: "Privacy"
  },
  es: {
    tagline: "Get Hired Smarter.",
    tools: "Herramientas",
    analyze: "Analizar",
    documents: "Documentos",
    account: "Cuenta",
    menu: "Menú",
    languageAria: "Idioma",
    toolAts: "CV ATS",
    toolCover: "Carta de presentación",
    toolLinkedin: "Resumen LinkedIn",
    toolRecruiter: "Mensaje al reclutador",
    toolInterview: "Simular entrevista",
    toolTranslate: "Traducir CV",
    atsScore: "ATS Score",
    keywords: "Palabras clave",
    history: "Historial",
    myDocuments: "Mis documentos",
    myAccount: "Mi cuenta",
    subscription: "Suscripción",
    settings: "Configuración",
    support: "Soporte",
    privacy: "Privacidad"
  },
  fr: {
    tagline: "Get Hired Smarter.",
    tools: "Outils",
    analyze: "Analyser",
    documents: "Documents",
    account: "Compte",
    menu: "Menu",
    languageAria: "Langue",
    toolAts: "CV ATS",
    toolCover: "Lettre de motivation",
    toolLinkedin: "Résumé LinkedIn",
    toolRecruiter: "Message recruteur",
    toolInterview: "Simulation d'entretien",
    toolTranslate: "Traduire le CV",
    atsScore: "ATS Score",
    keywords: "Mots-clés",
    history: "Historique",
    myDocuments: "Mes documents",
    myAccount: "Mon compte",
    subscription: "Abonnement",
    settings: "Paramètres",
    support: "Assistance",
    privacy: "Confidentialité"
  }
};

export type SettingsPageStrings = {
  title: string;
  lead: string;
  cardPrefsTitle: string;
  fieldDefaultLanguage: string;
  fieldDefaultDelivery: string;
  fieldDefaultCountry: string;
  fieldPdfTemplate: string;
  save: string;
  saved: string;
  footnote: string;
  appearanceTitle: string;
  appearanceLead: string;
  themeNote: string;
  communicationsTitle: string;
  communicationsBody: string;
  templatesCardTitle: string;
  templatesCardBody: string;
};

export const settingsPageCopy: Record<Locale, SettingsPageStrings> = {
  "pt-BR": {
    title: "Configurações",
    lead: "Defina padrões para reduzir cliques nas próximas gerações.",
    cardPrefsTitle: "Preferências de geração",
    fieldDefaultLanguage: "Idioma padrão",
    fieldDefaultDelivery: "Tipo de entrega padrão",
    fieldDefaultCountry: "País-alvo padrão",
    fieldPdfTemplate: "Template de exportação PDF (padrão no Gerador)",
    save: "Salvar preferências",
    saved: "Preferências salvas",
    footnote:
      "As preferências desta área personalizam automaticamente sua experiência no Gerador (idioma de saída, país-alvo e template de PDF ao abrir a ferramenta). Os valores ficam armazenados neste navegador neste dispositivo.",
    appearanceTitle: "Aparência",
    appearanceLead: "Claro, escuro ou seguir o dispositivo. A preferência fica neste navegador.",
    themeNote:
      "O tema é aplicado imediatamente e lembrado neste dispositivo. Em navegação privada, as preferências podem não persistir entre sessões.",
    communicationsTitle: "Comunicações da conta",
    communicationsBody:
      "Preferências de comunicação associadas à sua conta. Quando necessário para segurança ou conformidade, enviamos e-mails transacionais (por exemplo, confirmações de acesso). Para pedidos relacionados a mensagens institucionais, utilize o canal de suporte indicado no site.",
    templatesCardTitle: "Templates",
    templatesCardBody:
      "Três modelos de PDF no Gerador — Executivo ATS, Moderno internacional e Compacto premium — definem tipografia, margens e estilo da página exportada. O padrão escolhido na lista ao lado é aplicado ao abrir o Gerador; você pode alterar o modelo na própria tela antes de exportar."
  },
  en: {
    title: "Settings",
    lead: "Set defaults to reduce clicks on future generations.",
    cardPrefsTitle: "Generation defaults",
    fieldDefaultLanguage: "Default language",
    fieldDefaultDelivery: "Default delivery type",
    fieldDefaultCountry: "Default target country",
    fieldPdfTemplate: "Default PDF export template (Generator)",
    save: "Save preferences",
    saved: "Preferences saved",
    footnote:
      "These preferences personalize the Generator when you open it (output language, target country and PDF template). Values are stored in this browser on this device.",
    appearanceTitle: "Appearance",
    appearanceLead: "Light, dark or follow the device. The preference stays in this browser.",
    themeNote:
      "Theme applies immediately and is remembered on this device. In private browsing, preferences may not persist across sessions.",
    communicationsTitle: "Account communications",
    communicationsBody:
      "Communication preferences tied to your account. For security or compliance we may send transactional emails (for example access confirmations). For institutional messaging requests, use the support channel listed on the site.",
    templatesCardTitle: "Templates",
    templatesCardBody:
      "Three PDF models in the Generator define typography, margins and export style. The default you pick here applies when you open the Generator; you can change it on that screen before exporting."
  },
  es: {
    title: "Configuración",
    lead: "Define valores por defecto para reducir clics en próximas generaciones.",
    cardPrefsTitle: "Preferencias de generación",
    fieldDefaultLanguage: "Idioma predeterminado",
    fieldDefaultDelivery: "Tipo de entrega predeterminado",
    fieldDefaultCountry: "País objetivo predeterminado",
    fieldPdfTemplate: "Plantilla PDF de exportación (predeterminada en el Generador)",
    save: "Guardar preferencias",
    saved: "Preferencias guardadas",
    footnote:
      "Estas preferencias personalizan el Generador al abrirlo (idioma de salida, país objetivo y plantilla PDF). Los valores se guardan en este navegador y dispositivo.",
    appearanceTitle: "Apariencia",
    appearanceLead: "Claro, oscuro o seguir el dispositivo. La preferencia queda en este navegador.",
    themeNote:
      "El tema se aplica de inmediato y se recuerda en este dispositivo. En modo privado, puede no persistir entre sesiones.",
    communicationsTitle: "Comunicaciones de la cuenta",
    communicationsBody:
      "Preferencias de comunicación asociadas a tu cuenta. Por seguridad o cumplimiento podemos enviar correos transaccionales (por ejemplo confirmaciones de acceso). Para solicitudes sobre mensajes institucionales, usa el canal de soporte del sitio.",
    templatesCardTitle: "Plantillas",
    templatesCardBody:
      "Tres modelos de PDF en el Generador definen tipografía, márgenes y estilo de exportación. El valor por defecto aquí se aplica al abrir el Generador; puedes cambiarlo en esa pantalla antes de exportar."
  },
  fr: {
    title: "Paramètres",
    lead: "Définissez des valeurs par défaut pour réduire les clics lors des prochaines générations.",
    cardPrefsTitle: "Préférences de génération",
    fieldDefaultLanguage: "Langue par défaut",
    fieldDefaultDelivery: "Type de livrable par défaut",
    fieldDefaultCountry: "Pays cible par défaut",
    fieldPdfTemplate: "Modèle PDF d'export (par défaut dans le générateur)",
    save: "Enregistrer les préférences",
    saved: "Préférences enregistrées",
    footnote:
      "Ces préférences personnalisent le générateur à l'ouverture (langue de sortie, pays cible et modèle PDF). Les valeurs sont stockées dans ce navigateur sur cet appareil.",
    appearanceTitle: "Apparence",
    appearanceLead: "Clair, sombre ou suivre l'appareil. La préférence reste dans ce navigateur.",
    themeNote:
      "Le thème s'applique immédiatement et est mémorisé sur cet appareil. En navigation privée, il peut ne pas persister entre les sessions.",
    communicationsTitle: "Communications du compte",
    communicationsBody:
      "Préférences de communication liées à votre compte. Pour la sécurité ou la conformité, nous pouvons envoyer des e-mails transactionnels (par exemple confirmations d'accès). Pour les demandes liées aux messages institutionnels, utilisez le canal support du site.",
    templatesCardTitle: "Modèles",
    templatesCardBody:
      "Trois modèles PDF dans le générateur définissent typographie, marges et style d'export. La valeur par défaut choisie ici s'applique à l'ouverture du générateur ; vous pouvez la modifier avant export."
  }
};

/** Migra valores antigos de entrega (rótulos PT) para chaves estáveis. */
export const legacyDeliveryTypeToKey: Record<string, string> = {
  "Currículo ATS": "ats_resume",
  "Carta de apresentação": "cover_letter",
  "Resumo LinkedIn": "linkedin_summary",
  "Mensagem para recrutador": "recruiter_message",
  "Preparação para entrevista": "interview_prep",
  "Tradução/adaptação": "translate_resume"
};

export const legacyTemplateToKey: Record<string, string> = {
  "Executivo ATS": "executive",
  "Moderno internacional": "modern",
  "Compacto premium": "compact"
};

export type AuthLoginStrings = {
  title: string;
  lead: string;
  passwordUpdated: string;
  socialNotConfigured: string;
  continueEmail: string;
  email: string;
  password: string;
  captchaError: string;
  wrongCredentials: string;
  signingIn: string;
  signIn: string;
  createAccount: string;
  recoverPassword: string;
  legalPrefix: string;
  terms: string;
  legalMid: string;
  privacy: string;
  legalSuffix: string;
};

export const authLoginCopy: Record<Locale, AuthLoginStrings> = {
  "pt-BR": {
    title: "Entrar",
    lead: "Acesse seu painel da GlobalHire AI.",
    passwordUpdated: "Senha atualizada com sucesso. Entre com sua nova senha.",
    socialNotConfigured: "Login social ainda não configurado. Use e-mail e senha por enquanto.",
    continueEmail: "Continuar com e-mail",
    email: "E-mail",
    password: "Senha",
    captchaError: "Confirme o captcha para entrar.",
    wrongCredentials: "E-mail ou senha incorretos.",
    signingIn: "Entrando...",
    signIn: "Entrar",
    createAccount: "Criar conta",
    recoverPassword: "Recuperar senha",
    legalPrefix: "Ao entrar, você concorda com os",
    terms: "Termos de Uso",
    legalMid: "e confirma ciência da",
    privacy: "Política de Privacidade",
    legalSuffix: "."
  },
  en: {
    title: "Sign in",
    lead: "Access your GlobalHire AI workspace.",
    passwordUpdated: "Password updated successfully. Sign in with your new password.",
    socialNotConfigured: "Social login is not configured yet. Please use email and password.",
    continueEmail: "Continue with email",
    email: "Email",
    password: "Password",
    captchaError: "Please complete the captcha to continue.",
    wrongCredentials: "Incorrect email or password.",
    signingIn: "Signing in...",
    signIn: "Sign in",
    createAccount: "Create account",
    recoverPassword: "Reset password",
    legalPrefix: "By signing in you agree to the",
    terms: "Terms of Use",
    legalMid: "and acknowledge the",
    privacy: "Privacy Policy",
    legalSuffix: "."
  },
  es: {
    title: "Iniciar sesión",
    lead: "Accede a tu panel de GlobalHire AI.",
    passwordUpdated: "Contraseña actualizada. Inicia sesión con tu nueva contraseña.",
    socialNotConfigured: "El inicio social aún no está configurado. Usa correo y contraseña.",
    continueEmail: "Continuar con correo",
    email: "Correo",
    password: "Contraseña",
    captchaError: "Confirma el captcha para continuar.",
    wrongCredentials: "Correo o contraseña incorrectos.",
    signingIn: "Entrando...",
    signIn: "Entrar",
    createAccount: "Crear cuenta",
    recoverPassword: "Recuperar contraseña",
    legalPrefix: "Al entrar aceptas los",
    terms: "Términos de uso",
    legalMid: "y confirmas la",
    privacy: "Política de privacidad",
    legalSuffix: "."
  },
  fr: {
    title: "Connexion",
    lead: "Accédez à votre espace GlobalHire AI.",
    passwordUpdated: "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
    socialNotConfigured: "La connexion sociale n'est pas encore configurée. Utilisez e-mail et mot de passe.",
    continueEmail: "Continuer avec l'e-mail",
    email: "E-mail",
    password: "Mot de passe",
    captchaError: "Veuillez valider le captcha pour continuer.",
    wrongCredentials: "E-mail ou mot de passe incorrect.",
    signingIn: "Connexion...",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    recoverPassword: "Récupérer le mot de passe",
    legalPrefix: "En vous connectant, vous acceptez les",
    terms: "Conditions d'utilisation",
    legalMid: "et reconnaissez la",
    privacy: "Politique de confidentialité",
    legalSuffix: "."
  }
};

export type MarketingFaqStrings = { title: string; items: Array<[string, string]> };
export const marketingFaqCopy: Record<Locale, MarketingFaqStrings> = {
  "pt-BR": {
    title: "FAQ",
    items: [
      ["A análise ATS é garantia de aprovação?", "Não. É uma estimativa automatizada para orientar melhorias."],
      ["Posso usar para vagas internacionais?", "Sim. O produto permite selecionar idioma, país-alvo e tipo de entrega."],
      ["Quais formatos de upload são aceitos?", "PDF e DOCX com texto selecionável. PDFs escaneados podem exigir colagem manual."],
      ["Como cancelo?", "Acesse Assinatura e use o portal seguro de pagamentos Stripe."]
    ]
  },
  en: {
    title: "FAQ",
    items: [
      ["Does ATS analysis guarantee approval?", "No. It is an automated estimate to guide improvements."],
      ["Can I use it for international roles?", "Yes. You can select language, target country and delivery type."],
      ["Which upload formats are accepted?", "PDF and DOCX with selectable text. Scanned PDFs may require pasting manually."],
      ["How do I cancel?", "Go to Subscription and use the secure Stripe billing portal."]
    ]
  },
  es: {
    title: "FAQ",
    items: [
      ["¿El ATS garantiza aprobación?", "No. Es una estimación automática para orientar mejoras."],
      ["¿Sirve para vacantes internacionales?", "Sí. Puedes elegir idioma, país objetivo y tipo de entrega."],
      ["¿Qué formatos de subida aceptan?", "PDF y DOCX con texto seleccionable. PDF escaneados pueden requerir pegar manualmente."],
      ["¿Cómo cancelo?", "Ve a Suscripción y usa el portal seguro de Stripe."]
    ]
  },
  fr: {
    title: "FAQ",
    items: [
      ["L'analyse ATS garantit-elle une validation ?", "Non. C'est une estimation automatisée pour guider les améliorations."],
      ["Puis-je l'utiliser pour des postes internationaux ?", "Oui. Vous pouvez choisir la langue, le pays cible et le type de livrable."],
      ["Quels formats d'upload sont acceptés ?", "PDF et DOCX avec texte sélectionnable. Les PDF scannés peuvent nécessiter un collage manuel."],
      ["Comment annuler ?", "Allez dans Abonnement et utilisez le portail sécurisé Stripe."]
    ]
  }
};

export type MarketingPricingStrings = {
  title: string;
  lead: string;
  cta: string;
  stripeNotePrefix: string;
  terms: string;
  mid: string;
  privacy: string;
  mid2: string;
  refund: string;
  suffix: string;
};

export const marketingPricingCopy: Record<Locale, MarketingPricingStrings> = {
  "pt-BR": {
    title: "Planos GlobalHire AI",
    lead: "Escolha entre uma degustação gratuita, uso pontual ou otimização intensiva para candidaturas internacionais.",
    cta: "Começar",
    stripeNotePrefix: "Planos pagos são processados pelo Stripe. Antes de assinar, leia os",
    terms: "Termos de Uso",
    mid: ", a",
    privacy: "Política de Privacidade",
    mid2: "e a",
    refund: "Política de Cancelamento e Reembolso",
    suffix: "."
  },
  en: {
    title: "GlobalHire AI plans",
    lead: "Choose a free preview, occasional use, or intensive optimization for international applications.",
    cta: "Get started",
    stripeNotePrefix: "Paid plans are processed by Stripe. Before subscribing, read the",
    terms: "Terms of Use",
    mid: ", the",
    privacy: "Privacy Policy",
    mid2: "and the",
    refund: "Cancellation and Refund Policy",
    suffix: "."
  },
  es: {
    title: "Planes GlobalHire AI",
    lead: "Elige una prueba gratuita, uso puntual u optimización intensiva para candidaturas internacionales.",
    cta: "Empezar",
    stripeNotePrefix: "Los planes de pago se procesan con Stripe. Antes de suscribirte, lee los",
    terms: "Términos de uso",
    mid: ", la",
    privacy: "Política de privacidad",
    mid2: "y la",
    refund: "Política de cancelación y reembolso",
    suffix: "."
  },
  fr: {
    title: "Offres GlobalHire AI",
    lead: "Choisissez un aperçu gratuit, un usage ponctuel ou une optimisation intensive pour candidatures internationales.",
    cta: "Commencer",
    stripeNotePrefix: "Les offres payantes passent par Stripe. Avant de souscrire, lisez les",
    terms: "Conditions d'utilisation",
    mid: ", la",
    privacy: "Politique de confidentialité",
    mid2: "et la",
    refund: "Politique d'annulation et de remboursement",
    suffix: "."
  }
};

export type MarketingFeaturesStrings = { title: string; lead: string; items: string[] };
export const marketingFeaturesCopy: Record<Locale, MarketingFeaturesStrings> = {
  "pt-BR": {
    title: "Funcionalidades",
    lead: "GlobalHire AI combina otimização ATS e copiloto de carreira com IA para candidatos globais.",
    items: [
      "Otimização de currículo ATS por vaga",
      "Carta de apresentação adaptada",
      "Resumo LinkedIn profissional",
      "Mensagem para recrutador",
      "Preparação para entrevista",
      "Tradução e adaptação internacional",
      "ATS Score e palavras-chave"
    ]
  },
  en: {
    title: "Features",
    lead: "GlobalHire AI combines ATS resume optimization and an AI career copilot for global candidates.",
    items: [
      "ATS resume optimization per job",
      "Tailored cover letter",
      "Professional LinkedIn summary",
      "Recruiter outreach message",
      "Interview preparation",
      "International translation & adaptation",
      "ATS Score and keywords"
    ]
  },
  es: {
    title: "Funcionalidades",
    lead: "GlobalHire AI combina optimización ATS y copiloto de carrera con IA.",
    items: [
      "Optimización de CV ATS por vacante",
      "Carta de presentación adaptada",
      "Resumen profesional de LinkedIn",
      "Mensaje al reclutador",
      "Preparación para entrevista",
      "Traducción y adaptación internacional",
      "ATS Score y palabras clave"
    ]
  },
  fr: {
    title: "Fonctionnalités",
    lead: "GlobalHire AI combine optimisation ATS et copilote carrière IA pour candidats internationaux.",
    items: [
      "Optimisation CV ATS par offre",
      "Lettre de motivation adaptée",
      "Résumé LinkedIn professionnel",
      "Message recruteur",
      "Préparation d'entretien",
      "Traduction et adaptation internationale",
      "ATS Score et mots-clés"
    ]
  }
};

export type MarketingResourcesStrings = {
  title: string;
  lead: string;
  cards: Array<{ title: string; body: string }>;
};
export const marketingResourcesCopy: Record<Locale, MarketingResourcesStrings> = {
  "pt-BR": {
    title: "Recursos",
    lead: "Espaço reservado para guias de currículo ATS, candidatura internacional, LinkedIn e entrevistas.",
    cards: [
      { title: "Guia de currículo ATS", body: "Conteúdo editorial em preparação." },
      { title: "Checklist de LinkedIn", body: "Conteúdo editorial em preparação." },
      { title: "Preparação para entrevista internacional", body: "Conteúdo editorial em preparação." }
    ]
  },
  en: {
    title: "Resources",
    lead: "Reserved space for ATS resume guides, international applications, LinkedIn and interviews.",
    cards: [
      { title: "ATS resume guide", body: "Editorial content in preparation." },
      { title: "LinkedIn checklist", body: "Editorial content in preparation." },
      { title: "International interview prep", body: "Editorial content in preparation." }
    ]
  },
  es: {
    title: "Recursos",
    lead: "Espacio reservado para guías de CV ATS, candidatura internacional, LinkedIn y entrevistas.",
    cards: [
      { title: "Guía de CV ATS", body: "Contenido editorial en preparación." },
      { title: "Checklist de LinkedIn", body: "Contenido editorial en preparación." },
      { title: "Preparación para entrevista internacional", body: "Contenido editorial en preparación." }
    ]
  },
  fr: {
    title: "Ressources",
    lead: "Espace réservé pour guides CV ATS, candidatures internationales, LinkedIn et entretiens.",
    cards: [
      { title: "Guide CV ATS", body: "Contenu éditorial en préparation." },
      { title: "Checklist LinkedIn", body: "Contenu éditorial en préparation." },
      { title: "Préparation d'entretien international", body: "Contenu éditorial en préparation." }
    ]
  }
};

export type SocialAuthStrings = {
  orLogin: string;
  orSignup: string;
  googleLabel: string;
  linkedinLabel: string;
  facebookLabel: string;
  error: string;
};

export const socialAuthCopy: Record<Locale, SocialAuthStrings> = {
  "pt-BR": {
    orLogin: "ou entre com",
    orSignup: "ou cadastre-se com",
    googleLabel: "Continuar com Google",
    linkedinLabel: "Continuar com LinkedIn",
    facebookLabel: "Continuar com Facebook",
    error: "Login social ainda não configurado. Use e-mail e senha por enquanto."
  },
  en: {
    orLogin: "or continue with",
    orSignup: "or sign up with",
    googleLabel: "Continue with Google",
    linkedinLabel: "Continue with LinkedIn",
    facebookLabel: "Continue with Facebook",
    error: "Social login is not configured yet. Please use email and password."
  },
  es: {
    orLogin: "o entra con",
    orSignup: "o regístrate con",
    googleLabel: "Continuar con Google",
    linkedinLabel: "Continuar con LinkedIn",
    facebookLabel: "Continuar con Facebook",
    error: "El login social aún no está configurado. Usa correo y contraseña."
  },
  fr: {
    orLogin: "ou continuer avec",
    orSignup: "ou s'inscrire avec",
    googleLabel: "Continuer avec Google",
    linkedinLabel: "Continuer avec LinkedIn",
    facebookLabel: "Continuer avec Facebook",
    error: "La connexion sociale n'est pas encore configurée. Utilisez e-mail et mot de passe."
  }
};

export type TurnstileStrings = {
  disabled: string;
  loading: string;
  errorBody: string;
  retry: string;
};

export const turnstileCopy: Record<Locale, TurnstileStrings> = {
  "pt-BR": {
    disabled: "Captcha desativado neste ambiente. Em produção, configure Cloudflare Turnstile para proteção anti-bot.",
    loading: "Carregando verificação de segurança...",
    errorBody:
      "Não consegui carregar o captcha. Verifique a conexão, desative bloqueadores para este site ou tente recarregar apenas a verificação.",
    retry: "Recarregar captcha"
  },
  en: {
    disabled: "Captcha is disabled in this environment. In production, configure Cloudflare Turnstile for anti-bot protection.",
    loading: "Loading security verification...",
    errorBody:
      "We could not load the captcha. Check your connection, disable blockers for this site, or try reloading the verification widget.",
    retry: "Reload captcha"
  },
  es: {
    disabled: "Captcha desactivado en este entorno. En producción, configure Cloudflare Turnstile.",
    loading: "Cargando verificación de seguridad...",
    errorBody:
      "No se pudo cargar el captcha. Revisa la conexión, desactiva bloqueadores o intenta recargar la verificación.",
    retry: "Recargar captcha"
  },
  fr: {
    disabled: "Captcha désactivé dans cet environnement. En production, configurez Cloudflare Turnstile.",
    loading: "Chargement de la vérification de sécurité...",
    errorBody:
      "Impossible de charger le captcha. Vérifiez la connexion, désactivez les bloqueurs ou rechargez la vérification.",
    retry: "Recharger le captcha"
  }
};

export type DashboardPageStrings = {
  paymentConfirmed: string;
  checkoutCancelled: string;
  subscriptionUpdated: string;
  checkoutCancelledBody: string;
  subscriptionUpdatedBody: string;
  currentPlan: string;
  eliteTest: string;
  viewPlans: string;
  monthlyUsage: string;
  adminBypassTitle: string;
  adminBypassBody: string;
  intelTitle: string;
  intelEmpty: string;
  docsGenerated: string;
  topType: string;
  lastDoc: string;
  languagesUsed: string;
  targetCountries: string;
  atsScoreCard: string;
  atsScoreHint: string;
  noData: string;
  toolsTitle: string;
  atsKeywords: string;
  unlockAts: string;
  careerTitle: string;
  careerLead: string;
  activityTitle: string;
  activityEmpty: string;
};

export const dashboardPageCopy: Record<Locale, DashboardPageStrings> = {
  "pt-BR": {
    paymentConfirmed: "Pagamento confirmado.",
    checkoutCancelled: "Checkout cancelado.",
    subscriptionUpdated: "Assinatura atualizada.",
    checkoutCancelledBody: "Você continua no plano atual. Pode escolher um plano novamente quando quiser.",
    subscriptionUpdatedBody: "O status do seu plano foi atualizado. Se não aparecer imediatamente, aguarde alguns segundos e recarregue a página.",
    currentPlan: "Plano atual",
    eliteTest: "Elite teste",
    viewPlans: "Ver planos",
    monthlyUsage: "Uso mensal",
    adminBypassTitle: "Bypass administrativo ativo",
    adminBypassBody: "Este e-mail pode testar recursos Elite antes da publicação.",
    intelTitle: "Inteligência de candidatura",
    intelEmpty: "Gere seu primeiro documento para visualizar estatísticas de candidatura.",
    docsGenerated: "Documentos gerados",
    topType: "Tipo mais usado",
    lastDoc: "Último documento",
    languagesUsed: "Idiomas usados",
    targetCountries: "Países-alvo",
    atsScoreCard: "ATS Score",
    atsScoreHint: "Disponível nas análises feitas em ATS Score",
    noData: "Sem dados",
    toolsTitle: "Ferramentas do seu plano",
    atsKeywords: "ATS Score e palavras-chave",
    unlockAts: "Liberar ATS Score no plano Pro",
    careerTitle: "Plataformas de carreira",
    careerLead: "Publique ou acompanhe suas candidaturas nas principais plataformas.",
    activityTitle: "Últimas atividades",
    activityEmpty: "Gere seu primeiro documento para preencher esta área."
  },
  en: {
    paymentConfirmed: "Payment confirmed.",
    checkoutCancelled: "Checkout cancelled.",
    subscriptionUpdated: "Subscription updated.",
    checkoutCancelledBody: "You remain on your current plan. You can pick a plan again anytime.",
    subscriptionUpdatedBody: "Your plan status was updated. If it does not show immediately, wait a few seconds and refresh.",
    currentPlan: "Current plan",
    eliteTest: "Elite (test)",
    viewPlans: "View plans",
    monthlyUsage: "Monthly usage",
    adminBypassTitle: "Admin bypass enabled",
    adminBypassBody: "This email can test Elite features before launch.",
    intelTitle: "Application intelligence",
    intelEmpty: "Generate your first document to see application statistics.",
    docsGenerated: "Documents generated",
    topType: "Most used type",
    lastDoc: "Last document",
    languagesUsed: "Languages used",
    targetCountries: "Target countries",
    atsScoreCard: "ATS Score",
    atsScoreHint: "Available from analyses in ATS Score",
    noData: "No data",
    toolsTitle: "Tools in your plan",
    atsKeywords: "ATS Score and keywords",
    unlockAts: "Unlock ATS Score on the Pro plan",
    careerTitle: "Career platforms",
    careerLead: "Publish or track applications on major platforms.",
    activityTitle: "Latest activity",
    activityEmpty: "Generate your first document to populate this area."
  },
  es: {
    paymentConfirmed: "Pago confirmado.",
    checkoutCancelled: "Checkout cancelado.",
    subscriptionUpdated: "Suscripción actualizada.",
    checkoutCancelledBody: "Sigues en tu plan actual. Puedes elegir un plan de nuevo cuando quieras.",
    subscriptionUpdatedBody: "El estado del plan se actualizó. Si no aparece al instante, espera unos segundos y recarga.",
    currentPlan: "Plan actual",
    eliteTest: "Elite (prueba)",
    viewPlans: "Ver planes",
    monthlyUsage: "Uso mensual",
    adminBypassTitle: "Bypass administrativo activo",
    adminBypassBody: "Este correo puede probar funciones Elite antes del lanzamiento.",
    intelTitle: "Inteligencia de candidatura",
    intelEmpty: "Genera tu primer documento para ver estadísticas.",
    docsGenerated: "Documentos generados",
    topType: "Tipo más usado",
    lastDoc: "Último documento",
    languagesUsed: "Idiomas usados",
    targetCountries: "Países objetivo",
    atsScoreCard: "ATS Score",
    atsScoreHint: "Disponible en los análisis de ATS Score",
    noData: "Sin datos",
    toolsTitle: "Herramientas de tu plan",
    atsKeywords: "ATS Score y palabras clave",
    unlockAts: "Desbloquea ATS Score en el plan Pro",
    careerTitle: "Plataformas de carrera",
    careerLead: "Publica o sigue candidaturas en las principales plataformas.",
    activityTitle: "Últimas actividades",
    activityEmpty: "Genera tu primer documento para llenar esta área."
  },
  fr: {
    paymentConfirmed: "Paiement confirmé.",
    checkoutCancelled: "Paiement annulé.",
    subscriptionUpdated: "Abonnement mis à jour.",
    checkoutCancelledBody: "Vous restez sur votre offre actuelle. Vous pourrez choisir une offre à tout moment.",
    subscriptionUpdatedBody: "Le statut du plan a été mis à jour. Si rien ne s'affiche, attendez quelques secondes puis rafraîchissez.",
    currentPlan: "Offre actuelle",
    eliteTest: "Elite (test)",
    viewPlans: "Voir les offres",
    monthlyUsage: "Usage mensuel",
    adminBypassTitle: "Bypass administrateur actif",
    adminBypassBody: "Cet e-mail peut tester les fonctions Elite avant publication.",
    intelTitle: "Intelligence de candidature",
    intelEmpty: "Générez votre premier document pour voir les statistiques.",
    docsGenerated: "Documents générés",
    topType: "Type le plus utilisé",
    lastDoc: "Dernier document",
    languagesUsed: "Langues utilisées",
    targetCountries: "Pays cibles",
    atsScoreCard: "ATS Score",
    atsScoreHint: "Disponible dans les analyses ATS Score",
    noData: "Aucune donnée",
    toolsTitle: "Outils de votre offre",
    atsKeywords: "ATS Score et mots-clés",
    unlockAts: "Débloquez l'ATS Score avec l'offre Pro",
    careerTitle: "Plateformes carrière",
    careerLead: "Publiez ou suivez vos candidatures sur les principales plateformes.",
    activityTitle: "Dernières activités",
    activityEmpty: "Générez votre premier document pour remplir cette zone."
  }
};

export function deliveryLabel(locale: Locale, type: GenerationType): string {
  return dashboardCopy[locale].deliveryTypes[type];
}

export function pdfTemplateLabel(locale: Locale, key: PdfTemplateKey): string {
  return generatorUiCopy[locale].pdfTemplates[key];
}

