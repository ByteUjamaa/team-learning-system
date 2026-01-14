import React, { useEffect, useState } from 'react';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiBell } from 'react-icons/fi';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/announcements/').then(res => {
      const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setAnnouncements(sorted);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
            <FiArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <FiBell className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Announcements</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest news</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
          <FiBell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No announcements yet</p>
          <p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map(ann => (
            <AnnouncementCard key={ann.id} ann={ann} />
          ))}
        </div>
      )}
    </div>
  );
}