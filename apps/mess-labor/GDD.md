# Kurz-GDD: Mess-Labor 🔬

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 27 — «Mess-Labor der
kleinen Forscher». **Bauauftrag:** GEM-22 (Ausbau). **Engine:** geführter
Dreischritt (reine Logik). Zielgruppe: 5–7 (Ko-Nutzung) / 8–12.

## 1. Kernaussage

Zehn Mess-Experimente mit Haushaltsdingen (Länge, Gewicht, Volumen, Zeit,
Temperatur) im Dreischritt Vermuten → Ausprobieren → Schlussfolgern.
Die App ist Sprungbrett und Forschungs-Heft: Sie sammelt die Vermutung, das
echte Experiment passiert OHNE Bildschirm; danach Vergleich + Erkenntnis.

## 2. Zielgruppe

Kinder/Familie. Nachbarn: nahrungsnetz-werkstatt, jahreszeiten-rad,
mathe-entdecker, familien-budget.

## 3. Ablauf

1) Experiment aus 10 wählen.
2) Vermuten: Frage + 3 Vermutungs-Optionen (vorlesbar).
3) Ausprobieren: „📵 Gerät weglegen!“ + Material + Anleitung (vorlesbar).
4) Zurückkommen, beobachteten Befund wählen (3 Optionen).
5) Schlussfolgern: Vergleich (ohne Scham – widerlegte Vermutung = Erfolg),
   Forscher-Satz, „Warum ist das so?“-Erkenntnis.

Nach jedem Schritt liegt der Fokus auf der Überschrift des neuen Bildschirms;
Knöpfe tragen eine feste Kennung (`data-kennung`) für die Browser-Prüfung.

## 4. Geräte und Experimente

| Gerät (Quelle S. 289 nennt Waage, Becher, Lineal, Thermometer, Lupe; die Schnur nicht) | Experimente |
|---|---|
| Waage (Hände oder Küchenwaage) | apfel-kartoffel |
| Messbecher | becher-flasche |
| Schnur (Eigenentwurf) oder Lineal | fuss-hand, lineal-stift |
| Thermometer (optional) | fenster-boden |
| Lupe | lupe-oberflaeche |

Die Geräteaufzählung stammt aus S. 289. Das Feld `quelle` trägt die Seitenangabe
bei lupe-oberflaeche und lineal-stift. Alle zehn Experimente sind Eigenentwurf
(`eigenentwurf: true`). Die Prüfung in `pruefeExperimente` verlangt je Gerät
mindestens ein Experiment.

Neu in dieser Einheit: Lupe (`lupe-oberflaeche`) und Lineal (`lineal-stift`),
beide Eigenentwurf. Die Küchenwaage im Apfel-Experiment nennt jetzt den großen
Menschen als Hilfe.

## 5. Didaktik / Nutzen

Der Ablauf Vermutung–Prüfung–Schlussfolgerung ist ein eigener Entwurf (eigene
Inhalte, keine übernommenen Texte). Der Katalog docs/10 nennt als Bezug die
Stiftung Kinder forschen; die Textkopie der Quelle (S. 288–290) enthält diesen
Namen nicht. Das Prinzip
„App als Sprungbrett zum echten Experiment“ entkräftet die zentrale
Bildschirmzeit-Kritik. Messkonzepte ohne Zahlenzwang (Schnur, Schritte,
Becher als Einheit → warum es den Meter gibt), mit dem Lineal als fester
Einheit in Zentimetern. Sicherheits-Hinweise (Erwachsene bei Wasser/Küche)
stehen im Material – per Test gesichert.

## 6. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**.
Keine Eingabefelder. Vorlesen (BFSG). Kinder-App mit eltern.html, im Sammelband.
Knöpfe und Fußlinks mindestens 48 px hoch, Layout ab 360 px ohne Überlauf.
Kein Druckblatt in dieser Einheit, keine Druckfassung. `druck.css` (von
index.html und eltern.html eingebunden) blendet beim Drucken den Bildschirm
(`#app`) und die Schmuck-Emojis (Klasse `ml-nur-bildschirm`) aus.

## 7. Tests

Testzahl: 24 Tests (`npm test` im App-Ordner).

`test/logik.test.mjs`: Bank gültig (≥10 Experimente, 3 Vermutungen/Ergebnisse,
Erkenntnis ≥60 Zeichen), Sprungbrett-/Keine-Scham-Hinweis, Erwachsenen-Hinweis
bei allen Wasser-Experimenten, Mess-Themen-Abdeckung, `vergleicheVermutung`
(beide Wege positiv, keine Beschämung), `forscherSatz`, Geräte-Abdeckung,
Prüfung schlägt an (fehlendes Gerät, fehlender Hinweis, zu wenige Experimente),
Seitenangabe bei Quellen.

`test/regeln.test.mjs`: Projektregeln nach der Vorlage der
Puppentheater-Werkstatt, für diese App angepasst: keine Eingabefelder, keine
Speicherung, keine externen Adressen (nur `fetch` auf die eigene Datei),
kein Zufall und keine Uhr, kein Druckblatt (keine Druckfunktion; druck.css nur zum
Ausblenden), Grundgerüst und CSP, aria-live,
Netzwerk-Wächter, Knopfhöhe, Fußlinks 48 px, Fokus-Kennungen, Begriffsregel,
keine Bewertung von Kindern, Begriffsregel aus der Vorlage, Testzahl in README
und GDD, package.json.

## 8. Offen

- Altersgruppe: Katalogeintrag und GDD nennen 5–7 gemeinsam, 8–12 allein; der
  Katalogabschnitt und index.json nennen 3–5. Entscheidung, welche Angabe gilt.
- Druckfassung (Forscher-Heft mit Protokollbogen) ist nicht Teil dieser Einheit.
- Alle zehn Experimente sind Eigenentwurf-Vorschläge; ihre Inhalte sind noch
  nicht durch Fachkräfte oder Eltern erprobt.
- Browser-Druck: Der Dokumenttitel „Mess-Labor 🔬“ (index.html) kann in der
  Kopfzeile des Browserdrucks stehen. Der Test verlangt diesen Titel; offen, ob
  die Kopfzeile abgeschaltet werden soll.
- Seitenangaben werden maschinell gegen den Quelltext geprüft, noch nicht von
  einem Menschen geprüft. Die Seitenangaben stehen nur in den Daten (Feld
  `quelle`), nicht auf dem Bildschirm.
- uk und ru: nicht vorhanden, offen.
- Vorlesefunktion (F2), Favicon (A3).
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine
  Abnahmebedingung.

## 9. Erweiterungen (Katalog)

Druckbares Forscher-Heft (Protokollbogen), Jahreszeiten-Experimente,
Kopplung mit mathe-entdecker und einem künftigen Mini-Gärtner-Begleiter.
