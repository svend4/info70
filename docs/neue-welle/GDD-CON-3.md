# 👪 Meine Familie — Wörter und Rollen (Content-Pack) — Kurz-GDD (Entwurf)

> Черновик без кода (решение Max 11а, Stand 27.10.2026, nachgebessert 28.10.2026 nach Prüfung; Stufe 1 в
> `docs/plan-neue-welle.md`). Основа: Bauauftrag
> `docs/bauauftraege/CON-3-meine-familie-woerter-und-rollen-content-pack.md`, запись каталога «Meine Familie - Woerter und
> Rollen (Content-Pack)» (`docs/praleska-katalog.json`; в Baukasten — `docs/10`, Z. 450) и `docs/plan-neue-welle.md`,
> Abschnitt 3 (Tore). Папка будущего приложения: `apps/meine-familie-woerter-und-rollen-content-pack/` (имя из Bauauftrag).
> Всё, что не взято из этих источников, помечено «(Eigenentwurf)», недоказанное — «(offen)». Страницы Praleska — только как
> их ведёт Bauauftrag; цитат длиннее 6 слов нет, источник пересказан. «Abschnitt N» — раздел Bauauftrag, «п. N» — этого GDD.

> **Stand der Prüfung (28.10.2026, zwei Prüfrunden):** Entwurf mit bekannten Abweichungen; der Bauauftrag und `docs/plan-neue-welle.md` gehen vor. Die Prüfer haben zuletzt noch diese Punkte gefunden (im Text unten teils veraltet oder zu stark formuliert):
> - Tor 8 (Seitenangaben) und die Widerspruchszeile zur Seitenmarke sind veraltet: Seit Commit bd2a8d4 (Entscheidung 22а) gibt es neben der Marke „Seitenangaben nicht von einem Menschen geprüft.“ in einer Nutzerdatei auch den Weg `ausnahmen` in `docs/seitenmarke-stand.json` (Apps, deren Seitenangaben nur in Daten stehen, die ein Validator liest, und nirgends angezeigt oder gedruckt werden; Vorbild `erste-woerter-tagebuch`). Die Prüfung ist `packages/kinderschutz/test/seitenmarke.test.mjs`.
> - Weg A: „Vorlesen auf jedem Bildschirm“ gilt nur für die Bildschirme der Runde. `klassenEnde` und `duettSpielerStart` in `quiz.mjs` haben keinen Vorlesen-Knopf, und die Modi sind nicht abschaltbar.
> - A3/Favicon und 22а sind erledigt (21а: gemeinsame SVG gleichen Ursprungs in allen Seiten; 22а: Marken in 29 alten Apps). Offen ist nur, ob Max statt der Datei ein eingebettetes `data:`-Icon will (`docs/fragen-und-hinweise.md`, 21а).
> - Der Beleg „kinderrechte-entdecker, GDD п. 5“ gilt als Datenbeleg: `apps/kinderrechte-entdecker/daten/fragen.json` (der längste Antwortvorschlag ist die richtige Antwort in 21 von 21 Fragen).
> - Altersfrage: Die Quelle führt denselben Abschnitt „Ребенок как член семьи“ (S. 117) auch in der Gruppe „ФАНТАЗЕРЫ“ (5–7); das schärft die Frage, ob 3–5 oder 5–7 gilt.
> - Länge: über 30 KB für ein „Kurz-GDD“; der Schreiber der App kürzt beim Anlegen des endgültigen `GDD.md`.

