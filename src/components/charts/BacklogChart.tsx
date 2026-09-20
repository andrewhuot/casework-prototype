import { BACKLOG_SERIES, FIRST_REVIEW_WEEK } from '@/data/scoreboard';
import styles from './BacklogChart.module.css';

const W = 640;
const H = 240;
const PAD = { top: 28, right: 36, bottom: 34, left: 44 };
const Y_MIN = 250;
const Y_MAX = 450;

/** Open backlog over 12 weeks, falling from 412 to 286, with a marker at week 4. */
export function BacklogChart() {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (week: number) => PAD.left + ((week - 1) / (BACKLOG_SERIES.length - 1)) * innerW;
  const y = (v: number) => PAD.top + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * innerH;
  const points = BACKLOG_SERIES.map((d) => `${x(d.week).toFixed(1)},${y(d.backlog).toFixed(1)}`);
  const line = `M ${points.join(' L ')}`;
  const area = `${line} L ${x(BACKLOG_SERIES.length).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L ${x(1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;
  const first = BACKLOG_SERIES[0];
  const last = BACKLOG_SERIES[BACKLOG_SERIES.length - 1];
  const marker = BACKLOG_SERIES.find((d) => d.week === FIRST_REVIEW_WEEK);
  const yTicks = [250, 300, 350, 400, 450];

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={`Open backlog fell from ${first?.backlog} to ${last?.backlog} over 12 weeks. First review was switched on in week ${FIRST_REVIEW_WEEK}.`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={styles.grid} />
            <text x={PAD.left - 8} y={y(t) + 3.5} textAnchor="end" className={styles.tick}>
              {t}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} className={styles.axis} />
        {BACKLOG_SERIES.map((d) => (
          <text key={d.week} x={x(d.week)} y={H - 12} textAnchor="middle" className={styles.tick}>
            {d.week === 1 ? 'Wk 1' : d.week}
          </text>
        ))}
        <path d={area} className={styles.area} />
        <path d={line} className={styles.line} />
        {marker && (
          <g>
            <line x1={x(marker.week)} x2={x(marker.week)} y1={PAD.top - 6} y2={PAD.top + innerH} className={styles.marker} />
            <circle cx={x(marker.week)} cy={y(marker.backlog)} r="4.5" className={styles.markerDot} />
            <text x={x(marker.week) + 8} y={PAD.top - 10} className={styles.markerLabel}>
              First review switched on
            </text>
          </g>
        )}
        {first && (
          <g>
            <circle cx={x(first.week)} cy={y(first.backlog)} r="3.5" className={styles.dot} />
            <text x={x(first.week) - 2} y={y(first.backlog) - 10} textAnchor="start" className={styles.endLabel}>
              {first.backlog}
            </text>
          </g>
        )}
        {last && (
          <g>
            <circle cx={x(last.week)} cy={y(last.backlog)} r="3.5" className={styles.dot} />
            <text x={x(last.week) + 8} y={y(last.backlog) + 4} className={styles.endLabel}>
              {last.backlog}
            </text>
          </g>
        )}
      </svg>
      <figcaption className={styles.caption}>Open backlog, cases, by week. Week 1 is the start of the quarter.</figcaption>
    </figure>
  );
}
