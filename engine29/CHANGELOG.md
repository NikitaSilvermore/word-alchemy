# V29 "The Grammar" engine changelog

## 0.29.0-d — Stage D: economy (24 Nov 2026)
- Opening: 5 cards each; one partial mulligan per player (starting player first), set-aside cards shuffled back; starting player skips the first draw.
- Spark: start 0, cap 5; +1 guaranteed at each own market step; +1 for the first successful paid hand-card sentence in Main (or a successful answer). None for basic strikes, off-turn responses, purchases, countered, failed or Ward-absorbed sentences.
- Market: 5 offers by origin (2 from the starting player's schools, 2 from the other's, 1 from outside both, or the full pool if none). School chosen first, then word, from a separate reproducible RNG state; no duplicate offers shown. Own-school 2 spark, off-school 3 and once per duel; one purchase or catalyst refill per own turn; at most 2 copies of a word across deck + market; needs hand space; creates a new physical card; purchased slot stays empty until the next market step; full refresh at the start of rounds 3, 6, 9, 12, 15. Purchases open no Clause.
- Catalyst: start 1, max 1, refill for 2 spark (used from stage E).
- Pool cap 10 and extra-breath cap 2 enforced; discount budget field reset each Renew (no discount cards yet).
- Zone audit extended: spark range, pool cap, copy limit, duplicate offers.
- Bots: mulligan policy, spark and purchase valuation; future offers hidden from lookahead.
- Simulator plays mirrored pairs (same seed, starting player swapped). Initiative variants (`spec`, `none`, `reserve2`, `card`, `breath`, `spark`) and experimental economy overrides (`WA_ECON=price3|nosentence`) for testing only.
- 56 tests.

## 0.29.0-c — Stages B and C: state, grammar and the Clause (24 Nov 2026)
- Stage B: physical card IDs persist across deck, hand, pending, field, Ground and Grave; Grave records a reason (destroyed, spent, failed, countered, retired, bounced-full-hand, unresolved). `zoneAudit()` checks every card is in exactly one zone, hand and slot caps, reserve cap (run after every action in tests and in the R simulation).
- Ground is damageable and targetable by contact attacks; destroyed at 0; never blocks or retaliates; only a ready Guard Thing may intercept an attack on it; Crush gives no overflow from Ground; Bite cannot target it.
- `whyIllegal()` explains rejected sentences from the same legal-action generator the bots use.
- Stage C: reserve (P2 starts with 1; up to 2 kept at End; discarded at own Renew; pays only off-turn Responses). Bounded Clause: costs and exhaustion committed, blocker and direct retaliation committed, one defender Response, one active-player answer, reverse resolution with revalidation; no refunds; triggers and lethal checks between nodes.
- Response cards: Kindle (with ignition rider), Guard (+2 stand this turn; Guard keyword until it exhausts or its controller's End), Mend, Dew, Drench, Frozen, Thaw, Sleep, Gust (Push; full hand → Grave), Protect (Ward), Doubt (response-only). Familiar added with its fusion text disabled.
- Conditions Wet, Frozen, Asleep, Bound expire at their controller's End; Asleep ends on positive damage.
- Death triggers ordered active player first, then entry, then stable ID; event log for declarations, failures, cancellations, triggers.
- Bots decide on redacted copies (rival hand and both deck orders hidden); test proves a decision is unchanged when the rival's hand changes. Defender/answer policy resolves the pending Clause on a redacted copy for each legal Response.
- 42 tests. Simulations: `npm run sim:A`, `sim:A:legacy`, `sim:R`, `sim:R:off`; `npm run report`.
- Not yet: spark, market, fusion, weather, Laws, Bind/Dispel, Concealed, cost sacrifice, Quick, mulligan, player-chosen trigger targets.

## 0.29.0-a — Stage A: arithmetic (24 Nov 2026)
- New headless engine (`src/engine.js`): one reducer and one legal-action generator for tests, bots and simulation. Seeded RNG, physical card IDs, board instances, state hash after every action.
- Damage per spec §4.9: independent strike and stand, marked damage, integer additive packets, one packet per action, Crush overflow once and never re-modified. No school, rarity, percentage or "first time said" bonuses; no Courage offence.
- `legacy` arithmetic switch emulates the V28 percentage pipeline inside the same rules, for paired comparison only.
- 45-card prototype subset (spec §8 stats). Rules not yet implemented: Clause/responses, reserve, spark, market, fusion, weather, Ground as a target, Kindle's ignition rider.
- 19 regression tests (`npm test`); seeded paired simulations in `results/`.
- V28 untouched: live artifact version 1795480641-3ee5; local V20 engine tagged `v28-baseline-local-v20`.
