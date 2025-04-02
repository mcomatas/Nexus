'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function login(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');
    console.log(username, password);
}

export async function createUser(formData: FormData) {
    /*const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const password2 = formData.get('password2');
    console.log(username, email, password, password2);*/

    try {
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const password2 = formData.get('password2') as string;
        //console.log(username, email, password, password2);

        if (!username || !email || !password || !password2 ) {
            //console.log('error here');
            throw new Error("All fields required.");
        }

        if (password !== password2) {
            throw new Error("Paswords must match.");
        }

        //Hash password here

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password
            },
        });

        return { success: true, user };

    } catch (error) {
        return { success: false, message: error.message };
    }

}