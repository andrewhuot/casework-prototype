# Casework

Casework is a high-fidelity, front-end-only prototype of AI-assisted permit review for a city building department. A reviewer opens a combined ADU and rooftop solar application that Claude has already checked against the city's own rulebook; every finding links to its evidence, its rule, and similar past decisions, and the reviewer decides. Three supporting screens show where the rules come from (Rulebook), how trust is earned (Proving ground), and how the mission metric moves (Scoreboard). Nothing leaves the browser: the seven reviews were generated ahead of time by Claude from the packet text and saved with their cases, and `reviewCase(caseId)` is the seam where a live call would go.

**Synthetic data.** Every person, address, parcel, case, rule text, and section number is invented. The City of Miami is used for illustration only and has no involvement. Source names point to real bodies of rules, but their content here is illustrative. Emails end in `example.com` and phone numbers use 555. A tag saying so is visible on every screen.

## Try it in one minute (no install)

1. Download `casework-demo.html` from the [v1.0-demo release](https://github.com/andrewhuot/casework-prototype/releases/tag/v1.0-demo).
2. Double-click it. It opens in your browser from disk and works offline. Use a window at least 1280 px wide.
3. Click **Reset demo**, then **Run review** on the Delgado case, and follow the script below.

Tested in Chrome. Any current desktop browser should work.

## Run it from source

You need Node.js 20 or newer. Check with `node --version`; if you do not have it, install it from https://nodejs.org.

```bash
git clone https://github.com/andrewhuot/casework-prototype.git
cd casework-prototype
npm install
npm run dev
```

Then open http://localhost:5173. Edits to the code reload in place. The demo date is fixed at 21 Sep 2026, and **Reset demo** in the top bar restores the starting state. State lives in memory only; nothing is stored in the browser.

Other commands:

```bash
npm run build          # static build in dist/
npm run build:single   # one self-contained file: release/casework-demo.html
npm test               # data checks and date maths (76 tests)
npm run test:e2e       # the demo script beat by beat, axe on every screen, offline build (19 tests)
npm run check:names    # naming rule
```

## The five-minute demo

What to click, and what to say, beat by beat. The silent recording in [docs/walkthrough.webm](docs/walkthrough.webm) performs exactly these clicks at exactly these times, so you can rehearse against it. A printable copy of this script is in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).
### Before you start

- Open the prototype in a browser window at least 1280 px wide (1440 is what the recording uses).
- Click **Reset demo** in the top bar. You should be on the Queue with seven cases and the blue "New here?" hint.
- Rehearse twice with a timer. The script has almost no slack at 5:00. To land near 4:00, drop the 3:02 beat and the click in the 4:00 beat.
- The lines under "Say" are written to be read aloud and land the same points as the strategy memo. Put them in your own words if you prefer.

### The script

#### 0:00 · Queue

**Do**
1. Stay on the Queue.
2. Point at the two Approve-ready rows (Alvarez, then Kim).
3. Point at the Delgado row at the top, marked New.

**Say**
"Everything here is synthetic, and the City of Miami is used for illustration only. In this scenario a permit decision takes a median of 34 days, and most of that is queue wait and rework, not review time. Casework sits inside the Claude that staff already use. The queue is sorted by how much judgment each case needs. These two are approve-ready: every criterion met, under a minute each. And Maria Delgado filed this morning: a backyard ADU and rooftop solar, in one application."

#### 0:25 · Run review

**Do**
1. Click **Run review** on the Delgado row.
2. Let the three steps tick: reading 7 documents, checking 12 criteria, finding similar past decisions. Case review opens with a "Saved review" tag.

**Say**
"In production this runs the moment an application arrives. For this demo, Claude generated each review from these exact documents, and it was saved, so the walkthrough is repeatable."

#### 0:47 · A3 Setbacks

**Do**
1. Point at "12 criteria: 9 met, 3 flagged." at the top of the left pane.
2. Point at A3 Setbacks. It is already selected.
3. Point at the two yellow highlights: "Rear setback: 5 ft 0 in" in the site plan notes, then "4 ft 6 in from the rear lot line" in the survey.

**Say**
"Nine criteria are met, each linked to its evidence. Three are flagged. And at the foot of the list, it states what this review did not check. First, setbacks. The site plan says five feet; the survey says four foot six. Claude marks it unclear. It doesn't guess."

#### 1:12 · The rule and the precedents

**Do**
1. Click the source chip **R1 §ADU-3** in the rule card. The drawer opens with the passage highlighted.
2. Let it sit for a few seconds, then press **Escape**.
3. Point at Similar past decisions: three Approved with waiver, one Denied.

**Say**
"The rule is one click away, in the source the city uploaded. So are past decisions: three similar encroachments were approved with a waiver, and one was denied. That's a judgment call, and it stays with the reviewer."

#### 1:37 · A5 Flood elevation

**Do**
1. Click **Next flagged**.
2. Point at the dashed page marked "Not provided".

**Say**
"Second: there's no elevation certificate. Today that becomes a rejection letter three weeks from now. Here it's caught in the first minute."

#### 1:52 · X1 Electrical capacity

