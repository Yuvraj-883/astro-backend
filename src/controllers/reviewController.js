// ../src/controllers/reviewController.js

import PersonaReview from '../models/PersonaReview.js';
import Persona from '../models/Persona.js';
import crypto from 'crypto';

/**
 * Controller for managing persona reviews
 * Handles CRUD operations for user reviews and ratings
 */

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { personaSlug } = req.params;
    const reviewData = req.body;
    
    // Check if persona exists
    const persona = await Persona.findOne({ slug: personaSlug, isActive: true });
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    // Hash IP address for spam prevention
    const ipHash = crypto
      .createHash('sha256')
      .update(req.ip || '127.0.0.1')
      .digest('hex');
    
    // Create review
    const review = new PersonaReview({
      persona: persona._id,
      personaSlug: personaSlug,
      ipHash: ipHash,
      ...reviewData
    });
    
    await review.save();
    
    // Update persona's average rating
    await updatePersonaRating(persona._id);
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get reviews for a persona
export const getPersonaReviews = async (req, res) => {
  try {
    const { personaSlug } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minRating = 1,
      maxRating = 5,
      featured = false
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = sortOrder === 'desc' ? -1 : 1;
    
    let query = {
      personaSlug: personaSlug,
      isApproved: true,
      rating: { $gte: parseInt(minRating), $lte: parseInt(maxRating) }
    };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const reviews = await PersonaReview.find(query)
      .sort({ [sortBy]: sort })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('persona', 'name role');
    
    const totalReviews = await PersonaReview.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: skip + parseInt(limit) < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get review statistics for a persona
export const getReviewStats = async (req, res) => {
  try {
    const { personaSlug } = req.params;
    
    const stats = await PersonaReview.getReviewStats(personaSlug);
    
    if (!stats || stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: {
            5: 0, 4: 0, 3: 0, 2: 0, 1: 0
          },
          aspectRatings: {
            accuracy: 0,
            helpfulness: 0,
            communication: 0,
            personality: 0
          }
        }
      });
    }
    
    const stat = stats[0];
    
    res.status(200).json({
      success: true,
      data: {
        totalReviews: stat.totalReviews,
        averageRating: Math.round(stat.averageRating * 100) / 100,
        ratingDistribution: {
          5: stat.fiveStars,
          4: stat.fourStars,
          3: stat.threeStars,
          2: stat.twoStars,
          1: stat.oneStar
        },
        aspectRatings: {
          accuracy: Math.round((stat.avgAccuracy || 0) * 100) / 100,
          helpfulness: Math.round((stat.avgHelpfulness || 0) * 100) / 100,
          communication: Math.round((stat.avgCommunication || 0) * 100) / 100,
          personality: Math.round((stat.avgPersonality || 0) * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message
    });
  }
};

// Get featured reviews
export const getFeaturedReviews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const reviews = await PersonaReview.getFeaturedReviews(parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured reviews',
      error: error.message
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await PersonaReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.markAsHelpful();
    
    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: {
        helpfulVotes: review.helpfulVotes
      }
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message
    });
  }
};

// Admin: Feature a review
export const featureReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await PersonaReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.feature();
    
    res.status(200).json({
      success: true,
      message: 'Review featured successfully',
      data: review
    });
  } catch (error) {
    console.error('Error featuring review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to feature review',
      error: error.message
    });
  }
};

// Admin: Approve/Disapprove review
export const moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved, adminNotes } = req.body;
    
    const review = await PersonaReview.findByIdAndUpdate(
      reviewId,
      { 
        isApproved: isApproved,
        adminNotes: adminNotes || ''
      },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Update persona rating after moderation
    if (review.persona) {
      await updatePersonaRating(review.persona);
    }
    
    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'disapproved'} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Error moderating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate review',
      error: error.message
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await PersonaReview.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Update persona rating after deletion
    if (review.persona) {
      await updatePersonaRating(review.persona);
    }
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Helper function to update persona's average rating
const updatePersonaRating = async (personaId) => {
  try {
    const stats = await PersonaReview.aggregate([
      {
        $match: {
          persona: personaId,
          isApproved: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    
    const averageRating = stats.length > 0 ? stats[0].averageRating : 0;
    const totalRatings = stats.length > 0 ? stats[0].totalRatings : 0;
    
    await Persona.findByIdAndUpdate(personaId, {
      'usage.averageRating': Math.round(averageRating * 100) / 100,
      'usage.totalRatings': totalRatings
    });
  } catch (error) {
    console.error('Error updating persona rating:', error);
  }
};
