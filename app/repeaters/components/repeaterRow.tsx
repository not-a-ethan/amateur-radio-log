"use client";

import { Button, Form, Input, InputGroupInput, Label, Modal, Table, TextField, toast } from "@heroui/react";

export function RepeaterRow(props: any) {
    const name = props["name"];
    const freq = props["freq"];
    const offset = props["offset"];
    const mode = props["mode"];
    const id = props["id"];

    function editRepeater(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name: string|undefined = formData.get("name")?.toString();
        const freq: number = Number(formData.get("freq")?.toString());
        const offset: number = Number(formData.get("offset")?.toString());
        const mode: string|undefined = formData.get("mode")?.toString();

        fetch("../api/repeater", {
            method: "PUT",
            body: JSON.stringify({
                id: id,
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

            toast("Something went wrong editing repeater", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function deleteRepeater() {
        fetch("../api/repeater", {
            method: "DELETE",
            body: JSON.stringify({
                id: id
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Reponse is not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong deleting repeater", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };
    
    return (
        <Table.Row>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{freq}</Table.Cell>
            <Table.Cell>{offset}</Table.Cell>
            <Table.Cell>{mode}</Table.Cell>
            <Table.Cell>
                <Modal>
                    <Button>Edit</Button>

                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog>
                                <Modal.CloseTrigger />
                                
                                <Modal.Header>
                                    <Modal.Heading>Edit Repeater</Modal.Heading>
                                </Modal.Header>
                                
                                <Modal.Body>
                                    <Form onSubmit={editRepeater}>
                                        <TextField isRequired defaultValue={name}>
                                            <Label htmlFor="name">Name:</Label>
                                            <Input type="text" id="name" name="name" />
                                        </TextField>

                                        <TextField isRequired defaultValue={freq}>
                                            <Label htmlFor="freq">Frequency:</Label>
                                            <Input type="number" min={1} id="freq" name="freq" />
                                        </TextField>

                                        <TextField isRequired defaultValue={offset}>
                                            <Label htmlFor="offset">Offset:</Label>
                                            <Input type="number" name="offset" id="offset" />
                                        </TextField>

                                        <TextField isRequired defaultValue={mode}>
                                            <Label htmlFor="mode">Mode:</Label>
                                            <Input type="text" name="mode" id="mode" />
                                        </TextField>

                                        <Button type="submit">Edit Repeater</Button>
                                    </Form>
                                </Modal.Body>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>

                <Modal>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Delete Repeater</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <Button variant="danger" onPress={deleteRepeater}>Are you ABSOLUTLY SURE you want to delete this repeater?</Button>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal>
            </Table.Cell>
        </Table.Row>
    );
};