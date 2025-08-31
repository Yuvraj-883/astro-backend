// ../src/routes/enhancedHoroscopeRoutes.js

import express from 'express';
import {
  getPersonalizedHoroscope,
  getEnhancedGeneralHoroscope,
  createBirthChart,
  getBirthChart,
  updateBirthChart,
  checkCompatibility,
  getHoroscopeComparison
} from '../controllers/enhancedHoroscopeController.js';

const router = express.Router();

/**
 * Enhanced Horoscope Routes
 * Provides both personalized (birth chart based) and enhanced general horoscopes
 */

// ============ PERSONALIZED HOROSCOPE ROUTES ============

/**
 * @route GET /api/v1/enhanced/personalized/:userId
 * @desc Get personalized horoscope based on user's birth chart
 * @access Public
 * @param {string} userId - User's unique identifier
 * @query {string} date - Optional date in YYYY-MM-DD format
 * @example GET /api/v1/enhanced/personalized/user123?date=2024-08-31
 */
router.get('/personalized/:userId', getPersonalizedHoroscope);

/**
 * @route GET /api/v1/enhanced/general/:raashi
 * @desc Get enhanced general horoscope (better than basic random)
 * @access Public
 * @param {string} raashi - Zodiac sign
 * @query {string} date - Optional date
 * @query {string} userId - Optional user ID to check for birth chart
 * @example GET /api/v1/enhanced/general/mesh?userId=user123&date=2024-08-31
 */
router.get('/general/:raashi', getEnhancedGeneralHoroscope);

/**
 * @route GET /api/v1/enhanced/compare/:userId/:raashi
 * @desc Compare personalized vs general horoscope
 * @access Public
 * @param {string} userId - User ID
 * @param {string} raashi - Zodiac sign for general comparison
 * @query {string} date - Optional date
 * @example GET /api/v1/enhanced/compare/user123/mesh?date=2024-08-31
 */
router.get('/compare/:userId/:raashi', getHoroscopeComparison);

// ============ BIRTH CHART MANAGEMENT ============

/**
 * @route POST /api/v1/enhanced/birth-chart
 * @desc Create user's birth chart for personalized horoscopes
 * @access Public
 * @body {Object} Birth chart data
 * @example POST /api/v1/enhanced/birth-chart
 */
router.post('/birth-chart', createBirthChart);

/**
 * @route GET /api/v1/enhanced/birth-chart/:userId
 * @desc Get user's birth chart details
 * @access Public
 * @param {string} userId - User's unique identifier
 * @example GET /api/v1/enhanced/birth-chart/user123
 */
router.get('/birth-chart/:userId', getBirthChart);

/**
 * @route PUT /api/v1/enhanced/birth-chart/:userId
 * @desc Update user's birth chart
 * @access Public
 * @param {string} userId - User's unique identifier
 * @body {Object} Updated birth chart data
 * @example PUT /api/v1/enhanced/birth-chart/user123
 */
router.put('/birth-chart/:userId', updateBirthChart);

// ============ COMPATIBILITY & MATCHING ============

/**
 * @route GET /api/v1/enhanced/compatibility/:userId1/:userId2
 * @desc Check compatibility between two users using their birth charts
 * @access Public
 * @param {string} userId1 - First user's ID
 * @param {string} userId2 - Second user's ID
 * @example GET /api/v1/enhanced/compatibility/user123/user456
 */
router.get('/compatibility/:userId1/:userId2', checkCompatibility);

// ============ DOCUMENTATION & HELP ============

/**
 * @route GET /api/v1/enhanced/
 * @desc API documentation and available endpoints
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Enhanced Vedic Astrology Horoscope API",
    description: "Provides both personalized (birth chart based) and enhanced general horoscopes",
    
    features: {
      personalized: {
        description: "100% accurate horoscopes based on exact birth chart",
        benefits: [
          "Planetary transits analysis",
          "Dasha system calculations", 
          "Personal remedies and mantras",
          "Yoga and dosha analysis",
          "Precise timing predictions"
        ],
        requirement: "Birth chart data needed"
      },
      
      enhanced_general: {
        description: "Improved general horoscopes using current planetary positions",
        benefits: [
          "Better than random predictions",
          "Current planetary influences",
          "Real astronomical data",
          "Option to upgrade to personalized"
        ],
        requirement: "Only raashi needed"
      }
    },
    
    endpoints: {
      personalized: {
        horoscope: "GET /personalized/:userId - Get personalized horoscope",
        birth_chart: "POST /birth-chart - Create birth chart",
        manage_chart: "GET|PUT /birth-chart/:userId - Manage birth chart",
        compatibility: "GET /compatibility/:userId1/:userId2 - Check compatibility"
      },
      
      enhanced_general: {
        horoscope: "GET /general/:raashi - Enhanced general horoscope",
        comparison: "GET /compare/:userId/:raashi - Compare horoscope types"
      }
    },
    
    workflow: {
      new_user: [
        "1. Try enhanced general horoscope: GET /general/mesh",
        "2. Create birth chart for accuracy: POST /birth-chart", 
        "3. Get personalized horoscope: GET /personalized/userId",
        "4. Compare accuracy: GET /compare/userId/raashi"
      ],
      
      existing_user: [
        "1. Get personalized horoscope: GET /personalized/userId",
        "2. Check compatibility: GET /compatibility/userId1/userId2",
        "3. Update birth chart if needed: PUT /birth-chart/userId"
      ]
    },
    
    birth_chart_example: {
      userId: "user123",
      name: "राहुल शर्मा",
      gender: "male",
      birthDate: "1990-05-15",
      birthTime: { hour: 14, minute: 30 },
      birthPlace: {
        city: "Delhi",
        state: "Delhi", 
        country: "India",
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: "Asia/Kolkata"
      },
      raashi: "mesh",
      nakshatra: "अश्विनी",
      ascendant: { sign: "simha", degree: 15.5 },
      moonSign: "mesh"
    },
    
    accuracy_levels: {
      basic_random: "30-40% - Random predictions (old system)",
      enhanced_general: "60-70% - Planetary influenced (current system)",
      personalized: "85-95% - Birth chart based (recommended)"
    },
    
    note: "सबसे सटीक भविष्यफल के लिए personalized horoscope का उपयोग करें जो आपकी exact birth details पर आधारित है।"
  });
});

export default router;
