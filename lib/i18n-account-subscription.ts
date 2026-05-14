import type { Locale } from "@/lib/i18n";

export type AccountPanelStrings = {
  pageTitle: string;
  tabAccount: string;
  tabSubscription: string;
  tabReferrals: string;
  userDataTitle: string;
  emailLabel: string;
  currentPlanLabel: string;
  securityTitle: string;
  resetPasswordLink: string;
  settingsPrefsLink: string;
  signOut: string;
  deleteTitle: string;
  deleteBody: string;
  deleteFieldLabel: string;
  deletePhrase: string;
  deleteButton: string;
  deleting: string;
  subscriptionTitle: string;
  monthlyLimitLabel: string;
  statusLabel: string;
  nextBillingLabel: string;
  periodUnknown: string;
  viewPlans: string;
  manageSubscription: string;
  opening: string;
  paymentHistoryTitle: string;
  paymentHistoryBody: string;
  referralsTitle: string;
  referralsBody: string;
  copyLink: string;
  copied: string;
  loadingLink: string;
  referralStat1: string;
  referralStat2: string;
  referralStat3: string;
  referralsFootnote: string;
  portalError: string;
  deleteError: string;
  subscriptionStatuses: Record<string, string>;
};

const subscriptionStatusesPt: Record<string, string> = {
  active: "Ativo",
  trialing: "Em trial",
  canceled: "Cancelado",
  past_due: "Em atraso",
  unpaid: "Não pago",
  incomplete: "Incompleto",
  incomplete_expired: "Incompleto expirado",
  paused: "Pausado",
  free: "Grátis"
};

const subscriptionStatusesEn: Record<string, string> = {
  active: "Active",
  trialing: "Trialing",
  canceled: "Canceled",
  past_due: "Past due",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
  incomplete_expired: "Incomplete expired",
  paused: "Paused",
  free: "Free"
};

const subscriptionStatusesEs: Record<string, string> = {
  active: "Activo",
  trialing: "En prueba",
  canceled: "Cancelado",
  past_due: "Vencido",
  unpaid: "Impago",
  incomplete: "Incompleto",
  incomplete_expired: "Incompleto expirado",
  paused: "En pausa",
  free: "Gratis"
};

const subscriptionStatusesFr: Record<string, string> = {
  active: "Actif",
  trialing: "Essai",
  canceled: "Annulé",
  past_due: "En retard",
  unpaid: "Impayé",
  incomplete: "Incomplet",
  incomplete_expired: "Incomplet expiré",
  paused: "En pause",
  free: "Gratuit"
};

