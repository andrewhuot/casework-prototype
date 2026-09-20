import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, Pause, Play } from 'lucide-react';
import { useStore } from '@/app/store';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CASE_STATUS_META, StatusChip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import tableStyles from '@/components/ui/Table.module.css';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/dates';
import { buildQueueRows, filterQueueRows, sortQueueRows, summaryLine, STATUS_ORDER, type QueueFilter } from '@/lib/queue';
import { RunReviewDialog } from './RunReviewDialog';
import styles from './QueueScreen.module.css';

const FILTERS: { id: QueueFilter; label: string }[] = [{ id: 'all', label: 'All' }, ...STATUS_ORDER.map((s) => ({ id: s, label: CASE_STATUS_META[s].label }))];

/** The queue tells the reviewer what to open next. Cases arrive sorted by how much human judgment they need. */
export function QueueScreen() {
  const cases = useStore((s) => s.cases);
  const hintDismissed = useStore((s) => s.hintDismissed);
  const dismissHint = useStore((s) => s.dismissHint);
  const openDrawer = useStore((s) => s.openDrawer);
  const preloadReviews = useStore((s) => s.preloadReviews);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [running, setRunning] = useState<string | null>(null);

  useEffect(() => {
    void preloadReviews();
  }, [preloadReviews, cases]);

  const rows = useMemo(() => sortQueueRows(buildQueueRows(cases)), [cases]);
  const visible = useMemo(() => filterQueueRows(rows, filter), [rows, filter]);
  const counts = useMemo(() => {
    const m = new Map<QueueFilter, number>([['all', rows.length]]);
    for (const r of rows) m.set(r.status, (m.get(r.status) ?? 0) + 1);
    return m;
  }, [rows]);

  const openCase = (id: string, status: string) => {
    if (status === 'new') setRunning(id);
    else navigate(`/cases/${id}`);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <PageHeader title="Queue" description={<span data-summary>{summaryLine(rows)}</span>} />

        {!hintDismissed && (
          <Banner tone="hint" onDismiss={dismissHint} className={styles.hint}>
            New here? Start with Run review on the Delgado case.
          </Banner>
        )}

        <div className={styles.filters} role="group" aria-label="Filter by status">
          {FILTERS.map((f) => {
            const count = counts.get(f.id) ?? 0;
            return (
              <button key={f.id} type="button" className={cx(styles.filter, filter === f.id && styles.filterActive)} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className={cx(styles.filterCount, 'tnum')}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={tableStyles.wrap}>
          {visible.length === 0 ? (
            <EmptyState icon={FileSearch} title="No cases match this filter." description="Choose another status, or All to see every case." compact />
          ) : (
            <table className={cx(tableStyles.table, tableStyles.clickable, styles.table)} data-queue-table>
              <thead>
                <tr>
                  <th scope="col">Case ID</th>
                  <th scope="col">Applicant</th>
                  <th scope="col">Type</th>
                  <th scope="col" className={tableStyles.numeric}>
                    Days in queue
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">Reason</th>
                  <th scope="col">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row.meta.id}
                    data-case-row={row.meta.id}
                    data-status={row.status}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('a, button')) return;
                      openCase(row.meta.id, row.status);
                    }}
                  >
                    <td>
                      <Link
                        to={row.status === 'new' ? '#' : `/cases/${row.meta.id}`}
                        className={tableStyles.rowLink}
                        onClick={(e) => {
                          if (row.status === 'new') {
                            e.preventDefault();
                            setRunning(row.meta.id);
                          }
                        }}
                      >
                        {row.meta.id}
                      </Link>
                    </td>
                    <td>
                      <div className={styles.applicant}>{row.meta.applicant}</div>
                      <div className={styles.address}>{row.meta.address.replace(/, Miami, FL \d+$/, '')}</div>
                    </td>
                    <td>{row.meta.typeLabel}</td>
                    <td className={cx(tableStyles.numeric, styles.days)}>
                      {row.paused ? (
                        <span className={styles.paused}>
                          {row.daysInQueue === 0 ? <span className={styles.today}>Today</span> : <span className="tnum">{row.daysInQueue}</span>}
                          <span className={styles.pausedTag}>
                            <Pause size={10} strokeWidth={3} aria-hidden />
                            paused
                          </span>
                        </span>
                      ) : row.daysInQueue === 0 ? (
                        <span className={styles.today}>Today</span>
                      ) : (
                        <span className="tnum">{row.daysInQueue}</span>
                      )}
                    </td>
                    <td>
                      <StatusChip status={row.status} />
                      {row.replyDue && <div className={styles.subline}>Reply due {formatDate(row.replyDue)}</div>}
                      {row.outcome && <div className={styles.subline}>{row.outcome}</div>}
                    </td>
                    <td className={styles.reason}>{row.reason}</td>
                    <td className={styles.actionCell}>
                      {row.status === 'new' && (
                        <Button variant="primary" size="sm" icon={Play} onClick={() => setRunning(row.meta.id)} data-run-review>
                          Run review
                        </Button>
                      )}
                      {row.hasRecord && (
                        <Button variant="link" size="sm" onClick={() => openDrawer({ kind: 'record', caseId: row.meta.id })} data-decision-record>
                          Decision record
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <RunReviewDialog caseId={running} onClose={() => setRunning(null)} />
    </div>
  );
}
