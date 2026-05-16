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
    title: "Gerador de Currículo ATS",
    subtitle: "Transforme seu currículo em uma versão internacional, clara e alinhada à descrição da vaga.",
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
    title: "Tradução e Adaptação Internacional",
    subtitle: "Adapte o currículo para o idioma, país e convenções do mercado-alvo.",
    resumeLabel: "Currículo original",
    resumePlaceholder: "Cole o currículo que deseja traduzir e adaptar.",
    jobPlaceholder: "Opcional: cole uma vaga para adaptar termos, senioridade e palavras-chave.",
    cta: "Traduzir e adaptar",
    empty: "Seu currículo traduzido e adaptado aparecerá aqui."
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
    title: "International translation & adaptation",
    subtitle: "Adapt your resume to the language, country and market conventions.",
    resumeLabel: "Original resume",
    resumePlaceholder: "Paste the resume you want to translate and adapt.",
    jobPlaceholder: "Optional: paste a job to tune seniority, terms and keywords.",
    cta: "Translate & adapt",
    empty: "Your translated and adapted resume will appear here."
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
    title: "Traducción y adaptación internacional",
    subtitle: "Adapta el CV al idioma, país y convenciones del mercado objetivo.",
    resumeLabel: "CV original",
    resumePlaceholder: "Pega el CV que deseas traducir y adaptar.",
    jobPlaceholder: "Opcional: pega una vacante para afinar senioridad, términos y palabras clave.",
    cta: "Traducir y adaptar",
    empty: "Tu CV traducido y adaptado aparecerá aquí."
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
    title: "Traduction et adaptation internationale",
    subtitle: "Adaptez le CV à la langue, au pays et aux conventions du marché cible.",
    resumeLabel: "CV d'origine",
    resumePlaceholder: "Collez le CV à traduire et adapter.",
    jobPlaceholder: "Optionnel : collez une offre pour ajuster seniorité, termes et mots-clés.",
    cta: "Traduire et adapter",
    empty: "Votre CV traduit et adapté apparaîtra ici."
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
        "Aceitamos PDF e DOCX com texto real, até 5 MB. Se o arquivo for uma imagem ou PDF escaneado, a leitura automática pode não funcionar; nesse caso, cole o texto manualmente abaixo.",
      uploadErrorGeneric:
        "Não consegui extrair o texto deste arquivo. Use PDF ou DOCX com texto selecionável; se for escaneado ou imagem, cole o conteúdo manualmente no campo abaixo.",
      uploadErrorNetwork: "Não consegui concluir o upload. Tente novamente ou cole o texto manualmente.",
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
        "We accept PDF and DOCX with real text, up to 5 MB. Scanned PDFs or images may fail; paste the text manually below if needed.",
      uploadErrorGeneric:
        "We could not extract text from this file. Use PDF or DOCX with selectable text; for scans or images, paste manually below.",
      uploadErrorNetwork: "Upload failed. Try again or paste the text manually.",
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
        "Aceptamos PDF y DOCX con texto real, hasta 5 MB. Si el archivo es imagen o PDF escaneado, la lectura puede fallar; en ese caso, pega el texto manualmente abajo.",
      uploadErrorGeneric:
        "No pudimos extraer texto. Usa PDF o DOCX con texto seleccionable; si es escaneo o imagen, pega el contenido manualmente abajo.",
      uploadErrorNetwork: "No se pudo completar la subida. Intenta de nuevo o pega el texto manualmente.",
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
        "PDF et DOCX avec texte réel, jusqu'à 5 Mo. PDF scannés ou images : la lecture peut échouer ; collez le texte manuellement ci-dessous.",
      uploadErrorGeneric:
        "Impossible d'extraire le texte. Utilisez un PDF ou DOCX avec texte sélectionnable ; pour un scan ou une image, collez le contenu manuellement.",
      uploadErrorNetwork: "Échec du téléversement. Réessayez ou collez le texte manuellement.",
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
