#!/bin/bash
# Browser-Prüfung für eine Liste von Apps in einem Worktree. Aufruf: messung-wt.sh <worktree> <ausgabeordner> <parallel> <app>…
W=$1; OUT=$2; P=$3; shift 3
mkdir -p "$OUT"
cd "$W" || exit 1
printf '%s\n' "$@" | xargs -P "$P" -I{} sh -c 'node tools/browser-pruefung.mjs "{}" - "'"$OUT"'" > "'"$OUT"'/{}.log" 2>&1; echo "{} $?" >> "'"$OUT"'/_exit.txt"'
echo FERTIG >> "$OUT/_exit.txt"
