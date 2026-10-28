# 🔬 Feed-Forscher — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле:
> по `app.mjs`, `daten/sprachen.json`, `eltern.html`, README и тестам, плюс замеры в браузере при 360 px
> (`tools/browser-pruefung.mjs`, `tools/browser-tor.mjs` и одноразовый скрипт вне репозитория — в репо его
> нет). Чего здесь не проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные
> этим документом не менялись.

## 1. Феномен / потребность (Warum)
Тематика — рекомендательные алгоритмы и фильтр-пузырь (Gefährdungsatlas: «algorithmische
Empfehlungssysteme», docs/06 — покрыто этим приложением). По README (Z.10–16) повод — закрытие «Ein Netz für
Kinder» (2019): BKM переориентировал средства на понимание «algorithmische Entscheidungsstrukturen» и
механизмов платформ; многоязычность (в т. ч. для детей с миграционной историей) названа явной целью программы
BKM 2017 (источник — docs/05, здесь не перепроверено). Идея приложения (README Z.14): это «переживается на
опыте, а не в теории» — ребёнок сам листает симулированную ленту и видит, как его нажатия её сужают. Первое
многоязычное приложение монорепозитория (метод Mehrsprachigkeit, docs/05) и пилот Leichte Sprache (Welle 16).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Belege:
- README.md Z.3 «для 8–12 лет»; `app.mjs` Z.1 «(8-12 Jahre)»; GDD feed-forscher-profi: «Anschluss nach unten:
  feed-forscher (8-12, Themen-Blase)»; README blasen-duell: «Детское приложение (8–12) … (к `feed-forscher`)».
- Обращение «du» и детский язык, Leichte Sprache (`de-ls`), Vorlesen; Hilfe-Insel 116 111 (тест
  hilfe-insel-abdeckung требует её только у детских приложений и называет эту); приложения нет ни в
  `docs/erwachsenen-apps.json`, ни в `docs/kinder-apps-mit-eingabe.json`; полей ввода нет.
- Хаб `index.html`: раздел «Sicher im Netz (Kinder 8–12)»; версия для 13–15 — отдельное приложение
  `feed-forscher-profi`.
- Родители: только страница `eltern.html` («Ihr Kind», «So begleiten Sie Ihr Kind»). Режима для двоих, второго
  экрана или хода взрослого в коде нет → Ko-Nutzung не предусмотрена. По решению Max 34а README и этот GDD
  называют детей пользователями → Kinder-App, Wertungsregel (docs/02 Z. 141–146) действует.

Соседи: `feed-forscher-profi` (13–15), `blasen-duell` (8–12, два Feed рядом), `stundenentwurf-feed` (для
учителей, классы 5–7), `sog-maschine`.

Одно предложение: «Ребёнок «листает» симулированную ленту из 10 видео, нажимает на то, что посмотрел бы, и
вживую видит, как его нажатия (вес темы ×1,7) сужают ленту до одной темы; в конце получает урок с личным
результатом и три способа управлять лентой, включая кнопку «Feed mischen!»».

## 3. Движок и петля (Wie)
Движок: симулятор (gewichteter Zufall) в `app.mjs` (179 строк); `quiz-kern` не используется, `logik.mjs` нет —
логика и DOM в одном файле. Параметры (Z.24–30): 6 тем (katzen, fussball, weltraum, backen, dinos, musik),
`RUNDEN` 10, `FEED_GROESSE` 4, `VERSTAERKUNG` 1,7, `ALARM_ANTEIL` 0,5.
Основная петля: старт (язык de / uk / ru / en, для немецкого ещё «🟦 Leichte Sprache»; «▶️ Experiment starten»;
«🔊 Vorlesen»; «Meine Daten löschen»; «🆘 Ich brauche Hilfe») → 10 раундов: «Video n von 10», лента из 4
разных тем из 6 (взвешенная выборка без возврата, `ziehungen` Z.89–105), ребёнок нажимает «видео» → вес темы
× 1,7 (Z.140) → новая лента; под лентой «Deine Feed-Mischung» (полоса и % по каждой теме); при доле лидирующей
темы > 50 % — «🫧 Blasen-Alarm» (Z.154); кнопка «🌈 Feed mischen!» в любой момент сбрасывает все веса на 1 (счётчик
раундов остаётся) и показывает объяснение (Z.146–153) → после 10 видео урок: «Nach 10 Videos bestand dein Feed
zu N % aus X», три фиксированных урока, «Vorlesen», «Noch ein Experiment», «Zum Start». Gewichte и Runde живут
только в памяти. Реиграбельность — случайность выборки. Прогнан целиком (10 раундов на de, ru, uk и en,
Playwright) без исключений.

