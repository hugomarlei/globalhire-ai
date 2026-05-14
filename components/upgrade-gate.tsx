"use client";

import { LockKeyhole, Sparkles } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import { upgradeGateChromeCopy } from "@/lib/i18n-account-subscription";

export function UpgradeGate({
  title,
  description,
  requiredPlan
}: {
  title: string;
  description: string;
  requiredPlan: string;
}) {
  const { locale } = useLanguage();
  const g = upgradeGateChromeCopy[locale];
  return (
    <Card className="border-brand-500/35">
      <div className="grid gap-4 py-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand-500/15 text-brand-500">
          <LockKeyhole size={26} />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-500">{requiredPlan}</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/assinatura#planos" className="bg-primary text-primary-foreground hover:brightness-105">
            <Sparkles size={17} />
            {g.viewPlans}
          </Button>
          <Button href="/dashboard" className="border border-border bg-muted text-foreground shadow-none hover:bg-muted/80 dark:shadow-none">
            {g.backDashboard}
          </Button>
        </div>
      </div>
    </Card>
  );
}
