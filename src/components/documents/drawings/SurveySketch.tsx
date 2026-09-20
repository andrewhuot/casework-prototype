import type { DrawingSurvey } from '@/data/types';
import { cx } from '@/lib/cx';
import s from './Drawings.module.css';
import { Dimension, NorthArrow } from './parts';

/** Boundary survey sketch with bearings, corner monuments, and the proposed ADU footprint. */
export function SurveySketch({ spec }: { spec: DrawingSurvey }) {
  const corners: [number, number][] = [
    [70, 40],
    [430, 40],
    [430, 250],
    [70, 250],
  ];
  return (
    <svg viewBox="0 0 520 300" className={s.svg} role="img" aria-label={`Survey sketch placing the proposed ADU footprint ${spec.rearDistance} from the rear lot line and ${spec.sideDistance} from the side lot line`}>
      <polygon points={corners.map((c) => c.join(',')).join(' ')} className={s.heavy} />
      {corners.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="var(--paper-bg)" className={s.line} />
          <circle cx={x} cy={y} r="1.5" fill="var(--drawing-line)" />
        </g>
      ))}
      <text x="250" y="32" textAnchor="middle" className={s.small}>
        N 89°58′12″ E 120.00′
      </text>
      <text x="250" y="266" textAnchor="middle" className={s.small}>
        S 89°58′12″ W 120.00′
      </text>
      <text x="62" y="150" textAnchor="middle" className={s.small} transform="rotate(-90 62 150)">
        N 00°01′48″ W 75.00′
      </text>
      <text x="440" y="150" textAnchor="middle" className={s.small} transform="rotate(90 440 150)">
        S 00°01′48″ E 75.00′
      </text>
      <text x="56" y="262" className={cx(s.small, s.muted)}>
        P.O.B.
      </text>
      <text x="76" y="52" className={cx(s.small, s.muted)}>
        FIR ½″
      </text>
      <text x="400" y="52" className={cx(s.small, s.muted)}>
        FIR ½″
      </text>
      {/* Existing residence with hatch */}
      <defs>
        <pattern id="survey-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className={s.hatch} />
        </pattern>
      </defs>
      <rect x="150" y="140" width="180" height="86" fill="url(#survey-hatch)" className={s.line} />
      <text x="240" y="180" textAnchor="middle" className={s.label}>
        1-storey residence
      </text>
      <text x="240" y="194" textAnchor="middle" className={cx(s.small, s.muted)}>
        No. 412
      </text>
      {/* Proposed ADU */}
      <rect x="270" y="58" width="110" height="70" className={s.dashed} />
      <text x="325" y="90" textAnchor="middle" className={s.label}>
        Proposed ADU
      </text>
      <text x="325" y="104" textAnchor="middle" className={cx(s.small, s.muted)}>
        Footprint per site plan
      </text>
      <Dimension x1={395} y1={40} x2={395} y2={58} label={spec.rearDistance} labelX={403} labelY={53} />
      <Dimension x1={380} y1={138} x2={430} y2={138} label={spec.sideDistance} labelX={405} labelY={152} anchor="middle" />
      <NorthArrow x={480} y={70} />
      <text x="470" y="240" textAnchor="middle" className={cx(s.small, s.muted)}>
        Scale 1″ = 20′
      </text>
      <text x="470" y="252" textAnchor="middle" className={cx(s.small, s.muted)}>
        LB 5555
      </text>
    </svg>
  );
}
