import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/services";
import { FiEdit2, FiSave, FiX, FiArrowLeft, FiCamera, FiMail, FiUser, FiBook, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  
  const [profile, setProfile] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    programme: "", 
    year_of_study: "" 
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const API_URL = id ? `/api/v1/profiles/${id}/` : "/api/v1/profiles/me/";
      const response = await api.get(API_URL);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/v1/profiles/me/", profile);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "User";
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back
        </button>
        
        {isOwnProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        <div className="px-6 pb-6 -mt-16">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
                {initials}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 h-10 w-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                  <FiCamera className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.programme || "Team Member"}
            </p>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoField 
              icon={<FiUser />}
              label="First Name"
              value={profile.first_name}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, first_name: e.target.value})}
              theme={theme}
            />
            
            <InfoField 
              icon={<FiUser />}
              label="Last Name"
              value={profile.last_name}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, last_name: e.target.value})}
              theme={theme}
            />
            
            <InfoField 
              icon={<FiMail />}
              label="Email"
              value={profile.email}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              theme={theme}
            />
            
            <InfoField 
              icon={<FiBook />}
              label="Programme"
              value={profile.programme}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, programme: e.target.value})}
              theme={theme}
            />
            
            <div className="md:col-span-2">
              <InfoField 
                icon={<FiCalendar />}
                label="Year of Study"
                value={profile.year_of_study}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, year_of_study: e.target.value})}
                theme={theme}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && isEditing && (
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FiX className="h-5 w-5" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats (Optional) */}
      {isOwnProfile && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Teams" value="3" />
          <StatBox label="Projects" value="5" />
          <StatBox label="Announcements" value="12" />
          <StatBox label="Member Since" value="2023" />
        </div>
      )}
    </div>
  );
};

// InfoField Component
const InfoField = ({ icon, label, value, editing, onChange, theme }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    </div>
    
    {editing ? (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300">
        {value || "Not provided"}
      </div>
    )}
  </div>
);

// StatBox Component
const StatBox = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

export default Profile;