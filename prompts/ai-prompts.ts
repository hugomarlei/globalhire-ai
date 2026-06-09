import type { GenerationType } from "@/lib/types";

export type OutputLength = "short" | "medium" | "detailed";
export type OutputTone = "natural" | "professional" | "confident" | "direct";

type PromptArgs = {
  type: GenerationType;
  resume: string;
  jobDescription: string;
  language: string;
  targetCountry: string;
  optimizationInstruction?: string;
  planLabel?: string;
  intensityPercent?: string;
  outputLength?: OutputLength;
  outputTone?: OutputTone;
};

type DeliverySpec = {
  label: string;
  objective: string;
  modules: string[];
  rules: string[];
  structure?: string[];
};

const VOICE_TYPES: GenerationType[] = ["recruiter_message", "cover_letter", "linkedin_summary"];

/** Types that honor output length & tone controls (client + API). */
export const VOICE_CONTROLLED_GENERATION_TYPES = VOICE_TYPES;

const modules = {
  factExtraction: `
FACT EXTRACTION LAYER
- Extract a private fact base from the resume: roles, employers, dates, seniority, sectors, tools, certifications, languages, outcomes, scope, stakeholders and constraints.
- Tag each useful fact as evidence, differentiator, keyword, market signal or risk.
- No final claim may exist without support in this fact base.
`.trim(),

  jobIntelligence: `
JOB INTELLIGENCE LAYER
- If a job description exists, extract target role, seniority, business context, ATS keywords, tools, responsibilities, technical skills and behavioral skills.
- Infer company type and market pressure from the description when possible.
- Build a private match map: strong evidence, partial evidence, transferable evidence and unsupported gaps.
`.trim(),

  benchmarkMarket: `
BENCHMARK & MARKET INTELLIGENCE ENGINE
- Run this before drafting any asset.
- Employer analysis: identify employer, sector, segment, size and market when present in the job description, company description, vacancy URL or role context. If absent, infer only from available wording and mark uncertainty privately.
- Classify market context using grounded signals: Siemens/Emerson = Industrial Automation, ABB = Industrial Technology, Schneider Electric = Energy Management, Google = Big Tech, Tesla = Automotive Technology, Mercado Livre = Marketplace & Logistics, Amazon = E-commerce/Cloud.
- Role positioning: identify function, seniority and nature of the role, such as Sales Engineer, Account Manager, Solutions Architect, Software Engineer, Plant Manager, Technical Support Engineer or Operations Manager.
- Market expectation model: determine what the market values for that role. Examples: Sales Engineer = technical knowledge, consultative relationship, specification, commercial support and complex sales; Software Engineer = architecture, scalability, code quality and distributed systems; Operations Manager = processes, efficiency, leadership and KPIs.
- Competitive differentiation: compare the resume against market expectations and classify differentiators privately as HIGH VALUE, MEDIUM VALUE or LOW VALUE. Also identify gaps and rare experiences.
- Strategic positioning: answer privately why this candidate should be chosen instead of similar candidates in the same market.
- Never invent employer facts. If employer context is weak, write market-aware but avoid pretending to know the company.
`.trim(),

  evidence: `
EVIDENCE ENGINE
- Replace generic claims with proof: action + context + tool/process + stakeholder/scope + result when available.
- If no metric exists, use scope, environment, responsibility or complexity. Never invent numbers.
- Ban unsupported filler such as "strong experience", "extensive background", "proven track record", "highly motivated" and equivalents.
`.trim(),

  differentiation: `
DIFFERENTIATION ENGINE
- Identify what makes the candidate less interchangeable: rare combinations, international exposure, technical complexity, regulated environments, customer exposure, leadership, scope changes, languages and relevant projects.
- Prioritize real differentiators over broad skill lists.
- The output must not read as if another candidate could use it unchanged.
`.trim(),

  positioning: `
POSITIONING ENGINE
- Privately answer: "Why would this candidate be remembered among 100 candidates?"
- Use that answer to shape headline, opening, sequence, emphasis and closing argument.
- Lead with hiring value, not with a generic title or chronological dump.
`.trim(),

  marketAdaptation: `
MARKET ADAPTATION ENGINE
- Adapt vocabulary, density, proof style and seniority framing to the target country, market, sector, company type and role level.
- If the job context implies a specific employer or sector, tailor the angle to it. Siemens, ABB, Tesla, Google and Mercado Livre should not receive the same narrative.
- Use benchmark findings to decide which facts deserve more density and which facts should be compacted.
- Keep factual truth higher priority than persuasion.
`.trim(),

  humanWriting: `
HUMAN WRITING ENGINE
- Write like an elite human resume writer: natural rhythm, varied sentence length, concrete nouns and active verbs.
- Avoid repeated bullet stems, template openings, mechanical transitions and AI-scented phrasing.
- Prefer precise language over inflated corporate tone.
`.trim(),

  qualityAudit: `
QUALITY AUDIT ENGINE
- Before final output, privately score ATS/searchability, job fit, evidence density, differentiation, clarity, naturalness and factual safety.
- Verify specificity: does the asset feel specific to the employer, market, role, seniority and target country?
- Ask privately: could this asset be reused for another vacancy without meaningful changes? If yes, rewrite it.
- If evidence, differentiation, job fit or naturalness is weak, rewrite before responding.
- Do not expose the audit; only the improved final asset and applied improvements are allowed.
`.trim(),

  truth: `
TRUTH CONSTRAINTS
- Do not invent companies, titles, degrees, certifications, tools, languages, metrics, awards, employers, seniority, locations or experiences.
- Do not upgrade responsibility beyond resume evidence.
- Preserve contact details and locations that exist in the source unless anonymization is requested.
- Use the final language requested by the user. Keep proper nouns, technologies, certifications and tools in their market-standard form.
`.trim(),

  atsResume: `
ATS RESUME MODULE
- Use standard readable sections, clean text and natural keywords. No tables, graphics, icons, keyword stuffing or decorative formatting.
- Keywords must be supported by resume evidence and integrated where they belong.
- Preserve the complete career chronology: every real employer, role, date range and location from the source resume must appear in the final resume.
- Do not cap the resume to only the most relevant experiences. Give target-relevant roles more density and use concise bullets for secondary roles, but do not delete real history.
- If the job asks for leadership, channels, distributors, market share, Key Accounts or portfolio ownership and the resume does not prove it, frame adjacent evidence as transferable exposure instead of claiming direct ownership.
`.trim(),

  linkedinSearch: `
LINKEDIN SEARCH MODULE
- Balance search keywords with a human narrative.
- Include sectors, tools, problems solved and market positioning only when supported.
- Avoid keyword walls and generic personal branding language.
`.trim(),

  interview: `
INTERVIEW MODULE
- Prepare the candidate to speak with evidence, not memorize generic answers.
- Convert resume facts into likely questions, STAR stories, differentiators, risks and thoughtful questions for the interviewer.
`.trim(),

  translation: `
TRANSLATION MODULE
- This delivery is translation and market wording adaptation, not job optimization.
- Ignore job description even if provided.
- Preserve every real role, employer, date, location, education item, certification, language, link and contact detail.
`.trim()
} satisfies Record<string, string>;

