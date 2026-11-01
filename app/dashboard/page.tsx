"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { Card, Table } from "@heroui/react";

import { authClient } from "@/lib/auth-client";
import { ContactRow } from "./components/contactRow";

export default function Page() {
    const router = useRouter();

    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();

    if (!session && !isPending) {
        router.replace("/signin");
    };

    const [numContacts, setNumContacts] = useState(0);
    const [weekContacts, setWeekContacts] = useState(0);
    const [dxContacts, setDxContacts] = useState(0);
    
    return (
        <>
            <h1>Dashboard</h1>

            <span className="grid">
                <Card className="col1">
                    <Card.Header>
                        <Card.Title>{numContacts}</Card.Title>

                        <Card.Description>
                            # of total contacts
                        </Card.Description>
                    </Card.Header>
                </Card>

                <Card className="col2">
                    <Card.Header>
                        <Card.Title>{weekContacts}</Card.Title>

                        <Card.Description>
                            # of contacts in the past 7 days
                        </Card.Description>
                    </Card.Header>
                </Card>

                <Card className="col3">
                    <Card.Header>
                        <Card.Title>{dxContacts}</Card.Title>

                        <Card.Description>
                            # of <abbr title="Distance aka Out of countries">DX</abbr> contacts
                        </Card.Description>
                    </Card.Header>
                </Card>
            </span>

            <span>
                <h2>Recent Contacts</h2>

                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Recent Contacts">
                            <Table.Header>
                                <Table.Column isRowHeader>Date/Time Start</Table.Column>
                                <Table.Column>Date/Time End</Table.Column>
                                <Table.Column>Call Sign</Table.Column>
                                <Table.Column>Frequancy</Table.Column>
                                <Table.Column>Mode</Table.Column>
                                <Table.Column>Power</Table.Column>
                                <Table.Column>Country</Table.Column>
                                <Table.Column>Comments</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                    <ContactRow 
                                        start="Some start date"
                                        end="Some end date"
                                        callSign="I didnt know a sign can call"
                                        freq="123456789"
                                        mode="FM"
                                        power="5W"
                                        country="United States"
                                        comments=""
                                    />
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </span>
        </>
    );
};