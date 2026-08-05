# Matrimony API

A NestJS + TypeScript + PostgreSQL REST API powering a matrimony/matchmaking platform: member onboarding, multi-section profiles, matchmaking, social interactions (interests, shortlists, bookmarks, blocking, reporting), messaging, premium subscriptions (Razorpay), and a full admin back office.

This README covers day-to-day setup and contribution basics. For deeper detail see: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) (what this is, domain model), [ARCHITECTURE.md](ARCHITECTURE.md) (request lifecycle, guards, module relationships), [docs/API.md](docs/API.md) (every endpoint), [docs/DATABASE.md](docs/DATABASE.md) (every entity), [docs/MODULES.md](docs/MODULES.md) (every NestJS module), [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md) (registration/login/payment/etc. sequence diagrams), [SETUP.md](SETUP.md), and [DEPLOYMENT.md](DEPLOYMENT.md). If you're an AI assistant, start with [AI_RULES.md](AI_RULES.md) and [AI_CONTEXT.md](AI_CONTEXT.md) instead of the section below.

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

FRONTEND_URL=http://localhost:5173
```

| Variable | Purpose |
|---|---|
| `APP_URL` | Public base URL used to build absolute URLs for uploaded images |
| `APP_PORT` | Intended app port — **note:** `main.ts` currently reads `process.env.PORT`, not `APP_PORT`. Set `PORT` too, or fix `main.ts`, to actually control the listen port. |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | PostgreSQL connection |
| `JWT_SECRET_KEY` / `JWT_EXPIRES_IN` | Access token signing secret + lifetime |
| `JWT_REFRESH_SECERT_KEY` / `JWT_REFRESH_EXPIRES_IN` | Defined but **unused** — no dedicated refresh-token flow exists; `POST /auth/refresh-session` just re-signs a fresh access token |
| `ID_SECRET_KEY` | AES key used to encrypt/decrypt numeric IDs exposed to the frontend |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials |
| `FRONTEND_URL` | Used only to build the `login_url` link inside the registration welcome email (`src/user/user.service.ts`) — **not present in the current `.env`**, so that link is currently broken (`undefined/login`) until this is added |

Never commit a populated `.env` file. Use your hosting platform's secret manager in production.

**Email/SMTP is not configured via environment variables.** Outbound mail (`src/email/`) reads SMTP host/port/credentials and the "from" name/address from the single-row `settings` database table (`SettingsEntity`), not from `.env` — see [docs/DATABASE.md](docs/DATABASE.md) and [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md).

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

See [docs/MODULES.md](docs/MODULES.md) for the complete module index and [docs/API.md](docs/API.md) for the complete route index.

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

Full account-status matrix and guard details are in [ARCHITECTURE.md](ARCHITECTURE.md).

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
- `FRONTEND_URL` is read by the registration welcome email but not defined in `.env` — the email's login link is currently broken
- Most `*.spec.ts` files are unfilled scaffolds

---

## Guidance for AI Coding Assistants

Moved to [AI_RULES.md](AI_RULES.md) (mandatory read order + rules) and [AI_CONTEXT.md](AI_CONTEXT.md) (conventions summary) so there is a single, up-to-date place for this instead of duplicating it here where it could drift.
