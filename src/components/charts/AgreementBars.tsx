import { AGREEMENT, THRESHOLD } from '@/data/provingGround';
import { CRITERIA_BY_ID } from '@/data/criteria';
import { GROUP_LABELS, type CriterionGroup } from '@/data/types';
import { cx } from '@/lib/cx';
import styles from './AgreementBars.module.css';

const GROUPS: CriterionGroup[] = ['adu', 'solar', 'cross'];

/** One horizontal bar per criterion, grouped as in the spec, with the 90% threshold marked. */
export function AgreementBars() {
  return (
    <div className={styles.chart} role="img" aria-label="Agreement by criterion, with the 90 percent threshold marked">
      <div className={styles.header}>
        <span className={styles.headerLabel}>Criterion</span>
        <span className={styles.headerLabel}>Agreement with the original decision</span>
      </div>
      {GROUPS.map((group) => (
        <div key={group} className={styles.group}>
          <div className={styles.groupLabel}>{GROUP_LABELS[group]}</div>
          {AGREEMENT.filter((row) => CRITERIA_BY_ID[row.id].group === group).map((row) => {
            const below = row.agreement < THRESHOLD;
            return (
              <div key={row.id} className={styles.row} data-agreement={row.id}>
                <span className={styles.label}>
                  <span className={cx(styles.id, 'tnum')}>{row.id}</span>
                  <span className={styles.name}>{CRITERIA_BY_ID[row.id].shortName}</span>
                </span>
                <span className={styles.track}>
                  <span className={cx(styles.bar, below && styles.barBelow)} style={{ width: `${row.agreement}%` }} />
                  <span className={styles.threshold} style={{ left: `${THRESHOLD}%` }} aria-hidden />
                </span>
                <span className={cx(styles.value, 'tnum', below && styles.valueBelow)}>{row.agreement}%</span>
              </div>
            );
          })}
        </div>
      ))}
      <div className={styles.footer}>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} aria-hidden />
          At or above {THRESHOLD}%
        </span>
        <span className={styles.legendItem}>
          <span className={cx(styles.legendSwatch, styles.legendBelow)} aria-hidden />
          Below the {THRESHOLD}% threshold
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} aria-hidden />
          {THRESHOLD}% threshold
        </span>
      </div>
    </div>
  );
}
