// src/pages/LogoutPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';

const Logout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  // Optionally render a message or a loading indicator
  return <div>Logging out...</div>;
};

export default Logout;
