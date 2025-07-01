import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import { Pool } from "pg";

declare global {
    // eslint-disable-next-line no-var
    var pgPool: Pool | undefined; // Declare a global variable to hold the pool instance
}

let pool: Pool;

if (!global.pgPool) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Use SSL in production
    });
    global.pgPool = pool;
} else {
    pool = global.pgPool;
}

export { pool as dbPool };