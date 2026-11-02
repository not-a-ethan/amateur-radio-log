import { CalendarDateTime } from '@internationalized/date';

import { Button, DateField, Form, Input, Label, Modal, Table, TextField, toast } from "@heroui/react";

export function ContactRow(props: any) {

    const start = props["start"];
    const end = props["end"];
    const callSign = props["callSign"];
    const freq = props["freq"];
    const mode = props["mode"];
    const power = props["power"];
    const country = props["country"];
    const comments = props["comments"];

    function deleteContact(e: any) {
        fetch("../api/contacts", {
            method: "DELETE",
            body: JSON.stringify({
                "contactId": props["contactId"]
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong deleting contact");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong deleting the contact", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function editContact(e: React.SyntheticEvent<HTMLFormElement>) {
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
            method: "PUT",
            body: JSON.stringify({
                contactId: props["contactId"],
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
                throw new Error("Something went wrong editing contact");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong editing contact", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    return (
        <Table.Row>
            <Table.Cell>{start}</Table.Cell>
            <Table.Cell>{end}</Table.Cell>
            <Table.Cell>{callSign}</Table.Cell>
            <Table.Cell>{freq}</Table.Cell>
            <Table.Cell>{mode}</Table.Cell>
            <Table.Cell>{power}</Table.Cell>
            <Table.Cell>{country}</Table.Cell>
            <Table.Cell>{comments}</Table.Cell>
            <Table.Cell>
                <Modal>
                    <Button>Edit</Button>

                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog>
                                <Modal.CloseTrigger />
                                <Modal.Header>
                                    <Modal.Heading>Add a Contact</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={editContact}>
                                        <DateField granularity="minute" name="start" id="start" isRequired defaultValue={new CalendarDateTime(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate(), new Date(start).getHours(), new Date(start).getMinutes())}>
                                            <Label>Start</Label>
                                            <DateField.Group>
                                                <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                            </DateField.Group>
                                        </DateField>

                                        <br />

                                        <DateField granularity="minute" name="end" id="end" isRequired defaultValue={new CalendarDateTime(new Date(end).getFullYear(), new Date(end).getMonth(), new Date(end).getDate(), new Date(end).getHours(), new Date(end).getMinutes())}>
                                            <Label>End</Label>
                                            <DateField.Group>
                                                <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                            </DateField.Group>
                                        </DateField>

                                        <br />

                                        <TextField isRequired defaultValue={callSign}>
                                            <Label htmlFor="callsign">Call Sign</Label>
                                            <Input type="text" id="callsign" name="callsign" />
                                        </TextField>

                                        <br />

                                        <TextField isRequired defaultValue={freq}>
                                            <Label htmlFor="freq">Frequency</Label>
                                            <Input id="freq" name="freq" type="number" min={1} />
                                        </TextField>

                                        <br />

                                        <TextField isRequired defaultValue={mode}>
                                            <Label htmlFor="mode">Mode</Label>
                                            <Input id="mode" name="mode" type="text" />
                                        </TextField>

                                        <br />

                                        <TextField isRequired defaultValue={power}>
                                            <Label htmlFor="power">Power (W)</Label>
                                            <Input id="power" name="power" type="number" min={0} />
                                        </TextField>

                                        <br />

                                        <TextField isRequired defaultValue={country}>
                                            <Label htmlFor="country">Country of contact</Label>
                                            <Input id="country" name="country" type="text" />
                                        </TextField>

                                        <br />

                                        <TextField defaultValue={comments}>
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

                <Modal>
                    <Button variant="danger">Delete</Button>

                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog>
                                <Modal.CloseTrigger />
                                <Modal.Header>
                                    <Modal.Heading>Delete contact</Modal.Heading>
                                </Modal.Header>

                                <Modal.Body>
                                    Are you ABSOLULTY SURE you want to delete this contact?

                                    <Button variant="danger" onPress={deleteContact}>DELETE CONTACT</Button>
                                </Modal.Body>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            </Table.Cell>
        </Table.Row>
    );
};