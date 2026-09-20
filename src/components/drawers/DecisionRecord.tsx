import type { LucideIcon } from 'lucide-react';
import { BellRing, CalendarClock, FileText, Languages, ListChecks, PenLine, Send, Sparkles, Stamp, User, History } from 'lucide-react';
import { useStore } from '@/app/store';
import { CASES_BY_ID } from '@/data/cases';
import { REVIEW_MODEL } from '@/data/reviews';
import { applicableCriteria } from '@/data/criteria';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/cx';
import { DEMO_DATE, formatDate } from '@/lib/dates';
import { caseRulebookVersion } from '@/lib/rulebook';
import styles from './drawers.module.css';

interface Event {
  icon: LucideIcon;
  tone?: 'accent' | 'done';
  title: string;
  date: string;
  detail?: React.ReactNode;
}

function lineDiff(before: string, after: string): { removed: string[]; added: string[] } {
  const a = before.split('\n');
  const b = after.split('\n');
  const removed = a.filter((line) => line.trim() && !b.includes(line));
  const added = b.filter((line) => line.trim() && !a.includes(line));
  return { removed, added };
}

/** A timeline of everything that happened to the case, for an appeals officer or an inspector general. */
export function DecisionRecord({ caseId }: { caseId: string }) {
  const meta = CASES_BY_ID[caseId];
  const state = useStore((s) => s.cases[caseId]);
  const published = useStore((s) => s.rulebookVersion === '1.1');
  const openDrawer = useStore((s) => s.openDrawer);
  if (!meta || !state) return <p className={styles.prose}>No record for this case.</p>;

  const version = caseRulebookVersion(meta.filed, published);
  const total = applicableCriteria(meta.type).length;
  const decision = state.decision;
  const reviewDate = meta.initialStatus === 'new' ? DEMO_DATE : meta.filed;
  const events: Event[] = [];

  for (const [i, req] of meta.previousRequests.entries()) {
    events.push({ icon: History, title: `Request ${i + 1} sent`, date: formatDate(req.sent), detail: req.summary });
    if (req.replied) events.push({ icon: History, title: 'Applicant replied', date: formatDate(req.replied), detail: 'Resubmitted documents were added to the packet.' });
  }

  events.push({
    icon: Sparkles,
    tone: 'accent',
    title: 'Review generated',
    date: formatDate(reviewDate),
    detail: `Saved review · Rulebook v${version} · ${REVIEW_MODEL}`,
  });

  events.push({
    icon: ListChecks,
    title: 'Criteria opened',
    date: formatDate(DEMO_DATE),
    detail: state.openedCriteria.length > 0 ? `${state.openedCriteria.join(', ')} (${state.openedCriteria.length} of ${total})` : 'None recorded',
  });

  const changes = Object.entries(state.changes);
  if (changes.length > 0) {
    events.push({
      icon: PenLine,
      title: 'Findings changed by reviewer',
      date: formatDate(DEMO_DATE),
      detail: (
        <ul>
          {changes.map(([id, c]) => (
            <li key={id}>
              {id}: {c?.from.replace('_', ' ')} → {c?.to.replace('_', ' ')}. {c?.reason}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (decision?.kind === 'request_sent' && state.review) {
    const diff = lineDiff(state.review.letter, decision.letterSent ?? '');
    events.push({
      icon: PenLine,
      title: state.letterEdited ? 'Letter edited' : 'Letter sent as drafted',
      date: formatDate(DEMO_DATE),
      detail: state.letterEdited ? (
        <div>
          <div>
            {diff.removed.length + diff.added.length} {diff.removed.length + diff.added.length === 1 ? 'line' : 'lines'} changed by the reviewer
          </div>
          <div className={styles.diff}>
            {diff.removed.map((l, i) => (
              <div key={`r${i}`} className={cx(styles.diffLine, styles.diffRemoved)}>
                {l}
              </div>
            ))}
            {diff.added.map((l, i) => (
              <div key={`a${i}`} className={cx(styles.diffLine, styles.diffAdded)}>
                {l}
              </div>
            ))}
          </div>
        </div>
      ) : (
        'No edits to the draft.'
      ),
    });
  }

  if (decision) {
    const ActionIcon = decision.kind === 'request_sent' ? Send : Stamp;
    events.push({
      icon: ActionIcon,
      tone: 'done',
      title: decision.outcomeLabel,
      date: formatDate(decision.at),
      detail: decision.reason ? `Reason: ${decision.reason}` : decision.note ? `Internal note: ${decision.note}` : decision.kind === 'request_sent' ? 'One consolidated request for information.' : undefined,
    });
  }

  if (decision?.kind === 'request_sent' && decision.sendOptions) {
    const opts = decision.sendOptions;
    events.push({ icon: CalendarClock, title: 'Reply due', date: formatDate(opts.replyDue), detail: `${formatDate(opts.replyDue)}. The days-in-queue clock is paused until the applicant replies.` });
    const channels = [opts.remindEmail && 'email', opts.remindText && 'text message', opts.remindCall && 'virtual agent call'].filter(Boolean) as string[];
    const dates = decision.reminderDates ?? [];
    events.push({
      icon: BellRing,
      title: 'Reminders scheduled',
      date: dates.length ? dates.map(formatDate).join(' and ') : '',
      detail: channels.length ? `By ${channels.join(' and ')} on ${dates.map(formatDate).join(' and ')}. Reminders stop when the applicant replies.` : 'No reminders were selected.',
    });
    if (meta.preferredLanguage) {
      events.push({
        icon: Languages,
        title: 'Spanish copy',
        date: formatDate(decision.at),
        detail: opts.spanishCopy ? 'Sent with the request. The copy was updated to match the reviewer’s edits. The English letter is the official version.' : 'Not sent.',
      });
    }
  }

  if (decision) {
    events.push({ icon: User, title: 'Reviewer', date: formatDate(decision.at), detail: decision.reviewer });
    if (decision.letterSent) {
      const language: 'en' | 'es' = 'en';
      events.push({
        icon: FileText,
        title: 'Letter as sent',
        date: formatDate(decision.at),
        detail: (
          <div>
            <div className={styles.letterAsSent}>{decision.letterSent}</div>
            <div className={styles.letterLinks}>
              <Button variant="link" onClick={() => openDrawer({ kind: 'letter', caseId, language, text: decision.letterSent ?? '' })}>
                Open formatted letter
              </Button>
              {decision.sendOptions?.spanishCopy && state.review?.letterSpanish && (
                <Button variant="link" onClick={() => openDrawer({ kind: 'letter', caseId, language: 'es', text: state.review?.letterSpanish ?? '' })}>
                  Spanish copy
                </Button>
              )}
            </div>
          </div>
        ),
      });
    }
  }

  return (
    <div>
      <p className={styles.note}>
        Rulebook v{version} applied to this application, filed {formatDate(meta.filed)}.
      </p>
      <ol className={styles.timeline} data-decision-record>
        {events.map((e, i) => (
          <li key={i} className={styles.event}>
            <span className={cx(styles.eventIcon, e.tone === 'accent' && styles.eventIconAccent, e.tone === 'done' && styles.eventIconDone)} aria-hidden>
              <e.icon size={12} strokeWidth={2.25} />
            </span>
            <div className={styles.eventTitle}>
              <span>{e.title}</span>
              {e.date && <span className={styles.eventDate}>{e.date}</span>}
            </div>
            {e.detail && <div className={styles.eventDetail}>{e.detail}</div>}
          </li>
        ))}
      </ol>
    </div>
  );
}