## 1. Феномен / потребность (Warum)
Источник — Praleska, S. 117: раздел «Ребенок как член семьи» (S. 117) главы «Я и мир вокруг меня» (S. 117), группа
«ПОЧЕМУЧКИ» (S. 114). Страница ставит задачи (пересказ): углублять знания о «родственных связях» и о ролях «сын,
дочь, внук», а также сестра, брат, племянник (S. 117); учить вежливости — благодарить, просить прощения, выражать
сочувствие и восхищение (S. 117); поощрять участие в «домашнем труде», где заняты все члены семьи (S. 117); дать первое
представление о «семейном бюджете» (S. 117).
Потребность (Eigenentwurf, не измерена — offen): у взрослого, который читает с ребёнком 3–5 лет, нет короткой готовой основы
для разговора о словах семьи, домашних делах и вежливости. Приложение даёт её без рекламы, без оценки ребёнка и без
сохранения данных. Katalog видит ещё ценность в языках происхождения: слова о родстве параллельно de/uk/ru (Quelle: Katalog,
docs/10 Z. 450); в Bauauftrag такой версии нет. Домашние дела Katalog подаёт намеренно гендерно-нейтрально, в отличие от образцов
2007 г.; его ссылка на Bildungspläne не проверена (offen).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: beide (Ko-Nutzung): Kinder 3–5 Jahre gemeinsam mit einem Erwachsenen.** Belege:
- Bauauftrag Abschnitt 2: Kinder 3 bis 5 Jahre in Ko-Nutzung mit Erwachsenen, Verwendung «beides» (Bildschirm nur gemeinsam,
  Druck einer Karte je Blatt); Katalog (docs/10 Z. 450): Alter «3-5 (Ko-Nutzung)», Aufwand S, Typ content-pack (п. 10).
- Рамка адаптации в docs/10 (п. 2): 3–5 лет — только совместное использование со взрослым и жёсткие лимиты сессий.
- Группа «ПОЧЕМУЧКИ» (S. 114) в текстовой копии — 4-й и 5-й годы жизни (собственная проверка; страница с возрастом в
  Bauauftrag не ведётся); это совпадает с 3–5 из Katalog. Но одна задача S. 117 адресована «старшим дошкольникам» (п. 10).
- Дети названы пользователями → по решению 34а это Kinder-App: действуют Vorlesen и правило «ребёнок не оценивается» (п. 6).
Одно предложение (Eigenentwurf): *Ребёнок вместе со взрослым смотрит карточки о семье, слышит слово и выбирает один из двух
ответов — и уходит с новыми словами для членов семьи, с мыслью «дома делаем дела вместе» и, если взрослый хочет, с одной
распечатанной карточкой на листе A4.* Взрослый выбирает модуль, читает вслух и печатает; полей ввода и имён нет.
Соседи (Eigenentwurf): `dinge-des-alltags`, `gemeinsam-gesund-essen`, `wie-bewegt-sich` (3–5, Ko-Nutzung), `tischdienst-trainer`
(4–7), `familien-budget` (8–12, симулятор с суммами; здесь «Familienbudget» — слова и разговор, без сумм).

## 3. Движок и петля (Wie)
Петля по Bauauftrag Abschnitt 3 (названия модулей — Eigenentwurf): Startbildschirm с четырьмя модулями (Rollen, Haushalt,
Höflichkeit, Familienbudget; название и число карточек) → выбрать модуль → карточка, взрослый читает вслух → в модуле Rollen
ребёнок выбирает один из двух ответов → Erklärung → следующая карточка → конец. Печать: выбор → одна карточка на лист A4
(портрет), Titel и одно предложение, без номера страницы, без строки для имени, без полей по дням. Ни очков, ни рангов, ни
ступеней, ни рекорда; ничего не сохраняется. Случайность — параметром (`zufall`), не внутри `logik.mjs`.
Дополнения (Eigenentwurf; из Рамки docs/10 п. 2 и приложений того же возраста): Erwachsenen-Gate перед стартом; граница
сессии 5–6 карточек (`PRO_SESSION` = 6 в `dinge-des-alltags` и `gemeinsam-gesund-essen`, 5 в `wie-bewegt-sich` и `fuenf-helfer`;
значение — offen); конец «Bildschirm aus» с идеей для дома. В Bauauftrag Gate и граница сессии не названы (п. 10). Квиз — только
в Rollen (Eigenentwurf, п. 10); Haushalt, Höflichkeit и Familienbudget — карточка и вопрос взрослому для разговора, без «верно/неверно».

**Два пути для движка (решение за Max).**
- **Weg A — `quiz-kern` без оценки.** В плане «empfohlen» (`docs/plan-neue-welle.md`, Abschnitt 5, Frage 1), в Katalog
  «quiz-kern (Content-Pack)», Aufwand S. Даёт готовый раунд, Vorlesen на каждом экране, Erklärung после ответа, ничего не
  пишет в память; Tor 4 проверяется инструментом. Чего нет (проверено по `packages/quiz-kern/src/quiz.mjs`): выбора модуля
  (раунд берёт весь банк, `kategorie` — лишь подпись); Gate и жёсткой границы сессии (`rundenGroesse` режет раунд, но
  «Noch einmal» открывает новый); рядов карточек и печати; картинок в кнопках (ответ — строка). Стартовый экран фиксирован:
  карточки «Klassen-Modus», «Duett» и «Staffel» (Z. 97–123) настройкой не отключаются. «Richtig! 🎉» / «Nicht ganz …»
  (Z. 23–24) и «Geschafft!» (Z. 27) — значения по умолчанию, их заменяет `texte`. Схема по умолчанию требует ≥ 10 вопросов
  (`schema.mjs` Z. 14, 17), у шести Rollen-карточек банк мал.
