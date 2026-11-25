# V30 "The Crucible" — implementation and playtest report

Branch `v30-crucible` (from `v29-grammar`). Reference rules `grammar_v30_rc1` (0.30.0-rc1) are unchanged; every alternative has its own format ID. Nothing is deployed to production; V28 is untouched.

## 1. What was delivered

- **Playable browser build** — private artifact "Word Alchemy — The Crucible (V30 playtest)", slug `d42773a3-fbb2-4328-a718-7abd264d312c`, version `1795569737-1b82`. Source `playtest/`, build `playtest/dist/` (`app.js` sha256 `905801ce8bd8a351…`, `index.html` `3a57271a3812d2db…`). It runs the authoritative `engine29` code bundled unchanged; there is no second rules engine. Contents and launch: `playtest/README.md`.
- **Controller** (`playtest/src/controller.js`): the engine is synchronous, so every human choice (mulligan, block, response, answer, every decision) is taken by snapshot and re-execution with an answer queue. Inputs are logged in the same order as `src/replay.js`, so a browser match replays in the headless engine to the same hashes.
- **Themed and counter decks** (`engine29/data/themed_decks.js`): 9 themed decks and 2 counter decks, all legal 20-word singletons.
- **Six experiment formats** (`src/formats.js`, `base` + `variant`):
  - `grammar_v30_exp_price34`: market prices 3 (own school) / 4 (other school).
  - `grammar_v30_exp_nosentence`: no spark from sentences.
  - `grammar_v30_exp_income2`: spark income every second turn.
  - `grammar_v30_exp_buy2`: a purchase every second turn.
  - `grammar_v30_exp_reserve3`: reserve cap 3.
  - `grammar_v30_exp_cheapresp`: Sleep, Frozen, Gust and Doubt cost 1 less as responses, never below 1.
- **Instrumentation for the missing denominators:**
  - hand size by round;
  - draws blocked by a full hand;
  - response windows, windows with a legal option and windows with reserve;
  - own/off-school buys;
  - bought cards later played;
  - fusion turns;
  - turns with no play early in the game.
- **Guard semantics test** (`test/v30.test.js`). Reference rule, now written down and tested:
  - once a block is committed, the blocker is the recipient;
  - if the protected Thing leaves before resolution, the attack still hits the Guard, and the Guard still strikes back;
  - if the Guard leaves, the attack misses and does not redirect.
- **Alkahest** gained its printed ability: 1 breath, sacrifice it to destroy an enemy Thing or damageable Ground (Ward applies). It had been missing.
- **Tools:**
  - `tools/v30_summary.js`: experiment tables.
  - `tools/v30_diagnose.js`: deck identity and fusion use.
  - `playtest/test/browser_smoke.py`: browser smoke test.

## 2. Verification

| Check | Result |
|---|---|
| `engine29` tests (`node --test test/*.test.js`) | **180 / 180 pass** |
| Playtest controller tests | **2 / 2 pass**: random human answers to every prompt type in 3 games; zone audit clean; replay and mid-game restore match final hashes; prompts never carry rival hand cards |
| Browser smoke (headless Chrome, 1280 px and 400 px) | **Pass, 0 console errors**: 3 full matches played by clicking (mulligan, blocks, responses, choices, market, Vessel); export → reload → resume matched the final state hash; review stepper; all 10 fixtures opened and played; inspector; deck editor |
| Viewing inside the real artifact viewer | **Not checked here**: the viewer check was unavailable in this session. The page uses only its own files plus Google Fonts (font fallback is Georgia/system) |
| V28 | Live "Word Alchemy: Duel Test" still at version `1795480641-3ee5`; not modified |

## 3. Results — rc1 reference matrix (journeyman bots, careful policy, mirrors included, seeds 30000/31000)

