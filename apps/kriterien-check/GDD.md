# ✅ Kriterien-Check — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле: по `README.md`,
> `index.html`, `app.mjs`, `logik.mjs`, `druck.css`, `test/logik.test.mjs` и каталогу
> `packages/kinderschutz/src/kriterien.mjs` (папки `daten/` у приложения нет), плюс замеры в браузере при 360 px
> (`tools/browser-pruefung.mjs`, `tools/browser-tor.mjs` и одноразовые скрипты вне репозитория — в репо их нет).
> Чего здесь не проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные этим документом
> не менялись.

## 1. Феномен / потребность (Warum)
По README операторам детских сайтов и приложений и заявителям на гранты нужно показать, что предложение отвечает критериям:
каталог fragFINN (формальные условия whitelist, среди них Impressum), условия BzKJ «Kindgerechte digitale Angebote»,
DSGVO Art. 8 (README Z.3–6 и Z.15–18; docs/04, этап 1; «Nachweis»-папка в docs/07; право, сроки и условия программ здесь не
перепроверены — «(offen)»). Без инструмента эти требования разбросаны по текстам нескольких программ и по политике проекта:
нет одного списка с подсказкой «как это проверить» и с отчётом, который можно приложить к заявке. Приложение — чек-лист с
прогрессом и экспортом. Сертификата оно не выдаёт: последняя строка отчёта — «Hinweis: Selbstprüfung, kein offizielles
Testat.» (`logik.mjs` Z.34).
Происхождение (git): вторая волна, 12.07.2026 (ece802d; в списке идей оценено как «инфраструктурная ценность») — тогда были
отметки, копирование и сброс; логика отчёта, .txt, .json, кнопка печати и тесты — Welle 38, 18.07.2026 (6087651);
`druck.css` — Welle 82, 09.10.2026 (ee4d26a).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Erwachsene (Betreiber*innen von Kinderangeboten, Redaktionen, Antragstellende für Whitelist und Förderung).**
Belege:
- `README.md` Z.3 «Инструмент для взрослых (операторов детских сайтов/приложений, заявителей на гранты)»; `app.mjs` Z.2
  «Zielgruppe: ERWACHSENE», Z.73 подзаголовок «… (für Erwachsene)», Z.112 Fuß «Werkzeug für Erwachsene»; `index.html` Z.7
  (meta description, «Für Erwachsene.»); `package.json` Z.5 «Zielgruppe: Erwachsene».
- `docs/erwachsenen-apps.json`: запись `kriterien-check` (Bereich «Für Betreiber*innen», Prüfung «nach Feld: kein
  Kindbezug», `zielgruppeGeprueft: true`); хаб `index.html` Z.240–241 — раздел «Für Betreiber*innen».
- Ребёнок нигде не адресован: обращение на «du» («So prüfst du das», «Prüfe: …») идёт к оператору; детского контента нет, полей
  ввода нет, кроме 16 чекбоксов и `readonly`-textarea с отчётом; нет `eltern.html`, нет Vorlesen, нет Hilfe-Insel (по комментарию
  теста `hilfe-insel-abdeckung` Hilfe-Insel не ставится в Werkzeuge für Erwachsene). Правило «Kind-App» (решение 34а) не
  применяется; о детях говорят только сами критерии.

Соседи: `fragfinn-selbsttest`, `kria-check`, `dsa-selbstaudit`, `bfsg-check`, `seitenstark-qualitaets-check` (другие
инструменты для Betreiber*innen). В Praleska-каталоге (`docs/praleska-katalog.json`) 10 записей называют `kriterien-check`
своей Engine в поле `engine`.

Одно предложение: «Betreiber*in детского предложения проходит 16 критериев (fragFINN, BzKJ, DSGVO …), к каждому может
открыть подсказку „So prüfst du das“, отмечает выполненное и уносит отчёт (копия, .txt, .json, печать) для заявки в
whitelist fragFINN или для Förder-Nachweis».

