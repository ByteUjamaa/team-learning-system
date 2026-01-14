import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/services";
import { FiUser, FiMail, FiBook, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState({ first_name: "", last_name: "", email: "", programme: "", year_of_study: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const API_URL = id ? `/api/v1/profiles/${id}/` : "/api/v1/profiles/me/";
      const response = await api.get(API_URL);
      const data = response.data;

      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        programme: data.programme || "",
        year_of_study: data.year_of_study || "",
      });
      setIsOwnProfile(!id || Number(id) === currentUser?.id);
    } catch (error) {
      setMessage("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      await api.put("/api/v1/profiles/me/", profile);
      setMessage("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "User";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile ? "My Profile" : `${fullName}'s Profile`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isOwnProfile ? "Manage your personal information" : "View team member details"}
            </p>
          </div>
        </div>
        
        {isOwnProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes("success") 
            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300" 
            : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300"
        }`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-5xl font-bold mb-4">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Team Member</p>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                icon={<FiUser />}
                label="First Name"
                value={profile.first_name}
                isEditing={isEditing}
                onChange={(value) => setProfile({...profile, first_name: value})}
              />
              <InfoField
                icon={<FiUser />}
                label="Last Name"
                value={profile.last_name}
                isEditing={isEditing}
                onChange={(value) => setProfile({...profile, last_name: value})}
              />
              <InfoField
                icon={<FiMail />}
                label="Email"
                value={profile.email}
                isEditing={isEditing}
                onChange={(value) => setProfile({...profile, email: value})}
              />
              <InfoField
                icon={<FiBook />}
                label="Programme"
                value={profile.programme}
                isEditing={isEditing}
                onChange={(value) => setProfile({...profile, programme: value})}
              />
              <InfoField
                icon={<FiCalendar />}
                label="Year of Study"
                value={profile.year_of_study}
                isEditing={isEditing}
                onChange={(value) => setProfile({...profile, year_of_study: value})}
              />
            </div>

            {/* Action Buttons */}
            {isOwnProfile && isEditing && (
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium disabled:opacity-50"
                >
                  <FiSave className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component
const InfoField = ({ icon, label, value, isEditing, onChange }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {icon}
      {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
      />
    ) : (
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white">
        {value || 'Not provided'}
      </div>
    )}
  </div>
);

export default Profile;