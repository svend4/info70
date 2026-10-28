# 🕵️ Nachrichten-Detektive — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле: по `README.md`,
> `index.html`, `eltern.html`, `app.mjs`, `daten/fragen.json`, `manifest.webmanifest`, `test/fragen.test.mjs` и движку
> `packages/quiz-kern` (весь ход игры — там), плюс замеры в браузере при 360 px (`tools/browser-pruefung.mjs`,
> `tools/browser-tor.mjs`, `tools/quiz-durchlauf.mjs` и одноразовые скрипты вне репозитория — в репо их нет). Чего здесь не
> проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные этим документом не менялись.

## 1. Феномен / потребность (Warum)
Тематика — Nachrichtenkompetenz. Дети видят в чатах и лентах фейки, цепные сообщения, кликбейт, «слишком хорошо, чтобы быть
правдой», скрытую рекламу (инфлюенсеры, Unboxing, Produktplatzierung, In-App-Shop), «Gratis»-приманки за данные, а теперь и
подделки с помощью ИИ: картинки, голос «как у мамы», видео-дипфейки, уверенные выдумки чат-ботов (README Z.3–13). Без
приложения ребёнок опирается на «выглядит как настоящее», лайки и репосты. Здесь он сам, играючи, разбирает «дела» и после
каждого ответа читает, по какому признаку это видно. Итога и оценки ребёнка нет; вердикт к отдельному ответу есть (п. 6 и 10).
Обоснование в проекте (право, гранты и сроки не перепроверены — «(offen)»): README Z.15–21 (приоритет BKM с 2019 г., грант NRW
«до 80%», ссылка на docs/01); docs/06 (Z.55–56) закрывает этим приложением строки «Fake News / Verschwörungserzählungen» и
«Online-Werbung / Influencer»; docs/11 относит его к Art. 13/17 («Information, Medien- & Nachrichtenkompetenz»).
Рост банка (git): 12 базовых дел (12.07.2026, accdf85) → +10 «Werbe-Radar» (084a58e) → +8 «KI-Radar» (dee96fb) = 30.
20.10.2026 движок без Rekord и Rang (A7: 56b2b22, a31f2da, 70dfe0f); 27.10.2026 Service Worker убран (b4c6139, решение 9б)
и снята Wertung (96a1f89, Lauf C).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Ko-Nutzung не обязательна, но предусмотрена движком (Klassen-, Duett-, Staffel-Modus).
Belege:
- `README.md` Z.3 «для детей 8–12 лет»; `daten/fragen.json` Z.3 `"zielgruppe": "8-12"`; `app.mjs` Z.1 «(8-12 Jahre)»;
  `index.html` Z.7 и `eltern.html` Z.15 «für Kinder von 8 bis 12»; `manifest.webmanifest` Z.4 и `package.json` Z.5
  «für Kinder von 8 bis 12 Jahren»; хаб `index.html` Z.18–20 — раздел «Sicher im Netz (Kinder 8–12)».
- Обращение «du» к ребёнку (`app.mjs` Z.20: «Du bekommst 12 Fälle …»). Hilfe-Insel (116 111) включена, и тест
  `hilfe-insel-abdeckung` называет это приложение среди обязательных (он требует её только для Kind-Anwendungen). Полей ввода
  нет; в `docs/erwachsenen-apps.json` и `docs/kinder-apps-mit-eingabe.json` приложения нет.
- Взрослым адресована только `eltern.html` («Ihr Kind», «So begleiten Sie Ihr Kind»). README называет детей пользователями →
  по решению 34а это Kinder-App, правило docs/02 Z. 141–146 (ребёнок не оценивается) действует.
- Роли взрослых — только в режимах движка (`quiz.mjs` Z.104–115): «Für den Unterricht» (Klassen-Modus, Lehrkraft с классом),
  «Zu zweit spielen» (Duett: «z. B. Eltern und Kind, Enkel und Oma»), «Für Geschwister» (Staffel). В README этих режимов нет
  (п. 10).

