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

    function addRepeater() {

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
                                />
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </span>
    )
};