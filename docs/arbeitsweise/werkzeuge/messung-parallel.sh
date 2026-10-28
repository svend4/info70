#!/bin/bash
# Browser-Prüfung für eine Liste von Apps, parallel. Aufruf: messung-parallel.sh <ausgabeordner> <app>…
OUT=$1; shift
mkdir -p "$OUT"
cd /home/user/info70 || exit 1
printf '%s\n' "$@" | xargs -P 6 -I{} sh -c 'node tools/browser-pruefung.mjs "{}" - "'"$OUT"'" > "'"$OUT"'/{}.log" 2>&1; echo "{} $?" >> "'"$OUT"'/_exit.txt"'
echo FERTIG >> "$OUT/_exit.txt"
