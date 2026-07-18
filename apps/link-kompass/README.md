# Link-Kompass 🧭

Контент-пак на quiz-kern (8–12) — каталог docs/09, №50. Дети учатся
**распознавать типы ссылок** и кнопок и проверять их перед кликом.

## Категории

- **Link-Arten** — внутренний, помеченный внешний (↗ / «externe Seite»),
  Download, App-Store-ссылка, Werbe-Falle.
- **Werbung erkennen** — реклама должна быть помечена («Werbung/Anzeige»,
  JMStV); мигающие «Du hast gewonnen!!!» — ловушка.
- **Vor dem Klicken** — совпадает ли текст с URL, крипто-адрес как warning,
  привычка «сначала посмотреть, потом кликнуть».

12 вопросов (binaer + wahl), ранги за раунд из 12. Тест сверяет схему
quiz-kern, дидактический баланс и покрытие всех типов ссылок.

## Klassen-Modus

Одна проекция на класс, без устройств и данных учеников (движок quiz-kern).

## Политика

Werbefrei, без аккаунтов и внешних запросов; случаи выдуманы; только
рекорд (`lk.rekord`).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/link-kompass/
node --test apps/link-kompass/test/*.test.mjs
```
