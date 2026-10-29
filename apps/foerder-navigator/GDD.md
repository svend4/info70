# 🧭 Förder-Navigator — Kurz-GDD

> GDD задним числом для готового приложения. Проверено 2026-10-27 на HEAD 044f04f: описано то, что делает код,
> а не то, что он должен делать. «Z.» — строка файла. «(Eigenentwurf)» — моя формулировка, не из README и не из
> кода. «(offen)» — не проверено или не решено.

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: не риск для ребёнка, а потребность взрослых, которые делают детские цифровые
предложения. Программы поддержки, премии и знаки качества в Германии лежат на разных сайтах, окна подачи
узкие, консультация перед подачей обязательна, региональные условия различаются (README Z. 25–28; docs/07,
разделы 1–3). Что происходит без приложения: оператор или продюсер собирает условия, суммы, долю собственного
вклада и сроки по отдельным источникам вручную; реальный срок подачи на 1–2 недели раньше формального
(docs/07, раздел 2). README называет приложение «монетизацией» большого аудита напрямую (Z. 8; условия взяты
из результатов аудита, Z. 9–11), а docs/07 Z. 5–6 — «Интерактивная версия каталога программ». Что без приложения
эти результаты остаются в docs/ текстом, — мой вывод (Eigenentwurf), в README этого нет. Для самого проекта это
справочник «Förder-Fit»: GDD других приложений ссылаются на него («см. foerder-navigator»). Откуда данные и
насколько им можно верить — раздел 10.

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Erwachsene** (Betreiber*innen digitaler Kinderangebote, Produzent*innen, Antragstellende).
Дети приложением не пользуются, детского экрана нет.

Belege (Fundstellen):
- README.md Z. 3: «Инструмент для взрослых (операторы, продюсеры, заявители)».
- app.mjs Z. 2 (Kommentar «Zielgruppe: ERWACHSENE»), Z. 88 (Untertitel «… (für Erwachsene)»), Z. 99 (Fuß
  «Werkzeug für Erwachsene»).
- index.html Z. 7 (meta description, endet mit «Für Erwachsene.»); package.json Z. 5 («Zielgruppe: Erwachsene.»).
- docs/erwachsenen-apps.json: Bereich «Für Betreiber*innen», Prüfung «nach Feld: kein Kindbezug»,
  `zielgruppeGeprueft: true`.
- docs/bewertung-stand.json, `ausnahmen`: «Werkzeug für Erwachsene …», von Max bestätigt (Frage 3, 27.10.2026).
- Корневой index.html Z. 240 (Abschnitt «Für Betreiber*innen») и Z. 243 (Eintrag «Förder-Navigator»).

Одно предложение: «Оператор или продюсер выбирает, что он ищет и где сидит носитель проекта, и за несколько
кликов видит, какие из 14 программ подходят — со сроком, условиями, обязательной консультацией и ссылкой на
первоисточник; калькулятор показывает собственный вклад при квоте 80 %».

## 3. Движок и петля (Wie)
Движок: свой, не `quiz-kern`; тип «katalog». Чистые функции в `logik.mjs` (`filtereProgramme`,
`sortiereNachFrist`, `istAbgelaufen`, `anteilsRechnung`) + тонкий DOM-слой `app.mjs` (`el` из kinder-ui) +
банк данных `daten/programme.json`. На это приложение ссылаются другие как на образец («foerder-navigator-Muster»).

Основная петля:
1. Открыть страницу; данные читаются одним `fetch` из `daten/programme.json` (app.mjs Z. 13).
2. «Was suchst du?» — 6 кнопок: Alles, Digitales Kinderangebot, Spiel, Film/Serie, Stoff/Drehbuch,
   Sichtbarkeit (Preise/Siegel). «Wo sitzt der Träger?» — 4 кнопки: Egal / bundesweit, Bayern, NRW,
   Sachsen / Sachsen-Anhalt / Thüringen.
