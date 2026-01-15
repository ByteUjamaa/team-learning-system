import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Force start with light

  useEffect(() => {
    console.log('Theme changed to:', theme);
    
    const html = document.documentElement;
    const body = document.body;
    
    // Remove both classes
    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Add current theme
    html.classList.add(theme);
    body.classList.add(theme);
    
    // Set data attribute
    html.setAttribute('data-theme', theme);
    
    // Force body styles
    if (theme === 'dark') {
      body.style.backgroundColor = '#111827'; // gray-900
      body.style.color = '#f9fafb'; // gray-50
    } else {
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#111827'; // gray-900
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('Toggling theme from:', theme);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);