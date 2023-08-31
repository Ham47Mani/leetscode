import { auth } from '@/app/firebase/firebase';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [sendPasswordResetEmail, sending ,error] = useSendPasswordResetEmail(auth);

  //--- Send a reset email when submit form
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await sendPasswordResetEmail(email);
    if (success) toast.success("Password reset email sent", {position: "top-center", autoClose: 3000, theme: 'dark'});
  }

  useEffect(() => {
    if (error) toast.error(error.message, {position: "top-center", autoClose: 3000, theme: 'dark'});
  }, [error]);

  return (
    <form action="" className="space-y-6 pb-4" onSubmit={handleReset}>
      {/* --- Heading --- */}
      <h3 className="text-xl font-medium text-white">Reset Password</h3>
      <p className="text-sm text-white">
        Forgotten your password? Enter your email address below, and we&apos;ll send you an e-mail allowing you to reset it.
      </p>
      {/* --- Email Input --- */}
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your email</label>
        <input type="email" name="email" id="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-bg-gray-400 text-white"
        />
      </div>
      {/* --- Submit Button --- */}
      <button type="submit" className="w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s">
        Reset Password
      </button>
    </form>
  )
}

export default ResetPassword