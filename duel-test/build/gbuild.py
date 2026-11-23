"""Duel test v0: the live game exactly, with its own saves, opening on the quick match, feedback after each duel."""
import json, os, sys
P = '/home/claude/wordgame/'; H = '/home/claude/dtest/'
r = lambda f: open(f, encoding='utf8').read()
head = r(P + 'head.html'); eng = r(P + 'engine.js'); ui = r(P + 'ui.js')
eng = eng.replace('const MAXFIELD=6,', 'const MAXFIELD=(window.DTV>=1?5:6),')
assert 'window.DTV>=1?5:6' in eng
ui = ui.replace('places:pick(PLACEKEYS,3)', 'places:(window.DTV>=1?false:pick(PLACEKEYS,3))')
ui = ui.replace('S.quick=true;say(S,', 'S.quick=true;S.dtv=window.DTV;if(window.DTVRAND)say(S,\'Your deck this duel: \'+window.DTVRAND.join(\', \')+\'.\');say(S,',1)
assert 'S.dtv=window.DTV' in ui
assert 'window.DTV>=1?false' in ui

# ---- version hooks (inert unless window.DTV says so) ----
z = "(f.length||extra?f.map(thingHtml).join(''):'<span class=\"empty\">'+(mine?'Nothing on your side yet. Bring forth a noun from your hand.':'Nothing on the rival’s side.')+'</span>')+(extra||'')"
assert z in ui, 'zf'
ui = ui.replace(z, "(window.DTV>=1?dtvRow(f,extra,mine):"+z+")")
rr = "'<i>Round '+Math.max(1,Math.ceil(S.turn/2))+'</i>'"
assert rr in ui
ui = ui.replace(rr, rr+"+(window.DTV>=1?dtvCap():'')")
bl = "if(S.botT!==S.turn){S.botT=S.turn;S.botN=0;}S.botN++;"
assert bl in ui
ui = ui.replace(bl, "if(S.botT!==S.turn){S.botT=S.turn;S.botN=0;}if(window.DTV>=2&&S.botN===0&&S.botFz!==S.turn&&typeof dtvRivalFuse==='function'){S.botFz=S.turn;if(dtvRivalFuse()){setTimeout(step,1300);return;}}S.botN++;")
nw = "fresh();S.live=true;settings(false);vsScreen();return;"
assert nw in ui
ui = ui.replace(nw, "fresh();S.live=true;settings(false);vsScreen();if(window.DTV>=3&&typeof dtvFirst==='function')dtvFirst();return;")
st = "p.ink=b0;p.ink0=b0;"
assert st in eng
eng = eng.replace(st, st+"if(window.DTV>=3&&typeof dtvSecond==='function')dtvSecond(S,i);if(window.DTV>=6&&typeof dtvSnap==='function')dtvSnap(S,i);", 1)

