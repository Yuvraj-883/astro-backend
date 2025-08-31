// ../src/services/personalizedVedicHoroscope.js

/**
 * Personalized Vedic Astrology System
 * Uses birth chart calculations for truly personalized predictions
 */

import { 
  getCurrentPlanetaryPositions, 
  getPanchang, 
  getDayOfYear
} from './vedicCalculations.js';
import { vedicSigns, getSignNumber } from './dailyHoroscope.js';

/**
 * Generate personalized horoscope based on birth data
 */
export function generatePersonalizedHoroscope(birthData, date = new Date()) {
  const {
    birthDate,
    birthTime,
    birthPlace,
    raashi,
    nakshatra,
    ascendant,
    moonSign
  } = birthData;

  // Calculate current planetary transits
  const currentPlanets = getCurrentPlanetaryPositions(date);
  const panchang = getPanchang(date);
  const currentNakshatra = getCurrentNakshatra(date);
  
  // Calculate planetary aspects and transits
  const transits = calculatePlanetaryTransits(birthData, currentPlanets);
  const aspects = calculatePlanetaryAspects(birthData, currentPlanets);
  const dashaSystem = calculateCurrentDasha(birthData, date);
  
  return {
    date: date.toLocaleDateString('hi-IN'),
    personalData: {
      raashi: raashi,
      nakshatra: nakshatra,
      ascendant: ascendant
    },
    currentTransits: transits,
    personalizedPredictions: generatePersonalizedPredictions(transits, aspects, dashaSystem),
    currentDasha: dashaSystem,
    personalRemedies: getPersonalizedRemedies(transits, aspects),
    strengthAnalysis: analyzePlanetaryStrength(birthData, currentPlanets),
    yogaAnalysis: analyzeCurrentYogas(birthData, currentPlanets),
    luckyElements: getPersonalizedLuckyElements(birthData, currentPlanets),
    warnings: getPersonalizedWarnings(transits, aspects)
  };
}

/**
 * Calculate planetary transits affecting the person
 */
function calculatePlanetaryTransits(birthData, currentPlanets) {
  const transits = {};
  
  // Calculate how current planets are affecting birth chart
  Object.keys(currentPlanets).forEach(planet => {
    const currentPosition = currentPlanets[planet];
    const birthPosition = birthData.planets[planet];
    
    transits[planet] = {
      currentSign: currentPosition.sign,
      birthSign: birthPosition.sign,
      isRetrograde: currentPosition.retrograde || false,
      transitType: calculateTransitType(currentPosition, birthPosition),
      aspectsToNatal: calculateAspectsToNatalPlanets(currentPosition, birthData.planets),
      effect: getTransitEffect(planet, currentPosition, birthPosition)
    };
  });
  
  return transits;
}

/**
 * Calculate planetary aspects
 */
function calculatePlanetaryAspects(birthData, currentPlanets) {
  const aspects = [];
  
  // Check important aspects between current and natal planets
  const importantAspects = [0, 60, 90, 120, 180]; // Conjunction, Sextile, Square, Trine, Opposition
  
  Object.keys(currentPlanets).forEach(currentPlanet => {
    Object.keys(birthData.planets).forEach(natalPlanet => {
      const aspect = calculateAspectBetweenPlanets(
        currentPlanets[currentPlanet], 
        birthData.planets[natalPlanet]
      );
      
      if (importantAspects.includes(aspect.angle)) {
        aspects.push({
          transitPlanet: currentPlanet,
          natalPlanet: natalPlanet,
          aspect: aspect.angle,
          strength: aspect.strength,
          effect: getAspectEffect(currentPlanet, natalPlanet, aspect.angle)
        });
      }
    });
  });
  
  return aspects;
}

/**
 * Calculate current Dasha system
 */
