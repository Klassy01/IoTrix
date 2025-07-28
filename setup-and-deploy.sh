#!/bin/bash

# IoTrix Railway Setup & Deploy Script
# Run this script to set up and deploy your full-stack app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 IoTrix Railway Setup & Deployment${NC}"
echo "=================================="

# Step 1: Check Railway CLI
echo -e "${YELLOW}📦 Step 1: Checking Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found.${NC}"
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Railway CLI installed successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to install Railway CLI. Please install manually:${NC}"
        echo "https://docs.railway.app/develop/cli"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Railway CLI found!${NC}"
fi

# Step 2: Login to Railway
echo -e "${YELLOW}🔐 Step 2: Railway Authentication...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to Railway (browser will open):${NC}"
    railway login
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Logged in successfully!${NC}"
    else
        echo -e "${RED}❌ Login failed. Please try again.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Already logged in to Railway!${NC}"
fi

# Step 3: Initialize Project
echo -e "${YELLOW}🎯 Step 3: Setting up Railway project...${NC}"
if ! railway status &> /dev/null 2>&1; then
    echo -e "${YELLOW}Creating new Railway project...${NC}"
    railway init --name "iotrix-fullstack"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Project 'iotrix-fullstack' created!${NC}"
    else
        echo -e "${RED}❌ Failed to create project. Trying manual setup...${NC}"
        railway init
    fi
else
    echo -e "${GREEN}✅ Project already linked!${NC}"
fi

# Step 4: Deploy
echo -e "${YELLOW}🚀 Step 4: Deploying your app...${NC}"
echo -e "${BLUE}This will build and deploy your React frontend + FastAPI backend${NC}"

railway up --detach

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL! 🎉${NC}"
    echo "================================"
    echo -e "${YELLOW}📊 Monitor deployment:${NC} railway logs"
    echo -e "${YELLOW}📈 Check status:${NC} railway status"
    echo -e "${YELLOW}🌐 Get URL:${NC} railway domain"
    echo ""
    echo -e "${BLUE}⚙️  Optional: Set OpenAI API Key${NC}"
    echo -e "${YELLOW}railway variables set OPENAI_API_KEY=your_key_here${NC}"
    echo ""
    echo -e "${GREEN}🎯 Your IoT chatbot is now live on the internet!${NC}"
else
    echo -e "${RED}❌ Deployment failed. Check logs with: railway logs${NC}"
    exit 1
fi
