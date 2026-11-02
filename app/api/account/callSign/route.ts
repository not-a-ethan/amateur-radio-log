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
    const callSign = body["callSign"];

    if (!callSign || callSign.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a call sign"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE profile SET callsign=${callSign} WHERE userid=${userId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong updating your call sign"
            }
        )
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};