- **Weg B — собственное Karten-App в Ko-Nutzungs-Muster** на `kinder-ui` (как `dinge-des-alltags`, `gemeinsam-gesund-essen`;
  печать и `regeln.test.mjs` — по образцу `puppentheater-werkstatt`). Повторяет Bauauftrag один к одному и обходится без режимов
  Duett, Klassen и Staffel. Цена: больше кода (S–M, Eigenentwurf); Tor 4 не применим — `tools/quiz-durchlauf.mjs` отклоняет
  приложения без `quiz-kern` (Exit 64); проверки конца раунда — в тестах приложения, предложение (Eigenentwurf): в Bauauftrag
  Abschnitt 7 их нет (там логика квиза, печать, память, адреса).

**Рекомендация (Eigenentwurf): Weg B.** Причины:
- (1) Три из четырёх экранов Bauauftrag — выбор модуля, ряды карточек, печать — лежат вне `quiz-kern`; движок покрыл бы один
  модуль из четырёх.
- (2) Возраст 3–5: четыре проверенных приложения этого возраста (`dinge-des-alltags`, `gemeinsam-gesund-essen`,
  `wie-bewegt-sich`, `fuenf-helfer`; в README у всех: только вместе со взрослым, как и в Bauauftrag Abschnitt 2) — собственный
  Ko-Nutzungs-Muster с Gate и `PRO_SESSION`, ни одно не на `quiz-kern`. Это тенденция, не правило: `reim-radar` (4–6, со
  взрослым) работает на `quiz-kern`, `klang-detektive` (3–5, Ko-Nutzung) — своя оболочка без Gate и `PRO_SESSION`. В самом
  `quiz-kern` Gate и границы сессии нет, а стартовые карточки про урок, Duett и Staffel на 3–5 не рассчитаны.

Weg A остаётся допустимым, если Max хочет минимум кода: тогда выпадают выбор модуля и Gate, а печать уходит на отдельную
страницу для взрослых (Eigenentwurf). Рекомендация отличается от плана и касается только этой единицы.

## 4. Lernziele (проверяемые!)
Из Bauauftrag Abschnitt 2 (все — Eigenentwurf); после каждой цели — чем проверяется:
1. Взрослый находит в модуле Rollen все шесть ролей родства, у каждой одна карточка. Проверка: тест данных — шесть карточек,
   у каждой `quelle.seite` или `eigenentwurf: true`.
2. Ребёнок называет подходящее слово для показанной роли (Ko-Nutzung). Приложение проверяет лишь выбор ответа; «называет вслух»
   подтверждает только Kindertest (п. 9).
3. Взрослый выбирает модуль (Haushalt, Höflichkeit или Familienbudget) и читает карточку вслух. Проверка: модуль открывается,
   у карточки есть текст для Vorlesen.
4. Взрослый печатает одну карточку на лист A4 без строки для имени. Проверка: `test/regeln.test.mjs` по образцу
   `puppentheater-werkstatt` — число листов равно выбору; в тексте листа нет запрещённых знаков, Emoji, строки имени, полей по дням.

## 5. Контент-план
Единица контента: карточка. Файлы (Bauauftrag Abschnitt 4): `daten/rollen.json`, `haushalt.json`, `hoeflichkeit.json`, `budget.json`.
Схема: `id, titel, modul, erklaerung, quelle{seite}, eigenentwurf`; запись без `quelle.seite` и без `eigenentwurf: true` отклоняется.
Состав MVP (Eigenentwurf, кроме отмеченного источником):
- Rollen: 6 карточек — Sohn, Tochter, Enkel, Schwester, Bruder, Neffe (S. 117). «Nichte» из Katalog в источнике не названа (п. 10).
- Höflichkeit: 4 карточки — danken, um Verzeihung bitten, Mitgefühl zeigen, Bewunderung zeigen (S. 117); тексты — Eigenentwurf.
- Haushalt: предложение 4 карточки (Eigenentwurf; число и дела — offen). В источнике: домашнюю работу делят все члены семьи (S. 117).
- Familienbudget: предложение 2–3 карточки (Eigenentwurf; offen). Katalog: «sparen, sorgsam sein»; источник даёт лишь первое
  представление (S. 117). Только качественные формулы, без сумм, цен и продуктов; каждая карточка — с `quelle.seite` или
  «(Eigenentwurf, fachlich nicht geprüft)».
Не переносим (собственная проверка текстовой копии; в Bauauftrag не названо): знание адреса, телефонов и профессий родных. На S. 117
такие задачи тоже стоят, но приложение не собирает и не хранит личные данные (Eigenentwurf; п. 10).
Дидактический анти-шаблон-тест (Eigenentwurf): каждая из шести ролей хотя бы раз верный ответ и хотя бы раз неверный вариант;
место верного ответа не фиксировано; верный вариант не всегда самый длинный (урок `kinderrechte-entdecker`, GDD п. 5: там он
длиннейший в 21 из 21 вопросов, тесты этого не ловят).

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Кода нет, поэтому ни один пункт не отмечен: это Tore из `docs/plan-neue-welle.md` (Abschnitt 3) и правила Bauauftrag (Abschnitt 6).
- [ ] **Tor 1 — kein Kind wird bewertet** (docs/02 Z. 141–146): ни Punkte, Rekord, Rang, Serie, Sterne, Pokal, ни «geschafft» и
  «richtig von», ни проценты; допустим нейтральный счётчик найденного. Проверка: `node tools/leistungs-woerter.mjs <app>` без
  необъяснённого попадания; `docs/bewertung-stand.json` без новых записей (он считает слова rekord, rang, rangliste, rangfolge,
  🏆 и счётчики `punkte`, `treffer`, `richtige`, `summen` — в коде и данных не использовать). Образец `dinge-des-alltags`
  ставит 🌟 в обратной связи — это попадание инструмента, не копировать. О порядках в семье «верно/неверно» не говорить, без
  «Nicht ganz …» (Eigenentwurf).
- [ ] **Tor 2 — Speicherregel:** Speicher ⇒ Löschknopf, kein Speicher ⇒ keine Karte «Meine Daten löschen»
  (`packages/kinderschutz/test/speicher-regel.test.mjs`). Единица ничего не сохраняет → карты удаления нет; нет sessionStorage,
  IndexedDB, Cookie, Cache. Bauauftrag Abschnitt 6 отсылает к решению в Abschnitt 9, там его нет; решение здесь: не сохранять.
- [ ] **Tor 3 — Berührziele ≥ 48 px, kein Überlauf bei 360 px, Fokus nach Klick:** `data-kennung` у каждой кнопки и возврат
  фокуса (как в тесте-образце); `node tools/browser-tor.mjs <app>` без роста — новое приложение должно быть чистым.
- [ ] **Tor 4 — Quiz-Durchlauf:** `node tools/quiz-durchlauf.mjs <app> --modus alle` зелёный — только при Weg A; при Weg B
  инструмент отклоняет приложение (Exit 64); проверки конца раунда — в тестах приложения (предложение, Eigenentwurf).
- [ ] **Tor 5 — Druck** (docs/02 Z. 79–82): Fuß и Bildschirmteile скрыты, строки для имени нет, на детском листе нет Kästchen,
  Haken и Sterne; знаки ☐☒☑✓✔★☆ и Emoji запрещены (список — `docs/druck-symbole-liste.md`); без полей по дням.
- [ ] **Tor 6 — Fakten:** каждое утверждение о праве, деньгах или здоровье — с источником или пометкой «(Eigenentwurf, fachlich
  nicht geprüft)» (счётчик внешних фактов). Касается Familienbudget и домашних дел с опасностью (нож, плита, средства для
  уборки — не брать; Eigenentwurf).