export const accountPanelCopy: Record<Locale, AccountPanelStrings> = {
  "pt-BR": {
    pageTitle: "Conta",
    tabAccount: "Minha conta",
    tabSubscription: "Assinatura",
    tabReferrals: "Indicações",
    userDataTitle: "Dados do usuário",
    emailLabel: "E-mail",
    currentPlanLabel: "Plano atual",
    securityTitle: "Segurança e preferências",
    resetPasswordLink: "Alterar senha usando link seguro por e-mail",
    settingsPrefsLink: "Preferências de idioma, país e geração",
    signOut: "Sair da conta",
    deleteTitle: "Excluir conta e dados",
    deleteBody:
      "Esta ação é irreversível. Ela remove seus documentos, histórico, assinatura registrada no app e tenta cancelar a assinatura Stripe antes de excluir seu usuário Auth.",
    deleteFieldLabel: 'Digite "EXCLUIR MINHA CONTA" para confirmar',
    deletePhrase: "EXCLUIR MINHA CONTA",
    deleteButton: "Excluir conta",
    deleting: "Excluindo...",
    subscriptionTitle: "Assinatura",
    monthlyLimitLabel: "Limite mensal",
    statusLabel: "Status",
    nextBillingLabel: "Próxima cobrança ou fim do período",
    periodUnknown: "Período não informado pela Stripe",
    viewPlans: "Ver planos",
    manageSubscription: "Gerenciar assinatura",
    opening: "Abrindo...",
    paymentHistoryTitle: "Histórico de pagamentos",
    paymentHistoryBody:
      "Você pode gerenciar sua assinatura, forma de pagamento e recibos com segurança pelo portal de pagamentos.",
    referralsTitle: "Indicações",
    referralsBody:
      "Compartilhe a GlobalHire AI com profissionais que estão aplicando para vagas internacionais. Esta área já está pronta para um programa de indicação futuro.",
    copyLink: "Copiar link",
    copied: "Copiado",
    loadingLink: "Carregando link...",
    referralStat1: "Convites enviados",
    referralStat2: "Contas criadas",
    referralStat3: "Créditos futuros",
    referralsFootnote: "Nenhum desconto automático é aplicado ainda. É um placeholder operacional seguro para MVP.",
    portalError: "Não foi possível abrir o portal de assinatura.",
    deleteError: "Não foi possível excluir a conta.",
    subscriptionStatuses: subscriptionStatusesPt
  },
  en: {
    pageTitle: "Account",
    tabAccount: "My account",
    tabSubscription: "Subscription",
    tabReferrals: "Referrals",
    userDataTitle: "User details",
    emailLabel: "Email",
    currentPlanLabel: "Current plan",
    securityTitle: "Security and preferences",
    resetPasswordLink: "Change password via secure email link",
    settingsPrefsLink: "Language, country and generation preferences",
    signOut: "Sign out",
    deleteTitle: "Delete account and data",
    deleteBody:
      "This action is irreversible. It removes your documents, history, in-app subscription records and attempts to cancel your Stripe subscription before deleting your Auth user.",
    deleteFieldLabel: 'Type "DELETE MY ACCOUNT" to confirm',
    deletePhrase: "DELETE MY ACCOUNT",
    deleteButton: "Delete account",
    deleting: "Deleting...",
    subscriptionTitle: "Subscription",
    monthlyLimitLabel: "Monthly limit",
    statusLabel: "Status",
    nextBillingLabel: "Next charge or end of period",
    periodUnknown: "Period not provided by Stripe",
    viewPlans: "View plans",
    manageSubscription: "Manage subscription",
    opening: "Opening...",
    paymentHistoryTitle: "Payment history",
    paymentHistoryBody: "Manage your subscription, payment method and receipts securely in the payments portal.",
    referralsTitle: "Referrals",
    referralsBody:
      "Share GlobalHire AI with professionals applying to international roles. This area is ready for a future referral program.",
    copyLink: "Copy link",
    copied: "Copied",
    loadingLink: "Loading link...",
    referralStat1: "Invites sent",
    referralStat2: "Accounts created",
    referralStat3: "Future credits",
    referralsFootnote: "No automatic discount is applied yet. This is a safe operational MVP placeholder.",
    portalError: "Could not open the subscription portal.",
    deleteError: "Could not delete the account.",
    subscriptionStatuses: subscriptionStatusesEn
  },
  es: {
    pageTitle: "Cuenta",
    tabAccount: "Mi cuenta",
    tabSubscription: "Suscripción",
    tabReferrals: "Referencias",
    userDataTitle: "Datos del usuario",
    emailLabel: "Correo electrónico",
    currentPlanLabel: "Plan actual",
    securityTitle: "Seguridad y preferencias",
    resetPasswordLink: "Cambiar contraseña con enlace seguro por correo",
    settingsPrefsLink: "Preferencias de idioma, país y generación",
    signOut: "Cerrar sesión",
    deleteTitle: "Eliminar cuenta y datos",
    deleteBody:
      "Esta acción es irreversible. Elimina tus documentos, historial, suscripción registrada en la app e intenta cancelar Stripe antes de borrar tu usuario de Auth.",
    deleteFieldLabel: 'Escribe "ELIMINAR MI CUENTA" para confirmar',
    deletePhrase: "ELIMINAR MI CUENTA",
    deleteButton: "Eliminar cuenta",
    deleting: "Eliminando...",
    subscriptionTitle: "Suscripción",
    monthlyLimitLabel: "Límite mensual",
    statusLabel: "Estado",
    nextBillingLabel: "Próximo cobro o fin del período",
    periodUnknown: "Período no informado por Stripe",
    viewPlans: "Ver planes",
    manageSubscription: "Gestionar suscripción",
    opening: "Abriendo...",
    paymentHistoryTitle: "Historial de pagos",
    paymentHistoryBody: "Gestiona tu suscripción, método de pago y recibos de forma segura en el portal de pagos.",
    referralsTitle: "Referencias",
    referralsBody:
      "Comparte GlobalHire AI con profesionales que aplican a roles internacionales. Esta zona está lista para un futuro programa de referidos.",
    copyLink: "Copiar enlace",
    copied: "Copiado",
    loadingLink: "Cargando enlace...",
    referralStat1: "Invitaciones enviadas",
    referralStat2: "Cuentas creadas",
    referralStat3: "Créditos futuros",
    referralsFootnote: "Aún no se aplica descuento automático. Es un marcador de posición operativo seguro para el MVP.",
    portalError: "No se pudo abrir el portal de suscripción.",
    deleteError: "No se pudo eliminar la cuenta.",
    subscriptionStatuses: subscriptionStatusesEs
  },
  fr: {
    pageTitle: "Compte",
    tabAccount: "Mon compte",
    tabSubscription: "Abonnement",
    tabReferrals: "Parrainage",
    userDataTitle: "Données utilisateur",
    emailLabel: "E-mail",
    currentPlanLabel: "Offre actuelle",
    securityTitle: "Sécurité et préférences",
    resetPasswordLink: "Changer le mot de passe via un lien sécurisé par e-mail",
    settingsPrefsLink: "Préférences de langue, pays et génération",
    signOut: "Se déconnecter",
    deleteTitle: "Supprimer le compte et les données",
    deleteBody:
      "Action irréversible : suppression des documents, de l’historique, de l’abonnement enregistré dans l’app et tentative d’annulation Stripe avant suppression du compte Auth.",
    deleteFieldLabel: 'Tapez « SUPPRIMER MON COMPTE » pour confirmer',
    deletePhrase: "SUPPRIMER MON COMPTE",
    deleteButton: "Supprimer le compte",
    deleting: "Suppression...",
    subscriptionTitle: "Abonnement",
    monthlyLimitLabel: "Limite mensuelle",
    statusLabel: "Statut",
    nextBillingLabel: "Prochain prélèvement ou fin de période",
    periodUnknown: "Période non communiquée par Stripe",
    viewPlans: "Voir les offres",
    manageSubscription: "Gérer l’abonnement",
    opening: "Ouverture...",
    paymentHistoryTitle: "Historique de paiement",
    paymentHistoryBody: "Gérez l’abonnement, le moyen de paiement et les reçus en toute sécurité dans le portail de paiement.",
    referralsTitle: "Parrainage",
    referralsBody:
      "Partagez GlobalHire AI avec des professionnels qui postulent à l’international. Cette zone est prête pour un futur programme de parrainage.",
    copyLink: "Copier le lien",
    copied: "Copié",
    loadingLink: "Chargement du lien...",
    referralStat1: "Invitations envoyées",
    referralStat2: "Comptes créés",
    referralStat3: "Crédits futurs",
    referralsFootnote: "Aucune remise automatique pour l’instant. Espace réservé opérationnel sûr pour le MVP.",
    portalError: "Impossible d’ouvrir le portail d’abonnement.",
    deleteError: "Impossible de supprimer le compte.",
    subscriptionStatuses: subscriptionStatusesFr
  }
};

