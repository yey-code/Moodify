# 🎵 Moodify - AI-Powered Spotify Playlist Generator

Moodify automatically generates personalized Spotify playlists based on your mood, music preferences, listening behavior, social sentiment, and hobbies using AI-powered analysis.

## ✨ Features

- **Mood-Based Playlists**: Select from various moods (happy, sad, energetic, chill, etc.)
- **AI Sentiment Analysis**: Analyze text from social reviews or personal notes
- **Hobby Mapping**: Match your hobbies to music styles (gym, studying, gaming, etc.)
- **Spotify Integration**: Automatic playlist creation in your Spotify account
- **Preference Learning**: Save and refine your music preferences over time
- **Behavioral Analysis**: Consider listening habits and time-based patterns

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind)
    ↓
Backend API (Node.js + Express)
    ↓
AI Services (HuggingFace API / Local ML)
    ↓
Spotify Web API
    ↓
Database (SQLite)
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **SQLite** for lightweight data storage
- **Spotify Web API** for music data
- **HuggingFace API** for AI sentiment analysis

### AI Integration
- HuggingFace Inference API (free tier)
- Sentiment analysis models
- Mood-to-music attribute mapping

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Spotify Developer Account
- (Optional) HuggingFace API token

### Step 1: Clone and Install

```bash
cd c:\xampp\htdocs\Moodify
npm run install-all
```

### Step 2: Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://127.0.0.1:5000/callback` (local) or `https://yourdomain.com/callback` (production)
4. Copy Client ID and Client Secret

### Step 3: Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5000/callback
SESSION_SECRET=generate_random_string
```

### Step 4: Run the Application

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎯 API Endpoints

### Authentication
- `GET /api/auth/login` - Initiate Spotify OAuth
- `GET /api/auth/callback` - OAuth callback
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Mood Analysis
- `POST /api/mood/analyze` - Analyze mood and generate playlist parameters
- `POST /api/mood/sentiment` - Analyze text sentiment

### Playlist Generation
- `POST /api/playlist/generate` - Generate playlist based on inputs
- `POST /api/playlist/create` - Create playlist in Spotify
- `GET /api/playlist/preview/:id` - Preview generated playlist

### User Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save user preferences
- `PUT /api/preferences` - Update preferences

## 🧠 AI Processing Flow

1. **Input Collection**
   - Mood selection
   - Genre/artist preferences
   - Hobby tags
   - Social review text

2. **AI Analysis**
   - Sentiment extraction from text
   - Mood → musical attributes mapping
   - Hobby → genre matching
   - Behavioral pattern analysis

3. **Attribute Generation**
   - Energy (0-1)
   - Valence (0-1) 
   - Danceability (0-1)
   - Tempo (BPM range)
   - Genre seeds
   - Artist seeds

4. **Spotify Query**
   - Use Spotify Recommendations API
   - Apply filters and seeds
   - Fetch 30-50 tracks

5. **Playlist Creation**
   - Create playlist in user's account
   - Add tracks
   - Set AI-generated description

## 📊 Database Schema

### Users Table
- id, spotify_id, display_name, email, access_token, refresh_token, created_at

### Preferences Table
- id, user_id, favorite_genres, favorite_artists, mood_history, created_at

### Playlists Table
- id, user_id, spotify_playlist_id, mood, description, track_count, created_at

### Listening History Table
- id, user_id, track_id, listened_at, context (mood/hobby)

## 🎨 UI Pages

1. **Home** - Landing page with login
2. **Dashboard** - User overview and quick actions
3. **Mood Selector** - Visual mood selection interface
4. **Behavior Input** - Listening habits and preferences
5. **Social Analyzer** - Text input for sentiment analysis
6. **Hobby Mapper** - Tag selection for activities
7. **Playlist Preview** - Review before creating
8. **Library** - View past generated playlists

## 🔒 Security Notes

- Never commit `.env` file
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Securely store tokens

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Heroku/Railway/Render)
- Set environment variables
- Use PostgreSQL in production
- Enable CORS for your domain

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Pull requests welcome! Please follow existing code style.

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Made with ❤️ for music lovers
