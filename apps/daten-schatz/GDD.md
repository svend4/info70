# 🗝️ Daten-Schatz — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле:
> по `app.mjs`, `daten/szenarien.json`, `eltern.html`, README и тестам, плюс замеры в браузере при 360 px
> (`tools/browser-pruefung.mjs`, `tools/browser-tor.mjs` и одноразовый скрипт вне репозитория — в репо его
> нет). Чего здесь не проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные
> этим документом не менялись.

## 1. Феномен / потребность (Warum)
Тематика — защита данных ребёнка и «Kostenfallen» в быту: приложения и сайты просят геолокацию, фото, имя и
адрес, уведомления, cookies, платёжные данные; игры давят акциями и фантазийной валютой. По README (Z.10–16)
идея выросла из двух сигналов: BzKJ 2026 приоритетно поддерживает «sichere Voreinstellungen», а
«Datenschutz» — формальный критерий каталога fragFINN (источник — docs/05, здесь не перепроверено). Банк рос
по шагам (git, docs/04, docs/09): 12 базовых ситуаций → +6 Kostenfallen (идея №11, Welle 6) → +6 «Wer bist du
wirklich?» (каталог №234, Welle 34) → +6 Familien-Pack (каталог №225, Welle 37) = 30. Предпосылка дидактики
(README Z.18–25): ребёнок должен взвешивать, а не заучивать «всегда нет».

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Belege:
- README.md Z.3 «для 8–12 лет»; `daten/szenarien.json` Z.3 `"zielgruppe": "8-12"`; `app.mjs` Z.1 «(8-12 Jahre)»;
  GDD smarte-ohren: «daten-schatz (8-12, komplexer)».
- Обращение «du» и детский язык (`app.mjs` Z.31: «Deine Daten sind ein Schatz. Bewache sie!»); Hilfe-Insel
  116 111 (тест hilfe-insel-abdeckung требует её только у детских приложений и называет эту); приложения нет
  ни в `docs/erwachsenen-apps.json`, ни в `docs/kinder-apps-mit-eingabe.json`; полей ввода нет.
- Хаб `index.html`: раздел «Sicher im Netz (Kinder 8–12)».
- Родители: только страница `eltern.html` («Ihr Kind», «So begleiten Sie Ihr Kind»). Режима для двоих,
  второго экрана или хода взрослого в коде нет → Ko-Nutzung не предусмотрена. По решению Max 34а README и этот
  GDD называют детей пользователями → Kinder-App, Wertungsregel (docs/02 Z. 141–146) действует.

Соседи: `daten-schatz-mini` (6–8), `familien-datenschatz` (Eltern+Kind, дуэт), `daten-radiergummi`,
`formular-falle`, `spuren-lupe`.

Одно предложение: «Ребёнок «охраняет свой Datenschatz»: в 10 бытовых ситуациях из 30 решает — erlauben,
ablehnen или erst Erwachsene fragen — и после каждого ответа читает объяснение, без очков и оценки; правило
«смотри, ЧТО просят и КТО просит» (s10) он получает лишь в раундах, где выпала s10, — примерно в каждом
третьем (п. 10)».

## 3. Движок и петля (Wie)
Движок: собственный мини-сценарный ход в `app.mjs` (109 строк); `quiz-kern` не используется, `logik.mjs` нет —
решение «beste / auchOk / Falle» стоит прямо в `antworte()` (Z.73–77). Схема «szenario» с тремя фиксированными
ответами (docs/05: общий Szenario-Kern пока не выделен, «правило двух»).
Основная петля: старт («▶️ Wache übernehmen», «🔊 Vorlesen», «🆘 Ich brauche Hilfe») → 10 × [«Situation n von
10» и полоса прогресса → ситуация и три кнопки «✅ Okay, erlauben» / «🚫 Nein danke!» / «🧑‍🦱 Erst Erwachsene
fragen» → Rückmeldung: заголовок «Starke Entscheidung!» / «Auch okay!» / «Vorsicht, Falle!», объяснение,
«Beste Antwort: …»] → «Ende der Runde» («Du hast 10 Situationen angeschaut. …», «Noch einmal», «Zum Start»).
Реиграбельность: каждый раунд — новая случайная выборка 10 из 30 (`mischen` + `slice`, Z.54), порядок кнопок
всегда один; повторы между раундами возможны (п. 10). Раунд прогнан целиком (10 ситуаций, Playwright) без
исключений.