const sharedPipeline = [
  modules.factExtraction,
  modules.jobIntelligence,
  modules.benchmarkMarket,
  modules.evidence,
  modules.differentiation,
  modules.positioning,
  modules.marketAdaptation,
  modules.humanWriting,
  modules.qualityAudit,
  modules.truth
];

const specs: Record<GenerationType, DeliverySpec> = {
  ats_resume: {
    label: "Premium ATS resume rewrite",
    objective: "Create a differentiated, evidence-rich resume aligned to the role, market and target country.",
    modules: [modules.atsResume],
    structure: [
      "Name",
      "Headline or Target Role",
      "Contact",
      "Professional Summary",
      "Core Skills",
      "Professional Experience",
      "Education",
      "Certifications",
      "Languages"
    ],
    rules: [
      "Summary must state lane, proof and market fit in 3 to 5 dense lines.",
      "Core skills must prioritize verified requirements and high-value transferable skills.",
      "Experience bullets must show action, context, tool/process, stakeholder/scope and result when available.",
      "Reorganize density by benchmark relevance: HIGH VALUE evidence gets more space, MEDIUM VALUE stays concise, LOW VALUE is compacted.",
      "Give more depth to roles closest to the target; compact weaker roles without erasing real history, employers, dates, locations or role titles.",
      "The final resume must be complete enough for export, not a shortened preview.",
      "If languages exist in the source resume, preserve them as a dedicated section instead of folding them into skills.",
      "Omit empty or negative sections such as no relevant certifications."
    ]
  },

  cover_letter: {
    label: "Premium cover letter",
    objective: "Turn resume evidence into a hiring argument, not a prose copy of the resume.",
    modules: [],
    rules: [
      "Open with a concrete fit argument grounded in candidate evidence.",
      "Build 2 to 4 proof points tied to the employer's business need.",
      "Connect the candidate's strongest benchmark differentiator directly to the company/market context.",
      "Show market and company-context awareness without sounding templated.",
      "Close with a calm next step, not pressure or generic enthusiasm.",
      "Never use ceremonial openings such as I hope this message finds you well."
    ]
  },

  linkedin_summary: {
    label: "Premium LinkedIn summary",
    objective: "Make the profile memorable, searchable and human.",
    modules: [modules.linkedinSearch],
    rules: [
      "Use first person unless the target language strongly favors another convention.",
      "The first paragraph must define professional lane and differentiator.",
      "Include evidence, sectors, tools, problems solved and international angle when supported.",
      "Emphasize competitive differentiators that would matter in the benchmark market.",
      "Do not over-polish into a brochure voice.",
      "Do not include contact details unless they naturally belong in the summary."
    ]
  },

  recruiter_message: {
    label: "Premium recruiter outreach message",
    objective: "Produce a concise message a real candidate would send to a recruiter.",
    modules: [],
    rules: [
      "Use one context line, one evidence/value line and one clear ask.",
      "Mention role/company context when available.",
      "Highlight one specific value point tied to the benchmark scenario, not a generic career pitch.",
      "No flattery, filler, pressure or generic excitement.",
      "Short = 60-90 words; medium = 90-130 words; detailed = 130-180 words."
    ]
  },

  interview_prep: {
    label: "Premium interview preparation guide",
    objective: "Help the candidate answer with evidence and strategic positioning.",
    modules: [modules.interview],
    structure: [
      "=== PERGUNTAS PROVAVEIS ===",
      "=== RESPOSTAS EM STAR ===",
      "=== DIFERENCIAIS A ENFATIZAR ===",
      "=== RISCOS OU LACUNAS ===",
      "=== PERGUNTAS AO ENTREVISTADOR ==="
    ],
    rules: [
      "Questions must reflect job context and resume evidence.",
      "STAR answers must use real facts; do not invent projects or metrics.",
      "Prepare answers around employer, sector and role expectations identified by the benchmark engine.",
      "Risks must be honest and paired with a positioning strategy.",
      "Keep sections practical, concise and scannable."
    ]
  },

  translate_resume: {
    label: "Complete resume translation",
    objective: "Translate the full resume and adapt professional wording to the target country without job-specific rewriting.",
    modules: [modules.translation, modules.atsResume],
    rules: [
      "Preserve all experiences, employers, titles, dates, locations, education, certifications, languages, links and contact details.",
      "Do not cut long career histories; translate every role and compact only repeated wording inside a role.",
      "The final translated resume must be complete enough for export, not a sample or shortened version.",
      "Adapt job titles and section names to target-market conventions without changing seniority or scope.",
      "If the source includes languages, keep them as a dedicated section instead of folding them into skills.",
      "Keep a clean ATS-readable structure and natural professional language."
    ]
  }
};

const lengthRules: Record<OutputLength, string> = {
  short: "short: concise and high-signal; no filler",
  medium: "medium: balanced proof and readability",
  detailed: "detailed: richer proof and context, still disciplined"
};

const toneRules: Record<OutputTone, string> = {
  natural: "natural: human, clear and conversational-professional",
  professional: "professional: polished, credible and controlled",
  confident: "confident: assertive, commercially aware and never arrogant",
  direct: "direct: active verbs, short sentences and no ceremonial openings"
};

function compactList(title: string, items: string[]) {
  if (!items.length) return "";
  return `${title}\n${items.map((item) => `- ${item}`).join("\n")}`;
}

function contextBlock(args: PromptArgs) {
  const base = [
    `Final language: ${args.language}`,
    `Target country/market: ${args.targetCountry}`
  ];

  if (args.type === "translate_resume") {
    return compactList("TARGET CONTEXT", [...base, "Job description: intentionally ignored for this delivery"]);
  }

  return [
    compactList("TARGET CONTEXT", [
      ...base,
      `Plan/intensity: ${args.planLabel || "Standard"} (${args.intensityPercent || "default"})`,
      `Optimization instruction: ${args.optimizationInstruction || "Improve materially while staying faithful to the resume."}`
    ]),
    `JOB DESCRIPTION / CONTEXT\n${args.jobDescription?.trim() || "Not provided. Build positioning from resume evidence, target market and likely role context only."}`
  ].join("\n\n");
}

