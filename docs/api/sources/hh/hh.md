## HH.ru (api.hh.ru)

**Base URL:** `https://api.hh.ru`  
**Формат ответов:** JSON, кодировка UTF-8  
**Официальная документация:** https://api.hh.ru/openapi/redoc

### Аутентификация

Справочные эндпоинты (`/areas`, `/professional_roles`, `/industries`, `/dictionaries`, `/suggests/*`) работают **без токена** — достаточно корректного заголовка `User-Agent`.

Эндпоинт `/vacancies` (поиск вакансий) требует **OAuth 2.0 Application Authorization** — получение токена по flow `client_credentials` через POST `/token`. Токен передаётся в заголовке `Authorization: Bearer <token>`.

> Без `User-Agent` API отвечает `403 forbidden`. Заголовок обязателен для всех запросов.

**Регистрация приложения:** https://dev.hh.ru/  
Нужны: `client_id` и `client_secret`. Хранятся в конфиге через Options-паттерн, не в коде.

### Заголовки

| Заголовок | Значение | Обязательность |
|-----------|----------|----------------|
| `User-Agent` | `VictorySearcher/1.0 (contact@example.com)` | Обязателен для всех запросов |
| `Authorization` | `Bearer <access_token>` | Только для `/vacancies` |
| `Accept-Language` | `ru` | Опционально (отвечает по-русски по умолчанию) |

### Rate Limits

Официальных лимитов для публичных справочников нет, но проект соблюдает **задержку 1–2 с** между запросами, как указано в `ARCHITECTURE.md`. Для `/vacancies` при превышении лимита API отвечает `429 Too Many Requests`.

---

## Справочные эндпоинты

### GET /areas — Дерево регионов

Возвращает иерархическое дерево географических регионов: страны → регионы → города. Используется для получения `id` региона при поиске вакансий.

**Запрос:**
```
GET https://api.hh.ru/areas?locale=RU
```

**Параметры:** нет

**Ответ:** массив стран, каждая содержит вложенные `areas`.

```json
[
  {
    "id": "113",
    "parent_id": null,
    "name": "Россия",
    "areas": [
      {
        "id": "1624",
        "parent_id": "113",
        "name": "Республика Татарстан",
        "areas": [
          {
            "id": "88",
            "parent_id": "1624",
            "name": "Казань",
            "areas": [],
            "utc_offset": "+03:00",
            "lat": 55.796127,
            "lng": 49.106405
          }
        ]
      }
    ]
  }
]
```

**Ключевые поля:**

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | string | Идентификатор региона/города (передаётся в `area` при поиске вакансий) |
| `parent_id` | string\|null | ID родительского региона; `null` — корневой узел (страна) |
| `name` | string | Название на русском |
| `areas` | array | Дочерние регионы/города |
| `utc_offset` | string | Часовой пояс (у конечных городов) |
| `lat`, `lng` | number | Координаты (у конечных городов) |

**Получить поддерево конкретной страны:**
```
GET https://api.hh.ru/areas/{area_id}
```



### GET /professional_roles — Профессиональные роли

Возвращает справочник ролей, сгруппированных по категориям. Используется для получения `id` роли при поиске вакансий (параметр `professional_role`).

**Запрос:**
```
GET https://api.hh.ru/professional_roles?locale=RU
```

**Ответ:**
```json
{
  "categories": [
    {
      "id": "11",
      "name": "Информационные технологии",
      "roles": [
        {
          "id": "96",
          "name": "Программист, разработчик",
          "accept_incomplete_resumes": true,
          "is_default": false,
          "select_deprecated": false,
          "search_deprecated": false
        }
      ]
    }
  ]
}
```

**Ключевые поля роли:**

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | string | Идентификатор роли |
| `name` | string | Название роли |
| `search_deprecated` | bool | Если `true` — роль нельзя использовать в поиске |

### GET /industries — Отрасли

Справочник отраслей. Используется в параметре `industry` при поиске вакансий.

**Запрос:**
```
GET https://api.hh.ru/industries?locale=RU
```

**Ответ:** массив отраслей, каждая содержит `industries` (подотрасли).

