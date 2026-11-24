# Word Alchemy Duel Test: V21 to V28 source

Every file here is a byte-identical copy of the built game (`index.html`). Nothing has been split, refactored or edited.

- `index.html`: the live Duel Test at artifact version `1795480641-3ee5`, SHA-256 `8aaf44e2bbe6b3a33b3cfc49925a9034d7e314f010e84e19402df949d5dc869f`, 8,028,158 bytes. This is V28 as published (`1795465044-a317`), plus later edits by the card-design chat to the `v21` layer (status chips on the card art).
- `history/V2x/index.html`: each version as it was built and published.

The layer sources (`src/v21.js` to `src/v28.js`), patch scripts (`build/v22_patch.py` and on) and the simulator tools are on branch `duel-test-source`, in `duel-test/`.

| Version | Date | Artifact version | SHA-256 (first 16) | What changed |
|---|---|---|---|---|
| V21 · the painted cards | 23 Nov 2026 | `1795453039-67bb` | `00e6e0ecf4605dcf` | New card frames, cost gem, strike and stand in gold, status and keyword runes (built in the card-design chat; mirrored here unchanged). |
| V22 · plain words | 23 Nov 2026 | `1795455073-d50e` | `83678b4beece481a` | Hit becomes Plain Speech (no school); Golem made only; every card face one sentence, full text under "In full". |
| V23 · keywords | 23 Nov 2026 | `1795455365-3bab` | `686381a9ac8f4171` | One of 14 keywords shown per card; a card's other properties show on inspection. |
| V24 · the deck builder | 23 Nov 2026 | `1795455856-3411` | `f0b3dfe765e217cd` | Roles on every word, deck grouped by role, ground warning, labelled share bar, five two-school starters. |
| V25 · fusion | 23 Nov 2026 | `1795458016-4c1f` | `2dfa901f2ae0ebf5` | Catalysts for opposites, eight ladders with the Tin/Copper branch, special and three-school recipes, incorruptible Gold, Bulwark retuned. |
| V26 · Versus | 23 Nov 2026 | `1795463189-30c1` | `4b8f30d2773cfdc5` | Ten-rank bot ladder that plays like PvP; in-duel currency renamed ink to spark. |
| V27 · puzzles and quests | 23 Nov 2026 | `1795464093-167f` | `7f1f89f8c921cb84` | 20 solver-verified puzzles, daily challenges, daily and weekly quests. |
| V28 · the Book | 23 Nov 2026 | `1795465044-a317` (as published); `1795480641-3ee5` (live, in `index.html`) | `8aaf44e2bbe6b3a3` (live) | One book: learned and made words, silhouettes, sealed families, flavour and history lines, gilding at 10, Lexicon level. |

V28 as I published it (`1795465044-a317`, 8,016,962 bytes) is commit `1c2478b` on `duel-test-source`, at `duel-test/index.html`.
