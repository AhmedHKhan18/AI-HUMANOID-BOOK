import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./user";

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    expiresAt: timestamp("expiresAt"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [unique("account_provider_unique").on(table.providerId, table.accountId)]
);

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
