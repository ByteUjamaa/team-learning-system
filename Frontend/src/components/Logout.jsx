import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiLogOut } from 'react-icons/fi';

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-600 to-purple-600'
          : 'bg-gradient-to-br from-blue-500 to-purple-500'
      }`}>
        <FiLogOut className="h-10 w-10 text-white" />
      </div>
      <h1 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Logging out...
      </h1>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        You will be redirected to the login page.
      </p>
    </div>
  );
}