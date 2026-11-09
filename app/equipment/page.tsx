"use client";

import { redirect } from "next/navigation";

import React, { useState, useEffect } from "react";

import { Button, Form, Input, Label, Modal, Table, TextField, toast } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

import { EquipmentRow } from "./components/equipmentRows";

import { EquipmentTable } from "@/utils/types";

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

    const [equipment, setEquipment] = useState<EquipmentTable[]>([]);

    function getEquipment() {
        fetch("../api/equipment")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setEquipment(json["equipment"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting your equipment", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(getEquipment, []);

    function createEquipment(e: React.SyntheticEvent<HTMLFormElement>) {
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
            method: "POST",
            body: JSON.stringify({
                name: name,
                category: category,
                amount: amount
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong adding equipment", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    return (
        <span>
            <h1>Equipment</h1>

            <Table>
                <Table.ScrollContainer>
                    <Table.Content aria-label="Equipment you have">
                        <Table.Header>
                            <Table.Column isRowHeader>What</Table.Column>
                            <Table.Column>Category</Table.Column>
                            <Table.Column>Amount</Table.Column>
                            <Table.Column>Actions</Table.Column>
                        </Table.Header>

                        <Table.Body>
                            {equipment.map((item: EquipmentTable) => (
                                <EquipmentRow item={item} />
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

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
                                <Form onSubmit={createEquipment}>
                                    <TextField isRequired>
                                        <Label htmlFor="name">Item name:</Label>
                                    
                                        <Input type="text" name="name" id="name" />
                                    </TextField>

                                    <TextField isRequired>
                                        <Label htmlFor="category">Item category:</Label>

                                        <Input type="text" name="category" id="category" />
                                    </TextField>

                                    <TextField isRequired>
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
        </span>
    );
};