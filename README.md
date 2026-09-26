# Casework

Chat makes employees faster. Casework makes agencies faster.

Casework is a review layer inside Claude for Government and Claude Enterprise. It prepares every case against an agency's own rules, and it proves its accuracy on that agency's closed cases before anyone relies on it. This repository is the clickable prototype that accompanies the memo [*Casework: turning model capability into state capacity*](docs/MEMO.md).

![Case review: the electrical finding, with its evidence, rule, and precedent](docs/screenshots/06-case-review-x1.png)

**Synthetic data.** Every person, address, parcel, case, rule excerpt, and figure is invented. The City of Miami is used for illustration only and has no involvement. A tag saying so is on every screen.

## Try it

- **In one minute, no install.** Download `casework-demo.html` from the [latest release](https://github.com/andrewhuot/casework-prototype/releases/latest) (or from [`release/`](release/casework-demo.html) in this repo), open it in a browser window at least 1280 px wide, and click **Run review** on the Delgado case. It works offline.
- **Watch it.** [`docs/walkthrough.mp4`](docs/walkthrough.mp4) is a silent 4:26 recording, paced to [the demo script](docs/DEMO_SCRIPT.md).

## What the prototype has to prove

| The memo claims | Where you see it |
| --- | --- |
| Much of a case's life is waiting and rework, and chat only trims the minutes inside an open case | The queue is sorted by what each case needs. One letter asks for everything missing. The applicant's clock pauses while she replies |
| Claude catches what separate reviewers miss, and shows its work | Delgado, X1: each electrical sheet passes alone, and together they fail. Every finding is one click from its evidence, its rule, and its precedents |
| Trust is earned per criterion on the agency's own cases, so a stronger model is a measured gain | Proving ground: 91% agreed, 95% on the golden set, and setbacks stays at Second reader. Scoreboard: a new model lifts setbacks over the bar, and the director moves it up |
| The agency pays for results | Scoreboard: calendar days against the baseline, with a comparison group beside it, and accuracy on known-answer cases, the two numbers the share at risk would be paid on |

## Design decisions worth arguing with

- **The reviewer never writes a prompt.** Opening a case shows the finished review.
- **Evidence before verdict.** The recommendation stays hidden until every flagged criterion has been opened.
- **Claude can speed a yes, never propose a no.** Only a person starts an adverse action.
- **Agreement is not accuracy.** Senior reviewers settle every disagreement blind and relabel a random sample of agreements, so a mistake Claude shares with the original reviewer still counts.
- **Up takes a person; down takes nobody.** A criterion moves up a rung only when the director moves it, and drops a rung on its own when Claude's findings on known-answer cases slip.
- **Two clocks, on purpose.** The queue clock pauses while a request is out, so no reviewer is blamed for the applicant's time. The metric the share at risk is paid on counts calendar days, so more requests can never look like speed.
- **Team metrics only.** The tool measures the mission, not the person, and an override rate near zero is a warning, not a win.

## Left out on purpose

- **A second workflow.** Permits, SNAP, and federal reviews share one shape, and one case done properly shows it better than three done lightly.
- **Denials.** Claude never drafts one.
- **A blank chat box.** A reviewer can ask about a case, but the review never waits on a question.
- **The Front door.** Checking applications before they are filed is the last rung, and it stays locked, because public-facing comes after trust.
- **Colour for its own sake.** The interface is quiet so that the few things needing attention stand out.

## What I got wrong on the way

The first version of the hero finding added the new unit's load to the solar backfeed, as if the two currents stacked. They don't, and a plans examiner would have said so in a second. The real conflict is subtler. To fit a 40 A solar backfeed on a 150 A panel under the 120% busbar rule, the installer derated the main breaker to 125 A, and the backyard unit brings the house's load to 144 A. Each sheet passes on its own; together, 144 A sits on a 125 A breaker. [`src/lib/electrical.ts`](src/lib/electrical.ts) now states both rules as arithmetic, and the tests re-derive every electrical conclusion from the packets' numbers.

## What is real and what is not

- **Real.** The seven saved reviews are Claude's output from the packet text, produced as described in [`docs/REVIEW_GENERATION.md`](docs/REVIEW_GENERATION.md). The tests hold that output to its packets: every quote is an exact substring, every ID exists, each recommendation follows the rules, and each electrical conclusion is re-derived from the numbers.
- **Illustrative.** Every figure on the Proving ground and the Scoreboard, every rule excerpt, and every name.
- **Not built.** Live model calls (`reviewCase(caseId)` in `src/data/reviews/index.ts` is the seam), integrations, sign-in, and persistence.

## The four-minute demo

Click **Reset demo** first. The full script, with what to click and what to say, is in [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

| Time | Beat | The point it lands |
| --- | --- | --- |
| 0:00 | Queue | Much of 34 days is waiting and rework, not reading |
| 0:20 | Run review on Delgado | The reviewer never writes a prompt |
| 0:35 | A3 Setbacks | Conflicts are marked unclear, not guessed, and setbacks is still at Second reader |
| 1:10 | A5 Flood elevation | A missing document is caught in the first minute, not three weeks later |
| 1:20 | X1 Electrical capacity | Each sheet passes alone; together, 144 A of load sits on a 125 A breaker |
| 1:50 | Recommendation and send | Evidence before verdict. One letter, in Spanish, with reminders, on the record |
| 2:35 | Rulebook | A new bulletin becomes a proposed change, with its effect on 37 past decisions |
| 3:10 | Proving ground | Agreement is not accuracy: electrical capacity is 79% agreed, 94% on the golden set |
| 3:45 | Scoreboard | What the share at risk is paid on, and a new model that lifts setbacks over the bar |
| 4:20 | Close | "Casework: from seats to cases." |

## Run it from source

You need Node.js 20 or newer.

```bash
git clone https://github.com/andrewhuot/casework-prototype.git
cd casework-prototype
npm install
npm run dev            # http://localhost:5173
```

```bash
npm run build:single   # one self-contained file: release/casework-demo.html
npm test               # data checks, electrical rules, dates (87 tests)
npm run test:e2e       # the demo script beat by beat, axe on every screen, offline build (19 tests)
npm run check:names    # naming rule
```

The demo date is fixed at 21 Sep 2026, and state lives in memory only. **Reset demo** restores the start.

## How it was built

With Claude Code, from a written spec ([`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)) and an acceptance checklist ([`docs/ACCEPTANCE.md`](docs/ACCEPTANCE.md)), the way a prototype would be built at work. The tests exist to hold the prototype to the spec, not to make it production-shaped. [`docs/PLAN.md`](docs/PLAN.md) records every choice the spec left open and how it was resolved, and [`CLAUDE.md`](CLAUDE.md) holds the project rules the agent works under.

## Screenshots

Captured by the walkthrough test at 1440 by 900.

| | |
| --- | --- |
| ![Queue](docs/screenshots/01-queue.png) | ![Case review, A3 at Second reader](docs/screenshots/03-case-review-a3.png) |
| ![Recommendation and letter](docs/screenshots/07-recommendation.png) | ![Proposed rule change with its impact](docs/screenshots/12-proposed-s2-change.png) |
| ![Proving ground](docs/screenshots/15-proving-ground-settled.png) | ![Scoreboard after the model switch](docs/screenshots/17-scoreboard-switched.png) |
