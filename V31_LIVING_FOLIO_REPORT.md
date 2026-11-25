# V31 "The Living Folio": implementation report

**Purpose.** This is an experiment, not a promotion. Nothing here approves a mechanic for the permanent game. V28 and V30 are unchanged and both remain playable.

## What exists now

| Item | Where |
|---|---|
| Playable V31 build | Private artifact **"Word Alchemy — The Living Folio (V31 experiment)"**, slug `adf3ac97-387b-4d67-829c-6e99b9568222`, version `1795579054-0b7e`; app.js sha256 `ffd3d20a3bebaf41…` |
| Code | Branch `v31-folio`, based on `v30-crucible` / tag `v30-control` |
| V30 reference build | Crucible 2 artifact `c9991eb0…` (unchanged) |
| Frozen control | `engine29/REFERENCE_CONFIG.json`: rc1 0.30.0-rc1, engine r30.1 |
| V28 | Live version `1795480641-3ee5` (unchanged) |

## Stage 1: the control
Stage 1 was done before V31 started (see `V30_CRUCIBLE2_REPORT.md`):
- art;
- healing instrumentation;
- the response-aware AI and the C2 rerun;
- reconciled win-rate denominators;
- verification in the real artifact viewer;
- replay revision integrity;
- the frozen reference configuration.

**rc1 is still byte-identical under V31.** All of the following still pass after every V31 change:
- the 24 replays recorded before the Alkahest fix;
- the benchmark digest tests;
- the hidden-information tests.

New V31 words are not deck-legal in rc1, never appear in the market, and are never sampled by bots outside their formats.

## Stage 2: Expanded Grammar (model B)
Every mechanic is gated by a format module.

| Format | Contents |
|---|---|
| `folio_b_orchard` | Bee, Hazel, Feast; Pear and Wind overlays |
| `folio_b_workshop` | Shape, Garnet, the Setting form, the Signet recipe (Set), Writ; Smith overlay |
| `folio_b_decay` | Mould |
| `folio_b_garden` | Orchard + decay |
| `folio_b_all` | All three modules |

All new actions use the existing systems:
- the legal-action generator, Clause, revalidation, Ward and Doubt;
- the Vessel (price, catalyst, lineage, Separate, allowance), transformation and tokens;
- Seal and Grave reasons, the replay log and the state hash.

**One explanation source.** `pollinationWhy` and `shapeWhy` explain every refusal. The same functions drive legality, resolution, the "why not" text, the inspector and the bots, so an explanation can never disagree with the rules.

**Fixture tests** (constructed positions; each positive case is paired with a negative):

| Fixture | Behaviour | Result |
|---|---|---|
| P01 | Bee→Pear yes; Bee→Hazel no; Wind→Pear no; Wind→Hazel yes; Wet Bee grounded but Wet Wind still works; an existing Fruit forbids a second | Pass |
| P01b | Fresh carrier, full field or no breath each block, with a reason | Pass |
| P02 | Pear fruits only from Growth on *another* Plant, never displaces | Pass |
| P04 | Mould seals only an original Plant that died; the seal stays spent if interrupted | Pass |
| P06 | Feast stays within the two-action ceiling, never a third action; a failed Feast loses its Fruit | Pass |
| P07 | Shape keeps instance and damage, refuses a lethal or wrong metal, allows one change per turn; Smith route is native; bounce returns Copper; no Shape outside the workshop module | Pass |
| P08 | Set → Signet; destroy, bounce and Separate each put every original in exactly one place | Pass |
| P09 | Vessel allowance | Pass |
| P10 | Writ: Person mode, endorsed two-target mode with independent revalidation, Ward on a single target, Doubt counters with costs kept | Pass |
| P14 | Hidden cards and deck order never change bot choices | Pass |
| Fuzz | 30 random-play matches across every B format: zone audit, exact replay, every module action exercised | Pass |

- **Totals:** 196 of 196 engine tests pass; playtest 2 of 2; browser smoke shows 0 console errors.

