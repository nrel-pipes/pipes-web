import "./App.css";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import SiteBanner from "./layouts/Banner";
import SiteFooter from "./layouts/Footer";
import SiteNavbarFluid from "./layouts/NavbarFluid";
import Sidebar from "./layouts/NavbarSide";
import SiteNavbar from "./layouts/NavbarTop";

// Home
import Home from "./pages/Home/Home";

// Project
import CreateProject from "./pages/Project/CreateProject";
import UpdateProject from "./pages/Project/UpdateProject";

// Projects
import ProjectBasicsPage from "./pages/Projects/ProjectBasicsPage";

// Project Milestones
import ProjectMilestones from "./pages/Milestones/ProjectMilestones";

// Project Dashboard
import ProjectDashboardPage from "./pages/Dashboard/ProjectDashboardPage";

// Project Run
import CreateProjectRun from "./pages/ProjectRun/CreateProjectRun";
import ProjectRunPage from "./pages/ProjectRun/ProjectRunPage";

// Project Pipeline
import ProjectPipeline from "./pages/Pipeline/ProjectPipelinePage";

// Project Schedule
import ProjectSchedulePage from "./pages/Schedule/ProjectSchedulePage";

// User
import ChangePasswordPage from "./pages/Account/ChangePasswordPage";
import ForgotPasswordPage from "./pages/Account/ForgotPasswordPage";
import LoginPage from "./pages/Account/LoginPage";
import LogoutPage from "./pages/Account/LogoutPage";
import NewPasswordChallengePage from "./pages/Account/NewPasswordChallengePage";
import ProfilePage from "./pages/Account/ProfilePage";
import ResetPasswordPage from "./pages/Account/ResetPasswordPage";
import TokensPage from "./pages/Account/TokensPage";

import useAuthStore from "./stores/AuthStore";

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
                    isLoggedIn ? <ProjectBasicsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/project"
                  exact
                  element={
                    isLoggedIn ? <ProjectDashboardPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/schedule"
                  exact
                  element={
                    isLoggedIn ? <ProjectSchedulePage /> : <Navigate to="/login" />
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
                  element={isLoggedIn ? <ProjectRunPage /> : <Navigate to="/login" />}
                />

                {/* Milestones route */}
                <Route path="/milestones" element={<ProjectMilestones />} />

                {/* User auth routes */}
                <Route
                  path="/login"
                  element={isLoggedIn ? <Navigate to="/projects" /> : <LoginPage />}
                />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/tokens" element={<TokensPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/new-password-challenge"
                  element={<NewPasswordChallengePage />}
                />
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/create-projectrun" element={<CreateProjectRun />} />
                <Route path="/update-project" element={<UpdateProject />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        {isLoggedIn ? "" : <SiteFooter />}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
