import { Pool } from "pg";

import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

import { sql } from "./sql";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.POSTGRES_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        maxLifetimeSeconds: 60
    }),
    emailAndPassword: { 
        enabled: true
    }, 
    plugins: [
        username()
    ],
    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: true
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await sql`INSERT INTO profile VALUES (${user.id}, 'callsign', 'country');`;
                },
            }
        }
    }
});