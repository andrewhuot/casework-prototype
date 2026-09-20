import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/Dialog';
import { ProgressSteps, type StepState } from '@/components/ui/ProgressSteps';
import { useStore } from '@/app/store';
import { CASES_BY_ID } from '@/data/cases';
import { PACKETS } from '@/data/packets';
import { applicableCriteria } from '@/data/criteria';
import { providedDocuments } from '@/lib/documentText';
import { caseRulebookVersion } from '@/lib/rulebook';
import styles from './RunReviewDialog.module.css';

interface RunReviewDialogProps {
  caseId: string | null;
  onClose: () => void;
}

/** Three steps tick off over about three seconds, then the saved review loads and Case review opens. */
const STEP_TIMINGS = [1000, 2100, 3100];
const FINISH_AT = 3900;

export function RunReviewDialog({ caseId, onClose }: RunReviewDialogProps) {
  const navigate = useNavigate();
  const runReview = useStore((s) => s.runReview);
  const [done, setDone] = useState(0);
  const callbacks = useRef({ onClose, runReview, navigate });
  callbacks.current = { onClose, runReview, navigate };
  const meta = caseId ? CASES_BY_ID[caseId] : undefined;
  const packet = caseId ? PACKETS[caseId] : undefined;
  const documentCount = packet ? providedDocuments(packet).length : 0;
  const criteriaCount = meta ? applicableCriteria(meta.type).length : 0;
  const version = meta ? caseRulebookVersion(meta.filed) : '1.0';

  useEffect(() => {
    if (!caseId) return;
    setDone(0);
    const timers = STEP_TIMINGS.map((ms, i) => window.setTimeout(() => setDone(i + 1), ms));
    const finish = window.setTimeout(() => {
      void callbacks.current.runReview(caseId).then(() => {
        callbacks.current.onClose();
        callbacks.current.navigate(`/cases/${caseId}`);
      });
    }, FINISH_AT);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(finish);
    };
  }, [caseId]);

  const labels = [`Reading ${documentCount} documents`, `Checking ${criteriaCount} criteria against Rulebook v${version}`, 'Finding similar past decisions'];
  const steps = labels.map((label, i) => ({ label, state: (i < done ? 'done' : i === done ? 'active' : 'pending') as StepState }));

  return (
    <Dialog open={caseId !== null} title={meta ? `Reviewing ${meta.id}` : 'Reviewing'} description={meta ? `${meta.applicant} · ${meta.typeLabel}` : undefined} onClose={onClose} size="sm" locked hideClose kind="run-review">
      <div className={styles.body}>
        <ProgressSteps steps={steps} />
        <p className={styles.note}>In production this runs when the application arrives.</p>
      </div>
    </Dialog>
  );
}
