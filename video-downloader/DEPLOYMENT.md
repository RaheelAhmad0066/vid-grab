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

1. **Update API URL**
   
   Edit `src/constants/platforms.js`:
   ```javascript
   export const API_BASE_URL = 'https://your-railway-app.railway.app/api'
   ```

2. **Rebuild Frontend**
   ```bash
   npm run build
   ```

## Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
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

### Frontend (Build Time)
```env
VITE_API_URL=https://your-railway-app.railway.app/api
```

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
- Check API_BASE_URL in `src/constants/platforms.js`
- Verify Railway backend is running
- Check browser console for CORS errors

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
# Backend (Railway)
cd server
railway login
railway init
railway up
railway variables set PORT=8787
railway variables set ALLOWED_ORIGINS=https://your-frontend.com

# Frontend (Vercel)
cd ..
vercel
vercel --prod

# Update API URL
# Edit src/constants/platforms.js
# Change API_BASE_URL to your Railway URL
```

## Success! 🎉

Your VidGrab app is now live!

- Backend: https://your-app.railway.app
- Frontend: https://your-app.vercel.app

Test it out and enjoy! 🚀
