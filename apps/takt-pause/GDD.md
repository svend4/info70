# ⏱️ Takt-Pause — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле: по `README.md`,
> `index.html`, `eltern.html`, `app.mjs`, `logik.mjs` и `test/logik.test.mjs` (папки `daten/` и файлов `manifest`,
> `sw.js` нет), плюс прогоны в браузере при 360 px (`tools/browser-tor.mjs` и одноразовые скрипты Playwright вне
> репозитория — в репо их нет). Чего здесь не проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README,
> код и данные этим документом не менялись.

## 1. Феномен / потребность (Warum)
Тематика — экранное время: умение самому планировать сессию и останавливаться. По README (Z.15–17) идея выросла из
верификации №2: Gefährdungsatlas BzKJ ведёт «Internetsucht» и «Fear of Missing Out» как отдельные феномены риска, а
саморегуляция названа защитным навыком против обоих (Quelle: README, docs/05 Z.45, docs/06 Z.59; сам атлас вне
репозитория, не перепроверен — offen; название феномена в README и в `eltern.html` разное — п. 10). Принцип по README
(Z.3–8, Z.19–23) — самонаблюдение вместо внешнего контроля: ничего не блокирует, не следит, не шлёт отчёты родителям.
Утверждение `eltern.html` Z.29 «Selbst gesetzte Grenzen halten besser als verordnete» дано без источника (offen); это
допущение авторов, не измерение (проверяет Kindertest, п. 9). Здесь ребёнок сам выбирает занятие и время, видит
нейтральный индикатор прошедшего времени и перед концом получает подсказку найти хорошую точку остановки.
Развитие (Quelle: git, docs/04 Z.44, docs/05 Z.45): Sixth wave (12.07.2026) — идея №8 «светофор экранного времени»
(зелёный / жёлтый / красный, похвала за досрочную паузу); Welle 39 (18.07.2026) — недельный «Wochen-Rückblick»; Lauf C
(27.10.2026, решение 36а, git 96a1f89) — нейтральный «Zeit-Anzeiger» одного цвета, без недельной сводки, без слов
«geschafft» и «gefeiert», заголовок 🚦 → ⏱️; старый ключ `tp.woche` теперь один раз удаляется при запуске.

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Belege:
- `README.md` Z.3 «для 8–12 лет»; `app.mjs` Z.1 «(8-12 Jahre)»; Hub `index.html` Z.18: раздел «Sicher im Netz (Kinder 8–12)»,
  ссылка на приложение Z.56. В `package.json` (Z.5) и `index.html` (Z.7) числа нет: «Kinder planen ihre Medienzeit … selbst»,
  «Plane deine Medienzeit selbst».
- Обращение «du» (`app.mjs` Z.53: «Du bestimmst den Takt – die Uhr hilft dir.»); полей ввода нет; приложения нет ни в
  `docs/erwachsenen-apps.json`, ни в `docs/kinder-apps-mit-eingabe.json`; тест hilfe-insel-abdeckung требует Hilfe-Insel у
  него как у детского приложения (список «Risikothemen»); в решении 34а–37в оно упомянуто как Sonderfall (Wertung;
  docs/fragen-und-hinweise.md Z.106).
- Родители: страница `eltern.html` («So begleiten Sie Ihr Kind»). Z.30 предлагает родителям «selbst mitmachen» и
  пользоваться подсказкой перед концом тоже — но режима для двоих, второго экрана или хода взрослого в коде нет →
  Ko-Nutzung не предусмотрена: одно устройство, один ребёнок; общее с родителями — договорённость о правилах вне
  приложения (Z.29: Mediennutzungsvertrag, см. `familien-medienvertrag`).
- По решению Max 34а (README и этот GDD называют детей пользователями) приложение — Kinder-App: действуют Vorlesen
  (28а) и правило «ребёнок не оценивается» (docs/02 Z. 141–146).

