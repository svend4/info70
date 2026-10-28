# 🌙 Himmelsgucker: Sonne, Mond und Sterne — Kurz-GDD (Entwurf)

> Черновик без кода (решение Max 11а, Stand 27.10.2026, nachgebessert 28.10.2026 nach Prüfung; Stufe 1 в
> `docs/plan-neue-welle.md`). Основа: Bauauftrag
> `docs/bauauftraege/CON-6-himmelsgucker-sonne-mond-und-sterne.md`, запись каталога «Himmelsgucker: Sonne, Mond und Sterne»
> (`docs/praleska-katalog.json`; в Baukasten — `docs/10`, Z. 453) и `docs/plan-neue-welle.md`, Abschnitt 3 (Tore). Папка
> будущего приложения: `apps/himmelsgucker-sonne-mond-und-sterne/` (имя из Bauauftrag). Всё, что не взято из этих источников,
> помечено «(Eigenentwurf)», недоказанное — «(offen)». Страницы Praleska — только как их ведёт Bauauftrag; цитат длиннее
> 6 слов нет, источник пересказан. «Abschnitt N» — раздел Bauauftrag, «п. N» — этого GDD.

> **Stand der Prüfung (28.10.2026, zwei Prüfrunden):** Entwurf mit bekannten Abweichungen; der Bauauftrag und `docs/plan-neue-welle.md` gehen vor. Die Prüfer haben zuletzt noch diese Punkte gefunden (im Text unten teils veraltet oder zu stark formuliert):
> - Tor 8 (Seitenangaben) und die Widerspruchszeile zur Seitenmarke sind veraltet: Seit Commit bd2a8d4 (Entscheidung 22а) gibt es neben der Marke „Seitenangaben nicht von einem Menschen geprüft.“ in einer Nutzerdatei auch den Weg `ausnahmen` in `docs/seitenmarke-stand.json` (Apps, deren Seitenangaben nur in Daten stehen, die ein Validator liest, und nirgends angezeigt oder gedruckt werden; Vorbild `erste-woerter-tagebuch`). Die Prüfung ist `packages/kinderschutz/test/seitenmarke.test.mjs`.
> - Weg A: „Vorlesen auf jedem Bildschirm“ gilt nur für die Bildschirme der Runde. `klassenEnde` und `duettSpielerStart` in `quiz.mjs` haben keinen Vorlesen-Knopf, und die Modi sind nicht abschaltbar.
> - A3/Favicon und 22а sind erledigt (21а: gemeinsame SVG gleichen Ursprungs in allen Seiten; 22а: Marken in 29 alten Apps). Offen ist nur, ob Max statt der Datei ein eingebettetes `data:`-Icon will (`docs/fragen-und-hinweise.md`, 21а).
> - Die Widerspruchszeile zu ★ und ☆ auf dem Beobachtungsblatt ist kein Widerspruch zwischen Bauauftrag, Katalog, Plan, Code oder Tests, sondern eine Vorsorgefrage: unter „Offene Fragen“ lesen. Der Treffer der Wortliste (Tor 1) entsteht durch die Kartenbenennung „Sterne“ (Muster `\bsterne?\b`), nicht durch „Sternenhimmel“; „unvermeidlich“ ist zu stark, der Treffer ist im README zu erklären.
> - Altersfrage: Die Mondphasen-Wörter stehen in der Quelle nur im Abschnitt der Gruppe „ПОЧЕМУЧКИ“ (3–5); die Gruppe „ФАНТАЗЕРЫ“ (5–7) hat einen eigenen Astronomie-Abschnitt ohne Mondgestalten. Das erklärt möglicherweise den Katalogwiderspruch (5–7 gegen S. 138).
> - Länge: über 30 KB für ein „Kurz-GDD“; der Schreiber der App kürzt beim Anlegen des endgültigen `GDD.md`.

