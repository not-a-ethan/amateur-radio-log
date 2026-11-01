"use client";

import { FormEvent } from 'react';

import { redirect } from 'next/navigation'

import { Button, Input , Label} from '@heroui/react';

import { authClient } from '@/lib/auth-client';

export default function Page() {    
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();
    
    if (session && !isPending) {
        redirect("/dashboard");
    };

    async function handleSignIn(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const formInputs = Object.fromEntries(formData);

        const username: string = formInputs["username"].toString();
        const password: string = formInputs["password"].toString();

        const { data, error } = await authClient.signIn.username({
            username: username,
            password: password
        });
    };
    
    return (
        <form onSubmit={handleSignIn}>
            <Label htmlFor='username'>Username:</Label>
            <Input type="text" placeholder='johnDoe' name='username' id='username' />

            <br />

            <Label htmlFor='password'>Password</Label>
            <Input type="password" placeholder='******' name='password' id='password' />

            <br />

            <Button type='submit'>Sign Up</Button>
        </form>
    );
};