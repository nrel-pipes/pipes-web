import { createContext, useContext, useEffect, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [activeSection, setActiveSectionState] = useState(() => {
    // Initialize from localStorage or default to 'workspace'
    return localStorage.getItem('activeSection') || 'workspace';
  });

  const setActiveSection = (section) => {
    localStorage.setItem('activeSection', section);
    setActiveSectionState(section);
  };

  // Update active section based on current path on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setActiveSection('home');
    } else if (path === '/catalogmodels' || path === '/catalogdatasets') {
      setActiveSection('catalog');
    } else if (path === '/logout') {
      setActiveSection('logout');
    } else if (path.startsWith('/account/')) {
      setActiveSection('account');
    } else if (path === '/projects' || path.startsWith('/project') || path === '/dashboard' || path === '/models' || path === '/pipeline' || path === '/schedule' || path === '/teams') {
      setActiveSection('workspace');
    }
  }, []);

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  );
};
