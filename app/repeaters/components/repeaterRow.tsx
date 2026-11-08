"use client";

import { Button, Table } from "@heroui/react";

export function RepeaterRow(props: any) {
    const name = props["name"];
    const freq = props["freq"];
    const offset = props["offset"];
    const mode = props["mode"];
    
    return (
        <Table.Row>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{freq}</Table.Cell>
            <Table.Cell>{offset}</Table.Cell>
            <Table.Cell>{mode}</Table.Cell>
            <Table.Cell>[ACTIONS]</Table.Cell>
        </Table.Row>
    );
};