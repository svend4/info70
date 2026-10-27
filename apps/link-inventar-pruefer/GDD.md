# Kurz-GDD: Link-Inventar-Prüfer 🔗

**Einheit aus Katalog:** docs/09 №166 — «Link-Inventar-Prüfer». **Engine:**
neu: lokaler HTML-Parser + katalog-Prüfliste (Datei-Import wie Klassen-
Koffer). Zielgruppe: Betreiber.

## 1. Kernaussage

Aus importiertem HTML werden alle Links lokal extrahiert und klassifiziert;
je externem Link führt eine Prüfliste durch die Kinderseiten-Kriterien. Kein
Netzwerkzugriff – die Analyse läuft nur im Browser.

## 2. Zielgruppe

Betreiber, Redaktionen. Nachbarn: kriterien-check, seitenstark-qualitaets-
check, fragfinn-selbsttest. Kinder-Pendant: link-kompass (Link-Typen üben).

## 3. Ablauf

1) HTML-Datei(en) importieren oder Quelltext einfügen.
2) Externe Links werden aufgelistet und klassifiziert (Video/Social/Shop …).
3) Je Link die Prüfpunkte abhaken; Bericht mit Lücken speichern/kopieren.

## 4. Didaktik / Nutzen

Macht die oft unübersichtliche Menge ausgehender Links greifbar und lenkt
den Blick auf die riskanten (Social, Shop, App-Store). Das strikt lokale
Parsen zeigt zugleich vor, dass eine Analyse ganz ohne Server möglich ist –
passend zur Null-externe-Requests-Politik.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter) – die Logik parst nur Text und
lädt nichts nach (Test). Importiertes HTML bleibt im Seitenspeicher; nur die
Prüf-Haken liegen lokal (lip.status) + Zurücksetzen. Export per Blob,
werbefrei. Eingabehinweis „Keine Namen von Kindern eingeben.“ steht sichtbar
direkt vor dem HTML-Textfeld (aria-describedby).

## 6. Tests

`test/logik.test.mjs`: klassifiziere (Muster ohne Netzwerk), extrahiereLinks
(href+src, dedupliziert, Anker ignoriert, script-src erfasst), extern-Flag,
statistik, PRUEFPUNKTE, bericht (externe Links + Prüfpunkte, ehrlich bei 0),
Sicherheit (kein Netzwerkzugriff, robust bei beliebigem Text).
`test/eingabe-hinweis.test.mjs`: Hinweistext, Sichtbarkeit, Zuordnung zum
HTML-Feld. Testzahl gesamt: 11 (vorher 7).

## 7. Erweiterungen (Katalog)

Sitemap-Import; Vorschlag zur Kennzeichnung externer Links; Verzahnung mit
Interaktions-Konzept-Assistent und Werbekennzeichnung.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
