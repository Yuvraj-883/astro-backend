// ../src/docs/swagger.js

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Astro Backend API',
      version: '1.0.0',
      description: `
        🔮 **Vedic Astrology API with Personalized Horoscopes**
        
        This API provides comprehensive Vedic astrology services including:
        - Daily, weekly horoscopes for all 12 zodiac signs
        - Personalized birth chart analysis
        - Multi-persona astrology consultations
        - Panchang and planetary position data
        - User reviews and ratings system
        
        ## 🌟 Features
        - **3-Tier Accuracy System**: Basic (30-40%), Enhanced (60-70%), Personalized (85-95%)
        - **4 Unique Personas**: Traditional, Modern, Tantric, and Love Guru
        - **Real Vedic Calculations**: Panchang, Nakshatra, planetary positions
        - **Complete CRUD Operations**: For personas, reviews, and birth charts
        
        ## 🚀 Getting Started
        1. Start with health check: \`GET /health\`
        2. Get daily horoscope: \`GET /horoscope/daily/{raashi}\`
        3. Explore personas: \`GET /personas\`
        4. Try personalized features: \`POST /enhanced/personalized-horoscope\`
      `,
      contact: {
        name: 'Astro API Support',
        email: 'support@astro-api.com',
        url: 'https://github.com/Yuvraj-883/astro-backend'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://astro-backend.vercel.app/api/v1',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'API health and status endpoints'
      },
      {
        name: 'Horoscope',
        description: 'Daily, weekly horoscopes and Vedic calculations'
      },
      {
        name: 'Enhanced Horoscope',
        description: 'Personalized horoscopes with birth chart analysis'
      },
      {
        name: 'Personas',
        description: 'Astrology personas and their management'
      },
      {
        name: 'Reviews',
        description: 'User reviews and ratings for personas'
      },
      {
        name: 'Astro Chat',
        description: 'Chat-based astrology consultations'
      }
    ],
    components: {
      schemas: {
        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        },
        
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        
        // Horoscope Schema
        Horoscope: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              example: '31/8/2025'
            },
            weekday: {
              type: 'string',
              example: 'रविवार'
            },
            raashi: {
              type: 'string',
              example: 'Mesh (Aries)'
            },
            emoji: {
              type: 'string',
              example: '♈'
            },
            predictions: {
              type: 'object',
              properties: {
                overall: { type: 'string', example: 'आज का दिन मिश्रित फल देगा।' },
                love: { type: 'string', example: 'आपके रिश्ते में मिठास आएगी।' },
                career: { type: 'string', example: 'करियर में बड़ी सफलता मिल सकती है!' },
                health: { type: 'string', example: 'स्वास्थ्य का खास ख्याल रखें।' },
                finance: { type: 'string', example: 'निवेश करने का शुभ मुहूर्त है।' }
              }
            },
            luckyElements: {
              type: 'object',
              properties: {
                numbers: {
                  type: 'array',
                  items: { type: 'integer' },
                  example: [1, 8, 17]
                },
                colors: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['लाल', 'नारंगी']
                },
                direction: { type: 'string', example: 'उत्तर' },
                time: { type: 'string', example: 'प्रातः 6-8 बजे' },
                deity: { type: 'string', example: 'हनुमान जी' }
              }
            },
            remedies: {
              type: 'object',
              properties: {
                planetary: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['मंगलवार को हनुमान जी की पूजा करें']
                },
                general: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['सुबह उठकर सूर्य नमस्कार करें']
                },
                gemstone: { type: 'string', example: 'मूंगा धारण करना शुभ रहेगा' },
                color: { type: 'string', example: 'आज लाल रंग पहनना फायदेमंद होगा' }
              }
            },
            mantra: { type: 'string', example: 'ॐ अं अनगाराय नमः' },
            panchang: {
              type: 'object',
              properties: {
                tithi: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'चतुर्थी' },
                    type: { type: 'string', example: 'शुक्ल पक्ष' },
                    percentage: { type: 'string', example: '24.6' }
                  }
                },
                nakshatra: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'ज्येष्ठा' },
                    lord: { type: 'string', example: 'बुध' },
                    deity: { type: 'string', example: 'इंद्र' },
                    guna: { type: 'string', example: 'राजस' }
                  }
                }
              }
            }
          }
        },
        
        // Persona Schema
        Persona: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '68b3658b9ebb0afc43549c33' },
            name: { type: 'string', example: 'Roshan Jha' },
            slug: { type: 'string', example: 'sanatan-vision' },
            role: { type: 'string', example: 'Bharitye Jyotish shashtra k Guru aur Cosmic Guide' },
            initialGreeting: { type: 'string', example: 'Namaste! Sitaron ne aapko yahan tak pahunchaya hai.' },
            category: {
              type: 'string',
              enum: ['traditional', 'modern', 'tantric', 'romantic'],
              example: 'traditional'
            },
            personality: {
              type: 'object',
              properties: {
                tone: { type: 'string', example: 'authoritative' },
                formality: { type: 'string', example: 'formal' },
                emotionalLevel: { type: 'string', example: 'medium' }
              }
            },
            specializations: {
              type: 'object',
              properties: {
                vedicAstrology: { type: 'boolean', example: true },
                numerology: { type: 'boolean', example: true },
                vastu: { type: 'boolean', example: false },
                gemstones: { type: 'boolean', example: true },
                tantrik: { type: 'boolean', example: false }
              }
            },
            usage: {
              type: 'object',
              properties: {
                totalSessions: { type: 'integer', example: 156 },
                totalMessages: { type: 'integer', example: 1248 },
                averageRating: { type: 'number', format: 'float', example: 4.2 },
                totalRatings: { type: 'integer', example: 47 }
              }
            },
            isDefault: { type: 'boolean', example: true },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['traditional', 'vedic', 'guru', 'spiritual']
            }
          }
        },
        
        // Review Schema
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '68b36593c20b1f45ce51008f' },
            persona: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string', example: 'Roshan Jha' },
                role: { type: 'string' }
              }
            },
            personaSlug: { type: 'string', example: 'sanatan-vision' },
            userName: { type: 'string', example: 'Rajesh Kumar' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            title: { type: 'string', example: 'Bahut accurate predictions!' },
            comment: { type: 'string', example: 'Roshan ji ne bilkul sahi bataya mere Mangal ki position ke baare mein.' },
            aspects: {
              type: 'object',
              properties: {
                accuracy: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                helpfulness: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                communication: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
                personality: { type: 'integer', minimum: 1, maximum: 5, example: 5 }
              }
            },
            sessionDuration: { type: 'integer', example: 25 },
            messagesExchanged: { type: 'integer', example: 12 },
            helpfulVotes: { type: 'integer', example: 6 },
            isVerified: { type: 'boolean', example: false },
            isFeatured: { type: 'boolean', example: true },
            language: { type: 'string', example: 'hinglish' },
            platform: { type: 'string', example: 'web' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['accurate', 'helpful', 'remedies']
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // Birth Data Input
        BirthDataInput: {
          type: 'object',
          required: ['birthDate', 'birthTime', 'birthPlace'],
          properties: {
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1995-05-15',
              description: 'Birth date in YYYY-MM-DD format'
            },
            birthTime: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              example: '14:30',
              description: 'Birth time in HH:MM format (24-hour)'
            },
            birthPlace: {
              type: 'string',
              example: 'Mumbai, India',
              description: 'Birth place (city, country)'
            },
            zodiacSign: {
              type: 'string',
              enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'singh', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'],
              example: 'vrishabh'
            }
          }
        },
        
        // Review Input
        ReviewInput: {
          type: 'object',
          required: ['userName', 'rating', 'title', 'comment'],
          properties: {
            userName: { type: 'string', example: 'Neha Gupta' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            title: { type: 'string', example: 'Amazing experience!' },
            comment: { type: 'string', example: 'Priya didi ne bahut achhi guidance di!' },
            aspects: {
              type: 'object',
              properties: {
                accuracy: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                helpfulness: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                communication: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
                personality: { type: 'integer', minimum: 1, maximum: 5, example: 5 }
              }
            },
            sessionDuration: { type: 'integer', example: 20 },
            messagesExchanged: { type: 'integer', example: 10 },
            language: { type: 'string', enum: ['hindi', 'english', 'hinglish'], example: 'hinglish' },
            platform: { type: 'string', enum: ['web', 'mobile', 'api'], example: 'web' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['modern', 'helpful', 'guidance']
            }
          }
        }
      },
      
      parameters: {
        RaashiParam: {
          name: 'raashi',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'singh', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
          },
          description: 'Vedic zodiac sign',
          example: 'mesh'
        },
        DateParam: {
          name: 'date',
          in: 'query',
          schema: {
            type: 'string',
            format: 'date'
          },
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
          example: '2024-08-31'
        },
        PersonaSlugParam: {
          name: 'slug',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['sanatan-vision', 'cosmic-didi', 'tantrik-master', 'love-guru-priya']
          },
          description: 'Persona slug identifier',
          example: 'sanatan-vision'
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

// Custom CSS for better UI
const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 20px 0 }
  .swagger-ui .info .title { color: #4A90E2; font-size: 36px; }
  .swagger-ui .scheme-container { background: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0; }
  .swagger-ui .info .description { font-size: 14px; line-height: 1.6; }
  .swagger-ui .opblock.opblock-get .opblock-summary { background: rgba(73, 204, 144, .1); }
  .swagger-ui .opblock.opblock-post .opblock-summary { background: rgba(73, 144, 204, .1); }
`;

const swaggerOptions = {
  customCss,
  customSiteTitle: 'Astro API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

export { specs, swaggerUi, swaggerOptions };
