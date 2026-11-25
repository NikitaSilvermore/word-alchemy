# V33 — exact rules and card changes

All changes apply only under rules version `v33_core` (0.33.0-core.1); the engine module is `core`. Earlier formats, their replays and their hashes are unchanged.

## Rules

### R1 · Ordinary combat
- **Default before V33:** each Thing could pay 1 breath to Strike the rival, any enemy Thing, or the enemy Ground.
- **V33 replaces this** with one grouped attack per turn (action type `combat`).
- **Declaring:**
  - During your Main, once per turn, choose any non-empty set of your ready Things that can strike and have strike above 0.
  - Costs 0 breath.
  - Every attacker becomes exhausted and uses its action.
  - The target is always the rival duellist.
- **Blocking:**
  - For each attacker in the order declared, the defender may assign one eligible blocker: ready, not incapacitated, and able to intercept.
  - A flying attacker can only be blocked by Flying or Reach.
  - Each blocker blocks at most once.
  - Blockers exhaust when assigned.
- **Response window:** then one response window opens (rival response, attacker answer), exactly as for any other sentence.
- **Resolution:**
  - Pairs resolve in declaration order using the existing strike arithmetic, including keywords such as pack bonus, Venomous and ignite-on-hit.
  - A blocked pair: the attacker and blocker damage each other simultaneously.
  - An unblocked attacker deals its strike to the rival's life.
  - Deaths are checked after the whole combat.
- **Removed pieces:**
  - An attacker that left play before resolution deals nothing.
  - If a blocker left play, its attacker stays blocked and deals nothing. There is no redirect; this matches the existing rule.
- **Targeted attacks** stay possible only through Action words that say so: Bite, Crush, Cut. Their subject, cost, reach, Guard interception and retaliation rules are unchanged.

### R2 · Study
- Main, own turn, once per turn, 2 breath: draw 1 word from your own deck.
- Only if the deck has a card and the hand has room.
- No response window, no selection, no discard.

### R3 · Economy
- **No Market:** no offers, no buying.
- **No Spark:** Spark is never gained.
- **Catalyst:** each player keeps the fixed starting catalyst (1), shown on screen. It cannot be refilled.
- **Unchanged:** the opening breath, initiative compensation, reserve cap 2, the 1 draw per turn with the first-seat skip, and 30 life.

## Card text changes
Every other word keeps its existing definition.

| Word | School · type · cost | Before (V31) | V33 |
|---|---|---|---|
| Fruit (token) | Life · token | Main, 1 breath, sacrifice: heal 2 life, or remove 1 poison from a friendly Thing | Adds a third choice: **restore up to 2 marked damage on an injured friendly Living Thing**. Not offered if no such Thing is injured. One Fruit is spent once. |
| Dew | Water · Spell (Response) · 1 | Friendly Thing becomes Wet (Burning ends) and loses 1 poison; or remove 1 poison from yourself | Same, and if the chosen Thing is Living, it also **restores up to 2 marked damage** |
| Kindle | Fire · Spell (Response) · 1 | Friendly Thing +1 strike this turn; its combat hits Ignite flammable targets | Same, but if you choose **your Naphtha, Ignite the Naphtha** instead |
| Naphtha | Fire · Thing · 2 · 0/3 | First time Ignited: 2 damage to every enemy Thing, then destroyed. Wet prevents ignition. | **Wet does not stop it igniting** (oil burns on water). The first ignition also deals **2 damage to the rival**. Happens once per card. |
| Drought | Fire · Weather · 2 | Each upkeep, the active player's Things dry; your first Ignite of an enemy Thing each turn deals +1 | Also, **when called, every Thing on both sides stops being Wet** |
| Abundance | Life · Spell · 3 | Up to 3 friendly Living Things gain 1 Growth; one also gains 1 Might | **Up to two friendly Plants: each gains 1 Growth and ages once** (at age 2 a Seed becomes a Sapling, and a Sapling becomes an Oak or Willow; at most one stage per Plant per turn) |
| Winged | Air · Quality · 1 | Attach to a compatible friendly Thing: Winged, Flying, Blow | **Cannot be attached to a Thing that already flies** (this hides a choice with no benefit) |

Affected but unchanged as text:
- Salamander, Firebird and Kindle ignite only things they actually hit in combat. Under R1 those are blockers, or targets of a Bite.
- Guard (Ice, Boulder, Golem, and the Guard spell) now matters only against targeted attack words.

## The three decks (all legal: 20 distinct words, at most 3 schools)

**The Orchard (Life · Water · Air):**
Bee, Pear, Hazel, Feast, Seed, Sapling, Grow, Abundance, Plants, Wolf, Bramble, Bite, Bind, Water (Ground), Dew, Ice, Otter, Wind, Gust, Owl.
- Removal: Bite, Gust, Bind.
- Protection: Ice (Guard), Dew, Gust, Bind.
- Card flow: Plants (pick a Plant from the top 3), Study.

**The Furnace (Fire · Air):**
Ember, Torch (Ground), Fire (Ground), Salamander, Firebird, Naphtha, Burn, Scorch, Kindle, Calcine, Wildfire, Drought, Swallow, Owl, Wind, Gust, Blow, Gasp, Winged, Herald.
- Removal: Burn, Scorch, Calcine, Blow, Gust, Wildfire, Naphtha flare.
- Answers: Gust, Kindle, Drought.
- Card flow: Herald (pick 1 of the top 2), Study.

**The Clay Court (Earth · The Word):**
Clay, Lead, Copper, Silver, Iron, Flint, Boulder, Crucible (Ground), Transmute, Guard, Crush, Metals, Word, Scribe, Familiar, Bard, Omen, Protect, Doubt, Awaken.
- Removal: Crush.
- Protection and answers: Protect (Ward), Doubt (counter), Guard, Boulder.
- Card flow: Omen, Metals, Scribe, Bard, Study.

**Fusions each deck can reach:**
- Orchard: Winged infusion (Wolf + Wind). No named recipe exists for Life/Water/Air.
- Furnace: Energy (Ember + Wind); Phoenix (Firebird + Ash, where Ash comes from Calcine); Winged infusion.
- Clay Court: Golem (Clay + Word).
