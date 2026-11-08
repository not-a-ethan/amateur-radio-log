"use client";

import { redirect } from "next/navigation";

import { useState, useEffect } from "react";

import { Button, Form, Input, Label, Modal, Table, TextField, toast } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

import { RepeaterRow } from "./components/repeaterRow";

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

    const [repeaters, setRepeaters] = useState([]);

    function getRepeaters() {
        fetch("../api/repeaters")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok")
            };

            return res.json();
        })
        .then(json => {
            setRepeaters(json["repeaters"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting repeaters", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function addRepeater(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name: string|undefined = formData.get("name")?.toString();
        const freq: number = Number(formData.get("freq")?.toString());
        const offset: number = Number(formData.get("offset")?.toString());
        const mode: string|undefined = formData.get("mode")?.toString();

        if (!name || name.trim().length === 0) {
            toast("That is not a valid name", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!freq || Number.isNaN(freq) || freq < 1) {
            toast("That is not a valid frequency", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!offset || Number.isNaN(offset) || offset === 0) {
            toast("That is not a valid offset", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!mode || mode.trim().length === 0) {
            toast("That is not a valid mode", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/repeaters", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                freq: freq,
                offset: offset,
                mode: mode
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong adding repeater", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(getRepeaters, []);

    return (
        <span>
            <h1>Repeaters</h1>

            <Table>
                <Table.ScrollContainer>
                    <Table.Content aria-label="List of Repeaters">
                        <Table.Header>
                            <Table.Column isRowHeader>Name</Table.Column>
                            <Table.Column>Freq</Table.Column>
                            <Table.Column>Offset</Table.Column>
                            <Table.Column>Mode</Table.Column>
                            <Table.Column>Actions</Table.Column>

                        </Table.Header>

                        <Table.Body>
                            {repeaters.map((repeater: any) => (
                                <RepeaterRow
                                    key={repeater.id}
                                    name={repeater.name}
                                    freq={repeater.freq}
                                    offset={repeater.offset}
                                    mode={repeater.mode}
                                    id={repeater.id}
                                />
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

            <Modal>
                <Button>Add Repeater</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                        
                            <Modal.Header>
                                <Modal.Heading>Add Repeater</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                <Form onSubmit={addRepeater}>
                                    <TextField isRequired>
                                        <Label htmlFor="name">Name:</Label>
                                        <Input type="text" id="name" name="name" />
                                    </TextField>

                                    <TextField isRequired>
                                        <Label htmlFor="freq">Frequency:</Label>
                                        <Input type="number" min={1} id="freq" name="freq" />
                                    </TextField>

                                    <TextField isRequired>
                                        <Label htmlFor="offset">Offset:</Label>
                                        <Input type="number" name="offset" id="offset" />
                                    </TextField>

                                    <TextField isRequired>
                                        <Label htmlFor="mode">Mode:</Label>
                                        <Input type="text" name="mode" id="mode" />
                                    </TextField>

                                    <Button type="submit">Add Repeater</Button>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </span>
    );
};