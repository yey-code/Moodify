// Demo/Mock data for users without Spotify authentication

export const DEMO_USER = {
  id: 'demo_user',
  spotify_id: 'demo',
  display_name: 'Demo User',
  email: 'demo@moodify.app',
  profile_image: null,
  isDemo: true
};

export const DEMO_PLAYLISTS = [
  {
    id: 1,
    name: 'Energetic Morning Vibes',
    mood: 'energetic',
    track_count: 25,
    cover_image: null,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    name: 'Chill Evening Relaxation',
    mood: 'chill',
    track_count: 30,
    cover_image: null,
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    name: 'Focus & Productivity',
    mood: 'focused',
    track_count: 20,
    cover_image: null,
    created_at: new Date(Date.now() - 259200000).toISOString()
  }
];

export const DEMO_TRACKS = [
  { id: '1', name: 'Upbeat Morning', artist: 'Sample Artist', duration: 210000, preview_url: null },
  { id: '2', name: 'Energy Boost', artist: 'Demo Band', duration: 195000, preview_url: null },
  { id: '3', name: 'Feel Good Vibes', artist: 'Test Musician', duration: 225000, preview_url: null },
  { id: '4', name: 'Happy Days', artist: 'Sample Artist', duration: 180000, preview_url: null },
  { id: '5', name: 'Positive Energy', artist: 'Demo Band', duration: 240000, preview_url: null }
];

export const DEMO_MOODS = [
  'happy', 'sad', 'energetic', 'chill', 'focused', 
  'romantic', 'angry', 'anxious', 'confident', 'nostalgic'
];

export const DEMO_GENRES = [
  'pop', 'rock', 'hip-hop', 'electronic', 'indie', 
  'jazz', 'classical', 'r&b', 'country', 'alternative'
];

export const DEMO_HOBBIES = [
  'working out', 'studying', 'cooking', 'gaming', 'reading',
  'driving', 'partying', 'meditating', 'working', 'relaxing'
];

// Mock AI analysis response
export function getMockAnalysis(mood, genres = [], hobbies = []) {
  return {
    suggested_mood: mood || 'happy',
    energy_level: Math.random() * 100,
    valence: Math.random() * 100,
    suggested_genres: genres.length > 0 ? genres : ['pop', 'indie'],
    analysis: `Based on your ${mood || 'happy'} mood and preferences, we've curated a perfect mix of tracks that match your vibe. This demo shows how our AI analyzes your inputs to create personalized playlists.`
  };
}

// Mock playlist generation
export function generateMockPlaylist(mood, trackCount = 25) {
  const tracks = [];
  for (let i = 0; i < trackCount; i++) {
    tracks.push({
      id: `demo_${i}`,
      name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Track ${i + 1}`,
      artist: `Demo Artist ${Math.floor(Math.random() * 10) + 1}`,
      album: `Sample Album ${Math.floor(Math.random() * 5) + 1}`,
      duration: Math.floor(Math.random() * 120000) + 180000,
      preview_url: null
    });
  }
  
  return {
    id: `demo_playlist_${Date.now()}`,
    name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Playlist (Demo)`,
    mood,
    track_count: trackCount,
    tracks,
    cover_image: null,
    spotify_url: null,
    created_at: new Date().toISOString(),
    isDemo: true
  };
}
