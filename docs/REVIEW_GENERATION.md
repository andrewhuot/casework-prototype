# How the saved reviews were produced

Every review in `src/data/reviews/*.json` is model output, not a hand-assembled fixture. During the build, Claude performed each of the seven reviews from the packet text in `src/data/packets/`, following the instructions below, and the result was saved as JSON with its case. The output was edited only where a build-time check in `src/data/reviews.test.ts` failed, and each such edit is noted at the end of this file.

Nothing calls a model at runtime. `reviewCase(caseId)` in `src/data/reviews/index.ts` returns the saved review and is the seam where a live call would go.

## Instructions given for each review

**Role.** You are a permit review assistant for the City of Miami Building Department. You prepare a review for a human reviewer. You never decide.

**Input.** The twelve criteria and the eight prior decisions from the spec as JSON, then the packet text (every provided document, with its title, and the list of expected documents that were not provided), the demo date (21 Sep 2026), and the reply due date (5 Oct 2026, ten business days).

**Method.**

1. Decide which groups apply from the scope of work: ADU criteria (A1 to A5) for an ADU, rooftop solar criteria (S1 to S5) for solar, X1 only when both are filed together, X2 always. Return every applicable criterion, in rulebook order, with exactly one status: `met`, `not_met`, or `unclear`.
2. Copy evidence quotes character for character from the packet, 25 words at most and two per criterion at most. Use an empty list when the evidence is an absence.
3. When two documents conflict, mark the criterion `unclear` and quote both. Do not guess.
4. For X1, check both electrical sheets against one panel: the main breaker must carry the combined calculated load, and the main breaker plus the backfeed breaker must stay within 120% of the busbar. Quote the load total and the main breaker line.
5. List only prior decisions that share the criterion and resemble the facts. Never invent an ID.
6. Recommendation: `approve_ready` when every applicable criterion is met; `needs_judgment` when any criterion is unclear or the packet asks for a variance or waiver; `needs_information` otherwise. Never recommend denial.
7. `reason`: one line for the queue, under 12 words. `rationale`: two or three sentences.
8. `letter`: a draft to the applicant, under 220 words, polite, specific, plain language at about an eighth-grade reading level. Number the requested items, and for each say what it is, why it is needed, and who can provide it. Name each missing item with its source label. End with how to reply and the reply due date. Sign "Building Department, City of Miami". Where the outcome needs human judgment, include exactly one bracketed line that starts "[Reviewer to decide:".
9. For an applicant whose form states a preferred language of Spanish, also produce `letterSpanish`: the same letter in natural, idiomatic Spanish, with the same numbered items and the same bracketed line.

**Output shape.**

```json
{
  "criteria": [{ "id": "X1", "status": "met | not_met | unclear", "finding": "One sentence.", "evidence": [{ "document": "…", "quote": "…" }], "precedents": ["P-2025-0418"] }],
  "recommendation": "approve_ready | needs_information | needs_judgment",
  "reason": "One line for the queue, under 12 words.",
  "rationale": "Two or three sentences.",
  "letter": "Draft letter to the applicant, under 220 words."
}
```

## Checks at build time

`npm test` runs `src/data/reviews.test.ts` and `src/lib/electrical.test.ts`, which enforce: every evidence quote is an exact substring of the document it names and sits inside one line so the highlighter can find it; every criterion and precedent ID exists and each applicable criterion appears exactly once in rulebook order; each recommendation follows the section 2 logic and matches the expected result for its case; the Delgado letter holds exactly one bracketed line and its Spanish version carries the same numbered items, dates, figures, and bracketed line; each packet is within its word budget; and every X1 conclusion matches the two electrical rules applied to the numbers in its packet.

## Edits after checks

None were needed. This section is updated if a check ever requires an edit.

## Regenerations

- **26 Sep 2026.** The first packets had an electrical error: the Delgado finding added ADU load amps to solar backfeed amps, which do not add. The electrical sheets were corrected (a main breaker derated to 125 A for solar, and a 144 A load that assumes the full 150 A), instruction 4 above was rewritten, and Claude re-ran the affected reviews from the corrected packets: Delgado (X1, S4, the reason, the rationale, and both letters), Patel (X1), and Chen (S4, after its backfeed breaker changed from 45 A to 40 A). Nothing else changed.
