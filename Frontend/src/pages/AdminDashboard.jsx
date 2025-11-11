import { useState, useEffect } from 'react';
import api from '../services/services';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [annForm, setAnnForm] = useState({ title: '', content: '' });

  useEffect(() => {
    api.get('/users/').then(res => setUsers(res.data));
  }, []);

  const postAnnouncement = async (e) => {
    e.preventDefault();
    await api.post('/announcements/', annForm);
    setAnnForm({ title: '', content: '' });
    alert('Posted!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Panel</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Post Announcement</h2>
          <form onSubmit={postAnnouncement} className="space-y-4">
            <input
              placeholder="Title"
              className="w-full p-2 border rounded dark:bg-gray-700"
              value={annForm.title}
              onChange={e => setAnnForm({ ...annForm, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              rows="3"
              className="w-full p-2 border rounded dark:bg-gray-700"
              value={annForm.content}
              onChange={e => setAnnForm({ ...annForm, content: e.target.value })}
            />
            <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
              Post
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="flex justify-between text-sm">
                <span>{u.name}</span>
                <span className="text-gray-500">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}