## 4. Lernziele (проверяемые!)
Из README (Z.18–22):
1. Ребёнок объясняет своими словами: алгоритм учится на каждом нажатии и показывает «ещё такого же», чтобы
   удержать (Lektion 1).
2. Ребёнок объясняет, как возникает фильтр-пузырь: видимый мир сужается незаметно (Lektion 2).
3. Ребёнок называет способы управлять: искать самому, нажимать разное, делать паузы (Lektion 3; кнопка «Feed
   mischen!»).

Как проверяется: по экрану «Deine Feed-Mischung» ребёнок показывает, какая тема стала доминирующей и после
каких нажатий (Kindertest, п. 9). 5 тестов кода проверяют только каталоги текстов (ключи, плейсхолдеры,
названия тем, Leichte Sprache), не симуляцию и не усвоение.

## 5. Контент-план
Единица контента: тема + строка каталога. 6 тем (с эмодзи, `app.mjs` Z.24–25); 3 шаблона названий «видео»
(`vorlage_1..3`, например «Die 5 besten Momente: {thema}»); 3 фиксированных урока; всё остальное — строки в
`daten/sprachen.json`: 5 каталогов (de, en, uk, ru, de-ls) по 30 ключей. Видео нет: «видео» — кнопка с эмодзи
и названием по шаблону (`eltern.html` Z.20: «komplett simuliert»).
Инварианты в тестах (`test/sprachen.test.mjs`): набор каталогов ровно de, en, uk, ru, de-ls; у всех одинаковые
ключи (нет дыр перевода); у каждой темы в каждом языке есть название; плейсхолдеры в `runde`, `blase_alarm`,
`lektion_ergebnis`, `vorlage_1..3` совпадают с de; de-ls покрывает de, а в шести связных текстах (`start_intro`,
`daten_hinweis`, `lektion_1..3`, `misch_erklaerung`) не больше 12 слов в предложении и текст не совпадает с de
дословно. Полнота переводов проверена тестом, качество перевода uk/ru/en и de-ls человеком — нет данных
(offen).

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде/замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `index.html`, `eltern.html`, `daten/sprachen.json` нет
  `http(s)://`, `<img>`, `<iframe>`, `<video>`, `<audio>` и чужих скриптов; страницы подключают только файлы репо: свой `app.mjs`,
  общие `kinder.css` и `favicon.svg` (ссылка в `<head>` обеих страниц, решение Max 21а). Названий платформ и брендов в файлах приложения нет (grep). «Видео» симулированы.
- [x] **Без аккаунтов и ввода:** нет `<input>`, `<form>`, `<textarea>`; взаимодействие — только кнопки.
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`
  в `index.html` и `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.15); единственный `fetch` —
  относительный `daten/sprachen.json` (Z.19). Замер: полный прогон на de, ru, uk и en — ни одного запроса не к
  своему origin; `browser-pruefung`: `fremdeHosts` 0.
