import { useRecoilState } from 'recoil';
import { authModalState } from '../../atoms/authModalAtom';
import Link from 'next/link'
import Image from 'next/image';

const Navbar = () => {
  //--- Get Value of atom state & function to manipulate it
  const [authModal, setAuthModal] = useRecoilState(authModalState);

  //--- HandleClick for open the auth modal
  const handleOpen = () => {
    setAuthModal((prev) => ({...prev, isOpen: true}));
  }

  return (
    <div className='flex items-center justify-between px-2 sm:px-12 md:px-24'>
      {/* ------ Logo ------ */}
      <Link href="/" className='flex items-center justify-center h-20'>
        <Image src="/logo.png" alt='leetCode' width={200} height={200} />
      </Link>

      {/* ------ SignIn ------ */}
      <div className="flex items-center">
        <button onClick={handleOpen}
          className='bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium border-2 
            border-transparent transition duration-300 ease-in-out
          hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange'
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

export default Navbar