/* ---- the journey: region one ---- */
const STORY={region:'The Black Country',stage:'Nigredo · the blackening',nodes:[
 {id:'roux',kind:'duel',main:1,x:170,y:400,place:'Emberwick',spot:'The scriptorium',who:{n:'Anselm Roux',p:10,role:'Your master'},need:[],word:'word',life:-22,
  rule:'A lesson, not a fight: he begins with only 38 life.',
  deck:['toad','owl','crow','leech','wormwood','hemlock','lead','strike','strike','bite','crush','mend','guard','sleep','ancient','frozen','word','word','earth','water','enchant','sodden'],
  lines:{meet:'Seven years you have ground my ink. Before you take the road, show me you can make a sentence stand.',again:'Again. A sentence is a thing with a spine. Find it.',won:'You have my word, and you have the road. Do not come back until it has changed you.',win:'Good. That is the first one I could not have written for you.',lose:'No. You are reciting. Say only what you mean to happen.'}},
 {id:'reeve',kind:'duel',main:1,x:560,y:250,place:'Colliers’ Wood',spot:'The charcoal clamps',who:{n:'Lucan Reeve',p:8,role:'Charcoal burner'},need:['roux'],word:'burn',life:-10,clime:'drought',
  rule:'Drought holds over the wood: flames gain 1 every turn, plants and liquids lose 1.',
  deck:['fire','fire','flint','pitch','saltpetre','naphtha','salamander','crow','lead','iron','burn','burn','strike','strike','crush','blow','burning','burning','ancient','guard','air','earth'],
  lines:{meet:'Wordsmith, is it? Out here a word is worth what it sets alight. Mind your sleeves.',again:'Back for more smoke? Bring water this time, or bring nothing that burns.',won:'You took the heat. Take the word for it too; you have earned the saying of it.',win:'Hah. Banked my own fire against me. Fair.',lose:'Everything you brought was kindling. Think on what does not burn.'}},
 {id:'riddle',kind:'riddle',x:760,y:520,place:'The Riddle Stone',spot:'A standing stone on the heath',need:['reeve'],word:'moth',
  text:'I dined on a song and was none the wiser.\nI swallowed a sermon and learned no prayer.\nA thief in the dark, I grew fat upon wisdom\nand flew from the page with nothing to say.\nSay what I am called.',
  ans:['moth','bookmoth','book-moth','book moth','bookworm','book worm','a moth'],hint:'It eats the page, not the meaning.'},
 {id:'ashdown',kind:'duel',main:1,x:940,y:380,place:'Blackwater Fen',spot:'The eel-house',who:{n:'Mara Ashdown',p:2,role:'Fen-wife'},need:['reeve'],word:'poison',life:-4,clime:'flood',
  rule:'The fen is in flood: liquids gain 1 every turn and things of fire lose 2.',
  deck:['toad','toad','leech','leech','adder','hemlock','nightshade','wormwood','water','swamp','brine','poison','poison','drench','bite','sleep','sleep','venomous','venomous','sodden','mend','rain'],
  lines:{meet:'Fire is a boy’s word. Sit. The fen will teach you slower ones.',again:'Still dry behind the ears. Good. Sit down again.',won:'There. Now it is in you, and you may give it to others. Carefully.',win:'Well. You let it work instead of hurrying it. That is the whole art.',lose:'You kept striking at what was already dying. Patience is a verb here.'}},
 {id:'quill',kind:'duel',x:1130,y:560,place:'The Drowned Bridge',spot:'A fellow journeyman, going the other way',who:{n:'Tobias Quill',p:6,role:'Journeyman'},need:['ashdown'],pick:['pitch','saltpetre','nightshade','adder','flint','lichen','yew','rain','brine','swamp'],life:6,
  rule:'A wager between equals: he begins with 66 life and a crow already on his side.',things:['crow'],
  deck:['toad','owl','crow','leech','fire','water','earth','air','fuse','fuse','blow','lead','enchant','strike','strike','bite','crush','sleep','mend','guard','burning','sodden','venomous','ancient','burn','poison'],
  lines:{meet:'You are from Roux’s shop! I left Emberwick a year before you. Shall we see what the road has taught us both?',again:'Double or nothing? I have been practising.',won:'Take your pick of what I have gathered. I will want a rematch in the next country.',win:'Ha! Beaten by the ink-grinder. I am telling no one.',lose:'A year’s head start, that is all it is. You will catch me.'}},
 {id:'thorne',kind:'duel',main:1,x:1320,y:230,place:'Crowstone',spot:'The churchyard',who:{n:'Edda Thorne',p:3,role:'Sexton'},need:['ashdown'],word:'wither',life:0,clime:'night',
  rule:'It is always night at Crowstone: what is brought forth here comes hidden, and night creatures gain 1 every turn.',
  deck:['crow','crow','owl','owl','moth','bat','shadow','yew','hemlock','lichen','wither','wither','haunt','bite','sleep','forget','occult','ancient','frozen','guard','strike','hunger'],
  lines:{meet:'…',again:'Again.',won:'Everything that is said is one day unsaid. Now you can say that, too.',win:'Hm.',lose:'You could not see it. So you did not name it.'}},
 {id:'hale',kind:'duel',main:1,gate:1,x:1700,y:400,place:'The Black Gate',spot:'The toll-house at the border',who:{n:'Corvin Hale',p:7,role:'Keeper of the Black Gate'},need:['thorne'],word:'night',life:10,things:['crow','shadow'],
  rule:'The Keeper’s trial: he begins with 70 life, and a crow and a shadow already stand on his side.',
  deck:['fire','pitch','crow','crow','owl','toad','leech','adder','shadow','hemlock','burn','burn','poison','poison','wither','haunt','strike','strike','bite','crush','burning','venomous','occult','ancient','guard','sleep','night','fuse','water'],
  lines:{meet:'Roux’s apprentice. I have had a letter. Show me the fire, the fen and the grave in one hand, and the gate is yours.',again:'The gate has stood four hundred years. It can wait for you to be ready.',won:'Pass, journeyman. Beyond this the country turns white, and words mean what they wash away.',win:'There. Burnt, drowned and buried, and still standing. That is the blackening done.',lose:'You brought three countries’ words and used one. Come back when they speak to each other.'}}
]};
const sNode=id=>STORY.nodes.find(n=>n.id===id);
function sSt(){if(!PF.story||typeof PF.story!=='object')PF.story={};const s=PF.story;s.done=s.done||{};s.lost=s.lost||{};s.log=s.log||[];s.hoard=s.hoard||{};s.seen=s.seen||{};return s;}
const sOpen=n=>n.need.every(k=>sSt().done[k]);
let jS={tab:'map',sel:null,pop:null};
function storyStart(id){const n=sNode(id);if(!n||n.kind!=='duel'||!sOpen(n))return;const p=perks(rankOf(PF.xp));if(PF.deck.length<DECKMIN||PF.deck.length>p.deckMax){view='deck';renderAll();return;}
  S=newGame((Date.now()%2147483647)|0,{deck:PF.deck.slice(),up:Object.assign({},PF.up),ink:p.ink,hand:p.hand,maxVerbs:p.maxVerbs,life:p.life,rivalDeck:n.deck.filter(w=>W[w]),rivalLife:n.life});
  S.rules=14;S.stat={kills:0,said:0};S.newF=[];prevHand=null;S.story=id;S.mid=Date.now();S.rival={n:n.who.n,p:n.who.p,rank:n.who.role};
  say(S,n.place+'. '+n.rule,'t');
  for(const w of n.things||[])if(W[w])addThing(S,w,1,1,true);
  if(n.clime&&W[n.clime]){S.clime={w:n.clime,owner:1,made:true};say(S,Cap(n.clime)+' lies over the board.');if(typeof climeArrive==='function')climeArrive(S);}
  S.log0=S.log.length;S.live=true;clearUi();settings(false);vsScreen();}
