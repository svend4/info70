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

**35 приложений (34 рабочих MVP + 1 прототип) + 3 общих пакета.** Первые 11
описаны в docs/01–08; остальные построены из каталогов-конструкторов
([docs/09](docs/09-baukasten-katalog.md) — немецкий корпус,
[docs/10](docs/10-praleska-baukasten.md) — «Пралеска»). Все 4 квиза имеют
**Klassen-Modus** (одна проекция на класс, без устройств и данных учеников).
Полный прогон: 246 тестов.

**Sicher im Netz — дети 8–12 (цифровые риски):**

| Приложение | Тема | Из чего |
|---|---|---|
| `nachrichten-detektive` | Медиаграмотность + Werbe-Radar + KI-Radar (30 дел) | база |
| `koeder-quiz` | Фишинг: «настоящее или наживка?» | кат.№1 |
| `deepfake-studio` | Собери фейк — разоблачи его (AI Act) | кат.№1 |
| `feed-forscher` | Алгоритмы, фильтр-пузырь · DE/UK/RU | база |
| `dark-pattern-labyrinth` | Тёмные паттерны интерфейсов (DSA) | кат.№1 |
| `lootbox-labor` | Лутбоксы с открытыми вероятностями | кат.№1 |
| `bot-oder-buddy` | Приёмы «дружелюбного» ИИ-чат-бота | кат.№1 |
| `daten-schatz` | Datenschutz + Kostenfallen (18 сценариев) | база |
| `passwort-pruefstand` | Стойкость пароля, метод трёх слов | кат.№1 |
| `kettenbrief-stopper` | Цепные сообщения | база |
| `stark-im-chat` | Кибербуллинг: роль свидетеля | база |
| `spiral-stopper` | Эскалация хейта: сила Gegenrede и Melden | кат.№1 |
| `challenge-druck` | Групповое давление: 5 тактик + фразы выхода | кат.№1 |
| `beschwerde-lotse` | «Что случилось → куда обращаться» (DSA/116 111) | кат.№1 |
| `sog-maschine` | Механики залипания: Autoplay/Streak/награды | кат.№1 |
| `daten-radiergummi` | Право на удаление: сила и граница (Art. 17) | кат.№1 |
| `verschwoerungs-werkstatt` | Prebunking теорий заговора (13–15) | кат.№1 |
| `takt-pause` | Экранное время: самонаблюдение | база |

**Stark werden / Familie — дети и семья:**

| Приложение | Тема | Из чего |
|---|---|---|
| `kinderrechte-entdecker` | Права ребёнка + Digitale Rechte (20 вопр.) | база |
| `mitmach-arena` | Teilhabe + Klassen-Koffer | база |
| `ich-schaff-das` | Воля/самрегуляция (сценарии) | кат.№2 |
| `stark-und-gesund` | Здоровый образ жизни (ВОЗ/DGE) | кат.№2 |
| `geschichten-werkstatt` | Kreativität / KI | 🧪 прототип |
| `gefuehle-entdecker` | Эмоции для 5–7 лет | кат.№2 |
| `familien-medienvertrag` | Семейный медиадоговор (Eltern+Kind) | кат.№1 |
| `gemeinsam-gesund-essen` | Ко-приложение 3–5 (со взрослым) | кат.№2 |

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
| `kriterien-check` | Self-audit оператора | база |
| `foerder-navigator` | Каталог грантов + 80/20-калькулятор | база |

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
