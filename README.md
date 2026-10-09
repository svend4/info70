# info70 — Kindermedien-Monorepo

Монорепозиторий детских цифровых приложений для немецкого рынка, разрабатываемых
по требованиям и рекомендациям действующих немецких программ поддержки качественного
детского онлайн-контента (BzKJ «Kindgerechte digitale Angebote», критерии fragFINN,
DSGVO Art. 8, JuSchG/JMStV).

## Структура

```
info70/
├── docs/                        Документация (анализ, требования, архитектура, roadmap)
│   ├── 01-analyse.md            Анализ востребованности и выбор приложений
│   ├── 02-anforderungen.md      Политика соответствия: fragFINN, BzKJ, DSGVO
│   ├── 03-architektur.md        Архитектура монорепозитория
│   ├── 04-roadmap.md            Дорожная карта и окна финансирования
│   ├── 05-ideen-pipeline.md     Пайплайн идей и переносимые методы
│   ├── 06-verifikation-2.md     Верификация №2: премии, процессы fragFINN/Seitenstark, Gefährdungsatlas
│   ├── 07-foerder-playbook.md   Плейбук грантовых заявок: механика 80/20, консультации, регионэффекты
│   ├── 08-partner-dossier.md    Партнёрская карта экосистемы для заявки BzKJ-2027
│   ├── 09-baukasten-katalog.md  Каталог №1: 139 производных единиц из немецкого корпуса (+ ideen-katalog.json)
│   ├── 10-praleska-baukasten.md Каталог №2: 131 единица из PDF «Пралеска» (+ praleska-katalog.json)
│   ├── 11-kinderrechte-charta.md Хартия прав ребёнка: карта приложения→статьи UN-KRK/GC25 + само-KRIA (Nachweisbaustein)
│   └── vorlagen/kurz-gdd.md     Шаблон одностраничного GDD для каждой новой единицы
├── apps/                        Приложения (по одной подпапке на тему)
│   ├── nachrichten-detektive/   🕵️ Медиаграмотность: квиз «настоящее или фейк» + Werbe-Radar — MVP готов
│   ├── kinderrechte-entdecker/  🕊️ Права ребёнка (UN-KRK, включая цифровые) — MVP готов
│   ├── feed-forscher/           🔬 Алгоритмы и фильтр-пузырь: симулятор ленты (DE/UK/RU) — MVP готов
│   ├── daten-schatz/            🗝️ Защита данных: сценарный тренажёр — MVP готов
│   ├── kettenbrief-stopper/     🛑 Цепные сообщения: симулятор «останови волну» — MVP готов
│   ├── stark-im-chat/           💪 Против кибербуллинга: тренажёр свидетеля — MVP готов
│   ├── takt-pause/              🚦 Экранное время: светофор и паузы — MVP готов
│   ├── mitmach-arena/           🗳️ Участие и демократия: голосования + Klassen-Koffer — MVP готов
│   ├── geschichten-werkstatt/   ✍️ Творчество с ИИ: конструктор историй (прототип)
│   ├── kriterien-check/         ✅ Self-audit оператора по критериям (для взрослых) — MVP готов
│   └── foerder-navigator/       🧭 Каталог программ поддержки с фильтрами и 80/20-калькулятором (для взрослых) — MVP готов
├── packages/                    Общий код
│   ├── kinder-ui/               UI-компоненты, стили, мини-i18n
│   ├── quiz-kern/               Общий квиз-движок и валидатор банков вопросов
│   └── kinderschutz/            Утилиты соответствия: блокировка внешних запросов, чек-лист критериев
└── tools/
    └── serve.mjs                Локальный dev-сервер без зависимостей
```

## Быстрый старт

Требуется Node.js ≥ 20. Внешние зависимости не используются (это осознанное
решение — см. `docs/02-anforderungen.md`: никаких внешних запросов, трекеров и CDN).

```bash
npm run dev    # локальный сервер на http://localhost:8070
npm test       # тесты (node --test)
```

Приложения открываются по адресам `http://localhost:8070/apps/<имя>/`.

## Статус

**187 приложений (186 рабочих MVP + 1 прототип) + 3 общих пакета.** Первые 11
описаны в docs/01–08; остальные построены из каталогов-конструкторов
([docs/09](docs/09-baukasten-katalog.md) — немецкий корпус,
[docs/10](docs/10-praleska-baukasten.md) — «Пралеска»).

