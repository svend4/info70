# Kurz-GDD: Rhythmus-Orchester 🥁

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 7 —
«Rhythmus-Orchester». **Engine:** Sprechvers-Simulator + Nachbau-Aufgaben +
WebAudio (dritte WebAudio-App des Repos nach klang-detektive und
tonleiter-treppe). Zielgruppe: 5–7 kurze Einheiten, Vertiefung 8–12.

## 1. Kernaussage

Rhythmus mit dem ganzen Körper: Die App benutzt die Silbensprache der
Elementarmusikpädagogik — **♩ ta** (ein Schlag), **♫ ti-ti** (zwei schnelle
Silben auf einem Schlag), **⏸ Pause** (ein Schlag Stille). Drei Modi:
Vers mitmachen (fünf eigene Sprechverse sprechen, klatschen, stampfen,
schnipsen, dazu eine Bewegungsidee), Rhythmus nachbauen (gehörtes
Vier-Schlag-Muster aus den Bausteinen legen), Orchester (drei
Körper-Percussion-Stimmen setzen nacheinander ein).

## 2. Zielgruppe

Kinder 5–7 (kurz, am besten zu zweit oder zu dritt), 8–12 (Vertiefung).
Nachbarn: tonleiter-treppe (Tonhöhe), takt-pause (Tagesrhythmus),
klang-detektive (Hören), silben-springen (Silben im Wort).

## 3. Ablauf

1) Vers mitmachen: Vers wählen → Verszeilen mit Notenzeichen und Silben
   unter jedem Schlag → „Rhythmus vorspielen“ (Metronom + Klatschen),
   „Vers vorlesen“, Tempo 60/80/100, Bewegungsidee, drei Mitmach-Knöpfe
   (Klatschen/Stampfen/Schnipsen sofort).
2) Rhythmus nachbauen: App klatscht vier Schläge → Bausteine legen →
   nach dem vierten Baustein Auflösung im Klartext („ta – ti-ti – …“),
   kein Punktestand, keine Zeitmessung.
3) Orchester: drei Stimmen mit eigenem Ostinato, einzeln anhörbar,
   an-/abwählbar; „Nacheinander einsetzen“ spielt vier Phrasen, in denen
   Stimme für Stimme dazukommt; „Stopp“ bricht jederzeit ab.

## 4. Didaktik / Nutzen

Adaption laut Katalog: Rhythmus wird gesprochen, bevor er gespielt wird.
Fachlich abgesichert per Validator/Tests: jeder Baustein füllt **genau
einen Schlag**, jeder Takt genau vier — deshalb passt jedes Muster exakt
auf die vier Felder des visuellen Metronoms; zu jedem Baustein gehört die
passende Silbenzahl (ti-ti = 2, ta = 1, Pause = 0), sonst meldet der
Validator den Vers. Mindestens ein Vers übt die Pause (Zähl-Vers am
Taktende, Katzen-Vers am Taktanfang: Einsatz abwarten). Die drei Stimmen
müssen drei verschiedene Einsätze haben und eine muss in Phrase 1
beginnen — sonst wäre „nacheinander einsetzen“ keine Erfahrung.

Alle Klänge entstehen lokal: Klatschen und Schnipsen als gefiltertes
Rauschen (Hochpass 900 bzw. 2600 Hz), Stampfen als schnell fallender
Sinus (95 → 45 Hz), Metronom als Dreieck-Klick mit betontem ersten
Schlag. Eine neue Wiedergabe bricht die laufende sauber ab
(Generationszähler + gestoppte Quellen) — sonst liefen zwei Stücke
übereinander und alte Timer würden das Leuchten des neuen Stücks wieder
ausschalten. Das Leuchten wird direkt an den Feldern umgeschaltet statt
die Seite neu zu bauen, damit die Tastatur-Fokussierung stehen bleibt.

**BFSG:** Das visuelle Metronom leuchtet auf jedem Schlag mit, die
Verszeilen stehen als Text da (die Felder sind `aria-hidden`, damit
Screenreader die Silben nicht doppelt vorlesen). Vers- und
Orchester-Modus funktionieren dadurch auch ohne Hören; nur das Nachbauen
setzt Hören voraus — das steht ehrlich in eltern.html.

**Eigenproduktion:** Alle fünf Sprechverse sind für diese App
geschrieben; aus dem Katalog stammt nur die Methode (Silbensprache,
Ostinato, gestaffelte Einsätze).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten,
**speichert nichts**. Alle Klänge lokal per WebAudio, **kein Mikrofon**,
keine Aufnahmen, keine Audiodateien. Kein Punktestand und keine
Zeitmessung — der Vers wird geübt, nicht bewertet. eltern.html, im
Sammelband.

## 6. Tests

`test/logik.test.mjs` (8): Datenbestand gültig (5 Verse, 3 Stimmen, alle
Takte 4 Schläge); jeder Baustein = 1 Schlag, `schlaegeVon`/`passtInTakt`
inkl. unbekanntem Baustein; `anschlaege` (ti-ti im halben Abstand, Pause
stumm, Tempo-Skalierung, Katzen-Vers wartet); `musterRichtig`;
`baueMuster` deterministisch und nie nur Stille; Silben-Zuordnung und
`silbenText`/`sprechText`; `stimmenFuerPhrase`; zehn Negativ-Proben des
Validators (Takt zu lang, falsche Silbenzahl, leere Silbe, kein Vers mit
Pause, doppelter Einsatz, kein Einsatz in Phrase 1, stummes Ostinato,
unbekannter Klang, zu kurze Bewegungsidee, zu wenige Verse).

## 7. Erweiterungen (Katalog)

Eigene Verse eintippen und silbenweise legen, Rondo-Form (A-B-A),
Instrumenten-Klänge (Klanghölzer, Trommel), Rhythmus-Diktat mit zwei
Takten, Notenzeilen-Ansicht als Brücke zu tonleiter-treppe.
