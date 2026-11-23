(()=>{const A=AU,o=[];A.reset();
const h=A.put('hawk',0),b=A.put('boulder',1);let L0=S.players[1].life;let r=A.say(0,{s:h,v:'strike',o:'rival'});o.push(['hawk strike vs boulder',r,A.log(),S.players[1].life-L0,A.T(b)&&b.vig]);
A.reset();const w=A.put('wolf',0);const r2=A.say(0,{s:'hare',v:'bite',o:'rival'});o.push(['hare swift bite',r2,A.log()]);
return o;})()
