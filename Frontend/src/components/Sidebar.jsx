import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBell, FiSettings, FiUser, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  
  const navItems = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/teams', icon: <FiUsers />, label: 'Teams' },
    { to: '/announcements', icon: <FiBell />, label: 'Announcements' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-4">
      {/* User Info */}
      <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 
                    dark:from-gray-700 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                        flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'Member'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Navigation
      </h3>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400'
              }`
            }
          >
            <span className={`text-lg ${location.pathname === item.to ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}