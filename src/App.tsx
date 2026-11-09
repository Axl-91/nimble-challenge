import { Navigate, Route, Routes } from 'react-router-dom'
import Cookies from 'js-cookie';
import Home from './pages/Home'
import { useState } from 'react';
import SignIn from './pages/SignIn';
import Navbar from './components/NavBar';
import type { CandidateInfo } from './types';

function readCandidateCookie(): CandidateInfo | null {
  const candidateCookie = Cookies.get('candidate');
  if (!candidateCookie) return null;
  try {
    return JSON.parse(candidateCookie) as CandidateInfo;
  } catch (error) {
    Cookies.remove('candidate');
    console.error('Failed to parse candidate cookie:', error);
    return null;
  }
}

function App() {
  const [candidateInfo] = useState<CandidateInfo | null>(() => readCandidateCookie());

  return (
    <main className='h-screen flex flex-col bg-gray-100'>
      <Navbar candidate={candidateInfo} />
      <Routes>
        <Route path='/signin' element={candidateInfo ? <Navigate to='/' replace /> : <SignIn />} />
        <Route path='/' element={candidateInfo ? <Home candidate={candidateInfo} /> : <Navigate to='/signin' replace />} />
      </Routes>
    </main>
  )
}

export default App
