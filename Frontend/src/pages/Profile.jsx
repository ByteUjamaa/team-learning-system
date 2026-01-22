import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/services";
import { FiEdit2, FiSave, FiX, FiMail, FiUser, FiBook, FiCalendar, FiCamera } from 'react-icons/fi';

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
  
  const [profileImage, setProfileImage] = useState("");
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
      const data = response.data;
      
      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        programme: data.programme || "",
        year_of_study: data.year_of_study || "",
      });
      
      if (data.profile_picture) {
        setProfileImage(data.profile_picture);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/v1/profiles/me/", profile, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await api.put("/api/v1/profiles/me/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.profile_picture) {
        setProfileImage(response.data.profile_picture);
      }
      setMessage("Profile picture updated!");
      setTimeout(() => setMessage(""), 2000);
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
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Message Alert */}
      {message && (
        <div className={`max-w-2xl mx-auto mb-6 p-3 rounded-lg ${message.includes("successfully") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Profile Container - No card, just content */}
        <div className="relative">
          {/* Profile Header with Image */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-48 rounded-xl mb-12">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {profileImage ? (
                  <div className="h-28 w-28 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-2xl">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>
                )}
                
                {/* Edit Profile Button (Pen icon) */}
                {isOwnProfile && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-2 -right-2 h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-xl hover:bg-blue-600 transition-colors hover:scale-110 duration-200"
                  >
                    <FiEdit2 className="h-5 w-5 text-white" />
                  </button>
                )}
                
                {/* Camera icon for image upload during edit */}
                {isOwnProfile && isEditing && (
                  <label className="absolute -bottom-2 -right-2 h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-gray-50 transition-colors hover:scale-110 duration-200">
                    <FiCamera className="h-5 w-5 text-gray-700" />
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
          </div>

          {/* Profile Content - Directly on the background */}
          <div className="bg-transparent">
            {/* Name Display */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
              {(profile.programme || profile.year_of_study) && (
                <p className="text-gray-600 text-sm mt-2">
                  {profile.programme}
                  {profile.programme && profile.year_of_study && " • "}
                  {profile.year_of_study && `Year ${profile.year_of_study}`}
                </p>
              )}
            </div>

            {/* Two-column Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField 
                icon={<FiUser className="h-4 w-4 text-blue-500" />}
                label="First Name"
                value={profile.first_name}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
              />
              
              <InfoField 
                icon={<FiUser className="h-4 w-4 text-blue-500" />}
                label="Last Name"
                value={profile.last_name}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
              />
              
              <div className="md:col-span-2">
                <InfoField 
                  icon={<FiMail className="h-4 w-4 text-blue-500" />}
                  label="Email Address"
                  value={profile.email}
                  editing={isEditing}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              
              <InfoField 
                icon={<FiBook className="h-4 w-4 text-blue-500" />}
                label="Programme"
                value={profile.programme}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, programme: e.target.value})}
              />
              
              <InfoField 
                icon={<FiCalendar className="h-4 w-4 text-blue-500" />}
                label="Year of Study"
                value={profile.year_of_study}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, year_of_study: e.target.value})}
              />
            </div>

            {/* Action Buttons */}
            {isOwnProfile && isEditing && (
              <div className="flex gap-4 mt-10 pt-8 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-md disabled:opacity-70 transition-all hover:shadow-lg"
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
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors hover:border-gray-400"
                >
                  <FiX className="h-5 w-5" />
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

const InfoField = ({ icon, label, value, editing, onChange }) => (
  <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors hover:shadow-sm">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {label}
        </label>
        {editing ? (
          <input
            type="text"
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <p className="text-gray-800 text-sm font-medium">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default Profile;