# Research: Better Auth Integration for Docusaurus

**Feature Branch**: `002-better-auth`
**Date**: 2025-12-20
**Status**: Complete

## Executive Summary

Research confirms that Better Auth is a production-ready authentication library that integrates well with React applications and supports Neon DB (PostgreSQL) through the Drizzle ORM adapter. Key architectural decisions have been made to bridge Better Auth with Docusaurus's static site generation model.

---

## Research Findings

### 1. Better Auth Library Capabilities

**Decision**: Use Better Auth v1.x with Drizzle ORM adapter for Neon DB

**Rationale**:
- Modern TypeScript-first library with full type safety
- Built-in email/password authentication with verification flows
- Native PostgreSQL support via Drizzle adapter
- React client hooks for seamless frontend integration
- Automatic CSRF protection and secure cookie management
- Extensible plugin architecture for future OAuth providers

**Alternatives Considered**:
- **Auth.js (NextAuth)**: More mature but heavier, better suited for Next.js
- **Lucia Auth**: Lightweight but discontinued development
- **Custom JWT solution**: Too much security risk for custom implementation

**Source**: [Better Auth Documentation](https://www.better-auth.com/docs/installation)

---

### 2. Docusaurus Integration Strategy

**Decision**: Use Express.js API server alongside Docusaurus static site

**Rationale**:
- Docusaurus is a static site generator without native API routes
- Better Auth requires server-side handlers for authentication endpoints
- Express.js provides a lightweight, familiar API server pattern
- Can be deployed as separate service or combined via Vercel serverless functions

**Architecture Pattern**:
```
┌─────────────────────────────────────────────────────────────────┐
│                      Docusaurus (Static)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Navbar     │  │   Pages      │  │   Auth Components    │  │
│  │ (Swizzled)   │  │   (React)    │  │   (Login, Signup)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                           │                                      │
│                     Auth Client                                  │
│                   (better-auth/react)                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                    HTTP(S) Requests
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Server (Express)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Better Auth Handler (/api/auth/*)               │   │
│  │  - /api/auth/sign-up        - /api/auth/sign-out         │   │
│  │  - /api/auth/sign-in        - /api/auth/session          │   │
│  │  - /api/auth/verify-email   - /api/auth/forgot-password  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Neon DB (PostgreSQL)                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐  │
│  │   user     │ │  session   │ │   account  │ │ verification│  │
│  └────────────┘ └────────────┘ └────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Alternatives Considered**:
- **Next.js migration**: Too disruptive; would require rewriting entire site
- **Vercel Edge Functions**: Limited support for Better Auth server-side
- **Separate authentication service**: More complex deployment topology

---

### 3. Session Management Configuration

**Decision**: Configure sliding sessions with 30-day inactivity timeout

**Rationale**:
- Per spec clarification: "Indefinite with activity refresh"
- Better Auth supports sliding sessions via `updateAge` and `expiresIn` settings
- Set `expiresIn: 30d` with `updateAge: 1d` for session refresh on activity
- Each user activity within the day extends session by 30 days

**Configuration**:
```typescript
session: {
  expiresIn: 60 * 60 * 24 * 30, // 30 days
  updateAge: 60 * 60 * 24,       // 1 day (refresh on activity)
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60 // 5 minute client-side cache
  }
}
```

---

### 4. Database Schema Design

**Decision**: Use Better Auth's default schema with custom `username` field extension

**Rationale**:
- Better Auth automatically generates `user`, `session`, `account`, `verification` tables
- Add custom `username` field via Better Auth's `additionalFields` configuration
- Use Drizzle ORM for type-safe database operations

**Schema Extension**:
```typescript
user: {
  additionalFields: {
    username: {
      type: "string",
      required: true,
      unique: true,
    }
  }
}
```

---

### 5. Neon DB Connection Strategy

**Decision**: Use `@neondatabase/serverless` driver with connection pooling

**Rationale**:
- Neon requires serverless-compatible driver for edge/serverless deployments
- Connection pooling via Neon's built-in pooler handles connection limits
- WebSocket connection for lower latency in serverless environments

**Configuration**:
```typescript
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

