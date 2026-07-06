import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth.helpers";
import { supabaseAdmin } from "@/lib/db/supabase-admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Automação — Logs", robots: { index: false } };

type LogRow = {
  id: string;
  prompt_used: string;
  model_version: string;
  generation_date: string;
  raw_response: { type?: string; topic?: string; service?: string; city?: string } | null;
  posts: { title: string; status: string; slug: string } | { title: string; status: string; slug: string }[] | null;
};

const TYPE_LABEL: Record<string, string> = {
  auto_news: "Notícia (auto)",
  auto_sales: "Vendas (auto)",
  manual_news: "Notícia (manual)",
  manual_sales: "Vendas (manual)",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AutomationLogsPage() {
  await requireAdmin();

  const { data } = await supabaseAdmin
    .from("ai_automation_logs")
    .select("id,prompt_used,model_version,generation_date,raw_response,posts(title,status,slug)")
    .order("generation_date", { ascending: false })
    .limit(100);

  const logs = (data ?? []) as unknown as LogRow[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Logs da automação</h1>
        <p className="text-sm text-ink-muted">
          Últimas {logs.length} gerações de IA — auditoria de conteúdo, modelo e fonte.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-ink-muted">
          Nenhuma geração registrada ainda.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Quando</th>
                <th className="px-5 py-3 font-semibold">Tipo</th>
                <th className="px-5 py-3 font-semibold">Post</th>
                <th className="px-5 py-3 font-semibold">Modelo</th>
                <th className="px-5 py-3 font-semibold">Fonte / prompt</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => {
                const post = Array.isArray(l.posts) ? l.posts[0] : l.posts;
                const type = l.raw_response?.type ?? "";
                return (
                  <tr key={l.id} className="border-b border-black/5 align-top last:border-0">
                    <td className="whitespace-nowrap px-5 py-3 text-ink-muted">
                      {fmt(l.generation_date)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-ink-soft">
                        {TYPE_LABEL[type] ?? type ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink">{post?.title ?? "(post removido)"}</td>
                    <td className="px-5 py-3 text-ink-muted">{l.model_version}</td>
                    <td className="max-w-xs truncate px-5 py-3 text-ink-muted" title={l.prompt_used}>
                      {l.prompt_used}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