function storyEnd(){const n=sNode(S.story),st=sSt(),win=S.over===0&&!S.quit;if(!n)return;
  st.log.push({n:n.id,r:win?'win':'loss',d:today()});if(st.log.length>200)st.log.shift();
  if(!win){st.lost[n.id]=(st.lost[n.id]||0)+1;const seen=[...new Set(n.deck)].filter(w=>W[w]&&!PF.owned[w]&&!(st.seen[n.id]||[]).includes(w));if(seen.length){const w=seen[Math.floor(Math.random()*seen.length)];(st.seen[n.id]=st.seen[n.id]||[]).push(w);jS.pop={kind:'glimpse',id:n.id,w};}else jS.pop={kind:'lost',id:n.id};}
  else if(!st.done[n.id]){st.done[n.id]=Date.now();if(n.pick){const opts=pick(n.pick.filter(w=>W[w]&&(PF.owned[w]||0)<1),3);jS.pop=opts.length?{kind:'pick',id:n.id,opts}:{kind:'won',id:n.id};}else{sLearn(n.word,n);jS.pop={kind:'learn',id:n.id,w:n.word};}}
  else jS.pop={kind:'won',id:n.id};
  jS.sel=n.id;save();}
function sLearn(w,n){if(!W[w])return;const st=sSt();PF.owned[w]=(PF.owned[w]||0)+1;if(!st.hoard[w])st.hoard[w]={by:n.who?n.who.n:n.place,at:n.place,m:0,last:0};if(PF.deck.length<perks(rankOf(PF.xp)).deckMax&&!PF.deck.includes(w))PF.deck.push(w);}
function sUsed(ws){if(!PF.story||!S)return;const st=sSt(),mid=S.mid||(S.mid=Date.now());let ch=false;for(const w of ws){const h=st.hoard[w];if(h&&h.last!==mid){h.last=mid;h.m=(h.m||0)+1;ch=true;if(h.m===2)say(S,'You have made '+w+' your own. It is kept in your wordhoard.');}}return ch;}
function renderStory(){if(view!=='story')return;const host=$('view-story'),st=sSt();
  if(!host.querySelector('.storyscene'))host.innerHTML='<div class="scene storyscene"><div class="scenetop"><div class="booktabs" id="j-tabs"></div><span class="j-reg"><b>'+esc(STORY.region)+'</b><small>'+esc(STORY.stage)+'</small></span><span class="ctr" id="j-ctr"></span></div><div id="j-body"></div></div>';
  $('j-tabs').innerHTML=[['map','The road'],['hoard','Wordhoard'],['chron','Chronicle']].map(([k,l])=>'<button class="tab'+(jS.tab===k?' on':'')+'" data-act="jtab" data-v="'+k+'">'+l+'</button>').join('');
  const hw=Object.keys(st.hoard),kept=hw.filter(w=>st.hoard[w].m>=2).length,mains=STORY.nodes.filter(n=>n.main);
  $('j-ctr').innerHTML='<img src="assets/fr/seal.webp" alt="" style="width:24px;height:24px"><b>'+mains.filter(n=>st.done[n.id]).length+'/'+mains.length+'</b><small>stamps · '+kept+' of '+hw.length+' words kept</small>';
  const body=$('j-body');
  if(jS.tab==='map'){
    if(!jS.sel||!sNode(jS.sel))jS.sel=(STORY.nodes.find(n=>sOpen(n)&&!st.done[n.id])||STORY.nodes[STORY.nodes.length-1]).id;
    const mainPts=mains.map(n=>n.x+','+n.y).join(' '),walked=mains.filter((n,i)=>i===0||st.done[mains[i-1].id]).map(n=>n.x+','+n.y).join(' ');
    const sides=STORY.nodes.filter(n=>!n.main).map(n=>{const a=sNode(n.need[0]);return '<line x1="'+a.x+'" y1="'+a.y+'" x2="'+n.x+'" y2="'+n.y+'" class="jside'+(sOpen(n)?' on':'')+'"/>';}).join('');
    const old=body.querySelector('.jmap'),sc=old?old.scrollLeft:null;
    body.innerHTML='<div class="jcols"><div class="jmap"><div class="jcanvas"><svg viewBox="0 0 2100 640" preserveAspectRatio="none" aria-hidden="true">'+sides+'<polyline points="'+mainPts+' 2010,330" class="jroad"/><polyline points="'+walked+'" class="jroad walked"/></svg>'
      +STORY.nodes.map(n=>{const open=sOpen(n),done=st.done[n.id],cls=(done?' done':open?' open':' shut')+(jS.sel===n.id?' sel':'')+(n.main?' main':'')+(n.gate?' gate':'')+' k-'+n.kind;
        return '<button class="jnode'+cls+'" style="left:'+n.x+'px;top:'+n.y+'px" data-act="jsel" data-v="'+n.id+'" aria-label="'+esc(n.place)+(done?', done':open?'':', not yet reachable')+'">'+(n.who?'<img src="'+rvImg({p:n.who.p})+'" alt="">':'<i>?</i>')+(done?'<img class="jst" src="assets/fr/seal.webp" alt="">':'')+(st.lost[n.id]&&!done?'<u title="Lost here">✕</u>':'')+'<span>'+esc(n.place)+'</span></button>';}).join('')
      +'<div class="jfar" style="left:1900px;top:250px"><b>The White Road</b><small>Albedo · sealed until the Black Gate is passed</small></div></div></div><aside class="jside-p" id="j-side"></aside></div>';
    const mp=body.querySelector('.jmap'),sn=sNode(jS.sel);mp.scrollLeft=sc!=null?sc:Math.max(0,sn.x-420);
    $('j-side').innerHTML=sideHtml(sn);
  }else if(jS.tab==='hoard'){
    body.innerHTML='<div class="jbook"><h3>The wordhoard of a journeyman</h3><p class="jlead">A word is <b>met</b> when someone teaches it to you. It is <b>kept</b> once you have made it work in two different duels.</p><div class="jhoard">'+STORY.nodes.map(n=>{const done=st.done[n.id],ws=n.word?[n.word]:Object.keys(st.hoard).filter(w=>st.hoard[w].at===n.place);
      const slot=w=>{const h=st.hoard[w];return h?'<figure class="'+(h.m>=2?'kept':'met')+'"><div class="card mini static '+W[w].t+'" tabindex="0" data-pv="'+esc(w)+'">'+miniFace(w,{ink:W[w].syl,lv:PF.up[w]||0,up:PF.up})+'</div><figcaption>'+(h.m>=2?'kept':'met · used in '+(h.m||0)+' of 2 duels')+'</figcaption></figure>':'';};
      return '<section class="'+(done?'done':'')+'"><header>'+(done?'<img src="assets/fr/seal.webp" alt="stamped">':'<i></i>')+'<div><b>'+esc(n.place)+'</b><small>'+(n.who?esc(n.who.n)+', '+esc(n.who.role.toLowerCase()):'a riddle')+'</small></div></header>'+(ws.filter(w=>st.hoard[w]).map(slot).join('')||'<figure class="empty"><div class="jempty">?</div><figcaption>'+(sOpen(n)?'not yet met':'further down the road')+'</figcaption></figure>')+'</section>';}).join('')+'</div></div>';
  }else{
    const L=st.log.slice().reverse();body.innerHTML='<div class="jbook"><h3>Chronicle of the road</h3><ol class="jchron">'+(L.map(e=>{const n=sNode(e.n);if(!n)return '';const who=n.who?n.who.n:'the Riddle Stone';
      return '<li class="'+e.r+'">'+(e.r==='win'?'You '+(n.kind==='riddle'?'answered '+who:'beat '+esc(who))+' at '+esc(n.place)+(e.first&&e.w?' and learned <b>'+esc(e.w)+'</b>':'')+'.':e.r==='loss'?'You lost to '+esc(who)+' at '+esc(n.place)+'.':'You guessed wrongly at '+esc(n.place)+'.')+'</li>';}).join('')||'<li>You have not yet left the scriptorium.</li>')+'<li class="start">You were bound apprentice to Anselm Roux of Emberwick, and ground his ink for seven years.</li></ol></div>';
  }
  popHtml();fit();}
