// ../src/services/dailyHoroscope.js

/**
 * Daily Horoscope Service for Vedic Astrology
 * Provides personalized daily predictions based on Raashi, planetary transits, and Panchang
 */

import { calculateLunarDay, getPanchang, getCurrentPlanetaryPositions } from './vedicCalculations.js';

// Vedic Zodiac Signs with Sanskrit names
export const vedicSigns = {
  mesh: {
    name: "Mesh (Aries)",
    element: "Agni",
    lord: "Mangal",
    nature: "Chara",
    emoji: "♈",
    lucky_numbers: [1, 8, 17],
    lucky_colors: ["लाल", "नारंगी"],
    gemstone: "मूंगा"
  },
  vrishabh: {
    name: "Vrishabh (Taurus)", 
    element: "Prithvi",
    lord: "Shukra",
    nature: "Sthira",
    emoji: "♉",
    lucky_numbers: [2, 6, 9],
    lucky_colors: ["हरा", "गुलाबी"],
    gemstone: "हीरा"
  },
  mithun: {
    name: "Mithun (Gemini)",
    element: "Vayu", 
    lord: "Budh",
    nature: "Dwiswa",
    emoji: "♊",
    lucky_numbers: [5, 14, 23],
    lucky_colors: ["पीला", "हल्का हरा"],
    gemstone: "पन्ना"
  },
  kark: {
    name: "Kark (Cancer)",
    element: "Jal",
    lord: "Chandra",
    nature: "Chara", 
    emoji: "♋",
    lucky_numbers: [2, 7, 16],
    lucky_colors: ["सफ़ेद", "चांदी"],
    gemstone: "मोती"
  },
  simha: {
    name: "Simha (Leo)",
    element: "Agni",
    lord: "Surya", 
    nature: "Sthira",
    emoji: "♌",
    lucky_numbers: [1, 4, 13],
    lucky_colors: ["सुनहरा", "नारंगी"],
    gemstone: "माणिक"
  },
  kanya: {
    name: "Kanya (Virgo)",
    element: "Prithvi",
    lord: "Budh",
    nature: "Dwiswa",
    emoji: "♍", 
    lucky_numbers: [6, 15, 24],
    lucky_colors: ["हरा", "भूरा"],
    gemstone: "पन्ना"
  },
  tula: {
    name: "Tula (Libra)",
    element: "Vayu",
    lord: "Shukra",
    nature: "Chara",
    emoji: "♎",
    lucky_numbers: [6, 15, 24],
    lucky_colors: ["नीला", "गुलाबी"], 
    gemstone: "हीरा"
  },
  vrishchik: {
    name: "Vrishchik (Scorpio)",
    element: "Jal",
    lord: "Mangal",
    nature: "Sthira", 
    emoji: "♏",
    lucky_numbers: [4, 13, 22],
    lucky_colors: ["लाल", "गहरा लाल"],
    gemstone: "मूंगा"
  },
  dhanu: {
    name: "Dhanu (Sagittarius)",
    element: "Agni", 
    lord: "Guru",
    nature: "Dwiswa",
    emoji: "♐",
    lucky_numbers: [3, 12, 21],
    lucky_colors: ["पीला", "नारंगी"],
    gemstone: "पुखराज"
  },
  makar: {
    name: "Makar (Capricorn)",
    element: "Prithvi",
    lord: "Shani",
    nature: "Chara",
    emoji: "♑",
    lucky_numbers: [8, 17, 26],
    lucky_colors: ["काला", "गहरा नीला"],
    gemstone: "नीलम"
  },
  kumbh: {
    name: "Kumbh (Aquarius)",
    element: "Vayu",
    lord: "Shani", 
    nature: "Sthira",
    emoji: "♒",
    lucky_numbers: [4, 13, 22],
    lucky_colors: ["नीला", "बैंगनी"],
    gemstone: "नीलम"
  },
  meen: {
    name: "Meen (Pisces)",
    element: "Jal",
    lord: "Guru",
    nature: "Dwiswa",
    emoji: "♓",
    lucky_numbers: [3, 9, 12],
    lucky_colors: ["समुद्री हरा", "पीला"],
    gemstone: "पुखराज"
  }
};

