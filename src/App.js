import "./App.css";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useEffect, useState } from "react";

import SiteBanner from "./layouts/Banner";
import SiteFooter from "./layouts/Footer";
import SiteNavbarFluid from "./layouts/NavbarFluid";
import Sidebar from "./layouts/NavbarSide";
import SiteNavbar from "./layouts/NavbarTop";

// Home
import HomePage from "./pages/Home/HomePage";

// Project
import CreateProjectPage from "./pages/Project/CreateProjectPage";
import UpdateProjectPage from "./pages/Project/UpdateProjectPage";

// Projects
import ProjectBasicsPage from "./pages/Projects/ProjectListPage";

// Model Catalog
import ModelCatalog from "./pages/modelCatalog";

// Project Milestones
import ProjectMilestonesPage from "./pages/Milestones/ProjectMilestonesPage";

// Project Dashboard
import ProjectDashboardPage from "./pages/Dashboard/ProjectDashboardPage";

// Project Run
import CreateProjectRunPage from "./pages/ProjectRun/CreateProjectRunPage";
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
import RegisterPage from "./pages/Account/RegisterPage";
import ResetPasswordPage from "./pages/Account/ResetPasswordPage";
import TokensPage from "./pages/Account/TokensPage";

// Users
import UserEditPage from "./pages/Users/UserEditPage";
import UserListPage from "./pages/Users/UserListPage";

import useAuthStore from "./stores/AuthStore";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
    };

    checkAuth();

    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {isAuthenticated ? "" : <SiteBanner />}
        {isAuthenticated ? <SiteNavbarFluid /> : <SiteNavbar />}

        <BrowserRouter>
          <div className="app-container">
            {isAuthenticated && <Sidebar />}
            <div className="Content">
              <Routes>
                {/* Home route */}
                <Route exact path="/" element={<HomePage />} />
                {/* Project routes*/}
                <Route
                  path="/projects"
                  exact
                  element={
                    isAuthenticated ? <ProjectBasicsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/modelsCatalog"
                  exact
                  element={
                    isAuthenticated ? <ModelCatalog /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/project/dashboard"
                  exact
                  element={
                    isAuthenticated ? <ProjectDashboardPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/project/schedule"
                  exact
                  element={
                    isAuthenticated ? <ProjectSchedulePage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/project/pipeline"
                  exact
                  element={
                    isAuthenticated ? <ProjectPipeline /> : <Navigate to="/login" />
                  }
                />
                <Route path="/create-project" element={<CreateProjectPage />} />
                <Route path="/create-projectrun" element={<CreateProjectRunPage />} />
                <Route path="/update-project" element={<UpdateProjectPage />} />

                {/* Project run route */}
                <Route
                  path="/projectrun"
                  exect
                  element={isAuthenticated ? <ProjectRunPage /> : <Navigate to="/login" />}
                />

                {/* Milestones route */}
                <Route path="/milestones" element={<ProjectMilestonesPage />} />

                {/* User auth routes */}
                <Route
                  path="/login"
                  element={isAuthenticated ? <Navigate to="/projects" /> : <LoginPage />}
                />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/account/tokens" element={<TokensPage />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route
                  path="/new-password-challenge"
                  element={<NewPasswordChallengePage />}
                />
                <Route path="/account/change-password" element={<ChangePasswordPage />} />
                <Route path="/account/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/account/reset-password" element={<ResetPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin routes */}
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/edit/:userEmail" element={
                  isAuthenticated ? <UserEditPage /> : <Navigate to="/login" />
                } />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        {isAuthenticated ? "" : <SiteFooter />}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
