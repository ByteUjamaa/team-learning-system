import { useEffect, useState } from 'react';
import api from '../services/services';
import AnnouncementCard from '../pages/Announcement';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [annRes, teamRes] = await Promise.all([
        api.get('/announcements/'),
        api.get('/users/')
      ]);
      setAnnouncements(annRes.data);
      setTeam(teamRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, User!</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          {announcements.map(ann => (
            <AnnouncementCard key={ann.id} ann={ann} />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <ul className="space-y-3">
            {team.map(u => (
              <li key={u.id} className="flex justify-between">
                <span>{u.name}</span>
                <span className="text-sm text-gray-500">{u.email}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/profile"
            className="mt-4 inline-block text-indigo-600 hover:underline"
          >
            → Edit My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}