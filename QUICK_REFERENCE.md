# Moodify - Quick Reference

## 🚀 Quick Start Commands

```powershell
# 1. Install all dependencies
npm run install-all

# 2. Set up environment
Copy-Item .env.example .env
# Edit .env with your Spotify credentials

# 3. Run the application
npm run dev

# 4. Open browser
# Visit http://localhost:5173
```

---

## 📦 NPM Commands

### Root Directory
```powershell
npm run dev          # Run both frontend and backend
npm run server       # Run backend only
npm run client       # Run frontend only
npm run build        # Build frontend for production
npm start           # Start production server
npm run install-all  # Install all dependencies
```

### Client Directory
```powershell
cd client
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 🔧 Development Workflow

### 1. Start Development
```powershell
# Terminal 1
npm run dev
```

### 2. Check API Health
```powershell
curl http://localhost:5000/api/health
```

### 3. View Logs
- Backend logs appear in the terminal running `npm run server`
- Frontend logs appear in browser console (F12)

---

## 🎵 Spotify Setup Checklist

- [ ] Create Spotify Developer account
- [ ] Create new app in dashboard
- [ ] Add redirect URI: `http://127.0.0.1:5000/callback` (local dev only)
- [ ] For production, use: `https://yourdomain.com/callback`
- [ ] Copy Client ID to `.env`
- [ ] Copy Client Secret to `.env`
- [ ] Save changes in Spotify Dashboard

---

## 📊 Database

### Location
```
c:\xampp\htdocs\Moodify\moodify.db
```

### Reset Database
```powershell
# Stop the server first
# Delete the database file
Remove-Item moodify.db
# Restart server - database will be recreated
npm run dev
```

### View Database
- Download [DB Browser for SQLite](https://sqlitebrowser.org/)
- Open `moodify.db`

---

## 🐛 Common Issues & Fixes

### "Cannot find module"
```powershell
npm install
cd client
npm install
```

### Port already in use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
```

### Spotify redirect error
1. Check `.env` has: `SPOTIFY_REDIRECT_URI=http://127.0.0.1:5000/callback`
2. Verify it matches exactly in Spotify Dashboard
3. Use HTTPS for production: `https://yourdomain.com/callback`

### Clear browser cookies
If login issues persist, clear cookies for `localhost`

---

## 🧪 API Testing

### Test Endpoints with curl

```powershell
# Health check
curl http://localhost:5000/api/health

# Get moods
curl http://localhost:5000/api/mood/moods

# Get hobbies
curl http://localhost:5000/api/mood/hobbies

# Test sentiment analysis
curl -X POST http://localhost:5000/api/mood/sentiment `
  -H "Content-Type: application/json" `
  -d '{\"text\": \"I am feeling great today!\"}'
```

---

## 📁 Important Files

### Configuration
- `.env` - Environment variables (create from `.env.example`)
- `package.json` - Backend dependencies and scripts
- `client/package.json` - Frontend dependencies
- `client/vite.config.js` - Vite configuration
- `client/tailwind.config.js` - Tailwind CSS config

### Backend
- `server/index.js` - Main server file
- `server/routes/` - API endpoints
- `server/services/aiService.js` - AI logic (moods, sentiment)
- `server/services/spotifyService.js` - Spotify API integration
- `server/models/models.js` - Database models

### Frontend
- `client/src/App.jsx` - Main React component
- `client/src/pages/` - All page components
- `client/src/context/AuthContext.jsx` - Authentication state
- `client/src/utils/api.js` - API client

---

## 🎨 Customization Points

### Add New Mood
Edit `server/services/aiService.js`:
```javascript
const MOOD_ATTRIBUTES = {
  // Add your new mood here
  excited: {
    energy: 0.95,
    valence: 0.90,
    danceability: 0.80,
    tempo: { min: 140, max: 170 },
    genres: ['party', 'dance', 'edm']
  }
};
```

### Add New Hobby
Edit `server/services/aiService.js`:
```javascript
const HOBBY_GENRES = {
  // Add your new hobby here
  meditation: ['ambient', 'new-age', 'meditation', 'calm']
};
```

### Change UI Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: '#1DB954',  // Spotify green
  // Add your colors here
}
```

---

## 🌐 URLs

### Development
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

### Spotify
- Developer Dashboard: https://developer.spotify.com/dashboard
- Web API Docs: https://developer.spotify.com/documentation/web-api

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - API endpoint reference
- `ARCHITECTURE.md` - System architecture
- `QUICK_REFERENCE.md` - This file

---

## 🚢 Production Deployment

### Build Frontend
```powershell
cd client
npm run build
```

### Environment for Production
```env
NODE_ENV=production
PORT=443
CLIENT_URL=https://yourdomain.com
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, Render
- **Database**: PostgreSQL (Supabase, Railway)

---

## 💡 Tips

1. **Keep Dependencies Updated**
   ```powershell
   npm outdated
   npm update
   ```

2. **Enable Debug Logging**
   ```powershell
   $env:DEBUG="*"; npm run dev
   ```

3. **Backup Database**
   ```powershell
   Copy-Item moodify.db moodify-backup.db
   ```

4. **Clear Node Modules**
   ```powershell
   Remove-Item -Recurse -Force node_modules, client\node_modules
   npm run install-all
   ```

---

## 🎯 Feature Checklist

- [x] User authentication with Spotify
- [x] Mood-based playlist generation
- [x] Sentiment analysis
- [x] Hobby to genre mapping
- [x] Custom preferences
- [x] Playlist history
- [x] Spotify playlist creation
- [ ] Social sharing
- [ ] Collaborative playlists
- [ ] Mobile app
- [ ] Advanced analytics

---

## 🔐 Security Checklist

- [ ] `.env` in `.gitignore`
- [ ] Random SESSION_SECRET generated
- [ ] Spotify credentials secured
- [ ] HTTPS enabled (production)
- [ ] CORS configured correctly
- [ ] Input validation enabled
- [ ] Rate limiting added (production)

---

## 📞 Getting Help

1. Check error messages in terminal
2. Review browser console (F12)
3. Check `SETUP_GUIDE.md` troubleshooting
4. Review `API_DOCUMENTATION.md`
5. Verify environment variables in `.env`

---

Made with ❤️ for music lovers • Powered by Spotify & AI
