# Discord Status Bot

A Discord bot that monitors a user's online status and provides a REST API endpoint for integration with portfolio websites and other applications.

## Features

- 🔄 Real-time Discord status monitoring
- 📡 REST API endpoints for status retrieval
- 🎮 Activity tracking (games, custom status, etc.)
- 🌐 CORS support for web applications
- 📊 Health check endpoint
- 🔐 Secure environment variable configuration
- 🚀 Ready for deployment on Railway, Render, or any cloud platform

## API Endpoints

### `GET /api/status`
Returns the current Discord status of the monitored user.

**Response:**
```json
{
  "status": "online",
  "activities": [
    {
      "name": "Visual Studio Code",
      "type": 0,
      "details": "Working on portfolio",
      "state": "TypeScript",
      "timestamps": null,
      "emoji": null
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "isOnline": true
}
```

### `GET /api/health`
Returns the health status of the bot and API.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "discord": {
    "connected": true,
    "readyAt": "2024-01-15T10:00:00.000Z",
    "guilds": 1,
    "ping": 25
  }
}
```

## Setup Instructions

### Prerequisites

- Node.js 18.0.0 or higher
- A Discord account
- A Discord server where you can add the bot

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Portfolio Status Bot"
4. Go to "Bot" tab
5. Click "Add Bot"
6. Copy the bot token
7. Enable "Presence Intent" and "Server Members Intent" under "Privileged Gateway Intents"

### 2. Invite Bot to Your Server

1. Go to "OAuth2" > "URL Generator"
2. Select "bot" scope
3. Select these permissions:
   - View Channels
   - Read Message History
4. Copy the generated URL and invite the bot to your server

### 3. Get Required IDs

- **User ID**: Right-click your Discord profile → "Copy User ID"
- **Guild ID**: Right-click your server → "Copy Server ID"

*Note: You need to enable Developer Mode in Discord Settings → Advanced → Developer Mode*

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_USER_ID=555954001431232514
DISCORD_GUILD_ID=your_server_id_here
CORS_ORIGINS=https://your-portfolio-domain.com,https://localhost:3000
PORT=3000
NODE_ENV=production
```

### 5. Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Deployment

### Deploy to Railway

1. Fork this repository
2. Connect to [Railway](https://railway.app)
3. Deploy from GitHub
4. Set environment variables in Railway dashboard
5. Deploy!

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/discord-status-bot)

### Deploy to Render

1. Fork this repository
2. Connect to [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables
6. Deploy!

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Deploy with Docker

```bash
# Build the image
docker build -t discord-status-bot .

# Run the container
docker run -d -p 3000:3000 \
  -e DISCORD_BOT_TOKEN=your_token \
  -e DISCORD_USER_ID=your_user_id \
  -e DISCORD_GUILD_ID=your_guild_id \
  discord-status-bot
```

## Usage in Your Portfolio

### JavaScript/TypeScript

```javascript
// Fetch current status
async function getDiscordStatus() {
  try {
    const response = await fetch('https://your-bot-domain.com/api/status');
    const data = await response.json();
    
    console.log(`Status: ${data.status}`);
    console.log(`Online: ${data.isOnline}`);
    
    if (data.activities.length > 0) {
      console.log(`Currently: ${data.activities[0].name}`);
    }
  } catch (error) {
    console.error('Failed to fetch status:', error);
  }
}

// Auto-refresh every 30 seconds
setInterval(getDiscordStatus, 30000);
```

### React Component

```jsx
import { useState, useEffect } from 'react';

function DiscordStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://your-bot-domain.com/api/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="discord-status">
      <div className={`status-dot ${status?.status || 'offline'}`}></div>
      <span>{status?.status || 'offline'}</span>
    </div>
  );
}
```

## Status Values

- `online` - User is online
- `idle` - User is away/idle
- `dnd` - User has "Do Not Disturb" enabled
- `offline` - User is offline or invisible

## Activity Types

- `0` - Playing a game
- `1` - Streaming
- `2` - Listening to music
- `3` - Watching
- `4` - Custom status
- `5` - Competing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/ezybg7/discord-status-bot/issues) page
2. Create a new issue if needed
3. Join our Discord server for help

## Acknowledgments

- Built with [Discord.js](https://discord.js.org/)
- Express.js for the API server
- Thanks to the Discord.js community for support 