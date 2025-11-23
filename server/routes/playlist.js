import express from 'express';
import { 
  getRecommendations, 
  createPlaylist, 
  addTracksToPlaylist,
  getTopArtists,
  getTopTracks 
} from '../services/spotifyService.js';
import { analyzeUserInputs } from '../services/aiService.js';
import { UserModel, PlaylistModel, RecommendationModel } from '../models/models.js';

const router = express.Router();

// Middleware to check authentication and get user with tokens
async function requireAuth(req, res, next) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = UserModel.findById(userId);
  if (!user || !user.access_token) {
    return res.status(401).json({ error: 'User not found or not authenticated with Spotify' });
  }

  req.user = user;
  next();
}

// Generate playlist recommendations (preview without creating)
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const {
      mood,
      genres,
      artists,
      socialReview,
      hobbies,
      listeningTime,
      tempoPreference,
      useTopArtists
    } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // 1. Perform AI analysis
    const aiAnalysis = await analyzeUserInputs({
      mood,
      genres,
      artists,
      socialReview,
      hobbies,
      listeningTime,
      tempoPreference
    });

    // 2. Get user's top artists/tracks if requested
    let seedArtists = [];
    let seedTracks = [];

    // Temporarily disable top artists/tracks to test genre-only recommendations
    // if (useTopArtists) {
    //   const topArtists = await getTopArtists(req.user.access_token, 3);
    //   seedArtists = [...seedArtists, ...topArtists.map(a => a.id)].slice(0, 2);

    //   const topTracks = await getTopTracks(req.user.access_token, 2);
    //   seedTracks = topTracks.map(t => t.id);
    // }

    // 3. Build Spotify API parameters
    const spotifyParams = {
      seedArtists,
      seedGenres: aiAnalysis.genres.slice(0, 5), // Max 5 genre seeds
      seedTracks,
      targetEnergy: aiAnalysis.attributes.energy,
      targetValence: aiAnalysis.attributes.valence,
      targetDanceability: aiAnalysis.attributes.danceability,
      minTempo: aiAnalysis.attributes.tempo.min,
      maxTempo: aiAnalysis.attributes.tempo.max,
      limit: 50
    };

    // 4. Get recommendations from Spotify
    const tracks = await getRecommendations(req.user.access_token, spotifyParams);

    // 5. Format response
    const trackList = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      duration: track.duration_ms,
      uri: track.uri,
      previewUrl: track.preview_url
    }));

    res.json({
      success: true,
      tracks: trackList,
      analysis: aiAnalysis,
      spotifyParams,
      totalTracks: trackList.length
    });
  } catch (error) {
    console.error('Generate playlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create playlist in user's Spotify account
router.post('/create', requireAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      tracks, // array of track URIs
      mood,
      energy,
      valence,
      danceability,
      tempo,
      isPublic,
      aiAnalysis,
      spotifyParams
    } = req.body;

    if (!name || !tracks || tracks.length === 0) {
      return res.status(400).json({ error: 'Name and tracks are required' });
    }

    console.log('Creating playlist for user:', req.user);
    
    // Ensure we have the user's Spotify ID
    if (!req.user || !req.user.spotify_id) {
      return res.status(400).json({ error: 'User Spotify ID not found. Please log in again.' });
    }

    // 1. Create playlist on Spotify
    const spotifyPlaylist = await createPlaylist(
      req.user.access_token,
      req.user.spotify_id,
      name,
      description || `Created by Moodify 🎵`,
      isPublic || false
    );

    // 2. Add tracks to playlist
    await addTracksToPlaylist(req.user.access_token, spotifyPlaylist.id, tracks);

    console.log('✅ Playlist created successfully in Spotify!');

    res.json({
      success: true,
      playlist: {
        spotifyId: spotifyPlaylist.id,
        name: spotifyPlaylist.name,
        url: spotifyPlaylist.external_urls.spotify,
        trackCount: tracks.length
      }
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's playlists
router.get('/history', requireAuth, async (req, res) => {
  try {
    const playlists = PlaylistModel.findByUserId(req.user.id);
    res.json({ playlists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get playlist by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const playlist = PlaylistModel.findById(req.params.id);
    
    if (!playlist || playlist.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
