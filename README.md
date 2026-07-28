# Matrimony API

A NestJS + TypeScript + PostgreSQL REST API powering a matrimony/matchmaking platform: member onboarding, multi-section profiles, matchmaking, social interactions (interests, shortlists, bookmarks, blocking, reporting), messaging, premium subscriptions (Razorpay), and a full admin back office.

Full technical & user documentation (architecture, data model, complete API reference, matching algorithm, user-facing behavior) lives in **`matrimony_api_documentation.pdf`**. This README covers day-to-day setup and contribution basics.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Database](#database)
- [File Uploads](#file-uploads)
- [Authentication](#authentication)
- [API Docs (Swagger)](#api-docs-swagger)
- [Testing](#testing)
- [Deployment Checklist](#deployment-checklist)
- [Known Gaps / TODO](#known-gaps--todo)
- [Guidance for AI Coding Assistants](#guidance-for-ai-coding-assistants)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | NestJS 11 (Express) |
| ORM | TypeORM 0.3 |
| Database | PostgreSQL |
| Auth | JWT (`@nestjs/jwt`, `passport-jwt`) |
| Validation | `class-validator` / `class-transformer` |
| File uploads | Multer (disk storage) |
| Payments | Razorpay |
| Scheduling | `@nestjs/schedule` (cron) |
| API docs | Swagger / OpenAPI |
| Package manager | pnpm |
| Testing | Jest + Supertest |

## Prerequisites

- Node.js (LTS) and `pnpm` (`npm i -g pnpm`)
- A running PostgreSQL instance, with the target database already created
- A Razorpay account/API keys (only needed for the payments module to work end-to-end)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Create a .env file in the project root (see Environment Variables below)

# 3. Make sure your PostgreSQL schema exists — this project does NOT
#    auto-create tables (synchronize: false). See "Database" section.

# 4. Run in watch mode
pnpm run start:dev
```

The API listens on `http://localhost:3001` by default. Swagger docs are at `http://localhost:3001/api`.

## Environment Variables

Create a `.env` file at the project root with:

```env
APP_URL=http://localhost:3001
APP_PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET_KEY=
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECERT_KEY=
JWT_REFRESH_EXPIRES_IN=

ID_SECRET_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

| Variable | Purpose |
|---|---|
| `APP_URL` | Public base URL used to build absolute URLs for uploaded images |
| `APP_PORT` | Intended app port — **note:** `main.ts` currently reads `process.env.PORT`, not `APP_PORT`. Set `PORT` too, or fix `main.ts`, to actually control the listen port. |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | PostgreSQL connection |
| `JWT_SECRET_KEY` / `JWT_EXPIRES_IN` | Access token signing secret + lifetime |
| `JWT_REFRESH_SECERT_KEY` / `JWT_REFRESH_EXPIRES_IN` | Reserved for a refresh-token flow (not yet implemented — see Known Gaps) |
| `ID_SECRET_KEY` | AES key used to encrypt/decrypt numeric IDs exposed to the frontend |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials |

Never commit a populated `.env` file. Use your hosting platform's secret manager in production.

## Available Scripts

```bash
pnpm run start          # start (no watch)
pnpm run start:dev       # start with watch mode
pnpm run start:debug     # start with debugger + watch
pnpm run build           # compile to dist/
pnpm run start:prod      # run compiled build (dist/main.js)

pnpm run lint            # eslint --fix
pnpm run format          # prettier --write

pnpm run test            # unit tests
pnpm run test:watch      # unit tests, watch mode
pnpm run test:cov        # unit tests with coverage
pnpm run test:e2e        # end-to-end tests
```

## Project Structure

```
src/
├── main.ts                # bootstrap: CORS, global ValidationPipe, Swagger, static /uploads
├── app.module.ts            # root module — imports every feature module
├── auth/                    # login, JWT strategy, guards, decorators
├── user/                    # registration + core user lookups
├── shared/                  # small cross-cutting endpoints
├── config/                  # appConfig (upload URL builder), multer config factory
├── common/                  # shared interfaces + AES id-encryption utility
├── dto/                     # request payload validation classes
├── entities/                # TypeORM entities (the data model)
├── my_profile/               # endpoints for the logged-in member's own profile
├── members/                 # endpoints for browsing/interacting with other members
└── admin/                   # admin-only endpoints (master data, moderation, analytics)
```

Every feature module follows the same four-file pattern:

```
feature_name/
├── feature_name.module.ts
├── feature_name.controller.ts
├── feature_name.service.ts
└── feature_name.*.spec.ts
```

See the full documentation PDF (§3, §9) for the complete module/route index.

## Database

TypeORM is configured with:

```ts
autoLoadEntities: true,
synchronize: false,
```

**`synchronize: false` means schema changes are not applied automatically.** When you add/change a `@Column`, you must update the live database yourself (manual SQL, a migration tool, or a seed script — none is currently wired into this repo). Set up a migration workflow before this grows further.

## File Uploads

Uploaded images (profile pictures, gallery photos) are saved to `./uploads/<folder>/` with UUID filenames and served publicly at `/uploads/<folder>/<filename>` via Express static middleware. `src/config/app.config.ts` (`appConfig.uploadsPath(folder, filename)`) is the single helper for building the public URL — reuse it rather than concatenating paths manually.

On any multi-instance or ephemeral-filesystem deployment, move this to shared/object storage (e.g. S3-compatible) — local disk storage won't survive redeploys or scale across instances.

## Authentication

- Stateless JWT Bearer tokens (`Authorization: Bearer <token>`), no session store.
- `JwtAuthGuard` — validates the token.
- `AccountStatusGuard` — blocks Pending/Suspended/Deactivated accounts (403) unless the route is marked `@BypassStatusCheck()`.
- `PremiumGuard` — blocks non-premium users (402) on premium-gated routes.
- `POST /auth/refresh-session` re-signs a token with the user's current DB status — call this after any account-status change so the client's token stays accurate.

Full account-status matrix and guard details are in the documentation PDF, §6.

## API Docs (Swagger)

```
GET /api
```

Swagger UI with Bearer-auth support. Decorator coverage varies by module — add `@ApiTags` / `@ApiOperation` / DTO decorators as you touch a module to improve coverage over time.

## Testing

Every module ships `*.controller.spec.ts` / `*.service.spec.ts` scaffolds. Most are still at their NestJS-CLI default state and need real assertions filled in — please add coverage for any module you modify.

## Deployment Checklist

- [ ] Provision/migrate the target database schema before first boot (`synchronize: false`)
- [ ] Set `PORT` (not just `APP_PORT`) or patch `main.ts` to read `APP_PORT`
- [ ] Update the hard-coded CORS origin allow-list in `main.ts` for your deployed frontend URLs
- [ ] Move `uploads/` to shared/object storage if running more than one instance
- [ ] Inject secrets via your platform's secret manager, not a committed `.env`
- [ ] If scaling to multiple instances, guard the `@Cron('0 * * * * *')` subscription-expiry job against duplicate concurrent runs

## Known Gaps / TODO

- `PORT` vs `APP_PORT` mismatch in `main.ts` (see above)
- CORS origins are hard-coded, not environment-driven
- No migration tooling wired up despite `synchronize: false`
- `JWT_REFRESH_SECERT_KEY` / `JWT_REFRESH_EXPIRES_IN` are defined in `.env` but unused — there's no dedicated refresh-token flow yet, only re-signing an access token from the existing payload
- Most `*.spec.ts` files are unfilled scaffolds

---

## Guidance for AI Coding Assistants

If you're an AI assistant (Claude Code, Copilot, Cursor, etc.) working in this repo, follow these conventions so new code matches the existing codebase:

**Module pattern.** Every feature is a self-contained `module/controller/service` triad under `my_profile/`, `members/`, or `admin/`. When adding a new feature, scaffold the same four files (`*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.spec.ts`) and register the module in `app.module.ts`'s `imports` array — don't bolt routes onto an existing unrelated controller.

**Routing conventions.**
- Member-facing "manage my own data" endpoints live under `my_profile/*`, always scoped to the authenticated user via `@Req() req` → `req.user.id`, never trust a client-supplied user id for "my own" data.
- Endpoints for viewing/interacting with *other* members live under `members/*`.
- Admin endpoints live under `admin/*`; admin equivalents of profile sections use the `*-management` suffix and accept an explicit `user_id`/`:id` param since the admin is acting on someone else's data.
- Create-or-update endpoints follow an **upsert** pattern — a single `POST /update-create/...` (or `/update-create/:id`) route handles both first-time creation and subsequent edits, keyed by the owning user's id. Prefer this pattern over separate POST/PUT routes for one-record-per-user sections.

**Guards.** Apply guards at the controller level with `@UseGuards(...)`, composing from: `JwtAuthGuard` (required on almost everything except `/auth/login` and `/user/registration`), `AccountStatusGuard` (add to any route real members will hit — skip only with `@BypassStatusCheck()` when intentional), and `PremiumGuard` (add to any feature that should be premium-only, matching the existing pattern used by `interests`, `shortlist`, `matched-profiles`, `member-gallery`, `profile-visitors`, `send-messages`, `profile-gallery`).

**IDs in URLs.** Endpoints where a user-supplied ID appears in a "my profile" GET URL typically expect an **AES-encrypted** ID (see `src/common/utils/encryption.util.ts` — `encryptId` / `decryptId`, keyed by `ID_SECRET_KEY`). Don't switch these to raw numeric IDs without updating the frontend contract; conversely, don't encrypt IDs on admin-only or members-list routes where the existing code uses raw numeric IDs — match whatever the sibling routes in that module already do.

**File uploads.** Use `createMulterConfig(folderName)` from `src/config/multer.config.ts` for any new upload field, and build response URLs with `appConfig.uploadsPath(folder, filename)` from `src/config/app.config.ts` — don't hand-roll path concatenation, and don't invent a new storage convention.

**DTOs & validation.** Add a DTO in `src/dto/` for every new request body, using `class-validator` decorators (`@IsOptional()`, `@IsString()`, `@IsNumber()` + `@Type(() => Number)` for numeric query/body fields coming from multipart/form-data). The global `ValidationPipe` has `whitelist: true`, so undeclared fields are silently stripped — if a field isn't showing up server-side, check the DTO first.

**Database.** `synchronize: false` — never assume a new/changed `@Column` is live in the database. Call this out explicitly when you add or modify an entity, and note that a manual migration or schema change is required.

**Before opening a PR / finishing a task:**
- Run `pnpm run lint` and `pnpm run build` — both must pass cleanly.
- Add or update the corresponding `*.spec.ts` for any service/controller logic you touch (most are currently empty scaffolds; don't leave new business logic uncovered).
- If you add or change an endpoint, update the API reference tables in `matrimony_api_documentation.pdf`'s source (or flag it back to a human) so the docs don't drift from the code.
- Don't widen the hard-coded CORS list or touch guard composition on an existing route without calling it out explicitly — those are security-relevant and should be a visible, reviewable change, not a silent side effect.
