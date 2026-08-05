# Deployment

There is no CI/CD pipeline or IaC in this repository — this document describes what a deploy needs to account for given the current code, not an existing automated process.

## Build & run

```bash
pnpm install --frozen-lockfile
pnpm run build        # compiles src/ → dist/
pnpm run start:prod   # node dist/main.js
```

## Pre-deploy checklist

- [ ] **Provision/migrate the target database schema before first boot.** `synchronize: false` (`src/app.module.ts`) means TypeORM will not create or alter tables — the schema must already match every entity in `src/entities/`. See [docs/DATABASE.md](docs/DATABASE.md).
- [ ] **Set `PORT`** (not just `APP_PORT`) — `src/main.ts` reads `process.env.PORT`. See [SETUP.md](SETUP.md).
- [ ] **Update the CORS origin allow-list** in `src/main.ts` (`app.enableCors({ origin: [...] })`) for your deployed frontend URL(s) — it's a hard-coded array, not environment-driven. Confirm which entries are actually meant to be live before deploying (some are commented out in the source).
- [ ] **Move `uploads/` to shared/object storage** if running more than one instance. Local disk storage (`./uploads/<folder>/`) won't survive redeploys or scale across instances — see [ARCHITECTURE.md](ARCHITECTURE.md).
- [ ] **Inject secrets via your platform's secret manager**, not a committed `.env` — see the variable table in [SETUP.md](SETUP.md).
- [ ] **Populate the `settings` database table** with valid SMTP credentials before relying on transactional email — SMTP config is DB-driven, not env-driven (see [docs/DATABASE.md](docs/DATABASE.md)).
- [ ] **Set `FRONTEND_URL`** if you want the registration welcome email's login link to resolve correctly — it is currently absent from `.env`.
- [ ] **Guard the subscription-expiry cron** (`PaymentsService.autoExpireSubscriptions`, `@Cron('0 * * * * *')` in `src/admin/payments/payments.service.ts`) against duplicate concurrent runs before scaling to multiple instances — it has no leader-election/locking today.
- [ ] Set `NODE_ENV=production` if you want TypeORM's `ssl: { rejectUnauthorized: false }` branch (`src/app.module.ts`) to take effect for the Postgres connection.
- [ ] Confirm Razorpay is in **live** mode (not test keys) if this is a production deploy handling real payments.

## Rollback

No migration tooling means schema rollbacks are also manual — keep a record of any manual DDL applied alongside each deploy so it can be reverse-applied if you roll back the application code.

## Scaling notes

Single Express process, single Postgres connection pool, in-process cron, local disk uploads — see [ARCHITECTURE.md](ARCHITECTURE.md) for the full reasoning. Horizontal scaling beyond one instance requires resolving the uploads-storage and cron-duplication points above first.

See [AI_RULES.md](AI_RULES.md) for what an AI assistant should and shouldn't touch unilaterally in this area (CORS, guard composition).