```json
[
  {
    "id": "7",
    "name": "Информационные технологии, системная интеграция, интернет",
    "industries": [
      { "id": "7.538", "name": "Интернет-провайдер" },
      { "id": "7.539", "name": "Системная интеграция, автоматизация технологических и бизнес-процессов предприятия, ИТ-консалтинг" },
      { "id": "7.540", "name": "Разработка программного обеспечения" },
      { "id": "7.541", "name": "Интернет-компания (поисковики, платежные системы, соц.сети, информационно-познавательные и развлекательные ресурсы, продвижение сайтов и прочее)" }
    ]
  }
]
```

**Ключевые поля:**

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | string | ID отрасли (формат: `"7"` для категории, `"7.540"` для подотрасли) |
| `name` | string | Название |
| `industries` | array | Подотрасли (только у корневых) |

> В параметр `industry` при поиске вакансий передаётся `id` подотрасли (например, `7.540`).

---

### GET /dictionaries — Общие справочники

Единый эндпоинт, возвращающий множество справочников одним запросом. Не требует токена.

**Запрос:**
```
GET https://api.hh.ru/dictionaries?locale=RU
```

**Справочники, используемые при поиске вакансий:**

#### experience — Опыт работы

Передаётся в параметре `experience` при поиске вакансий.

| ID | Название |
|----|---------|
| `noExperience` | Нет опыта |
| `between1And3` | От 1 года до 3 лет |
| `between3And6` | От 3 до 6 лет |
| `moreThan6` | Более 6 лет |

#### employment — Тип занятости

Передаётся в параметре `employment`.

| ID | Название |
|----|---------|
| `full` | Полная занятость |
| `part` | Частичная занятость |
| `project` | Проектная работа |
| `volunteer` | Волонтёрство |
| `probation` | Стажировка |

#### schedule — График работы

Передаётся в параметре `schedule`.

| ID | Название |
|----|---------|
| `fullDay` | Полный день |
| `shift` | Сменный график |
| `flexible` | Гибкий график |
| `remote` | Удалённая работа |
| `flyInFlyOut` | Вахтовый метод |

#### currency — Валюты

Используется для нормализации зарплат в единую валюту.

| Код | Символ | Название | Дефолт |
|-----|--------|---------|--------|
| `RUR` | ₽ | Рубли | Да |
| `USD` | $ | Доллары | Нет |
| `EUR` | € | Евро | Нет |
| `KZT` | ₸ | Тенге | Нет |
| `BYR` | Br | Белорусские рубли | Нет |

> В ответе каждой валюты есть поле `rate` — курс относительно рубля. Удобно для нормализации зарплат при сборе снимка.

---

### GET /suggests/skill_set — Автодополнение навыков

Используется для нормализации названий навыков при агрегации топ-скиллов из вакансий.

**Запрос:**
```
GET https://api.hh.ru/suggests/skill_set?text=Python&locale=RU
```

**Параметры:**

| Параметр | Обязательный | Описание |
|----------|-------------|---------|
| `text` | Да | Часть названия навыка |

**Ответ:**
```json
{
  "items": [
    { "id": "1114", "text": "Python" },
    { "id": "665",  "text": "Iron Python" },
    { "id": "1051", "text": "Pl/Python" }
  ]
}
```

---

## Поиск вакансий

### GET /vacancies — Поиск вакансий

Основной эндпоинт для сбора рыночных данных. **Требует OAuth-токен** (`Authorization: Bearer <token>`).

**Запрос:**
```
GET https://api.hh.ru/vacancies
```