## 3. Движок и петля (Wie)
Движок: собственный чекбокс-список, без `quiz-kern`. `app.mjs` (116 строк) рисует страницу, `logik.mjs` (48 строк, без DOM)
строит группы и отчёт; критерии берутся из `@info70/kinderschutz` (`KRITERIEN`, `app.mjs` Z.8) — в приложении каталог не
дублируется.
Основная петля: открыть → 16 критериев в 7 группах (группа = текст источника до «:», `gruppiere`) → прочитать критерий, при
желании раскрыть «💡 So prüfst du das» → отметить чекбокс (3 rem) → «Erfüllt: n von 16 Kriterien (x %)», полоса прогресса и
текст отчёта обновляются → «📋 Bericht kopieren» / «💾 Als .txt» / «🧩 Als .json» / «🖨️ Drucken» → при необходимости
«🧹 Zurücksetzen». Состояние лежит в `kc.status` и переживает перезагрузку (замер).
Каждая отметка перерисовывает всю страницу (`render()`, `app.mjs` Z.45–50); следствие — потеря фокуса (п. 10).
Реиграбельность: не игра; повторный заход продолжает прошлое состояние, на устройство один набор отметок.

## 4. Lernziele (проверяемые!)
В README раздела «Lernziele» нет (есть «Зачем», Z.13–20). Для инструмента взрослых вместо Lernziele — проверяемая польза
(Nutzwert), собранная из README и кода:
1. Betreiber*in может по отчёту назвать, какие из 16 критериев отмечены, а какие открыты (`[x]` / `[ ]` в тексте отчёта).
2. Betreiber*in может к открытому критерию назвать шаг проверки из подсказки (например, для `keine-externen-anfragen`:
   «в DevTools-Netzwerk-Tab только собственный домен»).
3. Betreiber*in может приложить отчёт к заявке файлом (.txt, .json) или печатью (README Z.15–18). Достаточен ли такой отчёт как
   Nachweis, решают fragFINN и BzKJ; в репозитории подтверждения нет — «(offen)».
4. Betreiber*in понимает, что это самопроверка, а не сертификат (строка в конце отчёта).
Как проверяется: 5 тестов в `test/logik.test.mjs` покрывают только логику отчёта, не понимание и не полноту каталога. Понимание
проверит только Praxistest (п. 9).

## 5. Контент-план
Единица контента: критерий. Своих данных у приложения нет; источник — `packages/kinderschutz/src/kriterien.mjs` (109 строк),
схема `id, quelle, text, hilfe`. MVP — 16 критериев в 7 группах (группа — часть `quelle` до «:»):

| Группа (как на экране) | Критериев | id |
|---|---|---|
| fragFINN | 7 | werbefrei, keine-kaeufe, keine-tracker, keine-offenen-chats, altersgerecht, impressum-datenschutz, links-gepflegt |
| DSGVO Art. 8 | 1 | keine-konten |
| Monorepo-Politik | 2 | keine-externen-anfragen, offline-faehig |
| DSGVO | 1 | lokale-daten-loeschbar |
| BzKJ 2026 | 3 | privacy-by-default, mobile-first, kinder-einbeziehen |
| NRW Games-Leitlinie (pädagogisch wertvoll) | 1 | lernziele-dokumentiert |
| WCAG AA | 1 | barrierearm |

