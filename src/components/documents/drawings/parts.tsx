import { cx } from '@/lib/cx';
import s from './Drawings.module.css';

interface DimensionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  labelX: number;
  labelY: number;
  anchor?: 'start' | 'middle' | 'end';
}

/** A dimension line with end ticks and a bold callout. */
export function Dimension({ x1, y1, x2, y2, label, labelX, labelY, anchor = 'start' }: DimensionProps) {
  const vertical = x1 === x2;
  const tick = 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={s.dim} />
      {vertical ? (
        <>
          <line x1={x1 - tick} y1={y1} x2={x1 + tick} y2={y1} className={s.dim} />
          <line x1={x2 - tick} y1={y2} x2={x2 + tick} y2={y2} className={s.dim} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - tick} x2={x1} y2={y1 + tick} className={s.dim} />
          <line x1={x2} y1={y2 - tick} x2={x2} y2={y2 + tick} className={s.dim} />
        </>
      )}
      <text x={labelX} y={labelY} textAnchor={anchor} className={s.dimText}>
        {label}
      </text>
    </g>
  );
}

export function NorthArrow({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="14" className={s.light} />
      <path d={`M ${x} ${y - 10} L ${x + 5} ${y + 6} L ${x} ${y + 2} L ${x - 5} ${y + 6} Z`} fill="var(--drawing-line)" />
      <text x={x} y={y - 18} textAnchor="middle" className={cx(s.label, s.small)}>
        N
      </text>
    </g>
  );
}
