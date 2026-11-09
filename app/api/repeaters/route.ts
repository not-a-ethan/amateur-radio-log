import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";
import { sql } from "@/utils/sql";

import { RepeatersTable } from "@/utils/types";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    try {
        const repeaters: RepeatersTable[] = await sql`SELECT * FROM repeaters WHERE userid=${userId};`;

        return NextResponse.json(
            {
                repeaters: repeaters
            },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting your contacts"
            },
            { status: 500 }
        );
    };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body: any = await req.json();

    const name: string|undefined|null = body["name"];
    const freq: number|undefined|null = body["freq"];
    const offset: number|undefined|null = body["offset"];
    const mode: string|undefined|null = body["mode"];

    if(!name || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error":" The repeater needs a name"
            },
            { status: 400 }
        );
    };

    if (!freq || Number.isNaN(freq) || !(freq > 0)) {
        return NextResponse.json(
            {
                "error": "You cant transmit on vibes"
            },
            { status: 400 }
        );
    };

    if (!offset || Number.isNaN(offset) || offset === 0) {
        return NextResponse.json(
            {
                "error": "You need an offset"
            },
            { status: 400 }
        );
    };

    if (!mode || mode.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a mode"
            },
            { status: 400 }
        );
    };

    try {
        await sql`INSERT INTO repeaters (name, freq, "offset", mode, userid) VALUES (${name.trim()}, ${freq}, ${offset}, ${mode.trim()}, ${userId});`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong adding repeater"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body = await req.json();

    const id: number|undefined|null = body["id"];
    const name: string|undefined|null = body["name"];
    const freq: number|undefined|null = body["freq"];
    const offset: number|undefined|null = body["offset"];
    const mode: string|undefined|null = body["mode"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "That is not a valid id"
            },
            { status: 400 }
        );
    };

    try {
        const repeater: RepeatersTable[] = await sql`SELECT * FROM repeaters WHERE userid=${userId} AND id=${id};`;

        if (repeater.length === 0) {
            return NextResponse.json(
                {
                    "error": "That repeaters does not exist or it is not yours"
                },
                { status: 404 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting repeater info"
            },
            { status: 500 }
        );
    };

    if (name && name.trim().length > 0) {
        try {
            await sql`UPDATE repeaters SET name=${name} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating repeater name"
                },
                { status: 500 }
            );
        };
    };

    if (freq && !Number.isNaN(freq) && freq > 0) {
        try {
            await sql`UPDATE repeaters SET freq=${freq} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating frequency"
                },
                { status: 500 }
            );
        };
    };

    if (offset && !Number.isNaN(offset) && offset !== 0) {
        try {
            await sql`UPDATE repeaters SET "offset"=${offset} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something wrnt wrong updating the offset"
                },
                { status: 500 }
            );
        };
    };

    if (mode && mode.trim().length > 0) {
        try {
            await sql`UPDATE repeaters SET mode=${mode} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating mode"
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

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body = await req.json();

    const id: number|undefined|null = body["id"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "You need a valid repeater ID"
            },
            { status: 400 }
        );
    };

    try {
        await sql`DELETE FROM repeaters WHERE userid=${userId} AND id=${id};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong deleting repeater"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};