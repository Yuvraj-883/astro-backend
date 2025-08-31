// ../src/routes/horoscopeRoutes.js

import express from 'express';
import {
  getDailyHoroscope,
  getAllHoroscopes,
  getWeeklyHoroscope,
  getCurrentPanchang,
  getCurrentNakshatraInfo,
  getPlanetaryPositions,
  getHoroscopeForChat,
  getTodayLucky
} from '../controllers/horoscopeController.js';

const router = express.Router();

/**
 * @swagger
 * /horoscope/daily/{raashi}:
 *   get:
 *     summary: Get daily horoscope for specific raashi
 *     description: |
 *       Get comprehensive daily horoscope for a specific Vedic zodiac sign (raashi).
 *       Includes predictions, lucky elements, remedies, Panchang data, and more.
 *       
 *       **Supported Raashi Values:**
 *       - `mesh` - मेष (Aries)
 *       - `vrishabh` - वृषभ (Taurus)
 *       - `mithun` - मिथुन (Gemini)
 *       - `kark` - कर्क (Cancer)
 *       - `singh` - सिंह (Leo)
 *       - `kanya` - कन्या (Virgo)
 *       - `tula` - तुला (Libra)
 *       - `vrishchik` - वृश्चिक (Scorpio)
 *       - `dhanu` - धनु (Sagittarius)
 *       - `makar` - मकर (Capricorn)
 *       - `kumbh` - कुम्भ (Aquarius)
 *       - `meen` - मीन (Pisces)
 *     tags: [Horoscope]
 *     parameters:
 *       - $ref: '#/components/parameters/RaashiParam'
 *       - $ref: '#/components/parameters/DateParam'
 *     responses:
 *       200:
 *         description: Daily horoscope data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Horoscope'
 *             example:
 *               success: true
 *               data:
 *                 date: "31/8/2025"
 *                 raashi: "Mesh (Aries)"
 *                 emoji: "♈"
 *                 predictions:
 *                   overall: "आज का दिन मिश्रित फल देगा।"
 *                   love: "आपके रिश्ते में मिठास आएगी।"
 *                   career: "करियर में बड़ी सफलता मिल सकती है!"
 *                 luckyElements:
 *                   numbers: [1, 8, 17]
 *                   colors: ["लाल", "नारंगी"]
 *               message: "Mesh (Aries) के लिए आज का राशिफल तैयार है!"
 *       400:
 *         description: Invalid raashi or date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid raashi. Valid options: mesh, vrishabh, mithun..."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/daily/:raashi', getDailyHoroscope);

/**
 * @swagger
 * /horoscope/daily:
 *   get:
 *     summary: Get daily horoscope for all zodiac signs
 *     description: |
 *       Get daily horoscope for all 12 Vedic zodiac signs in a single response.
 *       Perfect for displaying a complete horoscope dashboard.
 *     tags: [Horoscope]
 *     parameters:
 *       - $ref: '#/components/parameters/DateParam'
 *     responses:
 *       200:
 *         description: Horoscope data for all signs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Horoscope'
 *             example:
 *               success: true
 *               data:
 *                 - raashi: "Mesh (Aries)"
 *                   emoji: "♈"
 *                   predictions:
 *                     overall: "आज का दिन शुभ रहेगा।"
 *                 - raashi: "Vrishabh (Taurus)"
 *                   emoji: "♉"
 *                   predictions:
 *                     overall: "धन लाभ के योग हैं।"
 *               message: "सभी राशियों का राशिफल तैयार है!"
 *       400:
 *         description: Invalid date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/daily', getAllHoroscopes);

/**
 * @swagger
 * /horoscope/weekly/{raashi}:
 *   get:
 *     summary: Get weekly horoscope for specific raashi
 *     description: Get comprehensive weekly horoscope predictions for a Vedic zodiac sign
 *     tags: [Horoscope]
 *     parameters:
 *       - $ref: '#/components/parameters/RaashiParam'
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Week start date (defaults to current week)
 *         example: '2024-08-31'
 *     responses:
 *       200:
 *         description: Weekly horoscope data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         raashi:
 *                           type: string
 *                           example: "Mesh (Aries)"
 *                         weekRange:
 *                           type: string
 *                           example: "26 Aug - 1 Sep 2024"
 *                         weeklyPrediction:
 *                           type: string
 *                           example: "यह सप्ताह आपके लिए शुभ फलदायक होगा।"
 *       400:
 *         description: Invalid raashi or date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/weekly/:raashi', getWeeklyHoroscope);

/**
 * @swagger
 * /api/v1/horoscope/chat/{raashi}/{aspect}:
 *   get:
 *     summary: Get horoscope in chat-friendly format
 *     description: |
 *       Returns horoscope information in a conversational, chat-friendly format 
 *       optimized for chatbot responses. Can get specific aspects or overall reading.
 *     tags:
 *       - Horoscope
 *     parameters:
 *       - in: path
 *         name: raashi
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mesh, vrishabh, mithun, kark, singh, kanya, tula, vrishchik, dhanu, makar, kumbh, meen]
 *         description: Vedic zodiac sign (raashi)
 *         example: mesh
 *       - in: path
 *         name: aspect
 *         required: false
 *         schema:
 *           type: string
 *           enum: [love, career, health, finance, overall]
 *         description: Specific life aspect to focus on
 *         example: love
 *     responses:
 *       200:
 *         description: Chat-friendly horoscope response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 raashi:
 *                   type: string
 *                   example: "mesh"
 *                 aspect:
 *                   type: string
 *                   example: "love"
 *                 message:
 *                   type: string
 *                   description: Chat-friendly horoscope message
 *                   example: "Mesh raashi ke liye aaj love life mein kuch exciting changes aa sakte hain..."
 *                 emoji:
 *                   type: string
 *                   example: "❤️"
 *                 confidence:
 *                   type: string
 *                   enum: [high, medium, low]
 *                   example: "medium"
 *             examples:
 *               love_aspect:
 *                 summary: Love aspect for Mesh (Aries)
 *                 value:
 *                   success: true
 *                   raashi: "mesh"
 *                   aspect: "love"
 *                   message: "Mesh raashi ke liye aaj love life mein Venus ka positive influence hai. Partner ke saath sweet moments expect kar sakte hain! ❤️"
 *                   emoji: "❤️"
 *                   confidence: "medium"
 *       400:
 *         description: Invalid raashi or aspect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * @route GET /api/v1/horoscope/chat/:raashi/:aspect?
 * @desc Get horoscope in chat-friendly format
 * @access Public
 * @param {string} raashi - Zodiac sign
 * @param {string} aspect - Specific aspect (love, career, health, finance, overall)
 * @example GET /api/v1/horoscope/chat/mesh/love
 */
