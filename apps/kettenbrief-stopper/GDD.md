# 🛑 Kettenbrief-Stopper — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле: по
> `README.md`, `index.html`, `eltern.html`, `app.mjs`, `nachrichten.mjs`, `sim.mjs`, `daten/sprachen.json` и `test/`,
> плюс прогоны в браузере при 360 px (Playwright). Одноразовые скрипты и расчёт Monte-Carlo лежат вне репозитория,
> в нём их нет. Чего здесь не проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные
> этим документом не менялись. Исправлено 28.10.2026 после независимой проверки: числа расчёта в п. 3 пересчитаны и сверены
> с прогонами в браузере, учтён коммит aaa39a8 (общий favicon), в п. 10 добавлены Speicheraussage docs/05 и Sharenting-Block.

## 1. Феномен / потребность (Warum)
Тематика — цепные сообщения («Schick das weiter, sonst …»), челленджи с групповым давлением и слухи в детских
чатах. Источник идеи — docs/05 (идея №2, Z.29): Kettenbriefe как источник детских страхов, тематика «Nummer gegen
Kummer», механика графа из feed-forscher. docs/06 (Z.52) ведёт «Kettenbriefe» как феномен Gefährdungsatlas BzKJ и
закрывает его этим приложением (Quelle: docs/05, docs/06; сам Atlas в репозитории не лежит, не перепроверен — offen).
Без такого приложения ребёнок знает только страх («а вдруг правда?») и не видит механизма: сообщение уходит дальше
не одним щелчком, а волной по классу, и один «Stopp» эту волну режет. Здесь механизм виден: сообщение «заражает»
класс из 24 детей раунд за раундом, ребёнок сам оказывается в цепи и в конце видит на цифрах, что изменило его решение.
Развитие (git): 4-я итерация — MVP только с Kettenbrief → Welle 45 Mutprobe → Welle 46 Gerücht с Quellen-Hinweis →
Welle 48 Kontrast/Schrift → Welle 50 mini-i18n (de/en) → Welle 51 Leichte Sprache `de-ls` → Lauf B 27.10.2026:
Löschknopf для выбора языка (решение 30б).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Belege:
- `README.md` Z.3 «для 8–12 лет»; `app.mjs` Z.1 «(8-12 Jahre)»; Hub `index.html` Z.18: раздел «Sicher im Netz
  (Kinder 8–12)», ссылка на приложение Z.46; docs/09 Z.287 и Z.288 (Katalogtext): «8-12».
- Обращение «du» во всех текстах (`daten/sprachen.json`: «Du kannst sie stoppen!», «Dein Herz klopft.»); полей ввода
  нет; приложения нет ни в `docs/erwachsenen-apps.json`, ни в `docs/kinder-apps-mit-eingabe.json`; тест
  hilfe-insel-abdeckung требует Hilfe-Insel именно у него как у детского приложения.
- Родители: только страница `eltern.html` («Ihr Kind», «So begleiten Sie Ihr Kind»). Режима для двоих и хода взрослого
  в коде нет → Ko-Nutzung не предусмотрена. По решению Max 34а README и этот GDD называют детей пользователями →
  Kinder-App: действуют Vorlesen (28а) и правило «ребёнок не оценивается» (docs/02 Z. 141–146).

Одно предложение: «Ребёнок наблюдает, как цепное сообщение, челлендж или слух за несколько раундов доходят до 24 детей
класса; когда оно приходит к нему самому, он решает — переслать, остановить (в Mutprobe и Gerücht ещё: сообщить
взрослому / сначала проверить), — и в конце видит на цифрах, сколько детей его решение уберегло; уходит с правилом
«страх + спешка = Kettenbrief: не пересылаю, говорю друзьям и взрослым; если страшно — 116 111»».

