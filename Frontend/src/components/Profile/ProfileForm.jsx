import React from "react";

const ProfileForm = ({ profile, isEditing, onChange }) => {
  const fields = [
    { name: "first_name", type: "text", placeholder: "Enter your first name" },
    { name: "last_name", type: "text", placeholder: "Enter your last name" },
    { name: "email", type: "email", placeholder: "Enter your email address" },
    { name: "programme", type: "text", placeholder: "Your programme or course" },
    { name: "year_of_study", type: "text", placeholder: "Year of study (e.g., Year 1, Year 2)" },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {fields.map((field) => (
        <div 
          key={field.name} 
          className={field.fullWidth ? 'lg:col-span-2 w-full' : 'w-full'}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
            {field.name.replace('_', ' ')}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={profile[field.name]}
            onChange={onChange}
            disabled={!isEditing}
            placeholder={field.placeholder}
            className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
          />
        </div>
      ))}
    </div>
  );
};

export default ProfileForm;