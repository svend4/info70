# Kurz-GDD: Ein Tier zu Gast 🐹

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 4 — «Ein Tier
zu Gast – Verantwortungs-Trainer». **Engine:** Szenario-Trainer 2/1/0
(bewährtes Muster von sicher-unterwegs / ich-schaff-das). Zielgruppe:
5–7 und 8–12.

## 1. Kernaussage

Zehn Alltagssituationen rund um Meerschweinchen, Hamster, Kaninchen und
Wellensittich: leise sein, richtig füttern, Ruhe lassen, Sauberkeit,
Krankheit erkennen, Hitze-Schutz, Tier zu Gast in der Gruppe. Je Szene
3 Handlungsoptionen (2/1/0 Punkte) mit kindgerechter Erklärung – aktives
Verantwortungslernen statt bloßer Beobachtung.

## 2. Zielgruppe

Kinder 5–7 (Vorlesen) und 8–12. Nachbarn: sicher-unterwegs (gleiche
Engine), wer-wohnt-wo (Wildtiere), mini-gaertner-begleiter.

## 3. Ablauf

1) Intro mit Kernregel (nie einzeln halten) + Rekord (löschbar).
2) 10 gemischte Szenen: Situation → 3 gemischte Optionen → Feedback
   (🌟/👍/💭) mit Erklärung, Vorlesen überall.
3) Ende: Rang (🌱→🏅), Gesprächsimpuls „Passt ein Tier zu uns?“.

## 4. Didaktik / Nutzen

Adaption laut Katalog: Botschaften an deutschem Tierschutzgesetz-
Alltagsverständnis und Heimtier-Empfehlungen ausgerichtet (Meerschweinchen/
Kaninchen/Wellensittiche nie einzeln; Hamster nachtaktiv → für kleine
Kinder ungeeignet; Fluchttiere nicht hochheben; nicht fressen = Notfall;
Hitze gefährlich). Ersetzt reine Beobachtung durch Verantwortungs-Szenen;
Anschluss Sachunterricht Klasse 1–4. Validator erzwingt die
Szenario-Invariante (genau eine 2er-, mindestens eine 0er-Option) und
erreichbare Ränge. Ein Teilpunkt (1) steht nur dort, wo die Handlung
wirklich halb richtig ist – Scheinlösungen wie „Spiegel statt Artgenosse“
oder „ein nachtaktives Tier am Tag wecken“ geben 0, sonst widerspräche die
Punktzahl der eigenen Erklärung.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei; localStorage nur
für den Rekord, mit 🗑️-Löschknopf im Start. Kein echtes Tier nötig –
und die App sagt ehrlich: „noch kein Tier“ ist auch tierfreundlich.
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (7): Szenarien gültig (Invariante 2/1/0);
Kernbotschaften verankert (Artgenossen, nachtaktiv, Fluchttiere,
Tierarzt, nicht schwitzen); beste Option ist nie „Nichts tun“;
Ränge erreichbar/monoton; Validator-Negativproben; halbe Punkte nur für
halb richtige Handlungen (Spiegel und Wecken geben 0); kein Beschämen +
Erwachsene bei Gefahr im Boot.

## 7. Erweiterungen (Katalog)

Weitere Tiere (Katze, Hund, Fische), Checkliste „Bevor ein Tier einzieht“
als Druckbogen, uk/ru-Vorlesen.
