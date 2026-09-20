# Progress

## Done
- M1: scaffold (Vite 8, React 19, TS strict), tokens, fonts, base styles, primitives (Button, Chip family, Tooltip, Drawer, Dialog, Toast, Tabs, Switch, Checkbox, Field, Menu, Banner, ProgressSteps, EmptyState, Table styles, PageHeader, Card), shell (SideNav, TopBar, PrototypeTag), router, store, static data (criteria, sources, precedents, cases, proving ground, scoreboard), naming check, commit hook.

- M2: seven packets as typed paper documents (Delgado 389 words, others under 250), seven saved reviews performed from the packet text (see docs/REVIEW_GENERATION.md), Spanish letter, saved questions, section 9 checks as Vitest (63 tests passing).

- M3: Queue with sorting, filters, summary line, first-visit hint, Run review progress dialog.
- M4: Case review: criteria pane, rule card with source chips and precedents, paper documents with SVG drawings and exact-string highlights, missing-document page, recommendation gate, letter editor with bracket highlighting, send options, action bar with Decide differently, approve/escalate/deny/change dialogs, drawers (Source viewer, Past decision, Decision record, Letter preview), keyboard shortcuts, Ask about this case, not-covered note.

- M5: Rulebook: sources table, Add source dialog with Load example, Processing then proposed change, side-by-side S2 diff with impact line and effective date, v1.1 published everywhere, criteria tab with Updated tag.
- M6: Proving ground (headline, readiness banner, agreement bars with threshold, blind disagreement queue with reveal and count-up tally) and Scoreboard (tiles, usage and override lines, backlog chart with week-4 marker, trust ladder, model update card).

- M7: decision record, reviewer changes, Ask about this case, keyboard shortcuts, request-round warning, adverse-action notice, WCAG fixes (axe clean on every screen).
- M8: Playwright walkthrough with screenshots (docs/screenshots), axe spec, offline single-file spec, off-script QA spec (11 flows plus layouts at 1280/1920/1024), README, DEMO_SCRIPT, ACCEPTANCE, single-file build in release/.

- Recorded docs/walkthrough.webm (5:02, paced to the script, cursor overlay). Tagged v1.0-demo with the single-file build attached to the GitHub release.

## Next
- Nothing outstanding. To resume: `npm install`, `npm run dev`; run `npm test`, `npm run test:e2e`, `npm run check:names` before pushing.

## Decisions
- See docs/PLAN.md section 6.
