# Kurz-GDD: Tonleiter-Treppe 🎵

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 6 —
«Tonleiter-Treppe». **Engine:** Simulator + Hör-Aufgaben + WebAudio
(zweite WebAudio-App des Repos nach klang-detektive). Zielgruppe:
5–7 kurze Einheiten, Vertiefung 8–12.

## 1. Kernaussage

Notenlernen nach dem „Lesenka“-Prinzip: Die C-Dur-Tonleiter als visuelle
Treppe (8 Stufen, beim Klingen leuchtend). Erst der erste Tetrachord
Do-Re-Mi-Fa, dann Sol-La-Si-Do. Drei Modi: Erkunden (Stufen tippen,
Tetrachorde und ganze Treppe abspielen), Hör-Quiz (welcher Ton ist höher?
rauf oder runter?), Nachbauen (2–4-Ton-Folge im Tetrachord nachtippen).

## 2. Zielgruppe

Kinder 5–7 (kurz), 8–12 (Vertiefung). Nachbarn: klang-detektive
(Hör-Quiz), takt-pause, reim-radar (auditive Vorläuferfähigkeiten).

## 3. Ablauf

1) Erkunden: Treppe frei bespielen; Tetrachord-/Treppen-Knöpfe;
   Mitsing-Impuls (Solfeggio).
2) Hör-Quiz: Folge wird gespielt (mit Leucht-Feedback), Antwort per
   Knopf, Lösung nennt Solmisation + deutschen Namen; „Nochmal anhören“.
3) Nachbauen: Vorgabe hören → Stufen in Reihenfolge tippen; Eingabe
   sichtbar, löschbar; Lösung wird bei Fehler genannt (kein Beschämen).

## 4. Didaktik / Nutzen

Adaption laut Katalog: relative Solmisation, wie in deutscher
Elementarmusikpädagogik üblich, deutsche Tonnamen c–c′ parallel.
Fachlich abgesichert per Validator/Tests: 8 Stufen streng steigend,
a = 440 Hz, Oktave c→c′ = Faktor 2, Tetrachorde 1–4/5–8,
Richtungs-Aufgaben bleiben im Tetrachord (didaktische Progression).
Töne als weiche Dreieckswelle mit sanfter Hüllkurve (kein Knacken). Eine
neue Folge bricht die laufende sauber ab (Generationszähler + gestoppte
Oszillatoren) – sonst klängen zwei Folgen übereinander und das Hörbeispiel
wäre wertlos. Das Leuchten wird direkt an den Stufen-Knöpfen umgeschaltet
statt die Seite neu zu bauen, damit die Tastatur-Fokussierung stehen bleibt.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert
nichts**; alle Töne lokal per WebAudio, kein Mikrofon, keine Aufnahmen.
Ehrliche Grenze in eltern.html: für gehörlose Kinder ungeeignet;
Leucht-Treppe als visuelle Stütze. Mitsing-Impuls statt Dauer-Tippen.
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (6): Tonleiter gültig (streng steigend, Oktave ×2);
Stimmton a=440/Namen; `hoehereStufe`/`richtungVon`; `folgeRichtig`;
`baueAufgabe` deterministisch (injizierter Wähler, alle 3 Arten);
Richtungs-Aufgaben ohne Tetrachord-Sprung.

## 7. Erweiterungen (Katalog)

Notenzeilen-Ansicht (Klasse 1–2), Dur/Moll-Hören, Lied-Anfänge nachbauen,
visuelles Metronom (BFSG-Brücke zu rhythmus-orchester).