## 1. Феномен / потребность (Warum)
Источник — Praleska, S. 138: раздел «Астрономия (введение)» (S. 138), группа «ПОЧЕМУЧКИ» (S. 138). Страница ставит задачи
(пересказ): познакомить с небесными телами — «Солнце, Луна, звезды» (S. 138) — и побуждать к наблюдению за их
положением; восход и заход Солнца и Луны, тепло Солнца и вид Луны от полной до серпа («полная, неполная, серпом», S. 138). Цель
наблюдения — Солнце, Луна и «звездное небо» (S. 114). Космос источник вводит через космонавтов (S. 138; цель с пометкой Sternchen,
п. 10); Katalog заменяет их на Astronautinnen und Astronauten der ESA (docs/10 Z. 453) — эта замена Eigenentwurf.
Потребность (Eigenentwurf, не измерена — offen): небо ребёнок видит каждый день, но слова («voll», «Sichel») и вечернее
наблюдение нужны ему рядом со взрослым и вне экрана. Katalog формулирует: экран короткий, наблюдение на улице долгое.
Приложение даёт три карточки, один вопрос про форму Луны и два печатных листа; на небо смотрят вместе с родителями на улице.

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: beide (Ko-Nutzung): Kinder 5–7 Jahre, Beobachtung offline mit Eltern.** Belege:
- Bauauftrag Abschnitt 2: Kinder 5 bis 7 Jahre, Beobachtung offline mit Eltern, Verwendung «beides» (kurzer Bildschirm, Druck für
  die Beobachtung draußen); Lernziel 3 — Erwachsene druckt; Abschnitt 3 — Erwachsene liest vor. Katalog (docs/10 Z. 453):
  Alter «5-7 (Beobachtung offline mit Eltern)», Aufwand S, Typ content-pack (п. 10).
- Рамка адаптации в docs/10 (п. 2): 5–7 лет — короткие самостоятельные сессии.
- Дети названы пользователями → по решению 34а это Kinder-App: действуют Vorlesen и правило «ребёнок не оценивается» (п. 6).
- Расхождение (п. 10): раздел источника стоит в группе «ПОЧЕМУЧКИ»; в текстовой копии это младший дошкольный возраст (4-й и
  5-й годы жизни; страница с возрастом в Bauauftrag не ведётся), Katalog даёт 5–7.
Одно предложение (Eigenentwurf): *Ребёнок вместе с родителем смотрит три карточки — Солнце, Луна, звёзды, — выбирает подходящий
вид Луны и уходит на улицу с листом для наблюдения вечернего неба.*
Соседи (Eigenentwurf): `wetter-forscher`, `jahreszeiten-rad`, `kita-kartograph` (стороны света), `farb-labor` (5–7, Ko-Nutzung).

## 3. Движок и петля (Wie)
Петля по Bauauftrag Abschnitt 3: Start с тремя карточками Sonne, Mond, Sterne (Eigenentwurf) → выбрать карточку → взрослый читает
вслух → про Mond вопрос о Mondgestalten (в Abschnitt 3 два ответа, в Pseudocode и Test три варианта — п. 10) → Erklärung →
следующий вопрос или конец. Печать: выбрать лист → Vorschau → drucken. Два листа (Eigenentwurf): Mondblatt с тремя формами Луны —
сопоставление раскрашиванием или соединением, не галочкой; Beobachtungsblatt с полями для формы Луны, стороны света и погоды —
без даты, без полей по дням, без строки для имени; каждый лист A4 портрет. Ни очков, ни рангов, ни рекорда; ничего не
сохраняется. Случайность — параметром (`zufall`), не внутри `logik.mjs`.
Дополнения (Eigenentwurf): короткий экран и конец «Bildschirm aus — смотрим вверх» (Katalog: наблюдение на улице долгое);
число вопросов за раз — offen. Erwachsenen-Gate и граница сессии в Bauauftrag не названы (п. 10).

