# MiniKit Authentication Flow

This document explains how the Worldcoin MiniKit authentication is implemented in SpeedLeague.

## Overview

SpeedLeague uses Worldcoin's MiniKit SDK to provide secure, privacy-preserving authentication for World App mini apps. Users can sign in with their World ID or continue as guests.

## Architecture

### Components

1. **MiniKitProvider** (`src/components/auth/MiniKitProvider.tsx`)
   - Initializes the MiniKit SDK on app load
   - Configures the app with `NEXT_PUBLIC_WORLD_ID_APP_ID`
   - Wraps the entire application

2. **UserContext** (`src/components/auth/UserContext.tsx`)
   - Manages global authentication state
   - Persists user data in localStorage
   - Provides `useUser()` hook for accessing auth state

3. **AuthDrawer** (`src/components/auth/AuthDrawer.tsx`)
   - Drawer-based UI for sign-in flow
   - Two options: World ID verification or Guest mode
   - Handles authentication callbacks

### API Endpoints

#### `/api/auth/worldid` (POST)
Creates or retrieves a user based on World ID nullifier hash.

**Request:**
```json
{
  "proof": "...",
  "nullifier_hash": "0x...",
  "verification_level": "orb"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user_1234567890_abc123",
  "username": "Player1234",
  "isVerified": true
}
```

#### `/api/auth/guest` (POST)
Creates a new guest user account.

**Response:**
```json
{
  "success": true,
  "userId": "guest_1234567890_xyz789",
  "username": "Guest5678",
  "isVerified": false
}
```

#### `/api/user/profile` (POST)
Updates user profile (username, country).

**Request:**
```json
{
  "userId": "user_1234567890_abc123",
  "username": "NewUsername",
  "country": "US"
}
```

#### `/api/user/preferences` (GET/POST)
Manages user preferences (sound, theme, notifications).

**GET Request:**
```
/api/user/preferences?userId=user_1234567890_abc123
```

**POST Request:**
```json
{
  "userId": "user_1234567890_abc123",
  "preferences": {
    "soundEnabled": true,
    "theme": "dark",
    "notifications": true
  }
}
```

## Authentication Flow

### World ID Sign-In

1. User clicks "Sign in with World ID" in AuthDrawer
2. MiniKit opens World ID verification flow
3. User completes biometric verification (Orb level)
4. MiniKit returns `nullifier_hash` (unique user identifier)
5. Frontend sends verification payload to `/api/auth/worldid`
6. Backend:
   - Checks if user exists with this `worldId`
   - If new: Creates user with custom string ID
   - If existing: Updates `lastActive` timestamp
7. Returns user data to frontend
8. Frontend stores `userId` in localStorage
9. UserContext updates global state

### Guest Sign-In

1. User clicks "Continue as Guest"
2. Frontend calls `/api/auth/guest`
3. Backend creates new user with `guest_` prefix
4. Returns guest user data
5. Frontend stores `userId` in localStorage
6. UserContext updates global state

## Data Persistence

### User Model Schema

```typescript
{
  _id: String,                    // Custom ID (user_* or guest_*)
  username: String,               // Display name
  worldId: String,                // World ID nullifier (unique, sparse)
  isVerified: Boolean,            // True for World ID users
  country: String,                // User's country
  currentStreak: Number,          // Daily play streak
  longestStreak: Number,          // Best streak achieved
  lastPlayedDate: String,         // Last active date (YYYY-MM-DD)
  totalAttempts: Number,          // Total reaction attempts
  allTimeBest: Number,            // Best reaction time ever
  preferences: {
    soundEnabled: Boolean,
    theme: String,
    notifications: Boolean
  },
  createdAt: Date,
  lastActive: Date
}
```

### Related Collections

- **Attempt**: Individual reaction time attempts
  - Links to User via `userId` (String)
  
- **DailyBest**: Best score per day
  - Links to User via `userId` (String)
  - Used for daily leaderboards
  
- **League**: Weekly league progression
  - Links to User via `userId` (String)
  - Tracks tier, weekly stats, promotions

## Leaderboards

### Global Leaderboard
- Fetches top players from Redis (with MongoDB fallback)
- Joins with User collection to get username, country, verified status
- Shows real player data, not mock data

### Country Leaderboard
- Filters by user's country
- Same data flow as global leaderboard

### User Rank
- Redis: Uses ZRANK to get position
- MongoDB fallback: Counts better scores
- Returns rank, total players, percentile

## Integration Example

```typescript
import { useUser } from '@/components/auth';
import { AuthDrawer } from '@/components/auth';

function MyComponent() {
  const { userId, username, isVerified, signIn, signOut } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  if (!userId) {
    return <AuthDrawer 
      isOpen={true} 
      onClose={() => {}}
      onSuccess={(id, name, verified) => {
        signIn(id, name, verified);
      }}
    />;
  }

  return (
    <div>
      <p>Welcome, {username}!</p>
      {isVerified && <span>✓ Verified</span>}
    </div>
  );
}
```

## Environment Variables

Required:
- `NEXT_PUBLIC_WORLD_ID_APP_ID` - Your World ID app ID
- `MONGODB_URI` - MongoDB connection string

Optional:
- `REDIS_URL` - Redis for leaderboard caching (falls back to MongoDB)

## Security Features

1. **World ID nullifier_hash** is used as the unique identifier
   - One World ID = One account
   - Prevents multi-accounting
   - Privacy-preserving (nullifier ≠ real identity)

2. **Custom String IDs** instead of ObjectId
   - Allows guest and verified users in same system
   - No ObjectId casting errors

3. **Graceful degradation**
   - Redis unavailable → Falls back to MongoDB
   - World ID unavailable → Guest mode available

## Migration Notes

- Existing users with ObjectId `_id` need migration
- Run migration script to convert ObjectId → String IDs
- Or start fresh with new user collection

## Testing

1. **With World App:**
   - Open app in World App browser
   - Click "Sign in with World ID"
   - Complete verification
   - Verify user created in MongoDB

2. **Guest Mode:**
   - Click "Continue as Guest"
   - Verify guest user created
   - Attempt should save to database

3. **Persistence:**
   - Close and reopen app
   - Verify user remains signed in
   - Check localStorage for `speedleague_userId`
