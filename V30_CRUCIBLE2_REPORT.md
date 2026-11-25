# V30 Crucible 2 — implementation report

Branch `v30-crucible`, tag `v30-control`. V28 is untouched (live version `1795480641-3ee5`). The first Crucible build is preserved:
- artifact `d42773a3…` is still at version `1795569737-1b82`;
- git tag `crucible-1-reference`.

The updated build is a separate artifact: **"Word Alchemy — The Crucible 2 (V30 playtest)"**, slug `c9991eb0-a02d-4fa2-b997-67cc795df0c4`, version `1795574231-2d7e`. No new mechanics, no rules redesign, no catalogue expansion.

## 1. Card artwork
- **Source:** the same art as V28, taken from a local copy of its packs. The local packs are byte-identical to the live V28 files (sha256 of `art0–8.json` checked against the V28 artifact listing).
- **Coverage:** 150 of 167 word, made and token IDs have art, resized to 400 px webp (3.4 MB in total).
- **Without art:** 17 IDs show a school-coloured panel with the rules text and "art pending":
  - deck words: Firebird, Herald, Pear, Rose, Plants, Seep, Barrow, Exhume, Familiar, Grimoire, Dispel, Summon, Protect;
  - made forms and tokens: World Tree, Quintessence, Fruit token, Blossom token.
- **Display:**
  - The art fills the frame's art window.
  - Rules text sits in the frame's rules box, clamped to three lines. The full text is in the hover title, the selection panel and the inspector.
  - **Cards: Large text** swaps art for full rules text in the art window.

## 2. Healing instrumentation and reconciled win rates
- **Healing stats:**
  - `gainLife()` records life actually gained, capped at 30, overall and by source: Tonic, Fruit, Life, World Tree, Leech, potion Ground.
  - `heal()` records Thing damage actually removed.
  - These are statistics only: the state hash is unchanged. Replays and paired runs give identical results; the healing rerun of the rc1 baseline matches C1_ref exactly on every rules metric.
  - A test checks that the cap is respected and the source is recorded.
- **Why sections 3 and 5 of the first report disagreed:** they used different denominators.
  - Section 3 counted decided games only and included mirrors.
  - Section 5 counted all games and treated draws as non-wins.
  - Returning Earth draws often (15 of 144 non-mirror games), so it showed 67.5% in one and 58% in the other.
  - There is now one definition everywhere (`tools/v30_score.js`): **mirrors excluded, draws count half**. Corrected rc1 REF matrix (880 games):


- D6_returning_earth: 68.4% (W91 D15 L38 of 144)
- D1_living_sky: 58.0% (W83 D1 L60 of 144)
- D2_lockkeepers_wall: 57.3% (W79 D7 L58 of 144)
- D5B_patient_ruin: 56.6% (W79 D5 L60 of 144)
- D4B_experimentalist: 54.2% (W74 D8 L62 of 144)
- D3_furnace_wind: 50.0% (W70 D4 L70 of 144)
- D8_garden_of_endings: 45.5% (W62 D7 L75 of 144)
- D5_clay_and_gold: 44.1% (W63 D1 L80 of 144)
- D7_speaking_house: 34.0% (W49 D0 L95 of 144)
- D4_orchard: 31.9% (W40 D12 L92 of 144)


- **Healing diagnosis** (rc1 baseline, 550 games):

