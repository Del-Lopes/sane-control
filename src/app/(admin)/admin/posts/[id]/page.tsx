import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth.helpers";
import { supabaseAdmin } from "@/lib/db/supabase-admin";
import { formatDate } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import PostActions from "@/components/admin/PostActions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Revisar post", robots: { index: false } };

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  scheduled: "Agendado",
  ai_generating: "Gerando",
  review_required: "Revisão",
};

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  image_prompt: string | null;
  source_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  categories: { name: string } | { name: string }[] | null;
};

export default async function ReviewPostPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const { data } = await supabaseAdmin
    .from("posts")
    .select(
      "id,title,slug,status,content,excerpt,cover_image,image_prompt,source_url,seo_title,seo_description,published_at,created_at,categories(name)"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();
  const post = data as unknown as Row;
  const cat = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const isAiCover = Boolean(post.image_prompt) && Boolean(post.cover_image);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/posts" className="text-sm text-brand hover:underline">
          ← Voltar para Posts
        </Link>
      </div>

      {/* Barra de revisão */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-ink-soft">
            {STATUS_LABEL[post.status] ?? post.status}
          </span>
          <span className="text-sm text-ink-muted">{cat?.name ?? "—"}</span>
        </div>
        <PostActions postId={post.id} status={post.status} />
      </div>

      {/* Prévia do post como sairá no blog */}
      <article className="rounded-2xl border border-black/5 bg-white p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {cat?.name}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-ink">{post.title}</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Por Redação Sane Control · {formatDate(post.published_at ?? post.created_at)}
        </p>

        {post.excerpt && (
          <p className="mt-4 border-l-4 border-brand/30 pl-4 text-lg italic text-ink-soft">
            {post.excerpt}
          </p>
        )}

        {post.cover_image && (
          <figure className="mt-6 overflow-hidden rounded-2xl">
            <Image
              src={post.cover_image}
              alt={post.title}
              width={1200}
              height={630}
              className="h-auto w-full object-cover"
            />
            {isAiCover && (
              <figcaption className="mt-2 text-center text-xs text-ink-muted">
                Imagem conceitual gerada por IA
              </figcaption>
            )}
          </figure>
        )}

        <div className="mt-8">
          <PostContent html={post.content} />
        </div>

        {post.source_url && (
          <p className="mt-8 text-sm text-ink-muted">
            Fonte original:{" "}
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand underline"
            >
              {post.source_url}
            </a>
          </p>
        )}
      </article>

      {/* SEO (metadados) para conferência */}
      <div className="mt-6 rounded-2xl border border-black/5 bg-neutral-50 p-5 text-sm">
        <p className="mb-2 font-semibold text-ink">SEO / metadados</p>
        <p className="text-ink-muted">
          <strong>Título SEO:</strong> {post.seo_title ?? "—"}
        </p>
        <p className="text-ink-muted">
          <strong>Descrição:</strong> {post.seo_description ?? "—"}
        </p>
        <p className="text-ink-muted">
          <strong>Slug:</strong> /blog/{post.slug}
        </p>
      </div>
    </div>
  );
}
