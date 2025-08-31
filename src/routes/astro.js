// ../src/routes/astroRoutes.js

import express from 'express';
const router = express.Router();

// Import both controller functions
import { connectDeepSeek, startConversation } from '../controllers/astro.js';

/**
 * @swagger
 * /api/v1/astro/start:
 *   get:
 *     summary: Start a new astrology conversation session
 *     description: |
 *       Initiates a new chat session with the astrology AI and returns a session ID 
 *       along with an initial greeting message from the selected persona.
 *     tags:
 *       - Astrology Chat
 *     responses:
 *       200:
 *         description: Session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   description: Unique session identifier for the conversation
 *                   example: "session_1640995200123_abc123def"
 *                 message:
 *                   type: string
 *                   description: Initial greeting message from the astrology persona
 *                   example: "🙏 Namaste! Main Pandit Sanatan Vision hoon, aapka Vedic Jyotish Guru. Main aapko authentic aur traditional Vedic astrology guidance deta hoon..."
 *             examples:
 *               success:
 *                 summary: Successful session start
 *                 value:
 *                   sessionId: "session_1640995200123_abc123def"
 *                   message: "🙏 Namaste! Main Pandit Sanatan Vision hoon, aapka Vedic Jyotish Guru. Aaj main aapke liye kya kar sakta hoon?"
 */
router.get('/start', startConversation);

/**
 * @swagger
 * /api/v1/astro/chat:
 *   post:
 *     summary: Send message to astrology AI chat
 *     description: |
 *       Continues an existing conversation with the astrology AI. Can handle general questions
 *       or birth details submission for personalized readings. The AI provides responses
 *       based on Vedic astrology principles and the selected persona.
 *     tags:
 *       - Astrology Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - message
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Session ID received from /start endpoint
 *                 example: "session_1640995200123_abc123def"
 *               message:
 *                 type: string
 *                 description: User's message or question
 *                 example: "What does my horoscope say for today?"
 *               birthDetails:
 *                 type: object
 *                 description: Optional birth details for personalized readings
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Rahul Sharma"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "1990-08-15"
 *                   time:
 *                     type: string
 *                     pattern: "^[0-2]?[0-9]:[0-5][0-9]$"
 *                     example: "14:30"
 *                   location:
 *                     type: string
 *                     example: "Mumbai, India"
 *           examples:
 *             general_question:
 *               summary: General astrology question
 *               value:
 *                 sessionId: "session_1640995200123_abc123def"
 *                 message: "What is the significance of Saturn in astrology?"
 *             birth_details:
 *               summary: Submitting birth details
 *               value:
 *                 sessionId: "session_1640995200123_abc123def"
 *                 message: "Here are my birth details for a personalized reading"
 *                 birthDetails:
 *                   name: "Priya Gupta"
 *                   date: "1992-03-20"
 *                   time: "09:15"
 *                   location: "Delhi, India"
 *     responses:
 *       200:
 *         description: AI response received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: AI-generated response based on astrology
 *                   example: "Shani (Saturn) ek bahut mahattvapurna graha hai jo discipline aur karma ko represent karta hai..."
 *                 sessionId:
 *                   type: string
 *                   description: Session ID for conversation continuity
 *                   example: "session_1640995200123_abc123def"
 *                 chartGenerated:
 *                   type: boolean
 *                   description: Whether birth chart was generated (when birth details provided)
 *                   example: true
 *             examples:
 *               general_response:
 *                 summary: Response to general question
 *                 value:
 *                   response: "Shani (Saturn) ek bahut mahattvapurna graha hai Vedic astrology mein. Ye discipline, hard work, aur karma ka devta hai..."
 *                   sessionId: "session_1640995200123_abc123def"
 *               personalized_response:
 *                 summary: Response after birth details submission
 *                 value:
 *                   response: "Dhanyawad Priya ji! Aapka birth chart successfully generate ho gaya hai. Aapki moon sign Pisces hai aur sun sign Pisces hai..."
 *                   sessionId: "session_1640995200123_abc123def"
 *                   chartGenerated: true
 *       400:
 *         description: Invalid session ID or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or missing session ID. Please start a new conversation."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing your request"
 */
router.post('/chat', connectDeepSeek);

export { router as astroRouter };