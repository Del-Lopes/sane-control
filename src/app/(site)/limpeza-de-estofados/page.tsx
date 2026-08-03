/**
 * Landing page de conversão — Higienização e Impermeabilização de Estofados.
 *
 * Diferente da página institucional (/servicos/limpeza-de-estofados), esta rota
 * é focada em captação: dor → prova → método → oferta → objeções → formulário.
 *
 * COMPLIANCE (RDC 622/2022 da ANVISA — ver src/lib/services.ts):
 *  - Proibido: "seguro", "atóxico", "inócuo", "produto natural", "sem riscos".
 *  - Obrigatório: "baixa toxicidade", "segurança operacional", "saneantes".
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sofa,
  BedDouble,
  Armchair,
  Car,
  Blinds,
  Baby,
  Wind,
  Droplets,
  ShieldCheck,
  Sparkles,
  ScanSearch,
  SprayCan,
  Timer,
  BadgeCheck,
  HardHat,
  MapPin,
  CalendarCheck,
  Check,
} from "lucide-react";
import { site, whatsappLink, yearsInMarket } from "@/lib/site";
import { getService } from "@/lib/services";
import ContactForm from "@/components/ContactForm";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import SectionHeading from "@/components/SectionHeading";

const service = getService("limpeza-de-estofados")!;

const PATH = "/limpeza-de-estofados";
const WHATSAPP_MSG =
  "Olá! Vim pelo site e gostaria de um orçamento para higienização de estofados.";

export const metadata: Metadata = {
  title: "Higienização de Estofados em São Paulo e Região",
  description:
    "Higienização e impermeabilização de sofás, colchões, poltronas e bancos automotivos com extração por sucção e saneantes de baixa toxicidade. Orçamento sem compromisso pelo WhatsApp.",
  keywords: [
    "higienização de estofados",
    "limpeza de sofá",
    "higienização de colchão",
    "impermeabilização de estofados",
    "limpeza de estofados " + site.city,
    site.serviceArea,
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "Higienização de Estofados | Sane Control",
    description:
      "Extração por sucção, ação sanitizante e impermeabilização para sofás, colchões e bancos automotivos em " +
      site.serviceArea +
      ".",
    url: PATH,
    type: "website",
    locale: "pt_BR",
    images: ["/images/sanitizacao-veiculo.jpeg"],
  },
};

/** Problemas invisíveis que justificam a higienização (dor do cliente). */
const problems = [
  {
    icon: Wind,
    title: "Ácaros e poeira acumulada",
    text: "O tecido retém poeira e ácaros no uso diário — gatilhos comuns de rinite, asma e crises alérgicas em casa.",
  },
  {
    icon: Droplets,
    title: "Umidade, suor e odores",
    text: "Suor, líquidos derramados e umidade penetram na espuma e voltam como cheiro persistente, que o aromatizante só disfarça.",
  },
  {
    icon: Sparkles,
    title: "Manchas que se fixam",
    text: "Café, gordura, tinta e xixi de pet penetram nas fibras. Quanto mais tempo passa, mais difícil é a remoção.",
  },
  {
    icon: BadgeCheck,
    title: "Desgaste precoce do tecido",
    text: "Sujeira incrustada age como lixa entre as fibras: o estofado perde cor, textura e vida útil antes da hora.",
  },
];

/** Protocolo de execução — o "como fazemos". */
const steps = [
  {
    icon: ScanSearch,
    title: "Avaliação do tecido",
    text: "Identificamos o tipo de tecido, o nível de sujidade e as manchas presentes para definir o saneante e a técnica adequados a cada peça.",
  },
  {
    icon: Wind,
    title: "Aspiração profunda",
    text: "Remoção de poeira, pelos e resíduos superficiais antes da parte úmida, para que a sujeira solta não vire lama dentro da espuma.",
  },
  {
    icon: SprayCan,
    title: "Extração por sucção",
    text: "Aplicação do produto e extração da sujeira incrustada, dos ácaros e dos resíduos com equipamento profissional de extração.",
  },
  {
    icon: ShieldCheck,
    title: "Ação sanitizante",
    text: "Agente desinfetante com laudo de garantia, contribuindo para um ambiente mais saudável — com orientação de segurança operacional.",
  },
  {
    icon: Droplets,
    title: "Impermeabilização (opcional)",
    text: "Barreira invisível que repele líquidos e dificulta a fixação de manchas, prolongando a vida útil do estofado.",
  },
  {
    icon: Timer,
    title: "Secagem e entrega",
    text: "Aceleramos a secagem com sopradores e orientamos o tempo de retorno ao uso, normalmente entre 4 e 8 horas.",
  },
];

