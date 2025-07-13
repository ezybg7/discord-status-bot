const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Configuration
const config = {
  port: process.env.PORT || 3000,
  discordToken: process.env.DISCORD_BOT_TOKEN,
  userId: process.env.DISCORD_USER_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*']
};

// Validate required environment variables
const requiredVars = ['DISCORD_BOT_TOKEN', 'DISCORD_USER_ID', 'DISCORD_GUILD_ID'];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// Express server setup
const app = express();

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Store user status with default values
let userStatus = {
  status: 'offline',
  activities: [],
  lastUpdated: new Date().toISOString(),
  isOnline: false
};

// Discord bot events
client.once('ready', () => {
  console.log(`✅ Discord bot ready! Logged in as ${client.user.tag}`);
  console.log(`📡 Monitoring user: ${config.userId}`);
  
  // Initial status check
  updateUserStatus();
  
  // Check status every 30 seconds
  setInterval(updateUserStatus, 30000);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (newPresence && newPresence.userId === config.userId) {
    console.log(`📡 Status update detected for user ${newPresence.userId}`);
    updateUserStatus();
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.on('reconnecting', () => {
  console.log('🔄 Discord client reconnecting...');
});

client.on('disconnect', (event) => {
  console.log('⚠️ Discord client disconnected:', event);
});

// Function to update user status
async function updateUserStatus() {
  try {
    const guild = client.guilds.cache.get(config.guildId);
    if (!guild) {
      console.error('❌ Guild not found. Make sure the bot is in the correct server.');
      return;
    }

    const member = await guild.members.fetch(config.userId).catch(() => null);
    if (!member) {
      console.error('❌ Member not found. Make sure the user is in the server.');
      userStatus = {
        status: 'offline',
        activities: [],
        lastUpdated: new Date().toISOString(),
        isOnline: false
      };
      return;
    }

    const presence = member.presence;
    const status = presence ? presence.status : 'offline';
    const activities = presence ? presence.activities.map(activity => ({
      name: activity.name,
      type: activity.type,
      details: activity.details || null,
      state: activity.state || null,
      timestamps: activity.timestamps || null,
      emoji: activity.emoji || null
    })) : [];

    userStatus = {
      status,
      activities,
      lastUpdated: new Date().toISOString(),
      isOnline: status !== 'offline'
    };

    console.log(`✅ Status updated: ${status}`);
    
    if (activities.length > 0) {
      console.log('📝 Activities:', activities.map(a => `${a.name} (${a.type})`).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Error updating status:', error);
  }
}

// API Routes
app.get('/', (req, res) => {
  res.json({
    name: 'Discord Status Bot',
    version: '1.0.0',
    status: 'online',
    uptime: process.uptime(),
    endpoints: {
      status: '/api/status',
      health: '/api/health'
    }
  });
});

app.get('/api/status', (req, res) => {
  res.json(userStatus);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    discord: {
      connected: client.readyAt !== null,
      readyAt: client.readyAt,
      guilds: client.guilds.cache.size,
      ping: client.ws.ping
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Endpoint not found'
  });
});

// Start Express server
const server = app.listen(config.port, () => {
  console.log(`🚀 API server running on port ${config.port}`);
  console.log(`🌐 CORS enabled for origins: ${config.corsOrigins.join(', ')}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ HTTP server closed.');
    client.destroy();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Login to Discord
client.login(config.discordToken).catch(error => {
  console.error('❌ Failed to login to Discord:', error);
  process.exit(1);
}); 