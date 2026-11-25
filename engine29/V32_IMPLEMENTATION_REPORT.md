# V32 The Workshop — implementation report

Branch `v32-workshop` (from `v31-folio`). New artifact: **Word Alchemy — The Workshop (V32 research)**, slug `c6e035c4-d377-416a-afff-bd66132022b0`.

References are unchanged and still playable on their own:

| Reference | Version |
|---|---|
| V28 | 1795480641-3ee5 |
| Crucible 2 | 1795614540-835d |
| V31 | 1795614538-2ae7 (not republished) |

Nothing here is permanent. Every rule below lives behind its own format module. rc1 behaviour and hashes are unchanged.

## 1. What was built

### Engine (engine29)
- **V — visit an opposing orchard** (`visit`, `visit_draw`):
  - The host plans the invitation during Main; it opens at End and lasts until the host's next Renew. Only one invitation per End, shared with H.
  - The visit costs 1 breath and exhausts the Bee. The host gets the Fruit.
  - Visitor reward: privately reorder the top 2 (`visit`), or draw 1 (`visit_draw`). The two rewards are separate arms and are never combined.
  - One attempt per turn. An interrupted visit keeps its cost. If the host leaves, the invitation is cancelled.
- **H — borrow the rival's heat** (`heat`):
  - Costs 1 breath, plus a 1-spark fee paid to the host at declaration; the fee is not refunded if the action is interrupted.
  - The invitation is consumed when used. The heat source must survive until resolution.
  - Not available if the host already holds 5 spark or the visitor has 0 spark.
- **R — combat permissions** (strike / intercept / retaliate): three overlays, `rfruit` → `r6` → `rext`.
  - Durability, targetability and printed numbers are unchanged.
  - Awaken grants all three permissions explicitly.
- **Field capacity:**
  - `cap6`: six general spaces.
  - `supply`: five general spaces plus one supply space for stock and products.
  - `supply4`: four general spaces plus one supply space.
  - A form change that leaves no legal space displaces the Thing (it cannot act).
- **W5 — World Tree life-plus-work** (`w5`), a concept test:
  - The World Tree must have been grown through the full chain (Swamp → Life → World Tree).
  - It must have given an upkeep Growth to an exact friendly beneficiary.
  - Declaring the work costs 2 breath. The claim completes at your next start of Main, after every ordinary terminal check.
  - The claim breaks if the Tree or beneficiary leaves play, changes controller, or the beneficiary loses its Growth.
- **Creation-value configuration** (`v32_shape1`): Shape costs 1 breath instead of 2. Implemented as its own configuration through `costOverride`.
- **New formats:** `v32_b` (control), `v32_visit`, `v32_visit_draw`, `v32_heat`, `v32_rfruit`, `v32_r6`, `v32_rext`, `v32_cap6`, `v32_supply`, `v32_supply4`, `v32_w5`, `v32_shape1`.
- **Market:** 3/4 stays independent (`grammar_v30_exp_price34`).
- **Decks** (`data/v32_decks.js`), all legal: Volume II nos. 01, 02, 03, 04, 08, 11 and 13. Deck 04 uses Abundance in place of Ferment, because module F is not built.

### Planner and diagnostics
- **`planner` tier** (bots.js):
  - Ranks the top 5 openings, completes the turn greedily, then gives the rival a turn in which it does nothing.
  - Values the position at the planner's next Main, minus the rival's visible threat.
  - Ordinary life lethal is checked before any work is credited.
  - Uses redacted information only. The existing tiers are unchanged.
- **Diagnostics** (`src/diagnose.js`, in-game "Why not?"): classifies each interaction as best, strategically inferior, unaffordable, too slow or unavailable.
  - The reasons come from the engine's own `*Why` checks.
  - "Inferior" comes from planning the best opening of every interaction family.
- **Bot invitations:** `never` / `heuristic` / `always`, switchable with `B.V32_OPTS`.

### Playtest
- **Scenario editor:**
  - Choose a legal 20-word list per side.
  - Set the field (including damage, exhausted, fresh, Growth, World Tree grants, tokens, made and worked forms), hand, top of deck, grave, Ground, the rest of the deck, life/breath/reserve/spark, and open invitations.
  - Every rules version is checked for compatibility, with the reason shown when a position doesn't fit.
  - Save, export and import as JSON.
  - Replays store the whole position, so a scenario always replays.
- **11 V32 fixtures** (all editable as scenarios): `v_visit`, `v_host`, `h_heat`, `r_roles`, `c_supply`, `w5_success`, `w5_disrupt`, `w5_interrupt`, `w5_lethal`, `cv_fruit`, `cv_setting`.
- **UI additions:** board shows 6 / 5+1 spaces, invitation and claim banners, permission/supply/displaced chips, inspector relationships, and labels for invite / visit / borrow heat / declare work.
- **Storage:** `wa32.*` keys, so nothing is shared with V31.

