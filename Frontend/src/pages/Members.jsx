import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/services";
import { FiSearch, FiUsers, FiUserCheck, FiBook, FiBookOpen } from 'react-icons/fi';

const Members = () => {
  const { theme } = useTheme();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/accounts/profiles/list/");
      setMembers(response.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const name = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
    const email = member.email?.toLowerCase() || '';
    const programme = member.programme?.toLowerCase() || '';
    return (
      name.includes(search.toLowerCase()) || 
      email.includes(search.toLowerCase()) ||
      programme.includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className={`animate-spin rounded-full h-8 w-8 border-t-2 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
        }`}></div>
      </div>
    );
  }

  // Calculate stats
  const totalMembers = members.length;
  const admins = members.filter(m => m.role === 'admin').length;
  const students = members.filter(m => m.role === 'student').length;
  const programmes = new Set(members.map(m => m.programme).filter(Boolean)).size;

  return (
    <div className={`max-w-6xl mx-auto p-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
              : 'bg-gradient-to-br from-blue-500 to-purple-500'
          }`}>
            <FiUsers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Team Members</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Browse all team members ({totalMembers})
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          theme={theme} 
          icon={<FiUsers />} 
          value={totalMembers} 
          label="Total Members" 
          color="blue" 
        />
        <StatCard 
          theme={theme} 
          icon={<FiUserCheck />} 
          value={admins} 
          label="Admins" 
          color="green" 
        />
        <StatCard 
          theme={theme} 
          icon={<FiBook />} 
          value={students} 
          label="Students" 
          color="purple" 
        />
        <StatCard 
          theme={theme} 
          icon={<FiBookOpen />} 
          value={programmes} 
          label="Programmes" 
          color="orange" 
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className={`absolute left-3 top-3 h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search members by name, email, or programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className={`text-center py-12 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <FiUsers className={`h-12 w-12 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            No members found
          </p>
          {search && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Try a different search term
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim() || "User";
            const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            
            return (
              <Link
                key={member.id}
                to={`/profile/${member.id}`}
                className={`rounded-xl border transition-all duration-200 hover:shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      <span className="text-white font-bold text-sm sm:text-base">
                        {initials}
                      </span>
                    </div>
                    
                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-base truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {fullName}
                      </h3>
                      <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {member.email}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {member.programme && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark'
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {member.programme}
                          </span>
                        )}
                        {member.role && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-gray-300 border border-gray-700'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        )}
                        {member.year_of_study && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark'
                              ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
                              : 'bg-purple-50 text-purple-700 border border-purple-100'
                          }`}>
                            Year {member.year_of_study}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <svg className={`h-5 w-5 flex-shrink-0 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ theme, icon, value, label, color }) => {
  const colorClasses = {
    blue: theme === 'dark' 
      ? 'from-blue-900/20 to-blue-800/20 border-blue-800' 
      : 'from-blue-50 to-blue-100 border-blue-100',
    green: theme === 'dark' 
      ? 'from-green-900/20 to-green-800/20 border-green-800' 
      : 'from-green-50 to-green-100 border-green-100',
    purple: theme === 'dark' 
      ? 'from-purple-900/20 to-purple-800/20 border-purple-800' 
      : 'from-purple-50 to-purple-100 border-purple-100',
    orange: theme === 'dark' 
      ? 'from-orange-900/20 to-orange-800/20 border-orange-800' 
      : 'from-orange-50 to-orange-100 border-orange-100',
  };

  const iconColors = {
    blue: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
    green: theme === 'dark' ? 'text-green-400' : 'text-green-500',
    purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
    orange: theme === 'dark' ? 'text-orange-400' : 'text-orange-500',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-xl border`}>
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`${iconColors[color]} text-xl sm:text-2xl`}>
            {icon}
          </div>
        </div>
        <div>
          <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Members;