// Daily horoscope predictions based on planetary combinations
const horoscopePredictions = {
  love: {
    excellent: [
      "आज प्रेम के मामले में आपका दिन शानदार रहेगा! शुक्र आपके साथ है 💕",
      "आपके रिश्ते में मिठास आएगी, नया प्रेम मिल सकता है ✨",
      "प्रेमी से मुलाकात हो सकती है, रोमांस का माहौल रहेगा 🌹"
    ],
    good: [
      "प्रेम जीवन में सामान्य खुशी रहेगी, छोटी-मोटी परेशानी हो सकती है",
      "पार्टनर के साथ समझदारी से बात करें, मतभेद दूर होंगे",
      "पुराने रिश्ते में सुधार के आसार दिख रहे हैं"
    ],
    average: [
      "प्रेम मामलों में धैर्य रखें, जल्दबाजी न करें",
      "किसी बात को लेकर पार्टनर से बहस हो सकती है",
      "अपनी भावनाओं को control में रखना जरूरी है"
    ]
  },
  career: {
    excellent: [
      "करियर में बड़ी सफलता मिल सकती है! गुरु ग्रह आपके साथ है 🚀",
      "नई नौकरी या प्रमोशन के योग बन रहे हैं",
      "व्यापार में अच्छा मुनाफा होगा, निवेश करने का अच्छा समय"
    ],
    good: [
      "कार्यक्षेत्र में मेहनत का फल मिलेगा",
      "सहकर्मियों का साथ मिलेगा, टीम वर्क अच्छा रहेगा",
      "नए प्रोजेक्ट की शुरुआत हो सकती है"
    ],
    average: [
      "काम में थोड़ी परेशानी हो सकती है, धैर्य रखें",
      "बॉस से बचकर रहें, कोई गलती न करें",
      "फाइनेंशियल मामलों में सावधानी बरतें"
    ]
  },
  health: {
    excellent: [
      "स्वास्थ्य बेहतरीन रहेगा! ऊर्जा से भरपूर दिन होगा 💪",
      "योग और meditation का फायदा दिखेगा",
      "पुरानी बीमारी से राहत मिल सकती है"
    ],
    good: [
      "सामान्यतः स्वास्थ्य ठीक रहेगा",
      "हल्की-फुल्की exercise करना फायदेमंद होगा",
      "खानपान पर ध्यान दें, संतुलित आहार लें"
    ],
    average: [
      "स्वास्थ्य का खास ख्याल रखें, लापरवाही न बरतें",
      "सिरदर्द या पेट की तकलीफ हो सकती है",
      "ज्यादा मेहनत से बचें, आराम करें"
    ]
  },
  finance: {
    excellent: [
      "धन लाभ के योग हैं! लक्ष्मी जी की कृपा रहेगी 💰",
      "निवेश करने का शुभ मुहूर्त है",
      "पुराना पैसा वापस मिल सकता है"
    ],
    good: [
      "आर्थिक स्थिति में सुधार होगा",
      "छोटा-मोटा फायदा हो सकता है",
      "खर्च control में रहेगा"
    ],
    average: [
      "पैसे के मामले में सावधानी बरतें",
      "फिजूलखर्ची से बचें",
      "किसी को पैसे उधार न दें"
    ]
  }
};

// Remedies based on weak planets
const dailyRemedies = {
  surya: [
    "सूर्योदय के समय सूर्य को जल अर्पित करें",
    "लाल रंग के वस्त्र पहनें",
    "रविवार को सूर्य मंत्र का जाप करें"
  ],
  chandra: [
    "सोमवार को भगवान शिव की पूजा करें",
    "सफेद रंग का उपयोग करें",
    "दूध का दान करें"
  ],
  mangal: [
    "मंगलवार को हनुमान जी की पूजा करें",
    "लाल फूल चढ़ाएं",
    "मूंगा धारण करें"
  ],
  budh: [
    "बुधवार को गणेश जी की पूजा करें",
    "हरे रंग का प्रयोग करें",
    "विद्यार्थियों की मदद करें"
  ],
  guru: [
    "गुरुवार को गुरु की पूजा करें",
    "पीले वस्त्र धारण करें",
    "ब्राह्मणों को भोजन कराएं"
  ],
  shukra: [
    "शुक्रवार को लक्ष्मी मां की पूजा करें",
    "सफेद या गुलाबी वस्त्र पहनें",
    "चांदी का आभूषण धारण करें"
  ],
  shani: [
    "शनिवार को शनि देव की पूजा करें",
    "काले तिल का दान करें",
    "नीले रंग का प्रयोग करें"
  ]
};