Формат отчёта (`logik.mjs` Z.22–48). Текст: «Kriterien-Check – Selbst-Audit Kinderangebot», «Stand», «Erfüllt: n von 16», по группам
строки `[x]` / `[ ]` + текст + источник, в конце «Hinweis: Selbstprüfung, kein offizielles Testat.». JSON:
`{typ: 'kriterien-check-bericht', version: 1, stand, erfuellt, gesamt, kriterien: [{id, text, quelle, erfuellt}]}`.
Тесты приложения: группировка без потерь и не меньше двух групп; подсчёт; текст отчёта; JSON; пустой Stand. Каталог проверяет
`packages/kinderschutz/test/kinderschutz.test.mjs`: уникальность `id`, обязательные поля, `hilfe` не короче 80 знаков — содержание
он не проверяет. Анти-шаблон-тест квизов здесь не применим: «правильных» ответов нет.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде и/или замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `logik.mjs`, `index.html`, `druck.css` нет `http(s)://`, `<img>`, `<iframe>`;
  подключены только свой `app.mjs`, `druck.css` и общий `kinder.css`. Названия программ (fragFINN, BzKJ …) — только текст.
- [x] **Без аккаунтов и персональных данных:** полей ввода нет, кроме 16 чекбоксов и `readonly`-textarea с отчётом; имя, e-mail
  и название проверяемого предложения приложение не спрашивает.
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` (`index.html` Z.6);
  `installiereNetzwerkWaechter()` (`app.mjs` Z.11); `fetch`, XHR и WebSocket в коде нет. Замер за заход со всеми кнопками:
  запросы только к своему origin; `browser-pruefung`: `fremdeHosts` 0.
- [x] **Speicher:** один ключ `kc.status` — объект `{id: true|false}` (`app.mjs` Z.13); поиск по коду: `getItem` Z.16, `setItem` Z.17,
  `removeItem` Z.109; `datenKarte`, `loescheDaten`, `speicherSchluessel`, `sessionStorage`, `indexedDB`, `document.cookie` нет. Пишется при
  каждой отметке (Z.48), читается при каждом `render()`. Löschknopf: «🧹 Zurücksetzen» (Z.107–110) → `localStorage.removeItem('kc.status')`;
  `clear()` нет; общую карту `datenKarte` приложение не берёт, `speicher-regel` засчитывает `removeItem` (`docs/speicher-stand.json`
  пуст). Замер: до первой отметки localStorage, sessionStorage и cookies пусты; после отметки `{"werbefrei":true}`; после сброса
  снова пусто. Ключ `ui.anzeige` приложение не читает и не пишет.
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker` (решение 9б; тест `kein-service-worker` зелёный).
- [ ] **Offline после загрузки:** не гарантируется (решение 9б). Замер: перезагрузка без сети не удаётся. Каталог при этом
  по-прежнему содержит критерий `offline-faehig` (п. 10).
- [ ] **Vorlesen:** нет (`grep vorlesen` пуст). n/a: Werkzeug für Erwachsene, Vorlese-Pflicht для таких приложений нет
  (решение 28а; это и есть строка GDD, которую требует правило).
- [ ] **eltern.html:** нет. n/a: приложение для взрослых; ссылки «Für Eltern» в Fuß нет (Fuß свой, `app.mjs` Z.111–113, не из
  `quiz-kern`).
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`app.mjs` Z.113); тест `impressum-link` зелёный. Сама страница — шаблон с
  заглушками и пометкой «Noch nicht veröffentlichungsreif» (п. 10).
- [x] **Druck (docs/02 Z. 79–82):** есть кнопка «🖨️ Drucken» (`window.print()`, Z.103–106) и свой `druck.css` (24 строки), подключён
  в `index.html` Z.10; тест `druckknopf-braucht-druck-css` зелёный. Печатается только `<pre class="kcb-nur-druck">` с текстом
  отчёта (`app.mjs` Z.85): заголовок, карточки, кнопки и Fuß скрыты. Замер в эмуляции печати (три отметки): видимы
  `main > section > pre`, 1776 знаков, ни одного знака из ☐☒☑✓✔★☆, ни одного эмодзи, строки для имени нет. В печати стоят
  ASCII-метки `[x]` / `[ ]` и строка «Erfüllt: n von 16». Дополнение к правилу от 27.10.2026 (решения 10в и 10б) разрешает в
  печатных списках для Betreiber*innen пустые Kästchen; про отмеченные `[x]` там прямо не сказано (п. 10). Правила `druck.css`
  (Z.9, 11) опираются на CSS `:has()`; замер только в Chromium.
