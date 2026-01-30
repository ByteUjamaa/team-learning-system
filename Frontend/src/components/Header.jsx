// Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${theme === 'dark' ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
              <span className="text-white font-bold text-lg">TL</span>
            </div>
            
            {/* Full title on larger screens, short title on mobile */}
            <h1 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
              <span className="hidden sm:inline">Team Learning System</span>
              <span className="sm:hidden">Team LMS</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/dashboard" active={isActive('/dashboard')} label="Dashboard" theme={theme} />
            <NavLink to="/members" active={isActive('/members')} label="Members" theme={theme} />
            <NavLink to="/announcements" active={isActive('/announcements')} label="Announcements" theme={theme} />
            <NavLink to="/profile" active={isActive('/profile')} label="Profile" theme={theme} />
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5 text-yellow-400" />}
            </button>

            <button
              onClick={handleLogout}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <nav className="flex flex-col px-4 py-3 space-y-1">
            <NavLink to="/dashboard" active={isActive('/dashboard')} label="Dashboard" theme={theme} onClick={() => setIsMenuOpen(false)} />
            <NavLink to="/members" active={isActive('/members')} label="Members" theme={theme} onClick={() => setIsMenuOpen(false)} />
            <NavLink to="/announcements" active={isActive('/announcements')} label="Announcements" theme={theme} onClick={() => setIsMenuOpen(false)} />
            <NavLink to="/profile" active={isActive('/profile')} label="Profile" theme={theme} onClick={() => setIsMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label, active, theme, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${
        active
          ? theme === 'dark' ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50'
          : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );
}