**Общие механизмы (один раз в пакете — работают везде):**

- **`quiz-kern`** — 25 приложений: Klassen-Modus (одна проекция на класс, без
  устройств и данных учеников), Duett-Modus (двое по очереди, затем сравнение) и
  Geschwister-Staffel (двое как одна команда).
- **Hilfe-Insel (116 111)** — 65 детских приложений. Охват задан критерием, а не
  на глаз: приложения с темами риска, прав ребёнка и чувств — да; предметное
  обучение, печатные генераторы и инструменты для взрослых — намеренно нет.
  Закреплено тестом `packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs`
  с выписанным обоснованием по каждому исключению.
- **Daten-Karte** — удаление данных одной кнопкой во всех 77 приложениях, которые
  вообще что-то хранят. Удаляются **только свои** ключи: `localStorage.clear()`
  снёс бы и настройку контраста/шрифта (BFSG), и данные соседних приложений.
- **Anzeige-Einstellungen** (hoher Kontrast + размер шрифта, BFSG) в `kinder-ui`.
- `kinder-ui` **RTL-готов** (логические CSS-свойства + `richtung.mjs`).
- Мультиязычность: `feed-forscher` — de/en/uk/ru + Leichte Sprache,
  `elternabend-kit` — de/en/uk/ru, `kettenbrief-stopper` — de/en + Leichte Sprache.

**Проверки.** Полный прогон: **1393 теста**. CI
(`.github/workflows/test.yml`) гоняет весь набор плюс запрет внешних URL и
сторонних пакетов. Тестами закреплены не только логика, но и обещания: a11y-аудит
всех страниц, соответствие текста Datenschutz-страницы реализации и охват
Hilfe-Insel.

**Sicher im Netz — дети 8–12 (цифровые риски):**