**Два пути для движка (решение за Max).**
- **Weg A — `quiz-kern` без оценки.** В плане «empfohlen» (`docs/plan-neue-welle.md`, Abschnitt 5, Frage 1), в Katalog «quiz-kern +
  Druckmaterial», Aufwand S. Прецедент для 5–7: `mathe-entdecker` (раунд из 10, Emoji как картинки в тексте). Даёт готовый
  раунд, Vorlesen на каждом экране, Erklärung после ответа, ничего не пишет в память; Tor 4 проверяется инструментом. Чего
  нет (проверено по `packages/quiz-kern/src/quiz.mjs`): стартового экрана с тремя карточками (старт фиксирован и несёт карточки
  «Klassen-Modus», «Duett», «Staffel», Z. 97–123); картинок в кнопках (ответ — строка, форма Луны только словами или Emoji, вид
  которых зависит от устройства); печати. Схема по умолчанию требует ≥ 10 вопросов (`schema.mjs` Z. 14, 17), а у Bauauftrag по
  сути три формы Луны: остальное пришлось бы придумывать сверх S. 138 и S. 114 (Eigenentwurf, больше Fachprüfung). Печать —
  отдельная страница для взрослых (Eigenentwurf).
- **Weg B — собственное Karten-App** на `kinder-ui` (образцы: `puppentheater-werkstatt`, `tierkinder-vorlesen` — карточка и
  печать; `dinge-des-alltags` — вопрос с выбором). Повторяет Bauauftrag один к одному: три карточки, формы Луны как SVG
  (Eigenentwurf), те же формы на листе, конец «Bildschirm aus». Цена: больше кода (S–M, Eigenentwurf); Tor 4 не применим —
  `tools/quiz-durchlauf.mjs` отклоняет приложения без `quiz-kern` (Exit 64); проверки конца раунда — в тестах приложения,
  предложение (Eigenentwurf): в Bauauftrag Abschnitt 7 их нет (там логика вопроса о Луне, печать, память, адреса).

**Рекомендация (Eigenentwurf): Weg B.** Причины:
- (1) Start с тремя карточками и Druckauswahl лежат вне `quiz-kern`, а сам квиз — один вопрос про три формы.
- (2) Lernziel 2 сопоставляет формы Луны с картинками, кнопки `quiz-kern` принимают только текст.
- (3, слабее) Прецеденты для 5–7 идут в обе стороны (по README и коду; число не называю). Gate и `PRO_SESSION` — у `farb-labor`,
  `geschichten-wender`, `design-entdecker`; Gate и `MAX_HANDLUNGEN` — у `tischdienst-trainer`. Ни того ни другого нет у
  `koerper-entdecker`, `mensch-tier-pflanze`, `warum-heisst-das-so` (все на `quiz-kern`; 5–7 вместе, 8–12 самостоятельно), у
  `mathe-entdecker` (`quiz-kern`) и у `hoeflich-fair`, `jahreszeiten-rad`, `sicher-unterwegs`, `kunst-entdecker`, `mess-labor`
  (своя оболочка; 5–7 вместе, затем 8–12). Для 5–7 «своё приложение с Gate» — не правило (так и в Рамке docs/10, п. 2:
  короткие самостоятельные сессии), а прецедент `quiz-kern` шире одного `mathe-entdecker`. Рекомендацию несут (1) и (2).

Weg A допустим (прецеденты `mathe-entdecker`, `koerper-entdecker`), если Max хочет минимум кода: тогда форма Луны только словами
или Emoji, банк вопросов шире Bauauftrag, печать отдельно. Рекомендация отличается от плана и касается только этой единицы.

## 4. Lernziele (проверяемые!)
Из Bauauftrag Abschnitt 2 (все — Eigenentwurf); после каждой цели — чем проверяется:
1. Ребёнок называет, когда видно Солнце и когда звёзды. Проверка: только Kindertest (п. 9) — в Abschnitt 3 Bauauftrag функции для
   этой цели нет (п. 10).
