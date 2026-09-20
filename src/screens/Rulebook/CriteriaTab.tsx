import { useStore } from '@/app/store';
import { CRITERIA } from '@/data/criteria';
import { GROUP_LABELS, type CriterionGroup } from '@/data/types';
import { SourceChip, Tag } from '@/components/ui/Chip';
import tableStyles from '@/components/ui/Table.module.css';
import { cx } from '@/lib/cx';
import styles from './CriteriaTab.module.css';

const GROUPS: CriterionGroup[] = ['adu', 'solar', 'cross'];

/** A read-only table of the twelve criteria, grouped as in the spec. */
export function CriteriaTab() {
  const s2Test = useStore((s) => s.s2Test);
  const version = useStore((s) => s.rulebookVersion);
  const openDrawer = useStore((s) => s.openDrawer);
  return (
    <div className={tableStyles.wrap}>
      <table className={cx(tableStyles.table, styles.table)} data-criteria-table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Short name</th>
            <th scope="col">Test</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        {GROUPS.map((group) => (
          <tbody key={group}>
            <tr className={styles.groupRow}>
              <th scope="rowgroup" colSpan={4} className={styles.groupCell}>
                {GROUP_LABELS[group]}
              </th>
            </tr>
            {CRITERIA.filter((c) => c.group === group).map((c) => {
              const updated = c.id === 'S2' && version === '1.1' && s2Test;
              const citations = updated ? [...c.citations, { sourceId: 'R6', section: '§2', label: 'R6 §2' }] : c.citations;
              return (
                <tr key={c.id} data-criterion-row={c.id}>
                  <td className={cx(styles.id, 'tnum')}>{c.id}</td>
                  <td className={styles.name}>
                    {c.shortName}
                    {updated && (
                      <Tag tone="green" className={styles.updated} data-updated-tag>
                        Updated in v1.1
                      </Tag>
                    )}
                  </td>
                  <td className={styles.test}>{updated ? s2Test : c.test}</td>
                  <td>
                    <span className={styles.chips}>
                      {citations.map((cit) => (
                        <SourceChip key={cit.label} label={cit.label} size="sm" onClick={() => openDrawer({ kind: 'source', sourceId: cit.sourceId, section: cit.section })} />
                      ))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
