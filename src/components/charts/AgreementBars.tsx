import { AGREEMENT, THRESHOLD } from '@/data/provingGround';
import { CRITERIA_BY_ID } from '@/data/criteria';
import { GROUP_LABELS, type CriterionGroup, type CriterionId } from '@/data/types';
import { cx } from '@/lib/cx';
import styles from './AgreementBars.module.css';

const GROUPS: CriterionGroup[] = ['adu', 'solar', 'cross'];
const MIN = 70;
const MAX = 100;
const TICKS = [70, 80, 90, 100];
const at = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`;

/**
 * A dot plot per criterion: the ring is agreement with the original decision,
 * the dot is the golden-set score after blind settling, and the line between
 * them is what settling credited to Claude. The dashed line is the city's
 * threshold for First review, which applies to the golden set. The axis starts
 * at 70% so the gaps are readable; dots, not bars, so a cut axis does not
 * mislead.
 */
export function AgreementBars({ goldenSet }: { goldenSet: Record<CriterionId, number> }) {
  return (
    <div className={styles.chart} role="img" aria-label="By criterion: agreement with the original decision and score on the golden set, with the 90 percent threshold for First review marked. The table view is the numbers at the right of each row.">
      <div className={styles.header}>
        <span className={styles.headerLabel}>Criterion</span>
        <span />
        <span className={cx(styles.headerLabel, styles.right)}>Agreed</span>
        <span className={cx(styles.headerLabel, styles.right)}>Golden set</span>
      </div>
      {GROUPS.map((group) => (
        <div key={group} className={styles.group}>
          <div className={styles.groupLabel}>{GROUP_LABELS[group]}</div>
          {AGREEMENT.filter((row) => CRITERIA_BY_ID[row.id].group === group).map((row) => {
            const golden = goldenSet[row.id];
            const below = golden < THRESHOLD;
            const name = CRITERIA_BY_ID[row.id].shortName;
            return (
              <div
                key={row.id}
                className={styles.row}
                data-agreement={row.id}
                data-golden-set={golden}
                data-below={below ? 'true' : undefined}
                title={`${row.id} ${name}: agreed ${row.agreement}%, golden set ${golden}%${below ? `, below the ${THRESHOLD}% threshold` : ''}`}
              >
                <span className={styles.label}>
                  <span className={cx(styles.id, 'tnum')}>{row.id}</span>
                  <span className={styles.name}>{name}</span>
                  {below && <span className={styles.belowTag}>Second reader</span>}
                </span>
                <span className={styles.track}>
                  {TICKS.map((t) => (
                    <span key={t} className={styles.grid} style={{ left: at(t) }} aria-hidden />
                  ))}
                  <span className={styles.threshold} style={{ left: at(THRESHOLD) }} aria-hidden />
                  <span className={styles.span} style={{ left: at(row.agreement), width: `calc(${at(golden)} - ${at(row.agreement)})` }} aria-hidden />
                  <span className={styles.ring} style={{ left: at(row.agreement) }} aria-hidden />
                  <span className={cx(styles.dot, below && styles.dotBelow)} style={{ left: at(golden) }} aria-hidden />
                </span>
                <span className={cx(styles.value, styles.muted, 'tnum')}>{row.agreement}%</span>
                <span className={cx(styles.value, 'tnum', below && styles.valueBelow)} data-golden-value>
                  {golden}%
                </span>
              </div>
            );
          })}
        </div>
      ))}
      <div className={styles.axis} aria-hidden>
        <span />
        <span className={styles.axisTrack}>
          {TICKS.map((t) => (
            <span key={t} className={styles.tick} style={{ left: at(t) }}>
              {t}%
            </span>
          ))}
        </span>
      </div>
      <div className={styles.footer}>
        <span className={styles.legendItem}>
          <span className={styles.legendRing} aria-hidden />
          Agreed with the original decision
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} aria-hidden />
          Golden set, after blind settling
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} aria-hidden />
          {THRESHOLD}%: threshold for First review
        </span>
      </div>
    </div>
  );
}
