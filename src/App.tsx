import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Cookies from 'js-cookie';
import Home from './pages/Home'
import { useEffect } from 'react';
import SignIn from './pages/SignIn';
import Navbar from './components/NavBar';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      navigate("/signin")
    }
  }, [navigate])
  return (
    <main className='h-screen flex flex-col bg-gray-100'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </main>
  )
}

export default App
