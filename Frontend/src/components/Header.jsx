import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiBell, FiInfo, FiSearch, FiMenu } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full 
                      bg-white dark:bg-gray-900 
                      border-b border-gray-200 dark:border-gray-800
                      backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiMenu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                            flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">TL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 
                             dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                  TeamLearning
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Collaborate & Grow</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="search"
                placeholder="Search teams, announcements..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                         bg-gray-100 dark:bg-gray-800 
                         border border-transparent
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                         text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink to="/" active={isActive('/')} icon={<FiHome />} label="Home" />
              <NavLink to="/Members" active={isActive('/Members')} icon={<FiUsers />} label="Members" />
              <NavLink to="/announcements" active={isActive('/announcements')} icon={<FiBell />} label="Announcements" />
              <NavLink to="/about" active={isActive('/about')} icon={<FiInfo />} label="About" />
            </nav>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-2">
              
              {/* Mobile Search */}
              <button className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiSearch className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              {/* Notifications */}
              <button className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiBell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full 
                               flex items-center justify-center text-xs text-white font-bold">
                  3
                </span>
              </button>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* User Profile */}
              <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <HiOutlineUserCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200
                ${active 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
    >
      <span className={`${active ? 'text-primary-600 dark:text-primary-400' : ''}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}