ti = "t.w=w;t.title=null;t.forms=[];t.props=W[w].props.slice();"
assert ti in eng
eng = eng.replace(ti, "const _gain=(window.DTV>=5&&W[t.w])?t.props.filter(p=>!W[t.w].props.includes(p)):[],_fm=window.DTV>=5?(t.forms||[]).slice():[];t.w=w;t.title=null;t.forms=_fm;t.props=W[w].props.slice();for(const p of _gain)if(!t.props.includes(p))t.props.push(p);")
tx = "add('toxic','venomous');"
assert tx in ui
ui = ui.replace(tx, "add('toxic',(window.DTV>=5&&!(t.props.includes('beast')||t.props.includes('serpent')||t.props.includes('sting')||(t.forms||[]).includes('venomous')))?'poisonous':'venomous');")
et = "if(S.over==null)S.phase='shop';}"
assert et in ui
ui = ui.replace(et, "if(S.over==null){S.phase='shop';if(window.MOCKB){S.phase='bot';startTurn(S,1);render();turnBanner(rvName().split(' ')[0]+'’s turn');botLoop();return;}}}")
rl = "rivalLife:QUICKLIFE-LIFE+5+(r<1?0:Math.min(4,r))"
assert rl in ui
ui = ui.replace(rl, "rivalLife:(window.DTV>=6?QUICKLIFE-LIFE:QUICKLIFE-LIFE+5+(r<1?0:Math.min(4,r)))")
co = "S.players[1].coins=1;"
assert co in eng
eng = eng.replace(co, "S.players[1].coins=(window.DTV>=6?0:1);",1)
iv1 = "  S.things.push(t);\n  {const r=plOf(S,t);"
assert iv1 in eng
eng = eng.replace(iv1, "  S.things.push(t);if(window.DTV>=6&&window.dtvInnate)dtvInnate(S,t);\n  {const r=plOf(S,t);", 1)
iv2 = "else if(!inn&&t.inn){t.inn=0;t.verbs=(t.verbs||[]).filter(v=>v!=='strike');}}"
assert iv2 in eng
eng = eng.replace(iv2, "else if(!inn&&t.inn){t.inn=0;t.verbs=(t.verbs||[]).filter(v=>v!=='strike');}if(window.DTV>=6&&window.dtvInnate)dtvInnate(S,t);}", 1)
iv3 = "function dropVerbs(S,t){if(t.verbs)t.verbs=t.inn?['strike']:[];}"
assert iv3 in eng
eng = eng.replace(iv3, "function dropVerbs(S,t){if(t.verbs)t.verbs=(t.inn?['strike']:[]).concat(t.innv||[]);}")
iv4 = "own=keeper.verbs.filter(v=>!(v==='strike'&&keeper.inn))"
assert iv4 in eng
eng = eng.replace(iv4, "own=keeper.verbs.filter(v=>!(v==='strike'&&keeper.inn)&&!(keeper.innv||[]).includes(v))")
iv5 = "const k=keeper.verbs.findIndex(v=>!(v==='strike'&&keeper.inn));"
assert iv5 in eng
eng = eng.replace(iv5, "const k=keeper.verbs.findIndex(v=>!(v==='strike'&&keeper.inn)&&!(keeper.innv||[]).includes(v));")
fr = "if(sen.kverb==='strike'&&sThing&&sThing.inn&&sThing.fresh&&!sThing.props.includes('swift'))return fail(Cap(sThing.title||sThing.w)+' has only just arrived. It can strike next turn.');"
assert fr in eng
eng = eng.replace(fr, fr+"if(window.DTV>=6&&sThing&&sThing.side===who&&sThing.fresh&&!sThing.props.includes('swift')&&!sThing.st.quick&&sen.verb!=null&&ATTACKV.includes(hand[sen.verb]))return fail(Cap(sThing.title||sThing.w)+' has only just arrived. It can attack next turn.');if(window.DTV>=6&&s.k==='card'&&W[hand[s.i]].t===NOUN&&!W[hand[s.i]].props.includes('swift')&&!(sen.adjs||[]).some(i=>hand[i]==='quick')&&((sen.verb!=null&&ATTACKV.includes(hand[sen.verb]))||ATTACKV.includes(sen.kverb)))return fail(Cap(hand[s.i])+' would only just arrive. Bring it forth now; it can attack next turn.');", 1)
nm1 = "if(vd.obj==='none'&&sen.obj)return fail(Cap(vw)+' takes no object.');"
assert nm1 in eng
eng = eng.replace(nm1, "if(vd.obj==='none'&&sen.obj&&!(window.DTV>=6&&vw==='name'&&sThing&&sThing.props.includes('human')&&sen.obj.k==='thing'))return fail(Cap(vw)+' takes no object.');", 1)
nm2 = " name(S,who,subs,objs,c){for(const e of subs){"
assert nm2 in eng
eng = eng.replace(nm2, " name(S,who,subs,objs,c){if(window.DTV>=6&&objs&&objs.length&&objs.every(o=>o.k!=='p')&&subs.some(e=>e.t&&e.t.props.includes('human'))){const n=subs.find(e=>e.t);say(S,Cap(nm(S,n))+' gives it a name.');subs=objs;}for(const e of subs){", 1)
nm3 = "if(vw&&EVOLVE.includes(vw)&&s&&!s.pl){"
assert nm3 in eng
eng = eng.replace(nm3, "if(window.DTV>=6&&vw==='name'&&sen.obj&&sen.obj.k==='thing'&&s&&o)return Cap(s.x)+' names '+o.x+'.';"+nm3, 1)
mk = "S.supply=shuffle(S,(o.market||ALLWORDS).filter(w=>W[w]&&!W[w].token));"
assert mk in eng
eng = eng.replace(mk, "S.supply=shuffle(S,(o.market||ALLWORDS).filter(w=>W[w]&&!W[w].token&&!(window.DTV>=6&&TIER4.includes(w))));", 1)
stl = "const p=S.players[o.i],n=Math.min(p.coins,(a.t.props.includes('thief')?2:1)*c.mult);"
assert stl in eng
eng = eng.replace(stl, "const p=S.players[o.i];if(window.DTV>=6){if(!p.hand.length){say(S,Cap(nm(S,o))+' '+vb(o,'have','has')+' no words to steal.');continue;}const k=Math.floor(Math.random()*p.hand.length),w=p.hand.splice(k,1)[0];mine.hand.push(w);if(p.vat)p.vat=p.vat.filter(r=>r.k!=='card');if(mine.vat)mine.vat=mine.vat.filter(r=>r.k!=='card');say(S,Cap(nm(S,a))+' steals a word from '+nm(S,o)+(a.t.side===0?': '+w:'')+'.');c.effect=true;continue;}const n=Math.min(p.coins,(a.t.props.includes('thief')?2:1)*c.mult);", 1)
st0 = " steal(S,who,subs,objs,c){"
assert st0 in eng
eng = eng.replace(st0, " steal(S,who,subs,objs,c){if(window.DTV>=6){const ag=agents(S,who,subs,e=>e.k==='t'&&canT('steal',e.t),'is no thief.');for(const a of ag){if(!alive(S,a))continue;didAct(S,who,a);const mine=S.players[a.t.side],p=S.players[1-a.t.side];if(!p.hand.length){say(S,(a.t.side===0?'The rival has':'You have')+' no words to steal.');continue;}const w=p.hand.splice(Math.floor(Math.random()*p.hand.length),1)[0];mine.hand.push(w);if(p.vat)p.vat=p.vat.filter(r=>r.k!=='card');say(S,Cap(nm(S,a))+' steals '+w+' from '+(a.t.side===0?'the rival':'you')+'.');c.effect=true;}return;}", 1)
# ---- v7: simpler rules ----
def RP(src,a,bb,cnt=1):
    assert a in src,a[:70]
    return src.replace(a,bb,cnt)
