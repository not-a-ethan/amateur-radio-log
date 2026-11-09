import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";
import { sql } from "@/utils/sql";

import { EquipmentTable } from "@/utils/types";
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES, use } from "react";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    try {
        const equipment: EquipmentTable[] = await sql`SELECT * FROM equipment WHERE userid=${userId};`;

        return NextResponse.json(
            {
                "equipment": equipment
            },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting your equipment"
            },
            { status: 500 }
        );
    };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

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

    const category: string|undefined|null = body["category"];
    const name: string|undefined|null = body["name"];
    const amount: number|undefined|null = body["amount"];

    if (!category || category.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a category"
            },
            { status: 400 }
        );
    };

    if (!name || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a name"
            },
            { status: 400 }
        );
    };

    if (!amount || Number.isNaN(amount) || amount < 1) {
        return NextResponse.json(
            {
                "error": "That is nto a valid amount"
            },
            { status: 400 }
        );
    };

    try {
        await sql`INSERT INTO equipment (category, name, quantity, userid) VALUES (${category}, ${name}, ${amount}, ${userId});`;
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong adding equipment"
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
    const session = await auth.api.getSession({ headers: await headers() });

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

    const id: number|undefined|null = body["id"];
    const category: string|undefined|null = body["category"];
    const name: string|undefined|null = body["name"];
    const amount: number|undefined|null = body["amount"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "You need a valid id"
            },
            { status: 400 }
        );
    };

    try {
        const equipment: EquipmentTable[] = await sql`SELECT * FROM equipment WHERE id=${id} AND userid=${userId};`;

        if (equipment.length === 0) {
            return NextResponse.json(
                {
                    "error": "That entry does not exist or you do not own it"
                },
                { status: 404 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong checking equipment"
            },
            { status: 500 }
        );
    };

    if (category && category.trim().length !== 0) {
        try {
            await sql`UPDATE equipment SET category=${category} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing category"
                }
            )
        };
    };

    if (name && name.trim().length !== 0) {
        try {
            await sql`UPDATE equipment SET name=${name} WHERE id=${id} AND userid=${userId};`;
        } catch (e){
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing name"
                },
                { status: 500 }
            );
        };
    };

    if (amount && !Number.isNaN(amount) && amount > 0) {
        try {
            await sql`UPDATE equipment SET quanity=${amount} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating the amount"
                },
                { status: 500 }
            );
        };
    } else if (amount && !Number.isNaN(amount) && amount < 1) {
        return NextResponse.json(
            {
                "error": "You cant have an amount less than 1. If you dont have it any more you can delete this entry"
            },
            { status: 400 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

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
    const id: number|undefined|null = body["id"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "That is not a valid id"
            },
            { status: 400 }
        );
    };

    try {
        const entry: EquipmentTable[] = await sql`SELECT * FROM equipment WHERE id=${id} AND userId=${userId};`;

        if (entry.length !== 1) {
            return NextResponse.json(
                {
                    "error": "That entry does not exist or it is not yours"
                },
                { status: 404 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting entry data"
            },
            { status: 500 }
        );
    };

    try {
        await sql`DELETE FROM equipment WHERE id=${id} AND userid=${userId};`;
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong deleting entry"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};