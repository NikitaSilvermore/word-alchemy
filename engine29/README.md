# WORD ALCHEMY — V29 "The Grammar" engine (V30 rc1)

Headless, deterministic rules engine for the duel, built stage by stage from the V29 implementation spec. The live game (V28 "The Book") is untouched; this engine is not enabled in it.

- `src/engine.js` — rules: zones, Clause, damage, economy, alchemy, all 150 words. One legal-action generator for UI, bots and simulation.
- `src/cards.js`, `src/recipes.js` — card registry (150 words, tokens, made forms) and fusion registry.
- `src/formats.js` — versioned formats. `grammar_v30_rc1` is the current candidate.
- `src/replay.js`, `src/journey.js` — reproducible replays; Journey encounter contract.
- `src/bots.js` — six AI tiers; decisions only from public information.
- `sim/` — simulation (`run.js`) and benchmark/reports (`bench.js`). `tools/` — fuzz, probe, spec parser, migration.
- `data/` — spec catalogue, reference decks, migration table.
- Docs: `CHANGELOG.md`, `IMPLEMENTATION_STATUS.md`, `BALANCE.md`, `RELEASE_GATES.md`, `MIGRATION.md`. Results: `results/`.

`npm test` runs 178 tests. `node sim/bench.js report out.md results/<file>.json` rebuilds any report.
