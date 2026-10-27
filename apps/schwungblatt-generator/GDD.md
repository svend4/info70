# Kurz-GDD: Schwungblatt-Generator ✏️

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 28 — «Schwungblatt-
Generator». **Engine:** lokale SVG-Muster-Erzeugung + Druck (reine Logik für
die Pfade). Zielgruppe: Fachkräfte & Eltern (Vorschule).

## 1. Kernaussage

Graphomotorik-Übungsblätter mit wählbarer Progression selbst zusammenstellen
und drucken: Stufe 1 (große Wellen/Berge aus dem Arm), Stufe 2 (Girlanden/
Zickzack aus dem Handgelenk), Stufe 3 (Schleifen/Kreise-Kette als Vorform
der Schrift). Geübt wird mit Stift auf Papier – bewusst Papier statt
Bildschirm. Ersetzt teure Kopiervorlagen-Hefte (OER).

## 2. Zielgruppe

Fachkräfte/Eltern. Nachbarn: erste-woerter-lesewerkstatt, reim-radar,
netz-pass-urkunde (Druck-Muster), leichte-sprache-werkstatt.

## 3. Ablauf

1) Progressions-Stufe wählen (Vorauswahl der passenden Muster).
2) Muster ankreuzen (6 verfügbar, je 2 Zeilen à 8 Einheiten).
3) Vorschau = Druckbild; „🖨️ Drucken“ (druck.css blendet Bedienung aus).
   Namenszeile wird nur auf dem Papier ausgefüllt.

## 4. Didaktik / Nutzen

Graphomotorik-Material wird in jeder Vorschulgruppe laufend verbraucht; der
Generator mit Progression ersetzt Kopiervorlagen-Hefte. Didaktische Details:
grüner Startpunkt (Schreibrichtung links→rechts), gepunkteter Nachspur-Strich,
Bewegungs-Progression Arm → Handgelenk → Finger. SVG wird lokal als String
erzeugt (keine Bilder, keine externen Ressourcen).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(Name nur auf Papier). Kinder üben ohne Bildschirm. eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Katalog gültig (6 Muster, je Stufe ≥2, Pfade ohne
NaN), Progression (Stufe 1 Wellen/Berge, Stufe 3 Schleifen/Kreise), `pfad`
(Grundlinie, Einheiten-Wiederholung, unbekanntes Muster → null), `zeilenSVG`
(viewBox, Nachspur-Strich, Startpunkt, aria-label, keine externen Referenzen).

## 7. Erweiterungen (Katalog)

Buchstaben-Vorformen (l, e, m) als Stufe 4, Liniensysteme (Klasse 1),
wählbare Strichstärke, Namens-Vorlage in Herkunftssprachen.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
