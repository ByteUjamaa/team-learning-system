import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/services";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
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
      // Send only text fields, not image
      const textData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        programme: profile.programme,
        year_of_study: profile.year_of_study,
      };
      
      await api.put("/api/v1/profiles/me/", textData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
      console.error("Save error:", error);
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
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to upload image");
      console.error("Image upload error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "User";
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">
                {isOwnProfile ? "My Profile" : `${fullName}'s Profile`}
              </h1>
            </div>
            
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            <div className="flex items-center">
              {message.includes("success") ? (
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message}
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-2 right-2 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
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

          <div className="pt-20 px-8 pb-8">
            {/* Name and Info */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                {profile.programme && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span>{profile.programme}</span>
                  </div>
                )}
                {profile.year_of_study && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Year {profile.year_of_study}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ProfileField 
                label="First Name"
                value={profile.first_name}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              
              <ProfileField 
                label="Last Name"
                value={profile.last_name}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              
              <ProfileField 
                label="Email Address"
                value={profile.email}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              <ProfileField 
                label="Programme"
                value={profile.programme}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, programme: e.target.value})}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
            </div>

            {/* Year of Study (Full Width) */}
            <div className="mb-8">
              <ProfileField 
                label="Year of Study"
                value={profile.year_of_study}
                editing={isEditing}
                onChange={(e) => setProfile({...profile, year_of_study: e.target.value})}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                fullWidth
              />
            </div>

            {/* Action Buttons */}
            {isOwnProfile && isEditing && (
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
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

// Profile Field Component
const ProfileField = ({ label, value, editing, onChange, icon, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      {icon}
      {label}
    </label>
    
    {editing ? (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
        {value || "Not provided"}
      </div>
    )}
  </div>
);

// Info Card Component
const InfoCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export default Profile;