// ../src/routes/personaRoutes.js

import express from 'express';
import {
  getAllPersonas,
  getPersonaBySlug,
  getDefaultPersona,
  getPersonasByCategory,
  createPersona,
  updatePersona,
  deletePersona,
  ratePersona,
  incrementPersonaUsage,
  getPersonaStats,
  getPersonaWithHoroscope
} from '../controllers/personaController.js';

const router = express.Router();

/**
 * Persona Routes
 * These routes handle persona management for the astrology chatbot
 */

/**
 * @swagger
 * /personas:
 *   get:
 *     summary: Get all astrology personas
 *     description: |
 *       Retrieve all available astrology personas with their details, ratings, and usage statistics.
 *       Personas represent different astrology consultation styles (Traditional, Modern, Tantric, Love Guru).
 *     tags: [Personas]
 *     parameters:
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *           enum: [traditional, modern, tantric, romantic]
 *         description: Filter personas by category
 *         example: traditional
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of personas to return
 *         example: 10
 *     responses:
 *       200:
 *         description: List of personas
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 4
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Persona'
 *             example:
 *               success: true
 *               count: 4
 *               data:
 *                 - id: "68b3658b9ebb0afc43549c33"
 *                   name: "Roshan Jha"
 *                   slug: "sanatan-vision"
 *                   category: "traditional"
 *                   usage:
 *                     averageRating: 4.2
 *                     totalReviews: 156
 */
router.get('/', getAllPersonas);
/**
 * @swagger
 * /personas/default:
 *   get:
 *     summary: Get the default persona
 *     description: Get the default astrology persona (usually the traditional one)
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Default persona data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Persona'
 */
router.get('/default', getDefaultPersona);
router.get('/stats', getPersonaStats);              // GET /api/v1/personas/stats
router.get('/category/:category', getPersonasByCategory); // GET /api/v1/personas/category/traditional
/**
 * @swagger
 * /personas/{slug}:
 *   get:
 *     summary: Get persona by slug
 *     description: Get detailed information about a specific persona by their slug identifier
 *     tags: [Personas]
 *     parameters:
 *       - $ref: '#/components/parameters/PersonaSlugParam'
 *     responses:
 *       200:
 *         description: Persona data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Persona not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Persona not found"
 */
router.get('/:slug', getPersonaBySlug);
router.get('/:slug/horoscope', getPersonaWithHoroscope); // GET /api/v1/personas/sanatan-vision/horoscope?raashi=mesh

// User interaction routes
router.post('/:slug/rate', ratePersona);           // POST /api/v1/personas/sanatan-vision/rate
router.post('/:slug/usage', incrementPersonaUsage); // POST /api/v1/personas/sanatan-vision/usage

// Admin routes (add authentication middleware in production)
router.post('/', createPersona);                   // POST /api/v1/personas
router.put('/:slug', updatePersona);               // PUT /api/v1/personas/sanatan-vision
router.delete('/:slug', deletePersona);            // DELETE /api/v1/personas/sanatan-vision

export default router;
