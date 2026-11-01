import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";
import { sql } from "@/utils/sql";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        )
    };

    const userId: string = session["session"]["userId"];
    let userCountry: string;

    try {
        const userData = await sql`SELECT country FROM profile WHERE userid = ${userId};`;
        userCountry = userData[0]["country"];
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting your user data"
            },
            { status: 500 }
        );
    };

    const currentTime: number = Math.floor(Date.now()/1000);
    let allContacts;
    let weekContacts;
    let dxContacts;

    try {
        allContacts = await sql`SELECT * FROM contacts WHERE userid=${userId};`;
        weekContacts = await sql`SELECT * FROM contacts WHERE enddate > ${currentTime};`;
        dxContacts = await sql`SELECT * FROM contacts WHERE NOT country = ${userCountry};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting your contacts"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {
            "allContacts": allContacts,
            "pastWeek": weekContacts,
            "dxContacts": dxContacts
        },
        { status: 200 }
    );
};

export async function POST(req: NextRequest): Promise<NextResponse> {
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

    const body: any = await req.json();

    const start: number|undefined|null = body["start"];
    const end: number|undefined|null = body["end"];
    const callSign: string|undefined|null = body["callSign"];
    const freq: number|undefined|null = body["freq"];
    const mode: string|undefined|null = body["mode"];
    const power: number|undefined|null = body["power"];
    const country: string|undefined|null = body["country"];
    const comments: string|undefined|null = body["comments"];

    if (!start || Number.isNaN(start) || start <= 0) {
        return NextResponse.json(
            {
                "error": "Start time is not valid"
            },
            { status: 400 }
        );
    };

    if (!end || Number.isNaN(end) || end <= 0) {
        return NextResponse.json(
            {
                "error": "End time is not valid"
            },
            { status: 400 }
        );
    };

    if (!callSign || callSign.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Callsign is not valid"
            },
            { status: 400 }
        );
    };

    if (!freq || Number.isNaN(freq) || freq <= 0) {
        return NextResponse.json(
            {
                "error": "Frequency is not valid"
            },
            { status: 400 }
        );
    };

    if (!mode || mode.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Mode is not valid"
            },
            { status: 400 }
        );
    };

    if (!power || Number.isNaN(power) || power <= 0) {
        return NextResponse.json(
            {
                "error": "Power is not valid"
            },
            { status: 400 }
        );
    };

    if (!country || country.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Country is not valid"
            },
            { status: 400 } 
        );
    };

    try {
        await sql`INSERT INTO contacts (startdate, enddate, callsign, freq, mode, power, country, comments, userid) VALUES (${start}, ${end}, ${callSign}, ${freq}, ${mode}, ${power}, ${country}, ${comments || ""}, ${userId});`;
    } catch (e) {
        console.error(e);
    
        return NextResponse.json(
            {
                "error": "Something went wrong adding contact"
            },
            { status: 500 }
        );
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
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body = await req.json();
    const contactId: number|undefined|null = body["contactId"];

    if (!contactId || Number.isNaN(contactId) || contactId <= 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid contact ID"
            },
            { status: 400 }
        );
    };

    let contactDetails;

    try {
        contactDetails = await sql`SELECT * FROM contacts WHERE id=${contactId} AND userid = ${userId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting contact details"
            },
            { status: 500 }
        );
    };

    if (contactDetails.length <= 0) {
        return NextResponse.json(
            {
                "error": "That contact does not exist or it is not yours"
            },
            { status: 404 }
        );
    };

    try {
        await sql`DELETE FROM contacts WHERE userid=${userId} AND id=${contactId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "something went wrong deleting contact"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};