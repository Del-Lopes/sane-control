import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth.helpers";
import { getAutomationSettings } from "@/server/automation.actions";
import { AutomationSettingsForm } from "@/components/admin/AutomationSettingsForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Automação — Configurações",
  robots: { index: false },
};

export default async function AutomationSettingsPage() {
  // Só admin (não editor) configura a automação.
  await requireAdmin(["admin"]);

  const settings = await getAutomationSettings();
  if (!settings) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-ink-muted">
        Tabela <code>automation_settings</code> não encontrada — rode as migrations da Fase 2.
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Automação do blog</h1>
        <p className="text-sm text-ink-muted">
          Controle a geração automática de posts por IA. Comece com metas conservadoras (1–2/dia).
        </p>
      </div>
      <AutomationSettingsForm settings={settings} />
    </div>
  );
}
