import React, { useState, useEffect } from 'react';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard';
import { FiUsers, FiBell, FiPlus } from 'react-icons/fi';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [annForm, setAnnForm] = useState({ title: '', content: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, annRes] = await Promise.all([
          api.get('/api/v1/profiles/list/'),
          api.get('/api/announcements/')
        ]);
        setUsers(usersRes.data || []);
        setAnnouncements(annRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const postAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/announcements/create/', annForm);
      setAnnForm({ title: '', content: '' });
      const annRes = await api.get('/api/announcements/');
      setAnnouncements(annRes.data || []);
      alert('Announcement posted successfully!');
    } catch (error) {
      alert('Failed to post: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getFullName = (u) => {
    return u.full_name ||
      `${u.first_name || ''} ${u.last_name || ''}`.trim() ||
      u.username || "Unnamed User";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage announcements and users</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiUsers className="h-4 w-4" />
          <span>{users.length} users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Post Announcement */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiBell className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Post Announcement</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Share updates with all users</p>
            </div>
          </div>

          <form onSubmit={postAnnouncement} className="space-y-4">
            <div>
              <input
                placeholder="Announcement Title"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={annForm.title}
                onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <textarea
                placeholder="Announcement Content"
                rows="4"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={annForm.content}
                onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                required
              />
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <FiPlus className="h-5 w-5" />
              Post Announcement
            </button>
          </form>

          {/* Recent Announcements */}
          {announcements.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Recent Announcements
              </h3>
              <div className="space-y-4">
                {announcements.slice(0, 3).map((ann) => (
                  <AnnouncementCard key={ann.id} ann={ann} preview />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Users</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} registered users</p>
            </div>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-500 text-sm">No users found</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {getFullName(u).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{getFullName(u)}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                    {u.role || 'user'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}