/**
 * Generate daily horoscope for a specific Raashi using REAL Vedic calculations
 */
export function generateDailyHoroscope(raashi, date = new Date()) {
  const signInfo = vedicSigns[raashi.toLowerCase()];
  if (!signInfo) {
    throw new Error("Invalid Raashi provided");
  }

  // Use REAL Vedic calculations instead of simple math
  const panchang = getPanchang(date);
  const planetaryPositions = getCurrentPlanetaryPositions(date);
  const currentNakshatra = getCurrentNakshatra(date);
  
  // Analyze real planetary influences for the sign
  const signLord = getSignLord(raashi);
  const signAnalysis = analyzeRealSignInfluences(raashi, planetaryPositions);
  const transits = calculateRealTransits(raashi, planetaryPositions);
  
  // Generate predictions based on actual planetary positions and Vedic principles
  const predictions = generateRealVedicPredictions(signInfo, signAnalysis, transits, panchang);
  
  // Get real remedies based on current planetary positions
  const todayRemedies = getRealVedicRemedies(signAnalysis, transits, panchang);
  
  // Lucky elements based on current planetary strengths
  const luckyElements = getRealLuckyElements(signInfo, planetaryPositions, date);

  return {
    date: date.toLocaleDateString('hi-IN'),
    weekday: date.toLocaleDateString('hi-IN', { weekday: 'long' }),
    raashi: signInfo.name,
    emoji: signInfo.emoji,
    signLord: signLord,
    panchang: {
      tithi: panchang.tithi,
      nakshatra: panchang.nakshatra,
      yoga: panchang.yoga,
      karana: panchang.karana
    },
    planetaryInfluences: {
      signLordPosition: planetaryPositions[signLord]?.sign,
      signLordStrength: signAnalysis.lordStrength,
      beneficPlanets: signAnalysis.beneficPlanets,
      maleficPlanets: signAnalysis.maleficPlanets,
      majorTransits: transits.major
    },
    predictions: {
      overall: predictions.overall,
      love: predictions.love,
      career: predictions.career,
      health: predictions.health,
      finance: predictions.finance
    },
    luckyElements: luckyElements,
    remedies: todayRemedies,
    mantra: getSignMantra(raashi),
    auspiciousTime: getAuspiciousTime(date),
    warning: getRealVedicWarning(transits, panchang),
    accuracy: "Enhanced - Based on real planetary positions",
    calculationMethod: "Vedic Sidereal Zodiac with Ayanamsa correction"
  };
}

/**
 * Get sign lord planet
 */
function getSignLord(raashi) {
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
  return signLords[raashi.toLowerCase()];
}

/**
 * Analyze real planetary influences on the sign
 */
function analyzeRealSignInfluences(raashi, planetaryPositions) {
  const signLord = getSignLord(raashi);
  const lordPosition = planetaryPositions[signLord];
  
  const analysis = {
    lordStrength: calculateRealPlanetaryStrength(signLord, lordPosition),
    beneficPlanets: [],
    maleficPlanets: [],
    aspectingPlanets: [],
    overallEnergy: 0
  };

  // Analyze each planet's influence on this sign
  Object.keys(planetaryPositions).forEach(planet => {
    const planetData = planetaryPositions[planet];
    const influence = calculatePlanetaryInfluence(planet, planetData, raashi);
    
    if (influence > 0) {
      analysis.beneficPlanets.push({
        planet: planet,
        strength: influence,
        position: planetData.sign,
        effect: getPlanetaryEffect(planet, influence)
      });
      analysis.overallEnergy += influence;
    } else if (influence < 0) {
      analysis.maleficPlanets.push({
        planet: planet,
        strength: Math.abs(influence),
        position: planetData.sign,
        challenge: getPlanetaryChallenge(planet, Math.abs(influence))
      });
      analysis.overallEnergy += influence;
    }
  });

  return analysis;
}

/**
 * Calculate real transits affecting the sign
 */
function calculateRealTransits(raashi, planetaryPositions) {
  const transits = {
    major: [],
    daily: [],
    aspectual: []
  };

  const signOrder = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 
                    'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];
  const raashiIndex = signOrder.indexOf(raashi.toLowerCase());

  Object.keys(planetaryPositions).forEach(planet => {
    const planetData = planetaryPositions[planet];
    const planetSignIndex = signOrder.indexOf(planetData.sign);
    const housePosition = ((planetSignIndex - raashiIndex + 12) % 12) + 1;
    
    const transitEffect = getTransitEffect(planet, housePosition, planetData);
    
    if (transitEffect.significance === 'major') {
      transits.major.push({
        planet: planet,
        house: housePosition,
        effect: transitEffect.effect,
        intensity: transitEffect.intensity,
        isRetrograde: planetData.isRetrograde
      });
    }
  });

  return transits;
}

