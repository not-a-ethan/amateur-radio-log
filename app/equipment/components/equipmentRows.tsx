"use client";

import { Button, Form, Input, Label, Modal, Table, TextField, toast } from "@heroui/react";

import { EquipmentTable } from "@/utils/types";

export function EquipmentRow(props: any) {
    const name: string = props.name;
    const id: number = props.itemId;
    const amount: number = props.amount;
    const category: string = props.category;

    function editEquipment(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);

        const name: string|undefined|null = formData.get("name")?.toString();
        const category: string|undefined|null = formData.get("category")?.toString();
        const amount: number|undefined|null = Number(formData.get("amount")?.toString());

        if (!name || name.trim().length === 0) {
            toast("That is not a valid name", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!category || category.trim().length === 0) {
            toast("You need a valid category", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!amount || Number.isNaN(amount) || amount < 1) {
            toast("That is not a valid amount. If you set it to 0 delete the item instead", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/equipment", {
            method: "PUT",
            body: JSON.stringify({
                "id": id,
                "category": category,
                "name": name,
                "amount": amount
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong editing your equipment");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong editing equipment", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function deleteEquipment() {
        fetch("../api/equipment", {
            method: "DELETE",
            body: JSON.stringify({
                id: id
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error ("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong deleting your equipment", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    return (
        <Table.Row>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{category}</Table.Cell>
            <Table.Cell>{amount}</Table.Cell>
            <Table.Cell>
                <Modal>
                    <Button>Edit</Button>

                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog>
                                <Modal.CloseTrigger />

                                <Modal.Header>
                                    <Modal.Heading>Edit Equipment</Modal.Heading>
                                </Modal.Header>

                                <Modal.Body>
                                    <Form onSubmit={editEquipment}>
                                        <TextField isRequired defaultValue={name}>
                                            <Label htmlFor="name">Item name:</Label>
                                        
                                            <Input type="text" name="name" id="name" />
                                        </TextField>

                                        <TextField isRequired defaultValue={category}>
                                            <Label htmlFor="category">Item category:</Label>

                                            <Input type="text" name="category" id="category" />
                                        </TextField>

                                        <TextField isRequired defaultValue={amount.toString()}>
                                            <Label htmlFor="amount">Amount:</Label>

                                            <Input type="number" name="amount" id="amount" />
                                        </TextField>

                                        <Button type="submit">Edit Equipment</Button>
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
                                    <Modal.Heading>Delete Equipment</Modal.Heading>
                                </Modal.Header>

                                <Modal.Body>
                                    <Button onPress={deleteEquipment} variant="danger">ARE YOU SURE?</Button>
                                </Modal.Body>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            </Table.Cell>
        </Table.Row>
    )
};