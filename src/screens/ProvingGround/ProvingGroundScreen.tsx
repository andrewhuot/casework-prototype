import { Check, EyeOff } from 'lucide-react';
import { useStore } from '@/app/store';
import { CLOSED_CASES, DISAGREEMENTS, OVERALL_AGREEMENT, THRESHOLD, type SettleChoice } from '@/data/provingGround';
import { CRITERIA_BY_ID } from '@/data/criteria';
import { AgreementBars } from '@/components/charts/AgreementBars';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, SourceChip } from '@/components/ui/Chip';
import { PageHeader } from '@/components/ui/PageHeader';
import { cx } from '@/lib/cx';
import { useCountUp } from '@/lib/countUp';
import styles from './ProvingGroundScreen.module.css';

/** How accurate Claude was on the city's own closed cases before anyone relied on it. */
export function ProvingGroundScreen() {
  const openDrawer = useStore((s) => s.openDrawer);
  const settled = useStore((s) => s.provingGround.settled);
  const tally = useStore((s) => s.provingGround.tally);
  const settle = useStore((s) => s.settle);
  const settledCount = useCountUp(tally.settled);
  const claude = useCountUp(tally.claude);
  const reviewer = useCountUp(tally.reviewer);
  const unclear = useCountUp(tally.unclear);

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <PageHeader title="Proving ground" description="How Claude performed on the city's own closed cases before anyone relied on it. All figures are hard-coded for the prototype." />

        <div className={styles.top}>
          <Card className={styles.headline}>
            <div className={styles.bigNumber} data-headline-agreement>
              {OVERALL_AGREEMENT}%
            </div>
            <div>
              <p className={styles.headlineText} data-headline>
                {CLOSED_CASES.toLocaleString('en-US')} closed cases from 2024 to 2025. Claude agreed with the original decision on {OVERALL_AGREEMENT}%.
              </p>
              <div className={styles.headlineChip}>
                <SourceChip label="R5" onClick={() => openDrawer({ kind: 'source', sourceId: 'R5' })} />
                <span className={styles.headlineHint}>Closed cases 2024 to 2025</span>
              </div>
            </div>
          </Card>
          <Banner tone="success" icon={Check} className={styles.readiness}>
            <span data-readiness>
              Threshold for first review: {THRESHOLD}%. <strong>Met.</strong>
            </span>
          </Banner>
        </div>

        <div className={styles.grid}>
          <Card className={styles.barsCard}>
            <h2 className={styles.cardTitle}>Agreement by criterion</h2>
            <AgreementBars />
            <p className={styles.barsNote} data-bars-note>
              Most disagreement sits in setbacks, roof pathways, and electrical capacity across permits.
            </p>
          </Card>

          <Card className={styles.queueCard} padded={false}>
            <div className={styles.queueHead}>
              <div>
                <h2 className={styles.cardTitle}>Disagreement queue</h2>
                <p className={styles.queueSub}>
                  <Chip tone="violet" size="sm">
                    {tally.total} cases to settle
                  </Chip>
                  <span className={styles.blind}>
                    <EyeOff size={12} aria-hidden />
                    Settling is blind. A and B are the original decision and Claude's finding in random order. Original reviewers are never named.
                  </span>
                </p>
              </div>
              <div className={styles.tally} data-tally aria-live="polite">
                <span className="tnum">
                  {settledCount} of {tally.total} settled: Claude right {claude}, reviewer right {reviewer}, unclear {unclear}
                </span>
                <span className={styles.tallyNote}>Settled cases become the golden set.</span>
              </div>
            </div>
            <ol className={styles.rows}>
              {DISAGREEMENTS.map((row) => {
                const choice = settled[row.id];
                const done = Boolean(choice);
                return (
                  <li key={row.id} className={cx(styles.row, done && styles.rowDone)} data-disagreement={row.id} data-settled={done ? 'true' : undefined}>
                    <div className={styles.rowHead}>
                      <span className={cx(styles.rowId, 'tnum')}>{row.id}</span>
                      <Chip tone="neutral" size="sm">
                        {row.criterion} · {CRITERIA_BY_ID[row.criterion].shortName}
                      </Chip>
                      {done && (
                        <span className={styles.revealTag} data-reveal>
                          {row.claudeSide === 'a' ? 'A was Claude' : 'B was Claude'}
                        </span>
                      )}
                    </div>
                    <div className={styles.decisions}>
                      <p className={cx(styles.decision, done && choice === 'a' && styles.decisionChosen)}>
                        <span className={styles.decisionLabel}>A:</span> {row.a}
                        {done && row.claudeSide === 'a' && <span className={styles.sideTag}>Claude</span>}
                      </p>
                      <p className={cx(styles.decision, done && choice === 'b' && styles.decisionChosen)}>
                        <span className={styles.decisionLabel}>B:</span> {row.b}
                        {done && row.claudeSide === 'b' && <span className={styles.sideTag}>Claude</span>}
                      </p>
                    </div>
                    <div className={styles.buttons}>
                      {done ? (
                        <span className={styles.settledLabel}>
                          <Check size={13} aria-hidden />
                          {choice === 'unclear' ? 'Settled as unclear' : `Settled: ${choice === 'a' ? 'A' : 'B'} is right`}
                        </span>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => settle(row.id, 'a' satisfies SettleChoice)} data-settle="a">
                            A is right
                          </Button>
                          <Button size="sm" onClick={() => settle(row.id, 'b' satisfies SettleChoice)} data-settle="b">
                            B is right
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => settle(row.id, 'unclear' satisfies SettleChoice)} data-settle="unclear">
                            Unclear
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
