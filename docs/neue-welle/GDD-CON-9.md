# Farbwörter-Schatz (Content-Pack) — Kurz-GDD (Entwurf)

> Черновик без кода (решение Max 11а, Stand 27.10.2026; Stufe 1 в `docs/plan-neue-welle.md`). Основа: Bauauftrag
> `docs/bauauftraege/CON-9-farbwoerter-schatz.md`, запись каталога «Farbwörter-Schatz» (`docs/praleska-katalog.json`; в
> Baukasten — `docs/10`, Z. 456) и `docs/plan-neue-welle.md`, Abschnitt 3 (Tore). Папка будущего приложения:
> `apps/farbwoerter-schatz/` (имя из Bauauftrag). Всё, что не взято из этих источников, помечено «(Eigenentwurf)»,
> недоказанное — «(offen)». Страницы Praleska — только как их ведёт Bauauftrag; цитат длиннее 6 слов нет, источник
> пересказан. «Abschnitt N» — раздел Bauauftrag, «п. N» — этого GDD. «Моя сверка» — сверка с текстовой копией Praleska вне
> репозитория (`tools/quelle-holen.sh`; PDF лежит на ветке `main`, не на рабочей); человеком страницы не проверены (A18).

> **Stand der Prüfung (28.10.2026, zwei Prüfrunden):** Entwurf mit bekannten Abweichungen; der Bauauftrag und `docs/plan-neue-welle.md` gehen vor. Die Prüfer haben zuletzt noch diese Punkte gefunden (im Text unten teils veraltet oder zu stark formuliert):
> - Tor 8 ist unvollständig: Die Prüfung ist `packages/kinderschutz/test/seitenmarke.test.mjs`. `daten/farbwoerter.json` mit `quelle.seite` „S. 178“ zählt als Seitenangabe; entweder steht die Marke „Seitenangaben nicht von einem Menschen geprüft.“ in einer Nutzerdatei (eltern.html, Fuß, Datenfeld wie `pflichtmarkierung` im Muster), oder die App steht mit Begründung unter `ausnahmen` in `docs/seitenmarke-stand.json` (nur wenn die Seite nirgends angezeigt wird).
> - Fehlender Widerspruch: Bauauftrag Abschnitt 5, `pruefeFarbwoerter`, Regel 2 („Fehler, wenn quelle.seite nicht S. 178 ist“) widerspricht Regel 1 („eigenentwurf == true ohne Quelle erlaubt“) und dem Vorschlag, für „kontrast“ und „neutral“ eigene Wörter zu erfinden.
> - Die Klammer „für sie gibt die Quelle Wörter“ (Offene Fragen, Gruppen) ist zu stark: Die Quelle ordnet kein Wort warm oder kalt zu; festgelegt ist nur kirschrot → warm durch die Beispielzeile in Abschnitt 4.
> - „siehe letzte Zeile von Abschnitt 10“ meint die vorletzte Zeile (uk und ru); die letzte ist der Seiten-Vermerk.
> - A3/Favicon und 22а sind erledigt (21а: gemeinsame SVG gleichen Ursprungs in allen Seiten; 22а: Marken in 29 alten Apps). Offen ist nur, ob Max statt der Datei ein eingebettetes `data:`-Icon will (`docs/fragen-und-hinweise.md`, 21а).
> - Länge: über 30 KB für ein „Kurz-GDD“; der Schreiber der App kürzt beim Anlegen des endgültigen `GDD.md`.