| Приложение | Тема | Из чего |
|---|---|---|
| `nachrichten-detektive` | Медиаграмотность + Werbe-Radar + KI-Radar (30 дел) | база |
| `nachrichten-detektive-junior` | «Echt oder ausgedacht?» для 6–8, озвучка (BFSG) | кат.№1 |
| `nachrichten-detektive-profi` | 13–15: дипфейки, KI-тексты, Quellencheck (quiz-kern) | Ось A |
| `koeder-quiz` | Фишинг: «настоящее или наживка?» | кат.№1 |
| `fake-shop-fahnder` | Фейк-магазины: 5 warning-signals | кат.№1 |
| `seiten-scanner` | Детский чек-лист сайта со светофором | кат.№1 |
| `chat-check` | Функции чата: Moderation/Melden/Spitzname | кат.№1 |
| `formular-falle` | Формы: какие данные не давать (Adresse/Foto) | кат.№1 |
| `link-kompass` | Типы ссылок и проверка перед кликом | кат.№1 |
| `wer-dahinter` | Автор/дата/источник — проверяемость | кат.№1 |
| `deepfake-studio` | Собери фейк — разоблачи его (AI Act) | кат.№1 |
| `feed-forscher` | Алгоритмы, фильтр-пузырь · DE/EN/UK/RU | база |
| `feed-forscher-profi` | Радикализация рекомендаций: спираль остроты (13–15) | кат.№1 |
| `blasen-duell` | Split-Screen: два ребёнка → два разных фида (личный алгоритм) | Ось G |
| `dark-pattern-labyrinth` | Тёмные паттерны интерфейсов (DSA) | кат.№1 |
| `dark-pattern-detektiv` | Назвать манипулятивный паттерн | кат.№1 |
| `app-rechte-quiz` | Разрешение vs задача приложения | кат.№1 |
| `deepfake-spuernase` | KI-фейки: руки/свет/текст/источник | кат.№1 |
| `anzeige-oder-nicht` | Инфлюенсер-реклама: #anzeige/Merch/Affiliate | кат.№1 |
| `lootbox-labor` | Лутбоксы с открытыми вероятностями | кат.№1 |
| `muenz-trick` | Игровая валюта: настоящая цена и «остаток» | кат.№1 |
| `impressum-detektive` | Кто стоит за сайтом? (DDG §5/MStV §18) | кат.№1 |
| `fomo-kompass` | Страх упустить: Streak/Autoplay/Likes | кат.№1 |
| `bot-oder-buddy` | Приёмы «дружелюбного» ИИ-чат-бота | кат.№1 |
| `daten-schatz` | Datenschutz + Kostenfallen + Account + Familie (30 сцен.) | база |
| `daten-schatz-mini` | 6–8: «geheim или öffentlich?», пиктограммы, озвучка | Ось A |
| `spuren-lupe` | Пассивный трекинг локально: следы без ввода | кат.№1 |
| `darf-ich-posten` | Право на изображение и авторское право | кат.№1 |
| `foto-ampel` | Семья: Ампель перед публикацией фото (согласие, фон) | кат.№1 |
| `familien-datenschatz` | Семья: szenario-дуэт (ребёнок+родители сравнивают), надзор как вопрос приватности Art. 16 | Ось F |
| `generationen-quiz` | Внуки+бабушки: одинаковые схемы обмана (14 вопр.) | кат.№1 |
| `familien-notfall-fahrplan` | Семья: печатный Wenn-dann план (116 111, juuuport) | кат.№1 |
| `sharenting-spiegel` | Родители: self-test про фото детей + Foto-Regeln | кат.№1 |
| `passwort-pruefstand` | Стойкость пароля, метод трёх слов | кат.№1 |
| `kettenbrief-stopper` | Цепные сообщения/челлендж/слух · DE/EN + Leichte Sprache | база |
| `stark-im-chat` | Кибербуллинг: свидетель + Rechte + Hassrede + Game-Chat (28 сцен.) | база |
| `stark-im-chat-plus` | Свидетель 13+: групповой чат и пути DSA | кат.№1 |
| `stark-im-chat-mini` | 6–8: нежность в чате, Leichte Sprache, 2 ответа | Ось A |
| `spiral-stopper` | Эскалация хейта: сила Gegenrede и Melden | кат.№1 |
| `challenge-druck` | Групповое давление: 5 тактик + фразы выхода | кат.№1 |
| `beschwerde-lotse` | «Что случилось → куда обращаться» (DSA/116 111) | кат.№1 |
| `sog-maschine` | Механики залипания: Autoplay/Streak/награды | кат.№1 |
| `daten-radiergummi` | Право на удаление: сила и граница (Art. 17) | кат.№1 |
| `verschwoerungs-werkstatt` | Prebunking теорий заговора (13–15) | кат.№1 |
| `filter-spiegel` | Бьюти-фильтры: комикс-аватар без камеры (13–15) | кат.№1 |
| `takt-pause` | Экранное время: самонаблюдение + Wochen-Rückblick | база |
| `spiel-recht-balance` | Баланс трёх прав (Art. 31), самрегуляция | кат.№1 |

**Stark werden / Familie — дети и семья:**

