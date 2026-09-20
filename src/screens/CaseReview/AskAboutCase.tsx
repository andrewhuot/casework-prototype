import { useState } from 'react';
import { MessageCircleQuestion, Quote } from 'lucide-react';
import { QUESTIONS } from '@/data/questions';
import { cx } from '@/lib/cx';
import styles from './AskAboutCase.module.css';

/** Three suggested questions per case with saved answers. Free-form questions need a live model connection. */
export function AskAboutCase({ caseId }: { caseId: string }) {
  const questions = QUESTIONS[caseId] ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (questions.length === 0) return null;
  return (
    <section className={styles.block} aria-labelledby="ask-heading" data-ask-about>
      <h3 id="ask-heading" className={styles.heading}>
        <MessageCircleQuestion size={15} aria-hidden />
        Ask about this case
      </h3>
      <ul className={styles.list}>
        {questions.map((q, i) => {
          const open = openIndex === i;
          return (
            <li key={q.question} className={cx(styles.item, open && styles.itemOpen)}>
              <button type="button" className={styles.question} aria-expanded={open} onClick={() => setOpenIndex(open ? null : i)}>
                {q.question}
              </button>
              {open && (
                <div className={styles.answer}>
                  <p>{q.answer}</p>
                  <blockquote className={styles.quote}>
                    <Quote size={12} aria-hidden className={styles.quoteIcon} />
                    <span>
                      “{q.quote.text}” <span className={styles.quoteSource}>{q.quote.document}</span>
                    </span>
                  </blockquote>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className={styles.freeform}>
        <label htmlFor="ask-input" className={styles.freeformLabel}>
          Ask something else
        </label>
        <input id="ask-input" className={styles.input} type="text" placeholder="Free-form questions need a live model connection" disabled aria-describedby="ask-note" />
        <p id="ask-note" className={styles.note}>
          Saved answers only. Free-form questions need a live model connection, which this prototype does not make.
        </p>
      </div>
    </section>
  );
}
