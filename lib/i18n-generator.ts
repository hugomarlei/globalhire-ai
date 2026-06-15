import type { Locale } from "@/lib/i18n";
import type { GenerationType } from "@/lib/types";

export type PdfTemplateKey = "executive" | "modern" | "compact";

type GenBlock = {
  title: string;
  subtitle: string;
  resumeLabel: string;
  resumePlaceholder: string;
  jobPlaceholder: string;
  cta: string;
  empty: string;
};

export type GeneratorUiStrings = {
  steps: string[];
  uploadPdfDocx: string;
  importResume: string;
  readingFile: string;
  uploadHelp: string;
  uploadErrorGeneric: string;
  uploadErrorNetwork: string;
  uploadSuccessIntro: string;
  copyDone: string;
  copyLabel: string;
  regenerate: string;
  preparingOutput: string;
  limitRenewNotice: string;
  upgradeCta: string;
  pdfFreeWatermark: string;
  formColumnTitle: string;
  previewColumnTitle: string;
  outputLengthLabel: string;
  toneLabel: string;
  lengthShort: string;
  lengthMedium: string;
  lengthDetailed: string;
  toneNatural: string;
  toneProfessional: string;
  toneConfident: string;
  toneDirect: string;
  voiceControlsHint: string;
  pdfTemplates: Record<PdfTemplateKey, string>;
  byType: Record<GenerationType, GenBlock>;
};

const ptByType: Record<GenerationType, GenBlock> = {
  ats_resume: {
    title: "Central de candidatura",
    subtitle: "Escolha o material que você quer criar e adapte a entrega ao contexto da vaga.",
    resumeLabel: "Currículo atual",
    resumePlaceholder:
      "Cole aqui seu currículo completo. Inclua experiências, formação, ferramentas, idiomas e certificações.",
    jobPlaceholder: "Cole a descrição da vaga para a IA adaptar o currículo ao cargo, país e palavras-chave.",
    cta: "Gerar currículo ATS",
    empty: "Seu currículo otimizado aparecerá aqui, limpo e pronto para exportar."
  },
  cover_letter: {
    title: "Gerador de Carta de Apresentação",
    subtitle: "Crie uma carta objetiva, persuasiva e conectada à vaga escolhida.",
    resumeLabel: "Currículo ou base profissional",
    resumePlaceholder: "Cole seu currículo ou um resumo da sua experiência para sustentar a carta.",
    jobPlaceholder: "Cole a vaga ou contexto da empresa para personalizar a carta.",
    cta: "Gerar carta de apresentação",
    empty: "Sua carta de apresentação aparecerá aqui com tom profissional e pronta para envio."
  },
  linkedin_summary: {
    title: "Gerador de Resumo LinkedIn",
    subtitle: "Posicione seu perfil para recrutadores internacionais com um resumo forte e humano.",
    resumeLabel: "Base profissional",
    resumePlaceholder:
      "Cole seu currículo ou descreva sua trajetória, especialidade, ferramentas e objetivo profissional.",
    jobPlaceholder: "Opcional: cole uma vaga ou área-alvo para direcionar o posicionamento do LinkedIn.",
    cta: "Gerar resumo LinkedIn",
    empty: "Seu resumo de LinkedIn aparecerá aqui, pronto para colar no perfil."
  },
  recruiter_message: {
    title: "Mensagem para Recrutador",
    subtitle: "Escreva uma abordagem curta, natural e relevante para iniciar conversa.",
    resumeLabel: "Base profissional",
    resumePlaceholder: "Cole seu currículo ou pontos principais da sua experiência.",
    jobPlaceholder: "Cole a vaga, nome do cargo ou contexto do recrutador.",
    cta: "Gerar mensagem",
    empty: "Sua mensagem para recrutador aparecerá aqui."
  },
  interview_prep: {
    title: "Guia para entrevista",
    subtitle:
      "Organize perguntas prováveis, respostas em STAR, pontos fortes, riscos e o que perguntar ao recrutador — tudo escaneável.",
    resumeLabel: "Currículo ou experiência",
    resumePlaceholder: "Cole seu currículo ou descreva sua experiência principal.",
    jobPlaceholder: "Cole a descrição da vaga para gerar um guia alinhado ao cargo.",
    cta: "Gerar guia",
    empty: "Seu guia aparecerá aqui em cartões, pronto para revisar antes da conversa."
  },
  translate_resume: {
    title: "Tradução de currículo",
    subtitle: "Traduza o currículo completo para o idioma e convenções do mercado-alvo.",
    resumeLabel: "Currículo original",
    resumePlaceholder: "Cole o currículo que deseja traduzir e adaptar.",
    jobPlaceholder: "",
    cta: "Traduzir currículo",
    empty: "Seu currículo traduzido aparecerá aqui."
  }
};