/** Peças atendidas. */
const items = [
  { icon: Sofa, label: "Sofás e sofás-cama" },
  { icon: BedDouble, label: "Colchões e box" },
  { icon: Armchair, label: "Poltronas e puffs" },
  { icon: Blinds, label: "Cortinas e tapetes" },
  { icon: Car, label: "Bancos automotivos" },
  { icon: Baby, label: "Carrinhos e cadeirinhas" },
];

/** Perguntas frequentes — também publicadas como FAQPage (JSON-LD). */
const faqs = [
  {
    q: "Quanto tempo o estofado leva para secar?",
    a: "Na maioria dos casos, entre 4 e 8 horas. O tempo varia com o tipo de tecido, a espessura da espuma e a ventilação do ambiente. Usamos sopradores para acelerar a secagem e orientamos o tempo de retorno ao uso antes de ir embora.",
  },
  {
    q: "Os produtos utilizados são adequados para casas com crianças e pets?",
    a: "Trabalhamos com saneantes regularizados de baixa toxicidade, aplicados por profissionais capacitados em biossegurança. Em casas com crianças, idosos ou animais de estimação, a equipe orienta o tempo de retorno ao ambiente e as medidas de segurança operacional recomendadas para o produto aplicado.",
  },
  {
    q: "Vocês removem qualquer tipo de mancha?",
    a: "Removemos a grande maioria das manchas de uso cotidiano — café, gordura, bebidas, urina de pet. Manchas antigas, de tinta, de alvejante ou que já alteraram a cor da fibra podem clarear sem sair por completo. Avaliamos a peça antes e informamos o resultado esperado com honestidade.",
  },
  {
    q: "Com que frequência devo higienizar o sofá ou o colchão?",
    a: "Como referência, a cada 6 meses em residências com crianças, pets ou pessoas alérgicas, e a cada 12 meses no uso comum. Ambientes comerciais e de alta circulação costumam exigir intervalos menores.",
  },
  {
    q: "O que é a impermeabilização e por quanto tempo ela dura?",
    a: "É a aplicação de uma barreira invisível que faz o líquido escorrer sobre o tecido em vez de penetrar, dando tempo para limpar antes que a mancha se fixe. A durabilidade depende do uso e da limpeza doméstica, e costuma acompanhar o ciclo entre uma higienização e outra.",
  },
  {
    q: "Preciso levar o estofado até vocês?",
    a: `Não. O serviço é feito no seu endereço, com equipe e equipamentos próprios. Atendemos ${site.serviceArea}, com base em ${site.city}/${site.state}.`,
  },
  {
    q: "Como funciona o orçamento?",
    a: "É gratuito e sem compromisso. Pelo WhatsApp, peça o orçamento informando as peças (por exemplo, sofá de 3 lugares e uma poltrona), o tipo de tecido e o bairro. Costumamos responder no mesmo dia útil.",
  },
];

const trust = [
  { icon: HardHat, label: "Equipe própria e uniformizada" },
  { icon: BadgeCheck, label: "Licenças da Vigilância Sanitária" },
  { icon: MapPin, label: site.serviceArea },
  { icon: CalendarCheck, label: "Atendimento sob agendamento" },
];

