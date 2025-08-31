// ../src/routes/reviewRoutes.js

import express from 'express';
import {
  createReview,
  getPersonaReviews,
  getReviewStats,
  getFeaturedReviews,
  markReviewHelpful,
  featureReview,
  moderateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

/**
 * Review Routes
 * These routes handle user reviews and ratings for astrology personas
 */

/**
 * @swagger
 * /reviews/persona/{personaSlug}:
 *   get:
 *     summary: Get reviews for a persona
 *     description: Get paginated reviews for a specific persona with filtering options
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/PersonaSlugParam'
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *         example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of reviews per page
 *         example: 10
 *       - name: rating
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *         example: 5
 *     responses:
 *       200:
 *         description: Reviews data with pagination
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
 *                         $ref: '#/components/schemas/Review'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalReviews:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *   post:
 *     summary: Create a new review
 *     description: Submit a new review for a persona
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/PersonaSlugParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *           example:
 *             userName: "Neha Gupta"
 *             rating: 5
 *             title: "Amazing experience!"
 *             comment: "Priya didi ne bahut achhi guidance di!"
 *             aspects:
 *               accuracy: 5
 *               helpfulness: 5
 *               communication: 4
 *               personality: 5
 *             sessionDuration: 20
 *             messagesExchanged: 10
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/persona/:personaSlug', getPersonaReviews);
router.post('/persona/:personaSlug', createReview);

// User interaction routes
router.post('/:reviewId/helpful', markReviewHelpful);     // POST /api/v1/reviews/64a1b2c3d4e5f6789/helpful

// Admin routes (add authentication middleware in production)
router.post('/:reviewId/feature', featureReview);         // POST /api/v1/reviews/64a1b2c3d4e5f6789/feature
router.put('/:reviewId/moderate', moderateReview);        // PUT /api/v1/reviews/64a1b2c3d4e5f6789/moderate
router.delete('/:reviewId', deleteReview);                // DELETE /api/v1/reviews/64a1b2c3d4e5f6789

export default router;