- [ ] **Tor 7 — Vorlesen:** Kinder-App → `vorlesen()` из `kinder-ui` (план, решение 28а); «на каждом экране» — Eigenentwurf.
- [ ] **Tor 8 — Seiten der Quelle:** только с пометкой «maschinell geprüft, noch nicht von einem Menschen geprüft». Проверка:
  `packages/kinderschutz/test/seitenmarke.test.mjs` (22а, Commit f3c8e97): «S. n» в `index.html`, `eltern.html`, `.mjs` или
  `daten/*.json` требует метку «nicht von einem Menschen geprüft» в одном из этих файлов; README и GDD не считаются (проба вне
  репозитория: метка только в README даёт Befund). `quelle.seite: "S. 117"` в `daten/rollen.json` уже запускает правило, поэтому
  «номера страниц только в данных, не на листе» (A18, предложение Bauauftrag) не хватает. Метка стоит в Fuß страницы
  (Eigenentwurf; текст — поле `pflichtmarkierung` в данных, как в `puppentheater-werkstatt`); окончательно решает Max / Integrator.
  В `docs/seitenmarke-stand.json` (он только сокращается) новое приложение не вносится.
- [ ] **Tor 9 — keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.**
Правила Bauauftrag и репозитория сверх Tore:
- [ ] Werbefrei, без аккаунтов и покупок; без внешних запросов (docs/02 Z. 22–24): CSP `default-src 'self'` (реализация —
  Eigenentwurf), `installiereNetzwerkWaechter()`; keine Eingabefelder; Privacy by default (ноль запросов привилегий);
  kein Service Worker (решение 9б), Neuladen ohne Netz nicht zugesichert (F4).
- [ ] `eltern.html` (по шаблону GDD; в Bauauftrag не назван — Eigenentwurf) и ссылка `../../impressum.html` в Fuß
  (`packages/kinderschutz/test/impressum-link.test.mjs`).
- [ ] Hilfe-Insel не нужна: 3–5 Ko-Nutzung, взрослый рядом (так в `packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs`).
Особые риски темы (Eigenentwurf; Fachprüfung offen): семья — личная тема. Не предполагать, кто в семье есть (один родитель,
двое взрослых одного пола, приёмная семья, разлука или потеря); не сравнивать детей и семьи; вежливость — как предложение,
не как упрёк; в Familienbudget без сумм, чтобы не задеть семьи с малыми средствами.

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- Рамка адаптации (Quelle: docs/10, «Правовая и этическая рамка адаптации», п. 1, 2, 4): заимствуются только понятия и
  структура, ни одного дословного текста; 3–5 лет — только Ko-Nutzung с жёсткими лимитами сессий.
  Дальше (Quelle: docs/10): DSGVO Art. 8 (ноль детских данных) и BFSG. Без пометки «проверено человеком» — offen.
- Katalog (docs/10 Z. 450): соответствие Bildungsplänen (Gender-Sensibilität) и связь Budget-модуля с ранним Verbraucherbildung —
  утверждения Katalog, источником не подтверждены (offen).
- Förder-Fit: keine Angabe в Bauauftrag и Katalog (offen); суммы, сроки и доли не приводятся. Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: Katalog — S. Оценка (Eigenentwurf): Weg B — S–M, по объёму ближе к `dinge-des-alltags` (`app.mjs` 135 и `logik.mjs` 83
строки) плюс печать и `druck.css` по образцу `puppentheater-werkstatt`; Weg A — S (оболочка вроде `stark-und-gesund`, `app.mjs` 33
строки), но выбор модуля и печать всё равно отдельным кодом. Главная работа — тексты карточек и их проверка, а не код.
Переиспользуем: `kinder-ui` (`el`, `vorlesen`, `mischen`, `kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`), при Weg A —
`quiz-kern`. Образцы: `dinge-des-alltags` (Ko-Nutzung, Gate, граница сессии), `puppentheater-werkstatt` (печать, `regeln.test.mjs`).
Первый срез (playable, Eigenentwurf): Startbildschirm → модуль Rollen — шесть карточек, вопрос с двумя ответами, Erklärung,
Vorlesen; печать и три остальных модуля — второй срез.
Abnahme (Bauauftrag Abschnitt 8): `npm test` в папке приложения зелёный; браузер при 360 px; число напечатанных карточек равно
выбору. Число тестов называть только после сборки и сверять с `packages/kinderschutz/test/testzahlen.test.mjs`. Регистрацию
(Hub, README, Impressum, `docs/10`, Katalog) делает только Koordinator.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 3–5 лет вместе со взрослым (протокол — docs/05, метод 5); результатов нет, это гипотезы (Eigenentwurf):
1. Понимают ли дети слова «Enkel», «Neffe», «Tochter» и «Sohn» при чтении вслух? Показывают ли нужную карточку?
2. Выбирает ли ребёнок ответ сам или подсказывает взрослый? Не угадывает ли по месту кнопки или по длине слова?
3. Говорят ли после карточек Haushalt и Höflichkeit о своём доме («у нас так»), или карточка звучит как правило и упрёк?
4. Не чувствуют ли дети из семей иного состава карточки чужими? Наблюдать, не расспрашивая о семье; нужен совет специалиста (offen).
5. Хватает ли 5–6 карточек за раз; уходит ли семья от экрана к делу («Bildschirm aus»)? Что делают дома с распечатанной карточкой?

