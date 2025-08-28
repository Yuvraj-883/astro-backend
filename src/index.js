import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/environment.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { healthRouter } from './routes/health.js';
import {astroRouter }from './routes/astro.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`${config.API_PREFIX}/health`, healthRouter);
app.use(`${config.API_PREFIX}/astro`, astroRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = () => {
  const port = config.PORT;
  
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Environment: ${config.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${port}${config.API_PREFIX}`);
  });
};

// Only start server if running locally (not in Vercel serverless environment)
if (process.argv[1] === new URL(import.meta.url).pathname && !process.env.VERCEL) {
  startServer();
}

export { app };