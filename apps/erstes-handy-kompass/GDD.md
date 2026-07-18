# Kurz-GDD: Erstes-Handy-Kompass 🧭

**Einheit aus Katalog:** docs/09 №98 — «Erstes-Handy-Kompass». **Engine:**
katalog (Checkliste + Druck), Zielgruppe Erwachsene.

## 1. Kernaussage

Das erste Handy sicher übergeben – als geführte Checkliste mit Begründung
je Schritt und einer motivierenden Übergabe-Urkunde fürs Kind.

## 2. Zielgruppe

Eltern (Kind 8-12). Nachbarn: berechtigungs-safari (Rechte prüfen),
familien-medienvertrag (Regeln), elternabend-kit.

## 3. Ablauf

8 Punkte abhaken (Jugendschutz, Standort, Kaufsperre, Notfall, Apps,
Bildschirmzeit, Sperre/Updates, Nicht-Ärger-Pakt) – je Warum + „So geht’s“
(Android/iOS). Fortschritt lokal (ehk.status). Am Ende: Kindname ins
Druckformular tippen → Urkunde „Handy-Führerschein“ drucken.

## 4. Didaktik

Jeder technische Schritt bekommt eine Begründung – Eltern sollen verstehen,
nicht nur abhaken. Der Nicht-Ärger-Pakt steht bewusst als eigener Punkt:
Vertrauen schützt stärker als jeder Filter. Die Urkunde macht Sicherheit
zum positiven Ritual statt zum Kontroll-Akt.

## 5. Politik-Konformität (docs/02)

Reine Anleitung: liest nichts vom Gerät. Keine externen Anfragen
(NetzwerkWaechter), nur `ehk.status` (Häkchen) in localStorage + Löschknopf.
Der Kindname wird NUR gedruckt, NICHT gespeichert (Datenvermeidung, per
Test abgesichert). Werbefrei, Druck-CSS, Impressum.

## 6. Tests

`test/checkliste.test.mjs`: ≥6 Punkte + Urkundentext, je Titel/Warum/Wie,
Pflicht-Punkte (jugendschutz/standort/kaufsperre/notfall/apps), Inhalte
(116 111, Nicht-Ärger-Pakt, fragFINN), Datenvermeidung (Name nicht
gespeichert).

## 7. Erweiterungen (Katalog)

Verknüpfung mit Berechtigungs-Safari und Familien-Medienvertrag;
Alters-Varianten (Grundschule vs. weiterführend); Druck als A5-Urkunde.
