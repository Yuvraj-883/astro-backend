# Vercel Deployment Guide

## Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub repository with this code
3. Google Gemini API key

## Deployment Steps

### 1. Connect Repository
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository

### 2. Configure Environment Variables
In your Vercel project settings, add these environment variables:

```
NODE_ENV=production
GEMINI_API_KEY=your-actual-gemini-api-key
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
API_PREFIX=/api/v1
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-32-characters-long
JWT_EXPIRES_IN=7d
```

### 3. Deploy
1. Click "Deploy" in Vercel
2. Your API will be available at: `https://your-project-name.vercel.app`

## API Endpoints

After deployment, your endpoints will be:
- `GET https://your-project-name.vercel.app/api/v1/health`
- `GET https://your-project-name.vercel.app/api/v1/astro/start`
- `POST https://your-project-name.vercel.app/api/v1/astro/chat`

## Testing Deployment

```bash
# Test health endpoint
curl https://your-project-name.vercel.app/api/v1/health

# Test astro start
curl https://your-project-name.vercel.app/api/v1/astro/start

# Test chat
curl -X POST https://your-project-name.vercel.app/api/v1/astro/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## Troubleshooting

### Common Issues:
1. **Environment Variables**: Make sure all required env vars are set in Vercel
2. **CORS**: Update ALLOWED_ORIGINS to include your frontend domain
3. **API Key**: Ensure your Gemini API key is valid and has sufficient quota

### Logs:
- Check function logs in Vercel dashboard under "Functions" tab
- Monitor API usage in Google AI Studio console
