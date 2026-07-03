import { site, whatsappLink } from "@/lib/site";

export default function CtaBand({
  title = "Pronto para proteger o seu ambiente?",
  text = "Fale agora com a nossa equipe e receba um orçamento sem compromisso.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-brand">
      <div className="container-x flex flex-col items-center gap-6 py-14 text-center text-white lg:flex-row lg:justify-between lg:text-left">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 text-white/90">{text}</p>
        </div>
        <a
          href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-white shrink-0"
        >
          Chamar no WhatsApp · {site.whatsapp.display}
        </a>
      </div>
    </section>
  );
}
