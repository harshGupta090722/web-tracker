import { drizzle } from 'drizzle-orm/neon-http';
import {neon } from "@neondatabase/serverless";

export const sql=neon(process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!);
console.log("This our sql "+sql);
export const db = drizzle(sql);