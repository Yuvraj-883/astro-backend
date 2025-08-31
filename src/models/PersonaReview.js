// ../src/models/PersonaReview.js

import mongoose from 'mongoose';

/**
 * MongoDB Schema for Persona Reviews
 * This schema stores user reviews and ratings for astrology personas
 */

const PersonaReviewSchema = new mongoose.Schema({
  // Reference to the persona being reviewed
  persona: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona',
    required: [true, 'Persona reference is required']
  },
  
  personaSlug: {
    type: String,
    required: [true, 'Persona slug is required'],
    index: true
  },
  
  // User Information (anonymous reviews allowed)
  userName: {
    type: String,
    trim: true,
    maxlength: [50, 'User name cannot exceed 50 characters'],
    default: 'Anonymous User'
  },
  
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    sparse: true // Allows multiple null values
  },
  
  // Review Content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters'],
    default: ''
  },
  
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Review comment cannot exceed 500 characters'],
    required: [true, 'Review comment is required']
  },
  
  // Review Categories (what aspects user liked/disliked)
  aspects: {
    accuracy: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    personality: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  
  // Session Information
  sessionDuration: {
    type: Number, // in minutes
    min: 0,
    default: 0
  },
  
  messagesExchanged: {
    type: Number,
    min: 0,
    default: 1
  },
  
  // Review Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isApproved: {
    type: Boolean,
    default: true // Auto-approve by default, can be moderated later
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Helpful votes from other users
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Language of the review
  language: {
    type: String,
    enum: ['hinglish', 'hindi', 'english'],
    default: 'hinglish'
  },
  
  // Device/Platform info
  platform: {
    type: String,
    enum: ['web', 'mobile', 'tablet', 'api'],
    default: 'web'
  },
  
  // IP Address for spam prevention (hashed)
  ipHash: {
    type: String,
    default: ''
  },
  
  // Tags for categorizing reviews
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Admin notes (internal use)
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [200, 'Admin notes cannot exceed 200 characters'],
    default: ''
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'persona_reviews'
});

// Indexes for better query performance
PersonaReviewSchema.index({ personaSlug: 1, rating: -1 });
PersonaReviewSchema.index({ persona: 1, createdAt: -1 });
PersonaReviewSchema.index({ isApproved: 1, rating: -1 });
PersonaReviewSchema.index({ isFeatured: 1, createdAt: -1 });
PersonaReviewSchema.index({ helpfulVotes: -1 });

// Compound index for filtering
PersonaReviewSchema.index({ 
  personaSlug: 1, 
  isApproved: 1, 
  rating: -1, 
  createdAt: -1 
});

// Virtual for review summary
PersonaReviewSchema.virtual('summary').get(function() {
  const maxLength = 100;
  return this.comment.length > maxLength 
    ? this.comment.substring(0, maxLength) + '...'
    : this.comment;
});

// Virtual for days since review
PersonaReviewSchema.virtual('daysAgo').get(function() {
  const diffTime = Date.now() - this.createdAt.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Instance method to mark as helpful
PersonaReviewSchema.methods.markAsHelpful = function() {
  this.helpfulVotes += 1;
  return this.save();
};

// Instance method to approve review
PersonaReviewSchema.methods.approve = function() {
  this.isApproved = true;
  return this.save();
};

// Instance method to feature review
PersonaReviewSchema.methods.feature = function() {
  this.isFeatured = true;
  return this.save();
};

// Static method to get reviews for a persona
PersonaReviewSchema.statics.getPersonaReviews = function(personaSlug, options = {}) {
  const {
    limit = 10,
    skip = 0,
    sortBy = 'createdAt',
    sortOrder = -1,
    minRating = 1,
    maxRating = 5,
    approved = true
  } = options;
  
  const query = {
    personaSlug: personaSlug,
    isApproved: approved,
    rating: { $gte: minRating, $lte: maxRating }
  };
  
  return this.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate('persona', 'name role');
};

// Static method to get featured reviews
PersonaReviewSchema.statics.getFeaturedReviews = function(limit = 5) {
  return this.find({ 
    isFeatured: true, 
    isApproved: true 
  })
    .sort({ helpfulVotes: -1, createdAt: -1 })
    .limit(limit)
    .populate('persona', 'name slug role');
};

// Static method to get review statistics
PersonaReviewSchema.statics.getReviewStats = function(personaSlug) {
  return this.aggregate([
    { $match: { personaSlug: personaSlug, isApproved: true } },
    {
      $group: {
        _id: '$personaSlug',
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        avgAccuracy: { $avg: '$aspects.accuracy' },
        avgHelpfulness: { $avg: '$aspects.helpfulness' },
        avgCommunication: { $avg: '$aspects.communication' },
        avgPersonality: { $avg: '$aspects.personality' }
      }
    }
  ]);
};

// Pre-save middleware to set personaSlug
PersonaReviewSchema.pre('save', async function(next) {
  if (this.isNew && this.persona && !this.personaSlug) {
    const persona = await mongoose.model('Persona').findById(this.persona);
    if (persona) {
      this.personaSlug = persona.slug;
    }
  }
  next();
});

// Create the model
const PersonaReview = mongoose.model('PersonaReview', PersonaReviewSchema);

export default PersonaReview;