export default function LimpezaDeEstofadosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        serviceType: "Higienização e impermeabilização de estofados",
        description: service.description,
        url: `https://www.sanecontrol.com.br${PATH}`,
        areaServed: site.serviceArea,
        provider: {
          "@type": "LocalBusiness",
          name: site.legalName,
          telephone: `+${site.whatsapp.number}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.legal.address,
            addressLocality: site.city,
            addressRegion: site.state,
            addressCountry: "BR",
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <Image
          src="/images/sanitizacao-veiculo.jpeg"
          alt="Técnico da Sane Control higienizando um estofado com equipamento de extração"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/90 to-brand-dark/70" />

        <div className="container-x relative grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow text-brand-light">Higienização de estofados</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Seu sofá parece limpo. Por dentro, ele guarda outra história.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Higienização e impermeabilização de sofás, colchões, poltronas e bancos automotivos
              com extração por sucção e saneantes de baixa toxicidade. Feito no seu endereço, em{" "}
              {site.serviceArea}.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Remoção de ácaros e sujeira incrustada",
                "Ação sanitizante com laudo de garantia",
                "Barreira contra líquidos e manchas",
                "Secagem acelerada, entre 4 e 8 horas",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-white/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" strokeWidth={3} aria-hidden />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={whatsappLink(WHATSAPP_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand"
              >
                Pedir orçamento no WhatsApp
              </a>
              <a href="#orcamento" className="btn-white">
                Enviar meus dados
              </a>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Orçamento gratuito e sem compromisso · {site.whatsapp.display}
            </p>
          </div>

          {/* Formulário no primeiro dobra (desktop) */}
          <div className="hidden rounded-3xl bg-white p-8 shadow-xl lg:block">
            <h2 className="text-xl font-bold text-ink">Receba seu orçamento</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Preencha os dados e enviaremos a solicitação direto para o nosso WhatsApp.
            </p>
            <ContactForm defaultService={service.title} submitLabel="Quero meu orçamento" />
          </div>
        </div>
      </section>

      {/* Barra de confiança */}
      <section className="border-b border-black/5 bg-brand-soft/40 py-6">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
                <span className="text-sm font-medium text-ink-soft">{t.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dor — o que vive dentro do estofado */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Por que higienizar"
            title="O que o aspirador de casa não alcança"
            subtitle="Um estofado usado todos os dias acumula, camada por camada, aquilo que a limpeza superficial não remove — e o efeito aparece na saúde e na aparência do ambiente."
            center
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                  <Icon className="h-9 w-9 text-brand" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-4 text-base font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prova visual — antes e depois (fotos reais de atendimento) */}
      <section className="section bg-brand-soft/30">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Resultados reais"
                title="A diferença que se vê no mesmo estofado"
                subtitle="Arraste o divisor para comparar o antes e o depois de um atendimento real. O tecido volta a mostrar a cor original, sem as manchas de uso nem a sujeira incrustada."
              />
              <a
                href={whatsappLink(WHATSAPP_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand mt-8"
              >
                Quero esse resultado no meu sofá
              </a>
            </div>
            {service.beforeAfter && (
              <BeforeAfterSlider
                before={service.beforeAfter.before}
                after={service.beforeAfter.after}
                beforeAlt="Sofá de dois lugares com manchas de uso, antes da higienização"
                afterAlt="O mesmo sofá de dois lugares depois da higienização, com o tecido uniforme"
                aspectClass="aspect-[2/1]"
              />
            )}
          </div>

          {/* Segundo caso — ângulos diferentes, então lado a lado em vez de slider */}
          <div className="mt-16">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-ink-muted">
              Outro atendimento: sofá de canto com chaise
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {[
                {
                  src: "/images/estofado-2-antes.jpg",
                  label: "Antes",
                  alt: "Sofá de canto com assentos encardidos e manchados, antes da higienização",
                },
                {
                  src: "/images/estofado-2-depois.jpg",
                  label: "Depois",
                  alt: "O mesmo sofá de canto depois da higienização, com o tecido claro e uniforme",
                },
              ].map((img) => (
                <figure
                  key={img.label}
                  className="relative overflow-hidden rounded-3xl border border-black/5 shadow-sm"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={736}
                    height={460}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="aspect-[8/5] w-full object-cover"
                  />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {img.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protocolo */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Nosso protocolo"
            title="Como o serviço acontece, etapa por etapa"
            subtitle="Um processo técnico definido, executado por equipe própria capacitada em biossegurança — sem improviso e sem surpresa no orçamento."
            center
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.title}
                  className="relative rounded-2xl border border-black/5 bg-white p-7 shadow-sm"
                >
                  <span className="absolute right-6 top-6 text-3xl font-extrabold text-brand/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-9 w-9 text-brand" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Peças atendidas */}
      <section className="section bg-ink text-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brand-light">O que higienizamos</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Se o tecido faz parte da sua rotina, ele entra no nosso protocolo
            </h2>
            <p className="mt-4 text-white/75">
              Atendemos residências, condomínios, escritórios, clínicas e frotas. Peças grandes,
              tecidos delicados e conjuntos completos — tudo avaliado antes da execução.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappLink(WHATSAPP_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand"
              >
                Consultar minha peça
              </a>
              <Link href="/servicos" className="btn-white">
                Ver todos os serviços
              </Link>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <li
                  key={it.label}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur"
                >
                  <Icon className="h-7 w-7 shrink-0 text-brand-light" strokeWidth={1.75} aria-hidden />
                  <span className="text-sm font-semibold text-white">{it.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Impermeabilização */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/estofado-3.jpg"
              alt="Close de um sofá de couro durante o atendimento: o lado já higienizado, claro e uniforme, ao lado da parte ainda encardida"
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Proteção contínua"
              title="Impermeabilização: o cuidado que dura depois que a gente vai embora"
              subtitle="A higienização devolve o estofado ao estado ideal. A impermeabilização mantém esse estado por mais tempo, criando uma barreira invisível entre o tecido e o dia a dia."
            />
            <ul className="mt-8 space-y-4">
              {[
                {
                  t: "Líquido escorre, não penetra",
                  d: "Você tem tempo de secar o derramamento antes que a mancha se fixe na fibra.",
                },
                {
                  t: "Limpeza do dia a dia mais simples",
                  d: "Poeira e sujeira aderem menos ao tecido, facilitando a manutenção entre uma higienização e outra.",
                },
                {
                  t: "Mais vida útil para a peça",
                  d: "Menos atrito de sujeira entre as fibras significa cor e textura preservadas por mais tempo.",
                },
                {
                  t: "Sem alterar o toque do tecido",
                  d: "A barreira é invisível e não deixa a superfície plastificada nem endurecida.",
                },
              ].map((b) => (
                <li key={b.t} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-brand" strokeWidth={3} aria-hidden />
                  <div>
                    <p className="font-semibold text-ink">{b.t}</p>
                    <p className="text-sm text-ink-muted">{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Autoridade */}
      <section className="section bg-brand-soft/30">
        <div className="container-x">
          <SectionHeading
            eyebrow={`Sane Control desde ${site.foundedYear}`}
            title="Uma empresa de saneamento ambiental cuidando do seu estofado"
            subtitle="Não somos apenas uma equipe de limpeza. Somos especialistas em saúde ambiental, com licenças plenas e responsável técnico — e trazemos esse rigor para dentro do seu sofá."
            center
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { n: `${yearsInMarket()}+`, l: "anos de atuação em saúde ambiental" },
              { n: "100%", l: "equipe própria e capacitada" },
              { n: "RDC 622", l: "conformidade com a ANVISA" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="text-4xl font-extrabold text-brand">{s.n}</div>
                <div className="mt-2 text-sm text-ink-muted">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-10 opacity-80">
            <Image src="/brand/cert-anvisa.png" alt="ANVISA" width={140} height={46} className="h-10 w-auto object-contain" />
            <Image src="/brand/cert-aprag.png" alt="APRAG" width={100} height={46} className="h-12 w-auto object-contain" />
            <Image src="/brand/cert-crbio.png" alt="CRBio" width={120} height={46} className="h-10 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title="O que perguntam antes de contratar"
            center
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:content-none">
                  {f.q}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 text-brand transition-transform group-open:rotate-180"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário final */}
      <section id="orcamento" className="section scroll-mt-24 bg-brand-soft/40">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Orçamento"
              title="Peça o seu orçamento agora"
              subtitle="Informe as peças, o tipo de tecido e o seu bairro. Respondemos com o valor e as datas disponíveis, sem compromisso."
            />
            <ul className="mt-8 space-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} aria-hidden />
                Atendimento em {site.serviceArea}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} aria-hidden />
                {site.phoneHours}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} aria-hidden />
                Serviço executado no seu endereço
              </li>
            </ul>
            <a
              href={whatsappLink(WHATSAPP_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand mt-8"
            >
              Falar agora · {site.whatsapp.display}
            </a>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Envie seus dados</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Preencha o formulário e a solicitação segue direto para o nosso WhatsApp.
            </p>
            <ContactForm defaultService={service.title} submitLabel="Quero meu orçamento" />
          </div>
        </div>
      </section>
    </>
  );
}
