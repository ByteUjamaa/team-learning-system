import React from 'react';

const ProfileInfo = ({ profile, setProfile, isEditing }) => {
  const updateField = (field, value) => {
    setProfile({...profile, [field]: value});
  };

  return (
    <div className="space-y-4">
      <Field 
        label="First Name"
        value={profile.first_name}
        editing={isEditing}
        onChange={(e) => updateField('first_name', e.target.value)}
      />
      
      <Field 
        label="Last Name"
        value={profile.last_name}
        editing={isEditing}
        onChange={(e) => updateField('last_name', e.target.value)}
      />
      
      <Field 
        label="Email"
        value={profile.email}
        editing={isEditing}
        onChange={(e) => updateField('email', e.target.value)}
      />
      
      <Field 
        label="Programme"
        value={profile.programme}
        editing={isEditing}
        onChange={(e) => updateField('programme', e.target.value)}
      />
      
      <Field 
        label="Year of Study"
        value={profile.year_of_study}
        editing={isEditing}
        onChange={(e) => updateField('year_of_study', e.target.value)}
      />
    </div>
  );
};

const Field = ({ label, value, editing, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    
    {editing ? (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-2 rounded border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <div className="px-3 py-2 bg-gray-50 rounded text-gray-700">
        {value || "Not provided"}
      </div>
    )}
  </div>
);

export default ProfileInfo;