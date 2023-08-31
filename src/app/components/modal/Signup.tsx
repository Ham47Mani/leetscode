import React, { useState } from 'react';
import { authModalState } from '@/app/atoms/authModalAtom';
import { UserType, userDataType } from '@/app/constants/types';
import { useSetRecoilState } from 'recoil';
import Link from 'next/link';
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import { auth, firestore } from '@/app/firebase/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const router = useRouter();// Create a router for routing
  const setAuthModal = useSetRecoilState(authModalState);//--- Get function to manipulate atom state
  //--- Change type value of authModalState atom
  const handleState = (type: "login") => {
    setAuthModal(prev => ({...prev, type}));
  }

  //--- State for user info
  const [inputs, setInputs] = useState<UserType>({email: "", displayName: "", password: ""});
  //-- Handle chnage for store th info in the state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs, 
      [e.target.name]: e.target.value
    });
  }

  //--- Create user account with email & password using react firebase hooks
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  //--- Handle Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();// Cancle the default event of submit
    toast.loading("Creating your account", {position: "top-center", toastId: "loadingToast"});// Show a toast message
    //--- Check if all fields are not empty
    if(!inputs.email ||!inputs.displayName || !inputs.password) {
      toast.info("Please fill all fields", {position: "top-center", autoClose: 3000, theme: 'dark'});
      return null;
    }
    const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);// Create New User
    if (!newUser) return;// Check if theres not error
    //--- Create a user data to store it in database firestore
    const userData: userDataType = {
      uid: newUser.user.uid,
      email: newUser.user.email,
      displayName: inputs.displayName,
      createAt: Date.now(),
      updateAt: Date.now(),
      likedProblem: [],
      dislikedProblem: [],
      solveProblem: [],
      starredProblem: [],
    };
    await setDoc(doc(firestore, "users", newUser.user.uid), userData);// store the user data in firestore database
    toast.dismiss("loadingToast");// Hide toast after creating a user
    router.push('/');// Route to the home page
  }
  //--- Check if theres an error alert a message with the error
  useEffect(() => { 
    if (error) toast.error(error.message, {position: "top-center", autoClose: 3000, theme: 'dark'});
  }, [error]);

  return (
    <form action="" className="space-y-6 pb-4" onSubmit={(e) => handleSubmit(e)}>
      {/* --- Heading --- */}
      <h3 className="text-xl font-medium text-white">Register to LeetsCode</h3>
      {/* --- Email Input --- */}
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Email</label>
        <input type="email" name="email" id="email" placeholder="name@company.com" onChange={(e) => handleInputChange(e)}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-bg-gray-400 text-white"
        />
      </div>
      {/* --- Name Input --- */}
      <div>
        <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-gray-300">Display Name</label>
        <input type="text" name="displayName" id="displayName" placeholder="Hammani BOU" onChange={(e) => handleInputChange(e)}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-bg-gray-400 text-white"
        />
      </div>
      {/* --- Password Input --- */}
      <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Password</label>
        <input type="password" name="password" id="password" placeholder="********" onChange={(e) => handleInputChange(e)}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-bg-gray-400 text-white"
        />
      </div>
      {/* --- Submit Button --- */}
      <button type="submit" className="w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s">
        {loading ?  "Registering..." : "Register"}
      </button>
      {/* --- Forget Passwor --- */}
      <div className="text-sm font-medium text-gray-300">
        Alredy have an account?{" "}
        <Link href="" className="text-blue-500 hover:underline" onClick={() => handleState("login")}>Log In</Link>
      </div>
    </form>
  )
}

export default Signup