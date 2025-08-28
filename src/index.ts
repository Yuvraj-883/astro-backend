import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '@/config/environment';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { healthRouter } from '@/routes/health';
import { userRouter } from '@/routes/users';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`${config.API_PREFIX}/health`, healthRouter);
app.use(`${config.API_PREFIX}/users`, userRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = (): void => {
  const port = config.PORT;
  
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Environment: ${config.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${port}${config.API_PREFIX}`);
  });
};

if (require.main === module) {
  startServer();
}

export { app };
