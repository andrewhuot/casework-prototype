import { Check, Loader2 } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './ProgressSteps.module.css';

export type StepState = 'pending' | 'active' | 'done';

interface ProgressStepsProps {
  steps: { label: string; state: StepState }[];
  className?: string;
}

/** Three steps that tick off in turn. A wait is easier when you can see the work. */
export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <ol className={cx(styles.list, className)} aria-live="polite">
      {steps.map((step, i) => (
        <li key={step.label} className={cx(styles.step, styles[step.state])} data-step-state={step.state}>
          <span className={styles.marker} aria-hidden>
            {step.state === 'done' ? <Check size={13} strokeWidth={3} className={styles.check} /> : step.state === 'active' ? <Loader2 size={14} className={styles.spinner} /> : <span className={cx(styles.index, 'tnum')}>{i + 1}</span>}
          </span>
          <span className={styles.label}>
            {step.label}
            <span className="sr-only">{step.state === 'done' ? ', done' : step.state === 'active' ? ', in progress' : ', pending'}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
