import React from 'react';

const ProfileInfo = ({ profile, setProfile, isEditing }) => {
  const fields = [
    {
      label: "First Name",
      value: profile.first_name,
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      label: "Last Name",
      value: profile.last_name,
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      label: "Email Address",
      value: profile.email,
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: "Programme",
      value: profile.programme,
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              {field.icon}
              {field.label}
            </label>
            
            {isEditing ? (
              <input
                type="text"
                value={field.value || ""}
                onChange={(e) => setProfile({...profile, [field.label.toLowerCase().replace(' ', '_')]: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                {field.value || "Not provided"}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Year of Study
        </label>
        
        {isEditing ? (
          <input
            type="text"
            value={profile.year_of_study || ""}
            onChange={(e) => setProfile({...profile, year_of_study: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter year of study"
          />
        ) : (
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
            {profile.year_of_study || "Not provided"}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileInfo;