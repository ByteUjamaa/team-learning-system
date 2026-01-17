import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon, FiBell, FiUser } from 'react-icons/fi'

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path) => location.pathname === path;

  console.log('Current theme in Header:', theme); 

  return (
    <header className={`sticky top-0 z-50 w-full ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <span className="text-white font-bold">TLMS</span>
            </div>
            <h1 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Team Learning Management System
            </h1>
          </div>

          {/* Navigation - ALWAYS VISIBLE */}
          <nav className="flex items-center space-x-4">
            <NavLink to="/dashboard" active={isActive('/dashboard')} label="Dashboard" theme={theme} />
            <NavLink to="/teams" active={isActive('/teams')} label="Teams" theme={theme} />
            <NavLink to="/announcements" active={isActive('/announcements')} label="Announcements" theme={theme} />
            <NavLink to="/profile" active={isActive('/profile')} label="Profile" theme={theme} />
          </nav>
            
            {/* Theme Toggle - WORKING */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FiMoon className="h-5 w-5 text-gray-700" />
              ) : (
                <FiSun className="h-5 w-5 text-yellow-400" />
              )}
            </button>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label, active, theme }) {
  return (
    <Link
      to={to}
      className={`text-sm font-medium ${
        active 
          ? theme === 'dark'
            ? 'text-blue-400 border-b-2 border-blue-400' 
            : 'text-blue-600 border-b-2 border-blue-600'
          : theme === 'dark'
            ? 'text-gray-300 hover:text-white'
            : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  )
}