/**
 * Generate predictions based on real Vedic analysis
 */
function generateRealVedicPredictions(signInfo, signAnalysis, transits, panchang) {
  const predictions = {
    overall: generateOverallPrediction(signAnalysis, panchang),
    love: generateLovePredictionReal(signAnalysis, transits),
    career: generateCareerPredictionReal(signAnalysis, transits),
    health: generateHealthPredictionReal(signAnalysis, transits),
    finance: generateFinancePredictionReal(signAnalysis, transits)
  };

  return predictions;
}

/**
 * Real prediction generators based on planetary analysis
 */
function generateOverallPrediction(signAnalysis, panchang) {
  if (signAnalysis.overallEnergy > 2) {
    return `आज ${panchang.nakshatra.name} नक्षत्र में ग्रहों की शुभ स्थिति से आपका दिन उत्तम रहेगा। सभी कार्यों में सफलता मिलेगी।`;
  } else if (signAnalysis.overallEnergy < -1) {
    return `आज ग्रहों की चुनौतीपूर्ण स्थिति के कारण धैर्य और सावधानी की आवश्यकता है। ${panchang.nakshatra.name} नक्षत्र में संयम बरतें।`;
  } else {
    return `आज मिश्रित फल की स्थिति है। ${panchang.nakshatra.name} नक्षत्र में संतुलित दृष्टिकोण रखें।`;
  }
}

function generateLovePredictionReal(signAnalysis, transits) {
  const venusInfluence = signAnalysis.beneficPlanets.find(p => p.planet === 'shukra');
  const venusTransit = transits.major.find(t => t.planet === 'shukra');
  
  if (venusInfluence || (venusTransit && [1, 5, 7, 11].includes(venusTransit.house))) {
    return "शुक्र ग्रह की अनुकूल स्थिति से प्रेम जीवन में खुशियां आएंगी। रोमांस का माहौल रहेगा।";
  } else if (transits.major.some(t => t.planet === 'mangal' && [6, 8, 12].includes(t.house))) {
    return "प्रेम मामलों में मंगल ग्रह के प्रभाव से थोड़ी सावधानी बरतें। गुस्से पर काबू रखें।";
  }
  return "प्रेम जीवन में सामान्य स्थिति रहेगी। पार्टनर के साथ समझदारी दिखाएं।";
}

function generateCareerPredictionReal(signAnalysis, transits) {
  const saturnTransit = transits.major.find(t => t.planet === 'shani');
  const jupiterTransit = transits.major.find(t => t.planet === 'guru');
  
  if (jupiterTransit && [1, 5, 9, 10, 11].includes(jupiterTransit.house)) {
    return "गुरु ग्रह की शुभ स्थिति करियर में प्रगति के अवसर लेकर आएगी। नई जिम्मेदारियां मिल सकती हैं।";
  } else if (saturnTransit && [6, 10, 11].includes(saturnTransit.house)) {
    return "शनि ग्रह की स्थिति मेहनत का फल दिलाएगी। धैर्य के साथ काम करें।";
  }
  return "करियर में स्थिर प्रगति होगी। अपने लक्ष्यों पर फोकस बनाए रखें।";
}

function generateHealthPredictionReal(signAnalysis, transits) {
  const marsTransit = transits.major.find(t => t.planet === 'mangal');
  const sunInfluence = signAnalysis.beneficPlanets.find(p => p.planet === 'surya');
  
  if (marsTransit && [6, 8, 12].includes(marsTransit.house)) {
    return "मंगल ग्रह की स्थिति स्वास्थ्य में सावधानी की मांग करती है। दुर्घटनाओं से बचें।";
  } else if (sunInfluence) {
    return "सूर्य ग्रह की कृपा से स्वास्थ्य उत्तम रहेगा। ऊर्जा का स्तर बेहतर होगा।";
  }
  return "स्वास्थ्य सामान्यतः ठीक रहेगा। योग और व्यायाम को प्राथमिकता दें।";
}

