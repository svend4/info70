# Eingewöhnungs-Leitfaden 🌱

Инструмент **для педагогов** — каталог **docs/10 (Пралеска), Топ-30 №3**.
Leitfaden zur Eingewöhnung: vier Phasen (Grundphase, erster Trennungsversuch,
Stabilisierungsphase, Schlussphase), je Phase eine **druckbare Checkliste
собственных действий Fachkraft**.

**Ребёнок здесь не появляется.** Приложение не выставляет ребёнку оценку
(docs/02, Z. 141–146): ни светофора, ни ступени, ни балла, ни процента, ни
места в ряду. Оцениваются собственные действия взрослого, но не ребёнок.

**Статус: переработка** прежнего «Eingewöhnungs-Tagebuch» (Ampel-Verlauf je
Kind). Entscheidung des Nutzers (Variante A): die App bewertet kein Kind mehr
und speichert keine Kinderdaten auf dem Gerät.

## Was die App ist

- Vier Phasen mit Erklärung (Phasentexte aus `daten/config.json`).
- Je Phase eine Checkliste mit Fragen an die Fachkraft, zum Beispiel:
  „Bezugsperson mit den Eltern besprochen?“, „Verabschiedung vorbereitet?“.
- Bilanz je Phase, zum Beispiel `erledigt: 3 von 6`. Eine Summe über alle
  Phasen gibt es nicht, auch keinen Prozentwert.
- Druckbogen: vier Blätter, je Phase eins. Er zeigt die Haken der laufenden
  Sitzung. Keine Namenszeile.

## Was entfällt

Gegenüber dem Eingewöhnungs-Tagebuch entfallen: die Tagesampel und die
Trennungsstufen, die Empfehlungen, die Kürzel der Kinder, der Tagesverlauf und
der Elterngespräch-Bericht, der Koffer (Export und Import, `koffer.mjs`), der
Löschknopf (es gibt nichts zu löschen) sowie alle Tests zu Ampeln, Kürzeln und
Verlauf.

## Was gespeichert wird

**Nichts.** Die App schreibt weder in `localStorage` noch in `sessionStorage`,
IndexedDB oder Cookies. Die Haken liegen in einer einzigen Variable im Speicher
der Seite und sind nach dem Neuladen weg.

## Altbestand

Beim Start entfernt die App einmalig den Schlüssel `et.daten` der früheren
Fassung (`localStorage.removeItem`, in `try/catch`). Sie liest und schreibt ihn
nicht.

## Politik (DSGVO / EU AI Act)

Werbefrei, ohne Konto und Cloud. Keine externen Anfragen: der Netzwerk-Wächter
(`installiereNetzwerkWaechter`) blockiert sie zur Laufzeit, die CSP lautet
`default-src 'self'`. Es gibt keine Eingabefelder. `eltern.html` richtet sich an
Eltern, Träger und Leitung; die App ist im Eltern-Sammelband aufgeführt.

## Quellen

- `docs/02-anforderungen.md`, Z. 141–146: keine Bewertung eines Kindes; erlaubt
  ist die Bewertung eigener Handlungen der Fachkraft und des Gegenstands.
- `docs/10-praleska-baukasten.md`, Katalog Nr. 3: Herkunft der Idee.
- Phasennamen und Handlungen sind Eigenentwurf, angelehnt an die in Deutschland
  üblichen Eingewöhnungsmodelle (Berliner/Münchener Modell). Keine wörtlichen
  Zitate, keine Seitenangaben; die Literatur ist nicht seitengenau geprüft.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/eingewoehnungs-leitfaden/
node --test apps/eingewoehnungs-leitfaden/test/*.test.mjs
```

**21 Tests** in zwei Dateien: `test/logik.test.mjs` (9: Config, Bilanz, Druckbogen,
Exporte) und `test/quellcode.test.mjs` (12: keine Speicherwege außer dem
Altbestand, keine externen Adressen, keine Eingabefelder, Druckbogen, keine
Namenszeile, keine Modellnamen, Seiten und Eltern-Info, Koffer entfernt).
