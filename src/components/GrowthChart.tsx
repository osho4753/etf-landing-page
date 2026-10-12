import { useId } from "react";
import type { YearPoint } from "@/lib/calc";
import { formatCzk } from "@/lib/calc";

type Props = {
  points: YearPoint[];
  compact?: boolean;
  title: string;
};

const W = 340;
const H = 200;
const PAD = { top: 12, right: 8, bottom: 26, left: 8 };

function path(values: number[], max: number) {
  const n = values.length - 1;
  return values
    .map((v, i) => {
      const x = PAD.left + (i / Math.max(n, 1)) * (W - PAD.left - PAD.right);
      const y = PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function GrowthChart({ points, compact = false, title }: Props) {
  const fillId = `fill-${useId().replace(/:/g, "")}`;
  const max = Math.max(...points.map((p) => Math.max(p.etf, p.bank, p.invested))) * 1.05;
  const etf = path(points.map((p) => p.etf), max);
  const bank = path(points.map((p) => p.bank), max);
  const invested = path(points.map((p) => p.invested), max);
  const baseY = H - PAD.bottom;
  const gap = `${etf} L${(W - PAD.right).toFixed(1)},${baseY} L${PAD.left},${baseY} Z`;
  const last = points[points.length - 1];
  const years = last.year;
  const ticks = [0, Math.round(years / 2), years];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${title}. Po ${years} letech: ETF ${formatCzk(last.etf)}, bankovní fond ${formatCzk(last.bank)}, vloženo ${formatCzk(last.invested)}.`}
      >
        <defs>
          <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mint)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-mint)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PAD.left} x2={W - PAD.right} y1={baseY} y2={baseY} stroke="var(--color-line)" />
        <path d={gap} fill={`url(#${fillId})`} />
        <path d={invested} fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d={bank} fill="none" stroke="var(--color-loss)" strokeWidth="3" strokeLinecap="round" />
        <path d={etf} fill="none" stroke="var(--color-mint)" strokeWidth="3" strokeLinecap="round" />
        {ticks.map((t) => {
          const x = PAD.left + (t / Math.max(years, 1)) * (W - PAD.left - PAD.right);
          return (
            <text key={t} x={x} y={H - 8} fontSize="11" fill="var(--color-ink-soft)" textAnchor={t === 0 ? "start" : t === years ? "end" : "middle"}>
              {t === 0 ? "dnes" : `${t}. rok`}
            </text>
          );
        })}
      </svg>
      {!compact && (
        <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1 w-4 rounded bg-mint" aria-hidden /> ETF (evropská verze)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1 w-4 rounded bg-loss" aria-hidden /> bankovní akciový fond
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t-2 border-dashed border-ink-soft" aria-hidden /> vloženo
          </span>
        </figcaption>
      )}
    </figure>
  );
}
