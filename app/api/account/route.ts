import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";
import { sql } from "@/utils/sql";

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];
    
    const body = await req.json();
    const username: string|undefined|null = body["username"];

    if (!username || username.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid username"
            },
            { status: 400 }
        );
    };

    if (username.trim() !== session["user"]["username"]) {
        try {
            await auth.api.updateUser({
                body: {
                    username: username
                }
            });
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating username"
                },
                { status: 500 }
            );
        };
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};