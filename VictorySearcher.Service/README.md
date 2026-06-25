# VictorySearcher.Service

Бэкенд VictorySearcher: скоринг резюме через LLM, фоновый сбор аналитики рынка и REST API. Часть монорепозитория — см. [корневой README](../README.md).

## Что делает

- **Скоринг резюме.** Рекрутёр создаёт вакансию и загружает резюме (`.txt`, `.docx`, `.pdf`); фоновая задача парсит текст и оценивает каждое резюме через LLM, выдавая балл, разбивку (опыт / навыки / доп. требования), обоснование на русском и разбор по пунктам требований. Скоринг инкрементный — повторный запуск обрабатывает только непроверенные резюме.
- **Аналитика рынка труда.** Автономный сбор вакансий с HH и SuperJob по расписанию. *Запланировано, пока не реализовано.*

## Стек

- **.NET 9 / C# 12**, ASP.NET Core
- **PostgreSQL + EF Core 9** (code-first, миграции)
- **Hangfire** — персистентные фоновые задачи (cron, retry), дашборд на `/hangfire`
- **LLM** через OpenAI SDK (polza.ai, OpenAI-совместимый эндпоинт)
- **Serilog** — структурированное логирование

## Архитектура

Clean Architecture, 4 проекта со строгим направлением зависимостей внутрь:
`Domain ← Application ← Infrastructure / Api`.

Подробно — в [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md). Правила и соглашения для разработки — в [`CLAUDE.md`](CLAUDE.md).

## API

Все эндпоинты, кроме логина, требуют JWT (`Authorization: Bearer <token>`).

| Метод | Маршрут | Назначение |
|-------|---------|-----------|
| POST | `/api/auth/login` | Логин, выдаёт JWT |
| POST · GET | `/api/vacancies` | Создать вакансию · список вакансий |
| GET | `/api/vacancies/{id}` | Детали вакансии |
| POST · GET | `/api/vacancies/{id}/resumes` | Загрузить резюме (multipart) · список с пагинацией |
| GET | `/api/vacancies/{id}/resumes/{resumeId}/content` | Извлечённый текст резюме |
| GET | `/api/vacancies/{id}/resumes/{resumeId}/download` | Оригинальный файл |
| POST | `/api/vacancies/{id}/scoring` | Запустить скоринг (Hangfire-джоб) |
| GET | `/api/vacancies/{id}/scoring/status` | Текущий статус скоринга |
| GET | `/api/vacancies/{id}/scoring/results` | Результаты, отсортированные по баллу |
| GET | `/api/vacancies/{id}/scoring/stream` | Прогресс скоринга в реальном времени (SSE) |

Интерактивная схема API — Swagger UI на `/swagger`, дашборд фоновых задач — на `/hangfire`.

## Запуск

Проще всего — через Docker Compose из корня репозитория (поднимает API + PostgreSQL):

```bash
cd ..
cp .env.example .env   # заполнить ключ LLM и учётные данные
docker compose up -d
```

API будет доступен на `http://localhost:5000` (контейнер слушает `8080`).

Локально (нужны установленный .NET 9 SDK и доступная PostgreSQL):

```bash
dotnet build VictorySearcher.Service.slnx
dotnet run --project VictorySearcher.Service.Api
```

## Конфигурация

Настройки задаются через `appsettings.json` и переменные окружения (Options-паттерн). Ключевые группы — см. [`.env.example`](../.env.example):

- `Jwt__*` — секрет и учётные данные единственного пользователя
- `Llm__*` — `ApiKey`, `BaseUrl`, `ModelId` провайдера LLM
- `ConnectionStrings__Postgres` — строка подключения к БД
- `Storage__UploadsPath` — каталог хранения загруженных резюме

## Миграции

```bash
dotnet ef migrations add <Name> \
  -p VictorySearcher.Service.Infrastructure \
  -s VictorySearcher.Service.Api
```
