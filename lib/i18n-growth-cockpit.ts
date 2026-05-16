import type { Locale } from "@/lib/i18n";

export type ContentQueueStatus = "draft" | "scheduled" | "published";

export type GrowthWeeklyItem = { title: string; detail: string };
export type GrowthQueueRow = {
  id: string;
  hook: string;
  cta: string;
  platform: string;
  category: string;
  landingPath: string;
  status: ContentQueueStatus;
  utmCampaign: string;
  notes: string;
};
export type GrowthPromptTemplate = { id: string; title: string; body: string };
export type GrowthMetricKey = "views" | "retention" | "saves" | "shares" | "signups" | "uploadsAts";

export type GrowthCockpitSeed = {
  weeklyItems: GrowthWeeklyItem[];
  batchRecordingHint: string;
  queue: GrowthQueueRow[];
  prompts: GrowthPromptTemplate[];
  learningStarters: string[];
};

export type GrowthCockpitStrings = {
  pageTitle: string;
  pageLead: string;
  internalBadge: string;
  weekTitle: string;
  batchHint: string;
  queueTitle: string;
  thHook: string;
  thCta: string;
  thPlatform: string;
  thCategory: string;
  thLanding: string;
  thStatus: string;
  thUtm: string;
  thFinalUrl: string;
  thNotes: string;
  copyUrl: string;
  copied: string;
  statusDraft: string;
  statusScheduled: string;
  statusPublished: string;
  promptsTitle: string;
  copyPrompt: string;
  utmTitle: string;
  utmBasePath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  buildUrl: string;
  metricsTitle: string;
  metricsHint: string;
  metricViews: string;
  metricRetention: string;
  metricSaves: string;
  metricShares: string;
  metricSignups: string;
  metricUploadsAts: string;
  decisionTitle: string;
  decisionHint: string;
  decisionScale: string;
  decisionIterate: string;
  decisionArchive: string;
  decisionKill: string;
  decisionRationale: string;
  learningTitle: string;
  learningPlaceholder: string;
  calendarTitle: string;
  calendarHint: string;
  downloadIcs: string;
  weekNotesLabel: string;
  weekNotesPlaceholder: string;
  saveLocalHint: string;
  rationaleScale: string;
  rationaleIterate: string;
  rationaleArchive: string;
  rationaleKill: string;
  rationaleDefault: string;
};

