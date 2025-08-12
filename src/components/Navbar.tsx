'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="px-4 py-2  shadow-md bg-neutral-950 text-white">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <a href="/" className="text-xl font-bold mb-4 sm:mb-0">
          Trueself
        </a>
        {session ? (
          <>

            <Button className="w-full sm:w-auto bg-slate-100 text-black"
              variant='outline'
              onClick={() => signOut()} >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full sm:w-auto bg-slate-100 text-black"
              variant={'outline'}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar