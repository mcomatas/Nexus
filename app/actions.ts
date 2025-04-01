'use server'

export async function login(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');
    console.log(username, password);
}

export async function createUser(formData: FormData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const password2 = formData.get('password2');
    console.log(username, email, password, password2);
}