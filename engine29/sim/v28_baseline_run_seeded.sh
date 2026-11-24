#!/bin/bash
# usage: run_seeded.sh VER jobs out port seed
cd /home/claude/dtest && python3 gbuild.py >/dev/null 2>&1 || { echo BUILD FAIL; exit 1; }
SEED=$5 python3 - <<'P'
import os
s=open('/home/claude/word-alchemy/duel-test/node/sim.js').read()
h=open('/home/claude/dtest/art/index.html').read();i=h.rindex('</body>')
seed=int(os.environ['SEED'])
pr="<script>(function(){let a=%d>>>0;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();</script>"%seed
j=h.index('<script')
h=h[:j]+pr+h[j:]
i=h.rindex('</body>')
open('/home/claude/dtest/art/simSeed.html','w').write(h[:i]+'<script>'+s+'</script>\n'+h[i:])
P
cd /home/claude/word-alchemy/duel-test/node && SIMPAGE=simSeed.html VER=$1 timeout 1700 python3 drv.py $2 $3 $4 2>&1|tail -1
