// ../src/controllers/horoscopeController.js

import { 
  generateDailyHoroscope, 
  getAllSignsHoroscope, 
  getWeeklyHoroscope as generateWeeklyHoroscope,
  vedicSigns 
} from '../services/dailyHoroscope.js';
import { 
  getPanchang, 
  getCurrentNakshatra, 
  getCurrentPlanetaryPositions,
  getAuspiciousMuhurat 
} from '../services/vedicCalculations.js';

/**
 * Get daily horoscope for a specific raashi
 */
export const getDailyHoroscope = async (req, res) => {
  try {
    const { raashi } = req.params;
    const { date } = req.query;
    
    // Validate raashi
    if (!vedicSigns[raashi.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        error: "Invalid raashi. Valid options: " + Object.keys(vedicSigns).join(', ')
      });
    }
    
    // Parse date or use today
    const targetDate = date ? new Date(date) : new Date();
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }
    
    const horoscope = generateDailyHoroscope(raashi, targetDate);
    
    res.json({
      success: true,
      data: horoscope,
      message: `${horoscope.raashi} के लिए आज का राशिफल तैयार है!`
    });
    
  } catch (error) {
    console.error('Error generating daily horoscope:', error);
    res.status(500).json({
      success: false,
      error: "राशिफल तैयार करने में समस्या हुई। कृपया बाद में कोशिश करें।"
    });
  }
};

/**
 * Get horoscope for all zodiac signs
 */
export const getAllHoroscopes = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    if (date && isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }
    
    const allHoroscopes = getAllSignsHoroscope(targetDate);
    
    res.json({
      success: true,
      data: allHoroscopes,
      date: targetDate.toLocaleDateString('hi-IN'),
      message: "सभी राशियों का राशिफल तैयार है!"
    });
    
  } catch (error) {
    console.error('Error generating all horoscopes:', error);
    res.status(500).json({
      success: false,
      error: "राशिफल तैयार करने में समस्या हुई।"
    });
  }
};

/**
 * Get weekly horoscope for a raashi
 */
export const getWeeklyHoroscope = async (req, res) => {
  try {
    const { raashi } = req.params;
    const { startDate } = req.query;
    
    if (!vedicSigns[raashi.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        error: "Invalid raashi. Valid options: " + Object.keys(vedicSigns).join(', ')
      });
    }
    
    const weekStart = startDate ? new Date(startDate) : new Date();
    if (startDate && isNaN(weekStart.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid start date format. Use YYYY-MM-DD"
      });
    }
    
    const weeklyHoroscope = generateWeeklyHoroscope(raashi, weekStart);
    
    res.json({
      success: true,
      data: weeklyHoroscope,
      message: `${weeklyHoroscope.raashi} के लिए साप्ताहिक राशिफल तैयार है!`
    });
    
  } catch (error) {
    console.error('Error generating weekly horoscope:', error);
    res.status(500).json({
      success: false,
      error: "साप्ताहिक राशिफल तैयार करने में समस्या हुई।"
    });
  }
};

/**
 * Get current Panchang (Hindu calendar)
 */
export const getCurrentPanchang = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    if (date && isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }
    
    const panchang = getPanchang(targetDate);
    const muhurat = getAuspiciousMuhurat(targetDate);
    
    res.json({
      success: true,
      data: {
        panchang,
        muhurat,
        specialNote: "पंचांग की जानकारी वैदिक गणना पर आधारित है"
      },
      message: "आज का पंचांग तैयार है!"
    });
    
  } catch (error) {
    console.error('Error generating panchang:', error);
    res.status(500).json({
      success: false,
      error: "पंचांग तैयार करने में समस्या हुई।"
    });
  }
};

/**
 * Get current nakshatra information
 */
export const getCurrentNakshatraInfo = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    if (date && isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }
    
    const nakshatra = getCurrentNakshatra(targetDate);
    
    res.json({
      success: true,
      data: {
        nakshatra,
        significance: getNakshatraSignificance(nakshatra),
        remedies: getNakshatraRemedies(nakshatra)
      },
      message: `आज का नक्षत्र है: ${nakshatra.name}`
    });
    
  } catch (error) {
    console.error('Error getting nakshatra info:', error);
    res.status(500).json({
      success: false,
      error: "नक्षत्र की जानकारी प्राप्त करने में समस्या हुई।"
    });
  }
};

/**
 * Get current planetary positions
 */