Соседи: `familien-bildschirmzeit` (Eltern+Kind 8–15, Selbstauskunft), `spiel-recht-balance` (8–12), `fomo-kompass` (8–12;
Katalog docs/09 Z.171 führt 13–15, п. 10), `sog-maschine`, `familien-medienvertrag`, `stark-und-gesund` (мост: вопрос про
экранные паузы), `stundenentwurf-bildschirmwoche` (урок для учителей).
Одно предложение: «Ребёнок сам планирует экранную сессию (что делаю + 15, 30, 45 или 60 минут), видит нейтральный
индикатор прошедшего времени, по подсказке «найди хорошую точку остановки» заканчивает и наполняет паузу движением,
водой или взглядом вдаль».

## 3. Движок и петля (Wie)
Движок: собственный мини-ход в `app.mjs` (194 строки) и чистая логика `logik.mjs` (51 строка: `taktPhase`, `formatZeit`,
`tagesSchluessel`, `aktualisiereTag`); `quiz-kern` не используется, внешних данных нет — занятия, длительности и идеи
паузы стоят в коде (`app.mjs` Z.23–39).
Основная петля (прогнана в браузере): старт («1. Was hast du vor?» — «🎬 Videos schauen» / «🎮 Spielen» / «💬 Chatten» /
«📚 Lernen & Stöbern»; «2. Wie lange soll dein Takt sein?» — 15 / 30 / 45 / 60 min; «⏱️ Takt starten!» неактивна, пока не
выбраны оба; строка «Heute: N Minuten geplant · N Pausen gemacht»; «💡 Takt-Regel …»; «Meine Daten löschen»; «🆘 Ich
brauche Hilfe») → Lauf («🎬 Videos schauen · 15 Minuten geplant», остаток «M:SS», «Zeit-Anzeiger» — круг и полоса одного
цвета `--k-blau-dunkel`, растут с прошедшим временем; с 80 % времени (`logik.mjs` Z.11) «⏳ Gleich ist Pausen-Zeit – such dir
einen guten Stopp-Punkt!»; кнопки «⏸️ Ich mache jetzt schon Pause» и «Abbrechen») → в конце времени автоматически вслух
«Die Zeit ist um. Zeit für deine Pause.» (Z.139) и Pause («🧘 Pausen-Zeit! Such dir eine Idee aus:» — 3 случайные идеи из
8, «🔊 Vorlesen», «✅ Pause gemacht!») → «Das war Pause Nummer N heute.» и «Wie fühlt sich dein Kopf jetzt an? Frischer? …» →
«⏱️ Neuen Takt planen» или «🏁 Fertig für jetzt» (обе кнопки ведут на старт).
Сессия переживает перезагрузку: `tp.laufend` хранит метку окончания, таймер считает остаток от неё (`Date.now()`, тик раз
в секунду, Z.156). Перезагрузка до конца времени — снова Lauf (замер при 85 %: «2:14» и подсказка), после конца — сразу
Pause без голоса (Z.191–193, замер).
«Minuten geplant» суммирует выбранные такты, в том числе отменённые и прерванные досрочной паузой (замер: 15 + 30 с
«Abbrechen» + 45 с досрочной паузой = «90 Minuten geplant»). «Pausen gemacht» растёт только по «✅ Pause gemacht!»: уход
с экрана Pause без нажатия не считается. Лимита дня и ограничения на цепочку тактов нет (так задумано: не инструмент
контроля, README Z.21–23).
Реиграбельность: порядок идей паузы случайный; нового контента нет.

## 4. Lernziele (проверяемые!)
По README (Z.31–33) с привязкой к коду:
1. Ребёнок планирует медиасессию заранее («сначала такт, потом экран»): без выбора занятия и времени старт невозможен
   (кнопка неактивна, `app.mjs` Z.88; замер). Проверка в Kindertest: ребёнок называет до старта, что и на сколько выбрал.
2. Ребёнок замечает подсказку «пора закругляться» и находит точку остановки: подсказка появляется с 80 % выбранного
   времени (`logik.mjs` Z.11–12; замер при 85 %). Проверка: заканчивает ли ребёнок на границе эпизода или уровня.
3. Ребёнок делает паузу телом: окно и дыхание, вода, 10 Hampelmänner, взгляд вдаль 20 секунд, пройтись по квартире,
   танец, плечи и шея, перекус (`app.mjs` Z.30–39).