function generateFinancePredictionReal(signAnalysis, transits) {
  const jupiterTransit = transits.major.find(t => t.planet === 'guru');
  const mercuryInfluence = signAnalysis.beneficPlanets.find(p => p.planet === 'budh');
  
  if (jupiterTransit && [2, 5, 9, 11].includes(jupiterTransit.house)) {
    return "गुरु ग्रह की कृपा से धन लाभ के योग हैं। निवेश के अच्छे अवसर मिल सकते हैं।";
  } else if (mercuryInfluence) {
    return "बुध ग्रह की अनुकूल स्थिति व्यापार और वित्तीय लेन-देन में सफलता दिलाएगी।";
  }
  return "वित्तीय मामलों में संयम बरतें। सोच-समझकर निवेश करें।";
}

/**
 * Helper functions for real calculations
 */
function calculateRealPlanetaryStrength(planet, planetData) {
  if (!planetData) return 'neutral';
  
  // Check exaltation/debilitation/own sign
  const planetaryDignity = {
    surya: { exaltation: 'mesh', debilitation: 'tula', ownSign: ['simha'] },
    chandra: { exaltation: 'vrishabh', debilitation: 'vrishchik', ownSign: ['kark'] },
    mangal: { exaltation: 'makar', debilitation: 'kark', ownSign: ['mesh', 'vrishchik'] },
    budh: { exaltation: 'kanya', debilitation: 'meen', ownSign: ['mithun', 'kanya'] },
    guru: { exaltation: 'kark', debilitation: 'makar', ownSign: ['dhanu', 'meen'] },
    shukra: { exaltation: 'meen', debilitation: 'kanya', ownSign: ['vrishabh', 'tula'] },
    shani: { exaltation: 'tula', debilitation: 'mesh', ownSign: ['makar', 'kumbh'] }
  };
  
  const dignity = planetaryDignity[planet];
  if (!dignity) return 'neutral';
  
  if (dignity.exaltation === planetData.sign) return 'strong';
  if (dignity.debilitation === planetData.sign) return 'weak';
  if (dignity.ownSign.includes(planetData.sign)) return 'strong';
  
  return 'neutral';
}

function calculatePlanetaryInfluence(planet, planetData, raashi) {
  // Calculate influence based on planetary friendship, house position, strength, etc.
  let influence = 0;
  
  // Basic planetary nature for each sign
  const planetaryNature = {
    surya: 1, chandra: 1, guru: 2, shukra: 1, budh: 0,
    mangal: -1, shani: -1, rahu: -2, ketu: -1
  };
  
  influence += planetaryNature[planet] || 0;
  
  // Adjust for planetary strength
  const strength = calculateRealPlanetaryStrength(planet, planetData);
  if (strength === 'strong') influence += 1;
  if (strength === 'weak') influence -= 1;
  
  // Adjust for retrograde motion
  if (planetData.isRetrograde && planet !== 'rahu' && planet !== 'ketu') {
    influence *= 0.7; // Reduce influence for retrograde planets
  }
  
  return influence;
}

function getTransitEffect(planet, housePosition, planetData) {
  const significantPlanets = ['guru', 'shani', 'rahu', 'ketu'];
  const significance = significantPlanets.includes(planet) ? 'major' : 'minor';
  
  let effect = 'neutral';
  let intensity = 'medium';
  
  // Benefic houses: 1, 3, 5, 9, 10, 11
  if ([1, 3, 5, 9, 10, 11].includes(housePosition)) {
    effect = 'beneficial';
    intensity = [1, 5, 9, 10].includes(housePosition) ? 'high' : 'medium';
  }
  // Challenging houses: 6, 8, 12
  else if ([6, 8, 12].includes(housePosition)) {
    effect = 'challenging';
    intensity = [8, 12].includes(housePosition) ? 'high' : 'medium';
  }
  
  return { significance, effect, intensity };
}

