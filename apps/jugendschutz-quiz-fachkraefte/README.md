# Jugendschutz-Wissens-Quiz 🏫

Инструмент **для специалистов** (учителя, OGS, медиапедагоги) — каталог
docs/09, №188. Квиз на движке quiz-kern: насколько уверенно вы разбираетесь
в защите несовершеннолетних? Каждый ответ — с объяснением и **Praxis-Tipp
для родительского вечера**.

## Что внутри

- 14 вопросов (раунд из 12): значение USK/FSK (это гос. возрастные
  ограничения, не рекомендации), почему «ab 6» может быть рискованным
  (чат/лутбоксы), различие USK/PEGI, IARC-Zusatzhinweise, обязанности
  платформ по § 24a JuSchG, где брать надёжные оценки (USK,
  Spieleratgeber-NRW, jugendschutz.net — как текст).
- К каждому ответу практический совет для родительского собрания и ссылки
  на подходящие приложения набора (Kettenbrief-Stopper, Lootbox-Labor,
  Spiele-Kauf-Kompass).
- Klassen-/Team-Modus для показа на проекторе. Инструмент для взрослых —
  детской версии нет.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); сохраняется только
рекорд (`jsqf.rekord`), удаляется одной кнопкой.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/jugendschutz-quiz-fachkraefte/
node --test apps/jugendschutz-quiz-fachkraefte/test/*.test.mjs
```
