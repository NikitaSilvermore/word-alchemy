# Word Alchemy — V33 The Core Duel

**Build:** V33 The Core Duel, research build 1
**Rules version:** `v33_core` 0.33.0-core.1
**Code branch:** `v33-core` (commit ab0bdbc)

This is a research proposal. None of these rules or numbers are approved. Nothing here claims the game is fun or balanced; only people playing it can tell us that.

## How to play: the one normal way
- **Hosted (recommended):** open https://claude.ai/artifact/UZcfFERLe2RxqbcLWm4umR
  - This is a private artifact. It loads and starts a match in the claude.ai viewer; that was checked.
  - Your match is saved as you play. If you leave and come back, it continues.
- **Offline:** open `build/index.html` in Chrome or Edge.
  - If the browser blocks local files, run `python3 -m http.server` inside `build/` and open http://localhost:8000.
  - The card fonts load from Google Fonts. Without internet, the browser uses its own fonts instead.

On the front page:
1. Pick your deck.
2. Pick your opponent's deck.
3. Optionally choose the opponent's skill (Gentle / Steady / Sharp) and who starts.
4. Press **Play**.

Everything else — earlier versions, seeds, replays, scenario tools — sits behind the small "Developer tools" link at the bottom of the page. It is not part of the game.

## The rules in plain English
- **Winning:** bring your rival from 30 life to 0.
- **Breath:**
  - Each turn you get breath, shown large under your side of the board. Words cost breath.
  - Unspent breath (up to 2) becomes **reserve**. Reserve pays for Responses on the rival's turn.
- **Playing words:** bring forth Things, lay a Ground, call Weather, and speak Spells and Actions. Each word does exactly what it says.
- **Attack — once per turn, free:**
  - Choose any of your ready Things. They all attack the rival together, and each one becomes exhausted, so it cannot block on the rival's turn.
  - The rival assigns blockers: at most one per attacker, and each blocker blocks only once.
  - A blocked attacker and its blocker damage each other. Unblocked attackers damage the rival.
  - Fliers can only be blocked by Flying or Reach.
- **Attacks never choose a Thing.** To hurt a particular Thing you need a word that says so — Bite, Crush, Scorch, Burn, Calcine or Blow — and that word costs breath. Gust sends a Thing back to its owner's hand. A Guard (Ice, Boulder) can step in front of an attack aimed at one of your other Things.
- **Study:** 2 breath, once per turn: draw one word from your deck.
- **Draws:** you draw 1 each turn, as before. The starting player still skips the first draw.
- **No Market and no Spark** in this build. Each player has 1 fixed catalyst for fusions that need one.
- **Fusion:** open the Vessel to fuse two of your ready Things into a named form. One fusion per turn.

## The three decks
Each is 20 different words from at most three schools. Full lists are in `V33_CARD_CHANGES.md`.

| Deck | Schools | Style | Big moments |
|---|---|---|---|
| **The Orchard** | Life · Water · Air | Bee + Pear and Wind + Hazel make Fruit. Fruit heals, cures, mends, or feeds a second attack (Feast). Seeds grow into Saplings and Oaks; Abundance speeds that up. Ice (Guard), Bind, Gust and Dew protect. | A grown Oak (3/6); a Feast second wave; a Winged Wolf (Wolf + Wind) |
| **The Furnace** | Fire · Air | Fast fliers and fire-beasts. Burn, Scorch, Calcine and Blow remove key pieces. Drought dries the board. | Kindle the Naphtha for a flare; Calcine leaves Ash, and Firebird + Ash fuse into a Phoenix (reborn once); Wildfire |
| **The Clay Court** | Earth · The Word | A slow wall: Boulder, Guard, Iron. Omen, Scribe, Bard and Metals for card flow. Crush for removal. Protect and Doubt as answers. | Clay + Word fuse into a Golem (3/5, Guard); Transmute Lead → Copper → Silver → Gold (Gold gives +1 breath every turn) |

## Three suggested matches — one per deck, all optional
1. Play The Orchard against The Furnace. Try to grow an Oak or make Fruit, and use Fruit or Dew to save a hurt Thing.
2. Play The Furnace against The Clay Court. Set up Naphtha and Kindle it; Calcine for Ash, then fuse a Phoenix.
3. Play The Clay Court against The Orchard. Build a Golem, climb the metals, and keep reserve for Protect or Doubt.

**Three questions afterwards:**
- What was the most exciting moment?
- What felt tedious?
- Did you want to play another match?

Export the replay (one click, top bar) if anything surprised you.

## What changed since V31 (summary)
Full detail is in `V33_CARD_CHANGES.md` and `V33_IMPLEMENTATION_REPORT.md`.
- **Attacks:** ordinary attacks are one free grouped attack at the rival. Removal now always costs a word.
- **Card flow:** added Study. Removed the Market and Spark.
- **Revised cards:**
  - Fruit can also mend a hurt Living Thing.
  - Dew also heals a hurt Living Thing.
  - Kindle can ignite your Naphtha. Naphtha ignores Wet, and its flare also hits the rival for 2.
  - Drought dries the whole board when called.
  - Abundance grows two Plants.
  - Winged is no longer offered to Things that already fly.
- **Interface:**
  - A new front page.
  - Big breath display.
  - An Attack panel.
  - Cost and remaining breath shown before every sentence.
  - Obvious single actions (bring forth, lay Ground) no longer ask for confirmation.
  - Plain card texts for the revised cards.

## Important limitations
- **No human has played V33 yet.** Fun, balance and match length are unknown. No minutes have been measured.
- **Bot-only games:**
  - They finished in 5–11 rounds with no stalemates; fatigue damage occurred once in 108 games.
  - Bots favoured The Clay Court over The Orchard (Orchard won 5 of 24 games in that pairing).
  - Bots rarely pollinate or Feast, so The Orchard may be stronger in human hands. This is unverified.
- **The Orchard has no named fusion,** because no registered recipe uses only Life, Water and Air. Its fusion is the Winged infusion (Wolf + Wind).
- **Not built:**
  - Hairline Mount card skin and final board.
  - Hover rules tooltips beyond the existing inspector (the ⓘ button).
  - Animation trimming beyond grouping attacks.
- **Small screens:** on a narrow phone-width screen, the opening-hand screen needs scrolling to reach the Keep button.
- **Earlier versions are untouched:** V28, Crucible 2, V31 and V32 keep their own artifacts, data and saves.

## Contents of this archive
| Path | What it is |
|---|---|
| `START_HERE.md` | This page |
| `V33_IMPLEMENTATION_REPORT.md` | What was built, what the replays showed, tests, deviations, gaps |
| `V33_CARD_CHANGES.md` | Exact rules and card changes, and the three deck lists |
| `build/` | The playable browser files |
| `tests/` | Engine, interface, browser and bot smoke results |
| `replays/` | The three original V31 replays and their reconstruction results |
| `source/V33_changes_since_V32.patch` | The code changes |