## 1. Феномен / потребность (Warum)
Источник — Praleska, S. 178: раздел «Рисование» (S. 178), группа «ПОЧЕМУЧКИ» (S. 178). Среди задач занятия рисованием
страница называет знакомство с «образными названиями цветов» (S. 178) — «вишневый», «салатовый», «малиновый», «лимонный»,
«абрикосовый», «цвет морской волны» (S. 178) — и с «теплыми и холодными» (S. 178) цветами, а также с контрастными, близкими
по тону и нейтральными. Задача стоит внутри занятия красками; приложение переносит её в слова и печатную карточку
(Eigenentwurf).
Потребность (Eigenentwurf, не измерена — offen): взрослому, который смотрит с ребёнком 3–5 лет картинки и рисует, нужна
короткая готовая основа для разговора о цветах: у цвета есть не только имя «rot», но и образное — «kirschrot»,
«zitronengelb». Приложение даёт слова и карточки без рекламы, без оценки ребёнка и без сохранения данных. Katalog видит ещё
ценность для семей с языками происхождения — один и тот же цвет на трёх языках (docs/10 Z. 456; в Bauauftrag есть лишь поле
для перевода, готовых переводов нет, п. 10) — и связь с «sprachliche Bildung / alltagsintegrierte Sprachförderung»
(утверждение Katalog, источником не подтверждено — offen). Смешивать краски приложение не учит: это делает `farb-labor`.

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: beide (Ko-Nutzung): Kinder 3–5 Jahre nur gemeinsam mit einem Erwachsenen, Kinder 5–7 Jahre.** Belege:
- Bauauftrag Abschnitt 2: Kinder 3 bis 5 Jahre nur gemeinsam mit einem Erwachsenen und Kinder 5 bis 7 Jahre; Verwendung
  Bildschirm (gemeinsame Nutzung) und Druck. Lernziel 1: «Erwachsener wählt» die Gruppe; Lernziel 3: «Erwachsener druckt» —
  den Ablauf führt der Erwachsene. Katalog (docs/10 Z. 456): Alter «3-5 (Ko-Nutzung), 5-7», Typ S.
- Рамка адаптации в docs/10 (Rechtsrahmen, Punkt 2): 3–5 лет — только Ko-Nutzung и жёсткие лимиты сессий; 5–7 — короткие
  самостоятельные сессии.
- Дети названы пользователями → по решению 34а это Kinder-App: действуют Vorlesen (28а) и правило «ребёнок не оценивается»
  (п. 6).
- Возраст группы «ПОЧЕМУЧКИ» в Bauauftrag не назван; моя сверка: 4-й и 5-й годы жизни, то есть 3–5 лет (номер страницы не
  даю: Bauauftrag её не ведёт). Что стоит за диапазоном 5–7 — см. п. 10.
Одно предложение (Eigenentwurf): «Взрослый и ребёнок выбирают группу цветов, смотрят карточку с цветовым пятном, образным
названием (например kirschrot) и словом warm или kalt, слышат слово и, если хотят, печатают одну карточку на лист A4».
Соседи (Eigenentwurf): `farb-labor` (5–7, Ko-Nutzung: смешивание, warm/kalt, названия uk/ru — п. 10),
`herkunftssprachen-bruecke` (слова de/uk/ru, по её GDD 8–12), `dinge-des-alltags` и `wie-bewegt-sich` (3–5, Ko-Nutzung).

## 3. Движок и петля (Wie)
Петля по Bauauftrag Abschnitt 3: старт с пояснением «вместе со взрослым» (Eigenentwurf) → выбор одной из четырёх групп (warm,
kalt, kontrast, neutral) → список слов группы → Farbkarte (название, цветовое пятно, подсказка warm или kalt) → Vorlesen → по
желанию печать. Каждый шаг — выбор из списка, свободного текста нет (Eigenentwurf). Печать: одна Farbwort-Karte на лист A4
портрет — немецкое название, цветовое пятно, подсказка; без номера страницы, без строки для имени, без знаков из Sperrliste
(`docs/druck-symbole-liste.md`). Ни очков, ни рангов, ни рекорда; ничего не сохраняется. Случайность не нужна (Eigenentwurf):
порядок слов — как в файле.
Дополнения (Eigenentwurf; в Bauauftrag их нет, но Abschnitt 9 требует для 3–5 лет «feste Sitzungslimits»): Erwachsenen-Gate
перед стартом; не больше `PRO_SESSION` карточек за раз (в `farb-labor` 3, в `wie-bewegt-sich` 5, в `dinge-des-alltags` 6;
значение здесь — offen); конец «Bildschirm aus» с идеей для дома — найти в комнате вещь цвета «kirschrot».

