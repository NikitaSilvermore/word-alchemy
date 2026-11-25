// Which Responses are legal in Clause windows, and how often the response-aware bot uses each (30 seeded rc1 games).
const B=require('../src/bots'),E=require('../src/engine'),F=require('../src/formats');const {REF}=require('../data/reference_decks');
const ks=Object.keys(REF);const pol=()=> 'careful:journeyman:ra';const tally={};
for(let g=0;g<30;g++){const S=F.createFromFormat('grammar_v30_rc1',{decks:[REF[ks[g%10]],REF[ks[(g*7+3)%10]]],seed:900+g,first:g%2});
 E.setDecider(S,B.decider(pol));const ctl=B.controller(pol);const r0=ctl.respond;
 ctl.respond=(S2,side,kind)=>{const o=E.legalResponses(S2,side,kind);const r=r0(S2,side,kind);for(const x of o){const w=S2.players[side].hand.find(c=>c.pid===x.card).word;const k=kind[0]+':'+w;tally[k]=tally[k]||[0,0];tally[k][0]++;if(r&&r.card===x.card)tally[k][1]++;}return r;};
 for(let k=0;k<400&&S.over==null;k++)E.apply(S,B.chooseAction(S,pol),ctl);}
console.log(Object.entries(tally).sort((a,b)=>b[1][0]-a[1][0]).slice(0,25).map(([k,v])=>k+' '+v[1]+'/'+v[0]).join('\n'));
