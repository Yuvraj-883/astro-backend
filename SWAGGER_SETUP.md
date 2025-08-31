# OpenAPI Specification for Astro Backend

## Installation
```bash
npm install swagger-ui-express swagger-jsdoc
```

## Implementation

Create `src/docs/swagger.js`:

```javascript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Astro Backend API',
      version: '1.0.0',
      description: 'Vedic Astrology API with Personalized Horoscopes',
      contact: {
        name: 'Astro Team',
        email: 'api@astro.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://your-domain.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Horoscope: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            raashi: { type: 'string', example: 'Mesh (Aries)' },
            emoji: { type: 'string', example: '♈' },
            predictions: {
              type: 'object',
              properties: {
                overall: { type: 'string' },
                love: { type: 'string' },
                career: { type: 'string' },
                health: { type: 'string' },
                finance: { type: 'string' }
              }
            },
            luckyElements: {
              type: 'object',
              properties: {
                numbers: { type: 'array', items: { type: 'integer' } },
                colors: { type: 'array', items: { type: 'string' } },
                direction: { type: 'string' },
                time: { type: 'string' }
              }
            }
          }
        },
        Persona: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Roshan Jha' },
            slug: { type: 'string', example: 'sanatan-vision' },
            role: { type: 'string' },
            category: { type: 'string', enum: ['traditional', 'modern', 'tantric', 'romantic'] },
            averageRating: { type: 'number', format: 'float' },
            totalReviews: { type: 'integer' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
```

Add to your `src/index.js`:

```javascript
import { specs, swaggerUi } from './docs/swagger.js';

// Add this after your other middleware
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Astro API Documentation'
}));
```

Add JSDoc comments to your routes:

```javascript
/**
 * @swagger
 * /horoscope/daily/{raashi}:
 *   get:
 *     summary: Get daily horoscope for specific raashi
 *     tags: [Horoscope]
 *     parameters:
 *       - in: path
 *         name: raashi
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mesh, vrishabh, mithun, kark, singh, kanya, tula, vrishchik, dhanu, makar, kumbh, meen]
 *         description: Vedic zodiac sign
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format (optional)
 *     responses:
 *       200:
 *         description: Daily horoscope data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Horoscope'
 *       400:
 *         description: Invalid raashi or date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/daily/:raashi', getDailyHoroscope);
```

**Benefits:**
- Interactive API documentation at `/api/docs`
- Try-it-out functionality
- Auto-generated from code comments
- Better than static cURL file