**Два пути для движка (решение за Max).**
- **Weg A — `quiz-kern` без оценки.** В плане «empfohlen» (`docs/plan-neue-welle.md`, Abschnitt 5, Frage 1), в Katalog
  «quiz-kern + mini-i18n», Aufwand S. Даёт готовый раунд, Vorlesen на экранах вопроса и разбора, Erklärung после ответа;
  движок ничего не записывает: `removeItem` старого ключа (`quiz.mjs` Z. 56–59) выполняется, только если передан
  `rekordSchluessel`, а `boot` лишь читает настройку показа `ui.anzeige`; Tor 4 проверяется инструментом. Чего нет (проверено
  по `packages/quiz-kern/src/quiz.mjs` и `schema.mjs`):
  (1) ответ — строка, кнопка рисует только текст; цвет можно заменить лишь Emoji-квадратом, его вид зависит от устройства, а
  оттенки kirschrot и himbeerrot он не различает — главный объект Farbkarte, цветовое пятно, не показать;
  (2) выбор группы, список слов по группе и печать (экраны 2, 3, 5 Bauauftrag) лежат вне движка; стартовый экран фиксирован
  и несёт карточки «Klassen-Modus», «Duett» и «Staffel» (Z. 97–123), настройкой их не отключить;
  (3) `vorlesen(text)` вызывается без языка, то есть с de-DE (Z. 94–95): названия uk/ru читал бы немецкий голос, обещание
  Katalog «один цвет на трёх языках услышать» движком не выполнить;
  (4) схема по умолчанию требует не меньше 10 вопросов, Erklärung от 20 знаков и вопрос длиннее 10 знаков (`schema.mjs`
  Z. 14, 17, 25, 27, 30): шести словам Bauauftrag этого мало, остальное пришлось бы придумывать (Eigenentwurf);
  (5) квиз — это «верно/неверно», а warm/kalt — договорённость, не измерение: `farb-labor` держит `warmKalt.geltung` =
  «ausgemacht», а зелёный и фиолетовый отмечает как «strittig»; вопрос «Stimmt/Stimmt nicht» про tannengrün пометил бы
  защитимый ответ неверным (п. 10);
  (6) тексты по умолчанию «Richtig!», «Nicht ganz …» и «Geschafft!» (Z. 23–24, 27) заменяются через `texte` («Geschafft» —
  слово Tor 1; `stark-und-gesund` ставит «Ende der Runde»); `rekordSchluessel` не передавать: его имя
  `tools/leistungs-woerter.mjs` ловит как «rekord»;
  (7) в Fuß движка стоит «Daten bleiben auf diesem Gerät» (Z. 76), хотя он ничего не хранит.
- **Weg B — собственное Karten-App** на `kinder-ui`. Образцы: `farb-labor` и `dinge-des-alltags` (Ko-Nutzung: Erwachsenen-Gate,
  `PRO_SESSION`, «Bildschirm aus»), `puppentheater-werkstatt` (печать, `druck.css`, `regeln.test.mjs` — на него ссылается
  Bauauftrag Abschnitt 7). Повторяет Bauauftrag экран за экраном: четыре группы, список, Farbkarte с цветовым пятном (CSS),
  печать; Vorlesen с `lang` и проверкой `lokaleStimme` (образец `architektur-spaziergang`). Цена: больше кода (S–M,
  Eigenentwurf); Tor 4 не применим — `tools/quiz-durchlauf.mjs` отклоняет приложения без импорта `quiz-kern` (Exit 64);
  проверки берёт `test/regeln.test.mjs` (Bauauftrag Abschnitt 7; там же «kein Import von quiz-kern»).
**Рекомендация (Eigenentwurf): Weg B.** Причины: (1) четыре из пяти экранов Bauauftrag — выбор группы, список, Farbkarte с
цветовым пятном, печать — лежат вне `quiz-kern`, а вопроса с «верным» ответом в Bauauftrag нет вообще; (2) цветовое пятно,
суть единицы, движок показать не может; (3) единственный содержательный вопрос про Farbwort — warm или kalt — по `farb-labor`
договорённость, и «верно/неверно» здесь нечестно; (4) слушать uk/ru в `quiz-kern` нельзя без правки движка. Weg A допустим,
если Max хочет минимум кода: тогда единица становится текстовым квизом без цветового пятна, групп и печати (печать — отдельная
страница для взрослых), нужны не меньше 10 вопросов сверх шести слов (Eigenentwurf), а в Bauauftrag правятся Abschnitt 3, 6, 7
и 9 («ohne quiz-kern»). Рекомендация отличается от плана и касается только этой единицы.

## 4. Lernziele (проверяемые!)
Из Bauauftrag Abschnitt 2 (все — Eigenentwurf); после каждой цели — чем проверяется:
1. Взрослый выбирает одну из четырёх групп (warm, kalt, kontrast, neutral) и видит только её Farbwörter (`gruppeFuer`).
   Проверка: тест — `gruppeFuer` возвращает только записи выбранной группы; пустая группа не оставляет пустой экран. Для
   kontrast и neutral слов в Bauauftrag нет (п. 10), цель для этих групп пока невыполнима.