export type SubscriptionPageStrings = {
  compareTitle: string;
  compareLead: string;
  unlimited: string;
};

export const subscriptionPageCopy: Record<Locale, SubscriptionPageStrings> = {
  "pt-BR": {
    compareTitle: "Comparar planos",
    compareLead: "Escolha o plano ideal sem perder seu histórico ou configurações.",
    unlimited: "Ilimitado"
  },
  en: {
    compareTitle: "Compare plans",
    compareLead: "Pick the right plan without losing your history or settings.",
    unlimited: "Unlimited"
  },
  es: {
    compareTitle: "Comparar planes",
    compareLead: "Elige el plan adecuado sin perder tu historial ni ajustes.",
    unlimited: "Ilimitado"
  },
  fr: {
    compareTitle: "Comparer les offres",
    compareLead: "Choisissez l’offre adaptée sans perdre votre historique ni vos réglages.",
    unlimited: "Illimité"
  }
};

export type UpgradePlansStrings = {
  atsCardTitle: string;
  atsCardBody: string;
  freePlanRow: string;
  withProRow: string;
  recommended: string;
  currentPlanBadge: string;
  generationsUnlimited: string;
  generationsPerMonth: (n: number) => string;
  subscribe: string;
  checkoutError: string;
  legalLinePrefix: string;
  legalTerms: string;
  legalMid1: string;
  legalPrivacy: string;
  legalMid2: string;
  legalRefund: string;
  legalStripe: string;
};

