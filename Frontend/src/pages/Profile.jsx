import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/services";
import { FiEdit2, FiSave, FiX, FiArrowLeft, FiCamera } from 'react-icons/fi';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    programme: "", 
    year_of_study: "" 
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Camera/image upload function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await api.put("/api/v1/profiles/me/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage("Profile picture updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "User";
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        {isOwnProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
          >
            <FiEdit2 className="h-3 w-3" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Profile Header */}
        <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        
        <div className="px-4 pb-4 -mt-10">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow">
                {initials}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer">
                  <FiCamera className="h-3 w-3 text-gray-700" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900">{fullName}</h1>
            <p className="text-gray-600 text-sm">
              {profile.programme || "Team Member"}
            </p>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 mb-6">
            <InfoField 
              label="First Name"
              value={profile.first_name}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, first_name: e.target.value})}
            />
            
            <InfoField 
              label="Last Name"
              value={profile.last_name}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, last_name: e.target.value})}
            />
            
            <InfoField 
              label="Email"
              value={profile.email}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
            
            <InfoField 
              label="Programme"
              value={profile.programme}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, programme: e.target.value})}
            />
            
            <InfoField 
              label="Year of Study"
              value={profile.year_of_study}
              editing={isEditing}
              onChange={(e) => setProfile({...profile, year_of_study: e.target.value})}
            />
          </div>

          {/* Action Buttons */}
          {isOwnProfile && isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="h-3 w-3" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
              >
                <FiX className="h-3 w-3" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// InfoField Component
const InfoField = ({ label, value, editing, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    
    {editing ? (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-1.5 rounded border border-gray-300 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <div className="px-3 py-2 bg-gray-50 rounded text-gray-700 text-sm">
        {value || "Not provided"}
      </div>
    )}
  </div>
);

export default Profile;