2. Ребёнок и взрослый смотрят Farbkarte: название, цветовое пятно, подсказка warm или kalt; слово можно услышать (Tor 7).
   Проверка: у карточки все три поля, кнопка «Vorlesen» читает название. Запомнил ли ребёнок слово, приложение не проверяет —
   это покажет только Kindertest (п. 9).
3. Взрослый печатает одну Farbwort-Karte на лист A4 без знаков из Sperrliste и без строки для имени. Проверка:
   `test/regeln.test.mjs` по образцу `puppentheater-werkstatt` — число листов равно выбору; в тексте листа нет запрещённых
   знаков, Emoji, строки имени и полей по дням.

## 5. Контент-план
Единица контента: Farbwort. Файл `daten/farbwoerter.json` (Bauauftrag Abschnitt 4). Схема: `id, de, ru, uk, gruppe,
quelle{seite}, eigenentwurf`; `gruppe` ∈ {warm, kalt, kontrast, neutral}; запись без `quelle.seite` и без `eigenentwurf: true`
отклоняется; `uk` — `null`, пока перевод не проверен. В схеме нет поля для цвета, а `farbkarte` (Abschnitt 5) возвращает
`flaeche`: нужно поле (например `farbe`, шестнадцатеричное значение) — Eigenentwurf; значение выбирает оформитель, это
направление, а не измерение (п. 10).
MVP (Bauauftrag Abschnitt 1) — шесть образных названий из источника (S. 178): «вишневый», «салатовый», «малиновый»,
«лимонный», «абрикосовый», «цвет морской волны» — и шесть немецких имён: kirschrot, zitronengelb, aprikosenfarben, meergrün,
himbeerrot, tannengrün (Eigenentwurf, docs/10 Z. 456; источник даёт только русские слова). Мой вариант пар de/ru
(Eigenentwurf; проверка носителем языка — offen): kirschrot — «вишневый»; zitronengelb — «лимонный»; aprikosenfarben —
«абрикосовый»; himbeerrot — «малиновый»; meergrün — «цвет морской волны» (приблизительно); у tannengrün пары нет:
«салатовый» — светло-зелёный, а tannengrün тёмный (п. 10).
Группы: из шести слов Bauauftrag разносит по группам только одно — пример Abschnitt 4 ставит kirschrot в `warm`; для
остальных пяти групп нет. Вариант (Eigenentwurf, fachlich nicht geprüft; для kirschrot он совпадает с примером Bauauftrag):
kirschrot, himbeerrot, aprikosenfarben, zitronengelb — warm; meergrün, tannengrün — kalt, но зелёный `farb-labor` считает
спорным (п. 10). Для kontrast и neutral слов нет вообще.
Анти-шаблон-тест (Eigenentwurf): квиза в Weg B нет, тест не применяется. При Weg A: оба ответа (warm и kalt) должны быть
верными хотя бы в одном вопросе, спорные слова не спрашиваются.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Кода нет, поэтому ни один пункт не отмечен: это Tore из `docs/plan-neue-welle.md` (Abschnitt 3) и правила Bauauftrag
(Abschnitt 6); номера строк других правил сюда не переносятся.
- [ ] **Tor 1 — kein Kind wird bewertet** (docs/02 Z. 141–146): ни Punkte, Rekord, Rang, Serie, Prozent, «richtig von»,
  «geschafft», ни Sterne и Pokal; допустим нейтральный счётчик найденного. Проверка: `node tools/leistungs-woerter.mjs
  farbwoerter-schatz` без необъяснённого попадания; `node tools/bewertung-stand.mjs` — «Stand stimmt.», в
  `docs/bewertung-stand.json` у приложения нет записи. Подсказка warm/kalt описывает цвет, а не ребёнка; «верно/неверно» про
  Zuordnung не говорить (Eigenentwurf).
- [ ] **Tor 2 — Speicherregel:** Speicher ⇒ Löschknopf, kein Speicher ⇒ keine Karte «Meine Daten löschen»
  (`packages/kinderschutz/test/speicher-regel.test.mjs`). Единица ничего не сохраняет → карточки удаления нет; нет
  sessionStorage, IndexedDB, Cookie, Cache. Выбор языка только в памяти страницы: `erstelleSprache` пишет в localStorage лишь
  при `speicherSchluessel`, а тест `datenschutz-zusage` считает это хранением (решение 27а) — ключ не задавать.