## 2. Automated evidence
- **Engine tests: 205/205 pass.**
  - This includes the rc1 tripwires: pre-Alkahest replays and bench digests.
  - 9 new V32 tests cover:
    - V: accept, refuse, Wet Bee, host already has Fruit, short deck, interruption, reorder vs draw.
    - H: fee at declaration, no refund when interrupted, cap and zero-spark limits, heat source gone.
    - R: Oak intercepts and deals 0 back; Fruit cannot intercept; Wolf retaliates; Silver cannot strike; Awaken.
    - Capacity, supply space and displacement.
    - W5: success, broken chain, disruption, interruption, earlier lethal.
    - Random legal play in all 7 V32 formats with zone audit and exact replay.
- **Playtest tests: 5/5 pass.** All V32 fixtures validate with clean zone audits; illegal edits are refused with reasons; a scenario match replays to the same hash.
- **Browser smoke (headless Chrome, 1280 and 400 px, sandboxed frame): 0 console errors.**
  - Full matches played, exported and resumed with matching hashes.
  - All 27 fixtures opened.
  - Diagnostics opened.
  - Scenario editor exercised end to end: edit → refused switch → play → export → reload with hash match.

### Simulations
- Paired deals with seats swapped.
- Subject deck uses journeyman:ra unless marked otherwise; the rival is always journeyman:ra.
- Full data: `sim/out32/*.json` and `sim/out32/SUMMARY.json`.

| Arm | Games | Subject win % (95% CI) | Key funnel (chosen/offered) |
|---|---|---|---|
| V_ctrl (v32_b) | 40 | 55.0 (40–69) | — |
| V (reorder) | 40 | 57.5 (42–72) | visit 0/22; invites opened 3 |
| V_draw | 40 | 57.5 (42–72) | visit 0/14 |
| V invite=always | 40 | 57.5 (42–72) | visit 0/16 even with 39 invitations open |
| H_ctrl / H / H always | 40 each | 42.5 / 42.5 / 45.0 | hotwork 0/4, 0/195; Shape 0/105 |
| H2_ctrl / H2 | 40 each | 42.5 / 42.5 | hotwork 0/3 |
| R_ctrl (v32_b) | 60 | 26.7 (17–39) | — |
| R Fruit only | 60 | 28.3 (19–41) | — |
| R six rows | 60 | 40.0 (29–53) | gain mostly vs V11 (18/30 vs 10/30) |
| R broad overlay | 60 | 21.7 (13–34) | — |
| Capacity 5 / 6 / 5+1 | 60 each | 48.3 / 48.3 / 45.0 | displacement 0 in every arm |
| Shape 2 / Shape 1 (journeyman) | 60 each | 41.7 / 41.7 | Shape 0/376, 0/443 |
| Shape 2 / Shape 1 (planner) | 24 each | 54.2 / 50.0 | Shape 1/246 → 6/261; Set 0 → 1 |
| W5 / W5_ctrl (journeyman) | 80 each | 40.0 / 40.0 | identical games: no claim ever arose |
| W5 (planner) | 32 | 50.0 | Swamp in 5 games, never Life |
| W5 chain pilot | 80 | 37.5 | Swamp 25; claims 4; **work wins 2** |

**Readings.** All of these are bot evidence, not judgements of the design.
- **V:** bots never visit. They value giving the host a Fruit above a private reorder or a draw.
- **H:** bots never borrow heat, and never Shape at all. A Setting is worth less to them than a striking Copper. The planner shapes slightly more at 1 breath, but the samples are tiny.
- **R:** the six-row overlay helped this V01 subject, mostly against V11. This is confounded: the overlay also removes strikes from the opponents' Oak, Bee and Silver.
- **Capacity:** no measurable effect on these lists.
- **W5:**
  - The chain pilot plays any legal chain step whenever one is available.
  - It saw all four chain parts (Clay, Water, Seed, Oak/Sapling) in 16 of 80 games.
  - It reached Swamp in 25 games (31%) and won by the work in 2 (2.5%).
  - Conclusion: the concept works in constructed positions but is rarely reachable with this deck and these bots.

## 3. Unresolved failures and limits
1. **No bot ever chooses visit, hotwork or Shape** (journeyman). The planner rarely does. Creation value is still not demonstrated by automated play. The fixtures and diagnostics are there so humans can judge it.
2. **W5 is hard to reach in practice** (2.5% with the chain pilot). This tells us nothing yet about whether W5 would be fun or fair.
3. **The R comparison is confounded** by its effect on the opponent decks. A subject-only overlay was not run.
4. **"Too slow" checks only one turn ahead.** It looks one null-move rival turn ahead, so two-step lines such as Shape → Set → Signet are reported as unavailable rather than too slow.
5. **The planner is a heuristic.** Its rival does nothing during the lookahead (blocks are approximated by threat). The W5 claim value (8) and the visit reorder value (0.35) are hand-set.
6. **Samples are small.** CIs are ±12–15 points; no arm differs from its control at 95%.
7. **Scenario editor limits:** it cannot place Qualities, Weather, Laws, statuses other than exhausted/fresh, or open processes. Made forms get fixed documented lineages.

## 4. Not implemented
- The rest of Volume II: module F (Ferment) and the other atlas decks.
- No 500-word migration, board redesign or Journey.
- No planner-vs-planner sims at scale (about 5 s per game). `supply4` is not simulated.
- No subject-only R overlay, and no two-step "too slow" search.

## 5. Human observations
None yet. Use `playtest/V32_HUMAN_TEST_SHEET.md`. Nothing becomes permanent without human playtesting and designer approval.
