import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a Sane Control. WhatsApp ${site.whatsapp.display}. Atendemos ${site.serviceArea}.`,
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale com a nossa equipe"
        subtitle="Solicite um orçamento sem compromisso. Respondemos rapidamente pelo WhatsApp."
      />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink">Informações de contato</h2>
            <ul className="mt-6 space-y-6">
              <li className="flex items-start gap-4">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-ink">WhatsApp</p>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    {site.whatsapp.display}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-ink">Localização</p>
                  <p className="text-ink-muted">{site.city} — {site.state}</p>
                  <p className="text-sm text-ink-muted">Atendimento em {site.serviceArea}.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">🕗</span>
                <div>
                  <p className="font-semibold text-ink">Horário de atendimento</p>
                  <p className="text-ink-muted">{site.phoneHours}</p>
                </div>
              </li>
            </ul>

            <a
              href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand mt-8"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Envie uma mensagem</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Preencha os dados abaixo e enviaremos a sua solicitação diretamente pelo WhatsApp.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
