import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/services";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1>
        <p className="text-gray-600">Browse all team members ({members.length})</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg className="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <p className="text-gray-500">No members found</p>
          {search && (
            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim() || "User";
            const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
            
            return (
              <Link
                key={member.id}
                to={`/profile/${member.id}`}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{fullName}</h3>
                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {member.programme && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {member.programme}
                        </span>
                      )}
                      {member.role && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {members.filter(m => m.role === 'admin').length}
            </p>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {members.filter(m => m.role === 'student').length}
            </p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {new Set(members.map(m => m.programme)).size}
            </p>
            <p className="text-sm text-gray-600">Programmes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;