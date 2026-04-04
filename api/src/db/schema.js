import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// USER TABLE
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isVerified: boolean('is_verified').default(false),
  token: text('token').notNull().unique(),
  verificationToken: text('verification_token'),
  verificationTokenExpiry: timestamp(),
  createdAt: timestamp('created_at').defaultNow()
});

// TUNNEL TABLE
export const tunnels = pgTable('tunnels', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  subdomain: text('subdomain').notNull(),
  isActive: boolean('is_active').default(true),
  connectedAt: timestamp('connected_at').defaultNow()
});