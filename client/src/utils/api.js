import axios from 'axios';

// Use environment variable for API URL, fallback to local development
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Auth endpoints
export const auth = {
  getUser: () => api.get('/auth/user'),
  logout: () => api.post('/auth/logout')
};

// Mood analysis endpoints
export const mood = {
  analyze: (data) => api.post('/mood/analyze', data),
  sentiment: (text) => api.post('/mood/sentiment', { text }),
  getMoods: () => api.get('/mood/moods'),
  getHobbies: () => api.get('/mood/hobbies')
};

// Playlist endpoints
export const playlist = {
  generate: (data) => api.post('/playlist/generate', data),
  create: (data) => api.post('/playlist/create', data),
  getHistory: () => api.get('/playlist/history'),
  getById: (id) => api.get(`/playlist/${id}`)
};

// Preferences endpoints
export const preferences = {
  get: () => api.get('/preferences'),
  save: (data) => api.post('/preferences', data),
  update: (data) => api.put('/preferences', data)
};

export default api;