- [ ] **Tor 3 — Berührziele ≥ 48 px, kein Überlauf bei 360 px, Fokus nach Klick:** `data-kennung` у каждой кнопки и возврат
  фокуса (как в `puppentheater-werkstatt`), при смене экрана фокус на заголовок (Bauauftrag Abschnitt 8);
  `node tools/browser-tor.mjs farbwoerter-schatz` без роста — новое приложение должно быть чистым.
- [ ] **Tor 4 — Quiz-Durchlauf:** `node tools/quiz-durchlauf.mjs farbwoerter-schatz --modus alle` зелёный — только при Weg A;
  при Weg B инструмент отклоняет приложение (Exit 64), проверки переходят в `test/regeln.test.mjs`.
- [ ] **Tor 5 — Druck** (docs/02 Z. 79–82): Fuß и Bildschirmteile скрыты (`druck.css` с `@media print`, подключён в
  `index.html`), строки для имени нет, на листе нет Kästchen, Haken и Sterne (список — `docs/druck-symbole-liste.md`), нет
  Emoji и полей по дням. Цветовое пятно: браузер может не печатать фон; в `druck.css` приложений `ergebnis-plakat`,
  `quiz-karten-druck` и `klassen-koffer-auswertung` стоит `print-color-adjust: exact` (как решать здесь — Eigenentwurf, в
  браузере проверить); на чёрно-белом принтере остаются название и подсказка.
- [ ] **Tor 6 — Fakten:** каждое утверждение о праве, деньгах или здоровье — с источником или пометкой «(Eigenentwurf, fachlich
  nicht geprüft)». Таких утверждений в единице не планируется; о зрении и цветовосприятии чисел не приводить, цвет никогда не
  единственный носитель: название всегда текстом рядом с пятном, пятно с `role="img"` и `aria-label` (как в `farb-labor`).
- [ ] **Tor 7 — Vorlesen:** Kinder-App → Vorlesen на каждом экране (`vorlesen()` из `kinder-ui`). Вариант (Eigenentwurf), как в
  `architektur-spaziergang`: без локального немецкого голоса (`lokaleStimme('de')`) кнопку не показывать и сказать об этом, иначе
  браузер выберет голос сам, и он может быть сетевым. uk/ru — только при локальном голосе для языка, иначе слова лишь
  показывать, как в `farb-labor` (решение — п. 10).
- [ ] **Tor 8 — Seiten der Quelle:** только с пометкой «maschinell geprüft, noch nicht von einem Menschen geprüft»; по
  стандарту A18 номеров страниц на листе нет, они только в данных (`quelle.seite`) и в документации.
- [ ] **Tor 9 — keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.**
Правила Bauauftrag и репозитория сверх Tore:
- [ ] Werbefrei, без аккаунтов и покупок; без внешних запросов (docs/02 Z. 22–24): CSP `default-src 'self'`,
  `installiereNetzwerkWaechter()`; keine Eingabefelder; kein Service Worker (решение 9б).
- [ ] `eltern.html` (шаблон; в Bauauftrag не назван — Eigenentwurf) и ссылка `../../impressum.html` в Fuß
  (`packages/kinderschutz/test/impressum-link.test.mjs`). При Weg A `quiz-kern` сам ставит в Fuß ссылку на `eltern.html`,
  файл обязателен.
- [ ] Hilfe-Insel не нужна: Fachlernen Farbe, Ko-Nutzung 3–5, взрослый рядом (так `farb-labor` стоит в списке «bewusst ohne»
  теста `hilfe-insel-abdeckung`).
- [ ] uk und ru: см. последнюю строку п. 10.
Особые риски темы (Eigenentwurf; Fachprüfung offen): названия цветов не должны отсылать к людям (например «Hautfarbe»); warm и
kalt подаются как договорённость, не как свойство вещей; граничные случаи называются честно (п. 10).

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- Рамка адаптации (docs/10, «Правовая и этическая рамка адаптации», п. 1–4): заимствуются понятия и структура, ни одного
  дословного текста; 3–5 лет — только Ko-Nutzung с жёсткими лимитами сессий; линия языков происхождения uk/ru для семей с
  миграционной историей; DSGVO Art. 8 (ноль детских данных), AI Act, BFSG, привязка к Bildungspläne. Без пометки «проверено
  человеком» — offen.