function voiceBlock(args: PromptArgs) {
  if (!VOICE_TYPES.includes(args.type)) return "";
  const length = args.outputLength || "medium";
  const tone = args.outputTone || "professional";
  return compactList("VOICE CONTROL", [
    `Length: ${lengthRules[length]}`,
    `Tone: ${toneRules[tone]}`,
    "Apply these controls to the final asset, not to the private analysis"
  ]);
}

function deliveryBlock(type: GenerationType) {
  const spec = specs[type];
  return [
    `DELIVERY\n${spec.label}\nObjective: ${spec.objective}`,
    spec.structure?.length ? `Required / recommended structure\n${spec.structure.join("\n")}` : "",
    ...spec.modules,
    compactList("DELIVERY RULES", spec.rules)
  ].filter(Boolean).join("\n\n");
}

const outputContract = `
OUTPUT CONTRACT
Respond only with these tags. Nothing before <DOCUMENT_FINAL> and nothing after </APPLIED_IMPROVEMENTS>.

<DOCUMENT_FINAL>
final asset only
</DOCUMENT_FINAL>

<APPLIED_IMPROVEMENTS>
- [12%] specific visible improvement in the final asset
- [10%] specific visible improvement in the final asset
- [8%] specific visible improvement in the final asset
- [7%] specific visible improvement in the final asset
- [6%] specific visible improvement in the final asset
</APPLIED_IMPROVEMENTS>
`.trim();

export function buildPrompt(args: PromptArgs) {
  return [
    `ROLE\nYou are GlobalHire's principal content-generation architect: an elite international resume writer, career strategist and recruiter-caliber editor.\nTask: ${specs[args.type].label}.`,
    contextBlock(args),
    "PRIVATE ARCHITECTURE\nRun these layers silently before writing. Do not expose maps, scores, notes or reasoning.",
    ...sharedPipeline,
    deliveryBlock(args.type),
    voiceBlock(args),
    outputContract,
    `SOURCE RESUME\n${args.resume}`
  ].filter(Boolean).join("\n\n").trim();
}
