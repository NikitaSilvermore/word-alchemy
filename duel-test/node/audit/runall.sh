#!/bin/bash
cd /home/claude/h
timeout 170 python3 run.py all.json audit/lib.js audit/t1.js audit/t2.js audit/t3.js audit/t4.js audit/t5.js >/dev/null 2>&1
python3 - <<'P'
import json;d=json.load(open('/home/claude/h/all.json'))
tot=0;ps=0
for k in ["audit/t1.js","audit/t2.js","audit/t3.js","audit/t4.js","audit/t5.js"]:
  for r in d[k]:
    if r[1]=='info':continue
    tot+=1;ps+=r[1]=='pass'
    if r[1]!='pass': print(r[1],'|',r[0],'|',r[2][:330])
print(ps,'/',tot,d['_pageerrors'])
P
