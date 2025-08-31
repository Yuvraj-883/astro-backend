import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/environment.js';
import { connectDB } from './config/database.js';
import { specs, swaggerUi, swaggerOptions } from './docs/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { healthRouter } from './routes/health.js';
import { astroRouter } from './routes/astro.js';
import personaRoutes from './routes/personaRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import horoscopeRoutes from './routes/horoscopeRoutes.js';
import enhancedHoroscopeRoutes from './routes/enhancedHoroscopeRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// API routes
app.use(`${config.API_PREFIX}/health`, healthRouter);
app.use(`${config.API_PREFIX}/astro`, astroRouter);
app.use(`${config.API_PREFIX}/personas`, personaRoutes);
app.use(`${config.API_PREFIX}/reviews`, reviewRoutes);
app.use(`${config.API_PREFIX}/horoscope`, horoscopeRoutes);
app.use(`${config.API_PREFIX}/enhanced`, enhancedHoroscopeRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    const port = config.PORT;
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📝 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${port}${config.API_PREFIX}`);
      console.log(`� API Documentation: http://localhost:${port}/api/docs`);
      console.log(`�📊 Database: Connected and ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if running locally (not in Vercel serverless environment)
if (process.argv[1] === new URL(import.meta.url).pathname && !process.env.VERCEL) {
  startServer();
}

export { app };