**Discrepancies and engine interpretations** (recorded, not silently fixed):
1. **Garnet** "intercepts an attack on its controller". In the engine every ready Thing may block, so there is no special rule.
2. **Fixed.** Shape refuses Fixed as specified. The existing rc1 **Transmute does not check Fixed**. That is pre-existing and left unchanged, because rc1 is frozen.
3. **Measured** stops Mould's Growth counter but not its ageing. The pack lists "can gain Growth *or* advance age".
4. **Writ's Ward rule** applies only when exactly one target was chosen.
5. **Setting has no art.** Neither do Bee, Hazel, Feast, Shape, Garnet, Writ, Mould or Signet (labelled "art pending").
6. **Feast targets** must be mature and not incapacitated, have Body, positive strike, and fewer than two actions this turn. The pack's wording supports this.
7. **The B decks use their own formats.** The Returning Garden needs the orchard and decay modules (`folio_b_garden`/`all`); a deck with module words is rejected by any format that lacks its module.

## Stage 3: playable build
- **Lobby:**
  - Folio decks O, F, M, their A-ablation twins, and all V30 reference decks.
  - Rules versions grouped as: Reference / Market comparison / V31 B formats / V31 C-life / Earlier.
  - A deck with module words is refused under a format that lacks the module, with the reason shown.
- **Fixtures** (labelled as constructed):
  - who can pollinate what;
  - Feast's second wave;
  - Copper → Setting → Signet;
  - Signet endorses Writ;
  - Mould and the dead;
  - C-life processes.
- **Explanations:**
  - Clicking a carrier lists every one of your trees and the engine's reason for each.
  - The inspector's **Relationships** section says "Bee → Pear: yes; Bee → Hazel: no — Hazel is wind-pollinated; Bee carries pollen by insect", and similar for metals.
  - Lineage reads "Setting (worked from Copper) + Garnet".
- **Other:**
  - Previews still come from the engine applied to a redacted copy.
  - Replays export and replay exactly; tested per format.
  - Pilots: careful, aggressive, or builder (values preparation more).
- **Verification:**
  - Opened in the real artifact viewer: lobby, start and fixtures list.
  - Headless smoke: 0 console errors at 1280 px and 400 px, plus the sandboxed-frame start.

## Stage 4: controlled evidence (bots, not humans)
**Method.**
- Paired deals: the same seed is played twice with seats swapped. The score is the subject deck's (W + D/2)/games, with a bootstrap 95% CI over whole deals.
- Arms come from file 05, against its named opponents:
  - the A ablation;
  - single-word swaps (Feast vs Abundance, Writ vs Omen, Mould vs Toadstool);
  - legacy D4 and D5 as controls.
- Three public-information pilots:
  - response-aware Journeyman (40 deals per opponent);
  - Specialist (depth 2, 15 deals per opponent);
  - Builder (more weight on preparation and outputs, against a careful rival; 30 deals per opponent).
- Market and every other lever are held at rc1. The price-34 market experiment is kept separate.

**Paired comparisons, Journeyman:**

| comparison | arm score (95% CI) | baseline score | paired difference, points (95% CI) | deals |
|---|---|---|---|---|
| Orchard package (Bee/Pear, Hazel/Wind, Feast) vs A ablation | 40.3% (32.5%–47.5%) | 45.0% | -4.7 (-12.5 to +2.5) | 80 |
| Orchard with Abundance instead of Feast vs A | 50.6% (41.9%–57.8%) | 45.0% | +5.6 (-0.9 to +11.9) | 80 |
| single word: Feast vs Abundance (both B) | 40.3% (32.5%–47.5%) | 50.6% | -10.3 (-15.6 to -4.1) | 80 |
| Workshop package (Shape, Garnet, Signet, Writ) vs A ablation | 55.0% (47.8%–63.4%) | 60.0% | -5.0 (-10.6 to +2.2) | 80 |
| Workshop without Writ vs A | 58.8% (51.2%–66.3%) | 60.0% | -1.3 (-5.9 to +4.1) | 80 |
| single word: Writ vs Omen (both B) | 55.0% (48.1%–63.4%) | 58.8% | -3.8 (-9.4 to +1.6) | 80 |
| Garden package (Mould + orchard words) vs A ablation | 59.4% (51.2%–67.5%) | 67.2% | -7.8 (-13.8 to -1.9) | 80 |
| Garden with Toadstool instead of Mould vs A | 61.6% (54.1%–69.4%) | 67.2% | -5.6 (-10.9 to -0.3) | 80 |
| single word: Mould vs Toadstool (both B) | 59.4% (51.2%–67.5%) | 61.6% | -2.2 (-5.9 to +3.1) | 80 |
| C-life vs B (same Orchard list) | 40.9% (33.1%–48.1%) | 40.3% | +0.6 (+0.0 to +1.9) | 80 |
| C-life vs B (same Workshop list) | 55.0% (47.8%–63.4%) | 55.0% | +0.0 (+0.0 to +0.0) | 80 |

