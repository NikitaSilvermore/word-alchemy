# V29 engine — implementation status (stage F)

All 150 catalogue words (§8) are registered with the printed type, cost, R flag and stats, checked by test against `data/spec_catalogue.json` (parsed from the spec by `tools/spec_catalogue.js`). Gold is the one extra, ladder-only form. Tokens (Ash, Fruit, Blossom, Carrion) and the 12 made forms are templates, never deck-legal.

All 150 words are deck-legal and implemented. The ten §10 reference decks (D1–D8, D4-B, D5-B) are legal and run.

## Choices made by fixed policy (spec wants a player decision)
These resolve deterministically today. Each should become a decision in the event queue before human play.
- Rat / Yew / Spore / Toadstool poison target: strongest enemy Living Thing.
- Herald, Omen: take the top inspected word. Scribe, Air (Ground), Grimoire: reorder cheapest first.
- Silence: discard the highest-cost eligible word.
- Philosopher's Stone upkeep: draw if hand ≤ 3, else +1 breath. Water Ground: most damaged (or Burning) friendly Thing.
- Debt: pay spark when available, else life. Owl's optional reveal: always reveals.
- Rust from a directly deployed Silver: regresses to Tin.

## Interpretations (spec silent or ambiguous)
- A committed Guard blocker still takes the hit when the attack's direct target has left play.
- Market never shows the same word twice at once.
- Dissolve against Ground deals 3 (Ground listed with the 3-damage group).
- Blow: Ward applies only when Blow names a single target.
- Graft: price is the card's 2 breath; no catalyst for Life + Life.

## Not yet decisions-in-queue
Mulligan, blocking, responses and all Main choices are decisions; the policies above are the remaining gaps.
