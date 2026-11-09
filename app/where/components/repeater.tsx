"use client";

import { Button, Modal, Table } from "@heroui/react";

import { ContactRow } from "@/app/dashboard/components/contactRow";

export function RepeaterContacts(props: any) {
    const repeaters = props["repeaters"];
    const contacts = props["contacts"];
    const thisRepeaterFreq = props["thisRepeater"];

    let repeater;

    for (let i = 0; i < repeaters.length; i++) {
        if (Number(repeaters[i].freq) === Number(thisRepeaterFreq)) {
            repeater = repeaters[i];
        };
    };

    if (!repeater) {
        return <></>;
    };

    return (
        <Table.Row>
            <Table.Cell>{repeater.name}</Table.Cell>
            <Table.Cell>{repeater.freq}</Table.Cell>
            <Table.Cell>{repeater.mode}</Table.Cell>
            <Table.Cell>
                {contacts.length}

                <Modal>
                    <Button>View All</Button>

                    <Modal.Backdrop>
                        <Modal.Container size="cover">
                            <Modal.Dialog>
                                <Modal.CloseTrigger />
                                <Modal.Header>
                                    <Modal.Heading>Contacts on this repeater</Modal.Heading>
                                </Modal.Header>

                                <Modal.Body>
                                    <Table>
                                        <Table.ScrollContainer>
                                            <Table.Content aria-label="Recent Contacts">
                                                <Table.Header>
                                                    <Table.Column isRowHeader>Start</Table.Column>
                                                    <Table.Column>End</Table.Column>
                                                    <Table.Column>Call Sign</Table.Column>
                                                    <Table.Column>Frequency</Table.Column>
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
                                </Modal.Body>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            </Table.Cell>
        </Table.Row>
    );
};