"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

/**
 * Slider de comparação antes/depois (brief — página de Estofados).
 * Arraste o divisor (ou use as setas do teclado) para revelar a imagem "depois".
 */
export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt = "Antes",
  afterAlt = "Depois",
  beforeLabel = "Antes",
  afterLabel = "Depois",
}: Props) {
  const [pos, setPos] = useState(50); // % revelado da imagem "antes"
  const [width, setWidth] = useState(0); // largura medida do container (px)
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Mede a largura do container para que a imagem "antes" não distorça ao recortar.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-3xl border border-black/5 shadow-sm"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Depois (fundo, ocupa todo o container) */}
      <Image src={after} alt={afterAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
        {afterLabel}
      </span>

      {/* Antes (recortado pela posição). A imagem interna tem a largura total do
          container, então recortar o wrapper não a distorce. */}
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="absolute inset-y-0 left-0" style={{ width: width || "100%" }}>
          <Image src={before} alt={beforeAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {beforeLabel}
        </span>
      </div>

      {/* Divisor / alça */}
      <button
        type="button"
        aria-label="Arraste para comparar antes e depois"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="slider"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className="absolute top-0 z-10 flex h-full w-10 -translate-x-1/2 cursor-ew-resize items-center justify-center focus:outline-none"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute h-full w-0.5 bg-white/90" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-lg ring-2 ring-brand/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
