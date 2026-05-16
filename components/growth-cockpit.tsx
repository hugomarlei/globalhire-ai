"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  getGrowthCockpitSeed,
  getGrowthCockpitStrings,
  suggestGrowthDecision,
  statusLabel,
  type GrowthMetricKey,
  type GrowthQueueRow
} from "@/lib/i18n-growth-cockpit";
import { intlLocaleForUi } from "@/lib/i18n-history-ats";
import { trackEvent } from "@/lib/analytics";
import { Button, Card, Field, inputClass, textareaClass, cn } from "@/components/ui";

const LS_WEEK = "gh_admin_growth_v1_week";
const LS_METRICS = "gh_admin_growth_v1_metrics";
const LS_LEARNING = "gh_admin_growth_v1_learning";

const METRIC_KEYS: GrowthMetricKey[] = ["views", "retention", "saves", "shares", "signups", "uploadsAts"];

function platformToUtmSource(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("linkedin")) return "linkedin";
  if (p.includes("whatsapp")) return "whatsapp";
  if (p.includes("tiktok")) return "tiktok";
  if (p.includes("instagram")) return "instagram";
  return p.replace(/\s+/g, "_").slice(0, 40) || "organic";
}

function buildTrackedUrl(
  appUrl: string,
  path: string,
  utm: { utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string }
) {
  const base = appUrl.replace(/\/+$/, "");
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(pathname, `${base}/`);
  if (utm.utm_source.trim()) url.searchParams.set("utm_source", utm.utm_source.trim());
  if (utm.utm_medium.trim()) url.searchParams.set("utm_medium", utm.utm_medium.trim());
  if (utm.utm_campaign.trim()) url.searchParams.set("utm_campaign", utm.utm_campaign.trim());
  if (utm.utm_content.trim()) url.searchParams.set("utm_content", utm.utm_content.trim());
  return url.toString();
}

function rowFinalUrl(appUrl: string, row: GrowthQueueRow) {
  return buildTrackedUrl(appUrl, row.landingPath, {
    utm_source: platformToUtmSource(row.platform),
    utm_medium: "social",
    utm_campaign: row.utmCampaign,
    utm_content: `queue-${row.id}`
  });
}

function startOfWeekMonday(from = new Date()) {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const delta = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + delta);
  return d;
}