**Specialist (depth 2):**

| comparison | arm score (95% CI) | baseline score | paired difference, points (95% CI) | deals |
|---|---|---|---|---|
| Orchard package (Bee/Pear, Hazel/Wind, Feast) vs A ablation | 40.0% (28.3%–52.5%) | 46.7% | -6.7 (-21.7 to +7.5) | 30 |
| Workshop package (Shape, Garnet, Signet, Writ) vs A ablation | 53.3% (39.2%–67.5%) | 55.0% | -1.7 (-13.3 to +8.3) | 30 |
| Garden package (Mould + orchard words) vs A ablation | 71.7% (60.0%–81.7%) | 57.5% | +14.2 (+2.5 to +27.5) | 30 |
| C-life vs B (same Orchard list) | 43.3% (32.5%–55.0%) | 40.0% | +3.3 (+0.0 to +8.3) | 30 |
| C-life vs B (same Workshop list) | 52.5% (40.0%–66.7%) | 53.3% | -0.8 (-2.5 to +0.0) | 30 |

**Builder pilot:**

| comparison | arm score (95% CI) | baseline score | paired difference, points (95% CI) | deals |
|---|---|---|---|---|
| Orchard package (Bee/Pear, Hazel/Wind, Feast) vs A ablation | 40.0% (31.3%–47.5%) | 46.7% | -6.7 (-15.8 to +2.1) | 60 |
| Workshop package (Shape, Garnet, Signet, Writ) vs A ablation | 53.8% (46.7%–61.7%) | 52.9% | +0.8 (-6.3 to +6.7) | 60 |
| Garden package (Mould + orchard words) vs A ablation | 52.5% (42.9%–61.3%) | 54.2% | -1.7 (-11.3 to +7.5) | 60 |
| C-life vs B (same Orchard list) | 41.3% (32.9%–48.8%) | 40.0% | +1.3 (-1.7 to +4.2) | 60 |
| C-life vs B (same Workshop list) | 52.5% (45.8%–60.8%) | 53.8% | -1.3 (-4.6 to +1.7) | 60 |

**All arms, Journeyman:**

| arm | games | score (95% CI) | mean rounds | by opponent |
|---|---|---|---|---|
| ALL_MvF | 80 | 50.6% (40.0%–59.4%) | 9.1 | F 50.6% |
| ALL_OvF | 80 | 38.1% (28.7%–46.9%) | 8.4 | F 38.1% |
| ALL_OvM | 80 | 40.0% (28.7%–51.2%) | 9.4 | M 40.0% |
| D4_ref | 160 | 32.8% (25.9%–40.9%) | 10.0 | D3 40.0%, D6 25.6% |
| D5_ref | 160 | 34.1% (26.9%–41.3%) | 9.2 | D2 41.9%, D6 26.3% |
| F_A | 160 | 60.0% (52.5%–67.2%) | 9.7 | D2 60.6%, D6 59.4% |
| F_B | 160 | 55.0% (47.8%–63.4%) | 9.4 | D2 63.1%, D6 46.9% |
| F_B_nowrit | 160 | 58.8% (51.2%–65.9%) | 9.6 | D2 65.0%, D6 52.5% |
| F_C | 160 | 55.0% (47.8%–63.4%) | 9.5 | D2 63.1%, D6 46.9% |
| M_A | 160 | 67.2% (59.7%–75.9%) | 8.5 | D7 78.8%, D3 55.6% |
| M_B | 160 | 59.4% (51.2%–67.5%) | 8.7 | D7 71.3%, D3 47.5% |
| M_B_toadstool | 160 | 61.6% (53.8%–69.4%) | 8.6 | D7 72.5%, D3 50.6% |
| O_A | 160 | 45.0% (36.9%–52.5%) | 9.3 | D3 58.8%, D6 31.3% |
| O_B | 160 | 40.3% (32.8%–47.2%) | 9.6 | D3 46.3%, D6 34.4% |
| O_B_abundance | 160 | 50.6% (42.2%–57.5%) | 9.6 | D3 59.4%, D6 41.9% |
| O_C | 160 | 40.9% (33.1%–48.1%) | 9.6 | D3 46.3%, D6 35.6% |

