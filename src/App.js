import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import SiteBanner from './layouts/Banner';
import SiteNavbar from './layouts/Navbar';
import SiteFooter from './layouts/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Login from './pages/UserLogin';
import Logout from './pages/UserLogout';
import CognitoTokens from './pages/UserTokens';
import UserProfile from './pages/UserProfile';
import NewPasswordChallenge from './pages/UserNewPasswordChallenge';
import ChangePassword from './pages/UserChangePassword';
import ForgotPassword from './pages/UserForgotPassword';
import ResetPassword from './pages/UserResetPassword';

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
            {/* User auth routes */}
            <Route path='/login' element={isLoggedIn? <Navigate to='/projects' />:<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path="/tokens" element={<CognitoTokens />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/new-password-challenge" element={<NewPasswordChallenge />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
      <SiteFooter />
    </div>
  );
}

export default App;