| Приложение | Тема | Из чего |
|---|---|---|
| `kinderrechte-entdecker` | Права ребёнка: Schutz/Förderung/Beteiligung/Digital (51 вопр.) | база |
| `rechte-kompass` | Высказать своё право: Mut-Sätze по статьям KRK | кат.№1 |
| `rechte-lexikon` | Kinderrechte в Leichte Sprache + Vorlesen (справочник) | Ось B |
| `rechte-stationen` | Учителю: Stationenlernen «Deine Rechte, dein Netz» (печать) | Ось B |
| `klassenrat-handbuch` | Учителю: как вести классный совет (роли, ход, Koffer) | Ось B |
| `chat-rechte` | Права в чате: свобода И ответственность | кат.№1 |
| `kinderrat` | Режим заседания: повестка, голосование, протокол | кат.№1 |
| `barriere-detektive` | Доступность = честность: чек-лист + рейтинг | кат.№1 |
| `mitmach-arena` | Teilhabe + Klassen-Koffer + Klassenrat-Vorlagen | база |
| `ergebnis-plakat` | Результат голосования → большое печатное плакат (класс) | Ось G |
| `quiz-karten-druck` | Печатная колода карт из данных викторин (аналог без планшетов) | Ось H |
| `starke-zuege-poster` | A3-плакаты «Drei starke Züge» из сценариев (на стену) | Ось H |
| `anzeige-einstellungen` | Hoher Kontrast + размер шрифта (BFSG), действует во всех приложениях | Ось H |
| `ich-schaff-das` | Воля/самрегуляция (сценарии) | кат.№2 |
| `stark-und-gesund` | Здоровый образ жизни (ВОЗ/DGE) | кат.№2 |
| `geschichten-werkstatt` | Kreativität / KI + штамп + Bausteine «Mut & Anderssein» | 🧪 прототип |
| `gefuehle-entdecker` | Эмоции для 5–7 лет | кат.№2 |
| `reim-radar` | Фонологика 4–6 (рифмы/звуки/слоги), quiz-kern | кат.№2 |
| `sicher-unterwegs` | Безопасность 5–7: улица/огонь/112/110, szenario 2/1/0 | кат.№2 |
| `notruf-held` | Симулятор набора 112/110 (5–7), без реального звонка | кат.№2 |
| `mathe-entdecker` | Ранняя математика 5–7 (множества/формы/ряды), quiz-kern | кат.№2 |
| `freunde-in-der-gruppe` | Соц-тренажёр 5–7 (делиться/спор/чувства), szenario 2/1/0 | кат.№2 |
| `autonomiephase-navigator` | Для родителей: «упрямый возраст», баланс требования/участия, szenario | кат.№2 |
| `mini-rechte-entdecker` | Права для 6–8: ja/нет, озвучка (BFSG) | кат.№1 |
| `plattform-rechte-13` | Права на платформах 13–15 (DSA/DSGVO/AI Act), 14 вопр. | кат.№1 |
| `smarte-ohren` | Говорящие устройства (6–8, Leichte Sprache) | кат.№1 |
| `regel-werkstatt` | Класс сам делает медиаправила (печать/Koffer) | кат.№1 |
| `familien-medienvertrag` | Семейный медиадоговор (Eltern+Kind) | кат.№1 |
| `familienrat` | Семья: открытое голосование + Familienbeschluss + Koffer | Ось F |
| `familien-bildschirmzeit` | Семья: собственные Ampel-цели, самоотчёт (не слежка) | Ось F |
| `gemeinsam-gesund-essen` | Ко-приложение 3–5 (со взрослым) | кат.№2 |
| `berechtigungs-safari` | Семейная охота по разрешениям приложений | кат.№1 |
| `spiele-kauf-kompass` | Семья: чек-лист перед покупкой игры (USK/чат/лутбокс) | кат.№1 |
| `eltern-sammelband` | Все Eltern-Kompass одной брошюрой (печать) | кат.№1 |

**Kita & Fachkräfte / Betreiber — взрослые (локально, без детских данных):**