Соседи: `nachrichten-detektive-junior` (6–8), `nachrichten-detektive-profi` (13–15), `kettenbrief-stopper`, `feed-forscher`,
`deepfake-spuernase`.

Одно предложение: «Ребёнок в роли детектива новостей разбирает 12 „дел“ из 30 — настоящее или фейк, реклама или совет,
настоящие ли снимок, голос и видео — и уходит с правилом „erst prüfen, dann teilen“ и несколькими приёмами проверки (несколько
надёжных источников, обратный поиск по картинке, перезвонить по известному номеру, спросить взрослого)».

## 3. Движок и петля (Wie)
Движок: `quiz-kern` (`starteQuiz`; `quiz.mjs` 393 строки, общий с другими квизами). В `app.mjs` (33 строки) только данные,
тексты и политика: `hilfeInsel: true` (Z.14), `rekordSchluessel: 'nd.rekord'` (Z.15, только для разовой очистки),
`rundenGroesse` 12, подписи «Echt / Fake» и «Ermittlung abgeschlossen!» (Z.17–28).
Основная петля (режим «Einzel»): старт с вводным текстом и кнопками «▶️ Ermittlung starten», «🔊 Vorlesen» → 12 раз [заголовок
«Fall n von 12 · Kategorie» и полоса прогресса; `binaer`: утверждение и кнопки «✅ Echt» / «❌ Fake», `wahl`: вопрос и три
перемешанных ответа; «🔊 Vorlesen»] → после ответа плашка «Richtig! 🎉» (зелёная) или «Nicht ganz …» (красная) и объяснение
(`erklaerung`), «Nächster Fall ➡️» / «Zum Ergebnis 🏁» → «Ermittlung abgeschlossen! Du hast alle Fragen durchgearbeitet.»,
«🔁 Noch einmal», «🏠 Zum Start».
Другие режимы на том же банке: Klassen-Modus (одна проекция, устный ответ, «🔍 Auflösung zeigen», в конце «Alle 12 Fälle
gemeinsam besprochen!»), Duett (двое по очереди на одном устройстве, «Spieler 1 ist dran!», каждому по 12 вопросов), Staffel
(«jüngeres Kind» / «älteres Kind» по очереди, «Große*r, erkläre es kurz mit eigenen Worten!»). «🆘 Ich brauche Hilfe» открывает
Hilfe-Insel.
Реиграбельность: каждый раунд — `mischen(daten.fragen).slice(0, 12)` (`quiz.mjs` Z.126); варианты `wahl` перемешиваются, кнопки
`binaer` всегда в порядке «Echt», «Fake». Раунд выбирается заново из всех 30, не исключая сыгранные: в среднем 4,8 дела из 12
совпадают с прошлым раундом, раунд без повторов — 0,02 % случаев (расчёт, не замер).
Прогон: `node tools/quiz-durchlauf.mjs nachrichten-detektive --modus alle` зелёный (Einzel 12 ответов, Duett 24, Staffel 12;
проверки конечного экрана без замечаний). Klassen-Modus этим инструментом не прогоняется; вручную скриптом пройден до конца
(12 дел до «Alle 12 Fälle gemeinsam besprochen!»).

## 4. Lernziele (проверяемые!)
Из README Z.25–30, с привязкой к данным (id дел):
1. Ребёнок проверяет источники: «стоит ли новость на нескольких известных сайтах?» (f02; также f11, ki07).
2. Ребёнок распознаёт манипуляции: кликбейт, цепные сообщения, «слишком хорошо, чтобы быть правдой» (f01, f05, f09; w06 —
   Zeitdruck).
3. Ребёнок знает, что фото, видео и ИИ-картинки — не доказательство (f06, f12, ki01, ki03, ki07).
4. Ребёнок понимает алгоритмы рекомендаций (f07 — единственное дело).
5. Ребёнок защищает свои данные (f10 — единственное прямое дело; рядом ki02 — пароль по телефону).
6. Ребёнок при сомнении спрашивает взрослого и проверяет в детском поисковике (f11, ki08; рядом ki02).
В данных есть цели, которых нет в Lernziele README: узнавать рекламу и её маркировку — f04, w01–w10 (11 из 30 дел; в README
только в статусе); ИИ-голос и дипфейк-обман (ki02, ki03), маркировка ИИ (ki04), чат-бот выдумывает факты (ki05), честное
использование ИИ (ki06).
Как проверяется: 6 тестов проверяют схему и баланс данных, наличие паков, отсутствие `raenge` и отсутствие оценки и хранения в
коде, но не усвоение. Усвоение проверит только Kindertest (п. 9: «объяснить своими словами» и перенос на новый пример).

