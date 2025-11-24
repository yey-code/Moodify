# 🎵 Moodify - AI-Powered Spotify Playlist Generator

Moodify automatically generates personalized Spotify playlists based on your mood, music preferences, listening behavior, social sentiment, and hobbies using AI-powered analysis.

🌐 **Live Demo**: [moodify-yeyeyey.vercel.app](https://moodify-yeyeyey.vercel.app)  
📚 **API Docs**: [Swagger UI](https://moodify-production-2519.up.railway.app/api-docs)  
💻 **GitHub**: [yey-code/Moodify](https://github.com/yey-code/Moodify)

---

## 🎭 Try Demo Mode - No Spotify Login Required!

Due to Spotify's API restrictions (requiring 250k+ MAU for extended quota), Moodify offers **Demo Mode** with unlimited access:

### 🎮 Demo Mode Features:
- ✅ Full UI/UX experience
- ✅ AI mood analysis simulation  
- ✅ Playlist generation preview
- ✅ No Spotify login required
- ✅ **Unlimited users**
- ⚠️ Mock data (playlists not created in Spotify)

### 🎵 Spotify Mode (Limited to 25 users):
- ✅ Real Spotify integration
- ✅ Creates actual playlists in your account
- ⚠️ Limited availability due to [Spotify API restrictions](docs/SPOTIFY_LIMITATIONS.md)

---

## ✨ Features

- **Mood-Based Playlists**: Select from 10+ moods (happy, sad, energetic, chill, focused, etc.)
- **AI Sentiment Analysis**: Analyze text from social reviews or personal notes
- **Hobby Integration**: Match music to your activities (gym, studying, gaming, cooking, etc.)
- **Spotify Integration**: Automatic playlist creation in your Spotify account (when available)
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **JWT Authentication**: Secure, Safari-compatible cross-browser auth
- **API Documentation**: Interactive Swagger UI at `/api-docs`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│   Frontend (React + Vite + TailwindCSS)        │
│   • Home, Dashboard, Mood Selector, Library    │
│   • JWT + Cookie Authentication                 │
│   • Responsive Mobile-First Design             │
└────────────────┬────────────────────────────────┘
                 │ HTTPS/REST API
┌────────────────▼────────────────────────────────┐
│   Backend API (Node.js + Express)              │
│   • Authentication (JWT + Cookies)              │
│   • Swagger Documentation                       │
│   • Rate Limiting & CORS                        │
└─────┬──────────────────────────┬────────────────┘
      │                          │
      ▼                          ▼
┌──────────────┐         ┌──────────────┐
│  AI Services │         │ Spotify API  │
│  HuggingFace │         │  OAuth 2.0   │
│  Sentiment   │         │ Recommend    │
└──────────────┘         └──────────────┘
      │                          │
      └──────────┬───────────────┘
                 ▼
         ┌────────────────┐
         │ SQLite Database│
         │  In-Memory     │
         └────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS
- Axios
- React Router

**Backend:**
- Node.js + Express
- JWT Authentication
- Spotify Web API
- HuggingFace AI API
- SQLite (in-memory)
- Swagger/OpenAPI

**DevOps:**
- Frontend: Vercel
- Backend: Railway
- CORS: Cross-origin enabled

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Spotify Developer Account (optional for demo mode)
- HuggingFace API token (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/yey-code/Moodify.git
cd Moodify

# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Setup environment
cp server/.env.example server/.env
# Edit server/.env with your credentials (see Setup Guide)

# Run development server
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

📖 **Detailed Setup**: See [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

---

## 📚 Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Vercel & Railway
- **[Spotify Limitations](docs/SPOTIFY_LIMITATIONS.md)** - Why Demo Mode exists
- **[API Documentation](https://moodify-production-2519.up.railway.app/api-docs)** - Interactive Swagger UI

---

## 🚀 Key Endpoints

### Authentication
- `GET /api/auth/login` - Initiate Spotify OAuth
- `GET /callback` - OAuth callback
- `GET /api/auth/user` - Get current user
- `GET /api/auth/debug` - Debug authentication status

### Mood & AI
- `POST /api/mood/analyze` - AI mood analysis
- `POST /api/mood/sentiment` - Sentiment analysis
- `GET /api/mood/moods` - Available moods
- `GET /api/mood/hobbies` - Available hobbies

### Playlists
- `POST /api/playlist/generate` - Generate playlist
- `POST /api/playlist/create` - Create in Spotify
- `GET /api/playlist/history` - User's playlist history

### Preferences
- `GET /api/preferences` - Get preferences
- `POST /api/preferences` - Save preferences

**Full API Documentation**: [Swagger UI](https://moodify-production-2519.up.railway.app/api-docs)

---

## 🎨 Pages

1. **Home** - Landing page with Demo/Spotify login
2. **Dashboard** - User overview, quick actions, recent playlists
3. **Mood Selector** - Visual mood selection interface
4. **Playlist Generator** - Advanced customization options
5. **Playlist Preview** - Review generated tracks
6. **Library** - View past playlists

---

## 🧠 AI Processing Flow

```
1. Input Collection
   ├─ Mood selection (happy, sad, energetic, etc.)
   ├─ Genre/artist preferences
   ├─ Hobby tags (gym, studying, gaming)
   └─ Social review text (optional)

2. AI Analysis
   ├─ Sentiment extraction from text (HuggingFace)
   ├─ Mood → musical attributes mapping
   ├─ Hobby → genre matching
   └─ Energy/valence calculation

3. Spotify Query
   ├─ Generate seed tracks/artists/genres
   ├─ Apply audio feature filters
   ├─ Fetch recommendations (30-50 tracks)
   └─ Create playlist in user account

4. Result
   └─ Playlist created with AI-generated description
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies (where supported)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Token refresh mechanism
- ✅ Input validation & sanitization

---

## 📊 Database Schema

**Users**: id, spotify_id, display_name, email, tokens, created_at  
**Playlists**: id, user_id, spotify_playlist_id, mood, tracks, created_at  
**Preferences**: id, user_id, favorite_genres, artists, mood_history  
**Recommendations**: id, user_id, mood, input_data, result_tracks

---

## 🌟 Demo Mode vs Spotify Mode

| Feature | Demo Mode | Spotify Mode |
|---------|-----------|--------------|
| User Limit | ♾️ Unlimited | 25 users max |
| Login Required | ❌ No | ✅ Yes |
| AI Analysis | ✅ Full | ✅ Full |
| UI/UX | ✅ Complete | ✅ Complete |
| Playlist Preview | ✅ Mock data | ✅ Real tracks |
| Create in Spotify | ❌ No | ✅ Yes |
| Access History | ❌ No | ✅ Yes |

---

## 🤝 Contributing

Contributions welcome! This project demonstrates:
- Full-stack web development
- OAuth 2.0 implementation
- AI/ML integration
- Responsive design
- Cloud deployment
- API documentation

---

## ⚖️ License

MIT License - See LICENSE file for details

---

## 👤 Author

**Yey**  
GitHub: [@yey-code](https://github.com/yey-code)

---

## 🙏 Acknowledgments

- Spotify Web API for music data
- HuggingFace for AI sentiment analysis
- TailwindCSS for styling framework
- Vercel & Railway for hosting

---

**Note**: Spotify integration has limited availability due to API restrictions. Demo Mode provides the full experience without these limitations. See [docs/SPOTIFY_LIMITATIONS.md](docs/SPOTIFY_LIMITATIONS.md) for details.
