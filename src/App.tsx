import { Route, Routes, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import Home from './pages/Home'
import { useEffect, useState } from 'react';
import SignIn from './pages/SignIn';
import Navbar from './components/NavBar';
import type { CandidateInfo } from './types';

function App() {
  const navigate = useNavigate();
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);

  useEffect(() => {
    const candidateCookie = Cookies.get('candidate');
    if (!candidateCookie) {
      navigate("/signin")
    } else {
      try {
        const parsedCandidate = JSON.parse(candidateCookie);
        setTimeout(() => {
          setCandidateInfo(parsedCandidate);
        }, 0)
      } catch (error) {
        // If cookie is invalid I remove it
        Cookies.remove('candidate');
        console.error('Failed to parse candidate cookie:', error);
        navigate("/signup");
      }
    }
  }, [navigate])
  return (
    <main className='h-screen flex flex-col bg-gray-100'>
      <Navbar candidate={candidateInfo} />
      <Routes>
        {candidateInfo ? (
          <Route path="/" element={<Home candidate={candidateInfo} />} />
        ) : (<> </>)}
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </main>
  )
}

export default App
