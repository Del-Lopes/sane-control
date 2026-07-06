"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  saveAutomationSettingsAction,
  type SaveSettingsResult,
} from "@/server/automation.actions";
import type { AutomationSettings } from "@/lib/db/schema";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-brand disabled:opacity-50"
    >
      {pending ? "Salvando…" : "Salvar configurações"}
    </button>
  );
}

const numberField =
  "w-20 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function AutomationSettingsForm({ settings }: { settings: AutomationSettings }) {
  const [state, formAction] = useFormState<SaveSettingsResult, FormData>(
    saveAutomationSettingsAction,
    null
  );
  const [startHour, setStartHour] = useState(settings.cron_start_hour);
  const [startMinute, setStartMinute] = useState(settings.cron_start_minute ?? 0);
  const [intervalHours, setIntervalHours] = useState(settings.post_interval_hours ?? 4);
  const [newsPerDay, setNewsPerDay] = useState(settings.news_posts_per_day);
  const [salesPerDay, setSalesPerDay] = useState(settings.sales_posts_per_day);

  const numSlots = Math.max(newsPerDay, salesPerDay);
  const scheduleInvalid = numSlots > 1 && startHour + (numSlots - 1) * intervalHours >= 24;
  const slotTimes = Array.from({ length: numSlots }, (_, i) => ({
    time: `${String(startHour + i * intervalHours).padStart(2, "0")}:${String(
      startMinute
    ).padStart(2, "0")}`,
    published: i === 0,
  }));

  const error = state && "error" in state ? state.error : null;
  const success = state && "success" in state;

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-black/5 bg-white p-6">
      {/* Ativar */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_enabled"
          defaultChecked={settings.is_enabled}
          className="h-5 w-5 accent-brand"
        />
        <span className="font-semibold text-ink">Automação ativa</span>
        <span className="text-xs text-ink-muted">
          (quando desligada, o cron não gera posts)
        </span>
      </label>

      {/* Horário de início */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Horário de início (fuso de Brasília)</p>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            name="cron_start_hour"
            type="number"
            min={0}
            max={23}
            value={startHour}
            onChange={(e) => setStartHour(Math.min(23, Math.max(0, +e.target.value || 0)))}
            required
            className={numberField}
          />
          <span>h</span>
          <input
            name="cron_start_minute"
            type="number"
            min={0}
            max={59}
            value={startMinute}
            onChange={(e) => setStartMinute(Math.min(59, Math.max(0, +e.target.value || 0)))}
            required
            className={numberField}
          />
          <span>min</span>
        </div>
      </div>

      {/* Intervalo */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Intervalo entre posts (horas)</p>
        <input
          name="post_interval_hours"
          type="number"
          min={1}
          max={23}
          value={intervalHours}
          onChange={(e) => setIntervalHours(Math.min(23, Math.max(1, +e.target.value || 1)))}
          required
          className={numberField}
        />
      </div>

      {/* Dias ativos */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Dias ativos</p>
        <div className="flex flex-wrap gap-2">
          {DAY_LABELS.map((label, idx) => (
            <label
              key={idx}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-ink-soft has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
            >
              <input
                type="checkbox"
                name={`day_${idx}`}
                defaultChecked={settings.active_days.includes(idx)}
                className="h-4 w-4 accent-brand"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Metas */}
      <div className="flex flex-wrap gap-8">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Notícias / dia</p>
          <input
            name="news_posts_per_day"
            type="number"
            min={0}
            max={20}
            value={newsPerDay}
            onChange={(e) => setNewsPerDay(Math.min(20, Math.max(0, +e.target.value || 0)))}
            required
            className={numberField}
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Vendas / dia</p>
          <input
            name="sales_posts_per_day"
            type="number"
            min={0}
            max={20}
            value={salesPerDay}
            onChange={(e) => setSalesPerDay(Math.min(20, Math.max(0, +e.target.value || 0)))}
            required
            className={numberField}
          />
        </div>
      </div>

      {/* Preview de horários dos slots */}
      {numSlots > 0 && (
        <div className="rounded-lg bg-neutral-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Horários dos posts
          </p>
          <div className="flex flex-wrap gap-2">
            {slotTimes.map((s, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  s.published
                    ? "bg-brand text-white"
                    : "bg-white text-ink-soft ring-1 ring-black/10"
                }`}
              >
                {s.time} {s.published ? "· publicado" : "· agendado"}
              </span>
            ))}
          </div>
          {scheduleInvalid && (
            <p className="mt-3 text-sm text-brand-dark">
              ⚠️ O último post passaria da meia-noite. Reduza o nº de posts ou o intervalo.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-brand-soft px-4 py-2 text-sm text-brand-dark">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Configurações salvas com sucesso.
        </p>
      )}

      <SaveButton disabled={scheduleInvalid} />
    </form>
  );
}
