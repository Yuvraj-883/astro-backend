// ../src/examples/reviewExamples.js

/**
 * Example review data for testing the review system
 * This shows how to structure review requests
 */

export const sampleReviews = [
  // Positive Review for Traditional Persona
  {
    personaSlug: 'sanatan-vision',
    userName: 'Rajesh Kumar',
    rating: 5,
    title: 'Bahut accurate predictions!',
    comment: 'Roshan ji ne bilkul sahi bataya mere Mangal ki position ke baare mein. Unke remedies follow karne ke baad real mein difference feel kar raha hun. Genuine astrologer hai!',
    aspects: {
      accuracy: 5,
      helpfulness: 5,
      communication: 4,
      personality: 5
    },
    sessionDuration: 25,
    messagesExchanged: 12,
    language: 'hinglish',
    platform: 'web',
    tags: ['accurate', 'helpful', 'remedies', 'traditional']
  },
  
  // Modern Persona Review
  {
    personaSlug: 'cosmic-didi',
    userName: 'Priya Sharma',
    rating: 4,
    title: 'Cool and relatable!',
    comment: 'Tamanna didi ki style bahut modern hai. Career guidance ke liye perfect! Mercury retrograde ke effects properly explain kiye. Thoda casual hai but that is good for our generation.',
    aspects: {
      accuracy: 4,
      helpfulness: 4,
      communication: 5,
      personality: 5
    },
    sessionDuration: 18,
    messagesExchanged: 8,
    language: 'hinglish',
    platform: 'mobile',
    tags: ['modern', 'career', 'relatable', 'trendy']
  },
  
  // Tantric Persona Review
  {
    personaSlug: 'tantrik-master',
    userName: 'Anonymous User',
    rating: 5,
    title: 'Powerful remedies worked!',
    comment: 'Sandeep baba ke tantrik remedies ne meri Kaal Sarp Dosha ki problem solve kar di. Bahut powerful knowledge hai unke paas. Thoda scary approach hai but results dekh kar believe ho gaya.',
    aspects: {
      accuracy: 5,
      helpfulness: 5,
      communication: 3,
      personality: 4
    },
    sessionDuration: 35,
    messagesExchanged: 15,
    language: 'hinglish',
    platform: 'web',
    tags: ['tantric', 'powerful', 'remedies', 'dosha']
  },
  
  // Love Guru Review
  {
    personaSlug: 'love-guru-priya',
    userName: 'Aarti Mishra',
    rating: 4,
    title: 'Sweet and caring advice',
    comment: 'Priya di ne mere love life ke problems ko bahut pyaar se samjhaya. Manglik dosha ke solutions bhi diye. Bahut sweet personality hai unki. Relationship advice bilkul perfect thi! 💕',
    aspects: {
      accuracy: 4,
      helpfulness: 4,
      communication: 5,
      personality: 5
    },
    sessionDuration: 22,
    messagesExchanged: 10,
    language: 'hinglish',
    platform: 'mobile',
    tags: ['love', 'caring', 'sweet', 'relationships', 'manglik']
  },
  
  // Mixed Review
  {
    personaSlug: 'sanatan-vision',
    userName: 'Vikash Singh',
    rating: 3,
    title: 'Good but could be better',
    comment: 'Acharya ji ka knowledge toh achha hai but thoda zyada traditional approach hai. Modern problems ke liye practical solutions kam the. Overall okay experience tha.',
    aspects: {
      accuracy: 4,
      helpfulness: 3,
      communication: 3,
      personality: 3
    },
    sessionDuration: 15,
    messagesExchanged: 6,
    language: 'hinglish',
    platform: 'web',
    tags: ['traditional', 'knowledge', 'mixed-experience']
  }
];

// API Usage Examples
export const reviewAPIExamples = {
  
  // Create a review
  createReview: {
    method: 'POST',
    url: '/api/v1/reviews/persona/sanatan-vision',
    body: {
      userName: 'Test User',
      rating: 5,
      title: 'Amazing experience!',
      comment: 'Bahut accurate predictions the. Highly recommend!',
      aspects: {
        accuracy: 5,
        helpfulness: 5,
        communication: 4,
        personality: 5
      },
      sessionDuration: 20,
      messagesExchanged: 8,
      language: 'hinglish',
      platform: 'web',
      tags: ['accurate', 'recommended']
    }
  },
  
  // Get persona reviews
  getReviews: {
    method: 'GET',
    url: '/api/v1/reviews/persona/sanatan-vision?page=1&limit=5&sortBy=rating&sortOrder=desc',
    description: 'Get reviews with pagination and sorting'
  },
  
  // Get review statistics
  getStats: {
    method: 'GET',
    url: '/api/v1/reviews/persona/sanatan-vision/stats',
    description: 'Get detailed review statistics'
  },
  
  // Mark review as helpful
  markHelpful: {
    method: 'POST',
    url: '/api/v1/reviews/64a1b2c3d4e5f6789/helpful',
    description: 'Mark a review as helpful'
  },
  
  // Get featured reviews
  getFeatured: {
    method: 'GET',
    url: '/api/v1/reviews/featured?limit=3',
    description: 'Get featured reviews across all personas'
  }
};

// Response Examples
export const reviewResponseExamples = {
  
  reviewStats: {
    success: true,
    data: {
      totalReviews: 25,
      averageRating: 4.2,
      ratingDistribution: {
        5: 10,
        4: 8,
        3: 5,
        2: 2,
        1: 0
      },
      aspectRatings: {
        accuracy: 4.3,
        helpfulness: 4.1,
        communication: 4.0,
        personality: 4.4
      }
    }
  },
  
  reviewList: {
    success: true,
    data: [
      {
        _id: '64a1b2c3d4e5f6789',
        userName: 'Rajesh Kumar',
        rating: 5,
        title: 'Excellent guidance!',
        comment: 'Very helpful and accurate...',
        aspects: {
          accuracy: 5,
          helpfulness: 5,
          communication: 4,
          personality: 5
        },
        helpfulVotes: 3,
        createdAt: '2024-08-30T10:30:00Z',
        daysAgo: '2 days ago'
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalReviews: 25,
      hasNext: true,
      hasPrev: false
    }
  }
};