function calculateCurrentDasha(birthData, date) {
  const birthMoonNakshatra = birthData.nakshatra;
  const birthDate = new Date(birthData.birthDate);
  const ageInDays = Math.floor((date - birthDate) / (1000 * 60 * 60 * 24));
  
  // Vimshottari Dasha calculation (simplified)
  const dashaLengths = {
    ketu: 7 * 365,    // 7 years
    shukra: 20 * 365, // 20 years  
    surya: 6 * 365,   // 6 years
    chandra: 10 * 365, // 10 years
    mangal: 7 * 365,   // 7 years
    rahu: 18 * 365,    // 18 years
    guru: 16 * 365,    // 16 years
    shani: 19 * 365,   // 19 years
    budh: 17 * 365     // 17 years
  };
  
  // Determine current Mahadasha and Antardasha
  const totalDashaCycle = 120 * 365; // 120 years
  const currentCyclePosition = ageInDays % totalDashaCycle;
  
  let cumulativeDays = 0;
  let currentMahadasha = null;
  
  for (const [planet, length] of Object.entries(dashaLengths)) {
    if (currentCyclePosition >= cumulativeDays && currentCyclePosition < cumulativeDays + length) {
      currentMahadasha = planet;
      break;
    }
    cumulativeDays += length;
  }
  
  return {
    mahadasha: currentMahadasha,
    antardashaStarted: Math.floor((currentCyclePosition - cumulativeDays) / 30), // Simplified
    effect: getDashaEffect(currentMahadasha),
    remedies: getDashaRemedies(currentMahadasha)
  };
}

/**
 * Generate personalized predictions based on transits and aspects
 */
function generatePersonalizedPredictions(transits, aspects, dasha) {
  const predictions = {
    overall: generateOverallPrediction(transits, aspects, dasha),
    love: generateLovePrediction(transits, aspects),
    career: generateCareerPrediction(transits, aspects, dasha),
    health: generateHealthPrediction(transits, aspects),
    finance: generateFinancePrediction(transits, aspects, dasha)
  };
  
  return predictions;
}

/**
 * Generate overall prediction
 */
function generateOverallPrediction(transits, aspects, dasha) {
  let overallEnergy = 0;
  let predictions = [];
  
  // Analyze Dasha effect
  const dashaEffect = getDashaInfluence(dasha.mahadasha);
  overallEnergy += dashaEffect.score;
  predictions.push(dashaEffect.prediction);
  
  // Analyze major transits
  const majorTransits = ['guru', 'shani', 'rahu']; // Jupiter, Saturn, Rahu
  majorTransits.forEach(planet => {
    if (transits[planet]) {
      const transitEffect = getTransitInfluence(planet, transits[planet]);
      overallEnergy += transitEffect.score;
      predictions.push(transitEffect.prediction);
    }
  });
  
  // Combine predictions
  if (overallEnergy >= 3) {
    return `आज आपके लिए विशेष रूप से शुभ दिन है! ${predictions.join(' ')} ✨`;
  } else if (overallEnergy >= 0) {
    return `आज का दिन मिश्रित फल देगा। ${predictions.join(' ')} 🌟`;
  } else {
    return `आज सावधानी से काम लें। ${predictions.join(' ')} 🙏`;
  }
}

/**
 * Generate love prediction based on Venus and Moon transits
 */
