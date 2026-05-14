import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import type { GenerationType } from "@/lib/types";
import { deliveryLabel } from "@/lib/i18n-app-wide";

export function intlLocaleForUi(locale: Locale): string {
  if (locale === "pt-BR") return "pt-BR";
  if (locale === "es") return "es-ES";
  if (locale === "fr") return "fr-FR";
  return "en-US";
}

export function outputLanguageLabelForApi(locale: Locale): string {
  return locales.find((l) => l.value === locale)?.outputLabel ?? "English";
}

export type HistoryListStrings = {
  titleHistory: string;
  titleDocuments: string;
  leadHistory: string;
  leadDocuments: string;
  tabHistory: string;
  tabDocuments: string;
  createNew: string;
  searchPlaceholder: string;
  filterAll: string;
  copy: string;
  copied: string;
  regenerate: string;
  regenerating: string;
  delete: string;
  deleting: string;
  openDocument: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  regenerateFail: string;
  regenerateSuccess: string;
  deleteConfirm: string;
  deleteFail: string;
  deleteSuccess: string;
};

export const historyListCopy: Record<Locale, HistoryListStrings> = {
  "pt-BR": {
    titleHistory: "Histórico",
    titleDocuments: "Meus documentos",
    leadHistory: "Linha do tempo de todas as gerações realizadas, com data, idioma, país e ações rápidas.",
    leadDocuments: "Biblioteca organizada dos documentos finais, com busca, filtros e ações de arquivo.",
    tabHistory: "Histórico",
    tabDocuments: "Meus documentos",
    createNew: "Criar novo",
    searchPlaceholder: "Buscar por tipo, idioma, país ou conteúdo",
    filterAll: "Todos",
    copy: "Copiar",
    copied: "Copiado",
    regenerate: "Regenerar",
    regenerating: "Regenerando...",
    delete: "Excluir",
    deleting: "Excluindo...",
    openDocument: "Abrir documento",
    emptyTitle: "Nenhum documento encontrado",
    emptyBody: "Crie uma versão otimizada ou ajuste os filtros para encontrar documentos anteriores.",
    emptyCta: "Criar documento",
    regenerateFail: "Não consegui regenerar este documento agora.",
    regenerateSuccess: "Nova versão gerada e salva no histórico. Atualize a página para vê-la na lista.",
    deleteConfirm: "Excluir este documento do histórico? Esta ação remove a geração salva e não pode ser desfeita.",
    deleteFail: "Não consegui excluir este documento agora.",
    deleteSuccess: "Documento excluído do seu histórico."
  },
  en: {
    titleHistory: "History",
    titleDocuments: "My documents",
    leadHistory: "Timeline of all generations with date, language, country and quick actions.",
    leadDocuments: "Library of final documents with search, filters and file actions.",
    tabHistory: "History",
    tabDocuments: "My documents",
    createNew: "Create new",
    searchPlaceholder: "Search by type, language, country or content",
    filterAll: "All",
    copy: "Copy",
    copied: "Copied",
    regenerate: "Regenerate",
    regenerating: "Regenerating...",
    delete: "Delete",
    deleting: "Deleting...",
    openDocument: "Open document",
    emptyTitle: "No documents found",
    emptyBody: "Create an optimized version or adjust filters to find previous documents.",
    emptyCta: "Create document",
    regenerateFail: "Could not regenerate this document right now.",
    regenerateSuccess: "New version generated and saved. Refresh the page to see it in the list.",
    deleteConfirm: "Delete this item from history? This removes the saved generation and cannot be undone.",
    deleteFail: "Could not delete this document right now.",
    deleteSuccess: "Document removed from your history."
  },
  es: {
    titleHistory: "Historial",
    titleDocuments: "Mis documentos",
    leadHistory: "Línea de tiempo de todas las generaciones con fecha, idioma, país y acciones rápidas.",
    leadDocuments: "Biblioteca de documentos finales con búsqueda, filtros y acciones.",
    tabHistory: "Historial",
    tabDocuments: "Mis documentos",
    createNew: "Crear nuevo",
    searchPlaceholder: "Buscar por tipo, idioma, país o contenido",
    filterAll: "Todos",
    copy: "Copiar",
    copied: "Copiado",
    regenerate: "Regenerar",
    regenerating: "Regenerando...",
    delete: "Eliminar",
    deleting: "Eliminando...",
    openDocument: "Abrir documento",
    emptyTitle: "No se encontraron documentos",
    emptyBody: "Crea una versión optimizada o ajusta los filtros para encontrar documentos anteriores.",
    emptyCta: "Crear documento",
    regenerateFail: "No pude regenerar este documento ahora.",
    regenerateSuccess: "Nueva versión generada y guardada. Recarga la página para verla en la lista.",
    deleteConfirm: "¿Eliminar este documento del historial? Quita la generación guardada y no se puede deshacer.",
    deleteFail: "No pude eliminar este documento ahora.",
    deleteSuccess: "Documento eliminado de tu historial."
  },
  fr: {
    titleHistory: "Historique",
    titleDocuments: "Mes documents",
    leadHistory: "Chronologie de toutes les générations avec date, langue, pays et actions rapides.",
    leadDocuments: "Bibliothèque des documents finaux avec recherche, filtres et actions.",
    tabHistory: "Historique",
    tabDocuments: "Mes documents",
    createNew: "Créer",
    searchPlaceholder: "Rechercher par type, langue, pays ou contenu",
    filterAll: "Tous",
    copy: "Copier",
    copied: "Copié",
    regenerate: "Régénérer",
    regenerating: "Régénération...",
    delete: "Supprimer",
    deleting: "Suppression...",
    openDocument: "Ouvrir le document",
    emptyTitle: "Aucun document trouvé",
    emptyBody: "Créez une version optimisée ou ajustez les filtres pour retrouver d’anciens documents.",
    emptyCta: "Créer un document",
    regenerateFail: "Impossible de régénérer ce document pour le moment.",
    regenerateSuccess: "Nouvelle version générée et enregistrée. Actualisez la page pour la voir dans la liste.",
    deleteConfirm: "Supprimer cet élément de l’historique ? La génération enregistrée sera supprimée, action irréversible.",
    deleteFail: "Impossible de supprimer ce document pour le moment.",
    deleteSuccess: "Document retiré de votre historique."
  }
};

