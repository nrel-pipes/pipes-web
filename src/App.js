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
import CreateModelStartPage from "./pages/Models/CreateModelStartPage";
import DeleteModelPage from "./pages/Models/DeleteModelPage";
import GetModelPage from "./pages/Models/GetModelPage";
import ListModelsPage from "./pages/Models/ListModelsPage";
import UpdateModelPage from "./pages/Models/UpdateModelPage";

// Catalog Model
import CreateCatalogModelPage from "./pages/CatalogModels/CreateCatalogModelPage";
import DeleteCatalogModelPage from "./pages/CatalogModels/DeleteCatalogModelPage";
import GetCatalogModelPage from "./pages/CatalogModels/GetCatalogModelPage";
import ListCatalogModelsPage from "./pages/CatalogModels/ListCatalogModelsPage";
import UpdateCatalogModelPage from "./pages/CatalogModels/UpdateCatalogModelPage";

// Handoff
import CreateHandoffPage from "./pages/Handoffs/CreateHandoffPage";
import DeleteHandoffPage from "./pages/Handoffs/DeleteHandoffPage";
import UpdateHandoffPage from "./pages/Handoffs/UpdateHandoffPage";

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

import { NavigationProvider } from './contexts/NavigationContext';
import useAuthStore from "./stores/AuthStore";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
      setLoading(false); // Set loading to false after auth check
    };

    checkAuth();

    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  if (loading) {
    // Show a loading spinner or placeholder while checking authentication
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <NavigationProvider>
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
                    path="/dashboard"
                    element={
                      isAuthenticated ? <ProjectDashboardPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/schedule"
                    element={
                      isAuthenticated ? <ProjectSchedulePage /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/pipeline"
                    element={
                      isAuthenticated ? <ProjectPipeline /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="/project/new" element={
                    isAuthenticated ? <CreateProjectPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/project/update" element={
                    isAuthenticated ? <UpdateProjectPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/project/delete" element={
                    isAuthenticated ? <DeleteProjectPage /> : <Navigate to="/login" />
                  } />

                  {/* Project run route */}
                  <Route path="/projectrun/new" element={
                    isAuthenticated ? <CreateProjectRunPage /> : <Navigate to="/login" />
                  } />
                  <Route
                    path="/projectrun/:projectRunName"
                    element={
                      isAuthenticated
                        ? <GetProjectRunPage />
                        : <Navigate to="/login" />
                    }
                  />
                  <Route path="/projectrun/:projectRunName/update" element={
                    isAuthenticated ? <UpdateProjectRunPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/projectrun/:projectRunName/delete" element={
                    isAuthenticated ? <DeleteProjectRunPage /> : <Navigate to="/login" />
                  } />

                  {/* Milestones route */}
                  <Route path="/milestones" element={<ProjectMilestonesPage />} />

                  {/* Model route */}
                  <Route
                    path={`/models`}
                    element={
                      isAuthenticated ? <ListModelsPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="/model/startnew" element={
                    isAuthenticated ? <CreateModelStartPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/model/new" element={
                    isAuthenticated ? <CreateModelPage /> : <Navigate to="/login" />
                  } />
                  <Route
                    path="/model/:modelName"
                    element={
                      isAuthenticated ? <GetModelPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="/model/:modelName/update" element={
                    isAuthenticated ? <UpdateModelPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/model/:modelName/delete" element={
                    isAuthenticated ? <DeleteModelPage /> : <Navigate to="/login" />
                  } />

                  {/* Catalog Models route */}
                  <Route path="/catalogmodels" element={
                    isAuthenticated ? <ListCatalogModelsPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/catalogmodel/new" element={
                    isAuthenticated ? <CreateCatalogModelPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/catalogmodel/:modelName" element={
                    isAuthenticated ? <GetCatalogModelPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/catalogmodel/:modelName/update" element={
                    isAuthenticated ? <UpdateCatalogModelPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/catalogmodel/:modelName/delete" element={
                    isAuthenticated ? <DeleteCatalogModelPage /> : <Navigate to="/login" />
                  } />

                  {/* Handoff routes */}
                  <Route path="/handoff/new" element={
                    isAuthenticated ? <CreateHandoffPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/handoff/:handoffName/update" element={
                    isAuthenticated ? <UpdateHandoffPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/handoff/:handoffName/delete" element={
                    isAuthenticated ? <DeleteHandoffPage /> : <Navigate to="/login" />
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
                    element={
                      isAuthenticated ? <ListTeamsPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="/team/new" element={
                    isAuthenticated ? <CreateTeamPage /> : <Navigate to="/login" />
                  } />
                  <Route
                    path="/team/:teamName"
                    element={
                      isAuthenticated ? <GetTeamPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="/team/:teamName/update" element={
                    isAuthenticated ? <UpdateTeamPage /> : <Navigate to="/login" />
                  } />
                  <Route path="/team/:teamName/delete" element={
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
    </NavigationProvider>
  );
}

export default App;
