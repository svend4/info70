# Kurz-GDD: fragFINN-Selbsttest ✅

**Einheit aus Katalog:** docs/09 №55 — «fragFINN-Selbsttest». **Engine:**
katalog (kriterien-check-Muster), Zielgruppe Erwachsene/Betreiber.

## 1. Kernaussage

Betreiber prüfen VOR dem Antrag selbst, ob ihr Kinderangebot die fragFINN-
Aufnahmekriterien erfüllt – mit Hilfetexten und exportierbarem Bericht.

## 2. Zielgruppe

Betreiber von Kinderseiten. Nachbarn: kriterien-check, kria-check,
foerder-navigator, seiten-scanner (Kinder-Version).

## 3. Ablauf

11 Kriterien in 4 Bereichen abhaken; je Kriterium Aufklapp-Hilfe „Was
fragFINN hier erwartet“ + Rechtsbezug. Notizfeld. Bericht mit Offen-Liste
+ Kopieren/Datei-Export. Alles lokal (ffst.status/ffst.notiz) + Reset.

## 4. Didaktik

Übersetzt die Aufnahmekriterien in ausführbare Prüfschritte
(Kindeignung, Interaktion/Moderation, kindgeeignete Links, Werbetrennung,
Datensparsamkeit, Impressum/Transparenz). Der Bericht macht Lücken zu
Arbeitsaufträgen. Ehrlich gekennzeichnet als Selbsttest, nicht als
offizielles Prüfergebnis – die verbindliche Prüfung macht fragFINN.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), nur `ffst.status`/`ffst.notiz`
in localStorage + Löschknopf, Datei-Export lokal per Blob, werbefrei,
Impressum. Eingabehinweis am Notizfeld: „Keine Namen von Kindern eingeben.“
(sichtbar, per aria-describedby). Angaben aus öffentlicher Recherche, ohne Gewähr.

## 6. Tests

`test/kriterien.test.mjs`: ≥4 Bereiche/≥10 Kriterien, eindeutige IDs,
Selbsttest-Kennzeichnung, je Aussage/Hilfe/Bezug, Abdeckung der fragFINN-
Aufnahmethemen (Kindeignung, Interaktion, Links, Werbetrennung,
Datensparsamkeit, Impressum). `test/eingabe-hinweis.test.mjs`: Hinweis
„Keine Namen von Kindern eingeben.“ als eigenes sichtbares Element direkt vor
dem Notizfeld, per aria-describedby verknüpft, Feldname „Notizen“ unverändert.
Gesamt 8 Tests (vorher 3).

## 7. Erweiterungen (Katalog)

Seitenstark-Qualitäts-Check (№56) als Schwester; BFSG-Check (№61);
Verknüpfung mit foerder-navigator (fragFINN als Verbreitungskanal).
