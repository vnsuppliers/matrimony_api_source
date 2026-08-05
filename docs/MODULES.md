# Modules

Every NestJS module in `src/`, in one file. All ~60 feature modules follow the same shape: `*.module.ts` declares the Nest `@Module` (imports `TypeOrmModule.forFeature([...])` for the entities it needs, registers its controller + service), `*.controller.ts` declares routes, `*.service.ts` holds the logic. **Repository usage is uniform across the entire codebase**: every service injects the stock TypeORM `Repository<Entity>` via `@InjectRepository(Entity)` and queries it directly — no module anywhere defines a custom `Repository` subclass. That fact is not repeated per-module below.

## Identity modules

| Module | Controller | Service | DTOs | Entities | External integration | Notes |
|---|---|---|---|---|---|---|
| `src/auth/` | `AuthController` (`/auth`) | `AuthService` | none (inline-typed login body) | `users` (via `UserService`) | — | Login + refresh-session token signing. Depends on `UserModule` (`UserService.validate_user`, `findMemberByUserId`, `findUserById`) and `JwtModule`. See [docs/API.md](API.md), [ARCHITECTURE.md](../ARCHITECTURE.md) for the full sequence. |
| `src/user/` | none exposed by `UserModule` itself (registration route lives on `UserController`, `/user`) | `UserService` | `RegistrationDto` | `users`, `members`, `present_address` | sends email via `EmailModule` | Registration: creates `User` (bcrypt hook), generates unique `member_id`, creates `MemberEntity` + `present_address`, sends `registration_success` templated email. Also owns `validate_user`, `findUserById`, `findMemberByUserId` — depended on by `AuthModule`, `JwtStrategy`, and account-status/premium logic. |
| `src/auth/guards/`, `src/auth/strategies/`, `src/auth/decorators/` | n/a (no controllers) | `JwtStrategy` (Passport strategy), `JwtAuthGuard`, `AccountStatusGuard`, `PremiumGuard` | n/a | `users` (`AccountStatusGuard` injects `Repository<User>` directly) | — | Cross-cutting auth/authorization primitives consumed by nearly every other module's `@UseGuards(...)`. See [ARCHITECTURE.md](../ARCHITECTURE.md). |

## `src/my_profile/*` — 16 modules (member manages own data)

| Module | Purpose | DTO | Entity | Related API |
|---|---|---|---|---|
| `basic_info` | Core profile fields (name, DOB, gender, religion, etc.) | `BasicInfoDto` (`basic_info.dto.ts`) | `members` | `/basic-info` |
| `religious_info` | Religion/community-specific fields | `ReligiousInfoDto` | `members` | `/religious-info` |
| `education_info` | Education history | `CreateEducationInfoDto` | `education_info` | `/education-info` |
| `profession_info` | Employment/income history | `CreateUpdateProfessionInfoDto` | `profession_info` | `/profession_info` |
| `family_info` | Family background | `FamilyInfoDto` | `family_info` | `/family-info` |
| `siblings_info` | Siblings | `SiblingsInfoDto` | `siblings_info` | `/siblings-info` |
| `lifestyle_info` | Lifestyle preferences | `LifeStyleInfoDto` (`life_syle_info.dto.ts`) | `lifestyle_info` | `/lifestyle-info` |
| `physical_attributes` | Physical description | `CreateUpdatePhysicalAttributesDto` | `physical_attributes` | `/physical-attributes` |
| `hobbies_info` | Hobbies/interests | `CreateUpdateHobbiesInfoDto` | `hobbies_info` | `/hobbies-info` |
| `relatives_info` | Relatives | `CreateUpdateRelativesInfoDto` | `relatives_info` | `/relatives-info` |
| `present_address` | Current address | `PresentAddressDto` | `present_address` | `/present-address` |
| `permanent_address` | Permanent address | `PermanentAddressDto` | `permanent_address` | `/permanent-address` |
| `atronomic_info` | Astrology info | `AstronomicInfoDto` | `astronomic_info` | `/astro-info` |
| `profile_gallery` | Own gallery upload/management (Premium-gated) | `GalleryDto` + `FilesInterceptor` multipart | `gallery` | `/profile-gallery` |
| `profile_settings` | Own account settings | `UpdateProfileDto` | `users`/`members` | `/profile-settings` |
| `success_story` | Submit a success story | `CreateSuccessStoryDto` | `success_stories` | `/success-story` |

