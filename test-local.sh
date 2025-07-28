#!/bin/bash

# Local Testing Script for IoTrix Full-Stack

echo "🧪 Testing IoTrix locally..."

# Build the container
echo "🏗️  Building container..."
docker build -t iotrix-test .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Run the container
    echo "🚀 Starting container on port 8080..."
    docker run -d -p 8080:8080 --name iotrix-test-container iotrix-test
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started!"
        echo "🌐 Testing endpoints..."
        
        # Wait a moment for startup
        sleep 10
        
        # Test health endpoint
        echo "🩺 Health check..."
        curl -f http://localhost:8080/health
        
        if [ $? -eq 0 ]; then
            echo "✅ Health check passed!"
            echo "🎉 Success! Your app is running at:"
            echo "   Frontend: http://localhost:8080"
            echo "   API: http://localhost:8080/api/"
            echo ""
            echo "To stop: docker stop iotrix-test-container"
            echo "To remove: docker rm iotrix-test-container"
        else
            echo "❌ Health check failed"
            docker logs iotrix-test-container
        fi
    else
        echo "❌ Failed to start container"
    fi
else
    echo "❌ Build failed"
fi
