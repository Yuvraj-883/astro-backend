// ../src/services/realVedicCalculations.js

/**
 * Real Vedic Astrology Calculations
 * Uses actual planetary positions, transits, and traditional Vedic principles
 */

import { getCurrentPlanetaryPositions, getPanchang, getCurrentNakshatra } from './vedicCalculations.js';

// Planetary lordships for each sign
const signLords = {
  mesh: 'mangal',      // Aries - Mars
  vrishabh: 'shukra',  // Taurus - Venus  
  mithun: 'budh',      // Gemini - Mercury
  kark: 'chandra',     // Cancer - Moon
  simha: 'surya',      // Leo - Sun
  kanya: 'budh',       // Virgo - Mercury
  tula: 'shukra',      // Libra - Venus
  vrishchik: 'mangal', // Scorpio - Mars
  dhanu: 'guru',       // Sagittarius - Jupiter
  makar: 'shani',      // Capricorn - Saturn
  kumbh: 'shani',      // Aquarius - Saturn
  meen: 'guru'         // Pisces - Jupiter
};

// Planetary relationships (friends/enemies/neutral)
const planetaryRelationships = {
  surya: { friends: ['mangal', 'guru', 'chandra'], enemies: ['shukra', 'shani'], neutral: ['budh'] },
  chandra: { friends: ['surya', 'budh'], enemies: ['rahul', 'ketu'], neutral: ['mangal', 'guru', 'shukra', 'shani'] },
  mangal: { friends: ['surya', 'chandra', 'guru'], enemies: ['budh'], neutral: ['shukra', 'shani'] },
  budh: { friends: ['surya', 'shukra'], enemies: ['chandra'], neutral: ['mangal', 'guru', 'shani'] },
  guru: { friends: ['surya', 'chandra', 'mangal'], enemies: ['budh', 'shukra'], neutral: ['shani'] },
  shukra: { friends: ['budh', 'shani'], enemies: ['surya', 'chandra'], neutral: ['mangal', 'guru'] },
  shani: { friends: ['budh', 'shukra'], enemies: ['surya', 'chandra', 'mangal'], neutral: ['guru'] }
};

// Planetary exaltation and debilitation signs
const planetaryStrength = {
  surya: { exaltation: 'mesh', debilitation: 'tula', ownSign: ['simha'] },
  chandra: { exaltation: 'vrishabh', debilitation: 'vrishchik', ownSign: ['kark'] },
  mangal: { exaltation: 'makar', debilitation: 'kark', ownSign: ['mesh', 'vrishchik'] },
  budh: { exaltation: 'kanya', debilitation: 'meen', ownSign: ['mithun', 'kanya'] },
  guru: { exaltation: 'kark', debilitation: 'makar', ownSign: ['dhanu', 'meen'] },
  shukra: { exaltation: 'meen', debilitation: 'kanya', ownSign: ['vrishabh', 'tula'] },
  shani: { exaltation: 'tula', debilitation: 'mesh', ownSign: ['makar', 'kumbh'] }
};

/**
 * Generate daily horoscope based on real Vedic calculations
 */
export function generateRealVedicHoroscope(raashi, date = new Date()) {
  // Get current planetary positions
  const planetaryPositions = getCurrentPlanetaryPositions(date);
  const panchang = getPanchang(date);
  const currentNakshatra = getCurrentNakshatra(date);
  
  // Analyze planetary influences for the sign
  const signLord = signLords[raashi.toLowerCase()];
  const signAnalysis = analyzeSignInfluences(raashi, planetaryPositions, date);
  
  // Calculate transits affecting the sign
  const transits = calculateDailyTransits(raashi, planetaryPositions);
  
  // Generate predictions based on real calculations
  const predictions = generateVedicPredictions(signAnalysis, transits, panchang);
  
  // Get personalized remedies based on planetary positions
  const remedies = getVedicRemedies(signAnalysis, transits);
  
  return {
    date: date.toLocaleDateString('hi-IN'),
    raashi: raashi,
    signLord: signLord,
    currentPanchang: panchang,
    currentNakshatra: currentNakshatra,
    planetaryInfluences: signAnalysis,
    majorTransits: transits,
    predictions: predictions,
    remedies: remedies,
    auspiciousTiming: getAuspiciousTiming(panchang, signAnalysis),
    warnings: getVedicWarnings(transits, panchang)
  };
}

