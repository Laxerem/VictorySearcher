# ARCHITECTURE.md — VictorySearcher

> Живой документ. Обновляется при изменении архитектурных решений.

---

## Обзор

Внутренний инструмент для HR: скоринг резюме (LLM) + аналитика рынка труда (HH, SuperJob).  
Монолит. Деплой — Docker Compose на машине предприятия.

---

## VictorySearcher.Service

### Архитектурный паттерн

**Clean Architecture** — 4 слоя, зависимости направлены строго внутрь:

```
API → Application → Domain
Infrastructure → Application → Domain
```

| Слой | Проект | Ответственность |
|------|--------|-----------------|
| Domain | `*.Domain` | Сущности, перечисления, интерфейсы репозиториев |
| Application | `*.Application` | Use cases, команды/запросы, бизнес-логика |
| Infrastructure | `*.Infrastructure` | EF Core, Hangfire, LLM-клиент, парсеры, HTTP-клиенты HH/SuperJob |
| API | `*.Api` | HTTP-эндпоинты, auth middleware, конфигурация DI |

### Стек

| Компонент | Выбор | Причина |
|-----------|-------|---------|
| Runtime | .NET 9 | Основной стек команды |
| БД | PostgreSQL + EF Core 9 | Реляционные данные, JSON-столбцы, задачи Hangfire |
| Фоновые задачи | **Hangfire** | Persistence при рестарте, cron, retry, встроенный dashboard |
| LLM | polza.ai (OpenAI SDK) | OpenAI-совместимый → смена провайдера без рефакторинга |
| Парсинг резюме | ResumeParserDispatcher | `.txt`, `.docx`, `.pdf` |
| Авторизация | JWT из `appsettings.json` | Один внутренний аккаунт, без регистрации |

### Ключевые сущности (Domain)

- **Vacancy** — вакансия рекрутёра
- **Resume** — загруженный файл резюме
- **ScoringRequest** — сессия скоринга (1 вакансия → N резюме)
- **ScoringResult** — оценка одного резюме (overall / experience / skills / extra / reasoning / IsUncertain); `RequirementsAnalysis` хранится как JSON-столбец (`OwnsMany ... ToJson`) — список `RequirementCoverage(Requirement, Covered, Evidence)`
- **User** — один системный пользователь

### Фоновые задачи (Hangfire)

```
ResumeScoringJob — запускается вручную рекрутёром; обрабатывает только непроверенные резюме (инкрементный режим);
                   на каждое резюме запускает N параллельных LLM-ранов и берёт медиану баллов;
                   выставляет IsUncertain, если разброс между ранами превышает порог
MarketCollectJob — cron ежедневно; собирает вакансии с HH + SuperJob, строит снимок [запланировано]
```

### Прогресс скоринга (SSE)

`ResumeScoringJob` отдаёт прогресс через `System.Threading.Channels`; `GET /api/vacancies/{id}/scoring/stream` транслирует события `checked/total` клиенту по Server-Sent Events в реальном времени. Рядом остаются обычные `GET .../scoring/status` и `GET .../scoring/results` для одноразового опроса.

### Схема БД (логические группы)

```
[Скоринг]                          [Аналитика рынка — запланирована]
Vacancies                          MarketRoles
Resumes                            MarketSnapshots
ScoringRequests                    MarketVacancies
ScoringResults
  └── RequirementsAnalysis (JSON)
```

Hangfire хранит свои таблицы в том же PostgreSQL.

### Репозитории и Unit of Work

Репозитории только стейджируют изменения в `DbContext` (Add/Update/Remove) — `SaveChangesAsync` не вызывается. Сохранение выполняется в Application-сервисах через `IUnitOfWork.SaveChangesAsync()` один раз на use case.

`IScoringResultRepository.GetLatestByVacancyId` возвращает только самый свежий результат на каждое резюме по всей вакансии (коррелированный подзапрос на стороне БД). Это обеспечивает корректный показ результатов при инкрементном скоринге.

### Внешние интеграции

| Сервис | Метод доступа | Статус |
|--------|--------------|--------|
| polza.ai | OpenAI SDK, переопределённый BaseUrl; structured output (json_object) | Реализован |
| HH (api.hh.ru) | GET без OAuth (публичные вакансии), задержки 1–2 с, кэш снимков 24 ч | Запланирован |
| SuperJob (api.superjob.ru) | API-ключ приложения, задержки 1–2 с, кэш снимков 24 ч | Запланирован |

---

## VictorySearcher.Web

React 19 + TypeScript + Vite. Стек: React Router, TanStack Query, React Hook Form, Radix UI Primitives, Recharts, clsx.

Две защищённые секции (`/scoring`, `/market`) + публичный `/login`. JWT хранится в памяти (AuthContext) и восстанавливается из localStorage; все запросы проходят через `api/client.ts`, который проставляет заголовок `Authorization`.

```
src/
  api/        # client.ts + *.api.ts per feature
  components/ # ui/ (примитивы), layout/ (AppLayout, Header, Sidebar)
  features/   # auth/, scoring/, market/ — каждая с components/, hooks/, index.ts
  pages/      # тонкие обёртки над features
  styles/     # variables.css, global.css, animations.css
  types/      # api.ts — DTO-контракты, синхронизированы с бэкендом
```

**Ключевые соглашения.** Компонент = только отображение; вся логика и обращения к API — в хуках (`features/*/hooks/`). Серверное состояние — только через TanStack Query. Публичное API каждой фичи — только через её `index.ts`.

---

## Нефункциональные требования

- **Автономность** — фоновые задачи работают по расписанию без ручного вмешательства
- **Безопасность данных** — все данные (резюме, зарплаты) хранятся локально
- **Rate limit compliance** — задержки и кэш при обращении к внешним API
- **Расширяемость** — новый источник рынка = новый `IMarketCollector` в Infrastructure
