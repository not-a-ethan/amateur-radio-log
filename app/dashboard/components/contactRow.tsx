import { Table, TableCell } from "@heroui/react";

export function ContactRow(props: any) {

    const start = props["start"];
    const end = props["end"];
    const callSign = props["callSign"];
    const freq = props["freq"];
    const mode = props["mode"];
    const power = props["power"];
    const country = props["country"];
    const comments = props["comments"];

    return (
        <Table.Row>
            <TableCell>{start}</TableCell>
            <Table.Cell>{end}</Table.Cell>
            <Table.Cell>{callSign}</Table.Cell>
            <Table.Cell>{freq}</Table.Cell>
            <Table.Cell>{mode}</Table.Cell>
            <Table.Cell>{power}</Table.Cell>
            <Table.Cell>{country}</Table.Cell>
            <Table.Cell>{comments}</Table.Cell>
        </Table.Row>
    );
};