const copy: Record<Locale, GrowthCockpitStrings> = {
  "pt-BR": {
    pageTitle: "Growth Cockpit",
    pageLead: "Operação semanal de conteúdo, UTMs e aprendizados. Uso interno — não é produto público.",
    internalBadge: "Interno · só admin",
    weekTitle: "Weekly focus",
    batchHint: "Grave 3–5 shorts em bloco; reaproveite hooks nos carrosséis e newsletters.",
    queueTitle: "Content queue",
    thHook: "Hook",
    thCta: "CTA",
    thPlatform: "Plataforma",
    thCategory: "Categoria",
    thLanding: "Landing",
    thStatus: "Status",
    thUtm: "Campanha UTM",
    thFinalUrl: "URL final",
    thNotes: "Notas",
    copyUrl: "Copiar URL",
    copied: "Copiado!",
    statusDraft: "rascunho",
    statusScheduled: "agendado",
    statusPublished: "publicado",
    promptsTitle: "Prompt engine (copiar)",
    copyPrompt: "Copiar prompt",
    utmTitle: "UTM engine",
    utmBasePath: "Caminho base",
    utmSource: "utm_source",
    utmMedium: "utm_medium",
    utmCampaign: "utm_campaign",
    utmContent: "utm_content",
    buildUrl: "Gerar URL",
    metricsTitle: "Métricas & aprendizados",
    metricsHint: "Valores manuais (ex.: export do LinkedIn/GA). Usados só neste browser.",
    metricViews: "Views",
    metricRetention: "Retenção %",
    metricSaves: "Saves",
    metricShares: "Shares",
    metricSignups: "Signups",
    metricUploadsAts: "Uploads ATS",
    decisionTitle: "Decision engine",
    decisionHint: "Heurística simples: ajuste os números e releia a sugestão.",
    decisionScale: "Scale",
    decisionIterate: "Iterate",
    decisionArchive: "Archive",
    decisionKill: "Kill",
    decisionRationale: "Sugestão",
    learningTitle: "Learning log",
    learningPlaceholder: "Hooks vencedores, CTAs, LPs, próximos testes…",
    calendarTitle: "Rotina semanal (ICS)",
    calendarHint: "Blocos curtos seg–sex; importe no Google Calendar ou Apple Calendar.",
    downloadIcs: "Descarregar .ics",
    weekNotesLabel: "Prioridades / batch (notas)",
    weekNotesPlaceholder: "Esta semana: …",
    saveLocalHint: "Notas e métricas guardam-se localmente neste dispositivo.",
    rationaleScale: "Conversões ou uso ATS forte — repetir formato e ampliar distribuição.",
    rationaleIterate: "Ajustar hook, CTA ou primeiros 3s; repetir teste controlado.",
    rationaleArchive: "Interesse limitado — arquivar e documentar aprendizado.",
    rationaleKill: "Tráfego e engagement muito baixos — pausar e testar novo ângulo.",
    rationaleDefault: "Zona intermédia — pequenos testes A/B antes de escalar."
  },
  en: {
    pageTitle: "Growth Cockpit",
    pageLead: "Weekly content ops, UTMs, and learnings. Internal use only — not a public product surface.",
    internalBadge: "Internal · admin only",
    weekTitle: "Weekly focus",
    batchHint: "Batch-record 3–5 shorts; reuse hooks for carousels and newsletters.",
    queueTitle: "Content queue",
    thHook: "Hook",
    thCta: "CTA",
    thPlatform: "Platform",
    thCategory: "Category",
    thLanding: "Landing",
    thStatus: "Status",
    thUtm: "UTM campaign",
    thFinalUrl: "Final URL",
    thNotes: "Notes",
    copyUrl: "Copy URL",
    copied: "Copied!",
    statusDraft: "draft",
    statusScheduled: "scheduled",
    statusPublished: "published",
    promptsTitle: "Prompt engine (copy)",
    copyPrompt: "Copy prompt",
    utmTitle: "UTM engine",
    utmBasePath: "Base path",
    utmSource: "utm_source",
    utmMedium: "utm_medium",
    utmCampaign: "utm_campaign",
    utmContent: "utm_content",
    buildUrl: "Build URL",
    metricsTitle: "Metrics & learning",
    metricsHint: "Manual values (e.g. LinkedIn/GA export). Stored only in this browser.",
    metricViews: "Views",
    metricRetention: "Retention %",
    metricSaves: "Saves",
    metricShares: "Shares",
    metricSignups: "Signups",
    metricUploadsAts: "ATS uploads",
    decisionTitle: "Decision engine",
    decisionHint: "Simple heuristic: tweak numbers and re-read the suggestion.",
    decisionScale: "Scale",
    decisionIterate: "Iterate",
    decisionArchive: "Archive",
    decisionKill: "Kill",
    decisionRationale: "Suggestion",
    learningTitle: "Learning log",
    learningPlaceholder: "Winning hooks, CTAs, LPs, next experiments…",
    calendarTitle: "Weekly routine (ICS)",
    calendarHint: "Short Mon–Fri blocks; import into Google or Apple Calendar.",
    downloadIcs: "Download .ics",
    weekNotesLabel: "Priorities / batch (notes)",
    weekNotesPlaceholder: "This week: …",
    saveLocalHint: "Notes and metrics are stored locally on this device.",
    rationaleScale: "Strong conversions or ATS usage — double down and widen distribution.",
    rationaleIterate: "Tweak hook, CTA, or first 3s; run a controlled repeat test.",
    rationaleArchive: "Limited interest — archive and log the learning.",
    rationaleKill: "Very low traffic and engagement — pause and try a new angle.",
    rationaleDefault: "Middle zone — small A/B tests before scaling."
  },
  es: {
    pageTitle: "Growth Cockpit",
    pageLead: "Operación semanal de contenido, UTMs y aprendizajes. Solo interno — no es producto público.",
    internalBadge: "Interno · solo admin",
    weekTitle: "Weekly focus",
    batchHint: "Graba 3–5 shorts en bloque; reutiliza hooks en carruseles y newsletters.",
    queueTitle: "Cola de contenido",
    thHook: "Hook",
    thCta: "CTA",
    thPlatform: "Plataforma",
    thCategory: "Categoría",
    thLanding: "Landing",
    thStatus: "Estado",
    thUtm: "Campaña UTM",
    thFinalUrl: "URL final",
    thNotes: "Notas",
    copyUrl: "Copiar URL",
    copied: "¡Copiado!",
    statusDraft: "borrador",
    statusScheduled: "programado",
    statusPublished: "publicado",
    promptsTitle: "Motor de prompts (copiar)",
    copyPrompt: "Copiar prompt",
    utmTitle: "Motor UTM",
    utmBasePath: "Ruta base",
    utmSource: "utm_source",
    utmMedium: "utm_medium",
    utmCampaign: "utm_campaign",
    utmContent: "utm_content",
    buildUrl: "Generar URL",
    metricsTitle: "Métricas y aprendizaje",
    metricsHint: "Valores manuales (p. ej. export de LinkedIn/GA). Solo en este navegador.",
    metricViews: "Views",
    metricRetention: "Retención %",
    metricSaves: "Guardados",
    metricShares: "Compartidos",
    metricSignups: "Registros",
    metricUploadsAts: "Subidas ATS",
    decisionTitle: "Motor de decisión",
    decisionHint: "Heurística simple: ajusta números y relee la sugerencia.",
    decisionScale: "Scale",
    decisionIterate: "Iterate",
    decisionArchive: "Archive",
    decisionKill: "Kill",
    decisionRationale: "Sugerencia",
    learningTitle: "Registro de aprendizajes",
    learningPlaceholder: "Hooks ganadores, CTAs, LPs, próximos tests…",
    calendarTitle: "Rutina semanal (ICS)",
    calendarHint: "Bloques cortos lun–vie; importa en Google o Apple Calendar.",
    downloadIcs: "Descargar .ics",
    weekNotesLabel: "Prioridades / batch (notas)",
    weekNotesPlaceholder: "Esta semana: …",
    saveLocalHint: "Notas y métricas se guardan localmente en este dispositivo.",
    rationaleScale: "Conversiones o uso ATS fuerte — repetir y ampliar.",
    rationaleIterate: "Ajustar hook o CTA; test controlado.",
    rationaleArchive: "Interés limitado — archivar y documentar.",
    rationaleKill: "Tráfico y engagement muy bajos — pausar y nuevo ángulo.",
    rationaleDefault: "Zona intermedia — pequeños A/B antes de escalar."
  },
  fr: {
    pageTitle: "Growth Cockpit",
    pageLead: "Opérations hebdo contenu, UTMs et apprentissages. Usage interne uniquement.",
    internalBadge: "Interne · admin seulement",
    weekTitle: "Weekly focus",
    batchHint: "Enregistrer 3–5 courts en série; réutiliser les hooks (carrousels, newsletters).",
    queueTitle: "File de contenus",
    thHook: "Hook",
    thCta: "CTA",
    thPlatform: "Plateforme",
    thCategory: "Catégorie",
    thLanding: "Landing",
    thStatus: "Statut",
    thUtm: "Campagne UTM",
    thFinalUrl: "URL finale",
    thNotes: "Notes",
    copyUrl: "Copier l’URL",
    copied: "Copié !",
    statusDraft: "brouillon",
    statusScheduled: "planifié",
    statusPublished: "publié",
    promptsTitle: "Moteur de prompts (copier)",
    copyPrompt: "Copier le prompt",
    utmTitle: "Moteur UTM",
    utmBasePath: "Chemin de base",
    utmSource: "utm_source",
    utmMedium: "utm_medium",
    utmCampaign: "utm_campaign",
    utmContent: "utm_content",
    buildUrl: "Générer l’URL",
    metricsTitle: "Métriques & apprentissages",
    metricsHint: "Valeurs manuelles (ex. export LinkedIn/GA). Stockées dans ce navigateur.",
    metricViews: "Vues",
    metricRetention: "Rétention %",
    metricSaves: "Saves",
    metricShares: "Partages",
    metricSignups: "Inscriptions",
    metricUploadsAts: "Uploads ATS",
    decisionTitle: "Moteur de décision",
    decisionHint: "Heuristique simple : ajustez les chiffres et relisez la suggestion.",
    decisionScale: "Scale",
    decisionIterate: "Iterate",
    decisionArchive: "Archive",
    decisionKill: "Kill",
    decisionRationale: "Suggestion",
    learningTitle: "Journal d’apprentissage",
    learningPlaceholder: "Hooks gagnants, CTAs, LPs, prochains tests…",
    calendarTitle: "Routine hebdo (ICS)",
    calendarHint: "Blocs courts lun–ven; import Google ou Apple Calendar.",
    downloadIcs: "Télécharger .ics",
    weekNotesLabel: "Priorités / batch (notes)",
    weekNotesPlaceholder: "Cette semaine : …",
    saveLocalHint: "Notes et métriques sont stockées localement sur cet appareil.",
    rationaleScale: "Fortes conversions ou usage ATS — réinvestir et élargir.",
    rationaleIterate: "Ajuster hook ou CTA ; test contrôlé.",
    rationaleArchive: "Intérêt limité — archiver et documenter.",
    rationaleKill: "Trafic et engagement très faibles — pause et nouvel angle.",
    rationaleDefault: "Zone intermédiaire — petits A/B avant scale."
  }
};

