# Casework: turning model capability into state capacity

Sep 26, 2026 · Andrew Huot

## Summary

We should build Casework: a review layer inside Claude Enterprise and Claude for Government that prepares every case against an agency's own rules, and proves its accuracy on that agency's closed cases before anyone relies on it.

Chat makes employees faster. It has not made agencies faster, because an agency is judged by its cases, and a case spends most of its life waiting or being reworked rather than being read. Casework works on the case itself, so it moves the number the agency answers for: days to decision.

What makes it work is the golden set: the agency's own past cases, with answers settled by its senior reviewers. It decides when Casework can go live, tests each new model before the switch, and checks that faster has not meant sloppier.

The ask is one team for two quarters, with three design partners. At month six we continue only if median days to decision on routine cases have fallen by 30%, with no loss of accuracy.

## 1. The problem: the mission is measured in cases

State capacity is a government's ability to do what it has already decided to do. In civilian government, what runs short is rarely law or money. It is reviewer time.

Permits, claims, and drug approvals share one shape: a packet of evidence, judged against a rulebook, by a person, with a record that must survive appeal. A legislature can fund housing, but whether anything gets built depends on a plan reviewer's queue.

Time to decision is wait time, plus touch time, plus rework. Chat trims touch time, and only inside a case a reviewer has already opened. It does not choose what to open next, catch a missing document before the first letter goes out, or notice that two permits conflict, so the minutes it saves rarely turn into more decisions. Meanwhile, rework sends an incomplete application to the back of the queue two or three times. A system that sorts the queue, prepares each case, and asks for everything missing in one letter changes all three.

The second problem is trust. Claude can already prepare most cases well, but an agency cannot use what it cannot audit. A general counsel needs to know Claude's accuracy on the agency's own cases, and an appeals officer needs to see how each decision was reached. What is missing is evidence, not capability, so each model release widens the gap between what Claude can do and what an agency can safely use.

## 2. The proposal

Casework turns an agency's own rules into a reviewer's first pass. It has four surfaces, one for each person who can say no.

| Surface | Built for | What it does |
| --- | --- | --- |
| Review | The reviewer | Checks every criterion, links each finding to its evidence, rule, and precedents, and drafts one consolidated letter |
| Rulebook | The policy lead | Turns regulations and manuals into cited criteria and surfaces conflicts. Staff approve each change after seeing its effect on past cases |
| Proving ground | The general counsel | Runs silently on closed cases. Senior reviewers settle disagreements blind, which builds the golden set |
| Scoreboard | The director | Tracks days to decision, backlog, rework, and reversals, and sets how far Claude is trusted |

Three rules make it safe to adopt. A person makes every decision, and Claude never proposes a denial, so it can speed up a yes but never automate a no. Casework sits on top of the agency's system of record instead of replacing it. And every review says what it did not check. Each decision leaves a record that holds up on appeal and audit.

Trust is earned one criterion at a time, on a five-rung ladder. A checklist rule, like a contractor license, can reach First review while a judgment call, like a setback waiver, stays at Second reader. A criterion moves up only when it clears the agency's threshold on the golden set, and only when a person moves it.

| Rung | What Claude does | Risk to the agency |
| --- | --- | --- |
| 1. Shadow | Reviews closed cases and reports agreement | No live decisions; an export of case files to protect |
| 2. X-ray | Sorts the live queue by what each case needs | Order of work only |
| 3. Second reader | Checks the reviewer's call before it goes out | Can catch an error; the reviewer still decides |
| 4. First review | Prepares each case before the reviewer opens it | Over-reliance, checked by showing evidence before the verdict, and by the override rate |
| 5. Front door | Checks an application before it is filed | Public-facing, so it comes last |

The prototype (appendix) follows one synthetic application: a backyard unit and rooftop solar on one Miami house. Each permit passes on its own. Together, they ask more of the electrical panel than it can give, and Claude catches it in the first minute.

## 3. Why this is the next thing

The golden set is what makes Casework more than a better chat. It does four jobs.

- **It earns trust.** No criterion goes live until the agency's own cases support it. Agreeing with past decisions is not the same as being right, so senior reviewers settle every disagreement blind and also relabel a random sample of agreements. A mistake Claude shares with the original reviewer still counts against it.
- **It turns model progress into mission progress.** Each new model is run on the golden set before the switch, and its new disagreements are settled blind. A criterion that now clears the bar can move up a rung, so a better model shows up as a measured gain for the agency.
- **It keeps speed honest.** Known-answer cases from the golden set are seeded into the live queue, so a faster agency cannot quietly become a sloppier one. That is what makes the outcome safe to price.
- **It compounds.** Each settled case makes the next upgrade easier to prove. The agency owns the set, and it grows more valuable with every model we release.

Why not a Project with a good prompt? A prompt produces a good review. It does not produce a baseline, a golden set, a versioned rulebook, or a record an appeals officer will accept. Those are the product.

I weighed four alternatives. **Detection** (outbreaks, fraud) has a narrower buyer and a counterfactual that is hard to measure; it should come second. **An applicant-facing check** takes public risk before trust is earned; it is rung five. **A dashboard** measures the mission without moving it. **A general agent platform** is a toolkit, and counsel needs something specific to approve.

Adjudication also travels. A permit office and a benefits program have different rules but the same shape, in the US and abroad. And Casework puts our safety practice into the product: test before deploying, keep people in charge, show the work. Where the gatekeepers are lawyers and inspectors general, that is hard to copy.

## 4. How it fits the civilian strategy

The strategy is three layers on one engine, and Casework is the missing middle.

