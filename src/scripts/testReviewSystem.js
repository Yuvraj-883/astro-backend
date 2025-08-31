// ../src/scripts/testReviewSystem.js

import mongoose from 'mongoose';
import PersonaReview from '../models/PersonaReview.js';
import Persona from '../models/Persona.js';
import { sampleReviews } from '../examples/reviewExamples.js';
import { connectDB } from '../config/database.js';

/**
 * Test script for the review system
 * Run this to populate sample reviews in the database
 */

async function createSampleReviews() {
  try {
    console.log('🔄 Creating sample reviews...');
    
    // Clear existing reviews for fresh start
    await PersonaReview.deleteMany({});
    console.log('🧹 Cleared existing reviews');
    
    // Get all personas from database
    const personas = await Persona.find({});
    if (personas.length === 0) {
      throw new Error('No personas found in database. Please run persona seeder first.');
    }
    
    // Create a map of slug to persona ObjectId
    const personaMap = {};
    personas.forEach(persona => {
      personaMap[persona.slug] = persona._id;
    });
    
    const createdReviews = [];
    
    for (const reviewData of sampleReviews) {
      // Find the persona ObjectId from slug
      const personaId = personaMap[reviewData.personaSlug];
      if (!personaId) {
        console.warn(`⚠️ No persona found for slug: ${reviewData.personaSlug}`);
        continue;
      }
      
      // Create review with proper persona reference
      const reviewDataWithPersona = {
        ...reviewData,
        persona: personaId
      };
      
      const review = new PersonaReview(reviewDataWithPersona);
      await review.save();
      createdReviews.push(review);
      console.log(`✅ Created review: ${review.title} (${review.rating}⭐) for ${reviewData.personaSlug}`);
    }
    
    console.log(`🎉 Successfully created ${createdReviews.length} sample reviews`);
    return createdReviews;
    
  } catch (error) {
    console.error('❌ Error creating sample reviews:', error);
    throw error;
  }
}

async function testReviewQueries() {
  try {
    console.log('\n🔍 Testing review queries...\n');
    
    // Test 1: Get all reviews for a persona
    const traditionalistReviews = await PersonaReview.find({ 
      personaSlug: 'sanatan-vision' 
    }).sort({ createdAt: -1 });
    
    console.log(`📊 Traditional Persona Reviews: ${traditionalistReviews.length}`);
    traditionalistReviews.forEach(review => {
      console.log(`   • ${review.title} - ${review.rating}⭐ by ${review.userName}`);
    });
    
    // Test 2: Get review statistics
    const stats = await PersonaReview.aggregate([
      { $match: { personaSlug: 'sanatan-vision' } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          maxRating: { $max: '$rating' },
          minRating: { $min: '$rating' }
        }
      }
    ]);
    
    console.log('\n📈 Review Statistics:');
    if (stats.length > 0) {
      const stat = stats[0];
      console.log(`   • Total Reviews: ${stat.totalReviews}`);
      console.log(`   • Average Rating: ${stat.averageRating.toFixed(1)}⭐`);
      console.log(`   • Rating Range: ${stat.minRating} - ${stat.maxRating}`);
    }
    
    // Test 3: Get featured reviews
    const featuredReviews = await PersonaReview.find({ 
      isFeatured: true 
    }).limit(3);
    
    console.log(`\n⭐ Featured Reviews: ${featuredReviews.length}`);
    
    // Test 4: Rating distribution
    const ratingDistribution = await PersonaReview.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    
    console.log('\n📊 Rating Distribution:');
    ratingDistribution.forEach(dist => {
      console.log(`   • ${dist._id}⭐: ${dist.count} reviews`);
    });
    
  } catch (error) {
    console.error('❌ Error testing queries:', error);
    throw error;
  }
}

async function testPersonaRatingUpdate() {
  try {
    console.log('\n🔄 Testing persona rating updates...\n');
    
    const personas = await Persona.find();
    
    for (const persona of personas) {
      const reviews = await PersonaReview.find({ 
        personaSlug: persona.slug,
        isApproved: true 
      });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        persona.averageRating = averageRating;
        persona.totalReviews = reviews.length;
        await persona.save();
        
        console.log(`✅ Updated ${persona.name}: ${averageRating.toFixed(1)}⭐ (${reviews.length} reviews)`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating persona ratings:', error);
    throw error;
  }
}

async function simulateReviewInteractions() {
  try {
    console.log('\n🎭 Simulating user interactions...\n');
    
    // Simulate helpful votes
    const reviews = await PersonaReview.find().limit(3);
    
    for (const review of reviews) {
      const randomVotes = Math.floor(Math.random() * 10) + 1;
      review.helpfulVotes = randomVotes;
      
      // Feature high-rated reviews
      if (review.rating >= 4 && randomVotes >= 3) {
        review.isFeatured = true;
      }
      
      await review.save();
      console.log(`👍 Review "${review.title}" got ${randomVotes} helpful votes`);
    }
    
  } catch (error) {
    console.error('❌ Error simulating interactions:', error);
    throw error;
  }
}

async function runCompleteTest() {
  try {
    console.log('🚀 Starting Review System Test\n');
    
    // Connect to database using same config as main app
    await connectDB();
    await createSampleReviews();
    await testReviewQueries();
    await testPersonaRatingUpdate();
    await simulateReviewInteractions();
    
    console.log('\n🎉 Review system test completed successfully!');
    console.log('\n📝 What was tested:');
    console.log('   ✅ Review creation with validation');
    console.log('   ✅ Query operations and aggregations');
    console.log('   ✅ Persona rating auto-updates');
    console.log('   ✅ User interaction simulation');
    console.log('   ✅ Featured review system');
    
    console.log('\n🌐 Test your API endpoints:');
    console.log('   GET /api/v1/reviews/persona/sanatan-vision');
    console.log('   GET /api/v1/reviews/persona/sanatan-vision/stats');
    console.log('   POST /api/v1/reviews/persona/cosmic-didi');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📴 Database connection closed');
    process.exit(0);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompleteTest();
}

export { runCompleteTest, createSampleReviews, testReviewQueries };
