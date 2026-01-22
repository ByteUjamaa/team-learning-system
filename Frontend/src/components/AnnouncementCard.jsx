import React, { useState } from 'react';
import { FiUser, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AnnouncementCard({ ann, theme = 'light', isExpanded = false, onToggle }) {
  const [isExpandedLocal, setIsExpandedLocal] = useState(isExpanded);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsExpandedLocal(!isExpandedLocal);
    }
  };

  const displayedContent = isExpanded || isExpandedLocal 
    ? ann.content 
    : ann.content.length > 150 
      ? ann.content.substring(0, 150) + '...' 
      : ann.content;

  const shouldShowToggle = ann.content.length > 150;

  return (
    <div className={`rounded-xl border transition-all duration-200 hover:shadow-md ${
      theme === 'dark'
        ? 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-5">
        {/* Title */}
        <div className="flex justify-between items-start gap-4">
          <h3 className={`font-semibold text-lg mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {ann.title}
          </h3>
          {shouldShowToggle && (
            <button
              onClick={handleToggle}
              className={`p-1 rounded ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={isExpanded || isExpandedLocal ? "Show less" : "Show more"}
            >
              {isExpanded || isExpandedLocal ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className="whitespace-pre-line">{displayedContent}</p>
          
          {shouldShowToggle && !(isExpanded || isExpandedLocal) && (
            <button
              onClick={handleToggle}
              className={`mt-2 text-sm font-medium ${
                theme === 'dark' 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Read more
            </button>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-blue-400' 
                  : 'bg-blue-50 text-blue-500'
              }`}>
                <FiUser className="h-4 w-4" />
              </div>
              <span className="font-medium">{ann.author_name || 'Admin'}</span>
            </div>
          </div>
          
          {ann.date && (
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gray-700' 
                  : 'bg-gray-100'
              }`}>
                <FiCalendar className="h-4 w-4" />
              </div>
              <span>{new Date(ann.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}