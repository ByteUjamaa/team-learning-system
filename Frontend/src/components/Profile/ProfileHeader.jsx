import React from 'react';

const ProfileHeader = ({ isOwnProfile, isEditing, setIsEditing, navigate, fullName }) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Back
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">
              {isOwnProfile ? "My Profile" : `${fullName}'s Profile`}
            </h1>
          </div>
          
          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;