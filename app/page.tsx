"use client";

import { ArrowRight, CheckCircle2, ClipboardPaste, FileCheck2, Globe2, Instagram, Languages, Linkedin, Music2, ShieldCheck, Sparkles, Target, Zap, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { PublicNav } from "@/components/nav";
import { Button, Card } from "@/components/ui";
import { landingCopy, type Locale } from "@/lib/i18n";
import { paidPlans } from "@/lib/plans";

const stepIcons: LucideIcon[] = [ClipboardPaste, Target, Languages, FileCheck2];
const featureIcons: LucideIcon[] = [Zap, Sparkles, ShieldCheck];

const socialCopy: Record<Locale, {
  testimonialsTitle: string;
  testimonials: Array<{ quote: string; name: string; role: string }>;
  platformTitle: string;
  platformText: string;
  socialTitle: string;
}> = {
  "pt-BR": {
    testimonialsTitle: "Depois de usar a GlobalHire AI",
    testimonials: [
      { quote: "Meu currículo finalmente parecia escrito para a vaga, não só traduzido.", name: "Mariana C.", role: "Product Manager" },
      { quote: "As melhorias aplicadas mostraram exatamente por que a versão nova estava mais forte.", name: "Rafael M.", role: "Software Engineer" },
      { quote: "Usei para LinkedIn, carta e currículo em inglês. Economizou horas.", name: "Camila R.", role: "Marketing Lead" }
    ],
    platformTitle: "Otimizada para candidaturas em plataformas líderes",
    platformText: "A GlobalHire AI te coloca na liderança dos processos seletivos em plataformas como LinkedIn, Indeed, Gupy e Glassdoor.",
    socialTitle: "Acompanhe a GlobalHire AI"
  },
  "pt-PT": {
    testimonialsTitle: "Depois de usar a GlobalHire AI",
    testimonials: [
      { quote: "O meu currículo passou a parecer feito para a vaga, não apenas traduzido.", name: "Mariana C.", role: "Product Manager" },
      { quote: "As melhorias aplicadas mostraram claramente porque a nova versão ficou mais forte.", name: "Rafael M.", role: "Software Engineer" },
      { quote: "Usei para LinkedIn, carta e currículo em inglês. Poupei horas.", name: "Camila R.", role: "Marketing Lead" }
    ],
    platformTitle: "Otimizada para candidaturas em plataformas líderes",
    platformText: "A GlobalHire AI coloca-o na liderança dos processos seletivos em plataformas como LinkedIn, Indeed, Gupy e Glassdoor.",
    socialTitle: "Acompanhe a GlobalHire AI"
  },
  en: {
    testimonialsTitle: "After using GlobalHire AI",
    testimonials: [
      { quote: "My resume finally sounded tailored to the role, not just translated.", name: "Mariana C.", role: "Product Manager" },
      { quote: "The applied improvements showed exactly why the new version was stronger.", name: "Rafael M.", role: "Software Engineer" },
      { quote: "I used it for LinkedIn, cover letter and English resume. It saved hours.", name: "Camila R.", role: "Marketing Lead" }
    ],
    platformTitle: "Optimized for applications on leading platforms",
    platformText: "GlobalHire AI positions you at the front of selection processes on platforms such as LinkedIn, Indeed, Gupy and Glassdoor.",
    socialTitle: "Follow GlobalHire AI"
  },
  es: {
    testimonialsTitle: "Después de usar GlobalHire AI",
    testimonials: [
      { quote: "Mi currículum por fin parecía adaptado a la vacante, no solo traducido.", name: "Mariana C.", role: "Product Manager" },
      { quote: "Las mejoras aplicadas mostraron exactamente por qué la nueva versión era más fuerte.", name: "Rafael M.", role: "Software Engineer" },
      { quote: "Lo usé para LinkedIn, carta y currículum en inglés. Me ahorró horas.", name: "Camila R.", role: "Marketing Lead" }
    ],
    platformTitle: "Optimizada para postulaciones en plataformas líderes",
    platformText: "GlobalHire AI te posiciona al frente de los procesos de selección en plataformas como LinkedIn, Indeed, Gupy y Glassdoor.",
    socialTitle: "Sigue a GlobalHire AI"
  },
  fr: {
    testimonialsTitle: "Après avoir utilisé GlobalHire AI",
    testimonials: [
      { quote: "Mon CV semblait enfin adapté au poste, pas seulement traduit.", name: "Mariana C.", role: "Product Manager" },
      { quote: "Les améliorations appliquées montraient clairement pourquoi la nouvelle version était plus forte.", name: "Rafael M.", role: "Software Engineer" },
      { quote: "Je l'ai utilisé pour LinkedIn, la lettre et le CV en anglais. J'ai gagné des heures.", name: "Camila R.", role: "Marketing Lead" }
    ],
    platformTitle: "Optimisée pour les candidatures sur les plateformes leaders",
    platformText: "GlobalHire AI vous place en tête des processus de sélection sur des plateformes comme LinkedIn, Indeed, Gupy et Glassdoor.",
    socialTitle: "Suivez GlobalHire AI"
  },
  de: {
    testimonialsTitle: "Nach der Nutzung von GlobalHire AI",
    testimonials: [
      { quote: "Mein Lebenslauf klang endlich auf die Rolle zugeschnitten, nicht nur übersetzt.", name: "Mariana C.", role: "Product Manager" },
      { quote: "Die umgesetzten Verbesserungen zeigten genau, warum die neue Version stärker war.", name: "Rafael M.", role: "Software Engineer" },
      { quote: "Ich habe es für LinkedIn, Anschreiben und englischen Lebenslauf genutzt. Es hat Stunden gespart.", name: "Camila R.", role: "Marketing Lead" }
    ],
    platformTitle: "Optimiert für Bewerbungen auf führenden Plattformen",
    platformText: "GlobalHire AI bringt Sie in Auswahlprozessen auf Plattformen wie LinkedIn, Indeed, Gupy und Glassdoor nach vorn.",
    socialTitle: "Folgen Sie GlobalHire AI"
  }
};

export default function Home() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  const social = socialCopy[locale];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_0%,rgba(50,232,117,0.20),transparent_34%),linear-gradient(180deg,#050806_0%,#07120E_55%,#0B1F14_100%)]">
      <PublicNav />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-white/10 bg-white/7 px-3 py-1 text-sm text-brand-50">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
            {copy.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            {copy.subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/cadastro" className="bg-brand-500 text-white hover:bg-brand-600">
              {copy.primaryCta} <ArrowRight size={18} />
            </Button>
            <Button href="#precos" className="border border-white/12 bg-white/8 text-white hover:bg-white/12">
              {copy.secondaryCta}
            </Button>
          </div>
        </div>
        <Card className="p-4">
          <div className="rounded-lg border border-white/10 bg-ink p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-white/50">ATS Score</span>
              <span className="rounded-md bg-mint/15 px-2 py-1 text-sm font-semibold text-mint">92%</span>
            </div>
            <div className="space-y-3">
              {copy.previewItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white/6 p-3">
                  <CheckCircle2 className="text-mint" size={18} />
                  <span className="text-sm text-white/82">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md bg-white p-4 text-ink">
              <p className="text-xs font-semibold uppercase text-brand-600">{copy.previewLabel}</p>
              <p className="mt-2 text-sm leading-6">
                {copy.previewText}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {copy.featureCards.map(({ title, text }, index) => {
              const Icon = featureIcons[index] || Sparkles;
              return (
              <Card key={title}>
                <Icon className="text-brand-500" size={24} />
                <h2 className="mt-4 text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{copy.howItWorks}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {copy.steps.map(({ title, text }, index) => {
            const Icon = stepIcons[index] || FileCheck2;
            return (
            <Card key={title} className="relative overflow-hidden">
              {index < copy.steps.length - 1 ? <div className="absolute right-4 top-8 hidden h-px w-10 bg-brand-500/40 md:block" /> : null}
              <span className="grid size-10 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-500">
                <Icon size={18} />
              </span>
              <p className="mt-4 text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
            </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{copy.benefitsTitle}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {copy.benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 p-4">
              <Globe2 className="text-mint" size={18} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="precos" className="border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold">{copy.pricingTitle}</h2>
          <div className="mt-6 grid gap-4 rounded-lg border border-brand-500/30 bg-black/20 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-lg font-semibold">{copy.scoreTitle}</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {copy.scoreText}
              </p>
            </div>
            <div className="min-w-[240px] rounded-md border border-white/10 bg-ink p-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{copy.freePlan}</span>
                <span>64%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[64%] rounded-full bg-white/40" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>{copy.paidPlan}</span>
                <span className="font-semibold text-brand-500">92%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[92%] rounded-full bg-brand-500" />
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {paidPlans.map((plan) => (
              <Card key={plan.id} className={`flex h-full flex-col ${plan.id === "pro" ? "border-brand-500/60" : ""}`}>
                <div>
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
                  <ul className="mt-5 space-y-3 text-sm text-white/72">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="shrink-0 text-mint" size={17} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button href="/cadastro" className="mt-auto w-full bg-brand-500 text-white hover:bg-brand-600">
                  {copy.startNow}
                </Button>
              </Card>
            ))}
          </div>
          <div className="mt-10 grid gap-8 rounded-lg border border-white/10 bg-ink/70 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold">{social.platformTitle}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">{social.platformText}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {["LinkedIn", "Indeed", "Gupy", "Glassdoor"].map((platform) => (
                  <span key={platform} className="rounded-md border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-sm text-brand-50">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white/70">{social.socialTitle}</p>
              <div className="flex gap-3">
                <a aria-label="LinkedIn" href="https://www.linkedin.com" className="grid size-11 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                  <Linkedin size={19} />
                </a>
                <a aria-label="Instagram" href="https://www.instagram.com" className="grid size-11 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                  <Instagram size={19} />
                </a>
                <a aria-label="TikTok" href="https://www.tiktok.com" className="grid size-11 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                  <Music2 size={19} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{copy.faqTitle}</h2>
        <div className="mt-8 space-y-3">
          {copy.faqs.map(([q, a]) => (
            <Card key={q}>
              <h3 className="font-semibold">{q}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-semibold">{social.testimonialsTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {social.testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <p className="text-sm leading-6 text-white/76">"{testimonial.quote}"</p>
              <p className="mt-5 font-semibold">{testimonial.name}</p>
              <p className="text-sm text-white/50">{testimonial.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <h2 className="text-4xl font-semibold">{copy.finalCtaTitle}</h2>
        <Button href="/cadastro" className="mt-8 bg-brand-500 text-white hover:bg-brand-600">
          {copy.primaryCta}
        </Button>
      </section>
    </main>
  );
}
