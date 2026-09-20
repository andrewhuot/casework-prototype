import { ArrowDownRight, Check, Lock, Sparkles } from 'lucide-react';
import { useStore } from '@/app/store';
import { BACKLOG_SERIES, CASES_REVIEWED_THIS_QUARTER, METRICS, METRIC_NOTES, MODEL_UPDATE, OVERRIDE_RATE, TRUST_LADDER, type MetricTile } from '@/data/scoreboard';
import { BacklogChart } from '@/components/charts/BacklogChart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Switch } from '@/components/ui/Switch';
import { cx } from '@/lib/cx';
import styles from './ScoreboardScreen.module.css';

function formatValue(tile: MetricTile, value: number): string {
  const num = tile.decimals ? value.toFixed(tile.decimals) : value.toLocaleString('en-US');
  return tile.unit === 'percent' ? `${num}%` : num;
}

function change(tile: MetricTile): string {
  const delta = tile.current - tile.baseline;
  if (tile.unit === 'percent') return `${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(tile.decimals ?? 0)} pts`;
  const pct = Math.round((delta / tile.baseline) * 100);
  return `${delta > 0 ? '+' : '−'}${Math.abs(delta)} (${pct > 0 ? '+' : '−'}${Math.abs(pct)}%)`;
}

/** The mission metric moving, and where the director controls how far Claude is trusted. */
export function ScoreboardScreen() {
  const rungs = useStore((s) => s.scoreboard.rungs);
  const modelSwitched = useStore((s) => s.scoreboard.modelSwitched);
  const toggleRung = useStore((s) => s.toggleRung);
  const approveModelSwitch = useStore((s) => s.approveModelSwitch);
  const first = BACKLOG_SERIES[0]?.backlog ?? 0;
  const last = BACKLOG_SERIES[BACKLOG_SERIES.length - 1]?.backlog ?? 0;

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <PageHeader title="Scoreboard" description="The mission metric, and how far Claude is trusted. Baseline is Q1 2026; current is the last 30 days." />

        <div className={styles.tiles} data-metric-tiles>
          {METRICS.map((tile) => (
            <Card key={tile.id} className={styles.tile} data-metric={tile.id}>
              <div className={styles.tileLabel}>
                {tile.label}
                {METRIC_NOTES[tile.id] && <span className={styles.tileNote}>{METRIC_NOTES[tile.id]}</span>}
              </div>
              <div className={styles.tileRow}>
                <span className={cx(styles.tileCurrent, 'tnum')} data-current>
                  {formatValue(tile, tile.current)}
                </span>
                <span className={styles.tileUnit}>{tile.unit === 'days' ? 'days' : tile.unit === 'cases' ? 'cases' : ''}</span>
              </div>
              <div className={styles.tileMeta}>
                <span className={cx(styles.tileBaseline, 'tnum')}>
                  Baseline {formatValue(tile, tile.baseline)}
                </span>
                <span className={cx(styles.tileChange, 'tnum')}>
                  <ArrowDownRight size={12} strokeWidth={2.5} aria-hidden />
                  {change(tile)}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.lines}>
          <p className={styles.line} data-usage-line>
            Cases reviewed with Casework this quarter: <strong className="tnum">{CASES_REVIEWED_THIS_QUARTER.toLocaleString('en-US')}</strong>.
          </p>
          <p className={styles.line} data-override-line>
            Reviewer changes to Claude's findings: <strong className="tnum">{OVERRIDE_RATE}%</strong>.<span className={styles.lineHelper}>A rate near zero would suggest rubber-stamping.</span>
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <Card>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Open backlog</h2>
                <span className={cx(styles.cardMeta, 'tnum')}>
                  {first} → {last} over 12 weeks
                </span>
              </div>
              <BacklogChart />
            </Card>

            <Card className={cx(styles.modelCard, modelSwitched && styles.modelCardDone)} data-model-card>
              <span className={styles.modelIcon} aria-hidden>
                {modelSwitched ? <Check size={16} strokeWidth={2.5} /> : <Sparkles size={16} />}
              </span>
              <div className={styles.modelText}>
                {modelSwitched ? (
                  <p className={styles.modelHeadline} data-model-text>
                    Switched to the new model. The rulebook is unchanged.
                  </p>
                ) : (
                  <>
                    <p className={styles.modelHeadline} data-model-text>
                      A new model is available. Golden set agreement: {MODEL_UPDATE.before}% to {MODEL_UPDATE.after}%. No criterion got worse.
                    </p>
                    <p className={styles.modelSub}>Every new model is re-run on the golden set before it touches a live case.</p>
                  </>
                )}
              </div>
              {!modelSwitched && (
                <Button variant="primary" onClick={approveModelSwitch} data-approve-switch>
                  Approve switch
                </Button>
              )}
            </Card>
          </div>

          <Card className={styles.ladder} padded={false} data-trust-ladder>
            <div className={styles.ladderHead}>
              <h2 className={styles.cardTitle}>Trust ladder</h2>
              <p className={styles.ladderSub}>The director decides how far up to go. Each rung has a threshold on the golden set.</p>
            </div>
            <ol className={styles.rungs}>
              {[...TRUST_LADDER].reverse().map((rung, index) => {
                const on = rungs[rung.id] ?? rung.on;
                const level = TRUST_LADDER.length - index;
                return (
                  <li key={rung.id} className={cx(styles.rung, rung.locked && styles.rungLocked)} data-rung={rung.id}>
                    <span className={cx(styles.rungLevel, 'tnum')} aria-hidden>
                      {level}
                    </span>
                    <div className={styles.rungText}>
                      <div className={styles.rungName}>
                        {rung.name}
                        {rung.locked && (
                          <span className={styles.lockTag}>
                            <Lock size={10} strokeWidth={2.5} aria-hidden />
                            Locked
                          </span>
                        )}
                      </div>
                      <div className={styles.rungDescription}>{rung.description}</div>
                      <div className={styles.rungThreshold}>
                        {rung.threshold}
                        {rung.note && <span className={styles.rungNote}> · {rung.note}</span>}
                      </div>
                    </div>
                    <Switch checked={on} onChange={(v) => toggleRung(rung.id, v)} label={`${rung.name} rung`} disabled={rung.locked} />
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        <p className={styles.footnote} data-team-footnote>
          All figures are for the team. Casework does not rank individual reviewers.
        </p>
      </div>
    </div>
  );
}