**Source**: [Neon Serverless Documentation](https://neon.com/docs/serverless/serverless-driver)

---

### 6. Email Service Integration

**Decision**: Use nodemailer with SMTP configuration (configurable per environment)

**Rationale**:
- Better Auth supports custom email sending via `sendVerificationEmail` and `sendResetPasswordEmail` callbacks
- SMTP is universally supported and environment-agnostic
- Can swap to SendGrid, Resend, or AWS SES in production

**Error Handling (per spec)**: Queue for retry with user notification
- Implement email queue using simple database table or Redis
- Show user "Email may be delayed" message on send failure
- Background retry with exponential backoff

---

### 7. Frontend Component Strategy

**Decision**: Create custom React components using Docusaurus CSS variables

**Rationale**:
- Docusaurus uses Infima CSS framework with CSS custom properties
- Components should use `var(--ifm-color-primary)` etc. for theme consistency
- Modal-based login/signup for non-disruptive UX
- Support dark mode via `[data-theme='dark']` selectors

**Component List**:
1. `AuthProvider.tsx` - Context provider wrapping Root
2. `LoginModal.tsx` - Email/password login form
3. `SignupModal.tsx` - Registration form with password strength
4. `UserMenu.tsx` - Dropdown for authenticated users
5. `ForgotPasswordModal.tsx` - Password reset request
6. `ProtectedContent.tsx` - Wrapper for verified-users-only content

---

### 8. Navbar Integration Strategy

**Decision**: Swizzle `NavbarItem/ComponentTypes` to add auth items

**Rationale**:
- Docusaurus navbar is configured in `docusaurus.config.js`
- Swizzling allows custom components while maintaining config-driven approach
- Add `authButton` and `userMenu` as custom navbar item types

**Implementation**:
```bash
npm run swizzle @docusaurus/theme-classic NavbarItem/ComponentTypes -- --wrap
```

---

### 9. Protected Content Strategy

**Decision**: Use `ProtectedContent` wrapper component with "verification required" message

**Rationale**:
- Per spec: Unverified users can browse but cannot access protected content
- Wrapper shows login prompt or verification reminder based on auth state
- Content remains in DOM for SEO but is visually hidden behind auth wall

---

### 10. Rate Limiting Implementation

**Decision**: Use Better Auth's built-in rate limiting with custom thresholds

**Rationale**:
- Better Auth includes native rate limiting for auth endpoints
- Configure 5 failed attempts = 15 minute lockout (per spec)
- Use IP-based limiting for unauthenticated endpoints

---

## Technology Stack Summary

| Component | Technology | Version |
|-----------|------------|---------|
| Authentication | Better Auth | ^1.0.0 |
| Database | Neon DB (PostgreSQL) | Serverless |
| ORM | Drizzle ORM | ^0.30.0 |
| DB Driver | @neondatabase/serverless | ^0.9.0 |
| API Server | Express.js | ^4.18.0 |
| Frontend | React (Docusaurus) | ^18.2.0 |
| Forms | React Hook Form | ^7.50.0 |
| Validation | Zod | ^3.22.0 |
| Email | Nodemailer | ^6.9.0 |

---

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=<32+ character random string>
BETTER_AUTH_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# App
NODE_ENV=development
```

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Docusaurus SSG limitations | Separate API server architecture |
| Neon cold starts | Connection pooling + keep-alive |
| Email delivery delays | Queue + retry + user notification |
| Session sync across tabs | Cookie-based session with polling |
| CORS issues | Explicit CORS config matching domains |

---

## Sources

- [Better Auth Documentation](https://www.better-auth.com/docs/installation)
- [Better Auth Session Management](https://www.better-auth.com/docs/concepts/session-management)
- [Neon Serverless Driver](https://neon.com/docs/serverless/serverless-driver)
- [Drizzle ORM PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Medium: Better Auth + Neon + Drizzle](https://medium.com/@abgkcode/building-a-full-stack-application-with-next-js-drizzle-orm-neon-postgresql-and-better-auth-6d7541fba48a)