function sideHtml(n){const st=sSt(),open=sOpen(n),done=st.done[n.id],lost=st.lost[n.id]||0;
  if(n.kind==='riddle')return '<h3>'+esc(n.place)+'</h3><p class="jspot">'+esc(n.spot)+'</p>'+(open?'<pre class="jriddle">'+esc(n.text)+'</pre>'+(done?'<p class="jdone">Answered. It taught you <b>'+esc(n.word)+'</b>.</p>':'<div class="jans"><input id="j-ans" type="text" autocomplete="off" placeholder="Your answer" aria-label="Your answer"><button class="btn" data-act="jans">Say it</button></div>'+(lost?'<p class="jhint">'+(lost>=2?esc(n.hint):'Not that. The stone is patient.')+'</p>':'')+'<p class="jrew">Reward: a word.</p>'):'<p class="jshut">You cannot reach this yet.</p>');
  const line=done?n.lines.won:lost?n.lines.again:n.lines.meet,seen=st.seen[n.id]||[];
  return '<div class="jwho"><img src="'+rvImg({p:n.who.p})+'" alt=""><div><h3>'+esc(n.who.n)+'</h3><small>'+esc(n.who.role)+'</small></div></div><p class="jspot">'+esc(n.place)+' · '+esc(n.spot)+'</p>'
    +(open?'<blockquote>'+esc(line)+'</blockquote><h4>House rule</h4><p class="jrule">'+esc(n.rule)+'</p><h4>'+(done?'Taught you':'Teaches')+'</h4><p class="jrew">'+(n.pick?(done?'Your pick of the road’s words.':'Your pick of one from three local words.'):(done?'<b>'+esc(n.word)+'</b>':'One word, kept secret until you win.'))+'</p>'
      +(seen.length&&!done?'<p class="jseen">Words you marked in '+(n.who.n.split(' ')[0])+'’s hand: <b>'+seen.map(esc).join(', ')+'</b></p>':'')
      +'<button class="mbtn main" data-act="jduel" data-v="'+n.id+'">'+(done?'Duel again':lost?'Try again':'Duel')+'</button><p class="jfree">'+(done?'A friendly rematch.':'Losing costs nothing. You may try as often as you like.')+'</p>'
      :'<p class="jshut">'+(n.gate?'The gate is far off yet.':'You cannot reach this yet.')+'</p>');}
