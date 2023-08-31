/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useRecoilState } from 'recoil';
import { authModalState } from "@/app/atoms/authModalAtom";
import {IoClose} from "react-icons/io5";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

type AuthModalProps = {}

const AuthModal = (props: AuthModalProps) => {
  //--- Get Value of atom state & function to manipulate it
  const [authModal, setAuthModal] = useRecoilState(authModalState);

  //--- HandleClick for closing the auth modal
  const handleClose = () => {
    setAuthModal((prev) => ({type:"login", isOpen: false}))
  }

  //--- Add an eventListener to close modal when user click Escape button from keyboard
  useEffect(() => {
    //--- Handle the button Click and close Modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    
    window.addEventListener("keydown", handleEsc);//--- Add EventListener
    return () => window.removeEventListener("keydown", handleEsc);//--- Remove EventListener
  }, [])

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center bg-black/60" onClick={handleClose}></div>
      <div className="w-full sm:w-[450px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="relative w-full h-full mx-auto flex items-center justify-center">
          <div className="bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-orange to-slate-900 p-6">
            <div className="flex justify-end absolute p-2 top-3 right-3">
              <button type="button" onClick={handleClose}
                className="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center text-white hover:bg-gray-800 hover:text-white"
              >
                <IoClose className="h-5 w-5"/>
              </button>
            </div>
            {
              authModal.type === "login" ? <Login /> : 
              authModal.type === "register" ? <Signup /> :
              <ResetPassword />
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthModal;