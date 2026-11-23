# Word Alchemy: Duel Test — source

Snapshot of the published "Word Alchemy: Duel Test" artifact. Art packs (`assets/pack/*.json`) are left out.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The page exactly as published (byte-identical to the artifact's `index.html`). |
| `src/engine.js` | **The duel engine and every card definition** (`n_`, `v_`, `a_`, `c_`, `s_` calls build `W`), as it runs in the page, with all duel-test patches applied. Version switches read `window.DTV`. |
| `src/web21.js` | The fusion web (`window.WEB21`): every fusion recipe and the extra web cards. |
| `src/dtv.js` | Duel-test layer for v0–v7: versions, random decks, born-knowing verbs, fusion on the row, end-of-game summary, the v7 fizzle check. |
| `src/v13.js` | v13 layer: the overnight bug report fixes (printed and logged extras, equal attunement, curse-only traps, unsayable failed sentences, fusion readiness, ground/spell kinds kept, remnants, no old ladder, life logging). Load it after `v8.js`. |
| `src/v14.js`, `src/web14.js` | v14 layer: the fusion law. `web14.js` swaps in the regenerated recipe table (named recipes, ladders, taking in, like-feeds-like, the 7×7 school chart) and `CHART14`; `v14.js` applies the value rule (stand ≥ both +2, strike ≥ the harder +1), previews every fusion in the vat, marks fusable words with ⚗, labels partners with result and cost, and writes the law into How to play. Load `web14.js` after `web21.js` and `v14.js` last. `build/gen.js` regenerates `web14.json` from `chart.json`. |
| `src/v15.js` | v15 layer: the price of making (made things bind their inputs and leave with them; great results are Final; each held trait makes taking-in 1 dearer; rungs can't climb on arrival; the weather's school makes fusions 1 cheaper), kind marks, status overlays and a gilt frame on cards, a full sentence preview, the Fading from round 13 and a draw at round 20, one mulligan, the Second Wind, computer-rival tags with house rules, and the Grimoire of made words. Load after `v14.js`. |
| `src/v16.js` | v16 layer: school identity. 19 school moves, linking kinds (spark, bright, dark, damp), sea-born things seep and drench, plants bind, hot things blind, wake/sting/thaw/gust/decay reworked, aloe/cedar/wormwood act each turn, clean card text. Load after `v13.js`. `web16.js` is its fusion table. |
| `src/v17.js` | v17 layer: seven ways to win. 25 new words (torch, cinderling, bonfire, scorch, firebrand, wildfire, otter, eel, pike, mist, wash, tide, hawk, swallow, squall, boulder, wolf, hare, bear, stampede, ghost, rat, miasma, bard, lexicon), crush overflow, toxic blows poison, Life grows and heals, Word sentences deal damage, flyers vs guards, and the tuning from the starter matrix. Load after `v16.js`. `web17.js` is its fusion table. |
| `src/v19.js` | v19 layer: The Word wins by speaking spells. Each spell of The Word you speak hits the rival for 3, plus 2 for each Word speaker on your side (up to 3 speakers); the bard draws on each spell. Replaces v17's sentence-length damage. Load after `v17.js`. |
| `src/v18.js` | v18 layer: decks. Seven starters, Wild draw, the deck builder with Complete my deck, the market stocked 40/40/20 by school, rival school decks. Saves only `wa-dt18-deck`. Load last. |
| `node/starters.json`, `node/an2.py`, `node/syn.js`, `node/synsum.py` | Starter decks; matrix analysis with damage by route; the school-synergy check and its summary. |
| `src/v8.js` | v8–v10 layer: the verbs round (percentages, seep, toxify, spells), v9 colour pie (schools, weather by school, evolve, in tune) v10 might, v11 balance and v12 strike and stand (a display-only rename: might shows as strike, vigour as stand, and the verb card `strike` as hit; the engine still uses `vig`, `MT()` and the key `strike`). **The current card text (glosses) for v8+ is set here** and overrides `engine.js`. |
| `src/ui.js` | The game UI as served (inline images removed from this copy). |
| `src/gguard.js`, `src/gfeed.js`, `src/mock.js` | Save isolation and version pick, feedback form, board layout and card inspector. |
| `build/` | The raw sources and `gbuild.py` that produce `index.html` (`build/base/` holds the main game's `engine.js`, `ui.js`, `head.html`, `story.js` that the build patches). |
| `node/load.js` | Loads `engine.js`, `web21.js`, `dtv.js` and `v8.js` into a Node `vm` with small browser stubs, then starts a game. |

## Running the engine headlessly

```
node duel-test/node/load.js
```

Set `DTV` in `load.js` to choose the version (0–19; the page defaults to 19). Card definitions live in `W` after `engine.js` loads; for v8 and later, `v8.js` rewrites many glosses and verb functions (`VERBF`), and adds `MT()` (might). `newGame(seed, opts)` makes a state; `resolve(S, who, sentence)` plays a sentence; `botChoose(S, who)` picks one.

## Balance simulator

`node/sim.js` is injected into a copy of `index.html` and plays bot-vs-bot duels in a browser (`node/drv.py` drives Chromium with Playwright; `node/an.py` summarises; `node/search.py` evolves strong decks). It is a test tool only and is not part of the game.

## Game logs (artifact db)

Every finished duel is saved once, when the end-of-duel sheet opens, to the artifact's db collection `games` (one doc per duel, id = timestamp + random suffix). Rating and notes given afterwards update the same doc. Code: `src/logs.js`; the end-sheet hook is in `src/gfeed.js`.

Fields: `savedAt` (ISO), `version` {`n`, `label`, `build`}, `rival`, `result` (win/loss/draw), `turns`, `rounds`, `lifeMe`, `lifeRival`, `lifeByTurn` [{`me`,`rival`}], `decidedRound`, `myDeck`, `rivalDeck`, `myBest` / `rivalBest` {`round`,`text`,`harm`}, `rating` (1–5 or null), `notes` {`annoying`,`best`}, `flags` [{`type`,`line`,`text`}], `flagCount`, `flagTypes`, `log` [{`k`,`x`}], `txtHead` + `txtBody` (together, joined by a blank line, the exact .txt download), `chunkCount`.

If a doc would pass 240 KB, `log` and `txtBody` move to `games/<id>/chunks/<n>` docs ({`n`, `part`}); join the parts in order and JSON.parse to get {`log`,`txtBody`}.

Flag types: unloggedLife, badSum, sameNameFusion, freeFusion, trapOnAttacker (a non-curse word sprang), learnedOnFail, doubleAttack, error. `line` is the index into `log`.