3. Карточки программ в порядке статуса срока: `termin` → `erwartet` → `laufend` → `geschlossen`; внутри
   группы по дате, истёкшие в конце группы (logik.mjs Z. 15–33).
4. В карточке: значок статуса и `fristText` (📅 Frist, 🔭 erwartet, ♾️ laufend, ⛔ Fenster zu, ⌛ abgelaufen),
   вид и размер поддержки (💶), условия (⚖️), кто подаёт (👤), консультация (🗣️), привязка к земле (📍),
   ссылка «Originalquelle prüfen ↗».
5. По желанию «Eigenanteil-Rechner»: ввод общих затрат → сумма поддержки и собственного вклада при 80 %.

Реиграбельности как в игре нет. Фильтры живут только в памяти страницы и сбрасываются при перезагрузке.

## 4. Lernziele (проверяемые!)
README учебных целей не называет. Формулировки ниже выведены из интерфейса (Eigenentwurf); проверять их нужно
Praxistest с взрослыми, не Kindertest.
1. Взрослый находит для заданного случая (например, «игра, носитель проекта в NRW») подходящие программы и
   называет срок и обязательную консультацию — по карточке, без подсказки.
2. Взрослый объясняет, что у BzKJ собственный вклад не покрывается имеющейся инфраструктурой и штатным
   персоналом (подсказка в калькуляторе, app.mjs Z. 77).
3. Взрослый различает Zuschuss, Darlehen, Preis, Siegel и Stipendium (поле `art`).
4. Взрослый знает, что у данных есть «Stand» и «ohne Gewähr» и что перед подачей нужно открыть
   «Originalquelle» (app.mjs Z. 63 и Z. 95).

## 5. Контент-план
Единица контента: программа (карточка). MVP: 14 программ в `daten/programme.json` (`version: 1`,
`stand: "2026-07"`, общий `hinweis`). Схема: `id, name, traeger, passtZu[], sitz, art, hoehe, eigenanteil, wer,
beratung, fristStatus, naechsteFrist, fristText, quelle`.

Состав (подсчёт по файлу):
- `fristStatus`: termin 9, erwartet 3, laufend 1, geschlossen 1.
- `sitz`: без привязки 8, bayern 3, nrw 1, mitteldeutschland 2.
- `passtZu`: digital 5, game 4, film 3, drehbuch 3, sichtbarkeit 5, weiterbildung 1 (только `akm`).

Тесты (`test/navigator.test.mjs`, 5 тестов): схема (не менее 12 программ, уникальность `id`, `quelle` с http у
каждой, известные значения `passtZu` / `sitz` / `fristStatus`, ISO-даты); непустой результат фильтра для
четырёх запросов (digital, film, drehbuch, sichtbarkeit; см. раздел 10, п. 6); логика `sitz`; сортировка; расчёт
80/20. Дидактического анти-шаблон-теста нет: это не обучающее приложение. DOM-слой `app.mjs` тестами не покрыт.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
[x] — подтверждено по коду; [ ] — нет или не выполнено (причина рядом). Repo-Stand 044f04f.
- [x] Werbefrei / без покупок: в коде нет чужих скриптов, картинок, iframe (grep), нет пути покупки. Суммы и
  взносы в карточках (например, TOMMI, Akademie) — сведения о программах, а не продажа.
- [x] Без аккаунтов и персональных данных: входа нет; единственное поле — число «Gesamtkosten» в калькуляторе
  (app.mjs Z. 67), оно не сохраняется и не отправляется. docs/erwachsenen-apps.json: «nach Feld: kein Kindbezug».
