# Barrierefreiheits-Erklärung ♿

Инструмент **для операторов** детских сайтов — каталог docs/09, №169.
Заполните форму **или импортируйте отчёт BFSG-Check** — получите готовую
**Erklärung zur Barrierefreiheit** (по BFSG/EAA) как Markdown/HTML, включая
раздел на простом языке и указания по обратной связи и правоприменению.

## Что внутри

- Импорт `.txt`-протокола из BFSG-Check: строка «Erfüllt: X von Y»
  автоматически переводится в статус конформности (voll / teilweise / nicht).
- Поля: анбитер, URL, дата, статус конформности, известные барьеры
  (по одной на строку), контакт для обратной связи.
- Готовая декларация со всеми обязательными разделами: Stand der
  Vereinbarkeit, Nicht barrierefreie Inhalte, **In einfacher Sprache**,
  Feedback und Kontakt, **Durchsetzungsverfahren** (Schlichtungsstelle).
  Технический масштаб: EN 301 549 / WCAG 2.1 AA.
- Живой предпросмотр + экспорт `.md` и `.html`, копирование, «Leeren».
- `logik.mjs` (чистая): `baueErklaerung(cfg)`, `leseBfsgProtokoll(text)`,
  безопасный `markdownZuHtml` (escaping, без `<script>`/внешних ресурсов —
  под тестами).

Помощь к самопомощи, **не юридическая консультация**. Шаблон нужно
адаптировать под своё предложение.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); данные формы — только
локально (`bfe.cfg`) + «Leeren». Импорт файла читается в браузере, ничего
не отправляется.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/barrierefreiheitserklaerung-generator/
node --test apps/barrierefreiheitserklaerung-generator/test/*.test.mjs
```