## 3. Движок и петля (Wie)
Движок: собственный симулятор распространения; `quiz-kern` не используется. Три слоя: `sim.mjs` (чистая логика без
DOM: класс из 24 детей, у каждого 2 фиксированные цели пересылки, раунды по графу; Stopper не пересылают; «gewarnte»
= иммунные), `nachrichten.mjs` (структура трёх типов без текста) и `app.mjs` (экраны и текст из `daten/sprachen.json`).
Основная петля: старт → выбор языка («Deutsch», «English», «🟦 Leichte Sprache»), три карточки типа (текст сообщения,
«▶️ …-Experiment starten», «🔊 Vorlesen»), карточка «Meine Daten löschen», «🆘 Ich brauche Hilfe» → решётка 6×4 из
24 лиц (🙂 не получил, 😨 получил, 🛡️ предупреждён; клетка игрока — 🙋 до получения сообщения, с синим контуром; «Das
bist du» стоит только в `aria-label` на div и на экране не видно, `app.mjs` Z.99–102) и строка «Runde n · 😨 k von 24 Kindern
erschreckt» → «⏩ Nächste Runde» (раунды листаются кнопкой, без
автоанимации: в коде нет таймеров) → в первом же раунде сообщение приходит к игроку («Die Nachricht hat DICH erreicht!
📱»: игрок всегда первая цель «нулевого пациента», `sim.mjs` Z.22) →
выбор: Kettenbrief — «weiterleiten» / «STOPP»; Mutprobe и Gerücht — ещё «melden» (Gerücht показывает над кнопками
рамку «Erst die Quelle prüfen: Wer sagt das? Woher …?») → дальше раунды до конца волны → финал: 🦸 (Stopp) / 📣 (Melden)
/ эмодзи типа (weitergeleitet), фраза о результате, решётка, четыре Lernpunkte, «🔊 Vorlesen», «🔁 Noch ein Experiment»,
«🏠 Zum Start». Прогнаны в браузере все три типа со всеми решениями (weiter, Stopp и, где оно есть, melden). Число нажатий
«Nächste Runde» на эксперимент зависит от случайного класса: обычно ≈ 5–10 (по расчёту ниже — 98,5 % прогонов без Stopp и
85 % со Stopp; в диапазон 6–8 попадают только 84 % и 57 %).
Примеры финала: «Dein Stopp hat gewirkt: 14 statt 17 Kinder erreicht – du hast 3 Kinder geschützt!» и «Alle haben
mitgemacht: 20 von 24 Kindern erreicht. Probiere aus, was dein Stopp verändert!».
В модели «melden» действует так же, как «Stopp» (одна функция `stoppeAusbreitung`, `app.mjs` Z.166–172, вызов Z.178 и
Z.181): иммунными становятся две цели игрока и ещё один ребёнок, пока не получавший сообщения (с наименьшим номером).
Различаются текст, эмодзи и похвала («📣 Stark: Du hast es einer erwachsenen Person … gemeldet»). «Erst prüfen» в Gerücht —
это и есть его «Stopp»: результата проверки в игре нет.
Реиграбельность: каждый эксперимент строит новый случайный класс (`Math.random`), числа каждый раз другие.
Размах эффекта (Quelle: eigene Rechnung, nicht im Repo, скрипта в репозитории нет; воспроизводится так: на каждый прогон
новый класс `erstelleKlasse()`, ход как в `naechsteRunde` и `stoppeAusbreitung` (`app.mjs` Z.141–172) с настоящим `sim.mjs`,
«geschützt» = `max(0, alleLeitenWeiter − erhalten)` как в `endBildschirm` (Z.196–198); по 1 000 000 прогонов на вариант
«weiterleiten» и «Stopp»; число нажатий и числа финала совпали в 20 прогонах в браузере при подставленном `Math.random`):
без Stopp сообщение получают в среднем 19,8 из 24 (медиана 20; в 93 % прогонов от 16 до 23; крайние значения 3 и 24),
со Stopp 14,2 (медиана 15; в 95 % прогонов от 4 до 20; крайние 3 и 23); «geschützt» в среднем 5,6 (медиана 4), от 0 до 21;
примерно в каждом седьмом прогоне не больше 2 (13,7 %), примерно в одном из 1000 ровно 0 (текст при этом всё равно
говорит «hat gewirkt»). Нажатий «Nächste Runde» в среднем 7,2 без Stopp и 7,5 со Stopp; со Stopp в 8 % прогонов не больше 4.

## 4. Lernziele (проверяемые!)
По README (Z.47–50) и по четырём Lernpunkte на тип в `daten/sprachen.json`:
1. Ребёнок называет два приёма цепного сообщения — страх и давление времени («noch HEUTE», «sonst …») — и узнаёт их
   в новом примере.
