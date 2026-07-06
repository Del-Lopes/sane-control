import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sanecontrol.com.br"),
  title: {
    default: `${site.name} — Controle de Pragas em ${site.serviceArea}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "controle de pragas",
    "dedetização",
    "desratização",
    "descupinização",
    "sanitização",
    "limpeza de caixa d'água",
    "desentupimento",
    site.serviceArea,
    site.city,
  ],
  openGraph: {
    title: `${site.name} — Controle de Pragas`,
    description: site.description,
    type: "website",
    locale: "pt_BR",
  },
  icons: { icon: "/brand/logo-192.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
