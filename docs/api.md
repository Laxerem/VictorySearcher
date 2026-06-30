# API — VictorySearcher.Service

HTTP REST API для управления вакансиями, загрузки резюме и запуска LLM-скоринга.

---

## Общие сведения

- **Base URL:** `http://localhost:5000/api`
- **Аутентификация:** Bearer JWT (все эндпоинты кроме `/auth/login`)
- **Форматы:** JSON; `multipart/form-data` для загрузки файлов
- **Кодировка:** UTF-8

---

## Аутентификация

### POST /auth/login

Получить JWT-токен.

**Запрос:**
```json
{
  "login": "string",
  "password": "string"
}
```

**Ответ (200 OK):**
```json
{
  "token": "eyJhbGc..."
}
```

**Коды ошибок:**
- `401 Unauthorized` — неверные учётные данные

**Примечания:**
- Токен используется в заголовке: `Authorization: Bearer {token}`
- Один внутренний аккаунт, заданный в конфигурации

---

## Вакансии

### POST /vacancies

Создать новую вакансию.

**Запрос:**
```json
{
  "title": "string",
  "description": "string",
  "requirements": "string",
  "extraRequirements": "string | null",
  "trend": "string | null"
}
```

**Ответ (201 Created):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "requirements": "string",
  "extraRequirements": "string | null",
  "trend": "string | null",
  "createdAt": "2026-06-30T12:00:00Z",
  "totalResumes": 0,
  "scoredResumes": 0,
  "unscoredResumes": 0
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован

---

### GET /vacancies

Получить список всех вакансий с агрегированной статистикой резюме.

**Параметры:** нет