2. Ребёнок объясняет своими словами: «Es passiert NICHTS, wenn du nicht weiterleitest» («Pech kann man nicht verschicken»).
3. Ребёнок называет правильное действие — löschen и Bescheid sagen — и по числам финала объясняет, почему это защищает
   других.
4. Ребёнок знает, куда идти, если страшно: взрослый или Nummer gegen Kummer 116 111 (последний Lernpunkt каждого типа,
   Hilfe-Insel).
5. Mutprobe: ребёнок узнаёт групповое давление («Alle machen mit» — часто неправда), знает, что «Nein» — сильное решение
   и что «Melden ist kein Petzen».
6. Gerücht: ребёнок задаёт три вопроса — Wer? Woher? Beweis? — и не передаёт непроверенное («Alle sagen» не доказательство).
Как проверяется: 19 тестов проверяют структуру, одинаковые ключи и плейсхолдеры в `de`, `en`, `de-ls`, не меньше трёх
Lernpunkte на тип, 116 111 в каждой языковой версии и модель распространения, но не усвоение. Усвоение проверяет только
Kindertest (п. 9, задание «объясни своими словами»).

## 5. Контент-план
Единица контента: тип сообщения × языковая версия. `nachrichten.mjs` держит только структуру (`id, emoji, hatMelden,
hatQuellen`); тексты — три каталога `de`, `en`, `de-ls` по 46 одинаковых ключей в `daten/sprachen.json` (22 общих ключа
интерфейса + на тип: titel, intro, nachricht, frage, weiter, stopp, [melden], [quellenHinweis], lernpunkte[4]).

| Тип | id | Решения | Особенность |
|---|---|---|---|
| Kettenbrief ⛓️ | `kettenbrief` | weiterleiten / STOPP | страх + «noch HEUTE», «10 Jahre Pech» |
| Mutprobe / Challenge 🔥 | `mutprobe` | Mitmachen / Nein danke / melden | Gruppendruck: «Feigling», «raus aus der Gruppe» |
| Gerücht / Verschwörung 🗣️ | `geruecht` | weitersagen / Erst prüfen / Erwachsene fragen | рамка Quellen-Hinweis, «alle reden schon davon» |

Тексты примеров мягкие: без насилия и ужасов (`eltern.html` Z.23), никто не назван по имени, конкретной опасной
«Challenge» нет. Схема данных и инварианты проверяются тестами: у `kettenbrief` нет `melden`/`quellenHinweis`, у
`mutprobe` есть `melden`, у `geruecht` оба; в каждой версии ≥ 3 Lernpunkte; плейсхолдеры `{n}`, `{gesamt}`, `{runde}`,
`{alle}`, `{gerettet}`, `{aktion}`, `{titel}` совпадают во всех трёх версиях.
Дидактический анти-шаблон здесь другой, чем в квизах: «правильного ответа» в данных нет, зато правильные решения
(«Stopp», «melden») помечены зелёным классом `k-knopf--richtig` (`app.mjs` Z.178, Z.181), а «weiterleiten» — обычной
синей кнопкой; порядок кнопок всегда один (п. 9, п. 10). Новый язык = новый каталог с тем же набором ключей.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде или замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `nachrichten.mjs`, `sim.mjs`, `index.html`, `eltern.html`,
  `daten/sprachen.json` нет `http(s)://`, `<img>`, `<iframe>`, чужих скриптов; подключены только свой `app.mjs`, общий
  `kinder.css` и общий `favicon.svg` (`packages/kinder-ui/img/favicon.svg`, тот же источник; `index.html` Z.9, `eltern.html`
  Z.8; добавлен коммитом aaa39a8, решение 21а, после первой версии этого GDD; «0 Fremdanfragen» остаётся верным);
  `eltern.html` Z.20: «Keine Werbung, keine Käufe, keine Anmeldung».
- [x] **Без аккаунтов и ввода:** нет `<input>`, `<form>`, `<textarea>`, только кнопки; 24 лица в решётке анонимны.
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` в
  `index.html` и `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.18); единственный `fetch` —
  относительный `daten/sprachen.json` (Z.22). Замер (старт, три типа, смена языка, Hilfe-Insel): ни одного запроса к
  чужому хосту; `browser-pruefung`: `fremdeHosts` 0, ошибок консоли нет.
