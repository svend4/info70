# Kita-Unterstützungs-Navigator: Kurz-GDD

## Kernentscheidungen

1. **Fragen an die Einrichtung, nicht an Personen.** Die 24 übernommenen Aufgaben betreffen die
   Einrichtung, das Team, die Gruppen und die Eltern insgesamt. Aufgaben über einzelne Kinder, einzelne
   Familien oder einzelne Fachkräfte sind nicht übernommen. Die Liste mit Seiten steht im README.
2. **Keine Bewertung.** Keine Ampel, keine Prozentzahl, keine Summe über alle Fragen, keine Rangfolge.
   Gezählt wird je Block: „geregelt: X, teilweise: Y, nicht geregelt: Z, Träger oder extern: W, ohne
   Antwort: V“. Das folgt docs/02, Z. 141–146.
3. **Nichts wird gespeichert.** Antworten und Kontaktzeilen liegen im Speicher der Seite. Es gibt keinen
   Zugriff auf Browser-Speicher, Cookies oder Datenbanken. Eine Textdatei entsteht nur auf Knopfdruck.
4. **Bericht ohne Personen.** Der Bericht zählt je Block und nennt die Fragen mit „nicht geregelt“ mit
   Seite. Keine Namen, keine Angaben zu einzelnen Kindern, Familien oder Personen, keine Kontaktdaten.
5. **Druckbogen ohne Kästchen.** Der leere Bogen hat Fragen, Antwortoptionen als Text und leere Linien.
   Keine Kästchen, keine Häkchen, keine Sterne, keine Zeile für einen Namen.
6. **Keine Rechtsnormen.** Nichts davon ist geprüft. Deshalb steht im Text kein Gesetzesverweis.
7. **Keine Verbindung nach außen.** CSP `default-src 'self'` und der Netzwerk-Wächter aus
   `packages/kinderschutz`.

## Offen-Punkte für den Nutzer

1. **Grenzfälle prüfen.** Angebote für Einzelne oder Gruppen bleiben drin, wenn der Gegenstand die Eltern
   oder das Team insgesamt ist (S. 315, S. 316). Ausgeschlossen bleiben die Hilfe für Kinder mit besonderem
   Förderbedarf (S. 314) und der Typ des Zusammenwirkens einzelner Fachkräfte (S. 316). Wer das anders
   sieht, muss die Liste im `logik.mjs` ändern und die Tests anpassen.
2. **Teil der Aufgabe auf S. 317.** Die Frage zum Klima im Team ist übernommen. Die Verträglichkeit einzelner
   Fachkräfte mit einer Gruppe nicht.
3. **Fragen sind Eigenentwurf.** Ob die 24 Fragen den Anhang vollständig und richtig abbilden, ist nicht gegen
   eine zweite Lesung geprüft. Ein Gegencheck mit der Quelle auf den Seiten 312 bis 317 steht aus.
4. **Anlaufstellen.** Die Liste nennt fünf Kategorien ohne Kontakt. Ob es im Umfeld passende Stellen gibt, weiß
   nur die Einrichtung. Eine lokale Liste ist nicht vorgesehen.
5. **Rechtsbezüge fehlen.** Der Anhang und der Katalog verweisen auf Rechte des Kindes und auf Gesetze. Beides
   ist nicht geprüft und deshalb nicht in den Texten. Eine Rechtsangabe kommt erst zurück, wenn sie geprüft ist.
6. **Erprobung.** Ein Test mit drei bis fünf Fachkräften und einer Vertretung des Trägers klärt, ob die Fragen
   verständlich sind und ob die Ausschlüsse nachvollziehbar sind.
7. **Format des Berichts.** Ausgegeben wird nur Text, kein PDF und keine Tabelle.

## Tests

37 Tests in `test/logik.test.mjs` und `test/regeln.test.mjs`. Lauf:
`node --test apps/kita-unterstuetzungs-navigator/test/*.test.mjs`.
