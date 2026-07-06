"use client";

import { useState, useTransition } from "react";
import {
  generateNewsPostDraft,
  generateSalesPostDraft,
  type AiActionResult,
} from "@/server/ai-publish.actions";

const NEWS_TOPICS = ["Pragas urbanas", "Dengue e Aedes", "Saúde e saneamento"];
const SERVICES = [
  "Controle de Pragas",
  "Desratização",
  "Descupinização",
  "Higienização de Caixas d'Água",
  "Sanitização",
  "Desentupimento",
];

export default function ManualGeneratePanel() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<AiActionResult | null>(null);
  const [topic, setTopic] = useState(NEWS_TOPICS[0]);
  const [service, setService] = useState(SERVICES[0]);
  const [city, setCity] = useState("São Paulo");

  const run = (fn: () => Promise<AiActionResult>) => {
    setResult(null);
    startTransition(async () => setResult(await fn()));
  };

  const select =
    "rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="mb-6 rounded-2xl border border-black/5 bg-white p-5">
      <h2 className="text-sm font-bold text-ink">Gerar post manualmente (rascunho para revisão)</h2>
      <p className="mt-1 text-xs text-ink-muted">
        Os posts nascem como <strong>Revisão</strong> — revise antes de publicar.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Notícia */}
        <div className="flex flex-wrap items-center gap-2">
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className={select}>
            {NEWS_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            className="btn-outline px-4 py-2 text-sm disabled:opacity-50"
            disabled={pending}
            onClick={() => run(() => generateNewsPostDraft(topic))}
          >
            Gerar notícia
          </button>
        </div>

        {/* Vendas */}
        <div className="flex flex-wrap items-center gap-2">
          <select value={service} onChange={(e) => setService(e.target.value)} className={select}>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cidade"
            className={`${select} w-28`}
          />
          <button
            className="btn-outline px-4 py-2 text-sm disabled:opacity-50"
            disabled={pending}
            onClick={() => run(() => generateSalesPostDraft(service, city))}
          >
            Gerar vendas
          </button>
        </div>
      </div>

      {pending && <p className="mt-3 text-sm text-ink-muted">Gerando com IA… pode levar alguns segundos.</p>}
      {result && "error" in result && (
        <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-dark">{result.error}</p>
      )}
      {result && "success" in result && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{result.success}</p>
      )}
    </div>
  );
}
