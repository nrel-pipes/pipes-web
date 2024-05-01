import "gantt-task-react/dist/index.css";
import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import LogoutPage from "./pages/LogoutPage";
import NewPasswordChallengePage from "./pages/NewPasswordChallengePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { InitialAuthProvider } from './context/AuthContext';

import CognitoAuth from "./components/CognitoAuth";
import getUrl from "./components/store/OriginUrl";

const LoginRequiredPage = ({element, ...props}) => {
  const isAuthenticated = CognitoAuth.isAuthenticated();
  if (isAuthenticated) {
    return element
  } else {
    return <Navigate to="/login" />;
  }
};


const App = () => {
  const [isConnected, setIsConnected] = useState(true); // indicate if app is connected to pipes server
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    // Check PIPE server connection
    const runHealthcheck = async function() {
      const pingUrl =  getUrl("/api/ping");
      const response = await fetch(pingUrl);
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }

    runHealthcheck().catch(console.error);

    // Check if it is authenticated user
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <>
      <BrowserRouter>
        <InitialAuthProvider>
          <Routes>
            <Route path="/" element={<LoginRequiredPage element={<MainPage/>} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LoginRequiredPage element={<LogoutPage />} />} />
            <Route path="/setup-new-password/:email" element={<NewPasswordChallengePage />} />
            <Route path="/account" element={<LoginRequiredPage element={<AccountPage />} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:email" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </InitialAuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
