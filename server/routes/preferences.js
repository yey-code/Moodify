import express from 'express';
import { PreferencesModel, UserModel } from '../models/models.js';

const router = express.Router();

// Middleware
function requireAuth(req, res, next) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
}

// Get user preferences
router.get('/', requireAuth, async (req, res) => {
  try {
    let preferences = PreferencesModel.findByUserId(req.userId);
    
    if (preferences) {
      // Parse JSON fields
      preferences = {
        ...preferences,
        favorite_genres: JSON.parse(preferences.favorite_genres || '[]'),
        favorite_artists: JSON.parse(preferences.favorite_artists || '[]'),
        favorite_tracks: JSON.parse(preferences.favorite_tracks || '[]'),
        mood_history: JSON.parse(preferences.mood_history || '[]'),
        hobby_tags: JSON.parse(preferences.hobby_tags || '[]')
      };
    }

    res.json({ preferences: preferences || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update preferences
router.post('/', requireAuth, async (req, res) => {
  try {
    const preferences = PreferencesModel.update(req.userId, req.body);
    
    // Parse JSON fields for response
    const formattedPreferences = {
      ...preferences,
      favorite_genres: JSON.parse(preferences.favorite_genres || '[]'),
      favorite_artists: JSON.parse(preferences.favorite_artists || '[]'),
      favorite_tracks: JSON.parse(preferences.favorite_tracks || '[]'),
      mood_history: JSON.parse(preferences.mood_history || '[]'),
      hobby_tags: JSON.parse(preferences.hobby_tags || '[]')
    };

    res.json({ 
      success: true,
      preferences: formattedPreferences 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update specific preference field
router.put('/', requireAuth, async (req, res) => {
  try {
    const preferences = PreferencesModel.update(req.userId, req.body);
    
    res.json({ 
      success: true,
      message: 'Preferences updated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
