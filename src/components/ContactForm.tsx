"use client";

import { useState } from "react";
import { services } from "@/lib/services";
import { whatsappLink } from "@/lib/site";

export default function ContactForm() {
  const [form, setForm] = useState({ nome: "", telefone: "", servico: "", mensagem: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Olá! Meu nome é ${form.nome || "(não informado)"}.\n` +
      (form.telefone ? `Telefone: ${form.telefone}\n` : "") +
      (form.servico ? `Serviço de interesse: ${form.servico}\n` : "") +
      (form.mensagem ? `Mensagem: ${form.mensagem}` : "Gostaria de solicitar um orçamento.");
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  };

  const field = "mt-1 w-full rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="nome">Nome</label>
        <input id="nome" required value={form.nome} onChange={update("nome")} className={field} placeholder="Seu nome" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="telefone">Telefone / WhatsApp</label>
        <input id="telefone" value={form.telefone} onChange={update("telefone")} className={field} placeholder="(11) 99999-9999" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="servico">Serviço de interesse</label>
        <select id="servico" value={form.servico} onChange={update("servico")} className={field}>
          <option value="">Selecione...</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>{s.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="mensagem">Mensagem</label>
        <textarea id="mensagem" rows={4} value={form.mensagem} onChange={update("mensagem")} className={field} placeholder="Como podemos ajudar?" />
      </div>
      <button type="submit" className="btn-brand w-full">Enviar pelo WhatsApp</button>
    </form>
  );
}