function seedPt(): GrowthCockpitSeed {
  return {
    weeklyItems: [
      {
        title: "3 posts LinkedIn (ATS + prova social)",
        detail: "1 carrossel ‘antes/depois ATS’, 1 história de candidatura, 1 dica de keywords."
      },
      {
        title: "1 newsletter / e-mail interno",
        detail: "Reenviar LP currículo rejeitado com UTM `nl-ats`."
      },
      {
        title: "Rever fila de conteúdo",
        detail: "Mover 1 item de draft → scheduled com data."
      }
    ],
    batchRecordingHint:
      "Gravar hooks em lote (15–30s): problema ATS → solução GlobalHire → CTA prova gratuita.",
    queue: [
      {
        id: "1",
        hook: "O ATS leu o teu CV em menos de 10 segundos. E agora?",
        cta: "Testar score gratuito",
        platform: "LinkedIn",
        category: "Educação ATS",
        landingPath: "/lp/curriculo-ats",
        status: "draft",
        utmCampaign: "li-ats-carousel-maio",
        notes: "Testar 2 primeiras linhas alternativas."
      },
      {
        id: "2",
        hook: "Currículo rejeitado antes do recrutador? Não é sempre a tua experiência.",
        cta: "Ver diagnóstico",
        platform: "LinkedIn",
        category: "Dor candidato",
        landingPath: "/lp/curriculo-rejeitado",
        status: "scheduled",
        utmCampaign: "li-rejected-story",
        notes: "Publicar terça 09h BRT."
      },
      {
        id: "3",
        hook: "Mais entrevistas começam com documentos certos.",
        cta: "Começar grátis",
        platform: "WhatsApp status",
        category: "Prova social",
        landingPath: "/lp/conseguir-entrevista",
        status: "published",
        utmCampaign: "wa-interview-lp",
        notes: "Winner semana passada — reaproveitar frame 2."
      }
    ],
    prompts: [
      {
        id: "p1",
        title: "Hook LinkedIn — ATS",
        body: `Escreve 3 hooks (máx. 220 caracteres cada) para profissionais em transição de carreira, focados em:
- filtros ATS que eliminam CV antes do recrutador;
- medo de enviar candidaturas sem resposta;
- CTA suave: testar ATS score na GlobalHire AI.
Tom: direto, confiante, sem jargão vazio. Idioma: português do Brasil.`
      },
      {
        id: "p2",
        title: "Roteiro carrossel (5 slides)",
        body: `Estrutura de carrossel LinkedIn (5 slides) sobre currículo rejeitado por ATS:
1) Problema relatable; 2) O que o ATS mede; 3) Erro comum; 4) Micro-dica prática; 5) CTA para landing /lp/curriculo-rejeitado com UTM.`
      },
      {
        id: "p3",
        title: "Análise de comentários",
        body: `Lista 5 padrões de comentários num post sobre ATS. Para cada um: resposta curta (1–2 frases) que educa sem ser defensiva e pode incluir link discreto para o site.`
      },
      {
        id: "p4",
        title: "CTA newsletter",
        body: `Gera 2 CTAs finais para e-mail sobre otimização de CV para vagas internacionais. Incluir UTM sugerida e benefício claro (1 geração premium grátis).`
      }
    ],
    learningStarters: [
      "Carrossel ‘3 erros ATS’ converteu melhor que post único longo.",
      "CTA ‘Testar score’ > ‘Saiba mais’ no LinkedIn.",
      "LP /lp/curriculo-rejeitado teve melhor retenção scroll em mobile."
    ]
  };
}

