#!/bin/bash

# IoTrix Full-Stack Deployment Script
# This script deploys both frontend and backend to Railway using unified Dockerfile

set -e

echo "🚀 Starting IoTrix Full-Stack Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI is not installed.${NC}"
    echo "Please install it from: https://docs.railway.app/develop/cli"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "railway.toml" ]; then
    echo -e "${RED}❌ railway.toml not found. Please run this script from the IoTrix directory.${NC}"
    exit 1
fi

# Login to Railway (if not already logged in)
echo -e "${YELLOW}🔐 Checking Railway authentication...${NC}"
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

# Check if project is linked, if not create and link
echo -e "${YELLOW}🔗 Checking project link...${NC}"
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}📋 Creating new Railway project...${NC}"
    railway login
    echo -e "${GREEN}✅ Logged in successfully!${NC}"
    echo -e "${YELLOW}🆕 Initializing new project...${NC}"
    railway init
    echo -e "${GREEN}✅ Project created and linked!${NC}"
fi

# Build and deploy
echo -e "${YELLOW}🏗️  Building and deploying to Railway...${NC}"

# Deploy using the unified Dockerfile
railway up --detach

echo -e "${GREEN}✅ Deployment initiated successfully!${NC}"
echo -e "${YELLOW}📊 You can monitor the deployment with:${NC}"
echo "   railway logs"
echo "   railway status"
echo ""
echo -e "${YELLOW}🌐 Once deployed, your app will be available at:${NC}"
echo "   https://your-app-name.railway.app"
echo ""
echo -e "${GREEN}🎉 Full-stack deployment complete!${NC}"
echo "Both your React frontend and FastAPI backend are now running together."
