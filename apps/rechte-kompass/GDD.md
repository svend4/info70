# Kurz-GDD: Rechte-Kompass 🧭

**Einheit aus Katalog:** docs/09 №14 (топ-лист) — «Rechte-Kompass»,
absorbiert «Mein Bild gehört mir». **Engine:** szenario (2/1/0-Muster).

## 1. Kernaussage

Rechte kennen ist Wissen - Rechte aussprechen ist Können. Die App
trainiert den Satz, nicht nur den Artikel.

## 2. Zielgruppe

Kinder 8-12. Anschluss an kinderrechte-entdecker (Wissen) - der Kompass
liefert die Sprech-Praxis obendrauf.

## 3. Ablauf (Loop)

1. 12 Alltags-Szenarien, gemischt; 3 Reaktionen mit Wert 2/1/0.
2. Stärkste Antwort = Recht HÖFLICH aussprechen (nie Rache, nie Schweigen).
3. Auflösung: Erklärung + KRK-Artikel in Kindersprache + Mut-Satz.
4. Wert-2-Antworten sammeln Mut-Sätze; Endbildschirm („Ende der Runde“)
   listet sie als Mitnehm-Repertoire. Das Kind wird nicht bewertet: die Werte
   2/1/0 steuern nur die Rückmeldung zu jeder Antwort; es gibt keine Punkte,
   keinen Rekord und keine Ränge.

## 4. Didaktik

Drei bewusste Härtegrade der Gegenüber: Familie (am schwersten!),
Gleichaltrige, Institutionen (Schule, Rathaus, Gericht, Praxis).
Artikel-Breite statt -Tiefe: 2, 12, 16, 17, 31 - inklusive der
"vergessenen" Artikel 31 (Spiel) und 12 im Familiengericht
(Verfahrensbeistand). Sharenting nach Gefährdungsatlas benannt.
Mut-Sätze sind deeskalierend formuliert (Test: kein verklagen/Anwalt/
Polizei) - Selbstvertretung, nicht Drohung.

## 5. Politik-Konformität (docs/02)

Werbefrei, ohne Konto, keine externen Anfragen (NetzwerkWaechter), die App
speichert nichts (darum keine Karte „Meine Daten löschen“; der alte Schlüssel
`rk.rekord` wird beim Start einmal entfernt), Vorlesen (Web Speech de-DE),
mobile-first, eltern.html (inkl. Abschnitt "Rechte gegen Eltern" - warum
das kein Aufstand ist), 116 111 auf Start- und Hilfsebene.

## 6. Tests

`test/szenarien.test.mjs`: Schema + exakt [0,1,2]-Werteverteilung je
Szenario, Artikel 1-54 + Artikelname + Mut-Satz-Pflicht, Stop-Liste im
Mut-Satz, Artikel-Breite (≥5, Pflicht 12/16/31), Familien- UND
Institutionen-Situationen, 116 111 in der App-Quelle; Abwesenheits-Tests:
keine Ränge, keine Wertung im App-Code, kein Speicher und keine Löschkarte,
alter Schlüssel nur als einzeiliges removeItem.

## 7. Erweiterungen (Katalog)

Klassen-Modus-Variante für den Sozialkunde-Unterricht; Mut-Satz-Druckkarten
(Netz-Pass-Muster); uk/ru-Lokalisierung über mini-i18n (feed-forscher-Weg).
