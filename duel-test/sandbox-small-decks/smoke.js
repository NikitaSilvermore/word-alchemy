const E=require('./load.js');const F=E.FIELD;let n=0,err=0,t0=Date.now(),len=0,w=[0,0,0];const size=+process.argv[2]||10;
for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){for(let k=0;k<2;k++){try{const G=E.bot.playGame({deck:size},E.deckOf(F[i],size),E.deckOf(F[j],size),1+n*7919,k,'aggressive','careful');n++;len+=G.turn;w[G.over]++;}catch(e){err++;if(err<6)console.log(F[i],F[j],e.stack.split('\n').slice(0,4).join(' | '));}}}
console.log('games',n,'errors',err,'ms/game',((Date.now()-t0)/n).toFixed(2),'avg turns',(len/n).toFixed(1),'wins p0/p1/draw',w);
