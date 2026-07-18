# Kurz-GDD: Eingewöhnungs-Tagebuch 🌱

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 3 — «Eingewöhnungs-
Tagebuch». **Engine:** Ampel-Verlaufslog (reine Logik + JSON-Config + Datei-
Koffer). Zielgruppe: pädagogische Fachkräfte.

## 1. Kernaussage

Lokaler Ampel-Verlauf zur Eingewöhnung (Berliner/Münchener Modell): je Kind
wird pro Tag strukturiert festgehalten (Phase, Ampel 🟢/🟡/🔴, Trennung).
Daraus entsteht ein Verlaufsbericht mit Tendenz und Empfehlung fürs
Elterngespräch – ohne Score, ohne Vergleich.

## 2. Zielgruppe

Fachkräfte. Nachbarn: entwicklungs-kompass, schulstart-begleiter,
kita-wochenplaner, wohlfuehl-ampel.

## 3. Ablauf

1) Kürzel je Kind anlegen (keine Namen, max 3 Zeichen).
2) Pro Tag: Phase, Ampel und Trennung wählen und speichern (Tag-Nr. läuft hoch).
3) Verlauf (chronologisch) + Bericht mit Tendenz/Empfehlung kopieren/vorlesen.
4) Datei-Koffer sichern/einlesen (vorhandene Verläufe behalten Vorrang).

## 4. Didaktik / Nutzen

Eingewöhnung ist deutscher Kita-Standard, wird aber fast überall auf Papier
dokumentiert. Der strukturierte Ampel-Verlauf ist sofort anschlussfähig,
liefert eine ehrliche Tendenz (Verlaufshilfe, kein Urteil) und einen konkreten
nächsten Schritt (Trennungsabbruch hat Vorrang → Grundphase verlängern).

## 5. Politik-Konformität (docs/02, EU AI Act)

Keine externen Anfragen (NetzwerkWaechter), Kinder nur als Kürzel (3-Zeichen-
Deckel, auch beim Import), NUR strukturierte Felder (keine Freitexte/Namen),
KEIN Score/keine Rangfolge/kein Vergleich. localStorage nur „et.daten“ + „Alle
Daten löschen“; Sicherung nur als private Datei. Fachkraft-Werkzeug mit
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Config (Phasen/Ampeln/Trennungen), Kürzel-Deckel,
`pruefeEintrag` (nur gültige strukturierte Felder), `trend`
(aufwärts/schwierig/zu-wenig), `empfehlung` (Abbruch vor Ampel),
`verlaufZeilen` (chronologisch), `bericht` (Kopf/Verlauf/Tendenz, kein Score).
`test/koffer.test.mjs`: Roundtrip, eigene Art, Ablehnung fremder Art/langer
Kürzel/ungültiger Einträge, `vereinigeKoffer` (eigener Vorrang, Original unverändert).

## 7. Erweiterungen (Katalog)

Meilenstein-Begleiter (Nr. 4), druckbarer Verlauf, Phasen-Vorlagen je Modell,
uk/ru-Elterninfo.
