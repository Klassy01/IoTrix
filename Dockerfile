# 🚀 Full-Stack IoTrix Dockerfile
# This Dockerfile builds both frontend and backend in one container

# ================================
# STAGE 1: Build React Frontend
# ================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY iotrix-frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY iotrix-frontend/ ./

# Build frontend
RUN npm run build

# ================================
# STAGE 2: Build Python Backend
# ================================
FROM python:3.10-slim AS backend-builder

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# ================================
# STAGE 3: Production Runtime
# ================================
FROM python:3.10-slim AS production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
COPY --from=backend-builder /usr/local/bin/ /usr/local/bin/

# Copy backend application
COPY --from=backend-builder /app/backend/ ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist/ /var/www/html/

# Copy Nginx configuration for full-stack
COPY nginx-fullstack.conf /etc/nginx/sites-available/default

# Remove default nginx configuration
RUN rm -f /etc/nginx/sites-enabled/default && 
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Create supervisor configuration
RUN mkdir -p /var/log/supervisor && 
    echo '[supervisord]' > /etc/supervisor/conf.d/supervisord.conf && 
    echo 'nodaemon=true' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'user=root' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'logfile=/var/log/supervisor/supervisord.log' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'pidfile=/var/run/supervisord.pid' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo '[program:nginx]' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'user=root' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stdout_logfile=/var/log/supervisor/nginx.log' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stderr_logfile=/var/log/supervisor/nginx.log' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stdout_logfile_maxbytes=10MB' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stderr_logfile_maxbytes=10MB' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo '[program:fastapi]' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'command=python -m uvicorn main:app --host 127.0.0.1 --port 8000' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'directory=/app/backend' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'user=appuser' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stdout_logfile=/var/log/supervisor/fastapi.log' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stderr_logfile=/var/log/supervisor/fastapi.log' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stdout_logfile_maxbytes=10MB' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'stderr_logfile_maxbytes=10MB' >> /etc/supervisor/conf.d/supervisord.conf && 
    echo 'environment=PYTHONPATH=/app/backend' >> /etc/supervisor/conf.d/supervisord.conf

# Set ownership
RUN chown -R appuser:appuser /app /var/www/html && 
    chmod +x /app/backend/main.py

# Create database directory
RUN mkdir -p /app/backend/data && 
    chown -R appuser:appuser /app/backend/data

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 
    CMD curl -f http://localhost:8080/health || exit 1

# Start supervisor (must run as root for nginx)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
