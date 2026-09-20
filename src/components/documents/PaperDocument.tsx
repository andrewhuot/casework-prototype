import { forwardRef, type ReactNode } from 'react';
import { Compass, FileX2, HardHat, Landmark, Mail, Ruler, ScrollText, Waves, type LucideIcon } from 'lucide-react';
import type { DocBlock, LetterheadKind, MissingDocument as MissingEntry, PacketDocument } from '@/data/types';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/dates';
import { blockLines, splitByRanges, type QuoteLocation, type Range } from '@/lib/documentText';
import { Drawing } from './drawings';
import styles from './PaperDocument.module.css';

export interface EvidenceHighlight {
  location: QuoteLocation;
  key: string;
  first: boolean;
}

interface PaperDocumentProps {
  doc: PacketDocument;
  highlights: EvidenceHighlight[];
  /** Changes whenever the selection changes, so highlights pulse again. */
  pulseKey: string;
}

const LETTERHEAD_ICONS: Record<LetterheadKind, LucideIcon> = {
  city_form: Landmark,
  contractor: HardHat,
  surveyor: Compass,
  engineer: Ruler,
  affidavit: ScrollText,
  fema: Waves,
  letter: Mail,
};

function clip(ranges: Range[], start: number, end: number): Range[] {
  return ranges
    .filter((r) => r.end > start && r.start < end)
    .map((r) => ({ ...r, start: Math.max(r.start, start) - start, end: Math.min(r.end, end) - start }));
}

