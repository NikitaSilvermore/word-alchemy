# V29 stage H — balance experiments (24–25 Nov 2026)

All runs are paired: the same seeds, the same 10 reference decks (§10), every pairing played as mirrored pairs (starting player swapped). Journeyman bots unless stated. 550 games per variant (±4.3 points on the first-player rate), confirmations 1,100 games (±3.0). Raw records: `results/stageH_*.json`; reports: `results/stageH_*.md`.

## 1. First-player advantage

Target from the spec: first player wins 47–53%.

| Variant (all else as spec) | First player wins | Deck spread (best − worst) |
|---|---|---|
| Spec: second player starts with 1 reserve | 59.8% | 34 |
| +1 breath on the second player's first turn | 58.3% | 30 |
| **+2 breath on the second player's first turn** | **53.8%; confirmed 52.2% ±3.0 on 1,100 new games** | 32; 24 in the confirmation |
| Starting player's first turn has 2 breath, not 3 | 56.1% | 31 |
| Both of the above (+1 / −1) | 55.5%; confirmed 56.6% | 29 |
| +2 for the second player and −1 for the first | 50.7% (confirmation) | 29 |
| Starting player opens with 4 words | 58.8% | 31 |
| Buying in the market also costs 1 breath | 63.2% (worse) | 37 |
| +1 / −1 and market costs breath | 52.0% | 39 (worse) |

**Adopted for the V30 candidate format (`grammar_v30_rc1`): opening turns are 2 breath for the starting player and 5 for the second player** (+2 for the second player, −1 for the starting player, first turn only). It is the variant that holds across bot strength:

| Bots | +2 for second player only | +2 / −1 (adopted) |
|---|---|---|
| Journeyman (1,100 paired games) | 52.2% ±3.0 | 50.7% ±3.0 |
| Specialist (330 paired games) | 57.0% ±5.6 | 51.6% ±5.6 |

The simpler +2-only rule is a reasonable fallback if human testers find the starting player's 2-breath opening too thin.

Why the edge exists (stage D diagnostic): with the market, both hands fill up (about 6.4 of 7 words at game end), so cards stop being scarce and tempo decides. The second player's normal compensation is a card; a card is worth little when hands are full, so the compensation has to be tempo.

## 2. Spec §15 questions tested

| Question | Experiment | Result | Recommendation |
|---|---|---|---|
| Q1 singleton, one draw | Draw 2 per turn | First player 52.1%, but deck spread widens (27 → 41) and Orchard falls to 27% | Keep one draw |
| Q4 paid basic Strike | Strike costs 0 breath | Games shorter (median 8), more fusions and responses, deck spread widens (41) | Keep the 1-breath Strike |
| Q6 Boulder 2/6 too efficient? | Boulder 2/5 | No measurable change (Lockkeeper's Wall 64% → 68%, within noise) | Keep 2/6 |
| Q7 Orchard / Garden finishing | Oak cost 3 with Miasma cost 4 | Orchard unchanged (35% → 31%); Returning Earth 65% → 62% | Card costs are not the lever; Orchard needs a finishing payoff or better construction, as the spec suggests |

## 3. Deck balance (+2 second-player rule, Journeyman, 1,100 games; the adopted +2/−1 rule gives the same ordering)

Returning Earth (D6) is strongest at about 61–65%; Orchard (D4) and Clay and Gold (D5) weakest at 33–39%. Returning Earth's damage comes 78% from strikes and 17% from poison, which ignores blockers, delivered by cheap living bodies (Rat, Spider, Adder, Leech, Hare, Wolf, Scarab). Orchard deals 98% of its damage by strikes, so a slow board plus no reach to the rival. These are design questions for the designer, not parameters to tune blindly.

## 4. Runaway amplification

- Adversarial combination tests (`test/adversarial.test.js`): Resonant, Squall, Scream, Wildfire, breath generation, ability spark, recursion (Memory, Exhume, Echo), Phoenix, Quick, overflow, poison cap and Naphtha are all bounded.
- Speed probe (`results/stageH_probe.txt`): each deck, played aggressively against an opponent who never acts or blocks, kills no earlier than round 5, with at most 13 damage in one turn.
- Across every benchmark since stage C: no 20+ damage turn and no lethal by round 3. The V28 maths emulation still produces 20+ turns in about 9% of games.
- Fuzz: 600 games of random legal play over all 150 words, zone audit after every step: 0 errors; no turn above 30 sentences.

## 5. Not settled by simulation

Bots look at most three plies ahead and value lasting effects crudely; they rarely play weather, Laws or long engines. Response use stays low (0.4 per game). Whether the Clause feels good, and whether slow decks are fun, needs human play.
