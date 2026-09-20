import { useState } from 'react';
import { useStore } from '@/app/store';
import { POLICY_LEAD_NAME } from '@/data/cases';
import { CRITERIA_BY_ID, PROPOSED_S2_TEST } from '@/data/criteria';
import { R6_QUOTE_SECTION, SOURCES_BY_ID } from '@/data/sources';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { SourceChip } from '@/components/ui/Chip';
import { TextField } from '@/components/ui/Field';
import { cx } from '@/lib/cx';
import { DEMO_DATE, formatDate, formatDateWithWeekday, nextBusinessDay } from '@/lib/dates';
import { wordDiff } from '@/lib/diff';
import styles from './ProposedChangeDialog.module.css';

interface ProposedChangeDialogProps {
  open: boolean;
  onClose: () => void;
}

export const IMPACT_LINE = 'On closed cases, 37 of 1,200 outcomes would have differed. 5 open solar cases were filed earlier and keep v1.0.';

/** Current S2 on the left, proposed on the right, the difference marked, the passage from R6 quoted, and the impact and effective date before the buttons. */
export function ProposedChangeDialog({ open, onClose }: ProposedChangeDialogProps) {
  const approveChange = useStore((s) => s.approveChange);
  const rejectChange = useStore((s) => s.rejectChange);
  const pushToast = useStore((s) => s.pushToast);
  const openDrawer = useStore((s) => s.openDrawer);
  const [effective, setEffective] = useState(nextBusinessDay(DEMO_DATE));
  const current = CRITERIA_BY_ID.S2.test;
  const segments = wordDiff(current, PROPOSED_S2_TEST);
  const passage = SOURCES_BY_ID.R6?.sections.find((s) => s.label === R6_QUOTE_SECTION);

  const approve = () => {
    approveChange();
    onClose();
    pushToast({ message: `Rulebook v1.1 published by ${POLICY_LEAD_NAME}. It applies to applications filed from ${formatDate(effective)}.` });
  };
  const reject = () => {
    rejectChange();
    onClose();
    pushToast({ message: 'Change rejected. The bulletin stays in the library as a reference.', kind: 'info' });
  };

  return (
    <Dialog
      open={open}
      title="Proposed change to S2, Roof access pathways"
      description="Claude read the Fire Marshal bulletin and proposes one change to the rulebook. Nothing changes until a person approves it."
      onClose={onClose}
      size="lg"
      kind="proposed-change"
      footer={
        <>
          <Button onClick={reject} data-reject-change>
            Reject
          </Button>
          <Button variant="primary" onClick={approve} data-approve-change>
            Approve change
          </Button>
        </>
      }
    >
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.columnLabel}>Current · Rulebook v1.0</div>
          <p className={styles.text} data-current-test>
            {segments
              .filter((s) => s.kind !== 'added')
              .map((s, i) => (
                <span key={i} className={cx(s.kind === 'removed' && styles.removed)}>
                  {s.text}
                </span>
              ))}
          </p>
          <div className={styles.chips}>
            <SourceChip label="R2 §RS-3" size="sm" onClick={() => openDrawer({ kind: 'source', sourceId: 'R2', section: '§RS-3' })} />
          </div>
        </div>
        <div className={cx(styles.column, styles.columnProposed)}>
          <div className={styles.columnLabel}>Proposed · Rulebook v1.1</div>
          <p className={styles.text} data-proposed-test>
            {segments
              .filter((s) => s.kind !== 'removed')
              .map((s, i) => (
                <span key={i} className={cx(s.kind === 'added' && styles.added)}>
                  {s.text}
                </span>
              ))}
          </p>
          <div className={styles.chips}>
            <SourceChip label="R2 §RS-3" size="sm" onClick={() => openDrawer({ kind: 'source', sourceId: 'R2', section: '§RS-3' })} />
            <SourceChip label="R6 §2" size="sm" onClick={() => openDrawer({ kind: 'source', sourceId: 'R6', section: '§2' })} />
          </div>
        </div>
      </div>

      {passage && (
        <blockquote className={styles.passage}>
          <div className={styles.passageLabel}>Quoted passage</div>
          <p>{passage.text}</p>
          <div className={styles.passageChip}>
            <SourceChip label={`R6 ${R6_QUOTE_SECTION}`} size="sm" onClick={() => openDrawer({ kind: 'source', sourceId: 'R6', section: R6_QUOTE_SECTION })} />
          </div>
        </blockquote>
      )}

      <p className={styles.impact} data-impact-line>
        {IMPACT_LINE}
      </p>

      <TextField
        label="Applies to applications filed on or after"
        type="date"
        value={effective}
        min={DEMO_DATE}
        onChange={(e) => e.target.value && setEffective(e.target.value)}
        helper={`${formatDateWithWeekday(effective)}. Earlier applications keep Rulebook v1.0. No rule changes in the middle of an application.`}
        className={styles.date}
        data-effective-date
      />
    </Dialog>
  );
}