function getRealVedicRemedies(signAnalysis, transits, panchang) {
  const remedies = {
    planetary: [],
    general: [],
    today: [],
    gemstone: '',
    mantra: '',
    donation: ''
  };

  // Remedies based on weak sign lord
  if (signAnalysis.lordStrength === 'weak') {
    remedies.planetary.push("अपने राशि स्वामी ग्रह की पूजा करें");
    remedies.planetary.push("राशि स्वामी के अनुकूल रत्न धारण करें");
  }

  // Remedies for challenging transits
  signAnalysis.maleficPlanets.forEach(maleficPlanet => {
    const planetRemedies = getPlanetaryRemedies(maleficPlanet.planet);
    remedies.planetary.push(...planetRemedies);
  });

  // Today specific remedies based on nakshatra
  if (panchang.nakshatra.guna === 'तमस') {
    remedies.today.push("आज तामसिक नक्षत्र में आध्यात्मिक साधना करें");
    remedies.today.push("काले तिल का दान करें");
  }

  // General daily remedies
  remedies.general = [
    "सुबह उठकर सूर्य नमस्कार करें",
    `${panchang.nakshatra.name} नक्षत्र के देवता ${panchang.nakshatra.deity} की पूजा करें`,
    "गायत्री मंत्र का जाप करें"
  ];

  return remedies;
}

function getRealLuckyElements(signInfo, planetaryPositions, date) {
  return {
    numbers: signInfo.lucky_numbers,
    colors: signInfo.lucky_colors,
    direction: getAuspiciousDirection(date.getDay()),
    time: getAuspiciousTime(date),
    deity: getSignDeity(signInfo.lord),
    // Add planetary based lucky elements
    planetaryGems: getPlanetaryGems(planetaryPositions),
    favorablePlanets: Object.keys(planetaryPositions).filter(planet => 
      calculateRealPlanetaryStrength(planet, planetaryPositions[planet]) === 'strong'
    )
  };
}

function getRealVedicWarning(transits, panchang) {
  // Check for challenging transits
  const challengingTransits = transits.major.filter(t => t.effect === 'challenging');
  
  if (challengingTransits.length > 0) {
    const planet = challengingTransits[0].planet;
    return `आज ${planet} ग्रह की चुनौतीपूर्ण स्थिति के कारण ${getTransitWarning(planet)}`;
  }
  
  // Check for inauspicious time periods
  if (panchang.rahuKaal) {
    return `आज ${panchang.rahuKaal.time} राहु काल में कोई शुभ कार्य न करें`;
  }
  
  return "आज सामान्यतः शुभ दिन है, लेकिन सभी कार्य सोच-समझकर करें";
}

/**
 * Generate predictions for different life aspects
 */
function generatePredictions(raashi, date) {
  const dayOfWeek = date.getDay();
  const dateNum = date.getDate();
  
  // Simple algorithm based on day and raashi combination
  const loveScore = (dayOfWeek + dateNum + getSignNumber(raashi)) % 3;
  const careerScore = (dayOfWeek * 2 + dateNum + getSignNumber(raashi)) % 3;
  const healthScore = (dayOfWeek + dateNum * 2 + getSignNumber(raashi)) % 3;
  const financeScore = (dayOfWeek * 3 + dateNum + getSignNumber(raashi)) % 3;
  
  const levels = ['average', 'good', 'excellent'];
  
  return {
    overall: getOverallPrediction(loveScore, careerScore, healthScore, financeScore),
    love: getRandomPrediction(horoscopePredictions.love[levels[loveScore]]),
    career: getRandomPrediction(horoscopePredictions.career[levels[careerScore]]),
    health: getRandomPrediction(horoscopePredictions.health[levels[healthScore]]),
    finance: getRandomPrediction(horoscopePredictions.finance[levels[financeScore]])
  };
}

/**
 * Get overall prediction based on all aspects
 */
function getOverallPrediction(love, career, health, finance) {
  const average = (love + career + health + finance) / 4;
  
  if (average >= 2) {
    return "आज आपका दिन बहुत शुभ है! सभी क्षेत्रों में सफलता मिलेगी ✨";
  } else if (average >= 1) {
    return "आज का दिन मिश्रित फल देगा। कुछ क्षेत्रों में अच्छे परिणाम होंगे 🌟";
  } else {
    return "आज धैर्य और सावधानी से काम लें। हर काम सोच-समझकर करें 🙏";
  }
}

/**
 * Get daily remedies for specific raashi
 */
function getDailyRemedies(raashi, date) {
  const signInfo = vedicSigns[raashi.toLowerCase()];
  const lordPlanet = signInfo.lord.toLowerCase();
  
  const baseRemedies = dailyRemedies[lordPlanet] || dailyRemedies.surya;
  
  // Add general daily remedies
  const generalRemedies = [
    "सुबह उठकर सूर्य नमस्कार करें",
    "तुलसी के पत्ते का सेवन करें",
    "गायत्री मंत्र का जाप करें",
    "दान-पुण्य करें"
  ];
  
  return {
    planetary: baseRemedies,
    general: getRandomPrediction(generalRemedies, 2),
    gemstone: `${signInfo.gemstone} धारण करना शुभ रहेगा`,
    color: `आज ${signInfo.lucky_colors[0]} रंग पहनना फायदेमंद होगा`
  };
}

