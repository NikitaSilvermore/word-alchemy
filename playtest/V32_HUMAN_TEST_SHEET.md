# V32 The Workshop — human test sheet

Separate research build. V28, Crucible 2 and V31 are untouched; this build saves under its own keys (`wa32.*`).
Write down what you see. Automated results are in the implementation report; this sheet is for what only a person can judge.

For every session note: rules version, seed, who started, and export the replay (Export replay → copy) when anything surprises you.

## 1. Scenario editor (Lobby → Scenario editor)
1. Open a fixture with **Edit as scenario** (Scenario fixtures list). Change one thing: a card in hand, a life total, a damage value.
2. Switch the rules version to one marked ✕. Does the refusal say clearly *what* is wrong?
3. Build a position of your own from a blank. Could you set up what you wanted? What was missing?
4. Play it, export the replay, reload it (Load a replay → Resume). Same position, same result?

Notes:

## 2. Diagnostics (Your turn → "Why not?")
Use it at least five times, including in `cv_fruit`, `cv_setting`, `w5_lethal`.
- Did each status (Best / Strategically inferior / Unaffordable / Too slow / Unavailable) match your own reading?
- Name one case where the planner's line looked wrong to you, and why.

Notes:

## 3. V — visiting an opposing orchard (`v32_visit`, then `v32_visit_draw`)
Fixtures `v_visit` and `v_host`, then two full games: V01 Neighbour's orchard vs V04 Orchard cellar.
- As host: did you ever *want* to open your orchard? What made you decide?
- As visitor: was reordering your top two worth giving the rival a Fruit? Was the draw arm different?
- Did refusal feel free and clear? Did an interrupted visit (Gust on the Pear) read correctly?

Notes:

## 4. H — borrowing the rival's heat (`v32_heat`)
Fixture `h_heat`, then games V03 Seal engraver vs V13 Giver of fire.
- Did the 1-spark fee, paid at declaration and kept when interrupted, feel fair?
- When did you prefer your own Shape (2 breath) to borrowed heat (1 breath + 1 spark)?

Notes:

## 5. R — combat permissions (`v32_rfruit`, `v32_r6`, `v32_rext`)
Fixture `r_roles`, then the same matchup (V01 vs V08) in each of the three versions and in `v32_b`.
- Was it clear, before attacking, who could intercept and who could strike back? (Chips and Inspect.)
- Fruit-only vs six rows vs broad overlay: which felt most natural? Which removed decisions you liked?

Notes:

## 6. Field capacity (`v32_b` 5 · `v32_cap6` 6 · `v32_supply` 5 + 1 supply)
Fixture `c_supply`, then one game in each with V03 vs V01.
- Did the supply space change what you built? Did displacement ever happen, and was it understandable?

Notes:

## 7. Why make something instead of attacking? (`cv_fruit`, `cv_setting`, `f_feast`, `f_signet`, `v32_shape1`)
- For each fixture, write the line you chose and why.
- In `v32_shape1` (Shape at 1 breath), did you shape more often than at 2? Did a Signet ever pay off?

Notes:

## 8. W5 — the World Tree work (`v32_w5`) — concept only
Fixtures `w5_success`, `w5_disrupt`, `w5_interrupt`, `w5_lethal`, then two games with V11 Maker of the World Tree.
- Was the claim (what it needs, how it breaks, when it completes) readable from the board alone?
- As the rival: did the open claim change your turn? Did you feel you had a fair answer?
- In the full games: how far along the chain did you get (Swamp / Life / World Tree / Growth / claim)?

Notes:

## Overall
- One thing to keep, one to cut, one that confused you.
- Anything that broke, froze, or lost progress (with the exported replay).
