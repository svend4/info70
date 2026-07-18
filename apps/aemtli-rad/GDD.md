# Kurz-GDD: Ämtli-Rad 🎡

**Einheit aus Katalog:** docs/09 №204 — «Ämtli-Rad für Klassendienste».
**Engine:** neu: fairer Rotationsalgorithmus + Druckplan (Transparenz-
Baustein). Zielgruppe: Schule 6-8 und 8-12.

## 1. Kernaussage

Ein nachvollziehbar fairer Rotationsalgorithmus verteilt die Klassendienste
wöchentlich neu und gibt einen druckbaren Wochenplan aus. Lernziel:
Fairness ist eine Regel, kein Zufall.

## 2. Zielgruppe

Klassen 6-8 und 8-12 (Beteiligung). Nachbarn: mitmach-arena, kinderrat,
regel-werkstatt. Betreiber-/Fachkräfte-Nähe zur Schul-Linie.

## 3. Ablauf

1) Kinder und Dienste eintragen.
2) Rad verteilt die Dienste; „Woche ◀︎/▶︎“ zeigt kommende Wochen.
3) Wochenplan drucken/kopieren; „Wie ist das fair?“ erklärt den Algorithmus.

## 4. Didaktik / Nutzen

Macht einen Algorithmus greifbar und prüfbar: Weil die Regel offenliegt
(„jede Woche eine Position weiter“), kann jedes Kind nachrechnen und sieht,
dass niemand bevorzugt wird. Das ist propädeutische Algorithmen-Transparenz
(AI Act) und gelebte Beteiligung (UN-KRK Art. 12).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Nur die
Klassenliste (aemtli.cfg, Vornamen/Spitznamen) liegt lokal und ist löschbar.
druck.css blendet die Bedienung aus. Kein eltern.html (Schulwerkzeug).

## 6. Tests

`test/logik.test.mjs`: zuteilung deterministisch, Rotation (eine Position
pro Woche), Fairness (jedes Kind jeden Dienst über eine Runde), mehr Dienste
als Kinder, keine Kinder ohne Absturz, baueWochenplan mit Transparenz-
Erklärung ohne externe Links.

## 7. Erweiterungen (Katalog)

Wahlkabinen-Modus (№205), Familienrat-Modus (№218); Varianten (zufälliger
Startversatz mit sichtbarem Seed), Ämtli-Karten zum Ausschneiden.