export const upgradePlansCopy: Record<Locale, UpgradePlansStrings> = {
  "pt-BR": {
    atsCardTitle: "ATS Score estimado",
    atsCardBody:
      "Planos pagos liberam mais gerações, templates sem marca d'água e otimizações por vaga para aumentar o alinhamento com recrutadores e sistemas ATS.",
    freePlanRow: "Plano grátis",
    withProRow: "Com Pro/Elite",
    recommended: "Recomendado",
    currentPlanBadge: "Plano atual",
    generationsUnlimited: "Gerações ilimitadas",
    generationsPerMonth: (n) => `${n} gerações por mês`,
    subscribe: "Assinar",
    checkoutError: "Não foi possível abrir o checkout.",
    legalLinePrefix: "Ao assinar, você concorda com os",
    legalTerms: "Termos de Uso",
    legalMid1: ", a",
    legalPrivacy: "Política de Privacidade",
    legalMid2: " e a",
    legalRefund: "Política de Cancelamento e Reembolso",
    legalStripe: ". Pagamentos são processados pelo Stripe."
  },
  en: {
    atsCardTitle: "Estimated ATS score",
    atsCardBody:
      "Paid plans unlock more generations, watermark-free templates and per-job optimizations to improve alignment with recruiters and ATS systems.",
    freePlanRow: "Free plan",
    withProRow: "With Pro/Elite",
    recommended: "Recommended",
    currentPlanBadge: "Current plan",
    generationsUnlimited: "Unlimited generations",
    generationsPerMonth: (n) => `${n} generations per month`,
    subscribe: "Subscribe",
    checkoutError: "Could not open checkout.",
    legalLinePrefix: "By subscribing you agree to the",
    legalTerms: "Terms of Use",
    legalMid1: ", the",
    legalPrivacy: "Privacy Policy",
    legalMid2: ", and the",
    legalRefund: "Cancellation and Refund Policy",
    legalStripe: ". Payments are processed by Stripe."
  },
  es: {
    atsCardTitle: "ATS Score estimado",
    atsCardBody:
      "Los planes de pago desbloquean más generaciones, plantillas sin marca de agua y optimizaciones por vacante para mejorar el encaje con reclutadores y ATS.",
    freePlanRow: "Plan gratuito",
    withProRow: "Con Pro/Elite",
    recommended: "Recomendado",
    currentPlanBadge: "Plan actual",
    generationsUnlimited: "Generaciones ilimitadas",
    generationsPerMonth: (n) => `${n} generaciones al mes`,
    subscribe: "Suscribirse",
    checkoutError: "No se pudo abrir el checkout.",
    legalLinePrefix: "Al suscribirte aceptas los",
    legalTerms: "Términos de uso",
    legalMid1: ", la",
    legalPrivacy: "Política de privacidad",
    legalMid2: " y la",
    legalRefund: "Política de cancelación y reembolso",
    legalStripe: ". Los pagos los procesa Stripe."
  },
  fr: {
    atsCardTitle: "Score ATS estimé",
    atsCardBody:
      "Les offres payantes débloquent plus de générations, des modèles sans filigrane et des optimisations par offre pour mieux aligner recruteurs et ATS.",
    freePlanRow: "Offre gratuite",
    withProRow: "Avec Pro/Elite",
    recommended: "Recommandé",
    currentPlanBadge: "Offre actuelle",
    generationsUnlimited: "Générations illimitées",
    generationsPerMonth: (n) => `${n} générations par mois`,
    subscribe: "S’abonner",
    checkoutError: "Impossible d’ouvrir le paiement.",
    legalLinePrefix: "En vous abonnant vous acceptez les",
    legalTerms: "Conditions d’utilisation",
    legalMid1: ", la",
    legalPrivacy: "Politique de confidentialité",
    legalMid2: " et la",
    legalRefund: "Politique d’annulation et de remboursement",
    legalStripe: ". Les paiements sont traités par Stripe."
  }
};

