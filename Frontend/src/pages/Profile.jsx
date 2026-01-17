import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/services";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfileActions from "../components/Profile/ProfileActions";
import InfoCards from "../components/Profile/InfoCards";

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
  
  const [profileImage, setProfileImage] = useState(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader 
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        navigate={navigate}
        fullName={fullName}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow border border-gray-200">
          {/* Header with Image */}
          <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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

          <div className="pt-16 px-6 pb-6">
            {/* Name & Info */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h1>
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                {profile.programme && <span>{profile.programme}</span>}
                {profile.year_of_study && <span>• Year {profile.year_of_study}</span>}
              </div>
            </div>

            {/* Profile Information */}
            <ProfileInfo 
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
            />

            {/* Action Buttons */}
            {isOwnProfile && isEditing && (
              <ProfileActions 
                handleSave={handleSave}
                setIsEditing={setIsEditing}
                fetchProfile={fetchProfile}
                saving={saving}
              />
            )}
          </div>
        </div>

        {/* Info Cards (Only for own profile) */}
        {isOwnProfile && (
          <InfoCards currentUser={currentUser} />
        )}
      </div>
    </div>
  );
};

export default Profile;