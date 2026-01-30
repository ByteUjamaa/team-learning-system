import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../services/services";
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ChangePassword() {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleShow = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.new_password.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/change-password/", {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });

      setSuccess(res.data.message || "Password changed successfully!");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.current_password?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to change password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          to="/profile"
          className={`inline-flex items-center gap-2 mb-8 text-sm font-medium ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Profile
        </Link>

        <div className={`rounded-xl shadow-lg p-6 sm:p-8 border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
            Change Password
          </h1>
          <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Update your account password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow("current")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow("new")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow("confirm")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div className="p-4 bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}
                ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Changing...
                </>
              ) : (
                <>
                  <FiLock size={20} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}