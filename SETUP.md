# Setup

Day-to-day local setup. This duplicates and slightly expands the "Getting Started" section of [README.md](README.md) — keep both in sync if either changes.

## Prerequisites

- Node.js (LTS) and `pnpm` (`npm i -g pnpm`)
- A running PostgreSQL instance with the target database already created (this project does **not** auto-create schema — see [docs/DATABASE.md](docs/DATABASE.md))
- A Razorpay account/API keys if you need the payments module to work end-to-end
- A `settings` table row with valid SMTP fields populated if you need transactional email (`src/email/`) to actually send — SMTP is configured in the database, not via `.env` (see [docs/DATABASE.md](docs/DATABASE.md))

## Steps

```bash
pnpm install

# create .env in the project root — see the table below

# ensure your PostgreSQL schema already matches src/entities/*.entity.ts —
# synchronize: false means TypeORM will NOT create/alter tables for you

pnpm run start:dev
```

Default listen port: `3001` (via `process.env.PORT` — see the `PORT`/`APP_PORT` caveat below). Swagger UI: `http://localhost:<port>/api`.

## Environment variables

| Variable | Purpose |
|---|---|
| `APP_URL` | Public base URL used to build absolute URLs for uploaded images (`src/config/app.config.ts`) |
| `APP_PORT` | **Not actually read by `main.ts`** — see caveat below |
| `PORT` | The variable `main.ts` actually reads to pick the listen port (`process.env.PORT ?? 3001`) |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | PostgreSQL connection (`src/app.module.ts` `TypeOrmModule.forRootAsync`) |
| `JWT_SECRET_KEY` / `JWT_EXPIRES_IN` | Access-token signing secret + lifetime |
| `JWT_REFRESH_SECERT_KEY` / `JWT_REFRESH_EXPIRES_IN` | Defined but **unused** — no dedicated refresh-token flow exists; only `POST /auth/refresh-session` re-signing a fresh access token |
| `ID_SECRET_KEY` | AES key for `src/common/utils/encryption.util.ts` (encrypts/decrypts numeric ids exposed to the frontend on `my_profile/*` routes) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials (`admin/payments/`) |
| `FRONTEND_URL` | Read by `UserService.registration()` to build the `login_url` in the welcome email — **not present in the current `.env`**, so this currently resolves to `undefined/login` until added |

**`PORT` vs `APP_PORT` caveat:** [src/main.ts](src/main.ts) reads `process.env.PORT`, not `APP_PORT`. Set `PORT` in your `.env` (in addition to, or instead of, `APP_PORT`) if you need to control the listen port, or patch `main.ts` to read `APP_PORT`.

**SMTP is not an env var.** `src/helpers/transporter.helper.ts` builds the nodemailer transport from a `SettingsEntity` database row (`smtp_host`, `smtp_port`, `smtp_username`, `smtp_password`, `smtp_encryption`, `smtp_from_name`, `smtp_from_email`) — populate/seed that table's single active row for email sending to work locally.

Never commit a populated `.env`. Use your hosting platform's secret manager in production — see [DEPLOYMENT.md](DEPLOYMENT.md).

## Available scripts

```bash
pnpm run start          # start (no watch)
pnpm run start:dev      # start with watch mode
pnpm run start:debug    # start with debugger + watch
pnpm run build          # compile to dist/
pnpm run start:prod     # run compiled build (dist/main.js)

pnpm run lint           # eslint --fix
pnpm run format         # prettier --write

pnpm run test           # unit tests
pnpm run test:watch     # unit tests, watch mode
pnpm run test:cov       # unit tests with coverage
pnpm run test:e2e       # end-to-end tests
```

## Verifying the setup worked

1. `GET http://localhost:<port>/` should return the `AppController` health response.
2. `GET http://localhost:<port>/api` should render Swagger UI.
3. `POST /user/registration` then `POST /auth/login` should round-trip a JWT you can use as a Bearer token on guarded routes (see [docs/BUSINESS_FLOW.md](docs/BUSINESS_FLOW.md) for the exact sequence).

See [ARCHITECTURE.md](ARCHITECTURE.md) for what's actually running under the hood.
