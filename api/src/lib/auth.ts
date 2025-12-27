import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import * as schema from "./schema/index.js";
import {
  sendEmail,
  getVerificationEmailTemplate,
} from "./email.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled until SMTP is configured
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Refresh daily on activity
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minute client-side cache
    },
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const username = (user as typeof user & { username?: string }).username || user.email.split("@")[0];
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: getVerificationEmailTemplate(url, username),
        type: "verification",
      });
    },
    sendOnSignUp: true,
  },

  account: {
    accountLinking: {
      enabled: false,
    },
  },

  rateLimit: {
    window: 60, // 1 minute window
    max: 5, // 5 requests per window
  },

  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
});

export type Auth = typeof auth;
