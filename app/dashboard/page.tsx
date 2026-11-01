"use client";

import { redirect } from "next/navigation";

import { useState, useEffect } from "react";

import { Card, Table, toast } from "@heroui/react";

import { authClient } from "@/lib/auth-client";
import { ContactRow } from "./components/contactRow";

export default function Page() {
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();

    if (!session && !isPending) {
        redirect("/signin");
    };

    const [contacts, setContacts] = useState([]);
    const [weekContacts, setWeekContacts] = useState(0);
    const [dxContacts, setDxContacts] = useState(0);

    function getContacts() {
        fetch("../api/contacts")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setContacts(json["allContacts"]);
            setWeekContacts(json["pastWeek"].length);
            setDxContacts(json["dxContacts"].length);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting contacts", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(getContacts, []);
    
    return (
        <>
            <h1>Dashboard</h1>

            <span className="grid">
                <Card className="col1">
                    <Card.Header>
                        <Card.Title>{contacts.length}</Card.Title>

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
                                    {contacts.map((contact: any) => (
                                        <ContactRow
                                            key={contact.id}
                                            start={contact.start}
                                            end={contact.end}
                                            callSign={contact.callsign}
                                            freq={contact.freq}
                                            mode={contact.mode}
                                            power={contact.power}
                                            country={contact.country}
                                            comments={contact.comments}
                                        />
                                    ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </span>
        </>
    );
};