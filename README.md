# 🚀 IoTrix - AI-Powered IoT Assistant

A modern, responsive chatbot for IoT and networking support, built with React and FastAPI.

## ✨ Features

- 🤖 **AI-Powered Chat**: Intelligent responses for IoT and networking questions
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- ⚡ **Fast & Lightweight**: Optimized for performance
- 🌐 **Single Deployment**: Frontend and backend in one container

## 🚀 Quick Deploy to Railway (Free)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login & Deploy**:
   ```bash
   railway login
   cd IoTrix
   ./deploy-fullstack.sh
   ```

3. **Set API Key** (optional):
   ```bash
   railway variables set OPENAI_API_KEY=your_key_here
   ```

That's it! Your app will be live at `https://your-app.railway.app` 🎉

## 🏗️ Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend  
cd iotrix-frontend
npm install
npm run dev
```

## 📊 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + SQLite
- **Deployment**: Docker + Railway + Nginx

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Docker Guide](./DOCKER_DEPLOYMENT.md) - Docker-specific deployment

## 🔧 Environment Variables

```bash
OPENAI_API_KEY=your_api_key_here  # For AI responses
DATABASE_URL=sqlite:///./data/iot_chatbot.db  # Database
```

## 🎯 Demo

Live demo: [Coming Soon]

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Made with ❤️ for the IoT community**