- Katalog (docs/10 Z. 456): «sprachliche Bildung / alltagsintegrierte Sprachförderung» — утверждение Katalog, источником не
  подтверждено (offen).
- Förder-Fit: (offen) — ни Bauauftrag, ни Katalog программу не называют; суммы, сроки и доли не приводятся. Детали —
  foerder-navigator.

## 8. Аджайл-оценка
Aufwand: Katalog — S. Оценка (Eigenentwurf): Weg B — S–M; по объёму ближе к `puppentheater-werkstatt` (`app.mjs` 94, `logik.mjs`
122 строки, `druck.css` 70) и `dinge-des-alltags` (135 и 83 строки), чем к `farb-labor` (355 и 404 строки); Weg A — S (оболочка
вроде `stark-und-gesund`, `app.mjs` 33 строки), но выбор группы, цветовое пятно и печать всё равно потребуют отдельного кода.
Главная работа — слова, их группировка, значения цвета и проверка носителями языка, а не код.
Переиспользуем: `kinder-ui` (`el`, `vorlesen`, `lokaleStimme`, при необходимости `erstelleSprache`, `kinder.css`),
`kinderschutz` (`installiereNetzwerkWaechter`), при Weg A — `quiz-kern`. Набор файлов (Eigenentwurf, по образцу): `index.html`,
`app.mjs`, `logik.mjs`, `druck.css`, `eltern.html`, `daten/farbwoerter.json`, `test/logik.test.mjs`, `test/regeln.test.mjs`,
`package.json`, `README.md`, `GDD.md`. В `eltern.html` — то же честное слово, что в `farb-labor`: warm и kalt — договорённость.
Первый срез (playable, Eigenentwurf): Gate → группа warm → четыре Farbwörter → Farbkarte с Vorlesen (de) → «Bildschirm aus».
Печать, группы kalt/kontrast/neutral и uk/ru — следующие срезы.
Abnahme (Bauauftrag Abschnitt 8): `npm test` в папке приложения зелёный; браузер при 360 px (нет переполнения, кнопки не меньше
48 px, фокус после клика, хранилище пусто, запросы только к `localhost`); печать: одна карточка на лист, число напечатанных
карточек равно выбору. Число тестов называть только после сборки и сверять с `packages/kinderschutz/test/testzahlen.test.mjs`.
Регистрацию (Hub, README, Impressum с пересчётом чисел, `docs/10`, Katalog) делает только Koordinator.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 3–5 и 5–7 лет вместе со взрослым (протокол — docs/05, метод 5; без имён детей); результатов нет,
это гипотезы (Eigenentwurf):
1. Связывают ли дети образное название с цветовым пятном — говорят ли «как вишня», «как лимон»? Какие слова остаются чужими?
2. Понятно ли «warm / kalt» для цветов или звучит как «красный горячий»? Что делают дети и взрослые, когда цвет «посередине»
   (tannengrün, meergrün)?
3. Хотят ли дети услышать слово ещё раз? Не мешает ли голос? Хотят ли семьи с uk/ru третий язык, узнают ли слова?
4. Что дома делают с распечатанной карточкой — раскрашивают, ищут цвет в комнате, вешают? Теряет ли карточка смысл на
   чёрно-белом принтере?
5. Хватает ли `PRO_SESSION` карточек за раз; читает ли взрослый пояснение «вместе со взрослым»; уходит ли семья от экрана к
   поиску цвета?

## 10. Offen / Zweifel
Проверено при составлении: `node tools/bauauftrag-pruefen.mjs` даёт для этого Bauauftrag «ok» (11 цитат); S. 178 я сверил с
текстовой копией ещё раз. Файл-источник лежит на ветке `main`, не на рабочей; человеком страницы не проверены (A18).

