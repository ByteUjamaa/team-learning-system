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
      await api.put("/api/v1/profiles/me/", profile, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage("Profile updated!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update");
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        
        {isOwnProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-500"></div>
        
        <div className="px-6 pb-6 -mt-8">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow">
              {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </div>

          {/* Name & Info */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-gray-900">{fullName}</h1>
            <p className="text-gray-600 text-sm mt-1">
              {profile.programme || "Team Member"}
            </p>
          </div>

          {/* Profile Info */}
          <div className="space-y-3">
            <InfoField label="First Name" value={profile.first_name} editing={isEditing} 
              onChange={(e) => setProfile({...profile, first_name: e.target.value})} />
            
            <InfoField label="Last Name" value={profile.last_name} editing={isEditing} 
              onChange={(e) => setProfile({...profile, last_name: e.target.value})} />
            
            <InfoField label="Email" value={profile.email} editing={isEditing} 
              onChange={(e) => setProfile({...profile, email: e.target.value})} />
            
            <InfoField label="Programme" value={profile.programme} editing={isEditing} 
              onChange={(e) => setProfile({...profile, programme: e.target.value})} />
            
            <InfoField label="Year of Study" value={profile.year_of_study} editing={isEditing} 
              onChange={(e) => setProfile({...profile, year_of_study: e.target.value})} />
          </div>

          {/* Action Buttons */}
          {isOwnProfile && isEditing && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, editing, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    
    {editing ? (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-1.5 rounded border border-gray-300 text-sm"
        placeholder={label}
      />
    ) : (
      <div className="px-3 py-1.5 bg-gray-50 rounded text-sm text-gray-700">
        {value || "-"}
      </div>
    )}
  </div>
);

export default Profile;