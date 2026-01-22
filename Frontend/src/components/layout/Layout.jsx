import React from 'react';
import Header from '../Header';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
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
          </main>
        </div>
      </div>
    </div>
  );
}