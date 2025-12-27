# Data Model: Better Auth Integration

**Feature Branch**: `002-better-auth`
**Date**: 2025-12-20

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                DATABASE SCHEMA                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│        user          │       │       session        │
├──────────────────────┤       ├──────────────────────┤
│ id (PK, text)        │◄──────│ userId (FK, text)    │
│ email (unique, text) │       │ id (PK, text)        │
│ emailVerified (bool) │       │ token (text)         │
│ username (unique)    │       │ expiresAt (timestamp)│
│ name (text, nullable)│       │ ipAddress (text)     │
│ image (text, nullable│       │ userAgent (text)     │
│ createdAt (timestamp)│       │ createdAt (timestamp)│
│ updatedAt (timestamp)│       │ updatedAt (timestamp)│
└──────────────────────┘       └──────────────────────┘
         │
         │
         ▼
┌──────────────────────┐       ┌──────────────────────┐
│       account        │       │    verification      │
├──────────────────────┤       ├──────────────────────┤
│ id (PK, text)        │       │ id (PK, text)        │
│ userId (FK, text)    │       │ identifier (text)    │
│ accountId (text)     │       │ value (text)         │
│ providerId (text)    │       │ expiresAt (timestamp)│
│ accessToken (text)   │       │ createdAt (timestamp)│
│ refreshToken (text)  │       │ updatedAt (timestamp)│
│ idToken (text)       │       └──────────────────────┘
│ expiresAt (timestamp)│
│ password (text)      │  ◄── Hashed password for email/password auth
│ createdAt (timestamp)│
│ updatedAt (timestamp)│
└──────────────────────┘

┌──────────────────────┐
│    email_queue       │  ◄── Custom table for email retry handling
├──────────────────────┤
│ id (PK, text)        │
│ to (text)            │
│ subject (text)       │
│ body (text)          │
│ type (text)          │  ◄── 'verification' | 'password_reset'
│ status (text)        │  ◄── 'pending' | 'sent' | 'failed'
│ attempts (integer)   │
│ lastAttempt (time)   │
│ createdAt (timestamp)│
└──────────────────────┘
```

---

## Entity Definitions

### 1. User Entity

**Table**: `user`
**Purpose**: Stores registered user profile information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PK, NOT NULL | Unique identifier (CUID) |
| `email` | text | UNIQUE, NOT NULL | User's email address |
| `emailVerified` | boolean | NOT NULL, DEFAULT false | Email verification status |
| `username` | text | UNIQUE, NOT NULL | Display username (3-30 alphanumeric chars) |
| `name` | text | NULLABLE | Full display name |
| `image` | text | NULLABLE | Profile image URL |
| `createdAt` | timestamp | NOT NULL | Account creation time |
| `updatedAt` | timestamp | NOT NULL | Last update time |

**Indexes**:
- Primary: `id`
- Unique: `email`
- Unique: `username`

**Validation Rules**:
- Email: Valid email format (RFC 5322)
- Username: 3-30 characters, alphanumeric only, case-insensitive unique
- Name: Max 100 characters

---

### 2. Session Entity

**Table**: `session`
**Purpose**: Tracks active authentication sessions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PK, NOT NULL | Session identifier |
| `userId` | text | FK → user.id, NOT NULL | Reference to user |
| `token` | text | NOT NULL | Session token (hashed) |
| `expiresAt` | timestamp | NOT NULL | Expiration time |
| `ipAddress` | text | NULLABLE | Client IP address |
| `userAgent` | text | NULLABLE | Browser/client info |
| `createdAt` | timestamp | NOT NULL | Session creation time |
| `updatedAt` | timestamp | NOT NULL | Last activity time |

**Indexes**:
- Primary: `id`
- Foreign Key: `userId` → `user.id` (ON DELETE CASCADE)
- Index: `token` (for session lookup)
- Index: `expiresAt` (for cleanup queries)

**Behavior**:
- `expiresAt` updated on each activity (sliding session)
- Default expiration: 30 days from last activity
- Multiple sessions allowed per user (concurrent devices)

---

### 3. Account Entity

**Table**: `account`
**Purpose**: Stores authentication credentials per provider

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PK, NOT NULL | Account identifier |
| `userId` | text | FK → user.id, NOT NULL | Reference to user |
| `accountId` | text | NOT NULL | Provider-specific user ID |
| `providerId` | text | NOT NULL | Auth provider ('credential', 'google', etc.) |
| `accessToken` | text | NULLABLE | OAuth access token |
| `refreshToken` | text | NULLABLE | OAuth refresh token |
| `idToken` | text | NULLABLE | OAuth ID token |
| `expiresAt` | timestamp | NULLABLE | Token expiration |
| `password` | text | NULLABLE | Hashed password (for credential provider) |
| `createdAt` | timestamp | NOT NULL | Creation time |
| `updatedAt` | timestamp | NOT NULL | Last update time |

**Indexes**:
- Primary: `id`
- Foreign Key: `userId` → `user.id` (ON DELETE CASCADE)
- Unique Composite: (`providerId`, `accountId`)

**Password Storage**:
- Hashed using bcrypt with 10 rounds
- Never stored or transmitted in plaintext
- Minimum 8 characters, maximum 128 characters

---

### 4. Verification Entity

**Table**: `verification`
**Purpose**: Stores email verification and password reset tokens

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PK, NOT NULL | Token identifier |
| `identifier` | text | NOT NULL | Email address or user ID |
| `value` | text | NOT NULL | Token value (hashed) |
| `expiresAt` | timestamp | NOT NULL | Token expiration (24 hours) |
| `createdAt` | timestamp | NOT NULL | Creation time |
| `updatedAt` | timestamp | NOT NULL | Last update time |

**Indexes**:
- Primary: `id`
- Index: `identifier` (for lookup)
- Index: `expiresAt` (for cleanup)

**Behavior**:
- Tokens expire after 24 hours
- Single-use: deleted after successful verification
- Old tokens invalidated when new one is created

---

### 5. Email Queue Entity (Custom)

**Table**: `email_queue`
**Purpose**: Queue for email retry on delivery failure

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PK, NOT NULL | Queue item ID |
| `to` | text | NOT NULL | Recipient email |
| `subject` | text | NOT NULL | Email subject |
| `body` | text | NOT NULL | Email HTML body |
| `type` | text | NOT NULL | 'verification' or 'password_reset' |
| `status` | text | NOT NULL, DEFAULT 'pending' | 'pending', 'sent', 'failed' |
| `attempts` | integer | NOT NULL, DEFAULT 0 | Retry attempt count |
| `lastAttempt` | timestamp | NULLABLE | Last attempt time |
| `createdAt` | timestamp | NOT NULL | Creation time |

**Indexes**:
- Primary: `id`
- Index: `status` (for pending email queries)
- Index: (`status`, `lastAttempt`) (for retry scheduling)

**Behavior**:
- Max 5 retry attempts
- Exponential backoff: 1min, 5min, 15min, 60min, 4hrs
- Status changes: pending → sent | failed

---

## State Transitions

### User Email Verification State

```
                    ┌──────────────┐
                    │  Registered  │
                    │ (unverified) │
                    └──────┬───────┘
                           │
            Verification email sent
                           │
                           ▼
                    ┌──────────────┐
        ┌───────────│   Pending    │───────────┐
        │           │ Verification │           │
        │           └──────────────┘           │
        │                                      │
   Clicks link                            Token expires
   (valid token)                          (24 hours)
        │                                      │
        ▼                                      ▼
 ┌──────────────┐                      ┌──────────────┐
 │   Verified   │                      │   Expired    │
 │   (active)   │                      │ (resend req) │
 └──────────────┘                      └──────────────┘
```

### Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                      SESSION LIFECYCLE                           │
└─────────────────────────────────────────────────────────────────┘

    Login                  Activity              No Activity
      │                       │                      │
      ▼                       ▼                      ▼
┌──────────┐           ┌──────────┐           ┌──────────┐
│  Active  │───────────│  Active  │───────────│ Expired  │
│(30 days) │  extends  │(30 days) │  30 days  │(invalid) │
└──────────┘           └──────────┘           └──────────┘
      │                                             │
      │                                             │
   Logout                                     Auto-cleanup
      │                                             │
      ▼                                             ▼
┌──────────┐                                 ┌──────────┐
│ Deleted  │                                 │ Deleted  │
└──────────┘                                 └──────────┘
```

---

## Database Migration Strategy

### Initial Migration (v1)

```sql
-- Better Auth core tables
CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "username" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "session" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "token" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "expiresAt" TIMESTAMP,
  "password" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE ("providerId", "accountId")
);

CREATE TABLE "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Custom email queue table
CREATE TABLE "email_queue" (
  "id" TEXT PRIMARY KEY,
  "to" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastAttempt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX "idx_session_token" ON "session"("token");
CREATE INDEX "idx_session_expires" ON "session"("expiresAt");
CREATE INDEX "idx_session_user" ON "session"("userId");
CREATE INDEX "idx_verification_identifier" ON "verification"("identifier");
CREATE INDEX "idx_email_queue_status" ON "email_queue"("status");
```

---

## Drizzle ORM Schema

```typescript
// schema/user.ts
import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  username: text('username').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// schema/session.ts
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// schema/account.ts
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// schema/verification.ts
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// schema/emailQueue.ts
export const emailQueue = pgTable('email_queue', {
  id: text('id').primaryKey(),
  to: text('to').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('pending'),
  attempts: integer('attempts').notNull().default(0),
  lastAttempt: timestamp('lastAttempt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
```

---

## Data Privacy & GDPR Compliance

### Personal Data Fields

| Field | Classification | Retention | Deletion on Account Delete |
|-------|---------------|-----------|---------------------------|
| email | Personal | Account lifetime | Yes - immediate |
| username | Personal | Account lifetime | Yes - immediate |
| name | Personal | Account lifetime | Yes - immediate |
| image | Personal | Account lifetime | Yes - immediate |
| ipAddress | Personal | Session lifetime | Yes - cascade |
| userAgent | Technical | Session lifetime | Yes - cascade |
| password | Sensitive | Account lifetime | Yes - immediate |

### Data Deletion Process

When user requests account deletion:
1. Delete all sessions (cascade)
2. Delete all accounts (cascade)
3. Delete all verification tokens (cascade)
4. Delete pending emails from queue
5. Delete user record
6. All operations in single transaction

```sql
-- Cascading delete handled by FK constraints
DELETE FROM "user" WHERE "id" = $1;
-- Also: DELETE pending emails
DELETE FROM "email_queue" WHERE "to" = $email;
```
