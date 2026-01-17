# ⚡ SpeedLeague - Reaction Speed Game

A production-ready reaction-speed game built with Next.js 14, NextUI, MongoDB, and Redis. Test your reflexes and compete with players worldwide!

## 🎯 Features

- **Reflex Duel Game**: Test your reaction time with a simple tap-when-green mechanic
- **Global Leaderboards**: Compete with players worldwide with real-time rankings
- **Daily Challenges**: Limited attempts per day with streak bonuses
- **Streak System**: Build streaks for bonus attempts (up to 5 per day)
- **League System**: Climb from Bronze to Apex based on performance
- **World ID Verification**: Optional human verification via Worldcoin
- **PWA Support**: Install as a mobile app for native-like experience
- **Anti-Cheat**: Built-in validation to ensure fair play
- **Real-time Stats**: Track your best times, percentiles, and improvements

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: NextUI components
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas (with Mongoose ODM)
- **Cache**: Redis (for leaderboards and rate limiting)
- **Deployment**: Railway
- **Authentication**: World ID (@worldcoin/idkit)
- **Language**: TypeScript

## 📁 Project Structure

```
speedleague/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── duel/              # Duel game page
│   │   ├── leaderboard/       # Leaderboard page
│   │   ├── stats/             # Stats page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── game/             # Game-related components
│   │   ├── leaderboard/      # Leaderboard components
│   │   └── stats/            # Stats components
│   ├── lib/                  # Utility libraries
│   │   ├── mongodb.ts        # MongoDB connection
│   │   ├── redis.ts          # Redis client & helpers
│   │   ├── antiCheat.ts      # Validation logic
│   │   ├── worldid.ts        # World ID verification
│   │   └── utils.ts          # Helper functions
│   ├── models/               # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Attempt.ts
│   │   ├── DailyBest.ts
│   │   └── League.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # App icons
├── railway.json              # Railway config
├── package.json
├── next.config.js
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Redis instance (Upstash free tier or Railway)
- (Optional) World ID App credentials

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Daksha1107/SpeedLeague.git
   cd SpeedLeague
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/speedleague

   # Redis (Upstash or local)
   REDIS_URL=redis://default:password@localhost:6379

   # World ID (optional)
   NEXT_PUBLIC_WORLD_ID_APP_ID=app_xxx
   WORLD_ID_ACTION=speedleague_verify

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development

   # JWT Secret (generate with: openssl rand -base64 32)
   JWT_SECRET=your-secret-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP address to the IP whitelist
4. Create a database user
5. Get your connection string and add it to `.env.local`

### Collections

The app automatically creates these collections:

- **users**: User accounts and stats
- **attempts**: Individual reaction time attempts
- **daily_bests**: Best time per day per user
- **leagues**: Weekly league standings

### Indexes

Indexes are automatically created via Mongoose schemas for optimal query performance.

## 💾 Redis Setup

### Option 1: Upstash (Recommended for production)

1. Sign up at [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the Redis URL to your `.env.local`

### Option 2: Local Redis (Development)

```bash
# Install Redis
brew install redis  # macOS
# or
sudo apt-get install redis  # Ubuntu

# Start Redis
redis-server

# Your REDIS_URL will be:
REDIS_URL=redis://localhost:6379
```

### Option 3: Railway Redis

When deploying to Railway, add Redis as a service and Railway will automatically provide the `REDIS_URL` environment variable.

## 🌍 World ID Integration

1. Go to [Worldcoin Developer Portal](https://developer.worldcoin.org)
2. Create a new app
3. Copy your App ID to `NEXT_PUBLIC_WORLD_ID_APP_ID`
4. Set your action to `speedleague_verify`

## 🚂 Railway Deployment

### Quick Deploy

1. **Push your code to GitHub**

2. **Connect Railway to your repo**
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your GitHub repository

3. **Add environment variables**
   
   In Railway dashboard, add all variables from `.env.example`:
   - `MONGODB_URI`
   - `REDIS_URL` (or add Redis service)
   - `NEXT_PUBLIC_WORLD_ID_APP_ID`
   - `WORLD_ID_ACTION`
   - `NEXT_PUBLIC_APP_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. **Add Redis service** (optional)
   - Click "New Service"
   - Select "Redis"
   - Railway will automatically set `REDIS_URL`