# breath carries over instead of the well
eng = RP(eng,"if(S.cfg.ramp&&S.cfg.well>0){const k=Math.min(S.cfg.well,","if(window.DTV>=7){const k=Math.min(WELL,Math.max(0,p.ink));p.carry=k;p.well=0;if(k)say(S,(i===0?'You carry ':'The rival carries ')+k+' unspent breath into '+(i===0?'your':'their')+' next turn.');}else if(S.cfg.ramp&&S.cfg.well>0){const k=Math.min(S.cfg.well,")
eng = RP(eng,"p.earned=0;p.vesselUsed=false;","if(window.DTV>=7&&p.carry){p.ink+=p.carry;p.carry=0;}p.earned=0;p.vesselUsed=false;")
# opposites off
eng = RP(eng,"const op=oppOf(src);if(op){","const op=window.DTV>=7?null:oppOf(src);if(op){")
# potent: a third more harm, not double
eng = RP(eng,"if(verbW&&sT&&sT.props.includes('potent')){c.mult+=1;","if(verbW&&sT&&sT.props.includes('potent')&&window.DTV>=7){c.pot=1;}else if(verbW&&sT&&sT.props.includes('potent')){c.mult+=1;")
eng = RP(eng,"const pre=direct&&c.pre?c.pre:null;if(c)c.pre=null;","const pre=direct&&c.pre?c.pre:null;if(c)c.pre=null;const pv=direct&&c.pot&&window.DTV>=7?Math.max(1,Math.round(n/3)):0;")
eng = RP(eng,"if(direct&&(b||nv||ex||c.mult>1||pre)){","if(direct&&(b||nv||ex||pv||c.mult>1||pre)){")
eng = RP(eng,"if(ex)s+=' + '+ex+' (an exalted verb)';say(S,'The sum: '+s+' = '+Math.max(1,n+b+nv+ex)+'.','q');}\n   n=Math.max(1,n+b+nv+ex);}","if(ex)s+=' + '+ex+' (an exalted verb)';if(pv)s+=' + '+pv+' (potent: a third more)';say(S,'The sum: '+s+' = '+Math.max(1,n+b+nv+ex+pv)+'.','q');}\n   n=Math.max(1,n+b+nv+ex+pv);}")
# hidden bonuses off: discoveries and exalted verbs
eng = RP(eng,"if(!S.insDone){b=insight(S,S.atkWho);","if(!S.insDone&&!(window.DTV>=7)){b=insight(S,S.atkWho);")
eng = RP(eng,"if(c&&c.ex&&!S.exDone&&","if(c&&c.ex&&!(window.DTV>=7)&&!S.exDone&&")
# ruin off
eng = RP(eng,"if(ruined!=null&&!S.inRuin){","if(ruined!=null&&!S.inRuin&&!(window.DTV>=7)){")
# curse off
eng = eng.replace("cost+=CURSE;}}","cost+=(window.DTV>=7?0:CURSE);}}").replace(".length*CURSE+",".length*(window.DTV>=7?0:CURSE)+").replace("cost+=CURSE*(sen.adjs","cost+=(window.DTV>=7?0:CURSE)*(sen.adjs")
# alchemy colours are flavour only
eng = RP(eng,"t.col=k;t.vig+=1;say(S,Cap(nm(S,T(t)))+' turns '+STAGES[k]+': '+STAGEN[k]+'. 1 stronger.');if(k===3&&addProp(t,'potent'))","if(window.DTV>=7)return;t.col=k;t.vig+=1;say(S,Cap(nm(S,T(t)))+' turns '+STAGES[k]+': '+STAGEN[k]+'. 1 stronger.');if(k===3&&addProp(t,'potent'))")
# one action per thing per turn
eng = RP(eng,"if(S.cfg&&S.cfg.gw2&&CURV&&!ATTACKV.includes(CURV)&&!e.t.nonAtk){","if(S.cfg&&S.cfg.gw2&&!(window.DTV>=7)&&CURV&&!ATTACKV.includes(CURV)&&!e.t.nonAtk){")
n0 = eng.count("S.cfg.gw2&&!ATTACKV.includes(")
eng = eng.replace("S.cfg.gw2&&!ATTACKV.includes(","S.cfg.gw2&&!(window.DTV>=7)&&!ATTACKV.includes(")
print('one-act sites', n0)
# retorts off
ui = RP(ui,"if(s.veil==null&&S.cfg.ramp){const ro=playerRetorts(s);","if(s.veil==null&&S.cfg.ramp&&!(window.DTV>=7)){const ro=playerRetorts(s);")
ui = RP(ui,"if(sen.veil==null&&S.cfg.ramp&&!S.puz){const rt=botRetort(S,1,0,sen);","if(sen.veil==null&&S.cfg.ramp&&!S.puz&&!(window.DTV>=7)){const rt=botRetort(S,1,0,sen);")
# words out of the v7 set
eng = RP(eng,"&&!(window.DTV>=6&&TIER4.includes(w))));","&&!(window.DTV>=6&&TIER4.includes(w))&&!(window.DTV>=7&&(window.DTVX7||[]).includes(w))));")
# v7: fused ground things (energy, steam, lava...) stay in the ground
eng = RP(eng,"if(S.cfg.gw2&&!['fire','water','earth','air','wind'].includes(x.r)&&t.props.includes('ground')){","if(S.cfg.gw2&&!(window.DTV>=7)&&!['fire','water','earth','air','wind'].includes(x.r)&&t.props.includes('ground')){")
# v8: the verbs round
eng = RP(eng,"const n=(S.cfg.gw2&&a.t.props.includes('beast')?a.t.vig*2:","const n=(window.DTV>=8?(a.t.props.includes('beast')?Math.ceil(a.t.vig*1.3):a.t.vig):S.cfg.gw2&&a.t.props.includes('beast')?a.t.vig*2:")
eng = RP(eng,"c.pre=S.cfg.gw2?a.t.vig+' vigour × 2 (a beast’s bite)'","c.pre=window.DTV>=8?a.t.vig+' vigour +30% (a beast’s bite)':S.cfg.gw2?a.t.vig+' vigour × 2 (a beast’s bite)'")
eng = RP(eng,"hit(S,o,(a.t.vig+(a.t.props.includes('heavy')?3:0))*c.mult,'crush')","hit(S,o,(window.DTV>=8?Math.ceil(a.t.vig*1.3):(a.t.vig+(a.t.props.includes('heavy')?3:0)))*c.mult,'crush')")
eng = RP(eng,"const o=S.cfg.gw2&&o0.k==='p'?o0:blockOf(S,o0,c,a);if(S.cfg.gw2&&o===o0&&o0.k==='p')say","const o=S.cfg.gw2&&!(window.DTV>=8)&&o0.k==='p'?o0:blockOf(S,o0,c,a);if(S.cfg.gw2&&!(window.DTV>=8)&&o===o0&&o0.k==='p')say")
eng = RP(eng,"hit(S,o,a.t.vig*c.mult*(a.t.props.includes('sharp')?(plant?3:2):1),'cut')","hit(S,o,window.DTV>=8?Math.ceil(a.t.vig*1.3)*c.mult:a.t.vig*c.mult*(a.t.props.includes('sharp')?(plant?3:2):1),'cut')")
eng = RP(eng,"const o=guardOf(S,o0,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;","const o=window.DTV>=8?blockOf(S,o0,c,a):guardOf(S,o0,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;")
eng = RP(eng,"hit(S,o,(a.t.vig+1)*c.mult,'sting')","hit(S,o,(window.DTV>=8?Math.ceil(a.t.vig*1.5):a.t.vig+1)*c.mult,'sting')")
eng = RP(eng,"if(t.st.poisoned){damage(S,T(t),S.cfg.gw2?","if(t.st.poisoned){damage(S,T(t),window.DTV>=8?Math.max(1,Math.ceil(t.vig*0.1)):S.cfg.gw2?")
eng = RP(eng,"if(!t.st.ferment){t.vig+=4;addProp(t,'potent');say(S,Cap(nm(S,T(t)))+' has fermented: 4 stronger, and potent.');}","if(!t.st.ferment){t.vig+=window.DTV>=8?Math.max(1,Math.ceil(t.vig*(window.DTV>=11?0.3:0.5))):4;addProp(t,'potent');say(S,Cap(nm(S,T(t)))+(window.DTV>=8?' has fermented, and is potent: '+t.vig+'.':' has fermented: 4 stronger, and potent.'));}")
eng = RP(eng,"if(gv&&gv!=='doubt'&&gs&&gs.props.includes('spell'))","if(gv&&gv!=='doubt'&&!(window.DTV>=8&&['transmute','dispel','sacrifice'].includes(gv))&&gs&&gs.props.includes('spell'))")
eng = RP(eng,"didAct(S,who,a);say(S,Cap(nm(S,a))+' stings '+nm(S,o)+'.');hit(S,o,","didAct(S,who,a);say(S,Cap(nm(S,a))+' stings '+nm(S,o)+'.');hit(S,o,")
eng = RP(eng,"\n    if(a.t.props.includes('toxic')&&alive(S,o)&&has(o,'living'))poison(S,o,1);}}}","\n    if(!(window.DTV>=8)&&a.t.props.includes('toxic')&&alive(S,o)&&has(o,'living'))poison(S,o,1);}}}")
ui = RP(ui,"W[w].conj?'conjunction':TYPE[W[w].t]","W[w].conj?'conjunction':(window.DTVSPELLV&&window.DTVSPELLV(w))?'spell \\u00b7 cast':TYPE[W[w].t]")
# v10: attacks hit with might
def _mt(src,start,end):
    i=src.index(start);j=src.index(end,i);blk=src[i:j]
    blk=blk.replace('a.t.vig','MT(a.t)').replace("' vigour +30% (a beast’s bite)'","' might +30% (a beast’s bite)'").replace("' vigour × 2 (a beast’s bite)'","' might × 2 (a beast’s bite)'")
    return src[:i]+blk+src[j:]
