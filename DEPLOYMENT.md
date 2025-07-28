# 🚀 IoTrix Full-Stack Deployment Guide

This guide covers deploying your IoTrix chatbot application with both React frontend and FastAPI backend on a single free-tier platform.

## 📋 Overview

IoTrix is deployed as a unified application using:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + SQLite/PostgreSQL
- **Web Server**: Nginx (proxies API calls and serves static files)
- **Platform**: Railway (free tier)
- **Container**: Single Docker container with multi-stage build

## 🏗️ Architecture

```
Railway Container (Port 8080)
├── Nginx (Frontend + Reverse Proxy)
│   ├── Static Files (/var/www/html) → React App
│   └── API Routes (/api/*) → FastAPI Backend
└── FastAPI Backend (Port 8000)
    ├── Chat API (/chat)
    ├── Health Check (/health)
    └── Chat History (/history)
```

## 🚀 Quick Deploy

### Option 1: One-Click Deploy (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Deploy with our script**:
   ```bash
   cd IoTrix
   ./deploy-fullstack.sh
   ```

### Option 2: Manual Deploy

1. **Create Railway Project**:
   ```bash
   cd IoTrix
   railway init
   ```

2. **Deploy**:
   ```bash
   railway up
   ```

3. **Set Environment Variables** (optional):
   ```bash
   railway variables set OPENAI_API_KEY=your_key_here
   ```

## 🔧 Configuration Files

### Key Files for Deployment:
- `Dockerfile` - Unified container build
- `railway.toml` - Railway deployment config
- `nginx-fullstack.conf` - Web server configuration
- `.env.production` - Environment variables template

## 🌐 URL Structure

After deployment, your app will be available at:
- **Main App**: `https://your-app.railway.app/`
- **API Health**: `https://your-app.railway.app/health`
- **Chat API**: `https://your-app.railway.app/api/chat`

## 📱 Features

### Frontend Features:
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern UI with Tailwind CSS
- ✅ Real-time chat interface
- ✅ Loading animations and smooth scrolling
- ✅ Suggested questions for new users
- ✅ Message history

### Backend Features:
- ✅ RESTful API with FastAPI
- ✅ SQLite database for chat history
- ✅ AI-powered responses
- ✅ Health check endpoint
- ✅ CORS configured for frontend

### DevOps Features:
- ✅ Multi-stage Docker build for optimization
- ✅ Nginx reverse proxy for production
- ✅ Health checks and auto-restart
- ✅ Environment variable configuration
- ✅ Logs and monitoring ready

## 🔧 Environment Variables

Set these in your Railway dashboard:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional
DATABASE_URL=sqlite:///./data/iot_chatbot.db
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
```

## 📊 Monitoring

### Check Deployment Status:
```bash
railway status
```

### View Logs:
```bash
railway logs
```

### Check Health:
```bash
curl https://your-app.railway.app/health
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check that all required files are present
   - Verify `Dockerfile` is in the root directory
   - Check Railway build logs

2. **App Not Responding**:
   - Check health endpoint: `/health`
   - Verify port 8080 is exposed
   - Check Railway logs for errors

3. **API Calls Failing**:
   - Ensure frontend uses `/api/` prefix
   - Check CORS configuration
   - Verify backend is running on port 8000

4. **Static Files Not Loading**:
   - Check Nginx configuration
   - Verify build output is in `/var/www/html`
   - Check file permissions

### Debug Commands:
```bash
# Check container status
railway ps

# Stream logs
railway logs --follow

# Connect to container
railway run bash
```

## 💰 Free Tier Limits

Railway free tier includes:
- ✅ 512MB RAM
- ✅ 1 vCPU
- ✅ 1GB disk
- ✅ 100GB bandwidth/month
- ✅ Custom domain support

## 🔄 Updates

To update your deployment:

1. **Make changes to your code**
2. **Commit to git**:
   ```bash
   git add .
   git commit -m "Update app"
   ```
3. **Deploy**:
   ```bash
   railway up
   ```

## 🎯 Performance Tips

1. **Frontend**:
   - Images are optimized in build
   - CSS/JS minified automatically
   - Gzip compression enabled

2. **Backend**:
   - Database queries optimized
   - Response caching headers set
   - Health checks lightweight

3. **Infrastructure**:
   - Single container reduces overhead
   - Nginx handles static files efficiently
   - SQLite for minimal resource usage

## 🔐 Security

- ✅ HTTPS enforced by Railway
- ✅ CORS properly configured
- ✅ Environment variables for secrets
- ✅ Non-root container user
- ✅ Security headers in Nginx

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

---

## 🎉 Congratulations!

Your IoTrix chatbot is now live on the internet! 🌍

Both your beautiful React frontend and powerful FastAPI backend are running together on Railway's free tier. Users can now chat with your AI assistant from anywhere in the world.

**What's Next?**
- Add custom domain
- Set up monitoring
- Add more AI features
- Scale up as needed

Happy coding! 🚀