**Параметры фильтрации (используемые в проекте):**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `professional_role` | int | ID профессиональной роли (из `/professional_roles`) |
| `area` | int | ID региона/города (из `/areas`) |
| `industry` | string | ID отрасли (из `/industries`, формат `"7.540"`) |
| `experience` | string | Уровень опыта (из `dictionaries.experience`) |
| `employment` | string | Тип занятости (из `dictionaries.employment`) |
| `schedule` | string | График работы (из `dictionaries.schedule`) |
| `currency` | string | Валюта (код из `dictionaries.currency`; по умолчанию `RUR`) |
| `only_with_salary` | bool | `true` — только вакансии с указанной зарплатой |
| `text` | string | Полнотекстовый поиск по названию/описанию вакансии |
| `per_page` | int | Вакансий на страницу (макс. `100`) |
| `page` | int | Номер страницы (с 0) |
| `order_by` | string | Сортировка: `publication_time`, `salary_desc`, `salary_asc`, `relevance` |
| `date_from` | string | Дата публикации от (ISO 8601) |
| `date_to` | string | Дата публикации до (ISO 8601) |

> Можно передавать несколько значений одного параметра: `&professional_role=96&professional_role=104` — вернёт оба.

**Ответ:**

```json
{
  "found": 4821,
  "pages": 49,
  "per_page": 100,
  "page": 0,
  "items": [
    {
      "id": "123456789",
      "name": "Python Developer (Middle)",
      "area": { "id": "1", "name": "Москва" },
      "salary": {
        "from": 180000,
        "to": 250000,
        "currency": "RUR",
        "gross": false
      },
      "experience": { "id": "between3And6", "name": "От 3 до 6 лет" },
      "employment": { "id": "full", "name": "Полная занятость" },
      "schedule": { "id": "remote", "name": "Удалённая работа" },
      "key_skills": [
        { "name": "Python" },
        { "name": "PostgreSQL" },
        { "name": "Docker" }
      ],
      "employer": {
        "id": "9876",
        "name": "Acme Corp"
      },
      "published_at": "2025-06-28T12:00:00+0300",
      "alternate_url": "https://hh.ru/vacancy/123456789"
    }
  ]
}
```

**Ключевые поля элемента:**

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | string | Уникальный ID вакансии |
| `name` | string | Название вакансии |
| `area` | object | Регион/город |
| `salary.from` | int\|null | Минимальная зарплата |
| `salary.to` | int\|null | Максимальная зарплата |
| `salary.currency` | string | Код валюты |
| `salary.gross` | bool | `true` — зарплата до вычета налогов (gross) |
| `experience.id` | string | ID уровня опыта |
| `employment.id` | string | ID типа занятости |
| `schedule.id` | string | ID графика работы |
| `key_skills` | array | Список навыков `[{name: string}]` |
| `employer.name` | string | Название работодателя |
| `published_at` | string | Дата публикации (ISO 8601) |

> `salary.from` и `salary.to` могут быть `null` по отдельности (например, «от 100 000» без верхней границы). Параметр `only_with_salary=true` отфильтрует вакансии, где оба поля `null`.

**Пагинация:**

API возвращает максимум `2000` вакансий (20 страниц × 100). Для охвата всей выборки по роли — разбивать запрос по дополнительным фильтрам: регион, уровень опыта, дата.

---

### GET /vacancies/{id} — Детальная карточка вакансии

Возвращает полную информацию по одной вакансии. Нужен для сбора `key_skills` — в листинге `/vacancies` этот массив **не включается**. Нет bulk-эндпоинта: один запрос на одну вакансию.

**Запрос:**
```
GET https://api.hh.ru/vacancies/{vacancy_id}?locale=RU
Authorization: Bearer <access_token>
```

**Ответ (сокращён до полей, нужных проекту):**

```json
{
  "id": "123456789",
  "name": "Python Developer (Middle)",
  "area": { "id": "1", "name": "Москва" },
  "salary": {
    "from": 180000,
    "to": 250000,
    "currency": "RUR",
    "gross": false
  },
  "experience": { "id": "between3And6", "name": "От 3 до 6 лет" },
  "employment": { "id": "full", "name": "Полная занятость" },
  "schedule": { "id": "remote", "name": "Удалённая работа" },
  "key_skills": [
    { "name": "Python" },
    { "name": "PostgreSQL" },
    { "name": "Docker" },
    { "name": "FastAPI" },
    { "name": "Redis" }
  ],
  "description": "<p>Полный HTML-текст описания вакансии...</p>",
  "employer": {
    "id": "1455",
    "name": "HeadHunter",
    "trusted": true,
    "alternate_url": "https://hh.ru/employer/1455"
  },
  "professional_roles": [
    { "id": "96", "name": "Программист, разработчик" }
  ],
  "published_at": "2025-06-28T12:00:00+0300",
  "alternate_url": "https://hh.ru/vacancy/123456789"
}
```

