# Moodify Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **Spotify Developer Account** - [Sign up here](https://developer.spotify.com/)

---

## Step 1: Spotify Developer Setup

### 1.1 Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create App"**
4. Fill in the form:
   - **App Name**: Moodify (or your preferred name)
   - **App Description**: AI-powered playlist generator
   - **Redirect URI**: `http://127.0.0.1:5000/callback` (for local development)
     - Note: Use `https://yourdomain.com/callback` for production
     - Spotify allows HTTP only for localhost/127.0.0.1
   - **Which API/SDKs are you planning to use?**: Check "Web API"
5. Click **"Save"

### 1.2 Get Credentials

1. Click on your newly created app
2. Click **"Settings"**
3. Copy your **Client ID**
4. Click **"View client secret"** and copy your **Client Secret**
5. **IMPORTANT**: Keep these credentials secure!

---

## Step 2: Project Setup

### 2.1 Navigate to Project Directory

```powershell
cd c:\xampp\htdocs\Moodify
```

### 2.2 Install Dependencies

Install both backend and frontend dependencies:

```powershell
npm run install-all
```

This will:
- Install root dependencies (Express, SQLite, etc.)
- Install client dependencies (React, Vite, Tailwind, etc.)

**If the above doesn't work, install manually:**

```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

---

## Step 3: Environment Configuration

### 3.1 Create Environment File

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

### 3.2 Edit Environment Variables

Open `.env` in your text editor and fill in your credentials:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_actual_client_id_here
SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5000/callback

# HuggingFace API (Optional - leave empty for local sentiment analysis)
HUGGINGFACE_API_KEY=

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Session Secret (generate a random string)
SESSION_SECRET=change_this_to_a_random_string_min_32_chars
```

### 3.3 Generate Session Secret

Generate a secure random string for SESSION_SECRET:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `SESSION_SECRET` value.

---

## Step 4: Optional - HuggingFace Setup

For advanced sentiment analysis (optional):

1. Go to [HuggingFace](https://huggingface.co/)
2. Sign up for a free account
3. Go to [Access Tokens](https://huggingface.co/settings/tokens)
4. Create a new token
5. Add it to your `.env` file as `HUGGINGFACE_API_KEY`

**Note**: If you skip this, the app will use local sentiment analysis (basic but functional).

---

## Step 5: Run the Application

### 5.1 Development Mode (Both Frontend & Backend)

Start both servers with one command:

```powershell
npm run dev
```

This will start:
- **Backend API** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

### 5.2 Run Separately (Optional)

If you prefer to run them separately:

**Terminal 1 - Backend:**
```powershell
npm run server
```

**Terminal 2 - Frontend:**
```powershell
npm run client
```

---

## Step 6: Access the Application

1. Open your browser
2. Go to `http://localhost:5173`
3. Click **"Get Started with Spotify"**
4. Authorize the app with your Spotify account
5. Start creating playlists!

---

## Step 7: Verify Setup

### Check Backend Health

```powershell
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"Moodify API is running"}
```

### Check Database

The SQLite database (`moodify.db`) should be created automatically in the root directory when you first run the server.

---

## Troubleshooting

### Error: "Cannot find module 'express'"
**Solution:** Run `npm install` in the root directory

### Error: "Module not found: Can't resolve 'react'"
**Solution:** Run `npm install` in the `client` directory

### Error: "Redirect URI mismatch"
**Solution:** 
1. Check your `.env` file has the correct redirect URI
2. Verify it matches exactly in Spotify Dashboard settings
3. For local dev: `http://127.0.0.1:5000/callback`
4. For production: `https://yourdomain.com/callback` (must use HTTPS)

### Error: "Invalid client ID or secret"
**Solution:**
1. Double-check your credentials in `.env`
2. Make sure there are no extra spaces
3. Regenerate credentials in Spotify Dashboard if needed

### Database locked error
**Solution:** Close the app and delete `moodify.db`, it will be recreated

### Port already in use
**Solution:** 
```powershell
# Find what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the PORT in .env file
```

### CORS errors
**Solution:** Make sure `CLIENT_URL` in `.env` matches your frontend URL

---

## Building for Production

### Frontend Build

```powershell
cd client
npm run build
```

This creates optimized static files in `client/dist/`

### Production Server

```powershell
npm start
```

**Note:** For production:
1. Use PostgreSQL instead of SQLite
2. Set `NODE_ENV=production`
3. Use HTTPS
4. Enable rate limiting
5. Add logging and monitoring

---

## Project Structure

```
Moodify/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── context/        # Context providers
│   │   ├── utils/          # Utilities (API client)
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── server/                  # Node.js backend
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   ├── database/           # Database initialization
│   └── index.js            # Server entry point
│
├── .env                     # Environment variables (create this)
├── .env.example            # Example environment file
├── package.json            # Backend dependencies
├── moodify.db              # SQLite database (auto-created)
└── README.md               # Project documentation
```

---

## Development Tips

### 1. Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Nodemon automatically restarts on file changes

### 2. Database Inspection
To view the database:
- Install [DB Browser for SQLite](https://sqlitebrowser.org/)
- Open `moodify.db` in the root directory

### 3. API Testing
Use tools like:
- **Postman** - [Download](https://www.postman.com/)
- **Thunder Client** (VS Code extension)
- **curl** (command line)

### 4. Console Logs
Check the terminal for:
- API requests and responses
- Database queries
- Error messages
- Spotify API interactions

---

## Next Steps

1. **Customize**: Modify moods, hobbies, and genre mappings in `server/services/aiService.js`
2. **Extend**: Add new features like playlist sharing or advanced analytics
3. **Deploy**: Host on platforms like Heroku, Railway, or Vercel
4. **Scale**: Migrate to PostgreSQL and add Redis caching

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review `API_DOCUMENTATION.md` for endpoint details
3. Check `ARCHITECTURE.md` for system design
4. Enable debug mode by setting `DEBUG=*` in your environment

---

## Security Reminders

⚠️ **NEVER commit `.env` file to version control**
⚠️ **NEVER share your Spotify Client Secret publicly**
⚠️ **Change SESSION_SECRET before deploying**
⚠️ **Use HTTPS in production**

---

Happy playlist generating! 🎵
