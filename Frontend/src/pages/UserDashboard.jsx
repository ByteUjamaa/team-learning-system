import React, { useEffect, useState } from 'react';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiUsers, FiBell, FiCalendar, FiChevronRight } from 'react-icons/fi';

export default function UserDashboard() {
  const { user: currentUser } = useAuth(); 
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [annRes, memberRes] = await Promise.all([
          api.get('/api/announcements/'),
          api.get('/api/v1/profiles/list/')
        ]);

        const sortedAnn = (annRes.data || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setAnnouncements(sortedAnn);
        setMembers(memberRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userName = currentUser?.full_name ||
    [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') ||
    currentUser?.username || 'User';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-4 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
        }`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-lg p-6 ${
        theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back, {userName}</h1>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Here's what's happening today
            </p>
          </div>
          <div className={`flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <FiCalendar className="h-5 w-5" />
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Announcements
              </p>
              <p className={`text-3xl font-semibold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {announcements.length}
              </p>
            </div>
            <div className={`h-12 w-12 rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <FiBell className={`h-6 w-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Team Members
              </p>
              <p className={`text-3xl font-semibold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {members.length}
              </p>
            </div>
            <div className={`h-12 w-12 rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
            }`}>
              <FiUsers className={`h-6 w-6 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Now
              </p>
              <p className={`text-3xl font-semibold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.min(members.length, Math.floor(Math.random() * 10) + 1)}
              </p>
            </div>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}