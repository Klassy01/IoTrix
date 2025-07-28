#!/bin/bash

# 🚀 IoTrix Deployment Script
set -e

echo "🚀 Starting IoTrix deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please update the .env file with your configuration before continuing."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
    print_error "GEMINI_API_KEY is not set in .env file"
    exit 1
fi

# Build and start services
print_status "Building and starting IoTrix services..."

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Build images
print_status "Building Docker images..."
docker-compose build --no-cache

# Start services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check service health
print_status "Checking service health..."

# Check database
if docker-compose exec database pg_isready -U $POSTGRES_USER > /dev/null 2>&1; then
    print_success "Database is ready"
else
    print_error "Database is not ready"
fi

# Check backend
if curl -f http://localhost:8000/ > /dev/null 2>&1; then
    print_success "Backend is ready"
else
    print_error "Backend is not ready"
fi

# Check frontend
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    print_success "Frontend is ready"
else
    print_error "Frontend is not ready"
fi

print_success "🎉 IoTrix deployment completed!"
print_status "🌐 Frontend: http://localhost:3000"
print_status "🔗 Backend API: http://localhost:8000"
print_status "🗄️ Database: localhost:5432"

print_status "📊 To view logs: docker-compose logs -f"
print_status "🛑 To stop services: docker-compose down"
print_status "🔄 To restart services: docker-compose restart"
