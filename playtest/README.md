# Word Alchemy — The Crucible (V30 browser playtest)

A playable browser build of the V30 rules. Every rule comes from `engine29` (the same engine the simulations and tests use); this folder only draws the state and turns clicks into the engine's own legal actions. V28 (the live "Word Alchemy: Duel Test" artifact) is untouched.

## Launch

- **Online:** the private artifact "Word Alchemy — The Crucible (V30 playtest)" (`d42773a3-fbb2-4328-a718-7abd264d312c`).
- **Locally:** `npm install esbuild@0.24.0 && node build.js`, then serve `dist/` with any static server, e.g. `python3 -m http.server -d dist 8000`, and open `http://localhost:8000`. (Opening `dist/index.html` by double-click also works in most browsers.)

## What is in it

- **Lobby:** your deck and the rival's (10 frozen reference decks, 9 themed decks, 2 counter decks, your own test decks), rival skill (6 tiers) and style, seat, seed, rules version (rc1 reference by default; V29 spec and the six experiment formats are selectable and labelled), Start, Resume, Rematch, Swap seats.
- **Match:** both info strips (life, breath, reserve, spark, catalyst, hand, deck, Grave, Sealed, poison, burden, fatigue, schools), both rows (Ground + 5 slots), Weather and Law, the pending Clause with declaration / response / answer and block state, rival hand as backs only.
- **Sentence builder:** pick a highlighted word, Thing, market offer or the Vessel; the panel narrows the engine's legal actions one choice at a time (subject → target → payload …); board targets light up; the final step shows cost and a prediction computed on a copy with the rival's hand hidden. Clicking something illegal shows the engine's reason (`whyIllegal`).
- **Prompts:** mulligan, block (with reasons why each other Thing cannot block), response from reserve, answer from breath, every engine decision (Philosopher's Stone, reorder, select, Owl, Rust, debt, poison target, Water Ground…). Auto-pass only ever passes when you have no legal response, unless you tick "Auto-pass my responses".
- **Inspector (ⓘ on every card):** printed data, full rules text, strike and stand arithmetic, capabilities, keywords, statuses, owner/controller, attachments, Vessel lineage.
- **Chronicle:** every sentence with its results and an expandable damage-arithmetic breakdown; failures on revalidation are called out.
- **After the match:** life-loss sources, breath spent/wasted, reserve kept/used, spark, draws and buys; Rematch, Swap seats, Export.
- **Replay:** Export gives a JSON bundle (Copy button; downloads are blocked in artifacts). "Load a replay" reviews it step by step or resumes play. The last match also resumes from the lobby after a reload.
- **Scenario fixtures:** ten constructed positions (response window, Guard defence, interrupted attack, fusion, Separate, metal ladder, Grave targeting, Concealed, Law, poison), labelled as fixtures.
- **Deck editor:** the 150-word test catalogue with school filter and search; legality checked by the engine; saved to this browser only.

## Not in it yet

- **Card art:** windows show a school-coloured panel with the rules text and "art pending". The V28 art packs exist in the live artifact but are over 4 MB each and could not be read from here; see the report.
- **Mobile:** works at 400 px (3-column board), but it is built for a laptop first.

## Tests

- `node --test test/*.test.js` — the controller: random human answers to every prompt type across games; zone audit; replay hashes match `engine29/src/replay.js`; restore half-way and at the end; prompts never carry rival hand cards.
- `python3 test/browser_smoke.py dist 2` — headless Chrome clicks through whole matches at 1280 px and 400 px (lobby → mulligan → blocks, responses, Vessel, market → result), exports, reloads, resumes and checks the final state hash, opens every fixture and the inspector; fails on any console error.
