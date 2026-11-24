#!/bin/sh
# Runs every option sweep in turn (2 worker processes at a time). Safe to rerun: each group overwrites its own results.
for g in grid dur gm copies schools today; do node sweeps.js levels.json $g ${1:-16} >> results/sweeps.log 2>&1; done; echo ALLDONE >> results/sweeps.log
