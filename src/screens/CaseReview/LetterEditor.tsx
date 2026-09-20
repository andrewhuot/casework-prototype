import { useId, useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { BRACKET_PATTERN } from '@/lib/caseReview';
import styles from './LetterEditor.module.css';

interface LetterEditorProps {
  caseId: string;
  value: string;
  onChange: (text: string) => void;
  title: string;
  onPreview: () => void;
}

/**
 * An editable text area whose bracketed reviewer notes are highlighted. A backdrop
 * renders the same text with marks; the transparent textarea sits on top.
 */
export function LetterEditor({ caseId, value, onChange, title, onPreview }: LetterEditorProps) {
  const id = useId();
  const backdrop = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const ta = textarea.current;
    const bd = backdrop.current;
    if (!ta || !bd) return;
    ta.style.height = `${bd.scrollHeight}px`;
  }, [value]);

  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of value.matchAll(BRACKET_PATTERN)) {
    if (m.index > last) parts.push(value.slice(last, m.index));
    parts.push(
      <mark key={m.index} className={styles.bracket} data-bracket>
        {m[0]}
      </mark>,
    );
    last = m.index + m[0].length;
  }
  if (last < value.length) parts.push(value.slice(last));

  return (
    <div className={styles.editor} data-letter-editor={caseId}>
      <div className={styles.head}>
        <label htmlFor={id} className={styles.label}>
          {title}
        </label>
        <Button variant="link" size="sm" onClick={onPreview}>
          Preview
        </Button>
      </div>
      <div className={styles.frame}>
        <div ref={backdrop} className={styles.backdrop} aria-hidden>
          {parts}
          {'\n'}
        </div>
        <textarea ref={textarea} id={id} className={styles.textarea} value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} aria-describedby={`${id}-help`} />
      </div>
      <p id={`${id}-help`} className={styles.help}>
        Bracketed notes are for you and must be replaced before sending. Edits are recorded.
      </p>
    </div>
  );
}
