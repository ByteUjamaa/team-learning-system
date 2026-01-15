import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar } from 'react-icons/fi';

export default function AnnouncementCard({ ann, preview = false, theme = 'light' }) {
  const displayedContent = preview && ann.content.length > 150 
    ? ann.content.substring(0, 150) + '...' 
    : ann.content;

  return (
    <div className={`rounded-lg p-4 mb-4 ${
      theme === 'dark'
        ? 'bg-gray-700/50 border border-gray-600'
        : 'bg-gray-50 border border-gray-200'
    }`}>
      <h3 className={`font-semibold text-lg mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {ann.title}
      </h3>
      <p className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {displayedContent}
      </p>
      
      {preview && (
        <Link 
          to="/announcements" 
          className={`inline-block text-sm font-medium ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          Read more →
        </Link>
      )}

      <div className={`flex items-center justify-between mt-4 text-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center gap-2">
          <FiUser className="h-3 w-3" />
          <span>{ann.author_name || 'Admin'}</span>
        </div>
        {ann.date && (
          <div className="flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            <span>{new Date(ann.date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}