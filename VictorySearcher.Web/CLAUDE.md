# CLAUDE.md — VictorySearcher.Web

> 🚨 **READ FIRST — MANDATORY.** Before doing anything in this service, read the root [`../CLAUDE.md`](../CLAUDE.md). It is the single registry of repo-wide skills and rules that are NOT auto-loaded from this subfolder. Skipping it means working without the project's shared skills and rules. This is not optional.

React 19 + TypeScript + Vite frontend for the internal HR tool.
Two protected sections: **Resume Scoring** and **Market Analytics**. Single JWT user.

## Key docs

| File | When to read |
|------|-------------|
| `../docs/TASK.md`         | What the product must do |
| `../docs/ARCHITECTURE.md` | Backend structure and domain model |

## Commands

```bash
npm run dev      # Dev server at http://localhost:5173 (proxies /api → http://localhost:5000)
npm run build    # Type-check + bundle
npm run lint     # ESLint
```

## Stack

React Router, TanStack Query, React Hook Form, Radix UI Primitives, Recharts, clsx.

## Structure

```
src/
  api/            # client.ts (fetch + JWT) + *.api.ts per feature
  components/
    ui/           # Design-system primitives
    layout/       # AppLayout, Header, Sidebar
  features/       # auth/, scoring/, market/ — each with components/, hooks/, index.ts
  pages/          # Thin wrappers: LoginPage, ScoringPage, MarketPage, NotFoundPage
  providers/      # AuthProvider, QueryProvider
  styles/         # variables.css, global.css, animations.css
  types/          # api.ts, common.ts
  utils/          # cn.ts (clsx wrapper), formatters.ts
```

## Rules

### Feature public API
Import only from `features/*/index.ts` — never from component internals.
```ts
// ✅
import { VacancyForm, useVacancies } from '@/features/scoring'
// ❌
import { VacancyForm } from '@/features/scoring/components/VacancyForm/VacancyForm'
```

### CSS Modules
- Every component/page has its own `*.module.css`.
- Classes in camelCase: `.scoringCard`, `.errorText`, `.primaryButton`.
- Use `var()` from `styles/variables.css` — never hardcode colors, spacing, or radii.
- Conditional classes via `cn()`: `cn(styles.card, isActive && styles.active)`.
- No `@import` between module files.

### Component responsibility
- Component = view only. No API calls, no business logic.
- API calls + state + effects → custom hook in `features/*/hooks/`.

### Radix vs native HTML
- Use Radix for: Select, Dialog, Tabs, Tooltip, DropdownMenu.
- Use native HTML for: Button, Input, Textarea, Card, Badge, Spinner.

### Server state
- All server data through TanStack Query (`useQuery` / `useMutation`).
- Scoring status polling: `refetchInterval: data?.status === 'done' ? false : 3000`.

### Auth
- JWT token lives in `AuthContext` (memory + localStorage).
- All API requests: `Authorization: Bearer <token>` injected in `api/client.ts`.
- Routes `/scoring` and `/market` are protected; unauthenticated → redirect `/login`.

### Path alias
`@` resolves to `src/`. Always use `@/` for imports, never relative `../../`.

## Progress tracking

After implementing any user-visible feature, update `progress.json` — see `../.claude/rules/progress-json.md`.

## Naming

| Artifact | Convention | Example |
|----------|-----------|---------|
| Components | PascalCase file + folder | `ScoredResumeCard/` |
| Hooks | `use` + noun | `useScoringResult.ts` |
| API functions | verb + noun | `startScoring`, `getVacancies` |
| CSS classes (module) | camelCase | `.scoringCard` |
| Types | PascalCase + suffix | `ScoringResultDto` |
| Env vars | `VITE_` + UPPER_SNAKE | `VITE_API_BASE_URL` |