# Projektwoche «Sicher im Netz» 📅

Готовая **школьная проектная неделя** для учителей (3–6 класс, 8–12 лет):
пять дней по 90 минут, собранных из уже существующих приложений монорепозитория —
без новой разработки (каталог docs/09, единица №19 топ-листа).

## Драматургия недели

| День | Тема | Приложения |
|---|---|---|
| 1 🕵️ | Echt oder fake? — детективные вопросы | nachrichten-detektive |
| 2 🎁 | Werbung, Kauf-Tricks & Zufall | lootbox-labor, dark-pattern-labyrinth |
| 3 🌀 | Der Feed und der Sog | feed-forscher, sog-maschine |
| 4 💪 | Stark füreinander im Chat | stark-im-chat, spiral-stopper, mitmach-arena |
| 5 🗝️ | Daten, Rechte, unsere Charta | daten-schatz, daten-radiergummi, beschwerde-lotse, mitmach-arena |

Красная нить: от «что правда?» через «что мной управляет?» и «как остаться
честными друг с другом?» к **Klassen-Netz-Charta** — правилам класса, принятым
демократическим голосованием в mitmach-arena и подписанным всеми.

## Особенности

- **Достаточно одного проектора**: квизы имеют Klassen-Modus (одна проекция
  на класс, без устройств и данных учеников); для станций хватает 2–4 устройств.
- Каждый день: Einstieg → работа с приложением → углубление **без экрана** →
  Abschluss; блок Transfer переносит тему в повседневность.
- **Печать**: кнопка «Handreichung drucken» даёт спокойную пятистраничную
  методичку (`druck.css`, ссылки-кнопки заменяются текстовым списком приложений).
- Привязка: Medienkompetenzrahmen NRW, KMK «Bildung in der digitalen Welt»,
  UN-KRK GC25; помощь — Nummer gegen Kummer 116 111.
- Родительский мостик: Charta идёт домой как копия и открывает разговор
  о `familien-medienvertrag`.

## Политика

Страница **ничего не сохраняет** (ни localStorage, ни запросов): это чистый
справочно-печатный инструмент для взрослых. Никакой рекламы и внешних серверов
(см. `docs/02-anforderungen.md`).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/projektwoche/
node --test apps/projektwoche/test/*.test.mjs
```

Тест проверяет: 5 дней ровно по 90 минут (Einstieg…Abschluss), все
приложения из планов реально существуют в `apps/`, красная нить
(Charta + mitmach-arena + мостик домой + 116 111) на месте.
