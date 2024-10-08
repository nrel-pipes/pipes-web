import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SiteNavbar from './components/Navbar';
import SiteNavbarFluid from './components/NavbarFluid';
import SiteFooter from './layouts/Footer';
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import ProjectOverview from './pages/ProjectOverview';
import ProjectSchedule from './pages/ProjectSchedule';
import ProjectPipeline from './pages/ProjectPipeline';
import ProjectRun from './pages/ProjectRun';
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
      <BrowserRouter>
        <div className="fixed top-0 left-0 right-0 z-50">
          {isLoggedIn ? <SiteNavbarFluid /> : <SiteNavbar />}
        </div>
        <div className='Content pt-16'>
          <Routes>
            {/* Home route */}
            <Route exact path='/' element={<Home />} />
            {/* Project routes*/}
            <Route path='/projects' exact element={isLoggedIn ? <ProjectList /> : <Navigate to='/login' />} />
            <Route path='/overview' exact element={isLoggedIn ? <ProjectOverview /> : <Navigate to='/login' />} />
            <Route path='/schedule' exact element={isLoggedIn ? <ProjectSchedule /> : <Navigate to='/login' />} />
            <Route path='/pipeline' exact element={isLoggedIn ? <ProjectPipeline /> : <Navigate to='/login' />} />

            {/* Project run route */}
            <Route path='/projectrun' exact element={isLoggedIn ? <ProjectRun /> : <Navigate to='/login' />} />

            {/* User auth routes */}
            <Route path='/login' element={isLoggedIn ? <Navigate to='/projects' /> : <Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path="/tokens" element={<CognitoTokens />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/new-password-challenge" element={<NewPasswordChallenge />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
        {!isLoggedIn && <SiteFooter />}
      </BrowserRouter>
    </div>
  );
}

export default App;