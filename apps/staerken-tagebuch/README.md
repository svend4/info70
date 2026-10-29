# 🌟 Stärken-Tagebuch

«Дневник сильных сторон» — инструмент **для родителей** (дети 3–7): взрослые
отмечают наблюдаемые в быту моменты из **фиксированного списка** (4 поля
сильных сторон × 8 моментов: Denken & Entdecken, Kreativ & Kunst, Sozial &
Miteinander, Bewegung & Geschick — «строит долго и сосредоточенно», «утешает
по собственной инициативе», «придумывает истории»...). Приложение считает
только **частоту** отметок по полям и к двум самым частым полям показывает по
5 игровых импульсов для дома — бесплатных, из подручных материалов и без
экрана. Подход: взгляд на сильные стороны вместо дефицитов.

**Статус: рабочий MVP.** Происхождение: каталог №2 (docs/10, дериваты
Праляски) — концепт «Staerken-Tagebuch fuer Eltern» из пункта перечня «Individuelle
Besonderheiten, Begabungsarten, Temperament» (S. 18). Взято только понятие
(наблюдение интересов/темперамента/полей одарённости); все моменты, тексты и
игровые идеи сформулированы заново, ничего не переведено и не заимствовано.

## Осознанные границы дизайна

- **AI Act / этика**: НИКАКОГО скоринга, рейтинга, «вердикта об одарённости»
  или сравнения детей. Считается лишь частота собственных наблюдений
  родителя; она служит только для подбора игровых идей. В UI закреплён текст
  «Beobachtung ist keine Diagnose — bei Sorgen: Erziehungsberatung /
  Frühförderstelle (kostenlos)».
- **Датеншпарзамкайт**: НИКАКОГО свободного текста о ребёнке — только
  фиксированные моменты; ни имён, ни возраста, ни заметок. Даже импорт
  koffer-файла отклоняет неизвестные id (нельзя «вкрутить» свободный текст).
- **Игровые импульсы без экрана**: тест фиксирует, что в текстах импульсов
  нет App/Video/Bildschirm/Tablet/Handy и т. п.; все идеи бесплатны.
- eltern.html здесь — концепт-страница: зачем без диагноза, куда обращаться
  при тревогах (Erziehungsberatung, Frühförderstellen, Elterntelefon).

## Lernziele (для взрослого)

1. Родитель может **замечать и называть** конкретные сильные моменты ребёнка
   вместо смутного «он у нас способный / отстаёт».
2. Родитель может **предложить подходящую бесплатную игру без экрана** к
   тому, что ребёнок и так делает охотно (стратегия «усиливать сильное»).
3. Родитель может **объяснить**, почему частота наблюдений — не диагноз, и
   знает бесплатные адреса помощи при реальных тревогах.

## Технически

Политика docs/02: CSP `default-src 'self'`, `installiereNetzwerkWaechter()`;
в localStorage — только счётчики отметок (`st.markierungen`), кнопка «Alle
Daten löschen». Контент — `daten/beobachtungen.json` (схема валидируется
тестом: ровно 4 поля × 8 моментов × 5 импульсов, id уникальны); чистая логика
(`pruefeKatalog`, `zaehleJeFeld`, `haeufigsteFelder`, `aendereMarkierung`) —
в `logik.mjs`; экспорт/импорт/слияние наблюдений двух родителей — по образцу
mitmach-arena в `koffer.mjs` (`packe`/`pruefe`/`vereinige`); всё покрыто
node:test.

```bash
npm run dev   # → http://localhost:8070/apps/staerken-tagebuch/
node --test apps/staerken-tagebuch/test/
```

## Seitenangaben (Serie C, Pilot 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft wurden alle Seitenangaben dieser Datei gegen die Textkopie der Pralęska (`tools/app-seiten-pruefen.mjs`, Urteil je Angabe im Lauf vom 29.10.2026). Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen.

Ergebnis: Die Seite 18 stimmt. Korrektur 29.10.2026: «Individuelle Besonderheiten, Begabungsarten, Temperament» ist kein Abschnitt der Quelle, sondern ein Punkt in einer Aufzählung auf S. 18. Dafür steht jetzt „Punkt“ statt „Abschnitt“ (Wortlaut in README und GDD geändert, vorher „раздела“).
