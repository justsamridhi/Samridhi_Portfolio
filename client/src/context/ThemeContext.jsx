import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('samridhi-theme') || 'dark';
  });

  /* Apply theme attribute */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('samridhi-theme', theme);
  }, [theme]);

  /* Ensure any stale accent inline styles or storage keys are cleaned up */
  useEffect(() => {
    const root = document.documentElement;
    root.style.removeProperty('--orange');
    root.style.removeProperty('--ascii');
    localStorage.removeItem('samridhi-accent');
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
