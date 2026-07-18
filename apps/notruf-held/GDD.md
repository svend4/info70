# Kurz-GDD: Notruf-Held 📞

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 8 — «Notruf-Held:
112 und 110 üben». **Engine:** eigener Wähltastatur-Simulator + reine Logik +
Vorlesen. Zielgruppe: 5–7.

## 1. Kernaussage

Simulierter Wähltastatur-Trainer: Kind erkennt die richtige Notrufnummer zur
Situation (112 Feuerwehr/Rettung, 110 Polizei), „wählt“ sie auf einer Tastatur
und übt, was man am Telefon sagt (Name, Adresse, was passiert ist). Kein echter
Anruf, keine Datenerfassung.

## 2. Zielgruppe

Vorschule 5–7. Nachbarn: sicher-unterwegs, gefuehle-entdecker, reim-radar.

## 3. Ablauf

1) Start erklärt 112/110 und „nur zum Üben“ (Vorlesen).
2) 6 Notfälle aus 8 (gemischt): richtige Nummer auf der Tastatur wählen,
   „📞 Anrufen“ → Rückmeldung, Warum und die Notruf-Sprech-Schritte (Vorlesen).
3) Score (richtig/gesamt) + Rekord; Hinweis, Name/Adresse mit Erwachsenem zu üben.

## 4. Didaktik / Nutzen

Konkretes, prüfbares Lernziel mit hoher Eltern-Zugkraft („Kann mein Kind den
Notruf?“). Die Unterscheidung 112 (Körper/Feuer) vs. 110 (Polizei) wird an
Beispielen erlebbar. Bewusst als Simulation ohne echten Anruf.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), KEIN echter Anruf (kein tel:-Link),
keine Datenerfassung (DSGVO Art. 8), nur Rekord in localStorage (notruf.rekord).
Werbefrei. Vorlesen + Anzeige-Einstellungen (BFSG). Kinder-App mit eltern.html,
im Eltern-Sammelband.

## 6. Tests

`test/logik.test.mjs`: Situationen mit gültiger Nummer (beide 112 UND 110
vertreten), Notruf-Schritte, `nurZiffern`/`istNotrufnummer`/`pruefeAnruf`
(ok/andere Notrufnummer/keine), `rueckmeldung`-Texte, `bewerteRunde`.

## 7. Erweiterungen (Katalog)

Adress-Sprech-Übung (nur lokal, ohne Speichern), uk/ru-Vorlesen, Giftnotruf als
Zusatzkarte, Kopplung mit sicher-unterwegs.
