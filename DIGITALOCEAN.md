# DigitalOcean Droplet Deployment Guide

This guide will help you deploy your Discord Status Bot to a DigitalOcean droplet.

## Prerequisites

- DigitalOcean account
- Domain name (optional, but recommended)
- SSH key set up

## Step 1: Create DigitalOcean Droplet

### 1.1 Create Droplet
1. Go to [DigitalOcean](https://digitalocean.com) and sign in
2. Click "Create" → "Droplets"
3. Choose configuration:
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic → Regular → $6/month (1GB RAM, 1 CPU)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: `discord-status-bot`

### 1.2 Connect to Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

## Step 2: Initial Server Setup

### 2.1 Create Non-Root User
```bash
# Create new user
adduser discordbot
usermod -aG sudo discordbot

# Switch to new user
su - discordbot
```

### 2.2 Set Up SSH Key (if using password)
```bash
# On your local machine
ssh-copy-id discordbot@YOUR_DROPLET_IP
```

### 2.3 Disable Root SSH (Security)
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh
```

## Step 3: Install Dependencies

### 3.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3.3 Install PM2
```bash
sudo npm install -g pm2
```

### 3.4 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Step 4: Deploy Application

### 4.1 Clone Repository
```bash
# Create application directory
sudo mkdir -p /var/www/discord-status-bot
sudo chown discordbot:discordbot /var/www/discord-status-bot

# Clone repository
cd /var/www
git clone https://github.com/ezybg7/discord-status-bot.git
cd discord-status-bot
```

### 4.2 Install Dependencies
```bash
npm install --production
```

### 4.3 Create Environment File
```bash
nano .env
```

Add your environment variables:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_USER_ID=555954001431232514
DISCORD_GUILD_ID=your_server_id_here
CORS_ORIGINS=https://your-portfolio-domain.com
PORT=3000
NODE_ENV=production
```

### 4.4 Create Logs Directory
```bash
mkdir logs
```

## Step 5: Configure Nginx

### 5.1 Copy Nginx Configuration
```bash
sudo cp nginx.conf /etc/nginx/sites-available/discord-status-bot
sudo ln -s /etc/nginx/sites-available/discord-status-bot /etc/nginx/sites-enabled/
```

### 5.2 Update Configuration
```bash
sudo nano /etc/nginx/sites-available/discord-status-bot
```

Replace `your-domain.com` with your actual domain or droplet IP.

### 5.3 Test and Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Start Application

### 6.1 Start with PM2
```bash
cd /var/www/discord-status-bot
pm2 start ecosystem.config.js --env production
```

### 6.2 Save PM2 Configuration
```bash
pm2 save
pm2 startup
# Follow the instructions to enable PM2 startup
```

### 6.3 Check Status
```bash
pm2 status
pm2 logs discord-status-bot
```

## Step 7: Set Up Firewall

### 7.1 Configure UFW
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7.2 Check Firewall Status
```bash
sudo ufw status
```

## Step 8: SSL Certificate (Optional but Recommended)

### 8.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

### 8.3 Auto-renewal
```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 9: Monitoring and Maintenance

### 9.1 Check Application Status
```bash
# PM2 status
pm2 status

# Application logs
pm2 logs discord-status-bot

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 9.2 Health Check
```bash
curl http://your-domain.com/api/health
curl http://your-domain.com/api/status
```

### 9.3 Update Application
```bash
cd /var/www/discord-status-bot
git pull
npm install --production
pm2 restart discord-status-bot
```

## Step 10: Update Portfolio

Update your portfolio's `StatusDisplay.astro`:

```javascript
const API_URL = 'https://your-domain.com/api/status';
```

## Troubleshooting

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs discord-status-bot

# Check if port is in use
sudo netstat -tlnp | grep :3000

# Restart application
pm2 restart discord-status-bot
```

### Nginx Issues
```bash
# Check nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx
```

### Discord Bot Issues
```bash
# Check bot logs
pm2 logs discord-status-bot

# Verify environment variables
cat .env

# Test Discord connection
node -e "console.log('Testing Discord connection...')"
```

## Security Best Practices

1. **Keep system updated**: `sudo apt update && sudo apt upgrade`
2. **Use SSH keys**: Disable password authentication
3. **Configure firewall**: Only allow necessary ports
4. **Use SSL**: Always use HTTPS in production
5. **Monitor logs**: Regularly check application and system logs
6. **Backup**: Set up regular backups of your application

## Cost Estimation

- **Droplet**: $6/month (Basic plan)
- **Domain**: ~$12/year (optional)
- **Total**: ~$84/year

## Next Steps

1. Set up monitoring (UptimeRobot, Pingdom)
2. Configure automatic backups
3. Set up log rotation
4. Consider using DigitalOcean's managed database if needed
5. Set up CI/CD for automatic deployments

Your Discord status bot is now running on a DigitalOcean droplet! 🚀 