import Link from "next/link";
import type React from "react";
import { BarChart3, BriefcaseBusiness, CreditCard, ExternalLink, FileText, Gauge, Globe2, Languages, Linkedin, MailPlus, Target } from "lucide-react";
import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { allowedGenerationTypes, effectivePlanId, generationTypeLabels, hasAdminBypass, plans } from "@/lib/plans";
import type { GenerationType } from "@/lib/types";

const careerLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/jobs/", Icon: Linkedin },
  { label: "Indeed", href: "https://www.indeed.com/", Icon: BriefcaseBusiness },
  { label: "Glassdoor", href: "https://www.glassdoor.com/Job/", Icon: Gauge },
  { label: "InfoJobs", href: "https://www.infojobs.com.br/", Icon: Target },
  { label: "Gupy", href: "https://portal.gupy.io/", Icon: Globe2 }
];

const toolIcons: Record<GenerationType, React.ElementType> = {
  ats_resume: FileText,
  cover_letter: MailPlus,
  linkedin_summary: Linkedin,
  recruiter_message: BriefcaseBusiness,
  interview_prep: Gauge,
  translate_resume: Languages
};

function mostUsedType(items: Array<{ type: string }>) {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.type, (counts.get(item.type) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
}

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const isBypassAccount = hasAdminBypass(profile?.email || user.email);
  const planId = effectivePlanId(profile?.plan, profile?.email || user.email);
  const plan = plans[planId] || plans.free;
  const since = new Date();
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [{ count }, { data: generations }] = await Promise.all([
    supabase.from("generations").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since.toISOString()),
    supabase
      .from("generations")
      .select("id,type,language,target_country,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)
  ]);

  const items = generations || [];
  const used = count || 0;
  const usagePercent = plan.monthlyLimit >= 9999 ? 100 : Math.min(100, Math.round((used / plan.monthlyLimit) * 100));
  const topType = mostUsedType(items);
  const languages = Array.from(new Set(items.map((item) => item.language).filter(Boolean)));
  const countries = Array.from(new Set(items.map((item) => item.target_country).filter(Boolean)));
  const countsByType = (Object.keys(generationTypeLabels) as GenerationType[]).map((type) => ({
    type,
    label: generationTypeLabels[type],
    count: items.filter((item) => item.type === type).length
  }));
  const latest = items.slice(0, 5);
  const availableTools = allowedGenerationTypes(planId);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CreditCard className="text-brand-500" size={22} />
          <p className="mt-3 text-sm text-white/50">Plano atual</p>
          <p className="text-2xl font-semibold">{isBypassAccount ? "Elite teste" : plan.name}</p>
          <Link href="/assinatura#planos" className="mt-3 inline-flex text-sm font-semibold text-brand-500 hover:text-brand-400">Ver planos</Link>
        </Card>
        <Card>
          <Gauge className="text-mint" size={22} />
          <p className="mt-3 text-sm text-white/50">Uso mensal</p>
          <p className="text-2xl font-semibold">{used}/{plan.monthlyLimit >= 9999 ? "∞" : plan.monthlyLimit}</p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-brand-500" style={{ width: `${usagePercent}%` }} />
          </div>
        </Card>
      </div>

      {isBypassAccount ? (
        <Card className="border-brand-500/60">
          <p className="text-sm font-semibold text-brand-50">Bypass administrativo ativo</p>
          <p className="mt-2 text-sm text-white/65">Este e-mail pode testar recursos Elite antes da publicação.</p>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-center gap-2">
          <BarChart3 className="text-brand-500" size={22} />
          <h2 className="text-xl font-semibold">Inteligência de candidatura</h2>
        </div>
        {!items.length ? (
          <div className="mt-5 rounded-md border border-dashed border-white/15 bg-black/20 p-5 text-sm text-white/60">
            Gere seu primeiro documento para visualizar estatísticas de candidatura.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">Documentos gerados</p>
              <p className="mt-2 text-2xl font-semibold">{items.length}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">Tipo mais usado</p>
              <p className="mt-2 text-xl font-semibold">{topType ? generationTypeLabels[topType[0] as GenerationType] || topType[0] : "Sem dados"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">Último documento</p>
              <p className="mt-2 text-xl font-semibold">{latest[0] ? new Date(latest[0].created_at).toLocaleDateString("pt-BR") : "Sem dados"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">Idiomas usados</p>
              <p className="mt-2 text-sm font-semibold text-white/80">{languages.slice(0, 4).join(", ") || "Sem dados"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">Países-alvo</p>
              <p className="mt-2 text-sm font-semibold text-white/80">{countries.slice(0, 4).join(", ") || "Sem dados"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">ATS Score</p>
              <p className="mt-2 text-sm font-semibold text-white/80">Disponível nas análises feitas em ATS Score</p>
            </div>
          </div>
        )}
        {items.length ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {countsByType.filter((item) => item.count > 0).map((item) => (
              <div key={item.type} className="rounded-md border border-white/10 bg-white/5 p-3 text-sm">
                <span className="text-white/50">{item.label}</span>
                <strong className="ml-2 text-white">{item.count}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-xl font-semibold">Ferramentas do seu plano</h2>
          <div className="mt-4 grid gap-2">
            {availableTools.map((type) => {
              const Icon = toolIcons[type];
              return (
                <Link key={type} href={type === "ats_resume" ? "/gerador" : `/gerador?tipo=${type}`} className="flex items-center gap-3 rounded-md border border-white/10 p-3 text-sm text-white/75 hover:bg-white/8">
                  <Icon className="text-brand-500" size={17} />
                  {generationTypeLabels[type]}
                </Link>
              );
            })}
            {planId === "pro" || planId === "elite" ? (
              <Link href="/ats-score" className="flex items-center gap-3 rounded-md border border-white/10 p-3 text-sm text-white/75 hover:bg-white/8">
                <Gauge className="text-brand-500" size={17} />
                ATS Score e palavras-chave
              </Link>
            ) : (
              <Link href="/assinatura#planos" className="rounded-md border border-brand-500/30 bg-brand-500/10 p-3 text-sm text-brand-50 hover:bg-brand-500/15">
                Liberar ATS Score no plano Pro
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Plataformas de carreira</h2>
          <p className="mt-2 text-sm text-white/60">Publique ou acompanhe suas candidaturas nas principais plataformas.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {careerLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-white/75 hover:bg-white/8">
                <span className="inline-flex items-center gap-2"><Icon className="text-brand-500" size={17} /> {label}</span>
                <ExternalLink size={15} />
              </a>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">Últimas atividades</h2>
        <div className="mt-4 grid gap-2">
          {latest.map((item) => (
            <Link key={item.id} href="/historico" className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-white/70 hover:bg-white/8">
              <span>{generationTypeLabels[item.type as GenerationType] || item.type} · {item.language} · {item.target_country}</span>
              <span className="text-white/40">{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
            </Link>
          ))}
          {!latest.length ? <p className="text-sm text-white/50">Gere seu primeiro documento para preencher esta área.</p> : null}
        </div>
      </Card>
    </div>
  );
}