2. Ребёнок сопоставляет формы Луны voll, teilweise, Sichel с подходящими картинками (Ko-Nutzung). Проверка: тест логики —
   при заданной последовательности случайных чисел в вопросе ровно один верный вариант; «называет вслух» — Kindertest.
3. Взрослый печатает лист наблюдения вечернего неба без даты и без строки для имени. Проверка: `test/regeln.test.mjs` по образцу
   `puppentheater-werkstatt` для обоих листов — нет запрещённых знаков, Emoji, поля даты, строки имени.

## 5. Контент-план
Единица контента: карточка. Файл (Bauauftrag Abschnitt 4): `daten/himmel.json`; схема `id, titel, modul, erklaerung,
quelle{seite}, eigenentwurf` (пример в Bauauftrag: `mond-voll`, модуль `mondphasen`); запись без `quelle.seite` и без
`eigenentwurf: true` отклоняется.
Состав MVP (Eigenentwurf, кроме отмеченного источником):
- Старт: карточки Sonne, Mond, Sterne (3).
- Mondgestalten (модуль `mondphasen`): voll, teilweise, Sichel — 3 карточки (S. 138). Название средней формы: Katalog «halb»,
  Bauauftrag «teilweise», источник «неполная» (п. 10).
- Sonne: восход и заход, тепло (S. 138). Mond: восход и заход (S. 138). Sterne: наблюдение звёздного неба (S. 114).
- Печать: Mondblatt и Beobachtungsblatt — 2 листа.
- Raumfahrt: в Bauauftrag нет ни экрана, ни Lernziel; брать ли карточку об Astronautinnen und Astronauten der ESA — offen (п. 10).
Граница фактов (Eigenentwurf): только то, что несут S. 138 и S. 114. Объяснение, почему Луна меняет форму, и любые числа
(расстояния, сроки) не включаем: Fachprüfung не проводилась.
Дидактический анти-шаблон-тест (Eigenentwurf): каждая из трёх форм хотя бы раз верный ответ и хотя бы раз неверный вариант;
место верного ответа не фиксировано; верный вариант не всегда самый длинный.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Кода нет, поэтому ни один пункт не отмечен: это Tore из `docs/plan-neue-welle.md` (Abschnitt 3) и правила Bauauftrag (Abschnitt 6).
- [ ] **Tor 1 — kein Kind wird bewertet** (docs/02 Z. 141–146): ни Punkte, Rekord, Rang, Serie, Sterne, Pokal, ни «geschafft» и
  «richtig von», ни проценты; допустим нейтральный счётчик найденного. Проверка: `node tools/leistungs-woerter.mjs <app>` без
  необъяснённого попадания; `docs/bewertung-stand.json` без новых записей (он считает слова rekord, rang, rangliste, rangfolge,
  🏆 и счётчики `punkte`, `treffer`, `richtige`, `summen`; слово «Sterne» он не считает). Здесь попадание неизбежно:
  инструмент метит слова «Stern» и «Sterne» (группа sterneUndPokale), а это содержание, не награда — объяснить в README, а не
  обходить (п. 10). Образец `dinge-des-alltags` ставит 🌟 в обратной связи — не копировать. Без «Nicht ganz …» (Eigenentwurf).
- [ ] **Tor 2 — Speicherregel:** Speicher ⇒ Löschknopf, kein Speicher ⇒ keine Karte «Meine Daten löschen»
  (`packages/kinderschutz/test/speicher-regel.test.mjs`). Единица ничего не сохраняет → карты удаления нет; нет sessionStorage,
  IndexedDB, Cookie, Cache. Beobachtungsblatt — бумага, не ввод на экране. Bauauftrag Abschnitt 6 отсылает к решению в
  Abschnitt 9, там его нет; решение здесь: не сохранять.
- [ ] **Tor 3 — Berührziele ≥ 48 px, kein Überlauf bei 360 px, Fokus nach Klick:** `data-kennung` у каждой кнопки и возврат
  фокуса (как в тесте-образце); `node tools/browser-tor.mjs <app>` без роста — новое приложение должно быть чистым.
- [ ] **Tor 4 — Quiz-Durchlauf:** `node tools/quiz-durchlauf.mjs <app> --modus alle` зелёный — только при Weg A; при Weg B
  инструмент отклоняет приложение (Exit 64); проверки конца раунда — в тестах приложения (предложение, Eigenentwurf).
- [ ] **Tor 5 — Druck** (docs/02 Z. 79–82): Fuß и Bildschirmteile скрыты, строки для имени нет, на детском листе нет Kästchen,
  Haken и Sterne; знаки ☐☒☑✓✔★☆ и Emoji запрещены (список — `docs/druck-symbole-liste.md`); без даты и полей по дням. Ankreuzen
  отпадает (Bauauftrag Abschnitt 6); знак ★ запрещён и для звёзд как картинки (п. 10).
- [ ] **Tor 6 — Fakten:** каждое утверждение о праве, деньгах или здоровье — с источником или пометкой «(Eigenentwurf, fachlich
  nicht geprüft)» (счётчик внешних фактов). В Bauauftrag таких утверждений нет; вопрос о защите глаз при наблюдении Солнца —
  п. 10. Утверждения об ESA — Eigenentwurf, fachlich nicht geprüft.
- [ ] **Tor 7 — Vorlesen:** Kinder-App → `vorlesen()` из `kinder-ui` (план, решение 28а); «на каждом экране» — Eigenentwurf, как и
  картинки Луны с `aria-label`.
- [ ] **Tor 8 — Seiten der Quelle:** только с пометкой «maschinell geprüft, noch nicht von einem Menschen geprüft». Проверка:
  `packages/kinderschutz/test/seitenmarke.test.mjs` (22а, Commit f3c8e97): «S. n» в `index.html`, `eltern.html`, `.mjs` или
  `daten/*.json` требует метку «nicht von einem Menschen geprüft» в одном из этих файлов; README и GDD не считаются (проба вне
  репозитория: метка только в README даёт Befund). `quelle.seite` в `daten/himmel.json` («S. 138», «S. 114») уже запускает
  правило, поэтому «номера страниц только в данных, не на листе» (A18, предложение Bauauftrag) не хватает. Метка стоит в Fuß
  страницы (Eigenentwurf; текст — поле `pflichtmarkierung` в данных, как в `puppentheater-werkstatt`); окончательно решает Max /
  Integrator. В `docs/seitenmarke-stand.json` (он только сокращается) новое приложение не вносится.
- [ ] **Tor 9 — keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.**
Правила Bauauftrag и репозитория сверх Tore:
- [ ] Werbefrei, без аккаунтов и покупок; без внешних запросов (docs/02 Z. 22–24): CSP `default-src 'self'` (реализация —
  Eigenentwurf), `installiereNetzwerkWaechter()`; keine Eingabefelder; Privacy by default (ноль запросов привилегий);
  kein Service Worker (решение 9б), Neuladen ohne Netz nicht zugesichert (F4).
- [ ] `eltern.html` (по шаблону GDD; в Bauauftrag не назван — Eigenentwurf) и ссылка `../../impressum.html` в Fuß
  (`packages/kinderschutz/test/impressum-link.test.mjs`).
- [ ] Hilfe-Insel не нужна: Sachthema Natur, взрослый рядом (так в `packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs`).
Особые риски темы (Eigenentwurf; Fachprüfung offen): Beobachtungsblatt — повод для разговора, не задание и не проверка; никаких
сравнений наблюдений между детьми или днями (поэтому без даты); вечерняя прогулка — решение родителей, приложение её не назначает.

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- Рамка адаптации (Quelle: docs/10, «Правовая и этическая рамка адаптации», п. 1, 2, 4): заимствуются только понятия и
  структура, ни одного дословного текста; 5–7 лет — короткие самостоятельные сессии.
  Дальше (Quelle: docs/10): DSGVO Art. 8 (ноль детских данных) и BFSG. Без пометки «проверено человеком» — offen.
