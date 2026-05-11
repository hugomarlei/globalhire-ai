"use client";

import Link from "next/link";
import { AlertTriangle, BarChart3, Copy, CreditCard, Gift, KeyRound, Loader2, LogOut, Settings, ShieldCheck, Trash2, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { getAppUrl } from "@/lib/app-url";

type AccountTab = "account" | "subscription" | "referrals";

function formatDate(value?: string | null) {
  if (!value) return "Ainda não disponível";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export function AccountPanel({
  email,
  planName,
  monthlyLimit,
  subscriptionStatus,
  currentPeriodEnd,
  initialTab = "account"
}: {
  email: string;
  planName: string;
  monthlyLimit: string;
  subscriptionStatus: string;
  currentPeriodEnd?: string | null;
  initialTab?: AccountTab;
}) {
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [error, setError] = useState("");
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const referralLink = useMemo(() => {
    return `${getAppUrl()}/cadastro?ref=${encodeURIComponent(email)}`;
  }, [email]);

  async function openPortal() {
    setLoadingPortal(true);
    setError("");
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await response.json();
    setLoadingPortal(false);

    if (!response.ok) {
      setError(data.error || "Não foi possível abrir o portal de assinatura.");
      return;
    }

    window.location.href = data.url;
  }

  async function copyReferral() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    window.setTimeout(() => setCopiedReferral(false), 1800);
  }

  async function deleteAccount() {
    setDeletingAccount(true);
    setError("");
    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: deleteConfirmation })
    });
    const data = await response.json().catch(() => ({}));
    setDeletingAccount(false);

    if (!response.ok) {
      setError(data.error || "Não foi possível excluir a conta.");
      return;
    }

    window.location.href = "/";
  }

  const tabs: Array<{ id: AccountTab; label: string; Icon: React.ElementType }> = [
    { id: "account", label: "Minha conta", Icon: UserCircle },
    { id: "subscription", label: "Assinatura", Icon: CreditCard },
    { id: "referrals", label: "Indicações", Icon: Gift }
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-brand-500 text-lg font-bold text-ink">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Conta</h1>
            <p className="mt-1 text-sm text-white/55">{email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`focus-ring inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                activeTab === id ? "bg-brand-500 text-ink" : "border border-white/10 bg-white/7 text-white/75 hover:bg-white/12"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
      {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}

      {activeTab === "account" ? (
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <div className="flex items-center gap-2">
              <UserCircle className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold">Dados do usuário</h2>
            </div>
            <div className="mt-5 grid gap-4">
              <Field label="E-mail">
                <input className={inputClass} value={email} readOnly />
              </Field>
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Plano atual</p>
                <p className="mt-1 text-2xl font-semibold">{planName}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <KeyRound className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold">Segurança e preferências</h2>
            </div>
            <div className="mt-5 grid gap-3">
              <Link href="/recuperar-senha" className="focus-ring rounded-md border border-white/10 bg-white/7 p-4 text-sm text-white/75 hover:bg-white/12">
                Alterar senha usando link seguro por e-mail
              </Link>
              <Link href="/configuracoes" className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/7 p-4 text-sm text-white/75 hover:bg-white/12">
                <Settings size={17} />
                Preferências de idioma, país e geração
              </Link>
              <form action="/api/auth/signout" method="post">
                <Button type="submit" className="w-full border border-white/10 bg-white/8 text-white hover:bg-white/12">
                  <LogOut size={17} />
                  Sair da conta
                </Button>
              </form>
            </div>
          </Card>
          <Card className="border-coral/35 lg:col-span-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-coral" size={22} />
              <h2 className="text-xl font-semibold">Excluir conta e dados</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              Esta ação é irreversível. Ela remove seus documentos, histórico, assinatura registrada no app e tenta cancelar a assinatura Stripe antes de excluir seu usuário Auth.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label='Digite "EXCLUIR MINHA CONTA" para confirmar'>
                <input className={inputClass} value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} />
              </Field>
              <Button
                onClick={deleteAccount}
                disabled={deletingAccount || deleteConfirmation !== "EXCLUIR MINHA CONTA"}
                className="border border-coral/40 bg-coral/15 text-coral hover:bg-coral/20"
              >
                {deletingAccount ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
                Excluir conta
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === "subscription" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-brand-500/35">
            <div className="flex items-center gap-2">
              <CreditCard className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold">Assinatura</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Plano atual</p>
                <p className="text-xl font-semibold">{planName}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Limite mensal</p>
                <p className="text-xl font-semibold">{monthlyLimit}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Status</p>
                <p className="text-xl font-semibold">{subscriptionStatus}</p>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/50">Próxima cobrança ou fim do período</p>
              <p className="mt-1 font-semibold">{formatDate(currentPeriodEnd)}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/assinatura#planos" className="bg-brand-500 text-ink hover:bg-brand-600">Ver planos</Button>
              <Button onClick={openPortal} disabled={loadingPortal} className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
                {loadingPortal ? <Loader2 className="animate-spin" size={17} /> : <CreditCard size={17} />}
                {loadingPortal ? "Abrindo..." : "Gerenciar assinatura"}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-brand-500" size={22} />
              <h2 className="text-xl font-semibold">Histórico de pagamentos</h2>
            </div>
            <div className="mt-5 rounded-md border border-dashed border-white/15 bg-black/20 p-5 text-sm leading-6 text-white/60">
              Você pode gerenciar sua assinatura, forma de pagamento e recibos com segurança pelo portal de pagamentos.
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === "referrals" ? (
        <Card>
          <div className="flex items-center gap-2">
            <Gift className="text-brand-500" size={22} />
            <h2 className="text-xl font-semibold">Indicações</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Compartilhe a GlobalHire AI com profissionais que estão aplicando para vagas internacionais. Esta área já está pronta para um programa de indicação futuro.
          </p>
          <div className="mt-5 flex flex-col gap-3 rounded-md border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center">
            <input className={inputClass} value={referralLink || "Carregando link..."} readOnly />
            <Button onClick={copyReferral} className="shrink-0 bg-brand-500 text-ink hover:bg-brand-600">
              <Copy size={17} />
              {copiedReferral ? "Copiado" : "Copiar link"}
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Convites enviados", "Contas criadas", "Créditos futuros"].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/50">{item}</p>
                <p className="mt-1 text-2xl font-semibold">0</p>
              </div>
            ))}
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/50">
            <ShieldCheck size={16} />
            Nenhum desconto automático é aplicado ainda. É um placeholder operacional seguro para MVP.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
