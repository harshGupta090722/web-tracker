import { sql } from "@/configs/db";

let warmed = false;

export async function wakeDb() {
    if (warmed) return;
    warmed = true;
    
    await sql`SELECT 1`;
    console.log("DB jaag gya ");
}