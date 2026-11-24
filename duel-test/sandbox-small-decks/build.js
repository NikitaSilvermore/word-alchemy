/* Builds the playable sandbox page (index.html) from ui.html and the engine files. node build.js */
const fs=require('fs');const rd=f=>fs.readFileSync(__dirname+'/'+f,'utf8');
let h=rd('ui.html');const tune=fs.existsSync(__dirname+'/tune.json')?rd('tune.json'):'{}';const rec=fs.existsSync(__dirname+'/recommended.json')?rd('recommended.json'):'{"deck":10,"hand":5,"dur":1.5,"grave":true,"market":false}';
const put=(k,v)=>{if(!h.includes(k))throw new Error('missing '+k);h=h.split(k).join(v.replace(/<\/script/g,'<\\/script'));};
put('/*ENGINE*/',rd('engine.js'));put('/*CARDS1*/',rd('cards1.js'));put('/*CARDS2*/',rd('cards2.js'));put('/*THEMES*/',rd('themes.js'));put('/*BOT*/',rd('bot.js'));put('/*TUNE*/{}',tune);put('/*REC*/{deck:10,hand:5,dur:1.5,grave:true,market:false}',rec);
fs.writeFileSync(__dirname+'/index.html',h);console.log('index.html',h.length,'bytes');
