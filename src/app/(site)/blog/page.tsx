import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, formatDate } from "@/lib/posts";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

// Conteúdo muda sem novo deploy (posts nascem pelo cron) → renderização dinâmica.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dicas de prevenção, saúde e controle de pragas para o seu dia a dia.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Dicas e conteúdos sobre controle de pragas"
        subtitle="Informações úteis para prevenir infestações e manter o seu ambiente saudável."
      />

      <section className="section">
        {posts.length === 0 ? (
          <div className="container-x">
            <p className="text-ink-muted">Em breve, novos conteúdos por aqui.</p>
          </div>
        ) : (
          <div className="container-x grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">{p.category}</span>
                <h2 className="mt-3 text-xl font-bold text-ink group-hover:text-brand">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{p.excerpt}</p>
                <p className="mt-5 text-xs text-ink-muted">{formatDate(p.date)} · {p.readingTime}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <CtaBand />
    </>
  );
}