function popHtml(){let e=document.getElementById('jpop');if(e)e.remove();const p=jS.pop;if(!p||view!=='story')return;const n=sNode(p.id);if(!n)return;e=document.createElement('div');e.id='jpop';
  const card=w=>'<div class="jpc">'+fullFace(w,{ink:W[w].syl,lv:PF.up[w]||0,up:PF.up})+'</div>',who=n.who?n.who.n:n.place;
  let h='';
  if(p.kind==='learn')h='<small>'+esc(n.place)+'</small><h2>A word is given</h2>'+card(p.w)+'<p>'+esc(who)+' taught you <b>'+esc(p.w)+'</b>. It is in your hoard'+(PF.deck.includes(p.w)?' and your deck':'')+'.</p>'+(n.lines?'<blockquote>'+esc(n.lines.win)+'</blockquote>':'')+'<button class="btn" data-act="jpopx">Take it and go on</button>';
  else if(p.kind==='pick')h='<small>'+esc(n.place)+'</small><h2>Take your pick</h2><p>'+esc(n.lines.win)+'</p><div class="jpick">'+p.opts.map(w=>'<button data-act="jpick" data-v="'+esc(w)+'" aria-label="Take '+esc(w)+'">'+card(w)+'</button>').join('')+'</div><p>Choose one word to keep.</p>';
  else if(p.kind==='glimpse')h='<small>'+esc(n.place)+'</small><h2>Beaten, but not empty-handed</h2><blockquote>'+esc(n.lines.lose)+'</blockquote><p>You marked a word in '+esc(who.split(' ')[0])+'’s hand that you do not own:</p>'+card(p.w)+'<button class="btn" data-act="jpopx">Back to the road</button>';
  else if(p.kind==='lost')h='<small>'+esc(n.place)+'</small><h2>Beaten</h2><blockquote>'+esc(n.lines.lose)+'</blockquote><button class="btn" data-act="jpopx">Back to the road</button>';
  else h='<small>'+esc(n.place)+'</small><h2>Well fought</h2><blockquote>'+esc(n.lines?n.lines.win:'')+'</blockquote><button class="btn" data-act="jpopx">Back to the road</button>';
  e.innerHTML='<div class="jpbox">'+h+'</div>';document.body.appendChild(e);}
