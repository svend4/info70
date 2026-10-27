# Kurz-GDD: Eltern-Kompass-Generator 👪

**Einheit aus Katalog:** docs/09 №163 — «Eltern-Kompass-Generator».
**Engine:** Formular-zu-Dokument-Generator (geteilt mit Impressum-/
Datenschutz-/Barrierefreiheits-Generator). Zielgruppe: Betreiber.

## 1. Kernaussage

Aus strukturierten Angaben zum eigenen Kinderangebot entsteht offline eine
fertige „Für Eltern“-Seite (Eltern-Kompass) als komplettes HTML-Dokument –
im gleichen Stil wie die eltern.html-Seiten des Monorepos.

## 2. Zielgruppe

Betreiber von Kinderseiten – zuerst für die eigenen info70-Apps, dann als
Angebot an andere. Gleiche Engine-Familie: Impressum-, Datenschutz-,
Barrierefreiheits-Generator.

## 3. Ablauf

1) Angaben ausfüllen (Name, Alter, Worum, Lernziele, Daten, Interaktion,
kostenfrei, Hinweis).
2) Live-Vorschau der Sektionen ansehen.
3) Fertige eltern.html kopieren oder speichern.

## 4. Didaktik / Nutzen

Senkt die Hürde, Eltern transparent zu informieren (Seitenstark-Anspruch):
Das Ergebnis benennt Lernziele, Datensparsamkeit und die Hilfenummer
116 111 und ist sofort als eltern.html einsetzbar. Datensparsamkeit ist der
Default (leeres Daten-Feld → „keine personenbezogenen Daten“).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Angaben nur in localStorage
(ekg.cfg) + Leeren, Export lokal per Blob, werbefrei. Nutzereingaben werden
escaped; die Ausgabe enthält kein Script und keinen externen Host (Test) –
nur lokale Verweise auf Stylesheet und Impressum.

Eingabehinweis „Keine Namen von Kindern eingeben.“ an jedem Eingabefeld
(Name, Altersgruppe, Worum, Lernziele, Daten, Interaktion, Hinweis): sichtbar,
als eigenes Element direkt vor dem Feld, per aria-describedby verknüpft. Die
Seite wird öffentlich eingebunden; der Hinweis steht nur im Formular, nicht in
der erzeugten eltern.html.

## 6. Tests

`test/logik.test.mjs`: baueSektionen übernimmt alle Angaben inkl. 116 111,
Pflicht-Struktur + datensparsamer Default, kostenfrei-Schalter, baueSeite
liefert vollständiges Dokument (DOCTYPE/CSP/Titel/Footer), Sicherheit
(Escaping, kein Script/kein externer Host), escapeHtml.

`test/eingabe-hinweis.test.mjs`: Hinweistext, Sichtbarkeit, Platzierung
direkt vor dem Feld, aria-describedby, und dass alle sieben Freitext-Felder
den Hinweis haben. Testzahl: 11 (6 Logik, 5 Hinweis); `npm test` grün.

## 7. Erweiterungen (Katalog)

Mehrsprachige Eltern-Kompass-Seite (de/uk/ru); Verzahnung mit Datenschutz-
Baukasten (Daten-Angaben übernehmen) und Interaktions-Konzept-Assistent.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
