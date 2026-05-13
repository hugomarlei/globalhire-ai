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
  notifications: string;
  template: string;
};

const defaultPreferences: Preferences = {
  language: locales[0].outputLabel,
  deliveryType: "Currículo ATS",
  targetCountry: "Estados Unidos",
  notifications: "Resumo semanal",
  template: "Executivo ATS"
};

const allowedOutputLanguages = new Set(locales.map((item) => item.outputLabel));

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
        const parsed = { ...defaultPreferences, ...JSON.parse(stored) } as Preferences;
        if (!allowedOutputLanguages.has(parsed.language)) {
          parsed.language = defaultPreferences.language;
        }
        setPreferences(parsed);
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
        <h1 className="text-3xl font-semibold">Configurações</h1>
        <p className="mt-2 text-sm text-white/60">Defina padrões para reduzir cliques nas próximas gerações.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Settings className="text-brand-500" size={22} />
            <h2 className="text-xl font-semibold">Preferências de geração</h2>
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
                <option>Canadá</option>
                <option>Reino Unido</option>
                <option>Portugal</option>
                <option>Alemanha</option>
                <option>Europa</option>
              </select>
            </Field>
            <Field label="Template padrão">
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
          <p className="mt-3 text-xs text-white/45">Nesta versão MVP, as preferências ficam salvas neste navegador. Sincronização no perfil entrará em uma próxima versão.</p>
        </Card>

        <div className="grid gap-5">
          <Card>
            <h2 className="text-xl font-semibold">{dash.themeTitle}</h2>
            <p className="mt-2 text-sm text-white/55">Claro, escuro ou seguir o dispositivo. A preferência fica neste navegador.</p>
            <div className="mt-4">
              <ThemeToggle labels={themeLabels} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <Bell className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold">Notificações</h2>
            </div>
            <Field label="Preferência">
              <select className={`${inputClass} mt-4`} value={preferences.notifications} onChange={(event) => updatePreference("notifications", event.target.value)}>
                <option>Resumo semanal</option>
                <option>Apenas alertas importantes</option>
                <option>Desativadas</option>
              </select>
            </Field>
            <p className="mt-3 text-sm text-white/55">Envio de e-mails transacionais e lembretes ainda está em preparação.</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <FileText className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold">Templates</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              A seleção acima prepara o padrão de exportação. Novos templates premium por país entrarão após validação com usuários reais.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