**Ключевые поля:**

| Поле | Тип | Описание |
|------|-----|---------|
| `key_skills` | array | Полный список навыков `[{name: string}]` — только здесь, не в листинге |
| `description` | string | HTML-текст описания вакансии (для `DescriptionRaw` в `VacanciesAnalysis`) |
| `professional_roles` | array | Профессиональные роли вакансии |
| `employer.id` | string | ID работодателя (для `EmployerStat`) |
| `employer.trusted` | bool | Верифицированный работодатель |

> Запросы к `/vacancies/{id}` должны идти с задержкой 1–2 с. При агрегации навыков достаточно брать первые N вакансий из листинга (например, 200–500), а не все найденные.

---

### GET /employers/{id} — Информация о работодателе

Возвращает публичный профиль компании. Используется для обогащения `EmployerStat` — количество активных вакансий, описание, отрасль.

**Запрос:**
```
GET https://api.hh.ru/employers/{employer_id}?locale=RU
Authorization: Bearer <access_token>
```

**Ответ (сокращён до полей, нужных проекту):**

```json
{
  "id": "1455",
  "name": "HeadHunter",
  "alternate_url": "https://hh.ru/employer/1455",
  "site_url": "https://hh.ru",
  "description": "Описание компании...",
  "industries": [
    { "id": "7.541", "name": "Интернет-компания" }
  ],
  "open_vacancies": 47,
  "trusted": true,
  "logo_urls": {
    "original": "https://hh.ru/file/2352807.png",
    "240": "https://hh.ru/employer-logo/289169.png",
    "90": "https://hh.ru/employer-logo/289027.png"
  },
  "area": { "id": "1", "name": "Москва" }
}
```

**Ключевые поля:**

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | string | ID работодателя |
| `name` | string | Название компании |
| `open_vacancies` | int | Число активных вакансий на момент запроса |
| `industries` | array | Отрасли компании |
| `trusted` | bool | Верифицирован HH.ru |
| `area` | object | Основной регион присутствия |

> В рамках `MarketCollectJob` этот эндпоинт вызывается только для работодателей с наибольшим числом вакансий в срезе — не для каждого из листинга.

---

## Сценарии сбора данных

Каждый сценарий соответствует одной аналитической метрике из `AnalysisTarget`. Все запросы требуют OAuth-токена и задержки 1–2 с.

---

### Зарплатная вилка по срезу (роль × грейд × регион)

Цель: заполнить `SalaryAggregate` (P25 / Median / P75 / SampleSize) для каждого среза `ExperienceLevel`.

```
GET /vacancies
  ?professional_role={roleId}
  &area={areaId}
  &experience={experienceId}   ← повторить для каждого грейда
  &only_with_salary=true
  &currency=RUR
  &per_page=100
  &page={0..N}
```

Агрегация на стороне сервиса:
- Для каждой вакансии берём `salary.from` и `salary.to`; если одно из значений `null`, используем доступное.
- Если `salary.gross = true` — умножаем на `0.87` (вычитаем НДФЛ 13%).
- Если валюта не `RUR` — конвертируем через `rate` из `/dictionaries`.
- Из собранного массива значений вычисляем P25 / Median / P75 в памяти.

---

### Количество активных вакансий / спрос

Цель: заполнить `MarketSnapshot.TotalVacancies`. Требует только одного запроса — поле `found` в ответе даёт общее число без скачивания всех страниц.

```
GET /vacancies
  ?professional_role={roleId}
  &area={areaId}
  &per_page=1
```

→ `response.found` — итоговое число активных вакансий.

Для тренда по времени повторяем запрос с `date_from` / `date_to`:

```
GET /vacancies
  ?professional_role={roleId}
  &area={areaId}
  &date_from=2025-06-01T00:00:00
  &date_to=2025-06-30T23:59:59
  &per_page=1
```

