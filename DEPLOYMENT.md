# Deployment Guide

This guide will help you deploy your Discord Status Bot to various cloud platforms.

## Quick Deploy to Railway (Recommended)

Railway is the easiest way to deploy your Discord bot with automatic deployments and environment variable management.

### Step 1: Create GitHub Repository

1. Create a new repository on GitHub called `discord-status-bot`
2. Push all the files from the `discord-status-bot/` directory to this repository

### Step 2: Deploy to Railway

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `discord-status-bot` repository
5. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables

In your Railway project dashboard:

1. Go to "Variables" tab
2. Add these environment variables:
   - `DISCORD_BOT_TOKEN`: Your Discord bot token
   - `DISCORD_USER_ID`: Your Discord user ID (555954001431232514)
   - `DISCORD_GUILD_ID`: Your Discord server ID
   - `CORS_ORIGINS`: Your portfolio domain (e.g., https://everettyan.com)
   - `NODE_ENV`: production

### Step 4: Deploy

1. Railway will automatically deploy your bot
2. You'll get a URL like `https://your-bot-name.railway.app`
3. Test the endpoints:
   - `https://your-bot-name.railway.app/api/status`
   - `https://your-bot-name.railway.app/api/health`

### Step 5: Update Portfolio

Update your portfolio's StatusDisplay component to use the Railway URL:

```javascript
const API_URL = 'https://your-bot-name.railway.app/api/status';
```

---

## Deploy to Render

### Step 1: Create Render Account

1. Go to [Render](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Create Web Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: discord-status-bot
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Environment Variables

Add these in the Render dashboard:

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_USER_ID`: 555954001431232514
- `DISCORD_GUILD_ID`: Your server ID
- `CORS_ORIGINS`: Your portfolio domain
- `NODE_ENV`: production

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will build and deploy your bot
3. You'll get a URL like `https://discord-status-bot.onrender.com`

---

## Deploy to Vercel (Serverless)

> **Note**: Vercel is serverless, so the bot will only run when API endpoints are called. This might not be ideal for real-time status updates.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Configure Vercel

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "DISCORD_BOT_TOKEN": "@discord-bot-token",
    "DISCORD_USER_ID": "@discord-user-id",
    "DISCORD_GUILD_ID": "@discord-guild-id",
    "CORS_ORIGINS": "@cors-origins"
  }
}
```

### Step 3: Deploy

```bash
vercel --prod
```

---

## Deploy with Docker

### Step 1: Build Image

```bash
docker build -t discord-status-bot .
```

### Step 2: Run Container

```bash
docker run -d -p 3000:3000 \
  --name discord-status-bot \
  -e DISCORD_BOT_TOKEN=your_token \
  -e DISCORD_USER_ID=555954001431232514 \
  -e DISCORD_GUILD_ID=your_guild_id \
  -e CORS_ORIGINS=https://your-domain.com \
  discord-status-bot
```

### Step 3: Deploy to Cloud

You can deploy the Docker container to:
- **Google Cloud Run**
- **AWS ECS**
- **Azure Container Instances**
- **DigitalOcean App Platform**

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_BOT_TOKEN` | Bot token from Discord Developer Portal | `MTIzNDU2Nzg5MDEyMzQ1Njc4OTA...` |
| `DISCORD_USER_ID` | Your Discord user ID | `555954001431232514` |
| `DISCORD_GUILD_ID` | Discord server ID where bot is added | `123456789012345678` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `https://everettyan.com,https://localhost:3000` |
| `PORT` | Port for the API server | `3000` |
| `NODE_ENV` | Environment (development/production) | `production` |

---

## Testing Your Deployment

### Check Bot Status

```bash
curl https://your-bot-url.com/api/health
```

### Check API Response

```bash
curl https://your-bot-url.com/api/status
```

### Test in Portfolio

Update your portfolio's API URL and test the status display.

---

## Troubleshooting

### Bot Not Responding

1. Check if bot token is correct
2. Verify bot is in your Discord server
3. Ensure Privileged Gateway Intents are enabled
4. Check server logs for errors

### API Returning 500 Error

1. Check environment variables are set correctly
2. Verify Discord user ID and guild ID are correct
3. Check if bot has proper permissions in server

### CORS Issues

1. Make sure `CORS_ORIGINS` includes your portfolio domain
2. Check if the domain format is correct (include https://)
3. For local development, include localhost URLs

---

## Monitoring

### Health Check

Most platforms support health checks using the `/api/health` endpoint.

### Logs

Check your deployment platform's logs for:
- Bot connection status
- API request logs
- Error messages

### Uptime Monitoring

Consider using services like:
- UptimeRobot
- Pingdom
- StatusCake

To monitor your bot's uptime and get alerts when it goes down.

---

## Security Best Practices

1. **Never commit your bot token** to version control
2. **Use environment variables** for all sensitive data
3. **Limit CORS origins** to your specific domains
4. **Use HTTPS** for all API endpoints
5. **Regularly rotate** your bot token
6. **Monitor** for unauthorized access

---

## Next Steps

1. Deploy your bot to Railway or Render
2. Update your portfolio to use the deployed endpoint
3. Test the status display on your portfolio
4. Set up monitoring and alerts
5. Consider adding rate limiting for production use 