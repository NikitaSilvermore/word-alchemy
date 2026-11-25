# V33 The Core Duel — implementation report

## 1. Delivered
- **One default build:** rules version `v33_core` 0.33.0-core.1, branch `v33-core`.
- **Hosted:** private artifact https://claude.ai/artifact/UZcfFERLe2RxqbcLWm4umR (slug df348535-7f6d-407b-80ad-220cbf49c9f8).
- **Offline:** the same files are in `build/`.
- **Front page:** three decks for you, three for the opponent, a skill choice (Gentle / Steady / Sharp), who starts, and Play.
- **Hidden from ordinary play:** formats, modules and policy names. They sit behind "Developer tools", which also keeps the older formats, seeds, replay load/export, fixtures and the scenario editor.
- **Earlier versions are untouched.** V28, Crucible 2, V31 and V32 keep their artifacts, data and saves. V33 saves under its own `wa33.*` keys.
- **Exact rules and card text changes** are in `V33_CARD_CHANGES.md`.

## 2. The three V31 replays, reconstructed (observations, not V33 changes)
- **All three re-run exactly on the pinned V31 build** (branch `v31-folio`, commit 9cbb860). Final hashes match: 7ab30778, a149a2a5, 2993025c. See `replays/`.
- **Strike counts confirm the report:**

  | Game | Human strikes | Bot strikes |
  |---|---|---|
  | 1 | 1 (at a unit) | 22 (12 at units, 10 at the player) |
  | 2 | 0 | 9 (7 at the player, 2 at units) |
  | 3 | 9 (all at the rival) | 14 (8 at units, 6 at the player) |

- **Game 2 — why Naphtha never ignited.** The log, not a guess:
  1. Naphtha was deployed in round 1.
  2. The rival called Rain on turn 5 (round 3). Rain makes every Thing Wet, and Wet prevented ignition.
  3. On turn 6 the rival's Stag struck Naphtha and destroyed it, two rounds before Kindle was cast.
  4. In V31, Kindle never ignited anything by itself. It gives a friendly Thing +1 strike and makes its combat hits ignite.
  5. In round 5 Kindle targeted the Firebird. The rival answered with Gust, bouncing the Firebird, so Kindle failed.
  6. There was no card in the deck that could ignite your own Naphtha. Burn and Blow target enemies only.
  - **Causes:** no route existed, the Rain wetting, and cheap Strike removal. Interruption came on top of that.
  - **V33 fixes:** Kindle can now target and ignite your own Naphtha; Wet no longer stops Naphtha; ordinary attacks can no longer pick Naphtha off; Drought dries the board.
- **Game 1 regression, now an automated test:**
  - Owl and Salamander have no action that selects the Bee or the Pear.
  - The only ordinary attack goes at the rival, is free, and leaves the orchard in play.
  - Paid removal still works: Scorch kills the Bee. Protection still works: Gust on the Ember in response saves it.

## 3. Deviations and reasons
- **Grouped combat** was implemented in full (not the single-strike fallback). It sits on the existing Clause, so the response window and replay stay deterministic.
- **The response window opens after blocks** are assigned. This keeps one bounded window, consistent with existing single attacks.
- **The Orchard has no named fusion.** No registered recipe uses only Life/Water/Air words; it relies on the Winged infusion plus growth to an Oak.
- **Study has no response window**, like the old Market buy. It is private and changes only the actor's hand.
- **Bots:** the grouped-attack lethal check now counts the whole remaining wave, and the bot weighs the counter-attack threat when exhausting attackers. Other bot tiers are unchanged.
- **Nothing else rebalanced:** life, opening breath and income are unchanged, and no stats were raised.

## 4. Tests (automated evidence only)

| Area | Result | What it covers |
|---|---|---|
| Engine | 215/215 pass (`tests/engine_tests.txt`) | 10 new V33 tests, plus every earlier suite, including the rc1 and pre-Alkahest replay tripwires (old hashes unchanged) |
| Interface | 5/5 pass (`tests/interface_tests.txt`) | Controller replay and scenario model |
| Browser, ordinary flow | 0 console errors (`tests/browser_core_flow.txt`) | Headless Chrome at 1280 and 400 px and in a sandboxed frame |
| Browser, developer paths | 0 console errors (`tests/browser_developer_paths.txt`) | Developer tools and old formats still work |
| Real claude.ai viewer | Checked once | The artifact's front page loads and Play opens the opening hand |
| Bot smoke | 108 games, no broken rules found (`tests/bot_smoke_108_games.txt`) | All 9 deck pairings, 12 games each |
| Save/restore stress | 67 checks, 0 failures | Random play with saves |

**What the 10 new V33 engine tests check:**
- Game 1 regression.
- Grouped blocks: one use per blocker, simultaneous damage, fliers.
- Attackers or blockers removed by a response.
- Study cost, once-per-turn limit, and hand and deck limits.
- No Market, no Spark, fixed catalyst.
- Paid removal (Scorch), Gust protection, Ice Guard against Bite.
- Wet Naphtha ignited by Kindle, with a bounded one-time flare.
- Drought dries the board; Abundance grows two Plants; Fruit mend and Dew heal work.
- Winged is hidden on fliers.
- Shuffled bot games in every pairing with zone audit and exact replay.

**Browser test details:**
- Full matches were played by clicking: decks chosen, Attack panel, Study, blocks, responses.
- The replay was exported and reloaded with matching hashes.
- Leaving and returning mid-match continued the same match.

**Bot smoke details:**
- Bots cannot tell us whether the game is fun.
- Matches lasted 5–11 rounds. There were no stalemates or unfinished games.
- Fatigue damage occurred once.
- Across all 108 games there were 30 Naphtha flares, 71 ignitions, 15 fusions and 39 Seed/Sapling → Oak growths. These are event counts, not games.
- Win counts for the first-listed deck:

  | Pairing | Won |
  |---|---|
  | Orchard v Furnace | 5/12 |
  | Orchard v Clay Court | 3/12 |
  | Furnace v Orchard | 7/12 |
  | Furnace v Clay Court | 6/12 |
  | Clay Court v Orchard | 10/12 |
  | Clay Court v Furnace | 6/12 |

- Mirrors: Orchard won 8 of 12 for the first seat listed, Furnace 7 of 12, Clay Court 4 of 12.
- The Orchard is weakest in bot hands. Bots almost never pollinate or Feast, so this may understate it.

## 5. Not implemented or not verified
- **No human play and no timing.** Match length in minutes, and whether it's fun, are unknown.
- **Balance is unknown.** The Orchard vs Clay Court skew is the first thing to watch.
- **Interface not done:**
  - Hairline Mount skin and the final board.
  - Hover rules tooltips (the ⓘ inspector exists).
  - Explicit "what would make this legal" hints for every recipe; the existing why-not texts cover most cases.
  - Animation trimming beyond grouped attacks.
- **Small screens:** at phone width the opening-hand screen needs scrolling to reach Keep.
- **Response prompts** still appear whenever the human holds an affordable Response; "Auto-pass my responses" turns them off.
- **Deliberately deferred:** Great Work wins, invitations, supply spaces and processes. The V31/V32 modules exist only in Developer tools.
