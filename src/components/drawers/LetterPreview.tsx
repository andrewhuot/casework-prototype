import { Landmark } from 'lucide-react';
import { CASES_BY_ID } from '@/data/cases';
import { DEMO_DATE, formatDateEs, formatDateLong } from '@/lib/dates';
import styles from './drawers.module.css';

interface LetterPreviewProps {
  caseId: string;
  language: 'en' | 'es';
  text: string;
}

function withBrackets(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\[[^\]]*\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <span key={m.index} className={styles.bracket}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Renders letter text as a formatted letter on the department's fictional letterhead. */
export function LetterPreview({ caseId, language, text }: LetterPreviewProps) {
  const meta = CASES_BY_ID[caseId];
  const es = language === 'es';
  const paragraphs = text.split(/\n\s*\n/);
  const signatureIndex = paragraphs.length - 1;

  return (
    <div>
      {es && <p className={styles.note}>The English letter is the official version. This copy is sent alongside it because the application states Spanish as the preferred language.</p>}
      <div className={styles.letter} lang={es ? 'es' : 'en'} data-letter-preview={language}>
        <div className={styles.letterhead}>
          <span className={styles.letterheadMark} aria-hidden>
            <Landmark size={18} strokeWidth={1.75} />
          </span>
          <div>
            <div className={styles.letterheadTitle}>{es ? 'Ciudad de Miami · Departamento de Construcción' : 'City of Miami · Building Department'}</div>
            <div className={styles.letterheadSub}>{es ? 'Revisión de planos y permisos · 444 Example Avenue, Miami, FL 33130 · (305) 555-0100' : 'Plan review and permits · 444 Example Avenue, Miami, FL 33130 · (305) 555-0100'}</div>
          </div>
        </div>
        <div className={styles.letterMeta}>
          <span>{es ? formatDateEs(DEMO_DATE) : formatDateLong(DEMO_DATE)}</span>
          {meta && (
            <>
              <span>{meta.ownerName}</span>
              <span>{meta.address}</span>
            </>
          )}
        </div>
        {meta && (
          <div className={styles.letterRe}>
            {es ? 'Asunto' : 'Re'}: {es ? 'Solicitud' : 'Application'} {meta.id}
          </div>
        )}
        <div className={styles.letterBody}>
          {paragraphs.map((para, i) => {
            if (i === signatureIndex) return null;
            const lines = para.split('\n');
            const numbered = lines.every((l) => /^\d+\.\s/.test(l.trim()));
            if (numbered) {
              const start = Number(lines[0]?.trim().match(/^(\d+)\./)?.[1] ?? 1);
              return (
                <ol key={i} start={start}>
                  {lines.map((l, j) => (
                    <li key={j}>{withBrackets(l.replace(/^\d+\.\s/, ''))}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={i}>
                {lines.map((l, j) => (
                  <span key={j}>
                    {withBrackets(l)}
                    {j < lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            );
          })}
          <div className={styles.letterSignature}>{paragraphs[signatureIndex]}</div>
        </div>
        <div className={styles.letterFooter}>{es ? 'Esta carta es una copia de cortesía en español. La versión en inglés es la oficial.' : 'This letter was prepared with Casework and reviewed by department staff. Synthetic prototype content.'}</div>
      </div>
    </div>
  );
}
