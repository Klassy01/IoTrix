# 🐳 IoTrix Docker Deployment Guide

This guide will help you deploy the complete IoTrix application using Docker and Docker Compose.

## 📋 Prerequisites

- 🐳 [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- 🐙 [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- 🌐 Internet connection (for pulling base images)

## 🚀 Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/Klassy01/IoTrix.git
   cd IoTrix
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   nano .env
   ```

3. **Deploy with one command**:
   ```bash
   ./deploy.sh
   ```

## 🔧 Manual Deployment

If you prefer manual deployment:

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
# Required: GEMINI_API_KEY
# Optional: Database credentials, Redis URL, etc.
```

### 2. Build and Start Services
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Verify Deployment
```bash
# Check service status
docker-compose ps

# Test backend API
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000/health
```

## 🏗️ Architecture

The Docker setup includes:

- **Frontend**: React app served by Nginx (Port 3000)
- **Backend**: FastAPI application (Port 8000)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis (Port 6379) - Optional

## 🌐 Access Points

After deployment, access your application at:

- 🖥️ **Frontend**: http://localhost:3000
- 🔗 **Backend API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs
- 🗄️ **Database**: localhost:5432

## 🛠️ Management Commands

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f backend
```

### Database Management
```bash
# Access database
docker-compose exec database psql -U iotrix -d iotdb

# Backup database
docker-compose exec database pg_dump -U iotrix iotdb > backup.sql

# Restore database
docker-compose exec -T database psql -U iotrix -d iotdb < backup.sql
```

### Development
```bash
# Rebuild specific service
docker-compose build backend

# Run with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit real credentials to git
2. **Database**: Use strong passwords in production
3. **Network**: Use reverse proxy (nginx/traefik) in production
4. **SSL**: Enable HTTPS in production
5. **Firewall**: Restrict access to necessary ports only

## 🚀 Production Deployment

For production deployment:

1. **Use production environment file**:
   ```bash
   cp .env.example .env.production
   # Configure production values
   ```

2. **Use production Docker Compose**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy** (nginx/traefik)
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database connection issues**:
   ```bash
   # Check database logs
   docker-compose logs database
   # Verify database is ready
   docker-compose exec database pg_isready -U iotrix
   ```

3. **Frontend not loading**:
   ```bash
   # Check nginx logs
   docker-compose logs frontend
   # Verify build completed
   docker-compose build frontend --no-cache
   ```

### Health Checks
```bash
# Check all service health
docker-compose ps

# Manual health checks
curl http://localhost:8000/health  # Backend
curl http://localhost:3000/health  # Frontend
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last N lines
docker-compose logs --tail=50 backend
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes (⚠️ This will delete data!)
docker volume prune
```

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions

For more help, create an issue on the GitHub repository.
