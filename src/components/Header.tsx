"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";

// Itens do menu suspenso de Serviços (apontam para as páginas dedicadas)
const servicesDropdown = [
  { href: "/servicos/controle-de-pragas", label: "Controle de Pragas" },
  { href: "/servicos/desratizacao", label: "Desratização" },
  { href: "/servicos/descupinizacao", label: "Descupinização" },
  { href: "/servicos/manejo-de-pombos", label: "Manejo de Pombos" },
  { href: "/servicos/higienizacao-caixa-dagua", label: "Higienização de Reservatórios" },
  { href: "/servicos/sanitizacao", label: "Sanitização de Ambientes" },
  { href: "/servicos/limpeza-de-estofados", label: "Higienização de Estofados" },
  { href: "/servicos/desentupimento", label: "Desentupimento & PPA Sane" },
];

const nav = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/servicos", label: "Serviços", dropdown: servicesDropdown },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMobile = () => {
    setOpen(false);
    setMobileServices(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" onClick={closeMobile}>
          <Image src="/brand/logo.png" alt="Sane Control" width={44} height={44} priority />
          <span className="text-lg font-extrabold leading-none text-ink">
            Sane<span className="text-brand"> Control</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) =>
            item.dropdown ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 py-6 text-sm font-medium transition-colors hover:text-brand ${
                    isActive(item.href) ? "text-brand" : "text-ink-soft"
                  }`}
                >
                  {item.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:rotate-180">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/* Dropdown — visível no hover/foco */}
                <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-black/5 bg-white p-2 shadow-lg">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-brand-soft/50 hover:text-brand ${
                          pathname === sub.href ? "text-brand" : "text-ink-soft"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-brand ${
                  isActive(item.href) ? "text-brand" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <a href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer" className="btn-brand">
            Solicitar orçamento
          </a>
        </div>

        <button
          className="lg:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <nav className="container-x flex flex-col py-4">
            {nav.map((item) =>
              item.dropdown ? (
                <div key={item.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={closeMobile}
                      className={`py-3 text-sm font-medium ${isActive(item.href) ? "text-brand" : "text-ink-soft"}`}
                    >
                      {item.label}
                    </Link>
                    <button
                      aria-label="Expandir serviços"
                      onClick={() => setMobileServices((v) => !v)}
                      className="p-2 text-ink-soft"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${mobileServices ? "rotate-180" : ""}`}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {mobileServices && (
                    <div className="ml-3 flex flex-col border-l border-black/10 pl-4">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeMobile}
                          className={`py-2 text-sm ${pathname === sub.href ? "text-brand" : "text-ink-muted"}`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`py-3 text-sm font-medium ${isActive(item.href) ? "text-brand" : "text-ink-soft"}`}
                >
                  {item.label}
                </Link>
              )
            )}
            <a
              href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand mt-3"
            >
              Solicitar orçamento
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
