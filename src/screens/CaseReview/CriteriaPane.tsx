import { useEffect, useRef } from 'react';
import { Check, CircleHelp, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { CriterionId, CriterionGroup, CriterionStatus } from '@/data/types';
import { GROUP_LABELS } from '@/data/types';
import { CRITERION_STATUS_META } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/cx';
import type { CriterionView } from '@/lib/caseReview';
import styles from './CriteriaPane.module.css';

interface CriteriaPaneProps {
  views: CriterionView[];
  selectedId: CriterionId | null;
  onSelect: (id: CriterionId) => void;
  countsLine: string;
  onNotCovered: () => void;
}

const ICONS: Record<CriterionStatus, LucideIcon> = { met: Check, not_met: TriangleAlert, unclear: CircleHelp };
const GROUPS: CriterionGroup[] = ['adu', 'solar', 'cross'];

/** Left pane: criteria in rulebook order under three group headings. Flagged rows are tinted. */
export function CriteriaPane({ views, selectedId, onSelect, countsLine, onNotCovered }: CriteriaPaneProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-criterion="${selectedId}"]`);
    if (el && document.activeElement?.closest('[data-criteria-list]')) el.focus();
  }, [selectedId]);

  return (
    <aside className={styles.pane} aria-label="Criteria">
      <div className={styles.count} data-criteria-count>
        {countsLine}
      </div>
      <div ref={listRef} className={styles.list} role="listbox" aria-label="Criteria" aria-activedescendant={selectedId ? `criterion-${selectedId}` : undefined} data-criteria-list>
        {GROUPS.map((group) => {
          const rows = views.filter((v) => v.group === group);
          if (rows.length === 0) return null;
          return (
            <div key={group} className={styles.group} role="group" aria-label={GROUP_LABELS[group]}>
              <div className={styles.groupLabel}>{GROUP_LABELS[group]}</div>
              {rows.map((v) => {
                const Icon = ICONS[v.status];
                const meta = CRITERION_STATUS_META[v.status];
                const selected = v.id === selectedId;
                return (
                  <button
                    key={v.id}
                    id={`criterion-${v.id}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    className={cx(styles.row, styles[`row_${v.status}`], selected && styles.rowSelected)}
                    onClick={() => onSelect(v.id)}
                    data-criterion={v.id}
                    data-status={v.status}
                  >
                    <span className={cx(styles.icon, styles[`icon_${v.status}`])} aria-hidden>
                      <Icon size={13} strokeWidth={2.5} />
                    </span>
                    <span className={cx(styles.id, 'tnum')}>{v.id}</span>
                    <span className={styles.name}>
                      {v.shortName}
                      {v.change && <span className={styles.changed}>Changed by reviewer</span>}
                    </span>
                    <span className={cx(styles.status, styles[`status_${v.status}`])}>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className={styles.foot}>
        <Button variant="link" onClick={onNotCovered} data-not-covered>
          What this review does not cover
        </Button>
      </div>
    </aside>
  );
}
