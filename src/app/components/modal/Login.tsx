import {useState, useEffect} from "react";
import { authModalState } from "@/app/atoms/authModalAtom";
import { UserType } from "@/app/constants/types";
import { auth } from "@/app/firebase/firebase";
import Link from "next/link"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from 'recoil';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();
  //--- Get function to manipulate atom state
  const setAuthModal = useSetRecoilState(authModalState);

  //--- Change type value of authModalState atom
  const handleState = (type: "register" | "forgetPassword") => {
    setAuthModal(prev => ({...prev, type}));
  }

  //--- State for user info
  const [inputs, setInputs] = useState<UserType>({email: "", password: ""});
  //-- Handle chnage for store th info in the state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs, 
      [e.target.name]: e.target.value
    });
  }

  //--- Create a variables for make the signin Method
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  //--- Handle Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();// Cancle the default event of submit
    //--- Check if all fields are not empty
    if(!inputs.email || !inputs.password) alert("Please fill all fields");
    const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);// Create New User
    if (!newUser) return;// Check if theres not error
    router.push('/');// Route to the home page
    
  }
  //--- Check if theres an error alert a message with the error
  useEffect(() => { 
    if (error) toast.error(error.message, {position: "top-center", autoClose: 3000, theme: 'dark'});
  }, [error]);

  return (
    <form action="" className="space-y-6 pb-4" onSubmit={(e) => handleSubmit(e)}>
      {/* --- Heading --- */}
      <h3 className="text-xl font-medium text-white">Sign in to LeetCode</h3>
      {/* --- Email Input --- */}
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Email</label>
        <input type="email" name="email" id="email" placeholder="name@company.com" onChange={(e) => handleInputChange(e)}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-bg-gray-400 text-white"
        />
      </div>
      {/* --- Password Input --- */}
      <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Your Password</label>
        <input type="password" name="password" id="password" placeholder="********" onChange={(e) => handleInputChange(e)}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-bg-gray-400 text-white"
        />
      </div>
      {/* --- Submit Button --- */}
      <button type="submit" className="w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s">
        {loading ? "Loading...": "Login"}
      </button>
      {/* --- Forget Passwor --- */}
      <button className="flex w-full justify-end" onClick={() => handleState("forgetPassword")}>
        <Link href="" className="text-sm text-brand-orange hover:underline w-full text-right">
          Forget Password?
        </Link>
      </button>
      {/* --- Register Link --- */}
      <div className="text-sm font-medium text-gray-300">
        Not Registered?{" "}
        <Link href="" className="text-blue-500 hover:underline" onClick={() => handleState("register")}>Create account</Link>
      </div>
    </form>
  )
}

export default Login