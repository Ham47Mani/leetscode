import { auth } from "@/app/firebase/firebase"
import { useSignOut } from "react-firebase-hooks/auth"
import {FiLogOut} from "react-icons/fi"

const LogoutButton = () => {
  const [signOut] = useSignOut(auth);
  //--- User logout
  const handleLogout = async () => {
    await signOut();
  }
  return (
    <button className="bg-dark-fill-3 py-2 px-3 cursor-pointer rounded text-brand-orange" onClick={handleLogout}>
      <FiLogOut />
    </button>
  )
}

export default LogoutButton