function generateLovePrediction(transits, aspects) {
  const venusTransit = transits.shukra;
  const moonTransit = transits.chandra;
  
  let loveScore = 0;
  let prediction = "";
  
  // Analyze Venus transit
  if (venusTransit) {
    if (venusTransit.transitType === 'beneficial') {
      loveScore += 2;
      prediction += "शुक्र का शुभ प्रभाव प्रेम जीवन में खुशियां लाएगा। ";
    } else if (venusTransit.transitType === 'challenging') {
      loveScore -= 1;
      prediction += "प्रेम मामलों में धैर्य रखें, शुक्र की चुनौती है। ";
    }
  }
  
  // Analyze Moon transit for emotions
  if (moonTransit) {
    if (moonTransit.transitType === 'beneficial') {
      loveScore += 1;
      prediction += "चंद्रमा का सहयोग भावनात्मक संतुष्टि देगा। ";
    }
  }
  
  // Check for specific love aspects
  const loveAspects = aspects.filter(aspect => 
    (aspect.transitPlanet === 'shukra' || aspect.natalPlanet === 'shukra') ||
    (aspect.transitPlanet === 'chandra' || aspect.natalPlanet === 'chandra')
  );
  
  loveAspects.forEach(aspect => {
    if (aspect.aspect === 120 || aspect.aspect === 60) { // Trine or Sextile
      loveScore += 1;
      prediction += "ग्रह योग प्रेम में सफलता दिला रहा है। ";
    }
  });
  
  if (loveScore >= 2) {
    return prediction + "आज प्रेम के मामले में बेहतरीन दिन है! 💕";
  } else if (loveScore >= 0) {
    return prediction + "प्रेम जीवन में सामान्य स्थिति रहेगी। 💖";
  } else {
    return prediction + "प्रेम मामलों में सावधानी बरतें। 💔";
  }
}

/**
 * Generate career prediction based on Saturn, Jupiter, and Sun transits
 */
function generateCareerPrediction(transits, aspects, dasha) {
  const saturnTransit = transits.shani;
  const jupiterTransit = transits.guru;
  const sunTransit = transits.surya;
  
  let careerScore = 0;
  let prediction = "";
  
  // Analyze Saturn for career stability
  if (saturnTransit) {
    if (saturnTransit.transitType === 'beneficial') {
      careerScore += 2;
      prediction += "शनि का शुभ प्रभाव करियर में स्थिरता लाएगा। ";
    } else if (saturnTransit.transitType === 'challenging') {
      careerScore -= 1;
      prediction += "करियर में मेहनत की जरूरत, शनि का परीक्षा काल। ";
    }
  }
  
  // Analyze Jupiter for growth
  if (jupiterTransit) {
    if (jupiterTransit.transitType === 'beneficial') {
      careerScore += 2;
      prediction += "गुरु का आशीर्वाद करियर में उन्नति दिलाएगा। ";
    }
  }
  
  // Check current Dasha effect on career
  const careerDashas = ['shani', 'guru', 'surya', 'budh'];
  if (careerDashas.includes(dasha.mahadasha)) {
    careerScore += 1;
    prediction += `${dasha.mahadasha} दशा करियर के लिए अनुकूल है। `;
  }
  
  if (careerScore >= 3) {
    return prediction + "करियर में शानदार सफलता की संभावना! 🚀";
  } else if (careerScore >= 1) {
    return prediction + "करियर में धीरे-धीरे प्रगति होगी। 📈";
  } else {
    return prediction + "करियर में धैर्य और मेहनत की आवश्यकता। 💼";
  }
}

/**
 * Get personalized remedies based on current planetary conditions
 */
function getPersonalizedRemedies(transits, aspects) {
  const remedies = {
    planetary: [],
    gemstones: [],
    mantras: [],
    donations: [],
    rituals: []
  };
  
  // Analyze challenging transits and suggest remedies
  Object.keys(transits).forEach(planet => {
    const transit = transits[planet];
    if (transit.transitType === 'challenging') {
      remedies.planetary.push(...getPlanetSpecificRemedies(planet));
    }
  });
  
  // Analyze challenging aspects
  const challengingAspects = aspects.filter(aspect => 
    aspect.aspect === 90 || aspect.aspect === 180
  );
  
  challengingAspects.forEach(aspect => {
    remedies.mantras.push(getAspectRemedy(aspect.transitPlanet, aspect.natalPlanet));
  });
  
  return remedies;
}

/**
 * Helper functions for effects and remedies
 */
