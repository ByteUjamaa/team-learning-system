import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              TLMS
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user?.name || user?.email}
            </span>
            <Link
              to="/profile"
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}