const enByType: Record<GenerationType, GenBlock> = {
  ats_resume: {
    title: "ATS resume generator",
    subtitle: "Turn your resume into an international, clear version aligned with the job description.",
    resumeLabel: "Current resume",
    resumePlaceholder: "Paste your full resume: experience, education, tools, languages and certifications.",
    jobPlaceholder: "Paste the job description so the AI can align role, country and keywords.",
    cta: "Generate ATS resume",
    empty: "Your optimized resume will appear here, clean and ready to export."
  },
  cover_letter: {
    title: "Cover letter generator",
    subtitle: "Create a concise, persuasive letter tied to the role you want.",
    resumeLabel: "Resume or professional base",
    resumePlaceholder: "Paste your resume or a short summary of your experience to support the letter.",
    jobPlaceholder: "Paste the job posting or company context to personalize the letter.",
    cta: "Generate cover letter",
    empty: "Your cover letter will appear here with a professional tone, ready to send."
  },
  linkedin_summary: {
    title: "LinkedIn summary generator",
    subtitle: "Position your profile for international recruiters with a strong, human summary.",
    resumeLabel: "Professional base",
    resumePlaceholder: "Paste your resume or describe your path, specialty, tools and career goal.",
    jobPlaceholder: "Optional: paste a job or target area to steer the LinkedIn positioning.",
    cta: "Generate LinkedIn summary",
    empty: "Your LinkedIn summary will appear here, ready to paste on your profile."
  },
  recruiter_message: {
    title: "Recruiter outreach message",
    subtitle: "Draft a short, natural message to start a relevant conversation.",
    resumeLabel: "Professional base",
    resumePlaceholder: "Paste your resume or key highlights from your experience.",
    jobPlaceholder: "Paste the job, title or recruiter context.",
    cta: "Generate message",
    empty: "Your recruiter message will appear here."
  },
  interview_prep: {
    title: "Interview guide",
    subtitle: "Structure likely questions, STAR answers, strengths, gaps, and what to ask — easy to scan.",
    resumeLabel: "Resume or experience",
    resumePlaceholder: "Paste your resume or describe your core experience.",
    jobPlaceholder: "Paste the job description to tailor the guide to the role.",
    cta: "Build interview guide",
    empty: "Your guide will appear here in cards, ready to review before the interview."
  },
  translate_resume: {
    title: "Resume translation",
    subtitle: "Translate the full resume to the target language and market conventions.",
    resumeLabel: "Original resume",
    resumePlaceholder: "Paste the resume you want to translate and adapt.",
    jobPlaceholder: "",
    cta: "Translate resume",
    empty: "Your translated resume will appear here."
  }
};

