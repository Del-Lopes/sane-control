import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Serviços e Soluções",
  description:
    "Manejo Integrado de Pragas, desratização, descupinização, manejo de pombos, higienização de reservatórios, sanitização, higienização de estofados e desentupimento com PPA Sane. Conheça os serviços da Sane Control.",
};

export default function ServicosPage() {
  return (
    <>
      <PageHero
        eyebrow="Serviços e soluções"
        title="Soluções completas em saneamento ambiental"
        subtitle="Cada serviço é executado por profissionais capacitados em biossegurança, com saneantes de baixa toxicidade e conformidade com a RDC 622/2022 da ANVISA."
      />

      <section className="section">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/servicos/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
            >
              <div className="text-4xl">{s.icon}</div>
              <h2 className="mt-4 text-lg font-bold text-ink">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Saiba mais <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