- [x] **Speicher:** один ключ `ff.sprache` = код языка (`de`, `en`, `uk`, `ru` или `de-ls`):
  `erstelleSprache({ speicherSchluessel: 'ff.sprache' })` (`app.mjs` Z.20) пишет при нажатии на язык или на
  «Leichte Sprache»; до первого нажатия localStorage пуст (замер). Löschknopf: да — «Meine Daten löschen» на
  старте, `loescheDaten('ff.sprache')` (Z.77); после удаления подтверждения нет (п. 10). Читается ещё `ui.anzeige`
  (Kontrast/Schrift, `boot`); Gewichte и Runde не сохраняются. Impressum называет «die gewählte Sprache».
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker` (решение 9б; тест kein-service-worker
  зелёный). Neuladen без сети не удаётся (замер) — после 9б Offline-Neuladen не гарантируется.
- [x] **Vorlesen:** «🔊 Vorlesen» на старте (`app.mjs` Z.74) и на экране урока (Z.174), `vorlesen()` из kinder-ui
  с языком голоса `de-DE` / `uk-UA` / `ru-RU` / `en-GB` (Z.26, 36; локальный голос, если есть).
- [ ] **Vorlesen на экране ленты** (раунды 1–10, главный экран): кнопки нет — там 4 кнопки «видео» и «Feed
  mischen!» (замер).
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`app.mjs` Z.45). Только по-немецки.
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`app.mjs` Z.46, `eltern.html` Z.41); тест impressum-link
  зелёный. Сама страница — шаблон с заглушками (п. 10).
- [x] **Hilfe-Insel (116 111):** `hilfeInselKnopf` на старте (`app.mjs` Z.78–79); приложение в списке
  обязательных у теста hilfe-insel-abdeckung. Текст Hilfe-Insel и кнопка — только по-немецки (п. 10).
- [ ] **Druck:** нет — ни `druck.css`, ни кнопки печати, ни `window.print` (grep «print|druck» находит только
  слово «Belehrungsdruck» в `eltern.html`). Печать экрана из браузера: Fuß скрыт общим `kinder.css`
  (`@media print`), остальное (карточки с кнопками) печатается как есть; в базовой линии
  `docs/browser-basislinie.json` для приложения «druck» = 7 (Emoji и «·»), замер повторён: 7.
- [x] **Keine Wertung des Kindes, только Wortliste (docs/02 Z. 141–146):** в коде и данных нет Punkte, Rekord, Rang, Serie, Stern,
  Pokal, «richtig von», «geschafft». `node tools/leistungs-woerter.mjs feed-forscher` → 1 Zeile im Bericht:
  `app.mjs`, группа `prozent`, слово «prozent» — имя переменной (Z.163, 165). В `docs/bewertung-stand.json`
  приложения нет ни в `apps`, ни в `ausnahmen`.
- [ ] **Keine Wertung des Kindes, правило целиком (docs/02 Z. 141–146):** правило запрещает и светофор и процент; цветная
  обратная связь (зелёная рамка «Gut gemacht!» после «Feed mischen!», `app.mjs` Z.153; жёлтый Blasen-Alarm, Z.154–157)
  не решена Max — открытый вопрос п. 10.
- [ ] **Prozent-Anzeige «N %»** (полосы по темам, `app.mjs` Z.118–122, и итоговая фраза, Z.163–165): это доля
  темы в симулированной ленте, не оценка ребёнка, но слово «Prozent» стоит в списке 37в и приложение не в
  `ausnahmen` — решение Max (п. 10).
- [x] **Mobile First (замер, только Startbildschirm, 360 px):** нет переполнения, 11 целей касания, ни одной
  меньше 48 px, ошибок консоли нет; Delta-Tor `tools/browser-tor.mjs feed-forscher`: 0 Erhöhungen. Клики не
  измерены — у кнопок нет `data-kennung`.

Особые риски темы: алгоритмы и «пузырь» показаны без реального контента — шесть нейтральных тем (кошки,
футбол, космос, выпечка, динозавры, музыка), «видео» — только кнопки с эмодзи и названием по шаблону.
Формулировки об алгоритме, а не о ребёнке («Der Algorithmus glaubt, du willst nichts anderes mehr sehen.
Stimmt das?»). Hilfe-Insel подключена, но по-немецки (п. 10).
Повторить проверки: `node --test apps/feed-forscher/test/*.test.mjs`, `node tools/leistungs-woerter.mjs
feed-forscher`, `node tools/browser-tor.mjs feed-forscher`.

## 7. Стандарты и финансирование (Wofür)
Стандарты (по README, docs/05, docs/11; юридически и по срокам не перепроверены — «(offen)»): UN-KRK Art.
13/17 (Information, Medien- und Nachrichtenkompetenz) — docs/11 относит приложение сюда; BFSG — в коде
Leichte Sprache (`de-ls`), Anzeige-Einstellungen и RTL-Grundausbau (`setzeRichtung`, в каталогах RTL-языка нет),
`eltern.html` Z.27 говорит «Barrierefreiheit nach BFSG»; соответствие не проверялось (offen). Повод по README
(Z.10–16): закрытие «Ein Netz für Kinder» 2019 и цель программы BKM 2017 — многоязычность. Метод
Mehrsprachigkeit (`kinder-ui/js/sprache.mjs` и тест полноты) — docs/05, метод 3. Förder-Fit: BzKJ
«Kindgerechte digitale Angebote» 2027, пакет «Demokratie & KI» вместе с daten-schatz (docs/04; сроки и доля
софинансирования — там же, здесь не перепроверены). Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: M (`app.mjs` 179 строк, `sprachen.json` 162 строки = 5 каталогов × 30 ключей, 5 тестов; основная
работа — симуляция, i18n и Leichte Sprache). Переиспользует: `kinder-ui` (`el`, `vorlesen`, `mischen`,
`sprache`, `leichte-sprache`, `richtung`, `loescheDaten` из `daten-karte`, `anzeige.boot`, `hilfeInsel`),
`kinderschutz` (`installiereNetzwerkWaechter`); `quiz-kern` — нет, `logik.mjs` — нет. Первый срез (playable)
уже работает: полный раунд из 10 видео на четырёх языках с озвучиванием на старте и в уроке.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет, из них 2–3 с языком uk/ru (протокол — docs/05, метод 5); это гипотезы,
результатов нет:
1. Понимают ли дети без помощи: «я нажимаю → алгоритм показывает больше такого же»? Могут ли после 10 видео
   своими словами сказать, какая тема «захватила» ленту и после каких нажатий?
2. Читаются ли полосы «Deine Feed-Mischung» с процентами без пояснения (8-летние)? Нужна ли подпись?
3. «Blasen-Alarm»: подсказка алгоритма или упрёк («Stimmt das?»)? Сколько детей сразу жмут «Feed mischen!» и
   что они при этом думают о настоящей ленте? (Утверждение о настоящих лентах в приложении не обосновано —
   offen.)
4. Урок: запоминают ли хотя бы один из трёх способов управлять лентой? Что чувствует ребёнок, нажимавший
   разнообразно (Alarm не было), но получающий тот же урок «So entsteht eine Filterblase»?
5. Языки: находят ли дети с uk/ru кнопку языка, понимают ли тексты, есть ли на их устройстве голос
   uk-UA / ru-RU для «Vorlesen»? Находят ли «Leichte Sprache» (кнопка есть только для немецкого)?
6. Нужна ли кнопка «Vorlesen» на экране ленты, понимают ли слабо читающие дети названия «видео»?

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Text)**
- Языки: README (Z.7–8 «трёхъязычное … (DE/UK/RU)»), `eltern.html` (Z.15 и Z.27: «Deutsch, Ukrainisch und
  Russisch»), `package.json` (Z.5 «de/uk/ru»), docs/04, docs/05 и корневой README Z.28 говорят о трёх языках.
  В коде четыре: кнопки de/uk/ru/en (`app.mjs` Z.55) и голос `en-GB` (Z.26), в `sprachen.json` пять каталогов
  (de, en, uk, ru, de-ls), в тесте `ALLE` (Z.7) то же, название первого теста — «drei Basissprachen» (Z.10).
  Корневой README Z.80 и Z.104 уже пишут de/en/uk/ru. Английский добавлен в Welle 47 (каталог №281).
- Итоговая фраза: «Nach 10 Videos bestand dein Feed zu N % aus X» (README Z.29) считается из текущих весов
  (`dominantesThema`, Z.107). «Feed mischen!» сбрасывает веса, но не счётчик раундов (Z.146–152): прогон «8
  нажатий, mischen, 2 нажатия» дал «… zu 23 % aus „Backen“» — это не про 10 видео.
- Порог ↔ текст: «Blasen-Alarm» говорит «Fast dein ganzer Feed ist jetzt …» уже при доле > 50 % (Z.154; в
  прогонах 54 % и 63 %): текст обещает «почти вся лента», порог — чуть больше половины. `eltern.html` (Z.15)
  пишет «ab 50 %», код (как и README Z.28, «> 50%») — строго «больше».
- Документы: docs/fragen-und-hinweise.md D4 (Impressum «sagt gar nichts», «bekannt, offen») и запись 27а
  («fertig») противоречат друг другу; сам Impressum уже называет «die gewählte Sprache».
- Altersangabe: расхождений нет (README, `app.mjs`, хаб, соседние GDD — везде 8–12).

**Offene Fragen (für Max)**
- Prozent: «N %» на экране — доля темы в симулированной ленте (полосы и итоговая фраза), не оценка ребёнка; но
  «Prozent» в списке слов 37в, а `docs/bewertung-stand.json` приложения не знает (ни `apps`, ни `ausnahmen`).
  `leistungs-woerter` видит только имя переменной `prozent` (Z.163, 165), «{anteil} %» в `sprachen.json` не
  распознаётся. Подтвердить «не оценка» и завести запись с причиной — или изменить показ? Там же цветная
  обратная связь на действие: зелёная рамка «Gut gemacht! …» после «Feed mischen!» (Z.153) и жёлтая «Blasen-Alarm»
  (Z.154–157); в списке слов 37в этого нет, явного решения тоже (ср. daten-schatz).
- Lektionen фиксированы (3 предложения) и не зависят от результата: прогон «разнообразные нажатия» (доля лидера
  29 %, без Alarm) всё равно получает Lektion 2 «So entsteht eine Filterblase …»; «Feed mischen!» обнуляет всё
  мгновенно и говорит «Du hast dem Algorithmus gezeigt: Ich entscheide!» — как это соотносится с настоящими
  лентами, в репо не обосновано (offen). Нужна ли ветка «пузырь не возник»?
- Vorlesen: на экране ленты кнопки нет; для uk/ru/en язык голоса задаётся, наличие локального голоса зависит от
  устройства — иначе браузер выбирает сам, голос может быть сетевым (комментарий в `komponenten.mjs`);
  `installiereNetzwerkWaechter` перехватывает только fetch/XHR/WebSocket, CSP — загрузку ресурсов.
  Формулировка «technisch erzwungen» (`eltern.html` Z.21, Impressum) относится к ним, не к Sprachausgabe.
- Многоязычность не доходит до краёв: Hilfe-Insel (116 111), Fuß, `eltern.html`, `<noscript>` — только
  по-немецки (замер: в uk/ru/en кнопка «🆘 Ich brauche Hilfe»); `<html lang>` остаётся «de» при uk/ru/en
  (замер). «Leichte Sprache» меняет только каталог: Hilfe-Insel, Fuß и кнопка «Ich brauche Hilfe» остаются
  прежними, хотя `eltern.html` (Z.27) говорит «tauscht alle Texte». README (Z.15–16) называет целью детей с
  миграционной историей, `eltern.html` — «Barrierefreiheit nach BFSG». Нужны ли переводы и `lang`? offen.
- Löschknopf: подтверждения нет (`loescheDaten` возвращает число, `app.mjs` Z.77 его не использует; общий
  `datenKarte` сообщил бы «Gelöscht»); интерфейс остаётся на выбранном языке до перезагрузки.
  `erstelleSprache` читает и пишет localStorage без try/catch (`sprache.mjs`): поведение при заблокированном
  хранилище не проверено.
- Fakten: Sharenting-блок `eltern.html` (Z.39: «Recht am eigenen Bild», Faustregeln) без источника и без
  пометки «(Eigenentwurf, fachlich nicht geprüft)»; повод из README (ENfK 2019, BKM 2017) — из docs/05, в репо не
  проверяем; BFSG-соответствие и качество переводов uk/ru/en не проверены (en: «How Dinosaurs works»). Счётчик
  внешних фактов для кода и данных: 0 блокирующих.
- Impressum: страница, на которую ведёт ссылка в Fuß, сама называет себя «Noch nicht veröffentlichungsreif»
  (поля Betreiber — заглушки). Касается всех приложений.
- Browser: Fokus nach Klick и Klickfehler никогда не измерялись (нет `data-kennung`, `ohneKennung` 1 в базовой
  линии); Tor 3 (docs/plan-neue-welle.md, Abschnitt 3) требует это для новых приложений.
- Тесты (5) не покрывают симуляцию: ×1,7, порог > 50 %, 4 разные темы в ленте, 10 раундов (нет `logik.mjs`).