## 5. Контент-план
Единица контента: дело (Fall). Схема `daten/fragen.json` (version 1, `"zielgruppe": "8-12"`): `binaer` — `id, typ, kategorie,
aussage, korrekt ("ja"|"nein"), erklaerung`; `wahl` — `id, typ, kategorie, frage, antworten[3], korrekt (индекс), erklaerung`.
Полей очков и рангов нет (тест: `raenge` отсутствует). MVP — банк из 30 дел (15 `binaer`, 15 `wahl`) в трёх блоках:

| Блок | id | Дел | Содержание | binaer: ja / nein |
|---|---|---|---|---|
| Базовые | f01–f12 | 12 | Fake News (f01, f03, f08), Quellen-Check, Werbe-Radar (f04), Kettennachricht, Bilder-Check, Algorithmen, Clickbait, Daten-Falle, Detektiv-Trick, KI erkennen (f12) | 2 / 3 |
| Werbe-Radar | w01–w10 | 10 | Anzeige-Hinweise, Unboxing, In-App-Shop, getarnte Werbung, Influencer-Kennzeichnung, Zeitdruck, «Gratis», Produktplatzierung, Kinderseiten, Testimonial | 3 / 2 |
| KI-Radar | ki01–ki08 | 8 | KI-Bildfehler, Stimme «wie Mama», Deepfake-Promi, Kennzeichnung, Chatbot-Halluzination, ehrliche KI-Nutzung, Rückwärtssuche, Druck → Erwachsene | 4 / 1 |

Итого `binaer`: ja 9 (f03, f08, w01, w05, w07, ki01, ki04, ki06, ki08), nein 6 (f01, f05, f10, w03, w10, ki03). Категория
«Werbe-Radar» стоит у 11 дел (f04 + w01–w10), «KI-Radar» — у 8. Длина: утверждение или вопрос 8–31 слов (в среднем 16,5),
объяснение 17–36 слов (в среднем 25,4); читаемость не измерялась.
Инварианты в тестах: схема `quiz-kern/schema` при ≥ 20 дел; в `binaer` встречаются и «ja», и «nein» (анти-шаблон; на деле
9 : 6, «Echt» верно чаще); в Werbe-Radar ≥ 10 дел обоих типов; в KI-Radar ≥ 8 дел обоих типов и оба ответа; нет `raenge`; в
`app.mjs` нет `ergebnisSatz|Geschafft|localStorage|setItem|datenKarte|Meine Daten`. Позиция верного ответа в `wahl` в JSON почти
всегда 1 (13 из 15), но на экране ответы перемешиваются, поэтому позиция его не выдаёт; длина выдаёт (п. 10).

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде и/или замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `index.html`, `eltern.html`, `manifest.webmanifest`, `daten/*.json` нет
  `http(s)://`, `<img>`, `<iframe>`; подключены только свой `app.mjs`, `quiz-kern` и общие модули из репо. Реклама и Shops —
  только содержание дел (w01–w10); fragFINN, Stiftung Warentest и «Feed-Forscher» (f07) названы текстом, без ссылок.
- [x] **Без аккаунтов и персональных данных:** нет `<input>`, `<form>`, `<textarea>`; взаимодействие — кнопки.
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` в `index.html` и
  `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.6); единственный `fetch` — относительный
  `daten/fragen.json` (Z.8). Замер: за полный раунд и во всех режимах запросы только к своему origin; `fremdeHosts` 0.
  Оговорка про Vorlesen — п. 10.