All 16 depend on `src/common/utils/encryption.util.ts` for decrypting the `:user_id` path param, and (except `religious_info`/`education_info`/`profession_info`/`siblings_info`/`hobbies_info`/`relatives_info`/`atronomic_info`, which use JWT only) add `AccountStatusGuard`/`PremiumGuard` per the table in [docs/API.md](API.md). Business logic per module is a thin upsert (find-by-`user_id`, create if absent else update) — see [docs/BUSINESS_FLOW.md](BUSINESS_FLOW.md) for the pattern traced through one example.

## `src/members/*` — 12 modules (browsing / interacting with other members)

| Module | Purpose | DTO | Entity | External integration |
|---|---|---|---|---|
| `members_list` | Search/browse other members | `SearchMembersDto` | `members` | — |
| `matched_profiles` | Matching feed for the caller | none | `members` | — |
| `member_gallery` | Read-only view of another member's approved gallery | none | `gallery` | — |
| `interests` | Send/accept/reject interest | `RejectInterestDto` | `interests` | sends email (accept/reject notifications) via `EmailModule` |
| `shortlist` | Shortlist another member | `CreateShortlistDto` | `shortlists` | sends email via `EmailModule` |
| `add_to_whislist` | Wishlist another member | none | `add_to_whilist` | — |
| `add_to_bookmarks` | Bookmark another member | `AddToBookmarkDto` | `add_to_bookmarks` | — |
| `block_profile` | Block another member | `BlockProfileDto` | `block_profiles` | sends email via `EmailModule` (per `FEATURES`-level convention — see `admin/block_management`) |
| `report_profiles` | Report another member | `ReportProfileDto` | `report_profiles` | — |
| `profile_visitors` | Record/list profile visits | `ProfileVisitorsDto` | `profile_visits` | — |
| `send_messages` | Direct messaging | `SendMessageDto` | `chats`, `chat_participants`, `messages` | — |
| `notifications` | In-app notification feed | none | `notifications` | — |

## `src/admin/*` — 27 modules (admin back office)

| Module | Purpose | DTO / body typing | Entity |
|---|---|---|---|
| `analytics` | `GET /analytics/summary` | none | aggregates across multiple entities |
| `approve_success_story` | Moderation queue for success stories | `CreateRatingDto` (ratings sub-flow) | `success_stories`, `ratings` |
| `astro_management` | Admin mirror of `atronomic_info` | inline body | `astronomic_info` |
| `block_management` | Moderation view over `block_profile` | inline body | `block_profiles` |
| `chat_monitor` | Read-only oversight of messaging | none | `chats`, `chat_participants`, `messages` |
| `education_management` | Admin mirror of `education_info` | `CreateEducationInfoDto` (shared) | `education_info` |
| `family_management` | Admin mirror of `family_info` | `FamilyInfoDto` (shared) | `family_info` |
| `gallery_management` | Admin mirror of `profile_gallery` (approve/reject) | `GalleryDto` (shared) | `gallery` |
| `hobbies_management` | Admin mirror of `hobbies_info` | `CreateUpdateHobbiesInfoDto` (shared) | `hobbies_info` |
| `interest_management` | Moderation view over `interests` | inline body | `interests` |
| `lifestyle_management` | Admin mirror of `lifestyle_info` | `LifeStyleInfoDto` (shared) | `lifestyle_info` |
| `master` | Reference-data CRUD — see the dedicated section below | — | — |
| `member_management` | Member lifecycle: action/status/block/unblock/suspend/unsuspend/delete | `MemberManageActionDto` (local `types/member_management.types.ts`, **not** a `class-validator` DTO class) | `users` |
| `my-profile-settings` | The admin's own profile settings | `AdminProfileSettingsDto` | `users` |
| `payments` | Razorpay order create/verify, subscription-expiry cron | `CreateOrderDto`, `VerifyPaymentDto` | `payments`, `user_subscriptions`, `subscription_plans` | Razorpay SDK |
| `permanentaddress_management` | Admin mirror of `permanent_address` | `PermanentAddressDto` (shared) | `permanent_address` |
| `physical` | Admin mirror of `physical_attributes` | `CreateUpdatePhysicalAttributesDto` (shared) | `physical_attributes` |
| `presentaddress_management` | Admin mirror of `present_address` | `PresentAddressDto` (shared) | `present_address` |
| `profession_management` | Admin mirror of `profession_info` | `CreateUpdateProfessionInfoDto` (shared) | `profession_info` |
| `relatives_management` | Admin mirror of `relatives_info` | `CreateUpdateRelativesInfoDto` (shared) | `relatives_info` |
| `report_management` | Moderation view over `report_profiles` | inline body | `report_profiles` |
| `shortlist_management` | Moderation view over `shortlist` | none | `shortlists` |
| `sibling_management` | Admin mirror of `siblings_info` | `SiblingsInfoDto` (shared) | `siblings_info` |
| `terms_conditions` | Legal-document CRUD | `CreateTermsConditionsDto`, `UpdateTermsConditionsDto` | `terms_conditions` |
| `user_basic_info` | Admin write path for `basic_info` | `BasicInfoDto` (shared) | `members` |
| `user_subscriptions` | Subscription history views | none | `user_subscriptions` |
| `users-list` | Admin read view over all users/profiles | none | `users`, `members` |
| `visitor_management` | Moderation view over `profile_visitors` | none | `profile_visits` |