export const getPlanetaryPositions = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    if (date && isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }
    
    const positions = getCurrentPlanetaryPositions(targetDate);
    
    res.json({
      success: true,
      data: {
        date: targetDate.toLocaleDateString('hi-IN'),
        positions,
        note: "ग्रह स्थितियां सरलीकृत गणना पर आधारित हैं"
      },
      message: "आज की ग्रह स्थितियां तैयार हैं!"
    });
    
  } catch (error) {
    console.error('Error getting planetary positions:', error);
    res.status(500).json({
      success: false,
      error: "ग्रह स्थितियां प्राप्त करने में समस्या हुई।"
    });
  }
};

/**
 * Get horoscope in chat format (for chatbot integration)
 */
export const getHoroscopeForChat = async (req, res) => {
  try {
    const { raashi, aspect = 'overall' } = req.params;
    
    if (!vedicSigns[raashi.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        error: "Invalid raashi"
      });
    }
    
    const horoscope = generateDailyHoroscope(raashi);
    let response = "";
    
    switch (aspect) {
      case 'love':
        response = `💕 प्रेम जीवन: ${horoscope.predictions.love}`;
        break;
      case 'career':
        response = `🚀 करियर: ${horoscope.predictions.career}`;
        break;
      case 'health':
        response = `💪 स्वास्थ्य: ${horoscope.predictions.health}`;
        break;
      case 'finance':
        response = `💰 धन: ${horoscope.predictions.finance}`;
        break;
      default:
        response = `${horoscope.emoji} ${horoscope.raashi} राशिफल:\n\n${horoscope.predictions.overall}\n\n💕 प्रेम: ${horoscope.predictions.love}\n🚀 करियर: ${horoscope.predictions.career}\n💪 स्वास्थ्य: ${horoscope.predictions.health}\n💰 धन: ${horoscope.predictions.finance}`;
    }
    
    res.json({
      success: true,
      data: {
        response,
        luckyNumber: horoscope.luckyElements.numbers[0],
        luckyColor: horoscope.luckyElements.colors[0],
        mantra: horoscope.mantra
      }
    });
    
  } catch (error) {
    console.error('Error generating chat horoscope:', error);
    res.status(500).json({
      success: false,
      error: "राशिफल तैयार करने में समस्या हुई।"
    });
  }
};

/**
 * Get lucky elements for today
 */
export const getTodayLucky = async (req, res) => {
  try {
    const { raashi } = req.params;
    
    if (!vedicSigns[raashi.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        error: "Invalid raashi"
      });
    }
    
    const horoscope = generateDailyHoroscope(raashi);
    
    res.json({
      success: true,
      data: {
        raashi: horoscope.raashi,
        lucky: horoscope.luckyElements,
        remedies: horoscope.remedies,
        auspiciousTime: horoscope.auspiciousTime,
        mantra: horoscope.mantra
      },
      message: "आज के शुभ तत्व तैयार हैं!"
    });
    
  } catch (error) {
    console.error('Error getting lucky elements:', error);
    res.status(500).json({
      success: false,
      error: "शुभ तत्व प्राप्त करने में समस्या हुई।"
    });
  }
};

/**
 * Helper functions
 */
function getNakshatraSignificance(nakshatra) {
  const significances = {
    "अश्विनी": "तीव्र गति, नया आरंभ, चिकित्सा शक्ति",
    "भरणी": "जन्म-मृत्यु चक्र, तपस्या, धैर्य",
    "कृत्तिका": "अग्नि तत्व, काटने की शक्ति, शुद्धीकरण",
    "रोहिणी": "सौंदर्य, कलात्मकता, समृद्धि",
    "मृगशिरा": "खोज, जिज्ञासा, मानसिक शक्ति"
  };
  
  return significances[nakshatra.name] || "विशेष नक्षत्र शक्ति";
}

function getNakshatraRemedies(nakshatra) {
  const remedies = {
    "अश्विनी": ["अश्विनी कुमारों की पूजा", "गुड़ का दान", "घोड़े की सेवा"],
    "भरणी": ["यम देव की पूजा", "काले तिल का दान", "पितृ पूजा"],
    "कृत्तिका": ["अग्नि देव की पूजा", "धूप-दीप जलाना", "लाल वस्त्र दान"]
  };
  
  return remedies[nakshatra.name] || ["सामान्य पूजा", "मंत्र जाप", "दान-पुण्य"];
}
