# Kurz-GDD: Anzeige-Einstellungen 🔎

**Einheit aus Katalog:** docs/09 Ось H — «Hoher-Kontrast-Theme + Schriftgrößen-Schalter».
**Engine:** kinder-ui-Feature (CSS-Tokens + js/anzeige.mjs) + zentrale Seite.
Zielgruppe: 6–15 (Inklusion), alle Nutzer*innen.

## 1. Kernaussage

Ein zweites Token-Set in kinder-ui mit hohem Kontrast plus zwei Schriftgrößen-
Stufen, über prefers-contrast vorausgewählt und löschbar im localStorage.
Einmal in den Tokens umgesetzt, wirkt es in allen Apps, die boot() aufrufen.

## 2. Zielgruppe

Alle, besonders Kinder mit Seheinschränkung. Nachbarn: leichte-sprache-
werkstatt, alle Apps (via kinder-ui).

## 3. Ablauf

1) Kontrast (normal/hoch) und Schrift (normal/groß/sehr groß) wählen.
2) Live-Beispieltext zeigt die Wirkung.
3) Wahl gilt geräteweit; „Zurücksetzen“ entfernt sie.

## 4. Didaktik / Nutzen

Teilhabe/Barrierefreiheit (BFSG/EAA): bessere Lesbarkeit ohne fremde Hilfe.
Zentrale Stelle, aber wirksam in jeder eingebundenen App.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Nur die lokale
Einstellung (ui.anzeige), löschbar. Utility ohne eltern.html.

## 6. Tests

`packages/kinder-ui/test/anzeige.test.mjs`: naechsteSchrift-Zyklus,
wechsleKontrast, normalisiere (kaputte Werte), ladeEinstellung
(Speicher/prefers-contrast), speichere (Standard löscht), wendeAn
(data-Attribute), boot.

## 7. Erweiterungen (Katalog)

Einbindung in weitere Apps (ein Import), zusätzliche Schriftstufen,
Kopplung mit dem Leichte-Sprache-Schalter, prefers-reduced-motion-Hinweis.
