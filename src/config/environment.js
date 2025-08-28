import dotenv from 'dotenv';

dotenv.config();

const parseEnv = () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT) || 3000,
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-that-is-at-least-32-characters-long',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  };

  // Validate required environment variables
  if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY === 'your-actual-gemini-api-key-here') {
    console.warn('⚠️  WARNING: GEMINI_API_KEY is not properly configured. Please set it in your .env file.');
    console.warn('📝 Get your API key from: https://aistudio.google.com/app/apikey');
  }

  return config;
};

export const config = parseEnv();
