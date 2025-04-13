//import { LoginForm } from "../ui/form";
import { SignIn } from '../ui/form';
import Link from 'next/link';

const FormInput = ({placeholder, type}) => {
    return (
        <input
            placeholder={placeholder}
            type={type}
            className=" bg-gray-100 text-gray-700 rounded-sm p-1 w-1/2 min-w-45 mx-auto"
        />
    )
}

export default function Page() {
    return (
        <div>
            <h1 className="text-3xl w-3/5 mx-auto">Welcome back!</h1>
            <div className="flex flex-col justify-center bg-zinc-700 w-1/2 mx-auto mt-20 rounded-md p-5">
                <h1 className="font-bold">Login</h1>
                <SignIn />
                {/*<p
                    className="text-xs mx-auto"
                >
                    Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Sign up</Link>
                </p>*/}
            </div>
        </div>
    )
}