- Katalog (docs/10 Z. 453): «Bezug: naturwissenschaftliche Grundbildung» — утверждение Katalog, источником не подтверждено (offen).
  Замена космонавтов на ESA — Eigenentwurf.
- Förder-Fit: keine Angabe в Bauauftrag и Katalog (offen); суммы, сроки и доли не приводятся. Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: Katalog — S. Оценка (Eigenentwurf): Weg B — S–M, по объёму между `puppentheater-werkstatt` (`app.mjs` 94, `logik.mjs` 122,
`druck.css` 70 строк) и `dinge-des-alltags`; Weg A — S (оболочка вроде `mathe-entdecker`, `app.mjs` 31 строка), но карточки, формы
и печать всё равно отдельным кодом. Главная работа — тексты и форма Луны, а не код.
Переиспользуем: `kinder-ui` (`el`, `vorlesen`, `mischen`, `kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`), при Weg A —
`quiz-kern`. Образцы: `puppentheater-werkstatt` (печать, `regeln.test.mjs`), `tierkinder-vorlesen`, `dinge-des-alltags`.
Первый срез (playable, Eigenentwurf): Start с тремя карточками → карточка Mond → вопрос о трёх формах → Erklärung, с Vorlesen;
Mondblatt и Beobachtungsblatt — второй срез.
Abnahme (Bauauftrag Abschnitt 8): `npm test` в папке приложения зелёный; браузер при 360 px; число напечатанных листов равно
выбору. Число тестов называть только после сборки и сверять с `packages/kinderschutz/test/testzahlen.test.mjs`. Регистрацию
(Hub, README, Impressum, `docs/10`, Katalog) делает только Koordinator.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 5–7 лет вместе с родителем (протокол — docs/05, метод 5); результатов нет, это гипотезы (Eigenentwurf):
1. Узнают ли дети формы voll, teilweise и Sichel на картинках без помощи? Не путают ли «teilweise» с «Sichel»?
2. Говорят ли дети после карточек своими словами, когда видно Солнце и когда звёзды (цель 1 без функции в приложении)?
3. Выходит ли семья вечером на улицу? Могут ли дети сами отметить поля Beobachtungsblatt (раскрасить или соединить)? Понимают ли
   слово «Himmelsrichtung»? Не воспринимается ли лист как домашнее задание?
4. Достаточно ли короткого экрана, или дети просят «ещё»? Не звучит ли что-то как оценка?

## 10. Offen / Zweifel
Проверено при составлении: `node tools/bauauftrag-pruefen.mjs` (текстовая копия из `tools/quelle-holen.sh`) даёт для этого
Bauauftrag «ok» (7 цитат); термины и страницы я сверил с текстовой копией ещё раз скриптом. Quelle nicht im Repo prüfbar (в смысле
рабочей ветки): `PRALESKA.pdf` лежит только на `main`, текстовая копия строится вне репозитория; человеком страницы не проверены (A18).

**Widersprüche (Bauauftrag ↔ Katalog ↔ Plan ↔ Code ↔ Tests)**
- Alter: Katalog и Bauauftrag — 5–7 ↔ Quelle: раздел стоит в группе «ПОЧЕМУЧКИ» (S. 138), в текстовой копии младший дошкольный
  возраст (страница с возрастом в Bauauftrag не ведётся). Если верен возраст группы, для 3–5 действуют границы Ko-Nutzung (Gate,
  граница сессии). Цель про космос несёт Sternchen — задача для старших детей группы (Raumfahrt, ниже). Решает Max / Redaktion;
  та же по виду проблема — A20 в `docs/fragen-und-hinweise.md` (Fühl-Werkstatt).
