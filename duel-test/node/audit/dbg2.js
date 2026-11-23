(()=>{const out=[];const _f=fresh;window.fresh=function(){_f.apply(this,arguments);for(const p of S.players){let v=p.well||0;Object.defineProperty(p,'well',{configurable:true,enumerable:true,get(){return v;},set(x){if(x>0&&out.length<3)out.push(String(new Error().stack).split('\n').slice(1,6).join(' / ').slice(0,700));v=x;}});}};
for(let k=0;k<10&&out.length<3;k++){SIM.batch([{d0:{gen:'starter',s:'word'},d1:{gen:'starter',s:'word'},opt:{first:k%2}}]);}
return out;})()
