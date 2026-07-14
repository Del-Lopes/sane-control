import type { Metadata } from "next";
import Image from "next/image";
import { site, yearsInMarket } from "@/lib/site";
import { differentials } from "@/lib/services";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: `Conheça a Sane Control, empresa de saneamento ambiental com mais de ${yearsInMarket()} anos de mercado. Manejo Integrado de Pragas em conformidade com a RDC 622/2022 da ANVISA.`,
};

const filosofia = [
  {
    title: "Rigor normativo",
    text: "Operamos com licenças plenas da Vigilância Sanitária, assegurando que todos os nossos processos sejam legalizados e realizados com segurança operacional.",
  },
  {
    title: "Tecnologia seletiva",
    text: "Utilizamos saneantes de última geração e baixa toxicidade, priorizando a segurança de crianças, idosos e animais de estimação.",
  },
  {
    title: "Capacitação contínua",
    text: "Nossa equipe participa de treinamentos constantes em biossegurança e novas tecnologias de controle ambiental.",
  },
];

const porqueEscolher = [
  {
    title: "Experiência comprovada",
    text: "Atuação sólida no mercado desde 2009, enfrentando e resolvendo os desafios mais complexos do controle de pragas urbanas.",
  },
  {
    title: "Foco regional",
    text: "Especialistas nas particularidades de São Paulo e Região Metropolitana, garantindo atendimento ágil e profundo conhecimento dos vetores locais.",
  },
  {
    title: "Atendimento personalizado",
    text: "Tratamos cada cliente — residencial, comercial ou industrial — com a atenção e o cuidado que seu patrimônio merece.",
  },
];

export default function QuemSomosPage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre Nós"
        title={`Sane Control: Mais de ${yearsInMarket()} Anos Cuidando da Saúde do seu Ambiente`}
        subtitle="Desde 2009, transformamos o controle de pragas em uma missão de bem-estar. Com sede em Caieiras e atuação em toda a Grande São Paulo, unimos ciência, ética e proximidade para proteger lares, condomínios e indústrias com excelência técnica."
      />

      {/* Nossa história */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <Image src="/images/equipe-hero.jpeg" alt="Equipe Sane Control em atendimento, com EPIs" width={1024} height={768} className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Nossa história: tradição e solidez" title="Uma trajetória pautada pela confiança" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                A Sane Control Saneamento Ambiental Ltda. nasceu em 2009 com um propósito claro:
                elevar o padrão do saneamento ambiental no Brasil. Ao longo de mais de uma década de
                atuação ininterrupta, consolidamos nossa marca como sinônimo de eficácia, tornando-nos
                parceiros estratégicos de centenas de clientes que não abrem mão da qualidade.
              </p>
            </div>
            <ul className="mt-8 space-y-5">
              {porqueEscolher.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-1 text-brand">▸</span>
                  <div>
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="text-sm leading-relaxed text-ink-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Filosofia / MIP */}
      <section className="section bg-brand-soft/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Diferencial: controle técnico e consciente"
            title="Nossa filosofia: ciência a serviço da vida"
            subtitle="Inspirados pelas melhores práticas globais e em total conformidade com a RDC 622/2022 da ANVISA, adotamos o Manejo Integrado de Pragas (MIP). Para nós, controlar pragas não é apenas aplicar saneantes; é gerenciar o ambiente de forma inteligente e sustentável."
            center
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {filosofia.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-7 shadow-sm">
                <h3 className="text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Missão, visão e valores" title="O que nos move todos os dias" center />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-ink">Missão</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Promover a saúde e o bem-estar por meio de soluções de saneamento ambiental
                tecnicamente superiores e ambientalmente responsáveis.
              </p>
            </div>
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-ink">Visão</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Ser a referência número um em confiança e inovação no controle de pragas e
                higienização de reservatórios em São Paulo e região.
              </p>
            </div>
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-ink">Valores</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Ética inegociável, transparência técnica, respeito à vida e compromisso com o
                resultado do cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO — Carla Ronchi */}
      <section className="section bg-brand-soft/40">
        <div className="container-x grid items-start gap-12 lg:grid-cols-3">
          <div className="overflow-hidden rounded-3xl lg:col-span-1">
            <Image
              src="/images/carla-ronchi.jpeg"
              alt="Carla Ronchi — Diretora Responsável e CEO da Sane Control"
              width={1083}
              height={1624}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lg:col-span-2">
            <p className="eyebrow text-brand">Diretora Responsável</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Carla Ronchi: uma trajetória de compromisso com o saneamento ambiental
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              <p>
                CEO da Sane Control, Carla Ronchi construiu sua carreira unindo visão estratégica e
                paixão pelo saneamento. Especialista em Gestão de Comunicação pela USP e Mestre em
                Data Driven Marketing pela Nova IMS de Lisboa (Portugal), ela une conhecimento
                acadêmico de ponta à experiência prática de quem vive o setor há mais de 15 anos.
              </p>
              <p>
                Sua atuação como Diretora de Marketing da APRAG, de 2016 a 2022, foi um marco,
                proporcionando um mergulho profundo nas melhores práticas do setor dentro e fora do
                Brasil. Participou de cursos e treinamentos voltados para o controle de pragas no
                Brasil e no exterior, acumulando conhecimento que hoje se reflete no rigor técnico e
                na inovação dos serviços da Sane Control.
              </p>
              <p>
                Carla acredita que o saneamento ambiental vai além da técnica — é um ato de cuidado
                com as pessoas e com o planeta.
              </p>
            </div>
            <blockquote className="mt-8 border-l-4 border-brand pl-5 text-lg font-medium italic text-ink">
              “A dedicação ao estudo e a troca com profissionais do mundo todo me ensinaram que
              proteger a saúde ambiental é proteger a vida.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
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

      {/* Certificações e licenças */}
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

      <CtaBand
        title="Conheça de perto o jeito Sane Control de cuidar."
        text="Estamos prontos para ser o seu parceiro na manutenção de um ambiente saudável e protegido."
      />
    </>
  );
}
