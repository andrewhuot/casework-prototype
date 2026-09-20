import { useState } from 'react';
import { ChevronRight, PenLine } from 'lucide-react';
import { useStore } from '@/app/store';
import { Button } from '@/components/ui/Button';
import { CriterionStatusChip, OutcomeChip, SourceChip } from '@/components/ui/Chip';
import type { CriterionView } from '@/lib/caseReview';
import { ChangeFindingDialog } from './dialogs';
import styles from './RuleCard.module.css';

interface RuleCardProps {
  caseId: string;
  view: CriterionView;
  next: string | null;
  onNext: () => void;
  notFound: string[];
}

/** The criterion's test, its source chip, Claude's finding, and similar past decisions. */
export function RuleCard({ caseId, view, next, onNext, notFound }: RuleCardProps) {
  const openDrawer = useStore((s) => s.openDrawer);
  const decided = useStore((s) => s.cases[caseId]?.status === 'decided' || s.cases[caseId]?.status === 'waiting');
  const [changeOpen, setChangeOpen] = useState(false);

  return (
    <div className={styles.card} data-rule-card={view.id}>
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <span className={styles.id}>{view.id}</span>
          <h2 className={styles.name}>{view.shortName}</h2>
          <CriterionStatusChip status={view.status} size="sm" />
          {view.change && <span className={styles.changedTag}>Changed by reviewer</span>}
        </div>
        <Button variant="secondary" size="sm" iconRight={ChevronRight} disabled={!next} onClick={onNext} data-next-flagged title={next ? `Go to ${next}` : 'No more flagged criteria'}>
          Next flagged
        </Button>
      </div>

      <div className={styles.grid}>
        <div className={styles.label}>Test</div>
        <div className={styles.test}>
          <span>{view.test}</span>
          <span className={styles.chips}>
            {view.citations.map((c) => (
              <SourceChip key={c.label} label={c.label} size="sm" onClick={() => openDrawer({ kind: 'source', sourceId: c.sourceId, section: c.section })} />
            ))}
          </span>
        </div>
        <div className={styles.label}>Finding</div>
        <div className={styles.finding} data-finding>
          <span>{view.finding}</span>
          {!decided && (
            <button type="button" className={styles.change} onClick={() => setChangeOpen(true)} data-change-finding>
              <PenLine size={11} aria-hidden />
              Change
            </button>
          )}
        </div>
        {view.change && (
          <>
            <div className={styles.label}>Reviewer</div>
            <div className={styles.changeNote}>
              Changed from {labelFor(view.change.from)} to {labelFor(view.change.to)}: {view.change.reason}
            </div>
          </>
        )}
        {notFound.length > 0 && (
          <>
            <div className={styles.label}>Quoted evidence</div>
            <ul className={styles.quoted}>
              {notFound.map((q) => (
                <li key={q}>“{q}”</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {view.precedents.length > 0 && (
        <div className={styles.precedents} data-precedents>
          <div className={styles.precedentsLabel}>Similar past decisions</div>
          <ul className={styles.precedentList}>
            {view.precedents.slice(0, 4).map((p) => (
              <li key={p.id}>
                <button type="button" className={styles.precedent} onClick={() => openDrawer({ kind: 'precedent', precedentId: p.id, caseId })} data-precedent={p.id}>
                  <span className={styles.precedentId}>{p.id}</span>
                  <OutcomeChip outcome={p.outcome} />
                  <span className={styles.precedentSummary} title={p.summary}>
                    {p.summary}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ChangeFindingDialog open={changeOpen} onClose={() => setChangeOpen(false)} caseId={caseId} view={view} />
    </div>
  );
}

function labelFor(status: CriterionView['status']): string {
  return status === 'met' ? 'Met' : status === 'not_met' ? 'Not met' : 'Unclear';
}
