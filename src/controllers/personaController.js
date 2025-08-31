// ../src/controllers/personaController.js

import Persona from '../models/Persona.js';
import { generateDailyHoroscope } from '../services/dailyHoroscope.js';
import { getPanchang } from '../services/vedicCalculations.js';
import { ensureConnection } from '../config/database.js';

/**
 * Controller for managing astrology personas
 * Handles CRUD operations and persona selection for the chatbot
 */

// Get all active personas
export const getAllPersonas = async (req, res) => {
  try {
    // Ensure database connection
    await ensureConnection();
    
    const { category, popular } = req.query;
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    let personas;
    if (popular === 'true') {
      personas = await Persona.getPopular(10);
    } else {
      personas = await Persona.find(query)
        .select('name slug role category personality initialGreeting usage tags')
        .sort({ 'usage.totalSessions': -1 });
    }
    
    res.status(200).json({
      success: true,
      count: personas.length,
      data: personas
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personas',
      error: error.message
    });
  }
};

// Get persona by slug
export const getPersonaBySlug = async (req, res) => {
  try {
    // Ensure database connection
    await ensureConnection();
    
    const { slug } = req.params;
    
    const persona = await Persona.findOne({ 
      slug: slug, 
      isActive: true 
    });
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: persona
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch persona',
      error: error.message
    });
  }
};

// Get default persona
export const getDefaultPersona = async (req, res) => {
  try {
    // Ensure database connection
    await ensureConnection();
    
    const persona = await Persona.getDefault();
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'No default persona found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: persona
    });
  } catch (error) {
    console.error('Error fetching default persona:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch default persona',
      error: error.message
    });
  }
};

// Get personas by category
export const getPersonasByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const personas = await Persona.getActiveByCategory(category);
    
    res.status(200).json({
      success: true,
      category: category,
      count: personas.length,
      data: personas
    });
  } catch (error) {
    console.error('Error fetching personas by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personas by category',
      error: error.message
    });
  }
};

// Create new persona (Admin only)
export const createPersona = async (req, res) => {
  try {
    const personaData = req.body;
    
    // Check if slug already exists
    const existingPersona = await Persona.findOne({ slug: personaData.slug });
    if (existingPersona) {
      return res.status(400).json({
        success: false,
        message: 'Persona with this slug already exists'
      });
    }
    
    const persona = new Persona(personaData);
    await persona.save();
    
    res.status(201).json({
      success: true,
      message: 'Persona created successfully',
      data: persona
    });
  } catch (error) {
    console.error('Error creating persona:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create persona',
      error: error.message
    });
  }
};

// Update persona (Admin only)
export const updatePersona = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;
    
    const persona = await Persona.findOneAndUpdate(
      { slug: slug },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Persona updated successfully',
      data: persona
    });
  } catch (error) {
    console.error('Error updating persona:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update persona',
      error: error.message
    });
  }
};

// Delete persona (Admin only)
export const deletePersona = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const persona = await Persona.findOne({ slug: slug });
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    // Don't allow deletion of default persona
    if (persona.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default persona'
      });
    }
    
    await Persona.findOneAndDelete({ slug: slug });
    
    res.status(200).json({
      success: true,
      message: 'Persona deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting persona:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete persona',
      error: error.message
    });
  }
};

// Rate a persona
export const ratePersona = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const persona = await Persona.findOne({ slug: slug });
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    await persona.updateRating(rating);
    
    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        averageRating: persona.usage.averageRating,
        totalRatings: persona.usage.totalRatings
      }
    });
  } catch (error) {
    console.error('Error rating persona:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    });
  }
};

// Increment persona usage
export const incrementPersonaUsage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { messageCount = 1 } = req.body;
    
    const persona = await Persona.findOne({ slug: slug });
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    await persona.incrementUsage(messageCount);
    
    res.status(200).json({
      success: true,
      message: 'Usage updated successfully',
      data: persona.usage
    });
  } catch (error) {
    console.error('Error updating persona usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update usage',
      error: error.message
    });
  }
};

// Get persona statistics
export const getPersonaStats = async (req, res) => {
  try {
    const stats = await Persona.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSessions: { $sum: '$usage.totalSessions' },
          totalMessages: { $sum: '$usage.totalMessages' },
          avgRating: { $avg: '$usage.averageRating' }
        }
      },
      { $sort: { totalSessions: -1 } }
    ]);
    
    const totalPersonas = await Persona.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        totalPersonas,
        categoryStats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching persona stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch persona statistics',
      error: error.message
    });
  }
};

// Get persona with daily horoscope context
export const getPersonaWithHoroscope = async (req, res) => {
  try {
    const { slug } = req.params;
    const { raashi, date } = req.query;
    
    const persona = await Persona.findOne({ 
      slug: slug, 
      isActive: true 
    });
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }
    
    let horoscopeContext = null;
    if (raashi) {
      try {
        const targetDate = date ? new Date(date) : new Date();
        horoscopeContext = generateDailyHoroscope(raashi, targetDate);
      } catch (error) {
        console.error('Error generating horoscope:', error);
      }
    }
    
    const panchang = getPanchang(date ? new Date(date) : new Date());
    
    res.status(200).json({
      success: true,
      data: {
        persona,
        horoscopeContext,
        panchang,
        contextualGreeting: generateContextualGreeting(persona, horoscopeContext, panchang)
      }
    });
  } catch (error) {
    console.error('Error fetching persona with horoscope:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch persona with horoscope context',
      error: error.message
    });
  }
};

// Generate contextual greeting based on horoscope
function generateContextualGreeting(persona, horoscope, panchang) {
  let greeting = persona.initialGreeting;
  
  if (horoscope) {
    const raashiName = horoscope.raashi;
    const todayRating = calculateDayRating(horoscope);
    
    if (persona.category === 'traditional') {
      greeting += ` आज ${raashiName} राशि के लिए ${panchang.nakshatra.name} नक्षत्र में ${todayRating} दिन है।`;
    } else if (persona.category === 'modern') {
      greeting += ` Hey ${raashiName} baby! आज का vibe ${todayRating} है! Ready for some cosmic updates? ✨`;
    } else if (persona.category === 'tantric') {
      greeting += ` ${raashiName} राशि के व्यक्ति, आज ${panchang.tithi.name} तिथि में cosmic energy ${todayRating} है...`;
    } else if (persona.category === 'romantic') {
      greeting += ` ${raashiName} sweetie! आज love के मामले में ${todayRating} दिन है! 💕`;
    }
  }
  
  return greeting;
}

// Calculate overall day rating from horoscope
function calculateDayRating(horoscope) {
  const predictions = horoscope.predictions;
  
  // Simple scoring based on predictions length and positive words
  const positiveWords = ['अच्छा', 'शानदार', 'बेहतरीन', 'सफलता', 'लाभ', 'खुशी'];
  let score = 0;
  
  Object.values(predictions).forEach(prediction => {
    positiveWords.forEach(word => {
      if (prediction.includes(word)) score++;
    });
  });
  
  if (score >= 3) return 'शुभ';
  if (score >= 1) return 'सामान्य';
  return 'सावधानी का';
}
