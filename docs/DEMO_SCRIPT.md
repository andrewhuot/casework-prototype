# Casework: five-minute demo script

The demo follows one application from arrival to decision, then shows where the rules come from, why the city trusts them, and what changes for the mission. It runs 5:00 at a normal speaking pace. The first three minutes are the reviewer's story; the last two belong to the policy lead and the director.

## Before recording

- Open the prototype, click **Reset demo**, and start on the Queue. Browser at 1440 px wide (never under 1280).
- Rehearse twice with a timer. The script has almost no slack at 5:00.
- To land near 4:00, drop the 3:02 beat and the click in the 4:00 beat.
- The Say column is talking points. Put them in your own words.

## Script

| Time | Do | What appears | Talking points |
| --- | --- | --- | --- |
| 0:00 | Start on the Queue. Point to the two approve-ready rows, then to Delgado. | Seven cases sorted by status. Delgado on top, marked New. | Everything here is synthetic; the City of Miami is illustration only. In this scenario a permit decision takes a median of 34 days. Casework sits inside the Claude staff already use. The queue is sorted by how much judgment each case needs. Two are approve-ready, every criterion met and linked to evidence, under a minute each. Maria Delgado filed this morning: a backyard ADU and rooftop solar in one application. |
| 0:25 | Click **Run review** on the Delgado row. | Three progress steps tick off: reading 7 documents, checking 12 criteria, finding similar past decisions. Case review opens, tagged Saved review. | In production this runs on arrival. For the demo, Claude generated each review from these exact documents and it was saved, so the walkthrough is repeatable. |
| 0:47 | Look at the left pane, then at A3. | "12 criteria: 9 met, 3 flagged." A3 Setbacks is selected with two highlights: "5 ft 0 in" and "4 ft 6 in". | Nine criteria met, each linked to its evidence. Three flagged. First, setbacks: the site plan says five feet, the survey says four foot six. Claude marks it unclear. It does not guess. |
| 1:12 | Click the source chip **R1 §ADU-3**, then close the drawer. Point to Similar past decisions. | The drawer shows the rule passage highlighted. The rule card lists four past decisions: three approved with waiver, one denied. | The rule is one click away, in the source the city uploaded. So are past decisions: three similar encroachments approved with a waiver, one denied. That is a judgment call, and it stays with the reviewer. |
| 1:37 | Click **Next flagged**. | A5 Flood elevation: Not met. The elevation certificate shows "Not provided". | Second, no elevation certificate. Today that becomes a rejection letter three weeks from now. Here it is caught in the first minute. |
| 1:52 | Click **Next flagged**. | X1 Electrical capacity: Not met. Highlights: "Added load: 48 A" and "Main service panel: 150 A, with a 40 A solar backfeed breaker". One past decision. | Third, the one two separate reviewers would miss. The ADU adds 48 amps, the solar backfeeds 40, the panel is 150. Each permit passes alone. Together they do not. |
| 2:17 | Read the right pane. Replace the bracketed line with "You may apply for an administrative waiver for the rear setback." Point to the send options, then click **Send request for information**. | The recommendation reveals: Needs judgment, a rationale, the draft letter, three equal buttons. Send options show the reply due date, email and text reminders ticked, Spanish copy ticked. Then the Undo toast and the Queue. | Only now does the recommendation appear: evidence before verdict. Judgment is needed, so Claude proposes no action, and it never proposes denial. The letter is one consolidated request in plain language, not three rounds. I invite the waiver. Maria asked for Spanish, so a Spanish copy goes with it. Reminders go out by email and text, so the case never stalls in silence. I send, and I have ten seconds to undo. |
| 3:02 | Click **Decision record** on the Delgado row, then close the drawer. | The row reads "Waiting on applicant" with a paused clock. Timeline: saved review, Rulebook v1.0, criteria opened, letter edited, request sent, reminders scheduled, reviewer. | Her clock is paused, so applicant time never counts against the city. Every action leaves a record: what was read, which rulebook version, what the human changed, who decided. That is what an appeals officer or an inspector general asks for. |
| 3:15 | Open **Rulebook**. Click **Add source**, **Load example**, **Add**. Click **1 proposed change**, read the impact line, click **Approve change**. | Five sources. R6 appears as Processing, then "1 proposed change". Side-by-side S2, the impact line, the effective date. Toast: "Rulebook v1.1 published by J. Okafor." | Where do the rules come from? The city's own documents: code excerpts, the internal checklist, two years of closed cases. When a bulletin arrives a policy lead adds it, and Claude proposes the change with the passage cited. Before approving she sees the impact: 37 past decisions would have differed. It applies only to new applications, so nobody's rules change mid-application. A person approves, and Rulebook 1.1 is live. |
| 4:00 | Open **Proving ground**. On the first X1 row, click **B is right**. | The 91% headline and bars by criterion, X1 at 79%. The row reveals that B was Claude; the tally moves to 41 of 108. | Before any of this touched a live case, Claude ran silently on 1,200 closed cases and agreed with the city 91% of the time. The disagreements matter most. Senior reviewers settle them blind: A or B, no names. Here B was Claude, and it caught the overloaded panel. Settled cases become the golden set. |
| 4:28 | Open **Scoreboard**. Point to the tiles and the ladder. Click **Approve switch**. | 34 to 21 days, backlog 412 to 286, the team-level footnote, the trust ladder with Front door locked, the model card at 91% to 94%. | The director's view. Days to decision fell from 34 to 21; the backlog is down by a third. Figures are for the team, never for ranking individuals. The director decides how far up the trust ladder to go. When a stronger model ships it is re-run on the golden set first: 91 to 94. That is how stronger AI becomes a measurably better agency. |
| 4:56 | Stay on the Scoreboard. | No change. | Casework: from seats to cases. |

## If something goes wrong

- A click lands somewhere unexpected: press Escape to close any drawer, and carry on from the Queue.
- Lost your place: click **Reset demo** and start again from the Queue.
- Running long: skip the 3:02 beat first, then the click in the 4:00 beat.

## Keyboard shortcuts on Case review

- Up and Down move between criteria.
- N selects the next flagged criterion.
- Escape closes any drawer or dialog.
