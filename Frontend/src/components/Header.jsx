import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut } from 'react-icons/fi'

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              <span className="text-white font-bold">TL</span>
            </div>
            <h1 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Team Learning Management System
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <NavLink to="/dashboard" active={isActive('/dashboard')} label="Dashboard" theme={theme} />
            <NavLink to="/members" active={isActive('/members')} label="Members" theme={theme} />
            <NavLink to="/announcements" active={isActive('/announcements')} label="Announcements" theme={theme} />
            <NavLink to="/profile" active={isActive('/profile')} label="Profile" theme={theme} />
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
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