/**
 * Analyze current planetary influences on a specific sign
 */
function analyzeSignInfluences(raashi, planetaryPositions, date) {
  const signLord = signLords[raashi.toLowerCase()];
  const analysis = {
    signLord: signLord,
    lordPosition: null,
    lordStrength: 'neutral',
    beneficPlanets: [],
    maleficPlanets: [],
    aspectingPlanets: [],
    overallStrength: 0
  };

  // Find where the sign lord is currently positioned
  Object.keys(planetaryPositions).forEach(planet => {
    const planetSign = planetaryPositions[planet].sign;
    
    if (planet === signLord) {
      analysis.lordPosition = planetSign;
      analysis.lordStrength = calculatePlanetaryStrength(planet, planetSign);
    }
    
    // Check if planets are aspecting this sign
    if (isAspecting(planetSign, raashi)) {
      analysis.aspectingPlanets.push({
        planet: planet,
        aspect: getAspectType(planetSign, raashi),
        influence: getPlanetaryNature(planet)
      });
    }
    
    // Classify as benefic or malefic for this sign
    if (isBeneficForSign(planet, raashi, planetSign)) {
      analysis.beneficPlanets.push(planet);
      analysis.overallStrength += 1;
    } else if (isMaleficForSign(planet, raashi, planetSign)) {
      analysis.maleficPlanets.push(planet);
      analysis.overallStrength -= 1;
    }
  });

  return analysis;
}

/**
 * Calculate major transits affecting the sign today
 */
function calculateDailyTransits(raashi, planetaryPositions) {
  const transits = {
    major: [],
    minor: [],
    rahu_ketu: null,
    saturn: null,
    jupiter: null
  };

  Object.keys(planetaryPositions).forEach(planet => {
    const planetData = planetaryPositions[planet];
    const transitType = getTransitType(planet, planetData.sign, raashi);
    
    if (transitType.significance === 'major') {
      transits.major.push({
        planet: planet,
        currentSign: planetData.sign,
        effect: transitType.effect,
        duration: transitType.duration,
        intensity: transitType.intensity
      });
    }
    
    // Special handling for slow-moving planets
    if (planet === 'shani') {
      transits.saturn = {
        sign: planetData.sign,
        effect: getSaturnTransitEffect(planetData.sign, raashi),
        phase: getSaturnPhase(planetData.sign, raashi)
      };
    }
    
    if (planet === 'guru') {
      transits.jupiter = {
        sign: planetData.sign,
        effect: getJupiterTransitEffect(planetData.sign, raashi),
        blessing: getJupiterBlessing(planetData.sign, raashi)
      };
    }
  });

  return transits;
}

/**
 * Generate Vedic predictions based on real calculations
 */
function generateVedicPredictions(signAnalysis, transits, panchang) {
  const predictions = {
    overall: '',
    love: '',
    career: '',
    health: '',
    finance: '',
    spirituality: ''
  };

  // Overall prediction based on sign lord strength
  if (signAnalysis.lordStrength === 'strong') {
    predictions.overall = `आज ${signAnalysis.signLord} ग्रह की शुभ स्थिति के कारण आपका दिन उत्तम रहेगा। सभी कार्यों में सफलता मिलेगी।`;
  } else if (signAnalysis.lordStrength === 'weak') {
    predictions.overall = `${signAnalysis.signLord} ग्रह की कमजोर स्थिति के कारण आज धैर्य रखना आवश्यक है। सावधानी से काम लें।`;
  } else {
    predictions.overall = `आज मिश्रित फल की स्थिति है। ${signAnalysis.signLord} ग्रह सामान्य प्रभाव दे रहा है।`;
  }

  // Love predictions based on Venus and Moon positions
  predictions.love = generateLovePrediction(signAnalysis, transits);
  
  // Career predictions based on Saturn and Jupiter
  predictions.career = generateCareerPrediction(signAnalysis, transits);
  
  // Health predictions based on Mars and Sun
  predictions.health = generateHealthPrediction(signAnalysis, transits);
  
  // Finance predictions based on Mercury and Jupiter
  predictions.finance = generateFinancePrediction(signAnalysis, transits);
  
  // Spiritual guidance based on current nakshatra
  predictions.spirituality = generateSpiritualGuidance(panchang);

  return predictions;
}

