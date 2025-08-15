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
import CreateProjectPage from "./pages/Projects/CreateProjectPage";
import DeleteProjectPage from "./pages/Projects/DeleteProjectPage";
import UpdateProjectPage from "./pages/Projects/UpdateProjectPage";

// Projects
import ListMyProjectsPage from "./pages/Projects/ListMyProjectsPage";

// Project Milestones
import ProjectMilestonesPage from "./pages/Milestones/ProjectMilestonesPage";

// Project Dashboard
import ProjectDashboardPage from "./pages/Dashboard/ProjectDashboardPage";

// Project Pipeline
import ProjectPipeline from "./pages/Pipeline/ProjectPipelinePage";

// Project Schedule
import ProjectSchedulePage from "./pages/Schedule/ProjectSchedulePage";

// Project Run
import CreateProjectRunPage from "./pages/ProjectRuns/CreateProjectRunPage";
import DeleteProjectRunPage from "./pages/ProjectRuns/DeleteProjectRunPage";
import GetProjectRunPage from "./pages/ProjectRuns/GetProjectRunPage";
import UpdateProjectRunPage from "./pages/ProjectRuns/UpdateProjectRunPage";

// Model
import CreateModelPage from "./pages/Models/CreateModelPage";
import CreateModelPreparePage from "./pages/Models/CreateModelPreparePage";
import DeleteModelPage from "./pages/Models/DeleteModelPage";
import GetModelPage from "./pages/Models/GetModelPage";
import ListModelsPage from "./pages/Models/ListModelsPage";
import UpdateModelPage from "./pages/Models/UpdateModelPage";

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

// Teams
import CreateTeamPage from "./pages/Teams/CreateTeamPage";
import DeleteTeamPage from "./pages/Teams/DeleteTeamPage";
import GetTeamPage from "./pages/Teams/GetTeamPage";
import ListTeamsPage from "./pages/Teams/ListTeamsPage";
import UpdateTeamPage from "./pages/Teams/UpdateTeamPage";

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
                    isAuthenticated ? <ListMyProjectsPage /> : <Navigate to="/login" />
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
                <Route path="/create-project" element={
                  isAuthenticated ? <CreateProjectPage /> : <Navigate to="/login" />
                } />
                <Route path="/create-projectrun" element={
                  isAuthenticated ? <CreateProjectRunPage /> : <Navigate to="/login" />
                } />
                <Route path="/update-project" element={
                  isAuthenticated ? <UpdateProjectPage /> : <Navigate to="/login" />
                } />
                <Route path="/delete-project" element={
                  isAuthenticated ? <DeleteProjectPage /> : <Navigate to="/login" />
                } />

                {/* Project run route */}
                <Route
                  path="/projectrun"
                  exect
                  element={isAuthenticated ? <GetProjectRunPage /> : <Navigate to="/login" />}
                />
                <Route path="/update-projectrun" element={
                  isAuthenticated ? <UpdateProjectRunPage /> : <Navigate to="/login" />
                } />
                <Route path="/delete-projectrun" element={
                  isAuthenticated ? <DeleteProjectRunPage /> : <Navigate to="/login" />
                } />

                {/* Milestones route */}
                <Route path="/milestones" element={<ProjectMilestonesPage />} />

                {/* Model route */}
                <Route
                  path="/models"
                  exact
                  element={
                    isAuthenticated ? <ListModelsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/model"
                  exact
                  element={
                    isAuthenticated ? <GetModelPage /> : <Navigate to="/login" />
                  }
                />
                <Route path="/create-model" element={
                  isAuthenticated ? <CreateModelPage /> : <Navigate to="/login" />
                } />
                <Route path="/delete-model" element={
                  isAuthenticated ? <DeleteModelPage /> : <Navigate to="/login" />
                } />
                <Route path="/create-model-prepare" element={
                  isAuthenticated ? <CreateModelPreparePage /> : <Navigate to="/login" />
                } />
                <Route path="/update-model" element={
                  isAuthenticated ? <UpdateModelPage /> : <Navigate to="/login" />
                } />

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

                {/* Team routes */}
                <Route
                  path="/teams"
                  exact
                  element={
                    isAuthenticated ? <ListTeamsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/teams/:projectName/:teamName"
                  element={
                    isAuthenticated ? <GetTeamPage /> : <Navigate to="/login" />
                  }
                />
                <Route path="/create-team" element={
                  isAuthenticated ? <CreateTeamPage /> : <Navigate to="/login" />
                } />
                <Route path="/update-team" element={
                  isAuthenticated ? <UpdateTeamPage /> : <Navigate to="/login" />
                } />
                <Route path="/delete-team" element={
                  isAuthenticated ? <DeleteTeamPage /> : <Navigate to="/login" />
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
