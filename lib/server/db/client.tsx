import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";


const databaseURL = process.env.NEON_DATABASE_URL as string;
if(!databaseURL) {
  throw new Error('Database URL is required for API routes. Add it to the .env file');
}

const sql  = neon(databaseURL);

export const db = drizzle(sql, {schema});