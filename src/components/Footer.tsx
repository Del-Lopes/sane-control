import Link from "next/link";
import Image from "next/image";
import { site, whatsappLink, yearsInMarket } from "@/lib/site";
import { services } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="Sane Control" width={40} height={40} />
            <span className="text-lg font-extrabold text-white">
              Sane<span className="text-brand-light"> Control</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Controle de pragas e saneamento com {yearsInMarket()} anos de experiência em {site.serviceArea}.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Serviços</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={s.landingPath ?? `/servicos/${s.slug}`} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Institucional</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/quem-somos" className="hover:text-white">Quem Somos</Link></li>
            <li><Link href="/areas-de-atuacao" className="hover:text-white">Áreas de Atuação</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp: {site.whatsapp.display}
              </a>
            </li>
            <li>{site.city} — {site.state}</li>
            <li className="text-white/60">{site.phoneHours}</li>
          </ul>
        </div>
      </div>

      {/* Rodapé obrigatório — RDC 622/2022 da ANVISA */}
      <div className="border-t border-white/10">
        <div className="container-x grid gap-6 py-8 text-xs leading-relaxed text-white/60 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-semibold text-white/80">Razão Social</p>
            <p className="mt-1">{site.legal.razaoSocial}</p>
            <p className="mt-1">CNPJ: {site.legal.cnpj}</p>
          </div>
          <div>
            <p className="font-semibold text-white/80">Endereço da sede</p>
            <p className="mt-1">{site.legal.address}</p>
          </div>
          <div>
            <p className="font-semibold text-white/80">Licenças da Vigilância Sanitária</p>
            <ul className="mt-1 space-y-1">
              {site.legal.sanitaryLicenses.map((lic) => (
                <li key={lic}>{lic}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. Todos os direitos reservados.</p>
          <p>Conformidade técnica com a RDC 622/2022 da ANVISA</p>
        </div>
      </div>
    </footer>
  );
}