export function historyTypeShortLabel(locale: Locale, type: string): string {
  const t = type as GenerationType;
  if (["ats_resume", "cover_letter", "linkedin_summary", "recruiter_message", "interview_prep", "translate_resume"].includes(t)) {
    return deliveryLabel(locale, t);
  }
  return type;
}

export type AtsAnalyzerStrings = {
  titleScore: string;
  titleKeywords: string;
  leadScore: string;
  leadKeywords: string;
  tabScore: string;
  tabKeywords: string;
  analyzerTitleScore: string;
  analyzerTitleKeywords: string;
  disclaimer: string;
  uploadLabel: string;
  uploadIdle: string;
  uploadLoading: string;
  uploadErrorGeneric: string;
  uploadErrorNetwork: string;
  uploadSuccess: (tenthsK: string) => string;
  pasteResumeLabel: string;
  pasteResumePlaceholder: string;
  jobLabel: string;
  jobPlaceholder: string;
  matchLabel: string;
  scoreGaugeLabel: string;
  foundTitle: string;
  missingTitle: string;
  pasteJobHint: string;
  noGap: string;
  recommendationsTitle: string;
  viewPlans: string;
  limitKeyword: string;
  optimizeCta: string;
  optimizing: string;
  optimizeError: string;
  outputCardTitle: string;
  outputCardLead: string;
  copy: string;
  copied: string;
  generateAgain: string;
  savedHistory: string;
  preOutput: string;
  emptyPreOutput: string;
};

