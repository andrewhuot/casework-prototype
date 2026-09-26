# Casework: turning model capability into state capacity

26 September 2026 · Andrew Huot

## Summary

We should build Casework, a review layer inside Claude for Government and Claude Enterprise that prepares every case against an agency's own rules and proves its accuracy on that agency's closed cases before anyone relies on it.

Chat makes employees faster. Casework makes agencies faster, and it earns each new responsibility on the agency's golden set, its past cases with settled answers, so every stronger model becomes a measured gain.

We should sell it the way NASA bought cargo flights from SpaceX, with part of the fee at risk on results. The ask is one team for two quarters, gated at month six on routine permits decided 30% faster than a comparison group, with no loss of accuracy.

## 1. Where the time goes

In Pennsylvania I worked with Governor Shapiro's administration on permits and on SNAP applications, where accuracy now has a price. Under the One Big Beautiful Bill Act, from fiscal 2028 a state with a payment error rate of 6% or more pays [5% to 15% of its SNAP benefits](https://www.usda.gov/sites/default/files/guidance-documents/fns.snap-obbb-implementation.pdf). Pennsylvania's rate fell to [9.21%](https://www.fns.usda.gov/snap/qc/per) in fiscal 2025, which still means a bill of [up to $400 million a year](https://www.inquirer.com/politics/pennsylvania/snap-benefits-trump-pennsylvania-budget-20260920.html).

A city building permit, a state SNAP application, a federal land permit and a veteran's disability claim share one shape: evidence, a rulebook, a person who decides, and a record that must survive appeal. They differ mostly in their rules.

Time to decision is waiting, plus the minutes someone works the case, plus rework. Only the middle term is review, and the other two take much of the time. San Francisco's median housing permit needed [three rounds of review](https://sfbos.org/sites/default/files/BLA_Post_Entitlement_Permitting_030526.pdf), and among recent permits the median took 114 days to issue while no department's median review ran past 30 days.

Chat shortens the minutes; staff in Pennsylvania's ChatGPT pilot reported saving an average of [95 minutes a day](https://www.pa.gov/governor/newsroom/2025-press-releases/-shapiro-administration-leads-the-way-in-ethical-use-of-ai). But it works inside a case someone has already opened. It does not choose what to open next, catch the missing document before the first letter, or notice that two permits conflict.

Trust is the other constraint. An agency cannot rely on what it cannot measure on its own cases. Each model release raises what Claude can do but not what the agency can prove, so the gap keeps widening.

## 2. The proposal

Casework turns an agency's rulebook into a reviewer's first pass. It checks every criterion, links each finding to its evidence, rule and precedents, and drafts one letter asking for everything missing. A person makes every decision. Claude flags errors in both directions but never proposes a denial or a cut in benefits, because those carry due-process rights.

The golden set, the agency's past cases with answers settled by its senior reviewers, does three jobs.

- **It earns trust.** Agreement with past decisions is not accuracy, so senior reviewers settle every disagreement blind and relabel a random sample of agreements, catching mistakes Claude shares with the original reviewer.
- **It turns model progress into agency progress.** Each new model runs on the golden set before the switch, and any criterion that now clears the bar can move up.
- **It keeps speed honest.** Cases with known answers, some carrying a deliberately wrong draft, enter the live queue unmarked, and staff know the practice exists. A faster agency cannot quietly become a sloppier one.

Each criterion climbs on its own, so a license check can reach First review while a setback waiver stays at Second reader.

| Rung | What Claude does |
| --- | --- |
| 1. Shadow | Reviews closed cases; nothing reaches a live one |
| 2. X-ray | Sorts the live queue by what each case needs |
| 3. Second reader | Checks the reviewer's call before it goes out |
| 4. First review | Prepares each case before the reviewer opens it |
| 5. Front door | Checks an application before it is filed |

A criterion moves up when it clears the agency's bar on the golden set and the director moves it. It moves down on its own when Claude's findings on known-answer cases, over a rolling window, fall below the bar.

Why not something simpler? A Claude Project with a good prompt writes a good review but leaves no baseline, golden set, versioned rulebook or record an appeals officer will accept, and an AI plan checker speeds up one step for one code. Neither runs the queue or proves itself on the agency's own cases.

## 3. A long-term partner, the way SpaceX became one

The dollar deals are running out. Our OneGov agreement runs to 31 October, and OpenAI moves to [usage pricing](https://www.gsa.gov/about-gsa/newsroom/news-releases/gsa-expands-onegov-ai-offerings-with-discounted-openais-chatgpt-09102026) on 1 October. What we sell next should be priced on what agencies exist to do.

Agencies can buy Casework the way NASA learned to buy cargo for the space station. Starting in 2006, instead of building the vehicle itself, NASA paid SpaceX [$396 million](https://ntrs.nasa.gov/api/citations/20170008895/downloads/20170008895.pdf) against fixed milestones, SpaceX put in $454 million of its own, and NASA's cost model put the traditional route at ten times the price. NASA then bought cargo flights at a fixed price each, and SpaceX went on to fly astronauts and national security missions.

We should be that partner for the country's state capacity: we build and improve the capability, and the agency pays for what is delivered. Casework charges a platform fee and a fee per case, and 20% to 30% of those fees are at risk, paid only when calendar days to decision fall below the agency's baseline and decisions on known-answer cases stay as accurate as before. That is enough for an agency to notice and small enough for us to absorb a bad quarter, and [federal acquisition rules](https://www.acquisition.gov/far/subpart-37.6) already allow such incentives. At $25 a case, [VA claims](https://news.va.gov/press-room/va-reduces-backlog-of-veterans-waiting-for-va-benefits-by-57/) and [SSA disability decisions](https://www.ssa.gov/foia/resources/proactivedisclosure/2026/FY25%20Workload%20Data.pdf) alone, 5.2 million a year, would one day be worth $130 million a year.

A partner should also be easy to replace; NASA kept a second cargo provider. The agency owns its rulebook, golden set and records, so it can test any model against them. That is the bet: we should win on the agency's own scoreboard, every year.

Getting in should be easy too. In 2025 I helped bring OpenAI's o-series models onto [Venado](https://www.energy.gov/nnsa/articles/nnsas-los-alamos-national-laboratory-launches-frontier-ai-models-venado-supercomputer), the NNSA supercomputer at Los Alamos, after it moved to a classified network, and I installed the weights myself. Casework asks far less of an agency. It ships inside Claude for Government, which is already [authorized at FedRAMP High](https://support.claude.com/en/articles/13756069-public-sector-faqs), so it should need a significant-change review rather than a new authorization. Agency data never trains a model, and the decision record stays open to FOIA and state right-to-know requests.

## 4. Plan and the ask

Start with permits, in cities and states and then federal offices, and bring benefits and claims live later. Permit rules are closest to a checklist, a wrong answer costs less than a wrongly denied benefit, and federal agencies were told last year to adopt [automated screening and case management](https://permitting.innovation.gov/CEQ_Permitting_Technology_Action_Plan.pdf) for environmental reviews.

SNAP stays in Shadow for at least six months, on the state's quality-control sample. That sample is already a golden set, re-examined every month to measure the error rate, so Casework can show which errors it would have caught before benefits went out.

| When | What ships | With whom |
| --- | --- | --- |
| Months 0 to 3 | Rulebook and Shadow on exports of closed cases | A city building department; a state, for its permits and SNAP quality control |
| Months 3 to 6 | X-ray, Second reader and First review on live permit queues; a connector kit | The same two, plus a federal land office in Shadow on categorical exclusions |
| Months 6 to 12 | The share at risk, an embed API, SNAP and federal work beyond Shadow | Case-management vendors and integrators |

The 30% comes from the rounds. Each round adds a wait for the applicant's reply and another for a reviewer to pick the case up, so if one complete letter saves one of a typical permit's three rounds, about a third of the elapsed time goes. Honolulu's AI plan checker, which cut review rounds from 3.4 to 1.4 on its [first 19 permits](https://www.govtech.com/artificial-intelligence/honolulu-launches-ai-assisted-fast-track-permit-review), also cut review time by more than half. Staggered rollouts give each partner a comparison group of permit types not yet on Casework.

The ask is one product manager, one designer, five engineers and one partner lead for two quarters. If we slip, the connector kit and live X-ray are cut first. The gate at month six:

- First review covers the criteria behind most permit volume, each at 90% or better on its golden set.
- Median calendar days on routine permits filed since launch are down 30% against the comparison group.
- Decisions on known-answer cases are no less accurate.

## 5. Risks, and what would prove me wrong

The biggest risk is that reviewers stop checking. Evidence comes before the verdict, the override rate sits on the director's screen, where a number near zero is a warning, and seeded cases with wrong drafts show whether anyone is still reading. People start every adverse action, consistency checks compare outcomes by neighborhood and language without collecting protected traits, and the Scoreboard measures teams, never individuals.

The likelier early failure is paperwork: data-sharing agreements and procurement, the partner lead's first job. Federal access is also unsettled. The Pentagon's designation stands for defense work after the 25 September ruling, and civilian use rests on a court injunction, one more reason to start with cities and states.

Short of the gate, I would extend by a quarter. I would stop or reshape the bet if, at month six:

- golden-set scores stay below 85% on high-volume criteria after tuning, meaning the rules are less checkable than they look;
- reviewers stop opening the evidence, meaning the design is not preventing rubber-stamping;
- quality improves but days to decision do not, meaning the bottleneck is elsewhere.

We will not build a case management system, a public chatbot or autonomous adjudication.

## Appendix: the prototype in three screens

The clickable prototype follows one synthetic application, a backyard unit and rooftop solar on one house, and its numbers are illustrative. The [repository](https://github.com/andrewhuot/casework-prototype) holds the code, a four-minute [walkthrough](https://github.com/andrewhuot/casework-prototype/blob/main/docs/walkthrough.mp4) and a [single-file build](https://github.com/andrewhuot/casework-prototype/releases/latest) that opens offline. I built it with Claude Code from a written spec.

![Review: the electrical finding, with its evidence, rule, and precedent](screenshots/06-case-review-x1.png)

**Review, for the reviewer.** Each electrical sheet passes alone, but together they put 144 A of load on a main breaker the solar plan derated to 125 A.

![Proving ground: agreement and golden-set score by criterion, and the blind disagreement queue](screenshots/15-proving-ground-settled.png)

**Proving ground, for the general counsel.** Electrical capacity agrees with past decisions 79% of the time but scores 94% once disagreements are settled blind, because the original reviewers judged each permit on its own. Setbacks, at 88%, stays at Second reader.

![Scoreboard: calendar days with a comparison group, the trust ladder, and a model update measured on the golden set](screenshots/16-scoreboard.png)

**Scoreboard, for the director.** Calendar days to decision fall from 34 to 21 while the comparison group goes from 34 to 33, and decisions on known-answer cases hold. A new model lifts setbacks to 91% on the golden set, and the director moves it up.