/**
 * Get lucky elements for the day
 */
function getLuckyElements(signInfo, date) {
  const dayOfWeek = date.getDay();
  
  return {
    numbers: signInfo.lucky_numbers,
    colors: signInfo.lucky_colors,
    direction: getAuspiciousDirection(dayOfWeek),
    time: getAuspiciousTime(date),
    deity: getAuspiciousDeity(signInfo.lord)
  };
}

/**
 * Get auspicious direction for the day
 */
function getAuspiciousDirection(dayOfWeek) {
  const directions = [
    "उत्तर", "उत्तर-पूर्व", "पूर्व", "दक्षिण-पूर्व", 
    "दक्षिण", "दक्षिण-पश्चिम", "पश्चिम"
  ];
  return directions[dayOfWeek];
}

/**
 * Get auspicious time for the day
 */
function getAuspiciousTime(date) {
  const hours = [
    "प्रातः 6-8 बजे", "सुबह 8-10 बजे", "दोपहर 12-2 बजे",
    "शाम 4-6 बजे", "सांय 6-8 बजे"
  ];
  return hours[date.getDay() % hours.length];
}

/**
 * Get deity for planetary lord
 */
function getAuspiciousDeity(lord) {
  const deities = {
    "Surya": "सूर्य देव",
    "Chandra": "चंद्र देव", 
    "Mangal": "हनुमान जी",
    "Budh": "गणेश जी",
    "Guru": "बृहस्पति देव",
    "Shukra": "लक्ष्मी मां",
    "Shani": "शनि देव"
  };
  return deities[lord] || "भगवान विष्णु";
}

/**
 * Get mantra for specific raashi
 */
function getSignMantra(raashi) {
  const mantras = {
    mesh: "ॐ अं अनगाराय नमः",
    vrishabh: "ॐ शुं शुक्राय नमः", 
    mithun: "ॐ बुं बुधाय नमः",
    kark: "ॐ सोम सोमाय नमः",
    simha: "ॐ घृणि सूर्याय नमः",
    kanya: "ॐ बुं बुधाय नमः",
    tula: "ॐ शुं शुक्राय नमः",
    vrishchik: "ॐ अं अनगाराय नमः", 
    dhanu: "ॐ बृहस्पतये नमः",
    makar: "ॐ शं शनैश्चराय नमः",
    kumbh: "ॐ शं शनैश्चराय नमः",
    meen: "ॐ बृहस्पतये नमः"
  };
  return mantras[raashi.toLowerCase()] || "ॐ नमो भगवते वासुदेवाय";
}

/**
 * Get warning for the day
 */
function getWarning(raashi, date) {
  const warnings = [
    "आज राहु काल में कोई नया काम शुरू न करें",
    "किसी से बहस-झगड़े से बचें",
    "यात्रा करते समय सावधानी बरतें",
    "स्वास्थ्य का खास ख्याल रखें",
    "पैसे के लेन-देन में सावधानी बरतें"
  ];
  
  const dayOfWeek = date.getDay();
  return warnings[dayOfWeek % warnings.length];
}

/**
 * Utility functions
 */
export function getSignNumber(raashi) {
  const signs = Object.keys(vedicSigns);
  return signs.indexOf(raashi.toLowerCase()) + 1;
}

function getRandomPrediction(predictions, count = 1) {
  if (count === 1) {
    return predictions[Math.floor(Math.random() * predictions.length)];
  } else {
    const shuffled = [...predictions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

/**
 * Get horoscope for all signs
 */
export function getAllSignsHoroscope(date = new Date()) {
  const allHoroscopes = {};
  
  Object.keys(vedicSigns).forEach(raashi => {
    allHoroscopes[raashi] = generateDailyHoroscope(raashi, date);
  });
  
  return allHoroscopes;
}

/**
 * Get weekly horoscope summary
 */
export function getWeeklyHoroscope(raashi, startDate = new Date()) {
  const weeklyPredictions = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    weeklyPredictions.push({
      day: date.toLocaleDateString('hi-IN', { weekday: 'long' }),
      date: date.toLocaleDateString('hi-IN'),
      prediction: generateDailyHoroscope(raashi, date)
    });
  }
  
  return {
    raashi: vedicSigns[raashi.toLowerCase()].name,
    weekStarting: startDate.toLocaleDateString('hi-IN'),
    predictions: weeklyPredictions
  };
}

// Additional helper functions for real Vedic calculations

function getPlanetaryEffect(planet, strength) {
  const effects = {
    surya: "आत्मविश्वास और नेतृत्व में वृद्धि",
    chandra: "मानसिक शांति और भावनात्मक संतुलन", 
    mangal: "साहस और ऊर्जा में वृद्धि",
    budh: "बुद्धि और संवाद कौशल में सुधार",
    guru: "ज्ञान और आध्यात्मिक विकास",
    shukra: "प्रेम और सुख-समृद्धि में वृद्धि",
    shani: "अनुशासन और कठोर परिश्रम का फल"
  };
  return effects[planet] || "सामान्य सकारात्मक प्रभाव";
}

function getPlanetaryChallenge(planet, strength) {
  const challenges = {
    surya: "अहंकार और क्रोध पर नियंत्रण रखें",
    chandra: "मूड स्विंग्स और भावनात्मक उतार-चढ़ाव से बचें",
    mangal: "गुस्से और आक्रामकता पर काबू रखें", 
    budh: "गलत संवाद और भ्रम से बचें",
    guru: "अति आत्मविश्वास से बचें",
    shukra: "अत्यधिक भोग-विलास से दूर रहें",
    shani: "निराशा और देरी का सामना करने को तैयार रहें"
  };
  return challenges[planet] || "सामान्य सावधानी बरतें";
}

function getPlanetaryRemedies(planet) {
  const remedies = {
    surya: ["सूर्य को जल अर्पित करें", "लाल रंग का प्रयोग करें"],
    chandra: ["सोमवार को दूध का दान करें", "चांदी धारण करें"],
    mangal: ["मंगलवार को हनुमान जी की पूजा करें", "लाल मूंगा धारण करें"],
    budh: ["हरे वस्त्र पहनें", "पन्ना धारण करें"],
    guru: ["गुरुवार को पीले वस्त्र पहनें", "पुखराज धारण करें"],
    shukra: ["शुक्रवार को गाय की सेवा करें", "हीरा या ओपल धारण करें"],
    shani: ["शनिवार को तेल का दान करें", "नीलम धारण करें"],
    rahu: ["राहु शांति यज्ञ कराएं", "गोमेद धारण करें"],
    ketu: ["केतु शांति पूजा करें", "लहसुनिया धारण करें"]
  };
  return remedies[planet] || ["सामान्य ग्रह शांति पूजा करें"];
}

function getSignDeity(lordPlanet) {
  const deities = {
    surya: "सूर्य देव",
    chandra: "चंद्र देव",
    mangal: "हनुमान जी",
    budh: "गणेश जी", 
    guru: "बृहस्पति देव",
    shukra: "लक्ष्मी मां",
    shani: "शनि देव"
  };
  return deities[lordPlanet] || "विष्णु भगवान";
}

function getPlanetaryGems(planetaryPositions) {
  const gems = [];
  Object.keys(planetaryPositions).forEach(planet => {
    const strength = calculateRealPlanetaryStrength(planet, planetaryPositions[planet]);
    if (strength === 'strong') {
      const planetGems = {
        surya: "माणिक्य",
        chandra: "मोती", 
        mangal: "मूंगा",
        budh: "पन्ना",
        guru: "पुखराज",
        shukra: "हीरा",
        shani: "नीलम"
      };
      if (planetGems[planet]) {
        gems.push(planetGems[planet]);
      }
    }
  });
  return gems;
}

function getTransitWarning(planet) {
  const warnings = {
    surya: "अधिकारियों से विनम्रता से पेश आएं",
    chandra: "भावनात्मक निर्णय लेने से बचें",
    mangal: "गुस्से पर काबू रखें और दुर्घटनाओं से बचें",
    budh: "गलत सूचना और भ्रम से सावधान रहें",
    guru: "अति आत्मविश्वास से बचें",
    shukra: "रिश्तों में धैर्य रखें",
    shani: "धैर्य रखें और कड़ी मेहनत करते रहें",
    rahu: "धोखाधड़ी और भ्रम से बचें",
    ketu: "आध्यात्मिक साधना पर ध्यान दें"
  };
  return warnings[planet] || "सामान्य सावधानी बरतें";
}
