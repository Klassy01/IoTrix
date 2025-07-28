# 🐳 IoTrix Frontend Dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user
RUN addgroup -g 1001 -S iotrix && \
    adduser -S iotrix -u 1001 -G iotrix

# Change ownership of nginx directories
RUN chown -R iotrix:iotrix /usr/share/nginx/html && \
    chown -R iotrix:iotrix /var/cache/nginx && \
    chown -R iotrix:iotrix /var/log/nginx && \
    chown -R iotrix:iotrix /etc/nginx/conf.d

# Create nginx pid directory
RUN mkdir -p /var/run/nginx && \
    chown -R iotrix:iotrix /var/run/nginx

# Switch to non-root user
USER iotrix

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