- Zahl der Antworten: Abschnitt 3 («Zwei-Antworten-Frage», «eine von zwei Antworten») ↔ Pseudocode `mondphasenFrage` (верная карта
  плюс два других названия, то есть три варианта) и Test («drei verschiedene Optionen»). Форм Луны ровно три, и Lernziel 2
  сопоставляет все три — этот Entwurf предлагает три варианта (Eigenentwurf); решает Max.
- Lernziel 1 без функции: «когда видно Солнце и когда звёзды» — в Abschnitt 3 нет ни экрана, ни вопроса для этой цели; проверяема
  только Kindertest. Добавить вопрос (Eigenentwurf; ещё Fachprüfung) или оставить карточки?
- Название средней формы: Katalog «halb» ↔ Bauauftrag «teilweise» ↔ источник «неполная» (то есть не полная).
- Katalog: «Beobachtungstagebuch» и «zum Ankreuzen» ↔ запреты на печатном листе: Bauauftrag Abschnitt 3 и 9 предлагает поля без даты
  и раскрашивание или соединение. Решение 10б знает для детских листов ещё нейтральный маркер «Zutreffendes einkreisen» (так в
  `mini-gaertner-begleiter`; список — `docs/druck-symbole-liste.md`). Какой вариант — Max.
- Слово «Sterne»: образец `regeln.test.mjs` из `puppentheater-werkstatt` запрещает `\bSterne?\b` в коде и данных, `leistungs-woerter`
  метит «Stern/Sterne», но заголовок, карточка и источник называют звёзды как содержание. Wertungs-Stand слово не считает.
  Предложение (Eigenentwurf): попадание объяснить в README, шаблон теста для этого приложения изменить.
- Знаки ★ и ☆ в списке запрещённых на листах ↔ звёзды как картинка на Beobachtungsblatt. Предложение (Eigenentwurf): рисовать
  звезду SVG-формой или писать словом, не знаком; подходит ли это к смыслу правила — решает Max.
- Тест-образец ↔ содержание: он запрещает в тексте листа слова «Tag/Tage» и «Datum» — «am Tag» в тексте листа не пройдёт. Тот же
  тест ищет в GDD раздел «## Offen»; здесь он «10. Offen / Zweifel» по заданию — при сборке править тест или заголовок.
- Veraltet nach A7: Bauauftrag Abschnitt 3 и 9 («Der Motor quiz-kern speichert einen Rekord und vergibt Ränge»), 6 («nur nach A7»)
  ↔ шапка Bauauftrag и план (Abschnitt 1): A7 выполнен. По коду: `quiz-kern` ничего не пишет (только `removeItem` старого
  ключа, `quiz.mjs` Z. 56–59), рекорда, очков и рангов нет.
- A1: Bauauftrag Abschnitt 6 — «Modellnamen-Entscheidung A1 bleibt offen» ↔ `docs/fragen-und-hinweise.md`: A1 решён 27.10.2026
  (Max 20а); в новых файлах моделей по-прежнему нет (Tor 9).
- Veraltet nach 21а: Bauauftrag Abschnitt 9 («Favicon (A3)») ↔ `docs/fragen-und-hinweise.md` Z. 9 и Z. 98: A3 решён и выполнен
  (Max 21а, Commit aaa39a8); ждёт только 22а (встроенная иконка, 48-px-Durchgang). Подробнее — в открытых вопросах.
- Seitenmarke: Bauauftrag Abschnitt 6 («dann entfällt die Markierung») ↔ `seitenmarke.test.mjs` (22а): раз `daten/himmel.json`
  несёт «S. 138» и «S. 114», метка нужна в файле приложения, даже если на листах номеров нет (п. 6, Tor 8). Abschnitt 6 править.
