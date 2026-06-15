"use client";

import { Bell, FileText, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { dashboardCopy, locales } from "@/lib/i18n";
import { legacyDeliveryTypeToKey, legacyTemplateToKey, settingsPageCopy } from "@/lib/i18n-app-wide";
import { getGeneratorUi } from "@/lib/i18n-generator";
import { getTargetCountrySelectOptions, targetCountryCanonicalSet } from "@/lib/target-countries";
import type { GenerationType } from "@/lib/types";

const storageKey = "globalhire-preferences";

const ALL_GENERATION_TYPES: GenerationType[] = [
  "ats_resume",
  "cover_letter",
  "linkedin_summary",
  "recruiter_message",
  "interview_prep",
  "translate_resume"
];

type PdfTemplateKey = "executive" | "modern" | "compact";

type Preferences = {
  language: string;
  deliveryType: string;
  targetCountry: string;
  template: string;
};

const allowedOutputLanguages = new Set(locales.map((item) => item.outputLabel));
const allowedTemplates = new Set<PdfTemplateKey>(["executive", "modern", "compact"]);
const allowedDeliveryKeys = new Set<string>(ALL_GENERATION_TYPES);

function normalizeStoredPreferences(raw: Preferences): Preferences {
  let deliveryType = raw.deliveryType;
  if (!allowedDeliveryKeys.has(deliveryType)) {
    deliveryType = legacyDeliveryTypeToKey[deliveryType] || "ats_resume";
  }
  let template = raw.template;
  if (!allowedTemplates.has(template as PdfTemplateKey)) {
    template = legacyTemplateToKey[template] || "executive";
  }
  let targetCountry = raw.targetCountry;
  if (!targetCountryCanonicalSet.has(targetCountry)) {
    targetCountry = "Estados Unidos";
  }
  let language = raw.language;
  if (!allowedOutputLanguages.has(language)) {
    language = locales[0].outputLabel;
  }
  return { language, deliveryType, targetCountry, template };
}

const defaultPreferences: Preferences = {
  language: locales[0].outputLabel,
  deliveryType: "ats_resume",
  targetCountry: "Estados Unidos",
  template: "executive"
};

export function SettingsPanel() {
  const { locale } = useLanguage();
  const dash = dashboardCopy[locale];
  const ui = settingsPageCopy[locale];
  const genUi = getGeneratorUi(locale);
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = { ...defaultPreferences, ...JSON.parse(stored) } as Preferences & { notifications?: string };
        setPreferences(normalizeStoredPreferences(parsed));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  function updatePreference(key: keyof Preferences, value: string) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save() {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{ui.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{ui.lead}</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Settings className="text-brand-500" size={22} />
            <h2 className="text-xl font-semibold text-foreground">{ui.cardPrefsTitle}</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label={ui.fieldDefaultLanguage}>
              <select className={inputClass} value={preferences.language} onChange={(event) => updatePreference("language", event.target.value)}>
                {locales.map((item) => (
                  <option key={item.value} value={item.outputLabel}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={ui.fieldDefaultDelivery}>
              <select className={inputClass} value={preferences.deliveryType} onChange={(event) => updatePreference("deliveryType", event.target.value)}>
                {ALL_GENERATION_TYPES.map((key) => (
                  <option key={key} value={key}>
                    {dash.deliveryTypes[key]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={ui.fieldDefaultCountry}>
              <select className={inputClass} value={preferences.targetCountry} onChange={(event) => updatePreference("targetCountry", event.target.value)}>
                {getTargetCountrySelectOptions(locale).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={ui.fieldPdfTemplate}>
              <select className={inputClass} value={preferences.template} onChange={(event) => updatePreference("template", event.target.value)}>
                {(["executive", "modern", "compact"] as const).map((key) => (
                  <option key={key} value={key}>
                    {genUi.pdfTemplates[key]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Button onClick={save} className="mt-6 bg-primary text-primary-foreground hover:brightness-105">
            <Save size={17} />
            {saved ? ui.saved : ui.save}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">{ui.footnote}</p>
        </Card>

        <div className="grid gap-5">
          <Card>
            <h2 className="text-xl font-semibold text-foreground">{ui.appearanceTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{ui.appearanceLead}</p>
            <div className="mt-4">
              <ThemeToggle labels={themeLabels} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{ui.themeNote}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <Bell className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{ui.communicationsTitle}</h2>
            </div>
            <p className="mt-3 rounded-2xl border border-border bg-muted/60 p-3 text-sm leading-6 text-muted-foreground">{ui.communicationsBody}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <FileText className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-foreground">{ui.templatesCardTitle}</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{ui.templatesCardBody}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