| deck | score* | damage dealt by source (per game) | breath wasted | life healed/game | Thing damage healed/game | most-played |
|---|---|---|---|---|---|---|
| D6_returning_earth | 70.6% | strike 21.4, poison 5.9, bite 1.2, debt 0.2 | 7% | 1.9 | 1.3 | spider 0.9, adder 0.9, miasma 0.8, wolf 0.8 |
| D1_living_sky | 63.3% | strike 26.2, squall 1.1, bite 0.4, poison 0.0 | 3% | 0.1 | 0.5 | hawk 0.8, stag 0.7, crow 0.7, wolf 0.7 |
| D3_furnace_wind | 61.1% | strike 19.3, squall 2.8, torch 1.9, calcine 1.9 | 10% | 0.0 | 0.1 | salamander 1.1, owl 1.0, wind 0.9, firebird 0.9 |
| D5B_patient_ruin | 52.2% | strike 26.0, crush 0.9, crush overflow 0.5, poison 0.5 | 4% | 0.1 | 0.1 | ghost 0.8, boulder 0.8, iron 0.7, scribe 0.7 |
| D2_lockkeepers_wall | 49.4% | strike 25.6, seep 1.0, crush 1.0, crush overflow 0.6 | 4% | 2.1 | 0.7 | iron 1.0, pike 1.0, eel 0.9, stone 0.8 |
| D4B_experimentalist | 46.7% | strike 27.2, bite 0.5, crush overflow 0.2, crush 0.2 | 5% | 2.0 | 3.4 | sapling 0.9, willow 0.8, wolf 0.7, boulder 0.7 |
| D5_clay_and_gold | 43.9% | strike 26.1, crush 1.1, crush overflow 0.4, scream 0.4 | 4% | 0.0 | 0.1 | silver 0.9, copper 0.8, boulder 0.8, flint 0.7 |
| D8_garden_of_endings | 42.2% | strike 24.5, poison 1.7, debt 0.2, seep 0.0 | 4% | 2.4 | 2.3 | willow 0.9, sapling 0.8, pear 0.7, adder 0.7 |
| D7_speaking_house | 41.1% | strike 24.9, scream 1.5, squall 0.2, bite 0.0 | 6% | 0.1 | 0.2 | wolf 0.9, owl 0.8, hare 0.7, hermit 0.6 |
| D4_orchard | 29.4% | strike 25.6, crush 0.1, crush overflow 0.1, seep 0.0 | 5% | 2.3 | 2.6 | willow 0.8, bramble 0.7, sapling 0.7, oak 0.7 |

*Score: mirrors excluded, draws count half — the same definition as every other V30 table. Damage, healing and play counts include mirrors.

Games with at least one fusion: 118 of 550 (21%). Made forms: {"stonebound":2,"phoenix":26,"energy":16,"swamp":41,"golem":22,"fireborn":2,"grafted":19,"ouroboros":6}


  Orchard heals the most life of any deck (2.3 a game, plus 2.6 Thing damage), yet still scores 29%. Its healing does not turn into pressure. This confirms the earlier diagnosis now that the data is real.

## 3. Response-aware AI (`careful|aggressive:<tier>:ra`)
- **How it decides:** every legal Response, and passing, is resolved on a redacted copy: the deciding side's own hand plus public state.
  - Cost of a response = 0.3 × the spent card's worth. Reserve that isn't used is lost at the next Renew anyway.
  - An answer also counts 0.4 per breath spent.
  - Gain includes 1.0 × the strike denied by sleeping, frozen or bound rival Things.
  - On its own turn, it samples one plausible rival hand from public information (declared schools, cards already seen) when the rival holds reserve.
  - Its randomness is seeded from the redacted state.
- **Tests:**
  - Swapping the rival's real hand and both deck orders never changes its Main choice or its Clause choice.
  - It responds at least as often as the reference bot.
  - The reference bots are byte-for-byte unchanged; the benchmark digest tests pass.
- **Tuning:** a version that also valued holding reserve lost head-to-head, 41% (±6). That component is off (`RA_OPTS.hold=false`).
- **Final strength:** 47.3% ±6.3 against the reference Journeyman (240 games, seats and decks swapped). In other words, it is as strong, but it plays the Clause.
- **What it uses:**
  - Guard, Frozen and Gust: every time they are available.
  - Sleep: 65% of the time.
  - Dew, Protect, Kindle and Drench: rarely. These are legal in most windows but seldom worth the card, so they dominate the denominator.

## 4. Response experiments rerun with the response-aware policy (550 games each, seeds 32000)

