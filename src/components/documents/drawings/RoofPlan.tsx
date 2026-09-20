import type { DrawingRoofPlan } from '@/data/types';
import { cx } from '@/lib/cx';
import s from './Drawings.module.css';
import { Dimension, NorthArrow } from './parts';

/** Roof plan with the array, the 36 in pathway, and the ridge setback. */
export function RoofPlan({ spec }: { spec: DrawingRoofPlan }) {
  const roof = { x: 60, y: 30, w: 400, h: 240 };
  const ridgeY = 140;
  const pathwayW = 30;
  const setback = 15;
  const moduleW = 33;
  const moduleH = 54;
  const gap = 3;
  const cols = Math.ceil(spec.modules / 2);
  const startX = roof.x + pathwayW + 6;
  const rowY = [ridgeY + setback, ridgeY + setback + moduleH + gap + 1];
  const modules: { x: number; y: number }[] = [];
  for (let i = 0; i < spec.modules; i++) {
    const row = i < cols ? 0 : 1;
    const col = row === 0 ? i : i - cols;
    modules.push({ x: startX + col * (moduleW + gap), y: rowY[row] ?? rowY[0] ?? 0 });
  }
  const arrayRight = startX + cols * (moduleW + gap) - gap;
  return (
    <svg viewBox="0 0 520 300" className={s.svg} role="img" aria-label={`Roof plan showing ${spec.modules} modules with a ${spec.pathway} pathway from eave to ridge and a ${spec.ridgeSetback} ridge setback`}>
      <rect x={roof.x} y={roof.y} width={roof.w} height={roof.h} className={s.fill} />
      <line x1={roof.x} y1={ridgeY} x2={roof.x + roof.w} y2={ridgeY} className={s.heavy} />
      <text x={roof.x + roof.w / 2} y={ridgeY - 6} textAnchor="middle" className={s.label}>
        Ridge
      </text>
      <text x={roof.x + roof.w / 2} y={roof.y + 50} textAnchor="middle" className={cx(s.label, s.muted)}>
        North plane · no modules
      </text>
      <text x={roof.x + roof.w / 2} y={roof.y + roof.h + 14} textAnchor="middle" className={cx(s.label, s.small)}>
        Eave
      </text>
      {/* Pathway */}
      <rect x={roof.x} y={ridgeY} width={pathwayW} height={roof.h - (ridgeY - roof.y)} className={s.pathway} />
      <text x={roof.x + pathwayW / 2} y={ridgeY + 62} textAnchor="middle" className={s.dimText} transform={`rotate(-90 ${roof.x + pathwayW / 2} ${ridgeY + 62})`}>
        {spec.pathway} pathway
      </text>
      {/* Modules */}
      {modules.map((m, i) => (
        <rect key={i} x={m.x} y={m.y} width={moduleW} height={moduleH} className={s.module} />
      ))}
      {modules.map((m, i) => (
        <line key={`c${i}`} x1={m.x + moduleW / 2} y1={m.y + 4} x2={m.x + moduleW / 2} y2={m.y + moduleH - 4} className={s.hatch} />
      ))}
      <text x={startX + (arrayRight - startX) / 2} y={rowY[1] !== undefined ? rowY[1] + moduleH + 14 : ridgeY + 90} textAnchor="middle" className={cx(s.small, s.muted)}>
        {spec.modules} modules · south plane
      </text>
      {/* Ridge setback dimension */}
      <Dimension x1={arrayRight + 14} y1={ridgeY} x2={arrayRight + 14} y2={ridgeY + setback} label={`${spec.ridgeSetback} ridge setback`} labelX={arrayRight + 22} labelY={ridgeY + 12} />
      <NorthArrow x={490} y={58} />
    </svg>
  );
}
