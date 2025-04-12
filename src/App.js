import "./App.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import SiteBanner from "./layouts/Banner";
import SiteFooter from "./layouts/Footer";
import SiteNavbar from "./layouts/Navbar";
import SiteNavbarFluid from "./layouts/NavbarFluid";
import Sidebar from "./layouts/Sidebar";
import CreateProject from "./pages/CreateProject";
import CreateProjectRun from "./pages/createProjectRun";
import Home from "./pages/Home";
import ProjectList from "./pages/ProjectList";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectPipeline from "./pages/ProjectPipeline";
import ProjectRun from "./pages/ProjectRun";
import ProjectSchedule from "./pages/ProjectSchedule";
import UpdateProject from "./pages/UpdateProject";
import ChangePassword from "./pages/UserChangePassword";
import ForgotPassword from "./pages/UserForgotPassword";
import Login from "./pages/UserLogin";
import Logout from "./pages/UserLogout";
import NewPasswordChallenge from "./pages/UserNewPasswordChallenge";
import UserProfile from "./pages/UserProfile";
import ResetPassword from "./pages/UserResetPassword";
import CognitoTokens from "./pages/UserTokens";

import useAuthStore from "./pages/stores/AuthStore";

const queryClient = new QueryClient();

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {isLoggedIn ? "" : <SiteBanner />}
        {isLoggedIn ? <SiteNavbarFluid /> : <SiteNavbar />}

        <BrowserRouter>
          <div className="app-container">
            {isLoggedIn && <Sidebar />}
            <div className="Content">
              <Routes>
                {/* Home route */}
                <Route exact path="/" element={<Home />} />
                {/* Project routes*/}
                <Route
                  path="/projects"
                  exact
                  element={
                    isLoggedIn ? <ProjectList /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/overview"
                  exact
                  element={
                    isLoggedIn ? <ProjectOverview /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/schedule"
                  exact
                  element={
                    isLoggedIn ? <ProjectSchedule /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pipeline"
                  exact
                  element={
                    isLoggedIn ? <ProjectPipeline /> : <Navigate to="/login" />
                  }
                />

                {/* Project run route */}
                <Route
                  path="/projectrun"
                  exect
                  element={isLoggedIn ? <ProjectRun /> : <Navigate to="/login" />}
                />

                {/* User auth routes */}
                <Route
                  path="/login"
                  element={isLoggedIn ? <Navigate to="/projects" /> : <Login />}
                />
                <Route path="/logout" element={<Logout />} />
                <Route path="/tokens" element={<CognitoTokens />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route
                  path="/new-password-challenge"
                  element={<NewPasswordChallenge />}
                />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/create-projectrun" element={<CreateProjectRun />} />
                <Route path="/update-project" element={<UpdateProject />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        {isLoggedIn ? "" : <SiteFooter />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
