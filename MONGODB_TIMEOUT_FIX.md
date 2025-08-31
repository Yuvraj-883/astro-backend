# MongoDB Connection Timeout Fix

## Problem
You're experiencing: `MongooseError: Operation 'personas.find()' buffering timed out after 10000ms`

## Root Cause
The application is trying to connect to MongoDB but:
1. No `.env` file was configured
2. MongoDB is not running locally  
3. No MongoDB Atlas connection configured

## Solutions Applied

### ✅ 1. Enhanced Connection Configuration
- **Updated `src/config/database.js`** with better timeout settings:
  - `serverSelectionTimeoutMS: 30000` (30 seconds instead of 5)
  - `connectTimeoutMS: 30000` (30 seconds)
  - `bufferCommands: false` (disable buffering to fail fast)
  - Added connection retry logic

### ✅ 2. Added Connection Health Checks
- **Created `ensureConnection()` function** to verify connection before operations
- **Added `dbHealthMiddleware`** for API routes that need database
- **Added connection status endpoint** at `/api/v1/db/status`

### ✅ 3. Updated Controllers
- **Modified persona controllers** to check connection before database operations
- **Added proper error handling** for connection timeouts

### ✅ 4. Created Diagnostic Tools
- **`scripts/testConnection.js`** - Comprehensive MongoDB connection testing
- **Environment template** - `.env.example` with proper MongoDB configuration

## Quick Fix Options

### Option A: Use MongoDB Atlas (Recommended)
```bash
# 1. Create free MongoDB Atlas account at https://cloud.mongodb.com
# 2. Create a cluster and get connection string
# 3. Update .env file:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/astro-backend
```

### Option B: Install Local MongoDB
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Update .env file:
MONGODB_URI=mongodb://localhost:27017/astro-backend
```

### Option C: Use Docker MongoDB
```bash
# Start MongoDB in Docker
docker run -d -p 27017:27017 --name astro-mongodb mongo:latest

# Update .env file:
MONGODB_URI=mongodb://localhost:27017/astro-backend
```

## Files Modified

### `src/config/database.js`
- Enhanced connection options with better timeouts
- Added `ensureConnection()` function
- Added `dbHealthMiddleware` for route protection
- Added connection retry logic

### `src/controllers/personaController.js`  
- Added `ensureConnection()` calls before database operations
- Better error handling for connection issues

### `src/index.js`
- Added database health middleware to persona routes
- Added `/api/v1/db/status` endpoint for monitoring

### Created Files
- `scripts/testConnection.js` - MongoDB connection diagnostic tool
- `.env` - Environment configuration file

## Test Your Fix

```bash
# 1. Test MongoDB connection
node scripts/testConnection.js

# 2. Check database status endpoint
curl http://localhost:8000/api/v1/db/status

# 3. Start the server
npm start

# 4. Test personas endpoint
curl http://localhost:8000/api/v1/personas
```

## Monitoring Connection Health

### Real-time Connection Status
```bash
# Check connection status
curl http://localhost:8000/api/v1/db/status
```

### Response Example
```json
{
  "success": true,
  "database": {
    "isConnected": true,
    "readyState": 1,
    "host": "localhost",
    "name": "astro-backend",
    "states": "connected"
  },
  "timestamp": "2025-08-31T12:00:00.000Z"
}
```

## Error Prevention

The enhanced configuration now:
- ✅ **Fails fast** instead of buffering indefinitely
- ✅ **Retries connection** automatically on network issues  
- ✅ **Provides clear error messages** with troubleshooting guidance
- ✅ **Checks connection health** before each database operation
- ✅ **Returns 503 status** when database is unavailable

Your application will now handle MongoDB connection issues gracefully and provide better error information!
