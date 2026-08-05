# Business Flows

Multi-step flows traced end-to-end through the actual source, not just single endpoints. Only flows that actually exist in the codebase are documented — see "Not applicable" at the bottom for flows that were checked for and are absent.

## User Registration

```mermaid
sequenceDiagram
    participant C as Client
    participant UC as UserController
    participant US as UserService
    participant DB as PostgreSQL
    participant ES as EmailService

    C->>UC: POST /user/registration (RegistrationDto)
    UC->>US: registration(dto)
    US->>DB: findOne(User, {email})
    alt email already exists
        US-->>UC: 400 BadRequestException("User already exists")
    else new email
        US->>DB: save(User) — password bcrypt-hashed via @BeforeInsert
        US->>US: generateUniqueMemberId() — "<year><4 random digits>", retried until unique
        US->>DB: save(MemberEntity) {user, member_id, gender_id, religion_id, mother_tongue_id, about, date_of_birth}
        US->>DB: save(PresentAddressEntity) {user_id, address_line1/2, country/state/city_id}
        US->>ES: send('registration_success', email, {first_name, last_name, email, member_id, created_at, login_url: FRONTEND_URL + '/login'})
        ES->>DB: findOne(EmailTemplateEntity, {template_key:'registration_success', status:true})
        ES->>DB: findOne(SettingsEntity, {status:true})
        ES->>ES: substitute {{variables}} in subject/html
        ES->>ES: nodemailer.sendMail via transport built from settings.smtp_*
        US-->>UC: newUser
        UC-->>C: 201/200 newUser
    end
```

Note: `FRONTEND_URL` is not currently set in `.env` (see [SETUP.md](../SETUP.md)), so `login_url` resolves with `undefined` today. If the `registration_success` template row doesn't exist or is disabled, `EmailService.send` throws a plain `Error` (not an `HttpException`), which — since registration `await`s the email send — would currently surface as an unhandled 500 and roll back nothing already committed (the user/member/address rows are saved before the email step).

## Login (JWT issuance)

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant AS as AuthService
    participant US as UserService
    participant DB as PostgreSQL
    participant JWT as JwtService

    C->>AC: POST /auth/login {email, password}
    AC->>AS: login(email, password)
    AS->>US: validate_user(email, password)
    US->>DB: findOne(User, {email}, withDeleted:true)
    alt no user or bcrypt.compare fails
        US-->>AS: 401 UnauthorizedException("Invalid email or password")
    else valid credentials
        US-->>AS: user
        AS->>AS: reject 401 if user.is_verified === 4 (deleted)
        AS->>US: findMemberByUserId(user.id)
        US-->>AS: member (for gender_id)
        AS->>JWT: signAsync({sub, email, gender_id, role_id, is_verified})
        JWT-->>AS: access_token
        AS-->>AC: {message, access_token, user:{id: encryptId(id), role_id, is_verified}}
        AC-->>C: 200
    end
```

## JWT Authentication (per-request, every guarded route)

```mermaid
sequenceDiagram
    participant C as Client
    participant Guard as JwtAuthGuard
    participant Strat as JwtStrategy
    participant US as UserService
    participant DB as PostgreSQL

    C->>Guard: any guarded request, Authorization: Bearer <token>
    Guard->>Strat: validate(req, payload) — Passport calls this on every request, not just login
    Strat->>US: findUserById(payload.sub, {withDeleted:true})
    US->>DB: SELECT * FROM users WHERE id = ?
    DB-->>US: fresh row
    US-->>Strat: user
    alt !user
        Strat-->>Guard: 401 "User account no longer exists."
    else user.is_verified===4 or deleted_at!==null
        Strat-->>Guard: 401 "Your account has been deleted and cannot be accessed."
    else ok
        Strat-->>Guard: req.user = {id, email, role_id, is_verified, is_premium}
        Guard-->>C: proceeds to AccountStatusGuard/PremiumGuard/handler
    end
