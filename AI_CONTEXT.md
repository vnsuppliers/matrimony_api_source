# AI Context

Everything an AI assistant needs to know before touching this codebase, summarized. This is a condensed reference — follow the links for full detail rather than assuming this file has it all.

## Architecture (summary)

Single NestJS 11 process, single PostgreSQL database (TypeORM 0.3, `synchronize: false`), no microservices/queue/cache. ~60 feature modules imported flatly into `src/app.module.ts`. Full detail + diagrams: [ARCHITECTURE.md](ARCHITECTURE.md). System/domain overview: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).

## Folder conventions

```
src/
├── main.ts        # bootstrap: CORS, global ValidationPipe, Swagger, static /uploads
├── app.module.ts  # root module — imports every feature module
├── auth/          # login, JWT strategy, guards, decorators
├── user/          # registration + core user lookups
├── shared/        # small cross-cutting endpoints
├── config/        # appConfig (upload URL builder), multer config factory
├── common/        # shared interfaces + AES id-encryption utility
├── dto/           # request payload validation classes
├── entities/       # TypeORM entities (the data model)
├── email/         # nodemailer wrapper (no HTTP routes)
├── helpers/       # supporting helpers (e.g. transporter.helper.ts)
├── my_profile/    # endpoints for the logged-in member's OWN profile
├── members/       # endpoints for browsing/interacting with OTHER members
└── admin/         # admin-only endpoints (master data, moderation, analytics, payments)
```

## Module conventions

Every feature module is `*.module.ts` + `*.controller.ts` + `*.service.ts` + `*.spec.ts`, registered in `app.module.ts`'s flat `imports` array. When adding a feature, scaffold the same four files rather than bolting routes onto an existing unrelated controller. Full module inventory: [docs/MODULES.md](docs/MODULES.md).

- `my_profile/*` — member manages **own** data, scoped via `@Req() req` → `req.user.id`. Never trust a client-supplied id for "my own" data here.
- `members/*` — endpoints for viewing/interacting with **other** members, raw numeric ids.
- `admin/*` — admin-only; `*_management` modules mirror a `my_profile` section but take an explicit `:id`/`user_id`.
- **Upsert pattern**: one-record-per-user sections expose `POST /update-create/:user_id` for both create and update, rather than separate POST/PUT.

## API conventions

Full route inventory: [docs/API.md](docs/API.md). Guard composition (`JwtAuthGuard` → `AccountStatusGuard` → `PremiumGuard`) is a **per-module convention**, not enforced by a shared base class — match the sibling routes in the module being edited. **Six `admin/master/*` controllers currently have no guard at all** (`countries`, `states`, `cities`, `gender`, `mother_tongue`, `religion`) — don't assume every admin route is authenticated; check the specific controller.

ID convention: `my_profile/*` GET urls generally expect an AES-encrypted id (`src/common/utils/encryption.util.ts`); `admin/*`/`members/*` generally use raw numeric ids. Per-route, not universal.

## DTO conventions

Request DTOs live in `src/dto/` (flat, plus a `payments/` subfolder), using `class-validator` decorators (`@IsOptional`, `@IsString`, `@IsNumber`/`@IsInt`, `@Type(() => Number)` or `@Transform` for numeric values arriving as strings via query/multipart). **Not every module uses a formal DTO class** — several (`countries`, `states`, `cities`, `education`, `specialisation`, `profession_master` master-data write endpoints, `member_management`'s action body) use an inline-typed `@Body()` object or a local `types/*.types.ts` interface instead. Check the actual controller before assuming a DTO class exists for a given route.

## Validation approach

One global `ValidationPipe` (`src/main.ts`): `whitelist: true`, `forbidNonWhitelisted: false` (undeclared fields are silently dropped, not rejected), `transform: true`. There is no per-module validation configuration — it's identical everywhere. If a field submitted by a client isn't reaching a service, check the route's DTO first.

## Error handling

No custom global `ExceptionFilter` exists anywhere — Nest's default `HttpException` JSON shape is used throughout. Services throw built-in exceptions (`BadRequestException`, `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`) directly. One custom exception class exists: `PremiumRestrictionException` (`src/auth/guards/premium-restriction.exception.ts`, always HTTP 402). `AccountStatusGuard` additionally attaches an `errorCode` field to its 403 responses. `EmailService.send()` throws a plain (non-HTTP) `Error` if a template is missing/disabled — callers that `await` it without a try/catch will surface this as an unhandled 500.

## Authentication

Stateless JWT Bearer tokens. `JwtStrategy` (`src/auth/strategies/jwt.strategy.ts`) re-fetches the user from the database **on every guarded request** (not just at login) — `req.user` is always fresh as of the start of the current request. Full sequence: [ARCHITECTURE.md](ARCHITECTURE.md), [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md).

## Authorization

Three composable guards (`JwtAuthGuard`, `AccountStatusGuard`, `PremiumGuard`), applied via `@UseGuards(...)` at the controller (occasionally method) level — see [ARCHITECTURE.md](ARCHITECTURE.md) for exact semantics and [docs/API.md](docs/API.md) for the guard list per route.

## Common utilities / shared services

- `src/common/utils/encryption.util.ts` — `encryptId`/`decryptId`, AES via `crypto-js`, keyed by `ID_SECRET_KEY`.
- `src/config/app.config.ts` — `appConfig.uploadsPath(folder, filename)`, the single helper for building a public upload URL. Always reuse this rather than hand-rolling path concatenation.
- `src/config/multer.config.ts` — `createMulterConfig(folderName)`, the single Multer factory for disk-storage uploads (UUID-UUID filenames).
- `src/email/email.service.ts` (`EmailService.send(templateKey, to, data)`) — the only way transactional email is sent; templates and SMTP config are both database rows (`email_templates`, `settings`), not files/env vars.
- `src/user/user.service.ts` (`UserService`) — the shared source of user/member lookups (`findUserById`, `findMemberByUserId`, `validate_user`) depended on by `AuthModule` and `JwtStrategy`.

## Naming conventions

`feature_name.module.ts` / `FeatureNameModule`, `feature_name.controller.ts` / `FeatureNameController`, `feature_name.service.ts` / `FeatureNameService` — snake_case filenames, PascalCase classes. A few folder names carry over pre-existing typos from the codebase (`atronomic_info`, `add_to_whislist`/`whilist`, `profile_visttors.entity.ts`, `siblings_info_entity.ts` without a dot before `entity`) — do not "fix" these silently, since renaming a file/class here means renaming an import graph and, for entity files, has no bearing on the already-live database table name either way.

## The gaps worth knowing about before you touch related code

See [ARCHITECTURE.md](ARCHITECTURE.md#known-architectural-gaps) for the full list (migrations, PORT/APP_PORT, CORS, uploads storage, cron locking, unguarded master-data routes, missing `FRONTEND_URL`).

For the mandatory read-order and hard rules when making a change, see [AI_RULES.md](AI_RULES.md).