| run | games | first-seat wins | draws | rounds | buys/game | bought cards played | blocked draws/player | hand ≥7 rounds | responses per reserve window | answers/game | reserve used/kept | fusions/game | lethal by R3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| rc1_REF | 880 | 52.2% | 5.2% | 9.0 | 15.0 | 60.9% | 2.15 | 52.1% | 1.5% | 0.04 | 5.3% | 0.26 | 0.0% |
| rc1_TH | 660 | 48.6% | 4.2% | 9.5 | 15.8 | 63.9% | 2.55 | 57.2% | 1.3% | 0.04 | 4.4% | 0.21 | 0.0% |

**rc1_REF — deck win rates (mirrors count for both seats)**

- D6_returning_earth: 67.5% (151)
- D1_living_sky: 56.6% (173)
- D2_lockkeepers_wall: 56.4% (165)
- D5B_patient_ruin: 55.6% (171)
- D4B_experimentalist: 53.6% (166)
- D3_furnace_wind: 50.0% (172)
- D8_garden_of_endings: 45.9% (157)
- D5_clay_and_gold: 45.1% (175)
- D7_speaking_house: 36.9% (176)
- D4_orchard: 34.0% (162)

**rc1_TH — deck win rates (mirrors count for both seats)**

- T_grand_work: 63.6% (118)
- C_anti_poison: 63.2% (117)
- T_rot_poison: 61.9% (105)
- T_air_evasion: 56.3% (119)
- T_rot_recursion: 55.3% (114)
- T_fire_burn: 52.9% (119)
- C_anti_air: 49.1% (106)
- T_earth_endurance: 48.7% (117)
- T_life_growth: 44.4% (117)
- T_word_speakers: 29.9% (117)
- T_water_control: 25.2% (115)


**Reading:**
- The first seat wins 52% (REF) and 49% (themed). The opening-breath rule holds.
- Draws are 4–5%, games last about 9 rounds, and nothing kills by round 3.
- **The market floods the hand.** In 52% of rounds a player's hand is at 7 or more. Each player loses about 2.2 draws per game to a full hand. 39% of bought cards are never played.
- **Responses are almost unused.** Bots respond in 1.4% of windows where they have reserve, and 95% of kept reserve goes unspent. Some of this is bot policy (the journeyman responder is conservative), not only the rule. Human tests must say which.
- **Fusion is rare.** 22% of games have one fusion, about 0.26 per game. The most common made forms are Swamp, Golem, Phoenix and grafted infusions.
- **Themed decks:**
  - Water control (25%) and Word speakers (30%) are weak.
  - Grand Work (64%) and Rot poison (62%) are strong.
  - The anti-poison counter (63%) works. The anti-air counter (49%) is neutral.

## 4. C1 market abundance and C2 responses (paired: same decks and seeds 32000, 10 per pairing, journeyman)

| run | games | first-seat wins | draws | rounds | buys/game | bought cards played | blocked draws/player | hand ≥7 rounds | responses per reserve window | answers/game | reserve used/kept | fusions/game | lethal by R3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C1_ref | 550 | 48.8% | 6.9% | 9.3 | 15.5 | 61.6% | 2.29 | 52.1% | 1.4% | 0.04 | 5.0% | 0.24 | 0.0% |
| C1_price34 | 550 | 51.2% | 3.1% | 9.2 | 7.3 | 65.5% | 0.33 | 12.7% | 1.4% | 0.06 | 5.1% | 0.30 | 0.0% |
| C1_nosentence | 550 | 50.4% | 4.0% | 9.1 | 7.7 | 66.5% | 0.60 | 16.2% | 1.4% | 0.04 | 4.7% | 0.29 | 0.0% |
| C1_income2 | 550 | 54.0% | 4.7% | 9.4 | 11.8 | 65.4% | 1.18 | 31.4% | 1.3% | 0.04 | 4.5% | 0.29 | 0.0% |
| C1_buy2 | 550 | 51.3% | 4.0% | 9.3 | 8.7 | 68.5% | 0.62 | 20.3% | 1.3% | 0.04 | 4.6% | 0.28 | 0.0% |
| C2_reserve3 | 550 | 48.8% | 6.9% | 9.3 | 15.5 | 61.6% | 2.29 | 52.1% | 1.4% | 0.04 | 4.1% | 0.24 | 0.0% |
| C2_cheapresp | 550 | 48.4% | 6.2% | 9.3 | 15.4 | 61.3% | 2.20 | 50.9% | 1.8% | 0.08 | 4.6% | 0.26 | 0.0% |

