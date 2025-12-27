import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const emailQueue = pgTable("email_queue", {
  id: text("id").primaryKey(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(), // 'verification' | 'password_reset'
  status: text("status").notNull().default("pending"), // 'pending' | 'sent' | 'failed'
  attempts: integer("attempts").notNull().default(0),
  lastAttempt: timestamp("lastAttempt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type EmailQueue = typeof emailQueue.$inferSelect;
export type NewEmailQueue = typeof emailQueue.$inferInsert;
