import dotenv from "dotenv";
const result = dotenv.config(); // Load environment variables from .env file
console.log("dotenv result:", result);
console.log("Conectando a: ", process.env.DATABASE_URL);

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