**C1 conclusions:**
- **Price 3/4 is the clearest fix**, and it keeps the reference curve:
  - buys halve (15.5 → 7.3 per game);
  - full-hand rounds fall from 52% to 13%;
  - blocked draws fall from 2.3 to 0.3 per player;
  - more bought cards get played (62% → 66%);
  - fusions rise slightly (0.24 → 0.30);
  - the deck spread tightens: Returning Earth 69% → 59%, Orchard 31% → 38%.
- **No sentence spark** gives nearly the same relief (7.7 buys, 16% full-hand rounds). The difference is that sentence spark removes a small reward for acting, while the price change keeps it.
- **Buy every second turn** is in between (8.7 buys, 20% full-hand rounds).
- **Income every second turn** is weakest (31% full-hand rounds) and raises the first-seat rate to 54%.

**C1 recommendation:**
- Promote `price34` to the next release candidate.
- Keep `nosentence` as the fallback.
- Confirm both with human play (sheet sessions 9 and 1–4).

**C2 conclusions:**
- **Reserve cap 3 changes nothing.** The bots never hold a third point, because the cap never binds. This cannot be judged until there is a response-aware AI.
- **Cheaper responses** lift use from 1.4% to 1.8% of windows and double answers. That is a real but small effect.
- **C2 recommendation:**
  - Keep rc1 as it is.
  - Build the response-aware AI (not done in this pass) before judging the reserve rules.
  - Use human sessions 2 and 10 to learn whether people feel the window is worth holding reserve for.

## 5. C3 school identity, C4 fusion (rc1 REF matrix)

| deck | win | damage dealt by source (per game) | breath wasted | healed/game | most-played |
|---|---|---|---|---|---|
| D6_returning_earth | 58% | strike 21.7, poison 5.7, bite 1.3, debt 0.1 | 7% | 0.0 | spider 0.9, wolf 0.8, leech 0.8, decay 0.8 |
| D1_living_sky | 56% | strike 27.1, squall 0.9, bite 0.5, poison 0.0 | 3% | 0.0 | hawk 0.8, owl 0.7, wolf 0.7, herald 0.7 |
| D5B_patient_ruin | 54% | strike 26.6, crush 0.8, crush overflow 0.5, poison 0.4 | 3% | 0.0 | iron 0.8, scribe 0.7, lead 0.7, ghost 0.7 |
| D2_lockkeepers_wall | 53% | strike 26.6, crush 1.0, seep 0.9, crush overflow 0.6 | 5% | 0.0 | pike 0.9, iron 0.9, otter 0.9, stone 0.8 |
| D4B_experimentalist | 51% | strike 26.9, bite 0.6, crush 0.1, crush overflow 0.1 | 4% | 0.0 | sapling 0.7, bramble 0.7, tonic 0.6, boulder 0.6 |
| D3_furnace_wind | 49% | strike 19.2, squall 2.9, calcine 2.1, torch 1.7 | 8% | 0.0 | salamander 1.0, owl 1.0, wind 0.9, ember 0.9 |
| D5_clay_and_gold | 45% | strike 25.5, crush 1.0, crush overflow 0.5, scream 0.4 | 4% | 0.0 | copper 0.8, tin 0.7, lead 0.7, scribe 0.7 |
| D8_garden_of_endings | 41% | strike 24.3, poison 2.1, debt 0.1, bite 0.0 | 3% | 0.0 | scarab 0.8, adder 0.7, willow 0.7, sapling 0.7 |
| D7_speaking_house | 37% | strike 25.2, scream 1.4, squall 0.3, poison 0.0 | 4% | 0.0 | wolf 0.8, owl 0.8, hare 0.7, herald 0.7 |
| D4_orchard | 31% | strike 25.5, crush overflow 0.1, crush 0.1, poison 0.1 | 4% | 0.0 | willow 0.8, bramble 0.7, sapling 0.7, rose 0.7 |

