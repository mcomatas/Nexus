import { login, createUser } from '../actions';

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
    return (
        <form
            action={createUser}
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
        </form>
    )
}