```

`req.user.is_premium`/`is_verified` are therefore fresh **as of the start of this request** — re-fetched by `JwtStrategy` on every call, not cached from token-issue time.

## Refresh Session

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant AS as AuthService
    participant US as UserService
    participant JWT as JwtService

    C->>AC: POST /auth/refresh-session (no route-level guard)
    AC->>AS: refreshTokenByUserId(req.user.id)
    AS->>US: findUserById(userId, {withDeleted:true})
    alt !user or is_verified===4
        AS-->>AC: 401 "Account is inactive or has been deleted."
    else ok
        AS->>US: findMemberByUserId(user.id)
        AS->>JWT: signAsync({sub, email, gender_id, role_id, is_verified}) — fresh live values
        AS-->>AC: {message, access_token, user}
    end
```

`AuthController.refreshSessio` has no `@UseGuards` of its own — it reads `req.user.id` assuming a prior guard elsewhere already populated it. There is no separate refresh-token (as distinct from access-token) issuance/rotation anywhere in the codebase — `JWT_REFRESH_SECERT_KEY`/`JWT_REFRESH_EXPIRES_IN` are defined in `.env` but unused.

## Upsert CRUD pattern (representative of all `my_profile/*` one-record-per-user sections)

```mermaid
sequenceDiagram
    participant C as Client
    participant Ctrl as e.g. FamilyInfoController
    participant Svc as e.g. FamilyInfoService
    participant DB as PostgreSQL

    C->>Ctrl: POST /family-info/update-create/:user_id (encrypted or raw id per module)
    Ctrl->>Ctrl: decryptId(:user_id) if my_profile convention applies
    Ctrl->>Svc: updateCreate(user_id, dto)
    Svc->>DB: findOne(Entity, {user_id})
    alt row exists
        Svc->>DB: update(existing row with dto fields)
    else no row
        Svc->>DB: create + save(new row {user_id, ...dto})
    end
    Svc-->>Ctrl: saved entity
    Ctrl-->>C: 200/201
```

Every `admin/*_management` mirror module repeats the same shape against the same entity, keyed by an explicit `:id`/`user_id` from the request rather than `req.user.id`.

## Interest / Notification / Email flow (send interest)

```mermaid
sequenceDiagram
    participant C as Client
    participant IC as InterestsController
    participant IS as InterestsService
    participant DB as PostgreSQL
    participant ES as EmailService

    C->>IC: POST /interests/add/:interested_to
    IC->>IS: addInterest(userId, interested_to)
    IS->>IS: reject 400 if userId === interested_to
    IS->>DB: findOne(Interests, {interested_by:userId, interested_to})
    alt already exists
        IS-->>IC: 409 ConflictException("Interest already sent")
    else new
        IS->>DB: save(Interests {interested_by, interested_to, status:0})
        IS->>DB: save(Notification {user:interested_to, sender:userId, title:"New Interest Received", type:'interest', is_read:false})
        IS->>DB: query interest+sender+receiver for email data
        alt receiver has an email
            IS->>ES: send('interest_notification', receiver.email, {receiver_name, sender_name, sender_id})
        end
        IS-->>IC: {success, message}
    end
```

The same email-service-name has effectively two responsibilities: `EmailService.send` propagates any missing-template error as a plain JS `Error` (not an HTTP exception) — this happens *after* the interest and notification rows are already committed, so a missing/disabled `interest_notification` template row would surface as a 500 on an otherwise-successful interest send. The same pattern (create row → create notification → best-effort email) is used by `members/shortlist` and `admin/block_management`.

## Gallery File Upload

```mermaid
sequenceDiagram
    participant C as Client
    participant PGC as ProfileGalleryController
    participant Multer as FilesInterceptor + createMulterConfig('gallery')
    participant PGS as ProfileGalleryService
    participant DB as PostgreSQL
    participant FS as ./uploads/gallery/

    C->>PGC: POST /profile-gallery/update-create/:user_id (multipart, field "gallery_images", up to 10 files)
    PGC->>Multer: intercept upload
    Multer->>FS: save each file as "<uuid>-<uuid>.<ext>"
    Multer-->>PGC: files[] (with .filename)
    PGC->>PGC: reject any file > 5MB (app-level check, not enforced by Multer config itself)
    PGC->>PGS: update_create(user_id, dto, files)
    PGS->>DB: findOne(User, {id:user_id}) — 404 if missing
    opt dto.image_url provided
        PGS->>DB: save(Gallery {user_id, image_url, gallery_images:'', status})
    end
    loop each uploaded file
        PGS->>DB: save(Gallery {user_id, image_url:null, gallery_images: JSON.stringify([file.filename]), status})
    end
    alt nothing was saved
        PGS-->>PGC: 400 "A valid image URL or file upload is required."
    else
        PGS-->>PGC: {message, status:true}
    end
```

