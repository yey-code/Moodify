# Moodify System Architecture

## Overview
Moodify is a full-stack web application that generates personalized Spotify playlists using AI-powered mood and sentiment analysis.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                     (React + Vite + Tailwind)                    │
├─────────────────────────────────────────────────────────────────┤
│  Pages:                                                          │
│  • Home (Landing)          • Dashboard (User Overview)          │
│  • Mood Selector           • Playlist Generator                 │
│  • Playlist Preview        • Library (History)                  │
│                                                                   │
│  Components:                                                     │
│  • AuthContext (User State Management)                          │
│  • API Utils (Axios Client)                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/HTTPS (Axios)
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│                      (Express Middleware)                        │
├─────────────────────────────────────────────────────────────────┤
│  • CORS Handler                                                  │
│  • Cookie Parser                                                 │
│  • JSON Body Parser                                              │
│  • Authentication Middleware                                     │
│  • Error Handler                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬───────────────┐
        │            │            │               │
┌───────▼──────┐ ┌──▼────────┐ ┌─▼──────────┐ ┌─▼─────────────┐
│   Auth       │ │   Mood    │ │  Playlist  │ │ Preferences   │
│   Routes     │ │   Routes  │ │   Routes   │ │    Routes     │
└───────┬──────┘ └──┬────────┘ └─┬──────────┘ └─┬─────────────┘
        │           │              │              │
        │           │              │              │
┌───────▼───────────▼──────────────▼──────────────▼──────────────┐
│                     SERVICE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────┐                     │
│  │  AI Service     │  │ Spotify Service  │                     │
│  ├─────────────────┤  ├──────────────────┤                     │
│  │ • Mood Mapping  │  │ • OAuth Flow     │                     │
│  │ • Sentiment     │  │ • User Profile   │                     │
│  │   Analysis      │  │ • Recommendations│                     │
│  │ • Hobby Genre   │  │ • Playlist CRUD  │                     │
│  │   Mapping       │  │ • Track Search   │                     │
│  │ • Attribute     │  │ • Top Artists/   │                     │
│  │   Blending      │  │   Tracks         │                     │
│  └────────┬────────┘  └────────┬─────────┘                     │
│           │                    │                                │
│           │                    │                                │
└───────────┼────────────────────┼────────────────────────────────┘
            │                    │
            │          ┌─────────▼──────────┐
            │          │   Spotify Web API  │
            │          │  (External Service)│
            │          └────────────────────┘
            │
    ┌───────▼─────────────────────────────────┐
    │     HuggingFace Inference API           │
    │  (Optional - Sentiment Analysis)        │
    └─────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│                      (SQLite Database)                          │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                        │
│  ┌──────────┐ ┌─────────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Users   │ │ Preferences │ │Playlists │ │   Listening   │  │
│  ├──────────┤ ├─────────────┤ ├──────────┤ │    History    │  │
│  │ id       │ │ id          │ │ id       │ ├───────────────┤  │
│  │spotify_id│ │ user_id     │ │user_id   │ │ id            │  │
│  │tokens    │ │genres       │ │spotify_id│ │ user_id       │  │
│  │profile   │ │artists      │ │name      │ │ track_id      │  │
│  └──────────┘ │hobbies      │ │mood      │ │ context       │  │
│               │mood_history │ │attributes│ └───────────────┘  │
│               └─────────────┘ └──────────┘                     │
│                                                                 │
│  ┌──────────────────┐                                          │
│  │ Recommendations  │                                          │
│  ├──────────────────┤                                          │
│  │ id               │                                          │
│  │ user_id          │                                          │
│  │ input_data       │                                          │
│  │ ai_analysis      │                                          │
│  │ spotify_params   │                                          │
│  └──────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Authentication Flow
```
User → Click Login
  → Frontend redirects to /api/auth/login
  → Backend generates Spotify OAuth URL
  → Redirect to Spotify Authorization
  → User authorizes
  → Spotify redirects to /api/auth/callback
  → Backend exchanges code for tokens
  → Create/update user in database
  → Set session cookie
  → Redirect to /dashboard
```

