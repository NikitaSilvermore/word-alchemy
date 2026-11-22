# Word Alchemy: Duel Test — source

Snapshot of the published "Word Alchemy: Duel Test" artifact. Art packs (`assets/pack/*.json`) are left out.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The page exactly as published (byte-identical to the artifact's `index.html`). |
| `src/engine.js` | **The duel engine and every card definition** (`n_`, `v_`, `a_`, `c_`, `s_` calls build `W`), as it runs in the page, with all duel-test patches applied. Version switches read `window.DTV`. |
| `src/web21.js` | The fusion web (`window.WEB21`): every fusion recipe and the extra web cards. |
| `src/dtv.js` | Duel-test layer for v0–v7: versions, random decks, born-knowing verbs, fusion on the row, end-of-game summary, the v7 fizzle check. |
| `src/v8.js` | v8–v10 layer: the verbs round (percentages, seep, toxify, spells), v9 colour pie (schools, weather by school, evolve, in tune) v10 might, v11 balance and v12 strike and stand (a display-only rename: might shows as strike, vigour as stand; the engine still uses `vig` and `MT()`). **The current card text (glosses) for v8+ is set here** and overrides `engine.js`. |
| `src/ui.js` | The game UI as served (inline images removed from this copy). |
| `src/gguard.js`, `src/gfeed.js`, `src/mock.js` | Save isolation and version pick, feedback form, board layout and card inspector. |
| `build/` | The raw sources and `gbuild.py` that produce `index.html` (`build/base/` holds the main game's `engine.js`, `ui.js`, `head.html`, `story.js` that the build patches). |
| `node/load.js` | Loads `engine.js`, `web21.js`, `dtv.js` and `v8.js` into a Node `vm` with small browser stubs, then starts a game. |

## Running the engine headlessly

```
node duel-test/node/load.js
```

Set `DTV` in `load.js` to choose the version (0–12; the page defaults to 12). Card definitions live in `W` after `engine.js` loads; for v8 and later, `v8.js` rewrites many glosses and verb functions (`VERBF`), and adds `MT()` (might). `newGame(seed, opts)` makes a state; `resolve(S, who, sentence)` plays a sentence; `botChoose(S, who)` picks one.

## Balance simulator

`node/sim.js` is injected into a copy of `index.html` and plays bot-vs-bot duels in a browser (`node/drv.py` drives Chromium with Playwright; `node/an.py` summarises; `node/search.py` evolves strong decks). It is a test tool only and is not part of the game.
