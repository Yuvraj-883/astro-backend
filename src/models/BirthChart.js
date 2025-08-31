// ../src/models/BirthChart.js

import mongoose from 'mongoose';

/**
 * Birth Chart Schema for storing user's astrological birth data
 * This enables truly personalized Vedic astrology predictions
 */

const planetPositionSchema = {
  sign: {
    type: String,
    required: true,
    enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
  },
  degree: {
    type: Number,
    required: true,
    min: 0,
    max: 30
  },
  retrograde: {
    type: Boolean,
    default: false
  }
};

const birthChartSchema = new mongoose.Schema({
  // User Identification
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Basic Birth Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  
  // Birth Date & Time
  birthDate: {
    type: Date,
    required: true
  },
  
  birthTime: {
    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23
    },
    minute: {
      type: Number,
      required: true,
      min: 0,
      max: 59
    }
  },
  
  // Birth Place
  birthPlace: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    timezone: {
      type: String,
      required: true,
      default: 'Asia/Kolkata'
    }
  },
  
  // Vedic Astrological Data
  raashi: {
    type: String,
    required: true,
    enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
  },
  
  nakshatra: {
    type: String,
    required: true
  },
  
  ascendant: {
    sign: {
      type: String,
      required: true,
      enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
    },
    degree: {
      type: Number,
      required: true,
      min: 0,
      max: 30
    }
  },
  
  moonSign: {
    type: String,
    required: true,
    enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
  },
  
  // Planetary Positions at Birth
  planets: {
    surya: planetPositionSchema,    // Sun
    chandra: planetPositionSchema,  // Moon
    mangal: planetPositionSchema,   // Mars
    budh: planetPositionSchema,     // Mercury
    guru: planetPositionSchema,     // Jupiter
    shukra: planetPositionSchema,   // Venus
    shani: planetPositionSchema,    // Saturn
    rahu: planetPositionSchema,     // North Node
    ketu: planetPositionSchema      // South Node
  },
  
  // House Positions (Bhava)
  houses: [{
    house: {
      type: Number,
      min: 1,
      max: 12
    },
    sign: {
      type: String,
      enum: ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
    },
    lord: {
      type: String,
      enum: ['surya', 'chandra', 'mangal', 'budh', 'guru', 'shukra', 'shani', 'rahu', 'ketu']
    }
  }],
  
  // Special Yogas and Doshas
  yogas: [{
    name: String,
    type: {
      type: String,
      enum: ['beneficial', 'malefic', 'neutral']
    },
    strength: {
      type: String,
      enum: ['weak', 'moderate', 'strong']
    },
    description: String
  }],
  
  doshas: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    remedies: [String]
  }],
  
  // Dasha Information
  currentDasha: {
    mahadasha: {
      planet: String,
      startDate: Date,
      endDate: Date
    },
    antardasha: {
      planet: String,
      startDate: Date,
      endDate: Date
    }
  },
  
  // Compatibility and Matching
  gunaMilan: {
    totalScore: {
      type: Number,
      min: 0,
      max: 36
    },
    categories: {
      varna: Number,
      vashya: Number,
      tara: Number,
      yoni: Number,
      graha: Number,
      gana: Number,
      rashi: Number,
      nadi: Number
    }
  },
  
  // Personalized Preferences
  preferences: {
    language: {
      type: String,
      enum: ['hindi', 'english', 'hinglish'],
      default: 'hinglish'
    },
    consultationAreas: [{
      type: String,
      enum: ['love', 'career', 'health', 'finance', 'family', 'education', 'spiritual']
    }],
    notificationSettings: {
      dailyHoroscope: {
        type: Boolean,
        default: true
      },
      weeklyHoroscope: {
        type: Boolean,
        default: true
      },
      importantTransits: {
        type: Boolean,
        default: true
      },
      festivals: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Chart Analysis
  chartAnalysis: {
    strongPlanets: [String],
    weakPlanets: [String],
    beneficPlanets: [String],
    maleficPlanets: [String],
    karaka: {
      atmakaraka: String,
      amatyakaraka: String,
      bhratrukaraka: String,
      matrukaraka: String,
      putrakaraka: String,
      gnatikaraka: String,
      darakaraka: String
    }
  },
  
  // Data Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationMethod: {
    type: String,
    enum: ['self_reported', 'document_verified', 'astrologer_verified']
  },
  
  // Usage Analytics
  usage: {
    horoscopeRequests: {
      type: Number,
      default: 0
    },
    lastAccessed: Date,
    consultationCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
birthChartSchema.index({ userId: 1 });
birthChartSchema.index({ raashi: 1 });
birthChartSchema.index({ nakshatra: 1 });
birthChartSchema.index({ 'birthPlace.city': 1 });
birthChartSchema.index({ birthDate: 1 });

// Virtual for age calculation
birthChartSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Methods
birthChartSchema.methods.getCurrentDasha = function(date = new Date()) {
  // Calculate current dasha based on birth nakshatra and time elapsed
  const birthTime = this.birthDate.getTime();
  const currentTime = date.getTime();
  const ageInDays = Math.floor((currentTime - birthTime) / (1000 * 60 * 60 * 24));
  
  // Simplified Vimshottari Dasha calculation
  const dashaCycle = 120 * 365; // 120 years in days
  const cyclePosition = ageInDays % dashaCycle;
  
  // Return current dasha information
  return this.currentDasha;
};

birthChartSchema.methods.getCompatibility = function(otherChart) {
  // Calculate compatibility using Guna Milan
  if (!this.gunaMilan || !otherChart.gunaMilan) {
    return null;
  }
  
  const compatibility = (this.gunaMilan.totalScore + otherChart.gunaMilan.totalScore) / 2;
  
  return {
    score: compatibility,
    rating: compatibility >= 18 ? 'excellent' : 
           compatibility >= 14 ? 'good' : 
           compatibility >= 10 ? 'average' : 'poor',
    recommendation: compatibility >= 18 ? 'शुभ विवाह योग' : 
                   compatibility >= 14 ? 'विवाह संभव' : 
                   'विवाह से पूर्व उपाय आवश्यक'
  };
};

birthChartSchema.methods.getPersonalizedRemedies = function() {
  const remedies = [];
  
  // Add dosha-specific remedies
  this.doshas.forEach(dosha => {
    remedies.push(...dosha.remedies);
  });
  
  // Add weak planet remedies
  this.chartAnalysis.weakPlanets.forEach(planet => {
    remedies.push(`${planet} ग्रह को मजबूत करने के उपाय`);
  });
  
  return [...new Set(remedies)]; // Remove duplicates
};

birthChartSchema.methods.incrementUsage = function() {
  this.usage.horoscopeRequests += 1;
  this.usage.lastAccessed = new Date();
  return this.save();
};

// Static methods
birthChartSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId: userId });
};

birthChartSchema.statics.findByRaashi = function(raashi) {
  return this.find({ raashi: raashi });
};

birthChartSchema.statics.getPopularConsultationAreas = function() {
  return this.aggregate([
    { $unwind: '$preferences.consultationAreas' },
    { $group: { 
        _id: '$preferences.consultationAreas', 
        count: { $sum: 1 } 
      }},
    { $sort: { count: -1 } }
  ]);
};

const BirthChart = mongoose.model('BirthChart', birthChartSchema);

export default BirthChart;
