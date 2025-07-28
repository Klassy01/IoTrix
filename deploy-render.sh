#!/bin/bash

# IoTrix Render Deployment Script
# Deploy your full-stack app to Render.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 IoTrix Render Deployment Guide${NC}"
echo "===================================="

echo -e "${GREEN}✅ Your app is ready for Render deployment!${NC}"
echo ""

echo -e "${YELLOW}📋 Deployment Steps:${NC}"
echo ""

echo -e "${BLUE}1. Create Render Account:${NC}"
echo "   Visit: https://render.com and sign up (free)"
echo ""

echo -e "${BLUE}2. Connect GitHub Repository:${NC}"
echo "   • Go to your Render dashboard"
echo "   • Click 'New +'  → 'Web Service'"
echo "   • Connect your GitHub account"
echo "   • Select this repository: IoTrix"
echo ""

echo -e "${BLUE}3. Configure Service:${NC}"
echo "   • Name: iotrix-fullstack"
echo "   • Region: Oregon (US West)"
echo "   • Branch: main"
echo "   • Build Command: (leave empty)"
echo "   • Start Command: (leave empty)"
echo "   • Environment: Docker"
echo "   • Plan: Free"
echo ""

echo -e "${BLUE}4. Set Environment Variables (Optional):${NC}"
echo "   • OPENAI_API_KEY=your_api_key_here"
echo "   • ENVIRONMENT=production"
echo "   • DEBUG=false"
echo ""

echo -e "${BLUE}5. Deploy:${NC}"
echo "   • Click 'Create Web Service'"
echo "   • Render will automatically build and deploy your app"
echo "   • Your app will be live at: https://iotrix-fullstack.onrender.com"
echo ""

echo -e "${GREEN}🎯 Render Features:${NC}"
echo "• ✅ Free tier: 512MB RAM, shared CPU"
echo "• ✅ Custom domains supported"
echo "• ✅ Automatic HTTPS"
echo "• ✅ Git-based deployments"
echo "• ✅ Build logs and monitoring"
echo "• ✅ No credit card required"
echo ""

echo -e "${YELLOW}📊 Alternative: One-Click Deploy${NC}"
echo "You can also deploy with this button in your GitHub README:"
echo ""
echo "[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Klassy01/IoTrix)"
echo ""

echo -e "${GREEN}🎉 Your IoTrix app will be live in ~3-5 minutes!${NC}"