## 4. Lernziele (проверяемые!)
Из README (Z.27–33), с привязкой к данным:
1. Ребёнок объясняет принцип минимума данных на примере: «нужно ли это приложению для его задачи?» (s01
   Mal-Spiel/Standort, s04 Quiz/alle Fotos, s11 Taschenlampe/Kontakte).
2. Ребёнок узнаёт дата-ловушки: приз за адрес (s03), «тест» с днём рождения и школой (s09).
3. Ребёнок называет псевдоним вместо настоящего имени для игр и Bestenliste (s07).
4. Ребёнок знает: cookies (s08) и уведомления (s05) можно отклонить, геолокация — «только во время
   использования» (s06).
5. Ребёнок называет случаи, когда правильный ответ — позвать взрослого (в данных 10 из 30: s02, s06, s14,
   s17, s21, s23, s25, s26, s27, s30).

В данных есть цели, которых нет в README: пересчитать «Juwelen» в евро и «pro Woche» на год (s15, s17); не
делиться паролем, узнать поддельную страницу входа, при взломе позвать взрослого (s18–s24); приватность
действует и перед родителями — Ortung, Fotos (s25, s26, s30).
Как проверяется: 8 тестов проверяют структуру данных, баланс ответов, отсутствие оценки и правило Speicher, но
не усвоение. Усвоение проверяет только Kindertest (п. 9, задание «объяснить своими словами»). Покрытие целей
раундом не гарантировано: раунд тянет 10 из 30 без стратификации, каждая ситуация выпадает в 1/3 раундов (п. 10).

## 5. Контент-план
Единица контента: сценарий. Схема `daten/szenarien.json` (version 1, `"zielgruppe": "8-12"`):
`id, situation, beste (geben|ablehnen|fragen), auchOk[], erklaerung`; полей очков и рангов нет (тест: в данных
нет `raenge`). MVP — банк из 30 сценариев в четырёх блоках (границы по git):

| Блок | id | Содержание | beste |
|---|---|---|---|
| Datenschutz | s01–s12 | Berechtigungen (Standort, Kamera, Fotos, Kontakte, Benachrichtigungen), Gewinnspiel, Cookies, Spitzname, Klassencode | ablehnen 9, fragen 2, geben 1 |
| Kostenfallen | s13–s18 | Lootbox, «Gratis testen», Juwelen, Countdown, «pro Woche», fremdes Spiel-Passwort | ablehnen 4, fragen 2 |
| Account («Wer bist du wirklich?») | s19–s24 | Fake-Login, Passwort-Anfrage, fremdes Profil, Panik-Nachricht, Kontoübernahme, Passwort-App | ablehnen 4, fragen 2 |
| Familie / Privatsphäre | s25–s30 | Smart Speaker, Ortung durch Eltern, Verwandte, Sprachassistent, Foto-App, Eltern posten Fotos | fragen 4, ablehnen 2 |

Итого beste: ablehnen 19, fragen 10, geben 1 (s10); `auchOk` пуст у 9 из 30 (s02, s03, s09, s11, s18, s21,
s23, s26, s30).
Инварианты в тестах: ≥ 30 сценариев, уникальные `id`, `beste` ∉ `auchOk`, `situation` ≥ 20 и `erklaerung` ≥ 30
знаков; каждый из трёх кодов хотя бы раз «beste» (анти-шаблон, docs/05 метод 2); ≥ 5 Kostenfallen (Lootbox,
Abo); Smart Speaker, Ortung (beste = fragen), «Artikel 16», Phishing, Passwort, Identitätsdiebstahl.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде/замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `index.html`, `eltern.html`, `daten/*.json` нет `http(s)://`,
  `<img>`, `<iframe>` и чужих скриптов; страницы подключают только файлы репо: свой `app.mjs`, общие `kinder.css`
  и `favicon.svg` (ссылка в `<head>` обеих страниц, решение Max 21а). Покупки и Abo — только содержание (s13–s18).
- [x] **Без аккаунтов и ввода:** нет `<input>`, `<form>`, `<textarea>`; взаимодействие — только кнопки.
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`
  в `index.html` и `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.11); единственный `fetch` —
  относительный `daten/szenarien.json` (Z.17). Замер: за раунд из 10 ситуаций ни одного запроса не к своему
  origin; `browser-pruefung`: `fremdeHosts` 0.
