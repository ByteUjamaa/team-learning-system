import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-16 items-center rounded-full 
                 bg-gray-200 dark:bg-gray-700 
                 transition-all duration-300 ease-in-out
                 hover:bg-gray-300 dark:hover:bg-gray-600
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span
        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg 
                    transition-all duration-300 ease-in-out
                    flex items-center justify-center
                    ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}
      >
        {theme === 'light' ? (
          <FiSun className="h-5 w-5 text-yellow-500" />
        ) : (
          <FiMoon className="h-5 w-5 text-gray-300" />
        )}
      </span>
    </button>
  );
}