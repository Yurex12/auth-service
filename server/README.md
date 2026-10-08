# Auth Service API 🛡️

A production-ready, security-first Authentication & Authorization backend service built with **Node.js**, **Express 5**, **TypeScript**, **Drizzle ORM**, and **PostgreSQL**.

Features stateful server-managed sessions via HttpOnly cookies, Argon2 credential hashing, Google OAuth 2.0 account linking, fine-grained Role-Based Access Control (RBAC), per-endpoint rate limiting, and interactive OpenAPI documentation.

---

## 🌟 Key Features

- **Stateful Session Management:** Server-managed sessions stored in PostgreSQL with device telemetry (IP address, User-Agent), multi-device tracking, and remote session revocation (`/revoke-all`, `/revoke-other`).
- **Cryptographic Security:** 
  - **Argon2id** password hashing (memory-hard, GPU/ASIC brute-force resistant).
  - One-Time Passwords (OTPs) and password reset tokens are stored as **HMAC-SHA256 hashes** in the database to mitigate credential leak risks.
- **Google OAuth 2.0 & Account Linking:** Seamless Google authentication and secure account linking/unlinking for authenticated users with CSRF state validation.
- **Granular Rate Limiting:** Dedicated per-route rate limiters preventing brute force on OTPs (5 attempts/15 min), email bombing on resends (3 attempts/15 min), and DDoS protection (500 requests/15 min globally).
- **Role-Based Access Control (RBAC):** Extensible database-backed roles, permissions, and `role_permissions` mapping, enforced via declarative middleware (`requirePermission(...)`).
- **Type-Safe Validation:** Full request body, query, and params validation powered by **Zod**.
- **Interactive Documentation:** Auto-generated **Swagger / OpenAPI 3.0** documentation served at `/api-docs`.
- **Structured Observability:** High-performance JSON logging via **Pino** and `pino-http`, with automated redaction of sensitive cookies and authorization headers.
- **Automated Testing:** Comprehensive integration and unit test coverage using **Vitest** and **Supertest**.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Language** | Node.js (ESM), TypeScript |
| **Framework** | Express.js 5 |
| **Database & ORM** | PostgreSQL, Drizzle ORM, Drizzle Kit |
| **Password Hashing** | Argon2 |
| **Authentication & OAuth** | Google Auth Library, Cookie-Parser, Stateful Sessions |
| **Validation** | Zod |
| **Rate Limiting** | Express-Rate-Limit |
| **Email Delivery** | Resend |
| **API Documentation** | Swagger UI Express, Swagger JSDoc (OpenAPI 3.0) |
| **Logging** | Pino, Pino-HTTP |
| **Testing** | Vitest, Supertest |

---

## 📂 Project Architecture

```
server/
├── drizzle/              # Drizzle SQL migration files
├── src/
│   ├── db/
│   │   ├── index.ts      # Drizzle database client initialization
│   │   └── schema.ts     # PostgreSQL schema definitions (Users, Accounts, Sessions, Roles, RBAC)
│   ├── docs/
│   │   └── swagger.ts    # OpenAPI 3.0 / Swagger JSDoc configuration
│   ├── features/
│   │   ├── auth/         # Auth controllers, services, schemas, routes, email, OAuth
│   │   ├── user/         # User management controllers, services, schemas, routes
│   │   └── post/         # Resource example with RBAC protection
│   ├── middleware/
│   │   ├── auth.middleware.ts             # Session verification & user hydration
│   │   ├── auth.permission.middleware.ts  # RBAC permission check middleware
│   │   ├── error-handler.ts               # Centralized API error handling
│   │   ├── rate-limit.ts                  # Per-route rate limiting configuration
│   │   └── validation.ts                  # Zod request validator
│   ├── scripts/
│   │   └── seed.ts       # Database seeder for default roles & permissions
│   ├── utils/            # Token generation, Argon2 helpers, AppError, Logger
│   ├── app.ts            # Express application setup & middleware stack
│   └── server.ts         # Server entry point
├── vitest.config.ts      # Vitest test runner configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 📋 API Endpoints Overview

All routes are documented and testable interactively at `http://localhost:3000/api-docs`.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Rate Limit | Protection |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register user & dispatch email OTP | 5 / 15m | Public |
| `POST` | `/verify-email` | Verify email with 6-digit OTP | 5 / 15m | Public |
| `POST` | `/resend-verification` | Request a new verification OTP | 3 / 15m | Public |
| `POST` | `/login` | Authenticate credentials & issue session cookie | 10 / 15m | Public |
| `GET` | `/me` | Get current authenticated user profile | Global | Session |
| `POST` | `/logout` | Revoke current session & clear cookie | Global | Session |
| `POST` | `/change-password` | Update account password | Global | Session |
| `POST` | `/password-reset` | Request password reset code via email | 3 / 15m | Public |
| `POST` | `/password-reset/verify` | Verify reset code & issue short-lived reset token | 5 / 15m | Public |
| `POST` | `/password-reset/confirm` | Set new password with reset token | 3 / 15m | Public |
| `POST` | `/set-password/request` | Request OTP to add password to OAuth-only account | 3 / 15m | Session |
| `POST` | `/set-password/verify` | Verify set-password OTP | 5 / 15m | Session |
| `POST` | `/set-password` | Finalize credential password creation | 3 / 15m | Session |
| `GET` | `/google` | Initiate Google OAuth 2.0 flow | Global | Public |
| `GET` | `/google/callback` | Google OAuth redirect callback | Global | Public |
| `POST` | `/google/link` | Confirm linking Google account to active user | Global | Public / Token |
| `POST` | `/google/link/cancel` | Cancel Google account linking | Global | Public |
| `DELETE` | `/google/unlink` | Disconnect Google provider from account | Global | Session |
| `GET` | `/google/link` | Initiate Google linking for signed-in user | Global | Session |
| `GET` | `/accounts` | List linked auth providers (credential, google) | Global | Session |
| `GET` | `/sessions` | View all active devices / sessions | Global | Session |
| `DELETE` | `/sessions` | Terminate all active sessions (logout everywhere) | Global | Session |
| `DELETE` | `/sessions/others` | Terminate all sessions except current device | Global | Session |
| `DELETE` | `/sessions/:id` | Terminate specific session by ID | Global | Session |

