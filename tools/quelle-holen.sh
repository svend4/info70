#!/usr/bin/env bash
# Holt PRALESKA.pdf aus origin/main und erzeugt die Textkopie für tools/bauauftrag-pruefen.mjs.
# Aufruf: tools/quelle-holen.sh <Zielordner-außerhalb-des-Repos>
#
# Die Datei liegt im Repository auf dem Branch main (Commit c3deddf), nicht auf der
# Arbeitsbranche. Das Skript liest sie nur aus, mergt nichts und committet nichts.
#
# Die Textschicht des PDFs ist kyrillisch in Windows-1251 gespeichert, pdftotext liest sie als
# Latin-1. Das Skript dekodiert jedes Zeichen unter 256 als Windows-1251 neu. Danach stimmen alle
# Seiten Wort für Wort mit der Arbeitskopie überein (geprüft mit 321 von 321 Seiten).
set -euo pipefail

ZIEL="${1:?Zielordner angeben (außerhalb des Repos)}"
mkdir -p "$ZIEL"

git show origin/main:PRALESKA.pdf > "$ZIEL/PRALESKA.pdf"
pdftotext -layout "$ZIEL/PRALESKA.pdf" "$ZIEL/roh.txt"

python3 - "$ZIEL" <<'PYEOF'
import sys, pathlib
ziel = pathlib.Path(sys.argv[1])
roh = (ziel / 'roh.txt').read_text(encoding='utf-8')
fixed = ''.join(bytes([ord(c)]).decode('cp1251') if ord(c) < 256 else c for c in roh)
(ziel / 'all.txt').write_text(fixed, encoding='utf-8')
seiten = fixed.split('\f')
print('Seiten (ohne leeres Ende):', len([s for s in seiten if s.strip()]))
print('Seite 52, Anfang:', seiten[51][:60].strip())
PYEOF

echo "Fertig: $ZIEL/all.txt"
echo "Prüfung: node tools/bauauftrag-pruefen.mjs $ZIEL/all.txt"
