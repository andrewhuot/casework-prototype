import { useEffect, useMemo, useRef } from 'react';
import type { Packet } from '@/data/types';
import { PaperDocument, MissingDocument, type EvidenceHighlight } from '@/components/documents/PaperDocument';
import { findQuote } from '@/lib/documentText';
import { prefersReducedMotion } from '@/lib/motion';
import type { CriterionView } from '@/lib/caseReview';
import { RuleCard } from './RuleCard';
import { AskAboutCase } from './AskAboutCase';
import styles from './EvidencePane.module.css';

interface EvidencePaneProps {
  caseId: string;
  packet: Packet;
  selected: CriterionView | null;
  next: string | null;
  onNext: () => void;
}

/** Centre pane: the rule card, then the case documents stacked, with evidence highlighted. */
export function EvidencePane({ caseId, packet, selected, next, onNext }: EvidencePaneProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const { highlightsByDoc, notFound, focusMissing } = useMemo(() => {
    const byDoc = new Map<string, EvidenceHighlight[]>();
    const missing: string[] = [];
    let first = true;
    for (const [i, ev] of (selected?.evidence ?? []).entries()) {
      const doc = packet.documents.find((d) => !d.missing && d.title === ev.document);
      const location = doc && !doc.missing ? findQuote(doc, ev.quote) : null;
      if (!location) {
        missing.push(ev.quote);
        continue;
      }
      const list = byDoc.get(ev.document) ?? [];
      list.push({ location, key: `${selected?.id}-${i}`, first });
      first = false;
      byDoc.set(ev.document, list);
    }
    const focus = selected && selected.evidence.length === 0 ? packet.documents.find((d) => d.missing && d.criterion === selected.id)?.title : undefined;
    return { highlightsByDoc: byDoc, notFound: missing, focusMissing: focus };
  }, [selected, packet]);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !selected) return;
    const target = el.querySelector<HTMLElement>('[data-evidence-first]') ?? (focusMissing ? el.querySelector<HTMLElement>(`[data-missing][data-document="${CSS.escape(focusMissing)}"]`) : null);
    const t = window.setTimeout(() => {
      if (!target) {
        el.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        return;
      }
      const elRect = el.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      const offset = rect.top - elRect.top + el.scrollTop;
      const top = Math.max(0, offset - el.clientHeight * 0.2);
      el.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, 30);
    return () => window.clearTimeout(t);
  }, [selected, focusMissing]);

  return (
    <section className={styles.pane} aria-label="Evidence">
      {selected && <RuleCard caseId={caseId} view={selected} next={next} onNext={onNext} notFound={notFound} />}
      <div ref={scroller} className={styles.documents} tabIndex={0} role="region" aria-label="Case documents" data-documents>
        <ol className={styles.stack}>
          {packet.documents.map((entry, i) => (
            <li key={`${entry.title}-${i}`} className={styles.item}>
              <h3 className={styles.docTitle}>
                <span className={styles.docIndex}>{i + 1}</span>
                {entry.title}
                {entry.missing && <span className={styles.docMissingTag}>Not provided</span>}
              </h3>
              {entry.missing ? (
                <MissingDocument entry={entry} focused={focusMissing === entry.title} pulseKey={selected?.id ?? ''} />
              ) : (
                <PaperDocument doc={entry} highlights={highlightsByDoc.get(entry.title) ?? []} pulseKey={selected?.id ?? ''} />
              )}
            </li>
          ))}
        </ol>
        <AskAboutCase caseId={caseId} />
      </div>
    </section>
  );
}
