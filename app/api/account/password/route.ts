import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";

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

    const body = await req.json();
    const oldPwd: string|undefined|null = body["oldPassword"];
    const newPwd: string|undefined|null = body["newPassword"];

    if (!oldPwd || oldPwd.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid old password"
            },
            { status: 400 }
        );
    };

    if (!newPwd || newPwd.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid new password"
            },
            { status: 400 }
        );
    };

    try {
        const data = await auth.api.changePassword({
            body: {
                newPassword: newPwd,
                currentPassword: oldPwd,
                revokeOtherSessions: true
            },
            headers: await headers()
        });
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong changing password"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};