Games with at least one fusion: 194 of 880 (22%). Made forms: {"energy":22,"swamp":68,"ouroboros":14,"golem":43,"stonebound":5,"phoenix":36,"grafted":36,"fireborn":1,"seaborn":3}


**Diagnosis:**
- **Returning Earth is not an Earth problem.** It is the only deck with a second damage channel that the defender cannot block: Rot poison, about 5.7 life per game on top of strike. Do not nerf it. The lesson is that decks without an unblockable channel fall behind.
- **Orchard deals almost all its damage by strike.** It heals nothing measurable, and its growth plan does not turn into pressure.
  - Note: `healed` reads 0 for every deck. Fruit, Mend and similar healing are not counted in that stat, so this is an instrumentation gap to fix, not proof that Orchard heals nothing.
  - Do not buff Orchard blindly. The next separate test is a Fruit or Growth conversion to pressure, in its own format ID.
- **Speaking House and Garden of Endings** also lack a second channel (scream 1.4 and poison 2.1 a game).
- **Fusion (C4):**
  - it happens in 22% of games;
  - price 3/4 nudges it up;
  - the controller and fixtures make the Vessel fully usable by hand, so the human sessions (5 especially) are the real test of whether it is worth a turn.

## 6. §15 checklist status (C5)

| Item | Status |
|---|---|
| Playable V30 build a person can test | **Done** (private artifact) |
| Every human choice engine-backed, no hidden-info leaks | **Done**, tested |
| Replay/debug export, resume, review | **Done** |
| Diagnostic fixtures labelled as fixtures | **Done** (10) |
| 10-deck rc1 matrix with mirrors | **Done** (880 games) |
| Themed decks and counters | **Done** (11 decks, 660 games) |
| C1 market experiments | **Done** (4 variants vs reference, paired) |
| C2 response experiments | **Partly**: rules variants run; response-aware AI not built |
| C3 identity diagnosis | **Done** (Returning Earth, Orchard); fixes not trialled |
| C4 fusion usefulness | **Measured**; needs human verdict |
| Six interpretations: player-readable examples | **Partly**: Guard-target case tested and written; other five are covered by the fixtures, not by a written page |
| Bot policy improvements without hidden info | **Not done** this pass |
| V28 catalogue export | **Not done**: the live artifact's `index.html` and each of its nine art packs are over 4 MB, which is beyond what can be read here. The art packs could be copied server-side into the V30 artifact once their key format is known |
| Card art in V30 | **Pending**: frames are real; art windows show rules text and "art pending" |
| Human playtests | **Ready to start**: `playtest/HUMAN_TEST_SHEET.md` |

## 7. Recommendations, in order

1. Play sheet sessions 1–4, then 9. If price 3/4 also feels better in hand, make it rc2.
2. Build a response-aware bot tier that uses only public information and the bot's own hand, then rerun C2.
3. Fix the `healed` stat. Then test one Orchard conversion and one second channel for Speaking House, each in its own format.
4. Confirm the V28 art pack format and copy the packs into the playtest artifact, so cards show their real art.
5. Keep the §7 future contracts:
   - personally owned decks only in the real game;
   - idempotent rewards (already in `journey.js`);
   - stable IDs;
   - pinned rival decks;
   - no campaign yet.

## 8. Result file checksums (sha256, first 16)

- `v30_rc1_REF.json` 7bfd18bfa7a6b56e
- `v30_rc1_TH.json` 1577f819b41accca
- `v30_C1_ref.json` 0fd03fc3207d899a
- `v30_C1_price34.json` 91e8dfebd865d3c7
- `v30_C1_nosentence.json` e1f1985c05687cfa
- `v30_C1_income2.json` 79897bbd7cdb101b
- `v30_C1_buy2.json` df360a3a4726cfee
- `v30_C2_reserve3.json` a468637609a3f043
- `v30_C2_cheapresp.json` 7edf5dc11a0f14ae
