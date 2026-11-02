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
    const country = body["country"];

    if (!country || country.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a country"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE profile SET country=${country} WHERE userid=${userId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong updating your country"
            }
        )
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};