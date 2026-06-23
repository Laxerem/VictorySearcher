---
name: feedback-claude-md
description: Правила написания CLAUDE.md и C# brace style K&R
metadata:
  type: feedback
---

CLAUDE.md пишется строго по скиллу `.claude/skills/write-claude-md/SKILL.md`.

**Why:** Пользователь явно указал использовать скилл — он определяет стандарт файла для всего проекта.

**How to apply:**
- Файл всегда на **английском** (скилл требует это явно)
- Процедуры и пошаговые чеклисты (например, "что делать при добавлении сущности") — НЕ в CLAUDE.md. Они идут в `.claude/skills/<name>/SKILL.md`
- Post-change checklist в CLAUDE.md — только **команды** (build, migrate, lint), не шаги
- Паттерны — 2–4 предложения, без примеров кода
- Лимит ~150 строк

---

**C# brace style: K&R** — открывающая скобка на той же строке, что и объявление (`class Foo {`, `void Bar() {`, `if (x) {`).

**Why:** Явное требование пользователя, закреплено в CLAUDE.md проекта ("Brace style: K&R").

**How to apply:** Во всех создаваемых и редактируемых C#-файлах — открывающая скобка всегда на той же строке. Allman style (скобка на отдельной строке) — ошибка.

Связано с: [[feedback-architecture-doc]], [[adr-core]]
