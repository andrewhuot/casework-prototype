# Casework prototype: project conventions

Casework is a front-end-only prototype of AI-assisted permit review for a city building department. The spec is `docs/REQUIREMENTS.md`; the plan and open decisions are in `docs/PLAN.md`.

## Rules that must hold

- **Naming rule.** The name of the company that makes Claude must not appear anywhere: interface, page title, package metadata, code, comments, docs, commit messages, or build output. The word "Claude" is fine. `npm run check:names` scans tracked files, the git log, and build output, and must pass before every push. The search term inside that script is assembled from fragments so the script stays clean.
- **Clean commits.** Commit messages carry no co-author, "Generated with", or session trailers, because the default co-author trailer carries the company's email domain and would break the naming rule. The README says plainly that the prototype was built with Claude Code. `.claude/settings.json` turns attribution off and `.githooks/commit-msg` (wired through `core.hooksPath`, set by `npm run prepare`) strips them if they slip through.
- **Prototype-shaped.** No backend, services, accounts, environment files, Docker, CI, or deployment config. No network requests at runtime: no CDNs, remote fonts, remote images, or analytics. State lives in memory; "Reset demo" restores it. No browser storage.
- **Synthetic data.** Fictional people, addresses, parcels, rule text, and section numbers. Emails end in `example.com`, phones use 555. The prototype tag stays visible on every screen. No real seal or logo.
- **Saved reviews are real model output.** `src/data/reviews/*.json` was produced by Claude from the packet text, following `docs/REVIEW_GENERATION.md`. Do not hand-edit findings; regenerate and rerun the checks.
- **Accessibility.** WCAG 2.1 AA: keyboard operation, visible focus, labelled controls, AA contrast, `prefers-reduced-motion` respected. Status always carries an icon and a text label.

## Conventions

- Vite + React 19 + TypeScript strict. CSS Modules with tokens from `src/styles/tokens.css`; no hard-coded colours, sizes, or durations in components.
- `@/` maps to `src/`. Screens live in `src/screens`, shared UI in `src/components/ui`, data in `src/data`.
- Dates are ISO strings in UTC; the demo date is fixed at 21 Sep 2026 in `src/lib/dates.ts`. Display with `formatDate` ("5 Oct 2026").
- Tabular numerals (`.tnum`) on IDs, dates, and metrics.
- Tests exist to keep the demo from breaking: Vitest for the section 9 data checks, the electrical rules, and date maths; Playwright for the section 11 script, axe, and the offline single-file build. Do not special-case code to satisfy a test.
- Conventional commit messages (feat, fix, refactor, docs, test, chore).

## Commands

```
npm run dev            # dev server
npm run build          # production build to dist/
npm run build:single   # single-file build to release/casework-demo.html
npm test               # unit tests (section 9 checks, dates)
npm run test:e2e       # Playwright walkthrough, axe, offline
npm run check:names    # naming rule
```
