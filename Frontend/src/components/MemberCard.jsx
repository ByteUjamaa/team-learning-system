import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiChevronRight, FiStar, FiActivity, FiTarget } from 'react-icons/fi';

export default function TeamCard({ team }) {
  const progress = team.progress || 0;
  const activeMembers = team.activeMembers || 0;
  const totalMembers = team.members || 0;
  const activePercentage = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="group relative">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 
                    p-6 transition-all duration-300
                    hover:shadow-elevated hover:border-primary-300 dark:hover:border-primary-700
                    hover:scale-[1.01]">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getAvatarColor(team.name)} 
                          flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-xl">
                {team.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              {team.featured && (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                  <FiStar className="h-4 w-4" />
                  <span className="text-xs font-semibold">Featured</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                {team.name}
              </h3>
            </div>
          </div>
          
          <span className="px-3 py-1 rounded-full text-xs font-semibold 
                         bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            {team.category || 'Learning'}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
          {team.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiUsers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalMembers}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiActivity className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {activePercentage}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiTarget className="h-4 w-4 text-primary-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {progress}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 dark:text-gray-300">Team Progress</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full 
                         transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button className="flex-1 px-4 py-2.5 rounded-lg 
                           bg-primary-600 hover:bg-primary-700
                           text-white font-medium
                           transition-all duration-200
                           transform hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Join Team
          </button>
          
          <Link
            to={`/teams/${team.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                     border border-gray-300 dark:border-gray-700
                     hover:border-primary-500 dark:hover:border-primary-500
                     text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400
                     font-medium transition-all duration-200"
          >
            Details
            <FiChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Online indicator */}
        {team.isOnline && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 h-3 w-3 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}