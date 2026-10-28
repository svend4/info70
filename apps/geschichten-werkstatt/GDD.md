# ✍️ Geschichten-Werkstatt — Kurz-GDD

> GDD задним числом для готового прототипа. Проверено 2026-10-27 на HEAD 044f04f: описано то, что делает код,
> а не то, что он должен делать. «Z.» — строка файла. «(Eigenentwurf)» — моя формулировка, не из README и не из
> кода. «(offen)» — не проверено или не решено.

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: тема «креативное освоение возможностей ИИ» — фокус BzKJ 2026 по README (Z. 5; мной не
проверено). В каталоге у приложения два входа: «KI-Transparenz für Kinder» (штамп и блок «So denkt die Maschine»)
и «Kreative KI-Aneignung, Vielfalt/Empowerment» (Pack «Mut & Anderssein»); см. docs/09 и docs/ideen-katalog.json.
Что происходит с ребёнком без такого приложения: готовый текст воспринимается как ответ, а не как черновик —
это моя формулировка (Eigenentwurf), в каталоге её нет. Учебная цель в каталоге (docs/09 Z. 294,
docs/ideen-katalog.json): «… Entwurf und Mitautor, nicht Wahrheit»; по-русски (перевод мой) — текст машины это
черновик и соавтор, не истина; близкая русская формулировка есть в README Z. 24 и docs/09 Z. 54. Приложение
показывает, из чего собран «машинный» текст (заготовки плюс случайность), и ставит ребёнка в позицию автора,
который продолжает историю и меняет её. Настоящего ИИ в приложении нет (eltern.html Z. 15).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Родители — необязательное сопровождение через eltern.html; приложение
работает без взрослого (шлюза для взрослых нет).

Belege (Fundstellen):
- README.md Z. 3: «Творческая мастерская историй для 8–12 лет»; Z. 17: «контент-фильтр допустимости (возраст 8–12)».
- app.mjs Z. 19 («Du wählst - die Werkstatt erzählt. Du erzählst weiter!») и Z. 42–44 («1. Wer ist dein Held?»,
  «2. Wo spielt die Geschichte?», «3. Was passiert?»): обращение на «ты» к ребёнку.
- eltern.html Z. 15 («Ihr Kind wählt Held, Ort und Ereignis …») и Z. 26 («So begleiten Sie Ihr Kind»).
- docs/offene-punkte-kita.md, Content-Pack №5: «ist für 8–12 mit Kind-Bildschirm».
- docs/09: Einträge «So denkt die Maschine (geschichten-werkstatt)» und «Bausteine-Paket Mut & Anderssein
  (geschichten-werkstatt)», Alter 8-12.
- Корневой index.html Z. 63 (Abschnitt «Stark werden (Kinder)») и Z. 75 (Eintrag «Geschichten-Werkstatt»).
- apps/geschichten-wender/GDD.md Z. 24: «ist die 8–12-App für Geschichten».

Подходит ли уровень текстов для 8–12, не проверялось (offen).

Одно предложение: «Ребёнок выбирает героя, место и событие, получает короткую историю (около 60–90 слов), слушает
её, просит рассказать иначе и продолжает сам — и понимает, что текст машины это черновик».

## 3. Движок и петля (Wie)
Движок: свой, не `quiz-kern`; тип «генератор». Чистая функция `erzeugeGeschichte({ held, ort, problem }, waehle)`
в `logik.mjs` (Z. 57) + тонкий DOM-слой `app.mjs`. `waehle` — подменяемая функция выбора (по умолчанию
`Math.random`, Z. 49), поэтому тест детерминирован. На этот образец ссылаются `erzaehl-bruecke` и
`bewegungspausen-generator` («Muster geschichten-werkstatt»).

