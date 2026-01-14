import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiChevronRight, FiAlertCircle, FiStar } from 'react-icons/fi';
import { format } from 'date-fns';

export default function AnnouncementCard({ ann, preview = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayDate = ann.date ? format(new Date(ann.date), 'MMM dd, yyyy') : '';

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    normal: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };

  return (
    <div className="group relative">
      {/* Card */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 
                    p-6 transition-all duration-300 
                    hover:shadow-elevated hover:border-primary-300 dark:hover:border-primary-700
                    hover:scale-[1.01]">
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 
                      rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {ann.pinned && (
              <FiStar className="h-5 w-5 text-yellow-500" />
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[ann.priority || 'normal']}`}>
              {ann.priority ? ann.priority.toUpperCase() : 'ANNOUNCEMENT'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiCalendar className="h-4 w-4" />
            <span>{displayDate}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {ann.title}
        </h3>

        {/* Content */}
        <div className="mb-4">
          <p className={`text-gray-600 dark:text-gray-300 ${!isExpanded && preview ? 'line-clamp-3' : ''}`}>
            {isExpanded || !preview || ann.content.length <= 200 
              ? ann.content 
              : `${ann.content.substring(0, 200)}...`
            }
          </p>
          
          {preview && ann.content.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-primary-600 dark:text-primary-400 font-medium 
                       hover:text-primary-700 dark:hover:text-primary-300 
                       flex items-center gap-1 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Read more'}
              <FiChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 
                          flex items-center justify-center">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {ann.author_name || 'Admin'}
              </p>
              {ann.author_role && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ann.author_role}
                </p>
              )}
            </div>
          </div>

          {preview && (
            <Link
              to={`/announcements/${ann.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-primary-50 dark:bg-primary-900/20 
                       text-primary-700 dark:text-primary-300
                       hover:bg-primary-100 dark:hover:bg-primary-900/40
                       font-medium transition-all duration-200
                       group/btn"
            >
              View details
              <FiChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          )}
        </div>

        {/* New indicator */}
        {ann.isNew && (
          <div className="absolute -top-2 -right-2">
            <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse">
              <div className="h-4 w-4 bg-red-400 rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}