**Widersprüche (Bauauftrag vs. Katalog vs. Plan vs. Quelle vs. Code)**
- Veraltet nach A7: Bauauftrag Abschnitt 3 («Die App nimmt ihn nicht an»), 6 («Kein quiz-kern (A7)»), 7 (тест «kein Import von
  quiz-kern») и 9 («Bauen erst nach Entscheidung A7») vs. шапка Bauauftrag и план (Abschnitt 1): A7 выполнен (шапка сама называет
  эти утверждения устаревшими). То же в `docs/bauauftraege/index.json` («neu bauen – ohne quiz-kern (Regelkonflikt)»), в
  `docs/plan-praleska-umsetzung.md` Z. 52 и Z. 165, в `docs/offene-punkte-kita.md` (запись «Content-Pack №9
  Farbwörter-Schatz»; описывает рекорд и ранги движка). `docs/10` Z. 444 («quiz-kern, Regelkonflikt») и Z. 446 («9 und 10 nur
  mit quiz-kern, Regelkonflikt») говорят о том же конфликте, но Z. 446 читает его как «только с quiz-kern», а Bauauftrag и
  индекс — как «ohne quiz-kern». Какие места править, зависит от выбора Weg A или B (п. 3).
- Faktenstand: индекс «nur Katalogtext» vs. Bauauftrag Abschnitt 1 «geprüft» (цитаты сверены с текстовой копией). Пометка в
  индексе устарела.
- Группы: Abschnitt 1 и Lernziel 1 — четыре группы (warm, kalt, kontrast, neutral) vs. источник (моя сверка): S. 178 называет
  пары warm/kalt и kontrastierend/im Ton nahe, а также neutral, и наряду с основными цветами — цвета спектра; пара
  «kontrastierend / im Ton nahe» в Bauauftrag сжимается до `kontrast`. Контраст — отношение двух цветов, а `gruppe` стоит у
  одного слова. Шесть слов Bauauftrag — тёплые или зелёные тона: для kontrast и neutral источника нет, `gruppeFuer` вернёт
  пустой список, Lernziel 1 для этих групп не выполнить, а экран пустой группы Bauauftrag не описывает (Pseudocode называет
  пустой список только «bei unbekannter Gruppe»).
- Hinweis: Abschnitt 3 («Hinweis warm oder kalt») vs. Pseudocode `farbkarte` (для kontrast и neutral — название группы).
- warm/kalt: разнесение слов по группам — Eigenentwurf и одно значение на слово, тогда как `farb-labor`
  (`daten/farben.json`) ведёт `warmKalt.geltung` = «ausgemacht», зелёный и фиолетовый как «strittig» (пример «Tannen im
  Schnee») и требует, чтобы в делении были названы граничные случаи. Оба зелёных слова Bauauftrag (meergrün, tannengrün)
  оказываются на спорной стороне.
- Farbfläche: `farbkarte` возвращает `flaeche` (Abschnitt 5), в схеме (Abschnitt 4) поля цвета нет. Значение — Eigenentwurf;
  образное название не задаёт один тон (в `farb-labor` значения цвета — направление, не измерение).
- de/ru: шесть русских слов, шесть немецких имён, но «салатовый» (светлый, цвет салата) и tannengrün (тёмный) не пара. Katalog
  называет himbeerrot и tannengrün «an deutsche Alltagsreferenzen angepasst», то есть адаптация, а не перевод: `ru` там не
  может стоять как соответствие, иначе рушится обещание «один цвет на трёх языках». Поле Katalog `quelleImBuch` приводит
  транскрипцией только четыре из шести слов; перечень на странице открыт («и т. д.»).
- ru и uk: Abschnitt 4 — пример с заполненным `ru` vs. Abschnitt 6 — «uk und ru: nicht vorhanden, offen». Образец
  `puppentheater-werkstatt` запрещает ключи `uk` и `ru` в данных (`test/regeln.test.mjs`, тест «keine uk- und ru-Fassung
  erfunden»). Решить: показывать `ru` шести слов источника уже в первом срезе (данные отходят от образца) или только после
  проверки носителем языка (рекомендация Eigenentwurf: после).
- Sprache: Pseudocode знает `sprache` и пропускает при печати карточки с `name == null`, а в Abschnitt 3 нет экрана выбора
  языка и места, где выбор живёт. Без `speicherSchluessel` выбор действует до перезагрузки (Eigenentwurf). Пока `uk` пуст, ни
  выбор, ни печать не должны предлагать uk. Mini-i18n (Katalog: «quiz-kern + mini-i18n») в Bauauftrag нет; интерфейс остался
  бы немецким (Eigenentwurf).
