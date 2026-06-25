# VictorySearcher.Web

**VictorySearcher.Web** — веб-интерфейс VictorySearcher: клиентская часть монорепозитория, через которую рекрутёр создаёт вакансии, загружает резюме и смотрит результаты скоринга и аналитику рынка. Собственных данных не хранит — работает поверх REST API бэкенда. См. также [корневой README](../README.md).

## О проекте 🏗

SPA на React: тонкий клиент над [`VictorySearcher.Service`](../VictorySearcher.Service/README.md). Весь доступ под одним входом — две защищённые секции, переключаемые в навигации.

### Чем занимается

- **Скоринг резюме** (`/scoring`) — создание вакансии, загрузка резюме (TXT, DOCX, PDF), запуск скоринга с прогрессом в реальном времени и ранжированный список кандидатов с разбивкой баллов, обоснованием и разбором по требованиям.
- **Аналитика рынка** (`/market`) — дашборды по целевым ролям. *Запланировано, пока не реализовано.*

### Доступ

Единственный JWT-пользователь: один вход открывает обе секции, неавторизованные маршруты закрыты.

### Структура

```
src/
  api/         # client.ts (fetch + JWT) + *.api.ts по фичам
  components/  # ui/ (примитивы), layout/ (AppLayout, Header, Sidebar)
  features/    # auth/, scoring/, market/ — каждая с components/, hooks/, index.ts
  pages/       # тонкие обёртки над features
  providers/   # AuthProvider, QueryProvider
  styles/      # variables.css, global.css, animations.css
  types/       # api.ts — DTO-контракты, синхронизированы с бэкендом
```

Соглашения проекта (публичное API фич, CSS Modules, разделение «компонент = отображение / логика в хуках», работа с auth) — в [`CLAUDE.md`](CLAUDE.md). Визуальный язык и дизайн-токены — в [`VictorySearcher.Design`](../VictorySearcher.Design/design/).

## ⚙️ Технологический стек

- **React 19 + TypeScript + Vite** — основа и сборка
- **React Router** — маршрутизация
- **TanStack Query** — серверное состояние и кеш запросов
- **React Hook Form** — формы
- **Radix UI Primitives** — доступные UI-примитивы
- **Recharts** — графики для аналитики
- **clsx** — composition CSS-классов

## 🔗 Сторонние сервисы

- **[`VictorySearcher.Service`](../VictorySearcher.Service/README.md)** — бэкенд-API, источник всех данных. Dev-сервер проксирует `/api` → `http://localhost:5000`; без запущенного бэкенда фронтенд не работает.

## Как запустить

```bash
npm install
npm run dev      # Dev-сервер на http://localhost:5173 (проксирует /api → http://localhost:5000)
npm run build    # Проверка типов + сборка
npm run lint     # ESLint
```

Для работы нужен запущенный бэкенд — см. [`VictorySearcher.Service`](../VictorySearcher.Service/README.md).
