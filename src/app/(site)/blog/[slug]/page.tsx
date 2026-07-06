import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, formatDate } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import CtaBand from "@/components/CtaBand";

// Posts nascem/mudam pelo cron sem novo deploy → dinâmico.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: post.coverImage
      ? { images: [{ url: post.coverImage }], title: post.title }
      : { title: post.title },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 2);

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
          <p className="mt-4 text-sm text-white/60">
            Por Redação Sane Control · {formatDate(post.date)} · {post.readingTime}
          </p>
        </div>
      </section>

      <article className="section">
        <div className="container-x max-w-3xl">
          {post.coverImage && (
            <figure className="mb-10 overflow-hidden rounded-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
                priority
              />
              {post.isAiCover && (
                <figcaption className="mt-2 text-center text-xs text-ink-muted">
                  Imagem conceitual gerada por IA
                </figcaption>
              )}
            </figure>
          )}

          <PostContent html={post.content} />

          {post.sourceUrl && (
            <p className="mt-10 text-sm text-ink-muted">
              Fonte original:{" "}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand underline"
              >
                {(() => {
                  try {
                    return new URL(post.sourceUrl).hostname.replace(/^www\./, "");
                  } catch {
                    return "ver publicação";
                  }
                })()}
              </a>
            </p>
          )}

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
