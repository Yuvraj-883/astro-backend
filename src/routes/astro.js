// ../src/routes/astroRoutes.js

import express from 'express';
const router = express.Router();

// Import both controller functions
import { connectDeepSeek, startConversation } from '../controllers/astro.js';

// NEW: Route to get the initial greeting and start a session
router.get('/start', startConversation);

// This is your existing chat route
router.post('/chat', connectDeepSeek);

export { router as astroRouter };