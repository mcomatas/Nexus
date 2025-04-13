'use server'

import { prisma } from '../prisma'

export async function login(formData: FormData) {
    try {
        return { success: true, message: "Logged in" }
    } catch (error) {
        return { success: false, message: error.message }
    }
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

    } catch (error) {
        return { success: false, message: error.message };
    }

}