**Where each relationship fails (Journeyman funnel).**
- *drew*: both inputs reached hand or field.
- *games offered*: share of games where the module action was ever legal at a Main decision.
- *chosen*: share of those offers the pilot took.

*O_B*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| pollinate | 61.9% | 26.3% | 0.59 | 5.3% | 0.03 | 0.00 |
| bear | 61.9% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| feast | 58.1% | 6.3% | 0.17 | 7.1% | 0.03 | 0.00 |

*F_B*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| shape | 78.8% | 60.6% | 9.51 | 0.0% | 0.00 | 0.00 |
| set | 63.7% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| writ | 46.3% | 4.4% | 0.14 | 0.0% | 0.00 | 0.00 |

*M_B*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| pollinate | 39.4% | 13.8% | 0.38 | 11.7% | 0.04 | 0.00 |
| bear | 39.4% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| feast | 57.5% | 4.4% | 0.11 | 11.8% | 0.03 | 0.00 |
| mould | 60.6% | 16.3% | 1.45 | 12.9% | 0.19 | 0.01 |

*O_C*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| pollinate | 61.9% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| bear | 61.9% | 26.3% | 0.59 | 3.2% | 0.00 | 0.00 |
| feast | 58.1% | 5.6% | 0.14 | 8.7% | 0.03 | 0.00 |
| complete | — | 0.6% | 0.04 | 0.0% | 0.00 | 0.00 |

*F_C*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| shape | 78.8% | 60.6% | 9.22 | 0.2% | 0.00 | 0.00 |
| set | 63.7% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| writ | 46.3% | 4.4% | 0.14 | 0.0% | 0.00 | 0.00 |
| complete | — | 1.9% | 0.09 | 0.0% | 0.00 | 0.00 |

*ALL_OvF*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| pollinate | 62.5% | 21.3% | 0.44 | 2.9% | 0.01 | 0.00 |
| bear | 62.5% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| feast | 56.3% | 5.0% | 0.15 | 0.0% | 0.00 | 0.00 |

*ALL_MvF*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| pollinate | 47.5% | 16.3% | 0.60 | 6.3% | 0.04 | 0.00 |
| bear | 47.5% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| feast | 58.8% | 2.5% | 0.05 | 25.0% | 0.03 | 0.00 |
| mould | 62.5% | 8.8% | 0.68 | 18.5% | 0.13 | 0.00 |

*ALL_OvM*

| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |
|---|---|---|---|---|---|---|
| mould | — | 0.0% | 0.00 | — | 0.14 | 0.00 |
| pollinate | 71.3% | 23.8% | 0.59 | 4.3% | 0.03 | 0.00 |
| bear | 71.3% | 0.0% | 0.00 | — | 0.00 | 0.00 |
| feast | 56.3% | 2.5% | 0.06 | 0.0% | 0.00 | 0.00 |


### Reading the five failure modes the brief asked to separate
1. **Failure to draw ingredients.** A working pollination pair reached hand or field in about 62% of Orchard games and about 40–44% of Garden games. Shape inputs reached it in 70–79%, Set inputs about 62%, Feast 50–70%, Writ 46–62%, Mould about 60%.
2. **Failure to afford or execute.** Drawing the pair did not make pollination legal. It was offered in only about 26% of Orchard games, because of a Fresh Bee, a full field, an existing Fruit, or the Bee having already struck. Feast was offered in only 4–12% of games: it needs a Fruit *and* an exhausted body in the same turn. Set was never offered, because no pilot ever made a Setting.
3. **Failure to obtain a worthwhile payoff.** Feast is significantly worse than Abundance in the same list for the Journeyman (−10.3 points, CI −15.6 to −4.1). Writ vs Omen and Mould vs Toadstool show no significant difference.
4. **Successful opponent disruption.** B relationships resolve instantly, so failures were about 0 per game. In C-life the few processes that started were mostly broken or lapsed.
5. **Legal but inferior to an ordinary strike.** This is the clearest result. **Shape was legal in about 60% of Workshop games (about 9 offers per game) and no pilot ever chose it**: not Journeyman, Specialist or Builder. Under these evaluators, Copper's 2-strike attacker is always worth more than a Setting. So the Signet and the endorsed Writ never appeared naturally. The pack predicted this risk: "the metal is useless except en route to Signet".

