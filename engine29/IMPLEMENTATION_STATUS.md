# V29 engine — implementation status (stage F)

All 150 catalogue words (§8) are registered with the printed type, cost, R flag and stats, checked by test against `data/spec_catalogue.json` (parsed from the spec by `tools/spec_catalogue.js`). Gold is the one extra, ladder-only form. Tokens (Ash, Fruit, Blossom, Carrion) and the 12 made forms are templates, never deck-legal.

All 150 words are deck-legal and implemented. The ten §10 reference decks (D1–D8, D4-B, D5-B) are legal and run.

## Decisions raised during resolution (stage G)
Every choice the spec gives a player is now a decision: `setDecider(S, fn)` receives `(S, side, kind, options, default)` and returns an index. Kinds: `poisonTarget`, `select` (Herald, Omen, Catalogues, Homunculus), `reorder` (Scribe, Air, Grimoire), `silence`, `stoneUpkeep`, `waterGround`, `debt`, `owlReveal`, `rustBranch`. Without a decider (bot lookahead, replays), each uses its documented default:
- poison target: strongest eligible visible enemy Living Thing; select: first eligible; reorder: cheapest first; Silence: highest cost;
- Philosopher's Stone: draw when hand ≤ 3, otherwise breath; Water Ground: Burning, then most damaged friendly Thing (now mandatory, as printed);
- Debt: spark when available; Owl: reveal; Rust from an undirected Silver: Tin.

## Interpretations (spec silent or ambiguous)
- A committed Guard blocker still takes the hit when the attack's direct target has left play.
- Market never shows the same word twice at once.
- Dissolve against Ground deals 3 (Ground listed with the 3-damage group).
- Blow: Ward applies only when Blow names a single target.
- Graft: price is the card's 2 breath; no catalyst for Life + Life.