### User Management (`/api/users`)
| Method | Endpoint | Description | Permission Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Paginated user list | `users:read` |
| `GET` | `/:id` | Get user by ID | `users:read` |
| `PATCH` | `/:id` | Update user details | `users:update` |
| `PATCH` | `/:id/role` | Change user role (e.g. user -> admin) | `users:role:update` |
| `DELETE` | `/:id` | Delete user account | `users:delete` |

### Post Management (`/api/posts`)
| Method | Endpoint | Description | Permission Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieve paginated posts | `posts:read` |
| `GET` | `/:id` | Retrieve single post | `posts:read` |
| `POST` | `/` | Create a new post | `posts:create` |
| `PUT` | `/:id` | Update an existing post | `posts:update` |
| `DELETE` | `/:id` | Delete a post | `posts:delete` |

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory based on the following configuration:

```env
# Application
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_service

# Security
TOKEN_HASH_SECRET=your_super_secret_hmac_hash_key_min_32_chars

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_LINK_REDIRECT_URI=http://localhost:3000/api/auth/google/link/callback
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **PostgreSQL** instance running locally or hosted (e.g., [Neon](https://neon.tech))

### 2. Installation
```bash
cd server
npm install
```

### 3. Database Setup & Migrations
Push schema changes to your PostgreSQL instance:
```bash
# Push schema directly with Drizzle Kit
npm run db:push

# (Optional) Seed standard roles and permissions (user, admin)
npm run db:seed
```

You can inspect the database visually anytime with Drizzle Studio:
```bash
npm run db:studio
```

### 4. Running the Server
```bash
# Start in development mode with live watch
npm run dev

# Build TypeScript to production
npm run build

# Start production server
npm start
```

Once running, access Swagger API docs at:  
👉 **`http://localhost:3000/api-docs`**

---

## 🧪 Testing

The test suite runs with **Vitest** and **Supertest** against an isolated test environment:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🔒 Security Best Practices Implemented

- **Argon2id for Passwords:** Winner of the Password Hashing Competition; inherently resilient to side-channel and hardware attacks.
- **Hashed Token Storage:** Email verification OTPs and reset tokens are hashed using HMAC-SHA256 prior to database persistence. Even with a full database dump, plaintext tokens cannot be retrieved.
- **HttpOnly, Secure Cookies:** Session tokens and short-lived authorization cookies are inaccessible to client-side JavaScript (`HttpOnly: true`), mitigating XSS session theft.
- **Targeted Rate Limiting:** Email-sending endpoints are strictly constrained to 3 requests per 15 minutes to eliminate mail provider quota depletion and spam.
- **Header & Log Sanitization:** Pino-HTTP logger automatically redacts `cookie`, `authorization`, and `set-cookie` headers to prevent credential leakage in application logs.
