import React from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const ProfileActions = ({ handleSave, setIsEditing, fetchProfile, saving }) => {
  return (
    <div className="flex gap-3 pt-6 border-t border-gray-100">
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-70"
      >
        {saving ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Saving...
          </>
        ) : (
          <>
            <FiSave className="h-4 w-4" />
            Save Changes
          </>
        )}
      </button>
      
      <button
        onClick={() => {
          setIsEditing(false);
          fetchProfile();
        }}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
      >
        <FiX className="h-4 w-4" />
        Cancel
      </button>
    </div>
  );
};

export default ProfileActions;