- [x] **Keine Wertung des Kindes (docs/02 Z. 141–146):** ребёнок не адресован и не оценивается. «Erfüllt: n von 16 Kriterien
  (x %)» (`app.mjs` Z.75) и полоса оценивают предложение оператора. `node tools/leistungs-woerter.mjs kriterien-check` → одна
  строка: `app.mjs: prozent → 0%` — это `width:100%` в стиле textarea (Z.66); видимый процент из Z.75 инструмент не ловит. В
  `docs/bewertung-stand.json` приложения нет ни в `apps`, ни в `ausnahmen`: исключение не заведено и не подтверждено (п. 10).
- [x] **Mobile First (замер, 360 px):** переполнения нет; 38 целей касания (16 чекбоксов, 16 `summary`, 5 кнопок, 1 ссылка), ни
  одной меньше 48 px; ошибок консоли нет; Delta-Tor `node tools/browser-tor.mjs kriterien-check`: 0 Erhöhungen. Клики инструмент
  не измеряет: у кнопок нет `data-kennung` (в базовой линии `ohneKennung` 1).
- [x] **Privacy by default:** запросов привилегий нет (поиск по geolocation, getUserMedia, Notification, permissions — пусто).
- [ ] **Hilfe-Insel (116 111):** нет. n/a: Werkzeug für Erwachsene.
- [ ] **Anzeige-Einstellung (Kontrast, Schrift):** `boot()` из `anzeige.mjs` не вызывается; сохранённая `ui.anzeige` не
  применяется (замер: при записанном «hoch» `data-kontrast` остаётся пустым) — п. 10.

Особые риски темы: подсказки (`hilfe`) и метки источников содержат утверждения о праве и о программах финансирования (возраст
согласия по DSGVO, JMStV § 5, § 5 DDG, условия fragFINN и NRW, «bis zu 80 %»). В приложении они стоят без пометки «fachlich nicht
geprüft», а ссылки на параграфы — без пометки «проверено человеком». Риск ложной уверенности: «16 von 16 (100 %)» не значит ни
попадания в whitelist, ни гранта; против этого в отчёте стоит строка «kein offizielles Testat», на экране рядом с процентом её нет.
Счётчик внешних фактов (`docs/externe-fakten-stand.json`, Stand 20.10.2026; пересчёт даёт те же 3) ведёт `kriterien-check` с 3
блокирующими Fundstellen: `app.mjs` Z.78 («DSGVO Art. 8») и Z.81 («Förder-Nachweis»), `index.html` Z.7 («DSGVO-Kriterien») —
названия программ и норм без Fundstelle. Тексты каталога в `packages/kinderschutz` (возраст согласия, JMStV § 5, «bis zu 80 %»)
счётчик не считает: он читает только папку приложения. По предложениям Strang Г (`docs/externe-fakten-vorschlaege.json`, не
приняты) Z.78 — переименовать «Grundlage:» в «Quelle:», Z.81 и `index.html` Z.7 — Fehlalarm.
Fachprüfung (Recht, Förderung) — offen.
Повторить проверки: `node --test apps/kriterien-check/test/*.test.mjs`, `node tools/leistungs-woerter.mjs kriterien-check`,
`node tools/browser-tor.mjs kriterien-check`, `node --test packages/kinderschutz/test/testzahlen.test.mjs`,
`node --test packages/kinderschutz/test/externe-fakten.test.mjs`.