function renderMarked(text: string, ranges: Range[], firstKey: string | undefined): ReactNode {
  if (ranges.length === 0) return text;
  return splitByRanges(text, ranges).map((seg, i) =>
    seg.key ? (
      <mark key={i} className={styles.mark} data-evidence={seg.key} data-evidence-first={seg.key === firstKey ? 'true' : undefined}>
        {seg.text}
      </mark>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

/** A packet document rendered as a paper page: letterhead, Received stamp, form fields, drawings, signature, notary block. */
export const PaperDocument = forwardRef<HTMLElement, PaperDocumentProps>(function PaperDocument({ doc, highlights, pulseKey }, ref) {
  const Icon = LETTERHEAD_ICONS[doc.letterhead.kind];
  const firstKey = highlights.find((h) => h.first)?.key;
  const rangesFor = (blockIndex: number, lineIndex: number): Range[] =>
    highlights.filter((h) => h.location.blockIndex === blockIndex && h.location.lineIndex === lineIndex).map((h) => ({ start: h.location.start, end: h.location.end, key: h.key }));

  const renderBlock = (block: DocBlock, blockIndex: number): ReactNode => {
    const lines = blockLines(block);
    switch (block.type) {
      case 'heading':
        return (
          <h4 key={blockIndex} className={styles.heading}>
            {renderMarked(block.text, rangesFor(blockIndex, 0), firstKey)}
          </h4>
        );
      case 'para':
        return (
          <p key={blockIndex} className={styles.para}>
            {renderMarked(block.text, rangesFor(blockIndex, 0), firstKey)}
          </p>
        );
      case 'list':
        return (
          <ul key={blockIndex} className={styles.list}>
            {block.items.map((item, i) => (
              <li key={i}>{renderMarked(item, rangesFor(blockIndex, i), firstKey)}</li>
            ))}
          </ul>
        );
      case 'field':
      case 'fields': {
        const items = block.type === 'field' ? [{ label: block.label, value: block.value }] : block.items;
        return (
          <dl key={blockIndex} className={styles.fields}>
            {items.map((f, i) => {
              const ranges = rangesFor(blockIndex, i);
              const labelRanges = clip(ranges, 0, f.label.length);
              const valueStart = f.label.length + 2;
              const valueRanges = clip(ranges, valueStart, valueStart + f.value.length);
              return (
                <div key={i} className={styles.fieldRow}>
                  <dt className={styles.fieldLabel}>{renderMarked(f.label, labelRanges, firstKey)}</dt>
                  <dd className={styles.fieldValue}>{renderMarked(f.value, valueRanges, firstKey)}</dd>
                </div>
              );
            })}
          </dl>
        );
      }
      case 'drawing':
        return (
          <figure key={blockIndex} className={styles.figure}>
            <div className={styles.drawing}>
              <Drawing spec={block.drawing} />
            </div>
            {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
          </figure>
        );
      case 'signature':
        return (
          <div key={blockIndex} className={styles.signature}>
            <div className={styles.signatureLine}>
              <span className={styles.signatureName} aria-hidden>
                {block.name}
              </span>
            </div>
            <div className={styles.signatureMeta}>
              <span>{renderMarked(lines[0] ?? '', rangesFor(blockIndex, 0), firstKey)}</span>
            </div>
          </div>
        );
      case 'notary':
        return (
          <div key={blockIndex} className={styles.notary}>
            <SealMark lines={['Notary Public', 'State of Florida']} />
            <div className={styles.notaryText}>
              <div className={styles.notaryLabel}>Notary acknowledgement</div>
              <p className={styles.para}>{renderMarked(block.text, rangesFor(blockIndex, 0), firstKey)}</p>
              <div className={styles.notaryMeta}>Notary Public, State of Florida · Commission {block.commission}</div>
            </div>
          </div>
        );
      case 'seal':
        return (
          <div key={blockIndex} className={styles.sealRow}>
            <SealMark lines={block.text.includes('PSM') ? ['Professional', 'Surveyor'] : ['Professional', 'Engineer']} />
            <p className={cx(styles.para, styles.sealText)}>{renderMarked(block.text, rangesFor(blockIndex, 0), firstKey)}</p>
          </div>
        );
    }
  };

  return (
    <article ref={ref} className={styles.paper} data-document={doc.title} data-pulse={pulseKey} aria-label={doc.title}>
      <header className={cx(styles.letterhead, styles[`lh_${doc.letterhead.kind}`])}>
        <span className={styles.letterheadIcon} aria-hidden>
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <div className={styles.letterheadText}>
          <div className={styles.letterheadOrg}>{doc.letterhead.org}</div>
          {doc.letterhead.sub && <div className={styles.letterheadSub}>{doc.letterhead.sub}</div>}
        </div>
        {doc.letterhead.formNumber && <div className={styles.formNumber}>{doc.letterhead.formNumber}</div>}
      </header>
      <ReceivedStamp date={doc.received} />
      <div className={styles.body}>{doc.blocks.map(renderBlock)}</div>
    </article>
  );
});

export function ReceivedStamp({ date }: { date: string }) {
  return (
    <div className={styles.stamp} aria-hidden>
      <div className={styles.stampTitle}>Received</div>
      <div className={cx(styles.stampDate, 'tnum')}>{formatDate(date).toUpperCase()}</div>
      <div className={styles.stampOrg}>Building Department</div>
    </div>
  );
}

function SealMark({ lines }: { lines: [string, string] }) {
  return (
    <svg viewBox="0 0 64 64" className={styles.seal} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <text x="32" y="30" textAnchor="middle" fontSize="6.5" fontWeight="700" letterSpacing="0.06em" fill="currentColor">
        {lines[0].toUpperCase()}
      </text>
      <text x="32" y="39" textAnchor="middle" fontSize="6.5" fontWeight="700" letterSpacing="0.06em" fill="currentColor">
        {lines[1].toUpperCase()}
      </text>
      <circle cx="32" cy="46" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** An expected document that was not provided: a dashed, empty page. */
export const MissingDocument = forwardRef<HTMLElement, { entry: MissingEntry; focused: boolean; pulseKey: string }>(function MissingDocument({ entry, focused, pulseKey }, ref) {
  return (
    <article ref={ref} className={cx(styles.missing, focused && styles.missingFocused)} data-document={entry.title} data-missing data-pulse={pulseKey} aria-label={`${entry.title}: not provided`}>
      <FileX2 size={22} strokeWidth={1.5} aria-hidden className={styles.missingIcon} />
      <div className={styles.missingLabel}>Not provided</div>
      <div className={styles.missingHint}>Expected for {entry.criterion}</div>
    </article>
  );
});
