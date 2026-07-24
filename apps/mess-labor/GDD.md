# Kurz-GDD: Mess-Labor 🔬

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 27 — «Mess-Labor der
kleinen Forscher». **Engine:** geführter Forschungskreis (reine Logik).
Zielgruppe: 5–7 (Ko-Nutzung) / 8–12.

## 1. Kernaussage

Acht Mess-Experimente mit Haushaltsdingen (Länge, Gewicht, Volumen, Zeit,
Temperatur) im Forschungskreis Vermuten → Ausprobieren → Schlussfolgern.
Die App ist Sprungbrett und Forschungs-Heft: Sie sammelt die Vermutung, das
echte Experiment passiert OHNE Bildschirm; danach Vergleich + Erkenntnis.

## 2. Zielgruppe

Kinder/Familie. Nachbarn: nahrungsnetz-werkstatt, jahreszeiten-rad,
mathe-entdecker, familien-budget.

## 3. Ablauf

1) Experiment aus 8 wählen.
2) Vermuten: Frage + 3 Vermutungs-Optionen (vorlesbar).
3) Ausprobieren: „📵 Gerät weglegen!“ + Material + Anleitung (vorlesbar).
4) Zurückkommen, beobachtetes Ergebnis wählen.
5) Schlussfolgern: Vergleich (ohne Scham – widerlegte Vermutung = Erfolg),
   Forscher-Satz, „Warum ist das so?“-Erkenntnis.

## 4. Didaktik / Nutzen

Entspricht dem Forschungskreis der frühen MINT-Bildung (Vermutung–Prüfung–
Schlussfolgerung; eigene Inhalte, keine übernommenen Texte). Das Prinzip
„App als Sprungbrett zum echten Experiment“ entkräftet die zentrale
Bildschirmzeit-Kritik. Messkonzepte ohne Zahlenzwang (Schnur, Schritte,
Becher als Einheit → warum es den Meter gibt). Sicherheits-Hinweise
(Erwachsene bei Wasser/Küche) stehen im Material – per Test gesichert.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**.
Vorlesen (BFSG). Kinder-App mit eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Bank gültig (≥6 Experimente, 3 Vermutungen/Ergebnisse,
Erkenntnis ≥60 Zeichen), Sprungbrett-/Keine-Scham-Hinweis, Erwachsenen-Hinweis
bei allen Wasser-Experimenten, Mess-Themen-Abdeckung (Länge/Gewicht/Volumen/
Zeit/faire Messung/Einheiten), `vergleicheVermutung` (beide Wege positiv,
keine Beschämung), `forscherSatz`.

## 7. Erweiterungen (Katalog)

Druckbares Forscher-Heft (Protokollbogen), Jahreszeiten-Experimente,
Kopplung mit mathe-entdecker und einem künftigen Mini-Gärtner-Begleiter.