eng=_mt(eng,"\n strike(S,who,subs,objs,c){","\n sleep(S,who,subs,objs,c)")
eng=_mt(eng,"\n bite(S,who,subs,objs,c){","\n poison(S,who,subs,objs,c){")
eng = RP(eng,"if(t.props.includes('beast')){say(S,'A beast will not be lured. It must be tamed.');continue;}if(t.vig>3)","if(t.props.includes('beast')){say(S,'A beast will not be lured. It must be tamed.');continue;}if(t.vig>(window.DTV>=11?5:3))")
# ---- v4 hooks ----
for a_,b_ in [("if(gold>=GOLDWIN){","if(gold>=GOLDWIN&&!(window.DTV>=4)){"),
              ("if((S.players[k].silence||[]).length>=SILENT){","if((S.players[k].silence||[]).length>=SILENT&&!(window.DTV>=4)){"),
              ("if(S.cfg.vessel&&!S.players[0].hand.includes('vessel'))","if(!(window.DTV>=4)&&S.cfg.vessel&&!S.players[0].hand.includes('vessel'))"),
              ("if(S.cfg.vessel&&!p.hand.includes('vessel'))","if(!(window.DTV>=4)&&S.cfg.vessel&&!p.hand.includes('vessel'))")]:
    assert a_ in eng, a_
    eng = eng.replace(a_, b_)
