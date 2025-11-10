import React from "react";

const ProfileActions = ({ isEditing, onEdit, onSave, onCancel }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
      {!isEditing ? (
        <button
          onClick={onEdit}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow-lg"
        >
          Edit Profile
        </button>
      ) : (
        <>
          <button
            onClick={onSave}
            className="w-full sm:flex-1 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-base shadow-lg"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:flex-1 bg-gray-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors text-base shadow-lg"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileActions;