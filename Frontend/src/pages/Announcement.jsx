import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiBell, FiPlus } from 'react-icons/fi';

export default function Announcements() {
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/api/announcements/');
      const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setAnnouncements(sorted);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnnouncement = (id) => {
    setExpandedAnnouncementId(expandedAnnouncementId === id ? null : id);
  };

  return (
    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
              : 'bg-gradient-to-br from-blue-500 to-purple-500'
          }`}>
            <FiBell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Announcements</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Stay updated with the latest news
            </p>
          </div>
        </div>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Create Announcement Button (if admin) */}
      {/* <div className="mb-6 flex justify-end">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
          theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}>
          <FiPlus className="h-4 w-4" />
          New Announcement
        </button>
      </div> */}

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 ${
            theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
          }`}></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <FiBell className={`h-16 w-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No announcements yet
          </p>
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Check back later for updates
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <AnnouncementCard 
              key={ann.id} 
              ann={ann} 
              theme={theme}
              isExpanded={expandedAnnouncementId === ann.id}
              onToggle={() => toggleAnnouncement(ann.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}