Из кода, README не называет: досрочную паузу можно начать в любой момент (Z.153), без похвалы и без отдельного счёта.
Как проверяется (Quelle: test/logik.test.mjs): 9 тестов — пороги `taktPhase`, `formatZeit`, ключ дня, переход на новый
день, отсутствие оценки в коде и текстах, ключ `tp.woche`, правило Speicher. Таймер, подсказку, перезагрузку и экраны
тесты не проверяют (их видели только мои прогоны). Усвоение проверяет только Kindertest (п. 9).

## 5. Контент-план
Единица контента: занятие, длительность и идея паузы. Файлов данных нет: 4 занятия (`video`, `spielen`, `chatten`,
`lernen`), 4 длительности (15, 30, 45, 60), 8 идей паузы, из которых показываются 3 случайные (`app.mjs` Z.23–39, Z.161),
и короткие тексты экранов. Схема хранения: `tp.heute` = `{datum "JJJJ-MM-TT", geplantMin, pausen}`, `tp.laufend` =
`{aktivitaet, dauerMin, ende (мс)}` (Z.103–108; `logik.mjs` Z.42–51).
Идеи (Z.30–39): окно и три вдоха; стакан воды; 10 Hampelmänner; «Augen-Trick: 20 Sekunden …»; пройтись по квартире;
танец на одну песню без экрана; плечи и шея «wie eine Schildkröte»; перекус «in Ruhe».
Чтобы добавить идею или длительность, нужно править код: отдельного файла данных нет. Дидактический анти-шаблон-тест
не применим: вопросов и «правильных ответов» нет.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде или замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `logik.mjs`, `index.html`, `eltern.html` нет `http(s)://`, `<img>`,
  `<iframe>` и чужих скриптов; подключены только `app.mjs`, общий `kinder.css` и (с git aaa39a8, решение Max 21а) общий
  `favicon.svg` из `packages/kinder-ui/img/` — тот же origin (`<link rel="icon">`: `index.html` Z.9, `eltern.html` Z.8);
  `eltern.html` Z.20: «Keine Werbung, keine Käufe, keine Anmeldung».
- [x] **Без аккаунтов и ввода, без push, privacy by default:** нет `<input>`, `<form>`, `<textarea>`; только кнопки.
  Вызовов Notification, geolocation, mediaDevices, clipboard, cookie нет (grep пуст) — совпадает с README Z.24–26 и
  `eltern.html` Z.20 («die App fragt nie nach Berechtigungen»).
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` в
  `index.html` и `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.16); `fetch` в коде нет вообще. Замер
  (старт, полный цикл план → Lauf → Pause → Fertig, Hilfe-Insel, `eltern.html`): ни одного запроса не к своему origin;
  `browser-tor`: `fremdeHosts` 0; консоль пуста, ответов с кодом от 400 нет (замер повторён после git aaa39a8: с 21а у
  страниц общий `favicon.svg`, прежний 404 на `favicon.ico` снят — A3 в docs/fragen-und-hinweise.md стоит на
  «umgesetzt»).
