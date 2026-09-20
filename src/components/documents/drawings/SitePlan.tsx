import type { DrawingSitePlan } from '@/data/types';
import { cx } from '@/lib/cx';
import s from './Drawings.module.css';
import { Dimension, NorthArrow } from './parts';

/** Site plan with lot lines, the ADU footprint, and dimension callouts. */
export function SitePlan({ spec }: { spec: DrawingSitePlan }) {
  return (
    <svg viewBox="0 0 520 300" className={s.svg} role="img" aria-label={`Site plan showing the ADU footprint with a rear setback of ${spec.rearSetback} and a side setback of ${spec.sideSetback}`}>
      {/* Lot */}
      <rect x="60" y="30" width="340" height="232" className={s.lotLine} />
      <text x="230" y="24" textAnchor="middle" className={cx(s.label, s.small)}>
        Rear lot line
      </text>
      <text x="412" y="150" className={cx(s.label, s.small)} transform="rotate(90 412 150)" textAnchor="middle">
        Side lot line
      </text>
      {/* Street */}
      <line x1="40" y1="284" x2="420" y2="284" className={s.light} />
      <line x1="40" y1="292" x2="420" y2="292" className={s.light} />
      <text x="230" y="278" textAnchor="middle" className={cx(s.label, s.small, s.muted)}>
        Street
      </text>
      {/* Existing residence */}
      <rect x="130" y="148" width="190" height="92" className={s.fill} />
      <text x="225" y="190" textAnchor="middle" className={s.label}>
        Existing residence
      </text>
      <text x="225" y="204" textAnchor="middle" className={cx(s.small, s.muted)}>
        1 storey · solar array on roof
      </text>
      {/* Driveway */}
      <rect x="330" y="200" width="40" height="62" className={s.light} />
      {/* ADU */}
      <rect x="250" y="52" width="110" height="70" className={s.accentFill} />
      <text x="305" y="83" textAnchor="middle" className={s.label}>
        {spec.aduLabel}
      </text>
      <text x="305" y="97" textAnchor="middle" className={cx(s.small, s.muted)}>
        Proposed · detached
      </text>
      {/* Dimensions */}
      <Dimension x1={385} y1={30} x2={385} y2={52} label={spec.rearSetback} labelX={393} labelY={45} />
      <Dimension x1={360} y1={132} x2={400} y2={132} label={spec.sideSetback} labelX={380} labelY={146} anchor="middle" />
      <NorthArrow x={470} y={60} />
      <text x="66" y="250" className={cx(s.small, s.muted)}>
        Setbacks per §ADU-3 · Not to scale
      </text>
    </svg>
  );
}
