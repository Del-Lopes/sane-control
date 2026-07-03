export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-brand-dark/70" />
      <div className="container-x relative py-16 lg:py-20">
        <p className="eyebrow text-brand-light">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
