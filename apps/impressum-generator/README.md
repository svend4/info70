# Impressum-Generator 📄

Инструмент **для операторов** детских сайтов — каталог docs/09, №57.
Офлайн-форма: выбрать правовую форму, заполнить поля — получить готовый
Impressum как **текст/HTML**. Вводит переиспользуемый движок «форма →
документ» (для будущих генераторов).

## Что внутри

- 4 правовые формы (Privatperson, Verein e. V., gGmbH/GmbH, Schule) со
  своими обязательными полями; чекбокс «редакционные материалы» добавляет
  ответственного по **§ 18 MStV**.
- Подсказка «Keine Namen von Kindern eingeben.» у всех свободных полей (все
  поля — Freitext, включая E-Mail, Telefon, Vertretung и USt-ID): отдельный
  элемент прямо перед полем, поле связано через `aria-describedby`; названия
  полей не меняются. Константа и список полей — в `logik.mjs` (`FELDER[].hinweis`).
- Живая проверка обязательных полей, генерация текста по § 5 DDG,
  экспорт .txt/.html, копирование, «Leeren».
- Блок «часто забывают на детских сайтах» (§18 MStV, ladungsfähige Anschrift,
  реальный e-mail, реестр для e.V.).
- `logik.mjs` (чистая, без DOM): `pflichtFelder`, `fehlendeFelder`,
  `baueImpressum`, `baueImpressumHtml` — всё под тестами (в т.ч. что в
  сгенерированном HTML нет `<script>`).

Помощь к самопомощи, **не юридическая консультация**.

## Политика

Werbefrei, без внешних запросов; черновик — только локально
(`impgen.entwurf`) + «Leeren». Всё генерируется в браузере.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/impressum-generator/
node --test apps/impressum-generator/test/*.test.mjs
```
