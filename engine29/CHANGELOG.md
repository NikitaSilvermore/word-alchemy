# V29 "The Grammar" engine changelog

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