- [x] **Speicher:** приложение ничего не пишет (`setItem` нет; после раунда localStorage, sessionStorage и
  cookies пусты — замер). Löschknopf: нет — так и положено (решение 30б; `docs/speicher-stand.json` пуст, тест
  speicher-regel зелёный). Старый ключ `ds.rekord` удаляется одной строкой при запуске (`app.mjs` Z.14; в
  браузере проверено). Читается только `ui.anzeige` (Kontrast/Schrift, `boot` из kinder-ui); пишет его не эта
  app.
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker` (решение 9б; тест kein-service-worker
  зелёный). Neuladen без сети не удаётся (замер) — после 9б Offline-Neuladen не гарантируется.
- [x] **Vorlesen:** «🔊 Vorlesen» на старте, в ситуации, в Rückmeldung и в конце (`app.mjs` Z.46, 67, 85, 103),
  `vorlesen()` из kinder-ui (локальный голос, если есть). Читается «заголовок + объяснение», строка «Beste
  Antwort: …» — нет.
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`app.mjs` Z.35).
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`app.mjs` Z.36, `eltern.html` Z.37); тест impressum-link
  зелёный. Сама страница — шаблон с заглушками (п. 10).
- [x] **Hilfe-Insel (116 111):** `hilfeInselKnopf` на старте (`app.mjs` Z.49–50); приложение в списке
  обязательных у теста hilfe-insel-abdeckung.
- [ ] **Druck:** нет — ни `druck.css`, ни кнопки печати, ни `window.print` (grep «print|druck» пуст). Печать
  экрана из браузера: Fuß скрыт общим `kinder.css` (`@media print`), остальное (карточки с кнопками) печатается
  как есть; в базовой линии `docs/browser-basislinie.json` для приложения «druck» = 5 (Emoji), замер повторён:
  5.
- [x] **Keine Wertung des Kindes — только Wortliste (docs/02 Z. 141–146):** в коде и данных нет Punkte, Rekord,
  Rang, Serie, Stern, Pokal, «richtig von», «geschafft» (тест «Kinder werden nicht bewertet»; конец называется
  «Ende der Runde»). `node tools/leistungs-woerter.mjs daten-schatz` → 3 Zeilen im Bericht, ни одна не оценка:
  `rekord` в `app.mjs` Z.14 — строка Migration; `Bestenliste` в s07 — содержание (Spitzname вместо имени); `0 %`
  в s16 — выдуманная скидка «70 %». В `docs/bewertung-stand.json` приложения нет ни в `apps`, ни в `ausnahmen`:
  исключение не нужно и не заведено. Проверены слова, не правило целиком — оно в следующем пункте.
- [ ] **Keine Wertung des Kindes — Regel als Ganzes, teilweise offen:** Rückmeldung je Antwort в три цвета
  (зелёный / жёлтый / красный) — подпадает ли под «Ни светофора» (docs/02 Z. 141–146), не решено (п. 10); пока
  решения нет, пункт не отмечен.
- [x] **Mobile First (замер, только Startbildschirm, 360 px):** нет переполнения, 5 целей касания, ни одной
  меньше 48 px, ошибок консоли нет; Delta-Tor `tools/browser-tor.mjs daten-schatz`: 0 Erhöhungen. Клики не
  измерены — у кнопок нет `data-kennung`.

Особые риски темы: s21/s23 (кража личности, взлом аккаунта) и s25/s26/s30 (контроль и фото со стороны
родителей) могут тревожить или вносить напряжение в семью. В коде: ничего не вводится и не запрашивается; для
s21/s23 лучший ответ «Erst Erwachsene fragen», в s21 стоит «Es ist nicht deine Schuld.», в s26 — «Redet
gemeinsam»; Hilfe-Insel на старте. Утверждения о праве и деньгах в текстах сценариев и в абзаце Sharenting
(`eltern.html`) без источника — п. 10.
Повторить проверки: `node --test apps/daten-schatz/test/*.test.mjs`, `node tools/leistungs-woerter.mjs
daten-schatz`, `node tools/browser-tor.mjs daten-schatz`.

## 7. Стандарты и финансирование (Wofür)
Стандарты (по README, docs/11, Impressum; юридически и по срокам не перепроверены — «(offen)»): UN-KRK Art. 16
(Privatsphäre) — в s26 и s30 в тексте стоит «Artikel 16», docs/11 относит приложение к Art. 16; DSGVO — по
Impressum (раздел «Kinder») персональные данные не обрабатываются; критерий fragFINN «Datenschutz» и приоритет
BzKJ 2026 «sichere Voreinstellungen» (README Z.10–16, docs/05). Феномены Gefährdungsatlas: Kostenfallen/
Lootboxen и Identitätsdiebstahl (docs/06). Förder-Fit: BzKJ «Kindgerechte digitale Angebote» 2027, пакет
«Demokratie & KI» вместе с feed-forscher (docs/04; сроки и доля софинансирования — там же, здесь не
перепроверены). Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: S (`app.mjs` 109 строк, `szenarien.json` 216 строк, 8 тестов; основная работа — тексты и баланс
сценариев). Переиспользует: `kinder-ui` (`el`, `vorlesen`, `mischen`, `boot` Anzeige, `hilfeInsel`),
`kinderschutz` (`installiereNetzwerkWaechter`); `quiz-kern` — нет, `logik.mjs` — нет. Первый срез (playable)
уже работает: полный раунд из 10 ситуаций с озвучиванием и без оценки.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет (протокол — docs/05, метод 5); это гипотезы, результатов нет:
1. Понимают ли дети ситуации и слова (Lootbox, Abo, Phishing, Identitätsdiebstahl, Sprachassistent, Ortung)
   без помощи взрослого? Какие слова приходится объяснять, помогает ли «Vorlesen»?
2. «Erst Erwachsene fragen» — осознанный выбор или «безопасная кнопка» (в 26 из 30 ситуаций она «beste» или
   «auch okay»)? Могут ли дети после раунда назвать, когда решают сами (s10 Klassencode, s06 Karten-App; каждая
   есть лишь в 1/3 раундов, п. 10 — для теста играть несколько раундов)?
3. Как читается красная рамка «Vorsicht, Falle!» — как подсказка или как упрёк? В четырёх ситуациях (s03, s09,
   s11, s18) так помечен и ответ «Erst Erwachsene fragen»: отбивает ли это охоту спрашивать? Бросают ли играть
   после нескольких красных экранов подряд?
4. Семейные ситуации (s25–s27, s30): начинается ли разговор с родителями? Не звучит ли s26 («Eltern möchten
   Ortung») как «против родителей»? Понятно ли «Artikel 16» без пояснения?
5. Kostenfallen: пересчитывают ли дети «1150 Juwelen» в евро (s15) и «2,99 € pro Woche» на год (s17) сами —
   или только повторяют объяснение?
6. Замечают ли они повторяющиеся ситуации во втором раунде (в среднем 3 из 10) и мешает ли это?
7. Слышат ли дети с «Vorlesen» то, что нужно: читается «заголовок + объяснение», «Beste Antwort» — нет.

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Text)**
- README ↔ данные: README описывает только Datenschutz-ядро (Lernziele 1–5, «Откуда идея»), в коде — 30
  сценариев в четырёх блоках; Kostenfallen (s13–s18), Account (s19–s24) и Familie (s25–s30) в README не
  названы, хотя стартовый экран говорит «… und dein Geld». Число 30 в README верно.
- Fuß ↔ Startkarte: Fuß каждого экрана (`app.mjs` Z.34) пишет «Daten bleiben auf diesem Gerät», Startkarte
  (Z.48) и `eltern.html` (Z.22) — «Es wird nichts gespeichert». Неложно, но читается как «данные есть».
- Endtext ↔ Code: «Mit „Noch einmal“ kommen neue Situationen» (Z.97), а `starteRunde` (Z.54) тянет 10 из всех
  30 заново, не исключая сыгранные: в среднем 3,3 из 10 повторяются, раунд целиком из новых — 0,6 % (расчёт).
- Анти-шаблон-тест ↔ данные: тест требует лишь «хотя бы раз beste» (README Z.23–25 обосновывает им отказ от
  «всегда отказывай»); на деле ablehnen 19 / fragen 10 / geben 1 (s10). «Immer fragen» даёт beste или auch okay
  в 26 из 30 ситуаций, «immer ablehnen» — в 23 из 30.
- Внутри данных: s02 (камера и микрофон нужны для звонка бабушке) — «erlauben» = «Vorsicht, Falle!», а s06
  (геолокация нужна для карты) — «erlauben» = «Auch okay!». В s03, s09, s11, s18 ответ «Erst Erwachsene fragen»
  тоже «Falle», хотя Lernziel 5 и `eltern.html` (Z.28) учат спрашивать.
- Каталог ↔ Pack: каталог №225 описывает «Eltern und Kind nacheinander durchspielen» (Eltern+Kind 8–12); в
  daten-schatz это 6 сценариев для одного ребёнка (s25–s30), дуэт — отдельное приложение `familien-datenschatz`.
- Altersangabe: расхождений нет (README, JSON, Code, хаб, соседний GDD — везде 8–12).

**Offene Fragen (für Max)**
- Rückmeldung je Antwort: три заголовка и три цвета (`k-hinweis--richtig` зелёный, по умолчанию жёлтый,
  `k-hinweis--falsch` красный; `kinder.css` Z.105–112). Lauf C (git 96a1f89) убрал в этом приложении Punkte,
  Rekord и 💎, а эту обратную связь оставил; в списке слов 37в её нет. Подпадает ли она под «Ни светофора»
  (docs/02 Z. 141–146), нигде явно не решено. «erlauben» даёт красный экран в 28 из 30 ситуаций; s06 жёлтый,
  s10 зелёный. Замер (Playwright, 360 px, 40 раундов по 10 × «erlauben»): десять красных экранов — в 15 раундах,
  девять — в 21, восемь — в 4. Десять красных бывает только в раундах без s06 и s10: расчётно 380/870 = 44 %.
- Покрытие целей раундом: `starteRunde` (`app.mjs` Z.54) тянет 10 из 30 без стратификации, поэтому каждая
  ситуация попадает в раунд в 1/3 случаев (расчёт). Правило «ЧТО просят и КТО просит» (s10) и Lernziel 3
  (псевдоним, s07) встречаются лишь в каждом третьем раунде, оба в одном раунде — около 10 %; Lernziel 4 целиком
  (s05, s06, s08) — около 3 %. Lernziel 5 (позвать взрослого) почти всегда: хотя бы одна из 10 ситуаций «fragen»
  есть в 99 % раундов. Нужна ли гарантия (обязательные ситуации по целям) или достаточно формулировки «за
  несколько раундов» — решение Max.
- Fakten в текстах сценариев и в `eltern.html` без источника и без пометки «(Eigenentwurf, fachlich nicht
  geprüft)»: s08 («… er muss da sein»), s26 и s30 («Artikel 16» без названия закона; «Recht am eigenen Bild»),
  s13 («… wie ein Glücksspielautomat»), s14 («Zahlungsdaten gibst du nie selbst ein»), s16 («… kommt fast immer
  wieder»), s17 («ein ganzes Fahrrad»). Сюда же абзац «📸 Übrigens: Sharenting» в `eltern.html` (Z.34–35):
  «Recht am eigenen Bild», «Der Gefährdungsatlas der BzKJ führt „Sharenting“ als eigenes Risiko-Phänomen» и
  Faustregeln («das Kind vorher fragen», «nichts Peinliches oder in Badekleidung», «Gesicht und Schule möglichst
  nicht erkennbar», «im Zweifel privat statt öffentlich teilen») — ни источника, ни пометки. В репо у абзаца есть
  лишь внутренний след: docs/05 (идея №12) и docs/06 (таблица Gefährdungsatlas, строка Sharenting), здесь не
  перепроверены; сверка с самим Gefährdungsatlas — offen. Тот же текст дословно стоит в `eltern.html`
  feed-forscher (Z.38–39), где GDD уже ведёт его в п. 10.
- Арифметика текстов пересчитана: s15 («über 11 echte Euro») — 1150 × 0,99 € / 100 = 11,39 € при пропорциональной
  цене, при пакетах по 100 нужно 12 пакетов = 11,88 €; в обоих случаях «über 11 €», но сценарий не говорит, как
  считать. s17 («über 150 € im Jahr») — 2,99 € × 52 = 155,48 €.
- Счётчик внешних фактов видит одну строку (`daten/szenarien.json` Z.112, s16: «70 %» — выдуманная скидка в
  игре) и ни одной правовой; абзац Sharenting в `eltern.html` он не видит. Tor 6 (docs/plan-neue-welle.md,
  Abschnitt 3) требует для новых приложений источник или пометку. Fachprüfung (Recht, Geld) — offen.
- Vorlesen и «keine fremden Server»: без локального голоса (`localService`) браузер выбирает голос сам и он
  может быть сетевым (комментарий в `komponenten.mjs`); `installiereNetzwerkWaechter` перехватывает только
  fetch/XHR/WebSocket, CSP — загрузку ресурсов. Формулировка «technisch erzwungen» (`eltern.html` Z.21,
  Impressum) относится к ним, не к Sprachausgabe. Нужна ли оговорка — offen.
- Impressum: страница, на которую ведёт ссылка в Fuß, сама называет себя «Noch nicht veröffentlichungsreif»
  (поля Betreiber — заглушки). Касается всех приложений.
- Browser: Fokus nach Klick и Klickfehler для этой app никогда не измерялись (нет `data-kennung`,
  в базовой линии `ohneKennung` 1); Tor 3 (docs/plan-neue-welle.md, Abschnitt 3) требует это для новых
  приложений.
- Тесты не покрывают `antworte()` и выбор раунда (нет `logik.mjs`): 8 тестов — о данных, отсутствии оценки и
  правиле Speicher.
