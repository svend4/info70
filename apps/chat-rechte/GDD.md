# Kurz-GDD: Chat-Rechte ⚖️

**Einheit aus Katalog:** docs/09 №35 — «Chat-Rechte-Pack». **Engine:**
szenario (2/1/0-Muster), Content-Pack-Idee.

## 1. Kernaussage

Beteiligungsrechte haben zwei Seiten: Freiheit und Verantwortung. Chat-
Situationen werden als Rechtsfragen erlebbar – mit Merksatz je Fall.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: stark-im-chat (Bystander), rechte-kompass (Rechte
aussprechen), darf-ich-posten (Bild/Urheberrecht). Bindet Hilfe-Insel ein.

## 3. Ablauf

Start → 8 Szenarien gemischt (Chat-Optik) → 3 Optionen (2/1/0) →
Auflösung: Erklärung + 📜 Recht + 💡 Merksatz. Wert-2-Antworten sammeln
Merksätze; Ränge + Rekord (localStorage). Hilfe-Insel jederzeit.

## 4. Didaktik

Kern ist die Grenze: Meinung über eine Sache (Art. 13) vs. Herabwürdigung
einer Person; Melden (DSA Art. 16/20) als Schutz vs. Petzen als Schaden;
gehört werden (Art. 12) vs. immer gewinnen; Nichtdiskriminierung (Art. 2);
eigener Fehler → Verantwortung. Ein Szenario hat bewusst zwei 0-Optionen
(Nichtstun UND Rache), damit Rache nicht als „ok“ erscheint.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), nur `cr.rekord` + Löschung,
werbefrei, Vorlesen, mobile-first, eltern.html, Hilfe-Insel (116 111).
Situationen erfunden, plattformneutral.

## 6. Tests

`test/szenarien.test.mjs`: Schema/Ränge, je Szenario Recht+Merksatz+
Erklärung + 2/1/0 (genau eine 2, mind. eine 0), Doppel-Natur-Abdeckung
(Art. 13 + Grenze + DSA-Melden + Petzen + Verantwortung + Art. 12),
Artikel-Breite ≥3, Hilfe-Insel eingebunden.

## 7. Erweiterungen (Katalog)

Klassen-Modus für Sozialkunde; Jugendversion 13+ (Hassrede-Recht);
uk/ru + Leichte Sprache über kinder-ui.
