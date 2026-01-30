import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col gap-6">
          {/* Main Content Area */}
          <main className="flex-1 w-full min-h-0">
            <div className={`rounded-lg shadow-sm p-4 sm:p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              {children}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}