**Ответ (200 OK):**
```json
{
  "total": 5,
  "total_resumes": 12,
  "items": [
    {
      "id": "uuid",
      "resume_count": 3,
      "checked_resume_count": 2,
      "best_score": 87
    }
  ]
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован

**Примечания:**
- `checked_resume_count` — количество резюме, уже прошедших скоринг
- `best_score` — лучший общий балл среди всех резюме по вакансии

---

### GET /vacancies/{id}

Получить полные сведения по вакансии.

**Параметры:**
- `id` (path, uuid) — ID вакансии

**Ответ (200 OK):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "requirements": "string",
  "extraRequirements": "string | null",
  "trend": "string | null",
  "createdAt": "2026-06-30T12:00:00Z",
  "totalResumes": 3,
  "scoredResumes": 2,
  "unscoredResumes": 1
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена

---

### DELETE /vacancies/{id}

Удалить вакансию и все связанные резюме и результаты скоринга.

**Параметры:**
- `id` (path, uuid) — ID вакансии

**Ответ:** 204 No Content

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена

---

## Резюме

### POST /vacancies/{vacancyId}/resumes

Загрузить резюме в вакансию. Поддерживаемые форматы: `.pdf`, `.docx`, `.txt`.

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии
- `file` (form, multipart) — файл резюме

**Ответ:** 201 Created

**Коды ошибок:**
- `400 Bad Request` — неподдерживаемый формат файла или файл повреждён
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена

**Примечания:**
- Текст извлекается автоматически для последующего скоринга
- Размер файла не ограничен

---

### GET /vacancies/{vacancyId}/resumes

Получить постраничный список резюме по вакансии с учётом статуса скоринга.

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии
- `page` (query, int, default: 1) — номер страницы (начиная с 1)
- `pageSize` (query, int, default: 20) — количество элементов на странице

**Ответ (200 OK):**
```json
{
  "totalCount": 5,
  "page": 1,
  "pageSize": 20,
  "scoredCount": 3,
  "unscoredCount": 2,
  "items": [
    {
      "id": "uuid",
      "fileName": "resume.pdf",
      "format": "PDF",
      "fileSizeBytes": 245123,
      "loadedAt": "2026-06-30T12:00:00Z",
      "isScored": true
    }
  ]
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован

**Примечания:**
- `format` — одно из: `PDF`, `DOCX`, `TXT`
- `isScored` — показывает, прошло ли резюме скоринг в последний раз

---

### GET /vacancies/{vacancyId}/resumes/{resumeId}/content

Получить текстовое содержимое резюме (извлечено при загрузке).

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии
- `resumeId` (path, uuid) — ID резюме

**Ответ (200 OK):**
```json
{
  "fileName": "resume.pdf",
  "content": "John Doe\nExperience...\n"
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — резюме или вакансия не найдена

---

### GET /vacancies/{vacancyId}/resumes/{resumeId}/download

Скачать исходный файл резюме в исходном формате.

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии
- `resumeId` (path, uuid) — ID резюме

**Ответ:** 200 OK с `Content-Type: application/pdf | application/vnd.openxmlformats-officedocument.wordprocessingml.document | text/plain`

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — резюме или вакансия не найдена

---

## Скоринг

### POST /vacancies/{vacancyId}/scoring

Запустить скоринг всех непроверённых резюме по вакансии (инкрементный режим).

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии

**Ответ:** 202 Accepted

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена

**Примечания:**
- Скоринг выполняется асинхронно через Hangfire
- Только резюме со статусом `IsScored = false` будут обработаны
- Отслеживать прогресс можно через `GET .../scoring/stream`

---

### GET /vacancies/{vacancyId}/scoring/status

Получить текущий статус скоринга по вакансии.

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии

**Ответ (200 OK):**
```json
{
  "status": "InProcess",
  "errorMessage": null,
  "createdAt": "2026-06-30T12:00:00Z",
  "finishedAt": null
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена

**Примечания:**
- `status` — одно из: `Pending` (ожидает), `InProcess` (выполняется), `Finished` (завершено), `Failed` (ошибка)
- `finishedAt` — null, пока скоринг не завершён

---

### GET /vacancies/{vacancyId}/scoring/results

Получить отсортированный список результатов скоринга (по убыванию общего балла).

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии

**Ответ (200 OK):**
```json
[
  {
    "resumeId": "uuid",
    "fileName": "resume.pdf",
    "overallScore": 87,
    "experienceScore": 48,
    "skillsScore": 32,
    "extraScore": 7,
    "reasoning": "Кандидат имеет релевантный опыт...",
    "isUncertain": false,
    "requirementsAnalysis": [
      {
        "requirement": "5+ лет опыта на Python",
        "covered": true,
        "evidence": "Работал на Python в компании X с 2019 по 2024"
      }
    ],
    "scoredAt": "2026-06-30T12:30:00Z"
  }
]
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена

**Примечания:**
- `overallScore` — 0–100, итоговый балл
- `experienceScore` — 0–50, релевантность и глубина опыта
- `skillsScore` — 0–40, соответствие hard-skills
- `extraScore` — 0–10, соответствие доп. требованиям
- `isUncertain` — true, если разброс оценок между LLM-запусками превышает порог (требует внимания)
- `requirementsAnalysis` — массив проверки каждого требования (вакансия может иметь множество требований)
- Результаты уже отсортированы по `overallScore` убывающе

---

### GET /vacancies/{vacancyId}/scoring/stream

Получить прогресс скоринга в реальном времени (Server-Sent Events).

**Параметры:**
- `vacancyId` (path, uuid) — ID вакансии

**События:**
```json
{
  "status": "InProcess",
  "checked": 3,
  "total": 5,
  "currentTargetName": null,
  "errorMessage": null
}
```

```json
{
  "status": "Finished",
  "checked": 5,
  "total": 5,
  "currentTargetName": null,
  "errorMessage": null
}
```

**Коды ошибок:**
- `401 Unauthorized` — не авторизован
- `404 Not Found` — вакансия не найдена
- `409 Conflict` — скоринг уже запущен (параллельные запусы не допускаются)
- `503 Service Unavailable` — LLM недоступен

**Примечания:**
- Поток закрывается после завершения скоринга (`status === "Finished"` или `status === "Failed"`)
- Событие отправляется после обработки каждого резюме
- Клиент должен поддерживать EventSource API или эквивалент

---

## Обработка ошибок

Все ошибки возвращаются в формате:
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.4.1",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid credentials"
}
```

Основные коды:
- `200 OK` — успешный GET
- `201 Created` — успешное создание ресурса
- `202 Accepted` — асинхронная операция принята
- `204 No Content` — успешное удаление
- `400 Bad Request` — ошибка в данных запроса
- `401 Unauthorized` — требуется аутентификация
- `404 Not Found` — ресурс не найден
- `409 Conflict` — конфликт (например, параллельный скоринг)
- `503 Service Unavailable` — внешний сервис недоступен

---

## Примеры

### Полный цикл скоринга

```bash
# 1. Логин
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"user","password":"pass"}' | jq -r .token)

# 2. Создание вакансии
VACANCY_ID=$(curl -X POST http://localhost:5000/api/vacancies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Python Developer",
    "description":"...",
    "requirements":"5+ лет Python"
  }' | jq -r .id)

# 3. Загрузка резюме
curl -X POST http://localhost:5000/api/vacancies/$VACANCY_ID/resumes \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@resume.pdf"

# 4. Запуск скоринга
curl -X POST http://localhost:5000/api/vacancies/$VACANCY_ID/scoring \
  -H "Authorization: Bearer $TOKEN"

# 5. Отслеживание прогресса (SSE)
curl http://localhost:5000/api/vacancies/$VACANCY_ID/scoring/stream \
  -H "Authorization: Bearer $TOKEN"

# 6. Получение результатов
curl http://localhost:5000/api/vacancies/$VACANCY_ID/scoring/results \
  -H "Authorization: Bearer $TOKEN"
```

### Получение результатов с фильтром

```bash
# Получить только результаты выше 75 баллов
curl http://localhost:5000/api/vacancies/$VACANCY_ID/scoring/results \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | select(.overallScore >= 75)'
```
