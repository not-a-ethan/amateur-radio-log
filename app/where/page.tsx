"use client";

import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import { Table, toast } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

import { RepeaterContacts } from "./components/repeater";

import styles from "./where.module.css";

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

    const [contacts, setContacts]: any = useState([]);
    const [repeaters, setRepeaters] = useState([]);
    const [list, setList] = useState<string[]>([]);
    const [fullList, setFullList] = useState<any>({});


    function getData() {
        fetch("../api/repeaters")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
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

        fetch("../api/contacts")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        
            return res.json();
        })
        .then(json => {
            setContacts(json["allContacts"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting contacts", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function perRepeater() {
        if (contacts.length === 0 || repeaters.length === 0) {
            return;
        };

        const entries = [];

        for (let i = 0; i < repeaters.length; i++) {
            const freq = repeaters[i]["freq"];

            entries.push([freq, 0]);
        };

        const frequenciesObj = Object.fromEntries(entries);
        const frequencies = Object.keys(frequenciesObj);

        for (let i = 0; i < frequencies.length; i++) {
            frequenciesObj[frequencies[i]] = { "amount": 0, "contacts": [] };
        };
        
        for (let i = 0; i < contacts.length; i++) {
            const thisFreq: string = contacts[i]["freq"].toString();

            if (frequencies.includes(thisFreq)) {
                frequenciesObj[frequencies[i]].amount = frequenciesObj[frequencies[i]]["amount"] + 1;
                frequenciesObj[frequencies[i]].contacts.push(contacts[i]);
            };
        };

        setList(Object.keys(frequenciesObj));
        setFullList(frequenciesObj);
    };

    useEffect(getData, []);
    useEffect(perRepeater, [contacts, repeaters]);

    return (
        <span className={`${styles.page}`}>
            <h1>Contacts per repeater</h1>

            <p>If nothing loads that means you either dont have any contacts and/or you dont have any repeaters</p>

            <Table>
                <Table.ScrollContainer>
                    <Table.Content aria-label="Contacts per repeater">
                        <Table.Header>
                            <Table.Column isRowHeader>Name</Table.Column>
                            <Table.Column>Frequency</Table.Column>
                            <Table.Column>Mode(s)</Table.Column>
                            <Table.Column>Contacts</Table.Column>
                        </Table.Header>

                        <Table.Body>
                            {list.map((thisRepeater: string) => (
                                <RepeaterContacts
                                    key={thisRepeater}
                                    contacts={fullList[thisRepeater]["contacts"]}
                                    repeaters={repeaters}
                                    thisRepeater={thisRepeater}
                                />
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </span>
    );
};