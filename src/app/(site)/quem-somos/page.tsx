import type { Metadata } from "next";
import Image from "next/image";
import { site, yearsInMarket } from "@/lib/site";
import { differentials } from "@/lib/services";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: `Conheça a Sane Control, empresa de controle de pragas e saneamento com ${yearsInMarket()} anos de mercado em ${site.serviceArea}.`,
};

const valores = [
  "Qualidade e segurança na prestação dos serviços",
  "Responsabilidade ambiental e sustentabilidade",
  "Conformidade com as normas do Ministério da Saúde e da ANVISA",
  "Especialização e treinamento contínuo da equipe",
  "Bem-estar do cliente e orientação preventiva",
];

export default function QuemSomosPage() {
  return (
    <>
      <PageHero
        eyebrow="Quem somos"
        title="Cuidando de ambientes desde 2006"
        subtitle={`Há ${yearsInMarket()} anos oferecemos controle de pragas e saneamento com profissionalismo, excelência e compromisso com a saúde das pessoas.`}
      />

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <Image src="/brand/quem-somos.jpeg" alt="Sane Control" width={1024} height={768} className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Nossa história" title="Experiência que gera confiança" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                A Sane Control atua no mercado desde 2006, oferecendo serviços de controle de pragas,
                higienização de reservatórios de água, sanitização de ambientes, desentupimentos e
                limpeza de tubulação.
              </p>
              <p>
                Atendemos residências, condomínios, escolas, hospitais e empresas em {site.serviceArea},
                sempre com equipe própria, frota própria e produtos de baixo impacto ambiental.
              </p>
              <p>
                Nosso compromisso vai além do serviço executado: monitoramos os atendimentos realizados
                e oferecemos orientação preventiva para que o seu ambiente permaneça protegido.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-brand-soft/40">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-ink">Missão</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Oferecer serviços de controle de pragas e saneamento com qualidade, segurança e
              responsabilidade ambiental, garantindo a tranquilidade e a saúde dos nossos clientes.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-ink">Nossos valores</h3>
            <ul className="mt-4 space-y-3">
              {valores.map((v) => (
                <li key={v} className="flex items-start gap-3 text-ink-soft">
                  <span className="mt-1 text-brand">✔</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Diferenciais" title="Por que escolher a Sane Control" center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((d) => (
              <div key={d.title} className="rounded-2xl border border-black/5 bg-white p-7 text-center shadow-sm">
                <div className="text-4xl">{d.icon}</div>
                <h3 className="mt-4 text-base font-bold text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-white">
        <div className="container-x">
          <SectionHeading eyebrow="Certificações e licenças" title="Empresa devidamente regularizada" center />
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {site.registrations.map((r) => (
              <div key={r} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 text-sm text-white/85">
                <span className="text-brand-light">◆</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