- Faktenstand: `docs/bauauftraege/index.json` и `docs/plan-praleska-umsetzung.md` — «nur Katalogtext» ↔ Bauauftrag Abschnitt 1 —
  цитаты и страницы сверены («geprüft»). Метка устарела или говорит о другом.
- Typ: Bauauftrag Abschnitt 1 — «Typ S» ↔ Katalog (`docs/praleska-katalog.json`): Typ content-pack, Aufwand S (docs/10 Z. 223).
  Здесь — по Katalog.
- План ↔ Entwurf: план (Abschnitt 5, Frage 1) рекомендует `quiz-kern`, этот черновик для CON-6 — Weg B (п. 3). Расхождение осознанное.

**Offene Fragen (für Max / Redaktion)**
- Motor: Weg A или Weg B (п. 3) — решение Max.
- Ko-Nutzung: нужны ли Erwachsenen-Gate и граница сессии. Рамка docs/10 (п. 2) для 5–7 лет говорит о коротких самостоятельных
  сессиях; прецеденты идут в обе стороны (п. 3).
- Наблюдение Солнца и глаза: Bauauftrag не содержит никакого предупреждения, а источник (S. 138) ставит наблюдение Солнца. Это
  утверждение о здоровье: нужен ли совет на карточке или на `eltern.html`, и в какой формулировке — только с источником или
  «(Eigenentwurf, fachlich nicht geprüft)». Бытовой совет без источника уже стоит в `fuenf-helfer`. Лист — для вечернего неба,
  не для Солнца.
- Raumfahrt: Bauauftrag Abschnitt 9 («Entscheidung über die Bildauswahl»): брать ли карточку. Цель источника (S. 138) помечена
  Sternchen; метку объясняет сноска группы в текстовой копии: так отмечены задачи для более старших детей группы (собственная
  проверка; страница сноски в Bauauftrag не ведётся, A11 в `docs/fragen-und-hinweise.md` на неё указывает). Две другие цели
  астрономии на S. 138 звёздочки не несут. Для ESA-карты и вопроса о возрасте (группа 3–5 против Katalog 5–7) это значит: космос
  источник адресует старшим детям группы, не всей группе (offen). Текст об ESA — Eigenentwurf, fachlich nicht geprüft.
- Формы Луны: рисунок SVG для экрана и листа; показывать ли «растёт/убывает» (в Bauauftrag нет; без Fachprüfung не брать);
  Emoji на экране зависят от устройства, на листе запрещены.
- Beobachtungsblatt: поле «Himmelsrichtung» пересекается с `kita-kartograph`; поле «Wetter» с `wetter-forscher` — оставить или
  свести к форме Луны.
- Число вопросов и их состав (в Bauauftrag по сути три формы); добавлять ли вопросы о Солнце и звёздах.
- uk и ru: Katalog для этой единицы их не требует; Bauauftrag: «nicht vorhanden, offen».
- Seitenangaben: A18 — метка нужна в приложении, пока в данных стоит «S. n» (Tor 8); открыто, где она стоит (данные и Fuß,
  `eltern.html`, печатные листы) и как поправить Bauauftrag Abschnitt 6; граница цитат A10 (b) — 12 или 6 слов: здесь 6.
- Favicon (A3): решён и выполнен (21а). `index.html` и `eltern.html` берут общий `packages/kinder-ui/img/favicon.svg` в строке
  стилей; другой ссылки Grundgerüst-Test (образец `puppentheater-werkstatt`) не пропускает (Eigenentwurf для новой единицы).
  Ждёт только 22а (встроенная иконка, 48-px-Durchgang). Vorlesen (F2) решено правилом 28а для Kinder-Apps.
- Имя: короткий slug и заголовок для детей и родителей? (offen)
- Fachprüfung текстов карточек (астрономия, язык, возраст) не проводилась.

uk und ru: nicht vorhanden, offen.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
