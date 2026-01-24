export const runtime="nodejs";

import {neon } from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";

export const sql=neon(process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!);
export const db=drizzle(sql);
