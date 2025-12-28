# G3ZKP Messenger - Complete Render Deployment Guide

**Last Updated:** December 28, 2025  
**Target Platform:** Render.com (Free Tier Compatible)  
**GitHub Repository:** https://github.com/GENESISGARMENTSLTD/G3TZKP-MESSENGER-BETA-MAIN

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
3. [Step 2: Deploy Backend (Web Service)](#step-2-deploy-backend-web-service)
4. [Step 3: Deploy Frontend (Static Site)](#step-3-deploy-frontend-static-site)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Where to Get API Keys](#where-to-get-api-keys)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Before deploying, ensure you have:

- [ ] A GitHub account with your code pushed to a repository
- [ ] A Render account (free at [render.com](https://render.com))
- [ ] API keys for external services (see [Where to Get API Keys](#where-to-get-api-keys))

---

## Step 1: Push Code to GitHub

### 1.1 Ensure Your Repository Structure

Your repository should have this structure:
```
your-repo/
├── g3tzkp-messenger UI/     # Frontend folder
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── messaging-server.js       # Backend server (in repo root)
├── package.json              # Root package.json
├── Packages/                 # Shared packages
├── zkp-circuits/             # ZKP circuits
└── .env.example              # Environment template
```

### 1.2 Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Add remote (your repository)
git remote add origin https://github.com/GENESISGARMENTSLTD/G3TZKP-MESSENGER-BETA-MAIN.git

# Push
git push -u origin main
```

---

## Step 2: Deploy Backend (Web Service)

The backend handles all API proxying, Socket.IO messaging, and external service integrations.

### 2.1 Create the Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select your repository from the list

### 2.2 Configure the Web Service

| Setting | Value |
|---------|-------|
| **Name** | `g3zkp-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `.` (leave blank or use `.`) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node messaging-server.js` |
| **Plan** | `Free` |

### 2.3 Add Environment Variables

In the **Environment** section, click **Add Environment Variable** for each:

| Key | Value | Required |
|-----|-------|----------|
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `3001` | ✅ Yes |
| `SESSION_SECRET` | `your-random-64-char-string` | ✅ Yes |
| `COMPANIES_HOUSE_API_KEY` | `your-api-key` | ✅ Yes |
| `TFL_API_KEY` | `your-tfl-key` | Optional |
| `OPENSKY_USERNAME` | `your-username` | Optional |
| `OPENSKY_PASSWORD` | `your-password` | Optional |
| `RAPIDAPI_KEY` | `your-rapidapi-key` | Optional |
| `BETA_MODE` | `true` | Recommended |
| `ALLOWED_ORIGINS` | `https://g3zkp-messenger.onrender.com` | ✅ Yes |

> **Generate SESSION_SECRET:** Run this in terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 2.4 Create the Service

1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. **Note your backend URL:** `https://g3zkp-backend.onrender.com`

### 2.5 Verify Backend

Visit: `https://g3zkp-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "app": "G3ZKP Messenger Server",
  "version": "1.0.0",
  "betaMode": true
}
```

---

## Step 3: Deploy Frontend (Static Site)

The frontend is a Vite-built React PWA that connects to your backend.

### 3.1 Create the Static Site

1. On Render Dashboard, click **New +** → **Static Site**
2. Connect the same GitHub repository
3. Select your repository

### 3.2 Configure the Static Site

| Setting | Value |
|---------|-------|
| **Name** | `g3zkp-messenger` |
| **Branch** | `main` |
| **Root Directory** | `g3tzkp-messenger UI` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.3 Add Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://g3zkp-backend.onrender.com` |

> **Important:** Replace `g3zkp-backend` with your actual backend service name from Step 2.

### 3.4 Add Redirect Rules (for SPA Routing)

In the Static Site settings, add a redirect rule:

| Source | Destination | Type |
|--------|-------------|------|
| `/*` | `/index.html` | `Rewrite` |

This ensures React Router works correctly.

### 3.5 Create the Service

1. Click **Create Static Site**
2. Wait for build and deployment (5-10 minutes)
3. Your app will be available at: `https://g3zkp-messenger.onrender.com`

---

## Environment Variables Reference

### Backend Environment Variables (Web Service)

```env
# ============================================
# REQUIRED - Server will not function without these
# ============================================
NODE_ENV=production
PORT=3001
SESSION_SECRET=your_64_char_random_secret_here

# CORS - Your frontend URL(s)
ALLOWED_ORIGINS=https://g3zkp-messenger.onrender.com

# ============================================
# BUSINESS VERIFICATION (UK Companies House)
# ============================================
COMPANIES_HOUSE_API_KEY=your_key_here

# ============================================
# TRANSIT APIs (Optional but recommended)
# ============================================
TFL_API_KEY=your_tfl_key

# ============================================
# FLIGHT TRACKING (Optional)
# ============================================
OPENSKY_USERNAME=your_username
OPENSKY_PASSWORD=your_password
RAPIDAPI_KEY=your_rapidapi_key

# ============================================
# LICENSING
# ============================================
BETA_MODE=true
LICENSE_SECRET_KEY=your_license_secret

# ============================================
# ZKP ENGINE
# ============================================
ZKP_CIRCUITS_PATH=./zkp-circuits
ZKP_MODE=simulation
```

### Frontend Environment Variables (Static Site)

```env
# Backend API URL (REQUIRED)
VITE_API_URL=https://g3zkp-backend.onrender.com
```

---

## Where to Get API Keys

### 1. Companies House API Key (Required for Business Verification)

| Detail | Value |
|--------|-------|
| **Website** | https://developer.company-information.service.gov.uk/ |
| **Cost** | Free |
| **Sign Up** | Create account → Create application → Get API key |
| **Rate Limit** | 600 requests/5 minutes |

### 2. Transport for London (TfL) API Key

| Detail | Value |
|--------|-------|
| **Website** | https://api-portal.tfl.gov.uk/ |
| **Cost** | Free |
| **Sign Up** | Register → Create app → Copy app_key |
| **Use** | London transit routing |

### 3. OpenSky Network (Flight Tracking)

| Detail | Value |
|--------|-------|
| **Website** | https://opensky-network.org/ |
| **Cost** | Free |
| **Sign Up** | Create account → Use username/password |
| **Use** | Live flight tracking |

### 4. RapidAPI Key (Flight Search)

| Detail | Value |
|--------|-------|
| **Website** | https://rapidapi.com/ |
| **Cost** | Free tier available |
| **Sign Up** | Create account → Subscribe to Aerodatabox API |
| **Use** | Flight search and booking links |

### 5. Session Secret (Self-Generated)

Generate a random 64-character string:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Python
python -c "import secrets; print(secrets.token_hex(32))"

# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

---

## Post-Deployment Verification

### Checklist

Run through these tests after deployment:

- [ ] **Backend Health:** `https://your-backend.onrender.com/api/health` returns OK
- [ ] **Frontend Loads:** `https://your-frontend.onrender.com` shows the app
- [ ] **WebSocket Connection:** Check browser console for `[MessagingService] Using VITE_API_URL:`
- [ ] **Navigation Works:** Map loads, search works, routing calculates
- [ ] **Business Verification:** Try registering a business (needs valid API key)

### Testing API Proxies

Test that external APIs route through your backend:

```bash
# Test navigation search
curl "https://your-backend.onrender.com/api/navigation/search?q=London"

# Test health endpoint
curl "https://your-backend.onrender.com/api/health"

# Test Companies House (if key configured)
curl -X POST "https://your-backend.onrender.com/api/verify-company" \
  -H "Content-Type: application/json" \
  -d '{"crn":"00000006"}'
```

---

## Troubleshooting

### Backend Won't Start

**Error:** `Error: Cannot find module 'express'`

**Solution:** Ensure `npm install` runs in Build Command:
```
Build Command: npm install
```

### Frontend Can't Connect to Backend

**Symptom:** WebSocket connection fails, API calls return errors

**Solutions:**
1. Verify `VITE_API_URL` is set correctly in frontend environment
2. Check `ALLOWED_ORIGINS` in backend includes your frontend URL
3. Ensure backend is using `https://` (not `http://`)

### CORS Errors

**Error:** `Access-Control-Allow-Origin` header missing

**Solution:** Add your frontend URL to backend's `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://g3zkp-messenger.onrender.com,https://your-custom-domain.com
```

### Build Fails on Frontend

**Error:** `vite: command not found` or build errors

**Solutions:**
1. Ensure Root Directory is `g3tzkp-messenger UI` (with space)
2. Build Command should be: `npm install && npm run build`
3. Check Publish Directory is `dist` (not `build`)

### Free Tier Sleep Issues

Render free tier services sleep after 15 minutes of inactivity.

**Solutions:**
1. Accept ~30 second cold start on first request
2. Use a service like UptimeRobot to ping your backend every 14 minutes
3. Upgrade to paid tier for always-on service

---

## API Proxy Architecture

All external API calls route through your backend for security and CORS handling:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│  Frontend PWA   │ ───► │  Backend Server  │ ───► │  External Services  │
│  (Static Site)  │      │  (Web Service)   │      │                     │
└─────────────────┘      └──────────────────┘      └─────────────────────┘
        │                        │                          │
        │  /api/navigation/*     │  → OSRM/Nominatim       │
        │  /api/transit/*        │  → TfL, BVG, SBB, etc   │
        │  /api/verify-company   │  → Companies House      │
        │  /api/zkp/*            │  → ZKP Engine           │
        │  Socket.IO             │  → P2P Messaging        │
```

**Why Proxy?**
- API keys stay secure on backend (never exposed to browser)
- Avoids CORS issues with external services
- Allows rate limiting and caching
- Centralized error handling

---

## Quick Reference Card

### Backend (Web Service)
```
Name: g3zkp-backend
Root: .
Build: npm install
Start: node messaging-server.js
```

### Frontend (Static Site)
```
Name: g3zkp-messenger
Root: g3tzkp-messenger UI
Build: npm install && npm run build
Publish: dist
```

### Essential Environment Variables
```
# Backend
NODE_ENV=production
PORT=3001
SESSION_SECRET=<random-64-chars>
ALLOWED_ORIGINS=https://g3zkp-messenger.onrender.com
COMPANIES_HOUSE_API_KEY=<your-key>
BETA_MODE=true

# Frontend
VITE_API_URL=https://g3zkp-backend.onrender.com
```

---

## Support

If you encounter issues:
1. Check Render logs (Dashboard → Your Service → Logs)
2. Verify environment variables are set correctly
3. Test API endpoints individually with curl
4. Check browser console for frontend errors

---

**Deployment Complete!** 🚀

Your G3ZKP Messenger should now be live at:
- **Frontend:** `https://g3zkp-messenger.onrender.com`
- **Backend:** `https://g3zkp-backend.onrender.com`
