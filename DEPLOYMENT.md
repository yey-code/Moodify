# Moodify Deployment Guide

## Step 1: Push to GitHub

```bash
cd c:\xampp\htdocs\Moodify
git init
git add .
git commit -m "Initial commit - Moodify AI Playlist Generator"
git branch -M main
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/moodify.git
git push -u origin main
```

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Moodify repository
4. Railway will auto-detect Node.js

### Configure Environment Variables in Railway:

Click on your service → Variables tab → Add these:

```
NODE_ENV=production
PORT=5000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-railway-app.railway.app/callback
SESSION_SECRET=your_session_secret
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Set Root Directory:
- Go to Settings → Root Directory → Set to `server`
- Start Command: `node index.js`

5. Click "Deploy" - Railway will give you a URL like `https://moodify-production.up.railway.app`

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Add Environment Variable in Vercel:

Go to Settings → Environment Variables → Add:

```
VITE_API_URL=https://your-railway-app.railway.app/api
```

5. Click "Deploy"

## Step 4: Update Spotify Developer Dashboard

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click "Edit Settings"
4. Add Redirect URIs:
   ```
   http://127.0.0.1:5000/callback (keep for local dev)
   https://your-railway-app.railway.app/callback (production)
   ```
5. Save

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Click "Get Started with Spotify"
3. Login and test playlist generation

## Troubleshooting

### CORS Errors
- Make sure `CLIENT_URL` in Railway matches your Vercel URL exactly
- Check that cookies are enabled

### Callback Issues
- Verify Spotify redirect URI matches Railway URL exactly
- Check Railway logs for errors

### Database Issues
- Railway uses ephemeral filesystem - for production, consider:
  - Using Railway's PostgreSQL addon (recommended)
  - Or switch to a hosted database

## Optional: Use Railway PostgreSQL (Recommended for Production)

1. In Railway, click "New" → "Database" → "Add PostgreSQL"
2. Railway will add `DATABASE_URL` environment variable automatically
3. Update your code to use PostgreSQL instead of SQLite

---

**Important Notes:**
- Never commit `.env` files
- Redeploy after any code changes by pushing to GitHub
- Both Railway and Vercel have free tiers perfect for this project
