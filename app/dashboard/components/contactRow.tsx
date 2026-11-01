import { Button, DateField, Form, Input, Label, Modal, Table, TextField, toast } from "@heroui/react";
import { SyntheticEvent } from "react";

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