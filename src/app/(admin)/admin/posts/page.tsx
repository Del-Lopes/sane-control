import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth.helpers";
import { supabaseAdmin } from "@/lib/db/supabase-admin";
import { formatDate } from "@/lib/posts";
import ManualGeneratePanel from "@/components/admin/ManualGeneratePanel";
import PostActions from "@/components/admin/PostActions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Posts", robots: { index: false } };

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  categories: { name: string } | { name: string }[] | null;
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  scheduled: "Agendado",
  ai_generating: "Gerando",
  review_required: "Revisão",
};

export default async function AdminPostsPage() {
  await requireAdmin();

  // Admin client (service-role): enxerga todos os status, não só published.
  const { data } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,status,published_at,created_at,categories(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const posts = (data ?? []) as unknown as Row[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Posts</h1>
          <p className="text-sm text-ink-muted">{posts.length} post(s) no total.</p>
        </div>
      </div>

      <ManualGeneratePanel />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-ink-muted">
          Nenhum post ainda. A automação criará os posts automaticamente quando ativada.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Título</th>
                <th className="px-5 py-3 font-semibold">Categoria</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Data</th>
                <th className="px-5 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
                return (
                  <tr key={p.id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                    <td className="px-5 py-3 text-ink-muted">{cat?.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-ink-soft">
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {formatDate(p.published_at ?? p.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <PostActions postId={p.id} status={p.status} />
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