function storyAct(a,el){const st=sSt();
  if(a==='jtab'){jS.tab=el.dataset.v;sfx('page');peekHide();renderStory();return true;}
  if(a==='jsel'){jS.sel=el.dataset.v;sfx('tick');renderStory();return true;}
  if(a==='jduel'){storyStart(el.dataset.v);return true;}
  if(a==='jpopx'){jS.pop=null;sfx('stamp');renderStory();achCheck();return true;}
  if(a==='jpick'){const n=sNode(jS.pop.id),w=el.dataset.v;sLearn(w,n);const l=st.log[st.log.length-1];if(l){l.first=1;l.w=w;}jS.pop={kind:'learn',id:n.id,w};save();sfx('shimmer');renderStory();return true;}
  if(a==='jans'){const n=sNode(jS.sel),v=($('j-ans').value||'').trim().toLowerCase();if(!v)return true;if(n.ans.includes(v)){st.done[n.id]=Date.now();sLearn(n.word,n);st.log.push({n:n.id,r:'win',d:today(),first:1,w:n.word});jS.pop={kind:'learn',id:n.id,w:n.word};save();sfx('shimmer');}else{st.lost[n.id]=(st.lost[n.id]||0)+1;st.log.push({n:n.id,r:'miss',d:today()});save();sfx('nope');}renderStory();return true;}
  return false;}
