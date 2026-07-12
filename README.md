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

| Приложение | Тема | Статус |
|---|---|---|
| `nachrichten-detektive` | Nachrichtenkompetenz + Werbe-Radar (22 дела) | ✅ рабочий MVP |
| `kinderrechte-entdecker` | Права ребёнка, Demokratiefähigkeit | ✅ рабочий MVP |
| `feed-forscher` | Алгоритмы, фильтр-пузырь · DE/UK/RU | ✅ рабочий MVP |
| `daten-schatz` | Datenschutz + Kostenfallen (18 сценариев) | ✅ рабочий MVP |
| `kettenbrief-stopper` | Цепные сообщения, страхи в сети | ✅ рабочий MVP |
| `stark-im-chat` | Кибербуллинг: роль свидетеля, помощь | ✅ рабочий MVP |
| `takt-pause` | Экранное время: самонаблюдение, паузы | ✅ рабочий MVP |
| `mitmach-arena` | Teilhabe + Klassen-Koffer (сбор голосов файлом) | ✅ рабочий MVP |
| `kriterien-check` | Self-audit оператора (для взрослых) | ✅ рабочий MVP |
| `foerder-navigator` | Каталог грантов/премий + 80/20-калькулятор (для взрослых) | ✅ рабочий MVP |
| `geschichten-werkstatt` | Kreativität / KI | 🧪 прототип |

У каждого детского приложения есть страница для родителей (`eltern.html`,
метод «Eltern-Kompass») — ссылка «👪 Für Eltern» в подвале.

## Принципы разработки (кратко)

1. **Werbefrei** — без рекламы, покупок и подписок.
2. **Datensparsamkeit** — никаких аккаунтов, трекеров и внешних запросов; данные только в `localStorage` устройства.
3. **Mobile First** — интерфейс проектируется от смартфона (требование BzKJ).
4. **Altersgerecht** — язык и интерфейс для 8–12 лет, крупные элементы, озвучивание текста.
5. **Offen** — AGPL-3.0, открытый код.

Полная политика — в [docs/02-anforderungen.md](docs/02-anforderungen.md).