export const atsAnalyzerCopy: Record<Locale, AtsAnalyzerStrings> = {
  "pt-BR": {
    titleScore: "ATS Score",
    titleKeywords: "Análise de Palavras-chave",
    leadScore: "Compare seu currículo com uma vaga, veja compatibilidade, palavras-chave e gere uma versão otimizada na própria tela.",
    leadKeywords: "Veja quais termos da vaga já aparecem no currículo e quais lacunas podem reduzir sua compatibilidade.",
    tabScore: "ATS Score",
    tabKeywords: "Palavras-chave",
    analyzerTitleScore: "Analisador ATS",
    analyzerTitleKeywords: "Comparador de keywords",
    disclaimer:
      "O ATS Score é uma estimativa para orientar melhorias. Ele não garante aprovação, entrevista ou resposta de recrutadores.",
    uploadLabel: "Upload PDF ou DOCX",
    uploadIdle: "Selecionar currículo",
    uploadLoading: "Lendo arquivo...",
    uploadErrorGeneric: "Não consegui ler o arquivo. Se for PDF escaneado, cole o texto manualmente.",
    uploadErrorNetwork: "Não consegui concluir o upload. Tente novamente ou cole o currículo manualmente.",
    uploadSuccess: (tenthsK) => `Currículo importado com sucesso: ${tenthsK} mil caracteres extraídos.`,
    pasteResumeLabel: "Ou cole o currículo",
    pasteResumePlaceholder: "Cole seu currículo completo aqui.",
    jobLabel: "Descrição da vaga",
    jobPlaceholder: "Cole a descrição da vaga para comparar score e palavras-chave.",
    matchLabel: "Match com a vaga",
    scoreGaugeLabel: "ATS Score",
    foundTitle: "Keywords encontradas",
    missingTitle: "Keywords ausentes",
    pasteJobHint: "Cole uma vaga para analisar.",
    noGap: "Nenhuma lacuna crítica detectada.",
    recommendationsTitle: "Recomendações",
    viewPlans: "Ver planos",
    limitKeyword: "limite",
    optimizeCta: "Criar versão otimizada",
    optimizing: "Otimizando currículo...",
    optimizeError: "Não consegui gerar a versão otimizada agora.",
    outputCardTitle: "Currículo otimizado pelo ATS Score",
    outputCardLead: "A versão gerada aqui é salva automaticamente no histórico.",
    copy: "Copiar",
    copied: "Copiado",
    generateAgain: "Gerar novamente",
    savedHistory: "Salvo no histórico",
    preOutput: "Gerando uma versão otimizada com base no score, keywords e recomendações...",
    emptyPreOutput: "Depois da análise, clique em Criar versão otimizada para ver o currículo reescrito aqui."
  },
  en: {
    titleScore: "ATS Score",
    titleKeywords: "Keyword analysis",
    leadScore: "Compare your resume with a job, see fit and keywords, and generate an optimized version on this screen.",
    leadKeywords: "See which job terms already appear in your resume and which gaps may reduce your match.",
    tabScore: "ATS Score",
    tabKeywords: "Keywords",
    analyzerTitleScore: "ATS analyzer",
    analyzerTitleKeywords: "Keyword comparator",
    disclaimer: "ATS Score is an estimate to guide improvements. It does not guarantee screening pass, interviews or recruiter replies.",
    uploadLabel: "Upload PDF or DOCX",
    uploadIdle: "Select resume",
    uploadLoading: "Reading file...",
    uploadErrorGeneric: "Could not read the file. For scanned PDFs, paste the text manually.",
    uploadErrorNetwork: "Upload failed. Try again or paste your resume manually.",
    uploadSuccess: (tenthsK) => `Resume imported: ${tenthsK}k characters extracted.`,
    pasteResumeLabel: "Or paste your resume",
    pasteResumePlaceholder: "Paste your full resume here.",
    jobLabel: "Job description",
    jobPlaceholder: "Paste the job description to compare score and keywords.",
    matchLabel: "Job match",
    scoreGaugeLabel: "ATS Score",
    foundTitle: "Keywords found",
    missingTitle: "Missing keywords",
    pasteJobHint: "Paste a job description to analyze.",
    noGap: "No critical gaps detected.",
    recommendationsTitle: "Recommendations",
    viewPlans: "View plans",
    limitKeyword: "limit",
    optimizeCta: "Create optimized version",
    optimizing: "Optimizing resume...",
    optimizeError: "Could not generate the optimized version now.",
    outputCardTitle: "Resume optimized with ATS Score",
    outputCardLead: "The version generated here is saved automatically to history.",
    copy: "Copy",
    copied: "Copied",
    generateAgain: "Generate again",
    savedHistory: "Saved to history",
    preOutput: "Generating an optimized version from score, keywords and recommendations...",
    emptyPreOutput: "After analysis, click Create optimized version to see the rewritten resume here."
  },
  es: {
    titleScore: "ATS Score",
    titleKeywords: "Análisis de palabras clave",
    leadScore: "Compara tu CV con una vacante, mira compatibilidad y palabras clave, y genera una versión optimizada aquí.",
    leadKeywords: "Mira qué términos de la vacante ya aparecen en tu CV y qué lagunas pueden reducir tu encaje.",
    tabScore: "ATS Score",
    tabKeywords: "Palabras clave",
    analyzerTitleScore: "Analizador ATS",
    analyzerTitleKeywords: "Comparador de keywords",
    disclaimer:
      "El ATS Score es una estimación orientativa. No garantiza aprobación, entrevista ni respuesta de reclutadores.",
    uploadLabel: "Subir PDF o DOCX",
    uploadIdle: "Seleccionar CV",
    uploadLoading: "Leyendo archivo...",
    uploadErrorGeneric: "No pude leer el archivo. Si es PDF escaneado, pega el texto manualmente.",
    uploadErrorNetwork: "No pude completar la subida. Inténtalo de nuevo o pega el CV manualmente.",
    uploadSuccess: (tenthsK) => `CV importado: ${tenthsK} mil caracteres extraídos.`,
    pasteResumeLabel: "O pega el CV",
    pasteResumePlaceholder: "Pega aquí tu CV completo.",
    jobLabel: "Descripción de la vacante",
    jobPlaceholder: "Pega la descripción para comparar score y palabras clave.",
    matchLabel: "Encaje con la vacante",
    scoreGaugeLabel: "ATS Score",
    foundTitle: "Palabras clave encontradas",
    missingTitle: "Palabras clave ausentes",
    pasteJobHint: "Pega una vacante para analizar.",
    noGap: "No se detectaron lagunas críticas.",
    recommendationsTitle: "Recomendaciones",
    viewPlans: "Ver planes",
    limitKeyword: "límite",
    optimizeCta: "Crear versión optimizada",
    optimizing: "Optimizando CV...",
    optimizeError: "No pude generar la versión optimizada ahora.",
    outputCardTitle: "CV optimizado con ATS Score",
    outputCardLead: "La versión generada aquí se guarda automáticamente en el historial.",
    copy: "Copiar",
    copied: "Copiado",
    generateAgain: "Generar de nuevo",
    savedHistory: "Guardado en el historial",
    preOutput: "Generando una versión optimizada según score, keywords y recomendaciones...",
    emptyPreOutput: "Tras el análisis, haz clic en Crear versión optimizada para ver el CV reescrito aquí."
  },
  fr: {
    titleScore: "ATS Score",
    titleKeywords: "Analyse des mots-clés",
    leadScore: "Comparez votre CV à une offre, voyez l’adéquation et les mots-clés, et générez une version optimisée ici.",
    leadKeywords: "Voyez quels termes de l’offre figurent déjà dans votre CV et quels manques réduisent l’adéquation.",
    tabScore: "ATS Score",
    tabKeywords: "Mots-clés",
    analyzerTitleScore: "Analyseur ATS",
    analyzerTitleKeywords: "Comparateur de mots-clés",
    disclaimer:
      "L’ATS Score est une estimation pour guider les améliorations. Il ne garantit aucun passage ATS, entretien ou réponse recruteur.",
    uploadLabel: "Importer PDF ou DOCX",
    uploadIdle: "Sélectionner le CV",
    uploadLoading: "Lecture du fichier...",
    uploadErrorGeneric: "Impossible de lire le fichier. Pour un PDF scanné, collez le texte manuellement.",
    uploadErrorNetwork: "Échec de l’import. Réessayez ou collez le CV manuellement.",
    uploadSuccess: (tenthsK) => `CV importé : ${tenthsK} milliers de caractères extraits.`,
    pasteResumeLabel: "Ou collez le CV",
    pasteResumePlaceholder: "Collez ici votre CV complet.",
    jobLabel: "Description du poste",
    jobPlaceholder: "Collez la description pour comparer score et mots-clés.",
    matchLabel: "Adéquation au poste",
    scoreGaugeLabel: "ATS Score",
    foundTitle: "Mots-clés trouvés",
    missingTitle: "Mots-clés manquants",
    pasteJobHint: "Collez une offre pour analyser.",
    noGap: "Aucun manque critique détecté.",
    recommendationsTitle: "Recommandations",
    viewPlans: "Voir les offres",
    limitKeyword: "limite",
    optimizeCta: "Créer une version optimisée",
    optimizing: "Optimisation du CV...",
    optimizeError: "Impossible de générer la version optimisée pour le moment.",
    outputCardTitle: "CV optimisé avec l’ATS Score",
    outputCardLead: "La version générée ici est enregistrée automatiquement dans l’historique.",
    copy: "Copier",
    copied: "Copié",
    generateAgain: "Générer à nouveau",
    savedHistory: "Enregistré dans l’historique",
    preOutput: "Génération d’une version optimisée à partir du score, des mots-clés et des recommandations...",
    emptyPreOutput: "Après l’analyse, cliquez sur Créer une version optimisée pour voir le CV réécrit ici."
  }
};

