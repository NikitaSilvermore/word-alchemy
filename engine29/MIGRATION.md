# Migration: V21 card list → V29 registry

Source: `duel-test-source:duel-test/build/web21.json` (317 words). The live V28 definitions are only in the artifact and were not compared.

| Status | Words |
|---|---|
| kept | 101 |
| legacy | 181 |
| now made-only / token | 13 |
| school changed | 22 |

New in V29 (not in the V21 list): 28 — fire.torch, fire.scorch, fire.wildfire, fire.firebrand, air.hawk, air.swallow, air.squall, earth.boulder, life.wolf, life.hare, life.pear, life.rose, life.plants, water.eel, water.otter, water.pike, water.seep, water.flask, water.wash, water.tide, rot.rat, rot.ghost, rot.exhume, rot.miasma, word.bard, word.dispel, word.summon, word.protect.

| V21 word | V21 school | V29 id | Status |
|---|---|---|---|
| abundance | life | life.abundance | kept |
| abyss | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| adder | rot | rot.adder | kept |
| air | air | air.air | kept |
| alchemist | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| alkahest | water | — | now made-only / token |
| aloe | life | life.aloe | kept |
| amber | earth | earth.amber | kept |
| amnesty | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| amphisbaena | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| ancient | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| angel | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| apothecary | word | life.apothecary | school changed (word → life) |
| aqua fortis | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| architect | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| ash | fire | — | now made-only / token |
| attractor | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| automaton | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| avalanche | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| awaken | word | word.awaken | kept |
| azoth | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| barrow | rot | rot.barrow | kept |
| basilisk | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| bat | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| be | word | word.be | kept |
| beasts | word | life.beasts | school changed (word → life) |
| behemoth | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| bellows | earth | fire.bellows | school changed (earth → fire) |
| bind | word | life.bind | school changed (word → life) |
| birds | word | air.birds | school changed (word → air) |
| bite | word | life.bite | school changed (word → life) |
| black sun | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| blind | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| blow | air | air.blow | kept |
| boar | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| bog hag | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| bramble | life | life.bramble | kept |
| brimstone | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| brine | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| brittle | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| burn | fire | fire.burn | kept |
| burning | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| calcine | fire | fire.calcine | kept |
| carrion | rot | — | now made-only / token |
| cedar | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| centaur | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| chimera | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| cinnabar | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| claim | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| clay | earth | earth.clay | kept |
| cloud | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| coagulate | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| cockatrice | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| colossus | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| copper | earth | earth.copper | kept |
| cordial | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| corrosive | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| coven | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| crow | air | air.crow | kept |
| crown | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| crucible | earth | earth.crucible | kept |
| crush | earth | earth.crush | kept |
| cut | word | earth.cut | school changed (word → earth) |
| daemon | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| debt | rot | rot.debt | kept |
| decay | rot | rot.decay | kept |
| desert | fire | earth.desert | school changed (fire → earth) |
| dew | water | water.dew | kept |
| dissolve | water | water.dissolve | kept |
| distil | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| doubt | word | word.doubt | kept |
| dream | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| drench | water | water.drench | kept |
| drink | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| drought | fire | fire.drought | kept |
| druid | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| dryad | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| dust | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| earth | earth | earth.earth | kept |
| eat | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| echo | air | word.echo | school changed (air → word) |
| egg | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| elixir | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| ember | fire | fire.ember | kept |
| enchant | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| energy | fire | — | now made-only / token |
| erosion | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| eternal | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| familiar | word | word.familiar | kept |
| feeble | word | rot.feeble | school changed (word → rot) |
| feral | word | life.feral | school changed (word → life) |
| ferment | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| fire | fire | fire.fire | kept |
| firebird | fire | fire.firebird | kept |
| firedrake | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| firewater | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| fixed | word | earth.fixed | school changed (word → earth) |
| flames | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| flint | fire | earth.flint | school changed (fire → earth) |
| flood | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| flux | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| fog | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| forget | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| foundry | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| frozen | water | water.frozen | kept |
| gargoyle | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| gasp | air | air.gasp | kept |
| geyser | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| gild | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| glass | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| gnome | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| gnosis | word | word.gnosis | kept |
| gold | earth | earth.gold | kept (transformed-only) |
| golem | earth | — | now made-only / token |
| graft | life | life.graft | kept |
| green lion | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| griffin | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| grimoire | word | word.grimoire | kept |
| grow | life | life.grow | kept |
| guard | earth | earth.guard | kept |
| gunpowder | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| gust | air | air.gust | kept |
| harpy | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| harvest | life | life.harvest | kept |
| haunt | rot | rot.haunt | kept |
| hellebore | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| hemlock | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| herald | air | air.herald | kept |
| hermetic | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| hermit | word | word.hermit | kept |
| hex | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| homunculus | word | — | now made-only / token |
| hunger | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| hydra | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| ice | water | water.ice | kept |
| ink | word | word.ink | kept |
| iron | earth | earth.iron | kept |
| ivy | life | life.ivy | kept |
| kindle | fire | fire.kindle | kept |
| knife | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| knight | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| kraken | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| laurel | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lava | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lead | earth | earth.lead | kept |
| leaden | word | earth.leaden | school changed (word → earth) |
| leech | rot | rot.leech | kept |
| lethe | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| leviathan | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lich | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lichen | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| life | life | — | now made-only / token |
| lightning | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| liquids | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| loan | word | word.loan | kept |
| locust | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lodestone | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lullaby | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| lure | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| magpie | air | air.magpie | kept |
| mandrake | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| manticore | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| masked | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| measure | earth | word.measure | school changed (earth → word) |
| memory | water | water.memory | kept |
| mend | water | life.mend | school changed (water → life) |
| metals | word | earth.metals | school changed (word → earth) |
| mirror | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| miser | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| mistletoe | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| mortals | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| moth | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| muse | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| myrrh | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| name | word | word.name | kept |
| naphtha | fire | fire.naphtha | kept |
| nemesis | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| nettle | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| night | rot | rot.night | kept |
| nightmare | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| nightshade | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| noon | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| oak | life | life.oak | kept |
| obsidian | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| occult | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| omen | word | word.omen | kept |
| oracle | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| ordeal | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| orrery | earth | air.orrery | school changed (earth → air) |
| ouroboros | life | — | now made-only / token |
| owl | air | air.owl | kept |
| panacea | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| peacock | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| pelican | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| pestilence | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| petrify | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| philosopher’s stone | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| philosophical egg | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| philtre | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| phoenix | fire | — | now made-only / token |
| phosphorus | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| pitch | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| plague | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| poison | rot | rot.poison | kept |
| quick | air | air.quick | kept |
| quickening | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| quicklime | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| quicksilver | water | water.quicksilver | kept |
| quintessence | air | — | now made-only / token |
| radiant | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| rain | water | water.rain | kept |
| realgar | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| rebis | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| reckoning | word | word.reckoning | kept |
| red king | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| resonant | word | air.resonant | school changed (word → air) |
| ripen | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| roc | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| rue | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| rumour | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| rune | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| rust | rot | rot.rust | kept |
| sacred | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| saffron | life | life.saffron | kept |
| sage | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| salamander | fire | fire.salamander | kept |
| salt | earth | earth.salt | kept |
| saltpetre | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| sand | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| sapling | life | life.sapling | kept |
| scarab | life | life.scarab | kept |
| scintilla | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| scorpion | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| scream | word | word.scream | kept |
| scribe | word | word.scribe | kept |
| sculpt | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| seed | life | life.seed | kept |
| separate | word | word.separate | kept |
| shadow | rot | rot.shadow | kept |
| shepherdess | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| sigil | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| silence | word | word.silence | kept |
| silver | earth | earth.silver | kept |
| siren | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| slag | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| sleep | word | water.sleep | school changed (word → water) |
| sleepers | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| smith | fire | fire.smith | kept |
| sodden | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| sphinx | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| spider | rot | rot.spider | kept |
| spirits | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| spore | rot | rot.spore | kept |
| spring | life | life.spring | kept |
| stag | life | life.stag | kept |
| stammer | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| steal | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| steam | water | — | now made-only / token |
| steel | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| sting | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| stone | earth | earth.stone | kept |
| stones | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| storm | air | air.storm | kept |
| strike | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| swamp | water | — | now made-only / token |
| sylph | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| tame | life | life.tame | kept |
| temper | earth | earth.temper | kept |
| thaw | water | water.thaw | kept |
| thief | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| thorny | word | life.thorny | school changed (word → life) |
| thunderbird | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| time | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| tin | earth | earth.tin | kept |
| tincture | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| toad | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| toadstool | rot | rot.toadstool | kept |
| tonic | water | water.tonic | kept |
| torpid | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| tower | earth | earth.tower | kept |
| transmute | earth | earth.transmute | kept |
| treant | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| troll | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| true name | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| twin | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| undine | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| unicorn | life | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| unnamed | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| vampire | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| vast | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| venom | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| venomous | rot | rot.venomous | kept |
| vessel | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| vitriol | water | water.vitriol | kept |
| void | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| volatile | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| volcano | earth | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| wake | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| wasp | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| water | water | water.water | kept |
| werewolf | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| white queen | water | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| wight | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| will-o-wisp | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| willow | life | life.willow | kept |
| wind | air | air.wind | kept |
| windfall | air | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| winged | air | air.winged | kept |
| winter | water | earth.winter | school changed (water → earth) |
| wither | rot | rot.wither | kept |
| word | word | word.word | kept |
| world tree | life | — | now made-only / token |
| wormwood | rot | rot.wormwood | kept |
| worts | word | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| wraith | rot | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| wyvern | fire | — | legacy — not in the 150 (keep ID, disable in V29 format) |
| yew | rot | rot.yew | kept |
## V30
- No word IDs changed or removed. Added: experiment format IDs `grammar_v30_exp_{price34,nosentence,income2,buy2,reserve3,cheapresp}` (each `base: grammar_v30_rc1`), themed deck IDs `T_*` and counter deck IDs `C_*`.
- V28 catalogue export: not done (the live artifact's files are over the 4 MB read limit). V28 art packs `assets/pack/art0–8.json` remain the source for card art.
