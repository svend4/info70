# Kurz-GDD: Einwilligungs-Prüfpfad Art. 8 🧭

**Einheit aus Katalog:** docs/09 Ось D Nr. 219 — «Einwilligungs-Prüfpfad
Art. 8». **Engine:** geführter Frage-Pfad (datengetrieben, `daten/pfad.json`)
mit Prüfbericht/Lücken-Liste. Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber gehen einen geführten Frage-Pfad zur DSGVO-Einwilligung von Kindern
durch: Dienst der Informationsgesellschaft? Zielgruppe Kinder? Ist Einwilligung
die Rechtsgrundlage? Greift die 16-Jahre-Grenze in Deutschland? Welche
„angemessenen Anstrengungen“ zur Verifikation der Eltern-Einwilligung sind
dokumentiert? Am Ende entsteht ein exportierbarer Prüfbericht mit Lücken-Liste.

## 2. Zielgruppe

Betreiber, Datenschutz-Verantwortliche. Nachbarn: DSA-Selbstaudit,
Vorsorge-Check § 24a JuSchG, Datenschutz-Baukasten, Leichte-Sprache-Prüfhilfe,
KI-Transparenz-Check.

## 3. Ablauf

1) 11 Schritte der Reihe nach durchgehen (jeweils Frage + Antwort-Optionen).
2) Manche Antworten erzeugen eine Lücke mit konkretem Hinweis (⚠️).
3) Prüfbericht ansehen, als `.txt` speichern/kopieren, „Zurücksetzen“.

## 4. Didaktik / Nutzen

Übersetzt Art. 8 DSGVO (i.V.m. Art. 5/6/7/12/17, ErwG 38/58/65) in konkrete,
abarbeitbare Prüfschritte: Altersgrenze 16 (DE, keine Absenkung),
Eltern-Zustimmung unter 16, angemessene Verifikation nach Stand der Technik,
kindgerechte Sprache, einfacher Widerruf, Datenminimierung, starkes Löschrecht
bei Kinderdaten und Nachweisbarkeit. Der Bericht priorisiert die Lücken.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Antworten nur in localStorage
(`einwilligung.antworten`) + „Zurücksetzen“, Bericht-Export lokal per Blob,
werbefrei. Werkzeug für Erwachsene ohne eltern.html. Kein Rechtsrat.

## 6. Tests

`test/logik.test.mjs`: ≥8 Schritte, eindeutige IDs, jeder Schritt mit
Frage/Hilfe/Bezug und ≥2 Antworten (eindeutige Werte, Lücken mit Hinweis),
inhaltliche Abdeckung (16 Jahre, Eltern, Verifikation, Widerruf,
Datenminimierung, ErwG 65), `sammleLuecken`/`zaehle`/`istVollstaendigOhne
Luecken` und `pruefbericht` (Kopf, Antworten, Lücken-Liste, Ergebnis).

## 7. Erweiterungen (Katalog)

Compliance-Koffer (Nr. 232, bündelt Berichte), Verzweigungen (Sprung-Pfad),
Kopplung mit Datenschutz-Baukasten und Eltern-Rechtebriefe.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
