import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const healthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(healthResponse);
});

export { router as healthRouter };
