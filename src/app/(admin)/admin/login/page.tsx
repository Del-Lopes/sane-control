import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const forbidden = searchParams.error === "forbidden";
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/brand/logo.png" alt="Sane Control" width={48} height={48} />
          <h1 className="mt-4 text-xl font-bold text-ink">Painel Sane Control</h1>
          <p className="mt-1 text-sm text-ink-muted">Acesso restrito à equipe.</p>
        </div>
        {forbidden && (
          <p className="mb-4 rounded-lg bg-brand-soft px-4 py-2 text-sm text-brand-dark">
            Sua conta não tem permissão para acessar o painel.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
