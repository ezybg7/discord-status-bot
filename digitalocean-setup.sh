#!/bin/bash

# DigitalOcean Droplet Setup Script for Discord Status Bot
# Run this script on your DigitalOcean droplet after creating it

echo "🚀 Setting up Discord Status Bot on DigitalOcean Droplet..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install nginx
echo "📦 Installing nginx..."
sudo apt install nginx -y

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/discord-status-bot
sudo chown $USER:$USER /var/www/discord-status-bot

# Clone repository (you'll need to do this manually)
echo "📋 Next steps:"
echo "1. Clone your repository:"
echo "   git clone https://github.com/ezybg7/discord-status-bot.git /var/www/discord-status-bot"
echo ""
echo "2. Install dependencies:"
echo "   cd /var/www/discord-status-bot && npm install"
echo ""
echo "3. Create .env file:"
echo "   nano /var/www/discord-status-bot/.env"
echo ""
echo "4. Start the application:"
echo "   pm2 start src/index.js --name discord-status-bot"
echo ""
echo "5. Save PM2 configuration:"
echo "   pm2 save && pm2 startup"
echo ""
echo "6. Configure nginx (see nginx.conf in this directory)"
echo ""
echo "✅ Setup script completed!" 