## 7. Стандарты и финансирование (Wofür)
Стандарты (по каталогу, README и ссылкам в docs/11; право, сроки и условия программ не перепроверены — «(offen)»): критерии из
fragFINN (7 из 16), BzKJ 2026 (3), DSGVO Art. 8 и DSGVO (2), «Monorepo-Politik» (2), NRW Games-Leitlinie (1), WCAG AA (1); кроме
того, в подсказке названо JMStV § 5, в метке источника — § 5 DDG. docs/11 относит приложение к группе «GC25 Rn. 23–24 —
Umsetzungspflichten (Werkzeuge für Betreiber/Fachkräfte)». Сам инструмент ни под один стандарт не сертифицирован.
Förder-Fit: собственной заявки на грант у приложения нет; оно готовит Nachweis для заявок (docs/07: в «Nachweis-папку» входит
отчёт kriterien-check; docs/04, этап 1: заявка в whitelist fragFINN). Какой вес самопроверка имеет у fragFINN и BzKJ, нигде не
показано — «(offen)». Детали программ — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: S (`app.mjs` 116 строк, `logik.mjs` 48, `druck.css` 24, 5 тестов; каталог — общий пакет, 109 строк). Переиспользует:
`kinder-ui` (`el`, `kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`, `KRITERIEN`). Не использует: `quiz-kern`,
`vorlesen`, `hilfeInsel`, `anzeige`, `datenKarte`. Паттерн копируется, а не импортируется: ни одна другая app не импортирует
модули `apps/kriterien-check` (поиск по `apps` и `packages` пуст), хотя в Praleska-каталоге 10 записей называют его своей
Engine. Первый срез (playable) уже работает: 16 критериев, отметки, отчёт (копия, .txt, .json, печать), сброс.

## 9. Kindertest-гипотезы
Для детей не применимо: Zielgruppe — Erwachsene, Kindertest не проводится. Вместо него — Praxistest с 3–5 Betreiber*innen или
Antragstellenden (протокол по docs/05, метод 5, без имён). Результатов в репозитории нет; это гипотезы:
1. Понятны ли 16 критериев без предварительных знаний, и хватает ли подсказки «So prüfst du das», чтобы действительно проверить,
   а не просто поставить галочку? Подходит ли обращение на «du» («Prüfe: …») для Betreiber*innen и Antragstellenden?
2. Нужны ли «nicht zutreffend» или «teilweise», заметка, название проверяемого предложения? Годится ли отчёт без названия и со
   «Stand» = днём показа (п. 10) как приложение к заявке — или его придётся дописывать?
3. Не читается ли «Erfüllt: 16 von 16 (100 %)» как печать одобрения? Строка «kein offizielles Testat» стоит только в конце текста
   отчёта.
4. Клавиатура: после каждой отметки фокус уходит в начало страницы, открытая подсказка закрывается. Насколько это мешает
   пройти 16 пунктов подряд?
5. «Zurücksetzen» стирает все отметки одним нажатием, без вопроса. Нажимают ли случайно?
6. Хватает ли одного набора отметок на устройство (один ключ), если проверяют несколько предложений?

## 10. Offen / Zweifel
**Widersprüche (Katalog ↔ Beschlüsse ↔ README ↔ Code)**
- Критерий `offline-faehig` («Nach dem ersten Laden offline nutzbar»; подсказка: «Service Worker (Cache-first …) oder zumindest
  keine Pflicht-Netzanfragen nach dem ersten Laden; Flugmodus-Test») ↔ решение 9б и строка релизного чек-листа проекта
  «повторная загрузка офлайн не гарантируется»: Service Worker нет ни в одной app, а замер самого kriterien-check показывает, что
  перезагрузка без сети не удаётся. Оператор получает критерий, который сам проект не выполняет, а первый из предложенных путей
  (Service Worker) в проекте удалён.
- Критерий `lokale-daten-loeschbar` (подсказка: кнопка «Meine Daten löschen» на старте, «localStorage vollständig leert», пример «nur ein
  Rekord-Wert») ↔ решение 30б (без Speicher — без карты), чек-лист проекта (удалять только свои ключи, `clear()` запрещён: он
  снёс бы настройку контраста) и A7 (Rekord больше нет). Собственная кнопка приложения называется «🧹 Zurücksetzen», а
  `impressum.html` обещает кнопку «Meine Daten löschen» (тест `datenschutz-zusage` требует от speichernder App лишь `removeItem`
  или слово «löschen» / «zurücksetzen» в коде).
- Подсказка критерия `keine-konten` («Bestenlisten nur mit lokalen Spitznamen») ↔ docs/02 Z. 141–146: места в ряду и
  рейтинги детей в приложениях проекта не предусмотрены.
- Критерий `barrierearm` требует «Vorlesen-Funktion», варианта «nicht zutreffend» нет (решение 28а освобождает Werkzeuge für
  Erwachsene); `altersgerecht` называет «8-12 Jahre», а по решению 34а детьми считаются и подростки до 15.
- README Z.8–11, комментарий `app.mjs` Z.3–4 и метод 1 в docs/05 («единый источник» для политики, тестов и инструмента) ↔
  политика проекта написана вручную; в релизном чек-листе проекта 34 пункта, в каталоге 16; ни один тест их не сопоставляет, а
  `kinderschutz.test.mjs` проверяет у каталога только структуру.
- README Z.19–20 («дублирует чек-лист PR») ↔ в каталоге нет пунктов про печатный лист и про оценку ребёнка (Punkte, Rekord, Rang);
  чек-лист проекта шире (34 пункта против 16).
- README Z.8–11 называет «экспорт текстового отчёта»; в коде кроме текста есть JSON, копирование и печать (корневой README
  Z.273 называет «.txt/.json/печать»). README называет три источника, на экране семь групп; «DSGVO Art. 8» и «DSGVO» —
  две отдельные карточки (группа = текст до «:»).
- «Stand» в отчёте — день показа или экспорта (`stand()`, Z.18; пересчитывается при каждом `render()`), а не день проверки.
  Замер: «Stand: 27.10.2026» = дата системы. Отчёт, напечатанный в 2027 году, несёт «Stand» 2027 при отметках 2026 года.
- Самоприменение: приложение не во всём отвечает тому, что спрашивает: клавиатура работает, но фокус сбрасывается после каждой
  отметки; Anzeige-Einstellung не применяется; в README нет Lernziele (критерий `lernziele-dokumentiert` написан для Kinder-Apps).
  Часть критериев к нему не относится: оно не Kinderangebot.

**Robustheit (замер в Chromium; «simuliert» = подменено в скрипте)**
- Испорченное значение `kc.status` (например `abc`) → `SyntaxError`, пустая страница без сообщения; запрет доступа к хранилищу
  (`SecurityError`, simuliert: геттер `localStorage` подменён и бросает) → тоже пустая страница. `ladeStatus` (Z.16) без
  `try/catch`. Общий код защищён лишь отчасти. В `packages/kinder-ui/js/anzeige.mjs` защищены только испорченные значения и ошибки
  `getItem` / `setItem` / `removeItem` (`try/catch` в `ladeEinstellung`, Z.41, и в `speichere`, Z.49–52), а не сам доступ к
  `localStorage`: он стоит параметром по умолчанию (Z.39 и Z.47) вне `try`. В `quiz.mjs` Z.58 в `try/catch` стоит один
  `removeItem` (вместе с обращением к `localStorage` в этой строке), но `bootAnzeige()` (Z.48) вызывается раньше и бросает первым.
  Замер с бросающим геттером: `ladeEinstellung()`, `speichere()` и `boot()` бросают `SecurityError`; страницы
  `nachrichten-detektive` (на `quiz-kern`) и `kriterien-check` в Chromium остаются пустыми.
- «✔️ Kopiert!» (Z.92) показывается независимо от результата: headless без разрешения → `NotAllowedError` (ошибка страницы), а
  кнопка всё равно пишет «Kopiert»; без `navigator.clipboard` (небезопасный origin, simuliert) — то же без ошибки. В обычной
  вкладке с жестом пользователя не измерено — «(offen)».
