// Real-time horoscope updates using Server-Sent Events
// Add to your routes

import express from 'express';

const router = express.Router();

// SSE endpoint for real-time horoscope updates
router.get('/stream/horoscope/:raashi', (req, res) => {
  const { raashi } = req.params;
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial horoscope
  const sendHoroscope = async () => {
    try {
      const horoscope = generateDailyHoroscope(raashi);
      res.write(`data: ${JSON.stringify({
        type: 'horoscope',
        data: horoscope,
        timestamp: new Date().toISOString()
      })}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: error.message
      })}\n\n`);
    }
  };

  // Send horoscope immediately
  sendHoroscope();

  // Send updates every hour (or based on your needs)
  const interval = setInterval(sendHoroscope, 60 * 60 * 1000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// SSE endpoint for live persona ratings
router.get('/stream/persona/:slug/ratings', (req, res) => {
  const { slug } = req.params;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Watch for rating changes (using MongoDB change streams)
  const changeStream = PersonaReview.watch([
    { $match: { 'fullDocument.personaSlug': slug } }
  ]);

  changeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      // Recalculate persona rating
      const stats = await PersonaReview.aggregate([
        { $match: { personaSlug: slug } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      res.write(`data: ${JSON.stringify({
        type: 'rating_update',
        personaSlug: slug,
        stats: stats[0] || { averageRating: 0, totalReviews: 0 },
        timestamp: new Date().toISOString()
      })}\n\n`);
    }
  });

  req.on('close', () => {
    changeStream.close();
    res.end();
  });
});

export default router;

// Frontend usage:
/*
// JavaScript client for SSE
class AstroEventSource {
  constructor(baseUrl = 'http://localhost:8000/api/v1') {
    this.baseUrl = baseUrl;
  }

  subscribeToHoroscope(raashi, callback) {
    const eventSource = new EventSource(`${this.baseUrl}/stream/horoscope/${raashi}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return eventSource; // Return to allow closing
  }

  subscribeToPersonaRatings(slug, callback) {
    const eventSource = new EventSource(`${this.baseUrl}/stream/persona/${slug}/ratings`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return eventSource;
  }
}

// Usage:
const astroEvents = new AstroEventSource();

// Subscribe to live horoscope updates
const horoscopeStream = astroEvents.subscribeToHoroscope('mesh', (data) => {
  if (data.type === 'horoscope') {
    updateHoroscopeUI(data.data);
  }
});

// Subscribe to live rating updates
const ratingsStream = astroEvents.subscribeToPersonaRatings('sanatan-vision', (data) => {
  if (data.type === 'rating_update') {
    updateRatingUI(data.stats);
  }
});

// Don't forget to close when component unmounts
// horoscopeStream.close();
// ratingsStream.close();
*/
