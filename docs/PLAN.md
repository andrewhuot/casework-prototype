# Casework prototype: build plan

Source of truth: `docs/REQUIREMENTS.md` ("the spec"). This plan records the architecture, data model, component inventory, design tokens, milestones, and every place the spec left a choice open and how it was resolved.

## 1. Architecture

- **Stack.** Vite 8, React 19, TypeScript (strict). CSS Modules for component styles, driven by one token file (`src/styles/tokens.css`). Zustand for the in-memory store. `react-router-dom` with `HashRouter`, so the app runs from `file://` and any static host. `lucide-react` for icons. Hand-built SVG charts and drawings (no chart library).
- **Fonts.** Self-hosted from npm: Inter Variable (interface), Source Serif 4 Variable (paper documents and letters), Caveat (signatures). Only the latin subsets are referenced, through hand-written `@font-face` rules, so the single-file build stays small. Tabular numerals are switched on for IDs and metrics.
- **No network at runtime.** No remote fonts, images, analytics, or API calls. Verified by a Playwright test that loads the single-file build from `file://` with every http(s) request aborted and counted.
- **Single-file build.** `npm run build:single` uses `vite-plugin-singlefile` with an unlimited asset inline limit, so fonts and icons become data URIs inside one HTML file, copied to `release/casework-demo.html`.
- **State.** One Zustand store (`src/app/store.ts`) holds every mutable thing: case statuses and decisions, opened criteria, letter edits, send options, rulebook version and S2 override, sources, Proving ground settlements, Scoreboard toggles, toasts, the drawer, and the hint. `reset()` rebuilds it from the typed seed data. Nothing touches browser storage.
- **Review seam.** `reviewCase(caseId)` in `src/data/reviews/index.ts` returns the saved review for a case. It is async so a live model call can replace it later without touching the screens.
- **Demo clock.** `DEMO_DATE = 2026-09-21` in `src/lib/dates.ts`. Business-day arithmetic (reply due, reminders, next business day) is a pure function with unit tests.

## 2. Data model (`src/data/`)

| File | Contents |
| --- | --- |
| `types.ts` | All shared types: `Criterion`, `Source`, `Precedent`, `CaseMeta`, `Packet`, `PacketDocument` and its blocks, `Review`, `CaseStatus`, `Decision`, `SendOptions` |
| `criteria.ts` | The twelve criteria in rulebook order with group, short name, test, source citations, and the document each one expects |
| `sources.ts` | R1 to R6 with type, added date, and excerpt sections (label + text). R6 is flagged `hiddenOnLoad` |
| `precedents.ts` | The eight prior decisions with facts, decision, and why they are similar |
| `cases.ts` | Queue metadata for the seven cases: applicant, address, parcel, type, days in queue, filed date, contact, preferred language, request history |
| `packets/*.ts` | One packet per case: documents as typed blocks (fields, paragraphs, lists, drawings, signatures, notary, stamp) plus the list of expected-but-missing documents |
| `reviews/*.json` | The saved model output per case, in the section 9 shape, plus `letterSpanish` for Delgado |
| `reviews/index.ts` | `reviewCase(caseId)` |
| `questions.ts` | "Ask about this case": three saved questions and answers per case |
| `provingGround.ts`, `scoreboard.ts`, `notCovered.ts` | Hard-coded screen data |

A document's searchable text is the concatenation of its text blocks. Evidence quotes are matched by exact substring search inside a single block, which is what the highlighter does at runtime. The section 9 tests enforce that every quote is found that way.

## 3. Component inventory

- **Primitives (`components/ui`)**: Button (primary, secondary, ghost, danger; sizes), Chip family (StatusChip, CriterionStatusChip, SourceChip, TypeTag, OutcomeChip), Drawer (native `<dialog>`, 480 px, slides in), Dialog (native `<dialog>`, centred), Toast + ToastRegion (with a ten-second draining Undo timer), Table, Tabs, Tooltip, Switch, Checkbox, TextField/TextArea, DateField, Menu, Banner, Hint, EmptyState, ProgressSteps.
- **Shell (`components/shell`)**: AppShell, SideNav (220 px, Chats and Projects muted, Casework group), TopBar (department, rulebook version, Reset demo), PrototypeTag.
- **Documents (`components/documents`)**: PaperDocument (letterhead, Received stamp, fields, paragraphs, signature, notary block), MissingDocument ("Not provided"), HighlightedText, drawings: SitePlan, SurveySketch, RoofPlan, SingleLineDiagram.
- **Drawers (`components/drawers`)**: SourceViewer, PastDecision, DecisionRecord, LetterPreview (formatted letter on a fictional letterhead).
- **Charts (`components/charts`)**: AgreementBars, BacklogChart (12 weeks, week-4 marker).
- **Screens (`screens/`)**: Queue (+ RunReviewDialog), CaseReview (CriteriaPane, RuleCard, EvidencePane, RecommendationPane, LetterEditor, SendOptions, ActionBar, Approve/Escalate/Deny/Change dialogs, AskAboutCase, NotCoveredNote), Rulebook (SourcesTab, CriteriaTab, AddSourceDialog, ProposedChangeDialog), ProvingGround, Scoreboard.

## 4. Design tokens (proposed)

