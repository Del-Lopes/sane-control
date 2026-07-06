import type { Metadata } from "next";
import { segments } from "@/lib/services";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Áreas de Atuação",
  description: `A Sane Control atende residências, condomínios, escolas, hospitais e empresas em ${site.serviceArea}.`,
};

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Áreas de atuação"
        title="Onde a proteção é essencial, estamos presentes"
        subtitle={`Atendemos diferentes tipos de ambiente em ${site.serviceArea}, adaptando cada plano de controle às necessidades e às normas do local.`}
      />

      <section className="section">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((seg) => (
            <div key={seg.title} className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="text-4xl">{seg.icon}</div>
              <h2 className="mt-4 text-xl font-bold text-ink">{seg.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-muted">{seg.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-brand-soft/40">
        <div className="container-x text-center">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            Atendemos {site.serviceArea}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
            Com sede em {site.city} — {site.state}, levamos nossos serviços de controle de pragas e
            saneamento a toda a região com equipe e frota próprias.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
