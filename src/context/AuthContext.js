import React, { createContext, useContext, useState } from 'react';

const InitialAuthContext = createContext();

export const useInitialAuthContext = () => {
  return useContext(InitialAuthContext);
};

export const InitialAuthProvider = ({ children }) => {
  const [tempPassword, setTempPassword] = useState('');

  const setTempPasswordValue = (password) => {
    setTempPassword(password);
  };

  return (
    <InitialAuthContext.Provider value={{ tempPassword, setTempPasswordValue }}>
      {children}
    </InitialAuthContext.Provider>
  );
};
