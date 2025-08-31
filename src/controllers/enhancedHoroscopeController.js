// ../src/controllers/enhancedHoroscopeController.js

import BirthChart from '../models/BirthChart.js';
import { 
  generatePersonalizedHoroscope, 
  generateEnhancedGeneralHoroscope 
} from '../services/personalizedVedicHoroscope.js';
import { 
  generateDailyHoroscope,
  vedicSigns 
} from '../services/dailyHoroscope.js';

/**
 * Enhanced Horoscope Controller
 * Provides both personalized (birth chart based) and general horoscopes
 */

/**
 * Get personalized horoscope based on user's birth chart
 */
export const getPersonalizedHoroscope = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    // Find user's birth chart
    const birthChart = await BirthChart.findByUserId(userId);
    
    if (!birthChart) {
      return res.status(404).json({
        success: false,
        error: "Birth chart not found. Please create your birth chart first.",
        needsBirthChart: true
      });
    }
    
    const targetDate = date ? new Date(date) : new Date();
    
    // Generate personalized horoscope
    const personalizedHoroscope = generatePersonalizedHoroscope(birthChart, targetDate);
    
    // Update usage analytics
    await birthChart.incrementUsage();
    
    res.json({
      success: true,
      type: 'personalized',
      data: personalizedHoroscope,
      message: `${birthChart.name} के लिए व्यक्तिगत राशिफल तैयार है!`
    });
    
  } catch (error) {
    console.error('Error generating personalized horoscope:', error);
    res.status(500).json({
      success: false,
      error: "व्यक्तिगत राशिफल तैयार करने में समस्या हुई।"
    });
  }
};

/**
 * Get enhanced general horoscope (better than basic random)
 */
export const getEnhancedGeneralHoroscope = async (req, res) => {
  try {
    const { raashi } = req.params;
    const { date, userId } = req.query;
    
    if (!vedicSigns[raashi.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        error: "Invalid raashi. Valid options: " + Object.keys(vedicSigns).join(', ')
      });
    }
    
    const targetDate = date ? new Date(date) : new Date();
    
    // Check if user has birth chart for personalized experience
    let hasBirthChart = false;
    if (userId) {
      const birthChart = await BirthChart.findByUserId(userId);
      if (birthChart) {
        hasBirthChart = true;
        // Redirect to personalized horoscope
        return res.json({
          success: true,
          type: 'redirect_to_personalized',
          message: "आपका birth chart मिल गया! Personalized horoscope के लिए /personalized endpoint use करें।",
          redirectUrl: `/api/v1/horoscope/personalized/${userId}`
        });
      }
    }
    
    // Generate enhanced general horoscope using actual planetary positions
    const enhancedData = generateEnhancedGeneralHoroscope(raashi, targetDate);
    const basicHoroscope = generateDailyHoroscope(raashi, targetDate);
    
    // Merge enhanced data with basic horoscope
    const enhancedHoroscope = {
      ...basicHoroscope,
      enhancementLevel: 'planetary_influenced',
      planetaryInfluences: enhancedData.planetaryInfluences,
      accuracyNote: "यह राशिफल वर्तमान ग्रह स्थितियों के आधार पर तैयार किया गया है",
      personalizedOption: {
        available: true,
        message: "अधिक सटीक भविष्यफल के लिए अपना birth chart बनाएं",
        benefits: [
          "100% व्यक्तिगत भविष्यफल",
          "आपकी birth chart के आधार पर सटीक भविष्यवाणी", 
          "व्यक्तिगत उपाय और मंत्र",
          "दशा और गोचर का विश्लेषण"
        ]
      }
    };
    
    res.json({
      success: true,
      type: 'enhanced_general',
      data: enhancedHoroscope,
      message: `${enhancedHoroscope.raashi} के लिए Enhanced राशिफल तैयार है!`
    });
    
  } catch (error) {
    console.error('Error generating enhanced horoscope:', error);
    res.status(500).json({
      success: false,
      error: "Enhanced राशिफल तैयार करने में समस्या हुई।"
    });
  }
};

/**
 * Create user's birth chart
 */
export const createBirthChart = async (req, res) => {
  try {
    const birthData = req.body;
    
    // Validate required fields
    const requiredFields = ['userId', 'name', 'birthDate', 'birthTime', 'birthPlace', 'raashi'];
    const missingFields = requiredFields.filter(field => !birthData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if birth chart already exists
    const existingChart = await BirthChart.findByUserId(birthData.userId);
    if (existingChart) {
      return res.status(400).json({
        success: false,
        error: "Birth chart already exists for this user",
        suggestion: "Use update endpoint to modify existing chart"
      });
    }
    
    // Create birth chart
    const birthChart = new BirthChart(birthData);
    await birthChart.save();
    
    // Generate first personalized horoscope
    const firstHoroscope = generatePersonalizedHoroscope(birthChart);
    
    res.status(201).json({
      success: true,
      message: "Birth chart created successfully! अब आप personalized horoscope प्राप्त कर सकते हैं।",
      data: {
        birthChart: {
          userId: birthChart.userId,
          name: birthChart.name,
          raashi: birthChart.raashi,
          nakshatra: birthChart.nakshatra
        },
        firstHoroscope: firstHoroscope
      }
    });
    
  } catch (error) {
    console.error('Error creating birth chart:', error);
    res.status(500).json({
      success: false,
      error: "Birth chart बनाने में समस्या हुई।"
    });
  }
};

/**
 * Get user's birth chart details
 */
export const getBirthChart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const birthChart = await BirthChart.findByUserId(userId);
    
    if (!birthChart) {
      return res.status(404).json({
        success: false,
        error: "Birth chart not found"
      });
    }
    
    res.json({
      success: true,
      data: birthChart,
      message: "Birth chart details retrieved successfully"
    });
    
  } catch (error) {
    console.error('Error fetching birth chart:', error);
    res.status(500).json({
      success: false,
      error: "Birth chart प्राप्त करने में समस्या हुई।"
    });
  }
};