function getTransitEffect(planet, currentPos, birthPos) {
  const effects = {
    guru: {
      beneficial: "गुरु का शुभ गोचर ज्ञान और भाग्य में वृद्धि",
      challenging: "गुरु की चुनौती से धैर्य की परीक्षा"
    },
    shani: {
      beneficial: "शनि का अनुकूल प्रभाव कर्म फल देगा",
      challenging: "शनि की साढ़े साती या अष्टम शनि का प्रभाव"
    },
    shukra: {
      beneficial: "शुक्र की कृपा से सुख-समृद्धि",
      challenging: "शुक्र की अशुभता से संबंधों में तनाव"
    }
  };
  
  return effects[planet]?.beneficial || "ग्रह का सामान्य प्रभाव";
}

function getDashaEffect(planet) {
  const effects = {
    guru: { prediction: "गुरु दशा में ज्ञान और आध्यात्म की प्राप्ति", score: 2 },
    shani: { prediction: "शनि दशा में कर्म और अनुशासन का महत्व", score: 0 },
    shukra: { prediction: "शुक्र दशा में कला और प्रेम का योग", score: 1 },
    surya: { prediction: "सूर्य दशा में नेतृत्व और यश की प्राप्ति", score: 1 },
    chandra: { prediction: "चंद्र दशा में मानसिक शांति और खुशी", score: 1 }
  };
  
  return effects[planet] || { prediction: "ग्रह दशा का मिश्रित प्रभाव", score: 0 };
}

function getPlanetSpecificRemedies(planet) {
  const remedies = {
    shani: ["शनि मंत्र जाप", "काले तिल का दान", "शनिवार व्रत"],
    guru: ["गुरु मंत्र जाप", "पीले वस्त्र दान", "गुरुवार व्रत"],
    shukra: ["शुक्र मंत्र जाप", "सफेद वस्त्र दान", "शुक्रवार व्रत"],
    mangal: ["मंगल मंत्र जाप", "लाल मसूर दान", "मंगलवार व्रत"]
  };
  
  return remedies[planet] || ["सामान्य मंत्र जाप", "दान-पुण्य"];
}

/**
 * For users without birth data, create simplified personalized system
 */
export function generateEnhancedGeneralHoroscope(raashi, date = new Date()) {
  const currentPlanets = getCurrentPlanetaryPositions(date);
  const panchang = getPanchang(date);
  
  // Enhanced algorithm using actual planetary positions
  const signNumber = getSignNumber(raashi);
  const dayOfYear = getDayOfYear(date);
  
  // Use actual planetary positions for scoring
  const jupiterInfluence = calculateGeneralPlanetInfluence('guru', currentPlanets.guru, signNumber);
  const saturnInfluence = calculateGeneralPlanetInfluence('shani', currentPlanets.shani, signNumber);
  const marsInfluence = calculateGeneralPlanetInfluence('mangal', currentPlanets.mangal, signNumber);
  
  const loveScore = (jupiterInfluence + getDayOfYear(date) + signNumber) % 3;
  const careerScore = (saturnInfluence + marsInfluence + signNumber) % 3;
  const healthScore = (marsInfluence + dayOfYear + signNumber) % 3;
  const financeScore = (jupiterInfluence + saturnInfluence + signNumber) % 3;
  
  return {
    enhancedPredictions: true,
    planetaryInfluences: {
      jupiter: jupiterInfluence,
      saturn: saturnInfluence,
      mars: marsInfluence
    },
    scores: { loveScore, careerScore, healthScore, financeScore }
  };
}

function calculateGeneralPlanetInfluence(planet, planetData, signNumber) {
  // Simple influence calculation based on sign compatibility
  const planetSignNumber = getSignNumber(planetData.sign);
  const distance = Math.abs(planetSignNumber - signNumber);
  
  // Closer signs have more influence
  if (distance <= 1 || distance >= 11) return 2; // Same or adjacent signs
  if (distance <= 4 || distance >= 8) return 1;  // Trine or sextile-like
  return 0; // Neutral
}
