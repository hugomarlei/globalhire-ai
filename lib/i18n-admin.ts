import type { Locale } from "@/lib/i18n";

export type AdminDashboardStrings = {
  title: string;
  lead: string;
  cardUsers: string;
  cardNew7d: string;
  cardActiveSubs: string;
  cardRevenue: string;
  cardAtsTotal: string;
  cardAnalysesToday: string;
  cardErrors: string;
  cardUpgrades: string;
  pending: string;
  posthog: string;
  usersByPlan: string;
  recentUsers: string;
  thName: string;
  thEmail: string;
  thPlan: string;
  thCreated: string;
  thLastAccess: string;
  thAnalyses: string;
  thStatus: string;
  thAction: string;
  statusBlocked: string;
  statusActive: string;
  recentGenerations: string;
  revenuePerMonth: (amount: number) => string;
};

export const adminDashboardCopy: Record<Locale, AdminDashboardStrings> = {
  "pt-BR": {
    title: "Admin",
    lead: "Visão operacional sem exibir currículos, vagas ou dados pessoais completos.",
    cardUsers: "Usuários",
    cardNew7d: "Novos em 7 dias",
    cardActiveSubs: "Assinaturas ativas",
    cardRevenue: "Receita estimada",
    cardAtsTotal: "Total ATS/currículo",
    cardAnalysesToday: "Análises hoje",
    cardErrors: "Erros armazenados",
    cardUpgrades: "Upgrades clicados",
    pending: "Pendente",
    posthog: "PostHog",
    usersByPlan: "Usuários por plano",
    recentUsers: "Usuários recentes",
    thName: "Nome",
    thEmail: "E-mail mascarado",
    thPlan: "Plano",
    thCreated: "Criado em",
    thLastAccess: "Último acesso",
    thAnalyses: "Análises",
    thStatus: "Status",
    thAction: "Ação",
    statusBlocked: "Bloqueado",
    statusActive: "Ativo",
    recentGenerations: "Gerações recentes",
    revenuePerMonth: (amount) => `R$${amount}/mês`
  },
  en: {
    title: "Admin",
    lead: "Operational view without exposing resumes, job posts or full personal data.",
    cardUsers: "Users",
    cardNew7d: "New in 7 days",
    cardActiveSubs: "Active subscriptions",
    cardRevenue: "Estimated revenue",
    cardAtsTotal: "Total ATS/resume",
    cardAnalysesToday: "Analyses today",
    cardErrors: "Stored errors",
    cardUpgrades: "Upgrade clicks",
    pending: "Pending",
    posthog: "PostHog",
    usersByPlan: "Users by plan",
    recentUsers: "Recent users",
    thName: "Name",
    thEmail: "Masked email",
    thPlan: "Plan",
    thCreated: "Created",
    thLastAccess: "Last access",
    thAnalyses: "Analyses",
    thStatus: "Status",
    thAction: "Action",
    statusBlocked: "Blocked",
    statusActive: "Active",
    recentGenerations: "Recent generations",
    revenuePerMonth: (amount) => `BRL ${amount}/mo`
  },
  es: {
    title: "Admin",
    lead: "Vista operativa sin mostrar CV, vacantes ni datos personales completos.",
    cardUsers: "Usuarios",
    cardNew7d: "Nuevos en 7 días",
    cardActiveSubs: "Suscripciones activas",
    cardRevenue: "Ingresos estimados",
    cardAtsTotal: "Total ATS/CV",
    cardAnalysesToday: "Análisis hoy",
    cardErrors: "Errores almacenados",
    cardUpgrades: "Clics en upgrade",
    pending: "Pendiente",
    posthog: "PostHog",
    usersByPlan: "Usuarios por plan",
    recentUsers: "Usuarios recientes",
    thName: "Nombre",
    thEmail: "Correo enmascarado",
    thPlan: "Plan",
    thCreated: "Creado",
    thLastAccess: "Último acceso",
    thAnalyses: "Análisis",
    thStatus: "Estado",
    thAction: "Acción",
    statusBlocked: "Bloqueado",
    statusActive: "Activo",
    recentGenerations: "Generaciones recientes",
    revenuePerMonth: (amount) => `R$${amount}/mes`
  },
  fr: {
    title: "Admin",
    lead: "Vue opérationnelle sans exposer CV, offres ni données personnelles complètes.",
    cardUsers: "Utilisateurs",
    cardNew7d: "Nouveaux sur 7 jours",
    cardActiveSubs: "Abonnements actifs",
    cardRevenue: "Revenu estimé",
    cardAtsTotal: "Total ATS/CV",
    cardAnalysesToday: "Analyses aujourd’hui",
    cardErrors: "Erreurs stockées",
    cardUpgrades: "Clics upgrade",
    pending: "En attente",
    posthog: "PostHog",
    usersByPlan: "Utilisateurs par offre",
    recentUsers: "Utilisateurs récents",
    thName: "Nom",
    thEmail: "E-mail masqué",
    thPlan: "Offre",
    thCreated: "Créé le",
    thLastAccess: "Dernier accès",
    thAnalyses: "Analyses",
    thStatus: "Statut",
    thAction: "Action",
    statusBlocked: "Bloqué",
    statusActive: "Actif",
    recentGenerations: "Générations récentes",
    revenuePerMonth: (amount) => `R$${amount}/mois`
  }
};

export type AdminBlockStrings = {
  block: string;
  unblock: string;
};

export const adminBlockCopy: Record<Locale, AdminBlockStrings> = {
  "pt-BR": { block: "Bloquear", unblock: "Desbloquear" },
  en: { block: "Block", unblock: "Unblock" },
  es: { block: "Bloquear", unblock: "Desbloquear" },
  fr: { block: "Bloquer", unblock: "Débloquer" }
};
