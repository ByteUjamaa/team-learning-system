import React, { useState, useEffect } from 'react';
import api from '../services/services';
import AnnouncementCard from '../components/AnnouncementCard'; // FIXED: correct path

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [annForm, setAnnForm] = useState({ title: '', content: '' });
  const [announcements, setAnnouncements] = useState([]);

  // Fetch users + announcements
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
        setUsers([]);
        setAnnouncements([]);
      }
    };

    fetchData();
  }, []);

  // Post new announcement
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

  // Helper for full names
  const getFullName = (u) => {
    return (
      u.full_name ||
      `${u.first_name || ''} ${u.last_name || ''}`.trim() ||
      u.username ||
      "Unnamed User"
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* === PAGE TITLE === */}
      <h1 className="text-3xl font-bold text-red-600">Admin Panel</h1>

      {/* === LAYOUT WRAPPER (2 columns on large screens) === */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* ============= POST ANNOUNCEMENT CARD ============= */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Announcement</h2>

          <form onSubmit={postAnnouncement} className="space-y-4">
            <input
              placeholder="Title"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={annForm.title}
              onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Content"
              rows="3"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={annForm.content}
              onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
              required
            />

            <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
              Post
            </button>
          </form>

          {/* Recent announcements preview */}
          {announcements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
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

        {/* ============= ALL USERS LIST ============= */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">All Users</h2>

          {users.length === 0 ? (
            <p className="text-gray-500 text-sm">No users found</p>
          ) : (
            <ul className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-start border-b pb-2 dark:border-gray-700"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {getFullName(u)}
                  </span>

                  <span className="text-gray-500 text-sm">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
