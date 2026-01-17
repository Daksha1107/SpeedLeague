# SpeedLeague Deployment Guide

## Quick Start

This guide will help you deploy SpeedLeague to Railway.

## Prerequisites

1. GitHub account with this repository
2. Railway account ([railway.app](https://railway.app))
3. MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
4. (Optional) Upstash Redis account ([upstash.com](https://upstash.com))

## Step 1: MongoDB Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster (M0 Free tier is sufficient)
3. Create a database user with password
4. Add `0.0.0.0/0` to IP whitelist (or Railway IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/speedleague`

## Step 2: Redis Setup (Optional but Recommended)

### Option A: Upstash (Recommended)
1. Create free Upstash account
2. Create new Redis database
3. Copy the Redis URL

### Option B: Railway Redis
1. In Railway, add new service → Redis
2. Railway will automatically set `REDIS_URL`

## Step 3: Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `SpeedLeague` repository

2. **Configure Environment Variables**
   
   In Railway dashboard, add these variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/speedleague
   REDIS_URL=redis://default:password@redis-host:6379
   NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
   NODE_ENV=production
   JWT_SECRET=your-random-secret-key-here
   ```

   Optional (for World ID):
   ```
   NEXT_PUBLIC_WORLD_ID_APP_ID=app_xxx
   WORLD_ID_ACTION=speedleague_verify
   ```

3. **Generate JWT Secret**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Build command: `npm run build`
   - Start command: `npm start`
   - Health check: `/api/health`

## Step 4: Custom Domain (Optional)

1. In Railway dashboard → Settings
2. Add custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your domain

## Step 5: Verify Deployment

1. Visit your Railway URL
2. Check health endpoint: `https://your-app.up.railway.app/api/health`
3. Try playing a duel
4. Check leaderboard

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `REDIS_URL` | No* | Redis connection URL (*Required for leaderboards) |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app's public URL |
| `NODE_ENV` | Yes | Set to `production` |
| `JWT_SECRET` | Yes | Random secret key for JWT |
| `NEXT_PUBLIC_WORLD_ID_APP_ID` | No | World ID app ID |
| `WORLD_ID_ACTION` | No | World ID action name |

## Monitoring

Railway provides built-in monitoring:
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for errors

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all environment variables are set
- Check build logs in Railway

### Database Connection Errors
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Redis Connection Issues
- App will work without Redis, but leaderboards will be slower
- Verify Redis URL format
- Check Redis service is running

### API Errors
- Check Railway logs
- Verify environment variables
- Test endpoints with health check

## Scaling

Railway automatically handles scaling:
- Horizontal scaling: Multiple instances
- Vertical scaling: More CPU/memory
- Configure in Railway settings

## Costs

- **Railway**: $5/month hobby plan (includes 500 hours)
- **MongoDB Atlas**: Free tier (512 MB storage)
- **Upstash Redis**: Free tier (10K commands/day)

Total: ~$5/month for hobby use, scales with usage

## Security

- Never commit `.env` files
- Rotate JWT secret regularly
- Use strong MongoDB passwords
- Enable MongoDB IP whitelist
- Monitor for suspicious activity

## Support

- Check Railway docs: [docs.railway.app](https://docs.railway.app)
- MongoDB docs: [docs.mongodb.com](https://docs.mongodb.com)
- Open GitHub issues for bugs
