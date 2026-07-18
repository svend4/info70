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

**102 приложения (101 рабочий MVP + 1 прототип) + 3 общих пакета.** Первые 11
описаны в docs/01–08; остальные построены из каталогов-конструкторов
([docs/09](docs/09-baukasten-katalog.md) — немецкий корпус,
[docs/10](docs/10-praleska-baukasten.md) — «Пралеска»). Все 4 квиза имеют
**Klassen-Modus** (одна проекция на класс, без устройств и данных учеников).
Пакет `kinder-ui` содержит **переключатель Leichte Sprache** (локаль `de-ls`,
BFSG) — включён в `feed-forscher`; любое приложение получает его, добавив
`-ls`-каталог. Также есть общий блок **Hilfe-Insel** (116 111) в `kinder-ui`.
Полный прогон: 624 теста.

**Sicher im Netz — дети 8–12 (цифровые риски):**

| Приложение | Тема | Из чего |
|---|---|---|
| `nachrichten-detektive` | Медиаграмотность + Werbe-Radar + KI-Radar (30 дел) | база |
| `nachrichten-detektive-junior` | «Echt oder ausgedacht?» для 6–8, озвучка (BFSG) | кат.№1 |
| `koeder-quiz` | Фишинг: «настоящее или наживка?» | кат.№1 |
| `fake-shop-fahnder` | Фейк-магазины: 5 warning-signals | кат.№1 |
| `seiten-scanner` | Детский чек-лист сайта со светофором | кат.№1 |
| `chat-check` | Функции чата: Moderation/Melden/Spitzname | кат.№1 |
| `formular-falle` | Формы: какие данные не давать (Adresse/Foto) | кат.№1 |
| `link-kompass` | Типы ссылок и проверка перед кликом | кат.№1 |
| `wer-dahinter` | Автор/дата/источник — проверяемость | кат.№1 |
| `deepfake-studio` | Собери фейк — разоблачи его (AI Act) | кат.№1 |
| `feed-forscher` | Алгоритмы, фильтр-пузырь · DE/UK/RU | база |
| `feed-forscher-profi` | Радикализация рекомендаций: спираль остроты (13–15) | кат.№1 |
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
| `spuren-lupe` | Пассивный трекинг локально: следы без ввода | кат.№1 |
| `darf-ich-posten` | Право на изображение и авторское право | кат.№1 |
| `foto-ampel` | Семья: Ампель перед публикацией фото (согласие, фон) | кат.№1 |
| `generationen-quiz` | Внуки+бабушки: одинаковые схемы обмана (14 вопр.) | кат.№1 |
| `familien-notfall-fahrplan` | Семья: печатный Wenn-dann план (116 111, juuuport) | кат.№1 |
| `sharenting-spiegel` | Родители: self-test про фото детей + Foto-Regeln | кат.№1 |
| `passwort-pruefstand` | Стойкость пароля, метод трёх слов | кат.№1 |
| `kettenbrief-stopper` | Цепные сообщения | база |
| `stark-im-chat` | Кибербуллинг: свидетель + Rechte + Hassrede + Game-Chat (28 сцен.) | база |
| `stark-im-chat-plus` | Свидетель 13+: групповой чат и пути DSA | кат.№1 |
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
| `chat-rechte` | Права в чате: свобода И ответственность | кат.№1 |
| `kinderrat` | Режим заседания: повестка, голосование, протокол | кат.№1 |
| `barriere-detektive` | Доступность = честность: чек-лист + рейтинг | кат.№1 |
| `mitmach-arena` | Teilhabe + Klassen-Koffer | база |
| `ich-schaff-das` | Воля/самрегуляция (сценарии) | кат.№2 |
| `stark-und-gesund` | Здоровый образ жизни (ВОЗ/DGE) | кат.№2 |
| `geschichten-werkstatt` | Kreativität / KI + штамп + Bausteine «Mut & Anderssein» | 🧪 прототип |
| `gefuehle-entdecker` | Эмоции для 5–7 лет | кат.№2 |
| `mini-rechte-entdecker` | Права для 6–8: ja/нет, озвучка (BFSG) | кат.№1 |
| `plattform-rechte-13` | Права на платформах 13–15 (DSA/DSGVO/AI Act), 14 вопр. | кат.№1 |
| `smarte-ohren` | Говорящие устройства (6–8, Leichte Sprache) | кат.№1 |
| `regel-werkstatt` | Класс сам делает медиаправила (печать/Koffer) | кат.№1 |
| `familien-medienvertrag` | Семейный медиадоговор (Eltern+Kind) | кат.№1 |
| `gemeinsam-gesund-essen` | Ко-приложение 3–5 (со взрослым) | кат.№2 |
| `berechtigungs-safari` | Семейная охота по разрешениям приложений | кат.№1 |
| `spiele-kauf-kompass` | Семья: чек-лист перед покупкой игры (USK/чат/лутбокс) | кат.№1 |
| `eltern-sammelband` | Все Eltern-Kompass одной брошюрой (печать) | кат.№1 |

**Kita & Fachkräfte / Betreiber — взрослые (локально, без детских данных):**

| Приложение | Тема | Из чего |
|---|---|---|
| `entwicklungs-kompass` | Лист наблюдения развития (Kita) | кат.№2 |
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
| `elternabend-kit` | Родительский вечер 60 мин + раздатка de/uk/ru | кат.№1 |
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
| `bfsg-check` | Доступность + офлайн-калькулятор контраста WCAG | кат.№1 |
| `barrierefreiheitserklaerung-generator` | Форма/импорт BFSG → Erklärung zur Barrierefreiheit (md/html) | кат.№1 |
| `vorsorge-check-juschg` | § 24a JuSchG: меры предосторожности, светофор + Ampel-Bericht | кат.№1 |
| `eltern-kompass-generator` | Форма→готовая «Für Eltern»-страница (eltern.html) | кат.№1 |
| `link-inventar-pruefer` | Импорт HTML → извлечение/проверка внешних ссылок (без сети) | кат.№1 |
| `avv-checkliste-hosting` | Хостинг/AVV по Art. 28 DSGVO → Lücken-Bericht | кат.№1 |
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
