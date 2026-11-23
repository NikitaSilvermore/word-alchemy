const fs=require('fs'),vm=require('vm');
const g={console,Math,JSON,Date,setTimeout,clearTimeout,setInterval:()=>0,clearInterval:()=>0,performance:{now:()=>Date.now()},requestAnimationFrame:()=>0};g.window=g;g.globalThis=g;g.DTV=14;g.document={addEventListener(){},createElement(){return{style:{},appendChild(){}}},head:{appendChild(){}},body:{classList:{add(){},remove(){},toggle(){}},appendChild(){}},querySelector(){return null},querySelectorAll(){return[]}};g.addEventListener=()=>{};g.localStorage={getItem(){return null},setItem(){}};
vm.createContext(g);
for(const f of ['engine.js','web21.js','web14.js','dtv.js','v8.js','v13.js','v14.js'])try{vm.runInContext(fs.readFileSync(''+__dirname+'/../src/'+f,'utf8'),g,{filename:f});console.log('loaded',f);}catch(e){console.log('ERR',f,e.message.slice(0,200));}
vm.runInContext("var S=newGame(1,{});console.log('cards',Object.keys(W).length,'life',S.players[0].life,'v',typeof VERBF.seep, 'MT', typeof MT)",g);
