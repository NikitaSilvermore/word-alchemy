# V29 "The Grammar" engine changelog

## 0.29.0-g — Stage G: benchmark (24 Nov 2026)
- Decisions: every choice raised during resolution goes through `setDecider` with a documented default (poison target, selection, reorder, Silence, Philosopher's Stone, Water Ground, Debt, Owl reveal, Rust branch). Decisions are logged as events.
- Resource and damage logs per player: breath spent / wasted, reserve kept / used, spark gained / spent, words drawn / bought, words played, life lost by cause.
- Six AI tiers (§10.4): apprentice, initiate (noisy one-ply), journeyman (one-ply with responses), specialist (own-turn beam search, depth 2), expert (+ anticipated replies from sampled rival hands), master (depth 3). Sampling uses only public information (declared schools, seen words); a test proves the rival's real hand never changes the choice. Bots answer decisions from what they can see.
- `sim/bench.js`: deterministic deck benchmark (mirrored seeds), tier ladder (same deal four ways: decks and seats swapped), sharding, and a Markdown report: summary, resources, life lost by cause, deck table and matchup matrix, tier ladder, word/school coverage, made forms, decisions, event types, and a digest of all results for reproducibility.
- 166 tests.

## 0.29.0-f — Stage F: the full reference catalogue (24 Nov 2026)
- All 150 §8 words registered and deck-legal; a test checks type, cost, R flag and stats against `data/spec_catalogue.json` (parsed from the spec by `tools/spec_catalogue.js`). A meta-test fails if any deck-legal word is untested.
- New zones and systems: Quality attachments (max 2, no duplicates, replacement designated at declaration, retire to owner's Grave, follow the host through control change, compositional fusion keeps the host's); shared Sky Weather (replace on resolution, expiry at caster's second Renew, arrival and upkeep effects, Orrery); Burdens (Debt); compound Law (Category + Be + Lawful Quality, virtual Quality on matching Things both sides, Named/Fixed excluded, expiry); standalone Catalogues; native abilities (Willow, Apothecary, Vitriol, Fruit); Concealed (Hermit, Shadow, Night; reveal by Owl, Doubt, Dispel, Gnosis, or on acting, blocking or fusing; bots see a hidden placeholder).
- Conditions and counters: Bound (Bind, Ivy, Spider, Bramble's Sting rider, Cut frees), Named, Measured, Fixed; Growth/Might/Bedrock through one capped counter path; Quick keyword; Sacred vs Bite; Resonant; Firebrand; Ignite helper (Naphtha, Drought).
- New verbs and spells: Wash, Dissolve, Blow (payload), Haunt (Salt), Tide, Squall, Wildfire, Memory, Exhume and Echo (Sealed on success), Tame and Summon (control change), Decay, Rust (regression), Wither, Miasma, Omen, Gnosis, Silence, Scream (Voice, Bard), Reckoning, Awaken, Loan (next-turn tax), Graft (Grafted Plant via the Vessel), Abundance.
- Engines and watchers: Bellows, Ink, Earth, Air, Grimoire, Crucible, Magpie, Saffron, Pear, Rose, Crow, Ice, Amber, Herald, Scribe, Harvest, Spring, Rain, Storm, Winter, Desert.
- `data/reference_decks.js`: the ten §10 decks, all legal; simulator deck set `REF`.
- `tools/fuzz.js`: random legal play over every word with a zone audit after each step (1,000 games, 0 errors).
- `IMPLEMENTATION_STATUS.md`: choices still made by fixed policy and interpretations of ambiguous text.
- 161 tests.

## 0.29.0-e — Stage E: alchemy (24 Nov 2026)
- Vessel fusion as a Main declaration that opens the Clause: two distinct controlled-and-owned ingredients, at least one mature Thing, Things ready and not incapacitated, Ground only where the recipe names it, tokens only where registered, no Final ingredient, lethal preview illegal. Breath, catalyst and the once-per-turn allowance are committed at declaration and never refunded; ingredients are revalidated at resolution.
- Results enter Fresh and exhausted with summed marked damage; a Made event, never Arrival; no sentence spark. Ingredients are consumed without death or sacrifice and bound in a public lineage.
- 12 named recipes (§9) and 4 compositional infusions (Fireborn, Winged, Sea-born, Stonebound; max two per lineage, no duplicates, Heavy cannot be Winged, Stonebound grounds flyers). Catalyst computed from recorded school affiliations; matches the spec table for all 12.
- Recipe validator and reachability check: every named recipe reachable from deck-legal words, ladders and token creators; Philosopher's Stone assembled by real play in a test.
- Leaving play (§5.12): destroyed made forms count as one death and release every original card to its owner's Grave; bounce dissolves without death; tokens vanish; Separate restores ingredients (damage to primary, Fresh/exhausted, fails without room, consumes the Vessel, no spark).
- Ladders (§7.5): Lead → Tin/Copper → Silver → Gold via Transmute, one edge per own turn, printed word kept; Gold ladder-only (+1 breath). Seed → Sapling → Oak/Willow by upkeep age and Grow; one stage per own turn; Growth counters (cap 3) persist through transformation.
- Tokens: Ash (Calcine), Carrion (Barrow); never displace. Sacrifice as an additional cost resolves its death triggers before the response window.
- Phoenix rebirth (once per player, no overflow through prevented destruction), Ouroboros recovery, Recurrent (per physical card), Homunculus spell search, Energy/Gold/Life/World Tree/Philosopher's Stone upkeeps, Steam lifespan and wet-on-hit, Fire and Water Ground upkeeps, Flask potion bonus, Word might counter, Familiar fusion discount.
- New words: Fire (Ground), Calcine, Water (Ground), Flask, Vitriol, Quicksilver, Clay, Tin, Copper, Silver, Gold, Transmute, Seed, Sapling, Oak, Willow, Grow, Scarab, Barrow, Word, Separate. Market pool now includes them.
- `whyIllegal()` explains rejected fusions. Zone audit follows lineage.
- Bots value engines, recursion and chain progress; catalyst valued.
- Stage D market diagnostic (`WA_MKT=norefresh|p2refresh|from2|nobuy`).
- 84 tests.
- Not yet: Graft, Fruit/Blossom creators, Alkahest's ability, Rust, Willow's own heal ability, Philosopher's Stone choice is a fixed policy, Fire/Water Ground choices are fixed policies.

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