| Приложение | Тема | Из чего |
|---|---|---|
| `entwicklungs-kompass` | Лист наблюдения развития (Kita) | кат.№2 |
| `schulstart-begleiter` | Лист наблюдения школьной зрелости (5×6, кюрцель, без скоринга) | кат.№2 |
| `eingewoehnungs-tagebuch` | Светофорный журнал адаптации (Berliner/Münchener), кюрцель, Koffer | кат.№2 |
| `meilenstein-begleiter` | Для родителей: вехи 1-го года (U3–U6) → подготовка к педиатру | кат.№2 |
| `sprich-mit-mir` | Для родителей: доречевой диалог 0–1, порядок по сигналу ребёнка | кат.№2 |
| `bewegungs-kartei-erstes-jahr` | Для родителей: 1-й год — взрослый готовит среду, движение делает ребёнок | кат.№2 |
| `sicherer-krabbelraum-check` | Для родителей/яслей: чек-лист помещения 0–1, без общей оценки | кат.№2 |
| `musikmomente-1-3` | Для взрослых: слушать музыку с ребёнком 1–3; свобода прав вычисляется | кат.№2 |
| `herkunftssprachen-bruecke` | de/ru/uk: слова-мосты и ложные друзья, quiz-kern (8–12) | кат.№2 |
| `familienschatz-reime` | Для родителей: потешки/колыбельные + свой семейный сундук | кат.№2 |
| `vorlese-kompass` | Для родителей: диалогическое чтение 1–3, метод 7 шагов | кат.№2 |
| `bewegungspausen-generator` | Физкультминутки 7–10 мин: генератор со стишками, печать | кат.№2 |
| `elternbrief-generator` | Письма родителям яслей: «что осваивает» + игры без экрана | кат.№2 |
| `sprachbruecken-impulskarten` | de/uk/ru карточки речевых импульсов для быта Kita, печать | кат.№2 |
| `erzaehl-bruecke` | Устный рассказ 5–8: каркас-лесенка, без микрофона/записи | кат.№2 |
| `klang-detektive` | Слуховой квиз 3–7 (WebAudio, звук в браузере) | кат.№2 |
| `nahrungsnetz-werkstatt` | Симулятор экосистемы 8–12 (BNE), один шаг, Rote Liste | кат.№2 |
| `jahreszeiten-rad` | Годовой круг 5–12: свет/животные/растения + квиз | кат.№2 |
| `familien-budget` | Бюджет семьи 8–12: потребности/желания/копилка, игровые € | кат.№2 |
| `uhr-und-kalender-kind` | Часы (CSS-циферблат, halb/Viertel) и календарь 5–7 | кат.№2 |
| `erste-woerter-lesewerkstatt` | Первое чтение 5–7: слоговой метод, lautgetreu, картинка-самоконтроль | кат.№2 |
| `mess-labor` | 8 измерительных экспериментов: гипотеза→опыт без экрана→вывод | кат.№2 |
| `schwungblatt-generator` | Графомоторные листы для печати (SVG локально, 3 ступени) | кат.№2 |
| `mini-gaertner-begleiter` | Сезонный планер Kita-огорода + печатный дневник растений | кат.№2 |
| `kita-familien-bruecke` | Командный само-чек Erziehungspartnerschaft (светофор, меры, отчёт) | кат.№2 |
| `wer-wohnt-wo` | Четыре среды обитания как «дома»: этажи леса, сезоны, гость-квиз | кат.№2 |
| `tier-zu-gast` | Сценарный тренер ответственности за домашних животных (2/1/0) | кат.№2 |
| `tonleiter-treppe` | Нотная «лесенка»: тетрахорды, слуховой квиз, повтор (WebAudio) | кат.№2 |
| `rhythmus-orchester` | Ритм телом: ta/ti-ti/пауза, 5 своих стихов, оркестр в 3 партии (WebAudio) | кат.№2 |
| `ornament-werkstatt` | Узор и симметрия: 4 правила продолжения + 5 шаблонов с зеркалом | кат.№2 |
| `mensch-tier-pflanze` | Признаки живого: что общего у человека, животного и растения | кат.№2 |
| `koerper-entdecker` | Что у тебя внутри: сердце, лёгкие, скелет, мышцы, кожа, рост | кат.№2 |
| `hoeflich-fair` | Речевой этикет: поблагодарить, извиниться — и вежливо сказать «нет» | кат.№2 |
| `gesunder-koerper-ampel` | Самонаблюдение за днём по 5 факторам — без баллов и рангов | кат.№2 |
| `erfinder-werkstatt` | 96 заданий на переделку вещей + бионика: подсмотрено или только похоже | кат.№2 |
| `deutschland-kompass` | План двора, стороны света, карта Германии и мира | кат.№2 |
| `maerchen-gedicht-fabel` | Семь текстовых жанров по собственным примерам | кат.№2 |
| `reim-werkstatt` | Семьи рифм, загадки и чепуховые рифмы — сочиняет ребёнок | кат.№2 |
| `kunst-entdecker` | Жанры и виды искусства на 9 работах музея (CC0, встроены) | кат.№2 |
| `warum-heisst-das-so` | Говорящие названия — и те, что обманывают | кат.№2 |
| `dinge-des-alltags` | Мир вещей для 3–5 только со взрослым: сделано или выросло | кат.№2 |
| `fuenf-helfer` | Пять чувств + инклюзия (очки, слуховой аппарат, жестовый язык) | кат.№2 |
| `wetter-forscher` | Дневник погоды: считаем погоду, а не ребёнка | кат.№2 |
| `wie-bewegt-sich` | 4 правила «строение → движение» + честное исключение | кат.№2 |
| `woerter-sortierer` | Обобщения, противоположности, слова с двумя значениями | кат.№2 |
| `kita-kartograph` | План комнаты сверху; легенда собирается сама | кат.№2 |
| `grammatik-zwerge` | Слова места, мн. число, сложные слова; «vor/hinter» заблокированы | кат.№2 |
| `musik-detektive` | Песня, марш или танец — своя музыка в браузере | кат.№2 |
| `design-entdecker` | Польза, договорённость и вкус — три разных вида вопросов | кат.№2 |
| `farb-labor` | Два места — два результата: экран складывает свет, краска вычитает | кат.№2 |
| `tischdienst-trainer` | Накрыть и раздать: единственно верного порядка не бывает | кат.№2 |
| `tier-tanz-impulse` | Импульс движения: что животное делает вправду, а что мы договорились | кат.№2 |
| `geschichten-wender` | Перестроить готовую историю — образцового решения не бывает | кат.№2 |
| `wohlfuehl-ampel` | Светофор эмоционального благополучия | кат.№2 |
| `gruppenklima-check` | Климат группы (без социограмм) | кат.№2 |
| `kita-wochenplaner` | Планировщик занятий + печать | кат.№2 |
| `bewegungs-schatzkiste` | Картотека игр движения (печать) | кат.№2 |
| `staerken-tagebuch` | Дневник сильных сторон (родители) | кат.№2 |
| `selbstcheck-paedagogik` | Самрефлексия педагога | кат.№2 |
| `aemtli-rad` | Школа: честная ротация дежурств (прозрачный алгоритм) | кат.№1 |
| `jugendschutz-quiz-fachkraefte` | Квиз для педагогов: USK/FSK, риски, § 24a (14 вопр.) | кат.№1 |
| `lehrkraefte-szenariotraining` | Тренажёр учителя: цифровые ЧП + Meldewege (2/1/0) | кат.№1 |
| `projektwoche` | Проектная неделя «Sicher im Netz»: 5×90 мин (школа) | кат.№1 |
| `wahlkabine` | Режим избирательной кабины: опечатанные голоса, ничья | кат.№205 |
| `stundenentwurf-chat` | Разработка урока «Worte wie Fäuste»: буллинг, 90 мин (печать) | кат.№197 |
| `stundenentwurf-datenschatz` | Разработка урока «Mein Datenschatz»: данные, 90 мин (печать) | кат.№198 |
| `stundenentwurf-feed` | Разработка урока «Mein Feed, deine Blase»: алгоритмы, 90 мин | Ось E |
| `stundenentwurf-kettenbrief` | Разработка урока «Stopp die Kette»: цепочки, 45 мин | Ось E |
| `stundenentwurf-nachrichten` | Разработка урока «Echt oder Fake?»: новости/дипфейки, 90 мин | Ось E |
| `stundenentwurf-bildschirmwoche` | Разработка урока «Meine Bildschirmwoche»: медианеделя, 45 мин | Ось E |
| `klassen-koffer-auswertung` | Учителю: импорт анонимных результатов → heatmap класса | Ось E |
| `stations-konfigurator` | Учителю: учебные станции, deep-ссылки, маршрутный лист | Ось E |
| `oer-vorlage` | OER-шаблон (CC-BY) конспекта: растр фаз, NRW/KMK, схема, бланк | Ось E |
| `schulfreigabe-dossier` | DSB школы: досье «Null-Daten-Nachweis» (печать) | Ось E |
| `leichte-sprache-werkstatt` | Инклюзия: рабочие листы на Лёгком языке + Vorlesen (BFSG) | Ось E |
| `elternabend-kit` | Родительский вечер 60 мин + раздатка de/en/uk/ru | кат.№1 |
| `kriterien-check` | Self-audit оператора + экспорт .txt/.json/печать | база |
| `eltern-rechtebriefe` | Шаблоны писем DSGVO (Art. 15/17/7), имя не хранится | кат.№1 |
| `fragfinn-selbsttest` | Критерии whitelist fragFINN + отчёт | кат.№1 |
| `impressum-generator` | Форма→Impressum (Text/HTML), § 5 DDG/§18 MStV | кат.№1 |
| `datenschutz-baukasten` | Форма→2 текста: DSGVO-декларация + детская версия (Art. 12) | кат.№1 |
| `ki-transparenz-check` | Self-check по AI Act (Art. 5/50) + отчёт | кат.№1 |
| `ki-kennzeichnungs-generator` | Форма→текст+HTML-бейдж маркировки ИИ (Art. 50), de/uk/ru | кат.№1 |
| `meldewege-planer` | Детский путь жалобы: тексты de/uk/ru + Prozess-Doku (DSA/JuSchG) | кат.№1 |
| `seitenstark-qualitaets-check` | Критерии качества Seitenstark → Maßnahmenplan | кат.№1 |
| `interaktions-konzept-assistent` | Функция взаимодействия → требования + Moderationskonzept | кат.№1 |
| `dsa-selbstaudit` | Защита несовершеннолетних по DSA, светофор + Ampel-Bericht | кат.№1 |
| `einwilligungs-pruefpfad` | Прошагово согласие по Art. 8 DSGVO (16 лет, родители, верификация) → Prüfbericht + Lücken | кат.№1 |
| `bfsg-check` | Доступность + офлайн-калькулятор контраста WCAG | кат.№1 |
| `barrierefreiheitserklaerung-generator` | Форма/импорт BFSG → Erklärung zur Barrierefreiheit (md/html) | кат.№1 |
| `leichte-sprache-pruefhilfe` | Правило-анализ текста (длина, пассив, номин., иностр.) → подсказки, DIN SPEC 33429, без ИИ | кат.№1 |
| `vorsorge-check-juschg` | § 24a JuSchG: меры предосторожности, светофор + Ampel-Bericht | кат.№1 |
| `eltern-kompass-generator` | Форма→готовая «Für Eltern»-страница (eltern.html) | кат.№1 |
| `link-inventar-pruefer` | Импорт HTML → извлечение/проверка внешних ссылок (без сети) | кат.№1 |
| `avv-checkliste-hosting` | Хостинг/AVV по Art. 28 DSGVO → Lücken-Bericht | кат.№1 |
| `jmstv-einstufungs-helfer` | Возрастная ступень по JMStV (ab 0/6/12/16/18) + генерация age-de.xml-Label | кат.№1 |
| `dark-pattern-selbstinspektion` | Проверка своего UI на тёмные паттерны (12 шт.): находка→мера устранения | кат.№1 |
| `compliance-koffer` | Сбор отчётов всех проверок в одну аудит-папку (.json) + общий отчёт, Klassen-Koffer | кат.№1 |
| `beschwerde-brief-werkstatt` | Дети 8–12: письмо/петиция (Schulleitung/Bundestag), имя не хранится | кат.№1 |
| `barriere-spuernasen` | Дети 8–12: симулятор доступности (контраст/шрифт/озвучка/alt) | кат.№1 |
| `werbekennzeichnung` | Предпросмотр маркировки рекламы + HTML | кат.№1 |
| `kria-check` | Оценка последствий для прав ребёнка (GC25) | кат.№1 |
| `erstes-handy-kompass` | Чек-лист передачи телефона + грамота | кат.№1 |
| `netz-pass-urkunde` | Станции безопасности + печать грамоты (6–12, имя не хранится) | кат.№1 |
| `ombuds-landkarte` | Карта инстанций для родителей (§9a SGB VIII, DSA) | кат.№1 |
| `foerder-navigator` | Каталог грантов + 80/20-калькулятор | база |
| `fristen-radar` | Сроки подачи по датам + экспорт .ics (локально) | кат.№1 |

У каждого детского приложения есть страница для родителей (`eltern.html`,
метод «Eltern-Kompass») — ссылка «👪 Für Eltern» в подвале. Единая витрина —
корневой `index.html`.

## Принципы разработки (кратко)

1. **Werbefrei** — без рекламы, покупок и подписок.
2. **Datensparsamkeit** — никаких аккаунтов, трекеров и внешних запросов; данные только в `localStorage` устройства.
3. **Mobile First** — интерфейс проектируется от смартфона (требование BzKJ).
4. **Altersgerecht** — язык и интерфейс для 8–12 лет, крупные элементы, озвучивание текста.
5. **Offen** — AGPL-3.0, открытый код.

Полная политика — в [docs/02-anforderungen.md](docs/02-anforderungen.md).
