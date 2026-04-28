# 🔥 Firebase Hosting Deployment Guide

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

Browser mein Google account se login karo.

## Step 3: Initialize Firebase

```bash
firebase init hosting
```

### Prompts ke answers:

1. **Use an existing project or create a new one?**
   - Select: **Use an existing project** (agar already project hai)
   - Ya: **Create a new project** (naya banane ke liye)

2. **What do you want to use as your public directory?**
   - Type: `dist`

3. **Configure as a single-page app (rewrite all urls to /index.html)?**
   - Type: `y` (Yes)

4. **Set up automatic builds and deploys with GitHub?**
   - Type: `n` (No) - Manual deploy karenge

5. **File dist/index.html already exists. Overwrite?**
   - Type: `n` (No)

## Step 4: Build Your App

```bash
npm run build
```

## Step 5: Deploy to Firebase

```bash
firebase deploy
```

## Step 6: Get Your Live URL

Firebase deploy complete hone ke baad, terminal mein URL dikhega:
```
Hosting URL: https://your-project.web.app
```

## Step 7: Add Environment Variable

Firebase Hosting static files serve karta hai, to environment variable build time pe set karna padega.

### Option A: .env file (Local build)

```bash
# .env file banao
echo "VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api" > .env

# Build karo
npm run build

# Deploy karo
firebase deploy
```

### Option B: Command line (One-time)

```bash
# Build with env variable
VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api npm run build

# Deploy
firebase deploy
```

## Step 8: Update CORS in Railway

Firebase URL copy karo aur Railway mein update karo:

1. Railway dashboard → **Variables**
2. `ALLOWED_ORIGINS` edit karo:
   ```
   https://your-project.web.app,http://localhost:5173
   ```
3. Save karo

## Complete Commands (Copy-Paste)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize
firebase init hosting
# Select: dist, Yes for SPA, No for GitHub

# 4. Create .env file (Replace YOUR-RAILWAY-URL)
echo "VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api" > .env

# 5. Build
npm run build

# 6. Deploy
firebase deploy

# 7. Done! Copy the Hosting URL
```

## Firebase Configuration Files

After `firebase init`, ye files ban jayengi:

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## Update Deployment (After Changes)

```bash
# 1. Make changes in code
# 2. Build
npm run build

# 3. Deploy
firebase deploy

# Done! Changes live in 30 seconds
```

## Custom Domain (Optional)

1. Firebase Console → Hosting → Add custom domain
2. Follow DNS setup instructions
3. Update CORS in Railway with new domain

## Troubleshooting

### Issue: "Firebase command not found"
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied"
```bash
sudo npm install -g firebase-tools
```

### Issue: "Build fails"
```bash
# Check .env file exists
cat .env

# Should show:
# VITE_API_URL=https://...
```

### Issue: "CORS error on live site"
```bash
# Check Railway ALLOWED_ORIGINS includes Firebase URL
# Should be: https://your-project.web.app
```

## Your Live URLs

- **Frontend**: `https://your-project.web.app`
- **Backend**: `https://your-railway-url.up.railway.app`
- **API**: `https://your-railway-url.up.railway.app/api`

## Firebase vs Vercel

| Feature | Firebase | Vercel |
|---------|----------|--------|
| Setup | Manual build | Auto build |
| Env Vars | Build time | Runtime |
| Speed | Fast | Very Fast |
| Free Tier | 10GB/month | 100GB/month |
| Custom Domain | Free | Free |

## 🎉 Done!

Your app is now live on Firebase Hosting! 🔥
