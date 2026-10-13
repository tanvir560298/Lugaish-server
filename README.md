# Lugaish API

Express/Mongoose API for the existing Lugaish React/Vite learning campus. This is the separate `Lugaish-server` Git repository; the paired client checkout tracks it at `server/` through a Git submodule/gitlink. Release matching frontend/backend commits together.

This README documents preparation, not approval to push or deploy. Hosted Google login, protected media, target database/indexes, monitoring and rollback still need verification. The release remains NO-GO until those checks and owner approval are complete.

## Runtime and layout

- `package.json` requires Node.js **20.19.0 or newer**. Current local verification uses **24.16.0**; the paired deployment Dockerfile uses Node 24. Pin the approved tested version on the host instead of relying on the unbounded engine range or a provider default.
- Install the committed lockfile with `npm ci`; use `npm ci --omit=dev` for a production runtime.
- MongoDB needs a named database, restricted credentials and required model indexes. Replica-set interruption/transaction verification remains outstanding; Quiz/User/Progress are not currently one transaction.
- `src/index.js` mounts API/health routes; `src/config.js` reads environment variables.
- `src/routes/`, `src/middleware/`, `src/models/`, `src/services/` implement authentication, access, verified learning, analytics and administration.
- `study/` implements shared/private Study Library rooms, seating and SSE.
- `scripts/prepare-indexes.mjs` prepares declared indexes; `scripts/course-reset.mjs` provides guarded inventory, backup, archive, restore and publication-index migration.
- `seed.js` is a retired destructive sample-curriculum utility. **Do not run `npm run seed` or `node seed.js` on a retained development, staging or production database.** It deletes lessons and reintroduces old sample content. Installation/startup/builds do not seed or reset the catalog.

## Local setup

From the API repository root, or `server/` in the paired client checkout:

```bash
npm ci
cp .env.example .env
```

Edit the ignored `.env` privately. A local-only starting configuration is:

```dotenv
NODE_ENV=development
APP_ENV=development
PORT=5001
API_BIND_HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/lugaish
FRONTEND_URL=http://127.0.0.1:4174
CORS_ORIGIN=http://127.0.0.1:4174
```

Also supply a private `JWT_SECRET`, the actual matching `FIREBASE_PROJECT_ID` and Firebase Admin credentials before real login testing. `.env.example` contains placeholders and mixes local settings with a production CORS entry; do not upload it unchanged. With local MongoDB running:

```bash
npm run dev
```

`npm start` runs `node src/index.js` without the development watcher. The fallback API port is 5000; the explicit example uses 5001. Match frontend `VITE_API_URL` to the actual API URL, including `/api`.

In the paired client checkout, `npm run dev:api` is an alternative launcher. It loads the client/server local environment files and uses the configured local API/Firebase project. An existing `PORT` takes precedence, so confirm it matches `VITE_API_URL`. Vite alone does not start this API or complete server-side sign-in.

## Authentication and the empty catalog

