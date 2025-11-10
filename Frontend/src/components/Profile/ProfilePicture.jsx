import React from "react";

const ProfilePicture = ({ previewImage, username, isEditing, onImageChange, onRemoveImage }) => {
  return (
    <div className="flex flex-col items-center mb-10 w-full">
      <div className="relative">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile"
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl"
          />
        ) : (
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-linear-to-br from-blue-400 to-blue-500 flex items-center justify-center border-4 border-white shadow-xl">
            <span className="text-white text-4xl sm:text-5xl font-bold">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md justify-center">
          <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center text-base shadow-lg">
            Change Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </label>
          
          {previewImage && (
            <button
              type="button"
              onClick={onRemoveImage}
              className="bg-gray-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors text-base shadow-lg"
            >
              Remove Photo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;