/**
 * Helper functions for specific life areas
 */
function generateLovePrediction(signAnalysis, transits) {
  const venusTransit = transits.major.find(t => t.planet === 'shukra');
  
  if (venusTransit && venusTransit.effect === 'beneficial') {
    return "शुक्र ग्रह की शुभ स्थिति से प्रेम जीवन में खुशियां आएंगी। नए रिश्ते बन सकते हैं।";
  } else if (signAnalysis.maleficPlanets.includes('shukra')) {
    return "प्रेम मामलों में धैर्य रखें। गलतफहमियों से बचें और संयम बरतें।";
  }
  return "प्रेम जीवन में सामान्य स्थिति रहेगी। पार्टनर के साथ समझदारी से पेश आएं।";
}

function generateCareerPrediction(signAnalysis, transits) {
  const saturnTransit = transits.saturn;
  const jupiterTransit = transits.jupiter;
  
  if (saturnTransit && saturnTransit.effect === 'growth') {
    return "शनि ग्रह की स्थिति करियर में प्रगति दिला सकती है। मेहनत का फल मिलेगा।";
  } else if (jupiterTransit && jupiterTransit.blessing === 'high') {
    return "गुरु ग्रह का आशीर्वाद करियर में नई ऊंचाइयां दिलाएगा। नए अवसर मिलेंगे।";
  }
  return "करियर में स्थिर प्रगति होगी। लक्ष्य पर ध्यान केंद्रित रखें।";
}

function generateHealthPrediction(signAnalysis, transits) {
  const marsTransit = transits.major.find(t => t.planet === 'mangal');
  
  if (marsTransit && marsTransit.effect === 'challenging') {
    return "स्वास्थ्य का विशेष ध्यान रखें। मंगल ग्रह की स्थिति दुर्घटनाओं से बचने की सलाह देती है।";
  } else if (signAnalysis.beneficPlanets.includes('surya')) {
    return "सूर्य ग्रह की कृपा से स्वास्थ्य अच्छा रहेगा। ऊर्जा का स्तर बेहतर होगा।";
  }
  return "स्वास्थ्य सामान्यतः ठीक रहेगा। योग और प्राणायाम करें।";
}

function generateFinancePrediction(signAnalysis, transits) {
  const mercuryTransit = transits.major.find(t => t.planet === 'budh');
  
  if (signAnalysis.beneficPlanets.includes('guru')) {
    return "गुरु ग्रह की कृपा से धन लाभ के योग हैं। निवेश के अवसर मिल सकते हैं।";
  } else if (mercuryTransit && mercuryTransit.effect === 'beneficial') {
    return "बुध ग्रह की स्थिति व्यापार और वित्तीय लेन-देन में सफलता दिलाएगी।";
  }
  return "वित्तीय मामलों में संयम बरतें। अनावश्यक खर्च से बचें।";
}

function generateSpiritualGuidance(panchang) {
  if (panchang.nakshatra && panchang.nakshatra.guna === 'राजस') {
    return "आज राजसिक नक्षत्र में आध्यात्मिक साधना का विशेष महत्व है। मंत्र जाप करें।";
  }
  return "आध्यात्मिक गतिविधियों के लिए शुभ दिन है। ध्यान और पूजा का समय निकालें।";
}

/**
 * Get Vedic remedies based on planetary analysis
 */
function getVedicRemedies(signAnalysis, transits) {
  const remedies = {
    immediate: [],
    weekly: [],
    gemstone: '',
    mantra: '',
    donation: '',
    fasting: ''
  };

  // Remedies based on weak sign lord
  if (signAnalysis.lordStrength === 'weak') {
    const lordRemedies = getLordSpecificRemedies(signAnalysis.signLord);
    remedies.immediate.push(...lordRemedies.immediate);
    remedies.mantra = lordRemedies.mantra;
    remedies.gemstone = lordRemedies.gemstone;
  }

  // Remedies for malefic transits
  transits.major.forEach(transit => {
    if (transit.effect === 'challenging') {
      const transitRemedies = getTransitRemedies(transit.planet);
      remedies.weekly.push(...transitRemedies);
    }
  });

  // Saturn specific remedies
  if (transits.saturn && transits.saturn.effect === 'difficult') {
    remedies.immediate.push("शनिवार को शनि देव की पूजा करें");
    remedies.donation = "काले तिल और लोहे का दान करें";
    remedies.fasting = "शनिवार का उपवास रखें";
  }

  return remedies;
}

