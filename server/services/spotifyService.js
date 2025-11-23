import axios from 'axios';
import querystring from 'query-string';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

// OAuth endpoints
export function getAuthUrl() {
  const scope = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-top-read',
    'user-read-recently-played'
  ].join(' ');

  const params = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    show_dialog: true
  });

  return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params}`;
}

// Exchange code for tokens
export async function getTokens(code) {
  const data = querystring.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI
  });

  const response = await axios.post(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')
    }
  });

  return response.data;
}

// Refresh access token
export async function refreshAccessToken(refreshToken) {
  const data = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  const response = await axios.post(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')
    }
  });

  return response.data;
}

// Get current user profile
export async function getCurrentUser(accessToken) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data;
}

// Get user's top artists
export async function getTopArtists(accessToken, limit = 5) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/artists`, {
    params: { limit, time_range: 'medium_term' },
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data.items;
}

// Get user's top tracks
export async function getTopTracks(accessToken, limit = 5) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/tracks`, {
    params: { limit, time_range: 'medium_term' },
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data.items;
}

// Search for artists
export async function searchArtists(accessToken, query, limit = 10) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
    params: { q: query, type: 'artist', limit },
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data.artists.items;
}

// Get recommendations based on AI analysis
// WORKAROUND: Use Search API instead of Recommendations API for regional compatibility
export async function getRecommendations(accessToken, params) {
  const {
    seedArtists = [],
    seedGenres = [],
    seedTracks = [],
    targetEnergy,
    targetValence,
    targetDanceability,
    minTempo,
    maxTempo,
    limit = 50
  } = params;

  console.log('🎵 Using Search API workaround for recommendations');
  
  try {
    // Use search API with genre as query
    const genre = seedGenres[0] || 'pop';
    const searchQuery = `genre:${genre}`;
    
    console.log('Searching for:', searchQuery);
    
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
      params: {
        q: searchQuery,
        type: 'track',
        limit: limit,
        market: 'PH' // Philippines market
      },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const tracks = response.data.tracks.items;
    console.log('✅ Found', tracks.length, 'tracks via search');
    
    return tracks;
  } catch (error) {
    console.error('Search API error:', error.response?.status, error.response?.statusText);
    console.error('Error data:', error.response?.data);
    throw new Error('Failed to search tracks: ' + (error.response?.data?.error?.message || error.message));
  }
}

// Create a playlist
export async function createPlaylist(accessToken, userId, name, description, isPublic = false) {
  const response = await axios.post(
    `${SPOTIFY_API_BASE}/users/${userId}/playlists`,
    {
      name,
      description,
      public: isPublic
    },
    {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

// Add tracks to playlist
export async function addTracksToPlaylist(accessToken, playlistId, trackUris) {
  // Spotify allows max 100 tracks per request
  const chunks = [];
  for (let i = 0; i < trackUris.length; i += 100) {
    chunks.push(trackUris.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    await axios.post(
      `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
      { uris: chunk },
      {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Get available genre seeds
export async function getAvailableGenreSeeds(accessToken) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/recommendations/available-genre-seeds`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data.genres;
}

// Get track audio features
export async function getAudioFeatures(accessToken, trackIds) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/audio-features`, {
    params: { ids: trackIds.join(',') },
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data.audio_features;
}
