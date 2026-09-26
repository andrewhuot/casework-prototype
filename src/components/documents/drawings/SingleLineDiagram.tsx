import type { DrawingSingleLine } from '@/data/types';
import { cx } from '@/lib/cx';
import s from './Drawings.module.css';

/** Single-line electrical diagram: array, inverter, disconnect, backfeed breaker, main panel (with a derated main breaker when given), meter. */
export function SingleLineDiagram({ spec }: { spec: DrawingSingleLine }) {
  const y = 90;
  return (
    <svg viewBox="0 0 520 220" className={s.svg} role="img" aria-label={`Single-line diagram showing the PV array, inverter, AC disconnect, a ${spec.backfeedBreaker} backfeed breaker and a ${spec.panelRating} main service panel${spec.mainBreaker ? ` with its main breaker derated to ${spec.mainBreaker}` : ''}`}>
      {/* PV array */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={20 + i * 14} y={y - 22} width="12" height="44" className={s.module} />
          <line x1={20 + i * 14} y1={y + 22} x2={32 + i * 14} y2={y - 22} className={s.hatch} />
        </g>
      ))}
      <text x="41" y={y + 38} textAnchor="middle" className={cx(s.label, s.small)}>
        PV array
      </text>
      <line x1="62" y1={y} x2="96" y2={y} className={s.line} />
      <text x="79" y={y - 6} textAnchor="middle" className={cx(s.small, s.muted)}>
        DC
      </text>
      {/* Inverter */}
      <rect x="96" y={y - 22} width="70" height="44" className={s.fill} />
      <path d={`M 112 ${y + 8} L 150 ${y - 8}`} className={s.line} />
      <text x="122" y={y - 8} className={cx(s.small)}>
        ~
      </text>
      <text x="140" y={y + 14} className={cx(s.small)}>
        =
      </text>
      <text x="131" y={y + 38} textAnchor="middle" className={cx(s.label, s.small)}>
        Inverter {spec.inverter}
      </text>
      <line x1="166" y1={y} x2="200" y2={y} className={s.line} />
      <text x="183" y={y - 6} textAnchor="middle" className={cx(s.small, s.muted)}>
        AC
      </text>
      {/* AC disconnect */}
      <rect x="200" y={y - 22} width="54" height="44" className={s.fill} />
      <circle cx="214" cy={y + 6} r="2.5" fill="var(--drawing-line)" />
      <circle cx="240" cy={y + 6} r="2.5" fill="var(--drawing-line)" />
      <line x1="214" y1={y + 6} x2="236" y2={y - 8} className={s.heavy} />
      <text x="227" y={y + 38} textAnchor="middle" className={cx(s.label, s.small)}>
        AC disconnect
      </text>
      <text x="227" y={y + 49} textAnchor="middle" className={cx(s.small, s.muted)}>
        lockable · exterior
      </text>
      <line x1="254" y1={y} x2="290" y2={y} className={s.line} />
      {/* Backfeed breaker */}
      <line x1="290" y1={y} x2="304" y2={y - 10} className={s.heavy} />
      <circle cx="290" cy={y} r="2.5" fill="var(--drawing-line)" />
      <circle cx="308" cy={y} r="2.5" fill="var(--drawing-line)" />
      <text x="299" y={y - 16} textAnchor="middle" className={s.dimText}>
        {spec.backfeedBreaker}
      </text>
      <text x="299" y={y + 18} textAnchor="middle" className={cx(s.small, s.muted)}>
        backfeed
      </text>
      <line x1="308" y1={y} x2="330" y2={y} className={s.line} />
      {/* Main panel */}
      <rect x="330" y={y - 40} width="96" height="80" className={s.accentFill} />
      <text x="378" y={y - 22} textAnchor="middle" className={cx(s.label, s.small)}>
        Main service
      </text>
      <text x="378" y={y - 11} textAnchor="middle" className={cx(s.label, s.small)}>
        panel
      </text>
      <text x="378" y={spec.mainBreaker ? y + 6 : y + 10} textAnchor="middle" className={s.dimText} style={{ fontSize: 14 }}>
        {spec.panelRating}
      </text>
      {spec.mainBreaker ? (
        <>
          <text x="378" y={y + 20} textAnchor="middle" className={cx(s.small, s.muted)}>
            busbar · no upgrade
          </text>
          <text x="378" y={y + 32} textAnchor="middle" className={cx(s.small, s.dimText)}>
            main {spec.mainBreaker}, derated
          </text>
        </>
      ) : (
        <text x="378" y={y + 28} textAnchor="middle" className={cx(s.small, s.muted)}>
          existing · no upgrade
        </text>
      )}
      <line x1="426" y1={y} x2="456" y2={y} className={s.line} />
      {/* Meter */}
      <circle cx="470" cy={y} r="14" className={s.fill} />
      <text x="470" y={y + 4} textAnchor="middle" className={s.label}>
        M
      </text>
      <line x1="484" y1={y} x2="508" y2={y} className={s.line} />
      <text x="470" y={y + 32} textAnchor="middle" className={cx(s.label, s.small)}>
        Utility
      </text>
      {/* Subpanel branch */}
      {spec.subpanel && (
        <g>
          <line x1="378" y1={y + 40} x2="378" y2={y + 78} className={s.line} />
          <rect x="330" y={y + 78} width="96" height="40" className={s.dashed} />
          <text x="378" y={y + 95} textAnchor="middle" className={cx(s.label, s.small)}>
            {spec.subpanel} ADU subpanel
          </text>
          <text x="378" y={y + 108} textAnchor="middle" className={cx(s.small, s.muted)}>
            new · fed from main
          </text>
        </g>
      )}
    </svg>
  );
}
