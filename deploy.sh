#!/bin/bash

# Gemura Angular App Deployment Script for cPanel
echo "🚀 Deploying Gemura Angular App..."

# Build the application
echo "📦 Building Angular application..."
ng build --configuration production

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Copy built files to deployment directory
    echo "📁 Copying files to deployment directory..."
    
    # Create deployment directory if it doesn't exist
    mkdir -p dist/gemura-web
    
    # Copy all files from dist/frontend/browser to deployment directory
    cp -r dist/frontend/browser/* dist/gemura-web/
    
    # Copy .htaccess file
    cp .htaccess dist/gemura-web/
    
    echo "✅ Deployment files ready in dist/gemura-web/"
    echo "📋 Next steps:"
    echo "   1. Upload the contents of dist/gemura-web/ to your cPanel public_html directory"
    echo "   2. Ensure your domain points to the correct directory"
    echo "   3. Test the application at your domain"
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