- [x] Без внешних запросов (docs/02 Z. 22–24): CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`
  (index.html Z. 6); `installiereNetzwerkWaechter()` (app.mjs Z. 10); единственный `fetch` — `daten/programme.json`
  того же origin (Z. 13). 14 ссылок «Originalquelle prüfen ↗» — обычные `<a href>` (Z. 63): переход по клику
  пользователя, не запрос приложения.
- [x] Speicher: нет. grep `setItem|removeItem|getItem|localStorage|sessionStorage|indexedDB|cookie|datenKarte|loescheDaten|speicherSchluessel`
  — ноль совпадений в коде (единственное — комментарий app.mjs Z. 5). Ключей нет. Кнопки удаления нет и не нужно
  («нет хранения ⇒ нет кнопки», решение Max 30б, docs/speicher-stand.json: список пуст). Фильтры — только
  переменная `filter` (Z. 37).
- [x] Без сервис-воркера: нет `sw.js`, нет `serviceWorker` в коде (решение Max 9б).
- [ ] Vorlesen: нет (grep `vorlesen|speechSynthesis` — 0); для инструмента взрослых не предусмотрено (n/a).
- [ ] eltern.html: нет в папке (в git-истории папки её тоже не было). Детского экрана нет; нужна ли страница
  для взрослых — раздел 10.
- [x] Impressum-Link im Fuß: app.mjs Z. 98–100 (`../../impressum.html`).
- [x] Druck: кнопки печати нет (grep `print|druck` — 0), поэтому `druck.css` не требуется (docs/02 Z. 79–82
  говорит о нём только при кнопке печати); собственной печатной формы нет. При печати из браузера `kinder.css`
  скрывает только Fuß (там же, Z. 122–124).
- [x] Без оценки ребёнка (docs/02 Z. 141–146): детей в приложении нет. `node tools/leistungs-woerter.mjs foerder-navigator`
  находит 🏆 (значок категории «Sichtbarkeit», app.mjs Z. 22) и Prozent («80 %» в Z. 77 и в данных,
  `width:100%` в стиле). `docs/bewertung-stand.json` держит приложение под `ausnahmen`: «Werkzeug für Erwachsene …
  kein Kind wird bewertet», подтверждено Max (Frage 3, 27.10.2026).
- [x] Без запросов привилегий: grep `geolocation|mediaDevices|Notification|permissions|clipboard` — 0.

Особые риски темы: сроки, суммы и условия — сведения о деньгах и праве. Приложение приводит их «ohne Gewähr»
и ссылается на оригинал (app.mjs Z. 63 и Z. 95); с оригиналами я их не сверял (offen, раздел 10).

## 7. Стандарты и финансирование (Wofür)
Стандарты: собственных нормативных требований к приложению я не выводил. Из политики проекта действуют: нет
внешних запросов (docs/02 Z. 22–24) и нет оценки людей (docs/02 Z. 141–146, исключение подтверждено). Персональные
данные приложение не обрабатывает (см. раздел 6). Доступность проверена лишь частично: `aria-pressed` на кнопках
фильтра (Z. 44), `aria-label` на поле (Z. 70), Touch-Ziele через классы `k-knopf` (`min-height: 3rem`);
вывода о соответствии BFSG не делаю (offen).

Förder-Fit: само приложение — не заявка и не детское предложение; подходит ли оно под какую-либо программу,
не проверялось (offen). Его роль: справочник Förder-Fit для всего корпуса и общий источник данных —
`apps/fristen-radar` читает тот же `programme.json` (fristen-radar/app.mjs Z. 12). Детали по программам — в самом
приложении.

## 8. Аджайл-оценка
Aufwand: S по объёму кода: app.mjs 103 строки, logik.mjs 50, `daten/programme.json` 231, тесты 63 строки
(5 тестов). Постоянная нагрузка — актуализация данных: docs/04 просит следить за сроками ежемесячно; кто это
делает, не решено (offen).
Переиспользует: `kinder-ui` (`el`, `kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`). `quiz-kern` не
использует.
Первый срез (playable): уже работает — фильтры, сортировка по сроку, карточки, калькулятор (README Z. 8: «рабочий MVP»).
Зависимость: `apps/fristen-radar` и его тест читают тот же файл данных — смена схемы затронет оба.

## 9. Kindertest-гипотезы
Kindertest: n/a — дети приложением не пользуются и не тестируются. Вместо него Praxistest на 5–8 взрослых
(Betreiber*innen, Produzent*innen) по протоколу docs/05, метод 5, адаптированному для взрослых (Eigenentwurf):
- Находят ли они подходящую программу для своего случая без подсказки и за сколько времени?
- Понимают ли значки статуса (📅 Frist, 🔭 erwartet, ♾️ laufend, ⛔ Fenster zu, ⌛ abgelaufen) и разницу между
  «срок назначен» и «ожидается»?
- Читают ли «Stand 2026-07 · ohne Gewähr» и открывают ли «Originalquelle» — или доверяют карточке как есть?
- Не принимают ли калькулятор 80/20 за правило для всех программ?
- Чего не хватает (другие земли, другие виды поддержки)? (offen)

## 10. Offen / Zweifel

**Противоречия (документ ↔ код / данные)**
1. Актуальность. `stand` = «2026-07»; README Z. 21–22 называет 04.08.2026 и 31.07.2026 как предстоящие сроки.
   На дату проверки 2026-10-27 восемь из девяти карточек со статусом `termin` показывают «⌛ abgelaufen»
   (paedmedienpreis, akm, tommi, fff-innovativ, nrw-games, fff-xr, mdm-allgemein, mdm-games); у `fff-games`
   Stichtag совпадает с датой проверки. Три карточки `erwartet` (dbk 2026-11-13, spatz 2026-12-15, bzkj-kda
   2027-01-15) в списке без фильтра стоят на местах 10–12, после восьми истёкших: `sortiereNachFrist` ставит все
   `termin` перед всеми `erwartet`. Процесс обновления в README и коде не описан (docs/04 просит лишь следить за
   сроками ежемесячно). (offen: кто обновляет, как часто, скрывать ли истёкшие)
2. README Z. 11–12: каждая карточка «несёт пометку «Stand 2026-07 · без гарантии»». В интерфейсе пометка стоит
   один раз, в карточке фильтра (app.mjs Z. 95); в самих карточках только ссылка «Originalquelle prüfen ↗» (Z. 63).
3. Источник. README Z. 10 и `hinweis` в данных называют docs/06 источником всех сведений. docs/06 покрывает
   премии (Pädagogischer Medienpreis, TOMMI, Goldener Spatz; Z. 7–16), fragFINN и Seitenstark (Z. 18–42) и итог
   BzKJ-2026: 5 проектов, 240 тыс. €, 42 заявки (Z. 63–65; то же в docs/07 Z. 29). Из этого в `hoehe` у bzkj-kda
   подтверждена первая половина («2026: insgesamt 240.000 € für 5 Projekte»); «~30-50k je Projekt» нигде в
   репозитории не подтверждено. Правила BzKJ (80/20, инфраструктура и штат не засчитываются), обязательные
   консультации, региональный эффект и правило NRW «до 80 %» стоят в docs/07 (разделы 1–4), а не в docs/06.
   Часть значений нигде в репозитории не подтверждена, кроме ссылки в поле `quelle`: окна и сроки dbk, fff-xr,
   fff-innovativ, плата за Akademie. Ни одно значение я с оригиналом не сверял. (offen: Nachprüfung; Quelle nicht
   im Repo prüfbar)
4. README Z. 27: «Regionaleffekt (100–150% …)». В данных только 100 % (`fff-xr`, `mdm-allgemein`) и «vollständig»
   (`fff-innovativ`); 150 % есть лишь в docs/07 (FFF, кинопроизводство), такой карточки нет.
5. «Geprüft» против «ohne Gewähr». index.html Z. 7 и корневой index.html Z. 243 обещают «geprüfte Konditionen»;
   приложение пишет «ohne Gewähr … Originalquelle prüfen». Кто и когда проверял — в приложении не указано.
6. README Z. 34: тест проверяет «покрытие всех типов запроса». Тест «jeder Bedarf hat mindestens ein Programm
   ohne Sitz-Anforderung erreichbar» (navigator.test.mjs Z. 30–35) берёт четыре из пяти запросов (без «game») и
   проверяет только `treffer.length > 0` при `sitz = null`; при этом возвращаются и привязанные к земле программы,
   так что заявленное «ohne Sitz-Anforderung» тестом не проверяется. По данным для «game» программ без привязки к
   земле нет (все четыре привязаны), для остальных четырёх запросов есть.
7. Имена полей. `eigenanteil` и `beratung` содержат и другое: условия и путь подачи (dbk: «Originalstoffe ONLY …»,
   akm: «Projektidee für Kinder 6-12 …», bzkj-kda: `beratung` = «Antrag elektronisch …»). Карточка показывает их
   только значками ⚖️ и 🗣️ без подписи.

**Открытые вопросы**
8. Калькулятор знает только правило BzKJ 80/20: `anteilsRechnung(kosten)` вызывается без `quote` (app.mjs Z. 76),
   хотя карточки называют другие доли (50, 60, 80 %). Оговорка «Achtung (BzKJ)» стоит лишь в конце ответа (Z. 77).
   Ограничить заголовок словом BzKJ? (offen)
9. Фильтр «Wo sitzt der Träger?»: «Egal / bundesweit» показывает ВСЕ программы, и привязанные к земле тоже;
   варианта «другая земля» нет. `weiterbildung` (только `akm`) кнопкой выбрать нельзя: карточка видна под «Alles»
   и «Stoff/Drehbuch».
10. Срок в день срока: `istAbgelaufen` сравнивает только дату (`naechsteFrist < heute`, UTC-дата из
    `toISOString`); время «12:00» не учитывается (akm: «Bewerbung bis 04.08.2026, 12:00», `naechsteFrist` =
    2026-08-04, то есть сам срок).
11. `naechsteFrist` = начало окна у программ с окном подачи. Поле — «ближайший срок», но у fff-xr (окно
    06.–20.10.2026) в нём 2026-10-06, у fff-innovativ (07.–21.09.2026) 2026-09-07, у dbk (раунд 13.11.2026 –
    05.02.2027; «12:00» стоит у конца раунда) 2026-11-13; у bzkj-kda 2027-01-15 совпадает с началом окна-образца
    2026 (15.01.–27.02.). `istAbgelaufen` (logik.mjs Z. 37) сравнивает именно это поле, а app.mjs (Z. 51 и 56)
    пишет «⌛ abgelaufen» для статуса `termin`. По разовому скрипту (в репозитории его нет): при heute = 2026-10-10
    fff-xr показан «⌛ abgelaufen», хотя окно открыто до 20.10.; такая метка стоит у fff-xr с 07.10. и у
    fff-innovativ с 08.09., то есть со второго дня окна. У dbk (статус `erwartet`) метки нет, но с 14.11.2026
    карточка уходит в конец группы `erwartet` (после spatz и bzkj-kda), хотя раунд идёт до 05.02.2027.
    (offen: считать `naechsteFrist` концом окна или завести второе поле)
12. Управление: каждый клик заменяет весь экран (`replaceChildren`, app.mjs Z. 86): фокус теряется, введённая в
    калькулятор сумма стирается при смене фильтра. Проверка в браузере кнопки не нажимает (нет `data-kennung`;
    docs/browser-basislinie.json: `ohneKennung` 1).
13. Внешние ссылки: `rel="noopener"` без `noreferrer` (Z. 63); CSP и Wächter переходы по ссылкам не ограничивают;
    тест проверяет лишь `startsWith('http')`. Целевые страницы не проверялись.
14. eltern.html нет. В корпусе у инструментов для взрослых по-разному: у `selbstcheck-paedagogik` страница для
    Träger и Leitung есть, `mini-oper-baukasten` сознательно без неё. Решение Max: нужна ли страница-пояснение
    (Stand, «ohne Gewähr», кто ведёт данные)?
15. Не проверено: пригодность самого приложения под какую-либо программу (Förder-Fit); доступность сверх Touch-Ziele
    и aria-атрибутов; DOM-слой без тестов.

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).
