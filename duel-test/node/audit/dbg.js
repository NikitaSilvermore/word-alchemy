(()=>{const A=AU,o=[];const ME=0,RV=1;
A.reset();let w=A.put('wind',ME),a=A.put('stag',ME);let r=A.say(ME,{s:w,v:'blow',o:a});o.push(['wind blow',r,A.log()]);
A.reset();w=A.put('hawk',ME);a=A.put('stag',ME);r=A.say(ME,{s:w,v:'blow',o:a});o.push(['hawk blow',r,A.log()]);
A.reset();A.put('shadow',RV);a=A.put('stag',ME);r=A.say(ME,{s:a,a:['radiant']});o.push(['radiant',r,A.log()]);
A.reset();a=A.put('stag',RV);r=A.say(ME,{s:a,a:['torpid']});o.push(['torpid',r,A.log(),JSON.stringify(a.st)]);
A.reset();a=A.put('shadow',RV);r=A.say(ME,{c:'noon'});o.push(['noon',r,A.log(),JSON.stringify(a.st),S.things.includes(a)]);
A.reset();r=A.say(ME,{s:'debt'});const d=S.things.find(t=>t.w==='debt');S.players[RV].coins=0;const L=S.log.length;endTurn(S,0,true);startTurn(S,1);o.push(['debt',r,d&&d.side,S.log.slice(L).map(x=>x.x).join(' | ')]);
A.reset();A.put('foundry',ME);a=A.put('iron',ME);const L2=S.log.length;endTurn(S,0,true);startTurn(S,1);endTurn(S,1,true);startTurn(S,0);o.push(['foundry',a.vig,S.log.slice(L2).map(x=>x.x).join(' | ')]);
A.reset();a=A.put('ivy',ME);const b=A.put('owl',RV,{vig:20});o.push(['ivy MT',MT(a)]);r=A.say(ME,{s:a,v:'bind',o:b});o.push(['bind',b.vig,A.log()]);
return o;})()
