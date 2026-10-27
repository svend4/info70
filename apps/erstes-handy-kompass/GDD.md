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
(Android/iOS). Fortschritt lokal (ehk.status). Am Ende: Initialen oder
Spitzname (max. 12 Zeichen) ins Druckformular tippen → Urkunde
„Handy-Führerschein“ drucken.

## 4. Didaktik

Jeder technische Schritt bekommt eine Begründung – Eltern sollen verstehen,
nicht nur abhaken. Der Nicht-Ärger-Pakt steht bewusst als eigener Punkt:
Vertrauen schützt stärker als jeder Filter. Die Urkunde macht Sicherheit
zum positiven Ritual statt zum Kontroll-Akt.

## 5. Politik-Konformität (docs/02)

Reine Anleitung: liest nichts vom Gerät. Keine externen Anfragen
(NetzwerkWaechter), nur `ehk.status` (Häkchen) in localStorage + Löschknopf.
Im Urkunden-Feld nur Initialen oder Spitzname (max. 12 Zeichen), mit sichtbarem
Hinweis am Feld. Der Eintrag wird NUR gedruckt, NICHT gespeichert
(Datenvermeidung, per Test abgesichert). Der Wert liegt nur im Speicher der
Seite (`namen-merker.mjs`), damit er ein Neuzeichnen nach einem Häkchen oder
„Zurücksetzen“ übersteht; nach dem Neuladen ist das Feld leer. Werbefrei,
Druck-CSS, Impressum.

## 6. Tests

`test/checkliste.test.mjs`: ≥6 Punkte + Urkundentext, je Titel/Warum/Wie,
Pflicht-Punkte (jugendschutz/standort/kaufsperre/notfall/apps), Inhalte
(116 111, Nicht-Ärger-Pakt, fragFINN), Datenvermeidung (Name nicht
gespeichert).

`test/namen-merker.test.mjs` (ohne DOM, Modul-Ebene): der Name überlebt ein
Neuzeichnen (Feld und Urkunde aus dem Modul), Eingabe überschreibt, Leeres ergibt
die Linie, Kürzung auf 12 Zeichen, Urkunde getrimmt, das Modul speichert und
verschickt nichts, app.mjs ist verdrahtet. 6 Prüfungen.

`test/regeln.test.mjs`: Namensfeld mit maxlength 12 und neuer Beschriftung,
Hinweis „Nur Initialen oder einen Spitznamen eintragen, keinen vollen Namen.“
direkt am Feld (aria-describedby, im Druck ausgeblendet), kein Speichern des
Namenswerts (nur ein Aufruf von speichere, mit dem Status), Urkunde zeigt den
Wert live, jede Schaltfläche trägt data-kennung gleich id. 5 Prüfungen.

Gesamt 15 Tests (4 + 5 + 6); `npm test` in apps/erstes-handy-kompass.

## 7. Erweiterungen (Katalog)

Verknüpfung mit Berechtigungs-Safari und Familien-Medienvertrag;
Alters-Varianten (Grundschule vs. weiterführend); Druck als A5-Urkunde.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
