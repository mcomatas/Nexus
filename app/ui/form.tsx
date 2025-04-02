'use client'

import { login, createUser } from '../actions';
import { useState } from 'react';

const FormInput = ({placeholder, type, name}) => {
    return (
        <input
            placeholder={placeholder}
            type={type}
            name={name}
            className="bg-gray-100 text-gray-700 rounded-sm p-1 w-1/2 min-w-45 mx-auto"
        />
    )
}

export function LoginForm() {
    return (
        <form
            action={login}
            className="flex flex-col p-10 space-y-10"
        >
            <FormInput placeholder="Username" type="text" name="username" />
            <FormInput placeholder="Password" type="password" name="password" />
            <input
                type="submit"
                value="Login"
                className="bg-fuchsia-200  text-gray-800 w-30 mx-auto rounded-md"
            />
        </form>
    )
}

export function SignUpForm() {
    const [message, setMessage] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Stops page from refresing and allows form submission asynchronously
        const formData = new FormData(event.currentTarget);

        const response = await createUser(formData);
        console.log(response);
        if (response.success) {
            setMessage("User created successfully");
        } else {
            setMessage(`Error: ${response.message}`);
        }
    }
    
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col p-10 space-y-10"
        >
            <FormInput placeholder="Username" type="text" name="username" />
            <FormInput placeholder="Email" type="email" name="email" />
            <FormInput placeholder="Password" type="password" name="password" />
            <FormInput placeholder="Verify Password" type="password" name="password2" />
            <input
                type="submit"
                value="Sign Up"
                className="bg-fuchsia-200 text-gray-800 w-30 mx-auto rounded-md"
            />
            {message && <p>{message}</p>}
        </form>
    )
}