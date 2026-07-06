import Link from "next/link";
import Image from "next/image";
import { getAuthedProfile } from "@/server/auth.helpers";
import { logoutAction } from "@/server/auth.actions";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/automation/settings", label: "Automação" },
  { href: "/admin/automation/logs", label: "Logs" },
];

// Layout do admin. Marca: vermelho (#DE1E11) + branco. O chrome (sidebar/topo)
// só aparece quando há um profile autenticado — na tela de login fica limpo.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAuthedProfile();

  if (!profile) {
    // Login (e demais rotas não autenticadas): sem chrome de admin.
    return <div className="flex min-h-screen flex-col bg-brand-soft/30">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-60 shrink-0 flex-col bg-ink text-white md:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <Image src="/brand/logo.png" alt="Sane Control" width={36} height={36} />
          <span className="text-sm font-bold leading-tight">
            Sane<span className="text-brand-light"> Control</span>
            <span className="block text-[11px] font-normal text-white/50">Painel</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-brand hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="mb-3 truncate text-xs text-white/50">{profile.email}</p>
          <form action={logoutAction}>
            <button className="w-full rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-6 md:justify-end">
          <span className="text-sm font-bold text-ink md:hidden">Sane Control · Painel</span>
          <span className="text-sm text-ink-muted">
            {profile.full_name || profile.email}
            <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold uppercase text-brand-dark">
              {profile.role}
            </span>
          </span>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