function seedEn(): GrowthCockpitSeed {
  return {
    weeklyItems: [
      {
        title: "3 LinkedIn posts (ATS + proof)",
        detail: "Carousel before/after ATS, application story, keywords tip."
      },
      {
        title: "1 newsletter send",
        detail: "Resend rejected-CV LP with UTM `nl-ats`."
      },
      {
        title: "Review content queue",
        detail: "Move one item from draft → scheduled with a date."
      }
    ],
    batchRecordingHint: "Batch hooks (15–30s): ATS pain → GlobalHire fix → free proof CTA.",
    queue: [
      {
        id: "1",
        hook: "Your CV was scanned by ATS in seconds. What happens next?",
        cta: "Run free score",
        platform: "LinkedIn",
        category: "ATS education",
        landingPath: "/lp/curriculo-ats",
        status: "draft",
        utmCampaign: "li-ats-carousel-may",
        notes: "Test two opening lines."
      },
      {
        id: "2",
        hook: "Rejected before a human saw you? It’s not always your experience.",
        cta: "See diagnosis",
        platform: "LinkedIn",
        category: "Candidate pain",
        landingPath: "/lp/curriculo-rejeitado",
        status: "scheduled",
        utmCampaign: "li-rejected-story",
        notes: "Publish Tue 9am."
      },
      {
        id: "3",
        hook: "More replies start with the right documents.",
        cta: "Start free",
        platform: "WhatsApp status",
        category: "Social proof",
        landingPath: "/lp/conseguir-entrevista",
        status: "published",
        utmCampaign: "wa-interview-lp",
        notes: "Last week’s winner — reuse frame 2."
      }
    ],
    prompts: [
      {
        id: "p1",
        title: "LinkedIn hook — ATS",
        body: `Write 3 hooks (max 220 chars) for job seekers about:
- ATS filters dropping CVs before recruiters;
- fear of ghosting applications;
- soft CTA: try GlobalHire AI ATS score free.
Tone: direct, confident, no buzzword soup. English.`
      },
      {
        id: "p2",
        title: "5-slide carousel outline",
        body: `LinkedIn carousel on ATS rejection:
1) Relatable pain; 2) What ATS measures; 3) Common mistake; 4) Micro-tip; 5) CTA to /lp/curriculo-rejeitado with UTM.`
      },
      {
        id: "p3",
        title: "Comment thread analysis",
        body: `List 5 comment patterns on an ATS post. For each: 1–2 sentence reply that educates, not defensive, optional subtle site link.`
      },
      {
        id: "p4",
        title: "Newsletter CTAs",
        body: `Two closing CTAs for email about international CV optimization. Include suggested UTM + clear benefit (1 free premium generation).`
      }
    ],
    learningStarters: [
      "‘3 ATS mistakes’ carousel beat single long post.",
      "CTA ‘Run score’ > ‘Learn more’ on LinkedIn.",
      "LP /lp/curriculo-rejeitado had better mobile scroll depth."
    ]
  };
}