Public URLs for saved files are built on read via `appConfig.uploadsPath('gallery', filename)`, not stored pre-built in the database. Gallery rows start at whatever `status` the caller passed (or `0`); the admin `gallery_management` module's `PATCH /status/:user_id/:id` is the approval step that flips this.

## Payment / Subscription Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant PC as PaymentsController
    participant PS as PaymentsService
    participant RP as Razorpay API
    participant DB as PostgreSQL

    C->>PC: POST /payments/create-order {plan_id}
    PC->>PS: createOrder(userId, dto)
    PS->>DB: findOne(SubscriptionPlan, {id:plan_id})
    alt not found or status !== 1
        PS-->>PC: 404/400
    else valid plan
        PS->>RP: orders.create({amount: price*100, currency:'INR', receipt})
        RP-->>PS: order
        PS->>DB: save(Payments {user_id, plan_id, amount, gateway_order_id:order.id, status:'pending'})
        PS-->>PC: {payment_id, order_id, amount, currency, key, plan}
    end

    Note over C,RP: client completes checkout via Razorpay's own UI, gets payment_id + signature back

    C->>PC: POST /payments/verify-payment {order_id, payment_id, signature}
    PC->>PS: verifyPayment(userId, dto)
    PS->>DB: findOne(Payments, {gateway_order_id:order_id, user_id:userId})
    alt not found
        PS-->>PC: 404
    else found
        PS->>PS: HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
        alt signature mismatch
            PS-->>PC: 400 "Invalid payment signature verification failed."
        else signature matches
            PS->>DB: update Payments {status:'success', gateway_payment_id, gateway_signature}
            PS->>DB: findOne(SubscriptionPlan, {id: payment.plan_id})
            PS->>DB: BEGIN TRANSACTION
            PS->>DB: findOne(UserSubscriptions, {user_id, status:'active'})
            alt an active subscription already exists and hasn't expired
                Note over PS: "stacking": new period starts at old end_date
                PS->>DB: mark old subscription 'expired'
            else no active subscription (or already expired)
                Note over PS: fresh period starts now
            end
            PS->>DB: save(new UserSubscriptions {status:'active', start_date, end_date})
            PS->>DB: update(User, {id:userId}, {is_premium:1})
            PS->>DB: COMMIT
            PS-->>PC: {success, message, data: subscription}
        end
    end
```

### Subscription expiry (scheduled)

```mermaid
sequenceDiagram
    participant Cron as "@Cron('0 * * * * *') — every minute"
    participant PS as PaymentsService.autoExpireSubscriptions
    participant DB as PostgreSQL

    Cron->>PS: fire
    PS->>DB: find(UserSubscriptions, {status:'active', end_date <= now})
    alt none found
        PS-->>Cron: return, no-op
    else expired rows found
        PS->>DB: BEGIN TRANSACTION
        PS->>DB: update all matching UserSubscriptions → status:'expired'
        PS->>DB: update User (ids from expired rows) → is_premium:0
        PS->>DB: COMMIT
    end
```

The cron's own docstring says "at midnight" but the actual cron expression (`0 * * * * *`) fires every minute — confirm which cadence is intended before changing either. This job has no leader-election/locking, so running more than one app instance would let each instance independently (and redundantly, though not incorrectly — the `WHERE` clause is idempotent) run the same sweep.

## Not applicable / not found in this codebase

- **Password Reset** — Not Found. No forgot-password/reset-password controller, service method, route, or email template reference exists anywhere in `src/` (verified by search). Only `POST /auth/login` and `POST /auth/refresh-session` exist for credential-adjacent flows.
- **Refresh Token (as a distinct token type)** — Not Found as a real rotation flow. `JWT_REFRESH_SECERT_KEY`/`JWT_REFRESH_EXPIRES_IN` exist as env vars but are never read anywhere in `src/`; "refresh" in this codebase means re-signing a normal access token from live DB state (see "Refresh Session" above), not a separate refresh-token grant.
- **Queues/background workers** — Not Found. The only scheduled/background execution is the in-process `@Cron` subscription-expiry sweep above.
