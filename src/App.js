import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import SiteBanner from './layouts/Banner';
import SiteNavbar from './layouts/Navbar';
import SiteFooter from './layouts/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Logout from './pages/Logout';

import useAuthStore from './pages/stores/authStore';


function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className='App'>
      <SiteBanner />
      <SiteNavbar />
      <div className='Content'>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/projects' element={isLoggedIn? <Projects />: <Navigate to='/login' />} />
            <Route path='/login' element={isLoggedIn? <Navigate to='/projects' />:<Login />} />
            <Route path='/logout' element={<Logout />} />
          </Routes>
        </BrowserRouter>
      </div>
      <SiteFooter />
    </div>
  );
}

export default App;