### 2. Playlist Generation Flow
```
User Input (Mood, Genres, Hobbies, Social Review)
  ↓
Frontend sends to /api/playlist/generate
  ↓
Backend: AI Service Analysis
  ├─ Map mood → musical attributes
  ├─ Analyze sentiment from text
  ├─ Match hobbies → genres
  ├─ Blend all attributes (weighted)
  └─ Generate Spotify API parameters
  ↓
Backend: Spotify Service
  ├─ Get user's top artists/tracks (if enabled)
  ├─ Call Spotify Recommendations API
  └─ Return track list
  ↓
Frontend: Preview tracks
  ↓
User confirms → /api/playlist/create
  ↓
Backend: Create playlist in Spotify
  ├─ Create empty playlist
  ├─ Add tracks to playlist
  └─ Save to database
  ↓
Frontend: Show success + Spotify link
```

### 3. AI Analysis Pipeline
```
Input Data
  ↓
┌─────────────────────────────────────┐
│  Mood Attributes                    │
│  (energy, valence, danceability)    │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Sentiment Analysis                 │
│  (from social review text)          │
│  • Local: keyword matching          │
│  • API: HuggingFace RoBERTa         │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Hobby to Genre Mapping             │
│  (activity-based music styles)      │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Attribute Blending                 │
│  (weighted average of all inputs)   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Spotify API Parameters             │
│  • seed_genres                      │
│  • seed_artists                     │
│  • seed_tracks                      │
│  • target_energy                    │
│  • target_valence                   │
│  • target_danceability              │
│  • min/max_tempo                    │
└─────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **better-sqlite3**: Database driver
- **axios**: HTTP client for external APIs
- **cookie-parser**: Session management

### Database
- **SQLite**: Lightweight embedded database
- Stores: users, preferences, playlists, listening history, recommendations

### External APIs
- **Spotify Web API**: Music data and playlist management
- **HuggingFace Inference API** (optional): Advanced sentiment analysis

---

## Security Measures

1. **OAuth 2.0**: Secure Spotify authentication
2. **HTTP-only Cookies**: Session management
3. **CORS**: Restricted to client domain
4. **Token Storage**: Access tokens stored server-side only
5. **Environment Variables**: Sensitive credentials isolated
6. **Input Validation**: All user inputs validated

---

## Scalability Considerations

### Current Design (Single Server)
- SQLite for simple deployment
- Session-based authentication
- Direct API calls

### Production Recommendations
1. **Database**: Migrate to PostgreSQL for multi-user scalability
2. **Caching**: Add Redis for token caching and rate limiting
3. **Load Balancing**: Multiple server instances behind load balancer
4. **CDN**: Serve static frontend assets via CDN
5. **Message Queue**: Background jobs for playlist creation
6. **Monitoring**: Add logging and analytics

---

## Deployment Architecture (Production)

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
┌──────▼────────────┐
│   CDN (Static)    │
│   Vercel/Netlify  │
└──────┬────────────┘
       │
┌──────▼────────────┐
│  Load Balancer    │
└──────┬────────────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
┌──▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼──────┐
│ API  │ │ API │ │ API │ │ Worker │
│Server│ │Server│ │Server│ │ Queue  │
└──┬───┘ └──┬──┘ └──┬──┘ └──┬─────┘
   │        │       │       │
   └────────┴───────┴───────┘
            │
    ┌───────▼──────────┐
    │   PostgreSQL     │
    │   (Primary DB)   │
    └───────┬──────────┘
            │
    ┌───────▼──────────┐
    │   Redis Cache    │
    │  (Sessions/Temp) │
    └──────────────────┘
```

---

## API Rate Limits

### Spotify API
- 429 responses when rate limited
- Implement exponential backoff
- Cache frequent requests

### HuggingFace API
- Free tier: ~1000 requests/month
- Fallback to local sentiment analysis
- Consider upgrading for production

---

## Future Enhancements

1. **Real-time Collaboration**: Share and collaborate on playlists
2. **Advanced ML**: Train custom models on user preferences
3. **Social Features**: Follow users, share playlists
4. **Mobile App**: React Native version
5. **Voice Input**: Voice-to-playlist generation
6. **Scheduling**: Auto-generate playlists at specific times
7. **Integration**: Apple Music, YouTube Music support
8. **Analytics**: Detailed listening insights
