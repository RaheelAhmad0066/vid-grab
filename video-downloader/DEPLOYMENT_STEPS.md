# VidGrab - Complete Deployment Guide 🚀

## Overview
- **Backend**: Railway (Python Flask server in `server/` folder)
- **Frontend**: Vercel/Netlify (React Vite app in root folder)

---

## Part 1: Backend Deployment (Railway) ✅

### Step 1: Railway Setup

Aap already Railway pe ho! Ab ye karo:

#### 1.1 Root Directory Set Karo
Railway dashboard mein:
1. **Settings** tab pe jao
2. **"Add Root Directory"** option dhundo
3. Root directory set karo: `server`
4. Save karo

#### 1.2 Environment Variables Add Karo
Railway dashboard → **Variables** tab:

```bash
PORT=8787
ALLOWED_ORIGINS=*
PYTHON_VERSION=3.13.7
```

**Important:** Baad mein `ALLOWED_ORIGINS` ko apne frontend URL se replace karna:
```bash
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

#### 1.3 Deploy Karo
1. **Deploy** button click karo
2. Wait for deployment (2-3 minutes)
3. Railway automatically detect karega:
   - `requirements.txt`
   - `Procfile`
   - `runtime.txt`

#### 1.4 Backend URL Copy Karo
Deployment complete hone ke baad:
1. **Deployments** tab pe jao
2. URL copy karo (e.g., `https://vid-grab-production.up.railway.app`)
3. Ye URL frontend mein use hoga

---

## Part 2: Frontend Deployment (Vercel) 🎨

### Step 2.1: Code Push to GitHub

```bash
# Terminal mein ye commands run karo:

# 1. Git status check karo
git status

# 2. All changes add karo
git add .

# 3. Commit karo
git commit -m "Ready for deployment with Railway backend"

# 4. Push karo
git push origin main
```

### Step 2.2: Vercel Deployment

#### Option A: Vercel Dashboard (Recommended)

