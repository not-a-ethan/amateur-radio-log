import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        // connection options
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 
    plugins: [ 
        username() 
    ] 
});