function seedEs(): GrowthCockpitSeed {
  return {
    weeklyItems: [
      { title: "3 posts LinkedIn (ATS)", detail: "Carrusel, historia, keywords." },
      { title: "1 newsletter", detail: "LP rejeitado con UTM `nl-ats`." },
      { title: "Revisar cola", detail: "Draft → scheduled con fecha." }
    ],
    batchRecordingHint: "Graba hooks en bloque: dolor ATS → solución → CTA prueba gratis.",
    queue: [
      {
        id: "1",
        hook: "¿El ATS leyó tu CV en segundos?",
        cta: "Probar score gratis",
        platform: "LinkedIn",
        category: "ATS",
        landingPath: "/lp/curriculo-ats",
        status: "draft",
        utmCampaign: "li-ats-mayo",
        notes: "Probar 2 ganchos."
      },
      {
        id: "2",
        hook: "Rechazado antes del reclutador…",
        cta: "Ver diagnóstico",
        platform: "LinkedIn",
        category: "Dolor",
        landingPath: "/lp/curriculo-rejeitado",
        status: "scheduled",
        utmCampaign: "li-rechazo",
        notes: "Martes 9h."
      },
      {
        id: "3",
        hook: "Más respuestas con documentos correctos.",
        cta: "Empezar gratis",
        platform: "WhatsApp",
        category: "Prueba social",
        landingPath: "/lp/conseguir-entrevista",
        status: "published",
        utmCampaign: "wa-entrevista",
        notes: "Ganador semana pasada."
      }
    ],
    prompts: [
      {
        id: "p1",
        title: "Hook LinkedIn ATS",
        body: "3 hooks (máx. 220 caracteres) para candidatos: miedo ATS, CTA probar score GlobalHire. Español."
      },
      {
        id: "p2",
        title: "Carrusel 5 diapositivas",
        body: "Estructura ATS: problema, qué mide, error, tip, CTA a LP con UTM."
      },
      {
        id: "p3",
        title: "Respuestas a comentarios",
        body: "5 patrones de comentarios y respuesta corta educativa."
      },
      {
        id: "p4",
        title: "CTA newsletter",
        body: "2 CTAs finales con UTM sugerida y beneficio (1 generación premium gratis)."
      }
    ],
    learningStarters: [
      "Carrusel ‘3 errores ATS’ superó post largo.",
      "CTA ‘Probar score’ > ‘Saber más’.",
      "LP rejeitado mejor en móvil."
    ]
  };
}

