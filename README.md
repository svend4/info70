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
│   └── 04-roadmap.md            Дорожная карта и окна финансирования
├── apps/                        Приложения (по одной подпапке на тему)
│   ├── nachrichten-detektive/   🕵️ Медиаграмотность: квиз «настоящее или фейк» (8–12 лет) — MVP готов
│   ├── mitmach-arena/           🗳️ Участие и демократия: голосования класса (прототип)
│   └── geschichten-werkstatt/   ✍️ Творчество с ИИ: конструктор историй (прототип)
├── packages/                    Общий код
│   ├── kinder-ui/               UI-компоненты и стили для детских интерфейсов
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

Приложения открываются по адресам:

- http://localhost:8070/apps/nachrichten-detektive/
- http://localhost:8070/apps/mitmach-arena/
- http://localhost:8070/apps/geschichten-werkstatt/

## Статус

| Приложение | Тема | Статус |
|---|---|---|
| `nachrichten-detektive` | Nachrichtenkompetenz (медиаграмотность) | ✅ рабочий MVP |
| `mitmach-arena` | Teilhabe / Demokratiefähigkeit | 🧪 прототип |
| `geschichten-werkstatt` | Kreativität / KI | 🧪 прототип |

## Принципы разработки (кратко)

1. **Werbefrei** — без рекламы, покупок и подписок.
2. **Datensparsamkeit** — никаких аккаунтов, трекеров и внешних запросов; данные только в `localStorage` устройства.
3. **Mobile First** — интерфейс проектируется от смартфона (требование BzKJ).
4. **Altersgerecht** — язык и интерфейс для 8–12 лет, крупные элементы, озвучивание текста.
5. **Offen** — AGPL-3.0, открытый код.

Полная политика — в [docs/02-anforderungen.md](docs/02-anforderungen.md).
