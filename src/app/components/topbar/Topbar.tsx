"use client";

import Link from "next/link"
import Image from "next/image";
import { auth } from "@/app/firebase/firebase"
import { useSetRecoilState } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth"
import { authModalState } from "@/app/atoms/authModalAtom";
import LogoutButton from "../buttons/LogoutButton";
import {FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../timer/Timer";
import { useParams, useRouter } from "next/navigation";
import { problems } from "@/app/utils/problems";

type TopbarProps = {
  problemPage?: boolean
}

const Topbar = ({problemPage}: TopbarProps) => {
  const [user] = useAuthState(auth);// Get the current login user
  const setAuthModalState = useSetRecoilState(authModalState);// Get setRecoilState to set a new value to recoil state
  const query = useParams();// Get path params
  const router = useRouter();// get router for push a problem path


  //--- Handle problem change
  const handleProblemChange = (isForward: boolean) => {
    const {order} = problems[query.pid as string];// Get order of current problem
    const direction: number = isForward ? 1 : -1;// Check direction as setup
    const nextProblem: number = order + direction;// Move to next problem order number
    const nextProblemKey = Object.keys(problems).find(key => problems[key].order === nextProblem);// Get key of the next problem

    if (isForward && !nextProblemKey) {
      const firestProblemKey = Object.keys(problems).find(key => problems[key].order === 1);
      router.push(`${firestProblemKey}`);

    } else if(!isForward && !nextProblemKey) {
      const lastProblemKey = Object.keys(problems).find(key => problems[key].order === 5);
      router.push(`${lastProblemKey}`);

    } else {
      router.push(`${nextProblemKey}`);
    }
    
  }

  return (
    <nav className="relative flex h-14 shrink-0 items-center bg-dark-layer-1 text-dark-gray-7">
      <div className={`flex items-center justify-between w-full px-4 sm:px-6 mx-auto `}>
        {/* --- Logo --- */}
        <Link href="/" className="h-6 flex-1">
          <Image src="/logo-full.png" alt="logo" width={100} height={100} />
        </Link>

        {/* --- Problem Page Part --- */}
        {
          problemPage && (
            <div className="flex items-center justify-center gap-4 flex-1">
              {/* -- Chevron Left -- */}
              <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 w-8 h-8 cursor-pointer"
                onClick={() => handleProblemChange(false)}
              >
                <FaChevronLeft />
              </div>
              {/* -- Link to all problems -- */}
              <Link href="/" className="flex items-center justify-center font-medium gap-2 max-w-[170px] text-dark-gray-8 cursor-pointer">
                <div>
                  <BsList />
                </div>
                <p>Problems List</p>
              </Link>
              {/* -- Chevron Right -- */}
              <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 w-8 h-8 cursor-pointer"
                onClick={() => handleProblemChange(true)}
              >
                <FaChevronRight />
              </div>
            </div>
          )
        }

        {/* --- Links --- */}
        <div className="flex items-center justify-end flex-1 gap-4">
          {
            !user && 
            <Link href="/auth" onClick={() => setAuthModalState({isOpen: true, type: "login"})}>
              <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded">Sign In</button>
            </Link>
          }
          {
            user &&
              <>
                {/* --- Check if problem page make a timer --- */}
                { problemPage && <Timer /> }
                {/* --- User Icon --- */}
                <div className="cursor-pointer group relative">
                  <Image src="/avatar.png" alt="user profile image" width={32} height={32} className="rounded-full" />
                  <div className="absolute top-10 left-2/4 -translate-x-2/4 mx-auto bg-dark-layer-1 text-brand-orange p-2 
                  rounded shadow-lg z-40 scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out"
                  >
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
                {/* --- Logout Button --- */}
                <LogoutButton />
              </>
          }
        </div>
      </div>
    </nav>
  )
}

export default Topbar