// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";
// import api from "../services/services";
// import { FiEdit2, FiSave, FiX, FiMail, FiUser, FiBook, FiCalendar, FiCamera } from 'react-icons/fi';

// const Profile = () => {
//   const { id } = useParams();
//   const { user: currentUser } = useAuth();
//   const { theme } = useTheme();
  
//   const [profile, setProfile] = useState({ 
//     first_name: "", last_name: "", email: "", programme: "", year_of_study: "" 
//   });
//   const [profileImage, setProfileImage] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const isOwnProfile = !id || id === currentUser?.id;

//   useEffect(() => { fetchProfile(); }, [id]);

//   const fetchProfile = async () => {
//     try {
//       const API_URL = id ? `/api/v1/profiles/${id}/` : "/api/v1/profiles/me/";
//       const { data } = await api.get(API_URL);
      
//       setProfile({
//         first_name: data.first_name || "",
//         last_name: data.last_name || "",
//         email: data.email || "",
//         programme: data.programme || "",
//         year_of_study: data.year_of_study || "",
//       });
//       if (data.profile_picture) setProfileImage(data.profile_picture);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await api.put("/api/v1/profiles/me/", profile);
//       setMessage("Profile updated successfully");
//       setIsEditing(false);
//       setTimeout(() => setMessage(""), 2000);
//     } catch (error) {
//       setMessage("Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('profile_picture', file);

//     try {
//       const { data } = await api.put("/api/v1/profiles/me/", formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       if (data.profile_picture_url) setProfileImage(data.profile_picture_url);
//       setMessage("Profile picture updated");
//       setTimeout(() => setMessage(""), 2000);
//     } catch (error) {
//       setMessage("Failed to upload image");
//     }
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center py-12">
//       <div className={`animate-spin rounded-full h-8 w-8 border-t-2 ${
//         theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
//       }`}></div>
//     </div>
//   );

//   const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "User";
//   const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   return (
//     <div className="max-w-lg mx-auto">
//       {message && (
//         <div className={`mb-5 p-3 rounded-lg text-sm ${
//           message.includes("successfully") 
//             ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
//             : theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
//         }`}>
//           {message}
//         </div>
//       )}

//       <div className="relative mb-8">
//         <div className={`relative h-36 rounded-xl ${
//           theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'
//         }`}>
//           <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
//             <div className="relative">
//               {profileImage ? (
//                 <div className={`h-20 w-20 rounded-full border-3 ${
//                   theme === 'dark' ? 'border-gray-800' : 'border-white'
//                 } shadow-lg overflow-hidden`}>
//                   <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
//                 </div>
//               ) : (
//                 <div className={`h-20 w-20 rounded-full ${
//                   theme === 'dark' ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-blue-400 to-purple-500'
//                 } flex items-center justify-center border-3 ${
//                   theme === 'dark' ? 'border-gray-800' : 'border-white'
//                 } shadow-lg`}>
//                   <span className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-white'}`}>{initials}</span>
//                 </div>
//               )}
              
//               {isOwnProfile && !isEditing && (
//                 <button onClick={() => setIsEditing(true)} className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center ${
//                   theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
//                 }`}>
//                   <FiEdit2 className="h-4 w-4 text-white" />
//                 </button>
//               )}
              
//               {isOwnProfile && isEditing && (
//                 <label className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${
//                   theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
//                 }`}>
//                   <FiCamera className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
//                   <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
//                 </label>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="text-center mt-12 mb-6">
//           <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{fullName}</h1>
//           {(profile.programme || profile.year_of_study) && (
//             <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//               {profile.programme} {profile.year_of_study && `• Year ${profile.year_of_study}`}
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <InfoField theme={theme} icon={<FiUser />} label="First Name" value={profile.first_name} editing={isEditing} onChange={e => setProfile({...profile, first_name: e.target.value})} />
//         <InfoField theme={theme} icon={<FiUser />} label="Last Name" value={profile.last_name} editing={isEditing} onChange={e => setProfile({...profile, last_name: e.target.value})} />
//         <div className="md:col-span-2">
//           <InfoField theme={theme} icon={<FiMail />} label="Email Address" value={profile.email} editing={isEditing} onChange={e => setProfile({...profile, email: e.target.value})} />
//         </div>
//         <InfoField theme={theme} icon={<FiBook />} label="Programme" value={profile.programme} editing={isEditing} onChange={e => setProfile({...profile, programme: e.target.value})} />
//         <InfoField theme={theme} icon={<FiCalendar />} label="Year of Study" value={profile.year_of_study} editing={isEditing} onChange={e => setProfile({...profile, year_of_study: e.target.value})} />
//       </div>

