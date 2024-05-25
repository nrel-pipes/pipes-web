import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import SiteBanner from './layouts/Banner';
import SiteNavbar from './layouts/Navbar';
import SiteFooter from './layouts/Footer';
import Home from './pages/Home';
import ProjectBasics from './pages/ProjectBasics';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/UserLogin';
import Logout from './pages/UserLogout';
import CognitoTokens from './pages/UserTokens';
import UserProfile from './pages/UserProfile';
import NewPasswordChallenge from './pages/UserNewPasswordChallenge';
import ChangePassword from './pages/UserChangePassword';
import ForgotPassword from './pages/UserForgotPassword';
import ResetPassword from './pages/UserResetPassword';

import useAuthStore from './pages/stores/AuthStore';


function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className='App'>
      <SiteBanner />
      <SiteNavbar />
      <div className='Content'>
        <BrowserRouter>
          <Routes>
            {/* Home route */}
            <Route exact path='/' element={<Home />} />
            {/* Project routes*/}
            <Route path='/projects'  exact element={isLoggedIn? <ProjectBasics />: <Navigate to='/login' />} />
            <Route path='/projects/:projectName'  exact element={isLoggedIn? <ProjectDetail />: <Navigate to='/login' />} />
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