- [x] **Speicher:** приложение пишет два ключа: `tp.heute` (`{datum, geplantMin, pausen}`) и `tp.laufend`
  (`{aktivitaet, dauerMin, ende}`) — `setItem` в `starteTakt` (Z.103–104) и «Pause gemacht» (Z.172). `tp.laufend`
  удаляется при «Abbrechen» (Z.154) и при входе в Pause (Z.160). Никаких имён и свободного текста. Старый ключ `tp.woche`
  удаляется одной строкой при запуске (Z.45; в браузере при предзаданных `tp.woche` и `andere.app` после загрузки остался
  только `andere.app`). Без «Takt starten» ничего не пишется (замер: на старте localStorage, sessionStorage и cookies
  пусты). Читается ещё `ui.anzeige` (Kontrast/Schrift через `boot()`, Z.17); пишет его не это приложение. **Löschknopf:
  да** — «Meine Daten löschen» на старте (Z.95) вызывает `loescheDaten([TAG_SCHLUESSEL, LAUFEND_SCHLUESSEL])` и стирает
  ровно эти два ключа (замер: `andere.app` остался); тест speicher-regel зелёный, `docs/speicher-stand.json` пуст. Fuß
  каждого экрана: «Daten bleiben auf diesem Gerät» (Z.56), `eltern.html` Z.22 — то же.
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker` (grep пуст); приложения нет в списке четырёх
  «früherer» Apps теста kein-service-worker (тест зелёный); в браузере регистраций 0, Caches 0 (решение Max 9б).
- [ ] **Offline:** нет; Neuladen без сети не удаётся (замер, `ERR_INTERNET_DISCONNECTED`). `manifest.webmanifest` нет.
- [x] **Vorlesen:** автоматически в конце времени «Die Zeit ist um. Zeit für deine Pause.» (`app.mjs` Z.139; замер: вызов
  `speechSynthesis.speak` произошёл), кнопка «🔊 Vorlesen» на экране Pause (Z.168; читает «Pausenzeit!» и три идеи) и в
  Hilfe-Insel; `vorlesen()` из kinder-ui берёт локальный голос устройства, если он есть. На стартовом экране, в Lauf и в
  «Fertig» кнопки нет — п. 10.
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`app.mjs` Z.57, замер: старт, Lauf, Pause,
  Fertig; Hilfe-Insel рисуется той же `zeige()` — по коду).
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`app.mjs` Z.58, `eltern.html` Z.38); тест impressum-link зелёный.
  Сама страница называет себя «Noch nicht veröffentlichungsreif» (`impressum.html` Z.16) — п. 10.
- [x] **Hilfe-Insel (116 111):** `hilfeInselKnopf` на старте (`app.mjs` Z.96–97); экран показывает 116 111 и
  Elterntelefon, «Zurück» ведёт на старт (замер); приложение в списке обязательных у теста hilfe-insel-abdeckung. В Lauf,
  Pause и «Fertig» кнопки нет.
- [ ] **Druck:** не предусмотрен — нет `druck.css`, нет кнопки печати и `window.print` (grep «print|druck» пуст). Печать
  из браузера: общий `kinder.css` скрывает только `.k-fuss` (`@media print`, Z.122–124; замер на экране Lauf: Fuß скрыт,
  две кнопки печатаются), остальной экран печатается как есть. Базовая линия `druck` = 8 (Zeichen стартового экрана:
  ⏱ 🎬 🎮 💬 📚 · 💡 🆘; инструмент видит только старт), замер повторён: 8, 0 Erhöhungen. Требование docs/02 Z. 79–82
  привязано к кнопке печати; её здесь нет.
- [x] **Keine Wertung des Kindes (docs/02 Z. 141–146):** очков, рекорда, рангов, серий, цветов с оценочным смыслом и
  сравнения дней нет (тесты «Kinder werden nicht bewertet»; `node tools/bewertung-stand.mjs` → «Stand stimmt.»; в
  `docs/bewertung-stand.json` приложения нет ни в `apps`, ни в `ausnahmen` — исключение не нужно и не заведено). Только
  один цвет `--k-blau-dunkel` у круга и полосы (замер); общая полоса `kinder.css` по умолчанию жёлтая, здесь
  переопределена (Z.125). `node tools/leistungs-woerter.mjs takt-pause` → один Treffer, не оценка: `0%` в стиле
  начальной ширины полосы времени (`app.mjs` Z.125; текст с процентом ребёнку не показывается). «Heute: N Minuten
  geplant · N Pausen gemacht» — нейтральный счётчик одного дня (решение 37в), без цели, без сравнения.
- [x] **Mobile First (замер, 360 px):** на старте (13 целей касания), в Lauf, Pause, «Fertig», Hilfe-Insel и на
  `eltern.html` нет переполнения и нет целей меньше 48 px; Delta-Tor `tools/browser-tor.mjs takt-pause`: 0 Erhöhungen.
  Клики и Fokus официальный инструмент не измеряет (нет `data-kennung`, Basislinie `ohneKennung` 1).

Особые риски темы: экранное время в семье — повод для споров и стыда; ребёнок может прочитать строку дня как оценку,
родитель — как инструмент контроля. В коде: нет цветов с оценкой, нет сравнения дней, нет отчётов и блокировок;
`eltern.html` Z.23 «Die App überwacht nichts und kann nichts sperren», Z.29 и Z.31 предлагают договариваться вместе и
хвалить остановку. Здоровье (глаза, движение, «Frischer?») — тексты без источника, п. 10.
Повторить проверки: `node --test apps/takt-pause/test/*.test.mjs`, `node --test
packages/kinderschutz/test/testzahlen.test.mjs`, `node tools/bewertung-stand.mjs`, `node tools/leistungs-woerter.mjs
takt-pause`, `node tools/browser-tor.mjs takt-pause` (`tools/quiz-durchlauf.mjs` не применим: приложение не на
`quiz-kern`, инструмент отклоняет такие приложения).

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- В текстах приложения нет закона, статьи или нормы (grep по `app.mjs`, `logik.mjs`, `index.html`, `eltern.html`, README
  пуст на «Artikel», «Art.», DSGVO, JuSchG, JMStV, BZgA, WHO, Studie). Есть только Gefährdungsatlas BzKJ (`eltern.html`
  Z.15; README Z.15–17) и «Recht am eigenen Bild» в блоке Sharenting (`eltern.html` Z.36, общий для eltern-страниц).
- UN-KRK: docs/11 Z.72–74 относит приложение к Art. 31 «Ruhe, Spiel, Balance» (docs/11 сам помечен «Kein Rechtsrat», Z.12);
  в самом приложении статья не названа.
- Gefährdungsatlas BzKJ, 2-е издание, май 2022, JFF + Hans-Bredow-Institut, 43 феномена (Quelle: docs/06 Z.46–47):
  «FOMO / Internetsucht — подтверждает идею №8» (Z.59). Атлас вне репозитория — offen.
- Katalogtext (Quelle: docs/09 Z.193, Z.252, Z.274, Z.291; не проверен): записи о расширениях приложения называют UN-KRK
  (Art. 31 — Z.252), DSGVO («Datenminimierung» — Z.252), BzKJ-Gefährdungsatlas (Z.252), fragFINN (Z.291).
- Förder-Fit: для самого приложения отдельной записи в docs/09 нет; записи о расширениях называют BzKJ (Teilhabe — Z.193;
  sichere Voreinstellungen — Z.274; Z.291), у Z.252 цель не указана. Суммы, сроки и доли в GDD не приводятся (offen).
  Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: M (дни–неделя): `app.mjs` 194 строки и `logik.mjs` 51 строка, данных нет, 9 тестов (таймера и экранов среди них
нет); основная работа — таймер с восстановлением после перезагрузки, пять экранов и хранение дня. Переиспользует:
`kinder-ui` (`el`, `vorlesen`, `mischen`, `boot` Anzeige, `loescheDaten` из `daten-karte.mjs`, `hilfeInsel`, `kinder.css`),
`kinderschutz` (`installiereNetzwerkWaechter`); `quiz-kern` — нет, `logik.mjs` — собственная. Первый срез (playable) уже
работает: от выбора занятия до «Pause Nummer N heute» с голосом в конце времени и без оценки. На приложение ссылаются:
`kinderrechte-entdecker` (`daten/fragen.json` Z.332), `rechte-stationen` (станция 2), `stark-und-gesund`, `sog-maschine`,
`stundenentwurf-bildschirmwoche`, `familien-medienvertrag`.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет (протокол — docs/05, метод 5); это гипотезы, результатов нет:
1. Понимают ли дети слова «Takt», «Stopp-Punkt» и фразу «die Pause gehört dazu wie das Ausatmen zum Atmen» без помощи
   взрослого? Планируют ли честно или всегда выбирают 15 (или всегда 60)?
2. Читается ли однотонный индикатор (круг, полоса, «M:SS») без цветов светофора: видят ли дети, сколько времени осталось?
   Замечают ли подсказку с 80 % и что с ней делают — доигрывают эпизод или игнорируют?
3. Что делает ребёнок в конце времени: берёт паузу или сразу «Neuen Takt planen» (лимита нет)? Пользуется ли «Ich mache
   jetzt schon Pause» и чувствует ли, что так «можно»?
4. Какие идеи паузы выбирают и делают на самом деле (3 случайные из 8)? Делают ли без взрослого? Уместен ли «Snack» как
   идея паузы?
5. Читают ли «Heute: N Minuten geplant · N Pausen gemacht» как цель или соревнование («больше пауз — лучше», сравнение с
   братьями и сёстрами)? Возникает ли чувство оценки, хотя оценки нет?
6. «Meine Daten löschen» без подтверждения: понимают ли дети, что стёрлось (строка дня обнуляется)? Нужна ли им кнопка?
7. Голос в конце времени: слышат ли дети его, мешает ли он дома или в классе, хотят ли выключить (выключателя нет, п. 10)?
8. Родители: приводит ли приложение к договорённости о правилах (`eltern.html` Z.29–31) или его используют как скрытый
   контроль (технически ничего не блокируется и не отправляется)?

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Text ↔ Tests ↔ Doku)**
- Hub `index.html` Z.56 («🚦 Takt-Pause»), Wurzel-README Z.32 («🚦 … светофор и паузы») и Z.138 («самонаблюдение +
  Wochen-Rückblick»), docs/04 Z.44, docs/05 Z.45 («светофор», «жёлтая фаза», «досрочная пауза = отдельная похвала»),
  Katalog docs/09 Z.193 («Bildschirmzeit-Ampel»), Z.252 («Ampel-App»), Z.291 («Wochen-Rückblick», «Wann war die Ampel
  rot?») ↔ код с Lauf C: нет
  светофора, цвета с оценкой, недельной сводки и похвалы за раннюю паузу. Решение 36а: «Katalogname und README
  angleichen» — README приложения приведён в порядок (git 96a1f89), Hub, Wurzel-README и Katalog нет. Эти файлы мной не
  менялись.
- Другие приложения: `apps/stundenentwurf-bildschirmwoche/daten/stunde.json` Z.9 («Ampel-App Takt-Pause») и Z.14 («am
  Beamer im Klassen-Modus: gemeinsam die Ampel …»), `apps/familien-medienvertrag/eltern.html` Z.30 («Bildschirmzeit-Ampel wie
  Takt-Pause»), `apps/familien-bildschirmzeit/GDD.md` Z.44 («Ampel-Import») ↔ в takt-pause нет ни светофора, ни Klassen-
  Modus (он есть у quiz-приложений на `quiz-kern`).
- README Z.16 «Internetsucht» (так же docs/05 Z.45, docs/06 Z.59) ↔ `eltern.html` Z.15 «exzessive Nutzung» (так же docs/09
  Z.193, Z.252): два названия одного феномена; какое из них носит атлас, не проверено (offen).
- README Z.26 и `eltern.html` Z.20 «optional hörbar» ↔ код: голос в конце времени (`app.mjs` Z.139) звучит всегда, если
  у браузера есть Sprachausgabe; переключателя нет. «Optional» значит только «если устройство умеет говорить».
- README Z.7 и Lernziel 3 («вода, форточка, взгляд вдаль») ↔ экран Pause показывает 3 случайные идеи из 8 (Z.161): вода,
  окно или взгляд вдаль попадаются не в каждой паузе.
- `eltern.html` Z.22 и README Z.38 «Gespeichert wird nur die Tageszeile von heute» ↔ замер: строка прежнего дня остаётся
  на устройстве до следующего «Takt starten» или до удаления (при новом дне показывается 0, но `tp.heute` не
  перезаписывается, пока ничего не запущено). `tp.laufend` содержит не только время, но и код занятия (`chatten`,
  `spielen` …); `eltern.html` называет «die laufende Zeit».
- «Neuen Takt planen» и «Fertig für jetzt» (`app.mjs` Z.186–187) — две кнопки с разными подписями и одним действием
  (`startBildschirm`).
- `docs/externe-fakten-stand.json` (Stand 20.10.2026) держит за takt-pause 1 блокирующую и 1 строку документации ↔ счёт
  `fundstellen` без этого GDD сейчас 0 и 0 (после Lauf C); с этим GDD счётчик считает 9 строк документации (все из
  GDD.md) и по-прежнему 0 блокирующих; тест об этом не падает, только советует «Stand nachziehen».
- Altersangaben: расхождений нет (README, `app.mjs`, Hub — 8–12; `package.json` и `index.html` числа не называют).
- Katalog docs/09 Z.171 ведёт `fomo-kompass` как «13-15 · planer» («Selbstbeobachtungs-App nach takt-pause-Muster») ↔ собранное
  приложение: Szenario-Trainer 2/1/0 для детей 8–12 (`apps/fomo-kompass/GDD.md` Z.14, `app.mjs` Z.1, `package.json` Z.5, README
  Z.3, Hub в разделе «Kinder 8–12»). П. 2 следует приложению, не каталогу. Katalog и Hub мной не менялись.

**Offene Fragen (für Max)**
- Vorlesen: кроме голоса в конце времени и кнопки на экране Pause озвучивания нет (старт с выбором, Lauf, «Fertig»).
  Хватает ли этого для Kinder-App (решение 28а)? Голос в конце времени нельзя выключить; после перезагрузки страницы
  браузер может не пустить `speechSynthesis.speak` без действия пользователя — не проверено (offen).
- `aria-live="polite"` на `#app` (`index.html` Z.12) и обновление «M:SS» раз в секунду (`app.mjs` Z.133): общая находка
  docs/fragen-und-hinweise.md C4; здесь она острее, но с реальной Hilfstechnik не проверена, и будет ли экранный диктор
  читать каждую секунду, я не знаю (offen).
- Пустая страница при сбое: если `localStorage` бросает SecurityError (в браузере симулировано init-скриптом, не
  настройкой) или в `tp.heute` лежит не-JSON (симулировано), страница остаётся без h1 и кнопок: `ladeTag()` и
  `ladeLaufend()` (Z.46–47, Z.191) без `try/catch`, `boot()` из kinder-ui тоже. Кнопка «Meine Daten löschen» при этом
  недоступна. Какие реальные настройки это вызывают, не проверено (offen); тестов на эти случаи нет.
- Утверждения о здоровье и эффекте без источника и без пометки «(Eigenentwurf, fachlich nicht geprüft)»: «Augen-Trick:
  20 Sekunden aus dem Fenster in die Ferne schauen» (`app.mjs` Z.34), «Frischer? Genau dafür sind Pausen da.» (Z.184),
  `eltern.html` Z.29 («Selbst gesetzte Grenzen halten besser als verordnete»), Z.30 («Auch Erwachsene profitieren …»),
  README Z.17 («саморегуляция … защитный навык против обоих»), «Recht am eigenen Bild» (`eltern.html` Z.36). Счётчик
  внешних фактов (`docs/externe-fakten-stand.json`) их не видит (0 строк); Fachprüfung (Gesundheit, Recht) — offen.
- «Meine Daten löschen» не подтверждает результат: общая карточка `datenKarte` пишет «Gelöscht …», здесь своя кнопка с
  `loescheDaten`, которая просто перерисовывает старт (замер: сообщения нет). Так задумано?
- Вопрос ко всему корпусу, не к этому приложению: Impressum, на который ведёт ссылка в Fuß, сам называет себя «Noch nicht
  veröffentlichungsreif».
- Vorlesen и «keine fremden Server»: без локального голоса (`localService`) браузер выбирает голос сам, он может быть
  сетевым (комментарий в `komponenten.mjs`); `installiereNetzwerkWaechter` перехватывает только fetch, XHR и WebSocket.
  Формулировка «technisch erzwungen» (`eltern.html` Z.21) относится к ним, не к Sprachausgabe. Нужна ли оговорка — offen.
- Browser: Fokus nach Klick и Klickfehler для этого приложения официальным инструментом не измерялись (нет
  `data-kennung`, Basislinie `ohneKennung` 1); мои прогоны это не заменяют.