| Layer | Serves | Channel | Priced by |
| --- | --- | --- | --- |
| Claude Enterprise and Claude for Government | The employee | Direct | Seat |
| Casework | The agency: case in, decision out | Direct in the same tenant, and embedded by software vendors | Case, with a share at risk |
| API | Bespoke mission systems | Integrators and software vendors | Usage |

**It lands where we already are.** I assume reviewers in our accounts already use chat for case work, and our account teams will know where. Shadow needs only an export of closed cases, with no live decisions and no integration, inside the authorization the agency has already granted. A pilot needs a feature flag, not a new procurement.

**It feeds the channel.** Integrators build connectors and onboard rulebooks, with Claude Code doing much of the engineering. Case-management vendors embed the review through the API. The rulebook, golden set, and record stay in the agency's tenant, so partners extend Casework rather than replace it.

**Revenue follows the mission.** Casework has a small platform fee and a fee per case. A capped share of fees, which I estimate at 20% to 30%, is earned only when calendar days to decision fall against the agency's own baseline and accuracy on known-answer cases holds. Chat cannot be priced this way, because it has no baseline. We are paid on speed and accuracy, never on whether the answer is yes or no. And days are counted on the calendar, as the applicant lives them, so sending more requests can never look like speed.

**It leads to the public.** The order is the employee, then the agency, then the applicant, and each step is earned with evidence from the one before.

## 5. Plan, measures, and the ask

Start with state and local permits, then move to federal claims. Permit rules are checklist-like, the stakes are lower than a benefits denial, procurement is faster, and housing and energy make it urgent.

| When | What ships | With whom |
| --- | --- | --- |
| Months 0 to 3 | Rulebook and Shadow, working from exports | Three design partners: a city permit office and a state agency, plus a federal claims program in Shadow only |
| Months 3 to 6 | X-ray, Second reader, and First review on live queues; a connector kit | The two permit partners, plus one integrator |
| Months 6 to 12 | A Front door pilot, an embed API, the share at risk, claims beyond Shadow, and a decision on detection | Software vendors and the wider channel |

The mission metric is median calendar days to decision, against each agency's own baseline. The business metric is cases reviewed. Three guardrails keep speed honest: accuracy on seeded known-answer cases holds, rework falls, and the reviewer override rate stays well above zero, since zero would mean rubber-stamping. Reversals on appeal are tracked too, but they lag and rarely catch a wrong approval. Rollouts are staggered by permit type, so each partner has a comparison group and we can see what Casework caused.

The ask is one product manager, one designer, five engineers, and one partner lead for two quarters. The gate at month six:

- First review covers the criteria behind most case volume, each at 90% or better on its golden set
- A 30% cut in median calendar days to decision for routine cases
- No drop in accuracy on known-answer cases

## 6. Risks, and what would prove us wrong

The biggest risk is that reviewers stop checking.

| Risk | Response |
| --- | --- |
| Rubber-stamping | Evidence before verdict; override rate on the scoreboard; seeded known-answer cases |
| Due process and disparate impact | Humans originate every adverse action; a full decision record; consistency checks across reviewers and applicant groups |
| Workforce fear | Team-level metrics only; the pitch is clearing the backlog, not cutting staff |

I would stop or reshape the bet if, at month six:

- **Golden-set scores stay below 85% on the criteria behind most case volume, after tuning.** The rules are less checkable than they look.
- **Reviewers stop opening the evidence.** The design is not preventing rubber-stamping.
- **Quality improves but days to decision does not.** The bottleneck is elsewhere, and Casework should be priced on quality alone.

We will not build a case management system, a public chatbot, or autonomous adjudication.

**Assumptions.** Most time to decision is wait and rework. Agencies can export closed cases with their outcomes. A new surface inside Enterprise inherits its authorization after a light review. Per-case fees with a share at risk can be bought as performance-based contracts. Targets will be reset against partner baselines. All prototype data is synthetic, and Miami is illustrative.

## Appendix: the prototype in three screens

A clickable prototype on synthetic data, with a four-minute walkthrough. The [repository](https://github.com/andrewhuot/casework-prototype) holds the code, the [walkthrough](https://github.com/andrewhuot/casework-prototype/blob/main/docs/walkthrough.mp4), and a [single-file build](https://github.com/andrewhuot/casework-prototype/releases/latest) that opens offline; its README maps each claim in this memo to the screen that shows it. I built it with Claude Code from a written spec, as I would here. The polish reflects agent time, not mine.

![Review: the electrical finding, with its evidence, rule, and precedent](screenshots/06-case-review-x1.png)

**Review, for the reviewer.** Each electrical sheet passes alone: the solar plan derates the main breaker to 125 A, and the new unit brings the load to 144 A. Together they fail. Every finding sits beside its evidence, its rule, and similar past decisions, and the recommendation stays hidden until each flag has been opened.

![Proving ground: agreement and golden-set score by criterion, and the blind disagreement queue](screenshots/15-proving-ground-settled.png)

**Proving ground, for the general counsel.** Electrical capacity agrees with past decisions only 79% of the time, yet scores 94% once disagreements are settled blind, because the original reviewers approved the two permits separately. Setbacks, at 88%, stays at Second reader.

![Scoreboard: calendar days with a comparison group, the trust ladder, and a model update measured on the golden set](screenshots/16-scoreboard.png)

**Scoreboard, for the director.** Calendar days to decision fall from 34 to 21, while permit types not yet on Casework move from 34 to 33. A new model lifts setbacks to 91% on the golden set, and it moves up a rung when the director says so.
