"use client";

import { Bell, FileText, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { dashboardCopy, locales } from "@/lib/i18n";

const storageKey = "globalhire-preferences";

type Preferences = {
  language: string;
  deliveryType: string;
  targetCountry: string;
  template: string;
};

const defaultPreferences: Preferences = {
  language: locales[0].outputLabel,
  deliveryType: "Currículo ATS",
  targetCountry: "Estados Unidos",
  template: "Executivo ATS"
};

const allowedOutputLanguages = new Set(locales.map((item) => item.outputLabel));

const allowedTargetCountries = new Set([
  "Brasil",
  "Estados Unidos",
  "Canadá",
  "Reino Unido",
  "Portugal",
  "Alemanha",
  "Europa"
]);

const allowedTemplates = new Set(["Executivo ATS", "Moderno internacional", "Compacto premium"]);

export function SettingsPanel() {
  const { locale } = useLanguage();
  const dash = dashboardCopy[locale];
  const themeLabels = { light: dash.themeLight, dark: dash.themeDark, system: dash.themeSystem };
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = { ...defaultPreferences, ...JSON.parse(stored) } as Preferences & { notifications?: string };
        if (!allowedOutputLanguages.has(parsed.language)) {
          parsed.language = defaultPreferences.language;
        }
        if (!allowedTargetCountries.has(parsed.targetCountry)) {
          parsed.targetCountry = defaultPreferences.targetCountry;
        }
        if (!allowedTemplates.has(parsed.template)) {
          parsed.template = defaultPreferences.template;
        }
        const { language, deliveryType, targetCountry, template } = parsed;
        setPreferences({ language, deliveryType, targetCountry, template });
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
        <h1 className="text-3xl font-semibold text-ink dark:text-white">Configurações</h1>
        <p className="mt-2 text-sm text-graphite/65 dark:text-white/60">Defina padrões para reduzir cliques nas próximas gerações.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Settings className="text-brand-500" size={22} />
            <h2 className="text-xl font-semibold text-ink dark:text-white">Preferências de geração</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Idioma padrão">
              <select className={inputClass} value={preferences.language} onChange={(event) => updatePreference("language", event.target.value)}>
                {locales.map((item) => (
                  <option key={item.value} value={item.outputLabel}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tipo de entrega padrão">
              <select className={inputClass} value={preferences.deliveryType} onChange={(event) => updatePreference("deliveryType", event.target.value)}>
                <option>Currículo ATS</option>
                <option>Carta de apresentação</option>
                <option>Resumo LinkedIn</option>
                <option>Mensagem para recrutador</option>
                <option>Preparação para entrevista</option>
                <option>Tradução/adaptação</option>
              </select>
            </Field>
            <Field label="País-alvo padrão">
              <select className={inputClass} value={preferences.targetCountry} onChange={(event) => updatePreference("targetCountry", event.target.value)}>
                <option>Estados Unidos</option>
                <option>Brasil</option>
                <option>Canadá</option>
                <option>Reino Unido</option>
                <option>Portugal</option>
                <option>Alemanha</option>
                <option>Europa</option>
              </select>
            </Field>
            <Field label="Template de exportação PDF (padrão no Gerador)">
              <select className={inputClass} value={preferences.template} onChange={(event) => updatePreference("template", event.target.value)}>
                <option>Executivo ATS</option>
                <option>Moderno internacional</option>
                <option>Compacto premium</option>
              </select>
            </Field>
          </div>
          <Button onClick={save} className="mt-6 bg-brand-500 text-ink hover:bg-brand-600">
            <Save size={17} />
            {saved ? "Preferências salvas" : "Salvar preferências"}
          </Button>
          <p className="mt-3 text-xs text-graphite/50 dark:text-white/45">
            As preferências desta área personalizam automaticamente sua experiência no Gerador (idioma de saída, país-alvo e template de PDF ao abrir a ferramenta). Os valores ficam armazenados neste navegador neste dispositivo.
          </p>
        </Card>

        <div className="grid gap-5">
          <Card>
            <h2 className="text-xl font-semibold text-ink dark:text-white">{dash.themeTitle}</h2>
            <p className="mt-2 text-sm text-graphite/60 dark:text-white/55">Claro, escuro ou seguir o dispositivo. A preferência fica neste navegador.</p>
            <div className="mt-4">
              <ThemeToggle labels={themeLabels} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <Bell className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-ink dark:text-white">Comunicações da conta</h2>
            </div>
            <p className="mt-3 rounded-md border border-graphite/15 bg-graphite/[0.06] p-3 text-sm leading-6 text-graphite/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60">
              Preferências de comunicação associadas à sua conta. Quando necessário para segurança ou conformidade, enviamos e-mails transacionais (por exemplo, confirmações de acesso). Para pedidos relacionados a mensagens institucionais, utilize o canal de suporte indicado no site.
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <FileText className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold text-ink dark:text-white">Templates</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite/65 dark:text-white/60">
              Três modelos de PDF no Gerador — Executivo ATS, Moderno internacional e Compacto premium — definem tipografia, margens e estilo da página exportada. O padrão escolhido na lista ao lado é aplicado ao abrir o Gerador; você pode alterar o modelo na própria tela antes de exportar.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
