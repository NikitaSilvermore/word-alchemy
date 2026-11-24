# Word Alchemy: small-deck sandbox

A standalone test bed for small decks, themes inside schools, a graveyard and story words. It does not use or change the live duel engine, the live artifact or any save.

| File | What it is |
|---|---|
| `engine.js` | The sandbox duel engine (Node and browser). |
| `cards1.js`, `cards2.js` | The 300-card themed set, the made-only layer, ladder rungs and tokens. Card text says what the code does. |
| `themes.js` | The 29 themes (region, mechanic, crossovers) and the theme and character deck lists. |
| `bot.js` | Two bots (aggressive, careful): one greedy chooser with a one-move look-ahead. |
| `run.js`, `sum.js` | Simulation runner (2 worker processes) and summariser. |
| `tune.js`, `levels.json`, `tune.json` | The balance tuner, its final levels, and the card numbers it produced. |
| `chars.js`, `chars.json` | The search that chose each character's ten words, and the result. |
| `sweeps.js`, `allsweeps.sh`, `final.sh`, `storywords.js` | The option sweeps, the final matrix and the story-word experiment. |
| `report.js`, `export.js` | Tables for the report; the card list for the sheet (`out/`). |
| `ui.html`, `build.js`, `index.html` | The playable sandbox page and its build. |
| `results/` | Raw result files from the runs. |

Run: `node smoke.js`, `node run.js '{"name":"x","cfg":{"deck":10,"hand":5},"games":16}' out.json`, `node sum.js out.json --decks`.
