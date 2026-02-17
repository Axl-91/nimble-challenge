import { Link } from 'react-router-dom';
import logo from '../assets/Nimble_Gravity.png';

function NavBar() {
  return (
    <header className='bg-purple-950 py-4 shadow-xl'>
      <nav className='container flex justify-between items-center mx-auto'>
        <Link to='/' className='px-4'>
          <img src={logo} className='w-25' alt='ngLogo' />
        </Link>
        <ul className='flex space-x-4'>
          <li>
            <Link to='/' className='text-white text-xl font-bold hover:underline'>Home</Link>
          </li>
          <li>
            <Link to='/signin' className='text-white text-xl font-bold hover:underline'>Sign In</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
