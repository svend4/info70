# OER-Bausteinvorlage „info70-Unterrichtsstunde“ 📐

Приложение для **учителей** — каталог docs/09, Ось E. Стандартизированный
**CC-BY-шаблон (OER)**, из которого строятся все разработки уроков набора:
чертёж разделов, фазовый растр 45/90 минут, привязка к компетенциям
(Medienkompetenzrahmen NRW / KMK), JSON-схема и **печатный бланк** для
заполнения от руки. Приложение **ничего не сохраняет** и не делает внешних
запросов.

## Что внутри

- А07 разделов конспекта (Цели, Ход, Раздатка, Дифференциация, Kompetenz-
  Mapping, Bezug) с пояснениями.
- Фазовый растр Einstieg → Erarbeitung → Vertiefung → Sicherung → Abschluss
  с типовыми минутами и целью каждой фазы.
- Компетенции: 6 областей NRW и 6 областей KMK.
- Печатный бланк (пустые поля) + кнопка печати.
- JSON-схема `daten/stunde.json` для цифровых авторов + ссылки на примеры.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter), **ничего не хранит**.
Контент в `daten/vorlage.json`. Лицензия контента: CC-BY 4.0 (OER).
Инструмент для школы, без eltern.html.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/oer-vorlage/
node --test apps/oer-vorlage/test/*.test.mjs
```
