import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, formatDate } from "@/lib/posts";
import CtaBand from "@/components/CtaBand";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Artigo não encontrado" };
  return { title: post.title, description: post.excerpt };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-brand-dark/70" />
        <div className="container-x relative py-16 lg:py-20">
          <nav className="text-sm text-white/60">
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{post.category}</span>
          </nav>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-sm text-white/60">{formatDate(post.date)} · {post.readingTime}</p>
        </div>
      </section>

      <article className="section">
        <div className="container-x max-w-3xl">
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-black/5 pt-10">
              <h2 className="text-xl font-bold text-ink">Leia também</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {related.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-black/5 p-6 transition-all hover:shadow-md">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand">{p.category}</span>
                    <h3 className="mt-2 font-bold text-ink group-hover:text-brand">{p.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CtaBand />
    </>
  );
}
