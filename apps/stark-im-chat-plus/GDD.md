# Kurz-GDD: Stark im Chat 13+ 🛡️

**Einheit aus Katalog:** docs/09 №9 (топ-лист) — «stark-im-chat 13+
(Jugendversion)». **Engine:** szenario (2/1/0) + Gruppenchat-Optik.

## 1. Kernaussage

In Gruppen entscheidet die dritte Person. Die Jugendversion trainiert
den Zug, der die Dynamik bricht - und liefert danach den konkreten
Rechtsweg (DSA), den Jugendliche seit 2024 tatsächlich haben.

## 2. Zielgruppe

Jugendliche ab 13. Anschluss nach unten: stark-im-chat (8-12),
spiral-stopper. Anschluss für Erwachsene: eltern.html mit
Nicht-Ärger-Pakt.

## 3. Ablauf (Loop)

1. 8 geskriptete Chat-Verläufe als Sprechblasen-Ansicht (Gruppenname,
   Absender, Weiterleitungs-Markierungen) - bewusst OHNE Eingabefeld.
2. Frage an die dritte Person; 3 Optionen (2/1/0), gemischt.
3. Auflösung: Dynamik-Erklärung + ⚖️-Block "Dein Weg" mit DSA-Meldeweg
   und Menschen-Wegen.
4. Ende: «Ende der Runde» und der Werkzeugkasten-Merksatz; keine Punkte,
   keine Ränge, kein Rekord - die Person wird nicht bewertet (2/1/0 ist die
   Rückmeldung zur gewählten Antwort).

## 4. Didaktik

Kern-Erkenntnisse pro Verlauf: Weiterleitungs-Kette ("nur an einen"),
Satire-Tarnung entlarven (trifft nach oben vs. tritt nach unten),
Mitlesen IST Beitritt, Beweise VOR Melden, Doxxing = reale Gefahr,
Massen-Report = Missbrauch (Art. 23), "harmlose" Sätze × 30 Leser =
Rausekeln. Opfer-Hilfen immer anbieterunabhängig (116 111, JUUUPORT).

## 5. Politik-Konformität (docs/02)

Kein echter Chat (im Code dokumentiert, vom Test geprüft), plattform-
neutral (Stop-Liste: keine Markennamen), keine externen Anfragen,
speichert nichts (der alte Schlüssel `sicp.rekord` wird beim Start einmal
entfernt, kein Löschknopf nötig), Vorlesen, mobile-first, ab-13-Hinweis.
StGB-Nennungen als Schutzwissen, nie als Anleitung.

## 6. Tests

`test/szenarien.test.mjs`: Schema (Chat ≥3 Nachrichten, [0,1,2]-Werte, keine Ränge),
Auflösung ≥100 + dsaWeg ≥80 Zeichen, DSA-Substanz (Art. 16/20/28,
116 111, JUUUPORT), Phänomen-Breite (6 Muster + Screenshot + Spaß-
Tarnung), Politik-Wächter (geskriptet, keine Plattformnamen), keine Wertung im
Code (Daten ohne Ränge), Speicherregel (kein Speicher, keine Karte).

## 7. Erweiterungen (Katalog)

Klassen-Modus für den Unterricht ab Klasse 7; Verlauf-Pack
"Gruppenadmin-Verantwortung"; uk/ru-Lokalisierung über mini-i18n.
