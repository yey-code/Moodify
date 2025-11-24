import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { DEMO_USER } from '../utils/demoData';

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
    // Check for demo mode
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    if (isDemoMode) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

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
  const logout = async () => {
    try {
      // Check if demo mode
      if (localStorage.getItem('demoMode') === 'true') {
        localStorage.removeItem('demoMode');
        setUser(null);
        window.location.href = '/';
        return;
      }

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
  const value = {
    user,
    loading,
    login,
    loginDemo,
    logout,
    checkAuth,
    isDemo: user?.isDemo || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}     // Clear token anyway
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