- [x] **Speicher:** пишется один ключ `ks.sprache` (`SPRACH_SCHLUESSEL`, `app.mjs` Z.24), и только когда ребёнок меняет
  язык или включает «Leichte Sprache» (`sprache.setze()` из kinder-ui). В браузере: на старте localStorage пуст; после
  English → `en`, после Deutsch → `de`, после Leichte Sprache → `de-ls`; sessionStorage и cookies пусты. `setItem` в коде
  приложения нет (тест speicher). **Löschknopf: да** — «Meine Daten löschen» на стартовом экране (`datenKarte()` Z.73–89,
  `loescheDaten(SPRACH_SCHLUESSEL)` Z.82): после нажатия localStorage пуст, появляется «Gelöscht. …»; текущая сессия
  остаётся на выбранном языке до перезагрузки. Тест speicher-regel зелёный, `docs/speicher-stand.json` пуст. Читается
  ещё `ui.anzeige` (Kontrast/Schrift через `bootAnzeige()`, Z.19); пишет его не это приложение.
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker` и ссылки на manifest (grep); тест
  kein-service-worker зелёный (решение Max 9б).
- [x] **Vorlesen:** «🔊 Vorlesen» на старте у каждого типа (intro + сообщение, Z.119), на экране решения (сообщение +
  вопрос, Z.191), в финале (четыре Lernpunkte, Z.211) и в Hilfe-Insel; `vorlesen()` из kinder-ui берёт локальный голос
  устройства, если он есть; для English язык `en-GB`, иначе `de-DE` (`stimme()`, Z.126). Не читаются кнопки решения,
  рамка Quellen-Hinweis, строка «Runde n …» и фраза о результате (п. 10).
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`app.mjs` Z.52).
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`app.mjs` Z.53, `eltern.html` Z.38); тест impressum-link
  зелёный. Сама страница — шаблон с заглушками (п. 10).
- [x] **Hilfe-Insel (116 111):** `hilfeInselKnopf` на старте (`app.mjs` Z.122–123); экран открывается, показывает
  116 111 и Elterntelefon, возвращает на старт; приложение стоит в списке обязательных у теста hilfe-insel-abdeckung.
- [ ] **Druck:** не предусмотрен — нет `druck.css`, нет кнопки печати и `window.print` (grep «print|druck» в коде пуст).
  Печать из браузера: общий `kinder.css` скрывает только `.k-fuss` (`@media print`), остальной экран печатается как
  есть; Basislinie `druck` = 13 (Emoji и знаки в видимом тексте печатной версии; инструмент видит только стартовый экран, у
  кнопок нет `data-kennung`), замер повторён: 0 Erhöhungen.
  Требование docs/02 Z. 79–82 привязано к кнопке печати, её здесь нет.
- [x] **Keine Wertung des Kindes — Wortliste und Stand (docs/02 Z. 141–146):** `node tools/leistungs-woerter.mjs
  kettenbrief-stopper` → «keine Treffer» (проверяются `index.html`, все `.mjs`, `daten/*.json`); в `docs/bewertung-stand.json`
  приложения нет ни в `apps`, ни в `ausnahmen`, `node tools/bewertung-stand.mjs` → «Stand stimmt». Нет Punkte, Rekord, Rang,
  Serie, Prozent, Stern, Pokal, «richtig von», «geschafft» (в смысле списка слов).
- [ ] **Keine Wertung des Kindes — Endtext (docs/02 Z. 141–146):** не решено. Числа финала («N statt M Kinder erreicht – du
  hast K Kinder geschützt», при «weiterleiten» «N von 24 Kindern erreicht») — результат модели, а не очки или процент, но они
  говорят о решении ребёнка, а список слов такое не ловит. Попадает ли это под правило (37в), решает Max (п. 10).
- [x] **Mobile First (замер, 360 px):** на пройденных экранах (старт, Simulation, Entscheidung, после Stopp, финал для
  трёх типов, `eltern.html`) нет горизонтального переполнения и нет целей касания меньше 48 px (13 целей на старте);
  Delta-Tor `tools/browser-tor.mjs`: 0 Erhöhungen. Клики и Fokus официальный инструмент не измеряет (нет `data-kennung`,
  Basislinie `ohneKennung` 1).
- [ ] **Offline:** нет (решение Max 9б); Neuladen ohne Netz не удаётся (замер `browser-pruefung`).

Особые риски темы: страшилки могут пугать, а 😨 на лицах одноклассников и слово «erschreckt» — вызывать чувство вины у
выбравшего «weiterleiten». В коде: примеры мягкие и обобщённые (никого не называют), финал при «weiterleiten» не упрекает
(«Alle haben mitgemacht … Probiere aus …»), «Melden ist kein Petzen», в финале каждого типа 116 111, на старте Hilfe-Insel.
Утверждения о праве, деньгах и здоровье: в `daten/sprachen.json` и в коде приложения их нет, кроме телефонов помощи с
пометкой «kostenlos» / «free» / «Das kostet nichts» (п. 10); на странице для родителей есть — блок «📸 Übrigens: Sharenting»
(`eltern.html` Z.34–37) с формулировкой «Recht am eigenen Bild» без Fundstelle и ссылкой на Gefährdungsatlas BzKJ (offen,
Fachprüfung; п. 10).
Повторить проверки: `node --test apps/kettenbrief-stopper/test/*.test.mjs`, `node tools/leistungs-woerter.mjs
kettenbrief-stopper`, `node tools/browser-tor.mjs kettenbrief-stopper`.

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из документов репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- Gefährdungsatlas BzKJ, феномен «Kettenbriefe» — Quelle: docs/06 Z.52 (сам Atlas вне репозитория).
- UN-KRK: docs/11 относит приложение к Art. 13/17 «Information, Medien- und Nachrichtenkompetenz» — Quelle: docs/11 Z.56.
- DSGVO (Quelle: `packages/kinder-ui/js/sprache.mjs` Z.5; юридически не проверено — offen): приложение не обрабатывает
  персональных данных, выбор языка kinder-ui не считает персональным.
- BFSG: Leichte Sprache `de-ls` (Quelle: README Z.32–36, docs/09 Z.28); Hoher Kontrast und Schriftgröße через `bootAnzeige()`
  (Quelle: docs/09 Z.34).
- Katalogtext (не проверен): Mutprobe → «JuSchG, JMStV, fragFINN», Gerücht → «DSA, JMStV, UN-KRK» — Quelle: docs/09 Z.287–288.
- Förder-Fit: BzKJ (для Gerücht — «Demokratiefähigkeit») — Quelle: docs/09 Z.287–288.
  Суммы, сроки и доли в GDD не приводятся (offen). Детали — GDD приложения foerder-navigator (Quelle: apps/foerder-navigator/GDD.md).
Соседи: spiral-stopper (тот же тип симулятора), daten-radiergummi (по docs/09 Z.192 строится на этом графе),
challenge-druck, stundenentwurf-kettenbrief, feed-forscher, nachrichten-detektive.

## 8. Аджайл-оценка
Aufwand: M (дни): `app.mjs` 216 строк, `sim.mjs` 68, `nachrichten.mjs` 37, `daten/sprachen.json` 191 строка (три
каталога по 46 ключей), 19 тестов в 4 файлах; основная работа — граф и три языковые версии. Переиспользует: `kinder-ui` (`el`,
`vorlesen`, `boot` Anzeige, `sprache`, `leichte-sprache`, `richtung`, `loescheDaten`, `hilfe-insel`), `kinderschutz`
(`installiereNetzwerkWaechter`); `quiz-kern` — нет. Первый срез (playable) уже работает: полный эксперимент для трёх
типов на трёх языках, без оценки. Тесты не покрывают поток в `app.mjs` (`naechsteRunde`, `stoppeAusbreitung`, текст
финала) — п. 10.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет (протокол — docs/05, метод 5); это гипотезы, результатов нет:
1. Понимают ли дети решётку без объяснений (🙂 😨 🛡️ 🙋, рамка вокруг своей клетки, число в строке «Runde n»)? Находят ли
   себя на ней?
2. Выбирают ли «Stopp» из понимания или потому, что кнопка зелёная, а «weiterleiten» синяя? Пробуют ли после «Probiere
   aus …» второй вариант и нажимают ли «Noch ein Experiment»?
3. Читают ли число «du hast K Kinder geschützt» как свой вклад или как очки? Разочаровывает ли малое K (по расчёту примерно
   каждый седьмой прогон — не больше 2)? Не теряют ли веру в «Stopp», видя в двух прогонах очень разные числа?
4. Могут ли после эксперимента своими словами назвать приёмы (Angst + Zeitdruck), сказать «Pech kann man nicht
   verschicken» и сказать, что сделают с настоящей цепочкой (löschen, Bescheid sagen, Erwachsene)?
5. Mutprobe: различают ли «Nein danke» и «melden» (в модели они одинаковы)? Понимают ли «Melden ist kein Petzen»?
6. Gerücht: замечают ли рамку Quellen-Hinweis, называют ли Wer? Woher? Beweis?; понятно ли 8–9-летним «Verschwörung» в
   заголовке `de`; хватает ли «Erst prüfen» без результата проверки?
7. Vorlesen: пользуются ли им дети, читающие с трудом; понимают ли варианты решения, которые не озвучиваются; находят ли
   «Leichte Sprache» и English?
8. Не пугает ли тема и 😨; нет ли чувства вины после «weiterleiten»; находят ли «🆘 Ich brauche Hilfe»?

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Text ↔ Tests)**
- README Z.24–27 «все тексты … в daten/sprachen.json» ↔ `app.mjs` Z.101: `aria-label` «Das bist du» зашит по-немецки (в
  English-версии остаётся немецким).
- README Z.17–19 «Quellen-Frage перед пересылкой» ↔ код: статичная рамка (`app.mjs` Z.187), шага-вопроса нет; «Erst
  prüfen» в модели равно «Stopp», результата проверки нет.
- README Z.19–20 и docs/09 Z.287: «melden» как третье решение ↔ модель: по числам «melden» и «Stopp» неразличимы
  (`app.mjs` Z.178 и Z.181 зовут одну `stoppeAusbreitung`), различаются текст, эмодзи 📣 и похвала.
- Текст `ende_alle` «Alle haben mitgemacht: N von 24» ↔ N < 24 (в прогонах 20 и 15 из 24): «alle» неточно.
- Тест `sim.test.mjs` «Stopp + Warnung reduziert …» проверяет `vergleiche().mitStopp`; в 20 000 сгенерированных
  классов эта величина всегда 0, потому что в `gewarnte` попадает ребёнок 0 («нулевой пациент»), и сообщение не начинается
  (Quelle: eigene Rechnung, nicht im Repo). UI эту величину не показывает и считает по-своему (иммунитет с момента решения,
  `app.mjs` Z.166–172). Тест зелёный по вырожденной причине; `naechsteRunde`, `stoppeAusbreitung` и тексты финала тестами не
  покрыты.
- README Z.63–66 «npm run dev», «npm test — юнит-тесты симуляции» ↔ у приложения нет `scripts` в `package.json`; из корня
  `npm test` — это `node --test` по всему репозиторию.
- Altersangaben: README, `app.mjs` Z.1 и Hub согласованы (8–12). Но тип «Gerücht / Verschwörung» (заголовок и Lernpunkt 2
  в `de`) стоит в приложении 8–12, а Hub ведёт «Verschwörungs-Werkstatt (ab 13)» и docs/09 Z.288 называет для слухов
  «Variante 13-15» (в коде такой нет). В `de-ls` слова «Verschwörung» нет.
- Dokumente: `docs/fragen-und-hinweise.md` (пункт D4) и `docs/offene-punkte-kita.md` (D3) ещё называют расхождение «Impressum
  sagt „gar nichts“» открытым; по 27а закрыто, `impressum.html` называет Sprachwahl.
- Speicheraussage: `docs/05` Z.29 (таблица «Реализовано в четвёртой итерации», строка Kettenbrief-Stopper; на этот docs/05 п. 1
  ссылается как на источник идеи) говорит «приложение не хранит вообще ничего» ↔ код пишет `ks.sprache` (`app.mjs` Z.24–25,
  `sprache.setze()`) и показывает Löschknopf; README Z.10 и Z.60 («только выбор языка») и `eltern.html` Z.22 описывают это
  верно. D3/D4 (`docs/offene-punkte-kita.md`, `docs/fragen-und-hinweise.md`) называют только расхождение с Impressum; фразу
  docs/05 они не называют.

**Offene Fragen (für Max)**
- Числа финала: «N statt M Kinder erreicht – du hast K Kinder geschützt» хвалит решение ребёнка по модели со случайным
  графом (K от 0 до 21). Это не Punkte и не Prozent, список слов (37в) молчит; будет ли это считаться оценкой, не решено.
- Зелёная кнопка у «Stopp»/«melden» (`k-knopf--richtig`) подсказывает ответ до выбора. Оставить, сделать нейтральной или
  проверить Kindertest-ом (п. 9)?
- Fokus: `zeige()` ставит фокус на первую кнопку каждого экрана (`app.mjs` Z.54); на экране решения это «weiterleiten»
  (проверено в браузере). Для клавиатуры первое нажатие Enter или пробела выбирает «weiterleiten».
- Vorlesen покрывает сообщение и вопрос, но не варианты решения, не Quellen-Hinweis и не фразу о результате. Ребёнку,
  который не читает, на экране решения варианты не прозвучат. Достаточно ли этого для детского приложения?
- Vorlesen и «keine fremden Server»: без локального голоса браузер выбирает голос сам, он может быть сетевым (комментарий в
  `komponenten.mjs`); `installiereNetzwerkWaechter` перехватывает только fetch, XHR и WebSocket. Формулировка «technisch
  erzwungen» (`eltern.html` Z.21) относится к ним, не к Sprachausgabe. Нужна ли оговорка — offen.
- Заблокированный localStorage: если доступ к `localStorage` бросает SecurityError (в браузере симулировано через
  init-скрипт, не настройкой), страница остаётся пустой (нет h1, нет кнопок). Причина — `boot()` в
  `kinder-ui/js/anzeige.mjs` (параметр по умолчанию `globalThis.localStorage`), в этом приложении дополнительно
  `erstelleSprache` в `sprache.mjs`; тестов на этот случай нет. Какие настройки реальных браузеров это вызывают —
  не проверено (offen).
- Leichte Sprache `de-ls`: по README Z.32–36 и docs/09 Z.28 переписана «по правилам Лёгкого языка»; записи о проверке группой
  читателей в репозитории нет — offen.
- Телефоны 116 111 и 0800 111 0 550 и слова «kostenlos, anonym» (`hilfe-insel.mjs`; «(kostenlos)» / «(free)» / «Das kostet
  nichts» — также в Lernpunkte каждого типа и языка, `daten/sprachen.json` Z.35, 48, 62, 98, 111, 125, 161, 174, 188; в
  `eltern.html` Z.31 стоят только номера): записи об их сверке с
  источником оператора линии в репозитории нет — offen (Fachprüfung).
- Sharenting-Block в `eltern.html` Z.34–37 («📸 Übrigens: Sharenting»; сквозной блок, не специфичный для этого приложения:
  по grep он стоит в 17 `eltern.html`, docs/05 Z.46 (идея №12) говорит «во всех 8»): правовая формулировка «Recht am eigenen
  Bild» без Fundstelle и ссылка на Gefährdungsatlas BzKJ как на источник (сам Atlas вне репозитория) — (offen, Fachprüfung).
  В этом GDD блок раньше не упоминался. Счётчик внешних фактов (`packages/kinderschutz/src/externe-fakten.mjs`) показывает
  для приложения «0 Zeilen ohne Beleg», но эти строки не находит (в его списках слов нет «Recht am eigenen Bild» и «BzKJ»;
  проверено запуском `pruefeDatei` на `eltern.html`: ни одного Treffer). `docs/externe-fakten-befunde.md`, раздел B (строка
  sharenting-spiegel, `daten/szenarien.json:57`), называет ту же формулировку «Recht am eigenen Bild» (там вместе с Art. 16
  UN-KRK) требующей юридической проверки.
- Impressum: страница, на которую ведёт ссылка в Fuß, сама пишет «Noch nicht veröffentlichungsreif» (поля — заглушки).
  Касается всех приложений.
- Browser: Fokus nach Klick и Klickfehler для этого приложения официальным инструментом никогда не измерялись (нет
  `data-kennung`); мои прогоны это не заменяют.
