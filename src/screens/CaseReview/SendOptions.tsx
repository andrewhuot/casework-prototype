import { useStore } from '@/app/store';
import type { CaseMeta, SendOptions as SendOptionsValue } from '@/data/types';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/Field';
import { DEMO_DATE, daysBetween, formatDateWithWeekday } from '@/lib/dates';
import styles from './SendOptions.module.css';

interface SendOptionsProps {
  caseId: string;
  meta: CaseMeta;
  options: SendOptionsValue;
  spanishLetter?: string;
}

/** Shown under the letter whenever the draft is a request for information. Nothing is actually sent. */
export function SendOptions({ caseId, meta, options, spanishLetter }: SendOptionsProps) {
  const setSendOptions = useStore((s) => s.setSendOptions);
  const openDrawer = useStore((s) => s.openDrawer);
  const calendarDays = daysBetween(DEMO_DATE, options.replyDue);

  return (
    <div className={styles.block} data-send-options>
      <div className={styles.heading}>Send options</div>

      <TextField
        label="Reply due"
        type="date"
        value={options.replyDue}
        min={DEMO_DATE}
        onChange={(e) => e.target.value && setSendOptions(caseId, { replyDue: e.target.value })}
        helper={`${formatDateWithWeekday(options.replyDue)} · ${calendarDays === 14 ? '10 business days' : `${calendarDays} calendar days`} from today. The date appears in the letter and on the queue row.`}
        className={styles.date}
        data-reply-due
      />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Remind the applicant if there is no reply</legend>
        <div className={styles.checks}>
          <Checkbox label="Email" checked={options.remindEmail} onChange={(v) => setSendOptions(caseId, { remindEmail: v })} name="remind-email" />
          <Checkbox label="Text message" checked={options.remindText} onChange={(v) => setSendOptions(caseId, { remindText: v })} name="remind-text" />
          <Checkbox label="Phone call from a virtual agent" checked={options.remindCall} onChange={(v) => setSendOptions(caseId, { remindCall: v })} name="remind-call" />
        </div>
        <p className={styles.helper}>Sent 5 and 9 business days after the request. Reminders stop when the applicant replies. Automated calls say they are automated.</p>
      </fieldset>

      {meta.preferredLanguage === 'es' && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Language</legend>
          <div className={styles.copyRow}>
            <Checkbox label="Also send a Spanish copy" checked={options.spanishCopy} onChange={(v) => setSendOptions(caseId, { spanishCopy: v })} name="spanish-copy" />
            {spanishLetter && (
              <Button variant="link" size="sm" onClick={() => openDrawer({ kind: 'letter', caseId, language: 'es', text: spanishLetter })} data-preview-spanish>
                Preview
              </Button>
            )}
          </div>
          <p className={styles.helper}>The English letter is the official version. The copy updates to match your edits when sent.</p>
        </fieldset>
      )}
    </div>
  );
}
