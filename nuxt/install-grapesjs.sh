#!/bin/bash

# GrapesJS Installation Script for BouncePro

echo "🎨 Installing GrapesJS Website Builder..."
echo ""

# Check if running inside Docker or on host
if [ -f /.dockerenv ]; then
    echo "Running inside Docker container"
    pnpm add grapesjs grapesjs-preset-webpage
else
    echo "Running on host - using Docker Compose"
    docker compose exec nuxt pnpm add grapesjs grapesjs-preset-webpage

    echo ""
    echo "📦 Rebuilding Nuxt container..."
    docker compose up nuxt --build -d
fi

echo ""
echo "✅ GrapesJS installation complete!"
echo ""
echo "You can now access the website builder at:"
echo "http://localhost:3005/app/website/grapesjs-builder"
echo ""
echo "📚 Documentation: nuxt/app/pages/app/website/GRAPES_SETUP.md"
