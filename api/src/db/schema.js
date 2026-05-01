import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  isVerified: boolean('is_verified').default(false),
  token: text('token').notNull().unique(),
  subdomain: text('subdomain').unique(),
  isPremium: boolean('is_premium').default(false),
  verificationToken: text('verification_token'), // Legacy field
  verificationTokenExpiry: timestamp('verification_token_expiry'), // Legacy field
  
  otpHash: text('otp_hash'), // Hashed OTP for verification
  otpExpiry: timestamp('otp_expiry'), // When OTP expires
  
  createdAt: timestamp('created_at').defaultNow()
});

export const tunnels = pgTable('tunnels', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  subdomain: text('subdomain').notNull(),
  isActive: boolean('is_active').default(true),
  connectedAt: timestamp('connected_at').defaultNow()
});