function addDays(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

function formatIcsDateOnly(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function formatIcsUtcStamp(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function foldIcsLine(line: string) {
  if (line.length <= 75) return line;
  const out: string[] = [];
  let i = 0;
  let first = true;
  while (i < line.length) {
    const take = first ? 75 : 74;
    out.push(first ? line.slice(i, i + take) : ` ${line.slice(i, i + take)}`);
    i += take;
    first = false;
  }
  return out.join("\r\n");
}

function buildWeeklyRoutineIcs(opts: {
  title: string;
  batchDescription: string;
  locale: Locale;
}) {
  const monday = startOfWeekMonday();
  const dtStamp = formatIcsUtcStamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GlobalHire//Growth Cockpit//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  for (let i = 0; i < 5; i += 1) {
    const start = addDays(monday, i);
    const end = addDays(start, 1);
    const weekday = new Intl.DateTimeFormat(intlLocaleForUi(opts.locale), { weekday: "long" }).format(start);
    const summary = escapeIcsText(`${opts.title} — ${weekday}`);
    const desc = escapeIcsText(opts.batchDescription);
    const uid = `growth-${formatIcsDateOnly(start)}-${i}@cockpit.globalhire.internal`;
    lines.push("BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${formatIcsDateOnly(start)}`);
    lines.push(`DTEND;VALUE=DATE:${formatIcsDateOnly(end)}`);
    lines.push(foldIcsLine(`SUMMARY:${summary}`));
    lines.push(foldIcsLine(`DESCRIPTION:${desc}`));
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadTextFile(filename: string, body: string, mime: string) {
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const defaultMetrics: Record<GrowthMetricKey, number> = {
  views: 0,
  retention: 0,
  saves: 0,
  shares: 0,
  signups: 0,
  uploadsAts: 0
};

export function GrowthCockpit({ locale, appUrl }: { locale: Locale; appUrl: string }) {
  const t = useMemo(() => getGrowthCockpitStrings(locale), [locale]);
  const seed = useMemo(() => getGrowthCockpitSeed(locale), [locale]);
  const firstRow = seed.queue[0];

  const [weekNotes, setWeekNotes] = useState("");
  const [learningLog, setLearningLog] = useState(() => getGrowthCockpitSeed(locale).learningStarters.join("\n"));
  const [metrics, setMetrics] = useState<Record<GrowthMetricKey, number>>(defaultMetrics);
  const [hydrated, setHydrated] = useState(false);

  const [utmPath, setUtmPath] = useState(firstRow?.landingPath ?? "/");
  const [utmSource, setUtmSource] = useState("linkedin");
  const [utmMedium, setUtmMedium] = useState("social");
  const [utmCampaign, setUtmCampaign] = useState(firstRow?.utmCampaign ?? "campaign");
  const [utmContent, setUtmContent] = useState("carousel-1");
  const [builtUrl, setBuiltUrl] = useState(() =>
    buildTrackedUrl(appUrl, firstRow?.landingPath ?? "/", {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: firstRow?.utmCampaign ?? "campaign",
      utm_content: "carousel-1"
    })
  );

  const [copyFlash, setCopyFlash] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("growth_cockpit_viewed", { locale });
  }, [locale]);

  useEffect(() => {
    const s = getGrowthCockpitSeed(locale);
    try {
      const w = localStorage.getItem(LS_WEEK);
      const m = localStorage.getItem(LS_METRICS);
      const l = localStorage.getItem(LS_LEARNING);
      if (w !== null) setWeekNotes(w);
      if (l !== null) setLearningLog(l);
      else setLearningLog(s.learningStarters.join("\n"));
      if (m) {
        const parsed = JSON.parse(m) as Partial<Record<GrowthMetricKey, number>>;
        setMetrics((prev) => {
          const next = { ...prev };
          for (const key of METRIC_KEYS) {
            const v = parsed[key];
            if (typeof v === "number" && Number.isFinite(v)) next[key] = v;
          }
          return next;
        });
      }
    } catch {
      setLearningLog(s.learningStarters.join("\n"));
    }
    setHydrated(true);
  }, [locale]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_WEEK, weekNotes);
    } catch {
      /* ignore */
    }
  }, [weekNotes, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_LEARNING, learningLog);
    } catch {
      /* ignore */
    }
  }, [learningLog, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_METRICS, JSON.stringify(metrics));
    } catch {
      /* ignore */
    }
  }, [metrics, hydrated]);

  const decision = useMemo(() => suggestGrowthDecision(metrics, t), [metrics, t]);

  const flashCopied = useCallback((key: string) => {
    setCopyFlash(key);
    window.setTimeout(() => setCopyFlash(null), 1600);
  }, []);

  const copyText = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text);
        flashCopied(key);
      } catch {
        /* ignore */
      }
    },
    [flashCopied]
  );

  const rebuildUrl = useCallback(() => {
    setBuiltUrl(
      buildTrackedUrl(appUrl, utmPath, {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent
      })
    );
  }, [appUrl, utmPath, utmSource, utmMedium, utmCampaign, utmContent]);

  const metricLabel = (key: GrowthMetricKey) => {
    if (key === "views") return t.metricViews;
    if (key === "retention") return t.metricRetention;
    if (key === "saves") return t.metricSaves;
    if (key === "shares") return t.metricShares;
    if (key === "signups") return t.metricSignups;
    return t.metricUploadsAts;
  };

  const decisionVerb = decision.key === "scale" ? t.decisionScale : decision.key === "iterate" ? t.decisionIterate : decision.key === "archive" ? t.decisionArchive : t.decisionKill;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {t.internalBadge}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">{t.pageTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.pageLead}</p>
          <p className="mt-2 text-xs text-muted-foreground">{t.saveLocalHint}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t.weekTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{seed.batchRecordingHint}</p>
          <ul className="mt-4 grid gap-3 text-sm">
            {seed.weeklyItems.map((item) => (
              <li key={item.title} className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Field label={t.weekNotesLabel}>
              <textarea
                className={textareaClass}
                rows={4}
                placeholder={t.weekNotesPlaceholder}
                value={weekNotes}
                onChange={(e) => setWeekNotes(e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t.metricsTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.metricsHint}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {METRIC_KEYS.map((key) => (
              <Field key={key} label={metricLabel(key)}>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className={inputClass}
                  value={Number.isFinite(metrics[key]) ? metrics[key] : 0}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setMetrics((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }));
                  }}
                />
              </Field>
            ))}
          </div>
          <h3 className="mt-8 text-base font-semibold text-foreground">{t.decisionTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.decisionHint}</p>
          <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.decisionRationale}</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{decisionVerb}</p>
            <p className="mt-2 text-sm text-muted-foreground">{decision.rationale}</p>
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <h2 className="text-lg font-semibold text-foreground">{t.queueTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.batchHint}</p>
        <table className="mt-4 w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2 pr-3">{t.thHook}</th>
              <th className="py-2 pr-3">{t.thCta}</th>
              <th className="py-2 pr-3">{t.thPlatform}</th>
              <th className="py-2 pr-3">{t.thCategory}</th>
              <th className="py-2 pr-3">{t.thLanding}</th>
              <th className="py-2 pr-3">{t.thStatus}</th>
              <th className="py-2 pr-3">{t.thUtm}</th>
              <th className="py-2 pr-3">{t.thFinalUrl}</th>
              <th className="py-2 pr-3">{t.thNotes}</th>
            </tr>
          </thead>
          <tbody>
            {seed.queue.map((row) => {
              const final = rowFinalUrl(appUrl, row);
              return (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="max-w-[200px] py-3 pr-3 text-foreground">{row.hook}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{row.cta}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{row.platform}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{row.category}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{row.landingPath}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{statusLabel(locale, row.status)}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{row.utmCampaign}</td>
                  <td className="py-3 pr-3">
                    <div className="flex max-w-[280px] flex-col gap-2">
                      <span className="break-all font-mono text-[11px] text-muted-foreground">{final}</span>
                      <button
                        type="button"
                        className={cn(
                          "focus-ring w-fit rounded-lg border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground transition hover:bg-muted"
                        )}
                        onClick={() => void copyText(final, `url-${row.id}`)}
                      >
                        {copyFlash === `url-${row.id}` ? t.copied : t.copyUrl}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">{row.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t.utmTitle}</h2>
          <div className="mt-4 grid gap-4">
            <Field label={t.utmBasePath}>
              <input className={inputClass} value={utmPath} onChange={(e) => setUtmPath(e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.utmSource}>
                <input className={inputClass} value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
              </Field>
              <Field label={t.utmMedium}>
                <input className={inputClass} value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
              </Field>
              <Field label={t.utmCampaign}>
                <input className={inputClass} value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} />
              </Field>
              <Field label={t.utmContent}>
                <input className={inputClass} value={utmContent} onChange={(e) => setUtmContent(e.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={rebuildUrl}>
                {t.buildUrl}
              </Button>
              <button
                type="button"
                className="focus-ring rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
                onClick={() => void copyText(builtUrl, "utm-built")}
              >
                {copyFlash === "utm-built" ? t.copied : t.copyUrl}
              </button>
            </div>
            <p className="break-all font-mono text-xs text-muted-foreground">{builtUrl}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t.calendarTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.calendarHint}</p>
          <Button
            type="button"
            className="mt-4"
            onClick={() => {
              const body = buildWeeklyRoutineIcs({
                title: t.pageTitle,
                batchDescription: `${t.batchHint}\n\n${seed.batchRecordingHint}`,
                locale
              });
              downloadTextFile("globalhire-growth-weekly.ics", body, "text/calendar;charset=utf-8");
            }}
          >
            {t.downloadIcs}
          </Button>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-foreground">{t.promptsTitle}</h2>
        <ul className="mt-4 grid gap-4">
          {seed.prompts.map((p) => (
            <li key={p.id} className="rounded-xl border border-border/80 bg-muted/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-foreground">{p.title}</p>
                <button
                  type="button"
                  className="focus-ring rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                  onClick={() => void copyText(p.body, `prompt-${p.id}`)}
                >
                  {copyFlash === `prompt-${p.id}` ? t.copied : t.copyPrompt}
                </button>
              </div>
              <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">{p.body}</pre>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-foreground">{t.learningTitle}</h2>
        <textarea
          className={cn(textareaClass, "mt-4 min-h-48")}
          placeholder={t.learningPlaceholder}
          value={learningLog}
          onChange={(e) => setLearningLog(e.target.value)}
        />
      </Card>
    </div>
  );
}
