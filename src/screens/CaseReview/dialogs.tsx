import { useEffect, useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useStore } from '@/app/store';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { RadioGroup, TextArea } from '@/components/ui/Field';
import { Banner } from '@/components/ui/Banner';
import { NOT_COVERED } from '@/data/notCovered';
import type { CriterionStatus } from '@/data/types';
import type { CriterionView } from '@/lib/caseReview';
import styles from './dialogs.module.css';

/** "What this review does not cover": honest limits prevent over-trust. */
export function NotCoveredDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} title={NOT_COVERED.title} onClose={onClose} size="sm" kind="not-covered" footer={<Button variant="primary" onClick={onClose}>Close</Button>}>
      <p className={styles.prose}>{NOT_COVERED.intro}</p>
      <ul className={styles.bullets}>
        {NOT_COVERED.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className={styles.prose}>{NOT_COVERED.outro}</p>
    </Dialog>
  );
}

interface ChangeFindingDialogProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  view: CriterionView;
}

/** A reviewer can change a finding to Met, Not met, or Unclear, with a reason. */
export function ChangeFindingDialog({ open, onClose, caseId, view }: ChangeFindingDialogProps) {
  const changeCriterion = useStore((s) => s.changeCriterion);
  const pushToast = useStore((s) => s.pushToast);
  const [status, setStatus] = useState<CriterionStatus>(view.status);
  const [reason, setReason] = useState(view.change?.reason ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStatus(view.status);
      setReason(view.change?.reason ?? '');
      setError(null);
    }
  }, [open, view]);

  const submit = () => {
    if (status !== view.originalStatus && reason.trim().length === 0) {
      setError('Give a reason for the change. It goes in the decision record.');
      return;
    }
    changeCriterion(caseId, view.id, status, reason.trim());
    onClose();
    if (status !== view.originalStatus) pushToast({ message: `${view.id} changed to ${labelFor(status)} by reviewer.`, kind: 'info' });
    else if (view.change) pushToast({ message: `${view.id} restored to Claude's finding.`, kind: 'info' });
  };

  return (
    <Dialog
      open={open}
      title={`Change finding for ${view.id}`}
      description={`Claude found: ${labelFor(view.originalStatus)}. Your change is recorded with your reason.`}
      onClose={onClose}
      size="sm"
      kind="change-finding"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} data-confirm>
            Save change
          </Button>
        </>
      }
    >
      <div className={styles.stack}>
        <RadioGroup
          label="Status"
          name="finding-status"
          value={status}
          onChange={(v) => setStatus(v as CriterionStatus)}
          options={[
            { value: 'met', label: 'Met' },
            { value: 'not_met', label: 'Not met' },
            { value: 'unclear', label: 'Unclear' },
          ]}
        />
        <TextArea label="Reason" required={status !== view.originalStatus} value={reason} onChange={(e) => setReason(e.target.value)} error={error} placeholder="Why the finding is being changed" rows={3} />
      </div>
    </Dialog>
  );
}

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
}

/** "2 criteria are not met and 1 is unclear. Approve anyway?" with a typed reason. */
export function ApproveAnywayDialog({ open, onClose, onConfirm, summary }: ReasonDialogProps & { summary: string }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setReason('');
      setError(null);
    }
  }, [open]);
  const submit = () => {
    if (reason.trim().length === 0) {
      setError('A reason is required. It goes in the decision record.');
      return;
    }
    onConfirm(reason.trim());
  };
  return (
    <Dialog
      open={open}
      alert
      title={`${summary}. Approve anyway?`}
      description="Approving now issues the permit and sends the approval notice. Your reason is recorded."
      onClose={onClose}
      size="sm"
      kind="approve-anyway"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} data-confirm>
            Approve and issue permit
          </Button>
        </>
      }
    >
      <TextArea label="Reason for approving" required value={reason} onChange={(e) => setReason(e.target.value)} error={error} placeholder="For example: waiver granted on the setback; certificate received by phone" rows={3} />
    </Dialog>
  );
}

/** Escalate asks for a short internal note and sends nothing to the applicant. */
export function EscalateDialog({ open, onClose, onConfirm }: ReasonDialogProps) {
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setNote('');
      setError(null);
    }
  }, [open]);
  const submit = () => {
    if (note.trim().length === 0) {
      setError('Add a short note for the senior reviewer.');
      return;
    }
    onConfirm(note.trim());
  };
  return (
    <Dialog
      open={open}
      title="Escalate to senior reviewer"
      description="Nothing is sent to the applicant. The case moves to a senior reviewer with your note."
      onClose={onClose}
      size="sm"
      kind="escalate"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} data-confirm>
            Escalate
          </Button>
        </>
      }
    >
      <TextArea label="Internal note" required value={note} onChange={(e) => setNote(e.target.value)} error={error} placeholder="What the senior reviewer should look at" rows={3} />
    </Dialog>
  );
}

/** Deny requires a typed reason and shows the adverse-action notice. Claude never proposes it. */
export function DenyDialog({ open, onClose, onConfirm }: ReasonDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setReason('');
      setError(null);
    }
  }, [open]);
  const submit = () => {
    if (reason.trim().length === 0) {
      setError('A reason is required. It appears in the letter and the decision record.');
      return;
    }
    onConfirm(reason.trim());
  };
  return (
    <Dialog
      open={open}
      alert
      title="Deny this application"
      onClose={onClose}
      size="sm"
      kind="deny"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={submit} data-confirm>
            Deny and send letter
          </Button>
        </>
      }
    >
      <div className={styles.stack}>
        <Banner tone="warning" icon={TriangleAlert}>
          This starts an adverse action. The letter will explain how to appeal.
        </Banner>
        <TextArea label="Reason for denial" required value={reason} onChange={(e) => setReason(e.target.value)} error={error} placeholder="Written in plain language; the applicant will read it" rows={3} />
      </div>
    </Dialog>
  );
}

function labelFor(status: CriterionStatus): string {
  return status === 'met' ? 'Met' : status === 'not_met' ? 'Not met' : 'Unclear';
}