1. **Vercel pe jao**: https://vercel.com
2. **Sign in** with GitHub
3. **"New Project"** click karo
4. **Import** your repository
5. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: **Leave empty** (frontend is in root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Environment Variables** add karo:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   ```
   ⚠️ Replace with your actual Railway URL!

7. **Deploy** button click karo
8. Wait 2-3 minutes
9. Done! ✅

#### Option B: Vercel CLI

```bash
# 1. Vercel CLI install karo
npm install -g vercel

# 2. Login karo
vercel login

# 3. Deploy karo
vercel

# 4. Production deploy karo
vercel --prod
```

---

## Part 3: Environment Variables Setup 🔧

### Backend (Railway)
```env
PORT=8787
ALLOWED_ORIGINS=https://your-frontend.vercel.app
PYTHON_VERSION=3.13.7
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app/api
```

### Local Development
Create `.env` file in root:
```env
VITE_API_URL=http://localhost:8787/api
```

---

## Part 4: Post-Deployment Steps ✅

### 4.1 Update CORS in Railway

Backend deploy hone ke baad:
1. Railway dashboard → **Variables**
2. `ALLOWED_ORIGINS` update karo:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
   ```
3. **Redeploy** karo

### 4.2 Test Your App

1. **Backend Health Check**:
   ```
   https://your-backend.railway.app/api/health
   ```
   Response: `{"status": "ok", "yt_dlp": "..."}`

2. **Frontend Test**:
   - Open: `https://your-app.vercel.app`
   - Paste YouTube URL
   - Click "Analyze Video"
   - Should work! ✅

---

## Part 5: Troubleshooting 🔍

### Issue 1: CORS Error
**Problem**: Frontend can't connect to backend

**Solution**:
1. Railway → Variables → Check `ALLOWED_ORIGINS`
2. Should include your Vercel URL
3. Redeploy backend

### Issue 2: Backend Not Found
**Problem**: 404 error on API calls

**Solution**:
1. Check `VITE_API_URL` in Vercel
2. Should end with `/api`
3. Example: `https://backend.railway.app/api`
4. Redeploy frontend

### Issue 3: Build Failed
**Problem**: Vercel build fails

**Solution**:
```bash
# Locally test build
npm run build

# If fails, check:
# 1. Node version (should be 18+)
# 2. Dependencies installed
# 3. No TypeScript errors
```

### Issue 4: Video Download Fails
**Problem**: Videos not downloading

**Solution**:
1. Check Railway logs:
   ```bash
   railway logs
   ```
2. Look for ffmpeg errors
3. Railway should auto-install ffmpeg
4. If not, check `requirements.txt`

---

## Part 6: Quick Deploy Commands 📝

### Complete Deployment (One-time)

```bash
# 1. Commit all changes
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Deploy backend (Railway)
# - Go to Railway dashboard
# - Click "Deploy"
# - Copy backend URL

# 3. Deploy frontend (Vercel)
vercel --prod
# When asked for env vars, add:
# VITE_API_URL=https://your-railway-url.up.railway.app/api

# 4. Update CORS
# - Railway → Variables
# - ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
# - Redeploy
```

### Update Deployment (After Changes)

```bash
# 1. Push changes
git add .
git commit -m "Update features"
git push origin main

# 2. Railway auto-deploys ✅
# 3. Vercel auto-deploys ✅
```

---

## Part 7: Project Structure 📁

```
video-downloader/
├── server/                 # Backend (Railway)
│   ├── server.py          # Flask app
│   ├── requirements.txt   # Python deps
│   ├── Procfile          # Railway config
│   ├── runtime.txt       # Python version
│   └── railway.toml      # Railway settings
│
├── src/                   # Frontend (Vercel)
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── utils/
│
├── public/               # Static assets
├── index.html           # Entry point
├── package.json         # Node deps
├── vite.config.js       # Vite config
└── .env                 # Local env vars (gitignored)
```

---

## Part 8: URLs After Deployment 🌐

### Your Live URLs:
- **Backend**: `https://vid-grab-production.up.railway.app`
- **Frontend**: `https://vidgrab.vercel.app` (or your custom domain)
- **API Endpoint**: `https://vid-grab-production.up.railway.app/api`

### Test Endpoints:
```bash
# Health check
curl https://your-backend.railway.app/api/health

# Video info
curl -X POST https://your-backend.railway.app/api/info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## Part 9: Custom Domain (Optional) 🌍

### Railway Custom Domain:
1. Railway → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Update DNS records
4. Update `VITE_API_URL` in Vercel

### Vercel Custom Domain:
1. Vercel → Settings → Domains
2. Add custom domain: `yourdomain.com`
3. Update DNS records
4. Update `ALLOWED_ORIGINS` in Railway

---

## Part 10: Monitoring & Logs 📊

### Railway Logs:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs

# Follow logs (live)
railway logs --follow
```

### Vercel Logs:
1. Vercel Dashboard → Your Project
2. **Deployments** tab
3. Click on deployment
4. View **Build Logs** and **Function Logs**

---

## Part 11: Cost Estimation 💰

### Railway (Backend):
- **Free Tier**: $5 credit/month
- **Hobby**: $5/month (500 hours)
- **Pro**: $20/month (unlimited)

### Vercel (Frontend):
- **Hobby**: Free (personal projects)
- **Pro**: $20/month (commercial)

### Total Cost:
- **Development**: $0/month (free tiers)
- **Production**: $5-10/month (hobby plans)

---

## Part 12: Success Checklist ✅

Before going live, verify:

- [ ] Backend deployed on Railway
- [ ] Backend health check returns OK
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test video download (YouTube)
- [ ] Test video download (other platforms)
- [ ] Mobile responsive working
- [ ] Settings panel working
- [ ] History saving working
- [ ] Dark/Light mode working
- [ ] All platform icons showing
- [ ] Video preview modal working

---

## Part 13: Quick Reference 📚

### Railway Commands:
```bash
railway login
railway link
railway up
railway logs
railway variables
railway status
```

### Vercel Commands:
```bash
vercel login
vercel
vercel --prod
vercel logs
vercel env ls
vercel domains
```

### Git Commands:
```bash
git status
git add .
git commit -m "message"
git push origin main
git pull origin main
```

---

## Part 14: Support & Resources 🆘

### Documentation:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Vite: https://vitejs.dev
- Flask: https://flask.palletsprojects.com

### Community:
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel

### Your Project Docs:
- `FEATURES.md` - All features list
- `ARCHITECTURE.md` - Code structure
- `DEPLOYMENT.md` - Detailed deployment
- `IMPROVEMENTS.md` - Recent changes

---

## 🎉 You're Ready to Deploy!

Follow the steps in order:
1. ✅ Backend to Railway (with root directory = `server`)
2. ✅ Frontend to Vercel (with environment variable)
3. ✅ Update CORS in Railway
4. ✅ Test everything
5. ✅ Go live!

**Need help?** Check the troubleshooting section or Railway/Vercel logs!

Good luck! 🚀
