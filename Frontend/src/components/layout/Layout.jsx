import React from 'react';
import Header from '../Header';


export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                        border border-gray-200 dark:border-gray-700 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}