Google sign-in uses Firebase. `POST /api/auth/firebase` verifies the ID token, verified email, Google provider and Firebase revocation state, then issues an application bearer JWT. Frontend and backend Firebase project IDs must match. Firebase Admin uses application-default credentials; on a non-Google host, securely mount a service-account JSON file and set `GOOGLE_APPLICATION_CREDENTIALS` to its path. A project ID alone is not a credential. [Firebase Admin setup](https://firebase.google.com/docs/admin/setup).

Password signup/login are disabled: `/api/auth/signup` and `/api/auth/login` return 410. Authorized calls use `Authorization: Bearer APP_JWT`. App JWTs expire after seven days; logout clears the browser session, but the API does not universally revoke every previously issued app JWT. Keep Admin credentials, database URIs and JWT secrets out of frontend `VITE_*` variables and Git.

The server-backed publication catalog is authoritative. Empty is valid: public course listing returns an empty array; unpublished/archived direct lessons remain unavailable. Learner access also checks enrollment, premium/private grants, unlock sequence and generation. Preserve historical accounts, enrollments, progress, reviews, notes, preferences, avatars and groups. Publish future reviewed content through authorized course/lesson administration; do not restore bundled demo lessons to fill the empty state.

| Endpoint group | Purpose |
| --- | --- |
| `/api/auth` | Firebase exchange, own profile/enrollment/application, permission-checked administration |
| `/api/courses`, `/api/lessons` | Published catalog, authorized authoring, lesson access |
| `/api/quiz`, `/api/progress` | Server-checked scoring/completion and saved progression |
| `/api/learning`, `/api/analytics` | Owner-scoped review/recommendations and verified analytics |
| `/api/study` | Membership, authorized seats, restricted chat and SSE |
| `/api/interviews`, `/api/achievements`, `/api/payment` | Queue, verified achievements and manual tuition workflows |
| `/api/email` | Separately authorized optional Gmail administration |

Client-authored progress updates are retired: `/api/progress/update` returns 410. Instructor analytics stays disabled without explicit instructor-to-course scope. Gmail administration OAuth is separate from student Google login; configure it only if enabled.

## Exact production startup requirements

Use `NODE_ENV=production` for both hosted staging and production. `src/utils/validateConfig.js` aborts startup if these checks fail:

| Setting | Requirement |
| --- | --- |
| `APP_ENV` | Explicit `staging` or `production`; default `development` fails |
| `JWT_SECRET` | At least 32 characters and not the development default; provision a unique private value |
| `MONGODB_URI` | MongoDB URI with an explicit database name and no fragment |
| `FIREBASE_PROJECT_ID` | Nonempty and not starting `your-`; the operator must additionally verify the actual approved project |
| `FRONTEND_URL` | Exact public HTTPS origin, no path/credentials/loopback hostname |
| `CORS_ORIGIN` / resulting allowlist | Resulting allowlist includes `FRONTEND_URL`; every entry is an exact HTTPS origin. Configure additional origins as a comma-separated list |
| Staging database | A separate `staging` name segment, e.g. `lugaish_staging`; production rejects such names |

`APP_ENV=staging` excludes the built-in production frontend origin. Allow the approved staging frontend(s) explicitly. Production defaults include `https://lugaish.vercel.app`; review that existing origin alongside configured additions.

`TRUST_PROXY` is separately validated before listening. Leave it unset until actual upstream topology is verified, or provide approved explicit IP addresses/CIDRs/local subnet names. `true`, `false`, numeric hop counts, malformed networks and catch-all `/0` networks abort startup. Do not guess a Render proxy range.

The host must provide a usable `PORT`; production defaults to `API_BIND_HOST=0.0.0.0`. Copying local `API_BIND_HOST=127.0.0.1` to Render prevents external routing even if the process starts. MongoDB connection failures retry every five seconds and keep readiness/API calls at 503. Missing/unusable Admin credentials can leave the API listening while Google login fails; readiness is not OAuth proof.

```text
GET /livez   -> process liveness
GET /readyz  -> 200 only with connected MongoDB and no shutdown drain
GET /health  -> database-aware legacy health response
```

Responses are `no-store`; correlation IDs and safe headers cover errors and rejected origins. Readiness tracks connection state, not completed migrations, authentication or media playback.

## Index preparation and existing databases

Production disables automatic Mongoose index creation. **Missing indexes do not themselves stop startup**; they can break generation-aware authoring, retry idempotency, uniqueness or room cleanup after the API appears ready. Prepare and verify them before exposing the approved service to students.

The preparation script imports all application and Study models. Important indexes include versioned lesson uniqueness `(language, day, courseGeneration)`, unique course language, partial unique quiz `(userId, requestId)` for string IDs, unique review `(userId, requestId)`, account identity/payment/certificate constraints and Study public-room uniqueness/TTL indexes. Historical quiz attempts without request IDs remain outside the new partial index.

From this API root, with private configuration selecting the **separately approved target**, the operator runbook uses:

```bash
# Read-only inventory; exact name must match MONGODB_URI.
node scripts/course-reset.mjs inventory --database EXACT_NAME

# Approved preparation: creates declared indexes; drops no data or indexes.
node scripts/prepare-indexes.mjs --database EXACT_NAME
```

Do not run examples against an unapproved target. Preparation refuses a surviving legacy unique `(language, day)` lesson index. That requires the separately reviewed `publication-index` migration with a verified target backup and maintenance window first. It creates the versioned index before removing that specific old index and deletes no records. Existing duplicates can prevent unique-index creation; reconcile them through review, not automatic deletion. Follow the paired client's `deploy/backup-recovery.md`; skip catalog archive/reset if inventory is already empty.

Installation/startup does not execute these procedures. A local build or fixture test does not certify a target database migration.

## Existing Render service runbook

The API fits a persistent Render **Node web service**: it honors `PORT`, binds `0.0.0.0` in production, handles termination and serves long-lived Study SSE. This is architectural suitability, not hosted verification. [Render web services](https://render.com/docs/web-services).

Before an approved update, inspect the existing service's repository, branch, live commit, runtime, environment, health path and auto-deploy policy. Connected-branch pushes and environment/secret changes can trigger deployment. Keep the review checkpoint local until the owner approves the exact push and hosted action. Do not create a replacement service or change its production branch during documentation review. [Render deployment behavior](https://render.com/docs/deploys).

For an existing native Node service connected to **`Lugaish-server`**:

| Render setting | Expected configuration |
| --- | --- |
| Root Directory | Repository root / blank; `src/` and `package.json` are at that root |
| Build Command | `npm ci --omit=dev` |
| Start Command | `npm start` |
| Node version | `NODE_VERSION` set to the approved tested exact version; local checkpoint uses `24.16.0` |
| Health Check Path | `/readyz` |
| Host/port | `API_BIND_HOST=0.0.0.0`; honor Render's injected `PORT` |
| Private settings | Production configuration above and matching Firebase Admin credentials |

If instead linked to the client repository, verify its checkout contains the matching backend submodule. Root Directory `server` alone does not turn a gitlink into API source. Do not assume the two repository layouts are interchangeable.

For an existing Docker service, the paired client's `deploy/api.Dockerfile` requires the **server directory as build context** and runs as non-root. Do not silently convert a Node service to Docker. Container execution remains locally unverified.

Pinning avoids provider-default changes and the unbounded engine range. [Render Node version selection](https://render.com/docs/node-version). Choose `/readyz` because a TCP socket or `/livez` alone does not establish database connectivity. [Render health checks](https://render.com/docs/health-checks).

An approved native Render secret file `firebase-admin.json` is available at `/etc/secrets/firebase-admin.json`; point `GOOGLE_APPLICATION_CREDENTIALS` at its actual mounted path. Never place the key in this README or public env files. [Render variables and secret files](https://render.com/docs/configure-environment-variables).

After separate deployment approval, check hosted readiness, exact-origin CORS, real authorized Google login, enrolled/unenrolled/revoked access, empty catalog or reviewed publication, private media, Study SSE, verified quiz/review persistence and graceful restart. Compare deployed commits/configuration with the paired release receipt. Keep a tested previous access-safe frontend/API pair and approved backup/recovery plan. Builds/readiness alone do not satisfy those checks.

## Verification

The paired client repository owns the suite runner. From that checkout:

```bash
npm test
npm run test:integration
npm run lint
npm run build
```

Integration checks create/drop their own disposable local MongoDB fixture databases; never redirect them to production. `lint` currently checks JS/JSX syntax, not semantic ESLint. Ordinary `build` checks code; hosted configuration/paired commit checks use the client's separate release commands.

From this API repository, pure startup-policy checks need no database mutation:

```bash
node --test src/utils/validateConfig.test.js src/utils/operations.test.js
npm audit --omit=dev
```

Review the complete development-tool audit separately; production-only audit results do not erase tooling findings. In the paired checkout, detailed results and outstanding launch gates are in `docs/PHASE-19-RELEASE-READINESS.md`, `docs/PHASE-20-FINAL-RELEASE.md` and `deploy/PHASE-19-OWNER-PREREQUISITES.md`.