for a_,b_ in [("deck:PF.deck.slice(),up:","deck:dtvDeck(PF.deck.slice(),1),up:"),("life:QUICKLIFE-LIFE,rivalDeck,","life:QUICKLIFE-LIFE,rivalDeck:dtvDeck(rivalDeck,2),")]:
    assert a_ in ui, a_
    ui = ui.replace(a_, b_, 1)

# ---- v5 hooks: the fusion web ----
rxo = "const rxOf=(a,b)=>RX[[a,b].sort().join('+')]||null;"
assert rxo in eng
eng = eng.replace(rxo, "const rxOf=(a,b)=>((window.DTV>=5&&window.dtvRx)?dtvRx(a,b):(RX[[a,b].sort().join('+')]||null));")
rl = "function rxLevel(a,b,x){"
assert rl in eng
eng = eng.replace(rl, rl+"if(window.DTV>=5&&x&&x.tier&&window.WEB21)return Math.max(1,window.WEB21.BREATH[x.tier]||1);")
_w = json.load(open('/home/claude/fw2/web21.json'))
web = '<script>window.WEB21=' + json.dumps({k:_w[k] for k in ['base','cat','cards','NEW','BREATH']}, separators=(',',':')) + ';</script>\n'
web += '<script>if(window.DTV>=14){window.WEB21.base=window.DTV>=17?' + open('/home/claude/dtest/v14/web17.json').read() + ':window.DTV>=16?' + open('/home/claude/dtest/v14/web16.json').read() + ':' + open('/home/claude/dtest/v14/web14.json').read() + ';window.CHART14=' + open('/home/claude/dtest/v14/chart.json').read().replace('\n','') + ';window.QCHART14=' + open('/home/claude/dtest/v14/qchart.json').read().replace('\n','') + ';}</script>\n'

