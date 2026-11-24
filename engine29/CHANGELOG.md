# V29 "The Grammar" engine changelog

## 0.29.0-a — Stage A: arithmetic (24 Nov 2026)
- New headless engine (`src/engine.js`): one reducer and one legal-action generator for tests, bots and simulation. Seeded RNG, physical card IDs, board instances, state hash after every action.
- Damage per spec §4.9: independent strike and stand, marked damage, integer additive packets, one packet per action, Crush overflow once and never re-modified. No school, rarity, percentage or "first time said" bonuses; no Courage offence.
- `legacy` arithmetic switch emulates the V28 percentage pipeline inside the same rules, for paired comparison only.
- 45-card prototype subset (spec §8 stats). Rules not yet implemented: Clause/responses, reserve, spark, market, fusion, weather, Ground as a target, Kindle's ignition rider.
- 19 regression tests (`npm test`); seeded paired simulations in `results/`.
- V28 untouched: live artifact version 1795480641-3ee5; local V20 engine tagged `v28-baseline-local-v20`.