- [x] **Speicher:** приложение ничего не пишет: в папке приложения нет `setItem`, `getItem`, `removeItem`, `datenKarte`,
  `loescheDaten`, `speicherSchluessel`; тест запрещает `localStorage|setItem|datenKarte`. Старый ключ `nd.rekord` один раз
  удаляется при запуске (`app.mjs` Z.15 → `quiz.mjs` Z.57–59, в `try/catch`; в `packages/quiz-kern/src` это единственное
  обращение к хранилищу). Замер: подложенный `nd.rekord` исчез, чужой ключ остался (то есть не `clear()`); после полного раунда
  localStorage, sessionStorage и cookies без изменений. Löschknopf: нет — так и положено (решение 30б; `docs/speicher-stand.json`
  пуст, тест `speicher-regel` зелёный). Читается только `ui.anzeige` (`bootAnzeige()`, `quiz.mjs` Z.48); пишет её не это
  приложение.
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker.register` (решение 9б). `app.mjs` Z.31–33 при запуске
  снимает старые регистрации и удаляет кэши; тест `kein-service-worker` называет приложение среди четырёх прежних и проверяет
  это. Замер: `getRegistrations` и `caches.keys` вызываются один раз при старте. По определению API оба вызова действуют на весь
  origin, не только на это приложение; сейчас это безвредно: SW нет ни у одной app.
- [ ] **Offline после загрузки:** не гарантируется (решение 9б); замер: перезагрузка без сети не удаётся.
- [x] **Vorlesen:** «🔊 Vorlesen» на старте, у каждого дела, у каждой плашки-объяснения, в конце и в Hilfe-Insel (`quiz.mjs`
  Z.94–95). `vorlesen()` из kinder-ui ставит локальный голос, если браузер сообщает такой; замер в headless: голосов нет, вызов
  с `voice: null`, `lang: de-DE`. К тексту плашки добавляется заголовок «Richtig! 🎉» / «Nicht ganz …».
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`quiz.mjs` Z.77); тест `datenschutz-zusage`
  («keine App behauptet im Fuß einen Eltern-Link, den sie nicht hat») зелёный.
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`quiz.mjs` Z.79, `eltern.html` Z.37); тест `impressum-link` зелёный.
  Сама страница — шаблон с заглушками (п. 10).
- [ ] **Druck (docs/02 Z. 79–82):** нет — ни `druck.css`, ни кнопки печати, ни `window.print` (поиск по print и druck в коде
  пуст), поэтому правило о печатном листе не затрагивается. Печать экрана из браузера: Fuß скрыт общим `kinder.css`, остальное
  печатается как есть; в базовой линии `docs/browser-basislinie.json` `druck` = 10 (эмодзи), замер повторён: 10 разных знаков
  на стартовом экране (🕵 ▶ 🔊 👩 🏫 👪 🧑 🤝 🧒 🆘).
- [x] **Keine Wertung des Kindes (docs/02 Z. 141–146):** очков, рекорда, рангов, серий, процентов, «n von m правильно», звёзд и
  кубков нет; конец называется «Ermittlung abgeschlossen!», «n von 12» — только позиция («Fall n von 12»).
  `node tools/leistungs-woerter.mjs nachrichten-detektive` → одна строка: `app.mjs: rekord` — это
  `rekordSchluessel: 'nd.rekord'` (Z.15, миграция). В `docs/bewertung-stand.json` приложения нет ни в `apps`, ни в `ausnahmen`:
  исключение не нужно. Проверка конечного экрана зелёная во всех трёх режимах.
- [ ] **Вердикт к каждому ответу:** после ответа плашка «Richtig! 🎉» (зелёная) или «Nicht ganz …» (красная) — стандартные
  тексты движка (`quiz.mjs` Z.23–24, 219–222). Подпадает ли это под «Ни светофора» (docs/02 Z. 141–146), нигде не решено (п. 10).
- [x] **Hilfe-Insel (116 111):** `hilfeInsel: true` (Z.14); кнопка «🆘 Ich brauche Hilfe» на стартовом экране, экран «Du hast das
  Recht auf Hilfe …» открывается и закрывается (замер).
- [x] **Mobile First (замер, 360 px, стартовый экран):** переполнения нет; 8 целей касания, ни одной меньше 48 px; ошибок
  консоли нет; Delta-Tor `node tools/browser-tor.mjs nachrichten-detektive`: 0 Erhöhungen. Клики инструмент не измеряет: у кнопок
  нет `data-kennung` (`ohneKennung` 1 в базовой линии). Вручную: после ответа фокус на первой кнопке нового экрана («🔊 Vorlesen»).
- [x] **Privacy by default:** запросов привилегий нет (поиск по geolocation, getUserMedia, Notification, permissions в
  приложении, `quiz-kern`, kinder-ui и kinderschutz пуст).

Особые риски темы: дела про дипфейк-обман, голос «как у мамы» и звонок, который пугает (ki02, ki03, ki08), могут встревожить.
В коде: тон спокойный; в ki02 лучший ответ — перезвонить маме по известному номеру, в ki08 — позвать взрослого; Hilfe-Insel на
стартовом экране. Утверждения о праве и здоровье в тексте дел без источника: w01, w05, w08 (маркировка рекламы), ki04
(маркировка ИИ в ЕС), f08 (мёд от кашля, «nicht für Babys unter einem Jahr»). Счётчик внешних фактов видит три строки
(`fragen.json` Z.85, 87, 276); w01, w05, w08 он не ловит (нет его ключевых слов). Fachprüfung — offen.
Повторить проверки: `node --test apps/nachrichten-detektive/test/*.test.mjs`, `node tools/leistungs-woerter.mjs
nachrichten-detektive`, `node tools/browser-tor.mjs nachrichten-detektive`, `node tools/quiz-durchlauf.mjs
nachrichten-detektive --modus alle`.

## 7. Стандарты и финансирование (Wofür)
Стандарты (по README, docs/06, docs/09, docs/11; юридически и по срокам не перепроверены — «(offen)»): UN-KRK Art. 13/17
(docs/11, Teil B: информация, медиа- и Nachrichtenkompetenz); Gefährdungsatlas BzKJ (Fake News, Online-Werbung/Influencer —
docs/06; Sharenting — `eltern.html` Z.35); DSGVO — по `impressum.html` персональные данные не обрабатываются; правило fragFINN
«реклама отделена от содержания» пересказано в w09 без источника; AI Act и JMStV названы в записи каталога KI-пака (docs/09,
«AI Act, JMStV, fragFINN»), а маркировка ИИ — как утверждение в ki04, без проверки.
Förder-Fit (по README Z.17–21 и docs/04, не перепроверено): приоритет BKM (Nachrichtenkompetenz); NRW «Digitale Spiele» (грант
«до 80%», условие — офис в NRW; срок, названный в docs/04, 11.09.2026, на дату GDD прошёл, а статус заявки в репозитории не
отражён — «(offen)»); BzKJ (фокусы KI и Demokratiefähigkeit по docs/07 и docs/09). Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: M (приложение на готовом движке; труд — 30 дел и их тексты: `fragen.json` 320 строк, `app.mjs` 33 строки, 6 тестов;
новые паки на этой основе в каталоге оценены как S). Переиспользует: `quiz-kern` (`starteQuiz`, схема в тесте) и через него
`kinder-ui` (`el`, `vorlesen`, `mischen`, `anzeige.boot`, `hilfeInsel`); `kinderschutz` (`installiereNetzwerkWaechter`). Не
использует: `logik.mjs`, `datenKarte`, `sprache`. Первый срез (playable) уже работает: полный раунд из 12 дел с озвучиванием и
без оценки, плюс Klassen-, Duett-, Staffel-Modus и Hilfe-Insel.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет (протокол — docs/05, метод 5). Результатов в репозитории нет (в docs/ только шаблон
протокола и ссылки на него); это гипотезы:
1. Понимают ли дети дела и слова (Clickbait, Produktplatzierung, Testimonial-Werbung, Algorithmus, Deepfake, «halluzinieren»,
   Bilder-Rückwärtssuche) без помощи взрослого? Помогает ли «Vorlesen»?
2. «Echt / Fake» у утверждений-правил (w01, w05, w07, w10, ki04, ki06, ki08): читают ли дети «Echt» как «верно»?
3. Отвечают ли дети по содержанию, а не по подсказке? Заголовок «Fall n von 12 · Kategorie» показывает категорию до ответа (f04
   «Werbe-Radar», f05 «Kettennachricht», f09 «Clickbait», f10 «Daten-Falle»), а верный вариант в `wahl` самый длинный в 14 из 15
   дел. Что будет, если показать дело без категории и с ответами одной длины?
4. Как читается красное «Nicht ganz …»: как подсказка или как упрёк? Бросают ли играть после нескольких красных плашек подряд?
5. Могут ли дети после раунда назвать два-три шага проверки и объяснить «erst prüfen, dann teilen» своими словами? Переносят ли
   их на новый пример, которого нет в банке?
6. Дела про голос «как у мамы», дипфейк-звонок и давление (ki02, ki03, ki08): пугают ли? Открывают ли дети Hilfe-Insel? Верят
   ли фразе «du bekommst nie Ärger dafür, dass du fragst» (ki08)?
7. Замечают ли дети повторы во втором раунде (в среднем 4,8 из 12) и мешает ли это?
8. Понятны ли режимы: Klassen-Modus («Auflösung zeigen»), Duett («Die zweite Person schaut bitte weg»), Staffel («Große*r,
   erkläre es kurz …»)?

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Daten ↔ Text)**
- Altersangabe: расхождений нет — 8–12 в README, JSON, `app.mjs`, `index.html`, `eltern.html`, манифесте, `package.json` и хабе.
- README Z.7–8 «Werbe-Radar (10 дел)» ↔ в данных категория «Werbe-Radar» у 11 дел (f04 + w01–w10; пак — 10, f04 из базы); тест
  требует «≥ 10». Цифра 30 верна.
- `index.html` Z.7 «ohne Wertung» ↔ вердикт «Richtig! 🎉» / «Nicht ganz …» после каждого ответа в режимах Einzel, Duett и Staffel
  (в Klassen-Modus вердикта нет, там «Richtig ist: …»).
- README Z.25–30 (6 Lernziele) ↔ данные: реклама (f04, w01–w10: 11 из 30) и часть KI-дел (ki04–ki06) в целях не названы; цели 4
  (алгоритмы) и 5 (данные) держатся на одном деле каждая (f07, f10).
- README Z.39 «новые 12 дел» ↔ код: каждый раунд тянет 12 из всех 30 заново; в среднем 4,8 дела повторяются, раунд без повторов —
  0,02 % (расчёт). Вводный текст «jede Runde ist anders» (`app.mjs` Z.20) верен только в смысле «другая выборка».
- README Z.45 `npm test` («валидация банка вопросов») ↔ корневой скрипт `npm test` запускает `node --test` по всему репо; в
  `package.json` приложения скрипта нет; в файле 6 тестов, шестой проверяет код, а не банк.
- README Z.36 «блокирует любые внешние запросы» и `eltern.html` Z.21 «technisch erzwungen» ↔ `installiereNetzwerkWaechter`
  перехватывает fetch, XHR и WebSocket, CSP — загрузку ресурсов; Sprachausgabe идёт мимо. `vorlesen()` ставит локальный голос,
  если он есть; иначе браузер выбирает сам, и голос может быть сетевым (комментарий `komponenten.mjs` Z.26–62). Нужна ли
  оговорка — offen.
- Fuß движка «Daten bleiben auf diesem Gerät» (`quiz.mjs` Z.76) ↔ README Z.37, `eltern.html` Z.22, `index.html` Z.7: «ничего не
  сохраняется» (замер подтверждает второе). Не ложь, но читается как «данные есть».
- `packages/quiz-kern/README.md` ещё описывает «результат/ранг/рекорд» и «кнопку удаления данных»; после A7 в коде их нет
  (README приложения верен).
- docs/04 Z.5 «12 заданий, 3 типа вопросов» ↔ схема знает два типа (`binaer`, `wahl`), в банке 30 дел.
- Категория перед ответом (`quiz.mjs` Z.187) подсказывает ответ у f04, f05, f09, f10; у `wahl` верный вариант самый длинный в 14
  из 15 дел (исключение w04); тест баланса проверяет только, что в `binaer` встречаются оба ответа.
- «Echt / Fake» задаёт приложение для всех `binaer` (README Z.50–51), но у w01, w05, w07, w10, ki04, ki06, ki08 утверждение —
  правило или метод, а не сообщение.
- Число 30 стоит статично в README, `eltern.html` Z.15 и корневом README; `app.mjs` считает по данным. Тест связки не проверяет.
- `manifest.webmanifest` остался после 9б: `display: standalone`, `icons: []`, подключён в `index.html` Z.10; в README его нет.
- `eltern.html` Z.34–36 «Sharenting» (Gefährdungsatlas BzKJ, «Recht am eigenen Bild») лежит вне Lernziele приложения и без
  источника.
- Faktenstand: счётчик внешних фактов — 3 блокирующие строки в `fragen.json` (Z.85, 87, 276) и 2 в README (Z.19–20); w01, w05,
  w08 он не видит. Остальные утверждения о праве и здоровье в тексте дел — без источника и без пометки «(Eigenentwurf, fachlich
  nicht geprüft)»; так же названия институций без источника: fragFINN (f11, w09), Stiftung Warentest (w10).

**Robustheit (замер в Chromium; «simuliert» = подменено в скрипте)**
- `daten/fragen.json` не загружается → пустая страница без сообщения (`TypeError: Failed to fetch`; запрос прерван в скрипте).
  Доступ к localStorage бросает `SecurityError` (simuliert) → тоже пустая страница: `bootAnzeige()` (`quiz.mjs` Z.48) обращается
  к `globalThis.localStorage` вне `try`, в `try/catch` стоит только `removeItem` (Z.58). Касается всех приложений на `quiz-kern`.
- Вердикт «Richtig! 🎉» входит в озвучиваемый текст плашки.
- `aria-live="polite"` на всём `#app` (`index.html` Z.13): известно (fragen-und-hinweise, C4), с вспомогательной технологией не
  проверено.

**Offene Fragen (für Max)**
1. Вердикт по каждому ответу: зелёная «Richtig! 🎉» / красная «Nicht ganz …» (`k-hinweis--richtig`, `k-hinweis--falsch`;
   `quiz.mjs` Z.219–222) — подпадает ли под «Ни светофора» (docs/02 Z. 141–146)? Lauf C и A7 убрали Punkte, Rekord, Rang, а
   вердикт остался; в списке слов 37в его нет, конечный экран проверяется отдельно, и «richtig» там запрещено.
2. Нужен ли `manifest.webmanifest` без Service Worker и без иконок?
3. Показывать ли категорию дела до ответа; выравнивать ли длину вариантов `wahl`; расширить ли тест баланса (длина, 9 : 6)?
   (Содержание — решает редакция.)
4. Lernziele в README привести к данным (реклама, KI) или дела подогнать к целям?
5. Факты (Recht, Gesundheit) в делах: источники или пометка «(Eigenentwurf, fachlich nicht geprüft)» — в рамках Strang Г
   (решения 12а–15а, ждут «да» Max): f08, ki04, w01, w05, w08.
6. Срок NRW 11.09.2026 (docs/04) на дату GDD прошёл: подавалась ли заявка, в репозитории не отражено.
7. Нужна ли в README оговорка про режимы Klassen, Duett, Staffel и про Hilfe-Insel; нужна ли оговорка про Sprachausgabe и «keine
   fremden Server»?
8. Hilfe-Insel: номера 116 111 и Elterntelefon берутся из общего блока (`kinder-ui/js/hilfe-insel.mjs`), здесь с источником не
   сверялись — «(offen)».
9. Impressum: страница, на которую ведёт Fuß, сама называет себя «Noch nicht veröffentlichungsreif» (поля Betreiber —
   заглушки). Касается всех приложений.