| run | games | first-seat wins | draws | rounds | buys/game | bought cards played | blocked draws/player | hand ≥7 rounds | responses per reserve window | responses per window with a legal response | answers/game | reserve used/kept | fusions/game | lethal by R3 | life / Thing damage healed per player |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| results/v30b_ref_healing | 550 | 48.8% | 6.9% | 9.3 | 15.5 | 61.6% | 2.29 | 52.1% | 1.4% | 3.3% | 0.04 | 5.0% | 0.24 | 0.0% | 1.09 / 1.12 |
| results/v30b_C2_ra_rc1 | 550 | 48.7% | 7.1% | 9.4 | 15.6 | 63.2% | 2.14 | 50.8% | 2.8% | 7.9% | 0.07 | 10.3% | 0.25 | 0.0% | 1.11 / 1.15 |
| results/v30b_C2_ra_reserve3 | 550 | 48.4% | 7.3% | 9.4 | 15.6 | 63.4% | 2.17 | 51.2% | 2.8% | 7.7% | 0.07 | 8.5% | 0.25 | 0.0% | 1.10 / 1.17 |
| results/v30b_C2_ra_cheapresp | 550 | 49.8% | 6.5% | 9.3 | 15.4 | 62.8% | 2.05 | 49.5% | 3.5% | 9.5% | 0.12 | 8.7% | 0.27 | 0.0% | 1.09 / 1.21 |
| C1_price34 | 550 | 51.2% | 3.1% | 9.2 | 7.3 | 65.5% | 0.33 | 12.7% | 1.4% | 3.6% | 0.06 | 5.1% | 0.30 | 0.0% | 0.00 / 0.00 |

**Conclusions:**
- **Use of responses:** response use per window with a legal response rises from 3.3% to 7.9%, and reserve use from 5% to 10%. The first-seat rate and game length barely move.
- **Reserve cap 3 changes almost nothing.** It is not the bottleneck.
- **Cheaper responses** add a little use (9.5% of windows, more answers). The first seat goes to 49.8%.
- **The real limit is which responses matter.** Only a handful are decisive. This is a card-pool question for later, not a reserve rule.
- **Recommendation:** keep rc1's reserve rules. Use the response-aware rival as the default opponent in human tests (it is the default in Crucible 2's lobby).

## 5. Viewer verification
- I opened Crucible 2 in the real claude.ai artifact viewer through the built-in browser:
  - lobby, fonts, art, mulligan, board, localStorage resume: all work.
- **Bug found there:** artifact frames are sandboxed without form submission, so the lobby's Start button, which was a form submit, did nothing.
  - Fixed: Start is now a plain button.
  - The browser smoke test now also starts a match inside a sandboxed frame, so this can't recur.
  - **This bug is still in the preserved Crucible 1 artifact.** I left that artifact unchanged as instructed, so its Start button does nothing in the viewer. A one-line republish would fix it.
- Seed field width fixed (a class-name clash with the board rows).

## 6. Replay and rules-version integrity after the Alkahest correction
- `REVISION` (r30.0 → r30.1) is now recorded in every replay. The revision log names the Alkahest change and the healing statistics.
- `replayMatch` refuses a replay whose format version differs from the engine's. A replay from an older revision is hash-checked action by action, and any divergence error names the revisions in between.
- **Test:** 24 matches recorded with the pre-Alkahest engine (commit 69c5e05, real worktree) replay input for input to identical hashes under r30.1. The format IDs and versions are unchanged, because no reference-deck match changed.

## 7. Market formats kept for comparison
- **Lobby "Rules version" groups:**
  - Reference: rc1, original market (2/3 spark).
  - Market comparison: 3/4 spark.
  - Other test variants.
  - Earlier: the V29 spec.
- A note tells you to play the same decks and seed in both market formats. Both format IDs are frozen in `engine29/REFERENCE_CONFIG.json`.

## 8. Usability (no layout commitments)
- Art or large-text card view.
- Full-text reader for the selected word.
- Rival responses selector (response-aware or reference).
- Mulligan hand wraps.
- Dark scrollbars.
- The log names cards that are on the field (concealed ones stay hidden).
- Seed field width fixed.

## 9. Frozen control
`engine29/REFERENCE_CONFIG.json` holds:
- format, engine revision and bots;
- the response-aware settings;
- deck sets, benchmark command and seeds, and the score definition;
- sha256 of engine, bots, formats, cards, recipes, replay, decks and the baseline result file.

Everything V31 compares against is tagged `v30-control`.

## 10. Verification
- `engine29`: **183 of 183 tests pass**.
- Playtest controller: **2 of 2 pass**.
- Browser smoke: **pass, 0 console errors.** It covers:
  - 1280 px and 400 px;
  - full matches played by clicking;
  - export → reload → resume with a hash match;
  - all 10 fixtures, the inspector and the editor;
  - a match started inside a sandboxed frame.
- Real viewer: lobby, start, mulligan, board, art and resume work.
- Builds: `app.js` sha256 `e601444fe8987336…`, `index.html` `58530d6f7db9af55…`.
