import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  FiSun, FiMoon, FiMenu, FiX, FiUser, FiLock, FiLogOut, FiChevronDown
} from 'react-icons/fi';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsUserDropdownOpen(false);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center font-bold text-white shadow-md ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              TL
            </div>
            <h1 className={`font-bold text-lg sm:text-xl truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="hidden sm:inline">Team Learning System</span>
              <span className="sm:hidden">TLS</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/members"
              className={`text-sm font-medium transition-colors ${
                isActive('/members')
                  ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Members
            </Link>
            <Link
              to="/announcements"
              className={`text-sm font-medium transition-colors ${
                isActive('/announcements')
                  ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Announcements
            </Link>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            {/* User Menu (only shown when logged in) */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {/* Avatar - always visible */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                    theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-600'
                  }`}>
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>

                  {/* Name - visible on sm+ */}
                  <span className="hidden sm:inline font-medium text-sm">
                    {user?.full_name || user?.username || 'User'}
                  </span>

                  <FiChevronDown className={`h-4 w-4 transition-transform ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <>
                    {/* Backdrop (click outside to close) */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />

                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border z-50 overflow-hidden
                      ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700
                            ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                        >
                          <FiUser className="h-5 w-5" />
                          My Profile
                        </Link>

                        <Link
                          to="/change-password"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700
                            ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                        >
                          <FiLock className="h-5 w-5" />
                          Change Password
                        </Link>

                        <div className={`border-t my-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />

                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/20
                            ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
                        >
                          <FiLogOut className="h-5 w-5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FiX className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              ) : (
                <FiMenu className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                isActive('/dashboard')
                  ? theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/members"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                isActive('/members')
                  ? theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              Members
            </Link>
            <Link
              to="/announcements"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                isActive('/announcements')
                  ? theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              Announcements
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}