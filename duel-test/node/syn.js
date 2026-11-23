const fs=require('fs'),vm=require('vm');
const D='/home/claude/word-alchemy/duel-test/src/';
const g={console,Math,JSON,Date,setTimeout:(f)=>{try{f()}catch(e){}},clearTimeout,setInterval:()=>0,clearInterval:()=>0,performance:{now:()=>Date.now()},requestAnimationFrame:()=>0};g.window=g;g.globalThis=g;g.DTV=+(process.env.DTV||16);g.document={addEventListener(){},createElement(){return{style:{},appendChild(){}}},head:{appendChild(){}},body:{classList:{add(){},remove(){},toggle(){}},appendChild(){}},querySelector(){return null},querySelectorAll(){return[]}};g.addEventListener=()=>{};g.localStorage={getItem(){return null},setItem(){}};
vm.createContext(g);
for(const f of ['engine.js','web21.js','web14.js','dtv.js','v8.js','v13.js','v16.js','v17.js','v14.js'])vm.runInContext(fs.readFileSync(D+f,'utf8'),g,{filename:f});
const data=JSON.parse(vm.runInContext(`(function(){const r=[];for(const w in W){const d=W[w];if(d.token||!ALLWORDS.includes(w)||DTVX7.includes(w))continue;let ab=[];if(d.t===NOUN){try{ab=abilities(d.props,{})}catch(e){}}r.push({w,t:d.t,sch:schoolOf(w),props:d.props||[],ab,match:d.match||null});}return JSON.stringify(r);})()`,g));
const H=(p,...k)=>k.some(x=>p.includes(x));
// enabling/bonus condition for each support word: f(props,w) -> true if this noun "works with" it
const AG={bite:p=>H(p,'beast','human'),crush:p=>H(p,'heavy','wood','stone'),cut:p=>H(p,'sharp','thorny','sting','bird','brittle'),sting:p=>H(p,'sting','thorny','serpent')||(H(p,'beast')&&H(p,'toxic')),
 drench:p=>H(p,'liquid','damp'),seep:p=>H(p,'liquid'),dissolve:p=>H(p,'liquid','corrosive'),toxify:p=>H(p,'toxic'),bind:p=>H(p,'binder','serpent','wood','frost'),blow:p=>H(p,'wind','flying','bird','blower'),
 burn:p=>H(p,'fireborn','spark','explosive','pyro','flame','quicklime','flammable'),blind:p=>H(p,'bright','dust','dark','damp'),haunt:p=>H(p,'spirit','dark'),petrify:p=>H(p,'petrifier','serpent','stone'),steal:p=>H(p,'thief','carrion','dark','nocturnal'),
 mend:p=>H(p,'herb','adept','nurse','herbalist','elixir','pure'),eat:p=>H(p,'beast','human'),drink:p=>H(p,'liquid'),scream:p=>H(p,'voiced'),
 // spells: the noun gets the better (named) effect
 temper:p=>H(p,'metal','sharp'),distil:p=>H(p,'liquid'),ripen:p=>H(p,'plant','sprout'),grow:p=>H(p,'plant'),crown:p=>H(p,'living'),tame:p=>H(p,'beast'),awaken:p=>!H(p,'living')&&!H(p,'event','spell','concept'),sleep:p=>H(p,'beast','human'),
 wake:p=>H(p,'stone'),thaw:p=>H(p,'ice','frost'),kindle:p=>H(p,'fireborn','flammable','spark','flame')/*fire flavour*/,
 // adjectives with a typed bonus
 feral:p=>H(p,'beast'),burning:p=>H(p,'fireborn','flame','spark'),radiant:p=>H(p,'bright'),sodden:p=>H(p,'liquid','damp'),corrosive:p=>H(p,'liquid'),frozen:p=>H(p,'ice','frost'),leaden:p=>H(p,'heavy','metal','stone'),venomous:p=>H(p,'toxic'),winged:p=>H(p,'flying','bird'),occult:p=>H(p,'spirit','dark'),masked:p=>H(p,'spirit','dark'),
 sacred:p=>H(p,'sacred'),thorny:p=>H(p,'plant'),fixed:p=>H(p,'stone','metal'),brittle:p=>H(p,'brittle'),
 // weathers: the special clause
 drought:p=>H(p,'fireborn','flammable'),noon:p=>H(p,'bright'),rain:p=>H(p,'liquid','plant'),flood:p=>H(p,'liquid','damp'),storm:p=>H(p,'flying','wind'),flux:p=>H(p,'flying','wind'),winter:p=>H(p,'ice','frost','stone'),desert:p=>H(p,'stone','heavy'),
 spring:p=>H(p,'egg','sprout','plant'),harvest:p=>H(p,'plant'),night:p=>H(p,'dark','spirit','nocturnal'),fog:p=>H(p,'dark','spirit'),
 // categories
 liquids:p=>H(p,'liquid'),birds:p=>H(p,'flying','bird'),stones:p=>H(p,'stone'),metals:p=>H(p,'metal'),beasts:p=>H(p,'beast'),plants:p=>H(p,'plant'),spirits:p=>H(p,'spirit'),
 // rot removal: works against opposite nouns; mark as targeting rival kinds
 rust:p=>H(p,'metal'),wither:p=>H(p,'plant'),decay:p=>true};
const GEN=['strike','guard','gild','coagulate','measure','enchant','forget','protect','lure','summon','dispel','sacrifice','ferment','quick','resonant','volatile','vast','ancient','feeble','torpid','hermetic','twin','eternal','mistletoe'];
const AGAINST=['rust','wither','tame','sleep','rain','desert','winter','sodden','frozen','radiant']; // affect rival kinds; partner measure = opponent kinds
const S7=['fire','water','air','earth','life','rot','word'];
const bodies=s=>data.filter(x=>x.sch===s&&x.t==='noun'&&!H(x.props,'event','spell','concept'));
const out={};
for(const s of S7){const sup=data.filter(x=>x.sch===s&&x.t!=='noun'||(x.sch===s&&x.t==='noun'&&H(x.props,'event','spell','concept','ground')));
 const rows=[];for(const x of sup){const f=AG[x.w];const row={w:x.w,t:x.t};if(!f){row.kind=GEN.includes(x.w)?'generic':'other';rows.push(row);continue;}
   row.kind=AGAINST.includes(x.w)?'against':'typed';for(const s2 of S7){const B=bodies(s2);row[s2]=Math.round(100*B.filter(b=>f(b.props,b.w)).length/Math.max(1,B.length));}rows.push(row);}
 out[s]=rows;}
// noun-side: for each school's bodies, share that can use >=1 same-school typed agent verb beyond strike/guard
fs.writeFileSync('/tmp/wa/syn.json',JSON.stringify(out));
for(const s of S7){console.log('==',s,'bodies',bodies(s).length);for(const r of out[s]){if(r.kind==='generic'||r.kind==='other'){console.log(' ',r.w,r.t,r.kind);continue;}console.log(' ',r.w,r.t,r.kind,S7.map(z=>z.slice(0,2)+':'+r[z]).join(' '));}}