- **Colour.** Cool-neutral grey scale (`--gray-0` to `--gray-900`), one accent blue (`--accent-500: #2f5fe0`, 5.5:1 on white) for the primary action, links, selection, and focus. Status tints, each a light background with a dark text colour that passes AA on that background: blue (New), green (Approve-ready, Met), amber (Needs information, Not met), violet (Needs judgment, Unclear), slate (Waiting on applicant), grey (Decided). Evidence highlight: a warm yellow with a 2 px underline so it survives greyscale. Paper: warm off-white with a hairline border.
- **Type.** Inter Variable. Scale: 11, 12, 13 (default interface), 14, 16, 18, 22, 28 px. Line heights 1.35 to 1.5. `font-variant-numeric: tabular-nums` on IDs, dates, and metrics. Source Serif 4 for paper. Caveat for signatures.
- **Spacing.** 4 px base: 4, 8, 12, 16, 20, 24, 32, 40, 48.
- **Radius.** 4 (chips, inputs), 6 (buttons), 8 (cards), 12 (dialogs), 999 (pills).
- **Elevation.** `--shadow-sm` for cards, `--shadow-md` for menus and toasts, `--shadow-lg` for the drawer and dialogs.
- **Motion.** `--dur-fast: 150ms`, `--dur-base: 200ms`, `--dur-slow: 250ms`, `--ease-out: cubic-bezier(.2,.8,.2,1)`. Every animation is disabled under `prefers-reduced-motion: reduce`, and JS animations check the same media query.

## 5. Milestones

1. **M1** scaffold, tokens, shell, primitives, naming check, commit hook.
2. **M2** data, packets, saved reviews, section 9 checks as Vitest tests.
3. **M3** Queue and the review progress.
4. **M4** Case review (hero screen).
5. **M5** Rulebook and sources.
6. **M6** Proving ground and Scoreboard.
7. **M7** Decision record, the "only if time allows" items, keyboard shortcuts, accessibility.
8. **M8** Polish: Playwright walkthrough with screenshots, axe on every screen, offline test, fresh-eyes QA, acceptance checklist, release.

## 6. Spec ambiguities and how they were resolved

| Question | Decision |
| --- | --- |
| Which buttons show for Approve-ready and Needs information? | The recommended action is the single primary button. The other two actions and Deny live under "Decide differently". For Needs judgment all three buttons show with equal weight and "Decide differently" holds Deny only. This keeps "one primary action per screen" and "Deny exists only under Decide differently". |
| Where is the prototype tag? | In the sidebar footer, so it is on screen on every route without eating vertical space from the working area. |
| What does the review progress show? | A centred progress dialog with three steps, about 3.2 seconds in total, then navigation to the case. It reads clearly on camera. |
| Rulebook version on the review progress step | The step shows the version that applies to the case (v1.0 for every seeded case, because all were filed before 22 Sep 2026). The top bar shows the global version. This follows the "no rule changes mid-application" policy; in the script both are v1.0 anyway. |
| Days in queue for a case filed today | Shown as "Today". |
| Undo on decisions | The spec pattern says anything sent outside the department can be undone for ten seconds. Approve (permit notice) and Deny (denial letter) therefore also get Undo; Escalate is internal and does not. |
| Clicking a New row (not the button) | Starts the same Run review flow, so no click is a dead end. |
| Choosing "Send request for information" on a case whose draft is an approval notice | The draft switches to a request template with one bracketed line for the reviewer, so send stays disabled until it is written. |
| Send options for Needs judgment | Shown, because the draft is a request to the applicant (it asks for something or invites a waiver). Hidden only for approval notices. |
| Decided and Waiting cases opened from the queue | Open in a read-only state: the right pane shows the outcome, the letter as sent, and a link to the decision record. |
| Proving ground A/B order | Fixed per row (looks random, is deterministic) so the script and tests are stable. The first X1 row has Claude as B, as the spec requires. |
| Date fields | Native `<input type="date">` for accessibility, with the plain-English date shown beside it. |
| Model name in the decision record | "Claude" with the model family used to generate the saved reviews, as recorded in `docs/REVIEW_GENERATION.md`. |
| Reviewer changes and the recommendation | A change updates the counts and tags the row. The saved recommendation is not re-derived, and the change is listed in the decision record. |
| Escalate outcome | The case becomes Decided with the outcome "Escalated to senior reviewer". |
| Spanish copy after edits | The preview shows the saved Spanish letter. The decision record notes that the copy was updated to match the reviewer's edits when sent, as the helper text promises. |
| "Also send a Spanish copy" on other cases | Shown only when the application states a preferred language (Delgado). Other applicants did not ask for one, and a copy would need a live model call. |
| "What this review does not cover" | Opens as a small dialog rather than the drawer, which the spec reserves for four uses. |
| Progress dialog timing | Steps tick at 1.0, 2.1 and 3.1 seconds and the case opens at 3.9 seconds, so the third tick is visible for a beat. |
| Drawer and dialog Escape | Handled both through the native dialog cancel event and a keydown handler, because some automation environments do not fire cancel for synthetic key presses. |
| Rulebook version on a case | The decision record and the review progress show the version that applies to the case (v1.0 for every seeded case). The top bar shows the global version. |
| Layout below 1280 px | The sidebar collapses to an icon rail and the prototype tag moves into the top bar so it stays visible. Phones are out of scope. |
| Source viewer for R6 before approval | "Used for" reads "No criteria cite this source yet" until the S2 change is approved, then lists S2. |
| Evidence scrolling | The centre pane centres the whole span of highlights when it fits, so every quote for the selected criterion is on screen at once. Otherwise the first quote sits near the top. |