/**
 * Helper functions for planetary strength and relationships
 */
function calculatePlanetaryStrength(planet, currentSign) {
  const strength = planetaryStrength[planet];
  if (!strength) return 'neutral';
  
  if (strength.exaltation === currentSign) return 'strong';
  if (strength.debilitation === currentSign) return 'weak';
  if (strength.ownSign.includes(currentSign)) return 'strong';
  
  return 'neutral';
}

function isAspecting(fromSign, toSign) {
  // Simplified aspect calculation - in real implementation, use degrees
  const signOrder = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];
  const fromIndex = signOrder.indexOf(fromSign);
  const toIndex = signOrder.indexOf(toSign);
  const difference = Math.abs(fromIndex - toIndex);
  
  // Traditional aspects: 1st, 4th, 7th, 8th, 9th houses
  return [0, 3, 6, 7, 8].includes(difference) || [0, 3, 6, 7, 8].includes(12 - difference);
}

function getTransitType(planet, currentSign, targetSign) {
  // Determine significance and effect of transit
  const slowPlanets = ['shani', 'guru', 'rahu', 'ketu'];
  const significance = slowPlanets.includes(planet) ? 'major' : 'minor';
  
  const signOrder = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];
  const currentIndex = signOrder.indexOf(currentSign);
  const targetIndex = signOrder.indexOf(targetSign);
  const house = ((currentIndex - targetIndex + 12) % 12) + 1;
  
  let effect = 'neutral';
  let intensity = 'medium';
  let duration = significance === 'major' ? 'long-term' : 'short-term';
  
  // Benefic houses: 1, 5, 9, 11
  if ([1, 5, 9, 11].includes(house)) {
    effect = 'beneficial';
    intensity = 'high';
  }
  // Challenging houses: 6, 8, 12
  else if ([6, 8, 12].includes(house)) {
    effect = 'challenging';
    intensity = 'high';
  }
  
  return { significance, effect, intensity, duration };
}

function getLordSpecificRemedies(lord) {
  const remedies = {
    surya: {
      immediate: ["सूर्योदय के समय सूर्य को जल अर्पित करें", "लाल रंग के वस्त्र धारण करें"],
      mantra: "ॐ घृणि सूर्याय नमः",
      gemstone: "माणिक्य"
    },
    chandra: {
      immediate: ["सोमवार को दूध का दान करें", "सफेद रंग का प्रयोग करें"],
      mantra: "ॐ सोम सोमाय नमः",
      gemstone: "मोती"
    },
    mangal: {
      immediate: ["मंगलवार को हनुमान जी की पूजा करें", "लाल मूंगा धारण करें"],
      mantra: "ॐ अं अनगाराय नमः",
      gemstone: "मूंगा"
    },
    budh: {
      immediate: ["बुधवार को हरे वस्त्र पहनें", "विद्यार्थियों की सहायता करें"],
      mantra: "ॐ बुं बुधाय नमः",
      gemstone: "पन्ना"
    },
    guru: {
      immediate: ["गुरुवार को गुरु की पूजा करें", "पीले वस्त्र धारण करें"],
      mantra: "ॐ बृहस्पतये नमः",
      gemstone: "पुखराज"
    },
    shukra: {
      immediate: ["शुक्रवार को लक्ष्मी मां की पूजा करें", "सफेद फूल चढ़ाएं"],
      mantra: "ॐ शुं शुक्राय नमः",
      gemstone: "हीरा"
    },
    shani: {
      immediate: ["शनिवार को शनि देव की पूजा करें", "काले तिल का दान करें"],
      mantra: "ॐ शं शनैश्चराय नमः",
      gemstone: "नीलम"
    }
  };
  
  return remedies[lord] || remedies.surya;
}

export { generateRealVedicHoroscope, analyzeSignInfluences, calculateDailyTransits };
