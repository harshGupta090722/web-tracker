import { sql } from "../configs/db";

export async function wakeDb() {
  await sql`SELECT 1`;
  console.log("Neon DB awakened");
}