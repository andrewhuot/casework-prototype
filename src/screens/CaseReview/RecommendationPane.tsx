import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, Send, Stamp, ArrowUpRight, FileCheck } from 'lucide-react';
import { useStore, type CaseState } from '@/app/store';
import type { CaseMeta } from '@/data/types';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Chip';
import { Menu, type MenuItemDef } from '@/components/ui/Menu';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/dates';
import { draftIsRequest, flaggedSummary, hasBracket, type CriterionView } from '@/lib/caseReview';
import { LetterEditor } from './LetterEditor';
import { SendOptions } from './SendOptions';
import { ApproveAnywayDialog, DenyDialog, EscalateDialog } from './dialogs';
import styles from './RecommendationPane.module.css';

interface RecommendationPaneProps {
  caseId: string;
  meta: CaseMeta;
  caseState: CaseState;
  views: CriterionView[];
  remaining: number;
}

/** Right pane: evidence before verdict. The recommendation reveals once the flagged criteria have been opened. */
export function RecommendationPane({ caseId, meta, caseState, views, remaining }: RecommendationPaneProps) {
  const reveal = useStore((s) => s.reveal);
  const editLetter = useStore((s) => s.editLetter);
  const switchToRequestDraft = useStore((s) => s.switchToRequestDraft);
  const sendRequest = useStore((s) => s.sendRequest);
  const approve = useStore((s) => s.approve);
  const escalate = useStore((s) => s.escalate);
  const deny = useStore((s) => s.deny);
  const openDrawer = useStore((s) => s.openDrawer);
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<'approve' | 'escalate' | 'deny' | null>(null);

  const review = caseState.review;
  const draft = caseState.letterDraft ?? review?.letter ?? '';
  const isRequest = review ? draftIsRequest(review.recommendation, caseState.letterEdited, draft) : false;
  const bracket = hasBracket(draft);
  const anyFlagged = views.some((v) => v.flagged);
  const summary = useMemo(() => flaggedSummary(views), [views]);

  if (!review) return null;

  if (caseState.status === 'waiting' || caseState.status === 'decided') {
    const d = caseState.decision;
    return (
      <aside className={styles.pane} aria-label="Recommendation">
        <div className={styles.body}>
          <div className={styles.revealed}>
            <div className={styles.statusRow}>
              <StatusChip status={caseState.status} />
              {d && <span className={styles.outcome}>{d.outcomeLabel}</span>}
            </div>
            {d?.kind === 'request_sent' && d.sendOptions && (
              <p className={styles.rationale}>
                Request sent {formatDate(d.at)}. Reply due {formatDate(d.sendOptions.replyDue)}. The days-in-queue clock is paused until the applicant replies.
              </p>
            )}
            {d?.kind !== 'request_sent' && d && <p className={styles.rationale}>Decided {formatDate(d.at)} by {d.reviewer}.{d.reason ? ` Reason: ${d.reason}` : ''}{d.note ? ` Note: ${d.note}` : ''}</p>}
            {d?.letterSent && (
              <div className={styles.section}>
                <div className={styles.sectionLabel}>{d.kind === 'approved' ? 'Approval notice as sent' : d.kind === 'denied' ? 'Denial letter as sent' : 'Letter as sent'}</div>
                <div className={styles.sentLetter}>{d.letterSent}</div>
              </div>
            )}
            <div className={styles.linkRow}>
              <Button variant="link" onClick={() => openDrawer({ kind: 'record', caseId })} data-open-record>
                Open decision record
              </Button>
              {d?.letterSent && (
                <Button variant="link" onClick={() => openDrawer({ kind: 'letter', caseId, language: 'en', text: d.letterSent ?? '' })}>
                  Preview letter
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const gated = !caseState.revealed && remaining > 0;

  const actions = {
    approve: () => (anyFlagged ? setDialog('approve') : finish(() => approve(caseId))),
    send: () => {
      if (!isRequest) {
        switchToRequestDraft(caseId);
        return;
      }
      if (bracket) return;
      finish(() => sendRequest(caseId));
    },
    escalate: () => setDialog('escalate'),
    deny: () => setDialog('deny'),
  };

  function finish(act: () => void) {
    act();
    navigate('/');
  }

  const rec = review.recommendation;
  const menuItems: MenuItemDef[] = [];
  if (rec !== 'needs_judgment') {
    if (rec !== 'approve_ready') menuItems.push({ id: 'approve', label: 'Approve and issue permit', onSelect: actions.approve });
    if (rec !== 'needs_information') menuItems.push({ id: 'send', label: 'Send request for information', onSelect: actions.send, description: !isRequest ? 'Switches the draft to a request' : undefined });
    menuItems.push({ id: 'escalate', label: 'Escalate to senior reviewer', onSelect: actions.escalate, description: 'Internal. Nothing goes to the applicant' });
  }
  menuItems.push({ id: 'deny', label: 'Deny', onSelect: actions.deny, danger: true, description: 'Starts an adverse action. Requires a reason' });

  const sendHint = bracket ? 'Replace the bracketed note first.' : undefined;

  return (
    <aside className={styles.pane} aria-label="Recommendation">
      <div className={styles.body}>
        {gated ? (
          <div className={styles.gate} data-recommendation-gate>
            <span className={styles.gateIcon} aria-hidden>
              <Lock size={16} />
            </span>
            <p className={styles.gateText}>
              Open the flagged criteria to see the recommendation ({remaining} left)
            </p>
            <p className={styles.gateHint}>Evidence comes before verdict. Use Next flagged in the rule card, or press N.</p>
            <Button variant="link" icon={Eye} onClick={() => reveal(caseId)} data-show-anyway>
              Show anyway
            </Button>
          </div>
        ) : (
          <div className={styles.revealed} data-recommendation>
            <div className={styles.statusRow}>
              <StatusChip status={rec} />
              {rec === 'needs_judgment' && <span className={styles.noAction}>Claude proposes no action</span>}
              {rec === 'approve_ready' && <span className={styles.noAction}>Every criterion met</span>}
              {rec === 'needs_information' && <span className={styles.noAction}>One request should complete the file</span>}
            </div>
            <p className={styles.rationale} data-rationale>
              {review.rationale}
            </p>

            {isRequest && meta.previousRequests.length > 0 && (
              <Banner tone="warning" className={styles.warning}>
                This will be request {meta.previousRequests.length + 1} for this applicant. Check that it is complete.
              </Banner>
            )}

            <LetterEditor
              caseId={caseId}
              value={draft}
              onChange={(text) => editLetter(caseId, text)}
              title={isRequest ? 'Draft letter to the applicant' : 'Draft approval notice'}
              onPreview={() => openDrawer({ kind: 'letter', caseId, language: 'en', text: draft })}
            />

            {isRequest && <SendOptions caseId={caseId} meta={meta} options={caseState.sendOptions} spanishLetter={review.letterSpanish} />}
          </div>
        )}
      </div>

      {!gated && (
        <footer className={cx(styles.actions, rec === 'needs_judgment' && styles.actionsEqual)} data-actions>
          {rec === 'needs_judgment' ? (
            <div className={styles.equalRow}>
              <Button icon={Stamp} onClick={actions.approve} data-action="approve">
                Approve and issue permit
              </Button>
              <Button icon={Send} onClick={actions.send} softDisabled={bracket} aria-describedby={sendHint ? 'send-hint' : undefined} data-action="send">
                Send request for information
              </Button>
              <Button icon={ArrowUpRight} onClick={actions.escalate} data-action="escalate">
                Escalate to senior reviewer
              </Button>
            </div>
          ) : (
            <div className={styles.primaryRow}>
              {rec === 'approve_ready' ? (
                <Button variant="primary" icon={FileCheck} onClick={actions.approve} data-action="approve">
                  Approve and issue permit
                </Button>
              ) : (
                <Button variant="primary" icon={Send} onClick={actions.send} softDisabled={bracket} aria-describedby={sendHint ? 'send-hint' : undefined} data-action="send">
                  Send request for information
                </Button>
              )}
            </div>
          )}
          {sendHint && (
            <p id="send-hint" className={styles.hint} data-send-hint>
              {sendHint}
            </p>
          )}
          <div className={styles.menuRow}>
            <Menu label="Decide differently" items={menuItems} buttonProps={{ variant: 'ghost', size: 'sm' }} align="left" />
          </div>
        </footer>
      )}

      <ApproveAnywayDialog open={dialog === 'approve'} summary={summary} onClose={() => setDialog(null)} onConfirm={(reason) => { setDialog(null); finish(() => approve(caseId, reason)); }} />
      <EscalateDialog open={dialog === 'escalate'} onClose={() => setDialog(null)} onConfirm={(note) => { setDialog(null); finish(() => escalate(caseId, note)); }} />
      <DenyDialog open={dialog === 'deny'} onClose={() => setDialog(null)} onConfirm={(reason) => { setDialog(null); finish(() => deny(caseId, reason)); }} />
    </aside>
  );
}
