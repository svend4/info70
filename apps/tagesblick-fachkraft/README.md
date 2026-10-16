# 📋 Tagesblick Fachkraft

Инструмент **для педагогов** (ясли/сад, дети 1–7): ежедневная отметка
**собственных действий** Fachkraft. Шесть пунктов в трёх блоках, отмечаются
галочками. Видно, сколько пунктов в каждом блоке выполнено (`erledigt: 2 von 2`).
Общей суммы нет.

**Ребёнок здесь не появляется.** Нет имён, сокращений, списка детей и оценок:
ни светофора, ни ступени, ни балла, ни процента, ни места. Оцениваются
собственные действия взрослого, но не ребёнок (docs/02, Z. 141–146).

**Статус: переработка** прежней «Wohlfühl-Ampel Gruppe». Entscheidung des
Nutzers (Variante A): die App bewertet kein Kind mehr und speichert keine
Kinderdaten auf dem Gerät.

## Handlungen (Eigenentwurf)

Die Handlungen sind eigene Formulierungen. Aus den bisherigen Impuls-Texten
der früheren Fassung umformuliert; übernommen ist kein Zitat.

- **Zeit und Mitsprache:** Einzelzeit angeboten · Kindern Mitsprache gegeben
- **Beschwerde und Gespräch:** Beschwerdeweg erklärt · Elterngespräch angeboten
- **Team und Fachberatung:** Teamgespräch geführt · Fachberatung eingeholt

## Was entfällt

Gegenüber der Wohlfühl-Ampel entfallen:

- Ampel 🟢 🟡 🔴 und alle Stufen
- Kürzel der Kinder, Kinderkarten und die Kinderliste (bis 20 Kinder)
- Kontext-Tags (Eingewöhnung, Konflikt, müde, Abschied schwer, neu in Gruppe)
- Wochenansicht mit 7 Tagen je Kind
- Serie und der Impuls-Auslöser „drei Rot-Tage“
- Koffer mit Datei-Export und -Import sowie die Kürzel-Prüfung
- Löschknopf „Alle Daten löschen“ (es gibt nichts mehr zu löschen, außer dem Altbestand)
- Dateien `ampel-koffer.mjs` und `test/ampel-koffer.test.mjs`

## Was gespeichert wird

**Nichts.** Der Zustand (Tag und erledigte Handlungen) liegt in einer Variablen
im Speicher der Seite. Nach dem Neuladen ist er weg. Es gibt keinen
Schreibzugriff auf localStorage, sessionStorage, IndexedDB oder Cookies. Das
prüft `test/regeln.test.mjs` am Quelltext.

## Altbestand-Bereinigung

Beim Start wird einmal der Schlüssel `wa.daten` der früheren Fassung aus dem
localStorage entfernt: `localStorage.removeItem(ALTER_SCHLUESSEL)` in try/catch.
Nur Löschen, nie Schreiben. Alte Exportdateien (`wohlfuehl-ampel-gruppe.json`)
erreicht die App nicht; das steht in `eltern.html`.

## Tagesbogen zum Ausdrucken

Der Druckknopf ruft `window.print()` auf. `druck.css` blendet dabei den
Bildschirm aus und zeigt nur den Bogen. Der Bogen enthält die Handlungen mit
Kästchen und ein Datumsfeld zum Ausfüllen von Hand. Keine Namenszeile und keine
Häkchen vom Bildschirm auf dem Papier (docs/02, Z. 79–82).

## Rechtsangaben

Keine. Die frühere Verweisung auf § 45 SGB VIII ist entfernt. docs/02 verlangt
für eine Paragraphen-Angabe den Vermerk «проверено человеком»; den gibt es hier
nicht.

## Technisch

- `index.html`: CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`,
  Netzwerk-Wächter `installiereNetzwerkWaechter()` beim Start.
- `logik.mjs`: reine Logik ohne DOM (`BEREICHE`, `tagesSchluessel`,
  `tagesLabel`, `zaehleBereich`, `bilanzText`).
- `app.mjs`: Oberfläche. Eine Antwort ändert nur den Knopf der Frage
  (`aria-pressed`) und die Bilanz des Bereichs. Die Seite wird nicht neu aufgebaut.
- `druck.css`: Tagesbogen zum Ausdrucken.
- `eltern.html`: Info für Träger und Leitung.

## Тесты

19 тестов. Запуск:

```bash
node --test apps/tagesblick-fachkraft/test/*.test.mjs
```

- `test/logik.test.mjs`: Handlungen, Zählung je Bereich, Datum, keine Gesamtsumme in der Schnittstelle.
- `test/regeln.test.mjs`: Quelltext. Keine fremden Adressen, nichts gespeichert, Altbestand nur entfernt, keine Eingabefelder, Druckbogen ohne Häkchen und ohne Namenszeile, keine Modellnamen, `eltern.html`.

## Quellen

- Praleska (Volltext), S. 15–18: Thema Psychologische Gesundheit / emotionales
  Wohlbefinden. Nur das Thema, kein Zitat. Die Handlungen sind Eigenentwurf.
- docs/02 (Release-Regeln) und docs/10 (Katalog-Eintrag der früheren Fassung).

## Lokal starten

```bash
npm run dev   # → http://localhost:8070/apps/tagesblick-fachkraft/
npm test
```
