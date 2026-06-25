# VictorySearcher.Web

Веб-интерфейс VictorySearcher: создание вакансий, загрузка резюме, просмотр результатов скоринга и аналитики рынка. Часть монорепозитория — см. [корневой README](../README.md).

## Что делает

Две защищённые секции под одним входом (единственный JWT-пользователь):

- **Скоринг резюме** (`/scoring`) — создание вакансии, загрузка резюме (TXT, DOCX, PDF), запуск скоринга с прогрессом в реальном времени и ранжированный список кандидатов с разбивкой баллов, обоснованием и разбором по требованиям.
- **Аналитика рынка** (`/market`) — дашборды по целевым ролям. *Запланировано, пока не реализовано.*

## Стек

React 19 + TypeScript + Vite. React Router, TanStack Query, React Hook Form, Radix UI Primitives, Recharts, clsx.

## Команды

```bash
npm install
npm run dev      # Dev-сервер на http://localhost:5173 (проксирует /api → http://localhost:5000)
npm run build    # Проверка типов + сборка
npm run lint     # ESLint
```

Для работы нужен запущенный бэкенд — см. [`VictorySearcher.Service`](../VictorySearcher.Service/README.md).

## Структура

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