**Packages overall.**
- None of the three packages beats its rc1 ablation with any pilot.
- Every confidence interval except two crosses zero:
  - Garden, Journeyman: −7.8 points, interval below zero.
  - Garden, Specialist: +14.2 points over only 30 deals. Its direction disagrees with the other two pilots.
- Treat both as noise until humans play.

**What these numbers can and cannot say.** The pilots are one- and two-ply searchers. The design pack warns that a myopic bot is a poor judge of two-turn investments. That matches what we saw: module actions are rarely chosen even when legal. These results establish that the mechanics are **reliable, explainable and replayable**. They do **not** show that the mechanics are strategically weak for humans. Not measured this pass: burst damage, field-occupancy tails and seat bias per arm. The funnel's "drew" column includes the C-life "bear" row in B arms; ignore that row.

## Stage 5: C-life (isolated)
- **Format:** `folio_c_life`.
- **Processes:** **Bear** (cultivation) and **Shape** (craftsmanship) become public, interruptible processes:
  - one open per player, at most one start per own turn;
  - the start uses the ordinary Clause;
  - completion is a paid (1 breath) activated declaration at the owner's next Main, after a whole rival turn;
  - an unfinished process lapses at that End;
  - a bound input leaving play, changing controller or changing form cancels it at once;
  - inputs bound to a process cannot be used as fusion ingredients.
- **Unchanged:** Set, Feast, Writ and Mould keep their B timing. That is the "one cultivation, one craftsmanship" priority.
- **Excluded:** no alternative victory, no C-proof.
- **Tests:** start, survive a rival turn, complete for 1 breath; a bounce breaks it; Shape completes into a Setting; lapse.
- **UI:** the centre strip shows each open process, its bound inputs and what breaks it. A C-life fixture is included.
- **Result:**
  - C-life vs B on the same lists is a difference of 0 to ±3 points, with no significant effect.
  - Pilots start processes rarely and complete them more rarely still.
  - Two policy bugs were found and fixed along the way:
    - an open process had been valued above its own output;
    - a completable process that would lapse had kept its stored value.
  - Even after the fixes, a one-ply pilot spends the breath on strikes first.
  - **No evidence either way.** This needs humans, or a planner that values the next turn.
- **C-proof fixtures:** not built. Alternative victory was explicitly kept out.

## Stage 6: future architecture
See `engine29/V31_FUTURE_ARCHITECTURE.md`. It covers:
- functional roles as data;
- explained predicates;
- module gating;
- process records;
- shared cross-player relationships;
- alternative victory as a process with a terminal check;
- what not to do yet.

## Recommendations
1. **Human playtest is now the gate** (sheet: `playtest/V31_HUMAN_TEST_SHEET.md`). Start with O vs D3 from both seats, as the designer ledger proposes.
2. **Workshop:** before tuning numbers, decide what a Setting is worth on its own. Right now every pilot prefers the Copper. Options to test separately: Setting keeps 1 strike, or Shape's cost includes a card draw. (Each would be a new format ID; not done.)
3. **Orchard:** the bottleneck is execution (timing, Fruit and field), not drawing. Feast loses to Abundance with bots. Watch whether humans set up Feast turns.
4. **Mould** works mechanically and gets chosen. It is neutral against Toadstool.
5. **C-life:** keep it isolated. Do not invest in C-proof until B shows a human-visible benefit.

## Verification and integrity
- **Engine tests:**
  - 196 of 196 pass, including the 24 pre-Alkahest rc1 replays.
  - New this pass: 13 V31 fixture/fuzz tests and 1 C-life test.
- **Playtest:** controller 2 of 2. Browser smoke 0 errors.
- **Viewer:** checked in the real viewer.
- **Results:** 32 files in `engine29/results/v31/`. Regenerate the tables with `node tools/v31_summary.js results/v31 [spec_|bld_]`.
