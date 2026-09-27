# Casework: the demo script

A short intro, then one application from arrival to decision, then one screen each for the people who can say no: the policy lead, the general counsel, and the director. The intro takes about 35 seconds and the demo about 4:25 at a relaxed speaking pace, so about five minutes in all. The silent recording in `docs/walkthrough.mp4` starts at 0:00, after the intro, and performs these clicks at these times, so you can rehearse against it.

The **Say** lines are written to be read out loud. [`DEMO_SCRIPT_SAY_ONLY.md`](DEMO_SCRIPT_SAY_ONLY.md) has the same lines with the clicks taken out, for reading from or rehearsing without the screen.

## Before you start

- Open the prototype in a window at least 1280 px wide (the recording uses 1440 by 900).
- Click **Reset demo** in the top bar. You should be on the Queue with seven cases and the "New here?" hint.
- Rehearse twice with a timer. If you run long, say the Rulebook beat over the screen without clicking.

## The script

### Before 0:00 · Intro

**Do.** Stay on the Queue. Don't click anything yet.

**Say.** "Chat makes employees faster. Casework makes agencies faster. It's a prototype of a review tool inside Claude. When an application comes in, Claude checks it against the agency's own rules, and shows the evidence for everything it finds. A person still makes every decision. I'll follow one building permit from start to finish, then show why the city can trust it, and what it changes. Everything you'll see is made up, but the problem is real. I've worked on permit and SNAP queues in Pennsylvania, and it looks the same everywhere."

### 0:00 · Queue

**Do.** Stay on the Queue. Point at the two Approve-ready rows, run down the status column from top to bottom, then point at Delgado at the top, marked New.

**Say.** "Here's a reviewer's queue. A permit here takes a median of 34 days, and most of that is waiting and rework, not reading. So the queue is sorted to keep applications moving as fast as possible, while keeping it balanced. New cases and quick approvals sit near the top, and within each group the oldest case goes first, so nobody gets stuck at the bottom. Maria Delgado filed this morning: a backyard unit and rooftop solar, in one application."

### 0:30 · Run review

**Do.** Click **Run review** on the Delgado row. Three steps tick off, then Case review opens with a "Saved review" tag.

**Say.** "I don't write a prompt. I just click Run review. In real life, this runs the moment a case arrives. For the demo, Claude reviewed these exact documents ahead of time, and we saved the review so it plays the same way every time."

### 0:45 · A3 Setbacks

**Do.** Point at "12 criteria: 9 met, 3 flagged." Point at the two highlights, "Rear setback: 5 ft 0 in" and "4 ft 6 in from the rear lot line", and at the **Second reader** tag. Click the source chip **R1 §ADU-3**, let the drawer sit, press **Escape**, and point at the four past decisions.

**Say.** "Nine criteria are met, and three are flagged. Here's the first one. The site plan says the unit is five feet from the back lot line. The survey says four foot six. Claude doesn't guess. It marks it unclear, shows me the rule straight from the city's own code, and pulls up similar cases: three approved with a waiver, and one denied. And see this tag? Setbacks is still at Second reader, so this call is mine. I'll come back to why."

### 1:20 · A5 Flood elevation

**Do.** Click **Next flagged**. Point at the dashed page marked "Not provided".

**Say.** "Next: there's no flood elevation certificate. Today, she'd find that out from a rejection letter three weeks from now. Here, we catch it in the first minute."

### 1:30 · X1 Electrical capacity

**Do.** Click **Next flagged**. Point at "Total with the ADU: 144 A, within the 150 A service." then at "Main breaker derated to 125 A for a 40 A solar backfeed breaker."

**Say.** "And this is the one two separate reviewers would miss. To fit the solar panels, the installer turned the main breaker down to 125 amps. The new backyard unit brings the house up to 144 amps. Each drawing is fine on its own. Put them together, and you've got 144 amps on a 125 amp breaker."

### 1:55 · The recommendation and the letter

**Do.** Look at the right pane: Needs judgment, the rationale, the draft letter, three equal buttons. Select the bracketed line in the letter and type **You may apply for an administrative waiver for the rear setback.** Point at the reply date, then at the three reminder options, and tick **Phone call from a virtual agent** so all three are on. Point at the Spanish copy, then click **Send request for information**.

**Say.** "Only now, once I've seen the evidence, does Claude show a recommendation. Evidence first, verdict second. This one's a judgment call, so Claude doesn't pick an action for me, and it never recommends a denial. One letter asks for everything that's missing, instead of three rounds of back and forth. I'll add a line about the setback waiver. She asked for Spanish, so she gets a Spanish copy. And we don't just send it and hope. If she hasn't replied, she gets a reminder by email, by text, and a phone call from a virtual agent, so it's as easy as possible for her to remember and send what's missing. Every step goes on the record: what Claude read, which rulebook it used, what I changed, and who decided."

### 2:45 · Rulebook

**Do.** Click **Rulebook**. Click **Add source**, **Load example**, **Add**. When R6 shows "1 proposed change", click it. Point at the impact line, then click **Approve change**.

**Say.** "Now the policy lead's screen. The rules are the city's own. When the fire marshal puts out a new bulletin, Claude drafts the rule change and cites the exact passage. Before approving it, the policy lead sees the impact: 37 past decisions would have come out differently. And it only applies to new applications, never to one that's already in progress."

### 3:10 · Proving ground

**Do.** Click **Proving ground**. Point at 91% and 95%, then at the X1 row in the chart, where the ring and the dot are furthest apart. On the first X1 row of the disagreement queue, click **B is right**. Then point at the Setbacks row in the chart, the one bar below the 90% line, and at the note under the chart.

**Say.** "So why trust any of this? Before it touched a live case, Claude reviewed 1,200 of the city's closed cases, and agreed with the original decision 91 percent of the time. But agreeing isn't the same as being right. So senior reviewers settle every disagreement blind, and recheck a sample of the agreements too. On electrical capacity, Claude was usually the one that was right. On that checked set, the golden set, Claude scores 95 percent. And the bar is set one criterion at a time. Setbacks is just under it, at 88 percent. That's why it's still at Second reader, and why the call on Delgado was mine."

### 3:50 · Scoreboard

**Do.** Click **Scoreboard**. Point at the days tile and its comparison group, then at the known-answer tile and the override rate. Click **Approve switch**, then **Move A3 to First review**, and point at the ladder's subtitle.

**Say.** "Last, the director's view. This is also what we'd be paid on. Calendar days to a decision are down from 34 to 21, while permit types that aren't on Casework yet barely moved. And accuracy on known-answer cases held. Reviewers still change 11 percent of Claude's findings. That's healthy; zero would mean rubber-stamping. Now a new model comes out. It has to pass the golden set first, and it lifts setbacks over the bar. So the director approves it and moves setbacks up. If it ever slips, it drops back down on its own."

### 4:25 · Close

**Do.** Stay on the Scoreboard.

**Say.** "That's what 'as AI gets stronger' should mean for an agency. Casework: from seats to cases."

## If something goes wrong

- A click lands somewhere unexpected: press **Escape** to close any drawer, and carry on.
- Lost your place: click **Reset demo** and start again from the Queue.
- Running long: talk over the Rulebook without clicking.

## Keyboard shortcuts on Case review

- Up and Down move between criteria. N selects the next flagged criterion.
- Escape closes any drawer or dialog.
