---
description: Request permission and apply migrations when changing Domain entities or enums
globs: ["VictorySearcher.Service.Domain/Entities/**/*.cs", "VictorySearcher.Service.Domain/Enums/**/*.cs"]
---

# Domain Entity Changes

When modifying any entity or enum:
- Use `AskUserQuestion` to ask permission before making changes — describe what and why
- If approved → apply the change, then run:
  ```bash
  dotnet ef migrations add <PascalCaseName> --project VictorySearcher.Service.Infrastructure --startup-project VictorySearcher.Service.Api
  ```
- If denied → stop, do not touch the file