5. **Deploy**
   - Railway will automatically build and deploy your app
   - Your app will be available at `https://your-app.up.railway.app`

### Custom Domain

1. In Railway dashboard, go to Settings
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` to your domain

## 🎮 Game Mechanics

### Duel Mode

1. Click "PLAY DUEL" on the home screen
2. Wait for the screen to turn green
3. Tap as fast as you can
4. Your reaction time is measured in milliseconds

### Attempt Limits

- Base: 3 attempts per day
- Day 3 streak: +1 attempt (4 total)
- Day 7+ streak: +2 attempts (5 total)
- Resets daily at midnight UTC

### Speed Tiers

| Icon | Tier | Time Range |
|------|------|------------|
| ⚡ | Lightning | < 200ms |
| 💨 | Blur | 200-300ms |
| 🎯 | Steady | 300-400ms |
| 🐌 | Slow | > 400ms |

### League System

Calculated weekly based on best single attempt:

| League | Percentile | Approx. Time |
|--------|-----------|--------------|
| ⚡ Apex | Top 1% | < 170ms |
| 💎 Diamond | Top 1-5% | 170-200ms |
| 🥇 Gold | Top 5-20% | 200-250ms |
| 🥈 Silver | Top 20-40% | 250-300ms |
| 🥉 Bronze | Bottom 60% | > 300ms |

## 📡 API Documentation

### POST /api/attempt

Submit a reaction time attempt.

**Request:**
```json
{
  "userId": "user_123",
  "reactionMs": 187,
  "isFalseStart": false,
  "timestamp": "2025-01-17T12:00:00Z",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "attemptSaved": true,
  "isDailyBest": true,
  "currentPercentile": 88.2,
  "rank": 847,
  "attemptsRemaining": 2
}
```

### GET /api/stats/[userId]

Get user statistics.

**Response:**
```json
{
  "dailyBest": 187,
  "currentLeague": "Gold",
  "currentStreak": 5,
  "longestStreak": 12,
  "attemptsRemaining": 3,
  "allTimeBest": 165,
  "weeklyBest": 187
}
```

### GET /api/leaderboard

Get global leaderboard.

**Query Parameters:**
- `scope`: "global" | country code
- `period`: "today" | "week" | "alltime"
- `limit`: number (default 100)
- `userId`: string (optional)

**Response:**
```json
{
  "entries": [
    {
      "userId": "user_123",
      "rank": 1,
      "reactionMs": 145,
      "country": "US",
      "isVerified": true
    }
  ],
  "totalPlayers": 1000,
  "userRank": 50,
  "userPercentile": 95.0
}
```

### POST /api/worldid/verify

Verify World ID proof.

**Request:**
```json
{
  "proof": "...",
  "merkle_root": "...",
  "nullifier_hash": "...",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "World ID verified successfully"
}
```

### GET /api/health

Health check endpoint for Railway.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-17T12:00:00Z"
}
```

## 🔒 Anti-Cheat System

The app includes multiple anti-cheat measures:

1. **Range Validation**: Reaction times must be 100-2000ms
2. **Timestamp Verification**: Attempts must be submitted within 10s
3. **Rate Limiting**: Daily attempt limits enforced via Redis
4. **False Start Detection**: Premature taps are flagged
5. **Statistical Analysis**: Suspicious patterns are flagged (future)
6. **Device Fingerprinting**: Track devices (future)

## 🔧 Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## 📱 PWA Features

The app is a Progressive Web App with:

- Offline support via Service Worker
- Install prompt on mobile devices
- App-like experience
- Cached assets for fast loading

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this project for learning or building your own games!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [NextUI](https://nextui.org/)
- Icons from [Emoji](https://emojipedia.org/)
- Verification via [Worldcoin](https://worldcoin.org/)

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check the [documentation](https://github.com/Daksha1107/SpeedLeague)

---

**Happy Gaming! ⚡**
