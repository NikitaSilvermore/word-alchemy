"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // <define:process.env>
  var define_process_env_default;
  var init_define_process_env = __esm({
    "<define:process.env>"() {
      define_process_env_default = {};
    }
  });

  // ../engine29/src/cards.js
  var require_cards = __commonJS({
    "../engine29/src/cards.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var T = (id, school, cost, strike, stand, p, extra = {}) => ({ id, school, type: "thing", cost, strike, stand, props: p, deckLegal: true, ...extra });
      var A2 = (id, school, cost, extra) => ({ id, school, type: "action", cost, deckLegal: true, ...extra });
      var S = (id, school, cost, extra) => ({ id, school, type: "spell", cost, deckLegal: true, ...extra });
      var G = (id, school, cost, stand, extra) => ({ id, school, type: "ground", cost, stand, deckLegal: true, ...extra });
      var Q = (id, school, cost, qual, extra) => ({ id, school, type: "quality", cost, qual, deckLegal: true, ...extra });
      var W = (id, school, cost, extra) => ({ id, school, type: "weather", cost, deckLegal: true, ...extra });
      var B2 = (id, school, cost, extra) => ({ id, school, type: "burden", cost, deckLegal: true, ...extra });
      var C = (id, school, cost, category) => ({ id, school, type: "category", cost, category, deckLegal: true });
      var CARDS2 = [
        // Fire
        T("fire.ember", "fire", 1, 1, 2, ["hot", "body"]),
        T("fire.salamander", "fire", 2, 2, 3, ["living", "beast", "body", "hot", "flammable"], { cap: ["bite"], igniteOnHit: true }),
        T("fire.firebird", "fire", 3, 2, 2, ["living", "beast", "bird", "winged", "body", "hot", "flammable"], { kw: ["flying", "swift"], igniteOnHit: true }),
        T("fire.smith", "fire", 3, 3, 3, ["living", "person", "body", "flammable"], { cap: ["crush", "burn"] }),
        G("fire.torch", "fire", 1, 2, { upkeep: "torch" }),
        A2("fire.burn", "fire", 1, { verb: "burn", remote: true }),
        A2("fire.scorch", "fire", 2, { verb: "scorch", remote: true, dmg: 2 }),
        S("fire.kindle", "fire", 1, { spell: "kindle", r: true }),
        G("fire.fire", "fire", 2, 3, { upkeep: "fireGround", reagent: "fire" }),
        S("fire.calcine", "fire", 2, { spell: "calcine", sacrifice: true }),
        G("fire.bellows", "fire", 2, 3, { upkeep: "bellows" }),
        T("fire.naphtha", "fire", 2, 0, 3, ["liquid", "flammable"], { naphtha: true }),
        S("fire.wildfire", "fire", 4, { spell: "wildfire" }),
        W("fire.drought", "fire", 2, { weather: "drought" }),
        Q("fire.firebrand", "fire", 1, { props: ["hot"], firebrand: true }, { lawful: true }),
        // Air
        T("air.owl", "air", 2, 2, 2, ["living", "beast", "bird", "winged", "sharp", "body", "flammable"], { kw: ["flying"], revealOnArrive: true }),
        T("air.hawk", "air", 3, 3, 3, ["living", "beast", "bird", "winged", "sharp", "body", "flammable"], { kw: ["flying"] }),
        T("air.swallow", "air", 1, 1, 1, ["living", "beast", "bird", "winged", "body", "flammable"], { kw: ["flying", "swift"] }),
        T("air.crow", "air", 2, 1, 3, ["living", "beast", "bird", "winged", "body", "flammable"], { kw: ["flying"], crowMight: true }),
        T("air.wind", "air", 2, 1, 3, ["body"], { kw: ["flying"], cap: ["blow"] }),
        // wingless flight
        T("air.magpie", "air", 2, 1, 2, ["living", "beast", "bird", "winged", "body", "flammable"], { kw: ["flying"], magpie: true }),
        T("air.herald", "air", 2, 1, 3, ["living", "person", "body", "flammable"], { onArrive: "herald" }),
        G("air.air", "air", 2, 3, { upkeep: "reorder2" }),
        G("air.orrery", "air", 3, 4, { static: "orrery" }),
        Q("air.winged", "air", 1, { props: ["winged"], kw: ["flying"], cap: ["blow"], notHeavy: true }, { lawful: true }),
        Q("air.quick", "air", 2, { kw: ["quick"] }),
        Q("air.resonant", "air", 2, { resonant: true }, { anyTarget: true }),
        A2("air.blow", "air", 2, { verb: "blow", remote: true }),
        W("air.storm", "air", 3, { weather: "storm" }),
        S("air.squall", "air", 4, { spell: "squall" }),
        C("air.birds", "air", 1, "bird"),
        S("air.gasp", "air", 1, { spell: "gasp" }),
        S("air.gust", "air", 2, { spell: "gust", r: true }),
        // Earth
        T("earth.boulder", "earth", 3, 2, 6, ["stone", "body"], { kw: ["heavy", "guard", "bedrock"] }),
        T("earth.stone", "earth", 2, 1, 4, ["stone", "body"], { kw: ["heavy"] }),
        T("earth.lead", "earth", 1, 1, 3, ["metal", "body"], { kw: ["heavy"], ladder: "metal" }),
        T("earth.tin", "earth", 2, 1, 3, ["metal", "body"], { ladder: "metal" }),
        T("earth.copper", "earth", 2, 2, 2, ["metal", "body"], { ladder: "metal" }),
        T("earth.silver", "earth", 3, 2, 4, ["metal", "body"], { kw: ["sacred"], ladder: "metal" }),
        T("earth.gold", "earth", 4, 2, 4, ["metal", "body"], { kw: ["incorruptible"], ladder: "metal", deckLegal: false, ladderOnly: true, upkeep: "gold" }),
        T("earth.clay", "earth", 1, 0, 3, ["clay"]),
        S("earth.transmute", "earth", 2, { spell: "transmute" }),
        G("earth.crucible", "earth", 2, 4, { fusionDiscount: 1 }),
        G("earth.earth", "earth", 2, 3, { upkeep: "earthGround" }),
        G("earth.salt", "earth", 1, 2, { static: "salt" }),
        T("earth.amber", "earth", 2, 0, 3, ["material"], { amber: true }),
        Q("earth.temper", "earth", 2, { stand: 2, rustImmune: true, brittleImmune: true, needsProp: "metal" }),
        Q("earth.leaden", "earth", 1, { kw: ["heavy"], stand: 1, kwRemove: ["flying"] }, { lawful: true, anyTarget: true }),
        Q("earth.fixed", "earth", 2, { kw: ["fixed"] }),
        W("earth.desert", "earth", 2, { weather: "desert" }),
        W("earth.winter", "earth", 2, { weather: "winter" }),
        C("earth.metals", "earth", 1, "metal"),
        T("earth.iron", "earth", 2, 2, 4, ["metal", "body"], { kw: ["heavy"] }),
        T("earth.flint", "earth", 1, 2, 1, ["stone", "sharp", "body"], { cap: ["burn"] }),
        G("earth.tower", "earth", 3, 5, { static: "heavyReach" }),
        S("earth.guard", "earth", 1, { spell: "guard", r: true }),
        A2("earth.crush", "earth", 2, { verb: "crush", bonus: 2 }),
        A2("earth.cut", "earth", 1, { verb: "cut", bonus: 1 }),
        // Life
        T("life.wolf", "life", 2, 2, 3, ["living", "beast", "body", "flammable"], { cap: ["bite"], packBonus: true }),
        T("life.stag", "life", 3, 3, 4, ["living", "beast", "body", "sharp", "flammable"]),
        T("life.hare", "life", 1, 1, 2, ["living", "beast", "body", "flammable"], { kw: ["swift"] }),
        T("life.bramble", "life", 2, 1, 4, ["living", "plant", "body", "flammable"], { kw: ["reach"], cap: ["bind", "sting"], stingBind: true }),
        T("life.aloe", "life", 2, 0, 3, ["living", "plant", "herb"], { cap: ["mend"], upkeep: "aloe" }),
        T("life.apothecary", "life", 3, 2, 3, ["living", "person", "body", "flammable"], { cap: ["mend"], ability: { id: "tend", cost: 1 } }),
        A2("life.bite", "life", 1, { verb: "bite", bonus: 1 }),
        A2("life.mend", "life", 1, { verb: "mend", remote: true, r: true }),
        T("life.seed", "life", 1, 0, 2, ["living", "plant", "flammable"], { ladder: "plant" }),
        T("life.sapling", "life", 2, 1, 3, ["living", "plant", "tree", "body", "flammable"], { ladder: "plant" }),
        T("life.oak", "life", 4, 3, 6, ["living", "plant", "tree", "body", "flammable"], { kw: ["heavy"] }),
        T("life.willow", "life", 3, 1, 5, ["living", "plant", "tree", "herb", "body", "flammable"], { cap: ["mend"], ability: { id: "heal2", cost: 1 } }),
        S("life.grow", "life", 1, { spell: "grow" }),
        T("life.scarab", "life", 2, 1, 2, ["living", "beast", "insect", "body"], { kw: ["sacred", "recurrent"] }),
        T("life.pear", "life", 2, 1, 3, ["living", "plant", "tree", "orchard", "flower", "body", "flammable"], { pear: true }),
        T("life.rose", "life", 2, 1, 3, ["living", "plant", "flower", "body", "flammable"], { kw: ["reach"], cap: ["sting"], onArrive: "rose" }),
        T("life.saffron", "life", 2, 0, 2, ["living", "plant", "flower", "herb"], { saffron: true }),
        T("life.ivy", "life", 2, 1, 3, ["living", "plant", "body", "flammable"], { kw: ["reach"], cap: ["bind"] }),
        S("life.graft", "life", 2, { spell: "graft" }),
        S("life.abundance", "life", 3, { spell: "abundance" }),
        W("life.spring", "life", 2, { weather: "spring" }),
        W("life.harvest", "life", 2, { weather: "harvest" }),
        A2("life.bind", "life", 1, { verb: "bind", r: true }),
        S("life.tame", "life", 3, { spell: "tame" }),
        Q("life.thorny", "life", 1, { kw: ["reach"], cap: ["sting"] }, { lawful: true }),
        Q("life.feral", "life", 1, { strike: 1, cap: ["bite"] }, { lawful: true }),
        C("life.beasts", "life", 1, "beast"),
        C("life.plants", "life", 1, "plant"),
        // Water
        T("water.eel", "water", 1, 1, 2, ["living", "beast", "seaborn", "body"]),
        T("water.otter", "water", 2, 2, 3, ["living", "beast", "seaborn", "body", "flammable"], { kw: ["swift"], cap: ["bite"] }),
        T("water.pike", "water", 3, 3, 4, ["living", "beast", "seaborn", "body"], { cap: ["bite"] }),
        T("water.ice", "water", 2, 0, 4, [], { kw: ["heavy", "guard"], wetAttacker: true }),
        A2("water.seep", "water", 1, { verb: "seep", remote: true, dmg: 2 }),
        S("water.tonic", "water", 2, { spell: "tonic", potion: true }),
        G("water.water", "water", 2, 3, { upkeep: "waterGround", reagent: "water" }),
        G("water.flask", "water", 1, 2, { potionBonus: true }),
        T("water.vitriol", "water", 2, 1, 3, ["liquid", "body"], { cap: ["dissolve"], ability: { id: "etch", cost: 2 } }),
        T("water.quicksilver", "water", 1, 0, 2, ["liquid", "metal"], { kw: ["incorruptible"] }),
        A2("water.wash", "water", 2, { verb: "wash", remote: true }),
        S("water.memory", "water", 2, { spell: "memory", seal: true }),
        W("water.rain", "water", 2, { weather: "rain" }),
        S("water.tide", "water", 4, { spell: "tide" }),
        A2("water.dissolve", "water", 2, { verb: "dissolve", remote: true }),
        S("water.dew", "water", 1, { spell: "dew", r: true }),
        A2("water.drench", "water", 1, { verb: "drench", remote: true, r: true }),
        S("water.frozen", "water", 2, { spell: "frozen", r: true }),
        S("water.thaw", "water", 1, { spell: "thaw", r: true }),
        S("water.sleep", "water", 2, { spell: "sleep", r: true }),
        // Rot
        T("rot.rat", "rot", 1, 1, 2, ["living", "beast", "body", "flammable"], { onDeath: "poison1" }),
        T("rot.adder", "rot", 2, 2, 2, ["living", "beast", "serpent", "body"], { kw: ["venomous"], cap: ["bite"] }),
        T("rot.spider", "rot", 2, 2, 2, ["living", "beast", "body"], { kw: ["venomous"], cap: ["bite", "bind"] }),
        T("rot.leech", "rot", 2, 1, 3, ["living", "beast", "seaborn", "body"], { cap: ["bite"], leech: true }),
        T("rot.yew", "rot", 3, 1, 4, ["living", "plant", "tree", "toxic", "body", "flammable"], { onDeath: "poison1" }),
        T("rot.wormwood", "rot", 2, 0, 3, ["living", "plant", "herb", "toxic"], { upkeep: "wormwood" }),
        A2("rot.poison", "rot", 1, { verb: "poison", remote: true }),
        G("rot.barrow", "rot", 2, 3, { carrionOnDeath: true }),
        T("rot.spore", "rot", 1, 0, 1, ["living", "fungus"], { kw: ["flying"], onDeath: "poison1" }),
        T("rot.toadstool", "rot", 1, 0, 2, ["living", "fungus", "toxic"], { onSacrifice: "poison1" }),
        T("rot.ghost", "rot", 3, 2, 3, ["spirit", "dark", "body"], { kw: ["flying"], cap: ["haunt"] }),
        T("rot.shadow", "rot", 2, 1, 2, ["spirit", "dark", "body"], { cap: ["haunt"], onArrive: "concealed" }),
        S("rot.decay", "rot", 2, { spell: "decay", sacrifice: true }),
        S("rot.rust", "rot", 2, { spell: "rust" }),
        S("rot.wither", "rot", 2, { spell: "wither" }),
        A2("rot.haunt", "rot", 2, { verb: "haunt", remote: true }),
        S("rot.exhume", "rot", 3, { spell: "exhume", seal: true }),
        S("rot.miasma", "rot", 3, { spell: "miasma" }),
        W("rot.night", "rot", 2, { weather: "night" }),
        Q("rot.venomous", "rot", 2, { kw: ["venomous"] }, { lawful: true, anyTarget: true }),
        B2("rot.debt", "rot", 2, { burden: "debt" }),
        Q("rot.feeble", "rot", 1, { strike: -1 }, { enemyTarget: true }),
        // The Word
        T("word.word", "word", 1, 0, 3, ["body"], { mightOnSentence: true }),
        T("word.familiar", "word", 2, 1, 2, ["living", "beast", "body", "flammable"], { fusionDiscount: 1 }),
        S("word.separate", "word", 2, { spell: "separate" }),
        T("word.scribe", "word", 2, 1, 3, ["living", "person", "body", "speaker", "flammable"], { onArrive: "reorder2" }),
        T("word.bard", "word", 3, 2, 3, ["living", "person", "body", "speaker", "flammable"], { bard: true }),
        T("word.hermit", "word", 2, 1, 3, ["living", "person", "body", "speaker", "flammable"], { onArrive: "concealed" }),
        G("word.grimoire", "word", 2, 2, { onArrive: "draw1", upkeep: "reorder2" }),
        G("word.ink", "word", 2, 3, { upkeep: "ink" }),
        S("word.omen", "word", 1, { spell: "omen" }),
        S("word.name", "word", 1, { spell: "name" }),
        S("word.measure", "word", 2, { spell: "measure" }),
        S("word.dispel", "word", 2, { spell: "dispel", r: true }),
        S("word.echo", "word", 2, { spell: "echo", seal: true }),
        S("word.silence", "word", 3, { spell: "silence" }),
        S("word.scream", "word", 2, { spell: "scream", voiced: true }),
        S("word.reckoning", "word", 4, { spell: "reckoning" }),
        S("word.be", "word", 2, { spell: "be", lawOnly: true }),
        S("word.awaken", "word", 2, { spell: "awaken" }),
        S("word.summon", "word", 4, { spell: "summon" }),
        S("word.loan", "word", 1, { spell: "loan" }),
        S("word.gnosis", "word", 3, { spell: "gnosis" }),
        S("word.protect", "word", 1, { spell: "protect", r: true }),
        S("word.doubt", "word", 2, { spell: "doubt", r: true })
      ];
      var TK = (id, school, strike, stand, props, extra = {}) => ({ id, school, type: "thing", cost: 0, strike, stand, props, token: true, deckLegal: false, market: false, ...extra });
      var TOKENS = [
        TK("token.ash", "fire", 0, 1, ["material"]),
        TK("token.fruit", "life", 0, 1, ["food"], { ability: { id: "eatFruit", cost: 1, sacrificeSelf: true } }),
        TK("token.blossom", "life", 0, 1, ["living", "plant", "flower"]),
        TK("token.carrion", "rot", 0, 2, ["organic"])
      ];
      var MD = (id, schools, strike, stand, props, extra = {}) => ({ id, school: schools[0], schools, type: "thing", cost: 0, strike, stand, props, made: true, deckLegal: false, market: false, ...extra });
      var MADE = [
        MD("made.energy", ["fire", "air"], 0, 3, [], { upkeep: "energy" }),
        MD("made.steam", ["fire", "water"], 1, 2, ["body"], { cap: ["seep"], wetOnHit: true, lifespan: 2 }),
        MD("made.swamp", ["earth", "water"], 1, 4, ["liquid", "body"]),
        MD("made.golem", ["earth", "word"], 3, 5, ["clay", "stone", "body"], { kw: ["heavy", "guard"] }),
        MD("made.homunculus", ["water", "word"], 2, 3, ["living", "person", "speaker", "body"], { onMade: "seekSpell" }),
        MD("made.phoenix", ["fire"], 4, 4, ["living", "beast", "bird", "winged", "hot", "body"], { kw: ["flying", "final"], rebirth: true }),
        MD("made.alkahest", ["water"], 0, 3, ["liquid"], { kw: ["final"], ability: { id: "alkahest", cost: 1, sacrificeSelf: true } }),
        MD("made.ouroboros", ["rot", "life"], 3, 4, ["living", "beast", "serpent", "body"], { kw: ["venomous", "final"], cap: ["bite"], ouroboros: true }),
        MD("made.life", ["life", "earth", "water"], 0, 4, ["living"], { upkeep: "lifeHeal" }),
        MD("made.world_tree", ["life", "earth", "water"], 2, 7, ["living", "plant", "tree", "body"], { kw: ["guard", "final"], upkeep: "worldTree" }),
        MD("made.quintessence", ["fire", "air", "earth", "water"], 2, 4, ["body"]),
        MD("made.philosophers_stone", ["earth", "word", "fire", "air", "water"], 3, 6, ["stone", "metal", "body"], { kw: ["final"], upkeep: "stone" })
      ];
      var FX = (o, module2) => ({ ...o, deckLegal: false, market: false, folio: module2 });
      var FOLIO = [
        FX(T("life.bee", "life", 1, 1, 2, ["living", "beast", "insect", "body", "winged", "flammable"], { kw: ["flying"], carrier: "insect" }), "orchard"),
        FX(T("life.hazel", "life", 2, 0, 4, ["living", "plant", "tree", "orchard", "flower", "flammable"], { pollination: "wind" }), "orchard"),
        FX(S("life.feast", "life", 2, { spell: "feast" }), "orchard"),
        FX(S("earth.shape", "earth", 2, { spell: "shape" }), "workshop"),
        FX(T("earth.garnet", "earth", 1, 0, 3, ["stone", "jewel", "settable"]), "workshop"),
        FX(S("word.writ", "word", 3, { spell: "writ" }), "workshop"),
        FX(T("rot.mould", "rot", 1, 0, 2, ["living", "fungus", "decomposer"], { ability: { id: "mould", cost: 1 } }), "decay")
      ];
      var FOLIO_FORMS = [
        { id: "earth.setting", school: "earth", type: "thing", cost: 0, strike: 0, stand: 3, props: ["metal", "socket"], deckLegal: false, market: false, folio: "workshop", ladderOnly: true, transformedOnly: true },
        MD("made.signet", ["earth"], 0, 4, ["metal", "artefact", "instrument"], { folio: "workshop", ability: { id: "signet", cost: 1 } })
      ];
      var THREE = [
        FX(T("life.apple", "life", 3, 1, 4, ["living", "plant", "tree", "flower", "orchard", "body", "flammable"], { pollination: "insect", appleArrive: true }), "three"),
        FX(T("fire.tinder", "fire", 1, 0, 1, ["flammable"], { ability: { id: "tinder", cost: 1, sacrificeSelf: true } }), "three"),
        FX(T("earth.hammer", "earth", 3, 2, 3, ["metal", "body", "tool"], { cap: ["crush"], ability: { id: "hammer", cost: 1 } }), "three"),
        FX(S("life.graft3", "life", 2, { spell: "graft3", name: "Graft" }), "three"),
        FX(S("earth.shape3", "earth", 2, { spell: "shape3", name: "Shape" }), "three"),
        FX(S("word.writ3", "word", 3, { spell: "writ3", name: "Writ" }), "three")
      ];
      var THREE_FORMS = [
        { id: "earth.signet3", name: "Signet", school: "earth", type: "thing", cost: 0, strike: 0, stand: 4, props: ["metal", "instrument"], deckLegal: false, market: false, folio: "three", ladderOnly: true, transformedOnly: true, ability: { id: "seal", cost: 1 } },
        MD("made.espalier", ["life"], 3, 5, ["living", "plant", "tree", "orchard", "flammable", "body"], { folio: "three", kw: ["reach"], cap: ["bind"], upkeep: "espalier" }),
        MD("made.golem3", ["earth", "word"], 4, 5, ["clay", "stone", "body"], { folio: "three", name: "Golem", kw: ["heavy", "guard", "reach"], golemSpill: true })
      ];
      var OVERLAYS = { orchard: { "life.pear": { pollination: "insect" }, "air.wind": { carrier: "wind" } }, workshop: { "fire.smith": { ability: { id: "shapeWork", cost: 2 } } } };
      for (const patch of String(define_process_env_default.WA_PATCH || "").split(",").filter(Boolean)) {
        const f = patch.match(/^([a-z_]+):([a-z]+)=(\d+)$/);
        if (f) {
          const c2 = CARDS2.find((x) => x.id.split(".")[1] === f[1]);
          if (c2) c2[f[2]] = +f[3];
          continue;
        }
        const m = patch.match(/^([a-z_]+?)(\d+)$/);
        if (!m) continue;
        const c = CARDS2.find((x) => x.id.split(".")[1] === m[1]);
        if (c) c.cost = +m[2];
      }
      var BY_ID2 = Object.fromEntries(CARDS2.concat(TOKENS, MADE, FOLIO, FOLIO_FORMS, THREE, THREE_FORMS).map((c) => [c.id, c]));
      function capabilities(card, kws) {
        const p = card.props || [], c = new Set(card.cap || []);
        if (p.includes("body")) c.add("strike");
        if (kws.has("heavy")) c.add("crush");
        if (p.includes("sharp")) c.add("cut");
        if (p.includes("hot")) {
          c.add("burn");
          c.add("scorch");
        }
        if (p.includes("seaborn") || p.includes("liquid")) {
          c.add("seep");
          c.add("drench");
          c.add("wash");
        }
        if (p.includes("winged")) c.add("blow");
        if (p.includes("spirit") || p.includes("dark")) c.add("haunt");
        if (p.includes("toxic") || kws.has("venomous")) c.add("poison");
        return c;
      }
      function validateRegistry() {
        const errs = [];
        for (const c of CARDS2) {
          if (!/^(fire|water|air|earth|life|rot|word)\.[a-z_]+$/.test(c.id)) errs.push("bad id " + c.id);
          if (c.ladderOnly && c.deckLegal) errs.push("ladder-only form is deck-legal " + c.id);
          if (c.type === "ground" && !Number.isInteger(c.stand)) errs.push("ground stand " + c.id);
          if (c.type === "quality" && !c.qual) errs.push("quality def " + c.id);
          if (c.disabled && c.deckLegal) errs.push("disabled word is deck-legal " + c.id);
          if (c.id.split(".")[0] !== c.school) errs.push("school mismatch " + c.id);
          if (!Number.isInteger(c.cost) || c.cost < 1) errs.push("cost " + c.id);
          if (c.type === "thing" && !(Number.isInteger(c.strike) && Number.isInteger(c.stand))) errs.push("stats " + c.id);
        }
        for (const c of TOKENS.concat(MADE)) if (c.deckLegal || !Number.isInteger(c.strike) || !Number.isInteger(c.stand)) errs.push("template " + c.id);
        return errs;
      }
      module.exports = { THREE, THREE_FORMS, CARDS: CARDS2, TOKENS, MADE, FOLIO, FOLIO_FORMS, OVERLAYS, BY_ID: BY_ID2, capabilities, validateRegistry };
    }
  });

  // ../engine29/src/recipes.js
  var require_recipes = __commonJS({
    "../engine29/src/recipes.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var { BY_ID: BY_ID2, CARDS: CARDS2 } = require_cards();
      var OPPOSED = [["fire", "water"], ["air", "earth"], ["life", "rot"]];
      var NAMED = [
        { id: "energy", out: "made.energy", cost: 2, a: { thing: true, form: "fire.ember" }, b: { thing: true, form: "air.wind" } },
        { id: "steam", out: "made.steam", cost: 2, a: { thing: true, form: "fire.ember" }, b: { ground: true, form: "water.water" } },
        { id: "swamp", out: "made.swamp", cost: 2, a: { thing: true, form: "earth.clay" }, b: { ground: true, form: "water.water" } },
        { id: "golem", out: "made.golem", cost: 2, a: { thing: true, form: "earth.clay" }, b: { thing: true, form: "word.word" } },
        { id: "homunculus", out: "made.homunculus", cost: 3, a: { ground: true, form: "water.flask" }, b: { thing: true, form: "word.word" } },
        { id: "phoenix", out: "made.phoenix", cost: 3, a: { thing: true, form: "fire.firebird" }, b: { token: true, form: "token.ash" } },
        { id: "alkahest", out: "made.alkahest", cost: 3, a: { thing: true, form: "water.vitriol" }, b: { thing: true, form: "water.quicksilver" } },
        { id: "ouroboros", out: "made.ouroboros", cost: 3, a: { thing: true, form: "rot.adder" }, b: { thing: true, form: "life.scarab" } },
        { id: "life", out: "made.life", cost: 3, a: { thing: true, form: "life.seed" }, b: { thing: true, form: "made.swamp" } },
        { id: "world_tree", out: "made.world_tree", cost: 4, a: { thing: true, form: "life.oak" }, b: { thing: true, form: "made.life" } },
        { id: "quintessence", out: "made.quintessence", cost: 4, a: { thing: true, form: "made.energy" }, b: { thing: true, form: "made.swamp" } },
        { id: "philosophers_stone", out: "made.philosophers_stone", cost: 5, a: { thing: true, form: "earth.gold" }, b: { thing: true, form: "made.quintessence" } }
      ];
      var LIVING_BEAST = { thing: true, props: ["living", "beast"], host: true };
      var INFUSIONS = [
        { id: "fireborn", cost: 2, a: LIVING_BEAST, b: { ground: true, form: "fire.fire" }, mod: { strike: 1, stand: 1, props: ["hot"], igniteOnHit: true }, school: "fire" },
        { id: "winged", cost: 2, a: LIVING_BEAST, b: { thing: true, form: "air.wind" }, mod: { stand: 1, props: ["winged"], kw: ["flying"] }, school: "air", forbidKw: ["heavy"] },
        { id: "seaborn", cost: 2, a: LIVING_BEAST, b: { ground: true, form: "water.water" }, mod: { stand: 1, props: ["seaborn"] }, school: "water", forbidProps: ["seaborn"] },
        { id: "stonebound", cost: 2, a: LIVING_BEAST, b: { thing: true, props: ["stone"] }, mod: { stand: 2, kw: ["heavy"], kwRemove: ["flying"] }, school: "earth" }
      ];
      var MAX_INFUSIONS = 2;
      function opposedAcross(sa, sb) {
        return OPPOSED.some(([x, y]) => sa.includes(x) && sb.includes(y) || sa.includes(y) && sb.includes(x));
      }
      var LADDERS = {
        "earth.tin": ["earth.lead"],
        "earth.copper": ["earth.lead"],
        "earth.silver": ["earth.tin", "earth.copper"],
        "earth.gold": ["earth.silver"],
        "life.sapling": ["life.seed"],
        "life.oak": ["life.sapling"],
        "life.willow": ["life.sapling"]
      };
      var TOKEN_CREATORS = { "token.ash": ["fire.calcine"], "token.carrion": ["rot.barrow"], "token.fruit": [], "token.blossom": [] };
      function reachability() {
        const memo = {};
        const ok = (form, path = []) => {
          if (memo[form] !== void 0) return memo[form];
          if (path.includes(form)) return false;
          const c = BY_ID2[form];
          let r = false, how = null;
          if (!c) r = false;
          else if (c.deckLegal) {
            r = true;
            how = "deck";
          } else if (c.token) {
            const cr = TOKEN_CREATORS[form] || [];
            r = cr.some((x) => BY_ID2[x] && BY_ID2[x].deckLegal);
            how = "token via " + cr.join("/");
          } else if (LADDERS[form]) {
            r = LADDERS[form].some((f) => ok(f, path.concat(form)));
            how = "ladder";
          }
          if (!r && c && c.made) {
            const rec = NAMED.find((x) => x.out === form);
            r = !!rec && ok(rec.a.form, path.concat(form)) && ok(rec.b.form, path.concat(form));
            how = "recipe";
          }
          memo[form] = r;
          return r;
        };
        return NAMED.map((r) => ({ recipe: r.id, a: r.a.form, b: r.b.form, reachable: ok(r.a.form) && ok(r.b.form), output: r.out, oneGround: !(r.a.ground && r.b.ground) }));
      }
      function validateRecipes() {
        const errs = [];
        for (const r of NAMED) {
          for (const k of ["a", "b"]) if (!BY_ID2[r[k].form]) errs.push(`${r.id}: unknown ingredient ${r[k].form}`);
          if (!BY_ID2[r.out] || !BY_ID2[r.out].made) errs.push(`${r.id}: output not a made form`);
          if (r.cost < 2) errs.push(`${r.id}: price below 2`);
          if (r.a.ground && r.b.ground) errs.push(`${r.id}: two Grounds cannot coexist`);
        }
        for (const x of reachability()) if (!x.reachable) errs.push(`${x.recipe}: unreachable`);
        return errs;
      }
      module.exports = { NAMED, INFUSIONS, OPPOSED, MAX_INFUSIONS, LADDERS, opposedAcross, reachability, validateRecipes };
    }
  });

  // ../engine29/src/engine.js
  var require_engine = __commonJS({
    "../engine29/src/engine.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var { BY_ID: BY_ID2, capabilities, OVERLAYS } = require_cards();
      var R2 = require_recipes();
      var FORMAT = {
        id: "grammar_v29_test",
        life: 30,
        deckSize: 20,
        openingHand: 5,
        handCap: 7,
        slots: 5,
        breathCap: 8,
        extraBreathCap: 2,
        poolCap: 10,
        reserveCap: 2,
        secondPlayerReserve: 1,
        roundCap: 15,
        poisonCap: 3,
        bedrockCap: 2,
        growthCap: 3,
        mightCap: 2,
        qualityCap: 2,
        sparkCap: 5,
        catalystCap: 1,
        catalystPrice: 2,
        ownPrice: 2,
        offPrice: 3,
        offSchoolBuysPerDuel: 1,
        copyLimit: 2,
        marketOrigins: ["A", "A", "B", "B", "X"],
        marketRefreshRounds: [3, 6, 9, 12, 15]
      };
      if (define_process_env_default.WA_ECON === "price3") {
        FORMAT.ownPrice = 3;
        FORMAT.offPrice = 4;
      }
      var NO_SENTENCE_SPARK = define_process_env_default.WA_ECON === "nosentence";
      var MKT = define_process_env_default.WA_MKT || "";
      if (MKT === "norefresh") FORMAT.marketRefreshRounds = [];
      var INITIATIVE = {
        spec: { p2Reserve: 1 },
        none: { p2Reserve: 0 },
        reserve2: { p2Reserve: 2 },
        card: { p2Reserve: 1, p2ExtraCard: 1 },
        breath: { p2Reserve: 1, p2FirstTurnBreath: 1 },
        spark: { p2Reserve: 1, p2Spark: 2 },
        // stage H candidates
        p1slow: { p2Reserve: 1, p1FirstTurnBreath: -1 },
        // starting player's first turn has 2 breath, not 3
        p1hand4: { p2Reserve: 1, p1HandMinus: 1 },
        // starting player opens with 4 words
        breath2: { p2Reserve: 1, p2FirstTurnBreath: 2 },
        combo: { p2Reserve: 1, p2FirstTurnBreath: 1, p1FirstTurnBreath: -1 },
        combo2: { p2Reserve: 1, p2FirstTurnBreath: 2, p1FirstTurnBreath: -1 }
      };
      var DECIDERS = /* @__PURE__ */ new WeakMap();
      function setDecider(S, fn) {
        DECIDERS.set(S, fn);
      }
      function decide(S, side, kind, options, dflt = 0) {
        if (!options.length) return -1;
        const fn = DECIDERS.get(S);
        let k = fn ? fn(S, side, kind, options, dflt) : dflt;
        if (!Number.isInteger(k) || k < 0 || k >= options.length) k = dflt;
        event(S, "decision", { side, kind, n: options.length, k });
        return k;
      }
      function rng(seed) {
        let a = seed >>> 0;
        return () => {
          a = a + 1831565813 | 0;
          let t = Math.imul(a ^ a >>> 15, 1 | a);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }
      function shuffle(arr, r) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(r() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
      function deckErrors(deck, modules = []) {
        const e = [];
        if (deck.length !== FORMAT.deckSize) e.push("deck must have " + FORMAT.deckSize + " words");
        if (new Set(deck).size !== deck.length) e.push("words must be distinct");
        const sch = /* @__PURE__ */ new Set();
        for (const id of deck) {
          const c = BY_ID2[id];
          if (!c) {
            e.push("unknown " + id);
            continue;
          }
          if (!c.deckLegal && !(c.folio && !c.transformedOnly && !c.made && modules.includes(c.folio))) e.push("not deck-legal " + id);
          sch.add(c.school);
        }
        if (sch.size < 1 || sch.size > 3) e.push("1\u20133 schools");
        return e;
      }
      function mainSchool(deck) {
        const n = {};
        for (const id of deck) {
          const s = BY_ID2[id].school;
          n[s] = (n[s] || 0) + 1;
        }
        return Object.entries(n).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
      }
      function createMatch({ decks, seed = 1, arithmetic = "v29", first = null, reserve = true, market = true, initiative = "spec", mulligan = null, marketBreath = 0, variant = {} }) {
        decks.forEach((d, i) => {
          const e = deckErrors(d, variant.modules || []);
          if (e.length) throw new Error("deck " + i + ": " + e.join("; "));
        });
        const r = rng(seed);
        let nextId = 1;
        const S = {
          format: FORMAT.id,
          arithmetic,
          seed,
          turn: 0,
          round: 0,
          active: 0,
          over: null,
          seq: 0,
          ev: 0,
          rules: {
            reserve,
            market,
            initiative,
            marketBreath,
            freeStrike: !!variant.freeStrike,
            draws: variant.draws || 1,
            // V30 experiment levers (defaults = rc1 reference)
            priceOwn: variant.priceOwn || FORMAT.ownPrice,
            priceOff: variant.priceOff || FORMAT.offPrice,
            sentenceSpark: variant.sentenceSpark !== false,
            incomeEvery: variant.incomeEvery || 1,
            buyEvery: variant.buyEvery || 1,
            reserveCap: variant.reserveCap || FORMAT.reserveCap,
            responseDiscount: variant.responseDiscount || null,
            modules: (variant.modules || []).slice(),
            costOverride: variant.costOverride || null
          },
          mseed: (seed ^ 1540483477) >>> 0,
          market: [],
          rand: r,
          log: [],
          events: [],
          hashes: [],
          clause: null,
          registry: {},
          flags: {},
          players: decks.map((d, i) => ({
            i,
            life: FORMAT.life,
            breath: 0,
            reserve: 0,
            extraBreath: 0,
            personalTurn: 0,
            fatigue: 0,
            poison: 0,
            spark: 0,
            catalyst: 1,
            sentenceSpark: false,
            abilitySpark: false,
            bought: false,
            offSchoolBought: 0,
            discountUsed: 0,
            schools: [...new Set(d.map((w) => BY_ID2[w].school))].sort(),
            fusedTurn: 0,
            phoenixUsed: false,
            ouroUsed: false,
            barrowTurn: 0,
            potionTurn: 0,
            acquired: Object.fromEntries(d.map((w) => [w, 1])),
            mulliganed: false,
            deck: shuffle(d.map((w) => ({ pid: "c" + i + "_" + nextId++, word: w, owner: i })), r),
            hand: [],
            grave: [],
            sealed: [],
            ground: null,
            main: mainSchool(d),
            usedVerbs: {},
            leechUsed: false
          })),
          things: [],
          // field instances
          stats: { res: [0, 1].map(() => ({ breathSpent: 0, breathWasted: 0, reserveKept: 0, reserveUsed: 0, sparkGained: 0, sparkSpent: 0, drawn: 0, bought: 0, played: {}, lifeLost: {}, healed: 0 })), packets: [], firstLethalRound: null, responses: 0, answers: 0, failed: 0, cancelled: 0, made: {}, fusions: 0, transforms: 0, tokens: 0 }
        };
        for (const p of S.players) for (const c of p.deck) S.registry[c.pid] = true;
        S.active = first != null ? first : r() < 0.5 ? 0 : 1;
        S.first = S.active;
        const ini = INITIATIVE[initiative], p2 = S.players[1 - S.first];
        if (reserve) p2.reserve = ini.p2Reserve;
        for (const p of S.players) for (let k = 0; k < FORMAT.openingHand + (p === p2 ? ini.p2ExtraCard || 0 : -(ini.p1HandMinus || 0)); k++) p.hand.push(p.deck.shift());
        if (ini.p2Spark) p2.spark = ini.p2Spark;
        for (const i of [S.first, 1 - S.first]) applyMulligan(S, i, mulligan ? mulligan(S, i) : []);
        if (market) for (let k = 0; k < FORMAT.marketOrigins.length; k++) S.market.push(newOffer(S, k));
        startTurn(S);
        return S;
      }
      function applyMulligan(S, i, pids) {
        const p = S.players[i];
        if (p.mulliganed) throw new Error("one mulligan only");
        p.mulliganed = true;
        if (!pids || !pids.length) {
          event(S, "mulligan", { side: i, n: 0 });
          return;
        }
        const aside = pids.map((pid) => takeCard(p, pid));
        for (let k = 0; k < aside.length; k++) p.hand.push(p.deck.shift());
        p.deck = shuffle(p.deck.concat(aside), S.rand);
        event(S, "mulligan", { side: i, n: aside.length });
      }
      function mnext(S) {
        if (S.mseed == null) throw new Error("market RNG is not visible to this view");
        S.mseed = S.mseed + 1831565813 >>> 0;
        let t = S.mseed;
        t = Math.imul(t ^ t >>> 15, 1 | t);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      }
      var ALL_SCHOOLS = ["air", "earth", "fire", "life", "rot", "water", "word"];
      function marketPool(school) {
        return Object.values(BY_ID2).filter((c) => c.deckLegal && c.school === school && c.market !== false).map((c) => c.id).sort();
      }
      function newOffer(S, k) {
        const origin = FORMAT.marketOrigins[k];
        const A2 = S.players[S.first].schools, Bs = S.players[1 - S.first].schools;
        let schools = origin === "A" ? A2 : origin === "B" ? Bs : ALL_SCHOOLS.filter((x) => !A2.includes(x) && !Bs.includes(x));
        if (!schools.length) schools = ALL_SCHOOLS;
        const shown = new Set(S.market.filter(Boolean).map((o) => o.word));
        const order = schools.slice();
        while (order.length) {
          const sc = order.splice(Math.floor(mnext(S) * order.length), 1)[0];
          const pool = marketPool(sc).filter((w) => !shown.has(w));
          if (pool.length) return { slot: k, origin, word: pool[Math.floor(mnext(S) * pool.length)] };
        }
        return null;
      }
      function marketStep(S) {
        const p = S.players[S.active];
        if ((p.personalTurn - 1) % S.rules.incomeEvery === 0) gainSpark(S, p, "income");
        if (!S.rules.market) return;
        const refresh = (MKT === "p2refresh" ? S.active !== S.first : S.active === S.first) && FORMAT.marketRefreshRounds.includes(S.round);
        for (let k = 0; k < S.market.length; k++) if (refresh || !S.market[k]) {
          S.market[k] = null;
          S.market[k] = newOffer(S, k);
        }
        event(S, "market", { refresh, offers: S.market.map((o) => o && o.word) });
      }
      function priceOf(S, side, word) {
        return S.players[side].schools.includes(BY_ID2[word].school) ? S.rules.priceOwn : S.rules.priceOff;
      }
      function sparkFor(S, n) {
        const p = S.players[n.side];
        if (NO_SENTENCE_SPARK || !S.rules.sentenceSpark || n.side !== S.active || n.kind === "response" || !n.cardUsed || n.noEffect || n.noSpark || p.sentenceSpark) return;
        p.sentenceSpark = true;
        gainSpark(S, p, "sentence");
      }
      function mightFor(S, n) {
        const p = S.players[n.side];
        if (n.side !== S.active || n.kind === "response" || !n.cardUsed || n.noEffect) return;
        for (const t of S.things) if (t.ctrl === n.side && card(t).mightOnSentence && t.pid !== n.cardPid && t.mightTurn !== p.personalTurn) {
          t.mightTurn = p.personalTurn;
          t.counters.might = Math.min(FORMAT.mightCap, (t.counters.might || 0) + 1);
        }
      }
      var say = (S, x) => {
        S.log.push(x);
      };
      var event = (S, type, o = {}) => {
        S.events.push({ n: ++S.ev, turn: S.turn, type, ...o });
      };
      var HIDDEN = { id: "?", type: "hidden", cost: 0, strike: 1, stand: 3, props: ["body"], kw: [] };
      var card = (c) => BY_ID2[c.form || c.word] || HIDDEN;
      var MOD0 = { strike: 0, stand: 0, props: [], kw: [], kwRemove: [], cap: [], infusions: [], schools: [] };
      function qualityDefs(t) {
        const q = (t.quals || []).map((a) => BY_ID2[a.word].qual);
        if (t.lawQual && !(t.quals || []).some((a) => a.word === t.lawQual)) q.push(BY_ID2[t.lawQual].qual);
        return q;
      }
      function modsOf(t) {
        const base = t.mods || MOD0, q = qualityDefs(t);
        if (!q.length && !t.extraProps) return base;
        const m = { ...MOD0, ...base, props: base.props.concat(t.extraProps || []), kw: base.kw.slice(), kwRemove: base.kwRemove.slice(), cap: (base.cap || []).slice() };
        for (const d of q) {
          if (d.notHeavy && ((card(t).kw || []).includes("heavy") || m.kw.includes("heavy"))) continue;
          m.strike += d.strike || 0;
          m.stand += d.stand || 0;
          m.props = m.props.concat(d.props || []);
          m.kw = m.kw.concat(d.kw || []);
          m.kwRemove = m.kwRemove.concat(d.kwRemove || []);
          m.cap = m.cap.concat(d.cap || []);
          for (const f of ["firebrand", "resonant", "rustImmune", "brittleImmune"]) if (d[f]) m[f] = true;
        }
        return m;
      }
      function propsOf(t) {
        const m = modsOf(t);
        return m.props.length ? [...new Set((card(t).props || []).concat(m.props))] : card(t).props || [];
      }
      function kws(S, t) {
        const m = modsOf(t);
        const k = new Set((card(t).kw || []).concat(m.kw));
        for (const x of m.kwRemove) k.delete(x);
        if (t.tempGuard) k.add("guard");
        if (t.g3) k.add("reach");
        const g = S.players[t.ctrl].ground;
        if (g && card(g).static === "heavyReach" && k.has("heavy")) k.add("reach");
        if (t.status.wet && prop(t, "winged")) k.delete("flying");
        if (S.sky && card(S.sky).weather === "desert" && prop(t, "winged")) k.delete("flying");
        if (k.has("heavy") && prop(t, "winged") && !(card(t).kw || []).includes("heavy")) k.delete("flying");
        return k;
      }
      var THREE_CAPS = { "life.sapling": ["bind"], "life.willow": ["bind"] };
      function caps(S, t) {
        const m = modsOf(t);
        return capabilities({ ...card(t), props: propsOf(t), cap: (card(t).cap || []).concat(m.cap || [], threeOn(S) && THREE_CAPS[card(t).id] || []) }, kws(S, t));
      }
      function has(S, t, k) {
        return kws(S, t).has(k);
      }
      function prop(t, p) {
        return propsOf(t).includes(p);
      }
      function maxStand(S, t) {
        return card(t).stand + modsOf(t).stand + (t.counters.bedrock || 0) + (t.counters.growth || 0) + (t.tempStand || 0) + (t.g3 ? 2 : 0);
      }
      function curStrike(S, t) {
        let s = card(t).strike + modsOf(t).strike + (t.counters.might || 0) + (t.tempStrike || 0);
        if (card(t).packBonus && S.things.some((o) => o !== t && o.ctrl === t.ctrl && prop(o, "beast"))) s += 1;
        if (S.arithmetic === "legacy") {
          s += t.attuned ? 2 : 0;
          s += (t.counters.bedrock || 0) + (t.tempStand || 0);
        }
        if (t.status.blinded) s -= 2;
        return Math.max(0, s);
      }
      function legacyStand(S, t) {
        return S.arithmetic === "legacy" && t.attuned ? 2 : 0;
      }
      function standOf(S, t) {
        return maxStand(S, t) + legacyStand(S, t);
      }
      function remainingOf(S, t) {
        return standOf(S, t) - t.damage;
      }
      function groundRemaining(g) {
        return card(g).stand - (g.damage || 0);
      }
      function incapacitated(t) {
        return !!(t.status.asleep || t.status.frozen || t.status.bound || t.displaced);
      }
      function addCounter(S, t, k, n = 1) {
        if (t.status.measured && ["growth", "might", "bedrock"].includes(k)) return 0;
        const cap = { growth: FORMAT.growthCap, might: FORMAT.mightCap, bedrock: FORMAT.bedrockCap }[k] || 99;
        const before = t.counters[k] || 0, after = Math.min(cap, before + n);
        t.counters[k] = after;
        if (after > before && k === "growth") growthGained(S, t);
        return after - before;
      }
      function growthGained(S, t) {
        const p = S.players[t.ctrl];
        if (t.ctrl !== S.active || !prop(t, "plant")) return;
        for (const pr of S.things.filter((o) => o !== t && o.ctrl === t.ctrl && card(o).pear)) {
          if (pr.pearTurn === p.personalTurn) continue;
          pr.pearTurn = p.personalTurn;
          if (!S.things.some((o) => o.ctrl === t.ctrl && card(o).id === "token.fruit")) createToken(S, t.ctrl, "token.fruit");
        }
      }
      function gainAbilitySpark(S, p) {
        if (p.abilitySpark) return false;
        p.abilitySpark = true;
        gainSpark(S, p, "ability");
        return true;
      }
      function gainSpark(S, p, why) {
        if (coreOn(S)) return;
        const g = Math.min(FORMAT.sparkCap, p.spark + 1) - p.spark;
        p.spark += g;
        S.stats.res[p.i].sparkGained += g;
        if (why !== "income") event(S, "spark", { side: p.i, why });
      }
      function canIgnite(t) {
        return prop(t, "flammable") && !t.status.wet;
      }
      function ignite(S, t, bySide) {
        if (!t || !(canIgnite(t) || core33(S) && card(t).naphtha && prop(t, "flammable"))) return false;
        t.status.burning = 2;
        event(S, "ignite", { tid: t.id });
        if (bySide != null && bySide === S.active && t.ctrl !== bySide && S.sky && card(S.sky).weather === "drought") {
          const p = S.players[bySide];
          if (p.droughtTurn !== p.personalTurn) {
            p.droughtTurn = p.personalTurn;
            damageThing(S, t, 1);
          }
        }
        if (card(t).naphtha && t.pid && !S.flags[t.pid + ":naphtha"]) {
          S.flags[t.pid + ":naphtha"] = true;
          if (threeOn(S)) {
            const vs = naphthaVictims(S, t);
            for (const o of vs) damageThing(S, o, 3);
            event(S, "flare", { tid: t.id, side: t.ctrl, victims: vs.map((o) => o.id) });
            say(S, `Naphtha flares: 3 to ${vs.map((o) => o.word).join(" and ") || "nothing"}.`);
            if (S.things.includes(t)) destroy(S, t);
            return true;
          }
          for (const o of S.things.filter((o2) => o2.ctrl !== t.ctrl)) damageThing(S, o, 2);
          if (core33(S)) {
            loseLife(S, 1 - t.ctrl, 2, "naphtha");
            event(S, "flare", { tid: t.id, side: t.ctrl });
            say(S, `Naphtha flares: 2 to every enemy Thing and 2 to P${1 - t.ctrl}.`);
          }
          if (S.things.includes(t)) destroy(S, t);
        }
        return true;
      }
      function destroy(S, t) {
        if (rebirthAvailable(S, t)) {
          t.damage = 999;
          return;
        }
        if (leaveField(S, t, "destroyed")) deathTrigger(S, t);
      }
      function takeControl(S, t, side) {
        if (!hasRoom(S, side, card(t).id)) return false;
        t.ctrl = side;
        t.fresh = true;
        exhaust(t);
        t.tempGuard = false;
        event(S, "control", { tid: t.id, side });
        return true;
      }
      function enemy(S, i) {
        return S.players[1 - i];
      }
      function thingById(S, id) {
        return S.things.find((t) => t.id === id);
      }
      function exhaust(t) {
        t.exhausted = true;
        t.tempGuard = false;
      }
      var isR = (d) => !!d.r;
      function toGrave(S, c, reason) {
        const e = { pid: c.pid, word: c.word, owner: c.owner, reason };
        S.players[c.owner].grave.push(e);
        event(S, "grave", { pid: c.pid, reason });
      }
      function newThing(S, side, o) {
        const p = S.players[side];
        const t = { id: "t" + ++S.seq, pid: null, owner: side, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: true, actions: 0, arrivedTurn: p.personalTurn, ...o };
        S.things.push(t);
        return t;
      }
      function createToken(S, side, id) {
        if (!hasRoom(S, side, id)) {
          event(S, "token-failed", { side, id });
          return null;
        }
        const t = newThing(S, side, { word: id, form: id, token: true });
        S.stats.tokens++;
        event(S, "token", { side, id, tid: t.id });
        return t;
      }
      function lineageRecord(o, isGround) {
        if (isGround) return { pid: o.pid, word: o.word, owner: o.owner, ground: true, damage: o.damage || 0 };
        if (o.token) return { token: o.form, owner: o.owner };
        if (o.lineage) return { made: true, word: o.word, form: o.form, mods: o.mods || null, lineage: o.lineage, owner: o.owner };
        return { pid: o.pid, word: o.word, form: o.form || o.word, owner: o.owner };
      }
      function lineagePids(recs, out = []) {
        for (const r of recs || []) {
          if (r.pid) out.push(r);
          if (r.lineage) lineagePids(r.lineage, out);
        }
        return out;
      }
      function release(S, recs, reason, sealed) {
        for (const r of lineagePids(recs)) {
          if (sealed) {
            S.players[r.owner].sealed.push({ pid: r.pid, word: r.word, owner: r.owner });
            event(S, "sealed", { pid: r.pid });
          } else toGrave(S, r, reason);
        }
      }
      function retireQuals(S, t) {
        for (const a of t.quals || []) toGrave(S, a, "retired");
        t.quals = [];
      }
      function leaveField(S, t, how) {
        S.things = S.things.filter((x) => x !== t);
        retireQuals(S, t);
        if (t.token) {
          event(S, "token-gone", { tid: t.id, how });
          return how === "destroyed" || how === "sacrificed";
        }
        if (t.lineage) {
          release(S, t.lineage, how === "bounced" ? "dissolved" : how === "expired" ? "retired" : "released", how === "sealed");
          event(S, "unmade", { tid: t.id, how });
          return how === "destroyed" || how === "sacrificed";
        }
        if (how === "bounced") {
          const o = S.players[t.owner], c = { pid: t.pid, word: t.word, owner: t.owner };
          if (o.hand.length >= FORMAT.handCap) toGrave(S, c, "bounced-full-hand");
          else o.hand.push(c);
          return false;
        }
        if (how === "sealed") {
          S.players[t.owner].sealed.push({ pid: t.pid, word: t.word, owner: t.owner });
          return false;
        }
        toGrave(S, t, how);
        return how === "destroyed" || how === "sacrificed";
      }
      function zoneAudit(S) {
        const seen = {}, errs = [];
        const put = (pid, z) => {
          if (seen[pid]) errs.push(`${pid} in ${seen[pid]} and ${z}`);
          else seen[pid] = z;
        };
        for (const p of S.players) {
          p.deck.forEach((c) => put(c.pid, "deck" + p.i));
          p.hand.forEach((c) => put(c.pid, "hand" + p.i));
          p.grave.forEach((c) => put(c.pid, "grave" + p.i));
          p.sealed.forEach((c) => put(c.pid, "sealed" + p.i));
          if (p.ground) put(p.ground.pid, "ground" + p.i);
          if (p.hand.length > FORMAT.handCap) errs.push("hand over cap P" + p.i);
          if (S.things.filter((t) => t.ctrl === p.i).length > capTotal(S)) errs.push("field over slots P" + p.i);
          if (p.reserve > S.rules.reserveCap) errs.push("reserve over cap P" + p.i);
          if (p.spark > FORMAT.sparkCap || p.spark < 0) errs.push("spark out of range P" + p.i);
          if (p.breath > FORMAT.poolCap) errs.push("pool over cap P" + p.i);
          for (const [w, n] of Object.entries(p.acquired)) if (n > FORMAT.copyLimit) errs.push("copy limit " + w);
        }
        S.things.forEach((t) => {
          if (t.pid) put(t.pid, "field");
          for (const r of lineagePids(t.lineage)) put(r.pid, "lineage");
          for (const a of t.quals || []) put(a.pid, "attached");
        });
        if (S.clause) S.clause.nodes.forEach((n) => {
          if (n.card) put(n.card.pid, "pending");
          for (const c of n.extra || []) put(c.pid, "pending");
        });
        if (S.sky) put(S.sky.pid, "sky");
        if (S.law) S.law.cards.forEach((c) => put(c.pid, "law"));
        for (const p of S.players) if (p.burden) put(p.burden.pid, "burden" + p.i);
        for (const t of S.things) if ((t.quals || []).length > FORMAT.qualityCap) errs.push("too many qualities on " + t.id);
        if (S.market.filter(Boolean).length !== new Set(S.market.filter(Boolean).map((o) => o.word)).size) errs.push("duplicate market offer");
        for (const pid of Object.keys(S.registry)) if (!seen[pid]) errs.push(pid + " missing");
        for (const pid of Object.keys(seen)) if (!S.registry[pid]) errs.push(pid + " unregistered");
        return errs;
      }
      function packet(S, src, base, verb) {
        const steps = [["base strike", base]];
        let n = base;
        if (S.arithmetic === "legacy") {
          const pl = S.players[src.ctrl];
          if (verb === "crush") {
            n = Math.ceil(n * 1.5 - 1e-9);
            steps.push(["crush \xD71.5", n]);
          }
          if (verb === "bite") {
            n = Math.ceil(n * 1.3 * (card(src).school === "life" && prop(src, "beast") ? 1.25 : 1) - 1e-9);
            steps.push(["bite \xD71.3(\xD71.25)", n]);
          }
          if (card(src).school === pl.main) {
            n = Math.round(n * 1.2);
            steps.push(["in tune \xD71.2", n]);
          }
          if (!pl.usedVerbs[verb]) {
            n += 2;
            steps.push(["said first time +2", n]);
          }
        }
        return { n: Math.max(0, n), steps };
      }
      function damageThing(S, t, n, fromResonance) {
        if (n <= 0) return;
        if (t.shield3) {
          const pr = Math.min(n, t.shield3);
          n -= pr;
          delete t.shield3;
          event(S, "shielded", { tid: t.id, prevented: pr });
          if (n <= 0) return;
        }
        t.damage += n;
        if (t.status.asleep) delete t.status.asleep;
        if (!fromResonance && modsOf(t).resonant && t.resonantTurn !== S.turn) {
          t.resonantTurn = S.turn;
          for (const o of S.things.filter((o2) => o2 !== t && o2.word === t.word)) damageThing(S, o, 1, true);
        }
      }
      function heal(S, t, n) {
        const d = Math.min(t.damage, Math.max(0, n));
        t.damage -= d;
        if (d) S.stats.res[t.ctrl].thingHealed = (S.stats.res[t.ctrl].thingHealed || 0) + d;
      }
      function gainLife(S, pi, n, why) {
        const p = S.players[pi], g = Math.max(0, Math.min(FORMAT.life - p.life, n));
        p.life += g;
        if (g) {
          const r = S.stats.res[pi];
          r.healed += g;
          r.healedBy = r.healedBy || {};
          r.healedBy[why] = (r.healedBy[why] || 0) + g;
        }
        return g;
      }
      function loseLife(S, pi, n, why) {
        if (n <= 0) return;
        S.players[pi].life -= n;
        const L = S.stats.res[pi].lifeLost;
        L[why] = (L[why] || 0) + n;
        say(S, `P${pi} loses ${n} life (${why}).`);
      }
      function refreshLaw(S) {
        for (const t of S.things) {
          const L = S.law, base = BY_ID2[t.form || t.word];
          t.lawQual = L && (base.props || []).includes(L.category) && !t.status.named && !(t.quals || []).some((a) => a.word === "earth.fixed") ? L.qual : null;
        }
      }
      function stateCheck(S) {
        refreshLaw(S);
        let changed = true;
        while (changed) {
          changed = false;
          let dead2 = S.things.filter((t) => remainingOf(S, t) <= 0);
          for (const t of dead2.filter((t2) => rebirthAvailable(S, t2))) {
            S.players[t.ctrl].phoenixUsed = true;
            t.damage = 0;
            exhaust(t);
            event(S, "rebirth", { tid: t.id });
            say(S, `${t.word} is reborn.`);
          }
          dead2 = dead2.filter((t) => remainingOf(S, t) <= 0);
          if (dead2.length) {
            changed = true;
            for (const t of dead2) {
              leaveField(S, t, "destroyed");
              say(S, `${t.word} (P${t.ctrl}) is destroyed.`);
            }
            const ordered = dead2.slice().sort((a, b) => (a.ctrl === S.active ? 0 : 1) - (b.ctrl === S.active ? 0 : 1) || a.entry - b.entry || (a.id < b.id ? -1 : 1));
            for (const t of ordered) deathTrigger(S, t);
          }
          for (const p of S.players) if (p.ground && groundRemaining(p.ground) <= 0) {
            changed = true;
            const g = p.ground;
            p.ground = null;
            toGrave(S, g, "destroyed");
            say(S, `${g.word} (P${p.i}) is destroyed.`);
          }
        }
        if (S.processes) checkProcesses(S);
        if (S.rules.modules && S.rules.modules.length) v32StateCheck(S);
        const dead = S.players.filter((p) => p.life <= 0);
        if (dead.length && S.over == null) {
          S.over = dead.length === 2 ? "draw" : 1 - dead[0].i;
          if (S.stats.firstLethalRound == null) S.stats.firstLethalRound = S.round;
        }
      }
      function naphthaVictims(S, t) {
        return S.things.filter((o) => o.ctrl !== t.ctrl && !o.status.concealed).sort((a, b) => a.entry - b.entry).slice(0, 2);
      }
      function rebirthAvailable(S, t) {
        return !!card(t).rebirth && !S.players[t.ctrl].phoenixUsed;
      }
      function recoverFromGrave(S, pid, owner) {
        const p = S.players[owner], k = p.grave.findIndex((g2) => g2.pid === pid);
        if (k < 0 || p.hand.length >= FORMAT.handCap) return false;
        const g = p.grave.splice(k, 1)[0];
        p.hand.push({ pid: g.pid, word: g.word, owner: g.owner });
        event(S, "recover", { pid });
        return true;
      }
      function deathTrigger(S, t, how) {
        event(S, "death", { tid: t.id, ctrl: t.ctrl, made: !!t.lineage, token: !!t.token, how: how || "destroyed" });
        const pc = S.players[t.ctrl];
        if (how === "sacrificed" && card(t).onSacrifice === "poison1") poisonTrigger(S, t);
        if (prop(t, "living")) for (const cr of S.things.filter((o) => card(o).crowMight && o.ctrl === S.active)) {
          const cp = S.players[cr.ctrl];
          if (cr.crowTurn !== cp.personalTurn) {
            cr.crowTurn = cp.personalTurn;
            addCounter(S, cr, "might");
          }
        }
        if (t.pid && !t.lineage && !t.token && prop(t, "living")) {
          const am = S.things.find((o) => o.ctrl === t.ctrl && card(o).amber && o.pid && !S.flags[o.pid + ":amber"]);
          if (am) {
            S.flags[am.pid + ":amber"] = true;
            recoverFromGrave(S, t.pid, t.owner);
            if (leaveField(S, am, "sacrificed")) deathTrigger(S, am, "sacrificed");
          }
        }
        if (t.pid && has(S, t, "recurrent") && !S.flags[t.pid + ":recurrent"]) {
          S.flags[t.pid + ":recurrent"] = true;
          recoverFromGrave(S, t.pid, t.owner);
        }
        if (card(t).ouroboros && !pc.ouroUsed) {
          pc.ouroUsed = true;
          const r = lineagePids(t.lineage).find((x) => S.players[x.owner].grave.some((g) => g.pid === x.pid));
          if (r) recoverFromGrave(S, r.pid, r.owner);
        }
        if (t.pid && !t.lineage && prop(t, "living") && t.ctrl === S.active && pc.ground && card(pc.ground).carrionOnDeath && pc.barrowTurn !== pc.personalTurn) {
          pc.barrowTurn = pc.personalTurn;
          createToken(S, t.ctrl, "token.carrion");
        }
        if (card(t).onDeath === "poison1") poisonTrigger(S, t);
      }
      function poisonTrigger(S, t) {
        const opts = S.things.filter((o) => o.ctrl !== t.ctrl && prop(o, "living") && !o.status.concealed).sort((a, b) => curStrike(S, b) - curStrike(S, a) || a.entry - b.entry);
        const tg = opts[decide(S, t.ctrl, "poisonTarget", opts.map((o) => o.id))];
        event(S, "trigger", { source: t.id, ctrl: t.ctrl, what: "poison1", target: tg ? tg.id : null });
        if (tg) addPoison(S, tg, 1);
      }
      function addPoison(S, target, n) {
        if (target.word && target.ctrl !== void 0) {
          if (!prop(target, "living")) return;
          target.status.poison = Math.min(FORMAT.poisonCap, (target.status.poison || 0) + n);
        } else target.poison = Math.min(FORMAT.poisonCap, target.poison + n);
      }
      function startTurn(S) {
        const p = S.players[S.active];
        S.turn++;
        p.personalTurn++;
        if (S.active === S.first) S.round++;
        p.reserve = 0;
        p.breath = Math.max(0, Math.min(FORMAT.breathCap, 2 + p.personalTurn) - (p.tax || 0));
        p.tax = 0;
        p.extraBreath = 0;
        p.leechUsed = false;
        p.sentenceSpark = false;
        p.abilitySpark = false;
        p.bought = false;
        p.discountUsed = 0;
        if (p.personalTurn === 1 && S.active !== S.first) p.breath += INITIATIVE[S.rules.initiative].p2FirstTurnBreath || 0;
        if (p.personalTurn === 1 && S.active === S.first) p.breath = Math.max(0, p.breath + (INITIATIVE[S.rules.initiative].p1FirstTurnBreath || 0));
        for (const t of S.things) if (t.ctrl === S.active) {
          t.exhausted = false;
          t.fresh = false;
          t.actions = 0;
          t.quickUsed = false;
          delete t.defOnly;
          delete t.shield3;
          delete t.g3;
        }
        event(S, "renew", { side: p.i });
        if (S.invites) S.invites = S.invites.filter((x) => x.owner !== p.i);
        if (S.sky && S.sky.caster === p.i && p.personalTurn >= S.sky.until) {
          toGrave(S, S.sky, "retired");
          event(S, "sky-expired", { word: S.sky.word });
          S.sky = null;
        }
        if (S.law && S.law.caster === p.i && p.personalTurn >= S.law.until) {
          retireLaw(S);
        }
        const batch = [];
        for (const t of S.things.filter((t2) => t2.ctrl === S.active)) {
          if (t.status.burning) {
            batch.push(() => {
              damageThing(S, t, 2);
              t.status.burning--;
            });
          }
          if (t.status.poison) {
            batch.push(() => {
              damageThing(S, t, t.status.poison);
              t.status.poison--;
            });
          }
        }
        if (p.poison) {
          const d = p.poison;
          batch.push(() => {
            loseLife(S, p.i, d, "poison");
            p.poison--;
          });
        }
        batch.forEach((f) => f());
        stateCheck(S);
        if (S.over != null) return;
        for (const t of S.things.filter((t2) => t2.ctrl === S.active).sort((a, b) => a.entry - b.entry)) {
          if (!S.things.includes(t)) continue;
          if (has(S, t, "bedrock") && t.arrivedTurn < p.personalTurn) addCounter(S, t, "bedrock");
          const u = card(t).upkeep;
          if (u === "energy" || u === "gold") gainExtraBreath(p, 1);
          if (u === "lifeHeal") gainLife(S, p.i, 1, "life");
          if (u === "worldTree") {
            gainLife(S, p.i, 2, "world tree");
            const o = S.things.filter((o2) => o2 !== t && o2.ctrl === p.i && prop(o2, "living") && (o2.counters.growth || 0) < FORMAT.growthCap).sort((a, b) => a.entry - b.entry)[0];
            if (o && addCounter(S, o, "growth") > 0) {
              t.wtGrants = (t.wtGrants || []).concat(o.id);
              event(S, "wt-growth", { side: t.ctrl, tree: t.id, beneficiary: o.id });
            }
          }
          if (u === "stone") {
            const k = decide(S, p.i, "stoneUpkeep", ["draw", "breath"], p.hand.length <= 3 && p.deck.length ? 0 : 1);
            if (k === 0) drawCard(S, p);
            else gainExtraBreath(p, 1);
          }
          if (card(t).lifespan) {
            t.age = (t.age || 0) + 1;
            if (t.age >= card(t).lifespan) {
              leaveField(S, t, "expired");
              say(S, `${t.word} disperses.`);
              continue;
            }
          }
          if (card(t).ladder === "plant" && ["life.seed", "life.sapling"].includes(card(t).id)) ageUp(S, t);
          if (u === "espalier") espalierUpkeep(S, p, t);
          if (u === "aloe") {
            const d = S.things.filter((o) => o.ctrl === p.i && o.damage > 0).sort((a, b) => a.entry - b.entry)[0];
            if (d) heal(S, d, 1);
          }
          if (u === "wormwood") {
            if (p.poison) p.poison--;
            else {
              const d = S.things.find((o) => o.ctrl === p.i && o.status.poison);
              if (d) d.status.poison--;
            }
          }
        }
        if (p.ground && card(p.ground).upkeep === "torch") {
          loseLife(S, 1 - p.i, 1, "torch");
        }
        if (p.ground && card(p.ground).upkeep === "fireGround") {
          const v = S.things.filter((o) => o.ctrl !== p.i && canIgnite(o) && o.damage > 0 && !o.status.burning).sort((a, b) => a.entry - b.entry)[0];
          if (v) ignite(S, v, null);
        }
        const gu = p.ground && card(p.ground).upkeep;
        if (gu === "bellows") gainExtraBreath(p, 1);
        if (gu === "ink") gainAbilitySpark(S, p);
        if (gu === "reorder2") reorderTop(S, p, 2);
        if (gu === "earthGround") {
          const pl = S.things.filter((o) => o.ctrl === p.i && prop(o, "plant") && (o.counters.growth || 0) < FORMAT.growthCap).sort((a, b) => a.entry - b.entry)[0];
          if (pl) addCounter(S, pl, "growth");
        }
        weatherUpkeep(S, p);
        if (p.burden && card(p.burden).burden === "debt") {
          const opts = p.spark > 0 ? ["spark", "life"] : ["life"];
          if (opts[decide(S, p.i, "debt", opts)] === "spark") {
            p.spark--;
            S.stats.res[p.i].sparkSpent++;
          } else loseLife(S, p.i, 1, "debt");
          if (--p.burden.ticks <= 0) {
            toGrave(S, p.burden, "retired");
            p.burden = null;
          }
        }
        if (p.ground && card(p.ground).upkeep === "waterGround") {
          const opts = S.things.filter((o) => o.ctrl === p.i).sort((a, b) => (b.status.burning ? 1 : 0) - (a.status.burning ? 1 : 0) || b.damage - a.damage || a.entry - b.entry);
          const f = opts[decide(S, p.i, "waterGround", opts.map((o) => o.id))];
          if (f) {
            f.status.wet = true;
            delete f.status.burning;
            heal(S, f, 1);
          }
        }
        stateCheck(S);
        if (S.over != null) return;
        if (!(S.active === S.first && p.personalTurn === 1)) for (let k = 0; k < S.rules.draws; k++) {
          drawCard(S, p);
          stateCheck(S);
          if (S.over != null) return;
        }
        stateCheck(S);
        if (S.over != null) return;
        if (S.claims) {
          v32StartOfMain(S);
          if (S.over != null) return;
        }
        marketStep(S);
        const R0 = S.stats.res[p.i];
        R0.handByRound = R0.handByRound || {};
        R0.handByRound[S.round] = p.hand.length;
        if (fusionOptions(S, p.i).length) R0.fusionTurns = (R0.fusionTurns || 0) + 1;
        if (S.round <= 3 && !legalActions(S).some((a) => a.type !== "pass" && a.type !== "buy")) R0.earlyNoPlay = (R0.earlyNoPlay || 0) + 1;
        R0.turns = (R0.turns || 0) + 1;
      }
      function perms(a) {
        return a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((r) => [x].concat(r)));
      }
      function reorderTop(S, p, n) {
        const top = p.deck.splice(0, n), orders = perms(top.map((c, i) => i));
        const dflt = orders.findIndex((o) => o.every((v, i) => i === 0 || card(top[o[i - 1]]).cost <= card(top[v]).cost));
        const k = decide(S, p.i, "reorder", orders.map((o) => o.map((i) => top[i].word)), Math.max(0, dflt));
        p.deck.unshift(...orders[k].map((i) => top[i]));
      }
      function selectTop(S, p, n, pick) {
        const top = p.deck.splice(0, n);
        const elig = top.map((c, i) => i).filter((i) => pick(top[i]));
        const j = elig.length && p.hand.length < FORMAT.handCap ? decide(S, p.i, "select", elig.map((i) => top[i].word)) : -1;
        const k = j >= 0 ? elig[j] : -1;
        if (k >= 0) p.hand.push(top.splice(k, 1)[0]);
        p.deck.push(...top);
        return k >= 0;
      }
      function weatherUpkeep(S, p) {
        if (!S.sky) return;
        const w = card(S.sky).weather, mine = S.things.filter((o) => o.ctrl === p.i).sort((a, b) => a.entry - b.entry);
        const orrery = p.ground && card(p.ground).static === "orrery";
        if (w === "rain") {
          const d = mine.find((o) => o.damage > 0);
          if (d) heal(S, d, 1);
        }
        if (w === "drought") for (const o of mine) delete o.status.wet;
        if (w === "storm" && !orrery) {
          const o = mine.find((o2) => !has(S, o2, "flying"));
          if (o) damageThing(S, o, o.status.wet ? 2 : 1);
        }
        if (w === "winter") {
          const o = mine.find((o2) => o2.status.wet);
          if (o) {
            o.status.frozen = true;
            delete o.status.wet;
          }
        }
        if (w === "spring") {
          const pl = mine.find((o) => plantNext(S, o));
          if (pl) ageUp(S, pl);
          const d = mine.find((o) => prop(o, "living") && o.damage > 0);
          if (d) heal(S, d, 1);
        }
        if (w === "harvest" && mine.some((o) => prop(o, "plant")) && !mine.some((o) => card(o).id === "token.fruit")) createToken(S, p.i, "token.fruit");
      }
      function retireLaw(S) {
        for (const c of S.law.cards) toGrave(S, c, "retired");
        event(S, "law-ended", {});
        S.law = null;
        refreshLaw(S);
      }
      function gainExtraBreath(p, n) {
        const g = Math.max(0, Math.min(n, FORMAT.extraBreathCap - p.extraBreath, FORMAT.poolCap - p.breath));
        p.breath += g;
        p.extraBreath += g;
        return g;
      }
      var METAL_NEXT = { "earth.lead": ["earth.tin", "earth.copper"], "earth.tin": ["earth.silver"], "earth.copper": ["earth.silver"], "earth.silver": ["earth.gold"] };
      function transform(S, t, to) {
        const from = card(t).id;
        t.prevForms = (t.prevForms || []).concat(from);
        t.form = to;
        t.ladderTurn = S.players[t.ctrl].personalTurn;
        S.stats.transforms++;
        event(S, "transform", { tid: t.id, from, to });
        say(S, `${t.word} becomes ${to}.`);
      }
      function plantNext(S, t) {
        const id = card(t).id;
        if (id === "life.seed") return "life.sapling";
        if (id === "life.sapling") {
          const g = S.players[t.ctrl].ground;
          return g && card(g).id === "water.water" ? "life.willow" : "life.oak";
        }
        return null;
      }
      function ageUp(S, t) {
        const nx = plantNext(S, t);
        if (!nx) return;
        t.counters.age = Math.min(2, (t.counters.age || 0) + 1);
        if (t.counters.age >= 2 && t.ladderTurn !== S.players[t.ctrl].personalTurn) {
          transform(S, t, nx);
          t.counters.age = 0;
        }
      }
      function drawCard(S, p) {
        if (p.hand.length >= FORMAT.handCap) {
          S.stats.res[p.i].blockedDraws = (S.stats.res[p.i].blockedDraws || 0) + 1;
          return;
        }
        if (!p.deck.length) {
          p.fatigue++;
          loseLife(S, p.i, p.fatigue, "fatigue");
          return;
        }
        p.hand.push(p.deck.shift());
        S.stats.res[p.i].drawn++;
      }
      function endTurn(S) {
        const p = S.players[S.active];
        for (const t of S.things) {
          t.tempStrike = 0;
          t.tempStand = 0;
          t.kindled = false;
          if (t.ctrl === p.i) {
            t.tempGuard = false;
            for (const k of ["wet", "frozen", "asleep", "bound", "blinded", "grounded"]) delete t.status[k];
          }
        }
        stateCheck(S);
        p.reserve = S.rules.reserve ? Math.min(S.rules.reserveCap, p.breath) : 0;
        S.stats.res[p.i].reserveKept += p.reserve;
        S.stats.res[p.i].breathWasted += p.breath - p.reserve;
        p.breath = 0;
        if (S.processes) for (const pr of S.processes.filter((x) => x.owner === p.i && x.open && p.personalTurn >= x.earliest)) closeProcess(S, p.i, "lapsed");
        if (p.invitePlan) openInvitation(S, p);
        event(S, "end", { side: p.i, reserve: p.reserve });
        if (S.over == null && S.active !== S.first && S.round >= FORMAT.roundCap) S.over = "draw";
        if (S.over != null) return;
        S.active = 1 - S.active;
        startTurn(S);
      }
      function ready(S, t, onTurn) {
        if (t.exhausted || incapacitated(t) || t.defOnly) return false;
        if (t.fresh && !has(S, t, "swift")) return false;
        return onTurn ? t.actions < (t.quickUsed || t.feastTurn === S.players[t.ctrl].personalTurn ? 2 : 1) : true;
      }
      var isOriginal = (t) => !!t.pid && !t.lineage && !t.token;
      var pushable = (S, t, maxSt) => !has(S, t, "heavy") && maxStand(S, t) <= maxSt;
      var saltProtects = (S, side) => {
        const g = S.players[side].ground;
        return !!(g && card(g).static === "salt");
      };
      function combos(arr, kmin, kmax) {
        const out = [];
        const rec = (start, cur) => {
          if (cur.length >= kmin) out.push(cur.slice());
          if (cur.length === kmax) return;
          for (let i = start; i < arr.length; i++) {
            cur.push(arr[i]);
            rec(i + 1, cur);
            cur.pop();
          }
        };
        rec(0, []);
        return out;
      }
      function canAct(S, t) {
        return t.ctrl === S.active && ready(S, t, true);
      }
      function contactReach(S, att, target) {
        if (target && target.word && target.ctrl !== void 0 && has(S, target, "flying")) return has(S, att, "flying") || has(S, att, "reach");
        return true;
      }
      function eligibleBlockers(S, defender, att, target) {
        const protectsOther = !!target;
        return S.things.filter((b) => b.ctrl === defender && !b.exhausted && !incapacitated(b) && b !== target && perm(S, b, "intercept") && (!protectsOther || has(S, b, "guard")) && (!has(S, att, "flying") || has(S, b, "flying") || has(S, b, "reach")));
      }
      var COMBAT = { strike: 0, bite: 1, crush: 2, cut: 1 };
      function spellTargets(S, side, d, mode) {
        const mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed), all = mine.concat(foes);
        const hidden = S.things.filter((t) => t.ctrl !== side && t.status.concealed);
        const p = S.players[side];
        switch (d.spell) {
          case "guard":
          case "kindle":
            return mine.map((t) => t.id);
          case "protect":
            return mine.filter((t) => !t.status.ward).map((t) => t.id);
          case "dew":
            return mine.map((t) => t.id).concat(p.poison ? ["self"] : []);
          case "thaw":
            return all.filter((t) => t.status.frozen).map((t) => t.id);
          case "frozen":
            return all.filter((t) => t.status.wet && !t.status.frozen).map((t) => t.id);
          case "sleep":
            return all.filter((t) => prop(t, "living") && (prop(t, "beast") || prop(t, "person")) && !t.status.asleep).map((t) => t.id);
          case "gust":
            return foes.filter((t) => !has(S, t, "heavy") && curStrike(S, t) <= 2).map((t) => t.id);
          case "gasp":
            return mode === "main" && p.extraBreath < FORMAT.extraBreathCap ? [null] : [];
          case "tonic":
            return mode === "main" && (p.life < FORMAT.life || p.poison) ? [null] : [];
          case "grow":
            return mode === "main" ? mine.filter((t) => prop(t, "plant") && ((t.counters.growth || 0) < FORMAT.growthCap || plantNext(S, t))).map((t) => t.id) : [];
          case "separate":
            return mode === "main" && p.fusedTurn !== p.personalTurn ? mine.filter((t) => separable(S, t)).map((t) => t.id) : [];
          case "doubt": {
            if (mode === "main") return hidden.map((t) => "reveal:" + t.id);
            if (!S.clause) return [];
            return S.clause.nodes.map((n, k) => ({ n, k })).filter(({ n }) => n.side !== side && !n.cancelled && n.card && ["spell", "quality", "weather", "burden", "category"].includes(card(n.card).type) && (n.totalCost || card(n.card).cost) <= 3).map(({ k }) => "node:" + k);
          }
          case "wildfire":
            return mode === "main" && all.some((t) => t.status.burning) ? [null] : [];
          case "memory":
            return mode === "main" && p.hand.length - 1 < FORMAT.handCap ? p.grave.filter((g) => ["action", "spell"].includes(BY_ID2[g.word].type) && BY_ID2[g.word].cost <= 2 && g.word !== "water.memory").map((g) => "g:" + g.pid) : [];
          case "tame":
            return mode === "main" && mine.length < capTotal(S) ? foes.filter((t) => isOriginal(t) && prop(t, "beast") && curStrike(S, t) <= 2 && !t.status.named).map((t) => t.id) : [];
          case "summon":
            return mode === "main" && mine.length < capTotal(S) ? foes.filter((t) => isOriginal(t) && BY_ID2[t.word].cost <= 2 && !t.status.named).map((t) => t.id) : [];
          case "rust":
            return mode === "main" ? foes.filter((t) => prop(t, "metal") && !has(S, t, "incorruptible") && !modsOf(t).rustImmune).map((t) => t.id) : [];
          case "wither":
            return mode === "main" ? foes.filter((t) => prop(t, "living")).map((t) => t.id) : [];
          case "exhume":
            return mode === "main" && mine.length < capTotal(S) ? p.grave.filter((g) => BY_ID2[g.word].type === "thing" && BY_ID2[g.word].cost <= 2).map((g) => "g:" + g.pid) : [];
          case "miasma":
          case "scream":
          case "silence":
            return mode === "main" ? [null] : [];
          case "omen":
            return mode === "main" && p.deck.length ? [null] : [];
          case "gnosis":
            return mode === "main" && p.deck.length ? [null] : [];
          case "echo":
            return mode === "main" && !p.echo ? [null] : [];
          case "loan":
            return mode === "main" && p.extraBreath < FORMAT.extraBreathCap && !p.tax ? [null] : [];
          case "reckoning":
            return mode === "main" && foes.some((t) => maxStand(S, t) <= 2) ? [null] : [];
          case "name":
            return mode === "main" ? mine.filter((t) => !t.status.named).map((t) => t.id) : [];
          case "measure":
            return mode === "main" ? foes.filter((t) => !t.status.measured).map((t) => t.id) : [];
          case "awaken":
            return mode === "main" ? mine.filter((t) => !prop(t, "living") && !prop(t, "body")).map((t) => t.id) : [];
          case "dispel": {
            const tg = [];
            for (const t of all) for (const a of t.quals || []) tg.push("q:" + a.pid);
            if (S.sky) tg.push("sky");
            if (S.law) tg.push("law");
            for (const t of hidden) tg.push("reveal:" + t.id);
            S.players.forEach((q) => {
              if (q.burden) tg.push("burden:" + q.i);
            });
            return tg;
          }
        }
        return [];
      }
      function cardPlays(S, side, mode) {
        const p = S.players[side], out = [];
        const budget = mode === "response" ? p.reserve : p.breath;
        const onTurn = side === S.active;
        const mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed);
        const free = capTotal(S) - mine.length;
        for (const c of p.hand) {
          const d = card(c);
          const eff = mode !== "main" && S.rules.responseDiscount && S.rules.responseDiscount[d.id] ? Math.max(1, d.cost - S.rules.responseDiscount[d.id]) : S.rules.costOverride && S.rules.costOverride[d.id] || d.cost;
          if (eff > budget) continue;
          if (mode !== "main" && !isR(d)) continue;
          if (mode === "main" && d.responseOnly) continue;
          if (d.type === "thing") {
            if (hasRoom(S, side, d.id)) out.push({ type: "deploy", card: c.pid });
            continue;
          }
          if (d.type === "ground") {
            out.push({ type: "ground", card: c.pid });
            continue;
          }
          if (threeOn(S)) {
            const tp = threePlays(S, side, c, d, mode);
            if (tp) {
              out.push(...tp);
              continue;
            }
          }
          if (mode === "main") {
            if (d.type === "weather") {
              out.push({ type: "weather", card: c.pid });
              continue;
            }
            if (d.type === "burden") {
              out.push({ type: "burden", card: c.pid });
              continue;
            }
            if (d.type === "category") {
              if (p.deck.length) out.push({ type: "spell", card: c.pid });
              continue;
            }
            if (d.type === "quality") {
              for (const t of S.things.filter((t2) => (d.anyTarget ? true : d.enemyTarget ? t2.ctrl !== side : t2.ctrl === side) && qualityFits(S, t2, d))) {
                const q = t.quals || [];
                if (q.length < FORMAT.qualityCap) out.push({ type: "quality", card: c.pid, target: t.id });
                else for (const a of q) out.push({ type: "quality", card: c.pid, target: t.id, replace: a.pid });
              }
              continue;
            }
            if (d.spell === "tide") {
              for (const tg of combos(foes.filter((t) => pushable(S, t, 4)).map((t) => t.id), 1, 2)) out.push({ type: "spell", card: c.pid, targets: tg });
              continue;
            }
            if (d.spell === "squall") {
              for (const tg of combos(mine.filter((t) => has(S, t, "flying") && canAct(S, t)).map((t) => t.id), 1, 3)) out.push({ type: "spell", card: c.pid, targets: tg });
              continue;
            }
            if (d.spell === "abundance" && core33(S)) {
              for (const tg of combos(mine.filter((t) => prop(t, "plant")).map((t) => t.id), 1, 2)) out.push({ type: "spell", card: c.pid, targets: tg });
              continue;
            }
            if (d.spell === "abundance") {
              for (const tg of combos(mine.filter((t) => prop(t, "living")).map((t) => t.id), 1, 3)) for (const m of tg) out.push({ type: "spell", card: c.pid, targets: tg, might: m });
              continue;
            }
            if (d.spell === "graft") {
              if (p.fusedTurn !== p.personalTurn) {
                for (const h of mine) for (const dn of mine) if (h !== dn && graftOk(S, side, h, dn)) out.push({ type: "spell", card: c.pid, target: h.id, donor: dn.id });
              }
              continue;
            }
            if (d.spell === "decay") {
              for (const sac of mine) for (const f of foes) out.push({ type: "spell", card: c.pid, target: f.id, sacrifice: sac.id });
              continue;
            }
            if (d.folio && folioOn(S, d.folio)) {
              out.push(...folioPlays(S, side, c, d));
              continue;
            }
            if (d.spell === "be") {
              for (const cat of p.hand.filter((x) => card(x).type === "category")) for (const q of p.hand.filter((x) => card(x).lawful)) {
                if (d.cost + card(cat).cost + card(q).cost <= budget) out.push({ type: "law", card: c.pid, category: cat.pid, qual: q.pid });
              }
              continue;
            }
          }
          if (["tide", "squall", "abundance", "graft", "decay", "be", "feast", "shape", "writ"].includes(d.spell)) continue;
          if (d.spell === "transmute") {
            if (mode === "main") {
              for (const t of mine) for (const to of METAL_NEXT[card(t).id] || []) if (t.ladderTurn !== p.personalTurn) out.push({ type: "spell", card: c.pid, target: t.id, branch: to });
            }
            continue;
          }
          if (d.spell === "calcine") {
            if (mode === "main") for (const sac of mine) {
              out.push({ type: "spell", card: c.pid, target: "rival", sacrifice: sac.id });
              for (const f of foes) out.push({ type: "spell", card: c.pid, target: f.id, sacrifice: sac.id });
            }
            continue;
          }
          if (d.type === "spell") {
            for (const tg of spellTargets(S, side, d, mode)) out.push(tg == null ? { type: "spell", card: c.pid } : { type: "spell", card: c.pid, target: tg });
            continue;
          }
          if (d.type !== "action") continue;
          const subjects = mine.filter((t) => ready(S, t, onTurn) && caps(S, t).has(d.verb) && (!(d.verb in COMBAT) || perm(S, t, "strike")));
          for (const s of subjects) {
            if (d.verb in COMBAT) {
              if (mode !== "main") continue;
              if (!(threeOn(S) && d.verb === "crush")) out.push({ type: "attack", subject: s.id, verb: d.verb, card: c.pid, target: "rival" });
              for (const f of foes) if (contactReach(S, s, f) && (d.verb !== "bite" || prop(f, "living") && !has(S, f, "sacred"))) out.push({ type: "attack", subject: s.id, verb: d.verb, card: c.pid, target: f.id });
              if (enemy(S, side).ground && d.verb !== "bite" && !(threeOn(S) && d.verb === "crush")) out.push({ type: "attack", subject: s.id, verb: d.verb, card: c.pid, target: "ground" });
              if (d.verb === "cut") for (const f of mine.filter((t) => t.status.bound && contactReach(S, s, t))) out.push({ type: "remote", subject: s.id, verb: "cut", card: c.pid, target: f.id });
            } else if (d.verb === "bind") {
              for (const f of foes.filter((t) => contactReach(S, s, t) && !t.status.bound)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else if (mode !== "main") {
              if (d.verb === "mend") for (const f of mine.filter((t) => t.damage > 0)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
              if (d.verb === "drench") for (const f of S.things.filter((t) => !t.status.wet)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else if (d.verb === "wash") {
              for (const f of foes.filter((t) => pushable(S, t, 4))) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else if (d.verb === "haunt") {
              if (!saltProtects(S, 1 - side)) for (const f of foes.filter((t) => !has(S, t, "sacred") && maxStand(S, t) <= 4)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else if (d.verb === "dissolve") {
              for (const f of foes) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
              if (enemy(S, side).ground) out.push({ type: "remote", subject: s.id, card: c.pid, target: "ground" });
            } else if (d.verb === "blow") {
              for (const pay of mine.filter((t) => t !== s && !t.exhausted && !incapacitated(t) && !t.defOnly)) for (const mode2 of ["hot", "liquid", "toxic"].filter((x) => prop(pay, x))) {
                const elig = foes.filter((t) => mode2 === "hot" ? canIgnite(t) : mode2 === "toxic" ? prop(t, "living") : true).map((t) => t.id);
                for (const tg of combos(elig, 1, 2)) out.push({ type: "remote", subject: s.id, card: c.pid, payload: pay.id, mode: mode2, targets: tg });
              }
            } else if (d.verb === "mend") {
              for (const f of mine.filter((t) => t.damage > 0)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else if (d.verb === "drench") {
              for (const f of S.things.filter((t) => !t.status.wet)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else if (d.verb === "burn") {
              for (const f of (threeOn(S) ? foes.concat(mine) : foes).filter((t) => prop(t, "flammable") && !t.status.wet && (t.status.burning || 0) < 2)) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            } else {
              out.push({ type: "remote", subject: s.id, card: c.pid, target: "rival" });
              for (const f of foes) if (d.verb !== "poison" || prop(f, "living")) out.push({ type: "remote", subject: s.id, card: c.pid, target: f.id });
            }
          }
        }
        return out;
      }
      function legalActions(S) {
        if (S.over != null) return [{ type: "pass" }];
        const p = S.players[S.active], out = [{ type: "pass" }];
        out.push(...cardPlays(S, S.active, "main"));
        if (!p.bought && MKT !== "nobuy" && !(MKT === "from2" && S.round < 2)) {
          if (S.rules.market && p.hand.length < FORMAT.handCap) for (const o of S.market) {
            if (!o) continue;
            const price = priceOf(S, p.i, o.word), off = price === FORMAT.offPrice;
            if (p.spark < price || off && p.offSchoolBought >= FORMAT.offSchoolBuysPerDuel || (p.acquired[o.word] || 0) >= FORMAT.copyLimit) continue;
            if (p.breath < S.rules.marketBreath) continue;
            if ((p.personalTurn - 1) % S.rules.buyEvery !== 0) continue;
            out.push({ type: "buy", slot: o.slot });
          }
          if (p.catalyst < FORMAT.catalystCap && p.spark >= FORMAT.catalystPrice) out.push({ type: "catalyst" });
        }
        if (folioOn(S, "clife")) out.push(...processOptions(S, p.i));
        if (S.rules.modules.some((m) => V32_MODS.has(m))) out.push(...v32Options(S, p.i));
        if (coreOn(S)) out.push(...coreOptions(S, p.i));
        out.push(...fusionOptions(S, p.i));
        out.push(...abilityOptions(S, p.i));
        const foes = S.things.filter((t) => t.ctrl !== p.i && !t.status.concealed);
        if (!coreOn(S) && p.breath >= (S.rules.freeStrike ? 0 : 1)) for (const s of S.things.filter((t) => t.ctrl === p.i && canAct(S, t) && caps(S, t).has("strike") && curStrike(S, t) > 0 && perm(S, t, "strike"))) {
          out.push({ type: "attack", subject: s.id, verb: "strike", target: "rival" });
          for (const f of foes) if (contactReach(S, s, f)) out.push({ type: "attack", subject: s.id, verb: "strike", target: f.id });
          if (enemy(S, p.i).ground) out.push({ type: "attack", subject: s.id, verb: "strike", target: "ground" });
        }
        return out;
      }
      function qualityFits(S, t, d) {
        const q = d.qual, cur = t.quals || [];
        if (cur.some((a) => a.word === d.id)) return false;
        if (cur.some((a) => a.word === "earth.fixed")) return false;
        if (q.needsProp && !prop(t, q.needsProp)) return false;
        if (coreOn(S) && d.id === "air.winged" && has(S, t, "flying")) return false;
        if (q.notHeavy && has(S, t, "heavy")) return false;
        return true;
      }
      function abilityOptions(S, side) {
        const p = S.players[side], out = [], mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed);
        if (S.rules.modules.length) out.push(...folioAbilityOptions(S, side));
        if (threeOn(S)) out.push(...threeAbilityOptions(S, side));
        for (const t of mine) {
          const ab = card(t).ability;
          if (!ab || ab.cost > p.breath || ab.folio) continue;
          if (threeOn(S) && THREE_ABILITIES.has(ab.id)) continue;
          if (card(t).folio && ["mould", "signet"].includes(ab.id)) continue;
          if (ab.sacrificeSelf) {
            if (incapacitated(t)) continue;
          } else if (!canAct(S, t)) continue;
          if (ab.id === "heal2") for (const f of mine.filter((o) => o.damage > 0)) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id });
          if (ab.id === "tend") {
            for (const f of mine.filter((o) => o.damage > 0)) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id, branch: "heal" });
            for (const f of mine.filter((o) => o.status.poison)) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id, branch: "cure" });
          }
          if (ab.id === "etch") for (const f of foes.filter((o) => prop(o, "metal") || prop(o, "stone"))) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id });
          if (ab.id === "alkahest") {
            for (const f of foes) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id });
            if (enemy(S, side).ground) out.push({ type: "ability", subject: t.id, ability: ab.id, target: "ground" });
          }
          if (ab.id === "eatFruit" && coreOn(S)) for (const f of mine.filter((o) => o.damage > 0 && prop(o, "living"))) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id, branch: "mend" });
          if (ab.id === "eatFruit") {
            if (p.life < FORMAT.life) out.push({ type: "ability", subject: t.id, ability: ab.id, branch: "life" });
            for (const f of mine.filter((o) => o.status.poison)) out.push({ type: "ability", subject: t.id, ability: ab.id, target: f.id, branch: "cure" });
          }
        }
        return out;
      }
      function graftOk(S, side, h, dn) {
        const desc = { thing: true, props: ["living", "plant"], host: true };
        if (!ingredientOk(S, side, desc, h, false) || !ingredientOk(S, side, { thing: true, props: ["living", "plant"] }, dn, false)) return false;
        if (h.fresh && dn.fresh) return false;
        const m = modsOf(h);
        if (m.infusions.length >= R2.MAX_INFUSIONS || m.infusions.includes("grafted")) return false;
        return maxStand(S, h) + 2 - h.damage - dn.damage > 0;
      }
      function legalResponses(S, side, kind) {
        if (!S.clause || S.over != null) return [];
        if (kind === "response" && (side === S.active || S.clause.nodes.length !== 1)) return [];
        if (kind === "answer" && (side !== S.active || S.clause.nodes.length !== 2)) return [];
        return cardPlays(S, side, kind);
      }
      function whyIllegal(S, act) {
        if (legalActions(S).some((a) => sameAction(a, act))) return null;
        const p = S.players[S.active];
        if (S.rules.modules && S.rules.modules.length) {
          const w = folioWhy(S, act);
          if (w) return w;
        }
        if (act.card) {
          const c = p.hand.find((x) => x.pid === act.card);
          if (!c) return "that word is not in your hand";
          const d = card(c);
          if (d.cost > p.breath) return `${d.id} costs ${d.cost}; you have ${p.breath} breath`;
          if (d.responseOnly) return `${d.id} can only be spoken as a response`;
          if (d.type === "thing" && !hasRoom(S, p.i, d.id)) return "no empty field slot";
        }
        if (act.type === "fuse") {
          const recipe = recipeById(act.recipe);
          if (!recipe) return "no such recipe";
          if (p.fusedTurn === p.personalTurn) return "the Vessel has already been used this turn";
          const a = refObj(S, p.i, act.a), b = refObj(S, p.i, act.b);
          if (!a || !b) return "ingredient missing";
          for (const [o, g] of [[a, act.a === "ground"], [b, act.b === "ground"]]) {
            if (g) continue;
            if (o.owner !== p.i || o.ctrl !== p.i) return `${o.word} must be controlled and owned`;
            if (has(S, o, "final")) return `${o.word} is Final`;
            if (o.exhausted) return `${o.word} is exhausted`;
            if (incapacitated(o)) return `${o.word} cannot act`;
          }
          if (![a, b].some((o, k) => !(k ? act.b === "ground" : act.a === "ground") && !o.fresh)) return "at least one ingredient must be a mature Thing";
          const pv = previewFusion(S, p.i, recipe, a, act.a === "ground", b, act.b === "ground");
          if (!pv) return "these ingredients do not match the recipe";
          if (pv.cost > p.breath) return `fusion costs ${pv.cost}; you have ${p.breath} breath`;
          if (pv.catalyst && p.catalyst < 1) return "an opposed-school recipe needs a catalyst";
        }
        if (act.subject) {
          const s = thingById(S, act.subject);
          if (!s || s.ctrl !== p.i) return "subject is not your Thing";
          if (s.exhausted) return `${s.word} is exhausted`;
          if (incapacitated(s)) return `${s.word} cannot act`;
          if (s.fresh && !has(S, s, "swift")) return `${s.word} arrived this turn and is not Swift`;
          if (act.verb && !caps(S, s).has(act.verb)) return `${card(s).id.split(".")[1]} lacks the ${act.verb} capability`;
          const tg = act.target && act.target !== "rival" && act.target !== "ground" ? thingById(S, act.target) : null;
          if (tg && act.verb in COMBAT && !contactReach(S, s, tg)) return `${tg.word} is flying; ${s.word} has neither Flying nor Reach`;
          if (tg && act.verb === "bite" && !prop(tg, "living")) return `bite needs a living object`;
          if (act.target === "ground" && act.verb === "bite") return "bite cannot target Ground";
        }
        return "not a legal sentence now";
      }
      function schoolsOf(o, isGround) {
        if (isGround || o.token) return [card(o).school];
        const c = card(o);
        return [...new Set((c.schools || [c.school]).concat(modsOf(o).schools))];
      }
      function ingredientOk(S, side, desc, o, isGround, resolving) {
        if (!o) return false;
        if (!!desc.ground !== !!isGround) return false;
        if (isGround) return o.owner === side && card(o).id === desc.form;
        if (o.ctrl !== side || o.owner !== side) return false;
        if (has(S, o, "final")) return false;
        if (!!desc.token !== !!o.token) return false;
        if (o.exhausted && !resolving || incapacitated(o) || o.defOnly) return false;
        if (desc.form && card(o).id !== desc.form) return false;
        if (desc.props && !desc.props.every((x) => prop(o, x))) return false;
        if (desc.host && card(o).made) return false;
        if (S.processes && S.processes.some((pr) => pr.open && pr.inputs.some((x) => x.id === o.id))) return false;
        return true;
      }
      function fusionPrice(S, side, base) {
        const disc = S.things.some((t) => t.ctrl === side && card(t).fusionDiscount) ? 1 : 0;
        return Math.max(2, base - disc);
      }
      function catalystNeeded(S, a, aG, b, bG) {
        return R2.opposedAcross(schoolsOf(a, aG), schoolsOf(b, bG));
      }
      function previewFusion(S, side, recipe, a, aG, b, bG) {
        if (!ingredientOk(S, side, recipe.a, a, aG) || !ingredientOk(S, side, recipe.b, b, bG)) return null;
        if (a === b) return null;
        const things = [a, b].filter((o, k) => !(k ? bG : aG));
        if (!things.some((t) => !t.fresh)) return null;
        if (recipe.mod) {
          const m = modsOf(a);
          if (m.infusions.length >= R2.MAX_INFUSIONS || m.infusions.includes(recipe.id)) return null;
          if ((recipe.forbidKw || []).some((k) => has(S, a, k)) || (recipe.forbidProps || []).some((x) => prop(a, x))) return null;
        }
        const dmg = (a.damage || 0) + (b.damage || 0);
        const stand = recipe.mod ? card(a).stand + modsOf(a).stand + (recipe.mod.stand || 0) : BY_ID2[recipeOut(S, recipe)].stand;
        if (stand - dmg <= 0) return null;
        return { cost: fusionPrice(S, side, recipe.cost), catalyst: catalystNeeded(S, a, aG, b, bG), dmg, stand };
      }
      function fusionOptions(S, side) {
        const p = S.players[side];
        if (p.fusedTurn === p.personalTurn) return [];
        const objs = S.things.filter((t) => t.ctrl === side).map((t) => ({ o: t, g: false, ref: t.id }));
        if (p.ground) objs.push({ o: p.ground, g: true, ref: "ground" });
        const out = [];
        for (const recipe of R2.NAMED.concat(R2.INFUSIONS, folioOn(S, "workshop") ? FOLIO_RECIPES : [])) for (const x of objs) for (const y of objs) {
          if (x === y) continue;
          const pv = previewFusion(S, side, recipe, x.o, x.g, y.o, y.g);
          if (!pv || pv.cost > p.breath || pv.catalyst && p.catalyst < 1) continue;
          out.push({ type: "fuse", recipe: recipe.id, a: x.ref, b: y.ref });
        }
        return out;
      }
      var recipeById = (id) => R2.NAMED.find((r) => r.id === id) || R2.INFUSIONS.find((r) => r.id === id) || FOLIO_RECIPES.find((r) => r.id === id) || ESPALIER.find((r) => r.id === id);
      var recipeOut = (S, r) => threeOn(S) && r.id === "golem" ? "made.golem3" : r.out;
      var refObj = (S, side, ref) => ref === "ground" ? S.players[side].ground : thingById(S, ref);
      function resolveFuse(S, n) {
        const side = n.side, p = S.players[side], recipe = recipeById(n.act.recipe);
        const a = refObj(S, side, n.act.a), b = refObj(S, side, n.act.b), aG = n.act.a === "ground", bG = n.act.b === "ground";
        if (!ingredientOk(S, side, recipe.a, a, aG, true) || !ingredientOk(S, side, recipe.b, b, bG, true)) return false;
        if (aG && a.pid !== n.groundPid) return false;
        if (bG && b.pid !== n.groundPid) return false;
        const lineage = [lineageRecord(a, aG), lineageRecord(b, bG)];
        const dmg = (a.damage || 0) + (b.damage || 0);
        const keepQuals = recipe.mod ? a.quals || [] : [];
        if (recipe.mod) {
          if (!bG) retireQuals(S, b);
        } else {
          if (!aG) retireQuals(S, a);
          if (!bG) retireQuals(S, b);
        }
        for (const [o, g] of [[a, aG], [b, bG]]) {
          if (g) p.ground = null;
          else S.things = S.things.filter((x) => x !== o);
        }
        let t;
        if (recipe.mod) {
          const m0 = modsOf(a), m = recipe.mod;
          const mods = {
            strike: m0.strike + (m.strike || 0),
            stand: m0.stand + (m.stand || 0),
            props: m0.props.concat(m.props || []),
            kw: m0.kw.concat(m.kw || []),
            kwRemove: m0.kwRemove.concat(m.kwRemove || []),
            infusions: m0.infusions.concat(recipe.id),
            schools: m0.schools.concat(recipe.school),
            igniteOnHit: m0.igniteOnHit || !!m.igniteOnHit
          };
          t = newThing(S, side, { word: a.word, form: a.form, mods, lineage, damage: dmg, exhausted: true, fresh: true, quals: keepQuals });
        } else {
          t = newThing(S, side, { word: recipeOut(S, recipe), form: recipeOut(S, recipe), lineage, damage: dmg, exhausted: true, fresh: true });
        }
        t.madeTurn = p.personalTurn;
        S.stats.fusions++;
        S.stats.made[recipe.id] = (S.stats.made[recipe.id] || 0) + 1;
        event(S, "made", { side, recipe: recipe.id, tid: t.id });
        say(S, `P${side} fuses ${recipe.id}.`);
        if (card(t).onMade === "seekSpell") {
          const top = p.deck.splice(0, 3), k = top.findIndex((c) => card(c).type === "spell");
          if (k >= 0 && p.hand.length < FORMAT.handCap) p.hand.push(top.splice(k, 1)[0]);
          p.deck.push(...top);
        }
        return true;
      }
      function separable(S, t) {
        return t.lineage && t.owner === t.ctrl && !has(S, t, "final");
      }
      function resolveSeparate(S, n, t) {
        const side = n.side, p = S.players[side];
        if (!t || t.ctrl !== side || !separable(S, t)) return false;
        const recs = t.lineage, gr = recs.filter((r) => r.ground), th = recs.filter((r) => !r.ground);
        const after = S.things.filter((x) => x.ctrl === side && x !== t).length;
        if (after + th.length > capTotal(S) || gr.length && p.ground) return false;
        retireQuals(S, t);
        S.things = S.things.filter((x) => x !== t);
        recs.forEach((r, k) => {
          const dmg = k === 0 ? t.damage : 0;
          if (r.ground) {
            p.ground = { pid: r.pid, word: r.word, owner: r.owner, damage: dmg };
            return;
          }
          const o = { word: r.word, damage: dmg, exhausted: true, fresh: true, owner: r.owner };
          if (r.token) Object.assign(o, { word: r.token, form: r.token, token: true });
          else if (r.made) Object.assign(o, { form: r.form, mods: r.mods || void 0, lineage: r.lineage });
          else Object.assign(o, { pid: r.pid, form: r.form !== r.word ? r.form : void 0 });
          newThing(S, side, o);
        });
        event(S, "separated", { tid: t.id });
        return true;
      }
      function reveal(S, t) {
        delete t.status.concealed;
        event(S, "reveal", { tid: t.id, word: t.word });
      }
      function arrive(S, t) {
        const p = S.players[t.ctrl], oa = card(t).onArrive;
        if (oa === "concealed") t.status.concealed = true;
        if (S.sky && card(S.sky).weather === "night" && isOriginal(t) && t.ctrl === S.active && p.nightTurn !== p.personalTurn) {
          p.nightTurn = p.personalTurn;
          t.status.concealed = true;
        }
        event(S, "arrive", { id: t.id, pid: t.concealed || t.status.concealed ? null : t.pid });
        if (card(t).revealOnArrive) {
          const hs = S.things.filter((o) => o.ctrl !== t.ctrl && o.status.concealed);
          const k = decide(S, t.ctrl, "owlReveal", ["none"].concat(hs.map((h) => h.id)), hs.length ? 1 : 0);
          if (k > 0) reveal(S, hs[k - 1]);
        }
        if (oa === "herald") selectTop(S, p, 2, (c) => true);
        if (oa === "reorder2") reorderTop(S, p, 2);
        if (oa === "rose" && S.things.some((o) => o !== t && o.ctrl === t.ctrl && prop(o, "flower")) && !S.things.some((o) => o.ctrl === t.ctrl && card(o).id === "token.blossom")) {
          const b = createToken(S, t.ctrl, "token.blossom");
          if (b) flowerEntered(S, b);
        }
        if (card(t).appleArrive && threeOn(S) && S.things.some((o) => o !== t && o.ctrl === t.ctrl && prop(o, "flower")) && !hasFruit(S, t.ctrl)) {
          const f = createToken(S, t.ctrl, "token.fruit");
          if (f) event(S, "apple-fruit", { tid: t.id });
        }
        flowerEntered(S, t);
      }
      function flowerEntered(S, t) {
        if (!prop(t, "flower") || t.ctrl !== S.active) return;
        const p = S.players[t.ctrl];
        for (const sf of S.things.filter((o) => o !== t && o.ctrl === t.ctrl && card(o).saffron)) if (sf.saffronTurn !== p.personalTurn) {
          sf.saffronTurn = p.personalTurn;
          gainAbilitySpark(S, p);
        }
      }
      function resolveAbility(S, n, tg) {
        const a = n.act, side = n.side, p = S.players[side];
        if (!n.selfSacrificed && !thingById(S, a.subject)) {
          if (a.ability === "tinder" || a.ability === "clayShield") {
          } else return false;
        }
        switch (a.ability) {
          case "heal2":
            if (!tg || tg.ctrl !== side) return false;
            heal(S, tg, 2);
            return true;
          case "tend":
            if (!tg || tg.ctrl !== side) return false;
            if (a.branch === "cure") {
              if (tg.status.poison) tg.status.poison--;
            } else heal(S, tg, 2);
            return true;
          case "etch":
            if (!tg || tg.ctrl === side || !(prop(tg, "metal") || prop(tg, "stone"))) return false;
            if (wardBlocks(S, n, tg)) return true;
            damageThing(S, tg, 3);
            return true;
          case "alkahest": {
            if (a.target === "ground") {
              const g = enemy(S, side).ground;
              if (!g) return false;
              g.damage = 999;
              return true;
            }
            if (!tg || tg.ctrl === side) return false;
            if (wardBlocks(S, n, tg)) return true;
            destroy(S, tg);
            return true;
          }
          case "pollinate":
          case "shapeWork":
          case "signet":
          case "mould":
            return resolveFolioAbility(S, n, tg);
          case "visit":
            return resolveVisit(S, n, tg);
          case "clayShield":
          case "tinder":
          case "hammer":
          case "seal":
          case "temper":
            return resolveThreeAbility(S, n, tg);
          case "bear":
          case "shapeStart":
            return resolveProcessStart(S, n, tg);
          case "eatFruit":
            if (a.branch === "mend") {
              if (!tg || tg.ctrl !== side || !tg.damage) return false;
              heal(S, tg, 2);
              return true;
            }
            if (a.branch === "life") {
              gainLife(S, side, 2, "fruit");
              return true;
            }
            if (!tg || tg.ctrl !== side) return false;
            if (tg.status.poison) tg.status.poison--;
            return true;
        }
        return false;
      }
      function resolveGraft(S, n, h, dn) {
        const side = n.side;
        if (!h || !dn || h.ctrl !== side || dn.ctrl !== side || !ingredientOk(S, side, { thing: true, props: ["living", "plant"], host: true }, h, false, true) || !ingredientOk(S, side, { thing: true, props: ["living", "plant"] }, dn, false, true)) return false;
        const tags = ["orchard", "herb", "flower"].filter((x) => prop(dn, x));
        const m0 = modsOf(h);
        const mods = { ...MOD0, ...h.mods || {}, stand: (h.mods ? h.mods.stand : 0) + 2, props: (h.mods && h.mods.props || []).concat(tags), infusions: (h.mods && h.mods.infusions || []).concat("grafted"), schools: (h.mods && h.mods.schools || []).concat("life") };
        const lineage = [lineageRecord(h, false), lineageRecord(dn, false)], dmg = h.damage + dn.damage;
        retireQuals(S, dn);
        const hq = h.quals;
        S.things = S.things.filter((x) => x !== h && x !== dn);
        const t = newThing(S, side, { word: h.word, form: h.form, mods, lineage, damage: dmg, exhausted: true, fresh: true, quals: hq });
        S.stats.fusions++;
        S.stats.made.grafted = (S.stats.made.grafted || 0) + 1;
        event(S, "made", { side, recipe: "grafted", tid: t.id });
        return true;
      }
      function takeCard(p, pid) {
        const k = p.hand.findIndex((c) => c.pid === pid);
        if (k < 0) throw new Error("card not in hand " + pid);
        return p.hand.splice(k, 1)[0];
      }
      var THREE_ABILITIES = /* @__PURE__ */ new Set(["tinder", "hammer", "seal"]);
      var ESPALIER = [
        // R01 via Graft: rootstock first; 2 Breath paid by the Graft card; no catalyst
        { id: "esp_sp", out: "made.espalier", cost: 2, a: { thing: true, form: "life.sapling" }, b: { thing: true, form: "life.pear" } },
        { id: "esp_sa", out: "made.espalier", cost: 2, a: { thing: true, form: "life.sapling" }, b: { thing: true, form: "life.apple" } },
        { id: "esp_pa", out: "made.espalier", cost: 2, a: { thing: true, form: "life.pear" }, b: { thing: true, form: "life.apple" } },
        { id: "esp_ap", out: "made.espalier", cost: 2, a: { thing: true, form: "life.apple" }, b: { thing: true, form: "life.pear" } }
      ];
      var SHAPE3 = { "earth.copper": ["earth.hammer", "earth.signet3"], "earth.iron": ["earth.hammer"], "earth.silver": ["earth.signet3"] };
      function abSpec(S, t) {
        if (!t) return null;
        if (threeOn(S) && card(t).id === "earth.clay") return { id: "clayShield", cost: 1, sacrificeSelf: true };
        return card(t).ability || null;
      }
      var visibleThings = (S, side) => S.things.filter((t) => t.ctrl === side || !t.status.concealed);
      var isAsh = (t) => card(t).id === "token.ash";
      function shape3Why(S, side, t, to) {
        if (!t || t.ctrl !== side || t.owner !== side) return "choose a metal you own and control";
        const from = card(t).id;
        if (!SHAPE3[from]) return `only Copper or Iron can become a Hammer, and only Copper or Silver a Signet (this is ${nameOf(t)})`;
        if (to && !SHAPE3[from].includes(to)) return `${nameOf(t)} cannot be shaped into a ${to === "earth.hammer" ? "Hammer" : "Signet"}`;
        if (has(S, t, "fixed")) return `${nameOf(t)} is Fixed`;
        if (t.ladderTurn === S.players[side].personalTurn) return `${nameOf(t)} has already changed form this turn (one metal change per turn)`;
        if (to) {
          const st = BY_ID2[to].stand + modsOf(t).stand + (t.counters.bedrock || 0) + (t.g3 ? 2 : 0);
          if (st - t.damage <= 0) return `as a ${to === "earth.hammer" ? "Hammer" : "Signet"} (stand ${st}) it would break from its ${t.damage} damage`;
        }
        return null;
      }
      function igniteWhy(S, t) {
        if (!t) return "the target has left play";
        if (!prop(t, "flammable")) return `${nameOf(t)} does not burn`;
        if (t.status.wet) return `${nameOf(t)} is Wet${S.sky && card(S.sky).weather === "rain" ? " (Rain)" : ""} \u2014 dry it first (Drought)`;
        if ((t.status.burning || 0) >= 2) return `${nameOf(t)} is already burning`;
        return null;
      }
      function threePlays(S, side, c, d, mode) {
        const p = S.players[side], out = [], mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed);
        const main = mode === "main";
        switch (d.spell) {
          case "feast": {
            if (!main) return out;
            const hurt = mine.filter((t) => prop(t, "living") && t.damage > 0).map((t) => t.id);
            const heals = combos(hurt, 1, 2);
            for (const h of heals) out.push({ type: "spell", card: c.pid, targets: h });
            const fruits = mine.filter((o) => card(o).id === "token.fruit"), rdy = mine.filter((t) => t.exhausted && !t.fresh && !incapacitated(t) && !isAsh(t) && card(t).id !== "token.fruit");
            for (const f of fruits) for (const r of rdy) for (const h of [[]].concat(heals)) out.push({ type: "spell", card: c.pid, targets: h, sacrifice: f.id, ready: r.id });
            return out;
          }
          case "abundance":
            if (main) for (const tg of combos(mine.filter((t) => prop(t, "plant")).map((t) => t.id), 1, 2)) out.push({ type: "spell", card: c.pid, targets: tg });
            return out;
          case "graft3": {
            if (!main || p.fusedTurn === p.personalTurn) return out;
            for (const r of ESPALIER) for (const x of mine) for (const y of mine) if (x !== y && previewFusion(S, side, r, x, false, y, false)) out.push({ type: "spell", card: c.pid, recipe: r.id, a: x.id, b: y.id });
            return out;
          }
          case "shape3":
            if (main) {
              for (const t of mine) for (const to of SHAPE3[card(t).id] || []) if (!shape3Why(S, side, t, to)) out.push({ type: "spell", card: c.pid, target: t.id, branch: to });
            }
            return out;
          case "writ3": {
            if (!main) return out;
            const rdyFoes = foes.filter((t) => !t.exhausted);
            for (const f of rdyFoes.filter((t) => curStrike(S, t) <= 2)) out.push({ type: "spell", card: c.pid, target: f.id });
            for (const sg of mine.filter((t) => card(t).id === "earth.signet3" && canAct(S, t))) for (const ts of combos(rdyFoes.map((t) => t.id), 1, 2)) out.push({ type: "spell", card: c.pid, targets: ts, endorse: sg.id });
            return out;
          }
          case "dew": {
            for (const t of visibleThings(S, side).filter((t2) => !t2.status.wet)) out.push({ type: "spell", card: c.pid, target: t.id, mode: "wet" });
            for (const t of mine.filter((t2) => prop(t2, "living") && t2.damage > 0)) out.push({ type: "spell", card: c.pid, target: t.id, mode: "heal" });
            if (p.poison) out.push({ type: "spell", card: c.pid, target: "self", mode: "cleanse" });
            for (const t of mine.filter((t2) => prop(t2, "living") && t2.status.poison)) out.push({ type: "spell", card: c.pid, target: t.id, mode: "cleanse" });
            return out;
          }
          case "kindle": {
            for (const t of mine.filter((t2) => !igniteWhy(S, t2))) out.push({ type: "spell", card: c.pid, target: t.id, mode: "ignite" });
            for (const t of mine) out.push({ type: "spell", card: c.pid, target: t.id, mode: "fan" });
            return out;
          }
          case "calcine": {
            if (!main) return out;
            for (const sac of mine) for (const tg of ["rival"].concat(foes.map((f) => f.id))) for (const ash of [false, true]) out.push({ type: "spell", card: c.pid, target: tg, sacrifice: sac.id, ash });
            return out;
          }
          case "wildfire":
            if (main) for (const ts of combos(foes.map((t) => t.id), 1, 2)) out.push({ type: "spell", card: c.pid, targets: ts });
            return out;
          case "awaken":
            if (main) for (const t of mine.filter((t2) => !prop(t2, "living"))) out.push({ type: "spell", card: c.pid, target: t.id });
            return out;
        }
        return null;
      }
      function threeAbilityOptions(S, side) {
        const p = S.players[side], out = [], mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed);
        if (p.breath < 1) return out;
        for (const t of mine) {
          const id = card(t).id;
          if (trait(S, t, "carrier")) {
            for (const h of mine) if (h !== t && !pollinationWhy(S, t, h)) {
              if (!hasFruit(S, side) && freeSlot(S, side)) out.push({ type: "ability", subject: t.id, ability: "pollinate", target: h.id, branch: "fruit" });
              if (p.life < FORMAT.life) out.push({ type: "ability", subject: t.id, ability: "pollinate", target: h.id, branch: "life" });
              for (const m of mine.filter((o) => prop(o, "living") && o.damage > 0)) out.push({ type: "ability", subject: t.id, ability: "pollinate", target: h.id, branch: "mend", mend: m.id });
            }
          }
          if (id === "earth.clay" && !incapacitated(t)) for (const f of mine.filter((o) => o !== t && !o.shield3)) out.push({ type: "ability", subject: t.id, ability: "clayShield", target: f.id });
          if (id === "fire.tinder" && !incapacitated(t)) for (const f of visibleThings(S, side).filter((o) => o !== t && !igniteWhy(S, o))) out.push({ type: "ability", subject: t.id, ability: "tinder", target: f.id });
          if ((card(t).ability || {}).id === "hammer" && canAct(S, t)) {
            for (const f of foes.filter((o) => o.damage > 0)) out.push({ type: "ability", subject: t.id, ability: "hammer", target: f.id });
            if (enemy(S, side).ground) out.push({ type: "ability", subject: t.id, ability: "hammer", target: "ground" });
          }
          if (id === "earth.signet3" && canAct(S, t)) for (const f of mine.filter((o) => o !== t && !o.status.ward)) out.push({ type: "ability", subject: t.id, ability: "seal", target: f.id });
          if (prop(t, "metal") && t.damage > 0 && canAct(S, t) && p.ground && card(p.ground).id === "earth.crucible" && p.temperTurn !== p.personalTurn) out.push({ type: "ability", subject: t.id, ability: "temper" });
        }
        return out;
      }
      function resolveThreePollinate(S, n, sub, tg) {
        const a = n.act, side = n.side;
        const why = pollinationWhy(S, sub, tg, true);
        if (why) {
          event(S, "folio-failed", { why });
          return false;
        }
        if (a.branch === "fruit") {
          if (hasFruit(S, side) || !freeSlot(S, side)) {
            event(S, "folio-failed", { why: "no room or already a Fruit" });
            return false;
          }
          const f = createToken(S, side, "token.fruit");
          if (!f) return false;
          f.cropOf = tg.id;
          event(S, "pollinated", { carrier: sub.id, host: tg.id, fruit: f.id, branch: "fruit" });
          return true;
        }
        if (a.branch === "life") {
          gainLife(S, side, 2, "crop");
          event(S, "pollinated", { carrier: sub.id, host: tg.id, branch: "life" });
          return true;
        }
        const m = thingById(S, a.mend);
        if (!m || m.ctrl !== side || !prop(m, "living")) return false;
        heal(S, m, 2);
        event(S, "pollinated", { carrier: sub.id, host: tg.id, branch: "mend", tid: m.id });
        return true;
      }
      function resolveThreeAbility(S, n, tg) {
        const a = n.act, side = n.side, sub = thingById(S, a.subject);
        switch (a.ability) {
          case "clayShield":
            if (!tg || tg.ctrl !== side) return false;
            tg.shield3 = 3;
            event(S, "shield", { tid: tg.id });
            return true;
          case "tinder": {
            const why = igniteWhy(S, tg);
            if (why) {
              event(S, "ignite-failed", { tid: tg && tg.id, why });
              return false;
            }
            if (tg.ctrl !== side && wardBlocks(S, n, tg)) return true;
            const wasMine = tg.ctrl === side;
            if (!ignite(S, tg, side)) return false;
            if (wasMine && !S.things.some((o) => o.ctrl === side && isAsh(o))) createToken(S, side, "token.ash");
            return true;
          }
          case "hammer": {
            if (!sub || sub.ctrl !== side) return false;
            if (a.target === "ground") {
              const g = enemy(S, side).ground;
              if (!g) return false;
              g.damage = (g.damage || 0) + 2;
              return true;
            }
            if (!tg || tg.ctrl === side || !tg.damage) return false;
            if (wardBlocks(S, n, tg)) return true;
            damageThing(S, tg, 2);
            return true;
          }
          case "seal":
            if (!sub || !tg || tg === sub || tg.ctrl !== side || tg.status.ward) return false;
            tg.status.ward = true;
            event(S, "sealed-ward", { tid: tg.id });
            return true;
          case "temper":
            if (!sub || sub.ctrl !== side) return false;
            heal(S, sub, 2);
            return true;
        }
        return false;
      }
      function resolveThreeSpell(S, n, d, tg) {
        const side = n.side, a = n.act, p = S.players[side];
        switch (d.spell) {
          case "feast": {
            let did = false;
            for (const t of (a.targets || []).map((id) => thingById(S, id))) if (t && t.ctrl === side && prop(t, "living")) {
              heal(S, t, 2);
              did = true;
            }
            if (a.sacrifice && a.ready) {
              const r = thingById(S, a.ready);
              if (r && r.ctrl === side && r.exhausted && !incapacitated(r)) {
                r.exhausted = false;
                r.defOnly = true;
                event(S, "feast", { tid: r.id, defence: true });
                did = true;
              }
            }
            return did;
          }
          case "abundance": {
            const ps = (a.targets || []).map((id) => thingById(S, id)).filter((t) => t && t.ctrl === side && prop(t, "plant"));
            if (!ps.length) return false;
            for (const t of ps) addCounter(S, t, "growth");
            for (const t of ps) if (S.things.includes(t) && prop(t, "tree") && (t.counters.growth || 0) >= 2) {
              t.tempStrike = (t.tempStrike || 0) + 2;
              event(S, "abundance-strike", { tid: t.id });
            }
            return true;
          }
          case "graft3":
            return resolveFuse(S, { side, act: { recipe: a.recipe, a: a.a, b: a.b } });
          case "shape3": {
            if (shape3Why(S, side, tg, a.branch)) return false;
            transform(S, tg, a.branch);
            for (const q of (tg.quals || []).slice()) {
              const qd = BY_ID2[q.word].qual;
              if (qd.needsProp && !prop(tg, qd.needsProp)) {
                tg.quals = tg.quals.filter((x) => x !== q);
                toGrave(S, q, "retired");
              }
            }
            return true;
          }
          case "writ3": {
            if (n.endorsed) {
              const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl !== side && !t.status.concealed);
              if (!ts.length) return false;
              for (const t of ts) {
                if (ts.length === 1 && a.targets.length === 1 && wardBlocks(S, n, t)) continue;
                exhaust(t);
                event(S, "writ", { tid: t.id });
              }
              return true;
            }
            if (!tg || tg.ctrl === side || curStrike(S, tg) > 2) return false;
            if (wardBlocks(S, n, tg)) return true;
            exhaust(tg);
            event(S, "writ", { tid: tg.id });
            return true;
          }
          case "dew": {
            if (a.mode === "cleanse" && a.target === "self") {
              if (!p.poison) return false;
              p.poison--;
              return true;
            }
            if (!tg) return false;
            if (a.mode === "wet") {
              if (tg.ctrl !== side && wardBlocks(S, n, tg)) return true;
              tg.status.wet = true;
              delete tg.status.burning;
              return true;
            }
            if (tg.ctrl !== side || !prop(tg, "living")) return false;
            if (a.mode === "heal") {
              heal(S, tg, 2);
              return true;
            }
            if (tg.status.poison) tg.status.poison--;
            return true;
          }
          case "kindle": {
            if (!tg || tg.ctrl !== side) return false;
            if (a.mode === "ignite") {
              const why = igniteWhy(S, tg);
              if (why) {
                event(S, "ignite-failed", { tid: tg.id, why });
                say(S, `Kindle fails: ${why}.`);
                return false;
              }
              return ignite(S, tg, side);
            }
            tg.tempStrike = (tg.tempStrike || 0) + 1;
            tg.kindled = true;
            return true;
          }
          case "calcine": {
            if (a.target === "rival") loseLife(S, 1 - side, 3, "calcine");
            else {
              if (!tg || tg.ctrl === side) return false;
              if (wardBlocks(S, n, tg)) return true;
              damageThing(S, tg, 3);
            }
            if (a.ash && !S.things.some((o) => o.ctrl === side && isAsh(o))) createToken(S, side, "token.ash");
            return true;
          }
          case "wildfire": {
            const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl !== side);
            if (!ts.length) return false;
            const hits = ts.map((t) => [t, t.status.burning ? 3 : 1]);
            for (const [t, k] of hits) damageThing(S, t, k);
            return true;
          }
        }
        return false;
      }
      function espalierUpkeep(S, p, t) {
        const opts = [];
        if (!hasFruit(S, p.i) && freeSlot(S, p.i)) opts.push("fruit");
        for (const o of S.things.filter((o2) => o2 !== t && o2.ctrl === p.i && prop(o2, "plant") && (o2.counters.growth || 0) < FORMAT.growthCap && !o2.status.measured)) opts.push(o.id);
        if (!opts.length) {
          event(S, "espalier", { tid: t.id, did: "nothing" });
          return;
        }
        const k = decide(S, p.i, "espalier", opts, 0), pick = opts[k];
        if (pick === "fruit") {
          const f = createToken(S, p.i, "token.fruit");
          if (f) f.cropOf = t.id;
          event(S, "espalier", { tid: t.id, did: "fruit" });
        } else {
          addCounter(S, thingById(S, pick), "growth");
          event(S, "espalier", { tid: t.id, did: "growth", to: pick });
        }
      }
      var folioOn = (S, m) => !!(S.rules.modules && S.rules.modules.includes(m));
      var coreOn = (S) => !!(S.rules.modules && S.rules.modules.includes("core"));
      var threeOn = (S) => !!(S.rules.modules && S.rules.modules.includes("three"));
      var core33 = (S) => coreOn(S) && !threeOn(S);
      var exchangeOn = (S) => !!(S.rules.modules && S.rules.modules.includes("exchange"));
      function combatants(S, side) {
        return S.things.filter((t) => t.ctrl === side && canAct(S, t) && caps(S, t).has("strike") && curStrike(S, t) > 0 && perm(S, t, "strike"));
      }
      function coreOptions(S, side) {
        const p = S.players[side], out = [];
        if (p.combatTurn !== p.personalTurn) {
          const ids = combatants(S, side).map((t) => t.id);
          for (const g of combos(ids, 1, ids.length)) out.push({ type: "combat", attackers: g });
        }
        if (p.studyTurn !== p.personalTurn && p.breath >= CORE.studyCost && p.deck.length && p.hand.length < FORMAT.handCap) out.push({ type: "study" });
        if (exchangeOn(S) && p.studyTurn !== p.personalTurn && p.breath >= CORE.studyCost && p.deck.length && p.hand.length >= FORMAT.handCap) for (const c of p.hand) out.push({ type: "study", discard: c.pid });
        return out;
      }
      var CORE = { studyCost: 2 };
      function trait(S, t, k) {
        const c = card(t);
        if (c.folio && !folioOn(S, c.folio)) return void 0;
        if (c[k] !== void 0) return c[k];
        for (const m of S.rules.modules || []) {
          const o = OVERLAYS[m] && OVERLAYS[m][c.id];
          if (o && o[k] !== void 0) return o[k];
        }
        return void 0;
      }
      var FOLIO_RECIPES = [
        { id: "set", out: "made.signet", cost: 2, a: { thing: true, form: "earth.setting" }, b: { thing: true, props: ["jewel"] }, module: "workshop" }
      ];
      var SHAPEABLE = ["earth.copper", "earth.silver"];
      var hasFruit = (S, side) => S.things.some((o) => o.ctrl === side && card(o).id === "token.fruit");
      var freeSlot = (S, side, id) => hasRoom(S, side, id || "token.fruit");
      var wingFlight = (S, t) => has(S, t, "flying") && prop(t, "winged");
      function pollinationWhy(S, carrier, host, resolving) {
        const side = carrier ? carrier.ctrl : S.active;
        if (!folioOn(S, "orchard")) return "pollination is not part of this format";
        if (!carrier) return "the carrier has left play";
        const ch = trait(S, carrier, "carrier");
        if (!ch) return `${nameOf(carrier)} carries no pollen: only an insect (Bee) or the wind (Wind) can pollinate`;
        if (!host || host.ctrl !== side) return "choose one of your own trees";
        const want = trait(S, host, "pollination");
        if (!want || !prop(host, "orchard") || !prop(host, "flower")) return `${nameOf(host)} is not a flowering Orchard tree`;
        if (want !== ch) return `${nameOf(host)} is ${want}-pollinated; ${nameOf(carrier)} carries pollen by ${ch === "insect" ? "insect" : "wind"}`;
        if (ch === "insect" && !wingFlight(S, carrier)) return `${nameOf(carrier)} needs working wings to pollinate${carrier.status.wet ? " (it is Wet)" : S.sky && card(S.sky).weather === "desert" ? " (Desert grounds winged flight)" : ""}`;
        if (!resolving) {
          if (!canAct(S, carrier)) return `${nameOf(carrier)} must be mature and ready (it is ${carrier.exhausted ? "exhausted" : carrier.fresh ? "Fresh" : incapacitated(carrier) ? "unable to act" : "out of actions"})`;
          if (S.players[side].breath < 1) return "pollinating costs 1 breath";
        } else if (incapacitated(carrier)) return `${nameOf(carrier)} cannot act`;
        if (threeOn(S)) {
          if (!resolving && S.players[side].pollTurn === S.players[side].personalTurn) return "you have already pollinated this turn (Bee and Wind share one attempt)";
          return null;
        }
        if (hasFruit(S, side)) return "you already have a Fruit";
        if (!freeSlot(S, side)) return "no empty field space for the Fruit";
        return null;
      }
      function shapeWhy(S, side, t) {
        if (!t || t.ctrl !== side || t.owner !== side) return "choose a metal you own and control";
        if (!SHAPEABLE.includes(card(t).id)) return `only Copper or Silver can be worked into a Setting (${nameOf(t)} is ${card(t).id.split(".")[1]})`;
        if (has(S, t, "fixed")) return `${nameOf(t)} is Fixed`;
        if (t.ladderTurn === S.players[side].personalTurn) return `${nameOf(t)} has already changed form this turn`;
        const st = BY_ID2["earth.setting"].stand + modsOf(t).stand + (t.counters.bedrock || 0) + (t.tempStand || 0);
        if (st - t.damage <= 0) return `as a Setting (stand ${st}) it would die from its ${t.damage} damage`;
        return null;
      }
      var nameOf = (t) => {
        const w = String(t.form || t.word || "").split(".").pop();
        return w.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
      };
      var feastable = (S, t) => t.exhausted && prop(t, "living") && prop(t, "body") && curStrike(S, t) > 0 && !incapacitated(t) && !(t.fresh && !has(S, t, "swift")) && t.actions < 2;
      var mouldSeals = (S, side) => S.players[side].grave.filter((g) => (BY_ID2[g.word].props || []).includes("plant") && ["destroyed", "sacrificed"].includes(g.reason) && !BY_ID2[g.word].token);
      var mouldTargets = (S, side, m) => S.things.filter((t) => t.ctrl === side && t !== m && prop(t, "plant") && ((t.counters.growth || 0) < FORMAT.growthCap && !t.status.measured || plantNext(S, t)));
      function abilityCost(S, t, id) {
        return id === "shapeWork" || id === "shapeStart" ? 2 : id === "pollinate" || id === "bear" || id === "visit" ? 1 : (card(t).ability || {}).cost || 1;
      }
      function folioPlays(S, side, c, d) {
        const out = [], mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed);
        if (d.spell === "feast") {
          const tg = mine.filter((t) => feastable(S, t)).map((t) => t.id);
          for (const f of mine.filter((o) => card(o).id === "token.fruit")) for (const ts of combos(tg, 1, 2)) out.push({ type: "spell", card: c.pid, sacrifice: f.id, targets: ts });
        }
        if (d.spell === "shape") {
          for (const t of mine) if (!shapeWhy(S, side, t) && (!folioOn(S, "clife") || canStartProcess(S, side))) out.push({ type: "spell", card: c.pid, target: t.id });
        }
        if (d.spell === "writ") {
          for (const f of foes.filter((t) => !t.exhausted && (prop(t, "person") || prop(t, "speaker")))) out.push({ type: "spell", card: c.pid, target: f.id });
          for (const sg of mine.filter((t) => card(t).id === "made.signet" && canAct(S, t))) for (const ts of combos(foes.filter((t) => !t.exhausted).map((t) => t.id), 1, 2)) out.push({ type: "spell", card: c.pid, targets: ts, endorse: sg.id });
        }
        return out;
      }
      function folioAbilityOptions(S, side) {
        const p = S.players[side], out = [], mine = S.things.filter((t) => t.ctrl === side);
        for (const t of mine) {
          if (folioOn(S, "orchard") && !folioOn(S, "clife") && !threeOn(S) && trait(S, t, "carrier")) {
            for (const h of mine) if (h !== t && !pollinationWhy(S, t, h)) out.push({ type: "ability", subject: t.id, ability: "pollinate", target: h.id });
          }
          if (!canAct(S, t)) continue;
          const ab = trait(S, t, "ability") || {};
          if (ab.id === "shapeWork" && p.breath >= 2 && !folioOn(S, "clife")) {
            for (const m of mine) if (m !== t && !shapeWhy(S, side, m)) out.push({ type: "ability", subject: t.id, ability: "shapeWork", target: m.id });
          }
          if (ab.id === "signet" && p.breath >= 1) for (const f of mine.filter((o) => isOriginal(o) && !o.status.named)) out.push({ type: "ability", subject: t.id, ability: "signet", target: f.id });
          if (ab.id === "mould" && p.breath >= 1) {
            const seals = mouldSeals(S, side);
            for (const f of mouldTargets(S, side, t)) for (const g of seals) out.push({ type: "ability", subject: t.id, ability: "mould", target: f.id, seal: "g:" + g.pid });
          }
        }
        return out;
      }
      function resolveFolioAbility(S, n, tg) {
        const a = n.act, side = n.side, sub = thingById(S, a.subject);
        if (!sub || sub.ctrl !== side) return false;
        switch (a.ability) {
          case "pollinate": {
            if (threeOn(S)) return resolveThreePollinate(S, n, sub, tg);
            const why = pollinationWhy(S, sub, tg, true);
            if (why) {
              event(S, "folio-failed", { why });
              return false;
            }
            const f = createToken(S, side, "token.fruit");
            if (!f) return false;
            f.cropOf = tg.id;
            event(S, "pollinated", { carrier: sub.id, host: tg.id, fruit: f.id });
            return true;
          }
          case "shapeWork": {
            if (incapacitated(sub)) return false;
            const why = shapeWhy(S, side, tg);
            if (why) return false;
            toSetting(S, tg);
            return true;
          }
          case "signet":
            if (!tg || tg.ctrl !== side || !isOriginal(tg) || tg.status.named) return false;
            tg.status.named = true;
            event(S, "signet-named", { tid: tg.id });
            return true;
          case "mould": {
            if (incapacitated(sub) || !tg || tg.ctrl !== side || !prop(tg, "plant")) return false;
            let did = false;
            if ((tg.counters.growth || 0) < FORMAT.growthCap && addCounter(S, tg, "growth")) did = true;
            if (plantNext(S, tg)) {
              ageUp(S, tg);
              did = true;
            }
            return did;
          }
        }
        return false;
      }
      function toSetting(S, t) {
        transform(S, t, "earth.setting");
        for (const q of (t.quals || []).slice()) {
          const qd = BY_ID2[q.word].qual;
          if (qd.needsProp && !prop(t, qd.needsProp)) {
            t.quals = t.quals.filter((x) => x !== q);
            toGrave(S, q, "retired");
          }
        }
      }
      function resolveFolioSpell(S, n, d, tg) {
        const side = n.side, a = n.act, p = S.players[side];
        if (d.spell === "feast") {
          const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl === side && feastable(S, t));
          if (!ts.length) return false;
          for (const t of ts) {
            t.exhausted = false;
            t.feastTurn = p.personalTurn;
            event(S, "feast", { tid: t.id });
          }
          return true;
        }
        if (d.spell === "shape") {
          if (shapeWhy(S, side, tg)) return false;
          if (folioOn(S, "clife")) return openProcess(S, side, "shape", [tg.id], tg.id);
          toSetting(S, tg);
          return true;
        }
        if (d.spell === "writ") {
          if (n.endorsed) {
            const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl !== side && !t.status.concealed);
            if (!ts.length) return false;
            for (const t of ts) {
              if (ts.length === 1 && a.targets.length === 1 && wardBlocks(S, n, t)) continue;
              exhaust(t);
              event(S, "writ", { tid: t.id });
            }
            return true;
          }
          if (!tg || tg.ctrl === side || !(prop(tg, "person") || prop(tg, "speaker"))) return false;
          if (wardBlocks(S, n, tg)) return true;
          exhaust(tg);
          event(S, "writ", { tid: tg.id });
          return true;
        }
        return false;
      }
      function canStartProcess(S, side) {
        const p = S.players[side];
        return !(S.processes || []).some((x) => x.owner === side && x.open) && p.processStartTurn !== p.personalTurn;
      }
      function processOptions(S, side) {
        const p = S.players[side], out = [], mine = S.things.filter((t) => t.ctrl === side);
        const open = (S.processes || []).find((x) => x.owner === side && x.open);
        if (open) {
          out.push({ type: "abandon" });
          if (p.personalTurn >= open.earliest && p.breath >= 1) out.push({ type: "complete" });
          return out;
        }
        if (!canStartProcess(S, side)) return out;
        for (const t of mine.filter((t2) => canAct(S, t2))) {
          if (trait(S, t, "carrier") && p.breath >= 1) {
            for (const h of mine) if (h !== t && !pollinationWhy(S, t, h)) out.push({ type: "ability", subject: t.id, ability: "bear", target: h.id });
          }
          if ((trait(S, t, "ability") || {}).id === "shapeWork" && p.breath >= 2) {
            for (const m of mine) if (m !== t && !shapeWhy(S, side, m)) out.push({ type: "ability", subject: t.id, ability: "shapeStart", target: m.id });
          }
        }
        return out;
      }
      function openProcess(S, side, family, inputs, output) {
        const p = S.players[side];
        S.processes = S.processes || [];
        if (!canStartProcess(S, side)) return false;
        const pr = { id: "pr" + ++S.seq, family, owner: side, inputs: inputs.map((id) => ({ id, form: card(thingById(S, id)).id, ctrl: side })), output, start: p.personalTurn, earliest: p.personalTurn + 1, open: true };
        if (family === "shape") thingById(S, output).ladderTurn = p.personalTurn;
        S.processes.push(pr);
        p.processStartTurn = p.personalTurn;
        event(S, "process-start", { pid: pr.id, family, owner: side, inputs: pr.inputs.map((x) => x.id) });
        return true;
      }
      function resolveProcessStart(S, n, tg) {
        const a = n.act, side = n.side, sub = thingById(S, a.subject);
        if (!sub || sub.ctrl !== side) return false;
        if (a.ability === "bear") {
          const why = pollinationWhy(S, sub, tg, true);
          if (why) return false;
          return openProcess(S, side, "bear", [sub.id, tg.id], tg.id);
        }
        if (a.ability === "shapeStart") {
          if (incapacitated(sub) || shapeWhy(S, side, tg)) return false;
          return openProcess(S, side, "shape", [sub.id, tg.id], tg.id);
        }
        return false;
      }
      function closeProcess(S, side, why) {
        for (const pr of (S.processes || []).filter((x) => x.owner === side && x.open)) {
          pr.open = false;
          pr.closed = why;
          event(S, "process-" + why, { pid: pr.id, family: pr.family });
        }
      }
      function checkProcesses(S) {
        for (const pr of S.processes.filter((x) => x.open)) for (const inp of pr.inputs) {
          const t = thingById(S, inp.id);
          if (!t || t.ctrl !== inp.ctrl || card(t).id !== inp.form) {
            pr.open = false;
            pr.closed = "broken";
            event(S, "process-broken", { pid: pr.id, family: pr.family, input: inp.id, why: !t ? "left" : t.ctrl !== inp.ctrl ? "control" : "form" });
            break;
          }
        }
      }
      function completeProcess(S, n) {
        const side = n.side, p = S.players[side], pr = (S.processes || []).find((x) => x.owner === side && x.open);
        if (!pr) return false;
        pr.open = false;
        const ins = pr.inputs.map((x) => thingById(S, x.id));
        let ok = false;
        if (pr.family === "bear") {
          const [c, h] = ins;
          ok = !pollinationWhy(S, c, h, true);
          if (ok) {
            const f = createToken(S, side, "token.fruit");
            ok = !!f;
            if (f) {
              f.cropOf = h.id;
              f.bornOf = "bear";
            }
          }
        }
        if (pr.family === "shape") {
          const m = ins[ins.length - 1], actor = ins.length > 1 ? ins[0] : null;
          ok = !!m && !shapeWhy(S, side, m) && !(actor && incapacitated(actor));
          if (ok) toSetting(S, m);
        }
        pr.closed = ok ? "completed" : "failed";
        event(S, ok ? "process-completed" : "process-failed", { pid: pr.id, family: pr.family });
        return ok;
      }
      function folioWhy(S, act) {
        const p = S.players[S.active];
        if (act.type === "ability" && act.ability === "pollinate") return pollinationWhy(S, thingById(S, act.subject), thingById(S, act.target));
        if (act.type === "ability" && act.ability === "shapeWork" || act.card && p.hand.some((c) => c.pid === act.card && card(c).spell === "shape")) return shapeWhy(S, p.i, thingById(S, act.target));
        return null;
      }
      var V32_MODS = /* @__PURE__ */ new Set(["visit", "visit_draw", "heat", "w5"]);
      var SUPPLY_OK = /* @__PURE__ */ new Set(["earth.clay", "earth.copper", "earth.silver", "earth.garnet", "earth.setting", "made.signet", "token.fruit", "token.cider"]);
      function capGeneral(S) {
        const m = S.rules.modules || [];
        return m.includes("cap6") ? 6 : m.includes("supply4") ? 4 : FORMAT.slots;
      }
      function capSupply(S) {
        const m = S.rules.modules || [];
        return m.includes("supply") || m.includes("supply4") ? 1 : 0;
      }
      function capTotal(S) {
        return capGeneral(S) + capSupply(S);
      }
      function hasRoom(S, side, id) {
        const mine = S.things.filter((t) => t.ctrl === side);
        if (!capSupply(S)) return mine.length < capGeneral(S);
        const sup = mine.filter((t) => t.supply).length, gen = mine.length - sup;
        return gen < capGeneral(S) || sup < capSupply(S) && (id == null || SUPPLY_OK.has(id));
      }
      function assignSpaces(S) {
        if (!capSupply(S)) return;
        for (const side of [0, 1]) {
          const mine = S.things.filter((t) => t.ctrl === side);
          for (const t of mine) {
            if (t.supply && !SUPPLY_OK.has(card(t).id)) {
              const gen = mine.filter((o) => !o.supply).length;
              if (gen < capGeneral(S)) {
                t.supply = false;
                t.displaced = false;
                event(S, "space-move", { tid: t.id });
              } else if (!t.displaced) {
                t.displaced = true;
                event(S, "displaced", { tid: t.id });
              }
            } else if (t.displaced && SUPPLY_OK.has(card(t).id)) t.displaced = false;
          }
          for (const t of mine.filter((t2) => t2.supply === void 0)) {
            const gen = mine.filter((o) => o.supply === false).length;
            t.supply = gen >= capGeneral(S) && SUPPLY_OK.has(card(t).id);
          }
        }
      }
      var R_ROWS = {
        rfruit: { "token.fruit": [0, 0, 0] },
        r6: { "life.wolf": [1, 1, 1], "life.bee": [0, 0, 0], "life.oak": [0, 1, 0], "earth.silver": [0, 0, 0], "earth.garnet": [0, 0, 0], "token.fruit": [0, 0, 0] },
        rext: { "fire.smith": [0, 0, 0], "word.scribe": [0, 0, 0], "life.pear": [0, 0, 0], "life.hazel": [0, 0, 0], "rot.mould": [0, 0, 0], "earth.copper": [0, 0, 0], "earth.setting": [0, 0, 0], "made.signet": [0, 0, 0], "air.wind": [0, 0, 0] }
      };
      var PERM_K = { strike: 0, intercept: 1, retaliate: 2 };
      function rowFor(S, id) {
        const m = S.rules.modules || [];
        let row2;
        if (m.includes("rfruit") || m.includes("r6") || m.includes("rext")) row2 = R_ROWS.rfruit[id];
        if (m.includes("r6") || m.includes("rext")) row2 = R_ROWS.r6[id] || row2;
        if (m.includes("rext")) row2 = R_ROWS.rext[id] || row2;
        return row2;
      }
      function perm(S, t, k) {
        if (!S.rules.modules || !S.rules.modules.length) return true;
        if ((t.extraProps || []).includes("body") && t.counters.might) return true;
        const row2 = rowFor(S, card(t).id);
        return row2 ? !!row2[PERM_K[k]] : true;
      }
      function permWhy(S, t) {
        const row2 = rowFor(S, card(t).id);
        if (!row2 || (t.extraProps || []).includes("body") && t.counters.might) return null;
        const no = Object.keys(PERM_K).filter((k) => !row2[PERM_K[k]]);
        return no.length ? `under the role overlay ${card(t).id.split(".")[1]} cannot ${no.join(", ")}` : null;
      }
      function invitationWhy(S, side, kind, hostId) {
        const p = S.players[side];
        if (kind === "orchard") {
          if (!(folioOn(S, "visit") || folioOn(S, "visit_draw"))) return "visiting orchards is not part of this format";
          const h = thingById(S, hostId);
          if (!h || h.ctrl !== side || h.owner !== side || h.status.concealed) return "open one of your own visible trees";
          if (trait(S, h, "pollination") !== "insect" || !prop(h, "orchard")) return `${nameOf(h)} is not insect-pollinated, so a visiting Bee could not use it`;
          if (hasFruit(S, side)) return "you already have a Fruit, so a visit could not make one";
          if (!hasRoom(S, side, "token.fruit")) return "you have no free space for the Fruit a visit would make";
          return null;
        }
        if (kind === "heat") {
          if (!folioOn(S, "heat")) return "lending heat is not part of this format";
          if (!p.ground || !["fire.fire", "fire.torch"].includes(p.ground.word)) return "you need Fire or Torch as your Ground to lend heat";
          return null;
        }
        return "unknown invitation";
      }
      function openInvitation(S, p) {
        const plan = p.invitePlan;
        p.invitePlan = null;
        if (invitationWhy(S, p.i, plan.kind, plan.host)) {
          event(S, "invite-void", { side: p.i, kind: plan.kind });
          return;
        }
        S.invites = (S.invites || []).filter((x) => x.owner !== p.i);
        const inv = { id: "inv" + ++S.seq, kind: plan.kind, owner: p.i, host: plan.kind === "orchard" ? plan.host : null, groundPid: plan.kind === "heat" ? p.ground.pid : null };
        S.invites.push(inv);
        event(S, "invite-open", { side: p.i, kind: inv.kind, host: inv.host });
      }
      var openInvite = (S, owner, kind) => (S.invites || []).find((x) => x.owner === owner && x.kind === kind);
      function visitWhy(S, side, bee, host) {
        const p = S.players[side], inv = host && openInvite(S, host.ctrl, "orchard");
        if (!bee || bee.ctrl !== side) return "choose your own Bee";
        if (trait(S, bee, "carrier") !== "insect") return `${nameOf(bee)} is not an insect carrier`;
        if (!wingFlight(S, bee)) return `${nameOf(bee)} needs working wings to visit${bee.status.wet ? " (it is Wet)" : ""}`;
        if (!canAct(S, bee)) return `${nameOf(bee)} must be mature and ready`;
        if (!host || host.ctrl === side) return "a visit goes to the rival's orchard";
        if (!inv || inv.host !== host.id) return `the rival has not opened ${nameOf(host)} to visitors`;
        if (hasFruit(S, host.ctrl)) return "the host already has a Fruit";
        if (!hasRoom(S, host.ctrl, "token.fruit")) return "the host has no room for the Fruit";
        if (p.deck.length < 2) return "you need at least two cards in your deck to read";
        if (folioOn(S, "visit_draw") && p.hand.length >= FORMAT.handCap) return "your hand is full, so you could not draw";
        if (p.visitTurn === p.personalTurn) return "you have already tried a visit this turn";
        if (p.breath < 1) return "a visit costs 1 breath";
        return null;
      }
      function hotworkWhy(S, side, metal) {
        const p = S.players[side], inv = openInvite(S, 1 - side, "heat"), host = S.players[1 - side];
        if (!inv) return "the rival has not offered its heat";
        if (!host.ground || host.ground.pid !== inv.groundPid) return "the offered heat source is gone";
        if (p.hotworkTurn === p.personalTurn) return "you have already borrowed heat this turn";
        if (p.spark < 1) return "borrowing heat pays the host 1 spark; you have none";
        if (host.spark >= FORMAT.sparkCap) return "the host already holds 5 spark and cannot take the fee";
        if (p.breath < 1) return "borrowing heat costs 1 breath";
        return shapeWhy(S, side, metal);
      }
      function v32Options(S, side) {
        const p = S.players[side], out = [], mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side && !t.status.concealed);
        if (!p.invitePlan) {
          if (folioOn(S, "visit") || folioOn(S, "visit_draw")) {
            for (const h of mine) if (!invitationWhy(S, side, "orchard", h.id)) out.push({ type: "invite", kind: "orchard", host: h.id });
          }
          if (folioOn(S, "heat") && !invitationWhy(S, side, "heat")) out.push({ type: "invite", kind: "heat" });
        }
        if (folioOn(S, "visit") || folioOn(S, "visit_draw")) {
          for (const b of mine) for (const h of foes) if (!visitWhy(S, side, b, h)) out.push({ type: "ability", subject: b.id, ability: "visit", target: h.id });
        }
        if (folioOn(S, "heat")) {
          for (const m of mine) if (!hotworkWhy(S, side, m)) out.push({ type: "hotwork", target: m.id });
        }
        if (folioOn(S, "w5")) for (const c of w5Claims(S, side)) out.push(c);
        return out;
      }
      function resolveVisit(S, n, host) {
        const side = n.side, bee = thingById(S, n.act.subject), p = S.players[side];
        if (!bee || bee.ctrl !== side || !wingFlight(S, bee)) return false;
        if (!host || host.ctrl === side) return false;
        const inv = openInvite(S, host.ctrl, "orchard");
        if (!inv || inv.host !== host.id) return false;
        if (hasFruit(S, host.ctrl) || !hasRoom(S, host.ctrl, "token.fruit")) return false;
        S.invites = S.invites.filter((x) => x !== inv);
        const f = createToken(S, host.ctrl, "token.fruit");
        if (!f) return false;
        f.cropOf = host.id;
        f.visitedBy = bee.id;
        event(S, "visited", { visitor: side, bee: bee.id, host: host.id, fruit: f.id });
        if (folioOn(S, "visit_draw")) drawCard(S, p);
        else if (p.deck.length >= 2) {
          const top = p.deck.slice(-2).reverse(), orders = [[0, 1], [1, 0]];
          const k = decide(S, side, "reorder", orders.map((o) => o.map((i) => top[i].word)), 0);
          const pick = orders[k] || orders[0];
          const newTop = pick.map((i) => top[i]);
          p.deck.splice(-2, 2, newTop[1], newTop[0]);
        }
        return true;
      }
      function declareHotwork(S, p, act, node) {
        const host = S.players[1 - p.i], inv = openInvite(S, host.i, "heat");
        p.hotworkTurn = p.personalTurn;
        p.spark -= 1;
        host.spark = Math.min(FORMAT.sparkCap, host.spark + 1);
        S.stats.res[p.i].sparkSpent = (S.stats.res[p.i].sparkSpent || 0) + 1;
        S.stats.res[host.i].sparkGained = (S.stats.res[host.i].sparkGained || 0) + 1;
        S.invites = S.invites.filter((x) => x !== inv);
        node.groundPid = inv.groundPid;
        event(S, "heat-fee", { from: p.i, to: host.i });
      }
      function resolveHotwork(S, n) {
        const side = n.side, host = S.players[1 - side], m = thingById(S, n.act.target);
        if (!host.ground || host.ground.pid !== n.groundPid) {
          event(S, "folio-failed", { why: "the heat source is gone" });
          return false;
        }
        if (shapeWhy(S, side, m)) return false;
        toSetting(S, m);
        event(S, "hotworked", { side, tid: m.id });
        return true;
      }
      function w5Chain(t) {
        if (card(t).id !== "made.world_tree" || !t.lineage) return false;
        const life = t.lineage.find((r) => r.made && r.form === "made.life");
        if (!life) return false;
        return (life.lineage || []).some((r) => r.made && r.form === "made.swamp");
      }
      function w5Why(S, side, tree, ben) {
        const p = S.players[side];
        if (!folioOn(S, "w5")) return "the World Tree work is not part of this format";
        if (!tree || card(tree).id !== "made.world_tree") return "you need a World Tree";
        if (tree.ctrl !== side || tree.owner !== side) return "the World Tree must be yours";
        if (!w5Chain(tree)) return "this World Tree was not grown from Clay + Water (Swamp) and Seed (Life)";
        if (!(tree.wtGrants || []).length) return "the World Tree has not yet given Growth at your upkeep";
        if (!ben || ben === tree || ben.ctrl !== side || !prop(ben, "living")) return "choose the friendly Living Thing it grew";
        if (!(tree.wtGrants || []).includes(ben.id)) return `the World Tree has never given Growth to ${nameOf(ben)}`;
        if (!(ben.counters.growth >= 1)) return `${nameOf(ben)} no longer bears Growth`;
        if ((S.claims || []).some((c) => c.owner === side && c.open)) return "you already have a work in progress";
        if (p.claimTurn === p.personalTurn) return "you have already declared a work this turn";
        if (p.breath < 2) return "declaring the work costs 2 breath";
        return null;
      }
      function w5Claims(S, side) {
        const out = [], mine = S.things.filter((t) => t.ctrl === side);
        for (const tr of mine.filter((t) => card(t).id === "made.world_tree")) for (const b of mine) if (!w5Why(S, side, tr, b)) out.push({ type: "claim", work: "w5", tree: tr.id, target: b.id });
        return out;
      }
      function resolveClaim(S, n) {
        const side = n.side, tree = thingById(S, n.act.tree), ben = thingById(S, n.act.target), p = S.players[side];
        const save2 = p.claimTurn;
        p.claimTurn = -1;
        const bre = p.breath;
        p.breath = Math.max(p.breath, 2);
        const why = w5Why(S, side, tree, ben);
        p.claimTurn = save2;
        p.breath = bre;
        if (why) {
          event(S, "claim-failed", { side, why });
          return false;
        }
        S.claims = (S.claims || []).concat({ id: "cl" + ++S.seq, work: "w5", owner: side, tree: tree.id, ben: ben.id, start: p.personalTurn, earliest: p.personalTurn + 1, open: true });
        event(S, "claim-declared", { side, work: "w5", tree: tree.id, ben: ben.id });
        return true;
      }
      function v32StateCheck(S) {
        assignSpaces(S);
        if (S.invites) S.invites = S.invites.filter((inv) => {
          if (inv.kind === "orchard") {
            const h = thingById(S, inv.host);
            if (!h || h.ctrl !== inv.owner || h.status.concealed) {
              event(S, "invite-cancelled", { side: inv.owner });
              return false;
            }
          }
          if (inv.kind === "heat") {
            const g = S.players[inv.owner].ground;
            if (!g || g.pid !== inv.groundPid) {
              event(S, "invite-cancelled", { side: inv.owner });
              return false;
            }
          }
          return true;
        });
        for (const c of (S.claims || []).filter((c2) => c2.open)) {
          const tree = thingById(S, c.tree), ben = thingById(S, c.ben);
          const why = !tree || tree.ctrl !== c.owner ? "the World Tree left" : !ben || ben.ctrl !== c.owner ? "the beneficiary left" : !(ben.counters.growth >= 1) ? "the beneficiary lost its Growth" : card(tree).id !== "made.world_tree" ? "the World Tree changed form" : null;
          if (why) {
            c.open = false;
            c.closed = "broken";
            event(S, "claim-broken", { side: c.owner, why });
          }
        }
      }
      function v32StartOfMain(S) {
        const p = S.players[S.active];
        for (const c of (S.claims || []).filter((c2) => c2.open && c2.owner === p.i && p.personalTurn >= c2.earliest)) {
          v32StateCheck(S);
          if (!c.open || S.over != null) continue;
          c.open = false;
          c.closed = "completed";
          S.over = p.i;
          S.overCause = "work";
          event(S, "work-completed", { side: p.i, work: c.work });
          say(S, `P${p.i} completes the World Tree work.`);
        }
      }
      function normCtl(ctl) {
        if (typeof ctl === "function") return { block: ctl, respond: null };
        return ctl || {};
      }
      function declare(S, act, side, kind, ctl) {
        const p = S.players[side];
        const node = { type: act.type, side, kind, act, card: null, cancelled: false };
        let d = null;
        if (act.card) {
          node.card = takeCard(p, act.card);
          d = card(node.card);
          node.cardUsed = true;
          node.cardPid = node.card.pid;
        }
        let cost = d ? S.rules.costOverride && S.rules.costOverride[d.id] || d.cost : act.type === "attack" ? S.rules.freeStrike ? 0 : 1 : 0;
        if (act.type === "fuse") cost = 0;
        if (act.type === "complete" || act.type === "hotwork") cost = 1;
        if (act.type === "claim") cost = 2;
        if (act.type === "ability") cost = abilityCost(S, thingById(S, act.subject), act.ability);
        if (act.type === "ability" && act.ability === "temper") cost = 1;
        if (act.type === "law") {
          node.extra = [takeCard(p, act.category), takeCard(p, act.qual)];
          cost += node.extra.reduce((a, c) => a + card(c).cost, 0);
          node.totalCost = cost;
        }
        const courage = act.type === "attack" && S.arithmetic === "legacy" && p.life <= 8 && kind === "main";
        if (courage) cost = 0;
        if (kind !== "main" && d && S.rules.responseDiscount && S.rules.responseDiscount[d.id]) cost = Math.max(1, cost - S.rules.responseDiscount[d.id]);
        if (kind === "response") {
          if (cost > p.reserve) throw new Error("reserve");
          p.reserve -= cost;
          S.stats.res[side].reserveUsed += cost;
        } else {
          if (cost > p.breath) throw new Error("cannot afford");
          p.breath -= cost;
          S.stats.res[side].breathSpent += cost;
        }
        if (node.card) {
          const pl = S.stats.res[side].played;
          pl[node.card.word] = (pl[node.card.word] || 0) + 1;
          if (/^m/.test(node.card.pid)) S.stats.res[side].boughtPlayed = (S.stats.res[side].boughtPlayed || 0) + 1;
        }
        for (const id of [act.subject, act.payload, act.type === "fuse" ? act.a : null, act.type === "fuse" ? act.b : null].concat(act.targets && act.type === "spell" && d && d.spell === "squall" ? act.targets : [])) {
          const t = id && id !== "ground" && thingById(S, id);
          if (t && t.status.concealed) reveal(S, t);
        }
        if (act.type === "fuse") {
          const recipe = recipeById(act.recipe), a = refObj(S, side, act.a), b = refObj(S, side, act.b);
          const pv = previewFusion(S, side, recipe, a, act.a === "ground", b, act.b === "ground");
          if (pv.cost > p.breath) throw new Error("cannot afford");
          p.breath -= pv.cost;
          node.paid = pv.cost;
          S.stats.res[side].breathSpent += pv.cost;
          if (pv.catalyst) {
            p.catalyst--;
            node.catalyst = true;
          }
          p.fusedTurn = p.personalTurn;
          node.ids = [act.a, act.b];
          node.groundPid = p.ground ? p.ground.pid : null;
          for (const r of [act.a, act.b]) if (r !== "ground") exhaust(thingById(S, r));
        }
        if (d && (d.spell === "separate" || d.spell === "graft")) p.fusedTurn = p.personalTurn;
        if (act.sacrifice) {
          const v = thingById(S, act.sacrifice);
          node.sacrificedWasCarrion = card(v).id === "token.carrion";
          if (leaveField(S, v, "sacrificed")) deathTrigger(S, v, "sacrificed");
          event(S, "sacrifice", { tid: v.id });
        }
        if (act.payload) exhaust(thingById(S, act.payload));
        if (act.seal) {
          const pid = act.seal.slice(2), k = p.grave.findIndex((g2) => g2.pid === pid);
          const g = p.grave.splice(k, 1)[0];
          p.sealed.push({ pid: g.pid, word: g.word, owner: g.owner });
          event(S, "sealed", { pid: g.pid, why: "mould" });
        }
        if (act.type === "hotwork") declareHotwork(S, p, act, node);
        if (act.type === "claim") p.claimTurn = p.personalTurn;
        if (act.type === "ability" && act.ability === "visit") p.visitTurn = p.personalTurn;
        if (act.endorse) {
          const sg = thingById(S, act.endorse);
          exhaust(sg);
          sg.actions++;
          node.endorsed = true;
          event(S, "endorse", { tid: sg.id });
        }
        if (d && d.spell === "squall") for (const id of act.targets) {
          const f = thingById(S, id);
          exhaust(f);
          f.actions++;
        }
        if (act.type === "ability" && threeOn(S)) {
          if (act.ability === "pollinate") p.pollTurn = p.personalTurn;
          if (act.ability === "temper") p.temperTurn = p.personalTurn;
        }
        if (d && d.spell === "graft3") {
          p.fusedTurn = p.personalTurn;
          for (const r of [act.a, act.b]) exhaust(thingById(S, r));
        }
        if (act.type === "ability" && (abSpec(S, thingById(S, act.subject)) || {}).sacrificeSelf && (abSpec(S, thingById(S, act.subject)) || {}).id === act.ability) {
          const f = thingById(S, act.subject);
          node.selfSacrificed = true;
          if (leaveField(S, f, "sacrificed")) deathTrigger(S, f, "sacrificed");
        } else if (act.subject) {
          const s = thingById(S, act.subject);
          exhaust(s);
          if (side === S.active) s.actions++;
        }
        if (act.type === "combat") {
          const def = 1 - side, used = /* @__PURE__ */ new Set();
          p.combatTurn = p.personalTurn;
          node.pairs = [];
          const atts = act.attackers.map((id) => thingById(S, id));
          for (const t of atts) {
            if (t.status.concealed) reveal(S, t);
            exhaust(t);
            t.actions++;
          }
          atts.forEach((att, k) => {
            const cands = eligibleBlockers(S, def, att, null).filter((b) => !used.has(b.id));
            let blocker = null;
            if (cands.length && ctl.block) {
              const incoming = atts.slice(k).reduce((a, x) => a + curStrike(S, x), 0);
              const id = ctl.block(S, { attacker: att, verb: "strike", target: null, candidates: cands, bonus: 0, group: { index: k, of: atts.length, incoming } });
              blocker = cands.find((b) => b.id === id) || null;
            }
            if (blocker) {
              used.add(blocker.id);
              if (blocker.status.concealed) reveal(S, blocker);
              exhaust(blocker);
            }
            node.pairs.push({ att: att.id, blocker: blocker ? blocker.id : null });
          });
        }
        if (act.type === "attack") {
          const s = thingById(S, act.subject), def = 1 - side;
          const tgThing = act.target !== "rival" && act.target !== "ground" ? thingById(S, act.target) : null;
          node.groundPid = act.target === "ground" ? enemy(S, side).ground.pid : null;
          node.bonus = d ? d.bonus || 0 : 0;
          const cands = courage ? [] : eligibleBlockers(S, def, s, tgThing || (act.target === "ground" ? "ground" : null));
          let blocker = null;
          if (cands.length && ctl.block) {
            const id = ctl.block(S, { attacker: s, verb: act.verb, target: tgThing, ground: act.target === "ground", candidates: cands, bonus: node.bonus });
            blocker = cands.find((b) => b.id === id) || null;
          }
          node.blocker = blocker ? blocker.id : null;
          if (blocker) {
            if (blocker.status.concealed) reveal(S, blocker);
            exhaust(blocker);
          }
          node.retaliates = false;
          if (!blocker && tgThing && !tgThing.exhausted && !incapacitated(tgThing) && curStrike(S, tgThing) > 0 && perm(S, tgThing, "retaliate")) {
            node.retaliates = true;
            exhaust(tgThing);
          }
        }
        event(S, "declare", { side, kind, act: { ...act } });
        return node;
      }
      function apply(S, act, ctl) {
        if (S.over != null) return;
        ctl = normCtl(ctl);
        if (!legalActions(S).some((a) => sameAction(a, act))) throw new Error("illegal action " + JSON.stringify(act) + ": " + whyIllegal(S, act));
        if (act.type === "pass") {
          endTurn(S);
          S.hashes.push(hashState(S));
          return;
        }
        if (act.type === "buy" || act.type === "catalyst") {
          economy(S, act);
          S.hashes.push(hashState(S));
          return;
        }
        if (act.type === "study") {
          const p = S.players[S.active];
          p.breath -= CORE.studyCost;
          S.stats.res[p.i].breathSpent += CORE.studyCost;
          p.studyTurn = p.personalTurn;
          if (act.discard) {
            const k = p.hand.findIndex((c2) => c2.pid === act.discard);
            const c = p.hand.splice(k, 1)[0];
            toGrave(S, c, "discarded");
            event(S, "exchange", { side: p.i, pid: c.pid });
            S.stats.res[p.i].exchanged = (S.stats.res[p.i].exchanged || 0) + 1;
          }
          drawCard(S, p);
          S.stats.res[p.i].studied = (S.stats.res[p.i].studied || 0) + 1;
          event(S, "study", { side: p.i });
          say(S, `P${p.i} draws 1 by Study.`);
          S.hashes.push(hashState(S));
          return;
        }
        if (act.type === "abandon") {
          closeProcess(S, S.active, "abandoned");
          S.hashes.push(hashState(S));
          return;
        }
        if (act.type === "invite") {
          S.players[S.active].invitePlan = { kind: act.kind, host: act.host || null };
          event(S, "invite-planned", { side: S.active, kind: act.kind, host: act.host || null });
          S.hashes.push(hashState(S));
          return;
        }
        S.clause = { nodes: [] };
        S.clause.nodes.push(declare(S, act, S.active, "main", ctl));
        stateCheck(S);
        if (S.over == null && ctl.respond) {
          const R1 = S.stats.res[1 - S.active], ro = legalResponses(S, 1 - S.active, "response").length;
          R1.windows = (R1.windows || 0) + 1;
          if (ro) R1.windowsWithOption = (R1.windowsWithOption || 0) + 1;
          if (S.players[1 - S.active].reserve > 0) R1.windowsWithReserve = (R1.windowsWithReserve || 0) + 1;
          const r = ctl.respond(S, 1 - S.active, "response");
          if (r) {
            addResponse(S, 1 - S.active, r, ctl);
            const a = ctl.respond(S, S.active, "answer");
            if (a) addResponse(S, S.active, a, ctl);
          }
        }
        resolveClause(S);
        S.hashes.push(hashState(S));
      }
      function economy(S, act) {
        const p = S.players[S.active];
        p.bought = true;
        if (act.type === "catalyst") {
          p.spark -= FORMAT.catalystPrice;
          S.stats.res[p.i].sparkSpent += FORMAT.catalystPrice;
          p.catalyst = FORMAT.catalystCap;
          event(S, "catalyst", { side: p.i });
          return;
        }
        const o = S.market[act.slot], price = priceOf(S, p.i, o.word);
        p.breath -= S.rules.marketBreath;
        S.stats.res[p.i].breathSpent += S.rules.marketBreath;
        p.spark -= price;
        S.stats.res[p.i].sparkSpent += price;
        S.stats.res[p.i].bought++;
        if (price === FORMAT.offPrice) p.offSchoolBought++;
        p.acquired[o.word] = (p.acquired[o.word] || 0) + 1;
        const c = { pid: "m" + p.i + "_" + ++S.seq, word: o.word, owner: p.i };
        if (S.registry) S.registry[c.pid] = true;
        p.hand.push(c);
        S.market[act.slot] = null;
        S.stats.res[p.i].boughtSchools = S.stats.res[p.i].boughtSchools || { own: 0, off: 0 };
        S.stats.res[p.i].boughtSchools[price === S.rules.priceOff && price !== S.rules.priceOwn ? "off" : "own"]++;
        event(S, "buy", { side: p.i, word: o.word, price, pid: c.pid });
        say(S, `P${p.i} buys ${o.word} for ${price} spark.`);
      }
      function addResponse(S, side, act, ctl) {
        const kind = S.clause.nodes.length === 1 ? "response" : "answer";
        if (!legalResponses(S, side, kind).some((a) => sameAction(a, act))) throw new Error("illegal " + kind + " " + JSON.stringify(act));
        S.clause.nodes.push(declare(S, act, side, kind, normCtl(ctl)));
        S.stats[kind === "response" ? "responses" : "answers"]++;
        stateCheck(S);
      }
      function resolveClause(S) {
        const nodes = S.clause.nodes;
        for (let k = nodes.length - 1; k >= 0; k--) {
          const n = nodes[k];
          const flush = (why) => {
            if (n.card) toGrave(S, n.card, why);
            for (const c of n.extra || []) toGrave(S, c, why);
            n.card = null;
            n.extra = null;
          };
          if (S.over != null) {
            flush("unresolved");
            continue;
          }
          if (n.cancelled) {
            S.stats.cancelled++;
            event(S, "cancelled", { k });
            flush("countered");
            continue;
          }
          const ok = resolveNode(S, n, k);
          if (!ok) {
            S.stats.failed++;
            event(S, "failed", { k, act: n.act });
          }
          const sp = S.players[n.side];
          if (n.card && ok && card(n.card).seal) {
            sp.sealed.push(n.card);
            event(S, "sealed", { pid: n.card.pid });
            n.card = null;
          }
          if (n.card && ok && card(n.card).type === "action" && n.side === S.active && sp.echo === sp.personalTurn && sp.hand.length < FORMAT.handCap) {
            sp.echo = 0;
            sp.hand.push(n.card);
            event(S, "echoed", { pid: n.card.pid });
            n.card = null;
          }
          flush(ok ? "spent" : "failed");
          if (ok && n.act.subject && n.side === S.active) {
            const q = thingById(S, n.act.subject);
            if (q && q.ctrl === S.active && has(S, q, "quick") && !q.quickUsed && q.actions === 1 && (n.cardUsed || n.type === "attack" || n.type === "ability")) {
              q.quickUsed = true;
              q.exhausted = false;
              event(S, "quick", { tid: q.id });
            }
          }
          if (n.act.verb && ok) S.players[n.side].usedVerbs[n.act.verb] = true;
          if (ok) {
            sparkFor(S, n);
            mightFor(S, n);
          }
          stateCheck(S);
        }
        S.clause = null;
      }
      function wardBlocks(S, n, t) {
        if (!t || t.ctrl === n.side || !t.status.ward) return false;
        delete t.status.ward;
        n.noEffect = true;
        event(S, "ward", { target: t.id });
        say(S, `${t.word}'s Ward absorbs it.`);
        return true;
      }
      function resolveNode(S, n, k) {
        const a = n.act, side = n.side, p = S.players[side];
        const d = n.card ? card(n.card) : null;
        const special = (x) => ["rival", "ground", "self", "sky", "law"].includes(x) || /^(node|g|q|burden|reveal):/.test(String(x));
        const tg = a.target && !special(a.target) ? thingById(S, a.target) : null;
        if (a.type !== "attack" && a.target && tg === void 0 && !special(a.target)) return false;
        switch (a.type) {
          case "deploy": {
            if (!hasRoom(S, side, null)) return false;
            const c = n.card;
            n.card = null;
            const t = newThing(S, side, { pid: c.pid, word: c.word, owner: c.owner, attuned: S.arithmetic === "legacy" && card(c).school === p.main });
            arrive(S, t);
            say(S, t.status.concealed ? `P${side} brings forth a concealed word.` : `P${side} brings forth ${c.word}.`);
            return true;
          }
          case "ground": {
            const c = n.card;
            n.card = null;
            if (p.ground) toGrave(S, p.ground, "retired");
            p.ground = { pid: c.pid, word: c.word, owner: c.owner, damage: 0 };
            say(S, `P${side} lays ${c.word}.`);
            if (card(c).onArrive === "draw1") drawCard(S, p);
            return true;
          }
          case "quality": {
            const def = card(n.card);
            if (!tg || !(def.anyTarget || (def.enemyTarget ? tg.ctrl !== side : tg.ctrl === side)) || !qualityFits(S, tg, def)) return false;
            tg.quals = tg.quals || [];
            if (a.replace) {
              const k2 = tg.quals.findIndex((x) => x.pid === a.replace);
              if (k2 < 0) return false;
              toGrave(S, tg.quals.splice(k2, 1)[0], "retired");
            }
            if (tg.quals.length >= FORMAT.qualityCap) return false;
            if (def.enemyTarget && wardBlocks(S, n, tg)) return true;
            tg.quals.push(n.card);
            n.card = null;
            event(S, "attach", { tid: tg.id, word: def.id });
            return true;
          }
          case "weather": {
            if (S.sky) toGrave(S, S.sky, "retired");
            const c = n.card;
            n.card = null;
            S.sky = { pid: c.pid, word: c.word, owner: c.owner, caster: side, until: p.personalTurn + 2 };
            const w = card(c).weather;
            if (w === "rain") for (const t of S.things) {
              t.status.wet = true;
              delete t.status.burning;
            }
            if (w === "drought" && coreOn(S)) for (const t of S.things) delete t.status.wet;
            if (w === "winter") {
              for (const t of S.things) if (t.status.wet) {
                t.status.frozen = true;
                delete t.status.wet;
              }
            }
            event(S, "sky", { word: c.word });
            return true;
          }
          case "burden": {
            const r = enemy(S, side);
            if (r.burden) toGrave(S, r.burden, "retired");
            const c = n.card;
            n.card = null;
            r.burden = { pid: c.pid, word: c.word, owner: c.owner, ticks: 2 };
            return true;
          }
          case "law": {
            if (S.law) retireLaw(S);
            const cards = [n.extra[0], n.card, n.extra[1]];
            n.card = null;
            n.extra = null;
            S.law = { cards, category: card(cards[0]).category, qual: cards[2].word, caster: side, until: p.personalTurn + 2 };
            refreshLaw(S);
            event(S, "law", { category: S.law.category, qual: S.law.qual });
            return true;
          }
          case "ability":
            return resolveAbility(S, n, tg);
          case "spell":
            return resolveSpell(S, n, d, tg);
          case "fuse":
            return resolveFuse(S, n);
          case "remote": {
            const s = thingById(S, a.subject);
            if (!s) return false;
            if (d.verb === "mend") {
              if (!tg || tg.ctrl !== side) return false;
              heal(S, tg, 3);
              return true;
            }
            if (d.verb === "blow") {
              if (!thingById(S, a.payload)) return false;
              const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl !== side);
              if (!ts.length) return false;
              for (const t of ts) {
                if (ts.length === 1 && wardBlocks(S, n, t)) continue;
                if (a.mode === "hot") ignite(S, t, side);
                else if (a.mode === "liquid") {
                  t.status.wet = true;
                  delete t.status.burning;
                } else addPoison(S, t, 1);
              }
              return true;
            }
            if (tg && tg.ctrl !== side && wardBlocks(S, n, tg)) return true;
            if (d.verb === "drench") {
              if (!tg) return false;
              tg.status.wet = true;
              delete tg.status.burning;
              if (prop(tg, "hot")) damageThing(S, tg, 1);
              return true;
            }
            if (d.verb === "burn") {
              if (!tg || !canIgnite(tg)) return false;
              ignite(S, tg, side);
              return true;
            }
            if (d.verb === "bind") {
              if (!tg || tg.ctrl === side || !contactReach(S, s, tg)) return false;
              tg.status.bound = true;
              return true;
            }
            if (d.verb === "cut") {
              if (!tg || tg.ctrl !== side) return false;
              delete tg.status.bound;
              return true;
            }
            if (d.verb === "wash") {
              if (!tg || tg.ctrl === side || !pushable(S, tg, 4)) return false;
              bounce(S, tg);
              return true;
            }
            if (d.verb === "haunt") {
              if (!tg || tg.ctrl === side || has(S, tg, "sacred") || maxStand(S, tg) > 4 || saltProtects(S, tg.ctrl)) return false;
              bounce(S, tg);
              return true;
            }
            if (d.verb === "dissolve") {
              if (a.target === "ground") {
                const g = enemy(S, side).ground;
                if (!g) return false;
                g.damage = (g.damage || 0) + 3;
                return true;
              }
              if (!tg) return false;
              damageThing(S, tg, ["metal", "stone", "liquid"].some((x) => prop(tg, x)) ? 3 : 2);
              return true;
            }
            if (d.verb === "poison") {
              addPoison(S, tg || enemy(S, side), 2);
              return true;
            }
            const victim = tg || enemy(S, side);
            const pk = packet(S, s, d.dmg, d.verb);
            record(S, s, d.verb, pk, victim);
            if (tg) damageThing(S, tg, pk.n);
            else loseLife(S, victim.i, pk.n, d.verb);
            say(S, `P${side}: ${s.word} ${d.verb}s.`);
            return true;
          }
          case "attack":
            return resolveAttack(S, n);
          case "combat": {
            let any = false;
            for (const pr of n.pairs) {
              if (S.over != null) break;
              const att = thingById(S, pr.att);
              if (!att || att.ctrl !== side) {
                say(S, `P${side}: an attacker left combat and deals nothing.`);
                continue;
              }
              if (threeOn(S) && att.status.bound) {
                say(S, `P${side}: ${att.word} is Bound and deals nothing.`);
                event(S, "bound-miss", { tid: att.id });
                continue;
              }
              const ok = resolveAttack(S, { act: { type: "attack", subject: pr.att, verb: "strike", target: "rival" }, side, blocker: pr.blocker, bonus: 0 });
              any = any || ok;
            }
            return any;
          }
          case "complete":
            return completeProcess(S, n);
          case "hotwork":
            return resolveHotwork(S, n);
          case "claim":
            return resolveClaim(S, n);
        }
        return false;
      }
      function resolveSpell(S, n, d, tg) {
        const side = n.side, p = S.players[side], a = n.act;
        const friendly = tg && tg.ctrl === side;
        if (d.type === "category") {
          selectTop(S, p, 3, (c) => card(c).type === "thing" && (card(c).props || []).includes(d.category));
          say(S, `P${side} catalogues ${d.category}s.`);
          return true;
        }
        switch (d.spell) {
          case "guard":
            if (threeOn(S)) {
              if (!friendly) return false;
              tg.g3 = true;
              break;
            }
            if (!friendly) return false;
            tg.tempStand = (tg.tempStand || 0) + 2;
            tg.tempGuard = true;
            break;
          // readiness still required to block
          case "kindle":
            if (threeOn(S)) return resolveThreeSpell(S, n, d, tg);
            if (!friendly) return false;
            if (core33(S) && card(tg).naphtha) return ignite(S, tg, side);
            tg.tempStrike = (tg.tempStrike || 0) + 1;
            tg.kindled = true;
            break;
          case "protect":
            if (!friendly) return false;
            tg.status.ward = true;
            break;
          case "dew":
            if (threeOn(S)) return resolveThreeSpell(S, n, d, tg);
            if (a.target === "self") {
              if (p.poison) p.poison--;
              break;
            }
            if (!friendly) return false;
            tg.status.wet = true;
            delete tg.status.burning;
            if (tg.status.poison) tg.status.poison--;
            if (core33(S) && prop(tg, "living") && tg.damage) heal(S, tg, 2);
            break;
          // V33: dew also restores up to 2 marked damage
          case "thaw":
            if (!tg || !tg.status.frozen) return false;
            delete tg.status.frozen;
            if (friendly) heal(S, tg, 1);
            break;
          case "frozen":
            if (!tg || !tg.status.wet) return false;
            if (wardBlocks(S, n, tg)) return true;
            tg.status.frozen = true;
            break;
          case "sleep":
            if (!tg || !prop(tg, "living")) return false;
            if (wardBlocks(S, n, tg)) return true;
            tg.status.asleep = true;
            break;
          case "gust": {
            if (!tg || tg.ctrl === side || has(S, tg, "heavy") || curStrike(S, tg) > 2) return false;
            if (wardBlocks(S, n, tg)) return true;
            bounce(S, tg);
            break;
          }
          case "gasp": {
            const g = Math.min(2, FORMAT.extraBreathCap - p.extraBreath, FORMAT.poolCap - p.breath);
            p.breath += g;
            p.extraBreath += g;
            break;
          }
          case "tonic": {
            gainLife(S, p.i, 3, "tonic");
            if (p.poison) p.poison--;
            if (p.ground && card(p.ground).potionBonus && p.potionTurn !== p.personalTurn) {
              p.potionTurn = p.personalTurn;
              gainLife(S, p.i, 1, "potion ground");
            }
            break;
          }
          case "feast":
            if (threeOn(S)) return resolveThreeSpell(S, n, d, tg);
            return resolveFolioSpell(S, n, d, tg);
          case "shape":
          case "writ":
            return resolveFolioSpell(S, n, d, tg);
          case "graft3":
          case "shape3":
          case "writ3":
            return resolveThreeSpell(S, n, d, tg);
          case "transmute": {
            if (!friendly || tg.ladderTurn === p.personalTurn || !(METAL_NEXT[card(tg).id] || []).includes(a.branch)) return false;
            transform(S, tg, a.branch);
            break;
          }
          case "grow": {
            if (!friendly || !prop(tg, "plant")) return false;
            addCounter(S, tg, "growth");
            ageUp(S, tg);
            break;
          }
          case "calcine": {
            if (threeOn(S)) return resolveThreeSpell(S, n, d, tg);
            if (a.target === "rival") loseLife(S, 1 - side, 3, "calcine");
            else {
              if (!tg || tg.ctrl === side) return false;
              if (wardBlocks(S, n, tg)) return true;
              damageThing(S, tg, 3);
            }
            createToken(S, side, "token.ash");
            break;
          }
          case "separate":
            if (!resolveSeparate(S, n, tg)) return false;
            n.noSpark = true;
            break;
          // spell-assisted fusion: no sentence spark
          case "graft": {
            if (!resolveGraft(S, n, tg, thingById(S, a.donor))) return false;
            n.noSpark = true;
            break;
          }
          case "wildfire": {
            if (threeOn(S)) return resolveThreeSpell(S, n, d, tg);
            const foesBurning = S.things.filter((t) => t.ctrl !== side && t.status.burning).length;
            for (const t of S.things.filter((t2) => t2.status.burning)) damageThing(S, t, 2);
            loseLife(S, 1 - side, Math.min(3, foesBurning), "wildfire");
            break;
          }
          case "tide": {
            const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl !== side && pushable(S, t, 4));
            if (!ts.length) return false;
            for (const t of ts) bounce(S, t);
            break;
          }
          case "memory": {
            const pid = a.target.slice(2), g = p.grave.find((x) => x.pid === pid);
            if (!g || !recoverFromGrave(S, pid, side)) return false;
            break;
          }
          case "squall":
            loseLife(S, 1 - side, 2 * a.targets.length, "squall");
            break;
          // one batch; the Flyers paid as cost
          case "abundance": {
            if (threeOn(S)) return resolveThreeSpell(S, n, d, tg);
            if (core33(S)) {
              const ps = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl === side && prop(t, "plant"));
              if (!ps.length) return false;
              for (const t of ps) {
                addCounter(S, t, "growth");
                if (plantNext(S, t)) ageUp(S, t);
              }
              break;
            }
            const ts = a.targets.map((id) => thingById(S, id)).filter((t) => t && t.ctrl === side && prop(t, "living"));
            if (!ts.length) return false;
            for (const t of ts) addCounter(S, t, "growth");
            const m = ts.find((t) => t.id === a.might);
            if (m) addCounter(S, m, "might");
            break;
          }
          case "tame":
          case "summon": {
            const okT = tg && tg.ctrl !== side && isOriginal(tg) && !tg.status.named && (d.spell === "tame" ? prop(tg, "beast") && curStrike(S, tg) <= 2 : BY_ID2[tg.word].cost <= 2);
            if (!okT) return false;
            if (wardBlocks(S, n, tg)) return true;
            if (!takeControl(S, tg, side)) return false;
            break;
          }
          case "decay": {
            if (!tg || tg.ctrl === side) return false;
            if (wardBlocks(S, n, tg)) return true;
            damageThing(S, tg, n.sacrificedWasCarrion ? 4 : 3);
            break;
          }
          case "rust": {
            if (!tg || tg.ctrl === side || !prop(tg, "metal") || has(S, tg, "incorruptible") || modsOf(tg).rustImmune) return false;
            if (wardBlocks(S, n, tg)) return true;
            const from = card(tg).id;
            let back = null;
            if (from === "earth.silver") back = (tg.prevForms || []).filter((f) => f === "earth.tin" || f === "earth.copper").pop() || ["earth.tin", "earth.copper"][decide(S, side, "rustBranch", ["earth.tin", "earth.copper"])];
            if (from === "earth.tin" || from === "earth.copper") back = "earth.lead";
            damageThing(S, tg, 3);
            if (back) {
              tg.form = back === tg.word ? void 0 : back;
              event(S, "transform", { tid: tg.id, from, to: back, regress: true });
            }
            break;
          }
          case "wither": {
            if (!tg || tg.ctrl === side || !prop(tg, "living")) return false;
            if (wardBlocks(S, n, tg)) return true;
            if (prop(tg, "plant")) {
              tg.counters.growth = Math.max(0, (tg.counters.growth || 0) - 2);
              damageThing(S, tg, 2);
            } else damageThing(S, tg, 1);
            break;
          }
          case "exhume": {
            const pid = a.target.slice(2), k2 = p.grave.findIndex((x) => x.pid === pid);
            if (k2 < 0 || !hasRoom(S, side, null)) return false;
            const g = p.grave.splice(k2, 1)[0];
            const t = newThing(S, side, { pid: g.pid, word: g.word, owner: g.owner });
            event(S, "revive", { pid: g.pid });
            arrive(S, t);
            break;
          }
          case "miasma":
            for (const t of S.things.filter((t2) => t2.ctrl !== side && prop(t2, "living"))) addPoison(S, t, 1);
            addPoison(S, enemy(S, side), 1);
            break;
          case "omen":
            selectTop(S, p, 3, (c) => true);
            break;
          // policy: take the top card; others to the bottom
          case "gnosis":
            drawCard(S, p);
            stateCheck(S);
            if (S.over == null) drawCard(S, p);
            for (const t of S.things.filter((t2) => t2.ctrl !== side && t2.status.concealed)) reveal(S, t);
            break;
          case "name":
            if (!friendly) return false;
            tg.status.named = true;
            break;
          case "measure":
            if (!tg || tg.ctrl === side) return false;
            if (wardBlocks(S, n, tg)) return true;
            tg.status.measured = true;
            break;
          case "awaken":
            if (!friendly || prop(tg, "living")) return false;
            if (threeOn(S) && prop(tg, "body")) {
              addCounter(S, tg, "might");
              break;
            }
            tg.extraProps = (tg.extraProps || []).concat("body");
            addCounter(S, tg, "might");
            break;
          case "echo":
            p.echo = p.personalTurn;
            break;
          case "loan":
            gainExtraBreath(p, 2);
            p.tax = 1;
            break;
          case "silence": {
            const r = enemy(S, side);
            event(S, "reveal-hand", { side: r.i, n: r.hand.length });
            const el = r.hand.filter((c) => ["action", "spell"].includes(card(c).type) && card(c).cost <= 3).sort((x, y) => card(y).cost - card(x).cost);
            const pick = el[decide(S, side, "silence", el.map((c) => c.word))];
            if (pick) {
              r.hand.splice(r.hand.indexOf(pick), 1);
              toGrave(S, pick, "discarded");
            }
            break;
          }
          case "scream": {
            const voice = Math.min(2, S.things.filter((t) => t.ctrl === side && prop(t, "speaker") && !incapacitated(t)).length);
            loseLife(S, 1 - side, 2 + voice, "scream");
            for (const t of S.things) delete t.status.asleep;
            for (const b of S.things.filter((t) => t.ctrl === side && card(t).bard)) if (b.bardTurn !== p.personalTurn) {
              b.bardTurn = p.personalTurn;
              drawCard(S, p);
              break;
            }
            break;
          }
          case "reckoning": {
            const doomed = S.things.filter((t) => t.ctrl !== side && maxStand(S, t) <= 2);
            for (const t of doomed) leaveField(S, t, "destroyed");
            for (const t of doomed) deathTrigger(S, t);
            break;
          }
          case "dispel": {
            const x = String(a.target);
            if (x.startsWith("reveal:")) {
              const h = thingById(S, x.slice(7));
              if (!h || !h.status.concealed) return false;
              reveal(S, h);
            } else if (x === "sky") {
              if (!S.sky) return false;
              toGrave(S, S.sky, "retired");
              S.sky = null;
            } else if (x === "law") {
              if (!S.law) return false;
              retireLaw(S);
            } else if (x.startsWith("burden:")) {
              const q = S.players[+x.slice(7)];
              if (!q.burden) return false;
              toGrave(S, q.burden, "retired");
              q.burden = null;
            } else {
              const pid = x.slice(2), h = S.things.find((t) => (t.quals || []).some((q) => q.pid === pid));
              if (!h) return false;
              toGrave(S, h.quals.splice(h.quals.findIndex((q) => q.pid === pid), 1)[0], "retired");
            }
            break;
          }
          case "doubt": {
            if (String(a.target).startsWith("reveal:")) {
              const h = thingById(S, a.target.slice(7));
              if (!h || !h.status.concealed) return false;
              reveal(S, h);
              break;
            }
            const k = +String(a.target).split(":")[1], victim = S.clause.nodes[k];
            if (!victim || victim.cancelled || !victim.card) return false;
            victim.cancelled = true;
            break;
          }
          default:
            return false;
        }
        say(S, `P${side} speaks ${n.card.word}.`);
        return true;
      }
      function bounce(S, t) {
        leaveField(S, t, "bounced");
        event(S, "bounce", { id: t.id, pid: t.pid });
        say(S, `${t.word} is blown back to P${t.owner}'s hand.`);
      }
      function record(S, src, verb, pk, tg) {
        const to = tg.ctrl !== void 0 ? "thing" : tg.word ? "ground" : "player";
        S.stats.packets.push({ round: S.round, side: src.ctrl, verb, n: pk.n, to, toPlayer: to === "player", steps: pk.steps });
      }
      function resolveAttack(S, n) {
        const a = n.act, att = thingById(S, a.subject), defender = 1 - n.side;
        if (!att) return false;
        let recipient = null, retaliator = null, ground = null;
        if (n.blocker) {
          recipient = thingById(S, n.blocker);
          if (!recipient) {
            say(S, `P${n.side}: the blocker is gone; the attack misses.`);
            return false;
          }
          if (!incapacitated(recipient) && perm(S, recipient, "retaliate")) retaliator = recipient;
        } else if (a.target === "ground") {
          ground = enemy(S, n.side).ground;
          if (!ground || ground.pid !== n.groundPid) return false;
        } else if (a.target !== "rival") {
          recipient = thingById(S, a.target);
          if (!recipient || recipient.ctrl === n.side) return false;
          if (!contactReach(S, att, recipient)) return false;
          if (n.retaliates && !incapacitated(recipient)) retaliator = recipient;
        }
        let base = curStrike(S, att) + (n.bonus || 0);
        const pa = S.players[att.ctrl];
        if (!recipient && !ground && modsOf(att).firebrand && pa.firebrandTurn !== pa.personalTurn) {
          pa.firebrandTurn = pa.personalTurn;
          base += 1;
        }
        let pk = packet(S, att, base, a.verb);
        if (a.verb === "bite" && recipient && (!prop(recipient, "living") || has(S, recipient, "sacred"))) pk = { n: 0, steps: pk.steps.concat([["bite vs non-living/Sacred", 0]]) };
        record(S, att, a.verb, pk, recipient || ground || enemy(S, n.side));
        const ret = retaliator ? curStrike(S, retaliator) : 0;
        const before = recipient ? remainingOf(S, recipient) : 0, dmg0 = recipient ? recipient.damage : 0;
        if (recipient) damageThing(S, recipient, pk.n);
        else if (ground) ground.damage = (ground.damage || 0) + pk.n;
        else loseLife(S, defender, pk.n, a.verb);
        const applied = recipient ? recipient.damage - dmg0 : 0;
        if (threeOn(S) && recipient && n.blocker && a.verb === "strike" && card(att).golemSpill && applied > before && !rebirthAvailable(S, recipient)) {
          const over = applied - Math.max(0, before);
          record(S, att, "overflow", { n: over, steps: [["golem spill", over]] }, enemy(S, att.ctrl));
          loseLife(S, defender, over, "golem spill");
          event(S, "spill", { tid: att.id, n: over });
        }
        if (ret > 0) damageThing(S, att, ret);
        if (ret > 0 && card(retaliator).stingBind && remainingOf(S, att) > 0 && prop(att, "living")) att.status.bound = true;
        if (pk.n > 0) {
          const alive = recipient && remainingOf(S, recipient) > 0;
          if (has(S, att, "venomous")) {
            if (!recipient && !ground) addPoison(S, enemy(S, att.ctrl), 1);
            else if (alive) addPoison(S, recipient, 1);
          }
          if (card(att).wetOnHit && alive) {
            recipient.status.wet = true;
            delete recipient.status.burning;
          }
          if ((card(att).igniteOnHit || modsOf(att).igniteOnHit || att.kindled) && alive) ignite(S, recipient, att.ctrl);
          if (card(recipient || {}).wetAttacker && S.things.includes(att) && recipient.iceTurn !== S.turn) {
            recipient.iceTurn = S.turn;
            att.status.wet = true;
            delete att.status.burning;
          }
          if (!recipient && !ground && card(att).magpie && att.magpieTurn !== S.players[att.ctrl].personalTurn) {
            att.magpieTurn = S.players[att.ctrl].personalTurn;
            gainAbilitySpark(S, S.players[att.ctrl]);
          }
          if (card(att).leech && !S.players[att.ctrl].leechUsed && !ground && (!recipient || prop(recipient, "living"))) {
            S.players[att.ctrl].leechUsed = true;
            gainLife(S, att.ctrl, 1, "leech");
          }
        }
        if (a.verb === "crush" && recipient && (threeOn(S) ? applied : pk.n) > before && before >= 0 && !rebirthAvailable(S, recipient)) {
          let over = (threeOn(S) ? applied : pk.n) - Math.max(0, before);
          if (S.arithmetic === "legacy") {
            const pl = S.players[att.ctrl];
            if (card(att).school === pl.main) over = Math.round(over * 1.2);
            if (!pl.usedVerbs.overflow) {
              over += 2;
              pl.usedVerbs.overflow = true;
            }
          }
          record(S, att, "overflow", { n: over, steps: [["overflow", over]] }, enemy(S, att.ctrl));
          loseLife(S, defender, over, "crush overflow");
        }
        say(S, `P${att.ctrl}: ${att.word} ${a.verb}s ${recipient ? recipient.word : ground ? ground.word : "P" + defender} for ${pk.n}${n.blocker ? " (blocked)" : ""}${ret ? `, takes ${ret} back` : ""}.`);
        return true;
      }
      function sameAction(a, b) {
        return a.type === b.type && a.slot === b.slot && a.card === b.card && a.subject === b.subject && a.verb === b.verb && (a.target || null) === (b.target || null) && a.recipe === b.recipe && a.a === b.a && a.b === b.b && a.sacrifice === b.sacrifice && a.branch === b.branch && a.payload === b.payload && a.mode === b.mode && a.donor === b.donor && a.might === b.might && a.replace === b.replace && a.category === b.category && a.qual === b.qual && a.ability === b.ability && JSON.stringify(a.targets || null) === JSON.stringify(b.targets || null) && JSON.stringify(a.attackers || null) === JSON.stringify(b.attackers || null) && a.discard === b.discard && a.mode === b.mode && a.ash === b.ash && a.mend === b.mend && a.ready === b.ready && a.recipe === b.recipe && a.seal === b.seal && a.endorse === b.endorse;
      }
      function hashState(S) {
        const pub = JSON.stringify({ t: S.turn, a: S.active, p: S.players.map((p) => [p.life, p.breath, p.reserve, p.hand.map((c) => c.pid), p.deck.map((c) => c.pid), p.grave.map((c) => c.pid + c.reason), p.poison, p.spark, p.catalyst, p.ground && [p.ground.pid, p.ground.damage]]), m: S.market.map((o) => o && o.word), sky: S.sky && S.sky.pid, law: S.law && S.law.cards.map((c) => c.pid), bd: S.players.map((p) => p.burden && [p.burden.pid, p.burden.ticks]), th: S.things.map((t) => [t.id, t.pid, t.form, t.ctrl, t.damage, t.exhausted, t.fresh, t.counters, t.status, t.mods, t.lineage && lineagePids(t.lineage).map((r) => r.pid), (t.quals || []).map((q) => q.pid)]) });
        const extra = S.rules.modules && S.rules.modules.length ? JSON.stringify(S.things.map((t) => [t.id, t.feastTurn || 0, t.cropOf || 0])) + JSON.stringify((S.processes || []).map((x) => [x.id, x.open, x.closed || ""])) + JSON.stringify([S.invites || [], S.claims || [], S.things.map((t) => [t.supply ? 1 : 0, t.displaced ? 1 : 0, (t.wtGrants || []).length])]) : "";
        const all = pub + extra;
        let h = 2166136261;
        for (let i = 0; i < all.length; i++) {
          h ^= all.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return (h >>> 0).toString(16);
      }
      var REVISION = { id: "r30.1", log: [
        { id: "r30.0", note: "V30 foundation (commit 69c5e05)." },
        { id: "r30.1", note: "Alkahest gains its printed ability (1 breath, sacrifice: destroy an enemy Thing or damageable Ground). Changes play only in matches where Alkahest is made. Healing is now recorded in stats (not in the state hash)." }
      ] };
      module.exports = {
        threeOn,
        naphthaVictims,
        shape3Why,
        igniteWhy,
        abSpec,
        ESPALIER,
        SHAPE3,
        pollinationWhy,
        shapeWhy,
        trait,
        folioOn,
        FOLIO_RECIPES,
        abilityCost,
        processOptions,
        perm,
        permWhy,
        hasRoom,
        capGeneral,
        capSupply,
        invitationWhy,
        visitWhy,
        hotworkWhy,
        w5Why,
        w5Chain,
        REVISION,
        FORMAT,
        INITIATIVE,
        createMatch,
        setDecider,
        applyMulligan,
        priceOf,
        legalActions,
        legalResponses,
        apply,
        addResponse,
        resolveClause,
        whyIllegal,
        zoneAudit,
        fusionOptions,
        previewFusion,
        abilityOptions,
        addCounter,
        ignite,
        modsOf,
        maxStand,
        propsOf,
        caps,
        qualityDefs,
        recipeById,
        decide,
        schoolsOf,
        lineagePids,
        createToken,
        leaveField,
        transform,
        prop,
        curStrike,
        remainingOf,
        standOf,
        groundRemaining,
        packet,
        deckErrors,
        hashState,
        card,
        has,
        kws,
        stateCheck,
        endTurn,
        startTurn,
        incapacitated
      };
    }
  });

  // ../engine29/src/bots.js
  var require_bots = __commonJS({
    "../engine29/src/bots.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var E2 = require_engine();
      var HIDDEN = "?";
      function redact(S, viewer) {
        const r = S.rand;
        delete S.rand;
        const c = structuredClone(S);
        S.rand = r;
        c.rand = () => 0.5;
        for (const p of c.players) {
          if (p.i !== viewer) p.hand = p.hand.map((x, k) => ({ pid: HIDDEN + p.i + "_" + k, word: HIDDEN, owner: p.i }));
          p.deck = p.deck.map((x, k) => ({ pid: HIDDEN + "d" + p.i + "_" + k, word: HIDDEN, owner: p.i }));
        }
        for (const t of c.things) if (t.ctrl !== viewer && t.status.concealed) {
          t.word = HIDDEN;
          t.form = void 0;
          t.mods = void 0;
          t.quals = [];
          t.lineage = t.lineage ? [] : t.lineage;
        }
        c.registry = null;
        c.mseed = null;
        c.redacted = true;
        return c;
      }
      var clone = (S) => redact(S, S.active);
      function value(S, me, w) {
        if (S.over === me) return 1e6;
        if (S.over === 1 - me) return -1e6;
        if (S.over === "draw") return 0;
        const P = S.players, side = (i) => S.things.filter((t) => t.ctrl === i);
        const thingV = (t) => {
          const out = E2.incapacitated(t) ? 0.5 : 1;
          return out * E2.curStrike(S, t) * w.str + Math.max(0, E2.remainingOf(S, t)) * w.st - (t.status.burning ? 2 : 0) - (t.status.poison || 0) + (t.status.ward ? 0.5 : 0) + (w.alchemy || 0) * alchemyWorth(t, S);
        };
        const board = (i) => side(i).reduce((a, t) => a + thingV(t), 0) + (P[i].ground ? 1 + 0.2 * E2.groundRemaining(P[i].ground) : 0);
        const al = w.alchemy || 1, garnet = (i) => S.things.some((o) => o.ctrl === i && E2.card(o).id === "earth.garnet");
        const proc = (i) => (S.processes || []).filter((x) => x.open && x.owner === i && !(S.active === i && P[i].personalTurn >= x.earliest)).reduce(
          /* completable now = lapses at this End unless completed: no stored value */
          (a, x) => a + 0.6 * Math.max(0, x.family === "bear" ? al * 1.2 + 0.55 : al * (0.6 + (garnet(i) ? 0.6 : 0)) - 0.55),
          0
        );
        const claim = (i) => (S.claims || []).some((x) => x.open && x.owner === i) ? V32_OPTS.claimWorth : 0;
        const room = (i) => {
          if (!E2.threeOn(S)) return 0;
          const things = P[i].hand.filter((c) => c.word !== "?" && E2.card(c).type === "thing").length;
          return 0.4 * Math.min(things, Math.max(0, 5 - side(i).length));
        };
        return room(me) - room(1 - me) + claim(me) - claim(1 - me) + w.life * (P[me].life - P[1 - me].life) + board(me) - board(1 - me) + proc(me) - proc(1 - me) + w.hand * (P[me].hand.length - P[1 - me].hand.length) - 1.5 * (P[me].poison - P[1 - me].poison) + w.spark * (P[me].spark - P[1 - me].spark) + 0.5 * (P[me].catalyst - P[1 - me].catalyst) + (S.sky ? S.sky.caster === me ? 1.2 : -1.2 : 0) + (P[1 - me].burden ? 1 : 0) - (P[me].burden ? 1 : 0);
      }
      function cardWorth(S, me, word) {
        const d = E2.card({ word }), p = S.players[me];
        return 0.25 * d.cost + (d.type === "thing" ? 0.3 : 0) + (p.schools.includes(d.school) ? 0.2 : 0);
      }
      function mulligan(S, i) {
        const h = S.players[i].hand, d = (c) => E2.card(c);
        const cheap = h.filter((c) => d(c).type === "thing" && d(c).cost <= 2);
        if (cheap.length >= 2) return h.filter((c) => d(c).cost >= 3 && d(c).type !== "thing").map((c) => c.pid).slice(0, 1);
        return h.filter((c) => !(d(c).type === "thing" && d(c).cost <= 2)).map((c) => c.pid);
      }
      var ENGINE = { energy: 1.6, gold: 1.6, lifeHeal: 1.2, worldTree: 2.5, stone: 2.5, espalier: 3.4 };
      var FORM_PROGRESS = { "earth.tin": 0.6, "earth.copper": 0.6, "earth.silver": 1.2, "earth.gold": 2, "life.sapling": 0.8, "life.oak": 1.5, "life.willow": 1.2 };
      var FOLIO_WORTH = { "token.fruit": 1.2, "earth.setting": 0.6, "made.signet": 1.6, "earth.garnet": 0.4, "rot.mould": 0.5, "earth.hammer": 0.8, "earth.signet3": 1, "fire.naphtha": 1, "fire.tinder": 0.3 };
      function folioWorth(S, t) {
        const c = E2.card(t);
        let v = FOLIO_WORTH[c.id] || 0;
        if (E2.trait(S, t, "carrier") && S.things.some((h) => h.ctrl === t.ctrl && E2.trait(S, h, "pollination") === E2.trait(S, t, "carrier"))) v += 0.5;
        if (E2.trait(S, t, "pollination") && S.things.some((h) => h.ctrl === t.ctrl && E2.trait(S, h, "carrier") === E2.trait(S, t, "pollination"))) v += 0.5;
        if ((c.id === "earth.copper" || c.id === "earth.silver") && S.things.some((o) => o.ctrl === t.ctrl && E2.card(o).id === "earth.garnet")) v += 0.3;
        if (c.id === "earth.setting" && S.things.some((o) => o.ctrl === t.ctrl && E2.card(o).id === "earth.garnet")) v += 0.6;
        if (E2.threeOn(S)) {
          if (c.id === "token.ash" && S.things.some((o) => o.ctrl === t.ctrl && E2.card(o).id === "fire.firebird")) v += 1;
          if (c.id === "earth.signet3" && S.players[t.ctrl].hand.some((h) => h.word === "word.writ3")) v += 0.6;
          if (t.shield3) v += S.things.some((o) => o.ctrl !== t.ctrl && !E2.incapacitated(o) && E2.curStrike(S, o) > 0) ? 1.2 : 0.3;
        }
        return v;
      }
      function alchemyWorth(t, S) {
        const c = E2.card(t);
        let v = (ENGINE[c.upkeep] || 0) + (FORM_PROGRESS[c.id] || 0) + (S && S.rules.modules && S.rules.modules.length ? folioWorth(S, t) : 0);
        if (t.lineage) v += 0.8 + (c.made ? 0.5 * (c.kw || []).includes("final") + 0.4 * (c.schools || []).length : 0.6 * (t.mods && t.mods.infusions.length || 0));
        if (c.rebirth) v += 1.5;
        if (t.token) v -= 0.3;
        return v;
      }
      var V32_OPTS = { invite: "heuristic", claimWorth: 8, reorder: 0.35 };
      function v32Bonus(S0, me, a) {
        if (a.type === "invite") {
          if (V32_OPTS.invite === "never") return -1e3;
          if (V32_OPTS.invite === "always") return 1;
          const rv = 1 - me, ready = (t) => t.ctrl === rv && !E2.incapacitated(t);
          if (a.kind === "orchard") return S0.things.some((t) => ready(t) && E2.card(t).id === "life.bee") ? 0.6 : -0.1;
          if (a.kind === "heat") return S0.players[rv].spark >= 1 && S0.players[me].spark < 5 && S0.things.some((t) => t.ctrl === rv && ["earth.copper", "earth.silver"].includes(E2.card(t).id)) ? 0.5 : -0.1;
        }
        if (a.type === "ability" && a.ability === "visit") return (S0.rules.modules || []).includes("visit_draw") ? 0.3 : V32_OPTS.reorder;
        return 0;
      }
      var styleOf = (pol) => String(pol).split(":")[0];
      var tierOf = (pol) => String(pol).split(":")[1] || "journeyman";
      var raOf = (pol) => String(pol).split(":")[2] === "ra";
      var RA_OPTS = { hold: false, samples: true, cardPen: 0.3, threshold: 0.2, deny: 1 };
      var TIERS2 = {
        apprentice: { depth: 1, beam: 1, noise: 0.45, responses: false },
        initiate: { depth: 1, beam: 1, noise: 0.15, responses: true },
        journeyman: { depth: 1, beam: 1, noise: 0, responses: true },
        specialist: { depth: 2, beam: 4, noise: 0, responses: true },
        expert: { depth: 2, beam: 4, noise: 0, responses: true, samples: 2 },
        master: { depth: 3, beam: 4, noise: 0, responses: true, samples: 3 },
        // V32 bounded multi-turn planner: top-K openings, greedy completion of the turn, a null-move rival turn, valued at our next
        // Main (after upkeep, Growth, processes and claims) minus the rival's visible threat. Redacted information only.
        planner: { depth: 1, beam: 1, noise: 0, responses: true, plan: { k: 5, steps: 5, threat: 0.5 } }
      };
      var TIER_ORDER = Object.keys(TIERS2);
      var POLICIES = {
        aggressive: { life: 1.4, str: 0.7, st: 0.35, hand: 0.4, blockAt: 6, hold: 0.35, spark: 0.2, alchemy: 1 },
        careful: { life: 1, str: 0.55, st: 0.55, hand: 0.6, blockAt: 3, hold: 0.6, spark: 0.2, alchemy: 1 },
        // V31 engine-building pilot: same public information, values preparation and future outputs (alchemy, processes) more
        builder: { life: 1, str: 0.55, st: 0.55, hand: 0.6, blockAt: 3, hold: 0.6, spark: 0.2, alchemy: 2.2 }
      };
      function blocker(policyOf) {
        return (S, info) => {
          const me = 1 - info.attacker.ctrl, w = POLICIES[styleOf(policyOf(me))];
          const dmg = E2.curStrike(S, info.attacker) + info.bonus;
          let best = null, bestScore = 0;
          for (const b of info.candidates) {
            const survives = E2.remainingOf(S, b) > dmg;
            const kills = E2.curStrike(S, b) >= E2.remainingOf(S, info.attacker);
            const bv = E2.curStrike(S, b) + E2.remainingOf(S, b);
            let sc;
            if (!info.target && !info.ground) {
              const lethal = S.players[me].life <= (info.group ? info.group.incoming : dmg) + 2;
              if (dmg < w.blockAt && !lethal) continue;
              sc = (survives ? 6 : 0) + (kills ? 4 : 0) + (lethal ? 50 : dmg) - (survives ? 0 : bv * 0.6);
            } else if (info.ground) {
              const g = S.players[me].ground;
              if (E2.groundRemaining(g) > dmg) continue;
              sc = 3 + (survives ? 3 : -bv * 0.6) + (kills ? 3 : 0);
            } else {
              const tv = E2.curStrike(S, info.target) + E2.remainingOf(S, info.target);
              if (E2.remainingOf(S, info.target) > dmg) continue;
              sc = (survives ? tv : tv - bv) + (kills ? 3 : 0);
            }
            if (sc > bestScore) {
              bestScore = sc;
              best = b.id;
            }
          }
          return best;
        };
      }
      function holdValue(S, me, w, ra = false) {
        const p = S.players[me], cap = S.rules.reserveCap || 2;
        if (!ra || !RA_OPTS.hold) {
          const r0 = p.hand.filter((c) => c.word !== HIDDEN && E2.card(c).r && E2.card(c).cost <= 2);
          if (!r0.length || !S.rules.reserve) return 0;
          return w.hold * Math.min(2, p.breath, Math.max(...r0.map((c) => E2.card(c).cost)));
        }
        const rs = p.hand.filter((c) => c.word !== HIDDEN && E2.card(c).r && respCost(S, c) <= cap);
        if (!rs.length || !S.rules.reserve) return 0;
        const need = Math.min(...rs.map((c) => respCost(S, c)));
        const threat = S.things.some((t) => t.ctrl !== me && E2.curStrike(S, t) > 0) || S.players[1 - me].hand.length > 2;
        return p.breath >= need ? w.hold * (threat ? 1.6 : 0.6) * need + 0.4 * Math.min(rs.length, 2) : 0;
      }
      function respCost(S, c) {
        const d = E2.card(c), disc = S.rules.responseDiscount && S.rules.responseDiscount[d.id];
        return Math.max(1, d.cost - (disc || 0));
      }
      function denied(S, me) {
        return S.things.filter((t) => t.ctrl !== me && E2.incapacitated(t)).reduce((a, t) => a + E2.curStrike(S, t), 0);
      }
      function responder(policyOf) {
        return (S, side, kind) => {
          const opts = E2.legalResponses(S, side, kind);
          if (!opts.length) return null;
          const w = POLICIES[styleOf(policyOf(side))];
          const run = (opt) => {
            const c = redact(S, side);
            if (opt) E2.addResponse(c, side, opt, { block: null });
            E2.resolveClause(c);
            const spent = opt ? E2.card(S.players[side].hand.find((x) => x.pid === opt.card)).cost : 0;
            return value(c, side, w) - (kind === "answer" ? 0.4 * spent : 0) - (opt ? 0.6 : 0);
          };
          let best = null, bestV = run(null) + 0.4;
          for (const o of opts) {
            let v;
            try {
              v = run(o);
            } catch (e) {
              continue;
            }
            if (v > bestV) {
              bestV = v;
              best = o;
            }
          }
          return best;
        };
      }
      function responderRA(policyOf) {
        return (S, side, kind) => {
          const opts = E2.legalResponses(S, side, kind);
          if (!opts.length) return null;
          const w = POLICIES[styleOf(policyOf(side))], hand = S.players[side].hand;
          const run = (opt) => {
            const c = redact(S, side);
            if (opt) E2.addResponse(c, side, opt, { block: null });
            E2.resolveClause(c);
            const card = opt && hand.find((x) => x.pid === opt.card);
            const pen = opt ? RA_OPTS.cardPen * cardWorth(S, side, card.word) + (kind === "answer" ? 0.4 * respCost(S, card) : 0) : 0;
            return value(c, side, w) + RA_OPTS.deny * w.str * denied(c, side) - pen;
          };
          let best = null, bestV = run(null) + RA_OPTS.threshold;
          for (const o of opts) {
            let v;
            try {
              v = run(o);
            } catch (e) {
              continue;
            }
            if (v > bestV) {
              bestV = v;
              best = o;
            }
          }
          return best;
        };
      }
      function controller(policyOf, { responses = true } = {}) {
        const tierResp = (side) => TIERS2[tierOf(policyOf(side))].responses || raOf(policyOf(side));
        const r = responder(policyOf), ra = responderRA(policyOf);
        return { block: blocker(policyOf), respond: responses ? (S, side, kind) => !tierResp(side) ? null : raOf(policyOf(side)) ? ra(S, side, kind) : r(S, side, kind) : null };
      }
      function decider(policyOf) {
        return (S, side, kind, options, dflt) => {
          if (kind === "select") {
            let bk = dflt, bv = -1e9;
            options.forEach((w, k) => {
              const v = cardWorth(S, side, w);
              if (v > bv) {
                bv = v;
                bk = k;
              }
            });
            return bk;
          }
          if (kind === "debt") {
            const want = options.includes("spark") && (S.players[side].life <= 6 || S.players[side].spark >= 3) ? "spark" : "life";
            return options.indexOf(want);
          }
          return dflt;
        };
      }
      function stateRand(S, salt, pub = false) {
        let h = parseInt(E2.hashState(pub ? redact(S, S.active) : S), 16) ^ salt;
        return () => {
          h = h + 1831565813 | 0;
          let t = Math.imul(h ^ h >>> 15, 1 | h);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }
      function sampleRivalHand(S, me, r) {
        const rv = S.players[1 - me];
        const seen = new Set(rv.grave.map((g) => g.word).concat(rv.sealed.map((g) => g.word), S.things.filter((t) => t.owner === rv.i && t.pid).map((t) => t.word)));
        const mods = S.rules && S.rules.modules || [];
        const pool = Object.values(require_cards().BY_ID).filter((c) => (c.deckLegal || c.folio && !c.made && !c.transformedOnly && mods.includes(c.folio)) && rv.schools.includes(c.school) && !seen.has(c.id)).map((c) => c.id);
        return rv.hand.map((x, k) => ({ pid: "?s" + k, word: pool.length ? pool[Math.floor(r() * pool.length)] : HIDDEN, owner: rv.i }));
      }
      function stepValue(S0, c, me, w, a, ra = false) {
        let bonus = (a.type === "deploy" || a.type === "ground" ? 0.8 : a.type === "buy" ? cardWorth(S0, me, S0.market[a.slot].word) : 0) + (S0.rules.modules && S0.rules.modules.length ? v32Bonus(S0, me, a) : 0);
        if (a.type === "spell" && a.sacrifice && a.targets && S0.rules.modules && S0.rules.modules.length) {
          const p = c.players[me];
          let k = p.breath;
          for (const id of a.targets) {
            const t = c.things.find((x) => x.id === id);
            if (t && !t.exhausted && k >= 1) {
              bonus += 0.8 * E2.curStrike(c, t);
              k--;
            }
          }
        }
        if (S0.rules.modules && S0.rules.modules.includes("core")) bonus -= 0.35 * w.life * rivalThreat(c, me);
        if (E2.threeOn(S0) && a.type !== "combat" && a.type !== "pass" && c.active === me) bonus += deferredAttack(S0, c, me, w);
        return value(c, me, w) + holdValue(c, me, w, ra) + bonus;
      }
      var DEFER = /* @__PURE__ */ new WeakMap();
      function deferredAttack(S0, c, me, w) {
        if (c.players[me].combatTurn === c.players[me].personalTurn) return 0;
        let best = DEFER.get(S0);
        if (best === void 0) {
          best = { gain: 0, strike: 0 };
          const base = value(S0, me, w) - 0.35 * w.life * rivalThreat(S0, me);
          const opts = E2.legalActions(S0).filter((a) => a.type === "combat");
          best.strike = opts.length ? opts.reduce((m, a) => Math.max(m, a.attackers.length), 0) : 0;
          for (const a of opts) {
            const d = clone(S0);
            if (!tryApply(d, a, { block: blocker(() => "careful:journeyman"), respond: null })) continue;
            best.gain = Math.max(best.gain, value(d, me, w) - 0.35 * w.life * rivalThreat(d, me) - base);
          }
          DEFER.set(S0, best);
        }
        if (best.gain <= 0 || !best.strike) return 0;
        const still = E2.legalActions(c).filter((a) => a.type === "combat").reduce((m, a) => Math.max(m, a.attackers.length), 0);
        return best.gain * Math.min(1, still / best.strike) * 0.9;
      }
      function tryApply(c, a, ctl) {
        try {
          E2.apply(c, a, ctl);
          return true;
        } catch (e) {
          return false;
        }
      }
      function rivalThreat(S, me) {
        const foes = S.things.filter((t) => t.ctrl !== me && !E2.incapacitated(t) && E2.perm(S, t, "strike")).map((t) => E2.curStrike(S, t)).filter((x) => x > 0).sort((a, b) => b - a);
        const guards = S.things.filter((t) => t.ctrl === me && !E2.incapacitated(t) && E2.perm(S, t, "intercept")).length;
        return foes.slice(guards).reduce((a, x) => a + x, 0);
      }
      function completeTurn(c, me, w, blk, steps) {
        const line = [];
        for (let k = 0; k < steps && c.over == null && c.active === me; k++) {
          const base = value(c, me, w) + holdValue(c, me, w);
          let best = null;
          for (const a of E2.legalActions(c)) {
            if (a.type === "pass") continue;
            const d = clone(c);
            if (!tryApply(d, a, { block: blk, respond: null })) continue;
            const v = stepValue(c, d, me, w, a);
            if (v > base + 0.05 && (!best || v > best.v)) best = { a, d, v };
          }
          if (!best) break;
          line.push(best.a);
          c = best.d;
        }
        return { c, line };
      }
      function horizon(c, me) {
        for (let k = 0; k < 4 && c.over == null; k++) {
          if (c.active === me && k > 0 && c.players[me].personalTurn > c._t0) break;
          if (!tryApply(c, { type: "pass" }, { block: () => null, respond: null })) return null;
        }
        return c;
      }
      function planRank(S, policyOf, groupOf = null) {
        const me = S.active, pol = policyOf(me), w = POLICIES[styleOf(pol)], P = TIERS2[tierOf(pol)].plan || TIERS2.planner.plan, blk = blocker(policyOf);
        const acts = E2.legalActions(S);
        const one = [];
        for (const a of acts) {
          const c = clone(S);
          if (!tryApply(c, a, { block: blk, respond: null })) continue;
          one.push({ a, c, v: a.type === "pass" ? value(S, me, w) + holdValue(S, me, w) : stepValue(S, c, me, w, a) });
        }
        one.sort((x, y) => y.v - x.v);
        const keep = one.slice(0, P.k);
        if (!keep.some((o) => o.a.type === "pass")) {
          const ps = one.find((o) => o.a.type === "pass");
          if (ps) keep.push(ps);
        }
        if (groupOf) {
          const seen = new Set(keep.map((o) => groupOf(o.a)));
          for (const o of one) {
            const gk = groupOf(o.a);
            if (gk && !seen.has(gk)) {
              seen.add(gk);
              keep.push(o);
            }
          }
        }
        for (const o of keep) {
          let c = o.c, line = [];
          if (o.a.type !== "pass" && c.active === me) ({ c, line } = completeTurn(c, me, w, blk, P.steps));
          const threat = rivalThreat(c, me);
          const c2 = clone(c);
          c2._t0 = S.players[me].personalTurn;
          const end = horizon(c2, me);
          o.line = line;
          o.threat = threat;
          const lethal = threat >= c.players[me].life;
          o.lethal = lethal;
          o.plan = lethal ? value(c, me, w) - P.threat * w.life * threat - 50 : end ? value(end, me, w) - P.threat * w.life * threat : o.v - P.threat * w.life * threat;
        }
        return { me, oneply: one, ranked: keep.sort((x, y) => y.plan - x.plan) };
      }
      function chooseAction(S, policyOf) {
        const me = S.active, pol = policyOf(me), w = POLICIES[styleOf(pol)], T = TIERS2[tierOf(pol)], blk = blocker(policyOf), ra = raOf(pol);
        if (T.plan) {
          const r = planRank(S, policyOf);
          return r.ranked.length ? r.ranked[0].a : { type: "pass" };
        }
        const samples = T.samples || (ra && RA_OPTS.samples && S.players[1 - me].reserve > 0 ? 1 : 0);
        const acts = E2.legalActions(S).filter((a) => a.type !== "pass");
        const base = value(S, me, w) + holdValue(S, me, w, ra);
        const kids = [];
        for (const a of acts) {
          const c = clone(S);
          if (!tryApply(c, a, { block: blk, respond: null })) continue;
          kids.push({ a, c, v: stepValue(S, c, me, w, a, ra) });
        }
        kids.sort((x, y) => y.v - x.v);
        if (T.depth > 1) {
          const extend = (node, depth) => {
            if (depth <= 1 || node.c.over != null || node.c.active !== me) return node.v;
            const next = E2.legalActions(node.c).filter((a) => a.type !== "pass" && a.type !== "buy");
            const gs = [];
            for (const a of next) {
              const c = clone(node.c);
              if (!tryApply(c, a, { block: blk, respond: null })) continue;
              gs.push({ a, c, v: stepValue(node.c, c, me, w, a, ra) + (node.v - value(node.c, me, w) - holdValue(node.c, me, w, ra)) });
            }
            gs.sort((x, y) => y.v - x.v);
            let best = node.v;
            for (const g of gs.slice(0, T.beam)) best = Math.max(best, extend(g, depth - 1));
            return best;
          };
          for (const k of kids.slice(0, T.beam)) k.deep = extend(k, T.depth);
          for (const k of kids) if (k.deep === void 0) k.deep = k.v;
        } else for (const k of kids) k.deep = k.v;
        if (samples) {
          const r = stateRand(S, 7, ra), rival = ra ? responderRA(policyOf) : responder(policyOf);
          for (const k of kids.slice(0, T.beam)) {
            let tot = 0;
            for (let s = 0; s < samples; s++) {
              const c = clone(S);
              c.players[1 - me].hand = sampleRivalHand(S, me, r);
              const ctl = { block: blk, respond: (S2, side, kind) => side !== me ? rival(S2, side, kind) : null };
              tot += tryApply(c, k.a, ctl) ? stepValue(S, c, me, w, k.a, ra) : k.v;
            }
            k.deep += tot / samples - k.v;
          }
        }
        const ranked = kids.filter((k) => k.deep > base + 0.05).sort((x, y) => y.deep - x.deep);
        if (!ranked.length) return { type: "pass" };
        if (T.noise) {
          const r = stateRand(S, 13, ra);
          if (r() < T.noise) return ranked[Math.min(ranked.length - 1, 1 + Math.floor(r() * 2))].a;
        }
        return ranked[0].a;
      }
      module.exports = { stepValue, V32_OPTS, planRank, rivalThreat, RA_OPTS, chooseAction, blocker, responder, responderRA, raOf, controller, decider, mulligan, POLICIES, TIERS: TIERS2, TIER_ORDER, clone, redact, value, sampleRivalHand };
    }
  });

  // ../engine29/src/formats.js
  var require_formats = __commonJS({
    "../engine29/src/formats.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var E2 = require_engine();
      var FORMATS = {
        // The V29 candidate exactly as specified (§3): second player starts with 1 reserve.
        grammar_v29_spec: { version: "0.29.0", status: "reference", arithmetic: "v29", initiative: "spec", reserve: true, market: true, marketBreath: 0, variant: {} },
        // Stage H result: opening turns are 2 breath for the starting player and 5 for the second player
        // (first player wins 50.7% ±3.0 with Journeyman bots and 51.6% ±5.6 with Specialist bots in paired tests).
        grammar_v30_rc1: { version: "0.30.0-rc1", status: "candidate", arithmetic: "v29", initiative: "combo2", reserve: true, market: true, marketBreath: 0, variant: {} },
        // Journey encounters use the candidate until a designer signs off a final competitive format.
        journey_standard: { version: "0.30.0-rc1", status: "candidate", alias: "grammar_v30_rc1" },
        // V30 Crucible experiments — each changes ONE lever against the frozen rc1 reference.
        grammar_v30_exp_price34: { version: "0.30.0-exp.price34", status: "experiment", base: "grammar_v30_rc1", variant: { priceOwn: 3, priceOff: 4 } },
        grammar_v30_exp_nosentence: { version: "0.30.0-exp.nosentence", status: "experiment", base: "grammar_v30_rc1", variant: { sentenceSpark: false } },
        grammar_v30_exp_income2: { version: "0.30.0-exp.income2", status: "experiment", base: "grammar_v30_rc1", variant: { incomeEvery: 2 } },
        grammar_v30_exp_buy2: { version: "0.30.0-exp.buy2", status: "experiment", base: "grammar_v30_rc1", variant: { buyEvery: 2 } },
        grammar_v30_exp_reserve3: { version: "0.30.0-exp.reserve3", status: "experiment", base: "grammar_v30_rc1", variant: { reserveCap: 3 } },
        grammar_v30_exp_cheapresp: { version: "0.30.0-exp.cheapresp", status: "experiment", base: "grammar_v30_rc1", variant: { responseDiscount: { "water.sleep": 1, "water.frozen": 1, "air.gust": 1, "word.doubt": 1 } } },
        // V31 Living Folio — model B (Expanded Grammar). Each module is a separate format; 'all' combines them. Market and
        // every other lever stay at the rc1 reference so module effects are never confused with price experiments.
        folio_b_orchard: { version: "0.31.0-b.orchard", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["orchard"] } },
        folio_b_workshop: { version: "0.31.0-b.workshop", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["workshop"] } },
        folio_b_decay: { version: "0.31.0-b.decay", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["decay"] } },
        folio_b_garden: { version: "0.31.0-b.garden", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["orchard", "decay"] } },
        folio_b_all: { version: "0.31.0-b.all", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["orchard", "workshop", "decay"] } },
        // V31 model C-life (isolated harness): the orchard's Bear and the workshop's Shape become public, interruptible processes
        // completed at the owner's next Main for 1 breath. Ordinary victory only. Set, Feast, Writ, Mould keep their B timing.
        folio_c_life: { version: "0.31.0-c.life", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["orchard", "workshop", "clife"] } },
        // V32 The Workshop (Volume II). Each module is its own format on top of Expanded Grammar (B = all three V31 modules), rc1
        // otherwise. Never combined with price34; never two modules at once unless the ID says so.
        // V33 The Core Duel — the single default research configuration (no Market, no Spark; grouped free combat at the rival only)
        v33_core: { version: "0.33.0-core.1", status: "research", arithmetic: "v29", initiative: "combo2", reserve: true, market: false, marketBreath: 0, variant: { modules: ["orchard", "core"] } },
        // Core Duel trial "Three Decks Worth Mastering" — the one player-facing Core Duel; 'exchange' is the isolatable full-hand Study option
        v33_core3: { version: "0.33.0-core.2-3dm", status: "research", arithmetic: "v29", initiative: "combo2", reserve: true, market: false, marketBreath: 0, variant: { modules: ["orchard", "core", "three", "exchange"] } },
        v33_core3_noex: { version: "0.33.0-core.2-3dm-noex", status: "research", arithmetic: "v29", initiative: "combo2", reserve: true, market: false, marketBreath: 0, variant: { modules: ["orchard", "core", "three"] } },
        v32_b: { version: "0.32.0-b", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["orchard", "workshop", "decay"] } },
        v32_visit: { version: "0.32.0-visit", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "visit"] } },
        v32_visit_draw: { version: "0.32.0-visit-draw", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "visit_draw"] } },
        v32_heat: { version: "0.32.0-heat", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "heat"] } },
        v32_rfruit: { version: "0.32.0-r.fruit", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "rfruit"] } },
        v32_r6: { version: "0.32.0-r.six", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "r6"] } },
        v32_rext: { version: "0.32.0-r.ext", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "r6", "rext"] } },
        v32_cap6: { version: "0.32.0-cap6", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "cap6"] } },
        v32_supply: { version: "0.32.0-supply", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "supply"] } },
        v32_supply4: { version: "0.32.0-supply4", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "supply4"] } },
        v32_w5: { version: "0.32.0-w5", status: "experiment", base: "grammar_v30_rc1", variant: { modules: [...["orchard", "workshop", "decay"], "w5"] } },
        v32_shape1: { version: "0.32.0-shape1", status: "experiment", base: "grammar_v30_rc1", variant: { modules: ["orchard", "workshop", "decay"], costOverride: { "earth.shape": 1 } } },
        // Only for comparison with the V28 maths; never for play.
        legacy_v28_maths: { version: "0.28-emulation", status: "diagnostic", arithmetic: "legacy", initiative: "spec", reserve: true, market: true, marketBreath: 0, variant: {} }
      };
      function resolveFormat(id) {
        let f = FORMATS[id];
        if (!f) throw new Error("unknown format " + id);
        if (f.alias) f = { ...FORMATS[f.alias], version: f.version, status: f.status };
        if (f.base) f = { ...FORMATS[f.base], version: f.version, status: f.status, variant: { ...FORMATS[f.base].variant, ...f.variant } };
        return { id, ...f };
      }
      function createFromFormat(id, { decks, seed, first = null, mulligan = null }) {
        const f = resolveFormat(id);
        const S = E2.createMatch({ decks, seed, first, mulligan, arithmetic: f.arithmetic, initiative: f.initiative, reserve: f.reserve, market: f.market, marketBreath: f.marketBreath, variant: f.variant });
        S.formatId = id;
        S.formatVersion = f.version;
        return S;
      }
      module.exports = { FORMATS, resolveFormat, createFromFormat };
    }
  });

  // ../engine29/data/reference_decks.js
  var require_reference_decks = __commonJS({
    "../engine29/data/reference_decks.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var L = (school, names) => names.map((n) => school + "." + n.toLowerCase());
      var REFERENCE_DECKS2 = {
        D1_living_sky: { rival: "Dorothea Finch I", words: [...L("life", ["Hare", "Wolf", "Stag", "Bramble", "Aloe", "Bite", "Mend", "Abundance", "Beasts", "Scarab"]), ...L("air", ["Swallow", "Owl", "Hawk", "Crow", "Magpie", "Winged", "Gust", "Quick", "Herald", "Storm"])] },
        D2_lockkeepers_wall: { rival: "Pieter Bream", words: [...L("water", ["Eel", "Otter", "Pike", "Ice", "Water", "Drench", "Wash", "Seep", "Tonic", "Rain"]), ...L("earth", ["Boulder", "Stone", "Iron", "Flint", "Tower", "Guard", "Crush", "Cut", "Salt", "Desert"])] },
        D3_furnace_wind: { rival: "Mara Flint", words: [...L("fire", ["Ember", "Torch", "Fire", "Bellows", "Salamander", "Firebird", "Naphtha", "Burn", "Scorch", "Kindle", "Calcine", "Wildfire"]), ...L("air", ["Swallow", "Owl", "Wind", "Gust", "Winged", "Blow", "Gasp", "Squall"])] },
        D4_orchard: { rival: "Hester Bale", words: [...L("life", ["Seed", "Sapling", "Oak", "Willow", "Pear", "Rose", "Aloe", "Bramble", "Grow", "Graft", "Harvest", "Plants"]), ...L("earth", ["Earth", "Clay", "Boulder", "Guard"]), ...L("water", ["Water", "Rain", "Dew", "Tonic"])] },
        D5_clay_and_gold: { rival: "Tess Harrow", words: [...L("earth", ["Lead", "Tin", "Copper", "Silver", "Clay", "Boulder", "Iron", "Flint", "Crucible", "Transmute", "Guard", "Crush"]), ...L("word", ["Word", "Scribe", "Familiar", "Name", "Protect", "Doubt", "Awaken", "Separate"])] },
        D6_returning_earth: { rival: "Ruth Spindle", words: [...L("rot", ["Rat", "Adder", "Spider", "Spore", "Leech", "Barrow", "Decay", "Poison", "Wither", "Exhume", "Wormwood", "Miasma"]), ...L("life", ["Hare", "Wolf", "Scarab", "Seed", "Aloe", "Bite", "Mend", "Abundance"])] },
        D7_speaking_house: { rival: "Ambrose Tickell", words: [...L("word", ["Scribe", "Bard", "Hermit", "Word", "Grimoire", "Omen", "Protect", "Doubt", "Dispel", "Scream", "Be"]), ...L("air", ["Owl", "Herald", "Gust", "Winged", "Quick", "Gasp"]), ...L("life", ["Hare", "Wolf", "Beasts"])] },
        D8_garden_of_endings: { rival: "Dorothea Finch III", words: [...L("life", ["Seed", "Sapling", "Oak", "Willow", "Pear", "Scarab", "Grow", "Graft", "Mend"]), ...L("rot", ["Rat", "Adder", "Barrow", "Decay", "Exhume", "Wither"]), ...L("water", ["Water", "Rain", "Dew", "Tonic", "Memory"])] },
        D4B_experimentalist: { rival: "Dorothea Finch II", words: [...L("life", ["Seed", "Sapling", "Oak", "Willow", "Aloe", "Bramble", "Grow", "Graft", "Wolf", "Stag", "Bite", "Abundance"]), ...L("earth", ["Earth", "Clay", "Boulder", "Guard"]), ...L("water", ["Water", "Rain", "Dew", "Tonic"])] },
        D5B_patient_ruin: { rival: "Lucan Reeve", words: [...L("earth", ["Lead", "Clay", "Boulder", "Iron", "Flint", "Crucible", "Transmute", "Guard", "Crush"]), ...L("rot", ["Rat", "Barrow", "Rust", "Decay", "Wither", "Ghost"]), ...L("word", ["Word", "Scribe", "Name", "Protect", "Doubt"])] }
      };
      module.exports = { REFERENCE_DECKS: REFERENCE_DECKS2, REF: Object.fromEntries(Object.entries(REFERENCE_DECKS2).map(([k, v]) => [k, v.words])) };
    }
  });

  // ../engine29/data/themed_decks.js
  var require_themed_decks = __commonJS({
    "../engine29/data/themed_decks.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var D = (...ids) => ids;
      var THEMED2 = {
        T_fire_burn: D(
          "fire.ember",
          "fire.salamander",
          "fire.firebird",
          "fire.smith",
          "fire.naphtha",
          "fire.torch",
          "fire.burn",
          "fire.scorch",
          "fire.kindle",
          "fire.calcine",
          "fire.wildfire",
          "fire.drought",
          "fire.firebrand",
          "fire.bellows",
          "air.swallow",
          "air.owl",
          "air.wind",
          "air.blow",
          "air.gasp",
          "air.gust"
        ),
        T_air_evasion: D(
          "air.swallow",
          "air.owl",
          "air.hawk",
          "air.crow",
          "air.magpie",
          "air.wind",
          "air.herald",
          "air.winged",
          "air.quick",
          "air.squall",
          "air.gust",
          "air.gasp",
          "air.storm",
          "air.blow",
          "air.orrery",
          "life.hare",
          "life.wolf",
          "life.bite",
          "life.feral",
          "life.mend"
        ),
        T_earth_endurance: D(
          "earth.boulder",
          "earth.stone",
          "earth.iron",
          "earth.flint",
          "earth.lead",
          "earth.amber",
          "earth.tower",
          "earth.guard",
          "earth.crush",
          "earth.cut",
          "earth.temper",
          "earth.leaden",
          "earth.salt",
          "earth.winter",
          "water.ice",
          "water.pike",
          "water.tonic",
          "water.drench",
          "water.dew",
          "water.sleep"
        ),
        T_water_control: D(
          "water.eel",
          "water.otter",
          "water.pike",
          "water.ice",
          "water.seep",
          "water.wash",
          "water.tide",
          "water.dew",
          "water.drench",
          "water.frozen",
          "water.thaw",
          "water.sleep",
          "water.tonic",
          "water.rain",
          "water.memory",
          "word.protect",
          "word.doubt",
          "word.dispel",
          "word.scribe",
          "word.omen"
        ),
        T_life_growth: D(
          "life.seed",
          "life.sapling",
          "life.oak",
          "life.willow",
          "life.bramble",
          "life.ivy",
          "life.pear",
          "life.rose",
          "life.saffron",
          "life.wolf",
          "life.stag",
          "life.grow",
          "life.abundance",
          "life.spring",
          "life.harvest",
          "life.thorny",
          "life.bind",
          "earth.earth",
          "earth.guard",
          "earth.boulder"
        ),
        T_rot_poison: D(
          "rot.rat",
          "rot.adder",
          "rot.spider",
          "rot.spore",
          "rot.toadstool",
          "rot.yew",
          "rot.leech",
          "rot.poison",
          "rot.miasma",
          "rot.venomous",
          "rot.decay",
          "rot.wither",
          "rot.barrow",
          "rot.debt",
          "life.hare",
          "life.wolf",
          "life.bite",
          "life.scarab",
          "life.mend",
          "life.aloe"
        ),
        T_rot_recursion: D(
          "rot.rat",
          "rot.ghost",
          "rot.leech",
          "rot.wormwood",
          "rot.barrow",
          "rot.decay",
          "rot.exhume",
          "rot.haunt",
          "rot.rust",
          "rot.wither",
          "rot.feeble",
          "life.scarab",
          "life.hare",
          "life.wolf",
          "earth.amber",
          "earth.boulder",
          "earth.stone",
          "earth.guard",
          "earth.crush",
          "earth.flint"
        ),
        T_word_speakers: D(
          "word.scribe",
          "word.bard",
          "word.hermit",
          "word.word",
          "word.familiar",
          "word.grimoire",
          "word.scream",
          "word.be",
          "word.name",
          "word.omen",
          "word.silence",
          "word.protect",
          "word.doubt",
          "word.reckoning",
          "life.beasts",
          "life.feral",
          "life.wolf",
          "life.hare",
          "life.stag",
          "life.bite"
        ),
        T_grand_work: D(
          "earth.silver",
          "earth.clay",
          "earth.transmute",
          "earth.crucible",
          "earth.boulder",
          "earth.guard",
          "fire.ember",
          "fire.firebird",
          "fire.calcine",
          "fire.kindle",
          "air.wind",
          "air.owl",
          "air.swallow",
          "air.gust",
          "air.gasp",
          "earth.stone",
          "earth.iron",
          "fire.salamander",
          "fire.scorch",
          "earth.crush"
        )
      };
      var COUNTERS2 = {
        C_anti_poison: D(
          "fire.ember",
          "fire.salamander",
          "fire.firebird",
          "fire.torch",
          "fire.scorch",
          "fire.kindle",
          "fire.wildfire",
          "fire.calcine",
          "earth.boulder",
          "earth.stone",
          "earth.iron",
          "earth.guard",
          "earth.crush",
          "earth.salt",
          "water.ice",
          "water.pike",
          "water.tonic",
          "water.dew",
          "water.sleep",
          "water.drench"
        ),
        C_anti_air: D(
          "earth.boulder",
          "earth.tower",
          "earth.stone",
          "earth.iron",
          "earth.guard",
          "earth.crush",
          "earth.leaden",
          "earth.desert",
          "life.bramble",
          "life.ivy",
          "life.rose",
          "life.thorny",
          "life.bind",
          "life.stag",
          "life.wolf",
          "water.pike",
          "water.drench",
          "water.ice",
          "water.sleep",
          "water.tonic"
        )
      };
      module.exports = { THEMED: THEMED2, COUNTERS: COUNTERS2, ALL: { ...THEMED2, ...COUNTERS2 } };
    }
  });

  // ../engine29/data/folio_decks.js
  var require_folio_decks = __commonJS({
    "../engine29/data/folio_decks.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var O_B = [
        "life.bee",
        "life.pear",
        "life.hazel",
        "life.feast",
        "life.seed",
        "life.sapling",
        "life.bramble",
        "life.grow",
        "life.rose",
        "life.wolf",
        "life.hare",
        "life.plants",
        "water.water",
        "water.dew",
        "water.otter",
        "water.seep",
        "air.wind",
        "air.gust",
        "air.owl",
        "air.herald"
      ];
      var F_B = [
        "earth.copper",
        "earth.silver",
        "earth.garnet",
        "earth.shape",
        "earth.guard",
        "earth.boulder",
        "earth.iron",
        "earth.flint",
        "earth.crush",
        "earth.temper",
        "fire.smith",
        "fire.ember",
        "fire.scorch",
        "fire.calcine",
        "fire.kindle",
        "word.writ",
        "word.scribe",
        "word.protect",
        "word.doubt",
        "word.scream"
      ];
      var M_B = [
        "life.pear",
        "life.seed",
        "life.sapling",
        "life.bee",
        "life.bramble",
        "life.grow",
        "life.feast",
        "life.wolf",
        "rot.mould",
        "rot.rat",
        "rot.barrow",
        "rot.decay",
        "rot.wither",
        "rot.exhume",
        "rot.adder",
        "rot.poison",
        "rot.spider",
        "water.water",
        "water.dew",
        "water.otter"
      ];
      var swap = (d, m) => d.map((w) => m[w] || w);
      var FOLIO_DECKS2 = {
        O_orchard_crosswind: { words: O_B, modules: ["orchard"], note: "The orchard in a crosswind" },
        F_seal_cutter: { words: F_B, modules: ["workshop"], note: "The seal-cutter" },
        M_returning_garden: { words: M_B, modules: ["orchard", "decay"], note: "The returning garden" }
      };
      var ABLATIONS2 = {
        // A ablations (rc1-legal): file 05 "Fair paired substitutions"
        O_A: swap(O_B, { "life.bee": "life.scarab", "life.hazel": "life.aloe", "life.feast": "life.abundance" }),
        F_A: swap(F_B, { "earth.garnet": "earth.clay", "earth.shape": "earth.transmute", "word.writ": "word.omen" }),
        M_A: swap(M_B, { "life.bee": "life.scarab", "life.feast": "life.abundance", "rot.mould": "rot.toadstool" })
      };
      module.exports = { FOLIO_DECKS: FOLIO_DECKS2, ABLATIONS: ABLATIONS2, O_B, F_B, M_B };
    }
  });

  // ../engine29/data/spec_catalogue.json
  var require_spec_catalogue = __commonJS({
    "../engine29/data/spec_catalogue.json"(exports, module) {
      module.exports = [
        {
          name: "Ember",
          school: "fire",
          type: "thing",
          r: false,
          cost: 1,
          strike: 1,
          stand: 2,
          text: "Non-living, Hot, Body. Can Burn and Scorch. Eligible Energy and Steam ingredient."
        },
        {
          name: "Torch",
          school: "fire",
          type: "ground",
          r: false,
          cost: 1,
          strike: null,
          stand: 2,
          text: "At your upkeep, deal 1 damage to rival."
        },
        {
          name: "Fire",
          school: "fire",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "At your upkeep, Ignite oldest eligible visible enemy Thing which is Flammable, damaged and not already Burning. Reagent for Fireborn recipes."
        },
        {
          name: "Bellows",
          school: "fire",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "At your upkeep, gain 1 additional breath."
        },
        {
          name: "Smith",
          school: "fire",
          type: "thing",
          r: false,
          cost: 3,
          strike: 3,
          stand: 3,
          text: "Living Person, Body, Flammable. Crush and Burn capabilities."
        },
        {
          name: "Salamander",
          school: "fire",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 3,
          text: "Living Beast, Body, Hot, Flammable. Bite. After dealing positive combat damage to a flammable Thing, Ignite it if it survives."
        },
        {
          name: "Firebird",
          school: "fire",
          type: "thing",
          r: false,
          cost: 3,
          strike: 2,
          stand: 2,
          text: "Living Beast, Bird, Winged, Flying, Swift, Hot, Body. After dealing positive combat damage to a flammable Thing, Ignite it if it survives. Phoenix ingredient."
        },
        {
          name: "Naphtha",
          school: "fire",
          type: "thing",
          r: false,
          cost: 2,
          strike: 0,
          stand: 3,
          text: "Non-living Liquid, Flammable. First time this physical card is Ignited in duel, deal 2 damage to every enemy Thing simultaneously, then destroy Naphtha if still present."
        },
        {
          name: "Burn",
          school: "fire",
          type: "action",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Hot or ignition-capable subject. Remote: Ignite a flammable Thing not Wet and not already at 2 burning ticks."
        },
        {
          name: "Scorch",
          school: "fire",
          type: "action",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Hot subject. Remote: deal 2 damage to enemy Thing or rival; cannot be blocked."
        },
        {
          name: "Kindle",
          school: "fire",
          type: "spell",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Friendly Thing +1 strike until end of current turn. If it deals positive combat damage to a flammable Thing this turn, Ignite surviving target."
        },
        {
          name: "Calcine",
          school: "fire",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Sacrifice friendly Thing as additional cost. Deal 3 damage to enemy Thing or rival. Create Ash if space."
        },
        {
          name: "Wildfire",
          school: "fire",
          type: "spell",
          r: false,
          cost: 4,
          strike: null,
          stand: null,
          text: "Deal 2 damage to every Burning Thing on both sides. Also rival takes 1 damage for each enemy Burning Thing at beginning of resolution, max 3. Simultaneous damage."
        },
        {
          name: "Drought",
          school: "fire",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Each upkeep remove Wet from active player's Things. First time each player during own turn Ignites enemy Thing, that Thing takes 1 additional damage."
        },
        {
          name: "Firebrand",
          school: "fire",
          type: "quality",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Attach to friendly Thing. Grants Hot; +1 damage on first unblocked combat hit against rival each own turn. Lawful."
        },
        {
          name: "Eel",
          school: "water",
          type: "thing",
          r: false,
          cost: 1,
          strike: 1,
          stand: 2,
          text: "Living Beast, Sea-born, Body."
        },
        {
          name: "Otter",
          school: "water",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 3,
          text: "Living Beast, Sea-born, Swift, Body, Flammable. Bite."
        },
        {
          name: "Pike",
          school: "water",
          type: "thing",
          r: false,
          cost: 3,
          strike: 3,
          stand: 4,
          text: "Living Beast, Sea-born, Body. Bite."
        },
        {
          name: "Ice",
          school: "water",
          type: "thing",
          r: false,
          cost: 2,
          strike: 0,
          stand: 4,
          text: "Non-living, Heavy, Guard. After receiving combat damage, make attacker Wet if still in play. Once per turn."
        },
        {
          name: "Water",
          school: "water",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "At your upkeep choose friendly Thing, make Wet and heal 1 marked damage. Aquatic reagent."
        },
        {
          name: "Dew",
          school: "water",
          type: "spell",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Choose friendly Thing: make Wet and remove 1 poison dose; alternatively remove 1 poison dose from yourself."
        },
        {
          name: "Tonic",
          school: "water",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Potion. Heal yourself 3 life, remove 1 poison dose from yourself."
        },
        {
          name: "Drench",
          school: "water",
          type: "action",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Liquid or Sea-born subject. Remote: make target Thing Wet. If Hot, deal 1 damage to it."
        },
        {
          name: "Seep",
          school: "water",
          type: "action",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Liquid or Sea-born subject. Remote: deal 2 damage to enemy Thing or rival; cannot be blocked."
        },
        {
          name: "Wash",
          school: "water",
          type: "action",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Liquid or Sea-born subject. Push: return enemy non-Heavy Thing with maximum stand <= 4."
        },
        {
          name: "Frozen",
          school: "water",
          type: "spell",
          r: true,
          cost: 2,
          strike: null,
          stand: null,
          text: "Apply Frozen to a Wet Thing."
        },
        {
          name: "Memory",
          school: "water",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Recover one of your Action or Spell cards printed cost <= 2, excluding Memory. Seal this Memory on successful resolution."
        },
        {
          name: "Rain",
          school: "water",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "On arrival make every Thing Wet. At each upkeep heal 1 damage from active player's oldest damaged Thing."
        },
        {
          name: "Vitriol",
          school: "water",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Non-living Liquid, Body, Dissolve. Main, 2 breath, exhaust: deal 3 damage to Metal or Stone Thing. Alkahest ingredient."
        },
        {
          name: "Quicksilver",
          school: "water",
          type: "thing",
          r: false,
          cost: 1,
          strike: 0,
          stand: 2,
          text: "Non-living Liquid, Metal, Incorruptible. Alkahest ingredient."
        },
        {
          name: "Flask",
          school: "water",
          type: "ground",
          r: false,
          cost: 1,
          strike: null,
          stand: 2,
          text: "First Potion successfully played each own turn heals you for 1 additional life. Homunculus ingredient."
        },
        {
          name: "Tide",
          school: "water",
          type: "spell",
          r: false,
          cost: 4,
          strike: null,
          stand: null,
          text: "Push: return up to 2 enemy non-Heavy Things, each maximum stand <= 4. At least one target required."
        },
        {
          name: "Sleep",
          school: "water",
          type: "spell",
          r: true,
          cost: 2,
          strike: null,
          stand: null,
          text: "Apply Asleep to Living Beast or Person."
        },
        {
          name: "Dissolve",
          school: "water",
          type: "action",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Dissolve-capable subject. Remote: deal 3 damage to Metal, Stone or Liquid target Thing or Ground; otherwise 2 damage to target Thing."
        },
        {
          name: "Thaw",
          school: "water",
          type: "spell",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Remove Frozen from target Thing. If friendly, heal 1 damage."
        },
        {
          name: "Owl",
          school: "air",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 2,
          text: "Living Beast, Bird, Winged, Flying, Sharp, Body, Flammable. On arrival optionally reveal enemy Concealed Thing."
        },
        {
          name: "Hawk",
          school: "air",
          type: "thing",
          r: false,
          cost: 3,
          strike: 3,
          stand: 3,
          text: "Living Beast, Bird, Winged, Flying, Sharp, Body, Flammable."
        },
        {
          name: "Swallow",
          school: "air",
          type: "thing",
          r: false,
          cost: 1,
          strike: 1,
          stand: 1,
          text: "Living Beast, Bird, Winged, Flying, Swift, Body, Flammable."
        },
        {
          name: "Crow",
          school: "air",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Beast, Bird, Winged, Flying, Body, Flammable. First time a Living Thing dies during each own turn, gain 1 Might counter."
        },
        {
          name: "Magpie",
          school: "air",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 2,
          text: "Living Beast, Bird, Winged, Flying, Body, Flammable. First time it deals combat damage to rival each own turn, gain 1 spark subject to additional-income cap."
        },
        {
          name: "Wind",
          school: "air",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Non-living, Flying (wingless), Body. Blow capability. Winged recipe reagent."
        },
        {
          name: "Air",
          school: "air",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "At your upkeep inspect and reorder top 2 words of your deck."
        },
        {
          name: "Gust",
          school: "air",
          type: "spell",
          r: true,
          cost: 2,
          strike: null,
          stand: null,
          text: "Push: return enemy non-Heavy Thing with current strike <= 2."
        },
        {
          name: "Winged",
          school: "air",
          type: "quality",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Attach to compatible friendly Thing. Grants Winged, Flying, Blow. Lawful."
        },
        {
          name: "Quick",
          school: "air",
          type: "quality",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Attach to friendly Thing. Grants Quick."
        },
        {
          name: "Resonant",
          school: "air",
          type: "quality",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Attach to Thing. First time it takes damage each turn, deal 1 damage to every other Thing sharing base word. Resonance damage cannot trigger further Resonance."
        },
        {
          name: "Blow",
          school: "air",
          type: "action",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Blow-capable subject. Choose distinct ready friendly Thing with Hot, Liquid or Toxic; exhaust payload as additional cost. Choose qualifying property and up to 2 eligible enemy Things. Apply Burning, Wet or 1 poison dose respectively. Both subject and payload must remain present."
        },
        {
          name: "Storm",
          school: "air",
          type: "weather",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Each upkeep deal 1 damage to active player's oldest non-Flying Thing, or 2 if Wet."
        },
        {
          name: "Squall",
          school: "air",
          type: "spell",
          r: false,
          cost: 4,
          strike: null,
          stand: null,
          text: "Exhaust 1\u20133 friendly Flying Things eligible to act as additional cost. Deal 2 non-combat damage to rival per Thing exhausted, one batch."
        },
        {
          name: "Gasp",
          school: "air",
          type: "spell",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Gain 2 additional breath, subject to generation cap."
        },
        {
          name: "Herald",
          school: "air",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Person, Body, Flammable. On arrival inspect top 2 deck cards and select 1 into hand."
        },
        {
          name: "Orrery",
          school: "air",
          type: "ground",
          r: false,
          cost: 3,
          strike: null,
          stand: 4,
          text: "Your Things cannot take damage directly from Sky effects. Other Weather effects still apply."
        },
        {
          name: "Birds",
          school: "air",
          type: "category",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Catalogue: inspect top 3 deck words; select Bird Thing if present. Category = intrinsic Bird."
        },
        {
          name: "Boulder",
          school: "earth",
          type: "thing",
          r: false,
          cost: 3,
          strike: 2,
          stand: 6,
          text: "Non-living Stone, Heavy, Body, Guard, Bedrock."
        },
        {
          name: "Stone",
          school: "earth",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 4,
          text: "Non-living Stone, Heavy, Body. Stonebound reagent."
        },
        {
          name: "Clay",
          school: "earth",
          type: "thing",
          r: false,
          cost: 1,
          strike: 0,
          stand: 3,
          text: "Non-living Clay. Golem and Swamp ingredient."
        },
        {
          name: "Lead",
          school: "earth",
          type: "thing",
          r: false,
          cost: 1,
          strike: 1,
          stand: 3,
          text: "Non-living Metal, Heavy, Body. Metal ladder lowest form."
        },
        {
          name: "Tin",
          school: "earth",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Non-living Metal, Body. Intermediate metal form."
        },
        {
          name: "Copper",
          school: "earth",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 2,
          text: "Non-living Metal, Body. Alternative intermediate form."
        },
        {
          name: "Silver",
          school: "earth",
          type: "thing",
          r: false,
          cost: 3,
          strike: 2,
          stand: 4,
          text: "Non-living Metal, Body, Sacred. Intermediate metal form."
        },
        {
          name: "Iron",
          school: "earth",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 4,
          text: "Non-living Metal, Heavy, Body. Not in standard metal ladder."
        },
        {
          name: "Flint",
          school: "earth",
          type: "thing",
          r: false,
          cost: 1,
          strike: 2,
          stand: 1,
          text: "Non-living Stone, Sharp, Body. Burn capability."
        },
        {
          name: "Crucible",
          school: "earth",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 4,
          text: "First fusion each own turn costs 1 less breath, minimum 2."
        },
        {
          name: "Earth",
          school: "earth",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "At your upkeep give 1 Growth counter to oldest eligible friendly Plant."
        },
        {
          name: "Salt",
          school: "earth",
          type: "ground",
          r: false,
          cost: 1,
          strike: null,
          stand: 2,
          text: "Enemy Haunt actions cannot target your Things."
        },
        {
          name: "Amber",
          school: "earth",
          type: "thing",
          r: false,
          cost: 2,
          strike: 0,
          stand: 3,
          text: "Non-living material. First time another friendly original Living Thing dies while Amber remains, recover its original card if possible, then sacrifice Amber. Once per physical Amber card per duel."
        },
        {
          name: "Guard",
          school: "earth",
          type: "spell",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Friendly Thing gains +2 maximum stand until end of current turn. Gains Guard until it next exhausts or reaches applicable End."
        },
        {
          name: "Crush",
          school: "earth",
          type: "action",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Heavy or Crush-capable subject. Combat: strike +2. Excess beyond stand required to destroy defending Thing carries through to rival once. No overflow from directly attacking Ground."
        },
        {
          name: "Cut",
          school: "earth",
          type: "action",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Sharp or Cut-capable subject. Combat: strike +1. Alternatively remove Bound from reachable friendly Thing instead of damage."
        },
        {
          name: "Temper",
          school: "earth",
          type: "quality",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Attach to friendly Metal Thing. +2 maximum stand, immune to Rust and Brittle. Remove existing Brittle condition/attachment on resolution."
        },
        {
          name: "Transmute",
          school: "earth",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Advance friendly Thing one permitted metal ladder edge; choose branch at declaration."
        },
        {
          name: "Desert",
          school: "earth",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "While present, wing-dependent flight suppressed. Does not ground wingless atmospheric Things/spirits."
        },
        {
          name: "Tower",
          school: "earth",
          type: "ground",
          r: false,
          cost: 3,
          strike: null,
          stand: 5,
          text: "Your Heavy Things gain Reach."
        },
        {
          name: "Winter",
          school: "earth",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "On arrival freeze all Wet Things and remove their Wet. At each upkeep freeze active player's oldest Wet Thing, then remove Wet."
        },
        {
          name: "Leaden",
          school: "earth",
          type: "quality",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Attach to Thing. Heavy, +1 maximum stand, loses Flying. Lawful."
        },
        {
          name: "Fixed",
          school: "earth",
          type: "quality",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Attach to friendly Thing; Fixed while attached."
        },
        {
          name: "Metals",
          school: "earth",
          type: "category",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Catalogue: inspect top 3 words; select Metal Thing if present. Category = intrinsic Metal."
        },
        {
          name: "Wolf",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 3,
          text: "Living Beast, Body, Flammable. Bite. +1 strike while controlling another Beast."
        },
        {
          name: "Stag",
          school: "life",
          type: "thing",
          r: false,
          cost: 3,
          strike: 3,
          stand: 4,
          text: "Living Beast, Body, Sharp, Flammable."
        },
        {
          name: "Hare",
          school: "life",
          type: "thing",
          r: false,
          cost: 1,
          strike: 1,
          stand: 2,
          text: "Living Beast, Body, Swift, Flammable."
        },
        {
          name: "Seed",
          school: "life",
          type: "thing",
          r: false,
          cost: 1,
          strike: 0,
          stand: 2,
          text: "Living Plant, Flammable. At upkeep gain 1 age; at 2 transform into Sapling."
        },
        {
          name: "Sapling",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Plant, Tree, Body, Flammable. At upkeep gain 1 age; at 2 transform into Willow with Water Ground, otherwise Oak."
        },
        {
          name: "Oak",
          school: "life",
          type: "thing",
          r: false,
          cost: 4,
          strike: 3,
          stand: 6,
          text: "Living Plant, Tree, Body, Heavy, Flammable. World Tree ingredient."
        },
        {
          name: "Willow",
          school: "life",
          type: "thing",
          r: false,
          cost: 3,
          strike: 1,
          stand: 5,
          text: "Living Plant, Tree, Herb, Body, Flammable. Mend. Main, 1 breath, exhaust: heal friendly Thing 2."
        },
        {
          name: "Pear",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Plant, Tree, Orchard, Flower, Body, Flammable. First time another friendly Plant gains a Growth counter during own turn, create Fruit if controlling none and space available. New collectible word."
        },
        {
          name: "Rose",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Plant, Flower, Body, Reach, Flammable. Sting. On arrival, if controlling another Flower and no Blossom, create Blossom if space. New collectible word."
        },
        {
          name: "Saffron",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 0,
          stand: 2,
          text: "Living Plant, Flower, Herb. First time another Flower enters your field each own turn, gain 1 spark subject to additional-income cap."
        },
        {
          name: "Aloe",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 0,
          stand: 3,
          text: "Living Plant, Herb. Mend. At upkeep heal 1 damage from oldest damaged friendly Thing."
        },
        {
          name: "Bramble",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 4,
          text: "Living Plant, Body, Reach, Flammable. Bind, Sting. After dealing positive retaliation damage to surviving Living attacker, apply Bound."
        },
        {
          name: "Apothecary",
          school: "life",
          type: "thing",
          r: false,
          cost: 3,
          strike: 2,
          stand: 3,
          text: "Living Person, Body, Flammable. Mend. Main, 1 breath, exhaust: heal friendly Thing 2 or remove 1 poison dose from it."
        },
        {
          name: "Graft",
          school: "life",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Registered Grafted Plant recipe on two compatible friendly Plants. Counts as Vessel use. Pay catalyst if required. Printed price is entire recipe price before discount."
        },
        {
          name: "Grow",
          school: "life",
          type: "spell",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Give friendly Plant 1 Growth counter. If unfinished plant ladder, also advance age by 1 subject to ladder rules."
        },
        {
          name: "Mend",
          school: "life",
          type: "action",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Mend-capable subject. Heal damaged friendly Thing 3."
        },
        {
          name: "Bite",
          school: "life",
          type: "action",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Bite-capable subject. Combat against Living Thing or rival: strike +1. No damage to Sacred/non-living interceptor."
        },
        {
          name: "Abundance",
          school: "life",
          type: "spell",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Up to 3 distinct friendly Living Things gain 1 Growth counter each. Give 1 of those selected Things 1 Might counter."
        },
        {
          name: "Spring",
          school: "life",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Each upkeep advance age of active player's oldest unfinished plant ladder by 1; heal 1 damage from their oldest damaged Living Thing."
        },
        {
          name: "Harvest",
          school: "life",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Each upkeep, if active player controls Plant and no Fruit, create Fruit if space."
        },
        {
          name: "Beasts",
          school: "life",
          type: "category",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Catalogue: inspect top 3 deck words; select Beast Thing if present. Category = intrinsic Beast."
        },
        {
          name: "Plants",
          school: "life",
          type: "category",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Catalogue: inspect top 3 deck words; select Plant Thing if present. Category = intrinsic Plant."
        },
        {
          name: "Scarab",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 2,
          text: "Living Beast, Insect, Body, Sacred, Recurrent. Ouroboros ingredient."
        },
        {
          name: "Ivy",
          school: "life",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Plant, Body, Reach, Flammable. Bind."
        },
        {
          name: "Bind",
          school: "life",
          type: "action",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Bind-capable subject. Contact: apply Bound to enemy Thing within reach."
        },
        {
          name: "Tame",
          school: "life",
          type: "spell",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Take control of enemy original Beast Thing, current strike <= 2, not Named, empty destination slot required."
        },
        {
          name: "Thorny",
          school: "life",
          type: "quality",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Attach to friendly Thing. Reach, Sting. Lawful."
        },
        {
          name: "Feral",
          school: "life",
          type: "quality",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Attach to friendly Thing. +1 strike, Bite. Lawful."
        },
        {
          name: "Rat",
          school: "rot",
          type: "thing",
          r: false,
          cost: 1,
          strike: 1,
          stand: 2,
          text: "Living Beast, Body, Flammable. On death apply 1 poison dose to eligible visible enemy Living Thing chosen by controller."
        },
        {
          name: "Adder",
          school: "rot",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 2,
          text: "Living Beast, Serpent, Body, Venomous. Bite. Ouroboros ingredient."
        },
        {
          name: "Spider",
          school: "rot",
          type: "thing",
          r: false,
          cost: 2,
          strike: 2,
          stand: 2,
          text: "Living Beast, Body, Venomous. Bite, Bind."
        },
        {
          name: "Spore",
          school: "rot",
          type: "thing",
          r: false,
          cost: 1,
          strike: 0,
          stand: 1,
          text: "Living Fungus, Flying (wingless). On death apply 1 poison dose to eligible visible enemy Living Thing."
        },
        {
          name: "Leech",
          school: "rot",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Beast, Sea-born, Body. Bite. First positive combat damage to Living Thing or rival each own turn, heal controller 1 life."
        },
        {
          name: "Barrow",
          school: "rot",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "First time an original friendly Living Thing dies during each own turn, create Carrion if space."
        },
        {
          name: "Ghost",
          school: "rot",
          type: "thing",
          r: false,
          cost: 3,
          strike: 2,
          stand: 3,
          text: "Non-living Spirit, Dark, Flying (wingless), Body. Haunt."
        },
        {
          name: "Wormwood",
          school: "rot",
          type: "thing",
          r: false,
          cost: 2,
          strike: 0,
          stand: 3,
          text: "Living Plant, Herb, Toxic. At upkeep remove 1 poison dose from yourself or chosen friendly Thing."
        },
        {
          name: "Yew",
          school: "rot",
          type: "thing",
          r: false,
          cost: 3,
          strike: 1,
          stand: 4,
          text: "Living Plant, Tree, Toxic, Body, Flammable. On death apply 1 poison dose to eligible visible enemy Living Thing."
        },
        {
          name: "Decay",
          school: "rot",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Sacrifice friendly Thing as additional cost. Deal 3 damage to enemy Thing, 4 if sacrificed Thing was Carrion."
        },
        {
          name: "Poison",
          school: "rot",
          type: "action",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Toxic subject. Remote: apply 2 poison doses to enemy Living Thing or rival, normal cap 3."
        },
        {
          name: "Rust",
          school: "rot",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Target enemy non-Incorruptible Metal Thing. Deal 3 damage and regress one permitted metal-ladder edge if possible, simultaneous batch."
        },
        {
          name: "Wither",
          school: "rot",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Enemy Living Thing: if Plant, remove up to 2 Growth counters and deal 2 damage; otherwise deal 1 damage."
        },
        {
          name: "Haunt",
          school: "rot",
          type: "action",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Spirit/Dark subject. Remote: return enemy non-Sacred Thing with maximum stand <= 4. Not Push. Salt prevents targeting."
        },
        {
          name: "Exhume",
          school: "rot",
          type: "spell",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Revive one of your original Thing cards printed cost <= 2. Seal Exhume on successful resolution. New collectible word."
        },
        {
          name: "Miasma",
          school: "rot",
          type: "spell",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Apply 1 poison dose simultaneously to every enemy Living Thing and rival."
        },
        {
          name: "Night",
          school: "rot",
          type: "weather",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "First original Thing each player deploys during their own turn enters Concealed. Concealment persists after Night leaves Sky."
        },
        {
          name: "Venomous",
          school: "rot",
          type: "quality",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Attach to Thing; grants Venomous. Lawful."
        },
        {
          name: "Debt",
          school: "rot",
          type: "burden",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Each of affected rival's next 2 upkeeps they spend 1 spark or lose 1 life. If no spark, lose life. Retire after second tick."
        },
        {
          name: "Feeble",
          school: "rot",
          type: "quality",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Attach to enemy Thing; \u22121 strike while attached."
        },
        {
          name: "Toadstool",
          school: "rot",
          type: "thing",
          r: false,
          cost: 1,
          strike: 0,
          stand: 2,
          text: "Living Fungus, Toxic. When sacrificed, apply 1 poison dose to eligible visible enemy Living Thing."
        },
        {
          name: "Shadow",
          school: "rot",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 2,
          text: "Non-living Spirit, Dark, Body. Enters Concealed. Haunt."
        },
        {
          name: "Word",
          school: "word",
          type: "thing",
          r: false,
          cost: 1,
          strike: 0,
          stand: 3,
          text: "Non-living, Body. First other successful hand-card sentence each own turn grants 1 Might counter. Golem/Homunculus ingredient."
        },
        {
          name: "Scribe",
          school: "word",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Person, Body, Speaker, Flammable. On arrival inspect/reorder top 2 deck cards."
        },
        {
          name: "Bard",
          school: "word",
          type: "thing",
          r: false,
          cost: 3,
          strike: 2,
          stand: 3,
          text: "Living Person, Body, Speaker, Flammable. First successful Voiced spell each own turn: draw 1."
        },
        {
          name: "Hermit",
          school: "word",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 3,
          text: "Living Person, Body, Speaker, Flammable. Enters Concealed."
        },
        {
          name: "Familiar",
          school: "word",
          type: "thing",
          r: false,
          cost: 2,
          strike: 1,
          stand: 2,
          text: "Living Beast, Body, Flammable. First fusion each own turn costs 1 less, minimum 2. Does not stack with Crucible."
        },
        {
          name: "Grimoire",
          school: "word",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 2,
          text: "On arrival draw 1. At upkeep inspect/reorder top 2 deck words."
        },
        {
          name: "Ink",
          school: "word",
          type: "ground",
          r: false,
          cost: 2,
          strike: null,
          stand: 3,
          text: "At upkeep gain 1 extra spark subject to additional-income cap."
        },
        {
          name: "Omen",
          school: "word",
          type: "spell",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Inspect top 3 deck words, select 1 to hand, others to bottom in chosen order."
        },
        {
          name: "Name",
          school: "word",
          type: "spell",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Give friendly Thing Named. No automatic Golem in this candidate."
        },
        {
          name: "Protect",
          school: "word",
          type: "spell",
          r: true,
          cost: 1,
          strike: null,
          stand: null,
          text: "Give friendly Thing Ward if not already Ward."
        },
        {
          name: "Measure",
          school: "word",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Give enemy Thing Measured."
        },
        {
          name: "Dispel",
          school: "word",
          type: "spell",
          r: true,
          cost: 2,
          strike: null,
          stand: null,
          text: "Retire one standing Quality attachment, Burden, Weather or Law. Alternatively reveal enemy Concealed Thing."
        },
        {
          name: "Doubt",
          school: "word",
          type: "spell",
          r: true,
          cost: 2,
          strike: null,
          stand: null,
          text: "Response: cancel pending rival Spell, Quality, Weather, Burden or Law total printed card cost <= 3. Main alternative: reveal enemy Concealed Thing."
        },
        {
          name: "Echo",
          school: "word",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Next successful Action card this turn returns to hand instead of being spent, if room. Does not repeat action automatically. Seal Echo on successful resolution."
        },
        {
          name: "Silence",
          school: "word",
          type: "spell",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Reveal rival's current hand. Choose 1 Action or Spell there cost <= 3 and discard it. If none qualifies only reveal."
        },
        {
          name: "Scream",
          school: "word",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Voice. Deal 2 damage to rival; remove Asleep from all Things."
        },
        {
          name: "Reckoning",
          school: "word",
          type: "spell",
          r: false,
          cost: 4,
          strike: null,
          stand: null,
          text: "Destroy all enemy Things maximum stand <= 2 simultaneously."
        },
        {
          name: "Be",
          school: "word",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Only compound Law, Category + Be + Lawful Quality. Pay all three printed costs. Shared Law per \xA75.9."
        },
        {
          name: "Awaken",
          school: "word",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Give friendly non-living Thing Body and 1 Might counter, persist until leaves play. Does not automatically make Golem."
        },
        {
          name: "Separate",
          school: "word",
          type: "spell",
          r: false,
          cost: 2,
          strike: null,
          stand: null,
          text: "Separate eligible friendly non-Final Made Thing per \xA77, sufficient slots required; consumes fusion allowance."
        },
        {
          name: "Summon",
          school: "word",
          type: "spell",
          r: false,
          cost: 4,
          strike: null,
          stand: null,
          text: "Take control of enemy original Thing printed cost <= 2, not Named, requires empty Field slot."
        },
        {
          name: "Loan",
          school: "word",
          type: "spell",
          r: false,
          cost: 1,
          strike: null,
          stand: null,
          text: "Gain 2 additional breath subject to cap; reduce next turn's base breath by 1."
        },
        {
          name: "Gnosis",
          school: "word",
          type: "spell",
          r: false,
          cost: 3,
          strike: null,
          stand: null,
          text: "Draw 2 words, reveal all enemy Concealed Things."
        },
        {
          name: "Word",
          school: "legacy",
          raw: "School / type / cost | Proposed effect"
        },
        {
          name: "Sting",
          school: "legacy",
          raw: "Life / Action 1 | Sting-capable subject, combat vs Living Thing or rival: strike +1. Venomous applies normally."
        },
        {
          name: "Eat",
          school: "legacy",
          raw: "Life / Action 2 | Explicit Eat-capable subject, contact: consume friendly Fruit (remove it) or destroy non-Sacred enemy Living Thing with 1 remaining stand; heal subject 2. Toxic consumed target gives eater 1 poison dose."
        },
        {
          name: "Petrify",
          school: "legacy",
          raw: "Earth / Action 3 | Explicit Petrify-capable subject; contact; apply Petrified to Living Thing."
        },
        {
          name: "Blind",
          school: "legacy",
          raw: "Fire / Action 1 | Explicit Blinding-capable subject; apply Blinded to visible enemy Thing."
        },
        {
          name: "Fog",
          school: "legacy",
          raw: "Rot / Weather 2 | On arrival conceal caster's oldest eligible visible Thing; each upkeep conceal active player's oldest eligible visible Thing; persists after Fog ends."
        },
        {
          name: "Flux",
          school: "legacy",
          raw: "Air / Weather 2 | Each upkeep clear temporary movement/incapacitation conditions, Wet and Burning from active player's oldest affected Thing; remove 1 poison dose from it if present."
        }
      ];
    }
  });

  // ../engine29/src/replay.js
  var require_replay = __commonJS({
    "../engine29/src/replay.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var E2 = require_engine();
      var { createFromFormat, resolveFormat } = require_formats();
      function replayId(rep) {
        const t = JSON.stringify([rep.format, rep.decks, rep.seed, rep.first, rep.inputs]);
        let h = 2166136261;
        for (let i = 0; i < t.length; i++) {
          h ^= t.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return "rp_" + (h >>> 0).toString(16);
      }
      function recordMatch({ format, decks, seed, first = 0 }, agents, maxSteps = 3e3) {
        const inputs = [];
        const log = (kind, side, value) => {
          inputs.push({ kind, side, value });
          return value;
        };
        const S = createFromFormat(format, { decks, seed, first, mulligan: (S0, i) => log("mulligan", i, agents[i].mulligan ? agents[i].mulligan(S0, i) : []) });
        E2.setDecider(S, (S0, side, kind, options, dflt) => log("decide:" + kind, side, agents[side].decide ? agents[side].decide(S0, side, kind, options, dflt) : dflt));
        const ctl = {
          block: (S0, info) => {
            const side = 1 - info.attacker.ctrl;
            return log("block", side, agents[side].block ? agents[side].block(S0, info) : null);
          },
          respond: (S0, side, kind) => log("respond:" + kind, side, agents[side].respond ? agents[side].respond(S0, side, kind) : null)
        };
        const hashes = [];
        for (let k = 0; k < maxSteps && S.over == null; k++) {
          const a = log("act", S.active, agents[S.active].act(S));
          E2.apply(S, a, ctl);
          hashes.push(S.hashes[S.hashes.length - 1]);
        }
        const rep = { format, formatVersion: resolveFormat(format).version, engineRevision: E2.REVISION.id, decks, seed, first, inputs, hashes, result: S.over };
        rep.id = replayId(rep);
        return { replay: rep, state: S };
      }
      function replayMatch(rep) {
        const cur = resolveFormat(rep.format).version;
        if (rep.formatVersion && rep.formatVersion !== cur) throw new Error(`replay is for ${rep.format} ${rep.formatVersion}; this engine has ${cur}`);
        const rev = rep.engineRevision || "r30.0";
        try {
          return { ...replayMatch0(rep), revision: rev, sameRevision: rev === E2.REVISION.id };
        } catch (e) {
          if (rev !== E2.REVISION.id) e.message += ` (recorded under engine ${rev}; changes since: ${E2.REVISION.log.filter((r) => r.id > rev).map((r) => r.id + " " + r.note).join(" | ")})`;
          throw e;
        }
      }
      function replayMatch0(rep) {
        let k = 0;
        const next = (kind, side) => {
          const x = rep.inputs[k++];
          if (!x || x.kind !== kind || x.side !== side) throw new Error(`replay diverged at input ${k - 1}: expected ${kind}/${side}, found ${x ? x.kind + "/" + x.side : "end"}`);
          return x.value;
        };
        const S = createFromFormat(rep.format, { decks: rep.decks, seed: rep.seed, first: rep.first, mulligan: (S0, i) => next("mulligan", i) });
        E2.setDecider(S, (S0, side, kind) => next("decide:" + kind, side));
        const ctl = { block: (S0, info) => next("block", 1 - info.attacker.ctrl), respond: (S0, side, kind) => next("respond:" + kind, side) };
        let step = 0;
        while (S.over == null && k < rep.inputs.length) {
          E2.apply(S, next("act", S.active), ctl);
          if (rep.hashes && rep.hashes[step] !== S.hashes[S.hashes.length - 1]) throw new Error("replay hash mismatch at action " + step);
          step++;
        }
        return { state: S, ok: S.over === rep.result && k === rep.inputs.length };
      }
      module.exports = { recordMatch, replayMatch, replayId };
    }
  });

  // src/controller.js
  var require_controller = __commonJS({
    "src/controller.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var E2 = require_engine();
      var B2 = require_bots();
      var F2 = require_formats();
      var RP = require_replay();
      var NeedInput = class {
        constructor(req) {
          this.req = req;
        }
      };
      function snap(S) {
        const r = S.rand;
        delete S.rand;
        const c = structuredClone(S);
        if (r) S.rand = r;
        return c;
      }
      function createController2(cfg, hooks2 = {}) {
        const C = {
          cfg,
          S: null,
          view: null,
          inputs: [],
          queue: [],
          pending: null,
          op: null,
          error: null,
          chronicle: [],
          human: cfg.humanSide == null ? 0 : cfg.humanSide,
          auto: { passWhenNoOption: true, passAll: false }
        };
        const bot = 1 - C.human;
        const botPol = () => cfg.botPolicy || "careful:journeyman";
        const polOf = (side) => side === bot ? botPol() : "careful:journeyman";
        const botCtl = B2.controller(polOf), botDec = B2.decider(polOf);
        function io(log) {
          let qi = 0;
          const take = (req) => {
            if (qi < C.queue.length) return C.queue[qi++];
            throw new NeedInput(req);
          };
          const ctl = {
            block: (S, info) => {
              const side = 1 - info.attacker.ctrl;
              const v = side === C.human ? take({ type: "block", side, attacker: info.attacker.id, verb: info.verb, target: info.target ? info.target.id : info.ground ? "ground" : "rival", candidates: info.candidates.map((b) => b.id), bonus: info.bonus, group: info.group || null }) : botCtl.block(S, info);
              log.push({ kind: "block", side, value: v });
              return v;
            },
            respond: (S, side, kind) => {
              let v;
              if (side === C.human) {
                const options = E2.legalResponses(S, side, kind);
                v = !options.length && C.auto.passWhenNoOption || C.auto.passAll ? null : take({ type: "respond", side, kind, options });
              } else v = botCtl.respond ? botCtl.respond(S, side, kind) : null;
              log.push({ kind: "respond:" + kind, side, value: v });
              return v;
            }
          };
          const decide = (S, side, kind, options, dflt) => {
            const v = side === C.human ? take({ type: "decide", side, kind, options, dflt }) : botDec(S, side, kind, options, dflt);
            log.push({ kind: "decide:" + kind, side, value: v });
            return v;
          };
          const mulligan = (S, i) => {
            const v = i === C.human ? take({ type: "mulligan", side: i, hand: S.players[i].hand.map((c) => ({ pid: c.pid, word: c.word })) }) : B2.mulligan(S, i);
            log.push({ kind: "mulligan", side: i, value: v });
            return v;
          };
          return { ctl, decide, mulligan };
        }
        function chronicleFrom(before, after, actor, act) {
          const lines = after.log.slice(before.log.length);
          const packets = after.stats.packets.slice(before.stats.packets.length);
          const events = after.events.slice(before.events.length);
          C.chronicle.push({ round: after.round, turn: after.turn, actor, act, lines, packets, events: events.filter((e) => ["failed", "cancelled", "ward", "reveal", "rebirth", "made", "transform", "token", "sealed", "recover", "revive", "control", "bounce", "mulligan", "buy", "law", "sky", "attach", "decision", "quick", "echoed", "sky-expired", "law-ended"].includes(e.type)) });
        }
        function run(op) {
          C.op = op;
          C.error = null;
          const before = C.S ? snap(C.S) : null;
          const log = [];
          const x = io(log);
          try {
            if (op.kind === "create") {
              C.S = cfg.fixture ? cfg.fixture.build(x.mulligan) : F2.createFromFormat(cfg.format, { decks: cfg.decks, seed: cfg.seed, first: cfg.first, mulligan: x.mulligan });
              E2.setDecider(C.S, x.decide);
              C.S.ptFormat = cfg.format;
            } else {
              E2.setDecider(C.S, x.decide);
              log.unshift({ kind: "act", side: C.S.active, value: op.act });
              const actor = C.S.active;
              E2.apply(C.S, op.act, x.ctl);
              chronicleFrom(before, C.S, actor, op.act);
            }
            C.inputs.push(...log);
            C.queue = [];
            C.pending = null;
            C.view = null;
            C.op = null;
            if (hooks2.changed) hooks2.changed(C);
            return true;
          } catch (e) {
            if (e instanceof NeedInput) {
              C.view = C.S;
              C.S = before;
              if (C.S) E2.setDecider(C.S, x.decide);
              C.pending = e.req;
              if (hooks2.prompt) hooks2.prompt(C);
              return false;
            }
            C.S = before;
            C.view = null;
            C.pending = null;
            C.queue = [];
            C.error = e.message || String(e);
            if (hooks2.error) hooks2.error(C, e);
            return false;
          }
        }
        C.start = () => run({ kind: "create" });
        C.act = (act) => run({ kind: "act", act });
        C.answer = (value) => {
          C.queue.push(value);
          const op = C.op;
          C.pending = null;
          return run(op);
        };
        C.botAct = () => run({ kind: "act", act: B2.chooseAction(C.S, polOf) });
        C.isBotTurn = () => C.S && C.S.over == null && !C.pending && C.S.active === bot;
        C.state = () => C.view || C.S;
        C.replay = () => ({ format: cfg.format, formatVersion: F2.resolveFormat(cfg.format).version, decks: cfg.decks, seed: cfg.seed, first: cfg.first, humanSide: C.human, botPolicy: botPol(), inputs: C.inputs, result: C.S ? C.S.over : null, finalHash: C.S && C.S.hashes.length ? C.S.hashes[C.S.hashes.length - 1] : null, fixture: cfg.fixture ? cfg.fixture.id : null, scenario: cfg.fixture && cfg.fixture.id === "scenario" ? cfg.fixture.spec : null });
        return C;
      }
      function restoreController2(rep, hooks2 = {}, fixtures = {}, upto = Infinity) {
        const cfg = { format: rep.format, decks: rep.decks, seed: rep.seed, first: rep.first, humanSide: rep.humanSide || 0, botPolicy: rep.botPolicy, fixture: rep.scenario && fixtures.__fromSpec ? fixtures.__fromSpec(rep.scenario) : rep.fixture ? fixtures[rep.fixture] : null };
        if (rep.fixture && !cfg.fixture) throw new Error("this replay uses a fixture this build does not have: " + rep.fixture);
        const C = createController2(cfg, hooks2);
        let k = 0, acts = 0;
        const inputs = rep.inputs;
        const next = (kind, side) => {
          const x = inputs[k++];
          if (!x || x.kind !== kind || x.side !== side) throw new Error(`replay diverged at input ${k - 1}`);
          return x.value;
        };
        const log = [];
        let S;
        try {
          S = cfg.fixture ? cfg.fixture.build((S0, i) => {
            const v = next("mulligan", i);
            log.push({ kind: "mulligan", side: i, value: v });
            return v;
          }) : F2.createFromFormat(cfg.format, { decks: cfg.decks, seed: cfg.seed, first: cfg.first, mulligan: (S0, i) => {
            const v = next("mulligan", i);
            log.push({ kind: "mulligan", side: i, value: v });
            return v;
          } });
        } catch (e) {
          if (k >= inputs.length) {
            const C2 = createController2(cfg, hooks2);
            C2.start();
            Object.assign(C2, { restoredActs: 0, totalActs: 0 });
            return C2;
          }
          throw e;
        }
        E2.setDecider(S, (S0, side, kind) => {
          const v = next("decide:" + kind, side);
          log.push({ kind: "decide:" + kind, side, value: v });
          return v;
        });
        const ctl = {
          block: (S0, info) => {
            const side = 1 - info.attacker.ctrl;
            const v = next("block", side);
            log.push({ kind: "block", side, value: v });
            return v;
          },
          respond: (S0, side, kind) => {
            const v = next("respond:" + kind, side);
            log.push({ kind: "respond:" + kind, side, value: v });
            return v;
          }
        };
        while (S.over == null && k < inputs.length && acts < upto) {
          const a = next("act", S.active);
          log.push({ kind: "act", side: S.active, value: a });
          const before = snap(S), k0 = k, log0 = log.length;
          try {
            E2.apply(S, a, ctl);
          } catch (e) {
            if (k < inputs.length) throw e;
            const r = S.rand;
            S = before;
            if (r) S.rand = r;
            log.length = log0 - 1;
            break;
          }
          acts++;
          C.chronicle.push({ round: S.round, turn: S.turn, actor: before.active, act: a, lines: S.log.slice(before.log.length), packets: S.stats.packets.slice(before.stats.packets.length), events: [] });
        }
        C.S = S;
        C.inputs = log;
        C.S.ptFormat = cfg.format;
        Object.assign(C, { restoredActs: acts, totalActs: inputs.filter((x) => x.kind === "act").length });
        return C;
      }
      module.exports = { createController: createController2, restoreController: restoreController2, NeedInput, snap, RP };
    }
  });

  // ../engine29/data/v32_decks.js
  var require_v32_decks = __commonJS({
    "../engine29/data/v32_decks.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var D = (words, note, subs = {}) => ({ words, note, subs });
      var V2_DECKS2 = {
        V01_neighbours_orchard: D(["life.bee", "life.pear", "life.hazel", "life.feast", "life.seed", "life.bramble", "life.grow", "life.wolf", "life.hare", "life.plants", "water.water", "water.dew", "water.otter", "water.seep", "water.rain", "air.wind", "air.gust", "air.owl", "air.herald", "air.squall"], "01 \xB7 The neighbour's orchard"),
        V02_bellows_ingot: D(["fire.smith", "fire.fire", "fire.torch", "fire.ember", "fire.bellows", "fire.calcine", "fire.scorch", "fire.salamander", "earth.silver", "earth.copper", "earth.tin", "earth.lead", "earth.shape", "earth.garnet", "earth.transmute", "earth.temper", "earth.boulder", "earth.guard", "earth.crush", "earth.crucible"], "02 \xB7 The bellows and the ingot"),
        V03_seal_engraver: D(["earth.copper", "earth.silver", "earth.shape", "earth.garnet", "earth.guard", "earth.boulder", "earth.iron", "earth.flint", "earth.temper", "earth.crush", "fire.smith", "fire.ember", "fire.calcine", "word.writ", "word.scribe", "word.bard", "word.omen", "word.protect", "word.doubt", "word.scream"], "03 \xB7 The seal engraver"),
        V04_orchard_cellar: D(["life.pear", "life.bee", "life.feast", "life.abundance", "life.grow", "life.seed", "life.sapling", "life.harvest", "life.bramble", "life.wolf", "life.hare", "life.plants", "water.flask", "water.water", "water.rain", "water.otter", "water.seep", "water.dew", "water.tonic", "water.memory"], "04 \xB7 The orchard cellar (Ferment \u2192 Abundance: module F not built)", { "life.ferment": "life.abundance" }),
        V08_patient_predator: D(["life.wolf", "life.hare", "life.stag", "life.scarab", "life.bite", "life.beasts", "life.bramble", "life.bind", "life.feral", "life.abundance", "rot.spider", "rot.adder", "rot.leech", "rot.rat", "rot.poison", "rot.wither", "air.owl", "air.hawk", "air.gust", "air.herald"], "08 \xB7 The patient predator"),
        V11_world_tree_maker: D(["life.seed", "life.oak", "life.sapling", "life.pear", "life.wolf", "life.hare", "life.bramble", "life.grow", "life.plants", "water.dew", "water.water", "water.otter", "water.pike", "water.seep", "water.tonic", "earth.clay", "earth.boulder", "earth.guard", "earth.crucible", "earth.crush"], "11 \xB7 The maker of the World Tree"),
        V13_giver_of_fire: D(["fire.torch", "fire.fire", "fire.ember", "fire.salamander", "fire.smith", "fire.firebird", "fire.burn", "fire.scorch", "fire.calcine", "fire.kindle", "fire.wildfire", "fire.naphtha", "air.wind", "air.swallow", "air.owl", "air.gust", "air.blow", "air.gasp", "air.winged", "air.squall"], "13 \xB7 The giver of fire")
      };
      module.exports = { V2_DECKS: V2_DECKS2 };
    }
  });

  // src/scenario.js
  var require_scenario = __commonJS({
    "src/scenario.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var E2 = require_engine();
      var F2 = require_formats();
      var { BY_ID: BY_ID2 } = require_cards();
      var { REFERENCE_DECKS: REFERENCE_DECKS2 } = require_reference_decks();
      var { THEMED: THEMED2, COUNTERS: COUNTERS2 } = require_themed_decks();
      var { FOLIO_DECKS: FOLIO_DECKS2 } = require_folio_decks();
      var { V2_DECKS: V2_DECKS2 } = require_v32_decks();
      var LISTS = {};
      for (const [k, v] of Object.entries(V2_DECKS2)) LISTS[k] = { label: v.note, words: v.words };
      for (const [k, v] of Object.entries(FOLIO_DECKS2)) LISTS[k] = { label: "V31 " + v.note, words: v.words };
      for (const [k, v] of Object.entries(REFERENCE_DECKS2)) LISTS[k] = { label: k.replace(/_/g, " "), words: v.words };
      for (const [k, v] of Object.entries(THEMED2)) LISTS[k] = { label: "Themed " + k.slice(2).replace(/_/g, " "), words: v };
      for (const [k, v] of Object.entries(COUNTERS2)) LISTS[k] = { label: "Counter " + k.slice(2).replace(/_/g, " "), words: v };
      var listWords = (l) => Array.isArray(l) ? l : LISTS[l] ? LISTS[l].words : null;
      var MADE = {
        "made.swamp": { needs: null, lin: () => [{ w: "earth.clay" }, { w: "water.water", ground: true }] },
        "made.life": { needs: null, lin: () => [{ w: "life.seed" }, { made: "made.swamp" }] },
        "made.world_tree": { needs: null, lin: () => [{ w: "life.oak" }, { made: "made.life" }] },
        "made.energy": { needs: null, lin: () => [{ w: "fire.ember" }, { w: "air.wind" }] },
        "made.signet": { needs: "workshop", lin: () => [{ w: "earth.copper", form: "earth.setting" }, { w: "earth.garnet" }] }
      };
      var TRANSFORMED = { "earth.setting": { from: "earth.copper", needs: "workshop" }, "earth.gold": { from: "earth.lead", needs: null } };
      var TOKENS = { "token.fruit": "orchard", "token.ash": null, "token.blossom": null, "token.carrion": null };
      var ingredients = (m) => MADE[m].lin().flatMap((r) => r.made ? ingredients(r.made) : [r.w]);
      function cardLegal(id, mods) {
        const c = BY_ID2[id];
        return !!c && (c.deckLegal || c.folio && !c.transformedOnly && !c.made && mods.includes(c.folio));
      }
      function validate(spec) {
        const errors = [], notes = [];
        let f;
        try {
          f = F2.resolveFormat(spec.format);
        } catch (e) {
          return { errors: ["unknown rules version " + spec.format], notes };
        }
        const mods = f.variant && f.variant.modules || [];
        const FMT = E2.FORMAT, cap = { general: mods.includes("cap6") ? 6 : mods.includes("supply4") ? 4 : FMT.slots, supply: mods.includes("supply") || mods.includes("supply4") ? 1 : 0 };
        if (![0, 1].includes(spec.active)) errors.push("choose which side acts first");
        spec.sides.forEach((sd, i) => {
          const who2 = i === 0 ? "You" : "Rival", words = listWords(sd.list);
          if (!words) {
            errors.push(`${who2}: choose a word list`);
            return;
          }
          const de = E2.deckErrors(words, mods);
          if (de.length) errors.push(`${who2}: the list is not legal under ${spec.format} \u2014 ${de.join("; ")}`);
          const used = /* @__PURE__ */ new Map(), use = (w, zone) => {
            if (!words.includes(w)) errors.push(`${who2}: ${w} is not in this side's list (${zone})`);
            else if (used.has(w)) errors.push(`${who2}: ${w} is placed twice (${used.get(w)} and ${zone}) \u2014 every word is a single card`);
            else used.set(w, zone);
          };
          for (const t of sd.field || []) {
            const w = t.word;
            if (TOKENS[w] !== void 0) {
              if (TOKENS[w] && !mods.includes(TOKENS[w])) errors.push(`${who2}: ${w} needs the ${TOKENS[w]} module`);
              continue;
            }
            if (MADE[w]) {
              if (MADE[w].needs && !mods.includes(MADE[w].needs)) errors.push(`${who2}: ${w} needs the ${MADE[w].needs} module`);
              for (const iw of ingredients(w)) if (words.includes(iw)) use(iw, "ingredient of " + w.split(".")[1]);
              notes.push(`${who2}: ${w.split(".")[1]} is placed already made; its ingredients come from the list where present, otherwise they are fixture-made`);
              continue;
            }
            if (TRANSFORMED[w]) {
              if (TRANSFORMED[w].needs && !mods.includes(TRANSFORMED[w].needs)) errors.push(`${who2}: ${w} needs the ${TRANSFORMED[w].needs} module`);
              use(TRANSFORMED[w].from, "field (worked into " + w.split(".")[1] + ")");
              continue;
            }
            const c = BY_ID2[w];
            if (!c || c.type !== "thing") {
              errors.push(`${who2}: ${w} is not a Thing`);
              continue;
            }
            use(w, "field");
            if ((t.damage || 0) >= c.stand) errors.push(`${who2}: ${w} would already be destroyed (damage ${t.damage} \u2265 stand ${c.stand})`);
          }
          const n = (sd.field || []).length, ineligible = (sd.field || []).filter((t) => !["earth.clay", "earth.copper", "earth.silver", "earth.garnet", "earth.setting", "made.signet", "token.fruit", "water.cider"].includes(t.word)).length;
          if (n > cap.general + cap.supply) errors.push(`${who2}: ${n} Things but this rules version has ${cap.general}${cap.supply ? " + " + cap.supply + " supply" : ""} spaces`);
          else if (ineligible > cap.general) errors.push(`${who2}: only stock and products (Clay, Copper, Silver, Garnet, Setting, Signet, Fruit) can use the supply space`);
          for (const w of sd.hand || []) use(w, "hand");
          for (const w of sd.grave || []) use(w, "grave");
          for (const w of sd.deckTop || []) use(w, "deck top");
          if (sd.ground) {
            if (!BY_ID2[sd.ground] || BY_ID2[sd.ground].type !== "ground") errors.push(`${who2}: ${sd.ground} is not a Ground`);
            else use(sd.ground, "Ground");
          }
          if ((sd.hand || []).length > FMT.handCap) errors.push(`${who2}: hand over ${FMT.handCap}`);
          for (const w of (sd.hand || []).concat(sd.deckTop || [], sd.grave || [])) if (BY_ID2[w] && !cardLegal(w, mods)) errors.push(`${who2}: ${w} is not legal under ${spec.format}`);
          const life = sd.life == null ? FMT.life : sd.life;
          if (!(life >= 1 && life <= FMT.life)) errors.push(`${who2}: life must be 1\u2013${FMT.life}`);
          if (!(sd.breath >= 0 && sd.breath <= FMT.poolCap)) errors.push(`${who2}: breath must be 0\u2013${FMT.poolCap}`);
          if (!(sd.reserve >= 0 && sd.reserve <= (f.variant && f.variant.reserveCap || FMT.reserveCap))) errors.push(`${who2}: reserve must be 0\u2013${FMT.reserveCap}`);
          if (!(sd.spark >= 0 && sd.spark <= FMT.sparkCap)) errors.push(`${who2}: spark must be 0\u2013${FMT.sparkCap}`);
          if (sd.deckRest === "none" && !(sd.deckTop || []).length) notes.push(`${who2}: empty deck \u2014 drawing will cause fatigue`);
          for (const t of sd.field || []) for (const g of t.grants || []) if (!mods.includes("w5")) errors.push(`${who2}: recorded World Tree Growth only matters under the W5 rules version`);
          else if (!sd.field[g]) errors.push(`${who2}: Growth grant points at an empty field position`);
        });
        for (const inv of spec.invites || []) {
          if (inv.kind === "orchard" && !(mods.includes("visit") || mods.includes("visit_draw"))) errors.push("an orchard invitation needs a V (visit) rules version");
          if (inv.kind === "heat" && !mods.includes("heat")) errors.push("a heat invitation needs the H (heat) rules version");
          if (inv.kind === "heat" && !["fire.fire", "fire.torch"].includes((spec.sides[inv.owner] || {}).ground)) errors.push("a heat invitation needs Fire or Torch as the host's Ground");
          if (inv.kind === "orchard" && !((spec.sides[inv.owner] || {}).field || [])[inv.host]) errors.push("the orchard invitation points at an empty field position");
        }
        return { errors, notes };
      }
      function compatibility(spec, formatIds) {
        return formatIds.map((id) => {
          const r = validate({ ...spec, format: id });
          return { id, ok: !r.errors.length, why: r.errors[0] || null };
        });
      }
      function build(spec) {
        const v = validate(spec);
        if (v.errors.length) throw new Error(v.errors[0]);
        const lists = spec.sides.map((sd) => listWords(sd.list));
        const S = F2.createFromFormat(spec.format, { decks: lists, seed: spec.seed || 7, first: spec.active, mulligan: () => [] });
        let seq = 0;
        const reg = (pid) => {
          S.registry[pid] = true;
          return pid;
        };
        spec.sides.forEach((sd, i) => {
          const p = S.players[i], pool = p.hand.concat(p.deck);
          p.hand = [];
          p.deck = [];
          const take = (w) => {
            const k = pool.findIndex((c) => c.word === w);
            return k < 0 ? null : pool.splice(k, 1)[0];
          };
          const pidFor = (w) => {
            const c = take(w);
            return c ? c.pid : reg("sx" + i + "_" + ++seq);
          };
          const lin = (recs) => recs.map((r) => r.made ? { made: true, form: r.made, owner: i, lineage: lin(MADE[r.made].lin()) } : r.ground ? { ground: true, pid: pidFor(r.w), word: r.w, owner: i } : { pid: pidFor(r.w), word: r.w, ...r.form ? { form: r.form } : {}, owner: i });
          const placed = [];
          for (const t of sd.field || []) {
            const base = { id: "t" + ++S.seq, owner: i, ctrl: i, entry: S.seq, damage: t.damage || 0, counters: { ...t.counters || {} }, status: { ...t.status || {} }, exhausted: !!t.exhausted, fresh: !!t.fresh, actions: 0, arrivedTurn: 0 };
            let th;
            if (TOKENS[t.word] !== void 0) th = { ...base, pid: null, word: t.word, form: t.word, token: true };
            else if (MADE[t.word]) th = { ...base, pid: null, word: t.word, form: t.word, lineage: lin(MADE[t.word].lin()) };
            else if (TRANSFORMED[t.word]) {
              const c = take(TRANSFORMED[t.word].from);
              th = { ...base, pid: c.pid, word: c.word, form: t.word };
            } else {
              const c = take(t.word);
              th = { ...base, pid: c.pid, word: c.word };
            }
            S.things.push(th);
            placed.push(th);
          }
          (sd.field || []).forEach((t, k) => {
            if (t.grants) placed[k].wtGrants = t.grants.map((g) => placed[g].id);
          });
          for (const w of sd.hand || []) p.hand.push(take(w));
          for (const w of sd.grave || []) {
            const c = take(w);
            c.reason = "destroyed";
            p.grave.push(c);
          }
          if (sd.ground) p.ground = { ...take(sd.ground), damage: 0 };
          const top = (sd.deckTop || []).map(take);
          p.deck = (sd.deckRest === "none" ? [] : pool.splice(0)).concat(top.slice().reverse());
          p.life = sd.life == null ? E2.FORMAT.life : sd.life;
          p.breath = sd.breath;
          p.reserve = sd.reserve;
          p.spark = sd.spark;
          if (sd.deckRest === "none") for (const c of pool) p.sealed.push(c);
        });
        for (const inv of spec.invites || []) {
          const owner = S.players[inv.owner];
          S.invites = (S.invites || []).concat({ id: "inv" + ++S.seq, kind: inv.kind, owner: inv.owner, host: inv.kind === "orchard" ? S.things.filter((t) => t.ctrl === inv.owner)[inv.host].id : null, groundPid: inv.kind === "heat" ? owner.ground.pid : null });
        }
        if (spec.market === "empty") S.market = S.market.map(() => null);
        E2.stateCheck(S);
        S.ptFixture = true;
        S.ptScenario = true;
        const audit = E2.zoneAudit(S);
        if (audit.length) throw new Error("zone audit: " + audit[0]);
        return S;
      }
      function asFixture(spec) {
        return { id: "scenario", title: spec.title || "Scenario", text: spec.text || "", format: spec.format, spec, build: () => {
          const S = build(spec);
          S.ptFixtureId = "scenario";
          return S;
        }, first: spec.active };
      }
      function blank(format = "v32_b") {
        return {
          title: "New scenario",
          text: "",
          format,
          active: 0,
          seed: 7,
          market: "empty",
          invites: [],
          sides: [
            { list: "V03_seal_engraver", field: [], hand: [], grave: [], deckTop: [], deckRest: "rest", ground: null, life: 30, breath: 6, reserve: 0, spark: 2 },
            { list: "V08_patient_predator", field: [], hand: [], grave: [], deckTop: [], deckRest: "rest", ground: null, life: 30, breath: 0, reserve: 2, spark: 2 }
          ]
        };
      }
      module.exports = { ingredients, LISTS, MADE, TRANSFORMED, TOKENS, validate, compatibility, build, asFixture, blank, listWords };
    }
  });

  // src/fixtures.js
  var require_fixtures = __commonJS({
    "src/fixtures.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var F2 = require_formats();
      var E2 = require_engine();
      var { REF } = require_reference_decks();
      var { FOLIO_DECKS: FOLIO_DECKS2 } = require_folio_decks();
      var SC2 = require_scenario();
      function base(first = 0) {
        const S = F2.createFromFormat("grammar_v30_rc1", { decks: [REF.D1_living_sky, REF.D2_lockkeepers_wall], seed: 4242, first, mulligan: () => [] });
        for (const p of S.players) {
          p.deck.push(...p.hand);
          p.hand = [];
          p.breath = 8;
          p.reserve = 0;
          p.spark = 0;
        }
        S.market = S.market.map(() => null);
        S.ptFixture = true;
        return S;
      }
      function fbase(first = 0, fmt = "folio_b_all") {
        const S = F2.createFromFormat(fmt, { decks: [fmt === "folio_c_life" ? FOLIO_DECKS2.O_orchard_crosswind.words : FOLIO_DECKS2.M_returning_garden.words, FOLIO_DECKS2.F_seal_cutter.words], seed: 4343, first, mulligan: () => [] });
        for (const p of S.players) {
          p.deck.push(...p.hand);
          p.hand = [];
          p.breath = 8;
          p.reserve = 0;
          p.spark = 0;
        }
        S.market = S.market.map(() => null);
        S.ptFixture = true;
        return S;
      }
      function place(S, side2, word, o = {}) {
        const t = { id: "t" + ++S.seq, pid: "fx" + S.seq, word, owner: side2, ctrl: side2, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: false, actions: 0, arrivedTurn: 0, ...o };
        S.things.push(t);
        if (t.pid) S.registry[t.pid] = true;
        return t;
      }
      function give(S, side2, word) {
        const c = { pid: "fh" + ++S.seq, word, owner: side2 };
        S.players[side2].hand.push(c);
        S.registry[c.pid] = true;
        return c;
      }
      function ground(S, side2, word) {
        const g = { pid: "fg" + ++S.seq, word, owner: side2, damage: 0 };
        S.players[side2].ground = g;
        S.registry[g.pid] = true;
        return g;
      }
      function grave(S, side2, word) {
        const g = { pid: "fy" + ++S.seq, word, owner: side2, reason: "spent" };
        S.players[side2].grave.push(g);
        S.registry[g.pid] = true;
        return g;
      }
      var FIXTURES2 = {
        response: {
          title: "A useful response",
          text: "Attack with your Stag. The rival holds Guard with 2 reserve and may protect its Pike; you can answer with Kindle.",
          build: () => {
            const S = base();
            place(S, 0, "life.stag");
            give(S, 0, "fire.kindle");
            give(S, 0, "life.bite");
            place(S, 1, "water.pike");
            give(S, 1, "earth.guard");
            S.players[1].reserve = 2;
            return S;
          }
        },
        defend: {
          title: "Defend with reserve",
          text: "It is the rival's turn. You kept 2 reserve and hold Gust and Dew: block, respond, or let it through.",
          build: () => {
            const S = base(1);
            place(S, 1, "life.wolf");
            place(S, 1, "life.stag");
            give(S, 1, "life.bite");
            place(S, 0, "life.hare");
            place(S, 0, "earth.boulder");
            give(S, 0, "air.gust");
            give(S, 0, "water.dew");
            S.players[0].reserve = 2;
            return S;
          }
        },
        interrupted: {
          title: "An interrupted action",
          text: "Seep the rival with your Otter. The rival may Gust the Otter away first: the action fails and its costs stay paid.",
          build: () => {
            const S = base();
            place(S, 0, "water.otter");
            give(S, 0, "water.seep");
            give(S, 1, "air.gust");
            S.players[1].reserve = 2;
            return S;
          }
        },
        fusion: {
          title: "Fixed fusion and the Vessel",
          text: "Ember and Wind are mature: open the Vessel for Energy. Clay with Water Ground makes Swamp. One fusion per turn.",
          build: () => {
            const S = base();
            place(S, 0, "fire.ember");
            place(S, 0, "air.wind");
            place(S, 0, "earth.clay");
            ground(S, 0, "water.water");
            S.players[0].breath = 8;
            return S;
          }
        },
        separate: {
          title: "Separate a made Thing",
          text: "Your Energy (Ember + Wind) carries 1 damage. Separate restores both, damage to the primary ingredient.",
          build: () => {
            const S = base();
            const t = place(S, 0, "made.energy", { form: "made.energy", pid: null, damage: 1, lineage: [{ pid: "fl1", word: "fire.ember", form: "fire.ember", owner: 0 }, { pid: "fl2", word: "air.wind", form: "air.wind", owner: 0 }] });
            S.registry.fl1 = S.registry.fl2 = true;
            give(S, 0, "word.separate");
            return S;
          }
        },
        ladder: {
          title: "Ladders",
          text: "Transmute your Lead (choose Tin or Copper). Grow your Seed: it is one age from Sapling. One step per own turn each.",
          build: () => {
            const S = base();
            place(S, 0, "earth.lead");
            place(S, 0, "life.seed", { counters: { age: 1 } });
            give(S, 0, "earth.transmute");
            give(S, 0, "life.grow");
            return S;
          }
        },
        grave: {
          title: "Grave recursion",
          text: "Memory recovers Kindle; Exhume revives your fallen Wolf. Both seal themselves when they succeed.",
          build: () => {
            const S = base();
            grave(S, 0, "fire.kindle");
            grave(S, 0, "life.wolf");
            give(S, 0, "water.memory");
            give(S, 0, "rot.exhume");
            S.players[0].breath = 6;
            return S;
          }
        },
        concealed: {
          title: "Concealed",
          text: "The rival has a Concealed Thing. You cannot target it until it is revealed: try Owl, or Doubt's reveal.",
          build: () => {
            const S = base();
            place(S, 1, "word.hermit", { status: { concealed: true } });
            place(S, 1, "life.stag");
            give(S, 0, "air.owl");
            give(S, 0, "word.doubt");
            place(S, 0, "fire.ember");
            give(S, 0, "fire.scorch");
            return S;
          }
        },
        law: {
          title: "A Law",
          text: "Beasts + Be + Feral: every Beast on both sides gains Feral until your second Renew from now.",
          build: () => {
            const S = base();
            give(S, 0, "word.be");
            give(S, 0, "life.beasts");
            give(S, 0, "life.feral");
            place(S, 0, "life.wolf");
            place(S, 1, "life.stag");
            place(S, 1, "earth.stone");
            return S;
          }
        },
        poison: {
          title: "Poison",
          text: "Your Spider is Venomous; Miasma poisons every enemy Living Thing and the rival. Doses tick at the owner's upkeep, cap 3.",
          build: () => {
            const S = base();
            place(S, 0, "rot.spider");
            place(S, 0, "rot.rat");
            give(S, 0, "rot.miasma");
            give(S, 0, "rot.poison");
            place(S, 1, "life.stag", { status: { poison: 1 } });
            place(S, 1, "life.wolf");
            return S;
          }
        },
        // ---- V31 Living Folio (model B) ----
        f_pollen: {
          format: "folio_b_all",
          title: "Folio \xB7 who can pollinate what",
          text: "Bee (insect) and Wind (wind) beside Pear (insect-pollinated) and Hazel (wind-pollinated). Click a carrier: only the matching tree is offered. Inspect any of them to see why. The rival holds Gust and Drench (Wet grounds a Bee, not the Wind).",
          build: () => {
            const S = fbase();
            place(S, 0, "life.bee");
            place(S, 0, "air.wind");
            place(S, 0, "life.pear");
            place(S, 0, "life.hazel");
            place(S, 1, "water.otter");
            give(S, 1, "air.gust");
            give(S, 1, "water.drench");
            S.players[1].reserve = 2;
            return S;
          }
        },
        f_feast: {
          format: "folio_b_all",
          title: "Folio \xB7 Feast for a second wave",
          text: "Your Wolf and Otter have already struck and are exhausted. Eat the Fruit with Feast to ready them; a second Strike still costs 1 breath. Or keep the Fruit to block or heal.",
          build: () => {
            const S = fbase();
            place(S, 0, "life.wolf", { exhausted: true, actions: 1 });
            place(S, 0, "water.otter", { exhausted: true, actions: 1 });
            place(S, 0, "token.fruit", { form: "token.fruit", token: true, pid: null });
            give(S, 0, "life.feast");
            S.players[0].breath = 4;
            place(S, 1, "earth.boulder");
            return S;
          }
        },
        f_workshop: {
          format: "folio_b_all",
          title: "Folio \xB7 from Copper to Signet",
          text: "Work Copper into a Setting (Shape in hand, or Smith's native ability), then next turn Set it with Garnet in the Vessel to make a Signet. Silver is Sacred; shaping it gives that up. Inspect the Signet: it shows its Setting and Garnet and the original Copper.",
          build: () => {
            const S = fbase();
            place(S, 0, "fire.smith");
            place(S, 0, "earth.copper");
            place(S, 0, "earth.silver");
            place(S, 0, "earth.garnet");
            give(S, 0, "earth.shape");
            give(S, 0, "word.writ");
            place(S, 1, "word.scribe");
            place(S, 1, "earth.boulder");
            return S;
          }
        },
        f_signet: {
          format: "folio_b_all",
          title: "Folio \xB7 Signet endorses a Writ",
          text: "A finished Signet (Setting from Copper + Garnet). Endorse Writ by exhausting it to exhaust two rival blockers, then attack. The rival holds Doubt with 2 reserve; a countered Writ keeps its costs.",
          build: () => {
            const S = fbase();
            S.registry.fls1 = S.registry.fls2 = true;
            place(S, 0, "made.signet", { form: "made.signet", pid: null, lineage: [{ pid: "fls1", word: "earth.copper", form: "earth.setting", owner: 0 }, { pid: "fls2", word: "earth.garnet", form: "earth.garnet", owner: 0 }] });
            place(S, 0, "earth.iron");
            place(S, 0, "fire.ember");
            give(S, 0, "word.writ");
            place(S, 1, "earth.boulder");
            place(S, 1, "water.ice");
            give(S, 1, "word.doubt");
            S.players[1].reserve = 2;
            return S;
          }
        },
        f_mould: {
          format: "folio_b_all",
          title: "Folio \xB7 Mould returns the dead to the soil",
          text: "Your Grave holds a Seed that died, a Pear that was sacrificed and a Rose you discarded. Mould can seal only a Plant that died. It feeds Growth and age to your Sapling, and Growth on another Plant makes your Pear fruit.",
          build: () => {
            const S = fbase();
            place(S, 0, "rot.mould");
            place(S, 0, "life.sapling");
            place(S, 0, "life.pear");
            const y = (w, r) => {
              const g = grave(S, 0, w);
              g.reason = r;
            };
            y("life.seed", "destroyed");
            y("life.bramble", "sacrificed");
            y("life.rose", "discarded");
            give(S, 0, "rot.exhume");
            return S;
          }
        },
        f_clife: {
          format: "folio_c_life",
          title: "C-life \xB7 a crop and a Setting that take a turn",
          text: "Start Bear (Bee + Pear) or Shape (Smith + Copper): the work is public and completes at your next turn for 1 breath. Meanwhile the rival can Gust the Bee or Rust the Copper to break it. One process at a time.",
          build: () => {
            const S = fbase(0, "folio_c_life");
            place(S, 0, "life.bee");
            place(S, 0, "life.pear");
            place(S, 0, "fire.smith");
            place(S, 0, "earth.copper");
            place(S, 1, "fire.ember");
            give(S, 1, "air.gust");
            give(S, 1, "rot.rust");
            S.players[1].reserve = 2;
            return S;
          }
        }
      };
      var side = (list, o = {}) => ({ list, field: [], hand: [], grave: [], deckTop: [], deckRest: "rest", ground: null, life: 30, breath: 6, reserve: 0, spark: 2, ...o });
      var SPECS = {
        v_visit: {
          format: "v32_visit",
          title: "V \xB7 visit an opened orchard",
          text: "The rival opened its Pear to visitors at its last End. Your Bee may visit (1 breath, exhausts the Bee): the rival gets the Fruit, you privately reorder your top two cards. You may also simply decline. Try it with the rival holding Gust in reserve: if it bounces the Pear, the attempt fails and its cost stays paid.",
          active: 0,
          invites: [{ kind: "orchard", owner: 1, host: 0 }],
          sides: [side("V01_neighbours_orchard", { field: [{ word: "life.bee" }, { word: "life.wolf" }], hand: ["air.gust"], deckTop: ["life.feast", "life.pear"] }), side("V04_orchard_cellar", { field: [{ word: "life.pear" }, { word: "life.hare" }], breath: 0, reserve: 2, spark: 2 })]
        },
        v_host: {
          format: "v32_visit",
          title: "V \xB7 open your orchard to the rival",
          text: "Plan an invitation for your Pear (free; it opens at your End and lasts until your next Renew). The rival's Bee may visit during its turn \u2014 the Fruit would be yours. Or keep your orchard closed. Inspect the Pear to see whether an invitation is possible.",
          active: 0,
          sides: [side("V04_orchard_cellar", { field: [{ word: "life.pear" }, { word: "life.wolf" }], hand: ["life.feast"] }), side("V01_neighbours_orchard", { field: [{ word: "life.bee" }, { word: "life.hare" }], breath: 0, reserve: 1 })]
        },
        h_heat: {
          format: "v32_heat",
          title: "H \xB7 borrow the rival's heat",
          text: "The rival lent its Torch. Borrow it to work your Copper into a Setting: 1 breath, and 1 spark paid to the rival when you declare. If the rival Gusts the Copper away in response, the fee stays paid. You also hold Shape \u2014 the private alternative at 2 breath.",
          active: 0,
          invites: [{ kind: "heat", owner: 1 }],
          sides: [side("V03_seal_engraver", { field: [{ word: "earth.copper" }, { word: "earth.garnet" }, { word: "earth.iron" }], hand: ["earth.shape", "word.writ"], breath: 5, spark: 2 }), side("V13_giver_of_fire", { ground: "fire.torch", field: [{ word: "fire.ember" }], hand: ["air.gust"], breath: 0, reserve: 2, spark: 3 })]
        },
        r_roles: {
          format: "v32_r6",
          title: "R \xB7 who may strike, intercept, strike back",
          text: "Six core rows: Wolf does all three; Oak may intercept but never strikes or strikes back; Bee, Silver, Garnet and Fruit do none. Attack with your Wolf and see who the rival can put in the way. Inspect any Thing for its permissions. Switch the rules version in the editor to compare Fruit-only and the broader overlay.",
          active: 0,
          sides: [side("V08_patient_predator", { field: [{ word: "life.wolf" }, { word: "life.hare" }], hand: ["life.bite"] }), side("V11_world_tree_maker", { field: [{ word: "life.oak" }, { word: "token.fruit" }, { word: "life.wolf" }], breath: 0, reserve: 1 })]
        },
        c_supply: {
          format: "v32_supply",
          title: "Capacity \xB7 the supply space",
          text: "Five general spaces are full. The sixth space takes only stock and products (Clay, Copper, Silver, Garnet, Setting, Signet, Fruit). Bring forth Copper: it goes to the supply space. Then work it into a Setting and Set it \u2014 try bringing forth a Wolf instead to see the refusal.",
          active: 0,
          sides: [side("V03_seal_engraver", { field: [{ word: "earth.iron" }, { word: "earth.boulder" }, { word: "earth.flint" }, { word: "fire.ember" }, { word: "word.scribe" }], hand: ["earth.copper", "earth.shape", "earth.garnet"], breath: 8 }), side("V08_patient_predator", { field: [{ word: "life.wolf" }], breath: 0 })]
        },
        w5_success: {
          format: "v32_w5",
          title: "W5 \xB7 the work completes",
          text: "Your World Tree (grown Clay + Water \u2192 Swamp, Seed + Swamp \u2192 Life, Oak + Life) gave Growth to your Wolf at upkeep. Declare the work (2 breath). It completes at the start of your next Main, after a full rival turn, if the Tree and the Wolf (still bearing Growth) survive and you are alive.",
          active: 0,
          sides: [side("V11_world_tree_maker", { field: [{ word: "made.world_tree", grants: [1] }, { word: "life.wolf", counters: { growth: 1 } }, { word: "earth.boulder" }], hand: ["earth.guard"], breath: 6 }), side("V08_patient_predator", { field: [{ word: "life.hare" }], breath: 0, reserve: 0 })]
        },
        w5_disrupt: {
          format: "v32_w5",
          title: "W5 \xB7 ordinary disruption",
          text: "Same claim, but the rival has a Stag and Bite: on its turn it can kill your Hare (the beneficiary). If the Hare leaves play or loses its Growth, the claim breaks \u2014 no win, no refund.",
          active: 0,
          sides: [side("V11_world_tree_maker", { field: [{ word: "made.world_tree", grants: [1] }, { word: "life.hare", counters: { growth: 1 } }], breath: 6 }), side("V08_patient_predator", { field: [{ word: "life.stag" }, { word: "life.wolf" }], hand: ["life.bite"], breath: 0, spark: 2 })]
        },
        w5_interrupt: {
          format: "v32_w5",
          title: "W5 \xB7 interrupted declaration",
          text: "The rival keeps 2 reserve and Gust. When you declare the work, it can bounce the World Tree in response: the declaration fails, the 2 breath stays spent, and the Tree dissolves (its ingredients go to your Grave).",
          active: 0,
          sides: [side("V11_world_tree_maker", { field: [{ word: "made.world_tree", grants: [1] }, { word: "life.wolf", counters: { growth: 1 } }], breath: 6 }), side("V08_patient_predator", { field: [{ word: "life.hare" }], hand: ["air.gust"], breath: 0, reserve: 2 })]
        },
        w5_lethal: {
          format: "v32_w5",
          title: "W5 \xB7 earlier life lethal",
          text: `You can declare, but you are at 3 life and the rival has four ready attackers; your Tree and Wolf can block only two. Ordinary life loss is checked first: if you die on the rival's turn the work never completes. Compare declaring with blocking or racing \u2014 and open "Why not?".`,
          active: 0,
          sides: [side("V11_world_tree_maker", { field: [{ word: "made.world_tree", grants: [1] }, { word: "life.wolf", counters: { growth: 1 } }], life: 3, breath: 6 }), side("V08_patient_predator", { field: [{ word: "life.stag" }, { word: "life.wolf" }, { word: "air.hawk" }, { word: "rot.adder" }], breath: 0 })]
        },
        cv_fruit: {
          format: "v32_b",
          title: "Creation \xB7 what is a Fruit for?",
          text: 'You have a Fruit, Feast, two exhausted attackers and an untapped Bee. Compare: eat it (heal 2), Feast it to strike again now, keep it as a blocker, or keep it for later. Open "Why not?" to see how the planner ranks each, and why.',
          active: 0,
          sides: [side("V01_neighbours_orchard", { field: [{ word: "life.wolf", exhausted: true }, { word: "water.otter", exhausted: true }, { word: "token.fruit" }, { word: "life.bee" }, { word: "life.pear" }], hand: ["life.feast"], life: 22, breath: 4 }), side("V08_patient_predator", { field: [{ word: "life.hare" }], life: 14, breath: 0 })]
        },
        cv_setting: {
          format: "v32_b",
          title: "Creation \xB7 Copper now, or a Setting later?",
          text: 'Your Copper can strike now (2) \u2014 or be worked into a Setting (Shape, 2 breath), then Set with the Garnet next turn for a Signet that endorses Writ. Open "Why not?" to see whether the planner calls the workshop line inferior, too slow or unaffordable. Try the Shape-at-1 rules version from the editor.',
          active: 0,
          sides: [side("V03_seal_engraver", { field: [{ word: "earth.copper" }, { word: "earth.garnet" }, { word: "earth.iron" }], hand: ["earth.shape", "word.writ"], breath: 5, spark: 1 }), side("V08_patient_predator", { field: [{ word: "life.wolf" }, { word: "life.hare" }], life: 18, breath: 0 })]
        }
      };
      for (const [id, spec] of Object.entries(SPECS)) {
        const fx = SC2.asFixture({ ...spec, seed: 7, market: "empty" });
        FIXTURES2[id] = { ...fx, id: void 0, v32: true };
      }
      for (const [id, f] of Object.entries(FIXTURES2)) {
        f.id = id;
        const b = f.build;
        f.build = () => {
          const S = b();
          S.ptFixtureId = id;
          return S;
        };
      }
      module.exports = { FIXTURES: FIXTURES2, SPECS };
    }
  });

  // ../engine29/data/v33_decks.js
  var require_v33_decks = __commonJS({
    "../engine29/data/v33_decks.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var V33_DECKS2 = {
        orchard: {
          name: "The Orchard",
          schools: "Life \xB7 Water \xB7 Air",
          pitch: "Grow a garden that fruits, feeds and heals. Bee and Pear, Wind and Hazel make Fruit; Seeds become Oaks; Ice and Bind keep the orchard alive.",
          words: [
            "life.bee",
            "life.pear",
            "life.hazel",
            "life.feast",
            "life.seed",
            "life.sapling",
            "life.grow",
            "life.abundance",
            "life.plants",
            "life.wolf",
            "life.bramble",
            "life.bite",
            "life.bind",
            "water.water",
            "water.dew",
            "water.ice",
            "water.otter",
            "air.wind",
            "air.gust",
            "air.owl"
          ]
        },
        furnace: {
          name: "The Furnace",
          schools: "Fire \xB7 Air",
          pitch: "Fast, hot and loud. Fliers and fire-beasts press the rival; Burn and Scorch pick off key pieces; Kindle the Naphtha for a flare; Calcine to Ash and raise a Phoenix.",
          words: [
            "fire.ember",
            "fire.torch",
            "fire.fire",
            "fire.salamander",
            "fire.firebird",
            "fire.naphtha",
            "fire.burn",
            "fire.scorch",
            "fire.kindle",
            "fire.calcine",
            "fire.wildfire",
            "fire.drought",
            "air.swallow",
            "air.owl",
            "air.wind",
            "air.gust",
            "air.blow",
            "air.gasp",
            "air.winged",
            "air.herald"
          ]
        },
        forge: {
          name: "The Clay Court",
          schools: "Earth \xB7 The Word",
          pitch: "Slow stone, sharp words. Wall up with Boulder and Guard, read your deck with Omen and Scribe, raise a Golem from Clay and Word, and climb Lead to Gold. Protect and Doubt answer.",
          words: [
            "earth.clay",
            "earth.lead",
            "earth.copper",
            "earth.silver",
            "earth.iron",
            "earth.flint",
            "earth.boulder",
            "earth.crucible",
            "earth.transmute",
            "earth.guard",
            "earth.crush",
            "earth.metals",
            "word.word",
            "word.scribe",
            "word.familiar",
            "word.bard",
            "word.omen",
            "word.protect",
            "word.doubt",
            "word.awaken"
          ]
        }
      };
      var THREE_DECKS2 = {
        orchard: {
          name: "The Orchard",
          schools: "Life \xB7 Water \xB7 Air",
          pitch: "Spend the harvest or grow the canopy. Bee and Wind pollinate for Fruit or healing; Seeds become Oaks; Graft two trees into an Espalier that keeps producing.",
          plan: "Open on Seed or Sapling and a blocker. Before combat, decide: attack with two trees, or Graft them into one Espalier (3/5 Reach) that frees a place and makes Fruit or Growth every upkeep. Abundance turns grown trees into a strong attack. Feast heals and stands a defender up.",
          words: [
            "life.bee",
            "life.pear",
            "life.hazel",
            "life.feast",
            "life.seed",
            "life.sapling",
            "life.grow",
            "life.abundance",
            "life.graft3",
            "life.wolf",
            "life.bramble",
            "life.bite",
            "life.bind",
            "water.water",
            "water.dew",
            "life.apple",
            "water.otter",
            "air.wind",
            "air.gust",
            "air.owl"
          ]
        },
        furnace: {
          name: "The Furnace",
          schools: "Fire \xB7 Air",
          pitch: "Keep the firebird or spend the fuel. Kindle or Tinder lights your Naphtha for a flare on the two oldest enemies; Calcine leaves Ash; Firebird and Ash become a Phoenix.",
          plan: "Open with a cheap flyer or Ember and a way to ignite. Naphtha is a visible threat: fire it while the rival's two oldest Things are worth hitting. If Rain wets it, Drought dries the field. Calcine an exhausted attacker into Ash, then fuse Firebird + Ash into a 4/4 Phoenix that is reborn once.",
          words: [
            "fire.ember",
            "fire.torch",
            "fire.fire",
            "fire.salamander",
            "fire.firebird",
            "fire.naphtha",
            "fire.burn",
            "fire.scorch",
            "fire.kindle",
            "fire.calcine",
            "fire.wildfire",
            "fire.drought",
            "air.swallow",
            "air.owl",
            "air.wind",
            "air.gust",
            "air.blow",
            "air.gasp",
            "air.winged",
            "fire.tinder"
          ]
        },
        forge: {
          name: "The Clay Court",
          schools: "Earth \xB7 The Word",
          pitch: "Decide what the metal is for. Copper can climb to Silver, become a Hammer that finishes the wounded, or an engraved Signet that seals protection and stamps Writ. Clay + Word make a 4/5 Golem.",
          plan: "Wall up with Clay, Boulder and Guard. Pivot on Copper: keep its attack, Transmute toward Silver and Gold, Shape a Hammer, or Shape a Signet. Clay can shield a survivor. Golem has Reach; send it forward to spill damage through a destroyed blocker.",
          words: [
            "earth.clay",
            "earth.lead",
            "earth.copper",
            "earth.silver",
            "earth.iron",
            "earth.flint",
            "earth.boulder",
            "earth.crucible",
            "earth.transmute",
            "earth.guard",
            "earth.crush",
            "earth.shape3",
            "word.word",
            "word.scribe",
            "earth.hammer",
            "word.writ3",
            "word.omen",
            "word.protect",
            "word.doubt",
            "word.awaken"
          ]
        }
      };
      module.exports = { V33_DECKS: V33_DECKS2, THREE_DECKS: THREE_DECKS2 };
    }
  });

  // ../engine29/src/diagnose.js
  var require_diagnose = __commonJS({
    "../engine29/src/diagnose.js"(exports, module) {
      "use strict";
      init_define_process_env();
      var E2 = require_engine();
      var B2 = require_bots();
      function familyOf(S, a) {
        if (a.type === "invite") return "invite " + a.kind;
        if (a.type === "hotwork") return "borrow heat";
        if (a.type === "claim") return "declare work (W5)";
        if (a.type === "ability") return a.ability === "visit" ? "visit orchard" : a.ability === "eatFruit" ? "eat Fruit" : a.ability === "signet" ? "Signet" : a.ability === "shapeWork" ? "Smith shapes" : a.ability === "pollinate" ? "pollinate" : "ability " + a.ability;
        if (a.type === "fuse") return "fuse " + (a.recipe || "");
        if (a.type === "attack") return "attack";
        if (a.type === "deploy") return "deploy";
        if (a.type === "buy") return "buy";
        if (a.card) {
          const c = S.players[S.active].hand.find((h) => h.pid === a.card);
          if (c) {
            const id = E2.card(c).id;
            if (["earth.shape", "life.feast", "word.writ"].includes(id)) return id.split(".")[1][0].toUpperCase() + id.split(".")[1].slice(1);
          }
        }
        return null;
      }
      var WATCH = ["attack", "deploy", "pollinate", "eat Fruit", "Feast", "Shape", "Smith shapes", "fuse set", "Signet", "Writ", "invite orchard", "invite heat", "visit orchard", "borrow heat", "declare work (W5)", "fuse swamp", "fuse life", "fuse world_tree"];
      function reasonFor(S, side, fam) {
        const mine = S.things.filter((t) => t.ctrl === side), foes = S.things.filter((t) => t.ctrl !== side), first = (xs) => xs.find(Boolean) || null;
        if (fam === "invite orchard") {
          const trees = mine.filter((h) => E2.trait(S, h, "pollination") === "insect");
          return trees.length ? first(trees.map((h) => E2.invitationWhy(S, side, "orchard", h.id))) : "you have no insect-pollinated orchard tree (Pear) on the field";
        }
        if (fam === "invite heat") return E2.invitationWhy(S, side, "heat");
        if (fam === "visit orchard") {
          const bees = mine.filter((t) => E2.card(t).id === "life.bee");
          if (!bees.length) return "you have no Bee";
          return first(bees.flatMap((b) => foes.map((h) => E2.visitWhy(S, side, b, h)))) || "no opposing tree to visit";
        }
        if (fam === "borrow heat") {
          const m = mine.filter((t) => ["earth.copper", "earth.silver"].includes(E2.card(t).id));
          return m.length ? first(m.map((x) => E2.hotworkWhy(S, side, x))) : E2.hotworkWhy(S, side, null) || "you have no Copper or Silver";
        }
        if (fam === "declare work (W5)") {
          const tr = mine.filter((t) => E2.card(t).id === "made.world_tree");
          if (!tr.length) return E2.w5Why(S, side, null, null);
          return first(tr.flatMap((t) => mine.map((b) => E2.w5Why(S, side, t, b))));
        }
        if (fam === "fuse set") return S.things.some((t) => t.ctrl === side && E2.card(t).id === "earth.setting") ? "a Setting and a Garnet must both be ready and one mature, with 2 breath, one fusion per turn" : "Set needs a Setting: work the Copper or Silver first (Shape, Smith or borrowed heat); the made Setting is Fresh until your next turn";
        if (fam === "Signet") return S.things.some((t) => t.ctrl === side && E2.card(t).id === "made.signet") ? "the Signet must be mature and ready" : "no Signet yet: Setting + Garnet in the Vessel, two turns at the earliest";
        if (fam === "Writ" || fam === "Shape" || fam === "Feast") {
          const c = S.players[side].hand.find((h) => E2.card(h).id === { Writ: "word.writ", Shape: "earth.shape", Feast: "life.feast" }[fam]);
          const r = c && E2.whyIllegal(S, { type: "spell", card: c.pid });
          return r && r !== "not a legal sentence now" ? r : fam === "Writ" ? "no ready rival Person or Speaker to exhaust, and no ready Signet to endorse it" : "no legal target for it now";
        }
        if (fam === "attack") return mine.length ? "none of your Things can strike now (fresh, exhausted, or not permitted)" : "you have no Things";
        return "no legal action of this kind in this position";
      }
      var famsOf = (S, acts) => new Set(acts.map((a) => familyOf(S, a)).filter(Boolean));
      function diagnose(S0, policyOf) {
        const side = S0.active, S = B2.redact(S0, side);
        if (S0.over != null) return { side, rows: [], note: "the duel is over" };
        const acts = E2.legalActions(S), now = famsOf(S, acts);
        const rich = B2.redact(S0, side);
        rich.players[side].breath += 6;
        rich.players[side].spark = Math.min(5, rich.players[side].spark + 3);
        const richF = famsOf(rich, E2.legalActions(rich));
        let later = /* @__PURE__ */ new Set();
        try {
          const c = B2.redact(S0, side);
          const t0 = c.players[side].personalTurn;
          for (let k = 0; k < 4 && c.over == null; k++) {
            if (c.active === side && c.players[side].personalTurn > t0) break;
            E2.apply(c, { type: "pass" }, { block: () => null, respond: null });
          }
          if (c.over == null && c.active === side) later = famsOf(c, E2.legalActions(c));
        } catch (e) {
        }
        const plan = B2.planRank(S0, policyOf, (a) => familyOf(S, a)), bestPlan = plan.ranked.length ? plan.ranked[0].plan : 0;
        const famBest = {}, famLethal = {};
        for (const o of plan.ranked) {
          const f = familyOf(S, o.a) || (o.a.type === "pass" ? "pass" : "other");
          if (famBest[f] === void 0 || o.plan > famBest[f]) {
            famBest[f] = o.plan;
            famLethal[f] = o.lethal;
          }
        }
        const oneBest = {};
        for (const o of plan.oneply) {
          const f = familyOf(S, o.a);
          if (f && (oneBest[f] === void 0 || o.v > oneBest[f])) oneBest[f] = o.v;
        }
        const mods = S.rules.modules || [];
        const inHand = (id) => S.players[side].hand.some((h) => E2.card(h).id === id), onField = (id) => S.things.some((t) => t.ctrl === side && E2.card(t).id === id);
        const present = { Writ: inHand("word.writ"), Shape: inHand("earth.shape"), Feast: inHand("life.feast"), "fuse set": onField("earth.garnet"), Signet: onField("earth.garnet") || onField("made.signet") };
        const relevant = WATCH.filter((f) => now.has(f) || richF.has(f) || later.has(f) || present[f] || /invite orchard|visit/.test(f) && (mods.includes("visit") || mods.includes("visit_draw")) || /heat/.test(f) && mods.includes("heat") || /W5/.test(f) && mods.includes("w5"));
        const rows = relevant.map((f) => {
          if (now.has(f)) {
            const v = famBest[f], gap = v === void 0 ? null : bestPlan - v;
            const status = gap != null && gap <= 0.25 ? "best" : "inferior";
            const warn = famLethal[f] ? " \u2014 but after this line the rival's visible attackers can take your remaining life first" : "";
            return { family: f, status, warn, detail: gap == null ? "legal, but every line starting with it failed to evaluate" : status === "best" ? "legal; the planner's best line starts here" + warn : `legal; the planner values its best line ${gap.toFixed(2)} below the best (${familyOf(S, plan.ranked[0].a) || plan.ranked[0].a.type})` + warn };
          }
          if (richF.has(f)) return { family: f, status: "unaffordable", detail: reasonFor(S, side, f) };
          if (later.has(f)) return { family: f, status: "too slow", detail: "not legal now; legal at your next Main if the rival does nothing \u2014 " + reasonFor(S, side, f) };
          return { family: f, status: "unavailable", detail: reasonFor(S, side, f) };
        });
        return { side, rows, best: plan.ranked[0] ? { act: plan.ranked[0].a, family: familyOf(S, plan.ranked[0].a), plan: plan.ranked[0].plan, line: plan.ranked[0].line, threat: plan.ranked[0].threat } : null };
      }
      module.exports = { diagnose, familyOf };
    }
  });

  // src/art_index.json
  var require_art_index = __commonJS({
    "src/art_index.json"(exports, module) {
      module.exports = ["abundance", "adder", "air", "alkahest", "aloe", "amber", "apothecary", "ash", "awaken", "bard", "be", "beasts", "bellows", "bind", "birds", "bite", "blow", "boulder", "bramble", "burn", "calcine", "carrion", "clay", "copper", "crow", "crucible", "crush", "cut", "debt", "decay", "desert", "dew", "dissolve", "doubt", "drench", "drought", "earth", "echo", "eel", "ember", "energy", "feeble", "feral", "fire", "firebrand", "fixed", "flask", "flint", "frozen", "gasp", "ghost", "gnosis", "gold", "golem", "graft", "grow", "guard", "gust", "hare", "harvest", "haunt", "hawk", "hermit", "homunculus", "ice", "ink", "iron", "ivy", "kindle", "lead", "leaden", "leech", "life", "loan", "magpie", "measure", "memory", "mend", "metals", "miasma", "name", "naphtha", "night", "oak", "omen", "orrery", "otter", "ouroboros", "owl", "philosophers_stone", "phoenix", "pike", "poison", "quick", "quicksilver", "rain", "rat", "reckoning", "resonant", "rust", "saffron", "salamander", "salt", "sapling", "scarab", "scorch", "scream", "scribe", "seed", "separate", "shadow", "silence", "silver", "sleep", "smith", "spider", "spore", "spring", "squall", "stag", "steam", "stone", "storm", "swallow", "swamp", "tame", "temper", "thaw", "thorny", "tide", "tin", "toadstool", "tonic", "torch", "tower", "transmute", "venomous", "vitriol", "wash", "water", "wildfire", "willow", "wind", "winged", "winter", "wither", "wolf", "word", "wormwood", "yew"];
    }
  });

  // src/main.js
  init_define_process_env();
  var E = require_engine();
  var B = require_bots();
  var F = require_formats();
  var R = require_recipes();
  var { BY_ID, CARDS } = require_cards();
  var { REFERENCE_DECKS } = require_reference_decks();
  var { THEMED, COUNTERS } = require_themed_decks();
  var { FOLIO_DECKS, ABLATIONS } = require_folio_decks();
  var SPEC = require_spec_catalogue();
  var { createController, restoreController } = require_controller();
  var { FIXTURES } = require_fixtures();
  var { V2_DECKS } = require_v32_decks();
  var { V33_DECKS: V33_OLD, THREE_DECKS } = require_v33_decks();
  var V33_DECKS = THREE_DECKS;
  var CORE_FMT = "v33_core3";
  var isCore = () => !!(A.cfg && /^v33_core/.test(A.cfg.format));
  var isThree = () => !!(A.C && A.C.S && A.C.S.rules.modules && A.C.S.rules.modules.includes("three"));
  var SC = require_scenario();
  var DG = require_diagnose();
  var FIXRES = () => Object.assign({}, FIXTURES, { __fromSpec: SC.asFixture });
  var ART = new Set(require_art_index());
  var FMT_GROUPS = [
    ["Reference", [["grammar_v30_rc1", "V30 rc1 \u2014 original market (2/3 spark)"]]],
    ["Market comparison", [["grammar_v30_exp_price34", "Market at 3/4 spark (experiment)"]]],
    ["Other test variants", [["grammar_v30_exp_nosentence", "No spark from sentences"], ["grammar_v30_exp_income2", "Spark income every second turn"], ["grammar_v30_exp_buy2", "Buy every second turn"], ["grammar_v30_exp_reserve3", "Reserve cap 3"], ["grammar_v30_exp_cheapresp", "Cheaper responses"]]],
    ["V31 Living Folio \xB7 Expanded Grammar (experiment)", [["folio_b_all", "All three modules: orchard, workshop, decay"], ["folio_b_orchard", "Orchard only (Bee, Hazel, Feast)"], ["folio_b_workshop", "Workshop only (Shape, Garnet, Signet, Writ)"], ["folio_b_garden", "Orchard + decay (Mould)"], ["folio_b_decay", "Decay only (Mould)"]]],
    ["V31 C-life \xB7 persistent processes (isolated experiment)", [["folio_c_life", "Bear and Shape as public processes (ordinary victory only)"]]],
    ["Core Duel", [["v33_core3", "Core Duel, three decks \u2014 the game"], ["v33_core3_noex", "Three decks, Study exchange off (internal toggle)"], ["v33_core", "V33 Core Duel (archived build rules)"]]],
    ["V32 Workshop \xB7 B control", [["v32_b", "B modules only (orchard, workshop, decay) \u2014 the V32 control"]]],
    ["V32 \xB7 V visit an opposing orchard", [["v32_visit", "V \u2014 visitor reorders its top two"], ["v32_visit_draw", "V \u2014 visitor draws 1 instead (separate arm)"]]],
    ["V32 \xB7 H borrow the rival's heat", [["v32_heat", "H \u2014 1 breath + 1 spark fee to the host"]]],
    ["V32 \xB7 R combat permissions", [["v32_rfruit", "R \u2014 Fruit only"], ["v32_r6", "R \u2014 six core rows"], ["v32_rext", "R \u2014 six rows + broader overlay"]]],
    ["V32 \xB7 field capacity", [["v32_cap6", "Six general spaces"], ["v32_supply", "Five general + one supply space"], ["v32_supply4", "Four general + one supply space"]]],
    ["V32 \xB7 creation value", [["v32_shape1", "Shape costs 1 breath (own configuration)"]]],
    ["V32 \xB7 W5 alternative victory (concept test)", [["v32_w5", "W5 \u2014 World Tree life-plus-work"]]],
    ["Earlier", [["grammar_v29_spec", "V29 specification"]]]
  ];
  var VERSION = "Core Duel \u2014 three decks \xB7 rules " + F.resolveFormat("v33_core3").version;
  var SCHOOLS = ["fire", "water", "air", "earth", "life", "rot", "word"];
  var SCHOOL_NAME = { fire: "Fire", water: "Water", air: "Air", earth: "Earth", life: "Life", rot: "Rot", word: "The Word" };
  var TIERS = B.TIER_ORDER;
  var store = { get(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  }, set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  } };
  var SPEC_BY = {};
  for (const s of SPEC) if (s.school !== "legacy") SPEC_BY[s.school + "." + s.name.toLowerCase().replace(/[^a-z]+/g, "_").replace(/_$/, "")] = s;
  var MADE_TEXT = {
    "made.energy": "Fire/Air. Non-living. At your upkeep gain 1 extra breath (within the +2 limit).",
    "made.steam": "Fire/Water. Body, Seep. Makes Things it damages in combat Wet. Disperses at its controller's second upkeep.",
    "made.swamp": "Earth/Water. Liquid, Body. Life ingredient.",
    "made.golem": "Earth/Word. Clay, Stone, Body. Heavy, Guard.",
    "made.homunculus": "Water/Word. Living Person, Speaker, Body. On formation inspect the top 3 cards of your deck and take a Spell.",
    "made.phoenix": "Fire. Living Beast, Bird, Winged, Hot, Body. Flying, Final. The first time it would be destroyed in the duel it is reborn instead: damage removed, exhausted.",
    "made.alkahest": "Water. Liquid, Final. Main, 1 breath, sacrifice Alkahest: destroy an enemy Thing or damageable Ground.",
    "made.ouroboros": "Rot/Life. Living Beast, Serpent, Body. Venomous, Bite, Final. Its controller's first Ouroboros death recovers one released ingredient to hand.",
    "made.life": "Life/Earth/Water. Living. At your upkeep heal 1 life.",
    "made.world_tree": "Life/Earth/Water. Living Plant, Tree, Body. Guard, Final. At your upkeep heal 2 life and give 1 Growth to your oldest other Living Thing.",
    "made.quintessence": "Fire/Air/Earth/Water. Body. Philosopher's Stone ingredient.",
    "made.philosophers_stone": "Earth/Word with elemental lineage. Stone, Metal, Body. Final. At your upkeep choose: 1 extra breath or draw 1.",
    "token.ash": "Token. Material. Phoenix ingredient.",
    "token.fruit": "Token. Food. Main, 1 breath, sacrifice: heal 2 life or remove 1 poison from a friendly Thing.",
    "token.blossom": "Token. Living Plant, Flower.",
    "token.carrion": "Token. Organic. Decay deals 4 when Carrion is its sacrifice.",
    "earth.gold": "Transformed-only. Metal, Body, Incorruptible. At your upkeep gain 1 extra breath."
  };
  var SPECIAL = { philosophers_stone: "Philosopher's Stone", world_tree: "World Tree" };
  function nm(id) {
    if (!id) return "";
    if (id === "?") return "Hidden word";
    if (BY_ID[id] && BY_ID[id].name && /3$/.test(String(id))) return BY_ID[id].name;
    const w = String(id).split(".").pop();
    return SPECIAL[w] || w.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  var FOLIO_TEXT = {
    "life.bee": "Living Beast, Insect, Winged, Flying, Body, Flammable. Pollinate: Main, 1 breath, exhaust this mature ready Bee: your insect-pollinated flowering Orchard tree (Pear) makes 1 Fruit, if you have none and a space is free. Needs working wings: Wet or Desert grounds it.",
    "life.hazel": "Living Plant, Tree, Orchard, Flower, Flammable. Wind-pollinated: your mature ready Wind can pollinate it (Main, 1 breath, exhaust the Wind) to make 1 Fruit (a nut). A Bee, an Owl or a Rose cannot.",
    "life.feast": "Main. Additional cost: sacrifice your Fruit. Ready 1 or 2 of your exhausted, mature Living Things with Body and strike that have acted fewer than twice this turn. Each may act once more (a Strike still costs 1). Never a third action.",
    "earth.shape": "Main. Work your Copper or Silver into a Setting: same card, same damage, compatible attachments stay. Not if Fixed, not if it would die, at most one metal change per turn.",
    "earth.garnet": "Non-living Stone, Jewel, settable. Can block. Set it into a Setting in the Vessel to make a Signet.",
    "earth.setting": "Transformed only (from Copper or Silver). Metal, Socket. No Body. Can block. Remembers its original card: bounced, it returns as that word. Set + Garnet in the Vessel = Signet.",
    "made.signet": "Made: Setting + Garnet (Set recipe, 2 breath). Metal, Artefact, Instrument. Main, 1 breath, exhaust: give a friendly original Thing Named. Or exhaust it to endorse Writ. Separate restores the Setting and the Garnet.",
    "word.writ": "Main. Exhaust a ready rival Person or Speaker. Or endorse it by exhausting your mature ready Signet: exhaust up to two ready rival Things. Each target is rechecked; Ward stops it on a single target. Doubt can counter it.",
    "rot.mould": "Living Fungus, Decomposer. Main, 1 breath, exhaust: seal a Plant card of yours that died (destroyed or sacrificed) from your Grave; another friendly Plant gains 1 Growth and 1 age. A discarded Plant or a released ingredient cannot pay."
  };
  var OVERLAY_TEXT = { "life.pear": " Folio: insect-pollinated (a Bee can pollinate it).", "air.wind": " Folio: wind carrier (can pollinate Hazel, even when Wet).", "fire.smith": " Folio: Main, 2 breath, exhaust: work your Copper or Silver into a Setting (native, cannot be Doubted)." };
  var CORE_TEXT = {
    "token.fruit": "Token. Food. Main, 1 breath, sacrifice the Fruit \u2014 choose one: you heal 2 life; or remove 1 poison from a friendly Thing; or restore up to 2 marked damage on an injured friendly Living Thing.",
    "water.dew": "Response. Choose a friendly Thing: it becomes Wet (Burning ends), loses 1 poison, and if it is Living it restores up to 2 marked damage. Or remove 1 poison from yourself.",
    "fire.kindle": "Response. Friendly Thing +1 strike this turn; if it deals combat damage to a flammable Thing, Ignite it. If you choose your Naphtha, Ignite the Naphtha instead (Wet does not stop it).",
    "fire.naphtha": "Non-living Liquid, Flammable. Oil burns on water: Wet does not stop it igniting. The first time it is Ignited: 2 damage to every enemy Thing and 2 to the rival, then Naphtha is destroyed. Ignite it with Kindle.",
    "fire.drought": "Weather (2 turns). When called, every Thing stops being Wet. At each upkeep the active player's Things dry. Your first Ignite of an enemy Thing each turn also deals 1 damage.",
    "life.abundance": "Main. Up to two of your Plants: each gains 1 Growth and ages once (a Seed or Sapling grows a stage when it reaches age 2).",
    "air.winged": "Quality. Attach to a friendly Thing that does not already fly: it gains Winged, Flying and Blow."
  };
  var THREE_TEXT = {
    "life.bee": "Living Beast, Insect, Winged, Flying. Pollinate: Main, 1 breath, exhaust this mature ready Bee to pollinate your Pear or Apple \u2014 choose: make 1 Fruit (room and none), or heal 2 life, or heal 2 marked damage on a friendly Living Thing. One pollination per turn (shared with Wind). Wet grounds it.",
    "life.hazel": "Living Plant, Tree, Orchard, Flower. Wind-pollinated: Main, 1 breath, exhaust your mature ready Wind to pollinate it \u2014 make 1 Fruit (room and none), or heal 2 life, or heal 2 marked damage on a friendly Living Thing. One pollination per turn.",
    "life.pear": "Living Plant, Tree, Orchard, Flower. Insect-pollinated: your Bee can pollinate it (Fruit, heal 2 life, or heal 2 on a Living Thing).",
    "life.apple": "Living Plant, Tree, Orchard, Flower. When Apple arrives, if you control another Flower and no Fruit, make 1 Fruit (room permitting). Your Bee can pollinate it.",
    "life.feast": "Main. Heal up to 2 marked damage on one or two of your Living Things. You may also sacrifice your Fruit: then ready one exhausted Thing of yours for defence only until your next Renew (it can block, not attack, act, carry or fuse).",
    "life.abundance": "Main. One or two of your Plants gain 1 Growth each (+1 stand). Each chosen Tree with 2+ Growth then gets +2 strike this turn.",
    "life.graft3": "Main. Join your Pear or Apple with your Sapling or another fruit tree in the Vessel: they become an Espalier (2 breath, no catalyst). Uses your Vessel this turn.",
    "life.sapling": "Living Plant. At your upkeep gains 1 age; at age 2 becomes Willow (with Water Ground) or Oak. Can Bind. A Graft rootstock.",
    "life.willow": "Living Plant, Tree. Can Bind. Main, 1 breath, exhaust: heal up to 2 marked damage on a friendly Thing.",
    "life.bind": "Response. Your Bramble, Sapling, Willow or Espalier binds a reachable enemy Thing until its controller ends their turn. A Bound attacker deals no damage.",
    "water.dew": "Response. Choose one: Wet a visible Thing (any side); or heal up to 2 marked damage on a friendly Living Thing; or remove 1 poison from you or a friendly Living Thing.",
    "fire.naphtha": "Non-living Liquid, Flammable. The first time it is Ignited: destroy it and deal 3 at once to the two oldest visible enemy Things (all, if fewer). No damage to the rival. Wet stops it igniting.",
    "fire.kindle": "Response. Choose: Ignite one of your dry Flammable Things (e.g. Naphtha); or a friendly Thing gets +1 strike this turn and ignites the flammable Things it damages in combat.",
    "fire.burn": "Action. Your Burn-capable Thing Ignites a dry Flammable Thing \u2014 the rival's or your own.",
    "fire.calcine": "Main. Additional cost: sacrifice a Thing of yours. Deal 3 to a visible enemy Thing or the rival. If you chose Ash at declaration and have room and none, make an Ash.",
    "fire.wildfire": "Main. One or two visible enemy Things: 1 damage each, or 3 to each that is Burning when it resolves. Never the rival.",
    "fire.tinder": "Non-living, Flammable. Main, 1 breath, sacrifice Tinder: Ignite a visible dry Flammable Thing other than itself. If it was yours and caught, make an Ash (room and none). Usable the turn it arrives.",
    "earth.clay": "Clay. Main, 1 breath, sacrifice Clay: the next damage to another friendly Thing before your next Renew is reduced by up to 3. Clay + Word make a Golem in the Vessel.",
    "earth.copper": "Metal. Transmute into Silver; or Shape into a Hammer or a Signet. One metal change per turn.",
    "earth.silver": "Metal, Sacred. Transmute into Gold; or Shape into a Signet.",
    "earth.iron": "Metal, Heavy. Shape into a Hammer.",
    "earth.crucible": "Ground. Your first fusion each turn costs 1 less (min 2). Temper: Main, 1 breath, exhaust a mature ready damaged Metal: heal 2 from it, once per turn.",
    "earth.guard": "Main. A friendly Thing gains Reach and +2 stand until your next Renew. When it expires, damage beyond its stand destroys it.",
    "earth.crush": "Action. Your Heavy or Crush-capable Thing hits a reachable visible enemy Thing with +2 strike. Damage beyond what destroys it hits the rival once. Never the rival or a Ground.",
    "earth.shape3": "Main. Change your Copper or Iron into a Hammer, or your Copper or Silver into a Signet. Keeps its place and damage. One metal change per turn.",
    "earth.hammer": "Metal, Body, Tool. Can Crush. Main, 1 breath, exhaust: deal 2 to a visible damaged enemy Thing or to the enemy Ground.",
    "earth.signet3": "Shaped only (Copper or Silver). Metal, Instrument. Main, 1 breath, exhaust: give another friendly Thing Ward. Or exhaust it to stamp Writ. Cannot Ward itself.",
    "word.writ3": "Main. Exhaust a ready visible enemy Thing with strike 2 or less. Or stamp it by exhausting your mature ready Signet: exhaust one or two ready enemy Things of any strike.",
    "word.awaken": "Main. A friendly non-living Thing gains Body and 1 Might (+1 strike) while in play. A Body only gains the Might.",
    "made.espalier": "Made: fruit tree + Sapling or another fruit tree (Graft). Living Plant, Tree. Reach, can Bind. At your upkeep: make a Fruit (none and room), else +1 Growth to another friendly Plant.",
    "made.golem3": "Made: Clay + Word. Heavy, Guard, Reach. When its attack destroys its blocker, the excess damage hits the rival once.",
    "made.phoenix": "Made: Firebird + Ash. Flying. Once per duel, if damage would destroy it, it survives instead: damage cleared, exhausted.",
    "token.fruit": "Token. Food. Main, 1 breath, sacrifice: heal 2 life, or heal 2 marked damage on a friendly Living Thing, or remove 1 poison from one. Also pays for Feast.",
    "token.ash": "Token. Ash. Can block. Firebird + Ash make a Phoenix in the Vessel."
  };
  function textOf(id) {
    if (isThree() && THREE_TEXT[id]) return THREE_TEXT[id];
    if (isCore() && CORE_TEXT[id]) return CORE_TEXT[id];
    const base = FOLIO_TEXT[id] || (SPEC_BY[id] ? SPEC_BY[id].text : MADE_TEXT[id] || "");
    const fm = A.C && A.C.S && A.C.S.rules.modules || [];
    return base + (fm.length && OVERLAY_TEXT[id] && (id !== "fire.smith" && fm.includes("orchard") || id === "fire.smith" && fm.includes("workshop")) ? OVERLAY_TEXT[id] : "");
  }
  function schoolOf(id) {
    const c = BY_ID[id];
    return c ? c.school : "word";
  }
  var esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var TYPE_NAME = { thing: "Thing", action: "Action", spell: "Spell", ground: "Ground", quality: "Quality", weather: "Weather", burden: "Burden", category: "Category" };
  var A = { view: store.get("wa34.view") || "art", names: {}, screen: "core", C: null, sel: null, why: null, inspect: null, modal: null, speed: 600, review: null, botTimer: null, flash: null };
  var lobby = Object.assign({ ra: "ra", mine: "V01_neighbours_orchard", theirs: "V04_orchard_cellar", tier: "journeyman", style: "careful", seat: "first", seed: 1001, format: "v32_visit" }, store.get("wa34.lobby") || {});
  function allDecks() {
    const custom = store.get("wa34.custom") || {};
    const out = [];
    for (const [k, v] of Object.entries(REFERENCE_DECKS)) out.push({ id: k, group: "Reference decks (frozen)", label: k.replace(/_/g, " ") + " \u2014 " + v.rival, words: v.words });
    for (const [k, v] of Object.entries(THEMED)) out.push({ id: k, group: "Themed test decks", label: k.slice(2).replace(/_/g, " "), words: v });
    for (const [k, v] of Object.entries(COUNTERS)) out.push({ id: k, group: "Counter test decks", label: k.slice(2).replace(/_/g, " "), words: v });
    for (const [k, v] of Object.entries(V2_DECKS)) out.push({ id: k, group: "V32 Volume II decks", label: v.note, words: v.words });
    for (const [k, v] of Object.entries(FOLIO_DECKS)) out.push({ id: k, group: "V31 Folio decks (need a Folio rules version)", label: v.note + " (" + k[0] + ")", words: v.words, modules: v.modules });
    for (const [k, v] of Object.entries(ABLATIONS)) out.push({ id: k, group: "V31 A-ablations (rc1-legal twins)", label: k.replace("_A", "") + " list with rc1 substitutes", words: v });
    for (const [k, v] of Object.entries(custom)) out.push({ id: "custom:" + k, group: "Your test decks", label: k, words: v });
    return out;
  }
  var deckById = (id) => allDecks().find((d) => d.id === id) || allDecks()[0];
  var hooks = { changed: () => {
    save();
    render();
  }, prompt: () => {
    save();
    render();
  }, error: (C, e) => {
    A.flash = "Engine refused that: " + (C.error || e.message);
    render();
  } };
  function startMatch(cfgOverride) {
    stopBot();
    const d1 = deckById(lobby.mine), d2 = deckById(lobby.theirs);
    const mods = (F.resolveFormat(lobby.format).variant || {}).modules || [];
    const bad = [d1, d2].map((d) => E.deckErrors(d.words, mods)).find((e) => e.length);
    if (!cfgOverride && bad) {
      A.flash = "That deck needs a different rules version: " + bad.join("; ") + ". Choose a V31 Folio or V32 Workshop rules version for these decks.";
      renderLobby();
      return;
    }
    const first = lobby.seat === "first" ? 0 : lobby.seat === "second" ? 1 : lobby.seed % 2;
    const cfg = cfgOverride || { format: lobby.format, decks: [d1.words, d2.words], deckNames: [d1.label, d2.label], seed: +lobby.seed, first, humanSide: 0, botPolicy: lobby.style + ":" + lobby.tier + (lobby.ra ? ":" + lobby.ra : "") };
    A.cfg = cfg;
    A.C = createController(cfg, hooks);
    A.sel = null;
    A.why = null;
    A.review = null;
    A.screen = "match";
    A.C.start();
    render();
  }
  function startFixture(id, fx) {
    stopBot();
    fx = fx || FIXTURES[id];
    const cfg = { format: fx.format || "grammar_v30_rc1", decks: [], seed: 0, first: fx.build().first, humanSide: 0, botPolicy: lobby.style + ":" + lobby.tier + (lobby.ra ? ":" + lobby.ra : ""), fixture: fx, deckNames: ["Fixture", "Fixture"] };
    A.cfg = cfg;
    A.C = createController(cfg, hooks);
    A.sel = null;
    A.why = null;
    A.screen = "match";
    A.C.start();
    render();
  }
  function save() {
    if (!A.C || A.review) return;
    const rep = A.C.replay();
    rep.deckNames = A.cfg.deckNames;
    store.set("wa34.last", rep);
    store.set("wa34.left", false);
  }
  function stopBot() {
    if (A.botTimer) {
      clearTimeout(A.botTimer);
      A.botTimer = null;
    }
  }
  function driveBot() {
    stopBot();
    const C = A.C;
    if (!C || A.review || !C.isBotTurn()) return;
    A.botTimer = setTimeout(() => {
      A.botTimer = null;
      if (!A.C || !A.C.isBotTurn()) return;
      A.C.botAct();
      render();
    }, A.speed);
  }
  var KEYS = ["type", "kind", "card", "subject", "ability", "recipe", "a", "b", "category", "qual", "sacrifice", "endorse", "payload", "mode", "targets", "target", "seal", "branch", "replace", "might", "donor", "slot", "verb", "host", "tree", "work", "mend", "ash", "ready", "discard"];
  var KEY_LABEL = { kind: "Invitation", host: "Tree to open", type: "What to do", card: "Word", subject: "Who acts", ability: "Ability", recipe: "Recipe", a: "First ingredient", b: "Second ingredient", category: "Category", qual: "Lawful Quality", sacrifice: "Sacrifice (cost)", payload: "Payload", mode: "Property to blow", targets: "Targets", target: "Target", branch: "Becomes", replace: "Replace attachment", might: "Gains Might", donor: "Donor plant", slot: "Offer", verb: "Verb", endorse: "Endorse with Signet (exhausts it)", seal: "Seal a dead Plant from your Grave (cost)", mend: "Living Thing to heal", ash: "Make an Ash?", ready: "Ready for defence (sacrificing the Fruit)", discard: "Word to discard" };
  var J = (v) => JSON.stringify(v == null ? null : v);
  function baseCands() {
    const C = A.C;
    if (!C) return [];
    if (C.pending && C.pending.type === "respond") return C.pending.options;
    if (C.pending || !C.S || C.S.over != null || C.S.active !== C.human || A.review) return [];
    return E.legalActions(C.S).filter((a) => a.type !== "pass" && a.type !== "combat" && a.type !== "study");
  }
  function anchorMatch(a, an) {
    if (!an) return true;
    if (an.kind === "card") return a.card === an.id || a.category === an.id || a.qual === an.id;
    if (an.kind === "thing") return a.host === an.id || a.tree === an.id || a.type === "hotwork" && a.target === an.id || a.subject === an.id || a.a === an.id || a.b === an.id || a.sacrifice === an.id || a.payload === an.id || a.endorse === an.id || a.donor === an.id;
    if (an.kind === "foe") return a.target === an.id || (a.targets || []).includes(an.id);
    if (an.kind === "market") return a.type === "buy" && a.slot === an.id;
    if (an.kind === "vessel") return a.type === "fuse";
    if (an.kind === "ground") return a.type === "fuse" && (a.a === "ground" || a.b === "ground") || a.type === "invite" && a.kind === "heat";
    if (an.kind === "catalyst") return a.type === "catalyst";
    return true;
  }
  function selection() {
    const all = baseCands();
    if (!A.sel) return { all, cands: [], next: null };
    let cands = all.filter((a) => anchorMatch(a, A.sel.anchor));
    for (const [k, v] of Object.entries(A.sel.fixed)) cands = cands.filter((a) => J(a[k]) === v);
    let next = null;
    for (const k of KEYS) {
      const vals = new Set(cands.map((a) => J(a[k])));
      if (vals.size > 1) {
        next = k;
        break;
      }
    }
    const choices = next ? [...new Set(cands.map((a) => J(a[next])))].map((v) => JSON.parse(v)) : [];
    return { all, cands, next, choices };
  }
  function boardTargets(sel) {
    const out = /* @__PURE__ */ new Set();
    if (!sel || !sel.next) return out;
    for (const v of sel.choices) {
      if (typeof v === "string") out.add(v);
      if (Array.isArray(v) && v.length === 1) out.add(v[0]);
    }
    return out;
  }
  function who(side) {
    return A.C && side === A.C.human ? "You" : "Rival";
  }
  function thingName(S, id) {
    const t = S.things.find((x) => x.id === id);
    if (!t) return (A.names[id] || "a Thing") + " (gone)";
    if (t.status.concealed && t.ctrl !== A.C.human) return "a Concealed Thing";
    return nm(t.form || t.word) + (t.ctrl === A.C.human ? "" : " (rival)");
  }
  function cardWord(S, pid) {
    for (const p of S.players) {
      const c = p.hand.concat(p.grave, p.sealed).find((x) => x.pid === pid);
      if (c) return c.word;
    }
    if (S.clause) for (const n of S.clause.nodes) {
      if (n.card && n.card.pid === pid) return n.card.word;
      for (const c of n.extra || []) if (c.pid === pid) return c.word;
    }
    for (const t of S.things) for (const q of t.quals || []) if (q.pid === pid) return q.word;
    for (const t of S.things) if (t.pid === pid) return t.status.concealed && t.ctrl !== A.C.human ? "?" : t.word;
    for (const p of S.players) if (p.ground && p.ground.pid === pid) return p.ground.word;
    if (S.sky && S.sky.pid === pid) return S.sky.word;
    return null;
  }
  function valueLabel(S, key, v) {
    if (v == null) return "\u2014";
    if (key === "card" || key === "category" || key === "qual") return nm(cardWord(S, v) || v);
    if (key === "replace") return "Replace " + nm(cardWord(S, v));
    if (key === "slot") {
      const o = S.market[v];
      return o ? nm(o.word) : "from the market";
    }
    if (key === "recipe") return /^esp_/.test(v) ? "Espalier" : nm("made." + v) || v;
    if (key === "branch") return { fruit: "Make 1 Fruit", life: "Heal 2 life", mend: "Heal 2 marked damage on a Living Thing" }[v] || nm(v);
    if (key === "ash") return v ? "Yes \u2014 make an Ash (room and none)" : "No Ash";
    if (key === "ready" || key === "mend") return thingName(S, v);
    if (key === "discard") return "Discard " + nm(cardWord(S, v));
    if (key === "kind") return { orchard: "Open a tree to visiting Bees", heat: "Lend your heat (Fire or Torch)" }[v] || v;
    if (key === "work") return "World Tree (W5)";
    if (key === "mode") return { hot: "Hot \u2014 ignite", liquid: "Liquid \u2014 make Wet", toxic: "Toxic \u2014 1 poison", wet: "Make it Wet", heal: "Heal 2 marked damage", cleanse: "Remove 1 poison", ignite: "Ignite it", fan: "+1 strike and combat ignition this turn" }[v] || v;
    if (key === "ability") return { heal2: "Heal 2", tend: "Tend", etch: "Etch (3 to Metal/Stone)", eatFruit: "Eat fruit", alkahest: "Dissolve (destroy)", pollinate: "Pollinate (make Fruit)", shapeWork: "Work metal into a Setting", signet: "Seal with the Signet (Named)", mould: "Return the dead to the soil", bear: "Start Bear (crop next turn)", shapeStart: "Start Shape (Setting next turn)", visit: "Visit the rival's orchard", clayShield: "Shield \u2014 prevent the next 3", tinder: "Tinder \u2014 ignite", hammer: "Hammer \u2014 2 damage", seal: "Seal \u2014 give Ward", temper: "Temper \u2014 heal 2" }[v] || v;
    if (key === "endorse") return v ? (isThree() ? "Stamp with " : "Endorse with ") + thingName(S, v) : "No endorsement";
    if (key === "seal") return targetLabel(S, v);
    if (key === "type") return { deploy: "Bring forth", ground: "Lay Ground", spell: "Speak", attack: "Attack", remote: "Act", fuse: "Fuse", ability: "Ability", buy: "Buy", catalyst: "Refill catalyst", invite: "Invite (opens at your End)", hotwork: "Borrow the rival's heat", claim: "Declare the work", quality: "Attach", weather: "Weather", burden: "Burden", law: "Law" }[v] || v;
    if (Array.isArray(v)) return v.map((x) => thingName(S, x)).join(" and ");
    return targetLabel(S, v);
  }
  function targetLabel(S, v) {
    if (v === "rival") return A.C.human === (A.actor != null ? A.actor : S.active) ? "the rival" : "you";
    if (v === "self") return A.C.human === (A.actor != null ? A.actor : S.active) ? "yourself" : "the rival";
    if (v === "sky") return "the Weather (" + nm(S.sky && S.sky.word) + ")";
    if (v === "law") return "the Law";
    if (v === "ground") return "a Ground";
    const s = String(v);
    if (s.startsWith("g:")) return nm(cardWord(S, s.slice(2))) + " (Grave)";
    if (s.startsWith("q:")) return nm(cardWord(S, s.slice(2))) + " (attached Quality)";
    if (s.startsWith("node:")) {
      const n = S.clause && S.clause.nodes[+s.slice(5)];
      return "the pending " + (n && n.card ? nm(n.card.word) : "sentence");
    }
    if (s.startsWith("reveal:")) return "reveal " + thingName(S, s.slice(7));
    if (s.startsWith("burden:")) return "the Burden on " + (+s.slice(7) === A.C.human ? "you" : "the rival");
    if (S.things.some((t) => t.id === v)) return thingName(S, v);
    if (/^t\d+$/.test(s)) return (A.names[s] || "a Thing") + " (gone)";
    return s;
  }
  function describe(S, a, actor) {
    A.actor = actor;
    try {
      return describe0(S, a);
    } finally {
      A.actor = null;
    }
  }
  function describe0(S, a) {
    if (!a) return "Pass";
    const c = a.card ? nm(cardWord(S, a.card)) : "";
    const tgt = a.target != null ? " \u2192 " + targetLabel(S, a.target) : a.targets ? " \u2192 " + a.targets.map((x) => thingName(S, x)).join(", ") : "";
    switch (a.type) {
      case "pass":
        return "End turn";
      case "study":
        return a.discard ? "Study \u2014 exchange: discard " + nm(cardWord(S, a.discard)) + ", then draw 1" : "Study: draw 1 word";
      case "combat":
        return "Attack the rival with " + a.attackers.map((x) => thingName(S, x)).join(", ");
      case "invite":
        return a.kind === "orchard" ? "Open " + thingName(S, a.host) + " to visiting Bees at your End" : "Lend your heat (" + nm(S.players[S.active].ground ? S.players[S.active].ground.word : "") + ") at your End";
      case "hotwork":
        return "Borrow the rival's heat: work " + thingName(S, a.target) + " into a Setting";
      case "claim":
        return "Declare the work: World Tree " + thingName(S, a.tree) + " with " + thingName(S, a.target);
      case "complete":
        return "Complete your process (1 breath)";
      case "abandon":
        return "Abandon your process (free)";
      case "deploy":
        return "Bring forth " + c;
      case "ground":
        return "Lay " + c + " as Ground";
      case "spell":
        return "Speak " + c + (a.recipe ? ": " + thingName(S, a.a) + " + " + thingName(S, a.b) + " \u2192 " + valueLabel(S, "recipe", a.recipe) : "") + tgt + (a.mode ? " (" + valueLabel(S, "mode", a.mode) + ")" : "") + (a.branch ? " (becomes " + nm(a.branch) + ")" : "") + (a.sacrifice ? ", sacrificing " + thingName(S, a.sacrifice) : "") + (a.ready ? ", readying " + thingName(S, a.ready) + " for defence" : "") + (a.ash === true ? ", making an Ash" : "") + (a.endorse ? ", stamped by exhausting " + thingName(S, a.endorse) : "") + (a.donor ? " with " + thingName(S, a.donor) : "");
      case "attack":
        return thingName(S, a.subject) + " \u2014 " + (a.card ? c : "Strike") + tgt;
      case "remote":
        return thingName(S, a.subject) + " \u2014 " + c + tgt + (a.payload ? " (payload " + thingName(S, a.payload) + ", " + a.mode + ")" : "");
      case "fuse":
        return "Fuse " + nm("made." + a.recipe) + ": " + (a.a === "ground" ? "your Ground" : thingName(S, a.a)) + " + " + (a.b === "ground" ? "your Ground" : thingName(S, a.b));
      case "ability":
        return thingName(S, a.subject) + " \u2014 " + valueLabel(S, "ability", a.ability) + (a.target === "ground" ? " \u2192 the rival's Ground" : tgt) + (a.branch ? " \u2014 " + valueLabel(S, "branch", a.branch) : "") + (a.mend ? " (" + thingName(S, a.mend) + ")" : "") + (a.seal ? ", sealing " + targetLabel(S, a.seal) : "");
      case "buy":
        return "Buy " + valueLabel(S, "slot", a.slot);
      case "catalyst":
        return "Refill the catalyst";
      case "quality":
        return "Attach " + c + tgt + (a.replace ? ", replacing " + nm(cardWord(S, a.replace)) : "");
      case "weather":
        return "Call " + c + " (Weather)";
      case "burden":
        return "Lay " + c + " on the rival";
      case "law":
        return "Law: " + nm(cardWord(S, a.category)) + " + Be + " + nm(cardWord(S, a.qual));
    }
    return a.type;
  }
  function studyWhy(S) {
    const p = S.players[A.C.human];
    if (p.studyTurn === p.personalTurn) return "You have studied this turn (once per turn).";
    if (p.breath < 2) return `Study costs 2 breath; you have ${p.breath}.`;
    if (!p.deck.length) return "Your deck is empty: nothing to draw (no fatigue from Study).";
    if (p.hand.length >= E.FORMAT.handCap && !(S.rules.modules || []).includes("exchange")) return `Your hand is full (${E.FORMAT.handCap}).`;
    return "";
  }
  function exchangeHTML(S) {
    const p = S.players[A.C.human], x = A.exch;
    if (!x.pick) return `<h3>Study \u2014 exchange</h3><p class="reader">Your hand is full (${p.hand.length}/${E.FORMAT.handCap}). Pay 2 breath, put one word from your hand into your Grave (a discard, not a death), then draw exactly one. Uses your Study for this turn.</p><p class="step">Word to discard \u2014 click a highlighted word in your hand</p><div class="btns"><button id="x-back">Back</button></div>`;
    const a = { type: "study", discard: x.pick };
    return `<h3>Study \u2014 exchange</h3><p class="sentence">${esc(describe(S, a))}</p><p class="cost">Cost: <b>${esc(costOf(S, a))}</b> \xB7 you will have <b>${p.breath - 2}</b> breath left</p>
    <div class="pred"><b>Result:</b><ul><li>${esc(nm(cardWord(S, x.pick)))} goes to your Grave</li><li>You draw 1 (deck ${p.deck.length} \u2192 ${p.deck.length - 1}); hand stays ${p.hand.length}</li><li>Study is used for this turn</li></ul></div>
    <div class="btns"><button id="x-go" class="go">Declare</button><button id="x-back">Back</button></div>`;
  }
  function costOf(S, a) {
    const p = S.players[A.C.human];
    if (a.type === "buy") return E.priceOf(S, p.i, S.market[a.slot].word) + " spark";
    if (a.type === "catalyst") return "2 spark";
    if (a.type === "fuse") {
      const r = E.recipeById(a.recipe);
      const o = (id) => id === "ground" ? p.ground : S.things.find((t) => t.id === id);
      const pv = E.previewFusion(S, p.i, r, o(a.a), a.a === "ground", o(a.b), a.b === "ground");
      return pv ? pv.cost + " breath" + (pv.catalyst ? " + catalyst" : "") : "?";
    }
    if (a.type === "ability") {
      const t = S.things.find((x) => x.id === a.subject);
      return t ? E.abilityCost(S, t, a.ability) + " breath" + (a.ability === "pollinate" ? " (exhausts the carrier; your one pollination this turn)" : a.seal ? " + seal a dead Plant" : a.ability === "tinder" ? " + sacrifice Tinder" : a.ability === "clayShield" ? " + sacrifice Clay" : /^(hammer|seal|temper)$/.test(a.ability) ? " + exhaust it" : "") : "";
    }
    if (a.type === "law") return [a.card, a.category, a.qual].reduce((s, pid) => s + BY_ID[cardWord(S, pid)].cost, 0) + " breath";
    if (a.card) {
      const w = cardWord(S, a.card);
      return BY_ID[w].cost + (A.C.pending && A.C.pending.type === "respond" && A.C.pending.kind === "response" ? " reserve" : " breath");
    }
    if (a.type === "attack") return isCore() ? a.card ? BY_ID[cardWord(S, a.card)].cost + " breath" : "free" : "1 breath";
    if (a.type === "combat") return "free";
    if (a.type === "study") return a.discard ? "2 breath + discard " + nm(cardWord(S, a.discard)) + " to your Grave" : "2 breath";
    if (a.type === "invite") return "free (an invitation, not a promise)";
    if (a.type === "hotwork") return "1 breath + 1 spark paid to the rival on declaration (kept if interrupted)";
    if (a.type === "claim") return "2 breath (kept if interrupted)";
    return "";
  }
  function predict(a) {
    const C = A.C, S0 = C.state();
    try {
      const c = B.redact(S0, C.human);
      if (C.pending && C.pending.type === "respond") {
        E.addResponse(c, C.human, a, {});
        E.resolveClause(c);
      } else E.apply(c, a, { block: () => null, respond: null });
      const out = [];
      for (const p of [0, 1]) {
        const d = c.players[p].life - S0.players[p].life;
        if (d) out.push(`${p === C.human ? "Your" : "Rival"} life ${S0.players[p].life} \u2192 ${c.players[p].life}`);
      }
      for (const t of S0.things) {
        if (t.status.concealed && t.ctrl !== C.human) continue;
        const n = c.things.find((x) => x.id === t.id);
        if (!n) {
          out.push(`${thingName(S0, t.id)} leaves play`);
          continue;
        }
        if (n.damage > t.damage) out.push(`${thingName(S0, t.id)} takes ${n.damage - t.damage} (${Math.max(0, E.remainingOf(c, n))} left)`);
        if (n.damage < t.damage) out.push(`${thingName(S0, t.id)} heals ${t.damage - n.damage}`);
        for (const k of ["wet", "burning", "poison", "asleep", "frozen", "bound", "ward", "concealed", "named", "measured"]) if (!!n.status[k] !== !!t.status[k] || k === "poison" && n.status[k] !== t.status[k]) out.push(`${thingName(S0, t.id)}: ${k} ${n.status[k] ? typeof n.status[k] === "number" ? n.status[k] : "on" : "off"}`);
        if (n.ctrl !== t.ctrl) out.push(`${thingName(S0, t.id)} changes control`);
        if ((n.form || n.word) !== (t.form || t.word)) out.push(`${thingName(S0, t.id)} becomes ${nm(n.form || n.word)}`);
      }
      for (const n of c.things) if (!S0.things.some((t) => t.id === n.id)) out.push(`${n.ctrl === C.human ? "You gain" : "Rival gains"} ${nm(n.form || n.word)}${n.lineage ? " (made: Fresh and exhausted)" : ""}`);
      const me = C.human;
      if (c.players[me].spark !== S0.players[me].spark) out.push(`Your spark ${S0.players[me].spark} \u2192 ${c.players[me].spark}`);
      if (c.players[me].hand.length !== S0.players[me].hand.length) out.push(`Your hand ${S0.players[me].hand.length} \u2192 ${c.players[me].hand.length}`);
      {
        const f0 = S0.things.filter((t) => t.ctrl === me).length, f1 = c.things.filter((t) => t.ctrl === me).length;
        if (f0 !== f1) out.push(`Your field ${f0} \u2192 ${f1} of ${E.FORMAT ? E.FORMAT.slots : 5} places`);
      }
      for (const t of S0.things) {
        const n = c.things.find((x) => x.id === t.id);
        if (!n || t.status.concealed && t.ctrl !== me) continue;
        if (!t.shield3 && n.shield3) out.push(`${thingName(S0, t.id)}: shielded (next 3 damage prevented)`);
        if (!t.defOnly && n.defOnly) out.push(`${thingName(S0, t.id)}: ready to block only`);
        if (!t.g3 && n.g3) out.push(`${thingName(S0, t.id)}: Reach and +2 stand until your next Renew`);
        if (n.exhausted && !t.exhausted) out.push(`${thingName(S0, t.id)} becomes exhausted`);
      }
      if (c.over != null) out.push(c.over === me ? "You would win" : c.over === "draw" ? "Draw" : "You would lose");
      return out.length ? out : ["No visible change"];
    } catch (e) {
      return ["Prediction unavailable: " + e.message];
    }
  }
  function whyNot(kind, id) {
    const C = A.C, S = C.S;
    if (C.pending) return "Answer the current prompt first.";
    if (S.over != null) return "The match is over.";
    if (S.active !== C.human) return "It is the rival's turn.";
    if (kind === "card") {
      const c = S.players[C.human].hand.find((x) => x.pid === id);
      if (!c) return "";
      const d = BY_ID[c.word];
      const guess = { thing: "deploy", ground: "ground", quality: "quality", weather: "weather", burden: "burden", category: "spell", spell: "spell" }[d.type];
      if (d.type === "action") {
        const mine = S.things.filter((t) => t.ctrl === C.human);
        if (!mine.length) return `${nm(c.word)} needs a Thing of yours to say it, and you have none.`;
        const p = S.players[C.human];
        if (d.cost + (d.verb in { strike: 1, bite: 1, crush: 1, cut: 1 } ? 0 : 0) > p.breath) return `${nm(c.word)} costs ${d.cost} breath; you have ${p.breath}.`;
        return `${nm(c.word)} is said by one of your Things. ` + mine.map((t) => {
          const r2 = actorWhy(S, t);
          if (r2) return `${nm(t.form || t.word)} ${r2}`;
          if (!E.caps(S, t).has(d.verb)) return `${nm(t.form || t.word)} cannot ${d.verb} (it lacks that ability)`;
          return `${nm(t.form || t.word)} has no legal target for ${nm(c.word)} right now`;
        }).join("; ") + ".";
      }
      if (d.spell === "be") return "Be is only spoken as a Law: Category + Be + a Lawful Quality, all in hand and affordable.";
      const r = E.whyIllegal(S, { type: guess, card: c.pid });
      return r && r !== "not a legal sentence now" ? r : `${nm(c.word)} has no legal target or use right now.`;
    }
    if (kind === "thing") {
      const t = S.things.find((x) => x.id === id);
      if (!t) return "";
      if (t.ctrl !== C.human) return `Nothing you can do right now targets ${thingName(S, t.id)}.`;
      if (E.trait(S, t, "carrier")) {
        const hs = S.things.filter((h) => h.ctrl === C.human && E.trait(S, h, "pollination"));
        if (hs.length) return hs.map((h) => `${nm(h.form || h.word)}: ${E.pollinationWhy(S, t, h) || "can pollinate"}`).join("; ");
      }
      return thingWhy(S, t);
    }
    if (kind === "target") {
      const sel = selection();
      if (!sel.cands.length || !sel.next) return "";
      const hyp = { ...sel.cands[0], [sel.next]: id };
      return E.whyIllegal(S, hyp) || "Not a legal choice for this sentence.";
    }
    return "";
  }
  function actorWhy(S, t) {
    const st = t.status;
    if (st.asleep) return "is Asleep";
    if (st.frozen) return "is Frozen";
    if (st.bound) return "is Bound";
    if (t.fresh && !E.has(S, t, "swift")) return "arrived this turn (Fresh) and can act from your next turn";
    if (t.exhausted) return "is exhausted: it has already acted or blocked this turn";
    return null;
  }
  function naphthaHint(S, t) {
    if (!isCore() || card0(t) !== "fire.naphtha") return null;
    if (isThree()) {
      const vic = E.naphthaVictims(S, t).map((o) => thingName(S, o.id)), w = E.igniteWhy(S, t);
      const flare = vic.length ? `it flares for 3 damage to ${vic.join(" and ")} (the two oldest visible enemy Things), then is gone. No damage to the rival.` : "it flares, but no enemy Thing is in view to take the 3 damage.";
      if (t.ctrl !== A.C.human) return `Rival Naphtha: if they Ignite it (Kindle, Tinder or Burn), ${E.naphthaVictims(S, t).length ? "it deals 3 to " + E.naphthaVictims(S, t).map((o) => thingName(S, o.id)).join(" and ") : "it flares"}, then is gone. Wetting it (Dew) stops it.`;
      if (w) return `Naphtha cannot ignite now: ${w}. When it can, ${flare}`;
      const p2 = S.players[A.C.human], inHand = (x) => p2.hand.some((c) => c.word === x), tinder = S.things.some((o) => o.ctrl === A.C.human && E.card(o).id === "fire.tinder");
      const ways = [inHand("fire.kindle") && "Kindle from your hand (1 breath, also as a Response)", tinder && "your Tinder (1 breath, sacrifice it \u2014 makes an Ash)", inHand("fire.burn") && "Burn, said by a Burn-capable Thing"].filter(Boolean);
      return `Ignite it and ${flare} ` + (ways.length ? "You can light it with " + ways.join("; or ") + "." : "Nothing in your hand or field lights it now: Kindle, Tinder or Burn will.");
    }
    if (t.ctrl !== A.C.human) return "Rival Naphtha: if they Kindle it, it flares for 2 damage to each of your Things and 2 to you. Burn, Scorch or Crush can remove it first.";
    const p = S.players[A.C.human], k = (c) => c && c.word === "fire.kindle";
    const where = p.hand.some(k) ? S.active === A.C.human ? p.breath >= 1 ? "Kindle is in your hand: click Kindle, then this Naphtha (1 breath)." : "Kindle is in your hand, but you need 1 breath." : "Kindle is in your hand: as a Response, you can light it on the rival's turn with 1 reserve." : p.deck.some(k) ? "Kindle is still in your deck. Study (2 breath) or Herald can dig for it." : p.grave.some(k) ? "Your Kindle is in the grave \u2014 nothing else in this deck lights your own Naphtha." : "Your deck has no Kindle left \u2014 nothing else lights your own Naphtha.";
    return "Light it with Kindle: 2 damage to every enemy Thing and 2 to the rival, once. Wet does not stop it. " + where;
  }
  function thingWhy(S, t) {
    const p = S.players[A.C.human], n = nm(t.form || t.word), id = t.form || t.word;
    {
      const nh = naphthaHint(S, t);
      if (nh) return nh;
    }
    if (id === "token.fruit") {
      const r2 = actorWhy(S, t);
      if (r2) return `This Fruit ${r2}. (To spend it on Feast, choose Feast from your hand.)`;
      if (p.breath < 1) return "Eating a Fruit costs 1 breath; you have none left.";
      if (p.life >= 30 && !S.things.some((o) => o.ctrl === A.C.human && o.status.poison)) return "Eating a Fruit heals 2 life or cures 1 poison: your life is full and nothing of yours is poisoned. You can keep it to block, or spend it on Feast.";
    }
    const r = actorWhy(S, t);
    if (r) return `${n} ${r}.`;
    if (isCore()) return E.caps(S, t).has("strike") && E.curStrike(S, t) > 0 ? `${n} is ready. Attacks go at the rival together: press Attack and choose who joins. Attacking a Thing needs a word that says so (Bite, Crush, Scorch, Burn\u2026).` : `${n} does not attack (no strike). It can still block.`;
    if (!E.caps(S, t).has("strike")) return `${n} has no Body, so it cannot Strike.${E.card(t).ability ? "" : " It can still block."}`;
    if (p.breath < 1) return `A Strike costs 1 breath; you have none left.`;
    const w = E.whyIllegal(S, { type: "attack", subject: t.id, verb: "strike", target: "rival" });
    return w && w !== "not a legal sentence now" ? `${n}: ${w}.` : `${n} has no legal action right now.`;
  }
  var ICON = { str: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 1.5 6.2 8.3l1.5 1.5L14.5 3V1.5zM3 9.7l1.2-1.2 3.3 3.3L6.3 13l-1-1-2 2-1.3-1.3 2-2z" fill="currentColor"/></svg>', std: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2.5 3v4.3C2.5 11 5 13.6 8 15c3-1.4 5.5-4 5.5-7.7V3z" fill="currentColor"/></svg>' };
  function statusChips(S, t) {
    const st = t.status, out = [];
    if (t.exhausted) out.push(["Exhausted", "x"]);
    else if (t.fresh && !E.has(S, t, "swift")) out.push(["Fresh", "f"]);
    if (E.has(S, t, "guard")) out.push(["Guard", "k"]);
    if (E.has(S, t, "flying")) out.push(["Flying", "k"]);
    else if (E.has(S, t, "reach")) out.push(["Reach", "k"]);
    if (E.has(S, t, "heavy")) out.push(["Heavy", "k"]);
    if (E.has(S, t, "venomous")) out.push(["Venom", "k"]);
    if (st.burning) out.push(["Burning " + st.burning, "b"]);
    if (st.poison) out.push(["Poison " + st.poison, "b"]);
    if (st.wet) out.push(["Wet", "c"]);
    if (st.asleep) out.push(["Asleep", "b"]);
    if (st.frozen) out.push(["Frozen", "b"]);
    if (st.bound) out.push(["Bound", "b"]);
    if (st.ward) out.push(["Ward", "c"]);
    if (st.named) out.push(["Named", "c"]);
    if (st.measured) out.push(["Measured", "c"]);
    if (st.concealed) out.push(["Concealed", "c"]);
    if (t.ctrl !== t.owner) out.push(["Borrowed", "c"]);
    if (t.supply) out.push(["Supply space", "c"]);
    if (t.displaced) out.push(["Displaced", "b"]);
    if (S.rules && S.rules.modules && S.rules.modules.length) {
      const no = ["strike", "intercept", "retaliate"].filter((k) => !E.perm(S, t, k));
      if (no.length === 3) out.push(["No combat", "k"]);
      else if (no.length) out.push(["No " + no.join("/"), "k"]);
    }
    for (const q of t.quals || []) out.push([nm(q.word), "q"]);
    if (t.lawQual) out.push(["Law: " + nm(t.lawQual), "q"]);
    for (const [k, v] of Object.entries(t.counters || {})) if (v && k !== "age") out.push([`${k[0].toUpperCase() + k.slice(1)} ${v}`, "c"]);
    if (t.counters && t.counters.age) out.push(["Age " + t.counters.age, "c"]);
    return out.map(([l, k]) => `<span class="chip ${k}">${esc(l)}</span>`).join("");
  }
  var artKey = (id) => String(id).split(".").pop();
  function artWindow(id, name, text) {
    const s = schoolOf(id), k = artKey(id);
    if (text != null && A.view === "text") return `<div class="art s-${s} txt"><span class="rtx">${esc(text)}</span></div>`;
    if (ART.has(k)) return `<div class="art s-${s} pic"><img src="assets/art/${k}.webp" alt="" loading="lazy" decoding="async"></div>`;
    if (text != null) return `<div class="art s-${s} txt"><span class="rtx">${esc(text)}</span><span class="pending">art pending</span></div>`;
    return `<div class="art s-${s}"><span class="glyph" aria-hidden="true">${esc(name.slice(0, 1))}</span><span class="pending">art pending</span></div>`;
  }
  var rulesBox = (id) => A.view === "text" || !ART.has(artKey(id)) ? propLine(id) : textOf(id);
  function propLine(id) {
    const d = BY_ID[id];
    return d && d.props && d.props.length ? d.props.join(" \xB7 ") : d && d.kw ? d.kw.join(" \xB7 ") : "";
  }
  function thingCard(S, t, o = {}) {
    const hidden = t.status.concealed && t.ctrl !== A.C.human;
    const cls = ["card", "board", t.exhausted ? "exh" : "", o.hi ? "hi" : "", o.sel ? "sel" : "", o.dim ? "dim" : ""].join(" ");
    if (hidden) return `<button class="${cls} back" data-thing="${esc(t.id)}" aria-label="Concealed rival Thing"><span class="backmark">Concealed</span>${o.hi ? '<span class="pick">Choose</span>' : ""}</button>`;
    const id = t.form || t.word, d = E.card(t), s = d.school || "word";
    const rem = E.remainingOf(S, t), max = E.standOf(S, t);
    return `<button class="${cls}" data-thing="${esc(t.id)}" aria-label="${esc(nm(id))}, strike ${E.curStrike(S, t)}, stand ${rem} of ${max}${t.exhausted ? ", exhausted" : ""}">
    <img class="frame" src="assets/frames/short_${s}.webp" alt="">
    <span class="nm">${esc(nm(id))}</span><span class="gem">${d.made || d.token ? "" : d.cost}</span>
    ${artWindow(id, nm(id))}
    <span class="chips">${statusChips(S, t)}</span>
    <span class="stats"><span class="st s1">${ICON.str}${E.curStrike(S, t)}</span><span class="st s2${t.damage ? " hurt" : ""}">${ICON.std}${rem}/${max}</span></span>
    ${o.hi ? '<span class="pick">Choose</span>' : ""}
    <span class="info" data-inspect-thing="${esc(t.id)}" role="button" tabindex="0" aria-label="Inspect ${esc(nm(id))}">i</span>
  </button>`;
  }
  function handCard(S, c, o = {}) {
    const d = BY_ID[c.word], s = d.school;
    const typeLine = TYPE_NAME[d.type] + (d.r ? " \xB7 Response" : "") + (d.type === "thing" ? ` \xB7 ${d.strike}/${d.stand}` : d.type === "ground" ? ` \xB7 stand ${d.stand}` : "");
    const cls = ["card", "hand", o.hi ? "hi" : "", o.sel ? "sel" : "", o.dim ? "dim" : ""].join(" ");
    return `<button class="${cls}" data-card="${esc(c.pid)}" title="${esc(nm(c.word) + " \u2014 " + textOf(c.word))}" aria-label="${esc(nm(c.word))}, ${esc(typeLine)}, cost ${d.cost}. ${esc(textOf(c.word))}">
    <img class="frame" src="assets/frames/tall_${s}.webp" alt="">
    <span class="nm">${esc(nm(c.word))}</span><span class="gem">${d.cost}</span>
    ${artWindow(c.word, nm(c.word), textOf(c.word))}
    <span class="tl">${esc(typeLine)}</span><span class="rt${A.view !== "text" && ART.has(artKey(c.word)) ? " clamp" : ""}">${esc(rulesBox(c.word))}</span>
    ${o.hi ? '<span class="pick">Choose</span>' : ""}
    <span class="info" data-inspect-word="${esc(c.word)}" role="button" tabindex="0" aria-label="Inspect ${esc(nm(c.word))}">i</span>
  </button>`;
  }
  var root = () => document.getElementById("app");
  function render() {
    if (A.screen === "core") return renderCoreLobby();
    if (A.screen === "lobby") return renderLobby();
    if (A.screen === "editor") return renderEditor();
    if (A.screen === "fixtures") return renderFixtures();
    if (A.screen === "scenario") return renderScenario();
    renderMatch();
    if (A.inspect) renderInspect();
    if (A.modal) renderModal();
    driveBot();
  }
  function renderLobby() {
    const decks = allDecks(), groups = [...new Set(decks.map((d) => d.group))];
    const opts = (sel) => groups.map((g) => `<optgroup label="${esc(g)}">${decks.filter((d) => d.group === g).map((d) => `<option value="${esc(d.id)}"${d.id === sel ? " selected" : ""}>${esc(d.label)}</option>`).join("")}</optgroup>`).join("");
    const last = store.get("wa34.last");
    root().innerHTML = `<main class="lobby">
    <header class="lob-head"><p><button class="lnk" id="l-back">\u2190 Back to the game</button></p><h1>Developer tools</h1><p class="small">Not part of the game. Earlier research versions, seeds, replays, fixtures and the scenario editor.</p>${A.flash ? `<p class="flash">${esc(A.flash)}</p>` : ""}<p>${esc(VERSION)} \xB7 experimental rules <b>${esc(lobby.format)}</b>. Separate from the live game: nothing here touches your V28 collection.</p></header>
    <form id="lob" class="lob-grid">
      <label>Your deck<select id="l-mine">${opts(lobby.mine)}</select></label>
      <label>Rival deck<select id="l-theirs">${opts(lobby.theirs)}</select></label>
      <label>Rival skill<select id="l-tier">${TIERS.map((t) => `<option${t === lobby.tier ? " selected" : ""}>${t}</option>`).join("")}</select></label>
      <label>Rival style<select id="l-style">${["careful", "aggressive", "builder"].map((t) => `<option${t === lobby.style ? " selected" : ""}>${t}</option>`).join("")}</select></label>
      <label>Rival responses<select id="l-ra">${[["ra", "Response-aware (holds reserve, answers)"], ["", "Reference (rarely responds)"]].map(([v2, l]) => `<option value="${v2}"${v2 === lobby.ra ? " selected" : ""}>${l}</option>`).join("")}</select></label>
      <label>Your seat<select id="l-seat">${[["first", "You start"], ["second", "Rival starts"], ["random", "Seed decides"]].map(([v2, l]) => `<option value="${v2}"${v2 === lobby.seat ? " selected" : ""}>${l}</option>`).join("")}</select></label>
      <label>Seed<span class="inrow"><input id="l-seed" type="number" inputmode="numeric" value="${esc(lobby.seed)}"><button type="button" id="l-dice" class="ghost">New</button></span></label>
      <label class="wide">Rules version<select id="l-format">${FMT_GROUPS.map(([g, list]) => `<optgroup label="${esc(g)}">${list.map(([k, l]) => `<option value="${k}"${k === lobby.format ? " selected" : ""}>${esc(l)} \xB7 ${esc(F.resolveFormat(k).version)}</option>`).join("")}</optgroup>`).join("")}</select></label>
      <p class="wide small">For the market comparison, play the same decks and seed once with <b>Original market</b> and once with <b>Market at 3/4 spark</b>.</p>
      <div class="wide btns"><button type="button" id="l-start" class="go">Start match</button>
      ${last ? `<button type="button" id="l-resume">Resume last match${last.result != null ? " (finished \u2014 review)" : ""}</button>` : ""}
      <button type="button" id="l-editor">Deck editor</button><button type="button" id="l-fix">Scenario fixtures</button><button type="button" id="l-scen">Scenario editor</button><button type="button" id="l-load">Load a replay</button></div>
    </form>
    <section class="lob-decks"><h2>${esc(deckById(lobby.mine).label)}</h2><p class="dl">${deckById(lobby.mine).words.map((w) => `<span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}`).join(" ")}</p>
    <h2>${esc(deckById(lobby.theirs).label)}</h2><p class="dl">${deckById(lobby.theirs).words.map((w) => `<span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}`).join(" ")}</p></section>
  </main>`;
    const upd = () => {
      Object.assign(lobby, { mine: v("l-mine"), theirs: v("l-theirs"), tier: v("l-tier"), style: v("l-style"), seat: v("l-seat"), seed: +v("l-seed") || 1, format: v("l-format"), ra: v("l-ra") });
      store.set("wa34.lobby", lobby);
    };
    const v = (id) => document.getElementById(id).value;
    for (const id of ["l-mine", "l-theirs", "l-tier", "l-style", "l-ra", "l-seat", "l-seed", "l-format"]) document.getElementById(id).addEventListener("change", () => {
      upd();
      if (id === "l-mine" || id === "l-theirs") renderLobby();
    });
    document.getElementById("l-back").onclick = () => {
      A.screen = "core";
      render();
    };
    document.getElementById("l-dice").onclick = () => {
      document.getElementById("l-seed").value = 1 + Math.floor(Math.random() * 99999);
      upd();
    };
    document.getElementById("lob").onsubmit = (e) => {
      e.preventDefault();
    };
    document.getElementById("l-start").onclick = () => {
      upd();
      startMatch();
    };
    document.getElementById("l-editor").onclick = () => {
      A.screen = "editor";
      A.ed = A.ed || { words: deckById(lobby.mine).words.slice(), name: "My test deck", filter: "all", q: "" };
      render();
    };
    document.getElementById("l-fix").onclick = () => {
      A.screen = "fixtures";
      render();
    };
    document.getElementById("l-scen").onclick = () => {
      A.scen = A.scen || store.get("wa34.scenario") || SC.blank();
      A.screen = "scenario";
      render();
    };
    document.getElementById("l-load").onclick = () => {
      A.screen = "match";
      A.modal = { kind: "load" };
      if (!A.C) {
        A.screen = "lobby";
      }
      render();
      if (!A.C) renderModalOver();
    };
    if (last) document.getElementById("l-resume").onclick = () => resumeFrom(last, last.result != null);
  }
  var core = Object.assign({ mine: "orchard", theirs: "furnace", skill: "journeyman", seat: "random" }, store.get("wa34.core") || {});
  var SKILL = [["initiate", "Gentle", "Plays fair but misses things"], ["journeyman", "Steady", "Plays solidly, answers when it can"], ["expert", "Sharp", "Looks a turn ahead"]];
  function startCore() {
    stopBot();
    const seed = 1 + Math.floor(Math.random() * 99999);
    const first = core.seat === "first" ? 0 : core.seat === "second" ? 1 : seed % 2;
    const d1 = V33_DECKS[core.mine], d2 = V33_DECKS[core.theirs];
    const cfg = { format: CORE_FMT, decks: [d1.words, d2.words], deckNames: [d1.name, d2.name], seed, first, humanSide: 0, botPolicy: "careful:" + core.skill + ":ra" };
    A.cfg = cfg;
    A.C = createController(cfg, hooks);
    A.sel = null;
    A.why = null;
    A.review = null;
    A.screen = "match";
    A.combat = null;
    A.exch = null;
    A.C.start();
    render();
  }
  function renderCoreLobby() {
    const last = store.get("wa34.last");
    const deckCard = (k, sel, name) => {
      const d = V33_DECKS[k];
      const sch = [...new Set(d.words.map((w) => schoolOf(w)))];
      return `<button class="deckpick${sel === k ? " on" : ""}" data-pick="${name}:${k}" aria-pressed="${sel === k}"><span class="dp-n">${esc(d.name)}</span><span class="dp-s">${sch.map((x) => `<span class="dot s-${x}"></span>${SCHOOL_NAME[x]}`).join(" ")}</span><span class="dp-p">${esc(d.pitch)}</span>${name === "mine" && d.plan ? `<span class="dp-plan"><b>Plan</b> ${esc(d.plan)}</span>` : ""}</button>`;
    };
    root().innerHTML = `<main class="lobby corelob">
    <header class="lob-head"><h1>Word Alchemy</h1><p class="sub">The Core Duel \xB7 three decks</p>${A.flash ? `<p class="flash">${esc(A.flash)}</p>` : ""}</header>
    <section><h2>Your deck</h2><div class="picks">${Object.keys(V33_DECKS).map((k) => deckCard(k, core.mine, "mine")).join("")}</div></section>
    <section><h2>Your opponent</h2><div class="picks">${Object.keys(V33_DECKS).map((k) => deckCard(k, core.theirs, "theirs")).join("")}</div>
      <div class="optrow"><span>Skill</span>${SKILL.map(([v, l, t]) => `<button class="seg${core.skill === v ? " on" : ""}" data-skill="${v}" title="${esc(t)}">${l}</button>`).join("")}
      <span>Who starts</span>${[["random", "Random"], ["first", "You"], ["second", "Opponent"]].map(([v, l]) => `<button class="seg${core.seat === v ? " on" : ""}" data-seat="${v}">${l}</button>`).join("")}</div></section>
    <div class="btns big"><button id="c-play" class="go">Play</button>${last && last.format === CORE_FMT && last.result == null ? '<button id="c-resume">Continue your match</button>' : ""}</div>
    <details class="howto"><summary>How to play (one minute)</summary><ul>
      <li>Win by bringing the rival from 30 life to 0. Each turn you get breath (shown large under your side). Words cost breath.</li>
      <li>Bring forth Things, lay a Ground, speak Spells and Actions. Each word does exactly what it says.</li>
      <li><b>Attack</b> once per turn, for free: choose any of your ready Things. They all go at the rival and become exhausted, so they cannot block on the rival's turn. The rival chooses blockers.</li>
      <li>Attacks never pick a Thing. To hit a Thing you need a word that says so \u2014 Bite, Crush, Scorch, Burn, Calcine, Gust\u2026</li>
      <li><b>Study</b>: 2 breath, once per turn, draw a word. With a full hand (7) Study becomes an <b>exchange</b>: discard one word, then draw one.</li>
      <li>Click any card's <b>i</b> to see what it can become, what it needs, and why something is not possible now.</li>
      <li>Words marked Response can be spoken on the rival's turn using reserve (breath you kept).</li>
    </ul></details>
    <p class="devlink"><button class="lnk" id="c-dev">Developer tools</button> <small>${esc(VERSION)}</small></p>
  </main>`;
    const save2 = () => store.set("wa34.core", core);
    for (const b of document.querySelectorAll("[data-pick]")) b.onclick = () => {
      const [w, k] = b.dataset.pick.split(":");
      core[w] = k;
      save2();
      render();
    };
    for (const b of document.querySelectorAll("[data-skill]")) b.onclick = () => {
      core.skill = b.dataset.skill;
      save2();
      render();
    };
    for (const b of document.querySelectorAll("[data-seat]")) b.onclick = () => {
      core.seat = b.dataset.seat;
      save2();
      render();
    };
    document.getElementById("c-play").onclick = startCore;
    const rs = document.getElementById("c-resume");
    if (rs) rs.onclick = () => resumeFrom(last, false);
    document.getElementById("c-dev").onclick = () => {
      A.screen = "lobby";
      A.flash = null;
      render();
    };
  }
  function renderModalOver() {
    A.modal = { kind: "load" };
    renderModal();
  }
  function resumeFrom(rep, review) {
    stopBot();
    try {
      const cfg = { format: rep.format, decks: rep.decks, seed: rep.seed, first: rep.first, humanSide: rep.humanSide || 0, botPolicy: rep.botPolicy, deckNames: rep.deckNames || ["", ""], fixture: rep.scenario ? SC.asFixture(rep.scenario) : rep.fixture ? FIXTURES[rep.fixture] : null };
      A.cfg = cfg;
      A.C = restoreController(rep, hooks, FIXRES());
      A.review = review ? { rep, k: A.C.restoredActs, total: A.C.totalActs } : null;
      A.screen = "match";
      A.sel = null;
      A.modal = null;
      render();
    } catch (e) {
      A.flash = "Could not load that replay: " + e.message;
      A.screen = "lobby";
      render();
    }
  }
  function reviewTo(k) {
    const rep = A.review.rep;
    k = Math.max(0, Math.min(A.review.total, k));
    A.C = restoreController(rep, hooks, FIXRES(), k);
    A.review.k = A.C.restoredActs;
    render();
  }
  function infoStrip(S, side) {
    const p = S.players[side], me = side === A.C.human;
    const it = (label, val, extra = "") => `<span class="pip${extra}"><b>${esc(val)}</b><small>${esc(label)}</small></span>`;
    return `<div class="strip ${me ? "me" : "them"}${S.active === side ? " active" : ""}" data-rival="${me ? "" : "rival"}">
    <span class="who">${me ? "You" : "Rival"}${S.first === side ? " \xB7 started" : ""}${S.active === side && S.over == null ? " \xB7 to act" : ""}</span>
    <button class="life${me ? "" : " tgt"}" data-target="${me ? "self" : "rival"}" aria-label="${me ? "Your" : "Rival"} life ${p.life}"><b>${p.life}</b><small>life</small></button>
    ${isCore() ? breathBlock(S, p, me) + it("catalyst", p.catalyst + " (fixed)") : it("breath", p.breath) + it("reserve", p.reserve) + it("spark", p.spark + "/5") + it("catalyst", p.catalyst)}
    ${it("hand", p.hand.length)}${it("deck", p.deck.length)}
    <button class="pip lnk" data-zone="grave:${side}"><b>${p.grave.length}</b><small>grave</small></button><button class="pip lnk" data-zone="sealed:${side}"><b>${p.sealed.length}</b><small>sealed</small></button>
    ${p.poison ? it("poison", p.poison, " bad") : ""}${p.burden ? `<span class="pip bad"><b>${esc(nm(p.burden.word))}</b><small>burden \xD7${p.burden.ticks}</small></span>` : ""}
    ${p.fatigue ? it("fatigue", p.fatigue, " bad") : ""}<span class="schools">${p.schools.map((s) => `<span class="dot s-${s}" title="${SCHOOL_NAME[s]}"></span>${SCHOOL_NAME[s]}`).join(" ")}</span>
  </div>`;
  }
  function breathBlock(S, p, me) {
    const pend = A.pendingCost && me ? A.pendingCost : 0, n = p.breath;
    const pips = Array.from({ length: Math.max(n, 1) }, (_, k) => `<i class="bp${k >= n - pend && k < n ? " spend" : ""}${n === 0 ? " none" : ""}"></i>`).join("");
    return `<span class="breath" aria-label="${me ? "Your" : "Rival"} breath ${n}, reserve ${p.reserve}"><b>${n}</b><span class="bl">breath</span><span class="bpips">${pips}</span><span class="rsv">reserve <b>${p.reserve}</b></span></span>`;
  }
  function groundSlot(S, side, hiSet) {
    const g = S.players[side].ground, me = side === A.C.human;
    if (!g) return `<div class="slot ground empty"><span>Ground</span></div>`;
    const d = BY_ID[g.word];
    const hi = me && hiSet.has("ground") || !me && hiSet.has("ground") && !me;
    return `<button class="slot ground card board${hi ? " hi" : ""}" data-ground="${side}"><img class="frame" src="assets/frames/short_${d.school}.webp" alt=""><span class="nm">${esc(nm(g.word))}</span><span class="gem">${d.cost}</span>${artWindow(g.word, nm(g.word))}<span class="stats"><span class="st s2${g.damage ? " hurt" : ""}">${ICON.std}${d.stand - (g.damage || 0)}/${d.stand}</span></span>${hi ? '<span class="pick">Choose</span>' : ""}<span class="info" data-inspect-word="${esc(g.word)}" role="button" tabindex="0" aria-label="Inspect ${esc(nm(g.word))}">i</span></button>`;
  }
  function row(S, side, sel, hiSet) {
    const things = S.things.filter((t) => t.ctrl === side);
    const slots = [];
    const gen = E.capGeneral(S), sup = E.capSupply(S);
    const ordered = things.filter((t) => !t.supply).concat(things.filter((t) => t.supply));
    for (let k = 0; k < gen + sup; k++) {
      const t = ordered[k], isSup = k >= gen;
      if (!t) {
        slots.push(`<div class="slot empty${isSup ? " supply" : ""}"><span>${isSup ? "Supply space \u2014 stock and products only" : "Empty space"}</span></div>`);
        continue;
      }
      const isSel = A.sel && A.sel.anchor && A.sel.anchor.kind === "thing" && A.sel.anchor.id === t.id;
      const fixedVals = A.sel ? Object.values(A.sel.fixed) : [];
      slots.push(`<div class="slot">${thingCard(S, t, { hi: hiSet.has(t.id), sel: isSel || fixedVals.includes(J(t.id)) })}</div>`);
    }
    return `<div class="row ${side === A.C.human ? "mine" : "theirs"}">${groundSlot(S, side, side === A.C.human ? hiSet : new Set(hiSet.has("ground") && A.sel && A.sel.anchor && A.sel.anchor.kind !== "vessel" && A.sel.anchor.kind !== "ground" ? ["ground"] : []))}${slots.join("")}</div>`;
  }
  function renderMatch() {
    const C = A.C, S = C.state();
    if (!S) {
      root().innerHTML = '<main class="lobby"><p>Starting\u2026</p></main>';
      if (C.pending) renderPromptOnly();
      return;
    }
    const me = C.human, them = 1 - me;
    for (const t of S.things) if (!(t.status.concealed && t.ctrl !== me)) A.names[t.id] = nm(t.form || t.word) + (t.ctrl === me ? "" : " (rival)");
    const sel = selection(), hiSet = boardTargets(sel);
    if (A.combat && C.S && C.S.active === C.human) {
      for (const a of E.legalActions(C.S)) if (a.type === "combat") for (const id of a.attackers) hiSet.add(id);
    }
    if (C.pending && C.pending.type === "block") for (const id of C.pending.candidates) hiSet.add(id);
    if (C.pending && C.pending.type === "decide" && ["poisonTarget", "waterGround"].includes(C.pending.kind)) for (const id of C.pending.options) hiSet.add(id);
    const handHi = /* @__PURE__ */ new Set();
    if (A.exch) {
      for (const a of E.legalActions(S)) if (a.type === "study" && a.discard) handHi.add(a.discard);
    } else for (const a of sel.all) {
      if (a.card) handHi.add(a.card);
      if (a.category) handHi.add(a.category);
      if (a.qual) handHi.add(a.qual);
    }
    const vesselN = sel.all.filter((a) => a.type === "fuse").length;
    const fmt = F.resolveFormat(A.cfg.format);
    root().innerHTML = `<div class="match">
  <header class="top">
    <button class="ghost" id="m-lobby">Lobby</button>
    <span class="title">${isCore() ? "The Core Duel" : "Developer match"} <small>${esc(A.cfg.fixture ? "Fixture: " + A.cfg.fixture.title : (A.cfg.deckNames || []).join(" vs "))}</small></span>
    <span class="meta">${isCore() ? "" : esc(A.cfg.format) + " " + esc(fmt.version) + " \xB7 seed " + esc(A.cfg.seed) + " \xB7 "}round ${S.round}${A.review ? " \xB7 reviewing" : ""}</span>
    <label class="tog">Cards <select id="m-view"><option value="art"${A.view !== "text" ? " selected" : ""}>Art</option><option value="text"${A.view === "text" ? " selected" : ""}>Large text</option></select></label>
    <label class="tog"><input type="checkbox" id="m-autopass"${C.auto.passAll ? " checked" : ""}> Auto-pass my responses</label>
    <label class="tog">Rival speed <select id="m-speed">${[[250, "fast"], [600, "normal"], [1100, "slow"]].map(([v, l]) => `<option value="${v}"${A.speed === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
    <button class="ghost" id="m-export">Export replay</button><button class="ghost" id="m-rematch">${isCore() ? "New match" : "Rematch"}</button>${isCore() ? "" : '<button class="ghost" id="m-swap">Swap seats</button>'}
  </header>
  ${A.review ? `<div class="reviewbar"><button id="rv-0">Start</button><button id="rv-p">Back</button><span>Action ${A.review.k} of ${A.review.total}</span><button id="rv-n">Forward</button><button id="rv-e">End</button>${A.C.S.over == null ? '<button id="rv-play" class="go">Play on from here</button>' : ""}</div>` : ""}
  <div class="main">
    <section class="board" aria-label="Board">
      ${infoStrip(S, them)}
      <div class="hand theirs">${S.players[them].hand.map(() => '<span class="cardback" aria-hidden="true"></span>').join("")}<span class="sr">${S.players[them].hand.length} cards in the rival's hand</span></div>
      ${row(S, them, sel, hiSet)}
      <div class="mid">${centre(S)}</div>
      ${row(S, me, sel, hiSet)}
      ${infoStrip(S, me)}
      <div class="hand mine">${S.players[me].hand.map((c) => handCard(S, c, { hi: handHi.has(c.pid) && !A.sel && !(A.exch && A.exch.pick), sel: A.sel && A.sel.anchor && A.sel.anchor.id === c.pid || A.exch && A.exch.pick === c.pid, dim: !handHi.has(c.pid) && !C.pending })).join("") || '<span class="empty">Your hand is empty.</span>'}</div>
    </section>
    <aside class="side">
      <div class="panel act" aria-live="polite">${actionPanel(S, sel, vesselN)}</div>
      ${isCore() ? "" : `<div class="panel market"><h3>Market</h3>${marketHTML(S, sel)}</div>`}
      <div class="panel chron"><h3>Chronicle</h3>${chronicleHTML()}</div>
    </aside>
  </div></div>`;
    bindMatch();
  }
  function renderPromptOnly() {
    if (A.C.pending && A.C.pending.type === "mulligan") {
      A.modal = null;
      root().innerHTML = `<div class="match"><div class="main"><section class="board">${mulliganHTML()}</section></div></div>`;
      bindMatch();
    }
  }
  function centre(S) {
    const bits = [];
    if (S.sky) bits.push(`<span class="weather s-${schoolOf(S.sky.word)}"><b>Weather: ${esc(nm(S.sky.word))}</b> <small>called by ${who(S.sky.caster)}, ends at their turn ${S.sky.until}</small> <button class="lnk" data-inspect-word="${esc(S.sky.word)}">Read</button></span>`);
    if (S.law) bits.push(`<span class="weather"><b>Law: every ${esc(S.law.category)} has ${esc(nm(S.law.qual))}</b> <small>by ${who(S.law.caster)}, ends at their turn ${S.law.until}</small></span>`);
    if (S.clause && S.clause.nodes.length) {
      bits.push(`<div class="clause"><b>Pending sentence${S.clause.nodes.length > 1 ? "s \u2014 resolve last to first" : ""}</b><ol>${S.clause.nodes.map((n, k) => `<li class="${n.side === A.C.human ? "me" : "them"}"><span>${k === 0 ? "Declared" : k === 1 ? "Response" : "Answer"} \xB7 ${who(n.side)}:</span> ${esc(describe(S, n.act, n.side))}${n.act.type === "attack" ? ` <small>${n.blocker ? "blocked by " + esc(thingName(S, n.blocker)) : n.retaliates ? "target will strike back" : "unblocked"}</small>` : ""}${n.cancelled ? ' <small class="bad">cancelled</small>' : ""}</li>`).join("")}</ol></div>`);
    }
    for (const pr of (S.processes || []).filter((x) => x.open || x.closedTurn === S.turn)) {
      const own = pr.owner === A.C.human, ready = S.players[pr.owner].personalTurn >= pr.earliest;
      bits.push(`<div class="clause proc"><b>${own ? "Your" : "Rival"} process: ${pr.family === "bear" ? "Bear (a crop)" : "Shape (a Setting)"}</b> <small>${pr.open ? ready ? "can complete now" : "completes at " + (own ? "your" : "its") + " next turn" : pr.closed}</small>
      <div>Bound: ${pr.inputs.map((x) => esc(thingName(S, x.id))).join(", ")}. Breaks if any of these leaves play, changes controller or changes form.</div></div>`);
    }
    for (const inv of S.invites || []) bits.push(`<span class="weather"><b>${who(inv.owner)} ${inv.kind === "orchard" ? "opened " + esc(thingName(S, inv.host)) + " to visiting Bees" : "lent heat (" + esc(nm(S.players[inv.owner].ground ? S.players[inv.owner].ground.word : "")) + ")"}</b> <small>until ${inv.owner === A.C.human ? "your" : "its"} next Renew \xB7 ${inv.kind === "heat" ? "1 breath + 1 spark fee to the host" : "1 breath; the Fruit is the host's"}</small></span>`);
    for (const p of S.players) if (p.invitePlan) bits.push(`<span class="weather"><small>${who(p.i)} will ${p.invitePlan.kind === "orchard" ? "open an orchard" : "lend heat"} at End</small></span>`);
    for (const cl of (S.claims || []).filter((x) => x.open || x.closedTurn === S.turn)) bits.push(`<div class="clause proc"><b>${cl.owner === A.C.human ? "Your" : "Rival"} work in progress: the World Tree (W5)</b> <small>${cl.open ? "completes at the start of " + (cl.owner === A.C.human ? "your" : "its") + " next Main if it still holds" : cl.closed || ""}</small><div>Breaks if ${esc(thingName(S, cl.tree))} or ${esc(thingName(S, cl.ben))} leaves play, changes controller, or the beneficiary loses its Growth. Life loss is checked first.</div></div>`);
    if (S.over != null) bits.push(`<span class="result">${S.over === A.C.human ? "You win" : S.over === "draw" ? "Draw" : "The rival wins"}${S.overCause === "work" ? " by the World Tree work" : ""} \u2014 round ${S.round}</span>`);
    if (!bits.length) bits.push(`<span class="turn">${S.active === A.C.human ? "Your turn" : "Rival's turn"} \xB7 round ${S.round}</span>`);
    return bits.join("");
  }
  function actionPanel(S, sel, vesselN) {
    const C = A.C;
    const flash = A.flash ? `<p class="flash">${esc(A.flash)}</p>` : "";
    if (A.review) return `<h3>Review</h3><p>Step through the recorded actions with the bar above. "Play on" continues as yourself from this point.</p>`;
    if (C.pending) return flash + promptHTML(S, sel);
    if (S.over != null) return flash + summaryHTML(S);
    if (S.active !== C.human) return flash + `<h3>Rival is thinking\u2026</h3><p>${A.botTimer ? "Its next sentence follows shortly." : ""}</p>`;
    const p = S.players[C.human];
    if (isCore() && A.combat) return flash + combatHTML(S);
    if (isCore() && A.exch) return flash + exchangeHTML(S);
    if (isCore() && !A.sel) {
      const all = E.legalActions(S), elig = [...new Set(all.filter((a) => a.type === "combat").flatMap((a) => a.attackers))], canStudy = all.some((a) => a.type === "study" && !a.discard), canEx = all.some((a) => a.type === "study" && a.discard), sw = studyWhy(S);
      const used = S.players[C.human].combatTurn === S.players[C.human].personalTurn;
      return flash + `<h3>Your turn</h3>
      <p>Click a highlighted word in your hand or one of your Things. ${A.why ? `<span class="why">${esc(A.why)}</span>` : ""}</p>
      <div class="btns col"><button id="a-attack"${elig.length ? "" : " disabled"}>Attack the rival \u2014 free${elig.length ? ` (${elig.length} ready)` : used ? " (done this turn)" : " (no one ready)"}</button>
      ${canEx ? `<button id="a-exch">Study \u2014 exchange \xB7 2 breath: discard 1, draw 1 \xB7 ${p.deck.length} in deck</button>` : `<button id="a-study"${canStudy ? "" : " disabled"}>Study \u2014 draw 1 \xB7 2 breath \xB7 ${p.deck.length} in deck</button>${!canStudy && sw ? `<small class="why">${esc(sw)}</small>` : ""}`}
      <button id="a-vessel"${vesselN ? "" : " disabled"}>Vessel \u2014 fuse${vesselN ? ` (${vesselN})` : ""}</button>
      <button id="a-end" class="go">End turn${p.breath ? ` \u2014 keep ${Math.min(S.rules.reserveCap, p.breath)} as reserve` : ""}</button></div>`;
    }
    if (!A.sel) {
      return flash + `<h3>Your turn</h3>
      <p>Choose a highlighted word in your hand, one of your Things, a market offer or the Vessel. ${A.why ? `<span class="why">${esc(A.why)}</span>` : ""}</p>
      <div class="btns"><button id="a-vessel"${vesselN ? "" : " disabled"}>Vessel \u2014 fuse${vesselN ? ` (${vesselN})` : ""}</button>${sel.all.some((a) => a.type === "catalyst") ? '<button id="a-cat">Refill catalyst</button>' : ""}
      <button id="a-end" class="go">End turn${p.breath ? ` \u2014 keep ${Math.min(S.rules.reserveCap, p.breath)} reserve` : ""}</button><button id="a-diag">Why not? (diagnostics)</button></div>
      ${vesselN ? "" : '<p class="small">Vessel: no recipe has two ready, owned ingredients with at least one mature Thing, affordable now.</p>'}`;
    }
    return flash + builderHTML(S, sel, false);
  }
  function combatHTML(S) {
    const all = E.legalActions(S).filter((a) => a.type === "combat"), elig = [...new Set(all.flatMap((a) => a.attackers))];
    const chosen = elig.filter((id) => A.combat.has(id)), tot = chosen.reduce((n, id) => n + E.curStrike(S, S.things.find((t) => t.id === id)), 0);
    const foes = S.things.filter((t) => t.ctrl !== A.C.human && !t.exhausted && !E.incapacitated(t));
    return `<h3>Attack the rival</h3><p>Choose who joins \u2014 click your highlighted Things or tick below. Attacking is free; every attacker becomes exhausted and cannot block on the rival's turn.</p>
    <ul class="atk">${elig.map((id) => {
      const t = S.things.find((x) => x.id === id);
      return `<li><label><input type="checkbox" data-atk="${id}"${A.combat.has(id) ? " checked" : ""}> ${esc(thingName(S, id))} <small>${E.curStrike(S, t)} strike${E.has(S, t, "flying") ? " \xB7 flying" : ""}</small></label></li>`;
    }).join("")}</ul>
    <p class="cost">Up to <b>${tot}</b> damage to the rival if nothing blocks. The rival has ${foes.length} ready Thing${foes.length === 1 ? "" : "s"} that may block (one blocker per attacker; fliers can only be blocked by Flying or Reach).</p>
    <div class="btns"><button id="c-all">Everyone</button><button id="c-go" class="go"${chosen.length ? "" : " disabled"}>Attack with ${chosen.length}</button><button id="a-cancel">Cancel</button></div>`;
  }
  function builderHTML(S, sel, inPrompt) {
    const fixed = Object.entries(A.sel.fixed).map(([k, v]) => `<li><span>${esc(KEY_LABEL[k] || k)}</span> ${esc(valueLabel(S, k, JSON.parse(v)))}</li>`).join("");
    const anchor = A.sel.anchor;
    const head = anchor ? anchor.kind === "card" ? nm(cardWord(S, anchor.id)) : anchor.kind === "thing" ? thingName(S, anchor.id) : anchor.kind === "foe" ? "Ways to act on " + thingName(S, anchor.id) : anchor.kind === "vessel" ? "The Vessel" : anchor.kind === "market" ? "Market offer" : anchor.kind === "ground" ? "Your Ground" : "" : "";
    const aw = anchor && anchor.kind === "card" ? cardWord(S, anchor.id) : anchor && anchor.kind === "thing" ? (S.things.find((t) => t.id === anchor.id) || {}).form || (S.things.find((t) => t.id === anchor.id) || {}).word : null;
    const reader = aw && BY_ID[aw] ? `<p class="reader">${esc(textOf(aw))}</p>` : "";
    if (!sel.cands.length) return `<h3>${esc(head)}</h3>${reader}<p class="why">${esc(A.why || "Nothing legal to do with this now.")}</p><div class="btns"><button id="a-cancel">Back</button></div>`;
    let body = "";
    if (sel.next) {
      body = `<p class="step">${esc(KEY_LABEL[sel.next] || sel.next)}${boardTargets(sel).size ? " \u2014 click a highlighted card or choose below" : ""}</p>
      <div class="choices">${sel.choices.map((v) => `<button data-choose="${esc(J(v))}">${esc(sel.next === "type" ? valueLabel(S, "type", v) + " \u2014 " + describe(S, sel.cands.find((a) => J(a.type) === J(v))) : valueLabel(S, sel.next, v))}</button>`).join("")}</div>
      ${A.why ? `<p class="why">${esc(A.why)}</p>` : ""}`;
    } else {
      const a = sel.cands[0];
      const cst = costOf(S, a) || "none", nb = /^(\d+) breath/.exec(cst), pB = S.players[A.C.human];
      body = `<p class="sentence">${esc(describe(S, a))}</p><p class="cost">Cost: <b>${esc(cst)}</b>${nb && !inPrompt ? ` \xB7 you will have <b>${pB.breath - +nb[1]}</b> breath left` : ""}${nb && inPrompt && / reserve/.test(cst) ? "" : ""}</p>
      <div class="pred"><b>If ${inPrompt ? "nothing else answers" : "unblocked and unanswered"}:</b><ul>${predict(a).map((x) => `<li>${esc(x)}</li>`).join("")}</ul><small>A legal declaration is not a guaranteed outcome: blocks, responses and revalidation can change it.</small></div>
      <div class="btns"><button id="a-confirm" class="go">${inPrompt ? "Respond" : "Declare"}</button></div>`;
    }
    return `<h3>${esc(head)}</h3>${reader}${fixed ? `<ul class="fixed">${fixed}</ul>` : ""}${body}<div class="btns"><button id="a-cancel">Back</button></div>`;
  }
  function promptHTML(S, sel) {
    const q = A.C.pending;
    if (q.type === "mulligan") return mulliganHTML();
    if (q.type === "block") {
      const att = S.things.find((t) => t.id === q.attacker);
      const tgt = q.target === "rival" ? "you" : q.target === "ground" ? "your Ground" : thingName(S, q.target);
      const dmg = att ? E.curStrike(S, att) + (q.bonus || 0) : "?";
      const others = S.things.filter((t) => t.ctrl === A.C.human && !q.candidates.includes(t.id));
      return `<h3>Block?</h3>${q.group ? `<p class="small">Attacker ${q.group.index + 1} of ${q.group.of} \xB7 ${q.group.incoming} damage still coming in total \xB7 each of your Things can block once</p>` : ""}<p><b>${esc(att ? thingName(S, att.id) : "An attacker")}</b> attacks ${esc(tgt)} with ${esc(q.verb)} for ${dmg}. Choose a blocker before any response. A blocker exhausts now and still strikes back.</p>
      <div class="choices">${q.candidates.map((id) => {
        const b = S.things.find((t) => t.id === id);
        return `<button data-block="${esc(id)}">${esc(thingName(S, id))} \u2014 ${E.curStrike(S, b)} strike, ${E.remainingOf(S, b)} stand left</button>`;
      }).join("")}<button data-block="null">No block</button></div>
      ${others.length ? `<p class="small">Cannot block: ${others.map((t) => esc(nm(t.form || t.word)) + " (" + esc(blockReason(S, t, att, q)) + ")").join("; ")}.</p>` : ""}`;
    }
    if (q.type === "respond") {
      const r = S.players[A.C.human];
      const head = q.kind === "response" ? `<h3>Respond?</h3><p>Pay from reserve (${r.reserve}). One response, then the attacker may answer once.</p>` : `<h3>Answer?</h3><p>The rival responded. You may answer once, paying from breath (${r.breath}).</p>`;
      if (A.sel) return head + builderHTML(S, sel, true);
      return head + `<div class="choices">${q.options.map((a, k) => `<button data-respond="${k}">${esc(describe(S, a))} \xB7 ${esc(costOf(S, a))}</button>`).join("")}<button data-respond="pass" class="go">Pass</button></div>`;
    }
    if (q.type === "decide") {
      const lbl = (o) => {
        if (q.kind === "reorder") return "Top: " + o.map(nm).join(", then ");
        if (Array.isArray(o)) return o.map(nm).join(", ");
        if (S.things.some((t) => t.id === o)) return thingName(S, o);
        if (BY_ID[o]) return nm(o);
        return { draw: "Draw 1", breath: "1 extra breath", spark: "Pay 1 spark", life: "Lose 1 life", none: "Reveal nothing" }[o] || String(o);
      };
      const title = { poisonTarget: "Choose who takes the poison", select: "Choose a word to take", reorder: "Order the top of your deck", silence: "Choose a word to discard from the rival's revealed hand", stoneUpkeep: "Philosopher's Stone", waterGround: "Water Ground: choose a friendly Thing to make Wet and heal 1", debt: "Debt: pay", owlReveal: "Owl: reveal a Concealed Thing?", rustBranch: "Rust: regress to" }[q.kind] || q.kind;
      return `<h3>${esc(title)}</h3><div class="choices">${q.options.map((o, k) => `<button data-decide="${k}"${k === q.dflt ? ' class="go"' : ""}>${esc(lbl(o))}</button>`).join("")}</div>`;
    }
    return "";
  }
  function blockReason(S, b, att, q) {
    if (b.exhausted) return "exhausted";
    if (E.incapacitated(b)) return "cannot act";
    if (q.target !== "rival" && !E.has(S, b, "guard")) return "needs Guard to protect another";
    if (att && E.has(S, att, "flying") && !E.has(S, b, "flying") && !E.has(S, b, "reach")) return "the attacker flies; needs Flying or Reach";
    if (b.id === q.target) return "it is the target";
    return "not eligible";
  }
  function mulliganHTML() {
    const q = A.C.pending;
    A.mull = A.mull || /* @__PURE__ */ new Set();
    return `<div class="mull"><h2>Opening hand</h2><p>Choose any words to set aside. You draw that many replacements; the set-aside words shuffle back into your deck. One mulligan only.</p>
    <div class="hand mine">${q.hand.map((c) => `<span class="mwrap${A.mull.has(c.pid) ? " out" : ""}">${handCard({}, c, { sel: A.mull.has(c.pid) }).replace("data-card=", "data-mull=")}</span>`).join("")}</div>
    <div class="btns"><button id="mu-keep" class="go">${A.mull.size ? `Set aside ${A.mull.size} and draw` : "Keep this hand"}</button></div></div>`;
  }
  function marketHTML(S, sel) {
    if (!S.market.length) return '<p class="small">No market in this mode.</p>';
    const buys = new Set(sel.all.filter((a) => a.type === "buy").map((a) => a.slot));
    const p = S.players[A.C.human];
    return `<ul class="mkt">${S.market.map((o, k) => o ? `<li><span class="dot s-${schoolOf(o.word)}"></span><button class="lnk" data-inspect-word="${esc(o.word)}">${esc(nm(o.word))}</button><small>${esc(TYPE_NAME[BY_ID[o.word].type])} \xB7 ${BY_ID[o.word].cost}</small><span class="price">${E.priceOf(S, p.i, o.word)} spark</span>${buys.has(k) ? `<button data-buy="${k}">Buy</button>` : ""}</li>` : `<li class="emptyo">Empty until the next market step</li>`).join("")}</ul>
    <p class="small">Own school 2 spark, other schools 3 (once per duel). One purchase or catalyst refill per turn. Refresh at rounds 3, 6, 9, 12, 15.</p>`;
  }
  function prettify(line) {
    const me = A.C.human;
    return line.replace(/\b(fire|water|air|earth|life|rot|word|made|token)\.[a-z_]+/g, (m) => nm(m)).replace(/\bP([01])\b/g, (m, d) => +d === me ? "You" : "Rival").replace(/\bYou (is|has|[a-z]+?)(?=[ .,:;!]|$)/g, (m, v) => "You " + (v === "is" ? "are" : v === "has" ? "have" : /(ch|sh|ss|x)es$/.test(v) ? v.slice(0, -2) : /[^s]s$/.test(v) ? v.slice(0, -1) : v)).replace(/\bt\d+\b/g, (m) => A.names[m] || "a Thing");
  }
  function chronicleHTML() {
    const ch = A.C.chronicle.slice(-60).reverse();
    if (!ch.length) return '<p class="small">Sentences and their results appear here.</p>';
    const S = A.C.state();
    return `<ol class="chron">${ch.map((e) => `<li class="${e.actor === A.C.human ? "me" : "them"}"><span class="when">R${e.round}</span> <b>${who(e.actor)}</b>: ${esc(e.act.type === "pass" ? "ends the turn" : describe(S, e.act, e.actor))}
    ${e.lines.length ? `<div class="lines">${e.lines.map((l) => `<span>${esc(prettify(l))}</span>`).join("")}</div>` : ""}
    ${(e.events || []).filter((x) => x.type === "failed" || x.type === "cancelled" || x.type === "ward" || x.type === "rebirth").map((x) => `<span class="bad">${esc({ failed: "A sentence failed on revalidation (target or subject gone); costs stay paid.", cancelled: "A sentence was cancelled.", ward: "Ward absorbed a hostile effect.", rebirth: "Phoenix was reborn." }[x.type])}</span>`).join("")}
    ${e.packets.length ? `<details><summary>Damage arithmetic</summary>${e.packets.map((p) => `<div>${esc(p.verb)} \u2192 ${p.to}: ${p.steps.map((s) => esc(s[0]) + " " + s[1]).join(", ")} = <b>${p.n}</b></div>`).join("")}</details>` : ""}</li>`).join("")}</ol>`;
  }
  function summaryHTML(S) {
    const me = A.C.human, res = S.stats.res;
    const lost = (i) => Object.entries(res[i].lifeLost).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ") || "none";
    const t = res.map((r) => r);
    return `<h3>${S.over === me ? "You win" : S.over === "draw" ? "Draw" : "The rival wins"}</h3>
    <p>Round ${S.round}, ${S.turn} turns. ${esc(A.cfg.format)}, seed ${esc(A.cfg.seed)}.</p>
    <table class="sum"><thead><tr><th></th><th>You</th><th>Rival</th></tr></thead><tbody>
    <tr><td>Life lost to</td><td>${esc(lost(me))}</td><td>${esc(lost(1 - me))}</td></tr>
    <tr><td>Breath spent / wasted</td><td>${t[me].breathSpent} / ${t[me].breathWasted}</td><td>${t[1 - me].breathSpent} / ${t[1 - me].breathWasted}</td></tr>
    <tr><td>Reserve kept / used</td><td>${t[me].reserveKept} / ${t[me].reserveUsed}</td><td>${t[1 - me].reserveKept} / ${t[1 - me].reserveUsed}</td></tr>
    ${isCore() ? "" : "<tr><td>Spark gained / spent</td><td>" + t[me].sparkGained + " / " + t[me].sparkSpent + "</td><td>" + t[1 - me].sparkGained + " / " + t[1 - me].sparkSpent + "</td></tr>"}
    <tr><td>Drawn / bought</td><td>${t[me].drawn} / ${t[me].bought}</td><td>${t[1 - me].drawn} / ${t[1 - me].bought}</td></tr>
    </tbody></table>
    <div class="btns"><button id="s-rematch" class="go">${isCore() ? "Play another" : "Rematch"}</button>${isCore() ? "" : '<button id="s-swap">Swap seats</button>'}<button id="s-export">Export replay</button><button id="s-lobby">Lobby</button></div>`;
  }
  function renderInspect() {
    const S = A.C ? A.C.state() : null, x = A.inspect;
    let t = null, word = x.word;
    if (x.thing && S) {
      t = S.things.find((q) => q.id === x.thing);
      if (t) word = t.form || t.word;
    }
    if (!word || !BY_ID[word]) {
      A.inspect = null;
      return;
    }
    const d = BY_ID[word], s = d.school;
    let detail = `<p><b>${esc(SCHOOL_NAME[s] || s)}</b> \xB7 ${esc(TYPE_NAME[d.type] || d.type)}${d.r ? " \xB7 Response" : ""}${d.made ? " \xB7 made form" : d.token ? " \xB7 token" : ` \xB7 cost ${d.cost}`}${d.type === "thing" ? ` \xB7 printed ${d.strike}/${d.stand}` : d.type === "ground" ? ` \xB7 stand ${d.stand}` : ""}</p>
    <p class="rules">${esc(textOf(word))}</p>`;
    if (d.props && d.props.length) detail += `<p><b>Properties</b> ${esc(d.props.join(", "))}</p>`;
    if (d.kw && d.kw.length) detail += `<p><b>Keywords</b> ${esc(d.kw.join(", "))}</p>`;
    if (t) {
      const m = E.modsOf(t), base = d.strike, cur = E.curStrike(S, t);
      const parts = [["printed", base], ["infusions, Qualities, Law", m.strike], ["Might", t.counters.might || 0], ["this turn", t.tempStrike || 0]].filter((p) => p[1]);
      const other = cur - parts.reduce((a, p) => a + p[1], 0) + (parts.find((p) => p[0] === "printed") ? 0 : base);
      const sp = [["printed", d.stand], ["infusions, Qualities, Law", m.stand], ["Bedrock", t.counters.bedrock || 0], ["Growth", t.counters.growth || 0], ["this turn", t.tempStand || 0]].filter((p) => p[1]);
      detail += `<h4>Now</h4><p><b>Strike ${cur}</b> = ${parts.map((p) => `${p[0]} ${p[1]}`).join(" + ")}${other && other !== base ? ` + other ${other - (parts.length ? 0 : base)}` : ""}</p>
      <p><b>Stand ${E.remainingOf(S, t)} of ${E.standOf(S, t)}</b> = ${sp.map((p) => `${p[0]} ${p[1]}`).join(" + ")}, minus ${t.damage} marked damage</p>
      <p><b>Capabilities</b> ${esc([...E.caps(S, t)].join(", ") || "none")}</p>
      <p><b>Keywords now</b> ${esc([...E.kws(S, t)].join(", ") || "none")}</p>
      <p><b>Status</b> ${statusChips(S, t) || "none"}</p>
      <p><b>Owner</b> ${who(t.owner)} \xB7 <b>controller</b> ${who(t.ctrl)}${t.word !== (t.form || t.word) ? ` \xB7 printed word ${esc(nm(t.word))}` : ""}</p>
      ${(t.quals || []).length ? `<p><b>Attached</b> ${t.quals.map((q) => `${esc(nm(q.word))}: ${esc(textOf(q.word))}`).join(" \xB7 ")}</p>` : ""}
      ${relationsHTML(S, t)}
      ${t.lineage ? `<p><b>Lineage</b> ${esc(lineageText(t.lineage))}. If destroyed: one death; originals go to their owners' Graves. If bounced: dissolves to Grave without a death.</p>` : ""}`;
    }
    const html = `<div class="scrim" id="in-close"></div><div class="inspect" role="dialog" aria-label="Inspect ${esc(nm(word))}">
    <div class="bigcard"><img class="frame" src="assets/frames/tall_${s}.webp" alt=""><span class="nm">${esc(nm(word))}</span><span class="gem">${d.made || d.token ? "" : d.cost}</span>${artWindow(word, nm(word), textOf(word))}<span class="tl">${esc(TYPE_NAME[d.type] || "")}${d.type === "thing" ? ` \xB7 ${d.strike}/${d.stand}` : ""}</span><span class="rt">${esc(propLine(word))}</span></div>
    <div class="detail"><h2>${esc(nm(word))}</h2>${detail}<p class="small">Artwork is pending: the frame and the data are current; old art is not an authority for printed stats.</p><div class="btns"><button id="in-x" class="go">Close</button></div></div></div>`;
    const el = document.createElement("div");
    el.className = "overlay";
    el.innerHTML = html;
    document.body.appendChild(el);
    const close = () => {
      A.inspect = null;
      el.remove();
    };
    el.querySelector("#in-close").onclick = close;
    el.querySelector("#in-x").onclick = close;
    el.querySelector("#in-x").focus();
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }
  function relationsHTML(S, t) {
    const mods = S.rules.modules || [];
    if (!mods.length) return "";
    const mine = S.things.filter((o) => o.ctrl === t.ctrl && o !== t), out = [];
    {
      const nh = naphthaHint(S, t);
      if (nh) out.push(nh);
    }
    const ch = E.trait(S, t, "carrier"), want = E.trait(S, t, "pollination");
    if (ch) for (const h of mine.filter((o) => E.trait(S, o, "pollination"))) {
      const w = E.pollinationWhy(S, t, h);
      out.push(`${nm(t.form || t.word)} \u2192 ${nm(h.form || h.word)}: ${w ? "no \u2014 " + w : "yes, can pollinate now"}`);
    }
    if (want) {
      out.push(`${nm(t.form || t.word)} is ${want}-pollinated (${want === "insect" ? "a Bee" : "a Wind"} carries its pollen).`);
      for (const c of mine.filter((o) => E.trait(S, o, "carrier"))) {
        const w = E.pollinationWhy(S, c, t);
        out.push(`${nm(c.form || c.word)} \u2192 this tree: ${w ? "no \u2014 " + w : "yes"}`);
      }
    }
    if (mods.includes("workshop") && /copper|silver|lead|tin|iron/.test(card0(t))) {
      const w = E.shapeWhy(S, t.ctrl, t);
      out.push(`Work into a Setting: ${w ? "no \u2014 " + w : "yes (Shape, or Smith)"}`);
    }
    if (card0(t) === "earth.setting") out.push(`Setting worked from ${nm(t.word)}. Set it with a Garnet in the Vessel to make a Signet.`);
    if (mods.includes("three")) {
      const id = card0(t), me = t.ctrl === A.C.human;
      if (me && E.SHAPE3[id]) for (const to of E.SHAPE3[id]) {
        const w = E.shape3Why(S, t.ctrl, t, to);
        out.push(`Shape into ${nm(to)}: ${w ? "no \u2014 " + w : "yes, with Shape (2 breath)"}`);
      }
      if (E.prop(t, "flammable") && id !== "fire.naphtha") {
        const w = E.igniteWhy(S, t);
        out.push(`Ignite: ${w ? "no \u2014 " + w : "can be Ignited now (Kindle on your own, Tinder or Burn)"}`);
      }
      if (me && ["life.pear", "life.apple", "life.sapling", "life.hazel"].includes(id)) {
        const p = S.players[t.ctrl];
        out.push(p.fusedTurn === p.personalTurn ? "Graft: no \u2014 you have already used the Vessel this turn." : "Graft (2 breath): a Pear or Apple + your Sapling or another fruit tree become an Espalier (frees a place).");
      }
      if (id === "earth.signet3") out.push("Seal gives another friendly Thing Ward; a Signet cannot Ward itself. Or exhaust it to stamp Writ.");
      if (t.shield3) out.push(`Shielded by Clay: the next ${t.shield3} damage is prevented.`);
      if (t.defOnly) out.push("Readied by Feast for defence only: it can block, but cannot attack, act, carry or fuse until your next Renew.");
      if (t.g3) out.push("Guarded: Reach and +2 stand until its controller's next Renew. When that ends, damage beyond its stand destroys it.");
    }
    if (t.cropOf) out.push("Crop of the tree " + thingName(S, t.cropOf) + ".");
    if (t.visitedBy) out.push("Made by a visiting Bee \u2014 the Fruit belongs to the host.");
    if (mods.includes("visit") || mods.includes("visit_draw")) {
      if (t.ctrl === A.C.human && E.trait(S, t, "pollination") === "insect") {
        const w = E.invitationWhy(S, t.ctrl, "orchard", t.id);
        out.push(`Open to visitors: ${w ? "no \u2014 " + w : "yes (free, opens at your End)"}`);
      }
      if (t.ctrl === A.C.human && card0(t) === "life.bee") for (const h of S.things.filter((o) => o.ctrl !== t.ctrl && E.trait(S, o, "pollination"))) {
        const w = E.visitWhy(S, t.ctrl, t, h);
        out.push(`Visit ${nm(h.form || h.word)}: ${w ? "no \u2014 " + w : "yes"}`);
      }
    }
    if (mods.includes("heat") && t.ctrl === A.C.human && /copper|silver/.test(card0(t))) {
      const w = E.hotworkWhy(S, t.ctrl, t);
      out.push(`Borrow the rival's heat: ${w ? "no \u2014 " + w : "yes"}`);
    }
    if (mods.includes("w5") && card0(t) === "made.world_tree") {
      out.push(`Grown from Swamp and Life: ${E.w5Chain(t) ? "yes" : "no"}. Gave Growth to: ${(t.wtGrants || []).map((x) => thingName(S, x)).join(", ") || "nobody yet"}.`);
      if (t.ctrl === A.C.human) for (const b of S.things.filter((o) => o.ctrl === t.ctrl && o !== t && E.prop(o, "living"))) {
        const w = E.w5Why(S, t.ctrl, t, b);
        out.push(`Declare the work with ${nm(b.form || b.word)}: ${w ? "no \u2014 " + w : "yes"}`);
      }
    }
    {
      const pw = E.permWhy(S, t);
      if (pw) out.push(pw[0].toUpperCase() + pw.slice(1) + ". Durability and targeting are unchanged.");
    }
    if (t.supply) out.push("In the supply space (stock and products only).");
    if (t.displaced) out.push("Displaced: it changed into something the supply space cannot hold and no general space is free, so it cannot act until one is.");
    return out.length ? `<h4>Relationships</h4><ul class="rel">${out.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  }
  var card0 = (t) => t.form || t.word;
  function lineageText(recs) {
    return recs.map((r) => r.token ? nm(r.token) + " (token)" : r.ground ? nm(r.word) + " (Ground)" : r.made ? nm(r.form) + " [" + lineageText(r.lineage || []) + "]" : r.form && r.form !== r.word ? nm(r.form) + " (worked from " + nm(r.word) + ")" : nm(r.word)).join(" + ");
  }
  function renderModal() {
    const m = A.modal;
    let html = "";
    if (m.kind === "export") {
      const rep = A.C.replay();
      rep.deckNames = A.cfg.deckNames;
      rep.exportedBy = VERSION;
      html = `<h2>Replay and debug bundle</h2><p>Local test mode only: it contains both decks, the seed and every input. Copy it and save it as a .json file, or paste it into "Load a replay" later.</p>
      <textarea id="ex-t" rows="12" readonly>${esc(JSON.stringify(rep))}</textarea><div class="btns"><button id="ex-copy" class="go">Copy</button><button id="mo-x">Close</button></div><p id="ex-msg" class="small"></p>`;
    }
    if (m.kind === "load") html = `<h2>Load a replay</h2><p>Paste an exported replay, or choose its file.</p><textarea id="ld-t" rows="10" placeholder="{&quot;format&quot;:\u2026}"></textarea><input type="file" id="ld-f" accept=".json,application/json"><div class="btns"><button id="ld-review" class="go">Review from the start</button><button id="ld-resume">Resume at the end</button><button id="mo-x">Close</button></div><p id="ld-msg" class="small"></p>`;
    if (m.kind === "diag") {
      const S = A.C.S;
      let d;
      try {
        d = DG.diagnose(S, (side) => side === A.C.human ? "builder:planner" : "careful:journeyman");
      } catch (e) {
        d = { rows: [], note: "Diagnostics failed: " + e.message };
      }
      const L = { best: "Best", inferior: "Strategically inferior", unaffordable: "Unaffordable", "too slow": "Too slow", unavailable: "Unavailable" };
      html = `<h2>Why not? \u2014 this position</h2><p class="small">From what you can see only (the rival's hand and both decks hidden). The bounded planner tries the strongest openings, finishes your turn greedily, lets the rival pass, and values your next Main minus the rival's visible threat. A heuristic, not a verdict.</p>
      ${d.best ? `<p><b>Planner's line:</b> ${esc(describe(S, d.best.act))}${d.best.line.length ? ", then " + d.best.line.map((a) => esc(describe(S, a))).join(", then ") : ""}. Rival threat afterwards: ${d.best.threat}.</p>` : ""}
      <table class="sum diag"><thead><tr><th>Interaction</th><th>Status</th><th>Why</th></tr></thead><tbody>${d.rows.map((r) => `<tr><td>${esc(r.family)}</td><td class="st-${r.status.replace(" ", "")}">${esc(L[r.status])}</td><td>${esc(r.detail)}</td></tr>`).join("")}</tbody></table>${d.note ? `<p>${esc(d.note)}</p>` : ""}
      <div class="btns"><button id="mo-x" class="go">Close</button></div>`;
    }
    if (m.kind === "zone") {
      const S = A.C.state(), [z, side] = m.zone.split(":");
      const list = S.players[+side][z];
      html = `<h2>${who(+side)} \u2014 ${z === "grave" ? "Grave" : "Sealed"} (${list.length})</h2><ul class="zl">${list.map((c) => `<li><span class="dot s-${schoolOf(c.word)}"></span><button class="lnk" data-inspect-word="${esc(c.word)}">${esc(nm(c.word))}</button>${c.reason ? `<small>${esc(c.reason)}</small>` : ""}</li>`).join("") || "<li>Empty</li>"}</ul><div class="btns"><button id="mo-x" class="go">Close</button></div>`;
    }
    const el = document.createElement("div");
    el.className = "overlay";
    el.innerHTML = `<div class="scrim"></div><div class="modal" role="dialog">${html}</div>`;
    document.body.appendChild(el);
    const close = () => {
      A.modal = null;
      el.remove();
    };
    el.querySelector(".scrim").onclick = close;
    const x = el.querySelector("#mo-x");
    if (x) x.onclick = close;
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    for (const b of el.querySelectorAll("[data-inspect-word]")) b.onclick = () => {
      A.inspect = { word: b.dataset.inspectWord };
      renderInspect();
    };
    if (m.kind === "export") el.querySelector("#ex-copy").onclick = async () => {
      const t = el.querySelector("#ex-t");
      try {
        await navigator.clipboard.writeText(t.value);
        el.querySelector("#ex-msg").textContent = "Copied.";
      } catch (e) {
        t.select();
        el.querySelector("#ex-msg").textContent = "Copy was refused here: the text is selected, press Ctrl+C or Cmd+C.";
      }
    };
    if (m.kind === "load") {
      const go = (review) => {
        let rep;
        try {
          rep = JSON.parse(el.querySelector("#ld-t").value);
        } catch (e) {
          el.querySelector("#ld-msg").textContent = "That is not valid JSON.";
          return;
        }
        close();
        resumeFrom(rep, review);
      };
      el.querySelector("#ld-review").onclick = () => {
        go(true);
        if (A.review) reviewTo(0);
      };
      el.querySelector("#ld-resume").onclick = () => go(false);
      el.querySelector("#ld-f").onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        f.text().then((t) => {
          el.querySelector("#ld-t").value = t;
        });
      };
    }
  }
  function bindMatch() {
    const C = A.C, on = (id, f) => {
      const e = document.getElementById(id);
      if (e) e.onclick = f;
    };
    on("m-lobby", () => {
      stopBot();
      store.set("wa34.left", true);
      A.screen = isCore() ? "core" : "lobby";
      A.sel = null;
      A.combat = null;
      render();
    });
    on("m-export", () => {
      A.modal = { kind: "export" };
      renderModal();
    });
    on("s-export", () => {
      A.modal = { kind: "export" };
      renderModal();
    });
    const rematch = (swap) => {
      if (isCore()) return startCore();
      stopBot();
      const cfg = { ...A.cfg };
      if (swap) cfg.first = 1 - cfg.first;
      if (cfg.fixture) return startFixture(cfg.fixture.id, cfg.fixture);
      A.C = createController(cfg, hooks);
      A.cfg = cfg;
      A.sel = null;
      A.review = null;
      A.C.start();
      render();
    };
    on("m-rematch", () => rematch(false));
    on("s-rematch", () => rematch(false));
    on("m-swap", () => rematch(true));
    on("s-swap", () => rematch(true));
    on("s-lobby", () => {
      stopBot();
      A.screen = isCore() ? "core" : "lobby";
      render();
    });
    const ap = document.getElementById("m-autopass");
    if (ap) ap.onchange = () => {
      C.auto.passAll = ap.checked;
    };
    const vw = document.getElementById("m-view");
    if (vw) vw.onchange = () => {
      A.view = vw.value;
      store.set("wa34.view", A.view);
      render();
    };
    const sp = document.getElementById("m-speed");
    if (sp) sp.onchange = () => {
      A.speed = +sp.value;
    };
    if (A.review) {
      on("rv-0", () => reviewTo(0));
      on("rv-p", () => reviewTo(A.review.k - 1));
      on("rv-n", () => reviewTo(A.review.k + 1));
      on("rv-e", () => reviewTo(A.review.total));
      on("rv-play", () => {
        A.review = null;
        render();
      });
    }
    on("a-end", () => {
      A.flash = null;
      A.why = null;
      C.act({ type: "pass" });
    });
    on("a-attack", () => {
      A.combat = /* @__PURE__ */ new Set();
      A.sel = null;
      A.why = null;
      render();
    });
    on("a-study", () => {
      A.flash = null;
      C.act({ type: "study" });
    });
    on("a-exch", () => {
      A.flash = null;
      A.why = null;
      A.sel = null;
      A.exch = {};
      render();
    });
    on("x-go", () => {
      const pick = A.exch && A.exch.pick;
      A.exch = null;
      const act = E.legalActions(C.S).find((a) => a.type === "study" && a.discard === pick);
      if (act) C.act(act);
      else render();
    });
    on("x-back", () => {
      A.exch = null;
      render();
    });
    on("c-all", () => {
      for (const a of E.legalActions(C.S)) if (a.type === "combat") for (const id of a.attackers) A.combat.add(id);
      render();
    });
    on("c-go", () => {
      const elig = [...new Set(E.legalActions(C.S).filter((a) => a.type === "combat").flatMap((a) => a.attackers))];
      const ids = elig.filter((id) => A.combat.has(id));
      const act = E.legalActions(C.S).find((a) => a.type === "combat" && J(a.attackers) === J(ids));
      A.combat = null;
      if (act) C.act(act);
    });
    for (const b of document.querySelectorAll("[data-atk]")) b.onchange = () => {
      b.checked ? A.combat.add(b.dataset.atk) : A.combat.delete(b.dataset.atk);
      render();
    };
    on("a-diag", () => {
      A.modal = { kind: "diag" };
      renderModal();
    });
    on("a-vessel", () => {
      A.sel = { anchor: { kind: "vessel" }, fixed: {} };
      A.why = null;
      render();
    });
    on("a-cat", () => {
      A.sel = { anchor: { kind: "catalyst" }, fixed: {} };
      render();
    });
    on("a-cancel", () => {
      A.sel = null;
      A.why = null;
      A.combat = null;
      render();
    });
    on("a-confirm", () => {
      const sel = selection();
      if (sel.cands.length !== 1) return;
      const a = sel.cands[0];
      A.sel = null;
      A.why = null;
      A.flash = null;
      if (C.pending && C.pending.type === "respond") C.answer(a);
      else C.act(a);
    });
    on("mu-keep", () => {
      const v = [...A.mull || []];
      A.mull = null;
      C.answer(v);
      render();
    });
    for (const b of document.querySelectorAll("[data-mull]")) b.onclick = (e) => {
      if (e.target.closest("[data-inspect-word]")) return;
      const pid = b.dataset.mull;
      A.mull = A.mull || /* @__PURE__ */ new Set();
      A.mull.has(pid) ? A.mull.delete(pid) : A.mull.add(pid);
      renderPromptOnly();
      if (A.C.S) render();
    };
    for (const b of document.querySelectorAll("[data-choose]")) b.onclick = () => choose(JSON.parse(b.dataset.choose));
    for (const b of document.querySelectorAll("[data-block]")) b.onclick = () => C.answer(b.dataset.block === "null" ? null : b.dataset.block);
    for (const b of document.querySelectorAll("[data-respond]")) b.onclick = () => {
      const k = b.dataset.respond;
      if (k === "pass") return C.answer(null);
      A.sel = { anchor: null, fixed: {} };
      const o = C.pending.options[+k];
      for (const key of KEYS) if (o[key] !== void 0) A.sel.fixed[key] = J(o[key]);
      render();
    };
    for (const b of document.querySelectorAll("[data-decide]")) b.onclick = () => C.answer(+b.dataset.decide);
    for (const b of document.querySelectorAll("[data-buy]")) b.onclick = () => {
      A.sel = { anchor: { kind: "market", id: +b.dataset.buy }, fixed: {} };
      render();
    };
    for (const b of document.querySelectorAll("[data-zone]")) b.onclick = () => {
      A.modal = { kind: "zone", zone: b.dataset.zone };
      renderModal();
    };
    for (const b of document.querySelectorAll("[data-inspect-thing]")) b.onclick = (e) => {
      e.stopPropagation();
      A.inspect = { thing: b.dataset.inspectThing };
      renderInspect();
    };
    for (const b of document.querySelectorAll("[data-inspect-word]")) b.onclick = (e) => {
      e.stopPropagation();
      A.inspect = { word: b.dataset.inspectWord };
      renderInspect();
    };
    for (const b of document.querySelectorAll("[data-card]")) b.onclick = () => clickObj("card", b.dataset.card);
    for (const b of document.querySelectorAll("[data-thing]")) b.onclick = () => clickObj("thing", b.dataset.thing);
    for (const b of document.querySelectorAll("[data-ground]")) b.onclick = () => clickObj("ground", +b.dataset.ground);
    for (const b of document.querySelectorAll("[data-target]")) b.onclick = () => clickObj("target", b.dataset.target);
  }
  function choose(v) {
    const sel = selection();
    A.sel.fixed[sel.next] = J(v);
    A.why = null;
    render();
  }
  function clickObj(kind, id) {
    const C = A.C;
    if (A.review) return;
    const q = C.pending;
    if (q && q.type === "block") {
      if (q.candidates.includes(id)) C.answer(id);
      else if (kind === "thing") {
        A.why = "That Thing cannot block this attack.";
        render();
      }
      return;
    }
    if (q && q.type === "decide") {
      const k = q.options.indexOf(id);
      if (k >= 0) C.answer(k);
      return;
    }
    if (A.exch && kind === "card") {
      if (E.legalActions(C.S).some((a) => a.type === "study" && a.discard === id)) A.exch.pick = id;
      render();
      return;
    }
    if (A.combat && kind === "thing") {
      const ok = E.legalActions(C.S).some((a) => a.type === "combat" && a.attackers.includes(id));
      if (ok) {
        A.combat.has(id) ? A.combat.delete(id) : A.combat.add(id);
        render();
      } else {
        A.why = whyNot("thing", id);
        render();
      }
      return;
    }
    const sel = selection();
    if (A.sel && sel.next) {
      const val = kind === "ground" ? "ground" : id;
      const hit = sel.choices.find((v) => v === val || Array.isArray(v) && v.length === 1 && v[0] === val);
      if (hit !== void 0) return choose(hit);
      if (kind === "thing" || kind === "target" || kind === "ground") {
        A.why = whyNot("target", val);
        render();
        return;
      }
    }
    if (kind === "card") {
      const has = sel.all.some((a) => a.card === id || a.category === id || a.qual === id);
      A.sel = { anchor: { kind: "card", id }, fixed: {} };
      A.why = has ? null : whyNot("card", id);
      if (isCore() && has && !q) {
        const s2 = selection();
        if (s2.cands.length === 1 && ["deploy", "ground", "weather"].includes(s2.cands[0].type)) {
          const a = s2.cands[0];
          A.sel = null;
          C.act(a);
          return;
        }
      }
      render();
      return;
    }
    if (kind === "thing") {
      const t = C.state().things.find((x) => x.id === id);
      if (t && t.ctrl === C.human && !q) {
        const has = sel.all.some((a) => anchorMatch(a, { kind: "thing", id }));
        A.sel = { anchor: { kind: "thing", id }, fixed: {} };
        A.why = has ? null : whyNot("thing", id);
        render();
        return;
      }
      if (t && t.ctrl !== C.human && !q && sel.all.some((a) => anchorMatch(a, { kind: "foe", id }))) {
        A.sel = { anchor: { kind: "foe", id }, fixed: {} };
        A.why = null;
        render();
        return;
      }
      A.why = whyNot("thing", id);
      render();
      return;
    }
    if (kind === "ground" && id === C.human && !q) {
      A.sel = { anchor: { kind: "ground" }, fixed: {} };
      A.why = sel.all.some((a) => anchorMatch(a, { kind: "ground" })) ? null : "Your Ground can only be used as a fusion ingredient a recipe names.";
      render();
    }
  }
  function renderEditor() {
    const ed = A.ed;
    const errs = E.deckErrors(ed.words);
    const pool = CARDS.filter((c) => c.deckLegal && (ed.filter === "all" || c.school === ed.filter) && (!ed.q || nm(c.id).toLowerCase().includes(ed.q.toLowerCase())));
    root().innerHTML = `<main class="editor"><header class="top"><button class="ghost" id="ed-back">Lobby</button><span class="title">Deck editor <small>test catalogue of 150 words \u2014 not your real collection</small></span></header>
  <div class="ed-grid"><section><div class="row-f">${["all"].concat(SCHOOLS).map((s) => `<button class="fchip${ed.filter === s ? " on" : ""}" data-f="${s}">${s === "all" ? "All" : SCHOOL_NAME[s]}</button>`).join("")}<input id="ed-q" type="search" placeholder="Search words" value="${esc(ed.q)}"></div>
    <ul class="pool">${pool.map((c) => `<li><span class="dot s-${c.school}"></span><button class="lnk" data-inspect-word="${c.id}">${esc(nm(c.id))}</button><small>${TYPE_NAME[c.type]} ${c.cost}${c.type === "thing" ? ` \xB7 ${c.strike}/${c.stand}` : ""}</small><button data-add="${c.id}"${ed.words.includes(c.id) ? " disabled" : ""}>${ed.words.includes(c.id) ? "In deck" : "Add"}</button></li>`).join("")}</ul></section>
  <section class="deckcol"><label>Name<input id="ed-name" value="${esc(ed.name)}"></label><label>Start from<select id="ed-from"><option value="">\u2014</option>${allDecks().map((d) => `<option value="${esc(d.id)}">${esc(d.label)}</option>`).join("")}</select></label>
    <p class="${errs.length ? "bad" : "ok"}">${ed.words.length} / 20 words${errs.length ? " \u2014 " + esc(errs.join("; ")) : " \u2014 legal"}</p>
    <ul class="pool">${ed.words.map((w) => `<li><span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}<small>${TYPE_NAME[BY_ID[w].type]} ${BY_ID[w].cost}</small><button data-rem="${w}">Remove</button></li>`).join("")}</ul>
    <div class="btns"><button id="ed-save" class="go"${errs.length ? " disabled" : ""}>Save and use as my deck</button></div></section></div></main>`;
    const on = (id, f) => {
      document.getElementById(id).onclick = f;
    };
    on("ed-back", () => {
      A.screen = "lobby";
      render();
    });
    for (const b of document.querySelectorAll("[data-f]")) b.onclick = () => {
      ed.filter = b.dataset.f;
      render();
    };
    document.getElementById("ed-q").oninput = (e) => {
      ed.q = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const q = document.getElementById("ed-q");
      q.focus();
      q.setSelectionRange(pos, pos);
    };
    document.getElementById("ed-name").onchange = (e) => {
      ed.name = e.target.value || "My test deck";
    };
    document.getElementById("ed-from").onchange = (e) => {
      if (e.target.value) {
        ed.words = deckById(e.target.value).words.slice();
        render();
      }
    };
    for (const b of document.querySelectorAll("[data-add]")) b.onclick = () => {
      if (ed.words.length < 20) ed.words.push(b.dataset.add);
      render();
    };
    for (const b of document.querySelectorAll("[data-rem]")) b.onclick = () => {
      ed.words = ed.words.filter((w) => w !== b.dataset.rem);
      render();
    };
    for (const b of document.querySelectorAll("[data-inspect-word]")) b.onclick = () => {
      A.inspect = { word: b.dataset.inspectWord };
      renderInspect();
    };
    on("ed-save", () => {
      const c = store.get("wa34.custom") || {};
      c[ed.name] = ed.words.slice();
      store.set("wa34.custom", c);
      lobby.mine = "custom:" + ed.name;
      store.set("wa34.lobby", lobby);
      A.screen = "lobby";
      render();
    });
  }
  function renderFixtures() {
    root().innerHTML = `<main class="editor"><header class="top"><button class="ghost" id="fx-back">Lobby</button><span class="title">Scenario fixtures <small>constructed positions for testing one mechanic \u2014 not claimed reachable in a normal match</small></span></header>
    <ul class="fixtures">${Object.values(FIXTURES).map((f) => `<li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><button data-fx="${f.id}" class="go">Open fixture</button>${f.spec ? `<button data-fxed="${f.id}">Edit as scenario</button>` : ""}</li>`).join("")}</ul>
    <p class="small">Rival skill for fixtures: ${esc(lobby.tier)} (set it in the lobby).</p></main>`;
    document.getElementById("fx-back").onclick = () => {
      A.screen = "lobby";
      render();
    };
    for (const b of document.querySelectorAll("[data-fx]")) b.onclick = () => startFixture(b.dataset.fx);
    for (const b of document.querySelectorAll("[data-fxed]")) b.onclick = () => {
      A.scen = JSON.parse(JSON.stringify(FIXTURES[b.dataset.fxed].spec));
      A.screen = "scenario";
      render();
    };
  }
  var ALL_FMTS = FMT_GROUPS.flatMap(([, l]) => l.map((x) => x[0]));
  function renderScenario() {
    const sp = A.scen, v = SC.validate(sp), comp = SC.compatibility(sp, ALL_FMTS);
    const used = (i) => {
      const sd = sp.sides[i], u = new Set((sd.hand || []).concat(sd.grave || [], sd.deckTop || [], sd.ground ? [sd.ground] : []));
      for (const t of sd.field) {
        if (SC.TRANSFORMED[t.word]) u.add(SC.TRANSFORMED[t.word].from);
        else if (SC.MADE[t.word]) SC.ingredients(t.word).forEach((w) => u.add(w));
        else u.add(t.word);
      }
      return u;
    };
    const listOpts = (sel) => Object.entries(SC.LISTS).map(([k, l]) => `<option value="${esc(k)}"${k === sel ? " selected" : ""}>${esc(l.label)}</option>`).join("");
    const sideHTML = (i) => {
      const sd = sp.sides[i], words = SC.listWords(sd.list) || [], u = used(i), free = words.filter((w) => !u.has(w));
      const zone = (z, label, filt = () => true) => `<div class="sz"><h4>${label} <small>${(sd[z] || []).length}</small></h4><ol class="zl">${(sd[z] || []).map((w, k) => `<li><span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}${z === "deckTop" && k === 0 ? " <small>top</small>" : ""}<button class="lnk" data-sx="${i}:${z}:${k}:del">Remove</button></li>`).join("")}</ol>
      <select data-sadd="${i}:${z}"><option value="">Add\u2026</option>${free.filter(filt).map((w) => `<option value="${esc(w)}">${esc(nm(w))}</option>`).join("")}</select></div>`;
      const extra = Object.keys(SC.TOKENS).concat(Object.keys(SC.MADE), Object.keys(SC.TRANSFORMED));
      const field = `<div class="sz"><h4>Field <small>${sd.field.length} of ${E.capGeneral({ rules: { modules: (F.resolveFormat(sp.format).variant || {}).modules || [] } })}${E.capSupply({ rules: { modules: (F.resolveFormat(sp.format).variant || {}).modules || [] } }) ? " + 1 supply" : ""}</small></h4><ol class="zl">${sd.field.map((t, k) => `<li class="fld"><span class="dot s-${schoolOf(t.word)}"></span><b>${esc(nm(t.word))}</b>
        <label>damage <input type="number" min="0" max="9" value="${t.damage || 0}" data-sx="${i}:field:${k}:damage"></label>
        <label><input type="checkbox" data-sx="${i}:field:${k}:exhausted"${t.exhausted ? " checked" : ""}> exhausted</label><label><input type="checkbox" data-sx="${i}:field:${k}:fresh"${t.fresh ? " checked" : ""}> fresh</label>
        <label>Growth <input type="number" min="0" max="5" value="${(t.counters || {}).growth || 0}" data-sx="${i}:field:${k}:growth"></label>
        ${t.word === "made.world_tree" ? `<label>gave Growth to <select data-sx="${i}:field:${k}:grants"><option value="">nobody yet</option>${sd.field.map((o, j) => j !== k ? `<option value="${j}"${(t.grants || []).includes(j) ? " selected" : ""}>${esc(nm(o.word))} (#${j + 1})</option>` : "").join("")}</select></label>` : ""}
        <button class="lnk" data-sx="${i}:field:${k}:del">Remove</button></li>`).join("")}</ol>
      <select data-sadd="${i}:field"><option value="">Add a Thing\u2026</option><optgroup label="From this list">${free.filter((w) => BY_ID[w].type === "thing").map((w) => `<option value="${esc(w)}">${esc(nm(w))}</option>`).join("")}</optgroup><optgroup label="Tokens, made and worked forms">${extra.map((w) => `<option value="${esc(w)}">${esc(nm(w))}</option>`).join("")}</optgroup></select></div>`;
      const num = (k, lo, hi, l) => `<label>${l}<input type="number" min="${lo}" max="${hi}" value="${sd[k]}" data-sv="${i}:${k}"></label>`;
      const grounds = words.filter((w) => BY_ID[w].type === "ground" && (!u.has(w) || w === sd.ground));
      return `<section class="sside"><h3>${i === 0 ? "You" : "Rival"}${sp.active === i ? " \xB7 acts first" : ""}</h3>
      <label class="wide">Word list (the side's 20 cards)<select data-sv="${i}:list">${listOpts(sd.list)}</select></label>
      <div class="nums">${num("life", 1, 30, "Life")}${num("breath", 0, 10, "Breath")}${num("reserve", 0, 2, "Reserve")}${num("spark", 0, 5, "Spark")}</div>
      <label>Ground<select data-sv="${i}:ground"><option value="">none</option>${grounds.map((w) => `<option value="${esc(w)}"${w === sd.ground ? " selected" : ""}>${esc(nm(w))}</option>`).join("")}</select></label>
      ${field}${zone("hand", "Hand")}${zone("deckTop", "Top of deck (first = drawn first)")}${zone("grave", "Grave")}
      <label>Rest of the deck<select data-sv="${i}:deckRest"><option value="rest"${sd.deckRest !== "none" ? " selected" : ""}>every unplaced word, shuffled, below the top cards</option><option value="none"${sd.deckRest === "none" ? " selected" : ""}>only the top cards (the rest are set aside)</option></select></label>
      <p class="small">${free.length} words of this list are not placed${sd.deckRest === "none" ? " (set aside)" : " (they form the rest of the deck)"}.</p>
      <h4>Invitations already open</h4>
      ${sd.field.some((t) => t.word === "life.pear" || t.word === "life.hazel") ? `<label>Orchard open to visitors<select data-sinv="${i}:orchard"><option value="">closed</option>${sd.field.map((t, k) => t.word === "life.pear" ? `<option value="${k}"${(sp.invites || []).some((x) => x.kind === "orchard" && x.owner === i && x.host === k) ? " selected" : ""}>${esc(nm(t.word))} (#${k + 1})</option>` : "").join("")}</select></label>` : `<p class="small">No Pear on this side's field.</p>`}
      <label><input type="checkbox" data-sinv="${i}:heat"${(sp.invites || []).some((x) => x.kind === "heat" && x.owner === i) ? " checked" : ""}> Heat lent (needs Fire or Torch Ground)</label>
    </section>`;
    };
    root().innerHTML = `<main class="editor scen"><header class="top"><button class="ghost" id="sc-back">Lobby</button><span class="title">Scenario editor <small>constructed positions \u2014 built and checked by the engine's own rules</small></span></header>
    <div class="scgrid"><section class="smeta">
      <label class="wide">Title<input id="sc-title" value="${esc(sp.title)}"></label>
      <label class="wide">Note for the tester<textarea id="sc-text" rows="3">${esc(sp.text || "")}</textarea></label>
      <label class="wide">Rules version<select id="sc-format">${FMT_GROUPS.map(([g2, list]) => `<optgroup label="${esc(g2)}">${list.map(([k, l]) => {
      const c = comp.find((x) => x.id === k);
      return `<option value="${k}"${k === sp.format ? " selected" : ""}>${c && c.ok ? "" : "\u2715 "}${esc(l)}</option>`;
    }).join("")}</optgroup>`).join("")}</select></label>
      <label>Acts first<select id="sc-active"><option value="0"${sp.active === 0 ? " selected" : ""}>You</option><option value="1"${sp.active === 1 ? " selected" : ""}>Rival</option></select></label>
      <label>Market<select id="sc-market"><option value="empty"${sp.market === "empty" ? " selected" : ""}>Empty (keep the test about the mechanic)</option><option value="keep"${sp.market !== "empty" ? " selected" : ""}>Dealt from the seed</option></select></label>
      <label>Seed (deck order below the top cards)<input id="sc-seed" type="number" value="${esc(sp.seed || 7)}"></label>
      <div class="val ${v.errors.length ? "bad" : "ok"}"><b>${v.errors.length ? "Not legal yet" : "Legal position"}</b>${v.errors.length ? `<ul>${v.errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}${v.notes.length ? `<ul class="small">${v.notes.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}</div>
      <details><summary>Compatible rules versions (${comp.filter((c) => c.ok).length} of ${comp.length})</summary><ul class="small">${comp.map((c) => `<li>${c.ok ? "\u2713" : "\u2715"} ${esc(c.id)}${c.why ? " \u2014 " + esc(c.why) : ""}</li>`).join("")}</ul></details>
      <div class="btns"><button id="sc-play" class="go"${v.errors.length ? " disabled" : ""}>Play this position</button><button id="sc-save">Save</button><button id="sc-export">Export JSON</button><button id="sc-import">Import JSON</button><button id="sc-new">Blank</button></div>
      <p class="small">Replays of a scenario carry the whole position, so they always re-run. You play side "You"; the rival uses the lobby's skill and style.</p>
    </section>${sideHTML(0)}${sideHTML(1)}</div></main>`;
    const upd = () => {
      store.set("wa34.scenario", sp);
      render();
    };
    const g = (id) => document.getElementById(id);
    g("sc-back").onclick = () => {
      A.screen = "lobby";
      render();
    };
    g("sc-title").onchange = (e) => {
      sp.title = e.target.value;
      upd();
    };
    g("sc-text").onchange = (e) => {
      sp.text = e.target.value;
      upd();
    };
    g("sc-format").onchange = (e) => {
      const to = e.target.value, c = comp.find((x) => x.id === to);
      sp.format = to;
      A.flash = c && !c.ok ? "Switched \u2014 this position is not legal under " + to + ": " + c.why : null;
      upd();
    };
    g("sc-active").onchange = (e) => {
      sp.active = +e.target.value;
      upd();
    };
    g("sc-market").onchange = (e) => {
      sp.market = e.target.value;
      upd();
    };
    g("sc-seed").onchange = (e) => {
      sp.seed = +e.target.value || 7;
      upd();
    };
    g("sc-new").onclick = () => {
      A.scen = SC.blank(sp.format);
      upd();
    };
    g("sc-save").onclick = () => {
      store.set("wa34.scenario", sp);
      A.flash = "Saved in this browser.";
      render();
    };
    g("sc-play").onclick = () => {
      store.set("wa34.scenario", sp);
      startFixture("scenario", SC.asFixture(JSON.parse(JSON.stringify(sp))));
    };
    g("sc-export").onclick = () => {
      A.modal = { kind: "scexport" };
      renderScModal();
    };
    g("sc-import").onclick = () => {
      A.modal = { kind: "scimport" };
      renderScModal();
    };
    for (const el of document.querySelectorAll("[data-sv]")) el.onchange = () => {
      const [i, k] = el.dataset.sv.split(":");
      const sd = sp.sides[+i];
      if (k === "list") {
        Object.assign(sd, { list: el.value, field: [], hand: [], grave: [], deckTop: [], ground: null });
        sp.invites = (sp.invites || []).filter((x) => x.owner !== +i);
      } else if (k === "ground") sd.ground = el.value || null;
      else if (k === "deckRest") sd.deckRest = el.value;
      else sd[k] = +el.value;
      upd();
    };
    for (const el of document.querySelectorAll("[data-sadd]")) el.onchange = () => {
      if (!el.value) return;
      const [i, z] = el.dataset.sadd.split(":");
      const sd = sp.sides[+i];
      if (z === "field") sd.field.push({ word: el.value });
      else sd[z].push(el.value);
      upd();
    };
    for (const el of document.querySelectorAll("[data-sx]")) {
      const [i, z, k, f] = el.dataset.sx.split(":"), sd = sp.sides[+i];
      const h = () => {
        if (f === "del") {
          sd[z].splice(+k, 1);
          if (z === "field") {
            sp.invites = (sp.invites || []).filter((x) => !(x.owner === +i && x.kind === "orchard"));
            for (const t of sd.field) if (t.grants) t.grants = t.grants.filter((j) => j !== +k).map((j) => j > +k ? j - 1 : j);
          }
        } else {
          const t = sd.field[+k];
          if (f === "damage") t.damage = +el.value || 0;
          else if (f === "exhausted" || f === "fresh") t[f] = el.checked;
          else if (f === "growth") {
            t.counters = { ...t.counters || {}, growth: +el.value || 0 };
            if (!t.counters.growth) delete t.counters.growth;
          } else if (f === "grants") t.grants = el.value === "" ? [] : [+el.value];
        }
        upd();
      };
      if (f === "del") el.onclick = h;
      else el.onchange = h;
    }
    for (const el of document.querySelectorAll("[data-sinv]")) el.onchange = () => {
      const [i, kind] = el.dataset.sinv.split(":");
      sp.invites = (sp.invites || []).filter((x) => !(x.owner === +i && x.kind === kind));
      if (kind === "orchard" && el.value !== "") sp.invites.push({ kind, owner: +i, host: +el.value });
      if (kind === "heat" && el.checked) sp.invites.push({ kind, owner: +i });
      upd();
    };
    if (A.flash) {
      const p = document.createElement("p");
      p.className = "flash";
      p.textContent = A.flash;
      document.querySelector(".smeta").prepend(p);
      A.flash = null;
    }
  }
  function renderScModal() {
    const m = A.modal, sp = A.scen;
    const html = m.kind === "scexport" ? `<h2>Scenario JSON</h2><textarea id="sx-t" rows="14" readonly>${esc(JSON.stringify(sp, null, 1))}</textarea><div class="btns"><button id="sx-copy" class="go">Copy</button><button id="mo-x">Close</button></div><p id="sx-msg" class="small"></p>` : `<h2>Import a scenario</h2><textarea id="sx-t" rows="14" placeholder="{&quot;format&quot;:\u2026}"></textarea><div class="btns"><button id="sx-load" class="go">Load</button><button id="mo-x">Close</button></div><p id="sx-msg" class="small"></p>`;
    const el = document.createElement("div");
    el.className = "overlay";
    el.innerHTML = `<div class="scrim"></div><div class="modal" role="dialog">${html}</div>`;
    document.body.appendChild(el);
    const close = () => {
      A.modal = null;
      el.remove();
    };
    el.querySelector(".scrim").onclick = close;
    el.querySelector("#mo-x").onclick = close;
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    const cp = el.querySelector("#sx-copy");
    if (cp) cp.onclick = async () => {
      const t = el.querySelector("#sx-t");
      try {
        await navigator.clipboard.writeText(t.value);
        el.querySelector("#sx-msg").textContent = "Copied.";
      } catch (e) {
        t.select();
        el.querySelector("#sx-msg").textContent = "Copy was refused here: the text is selected, press Ctrl+C or Cmd+C.";
      }
    };
    const ld = el.querySelector("#sx-load");
    if (ld) ld.onclick = () => {
      try {
        const x = JSON.parse(el.querySelector("#sx-t").value);
        if (!x.sides || x.sides.length !== 2) throw new Error("needs two sides");
        A.scen = x;
        close();
        store.set("wa34.scenario", x);
        render();
      } catch (e) {
        el.querySelector("#sx-msg").textContent = "Not a scenario: " + e.message;
      }
    };
  }
  function boot(data) {
    if (data && data.last) store.set("wa34.last", data.last);
    const last = store.get("wa34.last");
    if (last && last.result == null && !store.get("wa34.left")) {
      resumeFrom(last, false);
      return;
    }
    render();
  }
  if (typeof window !== "undefined") {
    window.WA30 = { A, render, startMatch, startFixture, selection, E, SC };
    if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ last: A.C && !A.review ? A.C.replay() : store.get("wa34.last") }));
    const start = (d) => boot(d || {});
    if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
    else start(window.claude && window.claude.hot ? window.claude.hot.data : {});
  }
})();
