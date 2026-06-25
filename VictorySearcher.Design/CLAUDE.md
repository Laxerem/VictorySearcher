# CLAUDE.md — VictorySearcher.Design

> 🚨 **READ FIRST — MANDATORY.** Before doing anything in this service, read the root [`../CLAUDE.md`](../CLAUDE.md). It is the single registry of repo-wide skills and rules that are NOT auto-loaded from this subfolder. Skipping it means working without the project's shared skills and rules. This is not optional.

Design workspace for the VictorySearcher frontend: UI is worked out here together with Claude before it is built in `VictorySearcher.Web`. Not deployed — it is the source of truth for the UI.

## Directory structure

```
design/        # Specs: 00-concept, 01-tokens, 02-typography, 03-components, 04-screens
mockups/       # HTML/CSS prototypes (app.css, tokens.css) + rendered PNG screens
references/    # Visual references for the desired look
```

## Conventions

- The design language is defined in `design/` — read `01-tokens.md` and `02-typography.md` before producing any mockup.
- Prototypes in `mockups/` must use the tokens from `mockups/tokens.css` — never hardcode colors, spacing, or radii.
- Keep prototypes self-contained (plain HTML/CSS); this folder has no build step and no framework.
