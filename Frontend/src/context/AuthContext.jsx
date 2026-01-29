// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token expiry
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh || isTokenExpired(refresh)) {
      logout();
      return false;
    }

    try {
      const res = await api.post('/accounts/token/refresh/', { refresh });
      localStorage.setItem('access_token', res.data.access);
      const decoded = jwtDecode(res.data.access);
      
      // Try to get user from localStorage first
      const storedUser = localStorage.getItem('user');
      let userData;
      
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
      
      if (!userData) {
        // Extract user data from token as fallback
        userData = {
          username: decoded.username || decoded.sub,
          email: decoded.email || '',
          role: decoded.role || 'user',
          id: decoded.user_id || decoded.id || null
        };
      }
      
      setUser(userData);
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    const access = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (access && !isTokenExpired(access)) {
      const decoded = jwtDecode(access);
      
      // Try to get user from localStorage first, then from token
      let userData;
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
      
      if (!userData) {
        // Extract user data from token
        userData = {
          username: decoded.username || decoded.sub,
          email: decoded.email || '',
          role: decoded.role || 'user',
          id: decoded.user_id || decoded.id || null
        };
      }
      
      setUser(userData);
    } else if (access) {
      // Try refresh
      refreshToken().then(success => {
        if (!success) setUser(null);
      });
    }
    setLoading(false);
  }, []);

  // Axios interceptor: auto-refresh on 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await refreshToken();
          if (refreshed) {
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    // Make sure userData has all necessary fields
    const completeUserData = {
      ...userData,
      id: userData.id || userData.user_id || userData.pk || null,
      username: userData.username || userData.email?.split('@')[0] || '',
      email: userData.email || '',
      role: userData.role || 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(completeUserData));
    setUser(completeUserData);
    return completeUserData;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};