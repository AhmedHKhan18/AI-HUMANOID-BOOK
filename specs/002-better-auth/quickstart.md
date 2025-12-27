# Quickstart: Better Auth Integration

**Feature Branch**: `002-better-auth`
**Date**: 2025-12-20

## Prerequisites

- Node.js 18+ installed
- Neon DB account with PostgreSQL database
- SMTP credentials for email (Gmail, SendGrid, etc.)
- Git access to this repository

## Step 1: Install Dependencies

```bash
# Core authentication
npm install better-auth

# Database (Neon serverless)
npm install @neondatabase/serverless drizzle-orm

# Development tools
npm install -D drizzle-kit @types/node

# Form handling & validation
npm install react-hook-form zod @hookform/resolvers

# Email
npm install nodemailer
npm install -D @types/nodemailer

# API server (for Docusaurus)
npm install express cors
npm install -D @types/express @types/cors
```

## Step 2: Environment Setup

Create `.env` file in project root:

```env
# Database (Neon)
DATABASE_URL=postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-32-character-minimum-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# API Server
API_PORT=3001
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Step 3: Database Migration

Run Better Auth CLI to generate database schema:

```bash
# Generate migration files
npx @better-auth/cli generate

# Apply migrations to Neon DB
npx @better-auth/cli migrate
```

## Step 4: Create Auth Configuration

Create `api/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,      // Refresh daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Click here to verify</a>`,
      });
    },
  },

  rateLimit: {
    window: 60,
    max: 5,
  },
});

export type Auth = typeof auth;
```

## Step 5: Create Auth Client

Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production'
    ? "https://api.yourdomain.com"
    : "http://localhost:3001",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
```

## Step 6: Create Express API Server

Create `api/server.ts`:

```typescript
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Better Auth handler
app.all("/api/auth/*", toNodeHandler(auth));

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth API running on port ${PORT}`);
});
```

## Step 7: Swizzle Navbar

```bash
npm run swizzle @docusaurus/theme-classic Navbar -- --wrap
```

Edit `src/theme/Navbar/index.tsx` to add auth components.

## Step 8: Create Auth Provider

Create `src/components/Auth/AuthProvider.tsx`:

```tsx
import React, { createContext, useContext } from 'react';
import { useSession } from '@site/src/lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const session = useSession();

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## Step 9: Start Development

```bash
# Terminal 1: Start API server
cd api && npm run dev

# Terminal 2: Start Docusaurus
npm start
```

## Testing Checklist

- [ ] Can register new account
- [ ] Verification email received
- [ ] Can verify email via link
- [ ] Can log in with credentials
- [ ] Session persists on refresh
- [ ] Can log out
- [ ] Can reset password
- [ ] Navbar shows correct auth state

## Common Issues

### CORS Errors
Ensure `FRONTEND_URL` in API matches your Docusaurus dev server URL.

### Cookie Not Set
Check that `credentials: 'include'` is set in auth client config.

### Database Connection
Verify `DATABASE_URL` has `?sslmode=require` for Neon.

### Email Not Sending
Check SMTP credentials and try with Gmail App Password.
