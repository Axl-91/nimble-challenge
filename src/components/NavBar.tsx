import { Link } from 'react-router-dom';
import logo from '../assets/Nimble_Gravity.png';
import type { CandidateInfo } from '../types';
import Cookies from 'js-cookie';

type NavBarProps = {
  candidate?: CandidateInfo | null;
}


function NavBar({ candidate }: NavBarProps) {
  const handleSignOut = () => {
    Cookies.remove('candidate');

    // Reload page
    window.location.reload();
  };

  return (
    <header className='bg-purple-950 py-4 shadow-xl'>
      <nav className='container flex justify-between items-center mx-auto'>
        <Link to='/' className='px-4'>
          <img src={logo} className='w-25' alt='ngLogo' />
        </Link>
        <ul className='flex space-x-4'>
          {candidate ?
            <>
              <li className='text-white text-xl font-bold mr-8'>Hello, {candidate.firstName}</li>
              <li>
                <button
                  onClick={handleSignOut}
                  className='text-white text-xl font-bold hover:underline cursor-pointer'
                >
                  Sign Out
                </button>
              </li>
            </>
            :
            <li>
              <Link to='/signin' className='text-white text-xl font-bold hover:underline'>Sign In</Link>
            </li>
          }
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
