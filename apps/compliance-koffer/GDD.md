# Kurz-GDD: Compliance-Koffer 🧳

**Einheit aus Katalog:** docs/09 Ось D Nr. 232 — «Compliance-Koffer».
**Engine:** Export/Import nach dem Klassen-Koffer-Muster der mitmach-arena
(reine Logik + Datei-Bündelung). Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber bündeln die Berichte aller Prüfwerkzeuge (Art. 8, DSA, BFSG,
AI Act, § 24a JuSchG, KRIA, JMStV, Dark-Pattern) in eine einzige
versionierte Audit-Datei und erzeugen einen druckbaren Gesamtbericht –
als Nachweis-Mappe für Fördergeber, Aufsicht und Träger, ganz ohne Server.

## 2. Zielgruppe

Betreiber, Träger. Nachbarn: alle Prüfwerkzeuge der Ось D (einwilligungs-
pruefpfad, dsa-selbstaudit, bfsg-check, ki-transparenz-check, vorsorge-check-
juschg, kria-check, jmstv-einstufungs-helfer, dark-pattern-selbstinspektion)
sowie die Kinderrechte-Charta (docs/11).

## 3. Ablauf

1) Angebot benennen; je Prüfwerkzeug den Bericht einfügen oder als `.txt`
   importieren.
2) Fortschritt (X/N Werkzeuge) und Gesamtbericht (Abdeckung + Sektionen +
   offene Liste) aktualisieren sich live.
3) Koffer als `.json` speichern und später wieder laden (Klassen-Koffer-Muster).
4) Gesamtbericht als `.txt` exportieren oder drucken; „Leeren“.

## 4. Didaktik / Nutzen

Aus vielen Einzelberichten wird EINE nachvollziehbare Nachweis-Mappe. Der
versionierte JSON-Koffer ist ohne Server teilbar; der Gesamtbericht zeigt
Abdeckung und offene Werkzeuge auf einen Blick.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Inhalte nur in localStorage
(`compliance.koffer`) + „Leeren“, Import/Export lokal per Datei/Blob,
werbefrei. Werkzeug für Erwachsene ohne eltern.html. Kein Rechtsrat.

## 6. Tests

`test/logik.test.mjs`: WERKZEUGE-Katalog (Kern-Werkzeuge, eindeutige IDs),
`packeKoffer` (Struktur/Trim/leere verworfen), `pruefeKoffer` (gültig/
ungültig), Roundtrip JSON, `vorhandeneWerkzeuge`/`fortschritt`, `nameVon`,
`gesamtbericht` (Kopf, Abdeckung, Sektionen, offene Liste).

## 7. Erweiterungen (Katalog)

Direkte Verknüpfung mit den Prüfwerkzeugen (Bericht per Klick übernehmen),
Verschlüsselung des Koffers, Versions-Historie mehrerer Audit-Stände.
