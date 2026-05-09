import { Card } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-semibold">Configurações</h1>
      <Card>
        <h2 className="text-xl font-semibold">Preferências</h2>
        <p className="mt-2 text-sm text-white/60">
          Preferências avançadas de idioma, templates e notificações ficarão aqui nas próximas versões.
        </p>
      </Card>
    </div>
  );
}
