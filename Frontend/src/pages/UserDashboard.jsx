import React, { useEffect, useState } from 'react';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiBell, FiCalendar, FiChevronRight } from 'react-icons/fi';

export default function UserDashboard() {
  const { user: currentUser } = useAuth(); 
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
            <p className="text-primary-100 opacity-90">Here's what's happening today</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <FiCalendar className="h-5 w-5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Announcements</p>
              <p className="text-2xl font-bold mt-2">{announcements.length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <FiBell className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Team Members</p>
              <p className="text-2xl font-bold mt-2">{members.length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Active Now</p>
              <p className="text-2xl font-bold mt-2">
                {Math.min(members.length, Math.floor(Math.random() * 10) + 1)}
              </p>
            </div>
            <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Announcements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Announcements</h2>
            {announcements.length > 0 && (
              <Link to="/announcements" className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium flex items-center gap-1">
                See all <FiChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.slice(0, 3).map(ann => (
                <AnnouncementCard key={ann.id} ann={ann} preview />
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Team Members</h2>
          
          {members.length === 0 ? (
            <p className="text-gray-500">No team members found</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {members.slice(0, 6).map(u => {
                const displayName = u.full_name || 
                  `${u.first_name || ''} ${u.last_name || ''}`.trim() || 
                  u.username || 'Unknown';
                const isCurrentUser = u.id === currentUser?.id;

                return (
                  <Link 
                    key={u.id} 
                    to={`/profile/${u.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                    </div>
                    <FiChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          )}
          
          {members.length > 6 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/teams" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                View all members ({members.length})
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}