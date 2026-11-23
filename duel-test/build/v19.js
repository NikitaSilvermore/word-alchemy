/* v19: The Word wins by speaking spells. Every spell of The Word you speak lands on the rival.
   Gated on DTV>=19; load after v17.js. */
(function(){
'use strict';
if(!((window.DTV|0)>=19))return;
const isSpell=w=>W[w]&&schoolOf(w)==='word'&&((W[w].props||[]).includes('event')||(W[w].props||[]).includes('spell'));
window.DTV19SPELL=isSpell;
const words=(S,who,sen)=>{const h=S.players[who].hand,o=[];for(const r of [sen.subj,sen.obj])if(r&&r.k==='card'&&h[r.i])o.push(h[r.i]);if(sen.verb!=null&&h[sen.verb])o.push(h[sen.verb]);for(const i of sen.adjs||[])if(h[i])o.push(h[i]);return o;};
const _rs=resolve;resolve=function(S,who,sen){let sp=[];try{if(sen&&sen.veil==null)sp=words(S,who,sen).filter(isSpell);}catch(e){}
  const r=_rs.apply(this,arguments);
  try{if(r&&r.ok&&sp.length&&S.over==null){const ppl=S.things.filter(t=>t.side===who&&!isG(t)&&t.props.includes('voiced')&&schoolOf(t.w)==='word').length;
    const n=sp.length*(3+2*Math.min(3,ppl));say(S,'The spell lands: '+(who===0?'the rival':'you')+' take'+(who===0?'s ':' ')+n+(ppl?' ('+2*Math.min(3,ppl)+' more for '+(who===0?'your':'the rival’s')+' speakers)':'')+'.');damage(S,P(1-who),n,'spellword');
    if(S.things.some(t=>t.side===who&&t.w==='bard')){drawN(S,who,1);say(S,'The bard takes up the spell: '+(who===0?'you draw':'the rival draws')+' a word.');}
    checkOver(S);}}catch(e){console.error(e);}return r;};
const G=(w,s)=>{if(W[w])W[w].gloss=s;};
G('bard','Each time you speak a spell of The Word, you draw a word. Counts as a speaker: your spells hit 1 harder.');
for(const w of ['scribe','hermit','miser','alchemist','homunculus'])if(W[w]&&!/speaker/.test(W[w].gloss))W[w].gloss=W[w].gloss.replace(/\s*$/,'')+' A speaker: your spells of The Word hit 1 harder (up to 2).';
})();
