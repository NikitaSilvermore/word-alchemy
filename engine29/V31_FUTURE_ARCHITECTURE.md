# V31 — how the engine could take the Living Folio further (Stage 6, documentation only)

Nothing here is implemented beyond the V31 experiment. These are the seams that the V31 work found and used, and what each future system would need.

## 1. What V31 actually added, and where it lives

| Seam | V31 use | File |
|---|---|---|
| **Format modules.** `variant.modules` on a format, read as `S.rules.modules`. | Gates every new word, overlay, recipe and process. rc1 leaves it empty, so rc1 hashes, replays and bot choices are byte-identical: 24 pre-Alkahest replays and the benchmark digests still pass. | `formats.js`, `engine.js createMatch` |
| **Word traits.** `trait(S, t, key)` reads a printed field, or an overlay for the active module. | Pollination channel (`insect`/`wind`), carrier (`insect`/`wind`), Smith's `shapeWork` ability. Pear and Wind keep their rc1 text and stats. | `cards.js OVERLAYS`, `engine.js trait` |
| **Explained predicates.** One function returns the reason a relationship fails, or null. | `pollinationWhy`, `shapeWhy` are used by legality, resolution, `whyIllegal`, the inspector and the bots alike. A reason can never disagree with the rules. | `engine.js` |
| **Module recipes.** A recipe list separate from the rc1 registry. | `set`: Setting + Jewel → Signet. It uses the ordinary Vessel price, catalyst, lineage, Separate and allowance rules. | `engine.js FOLIO_RECIPES` |
| **Transformed-only forms.** These are never deck-legal. | `earth.setting` keeps the original card, its damage and its compatible attachments. Bounce returns the original word. | `cards.js FOLIO_FORMS` |
| **Process records.** C-life only. | `S.processes`: family, owner, bound input IDs with form and controller, earliest completion, open/closed reason. They are checked after every state check. | `engine.js` C-life section |

Every new action is still an ordinary legal action. It flows through the same generator, Clause, replay log and hash, and the browser offers exactly what the engine generates.

## 2. Differentiated functional roles

The relationships so far are pairwise and keyed by traits: carrier ↔ receptive host, metal ↔ jewel, decomposer ↔ dead Plant. To generalise:

- **Role vocabulary.** Replace one-off trait keys with a small table of roles, each with a matching rule: carrier, receptive, worker, workable, socket, jewel, decomposer, substrate. A role is (key, channel, conditions), for example: carrier: insect, needs wing-derived flight.
- **Matching as data.** A relationship would be `{ actor role, object role, channel equality, preconditions[], output, cost, timing }`. The `*Why` explainer then comes straight from the precondition list. The V31 code already has this shape in two functions; generalising means writing it once.
- **Guardrail.** The design pack's own rule should be enforced in tests: one step beyond existing implementation only if at least two words use it.

## 3. Richer natural interactions

- **Conditions as status predicates, not new statuses.** Wet grounding winged flight already comes from `kws()`. New conditions (pollen-laden, nourished, cured) should be boolean marks on the instance, cleared on leaving play, and never implied by counters. C-life's Nourished mark is specified exactly this way.
- **Outputs as tokens with provenance.** A crop Fruit records `cropOf` (the host instance). Provenance is public and dies with the token. Any future "this particular crop" rule reads only this field.
- **Environment.** Sky (Weather) and Ground already act as shared conditions. A future "season" would be a Weather with a module rule, not a new zone.

## 4. Shared cross-player relationships

Today every relationship is between one player's own objects. A shared relationship would need three things:

- **Explicit ownership of the output.** Who gets the Fruit when my Bee pollinates your Pear? This must be a printed rule, never inferred.
- **Consent or contest timing.** Use the Clause: the other player's response window is where they would refuse or redirect.
- **Visibility.** Every bound object must be public. The redacted view already guarantees that bots and previews cannot see hidden inputs.

The process record would carry `owners: [a, b]`, and the breaking rule applies per input controller.

## 5. Alternative victory (not implemented; C-proof kept as a design only)

- A claim is a process whose output is a game end. It needs:
  - a fixed evidence list of instance IDs;
  - a continuous-hold check (the existing `checkProcesses`);
  - a terminal check placed after Upkeep, Draw and lethal checks at the owner's next start of Main.
- `S.over` would gain a cause field (life, fatigue, cap, claim, concession). The ordering in the pack's P13 applies: earlier terminal events win, and there is no posthumous claim.
- The pack's warning should be a release gate: if one narrow removal answers every claim, remove the switch.

## 6. Board and UI implications (no layout committed)

- The inspector's **Relationships** list is enough for the 9 V31 words. A persistent display is justified only if observers miss a public fact. In C-life the open process is shown in the centre strip with its bound inputs and breakers.
- Every new rule displayed to a player should come from a `*Why` explainer. No UI-side rule text should restate engine logic.

## 7. What not to do yet

- Don't migrate the 500-word catalogue.
- Don't add card types or field spaces.
- Don't promote any module into rc1.
- Don't let a module change rc1 behaviour. The rc1 replay test is the tripwire.
