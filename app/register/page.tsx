import { SignUpForm } from "../ui/form"

export default function Page() {
    return (
        <div>
            <div className="flex flex-col justify-center bg-zinc-700 w-1/2 mx-auto mt-20 rounded-md p-5">
                <h1 className="font-bold">Sign Up</h1>
                <SignUpForm />
            </div>
        </div>
    )
}