Основная петля:
1. Три блока выбора: 9 героев, 8 мест, 9 событий (кнопки с `aria-pressed`, app.mjs Z. 27–37).
2. Кнопка «✨ Geschichte bauen!» неактивна, пока не выбраны все три (Z. 46).
3. Экран истории: штамп «🤖 Von der Maschine gebaut – mach sie zu deiner!» (Z. 54), текст, «🔊 Vorlesen»,
   «🎲 Anders erzählen» (заново при том же выборе: новые случайные начало, поворот и конец), «🧱 Neue Geschichte
   bauen» (сброс выбора).
4. Блок «🤔 So denkt die Maschine» (раскрывающийся, с «Vorlesen»): объяснение, как собран текст.
5. Блок «🃏 Was-wäre-wenn-Karte»: 5 карт; первая всегда `WAS_WAERE_WENN[0]`, «🔀 Neue Karte» берёт случайную.
6. «💡 Weiter-Erzähl-Idee» (Z. 72): нарисовать картинку или рассказать конец иначе — вне экрана.

Реиграбельность: 9 × 8 × 9 = 648 вариантов выбора, умноженные на 3 × 3 × 3 случайных частей = 17 496 разных
текстов (перебор моим разовым скриптом; в репозитории его нет). Поля ввода нет, продолжение происходит вне
приложения.

## 4. Lernziele (проверяемые!)
Цели из README (Z. 21–24); формулировка «проверяемо» — Eigenentwurf, для Kindertest:
1. Struktur. Ребёнок показывает в готовой истории героя, место, событие и то, чем кончилось («Покажи, где герой,
   где место, что случилось, чем кончилось»). Ребёнок выбирает первые три элемента; развязка — готовые
   предложения (logik.mjs Z. 61).
2. Eigene Initiative. Ребёнок рассказывает или рисует продолжение либо другой конец (app.mjs Z. 72). Это видно
   только при наблюдении: в приложении нет поля ввода и нет проверки.
3. KI-Kompetenz. Ребёнок своими словами говорит, что текст собрала «машина» из заготовок и что он — черновик,
   а не правда (`STEMPEL`, `ERKLAER`; logik.mjs Z. 44 и Z. 47). README помечает эту цель «(с ИИ-этапом)»; сам штамп
   и объяснение работают уже сейчас, без ИИ.

## 5. Контент-план
Единица контента: строка-заготовка в массивах `logik.mjs` (папки `daten/` нет). MVP: `HELDEN` 9, `ORTE` 8,
`PROBLEME` 9, `WAS_WAERE_WENN` 5; не экспортируются `ANFAENGE` 3, `WENDUNGEN` 3, `ENDEN` 3; плюс `STEMPEL` и
`ERKLAER` (59 слов: составное слово с дефисом считаю одним, два отдельных тире не считаю; токенов через пробел 61).
Pack «Mut & Anderssein» — последние 4 героя, 3 места, 4 события и все 5 карт (по комментариям в коде). Схема:
экспортируемые массивы — `Object.freeze([...строки])`; текст собирается в `erzeugeGeschichte` по шаблону
«`${anfang}: ${held}, ${ort}. Eines Tages passierte es: ${held} ${problem}. ${wendung} Gemeinsam mit neuen Freunden
… ${ende}`» (Z. 61).

Тесты (`test/logik.test.mjs`, 6 тестов): не менее 3 заготовок каждого вида; в тексте есть выбранные герой, место и
событие и не менее 80 знаков; штамп «Maschine gebaut»; объяснение (Baustein / KI / Entwurf); Pack (слова
«anders», «Rollstuhl» и др., не менее 4 карт формата «Was wäre, wenn»); детерминизм при подменённом выборе.
Грамматику результата ни один тест не проверяет (раздел 10, п. 6).

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
[x] — подтверждено по коду; [ ] — нет или не выполнено (причина рядом). Repo-Stand 044f04f.
- [x] Werbefrei / без покупок: ничего подобного в коде нет; Fuß сам говорит «werbefrei» (app.mjs Z. 22).
- [x] Без аккаунтов и персональных данных: полей ввода нет (grep `input|textarea|select|contenteditable` — 0);
  ввод только как выбор кнопкой из фиксированных списков.