**Do**
1. Click **Next flagged**.
2. Point at "Added load: 48 A", then at "Main service panel: 150 A, with a 40 A solar backfeed breaker".

**Say**
"Third, the one that two separate reviewers would miss. The ADU adds 48 amps, the solar backfeeds 40, and the panel is 150. Each permit passes on its own. Together, they don't."

#### 2:17 · The recommendation and the letter

**Do**
1. Look at the right pane: Needs judgment, the rationale, the draft letter, three equal buttons.
2. Click into the letter, select the bracketed line, and type: **You may apply for an administrative waiver for the rear setback.**
3. Point at the send options: reply due 5 Oct 2026, Email and Text message ticked, "Also send a Spanish copy" ticked.
4. Click **Send request for information**. The Queue returns with the Undo toast counting down.

**Say**
"Only now does the recommendation appear: evidence before verdict. Judgment is needed, so Claude proposes no action, and it never proposes denial: it can speed a yes, never automate a no. The letter is one consolidated request in plain language, not three rounds of rework. I invite the waiver. Maria asked for Spanish on her form, so a Spanish copy goes with it. If she hasn't replied, reminders go out by email and text, so the case never stalls in silence. I send, and I have ten seconds to undo."

#### 3:02 · Decision record

**Do**
1. On the Delgado row, now at the bottom and marked Waiting on applicant with a paused clock, click **Decision record**.
2. Let the timeline sit for a few seconds, then press **Escape**.

**Say**
"Her clock is paused, so applicant time never counts against the city. Every action leaves a record: what was read, which rulebook version, what the human changed, and who decided. That's what an appeals officer or an inspector general asks for."

#### 3:15 · Rulebook

**Do**
1. Click **Rulebook** in the sidebar. Five sources.
2. Click **Add source**, then **Load example**, then **Add**. R6 appears as Processing, then "1 proposed change".
3. Click **1 proposed change**. Point at the impact line.
4. Click **Approve change**. Point at "Rulebook v1.1" in the top bar.

**Say**
"Where do the rules come from? The city's own documents: code excerpts, the internal checklist, and two years of closed cases. When a new bulletin arrives, a policy lead adds it, and Claude proposes the change with the passage cited. Before approving, she sees the impact: 37 past decisions would have differed. It applies only to new applications, so nobody's rules change mid-application. A person approves, and Rulebook 1.1 is live."

#### 4:00 · Proving ground

**Do**
1. Click **Proving ground**. Point at the X1 bar at 79%.
2. Point at the first X1 row in the disagreement queue.
3. Click **B is right**. The row reveals "B was Claude" and the tally moves to 41 of 108.

**Say**
"Before any of this touched a live case, Claude ran silently on 1,200 closed cases, from an export, with no integration. That is the Shadow rung, and it agreed with the city 91 percent of the time. The disagreements matter most. Senior reviewers settle them blind: decision A or decision B, no names. Here B was Claude, and it caught the overloaded panel. Settled cases become the golden set."

#### 4:28 · Scoreboard

**Do**
1. Click **Scoreboard**. Point at the days tile (34 to 21) and the backlog tile (412 to 286).
2. Point at the footnote: figures are for the team.
3. Point at the trust ladder, with Front door locked.
4. Point at the model card, then click **Approve switch**.

**Say**
"This is the director's view, and the numbers Casework is paid against. Days to decision fell from 34 to 21; the backlog is down by a third. The figures are for the team, never for ranking people, and the override rate sits beside them: near zero would mean rubber-stamping. The director sets how far up the trust ladder to go. A stronger model is re-run on the golden set first: 91 to 94. That's how stronger AI becomes a measurably better agency."

#### 4:56 · Close

**Do**
Stay on the Scoreboard.

**Say**
"Casework: from seats to cases."

### If something goes wrong

- A click lands somewhere unexpected: press **Escape** to close any drawer, and carry on from the Queue.
- Lost your place: click **Reset demo** and start again from the Queue.
- Running long: skip the 3:02 beat first, then the click in the 4:00 beat.

### Keyboard shortcuts on Case review

- Up and Down move between criteria. N selects the next flagged criterion.
- Escape closes any drawer or dialog.

## More

- [docs/PLAN.md](docs/PLAN.md): architecture, data model, and the decisions made where the spec left a choice.
- [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md): the acceptance checklist with how each item was verified.
- [docs/REVIEW_GENERATION.md](docs/REVIEW_GENERATION.md): how the saved reviews were produced and checked.
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md): the spec.

## Screenshots

Captured by the walkthrough test at 1440 by 900, 2x.

| | |
| --- | --- |
| ![Queue](docs/screenshots/01-queue.png) | ![Case review, A3](docs/screenshots/03-case-review-a3.png) |
| ![Case review, X1](docs/screenshots/06-case-review-x1.png) | ![Recommendation](docs/screenshots/07-recommendation.png) |
| ![Decision record](docs/screenshots/10-decision-record.png) | ![Proposed S2 change](docs/screenshots/12-proposed-s2-change.png) |
| ![Proving ground](docs/screenshots/15-proving-ground-settled.png) | ![Scoreboard](docs/screenshots/16-scoreboard.png) |
