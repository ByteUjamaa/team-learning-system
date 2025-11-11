// src/components/AuthForm.jsx
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/services';

// Zod Schema
const authSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data) => {
  setServerError('');
  setLoading(true);

  try {
    if (isLogin) {
      // LOGIN
      const res = await api.post('/accounts/login/', {
        email: data.email,
        password: data.password,
      });

      // Use the response!
      const { token, user } = res.data;

      // Call context login to store token + user
      authLogin(token, user);

      // Navigate based on role
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      // REGISTER
      await api.post('/accounts/register/', {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      alert('Registration successful! Please log in.');
      setIsLogin(true);
      reset();
    }
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.email?.[0] ||
      err.response?.data?.non_field_errors?.[0] ||
      'Invalid email or password';
    setServerError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">TLMS</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username (Register Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                {...register('username')}
                type="text"
                placeholder="christinaJustine"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.username.message}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="christina@example.com"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing...
              </span>
            ) : isLogin ? (
              'Log In'
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              reset();
              setServerError('');
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}