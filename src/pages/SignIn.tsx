import React, { useState, type SyntheticEvent } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { CandidateInfo } from '../types';
import LoadingPage from './LoadingPage';
import { Alert } from '@mui/material';

const SignIn: React.FC = () => {
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    axios.get(`${baseUrl}/api/candidate/get-by-email?email=${email}`)
      .then((response) => {
        const user: CandidateInfo = response.data;
        Cookies.set('candidate', JSON.stringify(user), { expires: 1 });

        navigate('/', { replace: true });

      }).catch((error) => {
        if (error.response) {
          const errorMsg = error.response.data.error;
          if (errorMsg) {
            setError(errorMsg)
          } else {
            setError("Unknown error, try again later")
          }
        }
      }).finally(() => {
        setLoading(false);
      })
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-200'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-md w-96'
      >
        <h2 className='text-2xl font-semibold text-center mb-6'>Sign In</h2>

        {loading ?
          <LoadingPage />
          :
          (
            <>
              <div className='mb-4'>
                {error && <Alert variant='outlined' severity='error' >{error}</Alert>}
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 pt-4'>Email</label>
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
                className='w-full mt-4 bg-violet-600 text-white font-semibold p-2 rounded-md hover:bg-violet-500 transition duration-200 cursor-pointer'
              >
                Sign In
              </button>
            </>
          )}
      </form>
    </div>
  );
};

export default SignIn;