### `src/admin/master/*` — 12 reference-data modules

| Module | DTO / body typing | Entity | Guard |
|---|---|---|---|
| `countries` | inline `{ name, status }` body, no DTO class | `country_master` | none |
| `states` | inline body, no DTO class | `state_master` | none |
| `cities` | inline body, no DTO class | `city_master` | none |
| `gender` | `GenderMasterDto` | `genders` | none |
| `mother_tongue` | `MotherTongueMasterDto` | `mother_tongue_master` | none |
| `religion` | none (read-only) | `religion_master` | none |
| `education` | inline body, no DTO class | `education_master` | JWT |
| `specialisation` | inline body, no DTO class | `specialisation_master` | JWT |
| `profession_master` | inline body, no DTO class | `profession_master` | JWT |
| `designation_master` | none (read-only) | `designation_master` | JWT |
| `subscription_plans` | `CreateUpdateSubscriptionPlanDto` | `subscription_plans` | JWT (one route) |
| `privacy_policy` | `CreatePrivacyPolicyDto` | `privacy_policies` | JWT (method-level) |

**Guard coverage is genuinely inconsistent here** — six of these twelve modules (`countries`, `states`, `cities`, `gender`, `mother_tongue`, `religion`) have no `@UseGuards` anywhere in their controller, verified per-file. See [ARCHITECTURE.md](../ARCHITECTURE.md#known-architectural-gaps) and [docs/API.md](API.md).

## Cross-cutting modules (no feature routes of their own)

| Module | Purpose | Dependencies |
|---|---|---|
| `src/shared/` | Small cross-cutting endpoints (`/shared/*`) | `members`, `ratings` entities |
| `src/config/` | `appConfig` (upload URL builder), `createMulterConfig` factory | none (pure config, no DI providers) |
| `src/common/` | Shared interfaces + `encryption.util.ts` (AES id encrypt/decrypt) | `crypto-js` |
| `src/dto/` | Request DTOs (list above), referenced across all controllers | `class-validator`/`class-transformer` |
| `src/entities/` | All TypeORM entities — see [docs/DATABASE.md](DATABASE.md) | — |
| `src/email/` | `EmailService.send(templateKey, to, data)` — no HTTP routes | `email_templates`, `settings` entities, `nodemailer` |
| `src/helpers/` | `transporter.helper.ts` — builds the nodemailer transport from `SettingsEntity` | `nodemailer` |

## Business-logic depth by module (where it's non-trivial)

Most modules above are a thin CRUD/upsert wrapper around one entity. The modules with actual multi-step business logic worth understanding before modifying:

- **`admin/payments` (`PaymentsService`)** — order creation, HMAC signature verification, transactional subscription activation with renewal-stacking, and the `@Cron` expiry sweep. See [docs/BUSINESS_FLOW.md](BUSINESS_FLOW.md).
- **`user` (`UserService.registration`)** — multi-entity creation (user + member + address) plus a templated welcome email, inside one flow. See [docs/BUSINESS_FLOW.md](BUSINESS_FLOW.md).
- **`auth` (`AuthService`, `JwtStrategy`)** — login, per-request fresh-user re-fetch, refresh-session. See [ARCHITECTURE.md](../ARCHITECTURE.md).
- **`auth/guards/account-status.guard.ts`** — the only guard that queries the database directly (bypassing the DI-injected service layer, straight to `Repository<User>`).
- **`members/interests`** — accept/reject with a required rejection reason and filterable `rejected`/`accepted` list views.
- **`email` (`EmailService`)** — DB-driven template + settings substitution, not a static template file.

See [docs/API.md](API.md) for the routes each module exposes and [docs/DATABASE.md](DATABASE.md) for the entities each module reads/writes.