function seedFr(): GrowthCockpitSeed {
  return {
    weeklyItems: [
      { title: "3 posts LinkedIn (ATS)", detail: "Carrousel, histoire, mots-clés." },
      { title: "1 newsletter", detail: "LP ‘rejeté’ avec UTM." },
      { title: "File contenus", detail: "Brouillon → planifié." }
    ],
    batchRecordingHint: "Hooks en série : douleur ATS → solution → CTA preuve gratuite.",
    queue: [
      {
        id: "1",
        hook: "L’ATS a scanné ton CV en quelques secondes.",
        cta: "Tester le score gratuit",
        platform: "LinkedIn",
        category: "ATS",
        landingPath: "/lp/curriculo-ats",
        status: "draft",
        utmCampaign: "li-ats-mai",
        notes: "Tester 2 accroches."
      },
      {
        id: "2",
        hook: "Rejeté avant le recruteur ?",
        cta: "Voir le diagnostic",
        platform: "LinkedIn",
        category: "Pain",
        landingPath: "/lp/curriculo-rejeitado",
        status: "scheduled",
        utmCampaign: "li-rejet",
        notes: "Mardi 9h."
      },
      {
        id: "3",
        hook: "Plus de réponses avec les bons documents.",
        cta: "Commencer gratuitement",
        platform: "WhatsApp",
        category: "Preuve",
        landingPath: "/lp/conseguir-entrevista",
        status: "published",
        utmCampaign: "wa-entretien",
        notes: "Gagnant semaine dernière."
      }
    ],
    prompts: [
      {
        id: "p1",
        title: "Hook LinkedIn ATS",
        body: "3 accroches (max 220 car.) candidats en transition, peur ATS, CTA score gratuit GlobalHire. Français."
      },
      {
        id: "p2",
        title: "Carrousel 5 slides",
        body: "Structure : problème, mesure ATS, erreur, micro-conseil, CTA LP + UTM."
      },
      {
        id: "p3",
        title: "Réponses commentaires",
        body: "5 patterns et réponses courtes pédagogiques."
      },
      {
        id: "p4",
        title: "CTA newsletter",
        body: "2 CTA avec UTM et bénéfice (1 génération premium gratuite)."
      }
    ],
    learningStarters: [
      "Carrousel ‘3 erreurs ATS’ > post long.",
      "CTA ‘Tester le score’ > ‘En savoir plus’.",
      "LP rejeté meilleur scroll mobile."
    ]
  };
}

export function getGrowthCockpitStrings(locale: Locale): GrowthCockpitStrings {
  return copy[locale] || copy["pt-BR"];
}

export function getGrowthCockpitSeed(locale: Locale): GrowthCockpitSeed {
  switch (locale) {
    case "en":
      return seedEn();
    case "es":
      return seedEs();
    case "fr":
      return seedFr();
    default:
      return seedPt();
  }
}

export function statusLabel(locale: Locale, status: ContentQueueStatus): string {
  const s = getGrowthCockpitStrings(locale);
  if (status === "draft") return s.statusDraft;
  if (status === "scheduled") return s.statusScheduled;
  return s.statusPublished;
}

export function suggestGrowthDecision(
  metrics: Record<GrowthMetricKey, number>,
  t: GrowthCockpitStrings
): { key: "scale" | "iterate" | "archive" | "kill"; rationale: string } {
  const { views, signups, uploadsAts, retention, saves, shares } = metrics;
  if (views < 15 && signups === 0 && saves === 0) {
    return { key: "kill", rationale: t.rationaleKill };
  }
  if (signups >= 3 || uploadsAts >= 5) {
    return { key: "scale", rationale: t.rationaleScale };
  }
  if (views >= 80 && signups === 0 && retention < 20) {
    return { key: "iterate", rationale: t.rationaleIterate };
  }
  if (shares >= 3 || saves >= 8) {
    return { key: "iterate", rationale: t.rationaleIterate };
  }
  if (views > 0 && views < 50) {
    return { key: "archive", rationale: t.rationaleArchive };
  }
  return { key: "iterate", rationale: t.rationaleDefault };
}
