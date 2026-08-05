# AI Rules

## Whenever modifying this project

1. Read [AI_CONTEXT.md](AI_CONTEXT.md) first.
2. Read [ARCHITECTURE.md](ARCHITECTURE.md).
3. Read [docs/API.md](docs/API.md).
4. Read [docs/DATABASE.md](docs/DATABASE.md).
5. Read [docs/MODULES.md](docs/MODULES.md).
6. Follow existing architecture — module-per-feature-folder, `*.module.ts`/`*.controller.ts`/`*.service.ts`/`*.spec.ts`, registered in `app.module.ts`.
7. Reuse existing services — `UserService` for user/member lookups, `EmailService` for outbound mail, `encryptId`/`decryptId` for id handling, `appConfig`/`createMulterConfig` for uploads. Don't reimplement any of these locally.
8. Do not duplicate logic — if a similar upsert/CRUD shape already exists in a sibling module, match it rather than inventing a new one.
9. Keep code style consistent — `pnpm run lint` / `pnpm run format` before finishing; match the naming and guard-composition conventions in [AI_CONTEXT.md](AI_CONTEXT.md).
10. Update documentation whenever code changes — see the mapping below.

## Which doc to update for which change

| You changed... | Update... |
|---|---|
| A route, guard, or DTO on an endpoint | [docs/API.md](docs/API.md) |
| An entity, column, or relation | [docs/DATABASE.md](docs/DATABASE.md) |
| Added/removed/restructured a module | [docs/MODULES.md](docs/MODULES.md), [ARCHITECTURE.md](ARCHITECTURE.md) |
| A multi-step flow (registration, login, payments, upload, etc.) | [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md) |
| Environment variables, scripts, local setup | [SETUP.md](SETUP.md), [README.md](README.md) |
| Deployment-relevant behavior (CORS, uploads storage, cron) | [DEPLOYMENT.md](DEPLOYMENT.md) |

If a change would make an existing sentence in any of the above files false, fix that sentence in the same change — documentation drift is a bug, not a follow-up task.

## General rules

- Generate/update documentation **only** from the existing source code. Never invent APIs, modules, entities, DTOs, or business logic that aren't actually in `src/`.
- If something can't be determined by reading the code (e.g. an intended-but-unimplemented feature), write "Not Found" rather than guessing — see [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md)'s "Not applicable" section for the pattern.
- Do not create unnecessary markdown files. This repository's documentation set is intentionally fixed: `README.md`, `PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`, `AI_CONTEXT.md`, `AI_RULES.md`, `SETUP.md`, `DEPLOYMENT.md`, `docs/API.md`, `docs/DATABASE.md`, `docs/MODULES.md`, `docs/BUSINESS_FLOW.md`. Do not add a per-controller/per-service/per-DTO/per-entity/per-API markdown file — extend the existing single file for that category instead.
- There is no frontend/UI in this repository — do not create frontend or UI documentation.
- Keep documentation clean, structured, and equally readable by a human developer and a future AI session. Documentation here is the source of truth for future AI tasks — treat inaccuracies in it as bugs.

## Don't do these without explicit user confirmation

- Widen the hard-coded CORS allow-list in `src/main.ts`.
- Change guard composition (`@UseGuards(...)`) on an existing route — including "fixing" the six currently-unguarded `admin/master/*` controllers (see [ARCHITECTURE.md](ARCHITECTURE.md#known-architectural-gaps)); flag it, don't silently patch it.
- Any destructive git operation (force-push, `reset --hard`, branch deletion).
- Introduce a database migration mechanism given `synchronize: false` and no tooling currently wired in — discuss the choice first.
- Commit a populated `.env` or any file that looks like it contains secrets/credentials.

## Before finishing any task

- [ ] `pnpm run lint` and `pnpm run build` pass.
- [ ] Any touched service/controller has its `*.spec.ts` updated (most are currently empty NestJS-CLI scaffolds — don't leave new logic uncovered).
- [ ] Every doc in the "which doc to update" table above that's affected by the change has actually been updated.
- [ ] Security-relevant changes (CORS, guards, ID exposure, secrets) are called out explicitly, not buried in an unrelated diff.
