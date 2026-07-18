# Anzeige oder nicht? 🏷️

Контент-пак на quiz-kern (8–12) — каталог docs/09, №110. Расширение
Werbe-Radar: дети учатся распознавать **инфлюенсер-рекламу** и отделять
рекламное намерение от честного мнения.

## Что внутри

12 вопросов (binaer + wahl): #Anzeige, Merch-Verkauf, Produktplatzierung,
Affiliate/Rabattcodes, «Haul» с подаренными товарами; и главное —
Meinung vs. Werbung. Ключевой вопрос: «хочет ли пост, чтобы я купил, и
зарабатывает ли кто-то на этом?»

Тест сверяет схему quiz-kern (≥12), дидактический баланс, покрытие
рекламных форм и разграничение реклама/мнение. Основание: маркировка
рекламы (JMStV, конкурентное право).

## Klassen-Modus

Одна проекция на класс, без устройств и данных учеников (движок quiz-kern).

## Политика

Werbefrei, без аккаунтов и внешних запросов; случаи выдуманы; только
рекорд (`aon.rekord`).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/anzeige-oder-nicht/
node --test apps/anzeige-oder-nicht/test/*.test.mjs
```
