// ../src/models/Persona.js

import mongoose from 'mongoose';

/**
 * MongoDB Schema for Astrology Personas
 * This schema stores different astrology personas with their characteristics,
 * expertise, and conversation styles for the AI chatbot
 */

const PersonaSchema = new mongoose.Schema({
  // Basic Persona Information
  name: {
    type: String,
    required: [true, 'Persona name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  slug: {
    type: String,
    required: [true, 'Persona slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  
  role: {
    type: String,
    required: [true, 'Persona role is required'],
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  
  speakingStyle: {
    type: String,
    required: [true, 'Speaking style is required'],
    trim: true,
    maxlength: [500, 'Speaking style cannot exceed 500 characters']
  },
  
  // Astrology Expertise Areas
  expertise: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Each expertise item cannot exceed 100 characters']
  }],
  
  // Main Goal/Purpose
  goal: {
    type: String,
    required: [true, 'Persona goal is required'],
    trim: true,
    maxlength: [500, 'Goal cannot exceed 500 characters']
  },
  
  // Initial Greeting Message
  initialGreeting: {
    type: String,
    required: [true, 'Initial greeting is required'],
    trim: true,
    maxlength: [300, 'Initial greeting cannot exceed 300 characters']
  },
  
  // Persona Category/Type
  category: {
    type: String,
    required: [true, 'Persona category is required'],
    enum: {
      values: ['traditional', 'modern', 'tantric', 'romantic', 'scientific', 'spiritual'],
      message: 'Category must be one of: traditional, modern, tantric, romantic, scientific, spiritual'
    }
  },
  
  // Language Preference
  primaryLanguage: {
    type: String,
    required: true,
    enum: {
      values: ['hinglish', 'hindi', 'english', 'sanskrit'],
      message: 'Primary language must be one of: hinglish, hindi, english, sanskrit'
    },
    default: 'hinglish'
  },
  
  // Personality Traits
  personality: {
    tone: {
      type: String,
      enum: ['friendly', 'mysterious', 'authoritative', 'caring', 'playful', 'serious'],
      required: true
    },
    formality: {
      type: String,
      enum: ['casual', 'formal', 'semi-formal'],
      required: true
    },
    emotionalLevel: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    }
  },
  
  // Specialized Knowledge Areas
  specializations: {
    vedicAstrology: {
      type: Boolean,
      default: true
    },
    westernAstrology: {
      type: Boolean,
      default: false
    },
    numerology: {
      type: Boolean,
      default: false
    },
    tarot: {
      type: Boolean,
      default: false
    },
    vastu: {
      type: Boolean,
      default: false
    },
    gemstones: {
      type: Boolean,
      default: false
    },
    tantrik: {
      type: Boolean,
      default: false
    }
  },
  
  // Response Configuration
  responseConfig: {
    maxWordCount: {
      type: Number,
      min: [50, 'Max word count cannot be less than 50'],
      max: [200, 'Max word count cannot exceed 200'],
      default: 100
    },
    useEmojis: {
      type: Boolean,
      default: true
    },
    includeHindiTerms: {
      type: Boolean,
      default: true
    },
    formalityLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  
  // Availability & Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Usage Statistics
  usage: {
    totalSessions: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  
  // Metadata
  createdBy: {
    type: String,
    default: 'system'
  },
  
  version: {
    type: String,
    default: '1.0.0'
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
  
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'personas'
});

// Indexes for better query performance
PersonaSchema.index({ slug: 1 });
PersonaSchema.index({ category: 1, isActive: 1 });
PersonaSchema.index({ isActive: 1, isDefault: 1 });
PersonaSchema.index({ 'usage.totalSessions': -1 });
PersonaSchema.index({ tags: 1 });

// Virtual for full expertise list as string
PersonaSchema.virtual('expertiseList').get(function() {
  return this.expertise.join(', ');
});

// Instance method to increment usage
PersonaSchema.methods.incrementUsage = function(messageCount = 1) {
  this.usage.totalSessions += 1;
  this.usage.totalMessages += messageCount;
  return this.save();
};

// Instance method to update rating
PersonaSchema.methods.updateRating = function(newRating) {
  const totalRatings = this.usage.totalRatings;
  const currentAverage = this.usage.averageRating;
  
  // Calculate new average
  const newAverage = ((currentAverage * totalRatings) + newRating) / (totalRatings + 1);
  
  this.usage.averageRating = Math.round(newAverage * 100) / 100; // Round to 2 decimal places
  this.usage.totalRatings += 1;
  
  return this.save();
};

// Static method to get active personas by category
PersonaSchema.statics.getActiveByCategory = function(category) {
  return this.find({ 
    category: category, 
    isActive: true 
  }).sort({ 'usage.totalSessions': -1 });
};

// Static method to get default persona
PersonaSchema.statics.getDefault = function() {
  return this.findOne({ 
    isDefault: true, 
    isActive: true 
  });
};

// Static method to get popular personas
PersonaSchema.statics.getPopular = function(limit = 5) {
  return this.find({ isActive: true })
    .sort({ 'usage.totalSessions': -1 })
    .limit(limit);
};

// Pre-save middleware to ensure only one default persona
PersonaSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default flag from all other personas
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Create the model
const Persona = mongoose.model('Persona', PersonaSchema);

export default Persona;