ed = "return side(S,ds).filter(t=>takes(t,att&&att.verb)&&"
assert ed in eng
eng = eng.replace(ed, "return side(S,ds).filter(t=>!(window.DTV>=5&&t.props.includes('fleeting'))&&takes(t,att&&att.verb)&&")
gd = "if(att.riddle)return false;if(S.things.some(t=>t.side===1-who&&t.st.guarding&&"
assert gd in eng
eng = eng.replace(gd, "if(att.riddle)return false;if(S.things.some(t=>t.side===1-who&&t.st.guarding&&!(window.DTV>=5&&t.props.includes('fleeting'))&&")
import base64 as _b
_mat = 'data:image/webp;base64,' + _b.b64encode(open(H + 'mat_duel.webp', 'rb').read()).decode()
# ---- logs: keep the cloud profile off in the duel test ----
ui = RP(ui,"async function linkStore(){","async function linkStore(){if(window.DTVNOSTORE)return;")
# ---- v13: the overnight bug report ----
ui = RP(ui,">Lay it face down</button>",">'+(window.DTV>=13?'Lay '+esc(S.players[0].hand[ui.adjs[0]])+' face down as a trap':'Lay it face down')+'</button>")
eng = RP(eng,"if(direct&&(b||nv||ex||pv||c.mult>1||pre)){const m=c.mult,base=n%m===0?n/m:null;let s=pre?","const b13=window.DTV>=13&&direct&&!pre&&c.mult<=1&&window.dtvBase13?dtvBase13(S,n):null;if(direct&&(b||nv||ex||pv||c.mult>1||pre||(b13&&/hurt/.test(b13)))){const m=c.mult,base=n%m===0?n/m:null;let s=b13?b13:pre?")
ui = RP(ui,"ui.adjs.length===1&&!ui.subj&&ui.verb==null&&!ui.kverb&&ui.clime==null&&!S.players[0].veil?","ui.adjs.length===1&&!ui.subj&&ui.verb==null&&!ui.kverb&&ui.clime==null&&!S.players[0].veil&&(!(window.DTV>=13)||(window.TRAPA||[]).includes(S.players[0].hand[ui.adjs[0]]))?")
eng = RP(eng,"one more each turn, up to '+S.cfg.ink+'.');","one more each turn, up to '+S.cfg.ink+(window.DTV>=13?', plus up to '+WELL+' carried from the turn before':'')+'.');")
D13 = "window.DTV>=13"
eng = RP(eng,"if(!w||W[w].t!==ADJ)return{ok:false,why:'Only an adjective can be laid face down.'};","if(!w||W[w].t!==ADJ)return{ok:false,why:'Only an adjective can be laid face down.'};if("+D13+"&&!(window.TRAPA||[]).includes(w))return{ok:false,why:'Only a curse can be laid face down: '+(window.TRAPA||[]).join(', ')+'.'};")
eng = RP(eng,"if(q.veil&&hostile&&sT0&&sT0.side===who){","if(q.veil&&hostile&&sT0&&sT0.side===who&&(!("+D13+")||(()=>{const vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);return vw&&ATTACKV.includes(vw)&&!sT0.fresh&&!sT0.st.asleep&&!sT0.st.frozen&&!sT0.st.bound&&(window.TRAPA||[]).includes(q.veil);})())){")
eng = RP(eng,"if(S.cfg.gw2&&e.k==='t'&&alive(S,e)&&e.t.side===who){e.t.vig+=2;return true;}return r;};}","if(S.cfg.gw2&&e.k==='t'&&alive(S,e)&&e.t.side===who){e.t.vig+=2;if("+D13+"&&a!=='eternal')say(S,'A blessing: '+e.t.w+' gains 2.');return true;}return r;};}")
eng = RP(eng,"VERBF[v]=(S,who,subs,objs,c,ho)=>{f(S,who,subs,objs,c,ho);if(S.cfg.gw2&&S.fromHand!==false){VX[v](S,who,subs,objs);c.effect=true;}};}","VERBF[v]=(S,who,subs,objs,c,ho)=>{const e0=c.effect,n13="+D13+";if(n13)c.effect=false;f(S,who,subs,objs,c,ho);const did=c.effect;if(n13)c.effect=e0||did;if(S.cfg.gw2&&S.fromHand!==false&&(!n13||did)){VX[v](S,who,subs,objs);c.effect=true;}};}")
eng = RP(eng,"if(x.r){const t=addThing(S,x.r,who,who,true);","if(x.r){const t=addThing(S,x.r,("+D13+"&&W[x.r]&&(W[x.r].props||[]).includes('burden'))?1-who:who,who,true);")
eng = RP(eng,"if(S.cfg.gw2&&t.props.includes('metal')&&t.w!=='slag'","if(S.cfg.gw2&&!("+D13+")&&t.props.includes('metal')&&t.w!=='slag'")
eng = RP(eng,"addThing(S,'carrion',1-t.side,1-t.side,true);say(S,'Carrion is left for the other side.');","if("+D13+"){addThing(S,'carrion',t.side,t.side,true);say(S,'Carrion is left behind.');}else{addThing(S,'carrion',1-t.side,1-t.side,true);say(S,'Carrion is left for the other side.');}")
eng = RP(eng,"say(S,'The sum: '+s+' = '+Math.max(1,n+b+nv+ex+pv)+'.','q');","{const raw=n+b+nv+ex+pv;say(S,'The sum: '+s+' = '+(("+D13+")&&raw<1?raw+', at least 1':Math.max(1,raw))+'.','q');}")
eng = RP(eng,"Math.max(1,Math.ceil(t.vig*0.1))","(window.DTV>=17?Math.max(1,Math.ceil(t.vig*0.2*Math.min(3,t.st.poisoned||1))):Math.max(1,Math.ceil(t.vig*0.1)))")
eng = RP(eng,"if(p.poisoned>0){p.poisoned--;say(S,'The poison works.');damage(S,P(i),S.cfg.gw2?3:2,'poison');}","if(p.poisoned>0){const pd=p.poisoned;p.poisoned--;say(S,'The poison works.');damage(S,P(i),(S.cfg.gw2?3:2)+(window.DTV>=17?pd:0),'poison');}")
eng = RP(eng,"p.attune&&i===0&&S.turn>2?ATTUNEB:0","p.attune&&(i===0||window.DTV>=16)&&S.turn>2?ATTUNEB:0")
eng = RP(eng,"if(m){say(S,'The foundry works.');climb(S,m,1);}","if(m&&!("+D13+")){say(S,'The foundry works.');climb(S,m,1);}")
eng = RP(eng,"if(m){say(S,'Erosion wears at the ladder.');fall(S,m);}","if(m&&!("+D13+")){say(S,'Erosion wears at the ladder.');fall(S,m);}")
eng = RP(eng,"say(S,'It rises out of the black matter with '+n+' more vigour.');","say(S,"+D13+"?'It rises from the black matter your fallen things left behind: '+n+' more vigour.':'It rises out of the black matter with '+n+' more vigour.');")
eng = RP(eng,"t.vig+=sd===0?ATTUNEV:2;t.att=1;if(S.players[sd].attune==='air')t.st.quick=1;","if("+D13+"){t.vig+=ATTUNEB;t.att=1;say(S,Cap(w)+' is attuned to '+(sd===0?'your':'the rival’s')+' '+S.players[sd].attune+' deck: it arrives 2 stronger.');}else{t.vig+=sd===0?ATTUNEV:2;t.att=1;if(S.players[sd].attune==='air')t.st.quick=1;}")
eng = RP(eng,"if(k)say(S,(i===0?'You carry ':'The rival carries ')+k+' unspent breath into '+(i===0?'your':'their')+' next turn.');","if(k)say(S,(i===0?'You carry ':'The rival carries ')+k+' unspent breath into '+(i===0?'your':'their')+' next turn'+("+D13+"?' (up to '+WELL+' carries over).':'.'));")
dtv = r(H + 'dtv.js').replace('var(--dmat)', 'url(' + _mat + ')')
head = head.replace('<title>Word Alchemy Prototype</title>', '<title>Word Alchemy: Duel Test</title>')
i = head.index('<head>') + len('<head>'); head = head[:i] + '\n<script>' + r(H + 'gguard.js') + '</script>\n' + head[i:]
g = {}; exec(r('/home/claude/wgtest/build.py').split('inlset=set(fs)')[0], g); inl = g['inl']
tail = web + '<script>' + dtv + '</script>\n<script>' + r(H + 'v8.js') + '</script>\n<script>' + r(H + 'v13.js') + '</script>\n<script>' + r(H + 'v16.js') + '</script>\n<script>' + r(H + 'v17.js') + '</script>\n<script>' + r(H + 'v19.js') + '</script>\n<script>\nconst INL=' + json.dumps(inl) + ';\n' + ui + '</script>\n<script>' + r(H + 'gfeed.js') + '</script>\n<script>window.DTVBUILD=' + json.dumps(__import__('datetime').datetime.utcnow().strftime('%Y-%m-%dT%H:%MZ')) + ';\n' + r(H + 'logs.js') + '</script>\n<script>window.MOCKCSS=' + json.dumps(r(H + 'mock.css')) + ';\n' + r(H + 'mock.js') + '</script>\n<script>' + r(H + 'v14.js') + '</script>\n<script>' + r(H + 'v15.js') + '</script>\n<script>' + r(H + 'v18.js') + '</script>\n<script>try{const A=JSON.parse(\'' + json.dumps(sorted(k.split('/')[-1][:-4] for k in json.load(open(P + 'assets/pack/art8.json')))) + '\');const FOC={wolf:72};for(const w of A)if(ART[w]==null)ART[w]=FOC[w]||50;}catch(e){}</script>\n</body>\n</html>\n'
open(P + 'duel.html', 'w', encoding='utf8').write(head + '<script id="engine">\n' + eng + '</script>\n\n' + tail)
pm = {}
for pk in ['art0', 'art1', 'art2', 'art3', 'art4', 'art5', 'art6', 'art7', 'art8', 'ui', 'misc']:
    for k in json.load(open(P + 'assets/pack/' + pk + '.json')): pm[k] = pk
pack = '<script>const PACKMAP=' + json.dumps(pm) + ';\n' + r('/home/claude/wgtest/packjs.js') + '</script>\n'
j = head.index('<body'); j = head.index('>', j) + 1
open(H + 'art/index.html', 'w', encoding='utf8').write(head[:j] + pack + head[j:] + '<script id="engine">\n' + eng + '</script>\n\n' + tail)
print('ok')
