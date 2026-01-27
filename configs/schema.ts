import { Domain } from "domain";
import { boolean, integer, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const websitesTable = pgTable('websites', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  websiteId: varchar({ length: 255 }).notNull().unique(),
  domain: varchar({ length: 255 }).notNull().unique(),
  timeZone: varchar({ length: 100 }).notNull(),
  enableLocalhostTracking: boolean().default(false),
  userEmail: varchar({ length: 255 }).notNull(),
})