import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/services';
import { useTheme } from '../context/ThemeContext';
import { FiLock, FiUser, FiMail } from 'react-icons/fi';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post('/api/v1/login/', {
          username: formData.username,
          password: formData.password,
        });
        
        const { access, refresh } = res.data;
        const user = { username: formData.username, role: 'user' };
        
        authLogin(access, refresh, user);
        navigate('/dashboard');
      } else {
        await api.post('/api/v1/register/', formData);
        alert('Registration successful! Please log in.');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-primary-50 via-white to-secondary-50'
    }`}>
      <div className={`w-full max-w-md rounded-xl shadow-lg p-8 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`h-16 w-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-primary-600 to-secondary-600'
              : 'bg-gradient-to-br from-primary-500 to-secondary-500'
          }`}>
            <span className="text-white font-bold text-2xl">TL</span>
          </div>
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className={`mt-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isLogin ? 'Sign in to continue' : 'Join our learning community'}
          </p>
        </div>

        {/* Error Message */}
        {serverError && (
          <div className={`mb-6 p-3 rounded text-sm border transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-red-900/20 text-red-300 border-red-800'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Username
            </label>
            <div className="relative">
              <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={isLogin ? "Enter username" : "Choose username"}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <FiLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500'
                }`}
                required
                minLength={6}
              />
            </div>
          </div>

        <button
               type="submit"
              disabled={loading}
             className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
             loading
             ? 'opacity-50 cursor-not-allowed'
             : theme === 'dark'
             ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white'
            : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white'
         }`}
          >
           {loading ? 'Loading...' : 'Submit'}
      </button>

        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ username: '', email: '', password: '' });
              setServerError('');
            }}
            className={`text-sm transition-colors duration-300 ${
              theme === 'dark' ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}