"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Gauge, Globe2, Mail, ShieldCheck, Sparkles, Target, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicNav } from "@/components/nav";
import { Button, Card } from "@/components/ui";
import { paidPlans, plans } from "@/lib/plans";

const features = [
  "Currículo ATS adaptado à vaga",
  "Carta de apresentação personalizada",
  "Resumo LinkedIn com posicionamento profissional",
  "Mensagem para recrutador",
  "Simulação de entrevista",
  "Tradução e adaptação internacional"
];

const faqs = [
  [
    "A GlobalHire AI garante entrevista ou emprego?",
    "Não. A plataforma melhora a clareza, aderência e estrutura dos seus materiais, mas nenhuma ferramenta pode garantir entrevista, aprovação ou contratação."
  ],
  [
    "Meus dados profissionais são usados pela IA?",
    "Sim, apenas para processar a solicitação que você faz, como otimizar currículo ou gerar carta. Evite enviar dados sensíveis desnecessários."
  ],
  [
    "Posso usar para vagas fora do Brasil?",
    "Sim. Você pode adaptar idioma, país-alvo e estilo do documento para candidaturas internacionais."
  ],
  [
    "Qual plano devo começar?",
    "O Free permite uma degustação premium. O Starter é bom para uso pontual, Pro para candidaturas recorrentes e Elite para otimização máxima."
  ]
];

function Footer() {
  function openCookiePreferences() {
    window.dispatchEvent(new Event("globalhire:open-cookie-preferences"));
  }

  return (
    <footer className="border-t border-white/10 px-4 py-8 text-sm text-white/55 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p>© 2026 GlobalHire AI. Todos os direitos reservados.</p>
          <a href="mailto:contato@globalhireai.com.br" className="mt-1 inline-flex items-center gap-2 hover:text-white">
            <Mail size={15} />
            contato@globalhireai.com.br
          </a>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          <Link href="/termos" className="hover:text-white">Termos</Link>
          <button type="button" onClick={openCookiePreferences} className="hover:text-white">
            Preferências de cookies
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [showLogoutBanner, setShowLogoutBanner] = useState(false);

  useEffect(() => {
    setShowLogoutBanner(new URLSearchParams(window.location.search).get("logout") === "success");
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_0%,rgba(50,232,117,0.20),transparent_34%),linear-gradient(180deg,#050806_0%,#07120E_55%,#0B1F14_100%)] text-white">
      <PublicNav />
      {showLogoutBanner ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 rounded-lg border border-brand-500/25 bg-brand-500/10 p-4 text-sm text-white/78 sm:flex-row sm:items-center sm:justify-between">
            <span>Você saiu da sua conta. Volte quando quiser para continuar suas candidaturas.</span>
            <div className="flex flex-wrap gap-2">
              <Button href="/cadastro" className="h-9 px-3">Criar conta</Button>
              <a
                href="https://www.linkedin.com/shareArticle?mini=true&url=https://globalhireai.com.br"
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/8 px-3 text-sm font-semibold text-white hover:bg-white/12"
              >
                Compartilhar
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-white/10 bg-white/7 px-3 py-1 text-sm text-brand-50">
            IA para candidaturas internacionais, ATS e posicionamento profissional
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
            Pare de enviar currículos ignorados.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            Crie candidaturas internacionais otimizadas para ATS, com currículo, carta de apresentação e LinkedIn
            adaptados à vaga em minutos.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/cadastro">
              Criar meu currículo grátis <ArrowRight size={18} />
            </Button>
            <Button href="#precos" className="border border-white/12 bg-white/8 text-white hover:bg-white/12">
              Ver planos
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/50">Sem promessas irreais: você recebe documentos melhores, não garantia de contratação.</p>
        </div>

        <Card className="p-4">
          <div className="rounded-lg border border-white/10 bg-ink p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">ATS Score simulado</p>
                <p className="mt-1 text-xl font-semibold">Antes e depois da otimização</p>
              </div>
              <Gauge className="text-brand-500" size={28} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/55">Currículo genérico</p>
                <p className="mt-3 text-4xl font-semibold text-white/70">42%</p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[42%] rounded-full bg-white/35" />
                </div>
              </div>
              <div className="rounded-md border border-brand-500/30 bg-brand-500/10 p-4">
                <p className="text-sm text-brand-50">Versão otimizada</p>
                <p className="mt-3 text-4xl font-semibold text-brand-500">91%</p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[91%] rounded-full bg-brand-500" />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-white p-4 text-ink">
              <p className="text-xs font-semibold uppercase text-brand-700">Demonstração antes/depois</p>
              <p className="mt-2 text-sm leading-6">
                Antes: “Responsável por relatórios e reuniões.” Depois: “Conduziu análises de performance comercial,
                priorizou indicadores de receita e apoiou decisões executivas em ambiente internacional.”
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
          {[
            ["O problema", "Muitos currículos são rejeitados antes de chegar ao recrutador porque não conversam com a vaga nem com filtros ATS."],
            ["A solução", "A IA compara seu currículo com a descrição da vaga e reescreve seus materiais com linguagem mais clara, específica e alinhada."],
            ["O limite honesto", "A ferramenta aumenta qualidade e aderência, mas a decisão final continua sendo humana e depende do processo seletivo."]
          ].map(([title, text]) => (
            <Card key={title}>
              <ShieldCheck className="text-brand-500" size={24} />
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">Como funciona</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [FileText, "Cole ou envie seu currículo", "Use PDF, DOCX ou texto manual. Você mantém controle sobre o que envia."],
            [Target, "Cole a descrição da vaga", "A IA identifica palavras-chave, responsabilidades, senioridade e contexto da oportunidade."],
            [Wand2, "Receba uma versão otimizada", "Gere currículo, carta, LinkedIn e materiais profissionais com foco em ATS e clareza."]
          ].map(([Icon, title, text]) => {
            const StepIcon = Icon as typeof FileText;
            return (
              <Card key={title as string}>
                <span className="grid size-11 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-500">
                  <StepIcon size={20} />
                </span>
                <p className="mt-4 text-lg font-semibold">{title as string}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">{text as string}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold">Funcionalidades</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Tudo para transformar uma candidatura genérica em um pacote profissional consistente.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="shrink-0 text-mint" size={18} />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold">Para quem é</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Profissionais buscando vagas remotas ou internacionais.",
              "Candidatos multilíngues que precisam adaptar currículo e LinkedIn.",
              "Pessoas que querem entender melhor ATS, palavras-chave e aderência à vaga."
            ].map((text) => (
              <Card key={text}>
                <Globe2 className="text-brand-500" size={24} />
                <p className="mt-4 text-sm leading-6 text-white/72">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">Planos claros para começar</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Comece com uma geração premium gratuita. Depois escolha o plano que combina com seu volume de candidaturas.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {[plans.free, ...paidPlans].map((plan) => (
            <Card key={plan.id} className={`flex h-full flex-col ${plan.id === "pro" ? "border-brand-500/60" : ""}`}>
              {plan.id === "pro" ? <p className="mb-3 text-xs font-semibold uppercase text-brand-500">Recomendado</p> : null}
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="shrink-0 text-mint" size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button href="/cadastro" className="mt-auto w-full">
                Começar
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-semibold">FAQ</h2>
        <div className="mt-8 space-y-3">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <Sparkles className="mx-auto text-brand-500" size={30} />
        <h2 className="mt-4 text-4xl font-semibold">Sua próxima candidatura pode começar com um documento melhor.</h2>
        <Button href="/cadastro" className="mt-8">
          Criar meu currículo grátis
        </Button>
      </section>

      <Footer />
    </main>
  );
}
