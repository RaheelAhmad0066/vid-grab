# VidGrab Deployment Guide 🚀

## Railway Deployment (Backend)

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository

### Step 1: Prepare Backend Files

All required files are already created in the `server/` directory:
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Railway process file
- ✅ `runtime.txt` - Python version
- ✅ `railway.toml` - Railway configuration
- ✅ `server.py` - Updated with environment variables

### Step 2: Deploy to Railway

#### Option A: Deploy from GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Create New Project on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `server` directory as root

3. **Configure Environment Variables**
   - Go to your project settings
   - Add environment variables:
     ```
     PORT=8787
     ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
     ```

4. **Deploy**
   - Railway will automatically detect Python and deploy
   - Wait for deployment to complete
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

#### Option B: Deploy with Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd server
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set PORT=8787
   railway variables set ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

### Step 3: Update Frontend Configuration

1. **Set Environment Variable**
   
   The frontend now uses environment variables for the API URL. You have two options:

   **Option A: Create `.env` file (for local testing)**
   ```bash
   # Create .env file in project root
   echo "VITE_API_URL=https://your-railway-app.railway.app/api" > .env
   ```

   **Option B: Set in deployment platform (recommended for production)**
   - Vercel: Add environment variable in project settings
   - Netlify: Add environment variable in build settings
   - See "Frontend Deployment" section below for details

2. **Test Locally**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Frontend Deployment

### Option 1: Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-railway-app.railway.app/api`
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app is live! 🎉

**Or use Vercel CLI:**
```bash
npm install -g vercel
vercel
# Follow prompts and add VITE_API_URL when asked
vercel --prod
```

### Option 2: Netlify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Import Project in Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-railway-app.railway.app/api`

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Your app is live! 🎉

**Or use Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify init
# Add environment variable in Netlify dashboard
netlify deploy --prod
```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/vidgrab"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Environment Variables

### Backend (Railway)
```env
PORT=8787
ALLOWED_ORIGINS=https://your-frontend.com,http://localhost:5173
PYTHON_VERSION=3.13.7
```

**How to set in Railway:**
```bash
railway variables set PORT=8787
railway variables set ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Or in Railway Dashboard:
- Go to your project
- Click "Variables" tab
- Add each variable

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=https://your-railway-app.railway.app/api
```

**How to set in Vercel:**
- Project Settings → Environment Variables
- Add `VITE_API_URL` with your Railway backend URL
- Redeploy to apply changes

**How to set in Netlify:**
- Site settings → Environment variables
- Add `VITE_API_URL` with your Railway backend URL
- Trigger new deploy

**Local Development:**
Create a `.env` file in project root:
```env
VITE_API_URL=http://localhost:8787/api
```

**Note:** The `.env` file is gitignored and won't be committed to your repository.

## Post-Deployment Checklist

- [ ] Backend is running on Railway
- [ ] Frontend is deployed
- [ ] API URL is updated in frontend
- [ ] CORS is configured correctly
- [ ] Test video download functionality
- [ ] Test all platforms
- [ ] Check error handling
- [ ] Monitor Railway logs

## Troubleshooting

### Backend Issues

**Problem: CORS errors**
```bash
# Check ALLOWED_ORIGINS environment variable
railway variables
```

**Problem: FFmpeg not found**
```bash
# Railway should auto-install ffmpeg
# Check build logs in Railway dashboard
```

**Problem: Port binding error**
```bash
# Ensure PORT environment variable is set
railway variables set PORT=8787
```

### Frontend Issues

**Problem: API connection failed**
- Check `VITE_API_URL` environment variable in your deployment platform
- Verify Railway backend is running: visit `https://your-app.railway.app/api/health`
- Check browser console for CORS errors
- Ensure ALLOWED_ORIGINS in Railway includes your frontend domain

**Problem: Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Monitoring

### Railway Dashboard
- View logs: `railway logs`
- Check metrics: Railway dashboard
- Monitor usage: Railway dashboard

### Frontend Analytics
- Add Google Analytics
- Add Sentry for error tracking
- Monitor with Vercel/Netlify analytics

## Scaling

### Backend
- Railway automatically scales
- Monitor usage in dashboard
- Upgrade plan if needed

### Frontend
- CDN is automatic with Vercel/Netlify
- Enable caching
- Optimize assets

## Security

### Backend
- ✅ CORS configured
- ✅ SSL/TLS enabled (Railway default)
- ✅ Environment variables for secrets
- ✅ Rate limiting (add if needed)

### Frontend
- ✅ HTTPS only
- ✅ No API keys in frontend
- ✅ Content Security Policy
- ✅ XSS protection

## Cost Estimation

### Railway (Backend)
- **Free Tier**: $5 credit/month
- **Hobby Plan**: $5/month
- **Pro Plan**: $20/month

### Vercel/Netlify (Frontend)
- **Free Tier**: Unlimited for personal projects
- **Pro Plan**: $20/month (if needed)

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

## Quick Deploy Commands

```bash
# 1. Deploy Backend to Railway
cd server
railway login
railway init
railway up
railway variables set PORT=8787
railway variables set ALLOWED_ORIGINS=https://your-frontend.vercel.app

# 2. Get your Railway URL
railway status
# Copy the URL (e.g., https://your-app.railway.app)

# 3. Deploy Frontend to Vercel
cd ..
vercel
# When prompted, add environment variable:
# VITE_API_URL=https://your-app.railway.app/api
vercel --prod

# 4. Update CORS in Railway
railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app

# Done! 🎉
```

**Alternative: Use Web Dashboards**
1. Deploy backend: https://railway.app → New Project → Deploy from GitHub
2. Add environment variables in Railway dashboard
3. Deploy frontend: https://vercel.com → New Project → Import from GitHub
4. Add `VITE_API_URL` environment variable in Vercel dashboard

## Success! 🎉

Your VidGrab app is now live!

- Backend: https://your-app.railway.app
- Frontend: https://your-app.vercel.app

Test it out and enjoy! 🚀
