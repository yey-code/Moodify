import express from 'express';
import { getAuthUrl, getTokens, getCurrentUser } from '../services/spotifyService.js';
import { UserModel } from '../models/models.js';

const router = express.Router();

// Initiate Spotify OAuth
router.get('/login', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// OAuth callback (direct /callback route, not /api/auth/callback)
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`${process.env.CLIENT_URL}?error=${error}`);
  }

  try {
    // Exchange code for tokens
    const tokenData = await getTokens(code);
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user profile
    const userProfile = await getCurrentUser(access_token);

    // Calculate token expiration
    const expiresAt = Date.now() + expires_in * 1000;

    // Create or update user in database
    let user = UserModel.findBySpotifyId(userProfile.id);
    
    console.log('Found existing user:', user);
    
    if (user) {
      user = UserModel.updateTokens(userProfile.id, access_token, refresh_token, expiresAt);
      console.log('Updated user:', user);
    } else {
      user = UserModel.create({
        spotify_id: userProfile.id,
        display_name: userProfile.display_name,
        email: userProfile.email,
        profile_image: userProfile.images?.[0]?.url || null,
        access_token,
        refresh_token,
        token_expires_at: expiresAt
      });
      console.log('Created user:', user);
    }

    if (!user || !user.id) {
      throw new Error('Failed to create or retrieve user from database');
    }

    // Set cookie with user ID
    res.cookie('userId', user.id, {
      httpOnly: true,
      secure: true, // Always true for production cross-origin
      sameSite: 'none', // Required for cross-origin cookies
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    console.log('Redirecting to:', `${process.env.CLIENT_URL}/dashboard`);
    console.log('Cookie set with userId:', user.id);

    // Direct HTTP redirect
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
  }
});

// Get current authenticated user
router.get('/user', async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send sensitive tokens to client
    const { access_token, refresh_token, ...safeUser } = user;
    
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('userId', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ message: 'Logged out successfully' });
});

export default router;
