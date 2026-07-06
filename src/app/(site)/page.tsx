import Link from "next/link";
import Image from "next/image";
import { site, whatsappLink, yearsInMarket } from "@/lib/site";
import { services, differentials, segments } from "@/lib/services";
import { getPublishedPosts, formatDate } from "@/lib/posts";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";

// Lê os últimos posts do banco (nascem pelo cron sem novo deploy).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestPosts = await getPublishedPosts({ pageSize: 3 });
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-brand-dark/70" />
        <div className="container-x relative grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <p className="eyebrow text-brand-light">Controle de pragas e saneamento</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Proteção completa para o seu ambiente
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              {site.tagline}. Há {yearsInMarket()} anos cuidando de residências, condomínios,
              escolas, hospitais e empresas em {site.serviceArea}.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer" className="btn-brand">
                Solicitar orçamento
              </a>
              <Link href="/servicos" className="btn-white">
                Nossos serviços
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { n: `${yearsInMarket()}+`, l: "anos de experiência" },
              { n: "100%", l: "equipe própria" },
              { n: "6", l: "serviços especializados" },
              { n: "ANVISA", l: "empresa licenciada" },
            ].map((stat) => (
              <div key={stat.l} className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div className="text-3xl font-extrabold text-white">{stat.n}</div>
                <div className="mt-1 text-sm text-white/70">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Serviços e soluções"
            title="O que fazemos por você"
            subtitle="Soluções profissionais para o controle de pragas e o saneamento do seu imóvel, sempre com produtos de baixo impacto ambiental."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/servicos/${s.slug}`}
                className="group rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
              >
                <div className="text-4xl">{s.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  Saiba mais
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section bg-brand-soft/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Por que a Sane Control"
            title="Diferenciais que fazem a diferença"
            center
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((d) => (
              <div key={d.title} className="rounded-2xl bg-white p-7 text-center shadow-sm">
                <div className="text-4xl">{d.icon}</div>
                <h3 className="mt-4 text-base font-bold text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Áreas / segmentos */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Áreas de atuação"
              title="Atendemos onde a proteção é essencial"
              subtitle="Do residencial ao hospitalar, adaptamos cada plano de controle às necessidades e às normas do seu ambiente."
            />
            <ul className="mt-8 space-y-4">
              {segments.map((seg) => (
                <li key={seg.title} className="flex items-start gap-4">
                  <span className="text-2xl">{seg.icon}</span>
                  <div>
                    <p className="font-semibold text-ink">{seg.title}</p>
                    <p className="text-sm text-ink-muted">{seg.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/areas-de-atuacao" className="btn-outline mt-8">
              Ver todas as áreas
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/brand/quem-somos.jpeg"
              alt="Equipe Sane Control em atendimento"
              width={1024}
              height={768}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section className="border-y border-black/5 bg-white py-12">
        <div className="container-x">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-ink-muted">
            Empresa certificada e licenciada
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10 opacity-80">
            <Image src="/brand/cert-anvisa.png" alt="ANVISA" width={140} height={46} className="h-10 w-auto object-contain" />
            <Image src="/brand/cert-aprag.png" alt="APRAG" width={100} height={46} className="h-12 w-auto object-contain" />
            <Image src="/brand/cert-crbio.png" alt="CRBio" width={120} height={46} className="h-10 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Blog" title="Dicas e conteúdos" />
            <Link href="/blog" className="hidden text-sm font-semibold text-brand hover:text-brand-dark sm:block">
              Ver todos →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latestPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">{p.category}</span>
                <h3 className="mt-3 text-lg font-bold text-ink group-hover:text-brand">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.excerpt}</p>
                <p className="mt-4 text-xs text-ink-muted">{formatDate(p.date)} · {p.readingTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
