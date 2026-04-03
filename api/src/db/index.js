import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import 'dotenv/config';

// DATABASE CONNECTION
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, {schema});