const esByType: Record<GenerationType, GenBlock> = {
  ats_resume: {
    title: "Generador de CV ATS",
    subtitle: "Convierte tu CV en una versión internacional, clara y alineada a la descripción de la vacante.",
    resumeLabel: "CV actual",
    resumePlaceholder: "Pega aquí tu CV completo: experiencia, formación, herramientas, idiomas y certificaciones.",
    jobPlaceholder: "Pega la descripción de la vacante para adaptar cargo, país y palabras clave.",
    cta: "Generar CV ATS",
    empty: "Tu CV optimizado aparecerá aquí, limpio y listo para exportar."
  },
  cover_letter: {
    title: "Generador de carta de presentación",
    subtitle: "Crea una carta breve, persuasiva y conectada a la vacante.",
    resumeLabel: "CV o base profesional",
    resumePlaceholder: "Pega tu CV o un resumen de tu experiencia para sustentar la carta.",
    jobPlaceholder: "Pega la vacante o el contexto de la empresa para personalizar la carta.",
    cta: "Generar carta de presentación",
    empty: "Tu carta aparecerá aquí con tono profesional y lista para enviar."
  },
  linkedin_summary: {
    title: "Generador de resumen de LinkedIn",
    subtitle: "Posiciona tu perfil para reclutadores internacionales con un resumen sólido y humano.",
    resumeLabel: "Base profesional",
    resumePlaceholder: "Pega tu CV o describe tu trayectoria, especialidad, herramientas y objetivo.",
    jobPlaceholder: "Opcional: pega una vacante o área objetivo para orientar el posicionamiento.",
    cta: "Generar resumen de LinkedIn",
    empty: "Tu resumen de LinkedIn aparecerá aquí, listo para pegar en el perfil."
  },
  recruiter_message: {
    title: "Mensaje para reclutador",
    subtitle: "Redacta un mensaje breve y natural para iniciar conversación.",
    resumeLabel: "Base profesional",
    resumePlaceholder: "Pega tu CV o los puntos fuertes de tu experiencia.",
    jobPlaceholder: "Pega la vacante, el cargo o el contexto del reclutador.",
    cta: "Generar mensaje",
    empty: "Tu mensaje para reclutador aparecerá aquí."
  },
  interview_prep: {
    title: "Guía para entrevista",
    subtitle: "Organiza preguntas probables, respuestas STAR, fortalezas, riesgos y qué preguntar — fácil de escanear.",
    resumeLabel: "CV o experiencia",
    resumePlaceholder: "Pega tu CV o describe tu experiencia principal.",
    jobPlaceholder: "Pega la descripción de la vacante para alinear el guía al puesto.",
    cta: "Generar guía",
    empty: "Tu guía aparecerá aquí en tarjetas, lista para repasar antes de la entrevista."
  },
  translate_resume: {
    title: "Traducción de CV",
    subtitle: "Traduce el CV completo al idioma y convenciones del mercado objetivo.",
    resumeLabel: "CV original",
    resumePlaceholder: "Pega el CV que deseas traducir y adaptar.",
    jobPlaceholder: "",
    cta: "Traducir CV",
    empty: "Tu CV traducido aparecerá aquí."
  }
};

const frByType: Record<GenerationType, GenBlock> = {
  ats_resume: {
    title: "Générateur de CV ATS",
    subtitle: "Transformez votre CV en une version internationale, claire et alignée sur l'offre.",
    resumeLabel: "CV actuel",
    resumePlaceholder:
      "Collez votre CV complet : expériences, formation, outils, langues et certifications.",
    jobPlaceholder: "Collez la description du poste pour adapter le rôle, le pays et les mots-clés.",
    cta: "Générer un CV ATS",
    empty: "Votre CV optimisé apparaîtra ici, propre et prêt à exporter."
  },
  cover_letter: {
    title: "Générateur de lettre de motivation",
    subtitle: "Créez une lettre concise, persuasive et liée au poste visé.",
    resumeLabel: "CV ou base professionnelle",
    resumePlaceholder: "Collez votre CV ou un résumé d'expérience pour soutenir la lettre.",
    jobPlaceholder: "Collez l'offre ou le contexte entreprise pour personnaliser la lettre.",
    cta: "Générer la lettre",
    empty: "Votre lettre apparaîtra ici, prête à envoyer."
  },
  linkedin_summary: {
    title: "Générateur de résumé LinkedIn",
    subtitle: "Positionnez votre profil pour les recruteurs internationaux avec un résumé fort et humain.",
    resumeLabel: "Base professionnelle",
    resumePlaceholder: "Collez votre CV ou décrivez votre parcours, spécialité, outils et objectif.",
    jobPlaceholder: "Optionnel : collez une offre ou une cible pour orienter le positionnement.",
    cta: "Générer le résumé LinkedIn",
    empty: "Votre résumé LinkedIn apparaîtra ici, prêt à coller sur le profil."
  },
  recruiter_message: {
    title: "Message recruteur",
    subtitle: "Rédigez un message court et naturel pour entamer la conversation.",
    resumeLabel: "Base professionnelle",
    resumePlaceholder: "Collez votre CV ou les points clés de votre expérience.",
    jobPlaceholder: "Collez l'offre, l'intitulé ou le contexte recruteur.",
    cta: "Générer le message",
    empty: "Votre message apparaîtra ici."
  },
  interview_prep: {
    title: "Guide d’entretien",
    subtitle: "Structurez questions probables, réponses STAR, forces, risques et vos questions — lecture rapide.",
    resumeLabel: "CV ou expérience",
    resumePlaceholder: "Collez votre CV ou décrivez votre expérience clé.",
    jobPlaceholder: "Collez l’offre pour aligner le guide sur le poste.",
    cta: "Générer le guide",
    empty: "Votre guide apparaîtra ici en cartes, prêt à relire avant l’entretien."
  },
  translate_resume: {
    title: "Traduction de CV",
    subtitle: "Traduisez le CV complet vers la langue et les conventions du marché cible.",
    resumeLabel: "CV d'origine",
    resumePlaceholder: "Collez le CV à traduire et adapter.",
    jobPlaceholder: "",
    cta: "Traduire le CV",
    empty: "Votre CV traduit apparaîtra ici."
  }
};