## 10. Offen / Zweifel
Проверено при составлении: `node tools/bauauftrag-pruefen.mjs` (текстовая копия из `tools/quelle-holen.sh`) даёт для этого
Bauauftrag «ok» (8 цитат); термины и страницы я сверил с текстовой копией ещё раз скриптом. Quelle nicht im Repo prüfbar (в смысле
рабочей ветки): `PRALESKA.pdf` лежит только на `main`, текстовая копия строится вне репозитория; человеком страницы не проверены (A18).

**Widersprüche (Bauauftrag ↔ Katalog ↔ Plan ↔ Code ↔ Tests)**
- Zahl der Antworten: Bauauftrag Abschnitt 3 — «eine von zwei Antworten» ↔ Pseudocode Abschnitt 5 (`erzeugeQuizFrage`: верная роль
  плюс три Distraktoren, то есть четыре варианта). Entwurf следует Abschnitt 3 — два варианта (Eigenentwurf); Pseudocode править.
- Rollen: Katalog называет «Neffe/Nichte» и «6 Rollen» ↔ Bauauftrag — шесть ролей без Nichte; источник на S. 117 называет только
  племянника (Neffe). «Nichte» — Eigenentwurf, тогда карточек семь и Lernziel 1 («alle sechs») меняется. Пример Katalog «Oma» среди шести
  ролей не встречается.
- Umfang des Quiz: Katalog — «Quiz-Pack»; Bauauftrag Abschnitt 3 — «Rollenquiz», но Ablauf («Modul wählen → Karte → Kind wählt eine
  von zwei Antworten») читается как квиз в каждом модуле. Entwurf: квиз только в Rollen (Eigenentwurf).
- Alter: Katalog и Bauauftrag — 3–5 ↔ Quelle: S. 117 стоит в группе «ПОЧЕМУЧКИ» (3–5), но единственная возрастная отметка
  страницы — «старших дошкольников» в задаче о представлениях о семье (в Bauauftrag не названа); в Программе так назван возраст
  5–7 лет («Фантазеры»). Обе проверки — собственные по текстовой копии, страница с делением на возрасты в Bauauftrag не ведётся.
  Задача о ролях (сын, дочь, внук …) возраста не называет. Это поддерживает вопрос о «Enkel» и «Neffe» для трёхлетних; сходный
  случай — A20 в `docs/fragen-und-hinweise.md`. Решают Max / Redaktion и Kindertest.
- Veraltet nach A7: Bauauftrag Abschnitt 3 («weicht vom Motor quiz-kern ab»), 6 («nur nach A7») и 9 («Blockade») ↔ шапка Bauauftrag
  и план (Abschnitt 1): A7 выполнен. По коду: `quiz-kern` ничего не пишет (только `removeItem` старого ключа, `quiz.mjs` Z. 56–59),
  рекорда, очков и рангов нет.
- A1: Bauauftrag Abschnitt 6 — «Modellnamen-Entscheidung A1 bleibt offen» ↔ `docs/fragen-und-hinweise.md`: A1 решён 27.10.2026
  (Max 20а), исключение для четырёх тестов; в новых файлах моделей по-прежнему нет (Tor 9).
- Veraltet nach 21а: Bauauftrag Abschnitt 9 («Favicon (A3)») ↔ `docs/fragen-und-hinweise.md` Z. 9 и Z. 98: A3 решён и выполнен
  (Max 21а, Commit aaa39a8); ждёт только 22а (встроенная иконка, 48-px-Durchgang). Подробнее — в открытых вопросах.