- [x] Без внешних запросов (docs/02 Z. 22–24): CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` в
  index.html Z. 6 и в eltern.html Z. 6; `installiereNetzwerkWaechter()` (app.mjs Z. 10); `fetch` в приложении нет;
  http(s)-адресов в коде и HTML нет (в README только localhost); eltern.html скриптов не загружает. Оговорка про
  Sprachausgabe — раздел 10, п. 7.
- [x] Speicher: нет. grep `setItem|removeItem|getItem|localStorage|sessionStorage|indexedDB|cookie|datenKarte|loescheDaten|speicherSchluessel`
  — ноль совпадений. Ключей нет. Кнопки удаления нет и не нужно (решение Max 30б, docs/speicher-stand.json:
  список пуст). Выбор лежит только в переменной `wahl` (Z. 14). eltern.html Z. 21: «Es wird nichts gespeichert.»
- [x] Без сервис-воркера: нет `sw.js`, нет `serviceWorker` в коде (решение Max 9б). Слова «offline» в текстах
  приложения — раздел 10, п. 1.
- [x] Vorlesen: кнопка «🔊 Vorlesen» в трёх местах (история Z. 57, «So denkt die Maschine» Z. 64, карта Z. 70) через
  `vorlesen()` из kinder-ui. Читается только текст из фиксированных заготовок. Кнопка показывается и без
  немецкого локального голоса (проверки `lokaleStimme` нет) — раздел 10, п. 7.
- [x] eltern.html есть (40 строк); в Fuß есть ссылка на неё (app.mjs Z. 23).
- [x] Impressum-Link im Fuß: app.mjs Z. 24; в eltern.html Z. 37.
- [x] Druck: кнопки печати нет (grep `print|druck` — 0), `druck.css` нет, ничего не печатается (docs/02 Z. 79–82
  говорит о `druck.css` только при кнопке печати). При печати из браузера `kinder.css` скрывает только Fuß
  (Z. 122–124 там же).
- [x] Без оценки ребёнка (docs/02 Z. 141–146): `node tools/leistungs-woerter.mjs geschichten-werkstatt` — «keine
  Treffer»; в docs/bewertung-stand.json приложения нет ни под `ausnahmen`, ни под `apps`. Счётчиков, очков, рангов
  и сравнения нет; «Anders erzählen» не значит «лучше» или «хуже».
- [x] Без запросов привилегий: grep `geolocation|mediaDevices|Notification|permissions|clipboard` — 0.
- [ ] Offline после перезапуска: не гарантируется (сервис-воркера нет). После загрузки страница дальше ничего не
  запрашивает.

Особые риски темы: события Pack затрагивают «ausgelacht werden», «Anderssein», героя в инвалидной коляске и чат
класса; отметки о Fachprüfung в README, коде и eltern.html нет (offen, раздел 10, п. 9). Hilfe-Insel (116 111)
сознательно не встроена (раздел 10, п. 10).

## 7. Стандарты и финансирование (Wofür)
Стандарты — метки каталога (docs/09, docs/ideen-katalog.json), юридически мной не проверялись (offen): штамп и «So
denkt die Maschine» — AI Act, UN-KRK, Seitenstark; Pack «Mut & Anderssein» — UN-KRK, Seitenstark, BFSG/EAA. В коде
AI Act назван лишь как мотив (logik.mjs Z. 4); настоящего ИИ нет.

Förder-Fit: README Z. 5 — тема фокуса BzKJ 2026; каталог — «BzKJ (Fokus KI)»; docs/04 — вариант пакета BzKJ на
2027 год «и/или ИИ-версия geschichten-werkstatt»; Goldener Spatz «Interaktives & Digitales Storytelling» назван
целью в docs/04, docs/06 и docs/08. По `programme.json` туда принимают только нарративные форматы; подходит ли
генератор из заготовок, не проверено (offen). Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: S (прототип): app.mjs 75 строк, logik.mjs 62, eltern.html 40, тесты 41 строка (6 тестов).
Переиспользует: `kinder-ui` (`el`, `vorlesen`, `kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`).
`quiz-kern` не использует.
Первый срез (playable): уже работает — выбор, история, Vorlesen, «Anders erzählen», объяснение, карты (README:
«прототип»).
Подключение настоящего ИИ (README: этап 3 roadmap) — отдельная работа, не оценена (offen). Внешний вызов
противоречит правилу «нет внешних запросов» (docs/02 Z. 22–24), если не выбрать локальную модель (раздел 10, п. 8).

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 (протокол — docs/05, метод 5):
- Понимают ли штамп «Von der Maschine gebaut» и блок «So denkt die Maschine» без помощи взрослого? Могут ли своими
  словами сказать «текст машины — черновик»? Не принимают ли «Maschine» за умного собеседника?
- Замечают ли они ошибки в тексте («dass:» без продолжения, «zwei beste Freunde hat»)? Мешает ли это, перестают ли
  верить истории?
- Пользуются ли «Anders erzählen», новой историей, продолжением вслух или рисунком (Weiter-Erzähl-Idee)? Что
  происходит после экрана?
- Pack «Mut & Anderssein»: как дети реагируют на сочетания, например «wird ausgelacht» и «im Chat einer
  Klassengruppe»? Звучит ли «Anderssein ist eine Superkraft» для них поддержкой? (нужна Fachprüfung, offen)
- Нужна ли им кнопка Vorlesen; что происходит, если голоса нет?
- Хватает ли пяти карт «Was wäre, wenn» или они быстро повторяются?

## 10. Offen / Zweifel

**Противоречия (документ ↔ код)**
1. «Офлайн». README Z. 7–8 («работает офлайн»), index.html Z. 7 («offline»), app.mjs Z. 22 («funktioniert ohne
   Internet»; такая фраза в app.mjs есть только здесь) ↔ сервис-воркера нет (решение Max 9б). Страница работает без
   сети, пока открыта (дальше запросов нет); после перезапуска без сети загрузка не гарантирована. Писать «после
   загрузки»? (offen)
2. README Z. 12–13: `erzeugeGeschichte` «в app.mjs» ↔ функция в `logik.mjs` (Z. 57); `app.mjs` её импортирует (Z. 8).
3. README Z. 13–19 называет «обязательными условиями» четыре пункта; eltern.html Z. 22 говорит о «Regel-Trias»
   (три правила); пункт 4 (локальная модель) — вариант, а не условие (так и в docs/04). «По умолчанию ИИ выключен»
   стоит в README Z. 18 и eltern.html Z. 22; в самом правиле требований сказано только «выключатель функции».
4. README не упоминает то, что уже есть в коде: штамп «Von der Maschine gebaut», блок «So denkt die Maschine», карты
   «Was wäre, wenn», Pack «Mut & Anderssein» (всё это Welle 38 и 39, 2026-07-18) и eltern.html (с 2026-07-17).
   Lernziel 3 помечена «(с ИИ-этапом)», хотя её ядро («текст машины — черновик») уже работает без ИИ.
5. Запись каталога о Pack ↔ код. Каталог обещает «Helden, Orte und Wendungen» и «Rollen-Vorlesen (Stimmwechsel je
   Figur)»; в коде новые герои, места и события, `WENDUNGEN` прежние (3), голос один (`vorlesen(text)`). Обещание
   «verändert den Maschinenentwurf aktiv»: редактирования в приложении нет, изменение возможно только вне экрана.
6. Тест «zusammenhängende Geschichte» (logik.test.mjs Z. 15: `text.length >= 80`) ↔ реальные ошибки текста.
   Перебор всех 17 496 текстов (разовый скрипт, в репозитории его нет):
   а) начало «Niemand hätte gedacht, dass:» даёт придаточное без продолжения — 5 832 текста (треть);
   б) «zwei beste Freunde» + глагол в единственном числе («… hat den Schlüssel zur Heimat verloren») — 1 944 текста;
   в) нет запятой после придаточного у 3 из 9 героев («… im Rollstuhl unterwegs ist wird ausgelacht …»);
   г) средняя фраза «Gemeinsam mit neuen Freunden wurde gesucht, probiert und gelacht» не зависит от события: после
   «wird ausgelacht» в ней стоит «gelacht», после «steht einem Freund bei» — «neue Freunde» (logik.mjs Z. 61).
7. eltern.html Z. 21: «Keine Verbindungen zu fremden Servern – technisch erzwungen (CSP + Netzwerk-Wächter)» ↔
   Sprachausgabe лежит вне Wächters и CSP (komponenten.mjs Z. 26–39). `vorlesen()` ставит локальный голос, только
   если он есть (Z. 59–61), иначе выбирает браузер, и голос может быть сетевым. Приложение голос не проверяет и всегда
   показывает кнопку.

**Открытые вопросы**
8. Путь к ИИ (решение Max). Запрос к внешней модели (README Z. 16: «В запрос к модели уходят …») противоречил бы
   правилу «нет внешних запросов» (docs/02 Z. 22–24); CSP и Wächter такой запрос заблокировали бы. Остаётся
   локальная модель (README Z. 19). Eltern-Schalter «standardmäßig AUS» требует состояния: хранить без кнопки
   удаления нельзя (решение Max 30б), значит, сбрасывать при каждом визите? (offen)
9. Fachprüfung Pack «Mut & Anderssein» (offen): сочетания вроде «Heldin im Rollstuhl» × «Anderssein ist eine
   Superkraft» или «wird ausgelacht» × «im Chat einer Klassengruppe». Отметки о проверке нет; тест ищет лишь наличие слов.
10. Hilfe-Insel (116 111) сознательно не встроена: `hilfe-insel-abdeckung.test.mjs`, BEWUSST_OHNE «Kreativ-Modul»
    (Welle 75, 2026-10-08). Pack добавлен раньше (2026-07-18) и приносит «Ausgelachtwerden» и сцену чата класса.
    Остаётся ли решение? (Entscheidung Max)
11. Штамп и объяснение: «Von der Maschine gebaut» и «Diese Geschichte hat kein Mensch geschrieben» — при том что
    заготовки написали люди и ИИ не подключён (eltern.html Z. 15). Сравнение «Sie würfelt aus vielen Beispielen
    etwas Neues» — упрощённое утверждение о технике (Fachprüfung offen). Понятность для 8–12 (59 слов, счёт
    как в разделе 5) не проверена — Kindertest.
12. Lernziel 2 («продолжает и меняет историю») выполняется вне приложения (app.mjs Z. 72); поля ввода нет, значит
    приложение само проверить цель не может. Только наблюдение.
13. Управление: весь экран заменяется (`replaceChildren`, app.mjs Z. 17) только при клике на кнопки выбора
    (Z. 35), «Geschichte bauen» (Z. 46), «Anders erzählen» (Z. 58) и «Neue Geschichte bauen» (Z. 59); фокус при этом
    теряется. «🔊 Vorlesen» (Z. 57, 64, 70) только вызывает `vorlesen()`, «🔀 Neue Karte» (Z. 69) меняет лишь
    `textContent` у `#gw-karte`: эти кнопки экран не перерисовывают. Первая карта всегда `WAS_WAERE_WENN[0]`,
    «Neue Karte» может показать ту же карту; проверка в браузере кнопки не нажимает (нет `data-kennung`;
    docs/browser-basislinie.json: `ohneKennung` 1).
14. docs/offene-punkte-kita.md: решение по Content-Pack №5 «Tierkinder» (это приложение — 8–12 с экраном ребёнка,
    `klanggeschichten-erzeuger` — 1–3) не принято; приложения касается косвенно.
