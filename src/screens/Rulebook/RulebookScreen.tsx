import { useEffect, useState } from 'react';
import { Plus, Loader2, Check, GitPullRequestArrow } from 'lucide-react';
import { useStore } from '@/app/store';
import { POLICY_LEAD_NAME } from '@/data/cases';
import { CRITERIA_BY_ID } from '@/data/criteria';
import type { CriterionId, Source } from '@/data/types';
import { Button } from '@/components/ui/Button';
import { Chip, TypeTag } from '@/components/ui/Chip';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import tableStyles from '@/components/ui/Table.module.css';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/dates';
import { AddSourceDialog } from './AddSourceDialog';
import { ProposedChangeDialog } from './ProposedChangeDialog';
import { CriteriaTab } from './CriteriaTab';
import styles from './RulebookScreen.module.css';

type Tab = 'sources' | 'criteria';

/** Where the rules come from. The city adds sources, Claude proposes criteria, a person approves every change. */
export function RulebookScreen() {
  const version = useStore((s) => s.rulebookVersion);
  const effective = useStore((s) => s.rulebookEffectiveDate);
  const sources = useStore((s) => s.sources);
  const finishProcessing = useStore((s) => s.finishProcessing);
  const pushToast = useStore((s) => s.pushToast);
  const openDrawer = useStore((s) => s.openDrawer);
  const [tab, setTab] = useState<Tab>('sources');
  const [addOpen, setAddOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const processing = sources.filter((s) => s.status === 'processing').map((s) => s.source.id);
  useEffect(() => {
    if (processing.length === 0) return;
    const timers = processing.map((id) =>
      window.setTimeout(() => {
        finishProcessing(id);
        if (id !== 'R6') pushToast({ message: 'Added as reference. No rule changes proposed.', kind: 'info' });
      }, 2000),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [processing.join(','), finishProcessing, pushToast]); // eslint-disable-line react-hooks/exhaustive-deps

  const headline = version === '1.0' ? 'Rulebook v1.0, approved by policy staff' : `Rulebook v1.1, published by ${POLICY_LEAD_NAME}. It applies to applications filed from ${formatDate(effective ?? '2026-09-22')}.`;

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <PageHeader
          title="Rulebook"
          meta={
            <Chip tone={version === '1.0' ? 'neutral' : 'green'} icon={Check} size="sm">
              v{version}
            </Chip>
          }
          description={<span data-rulebook-headline>{headline}</span>}
          actions={
            tab === 'sources' ? (
              <Button variant="primary" icon={Plus} onClick={() => setAddOpen(true)} data-add-source>
                Add source
              </Button>
            ) : undefined
          }
        />
        <Tabs
          label="Rulebook sections"
          tabs={[
            { id: 'sources', label: 'Sources' },
            { id: 'criteria', label: 'Criteria' },
          ]}
          value={tab}
          onChange={setTab}
          className={styles.tabs}
        />

        <TabPanel id="panel-sources" active={tab === 'sources'}>
          <div className={tableStyles.wrap}>
            <table className={cx(tableStyles.table, tableStyles.clickable, styles.table)} data-sources-table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Added</th>
                  <th scope="col">Used for</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {sources.map(({ source, status }) => (
                  <tr
                    key={source.id}
                    data-source-row={source.id}
                    data-source-status={status}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      openDrawer({ kind: 'source', sourceId: source.id });
                    }}
                  >
                    <td>
                      <button type="button" className={styles.nameButton} onClick={() => openDrawer({ kind: 'source', sourceId: source.id })}>
                        <span className={cx(styles.sourceId, 'tnum')}>{source.id}</span>
                        <span className={styles.sourceName}>{source.name}</span>
                      </button>
                    </td>
                    <td>
                      <TypeTag type={source.type} />
                    </td>
                    <td className={cx('tnum', styles.added)}>{formatDate(source.added)}</td>
                    <td>
                      <UsedFor source={source} version={version} />
                    </td>
                    <td>
                      {status === 'active' && (
                        <Chip tone="green" icon={Check}>
                          Active
                        </Chip>
                      )}
                      {status === 'processing' && (
                        <span className={styles.processing} data-processing>
                          <Loader2 size={13} className={styles.spinner} aria-hidden />
                          Processing
                        </span>
                      )}
                      {status === 'proposed_change' && (
                        <button type="button" className={styles.proposed} onClick={() => setChangeOpen(true)} data-proposed-change>
                          <GitPullRequestArrow size={13} strokeWidth={2.25} aria-hidden />1 proposed change
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.footnote}>Sources are the city's own documents. Excerpts are illustrative and section numbers are invented for the prototype.</p>
        </TabPanel>

        <TabPanel id="panel-criteria" active={tab === 'criteria'}>
          <CriteriaTab />
        </TabPanel>
      </div>

      <AddSourceDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <ProposedChangeDialog open={changeOpen} onClose={() => setChangeOpen(false)} />
    </div>
  );
}

function UsedFor({ source, version }: { source: Source; version: '1.0' | '1.1' }) {
  if (source.usedFor === 'precedents') return <span className={styles.usedText}>Precedents and Proving ground</span>;
  const ids: CriterionId[] = source.id === 'R6' && version === '1.0' ? [] : source.usedFor;
  if (ids.length === 0) return <span className={styles.usedMuted}>Reference only</span>;
  return (
    <span className={styles.chips}>
      {ids.map((id) => (
        <Chip key={id} tone="neutral" size="sm" title={CRITERIA_BY_ID[id].shortName}>
          {id}
        </Chip>
      ))}
    </span>
  );
}
