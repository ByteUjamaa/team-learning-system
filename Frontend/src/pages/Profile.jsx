import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../components/Profile/ProfilePicture";
import ProfileForm from "../components/Profile/ProfileForm";
import ProfileActions from "../components/Profile/ProfileActions";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "", email: "", career: "", github_username: "", birthday: "", hobby: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const API_URL = "http://localhost:8000/api/profile/";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(response.data);
      if (response.data.profile_pic) {
        setPreviewImage(response.data.profile_pic);
      }
    } catch (error) {
      setMessage("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setPreviewImage("");
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => formData.append(key, profile[key]));
      
      if (profilePic) formData.append('profile_pic', profilePic);
      else if (previewImage === "") formData.append('remove_profile_pic', 'true');

      await axios.put(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage("Profile updated successfully ✅");
      setIsEditing(false);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setMessage("Error updating profile ❌");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      {/* Added max-w-6xl for very wide but with rounded corners */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header - Light Blue with White Text */}
          <div className="bg-blue-500 px-6 py-8 sm:px-10 sm:py-12 rounded-t-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">My Profile</h1>
            <p className="text-blue-100 text-lg sm:text-xl mt-3 text-center">Manage your personal information</p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {message && (
              <div className={`mb-8 p-4 rounded-xl ${
                message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <p className="text-sm font-medium text-center sm:text-left">{message}</p>
              </div>
            )}

            <ProfilePicture
              previewImage={previewImage}
              username={profile.username}
              isEditing={isEditing}
              onImageChange={handleImageChange}
              onRemoveImage={removeProfilePic}
            />

            <ProfileForm
              profile={profile}
              isEditing={isEditing}
              onChange={handleChange}
            />

            <ProfileActions
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;