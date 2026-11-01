"use client";

import { redirect } from "next/navigation";

import { useState, useEffect } from "react";

import { Button, Card, DateField, Form, Input, Label, Modal, Table, TextField, toast } from "@heroui/react";

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

    function createContact(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        
        const start: string|undefined = formData.get("start")?.toString();
        const end: string|undefined = formData.get("end")?.toString();
        const callSign: string|undefined = formData.get("callsign")?.toString();
        const freq: number = Number(formData.get("freq")?.toString());
        const mode: string|undefined = formData.get("mode")?.toString();
        const power: number = Number(formData.get("power")?.toString());
        const country: string|undefined = formData.get("country")?.toString();
        const comments: string|undefined = formData.get("comment")?.toString();

        let error = false;

        if (!start || start.trim().length === 0) {
            toast("The start value must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });

            error = true;
        };

        if (!end || end.trim().length === 0) {
            toast("The end value must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });

            error = true;
        };

        if (!callSign || callSign.trim().length === 0) {
            toast("The callsign must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });

            error = true;
        };

        if (Number.isNaN(freq) || freq <= 0) {
            toast("Frequency must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });

            error = true;
        };

        if (!mode || mode.trim().length === 0) {
            toast("Mode must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });
            
            error = true;
        };

        if (Number.isNaN(power) || power <= 0) {
            toast("Power must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });

            error = true;
        };

        if (!country || country.trim().length === 0) {
            toast("Country must be valid", {
                actionProps: {
                    variant: "danger"
                }
            });

            error = true;
        };

        if (error) {
            return;
        };

        fetch("../api/contacts", {
            method: "POST",
            body: JSON.stringify({
                start: Math.floor(new Date(start || "").getTime() / 1000),
                end: Math.floor(new Date(end || "").getTime() / 1000),
                callSign: callSign,
                freq: freq,
                mode: mode,
                power: power,
                country: country,
                comments: comments
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong logging contact");
            };

            return;
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong logging contact", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };
    
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
                                <Table.Column>Actions</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                    {contacts.map((contact: any) => (
                                        <ContactRow
                                            key={contact.id}
                                            start={new Date(contact.startdate * 1000).toLocaleString()}
                                            end={new Date(contact.enddate * 1000).toLocaleString()}
                                            callSign={contact.callsign}
                                            freq={contact.freq}
                                            mode={contact.mode}
                                            power={contact.power}
                                            country={contact.country}
                                            comments={contact.comments}
                                            contactId={contact.id}
                                        />
                                    ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </span>

            <Modal>
                <Button>Add Contact</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Add a Contact</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={createContact}>
                                    <DateField granularity="minute" name="start" id="start" isRequired>
                                        <Label>Start</Label>
                                        <DateField.Group>
                                            <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                        </DateField.Group>
                                    </DateField>

                                    <br />

                                    <DateField granularity="minute" name="end" id="end" isRequired>
                                        <Label>End</Label>
                                        <DateField.Group>
                                            <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                        </DateField.Group>
                                    </DateField>

                                    <br />

                                    <TextField isRequired>
                                        <Label htmlFor="callsign">Call Sign</Label>
                                        <Input type="text" id="callsign" name="callsign" />
                                    </TextField>

                                    <br />

                                    <TextField isRequired>
                                        <Label htmlFor="freq">Frequency</Label>
                                        <Input id="freq" name="freq" type="number" min={1} />
                                    </TextField>

                                    <br />

                                    <TextField isRequired>
                                        <Label htmlFor="mode">Mode</Label>
                                        <Input id="mode" name="mode" type="text" />
                                    </TextField>

                                    <br />

                                    <TextField isRequired>
                                        <Label htmlFor="power">Power (W)</Label>
                                        <Input id="power" name="power" type="number" min={0} />
                                    </TextField>

                                    <br />

                                    <TextField isRequired>
                                        <Label htmlFor="country">Country of contact</Label>
                                        <Input id="country" name="country" type="text" />
                                    </TextField>

                                    <br />

                                    <TextField>
                                        <Label htmlFor="comment">Comments</Label>
                                        <Input id="comment" name="comment" type="text" />
                                    </TextField>

                                    <br />

                                    <Button type="submit">Add Contact</Button>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    );
};