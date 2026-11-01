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
    const contactId: number|undefined|null = body["contactId"];
    const start: number|undefined|null = body["start"];
    const end: number|undefined|null = body["end"];
    const callSign: string|undefined|null = body["callSign"];
    const freq: number|undefined|null = body["freq"];
    const mode: string|undefined|null = body["mode"];
    const power: number|undefined|null = body["power"];
    const country: string|undefined|null = body["country"];
    const comments: string|undefined|null = body["comments"];

    if (!contactId || Number.isNaN(contactId) || contactId <= 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid contact id"
            },
            { status: 400 }
        );
    };

    let contactInfo;
    
    try {
        contactInfo = await sql`SELECT * FROM contacts WHERE id=${contactId} AND userid=${userId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting contact info"
            },
            { status: 500 }
        );
    };

    if (!contactInfo || contactInfo.length === 0) {
        return NextResponse.json(
            {
                "error": "That contact does not exist or it is not yours"
            },
            { status: 404 }
        );
    };
    
    // Changes each value on at a time
    if (start && !Number.isNaN(start) && start > 0) {
        try {
            await sql`UPDATE contacts SET startdate=${start} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing start date"
                },
                { status: 500 }
            );
        };
    };

    if (end && !Number.isNaN(end) && end > 0) {
        try {
            await sql`UPDATE contacts SET enddate=${end} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            return NextResponse.json(
                {
                    "error": "Something went wrong updating end date"
                },
                { status: 500 }
            );
        };
    };

    if (callSign && callSign.trim().length !== 0) {
        try {
            await sql`UPDATE contacts SET callsign=${callSign} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating the callsign"
                },
                { status: 500 }
            );
        };
    };

    if (freq && !Number.isNaN(freq) && freq > 0) {
        try {
            await sql`UPDATE contacts SET freq=${freq} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Somethign went wrong updating frequncy"
                },
                { status: 500 }
            );
        };
    };

    if (mode && mode.trim().length !== 0) {
        try {
            await sql`UPDATE contacts SET mode=${mode} WHERE userid=${userId} AND id=${contactId};`;
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

    if (power && !Number.isNaN(power) && power > 0) {
        try {
            await sql`UPDATE contacts SET power=${power} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wront changing power"
                },
                { status: 500 }
            );
        };
    };

    if (country && country.trim().length !== 0) {
        try {
            await sql`UPDATE contacts SET country=${country} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating the country"
                },
                { status: 500 }
            );
        };
    };

    if (comments) {
        try {
            await sql`UPDATE contacts SET comments=${comments} WHERE userid=${userId} AND id=${contactId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating comment"
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