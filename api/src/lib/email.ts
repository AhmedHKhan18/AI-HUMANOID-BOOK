import nodemailer from "nodemailer";
import { db } from "./db.js";
import { emailQueue } from "./schema/index.js";
import { nanoid } from "nanoid";
import { eq, and, lt } from "drizzle-orm";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  type?: "verification" | "password_reset";
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, type = "verification" } = options;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);

    // Queue email for retry
    await queueEmail({ to, subject, html, type });
    return false;
  }
}

async function queueEmail(options: EmailOptions): Promise<void> {
  const { to, subject, html, type = "verification" } = options;

  await db.insert(emailQueue).values({
    id: nanoid(),
    to,
    subject,
    body: html,
    type,
    status: "pending",
    attempts: 0,
  });
}

// Retry backoff intervals: 1min, 5min, 15min, 60min, 4hrs
const RETRY_DELAYS = [60, 300, 900, 3600, 14400];
const MAX_ATTEMPTS = 5;

export async function processEmailQueue(): Promise<void> {
  const pendingEmails = await db.query.emailQueue.findMany({
    where: and(
      eq(emailQueue.status, "pending"),
      lt(emailQueue.attempts, MAX_ATTEMPTS)
    ),
  });

  for (const email of pendingEmails) {
    const now = new Date();

    // Check if enough time has passed since last attempt
    if (email.lastAttempt) {
      const timeSinceLastAttempt = (now.getTime() - email.lastAttempt.getTime()) / 1000;
      const requiredDelay = RETRY_DELAYS[Math.min(email.attempts, RETRY_DELAYS.length - 1)];

      if (timeSinceLastAttempt < requiredDelay) {
        continue; // Not enough time has passed
      }
    }

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: email.to,
        subject: email.subject,
        html: email.body,
      });

      // Mark as sent
      await db
        .update(emailQueue)
        .set({ status: "sent", lastAttempt: now })
        .where(eq(emailQueue.id, email.id));
    } catch (error) {
      console.error(`Failed to send queued email ${email.id}:`, error);

      const newAttempts = email.attempts + 1;
      await db
        .update(emailQueue)
        .set({
          attempts: newAttempts,
          lastAttempt: now,
          status: newAttempts >= MAX_ATTEMPTS ? "failed" : "pending",
        })
        .where(eq(emailQueue.id, email.id));
    }
  }
}

// Email templates
export function getVerificationEmailTemplate(url: string, username: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Welcome, ${username}!</h1>
      <p style="color: #666; line-height: 1.6;">
        Thank you for registering. Please verify your email address by clicking the button below:
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${url}"
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p style="color: #999; font-size: 12px;">
        If you didn't create an account, you can safely ignore this email.
        This link will expire in 24 hours.
      </p>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailTemplate(url: string, username: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Password Reset Request</h1>
      <p style="color: #666; line-height: 1.6;">
        Hi ${username}, we received a request to reset your password. Click the button below to set a new password:
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${url}"
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p style="color: #999; font-size: 12px;">
        If you didn't request a password reset, you can safely ignore this email.
        This link will expire in 24 hours.
      </p>
    </body>
    </html>
  `;
}
