import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";
import CtaBand from "@/components/CtaBand";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Serviço não encontrado" };
  return {
    title: service.title,
    description: service.short,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);
  const Icon = service.icon;

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        {service.image && (
          <>
            <Image
              src={service.image}
              alt={`Equipe Sane Control — ${service.title}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/90 to-brand-dark/70" />
          </>
        )}
        {!service.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-brand-dark/70" />
        )}
        <div className="container-x relative py-16 lg:py-24">
          <nav className="text-sm text-white/60">
            <Link href="/servicos" className="hover:text-white">Serviços</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{service.title}</span>
          </nav>
          <div className="mt-6 flex items-center gap-4">
            <Icon className="h-12 w-12 shrink-0 text-brand-light" strokeWidth={1.75} aria-hidden />
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{service.title}</h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-ink-soft">{service.description}</p>

            <div className="mt-10 space-y-5">
              {service.highlights.map((h) => (
                <div key={h.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                    <span className="text-brand">▸</span> {h.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-muted">{h.text}</p>
                </div>
              ))}
            </div>

            {service.beforeAfter && (
              <div className="mt-12">
                <h3 className="text-lg font-bold text-ink">Veja o resultado: antes e depois</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Arraste o divisor para comparar o estofado antes e depois da higienização.
                </p>
                <div className="mt-5">
                  <BeforeAfterSlider
                    before={service.beforeAfter.before}
                    after={service.beforeAfter.after}
                    beforeAlt={`${service.title} — antes`}
                    afterAlt={`${service.title} — depois`}
                  />
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappLink(`Olá! Gostaria de um orçamento para ${service.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand"
              >
                Solicitar orçamento
              </a>
              <Link href="/servicos" className="btn-outline">Ver todos os serviços</Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-brand-soft/50 p-6">
              <h3 className="text-base font-bold text-ink">Atendimento rápido</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Fale com a nossa equipe pelo WhatsApp e receba um orçamento sem compromisso.
              </p>
              <a
                href={whatsappLink(`Olá! Gostaria de um orçamento para ${service.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand mt-4 w-full"
              >
                {site.whatsapp.display}
              </a>
            </div>

            <div className="rounded-2xl border border-black/5 p-6">
              <h3 className="text-base font-bold text-ink">Outros serviços</h3>
              <ul className="mt-4 space-y-2">
                {others.map((o) => {
                  const OtherIcon = o.icon;
                  return (
                  <li key={o.slug}>
                    <Link href={`/servicos/${o.slug}`} className="flex items-center gap-2 text-sm text-ink-soft hover:text-brand">
                      <OtherIcon className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden /> {o.title}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
