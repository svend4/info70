# Brief: Kurz-GDD schreiben (Entscheidungen Max 26а und 11а)

Repo: /home/user/info70. Du schreibst nur Dokumente. Kein Code, keine Daten, keine Tests, keine README, keine Wurzel-Dateien. Kein git add, commit, push, stash, checkout.
Andere Agenten arbeiten gleichzeitig an anderen Dateien.

## Aufgabe
Für jede genannte Einheit eine Datei im Format der vorhandenen Kurz-GDD (Vorlage: apps/stark-und-gesund/GDD.md; lies sie zuerst und eine zweite aus apps/*/GDD.md).
Sprache wie die vorhandenen GDD: Russisch mit deutschen Fachbegriffen und Dateinamen. Neun Abschnitte mit denselben Überschriften wie in der Vorlage:
1 Феномен / потребность (Warum), 2 Игрок и обещание (Wer + Kernerlebnis), 3 Движок и петля (Wie), 4 Lernziele (проверяемые), 5 Контент-план,
6 Политика соответствия (Pflicht), 7 Стандарты и финансирование (Wofür), 8 Аджайл-оценка, 9 Kindertest-гипотезы. Dazu am Ende ein zehnter Abschnitt
«10. Offen / Zweifel» mit den Widersprüchen und offenen Fragen, die du gefunden hast.

## Teil A: bestehende Apps ohne GDD (Ziel: apps/<slug>/GDD.md, neue Datei)
Warum: ohne GDD ist unklar, für wen die App ist (Kinder oder Erwachsene); davon hängt die Wertungsregel ab. Lies README.md, index.html, eltern.html, app.mjs, logik.mjs,
daten/*.json und test/ der App und beschreibe, was die App WIRKLICH tut.
- Abschnitt 2 nennt die Zielgruppe ausdrücklich: «Zielgruppe: Kinder (Alter …)» oder «Erwachsene (…)» oder «beide (Ko-Nutzung)», mit Belegen (Fundstelle in README/Code).
- Abschnitt 6 (Politik) ist eine Prüfliste mit [x] / [ ] und NUR Punkten, die du am Code geprüft hast: Werbefrei, keine Konten, keine externen Anfragen (CSP, installiereNetzwerkWaechter),
  Speicher (grep setItem/removeItem/datenKarte/loescheDaten/speicherSchluessel; welche Schlüssel; Löschknopf ja/nein), kein Service Worker (gibt es seit 9б nicht mehr),
  Vorlesen (grep vorlesen), eltern.html vorhanden, Impressum-Link im Fuß, Druck (druck.css vorhanden? Was wird gedruckt?), keine Wertung des Kindes
  (node tools/leistungs-woerter.mjs <app> und docs/bewertung-stand.json: steht die App unter ausnahmen, mit welchem Grund?).
- Abschnitt 8: Aufwand (S/M/L) nach dem Umfang des Codes; was die App wiederverwendet (quiz-kern, kinder-ui, kinderschutz).
- Testzahl: nenne sie nur, wenn sie exakt stimmt (node --test apps/<slug>/test/*.test.mjs, Zahl der Tests); sonst weglassen. Den Test, der das prüft, kannst du laufen lassen:
  node --test packages/kinderschutz/test/testzahlen.test.mjs
- Wo README, Code und Texte einander widersprechen (Zahlen, Altersangaben, Speicheraussagen), schreibe es in Abschnitt 10; ändere die anderen Dateien nicht.

## Teil B: Einheiten der neuen Welle (Ziel: docs/neue-welle/GDD-<Kennung>.md, neue Dateien; lege den Ordner an)
Grundlage: der Bauauftrag docs/bauauftraege/<Kennung>-*.md, der Katalogeintrag (docs/praleska-katalog.json, nach Titel suchen) und docs/plan-neue-welle.md (Abschnitt 3: Tore für neue Apps).
Es ist ein Entwurf ohne Code. Alles, was nicht aus der Quelle stammt, ist mit «(Eigenentwurf)» gekennzeichnet. Keine Zitate über 6 Wörter aus der Praleska; Seitenangaben nur so, wie der Bauauftrag sie führt.
Abschnitt 3 nennt zwei Wege für den Motor (quiz-kern ohne Wertung oder eigene Karten-App) und empfiehlt einen mit Begründung; die Entscheidung liegt bei Max.
Abschnitt 6 enthält die Tore aus docs/plan-neue-welle.md als Prüfliste (alle [ ]); Abschnitt 10 die offenen Fragen (zum Beispiel Fachprüfung, Quelle nicht im Repo prüfbar).

## Regeln
- Keine neuen Fakten über Recht, Geld oder Gesundheit erfinden. Was nicht belegt ist: «(offen)».
- Keine Modellnamen. Nenne docs/02 nur mit einer der Zeilenangaben Z. 22–24, Z. 79–82 oder Z. 141–146 (einige App-Tests prüfen das).
- Nichts anderes ändern als die genannten Zieldateien.

## Bericht (JSON nach Schema)
Je Datei: pfad, zielgruppe (Kind | Erwachsene | beide | unklar | nicht zutreffend), belege (kurze Liste), offene_punkte (Liste), widersprueche (Liste), geprueft (was du am Code geprüft hast, kurze Liste).
