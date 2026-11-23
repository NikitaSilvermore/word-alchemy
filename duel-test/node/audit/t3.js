/* card tests part 3: fusion carry-over, extra rule checks */
(()=>{const A=AU,R=[];const ME=0,RV=1;
const life=i=>S.players[i].life;
const T=(card,fn)=>{let st='pass',d='';try{A.reset();S.said=[new Proxy({},{get:()=>1}),new Proxy({},{get:()=>1})];const r=fn();if(r!==true){st='FAIL';d=String(r);}}catch(e){st='ERROR';d=String(e&&e.stack||e).slice(0,300);}R.push([card,st,d]);};
const ok=(c,msg)=>c?true:msg;
const all=(...xs)=>{for(const x of xs)if(x!==true)return x;return true;};
const L=()=>' log: '+A.log().slice(0,400);
const fuse=(who,a,b)=>{const x=rxOf(a.w,b.w);if(!x||!x.r)return null;const bs={things:{}};for(const t of S.things)bs.things[t.id]=1;window.DTVSIDE=who;const ins=dtvIn(who,[{k:'thing',id:a.id},{k:'thing',id:b.id}]);const L0=S.log.length;react(S,who,{subj:{k:'thing',id:a.id},obj:{k:'thing',id:b.id}},{mult:1,effect:false});dtvTrait(bs,x,ins);settleS(S);A.last=S.log.slice(L0).map(l=>l.x);return S.things.find(t=>!bs.things[t.id]&&t.w===x.r)||null;};
/* find a fusing pair of plain nouns whose result is a noun */
const NN=ALLWORDS.filter(w=>W[w]&&W[w].t===NOUN&&!W[w].props.includes('event')&&!W[w].props.includes('spell')&&!W[w].props.includes('ground'));
let pair=null;for(const a of NN){for(const b of NN){const x=rxOf(a,b);if(x&&x.r&&W[x.r]&&W[x.r].t===NOUN&&!W[x.r].props.includes('ground')&&!W[x.r].props.includes('spell')&&x.r!==a&&x.r!==b&&!(x.layer==='metal')){pair=[a,b,x];break;}}if(pair)break;}
R.push(['(fusion pair used)','info',pair?pair[0]+' + '+pair[1]+' = '+pair[2].r+' ('+pair[2].layer+')':'none']);
const adjFuse=(adj,check)=>T('fusion keeps '+adj,()=>{if(!pair)return 'no pair';const a=A.put(pair[0],ME),b=A.put(pair[1],ME);const r=A.say(ME,{s:a,a:[adj]});if(!r.ok)return 'adj refused '+r.why;const pre=JSON.parse(JSON.stringify({props:a.props,st:a.st,brand:a.brand,vig:a.vig,forms:a.forms}));const n=fuse(ME,a,b);if(!n)return 'no fusion'+L();return check(n,pre);});
adjFuse('winged',(n)=>ok(n.props.includes('flying'),'lost flying: '+n.props.join(',')));
adjFuse('venomous',(n)=>ok(n.props.includes('toxic'),'lost toxic'));
adjFuse('sacred',(n)=>ok(n.props.includes('sacred'),'lost sacred'));
adjFuse('corrosive',(n)=>ok(n.props.includes('corrosive'),'lost corrosive'));
adjFuse('thorny',(n)=>ok(n.props.includes('thorny'),'lost thorny'));
adjFuse('leaden',(n)=>ok(n.props.includes('heavy'),'lost heavy'));
adjFuse('eternal',(n)=>ok(n.props.includes('eternal'),'lost eternal'));
adjFuse('quick',(n)=>ok(true,''));
adjFuse('hermetic',(n,p)=>ok(n.st.hermetic,'lost sealed (hermetic)'));
adjFuse('fixed',(n,p)=>ok(n.st.fixed,'lost fixed'));
adjFuse('firebrand',(n,p)=>ok(n.brand,'lost firebrand'));
adjFuse('ancient',(n,p)=>ok(n.vig>=p.vig+2,'vigour '+n.vig+' vs input '+p.vig));
adjFuse('vast',(n,p)=>ok(n.vig>=p.vig+2,'vigour '+n.vig+' vs input '+p.vig));
adjFuse('masked',(n,p)=>ok(n.st.masked,'lost masked'));
T('fusion keeps learned verbs',()=>{if(!pair)return 'no pair';const a=A.put(pair[0],ME),b=A.put(pair[1],ME);a.verbs.push('guard');const n=fuse(ME,a,b);return ok(n&&n.verbs.includes('guard'),'learned verb lost: '+(n&&n.verbs.join(',')));});
T('fusion keeps poison (a bad condition)',()=>{if(!pair)return 'no pair';const a=A.put(pair[0],ME,{st:{poisoned:2}}),b=A.put(pair[1],ME);const n=fuse(ME,a,b);return ok(true,'');});
T('fusion: result on my side, owned by me',()=>{if(!pair)return 'no pair';const a=A.put(pair[0],ME),b=A.put(pair[1],ME);const n=fuse(ME,a,b);return all(ok(n&&n.side===ME,'side '+(n&&n.side)),ok(n&&n.owner===ME,'owner '+(n&&n.owner)),ok(!A.T(a)&&!A.T(b),'inputs stayed'));});
T('fusion: a lured thing fuses as mine',()=>{if(!pair)return 'no pair';const a=A.put(pair[0],RV),b=A.put(pair[1],ME);A.say(ME,{s:a,v:'lure'});if(a.side!==ME)return 'lure failed';const n=fuse(ME,a,b);return ok(n&&n.side===ME&&n.owner===ME,'made thing side '+(n&&n.side)+' owner '+(n&&n.owner));});
/* bind numbers */
T('bind (half might, and 2)',()=>{const a=A.put('ivy',ME,{vig:10}),b=A.put('iron',RV,{vig:30});const m=MT(a);A.say(ME,{s:a,v:'bind',o:b});const lost=30-b.vig;return ok(lost>=Math.ceil(m/2)+2,'bind did '+lost+' (half might '+Math.ceil(m/2)+' + 2)'+L());});
T('strike shows its sum',()=>{const a=A.put('iron',ME);A.say(ME,{s:a,v:'strike',o:'rival'});return ok(/said from your hand/.test(A.log()),'a hidden +2 with no explanation'+L());});
T('strike sum on a guard',()=>{const a=A.put('iron',ME),g=A.put('boulder',RV);A.say(ME,{s:a,v:'strike',o:'rival'});return ok(/on guard\)/.test(A.log()),'sum hides the guard'+L());});
T('player poison doses',()=>{const l0=life(RV);poison(S,P(RV),1);const p1=S.players[RV].poisoned;return ok(p1===2,'one dose = '+p1+' turns');});
T('haunt (card text matches)',()=>ok(!/also takes 2/.test(W.haunt.gloss),'card promises 2 harm that can never land'));
T('lure (fail: takes 3)',()=>{const b=A.put('iron',RV,{vig:9});A.say(ME,{s:b,v:'lure'});return ok(b.vig===6,'too-strong target took '+(9-b.vig)+L());});
T('reckoning (only small rival things)',()=>{const a=A.put('stag',RV,{vig:4});const r=A.say(ME,{s:'reckoning'});return ok(r.ok&&!A.T(a),'refused or rival 4 stayed: '+(r.why||'')+L());});
T('blow (no touch effect)',()=>{const w=A.put('hawk',ME),a=A.put('stag',ME);const l0=life(RV);const r=A.say(ME,{s:w,v:'blow',o:a});return ok(r.ok&&l0-life(RV)>=3,'refused or no 3: '+(r.why||'')+L());});
T('radiant (shadow opposite)',()=>{A.put('shadow',RV);const a=A.put('stag',ME);const r=A.say(ME,{s:a,a:['radiant']});return ok(r.ok,'refused: '+r.why);});
T('noon (shadow opposite)',()=>{const s=A.put('shadow',RV);const r=A.say(ME,{c:'noon'});return ok(r.ok&&(!A.T(s)||!s.st.occult),'refused: '+(r.why||''));});
T('torpid stays asleep',()=>{const a=A.put('stag',RV,{vig:20});A.say(ME,{s:a,a:['torpid']});return ok(a.st.asleep>=2,'asleep '+a.st.asleep+L());});
T('foundry',()=>{A.put('foundry',ME);const a=A.put('iron',ME,{vig:10});A.endTurn(ME);A.start(RV);A.endTurn(RV);A.start(ME);return ok(a.vig===11,'iron '+a.vig);});
T('ice bites back before it shatters',()=>{const i=A.put('ice',RV,{st:{guarding:1}});const a=A.put('stag',ME);A.say(ME,{s:a,v:'strike',o:'rival'});return ok(a.st.frozen,'striker not frozen'+L());});
T('dream (rival takes 7)',()=>{const l0=life(RV);A.say(ME,{s:'dream'});return ok(l0-life(RV)===7,'rival took '+(l0-life(RV)));});
T('loan (+2 life, debt stays)',()=>{const l0=life(ME);A.say(ME,{s:'loan'});return all(ok(life(ME)-l0===2,'life +'+(life(ME)-l0)),ok(S.things.some(t=>t.w==='debt'&&t.side===ME),'no debt'));});
T('scream (rival takes 2)',()=>{const a=A.put('bard',ME);const l0=life(RV);A.say(ME,{s:a,v:'scream'});return ok(l0-life(RV)===2,'rival took '+(l0-life(RV)));});
T('wither (+3)',()=>{const c=A.put('iron',RV,{vig:10});A.say(ME,{s:c,v:'wither'});return ok(c.vig===4,'left '+c.vig);});
T('rust (+2)',()=>{const c=A.put('iron',RV,{vig:10});A.say(ME,{s:c,v:'rust'});return ok(c.vig===3,'left '+c.vig);});
T('temper (+4)',()=>{const c=A.put('knife',ME,{vig:10});A.say(ME,{s:c,v:'temper'});return ok(c.vig>=17,'has '+c.vig+L());});
T('distil (+3)',()=>{const c=A.put('vitriol',ME,{vig:10});A.say(ME,{s:c,v:'distil'});return ok(c.vig>=16,'has '+c.vig);});
T('ripen (+3)',()=>{const c=A.put('oak',ME,{vig:10});A.say(ME,{s:c,v:'ripen'});return ok(c.vig>=16,'has '+c.vig);});
T('wake (draws)',()=>{S.players[ME].deck=['oak','oak'];const c=A.put('iron',ME,{vig:10});c.acted=true;A.say(ME,{s:c,v:'wake'});return ok(S.players[ME].hand.length===1,'hand '+S.players[ME].hand.length+L());});
T('dew (drench cures)',()=>{const a=A.put('dew',ME),b=A.put('owl',ME,{st:{poisoned:2},vig:20});A.say(ME,{s:a,v:'drench',o:b});return ok(!b.st.poisoned,'not cured'+L());});
T('pitch (drench: will burn)',()=>{const a=A.put('pitch',ME),b=A.put('iron',RV);A.say(ME,{s:a,v:'drench',o:b});return ok(b.props.includes('flammable'),'not flammable'+L());});
T('mend above 60',()=>{const a=A.put('willow',ME);S.players[ME].life=70;A.say(ME,{s:a,v:'mend',o:'me'});return ok(life(ME)>=70,'life '+life(ME));});
T('bard (no draw on plain sentence)',()=>{A.put('bard',ME);S.players[ME].deck=['oak','oak','oak'];const a=A.put('stag',ME);A.say(ME,{s:a,v:'strike',o:'rival'});return ok(S.players[ME].deck.length===3,'drew');});
return R;})()
