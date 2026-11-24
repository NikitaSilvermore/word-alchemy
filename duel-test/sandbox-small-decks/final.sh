#!/bin/sh
# The final theme-against-theme matrix at the recommended table: 4 chunks of 504 games per pairing (2,016 in all), different seeds.
node -e "
const fs=require('fs');const {overrides}=require('./tune.js');const tune=overrides(JSON.parse(fs.readFileSync('levels.json')));const chars=JSON.parse(fs.readFileSync('chars.json'));const rec=JSON.parse(fs.readFileSync('recommended.json'));
for(let k=1;k<=4;k++)fs.writeFileSync('results/_final'+k+'.json',JSON.stringify({name:'final'+k,cfg:rec,games:504,tune,chars,seed:9000+k*131}));"
for k in 1 2 3 4; do [ -f results/final_$k.json ] || node run.js results/_final$k.json results/final_$k.json >> results/final.log 2>&1; done
node storywords.js levels.json 64 > results/storywords.log 2>&1
node sweeps.js levels.json dur 16 > results/dur2.log 2>&1
echo FINALDONE >> results/final.log
