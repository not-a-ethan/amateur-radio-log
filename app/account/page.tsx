"use client";

import { redirect } from "next/navigation";

import { Button, Form, Input, Label, TextField, toast } from "@heroui/react";

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

    function changeUsername(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const newUsername: string|undefined|null = data.get("username")?.toString();

        if (!newUsername || newUsername.trim().length === 0) {
            toast("That is not a valid username", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/account", {
            method: "PUT",
            body: JSON.stringify({
                "username": newUsername
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong changing username");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong changing your username", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function changeEmail(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const newEmail: string|undefined|null = data.get("email")?.toString();

        if (!newEmail || newEmail.trim().length === 0) {
            toast("That is not an email", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        authClient.changeEmail({
            newEmail: "new-email@email.com",
            callbackURL: "/dashboard", // to redirect after verification
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong trying to update your email", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function changePassword(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const oldPwd: string|undefined|null = data.get("oldPwd")?.toString();
        const newPwd: string|undefined|null = data.get("newPwd")?.toString();

        if (!oldPwd || oldPwd.length === 0) {
            toast("That is not a valid old password", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!newPwd || newPwd.length === 0) {
            toast("That is not a valid new password", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/account/password", {
            method: "PUT",
            body: JSON.stringify({
                oldPwd: oldPwd,
                newPwd: newPwd
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong changing password");
            };
        })
        .catch(e => {
            console.error(e);
            
            toast("Something went wrong changing password", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };
    
    function changeCountry(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const country: string|undefined = data.get("country")?.toString();

        if (!country || country.trim().length === 0) {
            toast("That is not a valid country", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/account/country", {
            method: "PUT",
            body: JSON.stringify({
                "country": country
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong changing your country");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong changing your country", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function changeCallSign(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const callSign: string|undefined = data.get("callSign")?.toString();

        if (!callSign || callSign.trim().length === 0) {
            toast("That is not a valid callsign", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/account/callSign", {
            method: "PUT",
            body: JSON.stringify({
                callSign: callSign
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok")
            };
        })
        .catch(e => {
            console.error(e);
        
            toast("Something went wrong changing your call sign", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    return (
        <>
            <h1>Account Page</h1>

            <h2>Change Username</h2>

            <Form onSubmit={changeUsername}>
                <TextField isRequired>
                    <Label htmlFor="username">New username:</Label>
                    <Input type="text" name="username" id="username" />
                </TextField>
            
                <Button type="submit" variant="primary">Change Username</Button>
            </Form>

            <h2>Change email</h2>
            
            <Form onSubmit={changeEmail}>
                <TextField isRequired>
                    <Label htmlFor="email">New Email:</Label>
                    <Input type="text" name="email" id="email" />
                </TextField>

                <Button type="submit" variant="primary">Change Email</Button>
            </Form>

            <h2>Change password</h2>

            <Form onSubmit={changePassword}>
                <TextField isRequired>
                    <Label htmlFor="oldPwd">Current Password:</Label>
                    <Input type="password" name="oldPwd" id="oldPwd" />
                </TextField>

                <TextField isRequired>
                    <Label htmlFor="newPwd">New Password:</Label>
                    <Input type="password" name="newPwd" id="newPwd" />
                </TextField>

                <Button type="submit" variant="primary">Change Password</Button>
            </Form>

            <h2>Change Country</h2>

            <Form onSubmit={changeCountry}>
                <TextField isRequired>
                    <Label htmlFor="country">Country:</Label>
                    <Input type="text" id="country" name="country" />
                </TextField>

                <Button type="submit" variant="primary">Change Country</Button>
            </Form>

            <h2>Change Call Sign</h2>

            <Form onSubmit={changeCallSign}>
                <TextField isRequired>
                    <Label htmlFor="callSign">Call Sign:</Label>
                    <Input type="text" id="callSign" name="callSign" />
                </TextField>

                <Button type="submit" variant="primary">Change Call Sign</Button>
            </Form>
        </>
    );
};