export type UpgradeGateChromeStrings = {
  viewPlans: string;
  backDashboard: string;
};

export const upgradeGateChromeCopy: Record<Locale, UpgradeGateChromeStrings> = {
  "pt-BR": { viewPlans: "Ver planos", backDashboard: "Voltar ao dashboard" },
  en: { viewPlans: "View plans", backDashboard: "Back to dashboard" },
  es: { viewPlans: "Ver planes", backDashboard: "Volver al panel" },
  fr: { viewPlans: "Voir les offres", backDashboard: "Retour au tableau de bord" }
};

export type PlanUpgradeCopy = {
  fromPlan: (planName: string) => string;
  toolNotInPlanTitle: (toolTitle: string) => string;
  toolNotInPlanBody: string;
  atsScoreProTitle: string;
  atsScoreProBody: string;
};

export const planUpgradeCopy: Record<Locale, PlanUpgradeCopy> = {
  "pt-BR": {
    fromPlan: (planName) => `Disponível a partir do plano ${planName}`,
    toolNotInPlanTitle: (toolTitle) => `${toolTitle} não está incluído no seu plano atual`,
    toolNotInPlanBody:
      "Seu plano atual continua funcionando para as ferramentas incluídas nele. Para liberar esta ferramenta, escolha um plano compatível.",
    atsScoreProTitle: "ATS Score é uma ferramenta Pro",
    atsScoreProBody:
      "As análises de compatibilidade, palavras-chave e otimização a partir do score fazem parte do plano Pro e Elite."
  },
  en: {
    fromPlan: (planName) => `Available from the ${planName} plan`,
    toolNotInPlanTitle: (toolTitle) => `${toolTitle} is not included in your current plan`,
    toolNotInPlanBody:
      "Your current plan still works for the tools it includes. To unlock this tool, choose a compatible plan.",
    atsScoreProTitle: "ATS Score is a Pro feature",
    atsScoreProBody: "Compatibility analysis, keywords and optimization from the score are included in Pro and Elite."
  },
  es: {
    fromPlan: (planName) => `Disponible desde el plan ${planName}`,
    toolNotInPlanTitle: (toolTitle) => `${toolTitle} no está incluido en tu plan actual`,
    toolNotInPlanBody:
      "Tu plan actual sigue funcionando para las herramientas incluidas. Para desbloquear esta herramienta, elige un plan compatible.",
    atsScoreProTitle: "ATS Score es una función Pro",
    atsScoreProBody: "Los análisis de compatibilidad, palabras clave y optimización a partir del score forman parte de Pro y Elite."
  },
  fr: {
    fromPlan: (planName) => `Disponible à partir de l’offre ${planName}`,
    toolNotInPlanTitle: (toolTitle) => `${toolTitle} n’est pas inclus dans votre offre actuelle`,
    toolNotInPlanBody:
      "Votre offre actuelle fonctionne toujours pour les outils inclus. Pour débloquer cet outil, choisissez une offre compatible.",
    atsScoreProTitle: "L’ATS Score est une fonction Pro",
    atsScoreProBody: "Les analyses de compatibilité, mots-clés et optimisation à partir du score font partie des offres Pro et Elite."
  }
};
