import { useEffect, useRef } from 'react';
import { ExternalLink, CalendarDays } from 'lucide-react';
import { useStore } from '@/app/store';
import { CRITERIA_BY_ID } from '@/data/criteria';
import { PRECEDENTS } from '@/data/precedents';
import { SOURCES_BY_ID } from '@/data/sources';
import type { SourceId } from '@/data/types';
import { Chip, OutcomeChip, TypeTag } from '@/components/ui/Chip';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/dates';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './drawers.module.css';

interface SourceViewerProps {
  sourceId: SourceId;
  section?: string;
}

/** The excerpt with its section labels and the criteria that cite it. The cited passage is highlighted. */
export function SourceViewer({ sourceId, section }: SourceViewerProps) {
  const source = SOURCES_BY_ID[sourceId];
  const status = useStore((s) => s.sources.find((r) => r.source.id === sourceId)?.status);
  const s2Cites = useStore((s) => s.rulebookVersion === '1.1');
  const openDrawer = useStore((s) => s.openDrawer);
  const highlighted = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = highlighted.current;
    if (!el) return;
    const t = window.setTimeout(() => el.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' }), 60);
    return () => window.clearTimeout(t);
  }, [sourceId, section]);

  const usedFor = source.usedFor === 'precedents' ? [] : [...source.usedFor];
  if (sourceId === 'R6' && !s2Cites) usedFor.splice(0);

  return (
    <div>
      <div className={styles.meta}>
        <TypeTag type={source.type} />
        <span className={styles.metaItem}>
          <CalendarDays size={13} aria-hidden />
          Added {formatDate(source.added)}
        </span>
        {status && (
          <Chip tone={status === 'active' ? 'green' : status === 'processing' ? 'slate' : 'violet'} size="sm">
            {status === 'active' ? 'Active' : status === 'processing' ? 'Processing' : '1 proposed change'}
          </Chip>
        )}
        {source.link && (
          <span className={styles.metaItem}>
            <ExternalLink size={13} aria-hidden />
            <span className="tnum">{source.link.replace(/^https?:\/\//, '')}</span>
          </span>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Used for</div>
        {source.usedFor === 'precedents' ? (
          <p className={styles.prose}>Precedents and Proving ground. The eight prior decisions below are drawn from these 1,200 closed cases.</p>
        ) : usedFor.length === 0 ? (
          <p className={styles.prose}>No criteria cite this source yet. A proposed change to S2 is waiting for approval.</p>
        ) : (
          <div className={styles.chips}>
            {usedFor.map((id) => (
              <Chip key={id} tone="neutral" size="sm">
                {id} · {CRITERIA_BY_ID[id].shortName}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {source.sections.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Excerpt</div>
          <div className={styles.excerpt}>
            {source.heading && <div className={styles.excerptHeading}>{source.heading}</div>}
            {source.sections.map((sec) => {
              const hit = sec.label === section;
              return (
                <div key={sec.label} ref={hit ? highlighted : undefined} className={cx(styles.passage, hit && styles.passageHighlighted)} data-section={sec.label} data-highlighted={hit ? 'true' : undefined}>
                  <span className={styles.passageLabel}>{sec.label}</span>
                  <span>{sec.text}</span>
                </div>
              );
            })}
          </div>
          <p className={styles.note} style={{ marginTop: 8 }}>
            Illustrative excerpt. Section numbers and wording are invented for the prototype.
          </p>
        </div>
      )}

      {source.usedFor === 'precedents' ? (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Prior decisions</div>
          <div className={styles.precedentList}>
            {PRECEDENTS.map((p) => (
              <button key={p.id} type="button" className={styles.precedentRow} onClick={() => openDrawer({ kind: 'precedent', precedentId: p.id })}>
                <span className={styles.precedentId}>{p.id}</span>
                <span>
                  <OutcomeChip outcome={p.outcome} />
                </span>
                <span className={styles.precedentSummary}>
                  {p.criterion} · {p.summary}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        usedFor.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Criteria that cite this source</div>
            <div className={styles.citing}>
              {usedFor.map((id) => {
                const c = CRITERIA_BY_ID[id];
                return (
                  <div key={id} className={styles.citeRow}>
                    <span className={styles.citeId}>{id}</span>
                    <span>
                      <div className={styles.citeName}>{c.shortName}</div>
                      <div className={styles.citeTest}>{c.test}</div>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
