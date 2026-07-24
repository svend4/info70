# Kurz-GDD: Wer wohnt wo? 🏠

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 3 — «Wer wohnt
wo? – Lebensraum-Häuser». **Engine:** Erkunden-Simulator + zwei Quiz-Modi
(reine Logik mit injizierbarem Wähler). Zielgruppe: 5–7 kurz eigenständig,
8–12 Vertiefung.

## 1. Kernaussage

Vier heimische Lebensräume als „Häuser“: Wald (mit den 5 Stockwerken des
Sachunterrichts: Baum-/Strauch-/Kraut-/Boden-/Wurzelschicht), Wiese, Teich,
Garten/Feld. Jedes Haus verändert sich mit den Jahreszeiten. Wohn-Quiz
(13 heimische Tiere zuordnen, dazu zwei Fragen nach dem Wald-Stockwerk)
und Gast-Quiz („der Mensch ist dort nur zu Gast“: Wege, Lärm, nichts
mitnehmen, Handstraußregel, Enten nicht mit Brot, Brut- und Setzzeit).

## 2. Zielgruppe

Kinder 5–7 (kurz, mit Vorlesen), 8–12 (Stockwerke, Regeln). Nachbarn:
nahrungsnetz-werkstatt, jahreszeiten-rad, mini-gaertner-begleiter (Garten).

## 3. Ablauf

1) Erkunden: Haus wählen → Beschreibung, Jahreszeiten-Umschalter
   (4 Texte je Haus), Bewohner-Chips; im Wald zusätzlich die 5 Stockwerke.
2) Wohn-Quiz: 8 Fragen – 6-mal „Wo wohnt der/die/das …?“ (4 Häuser als
   Antworten) und 2-mal „In welchem Stockwerk des Waldes ist … zu Hause?“
   (5 Stockwerke); Feedback als ganzer Satz mit Artikel plus Tier-Tipp
   bzw. Stockwerk-Info; kein Beschämen bei Fehlern.
3) Gast-Quiz: 8 Stimmt/Stimmt-nicht-Aussagen mit Erklärung; Abschluss:
   „raus und echte Tiere beobachten – als leiser Gast“.

## 4. Didaktik / Nutzen

Adaption: belarussische Fauna (Zubr, Wolf) → heimische Arten (Reh, Fuchs,
Igel, Stockente); „Stockwerke des Waldes“ ist der etablierte deutsche
Sachunterrichts-Klassiker; Verhaltensregeln nach Alltagsverständnis des
Naturschutzes (Handstraußregel, Brut-/Setzzeit, Amphibien geschützt).
Der Validator erzwingt Widerspruchsfreiheit: jedes Stockwerk-Tier, das im
Wohn-Quiz vorkommt, muss dort dem Wald zugeordnet sein; Bewohner sind
eindeutig (keine mehrdeutigen Quiz-Antworten). Sprachlich erzwingt er
ganze Sätze: zu jedem Namen gehört ein Artikel (der/die/das), zu jedem
Haus eine Ortsangabe („im Wald“, „auf der Wiese“), und keine Gast-Erklärung
darf mit „Richtig!“ beginnen – sie erscheint auch nach einer falschen
Antwort.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert
nichts**. Vorlesen lokal (Web Speech). Explizite Draußen-Botschaft am
Quiz-Ende (Bildschirm als Sprungbrett). eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (9): Datenbestand gültig (4 Häuser, 5 Stockwerke,
16 Jahreszeiten-Texte); Stockwerk-Reihenfolge und -Zuordnung; je Haus ≥3
Quiz-Bewohner; deterministische Fragen (injizierter Wähler); Gast-Regeln
(wahr+falsch, keine Beschämung, Kaulquappe geschützt); Validator meldet
Widersprüche/Dubletten; Naturwissen (Winterschlaf der Haselmaus,
Nussvorrat, Maulwurf, Insekten-Überwinterung auch als fertiges Tier);
ganze Sätze (Artikel, Ortsangabe, Stockwerk-Kurzname); Gast-Erklärungen
ohne vorgezogenes Lob.

## 7. Erweiterungen (Katalog)

Weitere Häuser (Hecke, Stadt/Balkon), Nahrungsketten-Brücke zur
nahrungsnetz-werkstatt, uk/ru-Tiernamen als Sprachbrücke.
