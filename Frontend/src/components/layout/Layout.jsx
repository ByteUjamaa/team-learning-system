import React from 'react';
import Header from '../Header';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <main className="flex-1 w-full">
            <div className={`rounded-lg shadow-sm p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              {children}
            </div>
            
            {/* Logout Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={logout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}