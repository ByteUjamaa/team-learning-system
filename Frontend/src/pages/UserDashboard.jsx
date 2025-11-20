// src/pages/UserDashboard.jsx

import React, { useEffect, useState } from 'react';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
          api.get('/api/v1/profiles/list/') // This should return ALL users
        ]);

        const sortedAnn = (annRes.data || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAnnouncements(sortedAnn);
        setMembers(memberRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Optional: show toast notification
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userName =
    currentUser?.full_name ||
    [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') ||
    currentUser?.username ||
    'User';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Welcome Header */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Welcome back, {userName} 
      </h1>

      {/* Announcements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Recent Announcements
          </h2>
          {announcements.length > 0 && (
            <Link
              to="/announcements"
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              See all →
            </Link>
          )}
        </div>

        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet</p>
        ) : (
          <div className="space-y-5">
            {announcements.slice(0, 5).map(ann => (
              <AnnouncementCard key={ann.id} ann={ann} preview />
            ))}
          </div>
        )}
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Team Members ({members.length})
        </h2>

        {members.length === 0 ? (
          <p className="text-gray-500">No team members found</p>
        ) : (
          <>
            <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {members.map(u => {
                const displayName = u.full_name || 
                  `${u.first_name || ''} ${u.last_name || ''}`.trim() || 
                  u.username || 
                  'Unknown User';

                const isCurrentUser = u.id === currentUser?.id;

                return (
                  <li
                    key={u.id}
                    className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-3 -mx-3 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Optional Avatar */}
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <Link
                          to={`/profile/${u.id}`}
                          className="font-medium text-indigo-600 hover:underline text-lg"
                        >
                          {displayName}
                        </Link>
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            You
                          </span>
                        )}
                        <p className="text-sm text-gray-500">{u.email}</p>
                        {u.role && (
                          <span className="text-xs text-gray-400 capitalize">
                            {u.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/profile/${u.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Profile →
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/profile"
                className="text-indigo-600 hover:underline font-medium"
              >
                → Edit My Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}