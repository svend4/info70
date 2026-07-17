# Kurz-GDD: Elternabend-Kit «Digital daheim» 🏠

**Einheit aus Katalog:** docs/09 №24 (топ-лист) — «Elternabend-Kit
'Digital daheim'». **Engine:** statisch (kinder-ui-Tokens, mini-i18n).

## 1. Kernaussage

Eltern sind die wichtigste Schutzinstanz - aber niemand bereitet den
Elternabend vor. Das Kit macht aus Beamer + Browser einen fertigen
60-Minuten-Abend ohne Panik-Pädagogik, mit Handout in drei Sprachen.

## 2. Zielgruppe & Rahmen

Moderation: Lehrkräfte, Schulsozialarbeit, Elternvertretungen.
Publikum: Eltern (auch mit geringen Deutschkenntnissen - uk/ru).
Rechtsrahmen: JuSchG § 10b, DSGVO Art. 8, UN-KRK Art. 5/18,
BzKJ-Gefährdungsatlas (Kettenbriefe, Kostenfallen, Sharenting).

## 3. Aufbau

1. Moderations-Ansicht: Agenda (60'), Module mit Kernbotschaft +
   Folienpunkten, Demo-Drehbücher, Diskussionskarten, Hilfen; druckbar.
2. Folien-Modus: 8 große Folien (Titel, 4 Module, Diskussion, Hilfe,
   Abschluss), Klick = weiter, Beenden zurück zur Moderation.
3. handout.html: dreisprachiges Handout (de/uk/ru) über erstelleSprache,
   Sprachknöpfe + Druckknopf verschwinden im Druck (druck.css).

## 4. Didaktik

Kein Frontal-Katastrophen-Abend: Einstieg fragt nach Begeisterung, nicht
nach Gefahr. Zwei Live-Demos (kettenbrief-stopper, lootbox-labor) lassen
Eltern die Kinder-Perspektive selbst erleben. Sharenting dreht die
Blickrichtung auf die Erwachsenen. Die Eine-Sache-Regel am Schluss
übersetzt den Abend in Verhalten. Anti-Verbots-Haltung ist Datenbestand
UND Testfall (loben statt schimpfen, gemeinsam statt heimlich).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter auf beiden Seiten), speichert
NICHTS (auch keine Sprachwahl - Schul-PC-Szenario), werbefrei, Impressum.
Demo-Links öffnen nur Apps desselben Monorepos.

## 6. Tests

`test/kit.test.mjs`: Agenda = 60', Modul-IDs fix, GENAU 2 Demos mit
≥3 Drehbuch-Schritten + Existenz-Check der Demo-Apps, ≥6 Karten mit
Hinweis, Haltungs-Test (loben/gemeinsam/kein Handy-Wegnehmen/Sharenting/
JuSchG), i18n-Vollständigkeit (uk/ru decken exakt die de-Schlüssel,
Listenlängen gleich), Handout-Substanz je Sprache (4 Module × 3 Tipps,
116 111, 0800 111 0 550).

## 7. Erweiterungen (Katalog)

Eltern-Kompass-Sammelband als Ausgabe-Paket zum Abend (bereits gebaut);
weitere Handout-Sprachen (tr/ar/pl) über dieselben Kataloge;
Kita-Variante des Abends (3-6 Jahre, andere Module).
