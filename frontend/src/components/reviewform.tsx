import { User } from "@/lib/types"
import Link from "next/link"

export const ReviewForm = ({ user }: { user: User }) => {
  console.log(user);

  return (
    <div>
      {user ?
        <div>
          Rate
        </div>
        :
        <Link
          className="text-md whitespace-nowrap cursor-pointer"
          href="/login"
        >
          Sign up / login to rate
        </Link>
      }
    </div>
  )
}
