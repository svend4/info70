# Klassenrat-Handbuch 🏛️

Приложение для **учителей** — каталог docs/09, Ось B, №187. Пошаговая
инструкция, как вести **еженедельный классный совет** с помощью
`mitmach-arena` и `kinderrat`: ролевые карточки, план хода сессии и
Klassen-Koffer-workflow для протоколов **без сервера**. OER (AGPL), печать.

## Что внутри

- Зачем классный совет (UN-KRK Art. 12, демократическое образование).
- Ролевые карточки (Leitung, Zeit, Protokoll, Regel-Wächter*in).
- Ход сессии из 6 фаз (позитив → повестка → обсуждение → голосование →
  протокол → завершение).
- Klassen-Koffer-workflow (экспорт протокола файлом), deep-ссылки на
  приложения, кнопка печати; **ничего не сохраняет**.
- `daten/handbuch.json`; тест проверяет роли, фазы, koffer-workflow,
  привязку к демократическому образованию, существование приложений.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter), **ничего не хранит**.
Инструмент для школы, без eltern.html. UN-KRK, KMK Demokratiebildung.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/klassenrat-handbuch/
node --test apps/klassenrat-handbuch/test/*.test.mjs
```
