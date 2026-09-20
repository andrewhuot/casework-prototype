import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Check, Clock, CircleHelp, TriangleAlert, Stamp, CircleX, CircleCheck, BookMarked, Scale, ScrollText, Gavel } from 'lucide-react';
import { cx } from '@/lib/cx';
import type { CaseStatus, CriterionStatus, PrecedentOutcome, SourceType } from '@/data/types';
import styles from './Chip.module.css';

export type Tone = 'blue' | 'green' | 'amber' | 'violet' | 'slate' | 'neutral' | 'red';

interface ChipProps {
  tone: Tone;
  icon?: LucideIcon | 'dot';
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

/** Base chip. Status always carries an icon and a text label, never colour alone. */
export function Chip({ tone, icon, children, size = 'md', className, title }: ChipProps) {
  const Icon = icon === 'dot' ? null : icon;
  return (
    <span className={cx(styles.chip, styles[tone], styles[size], className)} title={title}>
      {icon === 'dot' ? <span className={styles.dot} aria-hidden /> : Icon ? <Icon size={size === 'sm' ? 12 : 13} strokeWidth={2.25} aria-hidden /> : null}
      <span>{children}</span>
    </span>
  );
}

export const CASE_STATUS_META: Record<CaseStatus, { label: string; tone: Tone; icon: LucideIcon | 'dot' }> = {
  new: { label: 'New', tone: 'blue', icon: 'dot' },
  approve_ready: { label: 'Approve-ready', tone: 'green', icon: Check },
  needs_information: { label: 'Needs information', tone: 'amber', icon: TriangleAlert },
  needs_judgment: { label: 'Needs judgment', tone: 'violet', icon: CircleHelp },
  waiting: { label: 'Waiting on applicant', tone: 'slate', icon: Clock },
  decided: { label: 'Decided', tone: 'neutral', icon: Stamp },
};

export function StatusChip({ status, size, className }: { status: CaseStatus; size?: 'sm' | 'md'; className?: string }) {
  const meta = CASE_STATUS_META[status];
  return (
    <Chip tone={meta.tone} icon={meta.icon} size={size} className={className}>
      {meta.label}
    </Chip>
  );
}

export const CRITERION_STATUS_META: Record<CriterionStatus, { label: string; tone: Tone; icon: LucideIcon }> = {
  met: { label: 'Met', tone: 'green', icon: Check },
  not_met: { label: 'Not met', tone: 'amber', icon: TriangleAlert },
  unclear: { label: 'Unclear', tone: 'violet', icon: CircleHelp },
};

export function CriterionStatusChip({ status, size, className }: { status: CriterionStatus; size?: 'sm' | 'md'; className?: string }) {
  const meta = CRITERION_STATUS_META[status];
  return (
    <Chip tone={meta.tone} icon={meta.icon} size={size} className={className}>
      {meta.label}
    </Chip>
  );
}

export const OUTCOME_META: Record<PrecedentOutcome, { label: string; tone: Tone; icon: LucideIcon }> = {
  approved_with_waiver: { label: 'Approved with waiver', tone: 'green', icon: CircleCheck },
  approved_after_revision: { label: 'Approved after revision', tone: 'green', icon: CircleCheck },
  denied: { label: 'Denied', tone: 'red', icon: CircleX },
};

export function OutcomeChip({ outcome, size = 'sm', className }: { outcome: PrecedentOutcome; size?: 'sm' | 'md'; className?: string }) {
  const meta = OUTCOME_META[outcome];
  return (
    <Chip tone={meta.tone} icon={meta.icon} size={size} className={className}>
      {meta.label}
    </Chip>
  );
}

export const SOURCE_TYPE_META: Record<SourceType, { label: string; icon: LucideIcon }> = {
  regulation: { label: 'Regulation', icon: Scale },
  internal_manual: { label: 'Internal manual', icon: ScrollText },
  prior_decisions: { label: 'Prior decisions', icon: Gavel },
};

export function TypeTag({ type, className }: { type: SourceType; className?: string }) {
  const meta = SOURCE_TYPE_META[type];
  return (
    <span className={cx(styles.typeTag, className)}>
      <meta.icon size={12} strokeWidth={2} aria-hidden />
      {meta.label}
    </span>
  );
}

/** Small neutral label, for example "Saved review" or "Updated in v1.1". */
export function Tag({ children, tone = 'neutral', icon: Icon, className, ...rest }: { children: ReactNode; tone?: Tone; icon?: LucideIcon; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx(styles.tag, styles[`tag_${tone}`], className)} {...rest}>
      {Icon ? <Icon size={11} strokeWidth={2.25} aria-hidden /> : null}
      {children}
    </span>
  );
}

/**
 * Source chip. Looks the same everywhere, for example "R1 §ADU-3".
 * Renders as a button that opens the Source viewer.
 */
export function SourceChip({ label, onClick, className, size = 'md' }: { label: string; onClick?: () => void; className?: string; size?: 'sm' | 'md' }) {
  return (
    <button type="button" className={cx(styles.sourceChip, styles[size], className)} onClick={onClick} aria-label={`Open source ${label}`}>
      <BookMarked size={size === 'sm' ? 11 : 12} strokeWidth={2.25} aria-hidden />
      <span className="tnum">{label}</span>
    </button>
  );
}
