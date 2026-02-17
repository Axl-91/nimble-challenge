import React, { useState, type SyntheticEvent } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const user = { id: 1, email: email };
    Cookies.set('user', JSON.stringify(user), { expires: 1 });
    console.log('User Logged In', email);
    navigate("/");
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-200'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-md w-96'
      >
        <h2 className='text-2xl font-semibold text-center mb-6'>Sign In</h2>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            placeholder='example@email.com'
            onChange={(e) => setEmail(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-400'
          />
        </div>
        <button
          type='submit'
          className='w-full mt-4 bg-violet-600 text-white font-semibold p-2 rounded-md hover:bg-violet-500 transition duration-200'
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