- Vorlesen: Abschnitt 2 и 3 («folgt nach Entscheidung F2», «F2 offen») vs. план (Tor 7) и решение 28а: у Kinder-App Vorlesen
  есть; `docs/fragen-und-hinweise.md` всё ещё ведёт F2 как вопрос. Katalog «dreisprachig mit Vorlesefunktion» vs. код:
  `vorlesen()` берёт язык из вызова, `quiz-kern` его не передаёт; `farb-labor` uk/ru только показывает и не читает, потому что
  без голоса для этого языка немецкий голос читал бы кириллицу.
- Alter: Katalog «3-5 (Ko-Nutzung), 5-7» vs. группа «ПОЧЕМУЧКИ» — по моей сверке 4-й и 5-й годы жизни (страницу Bauauftrag не
  ведёт, номера нет). Для 5–7 в источнике есть параллельное место: по моей сверке в разделе «Рисование» самой старшей группы
  стоят те же цветовые задачи (спектр и оттенки; близкие по тону, контрастные, нейтральные, тёплые и холодные цвета;
  образные названия), страницу Bauauftrag не ведёт, номера нет. Либо дополнить Bauauftrag этим местом (страница — после
  проверки), либо вести 5–7 как Eigenentwurf.
- Muster-Tests vs. Bauauftrag: образец `puppentheater-werkstatt` требует Pflichtmarkierung на каждом листе и в Fuß
  (`test/regeln.test.mjs`, тест «Pflichtmarkierung»), а стандарт A18 и Bauauftrag Abschnitt 6 её опускают, потому что лист не
  несёт номера страницы. Тот же образец требует слова «Eigenentwurf» на каждом листе (тест «Eigenentwurf-Kennzeichnung»);
  Bauauftrag этого не называет, хотя название и подсказка — Eigenentwurf. Тест «Pflichtmarkierung» ищет в GDD заголовок
  «## Offen», а здесь раздел называется «10. Offen / Zweifel» (по заданию) — при сборке править тест или заголовок. В файлах
  кода образец запрещает любой Emoji и знаки вроде средней точки (тест «keine Druckzeichen»): заголовок и Fuß писать без них.
- Sitzungslimit: Abschnitt 9 требует feste Limits для 3–5, в Abschnitt 3 для них нет шага; число — offen.

**Offene Fragen (für Max / Redaktion)**
- Motor: Weg A или Weg B (п. 3) — решение Max.
- Отдельное приложение или расширение `farb-labor`? `docs/offene-punkte-kita.md` в записи «Content-Pack №9
  Farbwörter-Schatz» называет `farb-labor` (5–7) ближайшим существующим приложением для этого Content-Pack; Bauauftrag его
  не упоминает. Пересекаются warm/kalt и названия uk/ru.
- Группы в первом срезе: только warm и kalt (для них источник даёт слова)? kontrast — пара, а не значение у слова? Слова для
  neutral придумать самим (Eigenentwurf, Fachprüfung)? Граничные случаи отмечать, как в `farb-labor`?
- Значения цвета: кто выбирает и на каком устройстве смотрит; Fachprüfung разнесения (Kunstpädagogik) — не проводилась.
- uk и ru: когда и кем проверяются; судьба «салатовый» и tannengrün; показывать один язык или три названия сразу.
- Vorlesen uk/ru: только с локальным голосом (иначе кнопка скрыта) или только показывать, как `farb-labor`? Без локального
  голоса браузер выбирает сам, голос может быть сетевым; `installiereNetzwerkWaechter` перехватывает только fetch, XHR и
  WebSocket (комментарий в `komponenten.mjs`).
- Sitzungslimit (число) и Gate; конец «Bildschirm aus» (идея выше — Eigenentwurf).
- Возраст 5–7: Gate и лимит и там или короткая самостоятельная сессия (Rahmen, Punkt 2)?
- Druck: цветовое пятно и чёрно-белая печать (выше); листа для раскрашивания в Bauauftrag нет.
- Quelle im Repo nicht prüfbar: PDF лежит только на `main`; сверка страниц и цитат идёт вне репозитория
  (`tools/quelle-holen.sh`, F3), человеком не сделана (A18).
- Seitenangaben: A18 (на листе их нет); граница цитат A10 (b) — 12 или 6 слов: здесь 6.
- Имя: папка `apps/farbwoerter-schatz/` следует названию единицы (Eigenentwurf).
- Fachprüfung слов и подсказок (язык, возраст, порядок цветов) и Kindertest не проводились.

uk und ru: nicht vorhanden, offen.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
