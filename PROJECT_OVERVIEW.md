# Project Overview

## Purpose

The Matrimony API is the backend for a matrimony/matchmaking platform. It is a **backend-only** NestJS 11 + TypeORM + PostgreSQL REST API — there is no frontend, UI, or component code in this repository. It serves three external consumers over HTTP:

- **Member-facing web app** — registration, multi-section profile management, browsing/matching with other members, messaging, premium subscriptions.
- **Admin back office** — moderation, master-data management (countries/states/cities/religion/education/etc.), member management, payments/subscription oversight, analytics.
- **Razorpay** — the payment gateway for premium subscription purchases (order creation + signature verification).

See [README.md](README.md) for setup/run instructions, [ARCHITECTURE.md](ARCHITECTURE.md) for the technical shape of the system, [docs/MODULES.md](docs/MODULES.md) for the full module inventory, and [docs/API.md](docs/API.md) for the full route inventory.

## Business domain

A matrimony/matchmaking service: members build a detailed profile (identity, education, profession, family, lifestyle, physical attributes, hobbies, relatives, addresses, astrology, photo gallery), then discover and interact with other members' profiles (view, shortlist, wishlist, bookmark, express interest, message, block, report). Premium subscriptions (paid via Razorpay) unlock the interaction/matching features. Admin staff moderate content (galleries, reports, success stories) and manage the reference/master data that profile forms are built from (countries → states → cities, religions, education levels, professions, etc.).

## Domain model in one paragraph

A `User` (login/credentials/account status) owns one or more `MemberEntity` profiles (the matchmaking-facing record), which is composed from many one-to-one/one-to-many "info" entities — education, profession, family, siblings, lifestyle, physical attributes, hobbies, relatives, present/permanent address, astronomic (astrology) info — plus a photo gallery. Members interact with other members through interests, shortlists, bookmarks, blocking, reporting, profile visits, and direct messages. Premium subscriptions (via Razorpay) unlock gated features, tracked by a per-minute cron sweep that expires lapsed subscriptions. Admins manage master/reference data and moderate member content and reports. See [docs/DATABASE.md](docs/DATABASE.md) for the full entity list.

## Main modules

~60 NestJS feature modules grouped by audience, not by technical layer (see [docs/MODULES.md](docs/MODULES.md) for the full list):

| Group | Folder | What it's for |
|---|---|---|
| Identity | `src/auth/`, `src/user/` | Login, JWT issuance/validation, registration |
| Own profile | `src/my_profile/*` (16 modules) | The authenticated member manages their own profile sections |
| Other members | `src/members/*` (12 modules) | Browsing/interacting with other members (interests, shortlist, messaging, notifications, etc.) |
| Admin | `src/admin/*` (27 modules incl. 12 under `master/`) | Moderation, per-section management mirrors, reference data, payments oversight, analytics |
| Cross-cutting | `src/config/`, `src/common/`, `src/dto/`, `src/entities/`, `src/email/`, `src/shared/`, `src/helpers/` | Upload config, id-encryption, DTOs, the data model, transactional email, small shared endpoints |

## High-level architecture

Single NestJS process → single Express HTTP server → single PostgreSQL database. No microservices, no message queue, no cache layer, no separate worker — the subscription-expiry cron (`@nestjs/schedule`) runs in-process. Full detail, including a diagram: [ARCHITECTURE.md](ARCHITECTURE.md).

## Third-party integrations

| Integration | Used for | Where |
|---|---|---|
| **Razorpay** | Premium subscription payments (order creation, signature verification) | `src/admin/payments/` |
| **nodemailer (SMTP)** | Transactional email (registration welcome email, etc.) | `src/email/`, `src/helpers/transporter.helper.ts` — SMTP host/credentials and the "from" address come from the `settings` database table, **not** environment variables |
| **Swagger / OpenAPI** | Interactive API docs at `GET /api` | assembled in `src/main.ts` |

No other third-party services (no SMS provider, no push-notification service, no object storage, no cache/queue) exist in the codebase today — file uploads go to local disk (see [ARCHITECTURE.md](ARCHITECTURE.md)).

## Overall request flow

1. Express receives the request; CORS is checked against a hard-coded origin allow-list in `src/main.ts`.
2. A global `ValidationPipe` (`whitelist: true`, `transform: true`) validates/coerces the body against the route's DTO, silently dropping any field not declared on the DTO.
3. Route guards run in the order declared: typically `JwtAuthGuard` → `AccountStatusGuard` → `PremiumGuard`.
4. The controller delegates to its module's service, which uses an injected TypeORM `Repository<Entity>` to read/write PostgreSQL.
5. "My profile" resource ids are AES-encrypted/decrypted in transit; admin/members-list routes generally use raw numeric ids.
6. File-upload endpoints save to local disk via Multer and return a public URL built from `appConfig.uploadsPath`.

Full detail: [ARCHITECTURE.md](ARCHITECTURE.md); step-by-step examples: [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md).

## Current state & caveats

- Schema changes are **not** auto-applied (`synchronize: false`) — no migration tooling is wired in yet. See [docs/DATABASE.md](docs/DATABASE.md).
- `src/main.ts` reads `process.env.PORT`, not the documented `APP_PORT`.
- Most `*.spec.ts` files are unfilled NestJS-CLI scaffolds, not real test coverage.
- The registration welcome email references a `FRONTEND_URL` environment variable that is not present in `.env` — see [README.md](README.md).

## Where to look next

| Question | Doc |
|---|---|
| How do I run this locally? | [SETUP.md](SETUP.md) |
| What does the system look like architecturally? | [ARCHITECTURE.md](ARCHITECTURE.md) |
| What API routes exist? | [docs/API.md](docs/API.md) |
| What's the data model? | [docs/DATABASE.md](docs/DATABASE.md) |
| What modules exist and what do they contain? | [docs/MODULES.md](docs/MODULES.md) |
| How do key flows work end-to-end (registration, login, payment, etc.)? | [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md) |
| How do I deploy this? | [DEPLOYMENT.md](DEPLOYMENT.md) |
| How should an AI assistant work in this repo? | [AI_CONTEXT.md](AI_CONTEXT.md), [AI_RULES.md](AI_RULES.md) |
