# Fake-Shop-Fahnder 🕵️

Контент-пак на quiz-kern (8–12) — каталог docs/09, №46. Настоящий магазин
или фейк? Дети проверяют смоделированные витрины на признаки обмана и после
каждого ответа узнают конкретный warning-signal.

## Категории

- **Warnsignale** — цена нереально низкая, нет Impressum, только Vorkasse,
  самодельные «сиегели», Countdown-давление.
- **Echt oder Fake** — для контраста и настоящие магазины (Impressum,
  несколько способов оплаты, проверяемый знак).
- **Richtig handeln** — остановиться, спросить взрослого, загуглить
  «<магазин> Erfahrungen/Fake», не вводить данные ради «скидки».

12 вопросов (binaer + wahl), ранги за раунд из 12. Тест сверяет схему
quiz-kern, дидактический баланс и наличие всех пяти ключевых warning-signals.

## Klassen-Modus

Одна проекция на класс, без устройств и данных учеников (движок quiz-kern).

## Политика

Werbefrei, без аккаунтов и внешних запросов; случаи смоделированы; только
рекорд в `localStorage` (`fsf.rekord`).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/fake-shop-fahnder/
node --test apps/fake-shop-fahnder/test/*.test.mjs
```
