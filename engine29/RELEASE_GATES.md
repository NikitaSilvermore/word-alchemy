# V30 foundation — Journey release gates (spec §14.5)

Status of each gate for the headless engine on branch `v29-grammar`. The live game (V28 "The Book") is unchanged; per §15, V29/V30 rules are not enabled by default until the designer reviews the §0.2 decisions and the open questions.

| Gate | Status | Evidence |
|---|---|---|
| Stable legal-action generator | **Met** | One generator for UI, bots and simulation (`legalActions`, `legalResponses`, `fusionOptions`, `abilityOptions`); `whyIllegal` explains rejections; parity and fuzz tests (`test/grammar.test.js`, `tools/fuzz.js`). |
| Reproducible replays | **Met** | `src/replay.js`: format + decks + seed + every input; replay re-checks the state hash after every action and rejects divergence (`test/v30.test.js`). Benchmarks carry a digest of all results. |
| Reliable identity / Grave / Sealed / fusion | **Met** | Stable physical IDs, zone audit after every action in tests and audited simulations, lineage release, Separate, Seal on success (`test/alchemy.test.js`, `test/cards.test.js`). |
| No uncontrolled damage multiplication | **Met** | Integer additive packets, single overflow; adversarial tests; speed probe (no kill before round 5, max 13 in one turn against no resistance). |
| Meaningful early-game decisions | **Partly** | Mulligan, curve, reserve and market choices exist; first-player edge reduced to about 51% (Journeyman and Specialist bots) with the opening-breath rule (2 for the starting player, 5 for the second). Needs human confirmation. |
| Several viable archetypes | **Partly** | 8 of 10 reference decks between 42% and 64%; Orchard and Clay and Gold below 40% (`BALANCE.md`). |
| Fair, escalating AI | **Met (bots)** | Six tiers, no hidden information (tests), no rule or resource bonuses; ladder 24 / 45 / 47 / 56 / 59 / 67% (`results/stageG_tier_ladder.md`). |
| Stable word / deck IDs | **Met** | `school.word` IDs for all 150 words; versioned reference decks (`data/reference_decks.js`); migration table from the V21 list (`MIGRATION.md`). |
| Human playtests | **Not started** | Needs a UI on the V30 engine. |

## Journey contract
`src/journey.js` implements the §14.5 encounter contract: validated contract → duel under a pinned format → stable result (outcome, winner, next scene, format version, replay ID, reward eligibility, discoveries made in real play, word-use events). `applyResult` keeps learnt / scribed / owned / mastered / discovered as separate flags and pays a reward once per encounter, never again on replay or resume. Match resources never leave the duel. The ten rivals map to the reference decks and intended AI tiers.

## Format versions
`src/formats.js`: `grammar_v29_spec` (the spec as written), `grammar_v30_rc1` (opening turns: 2 breath for the starting player, 5 for the second), `journey_standard` (alias of the candidate), `legacy_v28_maths` (diagnostic only). Formats are additive: a shipped format is never edited.

## Before switching the live game
1. Designer review of `BALANCE.md`, `IMPLEMENTATION_STATUS.md` and §15 questions.
2. A UI build on this engine and human playtests.
3. The live V21–V28 source committed to git, so the migration can be checked against real V28 definitions (only the V21 list is in git today).

## V30 update
- Human playtests: **Ready** — browser build on engine29 (artifact `d42773a3-fbb2-4328-a718-7abd264d312c`), human test sheet `../playtest/HUMAN_TEST_SHEET.md`.
- Several viable archetypes: **Partly** — themed decks show Water control and Word speakers below 30%; see `../V30_PLAYTEST_REPORT.md`.
- Guard block whose protected target leaves: semantics written and tested (block holds; vanished blocker misses, no redirect).