/**
 * Update user's birth chart
 */
export const updateBirthChart = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const birthChart = await BirthChart.findOneAndUpdate(
      { userId: userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!birthChart) {
      return res.status(404).json({
        success: false,
        error: "Birth chart not found"
      });
    }
    
    res.json({
      success: true,
      message: "Birth chart updated successfully",
      data: birthChart
    });
    
  } catch (error) {
    console.error('Error updating birth chart:', error);
    res.status(500).json({
      success: false,
      error: "Birth chart update करने में समस्या हुई।"
    });
  }
};

/**
 * Check compatibility between two users
 */
export const checkCompatibility = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    const [chart1, chart2] = await Promise.all([
      BirthChart.findByUserId(userId1),
      BirthChart.findByUserId(userId2)
    ]);
    
    if (!chart1 || !chart2) {
      return res.status(404).json({
        success: false,
        error: "One or both birth charts not found"
      });
    }
    
    const compatibility = chart1.getCompatibility(chart2);
    
    res.json({
      success: true,
      data: {
        user1: { name: chart1.name, raashi: chart1.raashi },
        user2: { name: chart2.name, raashi: chart2.raashi },
        compatibility: compatibility,
        detailedAnalysis: {
          gunaMilan: {
            user1Score: chart1.gunaMilan?.totalScore || 0,
            user2Score: chart2.gunaMilan?.totalScore || 0,
            averageScore: compatibility?.score || 0
          },
          recommendations: getCompatibilityRecommendations(compatibility?.score || 0)
        }
      },
      message: "Compatibility analysis completed"
    });
    
  } catch (error) {
    console.error('Error checking compatibility:', error);
    res.status(500).json({
      success: false,
      error: "Compatibility check करने में समस्या हुई।"
    });
  }
};

/**
 * Get comparison between personalized vs general horoscope
 */
export const getHoroscopeComparison = async (req, res) => {
  try {
    const { userId, raashi } = req.params;
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    
    // Generate general horoscope
    const generalHoroscope = generateDailyHoroscope(raashi, targetDate);
    
    // Try to generate personalized horoscope
    let personalizedHoroscope = null;
    const birthChart = await BirthChart.findByUserId(userId);
    
    if (birthChart) {
      personalizedHoroscope = generatePersonalizedHoroscope(birthChart, targetDate);
    }
    
    const comparison = {
      general: {
        type: "सामान्य राशिफल",
        basis: "राशि और ग्रह स्थिति के आधार पर",
        accuracy: "मध्यम",
        data: generalHoroscope
      },
      personalized: personalizedHoroscope ? {
        type: "व्यक्तिगत राशिफल", 
        basis: "आपकी birth chart के आधार पर",
        accuracy: "अधिक सटीक",
        data: personalizedHoroscope
      } : null,
      recommendation: personalizedHoroscope ? 
        "आपके लिए व्यक्तिगत राशिफल अधिक सटीक होगा क्योंकि यह आपकी exact birth details पर आधारित है।" :
        "अधिक सटीक भविष्यफल के लिए अपना birth chart बनाएं।"
    };
    
    res.json({
      success: true,
      data: comparison,
      message: "Horoscope comparison ready"
    });
    
  } catch (error) {
    console.error('Error in horoscope comparison:', error);
    res.status(500).json({
      success: false,
      error: "Horoscope comparison में समस्या हुई।"
    });
  }
};

/**
 * Helper function for compatibility recommendations
 */
function getCompatibilityRecommendations(score) {
  if (score >= 24) {
    return {
      level: "उत्कृष्ट",
      message: "आप दोनों के बीच गुण मिलान बहुत अच्छा है।",
      suggestions: [
        "विवाह के लिए शुभ योग है",
        "दीर्घकालिक संबंध के लिए उत्तम",
        "आपसी समझ बेहतरीन रहेगी"
      ]
    };
  } else if (score >= 18) {
    return {
      level: "अच्छा",
      message: "गुण मिलान अच्छा है, विवाह संभव है।",
      suggestions: [
        "छोटे-मोटे समायोजन की आवश्यकता",
        "आपसी बातचीत से समस्याएं सुलझ सकती हैं",
        "पारिवारिक सहयोग महत्वपूर्ण है"
      ]
    };
  } else if (score >= 14) {
    return {
      level: "मध्यम",
      message: "गुण मिलान सामान्य है।",
      suggestions: [
        "विवाह से पूर्व विस्तृत कुंडली मिलान कराएं",
        "ज्योतिषी से उपाय पूछें",
        "धैर्य और समझदारी से निर्णय लें"
      ]
    };
  } else {
    return {
      level: "चुनौतीपूर्ण",
      message: "गुण मिलान में कमी है।",
      suggestions: [
        "विशेष उपाय और पूजा की आवश्यकता",
        "अनुभवी ज्योतिषी से सलाह लें",
        "वैकल्पिक समाधान देखें"
      ]
    };
  }
}
