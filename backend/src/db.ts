import { SQL } from "bun";

// PostgreSQL
export const db = new SQL(Bun.env.DATABASE_URL!);
