import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x flex min-h-[40vh] flex-col items-center justify-center text-center">
        <p className="eyebrow">Erro 404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-ink">Página não encontrada</h1>
        <p className="mt-4 max-w-md text-ink-muted">
          O conteúdo que você procura não existe ou foi movido.
        </p>
        <Link href="/" className="btn-brand mt-8">Voltar para o início</Link>
      </div>
    </section>
  );
}
