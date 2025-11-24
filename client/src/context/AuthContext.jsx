import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Use Railway backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://moodify-production-2519.up.railway.app';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {};
      
      // Add JWT token to Authorization header if available
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_URL}/api/auth/user`, { 
        withCredentials: true,
        headers
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
      // Clear invalid token
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${API_URL}/api/auth/login`;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {};
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      await axios.post(`${API_URL}/api/auth/logout`, {}, { 
        withCredentials: true,
        headers
      });
      
      // Clear token and user
      localStorage.removeItem('authToken');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Clear token anyway
      localStorage.removeItem('authToken');
      setUser(null);
      window.location.href = '/';
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
