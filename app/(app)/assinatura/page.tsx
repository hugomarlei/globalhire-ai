import { UpgradePlans } from "@/components/upgrade-plans";

export default function SubscriptionPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Assinatura</h1>
      <p className="mt-2 text-sm text-white/60">Escolha o plano ideal e gerencie seu acesso premium.</p>
      <div className="mt-6">
        <UpgradePlans />
      </div>
    </div>
  );
}