export function buildAtsRecommendations(
  locale: Locale,
  input: { missing: string[]; resumeLen: number; score: number }
): string[] {
  const { missing, resumeLen, score } = input;
  const list = missing.slice(0, 5).join(", ");
  if (locale === "en") {
    return [
      missing.length
        ? `Include real job keywords such as ${list} when they truly reflect your experience.`
        : "The main job keywords already appear in your resume.",
      resumeLen < 1800
        ? "The resume looks short. Add more context, scope, tools and impact in relevant roles."
        : "Resume density looks good for ATS-style analysis.",
      score < 80
        ? "Generate an optimized version to improve clarity, seniority and job fit."
        : "Your resume is competitive. Fine-tune per role before applying."
    ];
  }
  if (locale === "es") {
    return [
      missing.length
        ? `Incluye palabras clave reales de la vacante como ${list} cuando reflejen tu experiencia.`
        : "Las principales palabras clave de la vacante ya aparecen en el CV.",
      resumeLen < 1800
        ? "El CV parece corto. Añade más contexto, alcance, herramientas e impacto en roles relevantes."
        : "La densidad del CV es adecuada para análisis tipo ATS.",
      score < 80
        ? "Genera una versión optimizada para mejorar claridad, seniority y encaje con la vacante."
        : "Tu CV es competitivo. Ajusta fino por vacante antes de postular."
    ];
  }
  if (locale === "fr") {
    return [
      missing.length
        ? `Incluez des mots-clés réels de l’offre tels que ${list} lorsqu’ils reflètent votre expérience.`
        : "Les principaux mots-clés de l’offre figurent déjà dans le CV.",
      resumeLen < 1800
        ? "Le CV semble court. Ajoutez contexte, périmètre, outils et impact sur les expériences pertinentes."
        : "La densité du CV est bonne pour une analyse type ATS.",
      score < 80
        ? "Générez une version optimisée pour renforcer clarté, seniorité et adéquation au poste."
        : "Votre CV est compétitif. Affinez par offre avant de postuler."
    ];
  }
  return [
    missing.length
      ? `Inclua palavras-chave reais da vaga como ${list} quando forem verdadeiras para sua experiência.`
      : "As principais palavras-chave da vaga já aparecem no currículo.",
    resumeLen < 1800
      ? "O currículo parece curto. Adicione mais contexto, escopo, ferramentas e impacto nas experiências relevantes."
      : "A densidade do currículo está boa para análise ATS.",
    score < 80
      ? "Gere uma versão otimizada para elevar clareza, senioridade e alinhamento com a vaga."
      : "Seu currículo está competitivo. Faça ajustes finos por vaga antes de aplicar."
  ];
}
