# Kurz-GDD: Netz-Pass 🛂

**Einheit aus Katalog:** docs/09 №91 — «Netz-Pass-Urkunde». **Engine:**
Urkunden-Generator (wie erstes-handy-kompass „Übergabe-Urkunde“), hier mit
Stationen-Checkliste + zwei Altersstufen. Zielgruppe: Kinder (mit
Erwachsenen).

## 1. Kernaussage

Das Kind geht Stationen zur Internet-Sicherheit durch, hakt Gekonntes ab
und druckt am Ende seinen persönlichen „Netz-Pass“. Motivierende Urkunde
statt Test – Belohnung fürs Mitdenken.

## 2. Zielgruppe

Kinder 6–8 (Netz-Pass Junior, 5 Stationen) und 8–12 (Netz-Pass, 6
Stationen), am besten gemeinsam mit einer erwachsenen Begleitung.
Nachbarn: erstes-handy-kompass, stark-im-chat, mini-rechte-entdecker,
bot-oder-buddy. Kein eigenes eltern.html (Print-/Familienwerkzeug wie
erstes-handy-kompass/familien-medienvertrag).

## 3. Ablauf

1) Stufe wählen (6–8 oder 8–12).
2) Stationen durchgehen, abhaken; jede mit Tipp + Vorlesen.
3) Namen eintippen (nur für den Druck), „Netz-Pass drucken“. druck.css
blendet die Bedienung aus, nur die Urkunde bleibt.

## 4. Didaktik / Nutzen

Fasst die Kern-Kompetenzen (Erwachsene fragen, Datensparsamkeit, Stopp
holen, Werbung/Fake/Bot erkennen, Respekt, 116 111) in kindgerechte
Sätze. Die Urkunde macht sicheres Verhalten sichtbar und feiert es. Der
Name als Print-only zeigt Datenvermeidung praktisch vor.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Der Name
lebt nur im Seitenspeicher und wird NIE gespeichert (Test prüft: kindName
nie in setItem/localStorage). Nur Stufe (npu.stufe) + Häkchen (npu.status)
liegen lokal, mit „Zurücksetzen“. Stationsdaten ohne externe Links.

## 6. Tests

`test/stationen.test.mjs`: genau zwei Stufen (6–8/8–12) mit Urkundentext,
Stationen mit ID/Text/Tipp (vorlesbar), inhaltliche Abdeckung (Erwachsene,
Datensparsamkeit, Werbung/Passwort/Bot/Fake, 116 111), Datenvermeidung
(kindName nie gespeichert), keine externen Links in den Daten.

## 7. Erweiterungen (Katalog)

Weitere Stationen/Stufen; uk/ru-Übersetzung; Verzahnung mit Klassen-Koffer
(Ausdruck als Klassensatz), Anschluss an stark-im-chat / erstes-handy-kompass.
