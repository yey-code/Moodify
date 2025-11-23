# Moodify API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a session cookie set after Spotify OAuth login.

---

## Authentication Endpoints

### `GET /auth/login`
Initiates Spotify OAuth flow.

**Response:**
- Redirects to Spotify authorization page

---

### `GET /auth/callback`
OAuth callback endpoint. Handles Spotify's authorization response.

**Full URL**: `http://localhost:5000/callback` (Note: Direct route, not under /api)

**Query Parameters:**
- `code` (string): Authorization code from Spotify
- `error` (string, optional): Error if authorization failed

**Response:**
- Redirects to `/dashboard` on success
- Redirects to `/?error=...` on failure

---

### `GET /auth/user`
Get current authenticated user information.

**Response:**
```json
{
  "id": 1,
  "spotify_id": "user123",
  "display_name": "John Doe",
  "email": "john@example.com",
  "profile_image": "https://...",
  "created_at": "2024-01-01T00:00:00.000Z",
  "last_login": "2024-01-15T12:00:00.000Z"
}
```

**Errors:**
- `401`: Not authenticated

---

### `POST /auth/logout`
Logout current user.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Mood Analysis Endpoints

### `POST /mood/analyze`
Analyze user inputs and generate playlist parameters.

**Request Body:**
```json
{
  "mood": "happy",
  "genres": ["pop", "dance"],
  "artists": [{ "id": "artist123", "name": "Artist Name" }],
  "socialReview": "Having a great day!",
  "hobbies": ["gym", "gaming"],
  "listeningTime": "morning",
  "tempoPreference": "fast"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "attributes": {
      "energy": 0.85,
      "valence": 0.90,
      "danceability": 0.75,
      "tempo": { "min": 120, "max": 140 }
    },
    "genres": ["pop", "dance", "happy"],
    "artists": [...],
    "sentimentScore": 0.85,
    "mood": "happy",
    "description": "AI-generated happy playlist with uplifting vibes. Perfect for gym, gaming. Created by Moodify 🎵"
  }
}
```

**Errors:**
- `400`: Missing required field (mood)
- `401`: Not authenticated
- `500`: Analysis failed

---

### `POST /mood/sentiment`
Analyze sentiment of text.

**Request Body:**
```json
{
  "text": "I'm feeling amazing today!"
}
```

**Response:**
```json
{
  "sentiment": "positive",
  "score": 0.85,
  "text": "I'm feeling amazing today!"
}
```

**Errors:**
- `400`: Text is required

---

### `GET /mood/moods`
Get list of available moods.

**Response:**
```json
{
  "moods": ["happy", "sad", "energetic", "chill", "focused", "angry", "romantic", "motivated", "relaxed", "anxious"]
}
```

---

### `GET /mood/hobbies`
Get list of available hobbies.

**Response:**
```json
{
  "hobbies": ["gym", "gaming", "studying", "yoga", "running", "cooking", "reading", "party", "traveling", "working", "cleaning", "driving"]
}
```

---

## Playlist Endpoints

### `POST /playlist/generate`
Generate playlist recommendations (preview without creating in Spotify).

**Request Body:**
```json
{
  "mood": "happy",
  "genres": ["pop", "dance"],
  "artists": [],
  "socialReview": "Great day!",
  "hobbies": ["gym"],
  "listeningTime": "morning",
  "tempoPreference": "fast",
  "useTopArtists": true
}
```

**Response:**
```json
{
  "success": true,
  "tracks": [
    {
      "id": "track123",
      "name": "Song Name",
      "artists": "Artist Name",
      "album": "Album Name",
      "albumArt": "https://...",
      "duration": 210000,
      "uri": "spotify:track:...",
      "previewUrl": "https://..."
    }
  ],
  "analysis": { ... },
  "spotifyParams": { ... },
  "totalTracks": 50
}
```

**Errors:**
- `400`: Mood is required
- `401`: Not authenticated
- `500`: Generation failed

---

### `POST /playlist/create`
Create playlist in user's Spotify account.

**Request Body:**
```json
{
  "name": "My Happy Playlist",
  "description": "AI-generated happy playlist",
  "tracks": ["spotify:track:...", "spotify:track:..."],
  "mood": "happy",
  "energy": 0.85,
  "valence": 0.90,
  "danceability": 0.75,
  "tempo": 130,
  "isPublic": false,
  "aiAnalysis": { ... },
  "spotifyParams": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "playlist": {
    "id": 1,
    "spotifyId": "playlist123",
    "name": "My Happy Playlist",
    "url": "https://open.spotify.com/playlist/...",
    "trackCount": 50
  }
}
```

**Errors:**
- `400`: Name and tracks are required
- `401`: Not authenticated
- `500`: Creation failed

---

### `GET /playlist/history`
Get user's playlist history.

**Response:**
```json
{
  "playlists": [
    {
      "id": 1,
      "user_id": 1,
      "spotify_playlist_id": "playlist123",
      "name": "My Playlist",
      "description": "...",
      "mood": "happy",
      "energy": 0.85,
      "valence": 0.90,
      "track_count": 50,
      "cover_image": "https://...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `401`: Not authenticated

---

### `GET /playlist/:id`
Get specific playlist by ID.

**Response:**
```json
{
  "playlist": { ... }
}
```

**Errors:**
- `401`: Not authenticated
- `404`: Playlist not found

---

## Preferences Endpoints

### `GET /preferences`
Get user preferences.

**Response:**
```json
{
  "preferences": {
    "id": 1,
    "user_id": 1,
    "favorite_genres": ["pop", "rock"],
    "favorite_artists": ["Artist 1", "Artist 2"],
    "favorite_tracks": ["Track 1"],
    "mood_history": ["happy", "energetic"],
    "hobby_tags": ["gym", "gaming"],
    "listening_time_preference": "morning",
    "tempo_preference": "fast",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T00:00:00.000Z"
  }
}
```

**Errors:**
- `401`: Not authenticated

---

### `POST /preferences`
Create or update user preferences.

**Request Body:**
```json
{
  "favorite_genres": ["pop", "rock"],
  "favorite_artists": ["Artist 1"],
  "favorite_tracks": [],
  "mood_history": ["happy"],
  "hobby_tags": ["gym"],
  "listening_time_preference": "morning",
  "tempo_preference": "fast"
}
```

**Response:**
```json
{
  "success": true,
  "preferences": { ... }
}
```

**Errors:**
- `401`: Not authenticated
- `500`: Update failed

---

### `PUT /preferences`
Update specific preference fields.

**Request Body:** (same as POST, all fields optional)

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated"
}
```

**Errors:**
- `401`: Not authenticated
- `500`: Update failed

---

## Error Responses

All endpoints may return these error formats:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `400`: Bad Request (missing/invalid parameters)
- `401`: Unauthorized (not authenticated)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error (server-side issue)

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production.

---

## Notes

1. All timestamps are in ISO 8601 format
2. Arrays in database are stored as JSON strings
3. Session cookies have 30-day expiration
4. Spotify tokens are automatically refreshed when expired
5. All responses use `application/json` content type
