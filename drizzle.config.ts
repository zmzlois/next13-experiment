import type { Config } from "drizzle-kit";
// don't touch this file
import * as dotenv from "dotenv";
import { createId } from "@paralleldrive/cuid2"

dotenv.config();

export default {
    schema: "./drizzle/schema/*",
    out: "./drizzle/generated",
    driver: "mysql2",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
} satisfies Config;
console.log("Database URL: ", process.env.DATABASE_URL);