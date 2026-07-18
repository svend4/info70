# Kurz-GDD: Barriere-Spürnasen 🔍

**Einheit aus Katalog:** docs/09 №154 — «Barriere-Spürnasen». **Engine:**
Simulator (reine logik.mjs + dünne DOM-Schicht). Zielgruppe: Kinder 8-12.

## 1. Kernaussage

Kinder erleben dieselbe Beispielseite mit und ohne Barrierefreiheit und
schalten Kontrast, Schriftgröße, Vorlesen und Bildbeschreibung einzeln ein.
Der Unterschied ist sofort sichtbar/hörbar – Teilhabe wird erfahrbar.

## 2. Zielgruppe

Kinder 8-12 (Klassen-Modus tauglich: eine Projektion). Nachbarn:
barriere-detektive (Checkliste), spuren-lupe (Simulator-Muster). Betreiber-
Pendant: bfsg-check, barrierefreiheitserklaerung-generator.

## 3. Ablauf

1) Beispielseite ansehen (anfangs ohne Merkmale).
2) Vier Merkmale einzeln ein-/ausschalten; die Seite verändert sich real.
3) Fortschritt + Bewertung; „Alles einschalten“ zeigt das Ziel.

## 4. Didaktik / Nutzen

Statt über Barrierefreiheit zu belehren, lässt der Simulator sie erleben:
winzige Schrift, blasser Kontrast, kein Vorlesen, Bild ohne Beschreibung.
Die Vorlese-Taste ist ohne das Merkmal „Vorlesen“ bewusst deaktiviert –
Kinder spüren, was fehlt. Anschluss an das Recht auf Teilhabe (UN-KRK
Art. 23).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Gespeichert
wird nur der Schalter-Stand (bsp.status) + Zurücksetzen. eltern.html
vorhanden; im Eltern-Sammelband gelistet.

## 6. Tests

`test/logik.test.mjs`: vier Merkmale (kontrast/schrift/vorlesen/bild) mit
eindeutigen IDs und aus/ein/warum-Texten, zaehleAktiv/istAn, bewertung
(nichts an → kaum nutzbar, teilweise → Restzahl, alles an → „für ALLE“ +
UN-KRK Art. 23), jedes „warum“ mit konkretem Nutzen.

## 7. Erweiterungen (Katalog)

Weitere Merkmale (Tastaturbedienung, Untertitel); Leichte-Sprache-Katalog;
Verzahnung mit barriere-detektive.
