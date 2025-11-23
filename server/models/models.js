import { getOne, getAll, run } from '../database/init.js';

export const UserModel = {
  findBySpotifyId(spotifyId) {
    return getOne('SELECT * FROM users WHERE spotify_id = ?', [spotifyId]);
  },

  findById(id) {
    return getOne('SELECT * FROM users WHERE id = ?', [id]);
  },

  create(userData) {
    const result = run(`
      INSERT INTO users (spotify_id, display_name, email, profile_image, access_token, refresh_token, token_expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userData.spotify_id,
      userData.display_name,
      userData.email,
      userData.profile_image,
      userData.access_token,
      userData.refresh_token,
      userData.token_expires_at
    ]);
    
    return this.findById(result.lastInsertRowid);
  },

  updateTokens(spotifyId, accessToken, refreshToken, expiresAt) {
    run(`
      UPDATE users 
      SET access_token = ?, refresh_token = ?, token_expires_at = ?, last_login = CURRENT_TIMESTAMP
      WHERE spotify_id = ?
    `, [accessToken, refreshToken, expiresAt, spotifyId]);
    return this.findBySpotifyId(spotifyId);
  },

  updateLastLogin(userId) {
    run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
  }
};

export const PreferencesModel = {
  findByUserId(userId) {
    return getOne('SELECT * FROM preferences WHERE user_id = ?', [userId]);
  },

  create(userId, preferences) {
    run(`
      INSERT INTO preferences (user_id, favorite_genres, favorite_artists, favorite_tracks, mood_history, hobby_tags, listening_time_preference, tempo_preference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      JSON.stringify(preferences.favorite_genres || []),
      JSON.stringify(preferences.favorite_artists || []),
      JSON.stringify(preferences.favorite_tracks || []),
      JSON.stringify(preferences.mood_history || []),
      JSON.stringify(preferences.hobby_tags || []),
      preferences.listening_time_preference || 'any',
      preferences.tempo_preference || 'medium'
    ]);
    
    return this.findByUserId(userId);
  },

  update(userId, preferences) {
    const current = this.findByUserId(userId);
    
    if (!current) {
      return this.create(userId, preferences);
    }

    run(`
      UPDATE preferences 
      SET favorite_genres = ?, favorite_artists = ?, favorite_tracks = ?, 
          mood_history = ?, hobby_tags = ?, listening_time_preference = ?, 
          tempo_preference = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [
      JSON.stringify(preferences.favorite_genres || JSON.parse(current.favorite_genres || '[]')),
      JSON.stringify(preferences.favorite_artists || JSON.parse(current.favorite_artists || '[]')),
      JSON.stringify(preferences.favorite_tracks || JSON.parse(current.favorite_tracks || '[]')),
      JSON.stringify(preferences.mood_history || JSON.parse(current.mood_history || '[]')),
      JSON.stringify(preferences.hobby_tags || JSON.parse(current.hobby_tags || '[]')),
      preferences.listening_time_preference || current.listening_time_preference,
      preferences.tempo_preference || current.tempo_preference,
      userId
    ]);
    
    return this.findByUserId(userId);
  }
};

export const PlaylistModel = {
  create(playlistData) {
    const result = run(`
      INSERT INTO playlists (user_id, spotify_playlist_id, name, description, mood, energy, valence, danceability, tempo, track_count, cover_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      playlistData.user_id,
      playlistData.spotify_playlist_id,
      playlistData.name,
      playlistData.description,
      playlistData.mood,
      playlistData.energy,
      playlistData.valence,
      playlistData.danceability,
      playlistData.tempo,
      playlistData.track_count,
      playlistData.cover_image
    ]);
    
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return getOne('SELECT * FROM playlists WHERE id = ?', [id]);
  },

  findByUserId(userId, limit = 20) {
    return getAll('SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit]);
  }
};

export const RecommendationModel = {
  create(recommendationData) {
    const result = run(`
      INSERT INTO recommendations (user_id, playlist_id, input_data, ai_analysis, spotify_params)
      VALUES (?, ?, ?, ?, ?)
    `, [
      recommendationData.user_id,
      recommendationData.playlist_id,
      JSON.stringify(recommendationData.input_data),
      JSON.stringify(recommendationData.ai_analysis),
      JSON.stringify(recommendationData.spotify_params)
    ]);
    
    return result.lastInsertRowid;
  }
};

export const ListeningHistoryModel = {
  add(userId, trackData) {
    run(`
      INSERT INTO listening_history (user_id, track_id, track_name, artist_name, mood_context, hobby_context)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      userId,
      trackData.track_id,
      trackData.track_name,
      trackData.artist_name,
      trackData.mood_context,
      trackData.hobby_context
    ]);
  },

  getRecent(userId, limit = 50) {
    return getAll('SELECT * FROM listening_history WHERE user_id = ? ORDER BY listened_at DESC LIMIT ?', [userId, limit]);
  }
};
