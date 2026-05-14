import type { Locale } from "@/lib/i18n";
import { privacyIntro as privacyIntroPt, termsIntro as termsIntroPt } from "@/lib/legal-content";

export type LegalIntros = {
  privacy: string[];
  terms: string[];
  cookies: string[];
  support: string[];
  refund: string[];
  dataProcessing: string[];
};

export const legalIntrosByLocale: Record<Locale, LegalIntros> = {
  "pt-BR": {
    privacy: [...privacyIntroPt],
    terms: [...termsIntroPt],
    cookies: [
      "Esta Política de Cookies explica como a GlobalHire AI utiliza cookies e tecnologias similares para segurança, autenticação, funcionamento da conta, analytics e melhoria de produto.",
      "Cookies essenciais não dependem de consentimento para funcionamento do serviço. Cookies analíticos devem respeitar as escolhas do usuário e a configuração do banner de privacidade."
    ],
    support: [
      "Esta página reúne os canais oficiais para suporte, cobrança, privacidade e dúvidas operacionais sobre a GlobalHire AI.",
      "Para agilizar atendimento, envie o e-mail da conta, o plano contratado quando aplicável e uma descrição objetiva do problema. Não envie dados sensíveis desnecessários."
    ],
    refund: [
      "Esta política complementa os Termos de Uso e descreve como funcionam cancelamentos, renovações, pedidos de reembolso e suporte de cobrança na GlobalHire AI.",
      "Pagamentos e gestão de assinatura são processados pelo Stripe, com retorno ao painel da GlobalHire AI quando a operação é concluída."
    ],
    dataProcessing: [
      "Este documento resume a arquitetura operacional de tratamento de dados da GlobalHire AI e deve ser lido em conjunto com a Política de Privacidade, Termos de Uso e Política de Cookies.",
      "Ele explica, em linguagem objetiva, como a plataforma trata dados profissionais e dados técnicos para entregar funcionalidades SaaS com IA generativa."
    ]
  },
  en: {
    privacy: [
      "This Privacy Policy describes how GlobalHire AI processes personal data for the SaaS platform at https://www.globalhireai.com.br, focused on creating, analysing and optimising professional materials with AI.",
      "GlobalHire AI generally acts as controller for data used for sign-up, authentication, billing, support, security, analytics and product delivery. Technical providers such as Supabase, Stripe, Cloudflare, Groq, PostHog and Microsoft Clarity may act as processors or independent controllers depending on the service."
    ],
    terms: [
      "These Terms govern access to and use of GlobalHire AI, a SaaS platform that supports professional documents with AI, including ATS resume optimisation, interview prep, translation and application materials.",
      "By creating an account, accessing the platform, subscribing or using any feature, you confirm that you have read and agree to these Terms, the Privacy Policy and other applicable policies."
    ],
    cookies: [
      "This Cookie Policy explains how GlobalHire AI uses cookies and similar technologies for security, authentication, account operation, analytics and product improvement.",
      "Essential cookies do not require consent for core service operation. Analytics cookies must respect user choices and the privacy banner configuration."
    ],
    support: [
      "This page lists official channels for support, billing, privacy and operational questions about GlobalHire AI.",
      "To speed up help, include your account email, your plan when relevant, and a concise description of the issue. Do not send unnecessary sensitive data."
    ],
    refund: [
      "This policy supplements the Terms of Use and describes how cancellations, renewals, refund requests and billing support work on GlobalHire AI.",
      "Payments and subscription management are processed by Stripe, with status reflected in the GlobalHire AI app when the operation completes."
    ],
    dataProcessing: [
      "This document summarises the operational data-processing architecture of GlobalHire AI and should be read together with the Privacy Policy, Terms of Use and Cookie Policy.",
      "It explains in plain language how the platform treats professional data and technical data to deliver SaaS features with generative AI."
    ]
  },
  es: {
    privacy: [
      "Esta Política de Privacidad describe cómo GlobalHire AI trata datos personales en la plataforma SaaS en https://www.globalhireai.com.br, orientada a crear, analizar y optimizar materiales profesionales con IA.",
      "GlobalHire AI actúa, en regla general, como responsable del tratamiento; proveedores como Supabase, Stripe, Cloudflare, Groq, PostHog y Microsoft Clarity pueden actuar como encargados o responsables independientes según el servicio."
    ],
    terms: [
      "Estos Términos regulan el acceso y uso de GlobalHire AI, plataforma SaaS de apoyo profesional con IA para optimización de CV ATS, preparación de entrevistas, traducción y documentos de candidatura.",
      "Al crear cuenta, acceder, contratar o usar cualquier función, declaras haber leído y aceptar estos Términos, la Política de Privacidad y demás políticas aplicables."
    ],
    cookies: [
      "Esta Política de Cookies explica cómo GlobalHire AI usa cookies y tecnologías similares para seguridad, autenticación, funcionamiento de la cuenta, analytics y mejora del producto.",
      "Las cookies esenciales no requieren consentimiento para el núcleo del servicio. Las cookies analíticas deben respetar las elecciones del usuario y el banner de privacidad."
    ],
    support: [
      "Esta página reúne los canales oficiales de soporte, cobro, privacidad y dudas operativas sobre GlobalHire AI.",
      "Para agilizar, envía el correo de la cuenta, el plan si aplica y una descripción objetiva del problema. No envíes datos sensibles innecesarios."
    ],
    refund: [
      "Esta política complementa los Términos de Uso y describe cancelaciones, renovaciones, solicitudes de reembolso y soporte de cobro en GlobalHire AI.",
      "Los pagos y la gestión de suscripción los procesa Stripe, con reflejo en la app GlobalHire AI al completarse la operación."
    ],
    dataProcessing: [
      "Este documento resume la arquitectura operativa de tratamiento de datos de GlobalHire AI y debe leerse junto con la Política de Privacidad, Términos de Uso y Política de Cookies.",
      "Explica de forma objetiva cómo la plataforma trata datos profesionales y técnicos para entregar SaaS con IA generativa."
    ]
  },
  fr: {
    privacy: [
      "Cette Politique de confidentialité décrit comment GlobalHire AI traite les données personnelles dans le cadre de la plateforme SaaS disponible sur https://www.globalhireai.com.br, dédiée à la création, l’analyse et l’optimisation de supports professionnels avec l’IA.",
      "GlobalHire AI agit en principe comme responsable du traitement ; des prestataires tels que Supabase, Stripe, Cloudflare, Groq, PostHog et Microsoft Clarity peuvent agir en tant que sous-traitants ou responsables indépendants selon le service."
    ],
    terms: [
      "Les présentes Conditions régissent l’accès et l’utilisation de GlobalHire AI, plateforme SaaS d’aide à la carrière avec IA (CV ATS, entretien, traduction, documents de candidature).",
      "En créant un compte, en accédant à la plateforme, en souscrivant une offre ou en utilisant une fonctionnalité, vous déclarez avoir lu et accepté ces Conditions, la Politique de confidentialité et les autres politiques applicables."
    ],
    cookies: [
      "Cette Politique relative aux cookies explique comment GlobalHire AI utilise les cookies et technologies similaires pour la sécurité, l’authentification, le fonctionnement du compte, l’analytics et l’amélioration du produit.",
      "Les cookies essentiels ne requièrent pas de consentement pour le cœur du service. Les cookies analytiques doivent respecter les choix de l’utilisateur et la bannière de confidentialité."
    ],
    support: [
      "Cette page regroupe les canaux officiels d’assistance, de facturation, de confidentialité et les questions opérationnelles sur GlobalHire AI.",
      "Pour accélérer le traitement, indiquez l’e-mail du compte, l’offre souscrite le cas échéant et une description concise du problème. N’envoyez pas de données sensibles inutiles."
    ],
    refund: [
      "Cette politique complète les Conditions d’utilisation et décrit les annulations, renouvellements, demandes de remboursement et le support de facturation sur GlobalHire AI.",
      "Les paiements et la gestion d’abonnement sont traités par Stripe, avec mise à jour dans l’application GlobalHire AI une fois l’opération terminée."
    ],
    dataProcessing: [
      "Ce document résume l’architecture opérationnelle du traitement des données par GlobalHire AI et doit être lu avec la Politique de confidentialité, les Conditions d’utilisation et la Politique cookies.",
      "Il explique en langage simple comment la plateforme traite les données professionnelles et techniques pour fournir le SaaS avec IA générative."
    ]
  }
};
