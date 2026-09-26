# Acceptance checklist (spec section 10)

Every item below was exercised in a browser: by the Playwright suite in Chromium against the production build (`npm run test:e2e`, 19 tests) and by hand in the in-app browser at 1440 by 900 during the build. "Test" names the spec file that exercises the item so it stays true.

## Must work

| Item | Result | Exercised by |
| --- | --- | --- |
| The section 11 script runs start to finish in about four minutes, with no dead end | Pass | `e2e/walkthrough.spec.ts` performs every beat and its assertions in about 40 s of machine time; `docs/walkthrough.mp4` paces it at 4:20 |
| Navigation between Queue, Rulebook, Proving ground, and Scoreboard, with no sign-in and no setup | Pass | walkthrough; sidebar links |
| Queue sorting, filter chips, the first-visit hint, and the summary line updating after each change | Pass | walkthrough (sort order, summary before and after send), `offscript.spec.ts` (filters, empty filter, hint dismiss), `src/lib/queue.test.ts` |
| "Run review" on the Delgado case: three readable progress steps, then the saved review with its "Saved review" tag and tooltip | Pass | walkthrough asserts the three step labels, the ticks, the tag, and the tooltip text |
| All seven cases open with grouped criteria and the expected statuses | Pass | offscript "all seven cases open", `src/data/reviews.test.ts` |
| Selecting a criterion shows its rule, source chip, finding, precedents, and highlighted evidence | Pass | walkthrough (A3, A5, X1), offscript |
| A3 on the Delgado case highlights both "5 ft 0 in" and "4 ft 6 in", and lists four past decisions | Pass | walkthrough asserts both marks in the viewport, four precedent rows, and the Second reader tag |
| "Next flagged" steps through A3, A5, and X1, and then the recommendation reveals | Pass | walkthrough; `src/lib/caseReview.test.ts` |
| The letter is editable, bracketed text disables sending with a hint, and the buttons follow the recommendation rules | Pass | walkthrough (hint text, edit, enable), offscript (primary button per recommendation, Decide differently contents) |
| Approving with unmet or unclear criteria asks for confirmation and a reason | Pass | offscript "approving with unmet or unclear criteria" |
| Send options: reply due 5 Oct 2026, reminder checkboxes with their defaults, and the Spanish copy pre-ticked with a working preview | Pass | walkthrough; `src/lib/dates.test.ts` |
| Sending shows the Undo toast, moves the case to Waiting on applicant, and pauses its clock | Pass | walkthrough; Undo restores in offscript |
| Deny exists only under "Decide differently" and requires a typed reason | Pass | offscript (deny dialog, empty reason refused, adverse-action notice) |
| Waiting and Decided cases open a Decision record that lists the send options chosen | Pass | walkthrough (reply due, reminders, Spanish copy), offscript (approved case record) |
| Source viewer, Past decision, Decision record, and Letter preview all use the same drawer | Pass | one `Drawer` component; `axe.spec.ts` opens each |
| Add source with "Load example", the proposed S2 change with its impact line and effective date, approval, and v1.1 shown everywhere | Pass | walkthrough asserts the diff text, impact line, date, toast, top bar, heading, R6 Active, Updated in v1.1 |
| Proving ground shows agreement and the golden set per criterion, applies the threshold to the golden set, and settles disagreements blind | Pass | walkthrough (floor line, 11 of 12 met, X1 79% and 94%, A3 below, B was Claude, tally 41 of 108), offscript (A, Unclear) |
| The model card moves through its three states, and moving A3 up updates the ladder and removes the tag | Pass | walkthrough (switch, move up, coverage line, toast), offline, axe on each state |
| Scoreboard renders the numbers given here, the comparison group, the override-rate line, and the team-level footnote | Pass | walkthrough asserts all four tiles, the comparison group, both lines, the footnote in the viewport |
| "What this review does not cover" opens its note | Pass | offscript |
| "Reset demo" restores the starting state | Pass | walkthrough "Reset demo restores the starting state" |
| The section 9 build-time checks pass | Pass | `npm test`: 87 tests, including the electrical rules re-derived from each packet |
| The single-file build opens from disk, offline, with fonts and icons intact | Pass | `e2e/offline.spec.ts` loads `release/casework-demo.html` from `file://` with the context offline and every http(s) request aborted, checks the three font families loaded and icons rendered, and runs the core script |
| No console errors, no network requests at runtime, and no company name anywhere | Pass | walkthrough collects console errors and external requests (both empty); `npm run check:names` scans tracked files, git history, and build output |
| The prototype tag is always visible | Pass | sidebar footer at 1280 px and above, top bar below; asserted at the start and end of the walkthrough |

## Only if time allows

| Item | Result | Exercised by |
| --- | --- | --- |
| Reviewer changes to a criterion, with a reason | Pass | offscript: change A3 to Met with a reason, count updates, row tagged, record lists it |
| Ask about this case, with suggested questions and saved answers | Pass | offscript; every answer's quote verified against its document in `reviews.test.ts` |
| Keyboard shortcuts for criteria | Pass | offscript: Down, N, Up |
| Request-round warning on the Patel case | Pass | offscript |
| Adverse-action notice on Deny | Pass | offscript |

## Also verified

- WCAG 2.1 AA: axe (wcag2a, wcag2aa, wcag21a, wcag21aa) on every screen and every drawer and dialog state, zero violations (`e2e/axe.spec.ts`).
- Layout at 1280, 1440, 1920, and 1024 px: no horizontal overflow, both A3 highlights in view, the Scoreboard's model card above the fold (offscript "layout holds").
- Reduced motion: all CSS animation and transition durations collapse under `prefers-reduced-motion`, and JS animations (count-up, evidence scroll, toast timer) check the same query.