→ `response.found` даёт число вакансий за период.

---

### Новые вакансии за период

Цель: дополнительная метрика спроса — сколько вакансий появилось вчера.

```
GET /vacancies
  ?professional_role={roleId}
  &area={areaId}
  &order_by=publication_time
  &date_from=<вчера T00:00:00>
  &date_to=<вчера T23:59:59>
  &per_page=100
  &page={0..N}
```

→ `items[].published_at` — фиксируем дату публикации для delta-подсчёта по дням.

> Используем `response.found` вместо итерации по всем страницам, если нужно только число без деталей.

---

### Навыки — частота требований

Цель: заполнить `SkillStat` (SkillName / MentionCount / MentionRate).

**Шаг 1.** Получаем выборку ID вакансий:

```
GET /vacancies
  ?professional_role={roleId}
  &area={areaId}
  &per_page=100
  &page={0..4}          ← первые 500 вакансий достаточно для статистики
```

→ собираем `items[].id`.

**Шаг 2.** Для каждого ID запрашиваем детальную карточку:

```
GET /vacancies/{id}
```

→ `key_skills[].name` — агрегируем по всей выборке.

**Результат:**
```
SkillName = "Python"
MentionCount = 347        ← из N вакансий
MentionRate  = 0.694      ← MentionCount / N
```

> Нет bulk-эндпоинта. Запросы с задержкой 1–2 с; на 500 вакансий ~10–17 минут. Запускать параллельно нельзя — HH банит по IP. Брать первые 200–500 из листинга достаточно.

---

### Работодатели / конкуренты

Цель: заполнить `EmployerStat` (EmployerId / EmployerName / VacancyCount / MarketShare).

**Шаг 1.** Из результатов `/vacancies` собираем частоту работодателей:

```
items[].employer.id   → EmployerId
items[].employer.name → EmployerName
```

Считаем `VacancyCount` как число вакансий от каждого работодателя в выборке.  
`MarketShare = VacancyCount / TotalVacancies`.

**Шаг 2 (опционально).** Для топ-N работодателей можно обогатить данными:

```
GET /employers/{employer_id}
```

→ `open_vacancies` — реальное число всех активных вакансий компании (не только в срезе).

---

## Получение OAuth-токена

```
POST https://hh.ru/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
```

**Ответ:**
```json
{
  "access_token": "XXXXXXXX",
  "token_type": "Bearer",
  "expires_in": 1209600
}
```

Токен действует **14 дней**. Хранится в памяти (не в БД), обновляется при запуске `MarketCollectJob`.

---

## Замечания для реализации

- **Задержки между запросами** — минимум 1 с, рекомендуется 1–2 с (требование из `ARCHITECTURE.md`). Касается всех эндпоинтов, включая `/vacancies/{id}`.
- **Нормализация валют** — при сборе снимка конвертировать все зарплаты в рубли, используя поле `rate` из `GET /dictionaries`. Конвертация выполняется до записи в `SalaryAggregate`.
- **Gross → net** — вакансии с `salary.gross = true` содержат зарплату до вычета НДФЛ (13%); при агрегации приводить к единому формату (`salary * 0.87`).
- **Кэш справочников** — `/areas`, `/professional_roles`, `/industries`, `/dictionaries` меняются редко; загружать один раз при старте `MarketCollectJob`, кэшировать на время выполнения.
- **`key_skills` в листинге** — в ответе `/vacancies` (поиск) этот массив **не возвращается**. Нужен отдельный `GET /vacancies/{id}` на каждую вакансию.
- **Лимит пагинации** — `/vacancies` отдаёт не более `2000` вакансий (20 страниц × 100). При большой выборке разбивать по `experience` или `date_from`/`date_to`.
- **OAuth-токен** — действует 14 дней. Обновлять при запуске `MarketCollectJob` (проверять `expires_in`), хранить в памяти, не в БД.
- **`GET /employers/{id}` — только для топ-N** — вызов для каждого работодателя в выборке нецелесообразен. Достаточно обогатить топ-10–20 по `VacancyCount`.