//       {isOwnProfile && isEditing && (
//         <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//           <button onClick={handleSave} disabled={saving} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${
//             theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
//           } ${saving ? 'opacity-70' : ''}`}>
//             {saving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <FiSave className="h-4 w-4" />}
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//           <button onClick={() => { setIsEditing(falthose); fetchProfile(); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium ${
//             theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//           }`}>
//             <FiX className="h-4 w-4" />
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const InfoField = ({ theme, icon, label, value, editing, onChange }) => (
//   <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'}`}>
//     <div className="flex items-center gap-3">
//       <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
//         theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-500'
//       }`}>
//         {icon}
//       </div>
//       <div className="flex-1 min-w-0">
//         <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//           {label}
//         </label>
//         {editing ? (
//           <input type="text" value={value || ""} onChange={onChange} className={`w-full px-3 py-2 rounded border text-sm ${
//             theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//           }`} placeholder={label} />
//         ) : (
//           <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//             {value || <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Not provided</span>}
//           </p>
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default Profile;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/services";
import { FiEdit2, FiSave, FiX, FiMail, FiUser, FiBook, FiCalendar, FiCamera, FiArrowLeft } from 'react-icons/fi';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    programme: "",
    year_of_study: ""
  });

  const [profileImage, setProfileImage] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => { 
    console.log("Current user:", currentUser); // Debug
    fetchProfile(); 
  }, [id]);

  // ==========================
  // FETCH PROFILE
  // ==========================
  const fetchProfile = async () => {
    try {
      const API_URL = id 
        ? `/accounts/profiles/${id}/detail/`
        : "/accounts/profiles/me/";
      
      console.log("Fetching profile from:", API_URL);
      const { data } = await api.get(API_URL);
      console.log("Profile data:", data);
      
      // Save the profile ID from the response
      if (data.id) {
        setProfileId(data.id);
      }
      
      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        programme: data.programme || "",
        year_of_study: data.year_of_study || ""
      });
      
      if (data.profile_picture) {
        setProfileImage(data.profile_picture);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 404 && id) {
        navigate('/members');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SAVE TEXT DATA (NO IMAGE)
  // ==========================
  const handleSave = async () => {
    setSaving(true);
    try {
      // Use profileId from the API response
      if (!profileId) {
        setMessage("Error: Cannot update profile");
        return;
      }
      
      console.log("Updating profile ID:", profileId);
      console.log("Profile data to save:", profile);
      
      // Make sure to send with proper headers
      const response = await api.put(`/accounts/profiles/${profileId}/`, profile, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Update response:", response.data);
      setMessage("Profile updated");
      setIsEditing(false);
      fetchProfile();
      setTimeout(() => setMessage(""), 2000);
      
      // Refresh profile data
      fetchProfile();
    } catch (error) {
      console.error("Save error:", error);
      console.error("Error response:", error.response?.data);
      setMessage(`Failed to update: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // UPLOAD PROFILE IMAGE
  // ==========================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use profileId from the API response
    if (!profileId) {
      setMessage("Error: Cannot upload image");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const { data } = await api.patch(`/accounts/profiles/${profileId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.profile_picture) {
        setProfileImage(data.profile_picture);
      }
      setMessage("Picture updated");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed");
    }
  };

  // ==========================
  // UI (UNCHANGED)
  // ==========================
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-t-2 ${
            theme === "dark" ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );
  }

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-lg mx-auto">
      {message && (
        <div className={`mb-5 p-3 rounded-lg text-sm ${
          message.includes("updated") 
            ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            : theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {id && !isOwnProfile && (
        <button onClick={() => navigate('/members')} className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}>
          <FiArrowLeft className="h-4 w-4" />
          Back to Members
        </button>
      )}

      <div className="relative mb-8">
        <div
          className={`relative h-36 rounded-xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-800 to-gray-900"
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          }`}
        >
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {profileImage ? (
                <div
                  className={`h-20 w-20 rounded-full border-3 ${
                    theme === "dark" ? "border-gray-800" : "border-white"
                  } shadow-lg overflow-hidden`}
                >
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className={`h-20 w-20 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-900' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                } flex items-center justify-center border-3 ${
                  theme === 'dark' ? 'border-gray-800' : 'border-white'
                } shadow-lg`}>
                  <span className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-white'}`}>{initials}</span>
                </div>
              )}

              {isOwnProfile && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  <FiEdit2 className="h-4 w-4 text-white" />
                </button>
              )}

              {isOwnProfile && isEditing && (
                <label
                  className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <FiCamera
                    className={`h-4 w-4 ${
                      theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  />
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

        <div className="text-center mt-12 mb-6">
          <h1
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {fullName}
          </h1>
          {(profile.programme || profile.year_of_study) && (
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {profile.programme}{" "}
              {profile.year_of_study &&
                `• Year ${profile.year_of_study}`}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField theme={theme} icon={<FiUser />} label="First Name" value={profile.first_name} editing={isEditing && isOwnProfile} onChange={e => setProfile({...profile, first_name: e.target.value})} />
        <InfoField theme={theme} icon={<FiUser />} label="Last Name" value={profile.last_name} editing={isEditing && isOwnProfile} onChange={e => setProfile({...profile, last_name: e.target.value})} />
        <div className="md:col-span-2">
          <InfoField theme={theme} icon={<FiMail />} label="Email Address" value={profile.email} editing={isEditing && isOwnProfile} onChange={e => setProfile({...profile, email: e.target.value})} />
        </div>
        <InfoField theme={theme} icon={<FiBook />} label="Programme" value={profile.programme} editing={isEditing && isOwnProfile} onChange={e => setProfile({...profile, programme: e.target.value})} />
        <InfoField theme={theme} icon={<FiCalendar />} label="Year of Study" value={profile.year_of_study} editing={isEditing && isOwnProfile} onChange={e => setProfile({...profile, year_of_study: e.target.value})} />
      </div>

      {isOwnProfile && isEditing && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleSave} disabled={saving} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${saving ? 'opacity-70' : ''}`}>
            {saving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <FiSave className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              fetchProfile();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium ${
              theme === "dark"
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiX className="h-4 w-4" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ theme, icon, label, value, editing, onChange }) => (
  <div
    className={`p-4 rounded-lg border ${
      theme === "dark"
        ? "bg-gray-800/30 border-gray-700"
        : "bg-white border-gray-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
          theme === "dark"
            ? "bg-gray-700 text-blue-400"
            : "bg-blue-50 text-blue-500"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <label
          className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </label>
        {editing ? (
          <input
            type="text"
            value={value || ""}
            onChange={onChange}
            className={`w-full px-3 py-2 rounded border text-sm ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder={label}
          />
        ) : (
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {value || (
              <span
                className={
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }
              >
                Not provided
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default Profile;
