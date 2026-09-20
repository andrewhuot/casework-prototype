import { CalendarDays, MapPin } from 'lucide-react';
import { useStore } from '@/app/store';
import { CRITERIA_BY_ID } from '@/data/criteria';
import { PRECEDENTS_BY_ID } from '@/data/precedents';
import { Chip, OutcomeChip, SourceChip } from '@/components/ui/Chip';
import { formatDate } from '@/lib/dates';
import styles from './drawers.module.css';

/** One prior decision from R5: outcome, facts, decision, and why it resembles the open case. */
export function PastDecision({ precedentId }: { precedentId: string }) {
  const precedent = PRECEDENTS_BY_ID[precedentId];
  const openDrawer = useStore((s) => s.openDrawer);
  if (!precedent) return <p className={styles.prose}>This decision is not in the library.</p>;
  const criterion = CRITERIA_BY_ID[precedent.criterion];
  return (
    <div>
      <div className={styles.meta}>
        <OutcomeChip outcome={precedent.outcome} size="md" />
        <Chip tone="neutral" size="sm">
          {criterion.id} · {criterion.shortName}
        </Chip>
        <span className={styles.metaItem}>
          <CalendarDays size={13} aria-hidden />
          Decided {formatDate(precedent.decided)}
        </span>
        <span className={styles.metaItem}>
          <MapPin size={13} aria-hidden />
          {precedent.address}
        </span>
      </div>
      <p className={styles.summary}>{precedent.summary}</p>
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Facts</div>
        <p className={styles.prose}>{precedent.facts}</p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Decision</div>
        <p className={styles.prose}>{precedent.decision}</p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Why it is similar</div>
        <p className={styles.prose}>{precedent.similarity}</p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Source</div>
        <SourceChip label="R5" onClick={() => openDrawer({ kind: 'source', sourceId: 'R5' })} />
      </div>
    </div>
  );
}