- После отметки фокус уходит на `body`, Tab начинает с первого чекбокса; открытая подсказка закрывается; позиция прокрутки
  сохраняется (замер). Паттерн известен (fragen-und-hinweise, C2); `aria-live="polite"` на всём `#app` (C4) с вспомогательной
  технологией не проверен.
- «Zurücksetzen» без подтверждения. Скачивание .txt и .json проверено только в Chromium (имя файла, содержимое, поля JSON); якорь
  не в DOM, URL отзывается сразу (Z.23–28) — другие браузеры «(offen)». Без поддержки `:has()` печать, по CSS, осталась бы пустой
  (вывод из `druck.css`, не измерено).
- Тесты не покрывают `app.mjs` (хранение, сброс, печать, экспорт): 5 тестов — только `logik.mjs`.

**Offene Fragen (für Max)**
1. Процент и «n von 16»: завести исключение в `docs/bewertung-stand.json` («Werkzeug für Erwachsene: bewertet das eigene Angebot,
   kein Kind»; образцы — foerder-navigator, sharenting-spiegel, подтверждены Max 27.10.2026) или убрать «%» и оставить только
   «n von 16»? Список слов 37в видимый «%» не ловит.
2. Привести каталог в соответствие с решениями (`offline-faehig`, `lokale-daten-loeschbar`, «Bestenlisten» в `keine-konten`,
   `barrierearm` и `altersgerecht` для предложений без детского экрана)? Нужен ли вариант «nicht zutreffend»?
3. Нужны ли в приложении «nicht zutreffend», заметка, название предложения, несколько проверок на устройстве? (Изменение кода,
   решает Max.)
4. Fachprüfung подсказок (Recht, Förderung): возраст согласия 16 (`keine-konten`), JMStV § 5 (`altersgerecht`), состав Impressum с
   телефоном как «K.-o.-Kriterium» fragFINN (`impressum-datenschutz`), «bis zu 80 %» NRW (`lernziele-dokumentiert`); в
   `packages/kinderschutz/src/kriterien.mjs` это Z.24, 60, 90 и 66. «Primärquellen im Repo nicht vorhanden; Sekundärstellen
   ersetzen die Fachprüfung nicht.» Sekundärstellen есть у трёх пунктов из четырёх: Impressum с телефоном и формальный повод для
   отказа — docs/06 Z.23–25 (ссылки на страницы fragFINN — там же, Z.20) и docs/04 Z.52–56; NRW «bis zu 80 %» — docs/01 Z.17
   (источник указан как «Games-Förderleitlinie NRW») и docs/07 Z.55; возраст согласия 16 — docs/09, Дополнение 42 (Z.22,
   einwilligungs-pruefpfad). Для JMStV § 5 кроме текста каталога есть лишь отсылки в данных других приложений
   (`fragfinn-selbsttest`, `jmstv-einstufungs-helfer`) и пересказ в не принятых предложениях Strang Г
   (`docs/externe-fakten-vorschlaege.json`, maschinell nachgelesen); Wortlaut der Norm в репо нет. Счётчик внешних фактов (п. 6)
   эти четыре утверждения не видит: каталог лежит в `packages/kinderschutz`, а счётчик читает только папку приложения; его 3
   Fundstellen — `app.mjs` Z.78 и Z.81, `index.html` Z.7.
5. Impressum: страница, на которую ведёт Fuß, сама называет себя «Noch nicht veröffentlichungsreif» (поля Betreiber — заглушки).
   Касается всех приложений; критерий `impressum-datenschutz` спрашивает именно об этом.
6. Пригодность отчёта как Nachweis у fragFINN и BzKJ нигде не подтверждена.
7. Печать с отмеченными `[x]` и строкой «Erfüllt: n von 16» у списка для Betreiber*innen: покрывает ли её дополнение 10в/10б
   (там сказано о пустых Kästchen)?
8. Контраст (критерий `barrierearm`, 4,5:1) у самого приложения не измерен — «(offen)».
