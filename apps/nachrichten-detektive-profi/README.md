# Nachrichten-Detektive Profi 🕵️

Детское приложение (13–15) — каталог docs/09, Ось A, №164. Профи-версия
`nachrichten-detektive`: более сложные случаи — **дипфейки**,
**KI-генерированные тексты** и систематическая проверка источника
(**Wer? Wo steht es noch? Wie alt ist es?**). На движке `quiz-kern`.

## Что внутри

- 13 вопросов (смешанные типы: Ja/Nein и множественный выбор), раунд 12.
- Темы: признаки дипфейков (руки/уши/текст на картинке, свет, моргание),
  выдуманные ИИ «источники», обратный поиск по картинке, цитата вне
  контекста, сатира vs. фейк, эмоции как красный флаг, боты/масса ≠ правда,
  обязательная маркировка ИИ (AI Act), фактчек, ответственность за
  случайный репост.
- Объяснение после каждого ответа, Klassen-Modus/Duett/Geschwister-Staffel
  (из `quiz-kern`), Vorlesen. Раунд заканчивается экраном «Ermittlung abgeschlossen!»
  без счёта и без оценки ребёнка.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); ничего не сохраняется,
в приложении нет очков, рекорда и рангов, поэтому нет и карточки «Meine Daten
löschen» (старая запись `ndp.rekord` прежних версий один раз удаляется при запуске).
Есть `eltern.html`, в Eltern-Sammelband.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/nachrichten-detektive-profi/
node --test apps/nachrichten-detektive-profi/test/*.test.mjs
```
