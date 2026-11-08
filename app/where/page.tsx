"use client";

import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import { fieldErrorVariants, Table, toast } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

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
        }

        const entries = [];

        for (let i = 0; i < repeaters.length; i++) {
            const freq = repeaters[i]["freq"];

            entries.push([freq, 0]);
        };

        const frequenciesObj = Object.fromEntries(entries);
        const frequencies = Object.keys(frequenciesObj);

        for (let i = 0; i < contacts.length; i++) {
            const thisFreq: string = contacts[i]["freq"].toString();

            if (frequencies.includes(thisFreq)) {
                frequenciesObj[frequencies[i]] = frequenciesObj[frequencies[i]] + 1;
            };
        };
    };

    useEffect(getData, []);
    useEffect(perRepeater, [contacts, repeaters]);

    return (
        <span>

        </span>
    );
};