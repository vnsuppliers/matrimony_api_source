# API Documentation

Every HTTP route exposed by this application, grouped by module. Base URL is `APP_URL` (see [SETUP.md](../SETUP.md)); interactive Swagger UI is at `GET /api` (decorator coverage varies by module).

## Conventions that apply across every module below

- **Validation.** A global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true })` is applied to every request (`src/main.ts`). Fields not declared on the route's DTO (`src/dto/`) are silently dropped, not rejected. DTOs use `class-validator` decorators; numeric fields arriving as strings (query params, multipart/form-data) use `@Type(() => Number)` or a `@Transform` to coerce them.
- **Authentication/Authorization legend:** `JWT` = `JwtAuthGuard` (valid Bearer token required — triggers `JwtStrategy`, which re-fetches the user from the database on every request) · `Status` = `AccountStatusGuard` (blocks Blocked/Under-review/Suspended/Deactivated accounts with a 403 + `errorCode`, unless the route is annotated `@BypassStatusCheck()`) · `Premium` = `PremiumGuard` (blocks unless `req.user.is_premium === 1`, throwing a 402 `PremiumRestrictionException`). Guards are listed as applied at the **controller** level unless noted "method-level". Full semantics: [ARCHITECTURE.md](../ARCHITECTURE.md).
- **ID convention.** Routes under `my_profile/*` that take a `:user_id`/resource id in a **GET URL** generally expect the value **AES-encrypted** (`src/common/utils/encryption.util.ts`, keyed by `ID_SECRET_KEY`); `admin/*` and `members/*` routes generally use raw numeric ids. This is a per-route convention, not universal — check the sibling routes in the module being read/edited.
- **Error responses.** No custom global exception filter exists — errors are Nest's default `HttpException` JSON body (`{statusCode, message, error}`), except `AccountStatusGuard` (adds `errorCode`) and `PremiumGuard`'s `PremiumRestrictionException` (adds `requires_premium: true`). Individual services throw `BadRequestException` / `NotFoundException` / `UnauthorizedException` / `ForbiddenException` directly — there is no centralized error-code catalogue beyond what's noted per-module below.
- **Upsert pattern.** Most one-record-per-user `my_profile/*` sections expose a single `POST /update-create/:user_id` (or `/update-create/:id`) handling both first-time creation and subsequent edits, rather than separate POST/PUT routes.

---

## Auth — `/auth` (no controller-level guard)

| Method | Path | Request | Response | Notes |
|---|---|---|---|---|
| POST | `/auth/login` | `{ email: string, password: string }` (no DTO class — inline typed body) | `{ message, access_token, user: { id (AES-encrypted), role_id, is_verified } }` | `AuthService.login` calls `UserService.validate_user` (bcrypt compare against `withDeleted: true` lookup, so a soft-deleted account can still authenticate at this stage), rejects with `401` if `is_verified === 4`, then signs a JWT payload `{ sub, email, gender_id, role_id, is_verified }`. |
| POST | `/auth/refresh-session` | none (reads `req.user.id`) | same shape as login | **Has no `@UseGuards` on the route itself** — relies on the caller already holding a valid token from a prior login (Nest still populates `req.user` if a valid Bearer token is present from a previous guard elsewhere in the chain, but nothing on this route enforces that). Re-signs a token with the user's current DB `is_verified`/role — call this after any account-status change so the client's cached token stays accurate. |

Related module: `src/user/` (`UserService.validate_user`, `findUserById`). Related entity: `users`.

## User — `/user` (no controller-level guard, by design: registration is pre-auth)

| Method | Path | Request DTO | Business rules |
|---|---|---|---|
| POST | `/user/registration` | `RegistrationDto` (`first_name`, `last_name`, `email`, `phone`, `password` required; `address_line1/2`, `country_id`, `state_id`, `city_id`, `about`, `gender_id`, `religion_id`, `mother_tongue_id`, `date_of_birth` optional) | Rejects (`400`) if `email` already exists. On success: creates a `User` row (password bcrypt-hashed via an entity `@BeforeInsert` hook), generates a unique `member_id` (`<year><4-random-digits>`, retried until unique), creates the matching `MemberEntity` and a `present_address` row, then sends a `registration_success` templated welcome email (fire-and-forget is not used — it's awaited) containing a `login_url` built from `FRONTEND_URL` (not currently set in `.env` — see [SETUP.md](../SETUP.md)). |

Related modules: `src/user/`, `src/email/`. Related entities: `users`, `members`, `present_address`, `email_templates`, `settings`.

## Shared — `/shared` (JWT)

| Method | Path |
|---|---|
| GET | `/shared/me/get-profile-image` |
| GET | `/shared/get-success-story-ratings` |

## Email — `/email`

`EmailController` declares **no routes** — `src/email/` (`EmailService.send(templateKey, to, data)`) is consumed internally by other services (registration, interests, shortlist, block_management), not exposed over HTTP. See [docs/BUSINESS_FLOW.md](BUSINESS_FLOW.md) and [docs/DATABASE.md](DATABASE.md) (`email_templates`, `settings`).

## App — `/`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Health/root check (`AppController`). |

---

## My Profile — `src/my_profile/*` (member manages their own data)

All modules below are JWT-guarded at minimum; several add `Status`/`Premium`. Nearly all one-record-per-user sections follow the upsert pattern described above. GET URLs generally expect an AES-encrypted user id.

| Module | Base path | Guards | Routes | Entity |
|---|---|---|---|---|
| basic_info | `/basic-info` | JWT, Status | GET `:user_id` · POST `/update-create/:user_id` | `members` (core fields) |
| religious_info | `/religious-info` | JWT | GET `:user_id` · POST `/update-create/:user_id` | `members` (religion fields) |
| education_info | `/education-info` | JWT | GET `:user_id` · POST `:user_id` · PUT `:education_id` · DELETE `:education_id` | `education_info` (1:N) |
| profession_info | `/profession_info` | JWT | GET `/get/:user_id` · POST `/create/:user_id` · PUT `/update/:profession_info_id` · DELETE `/delete/:profession_info_id` | `profession_info` (1:N) |
| family_info | `/family-info` | JWT | GET `/:user_id` · POST `/update-create/:user_id` | `family_info` (1:1) |
| siblings_info | `/siblings-info` | JWT | GET `/:user_id` · POST `/create/:user_id` · PUT `/update/:sibling_info_id` · DELETE `/delete/:sibling_info_id` | `siblings_info` (1:N) |
| lifestyle_info | `/lifestyle-info` | JWT | GET `:user_id` · POST `/update-create/:user_id` | `lifestyle_info` (1:1) |
| physical_attributes | `/physical-attributes` | JWT | GET `:user_id` · POST `/update-create/:user_id` | `physical_attributes` (1:1, UUID pk) |
| hobbies_info | `/hobbies-info` | JWT | GET `/get/:user_id` · POST `/create/:user_id` · PUT `/update/:hobbies_info_id` · DELETE `/delete/:hobbies_info_id` | `hobbies_info` (1:N) |
| relatives_info | `/relatives-info` | JWT | GET `/get/:user_id` · POST `/create/:user_id` · PUT `/update/:relatives_info_id` · DELETE `/delete/:relatives_info_id` | `relatives_info` (1:N) |
| present_address | `/present-address` | JWT | GET `/:user_id` · POST `/update-create/:user_id` | `present_address` (1:1) |
| permanent_address | `/permanent-address` | JWT | GET `/:user_id` · POST `/update-create/:user_id` | `permanent_address` (1:1) |
| atronomic_info | `/astro-info` | JWT | GET `/:user_id` · POST `/update-create/:user_id` | `astronomic_info` (1:1) |
| profile_gallery | `/profile-gallery` | JWT, Premium, Status | GET `:user_id` · POST `/update-create/:user_id` (multipart, `FilesInterceptor('gallery_images', 10, ...)`) · DELETE `/:user_id/:id` · PATCH `/status/:user_id/:id` | `gallery` (1:N) |
| profile_settings | `/profile-settings` | JWT, Status (method-level JWT on sub-routes) | GET `/me` · GET `/debug-uploads` · PUT `/update` | `users`/`members` |
| success_story | `/success-story` | JWT | GET `:user_id` · POST `/update-create/:user_id` | `success_stories` (1:N, admin-moderated) |

**`profile_gallery` request detail:** `GalleryDto` (`id?`, `user_id?`, `status?` as coerced ints; `image_url?`; `gallery_images?: string | string[]`) plus multipart files under field name `gallery_images` (max 10 files, `createMulterConfig('gallery')`). The controller additionally enforces a 5 MB per-file size cap in application code (not in the Multer config itself) before delegating to the service.

**Note:** `success_story` shares its `/success-story` route prefix with `admin/approve_success_story` (see below) — Nest merges both controllers' routes under the same prefix; distinguish by sub-path.

## Members — `src/members/*` (browsing / interacting with other members)

Generally use raw numeric ids (not AES-encrypted).

| Module | Base path | Guards | Routes | Entity |
|---|---|---|---|---|
| members_list | `/members-list` | JWT, Premium, Status | GET `/profiles` · GET `:id` | `members` |
| matched_profiles | `/matched-profiles` | JWT, Premium, Status | GET `/` (matches for the caller, no param) | `members` |
| member_gallery | `/member-gallery` | JWT, Status, Premium | GET `/get-member-gallery-images/:userId` | `gallery` (read-only) |
| interests | `/interests` | JWT, Premium, Status | POST `/add/:interested_to` · DELETE `/remove/:interested_to` · GET `/` · GET `/received` · POST `/accept/:interestId` · POST `/reject/:interestId` (body: `RejectInterestDto { reason }`) · GET `/rejected?type=me\|other\|all` · GET `/accepted?type=me\|other\|all` | `interests` |
| shortlist | `/shortlist` | JWT, Premium, Status | POST `:id` · DELETE `:id` · GET `/` · GET `/check/:id` | `shortlists` |
| add_to_whislist | `/add-to-whislist` | JWT | POST `/add/:whilisted_to` · DELETE `/remove/:whilisted_to` · GET `/` | `add_to_whilist` |
| add_to_bookmarks | `/add-to-bookmarks` | JWT | POST `:receiver_id` · DELETE `:receiver_id` · GET `/` | `add_to_bookmarks` |
| block_profile | `/block-profile` | JWT, Status | POST `/add/:blocked_user_id` · DELETE `/remove/:blocked_user_id` · GET `/` | `block_profiles` |
| report_profiles | `/report-profiles` | JWT, Status | POST `/` · GET `/` · GET `/status/:reportedUserId` · GET `/my-reports` · GET `/received-reports` | `report_profiles` |
| profile_visitors | `/profile-visitors` | JWT, Premium, Status | POST `/visit/:id` · GET `/visitors` · GET `/count` | `profile_visits` |
| send_messages | `/send-messages` | JWT, Premium, Status | GET `/` · GET `/chat/:userId` · GET `/messages/:chatId` · POST `/messages` | `chats`, `chat_participants`, `messages` |
| notifications | `/notifications` | JWT, Status | GET `/` · POST `/read-all` | `notifications` |

**Business rules worth noting:**
- `interests`, `shortlist`, `add_to_whislist`, `add_to_bookmarks` are four parallel, independently-tracked "express interest in a profile" mechanisms — each its own table with sent/received directionality, not variants of a shared entity.
- `interests` supports accept/reject with a required `reason` on reject (`RejectInterestDto`), and separate `rejected`/`accepted` list endpoints filterable by `type=me|other|all` (whether the caller sent or received the interest).
- `report_profiles`, `block_profile` feed the corresponding `admin/report_management` / `admin/block_management` moderation views (see below).

## Admin — `src/admin/*` (moderation & per-section management mirrors)

Admin equivalents of member sections accept an explicit user/record id (not AES-encrypted) since the admin acts on someone else's data. All JWT-guarded.

| Module | Base path | Routes |
|---|---|---|
| user_basic_info | `/user-basic-info` | PUT `/update-create/:userId` |
| education_management | `/education-management` | POST `/update-create` · DELETE `/:id` |
| profession_management | `/profession-management` | POST `/update-create` · DELETE `/:id` |
| family_management | `/family-management` | POST `/update-create` · DELETE `/user/:userId` |
| sibling_management | `/sibling-management` | POST `/update-create` · DELETE `/:id` |
| relatives_management | `/relatives-management` | POST `update-create` · DELETE `/:id` |
| presentaddress_management | `/presentaddress-management` | POST `/update-create` · DELETE `/delete/:id` |
| permanentaddress_management | `/permanentaddress-management` | POST `/update-create` · DELETE `/delete/:id` |
| lifestyle_management | `/lifestyle-management` | POST `/update-create` · DELETE `/delete/:id` |
| hobbies_management | `/hobbies-management` | POST `/update-create` · DELETE `/delete/:id` |
| astro_management | `/astro-management` | POST `/update-create` · DELETE `/delete/:id` |
| physical | `/physical` | POST `update-create` · DELETE `user/:userId` |
| gallery_management | `/gallery-management` | GET `/:user_id` · POST `/update-create` · PATCH `/status/:user_id/:id` · DELETE `/delete/:id` |
| shortlist_management | `/shortlist-management` | GET `/get-shortlist-list` · GET `/sender/:id/targets` · DELETE `/:id/remove` |
| block_management | `/block-management` | GET `/get-block-list` · GET `/blocker/:id/targets` · PATCH `/:id/unblock` · DELETE `/:id/remove` |
| interest_management | `/interest-management` | GET `/get-interest-list` · GET `/sender/:id/interactions` · PATCH `/:id/reject` · DELETE `/:id/remove` |
| report_management | `/report-management` | GET `/get-reported-profiles` · PATCH `/:id/resolve` · PATCH `/:id/dismiss` |
| visitor_management | `/visitor-management` | GET `/get-visited-list` · GET `/profile/:id/visitors` |
| member_management | `/member-management` | PATCH `/action/:id` · PATCH `/update-status/:id` · PATCH `/block/:id` · PATCH `/unblock/:id` · PATCH `/suspend/:id` · PATCH `/unsuspend/:id` · DELETE `/delete/:id` |
| users-list | `/users-list` | GET `/get-list` · GET `/get-profile/:id` |
| chat_monitor | `/chat-monitor` | GET `/senders` · GET `/recipients/:userId` · GET `/history/:chatId` |
| analytics | `/analytics` | GET `/summary` |
| terms_conditions | `/terms-conditions` (JWT method-level) | POST `/create-update` · GET `/get-terms-conditions` · DELETE `:id` · GET `/get-active-terms-conditions` |
| approve_success_story | `/success-story` | GET `approve-success-story/list` · POST `approve-success-story/:userId` · POST `/delete-success-story-ratings/:memberId` |
| my-profile-settings | `/my-profile-settings` | GET `/get-my-profile/:userId` · PUT `/update` |
| payments | `/payments` | POST `create-order` (`CreateOrderDto { plan_id: int }`) · POST `verify-payment` (`VerifyPaymentDto { order_id, payment_id, signature }`) · GET `my-subscription` |
| user_subscriptions | `/user-subscriptions` | GET `/get-user-subscriptions` · GET `/history/:userId` |

**`payments` business rules & error responses:**
- `POST /payments/create-order`: `404` if `plan_id` doesn't exist, `400` if the plan's `status !== 1`. On success, creates a Razorpay order (amount in paise) and a local `payments` row (`status: 'pending'`).
- `POST /payments/verify-payment`: `404` if no matching pending payment row for `(order_id, userId)`; `400` if the HMAC-SHA256 signature (computed server-side from `order_id|payment_id` using `RAZORPAY_KEY_SECRET`) doesn't match the client-supplied signature. On success, marks the payment `'success'`, and inside a DB transaction either extends the user's still-active subscription (new period starts at the old `end_date` — "stacking") or starts a fresh one from now, sets the old row to `'expired'` if applicable, creates the new `user_subscriptions` row as `'active'`, and sets `User.is_premium = 1`. See [docs/BUSINESS_FLOW.md](BUSINESS_FLOW.md) for the full sequence.
- **Note:** `approve_success_story` and `my_profile/success_story` both declare `@Controller('success-story')` — Nest merges their routes under one prefix; distinguish by sub-path (`approve-success-story/...` vs plain `:user_id`).

## Admin → Master data — `/master/*`

Standard reference-data CRUD; each typically exposes a public read (`get_master_data` or a domain-named getter) plus admin `update-create`/`delete-*`. **Guard coverage is inconsistent across this group — verified per-controller, not assumed:**

| Module | Base path | Guards | Routes |
|---|---|---|---|
| countries | `/master/countries` | **none** | GET `/all` · GET `/get_master_data` · POST `/update-create` · POST `/delete-country` |
| states | `/master/states` | **none** | GET `/by-country/:countryId` · GET `/get_master_data` · POST `/update-create` · POST `/delete-state` |
| cities | `/master/cities` | **none** | GET `/by-state/:stateId` · GET `/get_master_data` · POST `/update-create` · POST `/delete-city` |
| gender | `/master/gender` | **none** | GET `/get_genders` · GET `/get_master_data` · POST `/update-create` · POST `/delete-gender` |
| religion | `/master/religion` | **none** | GET `/get_religions` (read-only module — no admin write routes defined) |
| mother_tongue | `/master/mother-tongue` | **none** | GET `/get_all_mother_tongues` · GET `/get_master_data` · POST `/update-create` · POST `/delete-mother-tongue` |
| education | `/master/education` | JWT | GET `/get_education` · GET `/get_master_data` · POST `/update-create` · POST `/delete-education` |
| specialisation | `/master/specialisation` | JWT | GET `/get_specialisations/:educationId` · GET `/get_master_data` · POST `/update-create` · POST `/delete-specialisation` |
| profession_master | `/master/profession_master` | JWT | GET `/get_profession_master` · GET `/get_master_data` · POST `/update-create` · POST `/delete-profession` |
| designation_master | `/master/designation_master` | JWT | GET `/by-profession/:profession_id` (read-only — no write routes) |
| subscription_plans | `/master/subscription-plans` | JWT (method-level, one route only) | GET `/get_master_data` · POST `/update-create` · POST `/delete-plan` · GET `/get_plains_list` · GET `/get_user_active_plan` |
| privacy_policy | `/privacy-policy` | JWT (method-level) | POST `/create-update` · GET `/update-create-privacy-policy` · DELETE `:id` · GET `/get-active-privacy-policy` |

**`countries`, `states`, `cities`, `gender`, `mother_tongue`, `religion` have no `@UseGuards` anywhere in their controllers** — their write endpoints (`update-create`, `delete-*`) are reachable with no authentication. This is a real gap, not a documentation error — see [ARCHITECTURE.md](../ARCHITECTURE.md#known-architectural-gaps).

Hierarchy: `countries` → `states` → `cities`, `education_master` → `specialisation_master`, `profession_master` → `designation_master` (see [docs/DATABASE.md](DATABASE.md)).

---

See [docs/MODULES.md](MODULES.md) for the module/service/controller inventory behind these routes, [docs/DATABASE.md](DATABASE.md) for the entities each route reads/writes, and [docs/BUSINESS_FLOW.md](BUSINESS_FLOW.md) for the multi-step flows (registration, login, payment) traced end-to-end.
