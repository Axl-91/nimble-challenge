import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import Home from './pages/Home'
import { useEffect, useState } from 'react';
import SignIn from './pages/SignIn';
import Navbar from './components/NavBar';
import type { CandidateInfo } from './types';

function App() {
  const navigate = useNavigate();
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const candidateCookie = Cookies.get('candidate');
    if (candidateCookie) {
      try {
        const parsedCandidate: CandidateInfo = JSON.parse(candidateCookie);
        setTimeout(() => {
          setCandidateInfo(parsedCandidate);
        }, 0)
      } catch (error) {
        // If cookie is invalid I remove it
        Cookies.remove('candidate');
        console.error('Failed to parse candidate cookie:', error);
      }
    }
    setLoading(false)
  }, [navigate])
  return (
    <main className='h-screen flex flex-col bg-gray-100'>
      {loading ? <></> : (
        <>
          <Navbar candidate={candidateInfo} />
          <Routes>
            <Route path='/signin' element={candidateInfo ? <Navigate to="/" replace /> : <SignIn />} />
            <Route path="/" element={candidateInfo ? <Home candidate={candidateInfo} /> : <Navigate to="/signin" replace />} />
          </Routes>
        </>
      )}
    </main>
  )
}

export default App
