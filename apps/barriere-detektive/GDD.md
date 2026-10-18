# Kurz-GDD: Barriere-Detektive 🕵️

**Einheit aus Katalog:** docs/09 №17 — «Barriere-Detektive». **Engine:**
beteiligung (lokale Checkliste + Rangliste, ohne Server).

## 1. Kernaussage

Barrierefreiheit ist Fairness. Kinder prüfen echte Lieblings-Apps mit
einer Kinder-Checkliste und erleben im Perspektivwechsel, wer sonst
ausgeschlossen wird.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: kinderrechte-entdecker (Teilhabe), mitmach-arena
(Abstimmen), Leichte-Sprache-Schalter (BFSG in eigener Sache).

## 3. Ablauf

1. App/Seite eintragen (nur Name). Sichtbarer Hinweis direkt am Feld:
   „Nur den Namen der App eintragen, keinen eigenen Namen.“ (verknüpft per
   aria-describedby); der Satz „Es reicht der Name – sonst nichts.“ sagt
   zusätzlich, dass kein eigener Name gemeint ist.
2. 6-Punkte-Checkliste abhaken; Fairness-Balken + Einordnung live.
3. Ab 2 Apps: „Fairste App küren“ → Rangliste (stabil, fairste zuerst).
4. „Warum ist das wichtig?“ → 4 Lektionen.
Fortschritt lokal (bd.apps) + „Alles löschen“.

## 4. Didaktik

Jedes Kriterium trägt ein „Wofür/Warum“ – der Perspektivwechsel ist
eingebaut, nicht nachgeschoben. Fairness-Sprache statt Technik-Sprache.
Erkenntnis: Barrierefreiheit hilft nicht nur „den anderen“, sondern
allen (Licht, Ton, Sprache lernen). Rechtsanker BFSG kindgerecht.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), liest NICHTS über die
geprüften Apps aus (Kind bewertet selbst), nur Namen+Häkchen in
localStorage + Löschknopf, werbefrei, Vorlesen, mobile-first (Touch-
Checkboxen 1,4rem), eltern.html.

## 6. Tests

`test/logik.test.mjs`: Checkliste (≥6, Frage/Warum/Wofür, Pflicht-
kriterien vorlesen/kontrast/ohne_ton), punkte (nur boolean true),
einordnung-Stufen, rangliste (fairste zuerst, stabiler Gleichstand),
Lektionen-Substanz (Barriere, fair, alle, BFSG).

## 7. Erweiterungen (Katalog)

Klassen-Abstimmung „fairste App der Klasse“ (mitmach-arena-Brücke);
Barriere-Spürnasen (№54) als jüngere Variante; uk/ru + Leichte Sprache.