const pdfPt: Record<PdfTemplateKey, string> = {
  executive: "ATS — clássico executivo",
  modern: "Moderno — acento lateral",
  compact: "Compacto — leitura densa"
};
const pdfEn: Record<PdfTemplateKey, string> = {
  executive: "ATS — classic executive",
  modern: "Modern — accent rail",
  compact: "Compact — dense read"
};
const pdfEs: Record<PdfTemplateKey, string> = {
  executive: "ATS — ejecutivo clásico",
  modern: "Moderno — acento lateral",
  compact: "Compacto — lectura densa"
};
const pdfFr: Record<PdfTemplateKey, string> = {
  executive: "ATS — exécutif classique",
  modern: "Moderne — bandeau d’accent",
  compact: "Compact — lecture dense"
};

function pack(
  byType: Record<GenerationType, GenBlock>,
  pdf: Record<PdfTemplateKey, string>,
  steps: string[],
  rest: Omit<GeneratorUiStrings, "byType" | "pdfTemplates" | "steps">
): GeneratorUiStrings {
  return { ...rest, steps, pdfTemplates: pdf, byType };
}

export const generatorUiCopy: Record<Locale, GeneratorUiStrings> = {
  "pt-BR": pack(
    ptByType,
    pdfPt,
    [
      "Analisando currículo",
      "Lendo descrição da vaga",
      "Comparando ATS",
      "Gerando documento",
      "Finalizando resultado"
    ],
    {
      uploadPdfDocx: "Upload PDF/DOCX",
      importResume: "Importar currículo",
      readingFile: "Lendo arquivo...",
      uploadHelp:
        "Aceitamos PDF e DOCX com texto real, até 5 MB. PDFs escaneados ou em imagem podem falhar; prefira exportar o currículo com texto selecionável.",
      uploadErrorGeneric:
        "Não consegui extrair o texto deste arquivo. Use PDF ou DOCX com texto selecionável.",
      uploadErrorNetwork: "Não consegui concluir o upload. Tente novamente com um PDF ou DOCX selecionável.",
      uploadSuccessIntro: "Currículo importado com sucesso:",
      copyDone: "Copiado",
      copyLabel: "Copiar",
      regenerate: "Gerar novamente",
      preparingOutput: "Preparando resultado premium...",
      limitRenewNotice: "Seu limite mensal renova no início do próximo mês. Para continuar hoje, faça upgrade.",
      upgradeCta: "Fazer upgrade para continuar",
      pdfFreeWatermark: "Criado com GlobalHire AI - plano grátis",
      formColumnTitle: "Entradas",
      previewColumnTitle: "Pré-visualização",
      outputLengthLabel: "Tamanho do texto",
      toneLabel: "Tom",
      lengthShort: "Curto",
      lengthMedium: "Médio",
      lengthDetailed: "Detalhado",
      toneNatural: "Natural",
      toneProfessional: "Profissional",
      toneConfident: "Confiante",
      toneDirect: "Direto",
      voiceControlsHint: "Aplica-se a mensagem ao recrutador, carta e resumo LinkedIn."
    }
  ),
  en: pack(
    enByType,
    pdfEn,
    ["Analyzing resume", "Reading job description", "Comparing ATS fit", "Generating document", "Finalizing output"],
    {
      uploadPdfDocx: "Upload PDF/DOCX",
      importResume: "Import resume",
      readingFile: "Reading file...",
      uploadHelp:
        "We accept PDF and DOCX with real selectable text, up to 5 MB. Scanned PDFs or image-based files may fail.",
      uploadErrorGeneric:
        "We could not extract text from this file. Use a PDF or DOCX with selectable text.",
      uploadErrorNetwork: "Upload failed. Try again with a selectable PDF or DOCX.",
      uploadSuccessIntro: "Resume imported successfully:",
      copyDone: "Copied",
      copyLabel: "Copy",
      regenerate: "Generate again",
      preparingOutput: "Preparing premium output...",
      limitRenewNotice: "Your monthly limit resets next month. To keep going today, upgrade your plan.",
      upgradeCta: "Upgrade to continue",
      pdfFreeWatermark: "Created with GlobalHire AI — free plan",
      formColumnTitle: "Inputs",
      previewColumnTitle: "Live preview",
      outputLengthLabel: "Length",
      toneLabel: "Tone",
      lengthShort: "Short",
      lengthMedium: "Medium",
      lengthDetailed: "Detailed",
      toneNatural: "Natural",
      toneProfessional: "Professional",
      toneConfident: "Confident",
      toneDirect: "Direct",
      voiceControlsHint: "Applies to recruiter message, cover letter, and LinkedIn summary."
    }
  ),
  es: pack(
    esByType,
    pdfEs,
    [
      "Analizando currículum",
      "Leyendo la descripción de la vacante",
      "Comparando ajuste ATS",
      "Generando documento",
      "Finalizando resultado"
    ],
    {
      uploadPdfDocx: "Subir PDF/DOCX",
      importResume: "Importar CV",
      readingFile: "Leyendo archivo...",
      uploadHelp:
        "Aceptamos PDF y DOCX con texto seleccionable, hasta 5 MB. Los archivos escaneados o en imagen pueden fallar.",
      uploadErrorGeneric:
        "No pudimos extraer texto. Usa PDF o DOCX con texto seleccionable.",
      uploadErrorNetwork: "No se pudo completar la subida. Intenta de nuevo con un PDF o DOCX seleccionable.",
      uploadSuccessIntro: "CV importado correctamente:",
      copyDone: "Copiado",
      copyLabel: "Copiar",
      regenerate: "Generar de nuevo",
      preparingOutput: "Preparando resultado premium...",
      limitRenewNotice: "Tu límite mensual se renueva el próximo mes. Para seguir hoy, mejora tu plan.",
      upgradeCta: "Mejorar plan para continuar",
      pdfFreeWatermark: "Creado con GlobalHire AI — plan gratuito",
      formColumnTitle: "Entradas",
      previewColumnTitle: "Vista previa",
      outputLengthLabel: "Extensión",
      toneLabel: "Tono",
      lengthShort: "Corto",
      lengthMedium: "Medio",
      lengthDetailed: "Detallado",
      toneNatural: "Natural",
      toneProfessional: "Profesional",
      toneConfident: "Seguro",
      toneDirect: "Directo",
      voiceControlsHint: "Aplica a mensaje al reclutador, carta y resumen de LinkedIn."
    }
  ),
  fr: pack(
    frByType,
    pdfFr,
    [
      "Analyse du CV",
      "Lecture de l'offre",
      "Comparaison ATS",
      "Génération du document",
      "Finalisation"
    ],
    {
      uploadPdfDocx: "Importer PDF/DOCX",
      importResume: "Importer le CV",
      readingFile: "Lecture du fichier...",
      uploadHelp:
        "PDF et DOCX avec texte sélectionnable, jusqu'à 5 Mo. Les fichiers scannés ou en image peuvent échouer.",
      uploadErrorGeneric:
        "Impossible d'extraire le texte. Utilisez un PDF ou DOCX avec texte sélectionnable.",
      uploadErrorNetwork: "Échec du téléversement. Réessayez avec un PDF ou DOCX sélectionnable.",
      uploadSuccessIntro: "CV importé avec succès :",
      copyDone: "Copié",
      copyLabel: "Copier",
      regenerate: "Générer à nouveau",
      preparingOutput: "Préparation du résultat premium...",
      limitRenewNotice: "Votre limite mensuelle se renouvelle le mois prochain. Pour continuer aujourd'hui, passez à un plan supérieur.",
      upgradeCta: "Mettre à niveau pour continuer",
      pdfFreeWatermark: "Créé avec GlobalHire AI — offre gratuite",
      formColumnTitle: "Saisie",
      previewColumnTitle: "Aperçu",
      outputLengthLabel: "Longueur",
      toneLabel: "Ton",
      lengthShort: "Court",
      lengthMedium: "Moyen",
      lengthDetailed: "Détaillé",
      toneNatural: "Naturel",
      toneProfessional: "Professionnel",
      toneConfident: "Assuré",
      toneDirect: "Direct",
      voiceControlsHint: "S’applique au message recruteur, à la lettre et au résumé LinkedIn."
    }
  )
};

export function getGeneratorUi(locale: Locale): GeneratorUiStrings {
  return generatorUiCopy[locale];
}
