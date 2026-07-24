# Kurz-GDD: Mini-Gärtner-Begleiter 🌱

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 29 — «Mini-Gärtner-
Begleiter». **Engine:** Erwachsenen-Katalog + Checkliste + Druck (reine
Logik für Saison/Status/Tagebuch). Zielgruppe: Fachkräfte & Eltern
(Kinder 4–7 gärtnern draußen mit).

## 1. Kernaussage

Saison-Planer für Hochbeet/Kita-Garten mit Kindern: Pflanzkalender für 8
kindgeeignete Kulturen (an deutsches Klima/Kita-Praxis angepasst: Kresse,
Radieschen, Kapuzinerkresse, Sonnenblume, Zuckererbse, Buschbohne,
Kartoffel-Projekt, Zucchini), Monatsaufgaben inkl. BNE (Insektenhotel,
Vogelfutter, Kompost, Igel-Laubhaufen), Aufgaben-Checklisten je
Entwicklungsstufe (säen, gießen nach Bodenzustand/Fingerprobe, lockern,
ernten) und ein druckbares Pflanztagebuch für die Kinder. Gegärtnert wird
draußen – der Bildschirm plant nur.

## 2. Zielgruppe

Fachkräfte/Eltern (Kinder 4–7). Nachbarn: kita-wochenplaner,
bewegungspausen-generator, nahrungsnetz-werkstatt (BNE), mess-labor
(Vermuten im Beet), jahreszeiten-rad.

## 3. Ablauf

1) Monat wählen (Start: aktueller Monat) → „jetzt säen“ / „jetzt ernten“
   als Chips + 3 Monatsaufgaben mit den Kindern.
2) Kultur antippen → Steckbrief: Standort, Saat-/Erntemonate,
   Schwierigkeit, Kinder-Tipp, ggf. ⚠️ Sicherheits-Hinweis, Status im
   gewählten Monat.
3) Checklisten je Entwicklungsstufe (Kleine Gärtner 4–5 / Große Gärtner
   5–7) mit Begleit-Hinweis für Erwachsene.
4) Pflanztagebuch für die gewählte Kultur drucken (druck.css): 4–8
   Wochenzeilen (je nach Wartezeit) zum Malen, Messen und Abhaken –
   ausgefüllt wird auf Papier.

## 4. Didaktik / Nutzen

Hochbeet und Kita-Garten boomen (BNE-Verankerung in den Bildungsplänen,
EU-Schulprogramm). Buchgetreue Kernideen: Arbeit in der Natur nach
Entwicklungsstufen, gießen nach Bodenzustand (Fingerprobe – testgeprüft),
Verantwortung durch Dienste. Adaption: Tierpflege auf DE-Kita-Realität
reduziert (Insektenhotel, Vogelfutter statt Käfigtiere). Sicherheits-Layer:
rohe Bohnen giftig / grüne Kartoffelstellen / bittere Zucchini – der
Validator erzwingt diese Hinweise im Datenbestand.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(Tagebuch wird auf Papier geführt, Name nur auf Papier). Kinder gärtnern
ohne Bildschirm. eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (7): Katalog gültig (8 Kulturen, 12 Monate, 2
Stufen); Pflicht-Sicherheitshinweise (giftig/kochen/bitter) inkl.
Validator-Negativprobe; `kulturenImMonat` (Januar nur Kresse, Mai volle
Pflanzzeit); `statusImMonat`; `tagebuchWochen` (Klammer 4..8);
`monatsName`-Ränder; BNE-Anker (Insektenhotel, Kompost, Vogelfutter im
Winter).

## 7. Erweiterungen (Katalog)

Beet-Plan als Druckraster, Aussaat-Erinnerungsliste je Gruppe,
Saatgut-Tauschbörse-Aushang, Kräuter-Erweiterung (Schnittlauch, Minze).