- Seitenmarke: Bauauftrag Abschnitt 6 («dann entfällt die Markierung») ↔ `seitenmarke.test.mjs` (22а): раз `daten/rollen.json`
  несёт «S. 117», метка нужна в файле приложения, даже если на листе номера нет (п. 6, Tor 8). Abschnitt 6 править.
- Faktenstand: `docs/bauauftraege/index.json` и `docs/plan-praleska-umsetzung.md` — «nur Katalogtext» ↔ Bauauftrag Abschnitt 1 —
  цитаты и страницы сверены («geprüft»). Метка устарела или говорит о другом (нет приложения с проверенной фактической базой).
- Typ: Bauauftrag Abschnitt 1 — «Typ S» ↔ Katalog (`docs/praleska-katalog.json`): Typ content-pack, Aufwand S (docs/10 Z. 223).
  Здесь — по Katalog.
- Тест-образец ↔ содержание: `regeln.test.mjs` из `puppentheater-werkstatt` запрещает в тексте листа слова «Tag/Tage» и «Name»
  (кроме «Namen»); формулы вроде «Guten Tag» (Katalog: «Hoeflichkeitsformeln») не пройдут. Тот же тест ищет в GDD раздел «## Offen»;
  здесь он «10. Offen / Zweifel» по заданию — при сборке править тест или заголовок.
- План ↔ Entwurf: план (Abschnitt 5, Frage 1) рекомендует `quiz-kern`, этот черновик для CON-3 — Weg B (п. 3). Расхождение осознанное.

**Offene Fragen (für Max / Redaktion)**
- Motor: Weg A или Weg B (п. 3) — решение Max.
- Ko-Nutzung: брать ли Gate и границу сессии (в Bauauftrag их нет) и какое число.
- Обратная связь: нейтральные тексты вместо «Nicht ganz …» (стандарт `quiz-kern`) и без 🌟 (образец); формулировки — Eigenentwurf.
- Rollen: добавить ли Nichte и Mama, Papa, Oma, Opa, Tante, Onkel — самые частые слова семьи; в шесть ролей Bauauftrag не входят.
- Пример в Bauauftrag Abschnitt 4 («Sohn — Kind der Eltern») не отличает Sohn от Tochter и предполагает двух родителей; тексты должны
  подходить и неполным семьям, приёмным семьям, случаям потери и разлуки (Eigenentwurf; Fachprüfung offen).
- Haushalt: какие дела для 3–5 лет (без опасных); «alle helfen mit» — Eigenentwurf; ссылка Katalog на Bildungspläne не проверена.
- Familienbudget: содержание целиком Eigenentwurf, без сумм; граница с `familien-budget` (8–12).
- Задачи S. 117 про адрес, телефоны и профессии родных и про поведение, соответствующее полу ребёнка (собственная проверка
  текстовой копии, в Bauauftrag не названо), не переносятся: личные данные; Katalog — «geschlechtsneutral». Подтвердить.
- Возраст: подходят ли «Enkel» и «Neffe» трёхлетним — Kindertest (см. Alter выше; offen).
- uk и ru: Katalog видит de/uk/ru; переводы — только после проверки носителем языка (Eigenentwurf). Выбор языка в
  `kinder-ui/js/sprache.mjs` пишет в localStorage лишь при заданном `speicherSchluessel` (иначе Tor 2 не затронут).
- Seitenangaben: A18 — метка нужна в приложении, пока в данных стоит «S. n» (Tor 8); открыто, где она стоит (данные и Fuß,
  `eltern.html`, печатный лист) и как поправить Bauauftrag Abschnitt 6; граница цитат A10 (b) — 12 или 6 слов: здесь 6.
- Favicon (A3): решён и выполнен (21а). `index.html` и `eltern.html` берут общий `packages/kinder-ui/img/favicon.svg` в строке
  стилей; другой ссылки Grundgerüst-Test (образец `puppentheater-werkstatt`) не пропускает (Eigenentwurf для новой единицы).
  Ждёт только 22а (встроенная иконка, 48-px-Durchgang). Vorlesen (F2) решено правилом 28а для Kinder-Apps.
- Имя: папка из Bauauftrag длинная и содержит «content-pack» (внутреннее слово); короткий slug и заголовок? (offen)
- Fachprüfung текстов карточек (язык, возраст, образ семьи) не проводилась.

uk und ru: nicht vorhanden, offen.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