router.get('/chat/:raashi/:aspect?', getHoroscopeForChat);

/**
 * @route GET /api/v1/horoscope/lucky/:raashi
 * @desc Get today's lucky elements for raashi
 * @access Public
 * @param {string} raashi - Zodiac sign
 * @example GET /api/v1/horoscope/lucky/mesh
 */
router.get('/lucky/:raashi', getTodayLucky);

/**
 * @route GET /api/v1/horoscope/panchang
 * @desc Get current Hindu calendar (Panchang)
 * @access Public
 * @query {string} date - Optional date in YYYY-MM-DD format
 * @example GET /api/v1/horoscope/panchang?date=2024-08-31
 */
router.get('/panchang', getCurrentPanchang);

/**
 * @route GET /api/v1/horoscope/nakshatra
 * @desc Get current Nakshatra information
 * @access Public
 * @query {string} date - Optional date in YYYY-MM-DD format
 * @example GET /api/v1/horoscope/nakshatra?date=2024-08-31
 */
router.get('/nakshatra', getCurrentNakshatraInfo);

/**
 * @route GET /api/v1/horoscope/planets
 * @desc Get current planetary positions
 * @access Public
 * @query {string} date - Optional date in YYYY-MM-DD format
 * @example GET /api/v1/horoscope/planets?date=2024-08-31
 */
router.get('/planets', getPlanetaryPositions);

// API Documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Vedic Astrology Horoscope API",
    endpoints: {
      daily: {
        single: "GET /daily/:raashi - Single raashi daily horoscope",
        all: "GET /daily - All raashi daily horoscope"
      },
      weekly: "GET /weekly/:raashi - Weekly horoscope",
      chat: "GET /chat/:raashi/:aspect - Chat-friendly horoscope",
      lucky: "GET /lucky/:raashi - Lucky elements",
      panchang: "GET /panchang - Hindu calendar",
      nakshatra: "GET /nakshatra - Current Nakshatra",
      planets: "GET /planets - Planetary positions"
    },
    supportedRaashi: [
      "mesh (मेष)", "vrishabh (वृषभ)", "mithun (मिथुन)", 
      "kark (कर्क)", "simha (सिंह)", "kanya (कन्या)",
      "tula (तुला)", "vrishchik (वृश्चिक)", "dhanu (धनु)",
      "makar (मकर)", "kumbh (कुम्भ)", "meen (मीन)"
    ],
    aspects: ["overall", "love", "career", "health", "finance"],
    dateFormat: "YYYY-MM-DD (Optional, defaults to today)",
    note: "सभी भविष्यवाणियां वैदिक ज्योतिष पर आधारित हैं"
  });
});

export default router;
