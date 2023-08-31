"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { authModalState } from "../atoms/authModalAtom";
import Navbar from "../components/navbar/Navbar"
import AuthModal from '../components/modal/AuthModal';
import {useRecoilValue} from "recoil"
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {}

const Authpage = (props: Props) => {
  const authModal = useRecoilValue(authModalState);// Get Value of atom state
  const [user, loading] = useAuthState(auth);// Handle auth change
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/"); // Check if user is login route it to home page
    if (!loading && !user) setPageLoading(false); // if not rendering this page
  }, [user, router, loading]);

  if (pageLoading) return null // If pageLoading  or user is login don't shawing anythings before redirect

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh - 5rem)] pointer-events-none select-none">
          <Image src="/hero.png" alt="Hero image" width={700} height={700}/>
        </div>
        { authModal.isOpen && <AuthModal /> }
      </div>
    </div>
  )
}

export default Authpage;