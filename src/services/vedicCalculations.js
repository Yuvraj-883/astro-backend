// ../src/services/vedicCalculations.js

/**
 * Vedic Astronomy and Panchang Calculations
 * Provides lunar calendar, nakshatra, tithi calculations
 */

// 27 Nakshatras in Vedic Astrology
export const nakshatras = [
  { name: "अश्विनी", lord: "केतु", deity: "अश्विनी कुमार", guna: "राजस", element: "पृथ्वी" },
  { name: "भरणी", lord: "शुक्र", deity: "यम", guna: "राजस", element: "पृथ्वी" },
  { name: "कृत्तिका", lord: "सूर्य", deity: "अग्नि", guna: "राजस", element: "पृथ्वी" },
  { name: "रोहिणी", lord: "चंद्र", deity: "ब्रह्मा", guna: "राजस", element: "पृथ्वी" },
  { name: "मृगशिरा", lord: "मंगल", deity: "चंद्र", guna: "तमस", element: "पृथ्वी" },
  { name: "आर्द्रा", lord: "राहु", deity: "रुद्र", guna: "तमस", element: "जल" },
  { name: "पुनर्वसु", lord: "गुरु", deity: "अदिति", guna: "राजस", element: "जल" },
  { name: "पुष्य", lord: "शनि", deity: "बृहस्पति", guna: "राजस", element: "जल" },
  { name: "आश्लेषा", lord: "बुध", deity: "नाग", guna: "तमस", element: "जल" },
  { name: "मघा", lord: "केतु", deity: "पितृ", guna: "तमस", element: "अग्नि" },
  { name: "पूर्वा फाल्गुनी", lord: "शुक्र", deity: "भग", guna: "राजस", element: "अग्नि" },
  { name: "उत्तरा फाल्गुनी", lord: "सूर्य", deity: "अर्यमा", guna: "राजस", element: "अग्नि" },
  { name: "हस्त", lord: "चंद्र", deity: "सवितृ", guna: "राजस", element: "अग्नि" },
  { name: "चित्रा", lord: "मंगल", deity: "त्वष्टा", guna: "तमस", element: "अग्नि" },
  { name: "स्वाति", lord: "राहु", deity: "वायु", guna: "तमस", element: "वायु" },
  { name: "विशाखा", lord: "गुरु", deity: "इंद्राग्नि", guna: "राजस", element: "वायु" },
  { name: "अनुराधा", lord: "शनि", deity: "मित्र", guna: "तमस", element: "वायु" },
  { name: "ज्येष्ठा", lord: "बुध", deity: "इंद्र", guna: "राजस", element: "वायु" },
  { name: "मूल", lord: "केतु", deity: "निर्ऋति", guna: "तमस", element: "वायु" },
  { name: "पूर्वाषाढ़", lord: "शुक्र", deity: "आपः", guna: "राजस", element: "आकाश" },
  { name: "उत्तराषाढ़", lord: "सूर्य", deity: "विश्वेदेव", guna: "राजस", element: "आकाश" },
  { name: "श्रवण", lord: "चंद्र", deity: "विष्णु", guna: "राजस", element: "आकाश" },
  { name: "धनिष्ठा", lord: "मंगल", deity: "वसु", guna: "तमस", element: "आकाश" },
  { name: "शतभिषा", lord: "राहु", deity: "वरुण", guna: "तमस", element: "आकाश" },
  { name: "पूर्वा भाद्रपद", lord: "गुरु", deity: "अज एकपाद", guna: "राजस", element: "आकाश" },
  { name: "उत्तरा भाद्रपद", lord: "शनि", deity: "अहिर्बुध्न्य", guna: "तमस", element: "आकाश" },
  { name: "रेवती", lord: "बुध", deity: "पूषा", guna: "सत्व", element: "आकाश" }
];

// 15 Tithis in lunar month
export const tithis = [
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
  "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
  "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा/अमावस्या"
];

// 27 Yogas in Panchang
export const yogas = [
  "विष्कुम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन",
  "अतिगण्ड", "सुकर्म", "धृति", "शूल", "गण्ड",
  "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
  "सिद्धि", "व्यतीपात", "वरीयान", "परिघ", "शिव",
  "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म",
  "ऐन्द्र", "वैधृति"
];

// 11 Karanas in half-tithi
export const karanas = [
  "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि",
  "शकुनि", "चतुष्पाद", "नाग", "किंस्तुघ्न"
];

/**
 * Calculate current lunar day (Tithi)
 */
export function calculateLunarDay(date = new Date()) {
  // Simplified calculation - in real implementation, use astronomical data
  const moonPhase = getMoonPhase(date);
  const tithiNumber = Math.floor(moonPhase * 15) + 1;
  
  return {
    number: tithiNumber,
    name: tithis[Math.min(tithiNumber - 1, 14)],
    type: tithiNumber <= 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष",
    percentage: (moonPhase * 100).toFixed(1)
  };
}

/**
 * Get current Nakshatra
 */
export function getCurrentNakshatra(date = new Date()) {
  // Simplified calculation based on lunar longitude
  const dayOfYear = getDayOfYear(date);
  const nakshatraIndex = Math.floor((dayOfYear * 27) / 365) % 27;
  
  return {
    ...nakshatras[nakshatraIndex],
    index: nakshatraIndex + 1,
    currentLord: nakshatras[nakshatraIndex].lord,
    isAuspicious: isAuspiciousNakshatra(nakshatraIndex)
  };
}

/**
 * Get complete Panchang for a date
 */
export function getPanchang(date = new Date()) {
  const tithi = calculateLunarDay(date);
  const nakshatra = getCurrentNakshatra(date);
  const dayOfWeek = date.getDay();
  
  // Calculate Yoga and Karana (simplified)
  const yogaIndex = (tithi.number + nakshatra.index) % 27;
  const karanaIndex = Math.floor(tithi.number / 2) % 11;
  
  return {
    date: date.toLocaleDateString('hi-IN'),
    weekday: getHindiWeekday(dayOfWeek),
    tithi: {
      name: tithi.name,
      type: tithi.type,
      percentage: tithi.percentage
    },
    nakshatra: {
      name: nakshatra.name,
      lord: nakshatra.lord,
      deity: nakshatra.deity,
      guna: nakshatra.guna
    },
    yoga: {
      name: yogas[yogaIndex],
      isAuspicious: isAuspiciousYoga(yogaIndex)
    },
    karana: {
      name: karanas[karanaIndex],
      type: getKaranaType(karanaIndex)
    },
    rahuKaal: getRahuKaal(dayOfWeek),
    yamaGanda: getYamaGanda(dayOfWeek),
    gulika: getGulika(dayOfWeek),
    sunrise: getSunrise(date),
    sunset: getSunset(date),
    moonrise: getMoonrise(date),
    moonPhase: getMoonPhaseDescription(date)
  };
}

/**
 * Get Hindi weekday name
 */
function getHindiWeekday(dayIndex) {
  const hindiDays = [
    "रविवार", "सोमवार", "मंगलवार", "बुधवार", 
    "गुरुवार", "शुक्रवार", "शनिवार"
  ];
  return hindiDays[dayIndex];
}

/**
 * Calculate approximate moon phase (0 to 1)
 */
function getMoonPhase(date) {
  const lunarMonth = 29.53058867; // Average lunar month in days
  const knownNewMoon = new Date('2024-01-11'); // A known new moon date
  
  const daysSinceNewMoon = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  const currentCycle = daysSinceNewMoon % lunarMonth;
  
  return currentCycle / lunarMonth;
}

/**
 * Get moon phase description
 */
function getMoonPhaseDescription(date) {
  const phase = getMoonPhase(date);
  
  if (phase < 0.125) return "नया चांद (अमावस्या)";
  if (phase < 0.375) return "बढ़ता चांद (शुक्ल पक्ष)";
  if (phase < 0.625) return "पूरा चांद (पूर्णिमा)";
  if (phase < 0.875) return "घटता चांद (कृष्ण पक्ष)";
  return "नया चांद (अमावस्या)";
}

/**
 * Check if Nakshatra is auspicious
 */
function isAuspiciousNakshatra(index) {
  const auspiciousNakshatras = [0, 3, 6, 10, 12, 15, 21, 26]; // Ashwini, Rohini, etc.
  return auspiciousNakshatras.includes(index);
}

/**
 * Check if Yoga is auspicious
 */
function isAuspiciousYoga(index) {
  const auspiciousYogas = [1, 2, 3, 4, 6, 7, 11, 13, 15, 20, 21, 22, 23, 24]; // Preeti, Ayushman, etc.
  return auspiciousYogas.includes(index);
}

/**
 * Get Karana type
 */
function getKaranaType(index) {
  if (index < 7) return "चर";
  return "स्थिर";
}

/**
 * Get Rahu Kaal timings
 */
function getRahuKaal(dayOfWeek) {
  const rahuKaalTimings = [
    "4:30 PM - 6:00 PM", // Sunday
    "7:30 AM - 9:00 AM", // Monday  
    "3:00 PM - 4:30 PM", // Tuesday
    "12:00 PM - 1:30 PM", // Wednesday
    "1:30 PM - 3:00 PM", // Thursday
    "10:30 AM - 12:00 PM", // Friday
    "9:00 AM - 10:30 AM"  // Saturday
  ];
  
  return {
    time: rahuKaalTimings[dayOfWeek],
    warning: "इस समय में कोई शुभ कार्य न करें"
  };
}

/**
 * Get Yama Ganda timings
 */
function getYamaGanda(dayOfWeek) {
  const yamaGandaTimings = [
    "12:00 PM - 1:30 PM", // Sunday
    "10:30 AM - 12:00 PM", // Monday
    "9:00 AM - 10:30 AM", // Tuesday
    "7:30 AM - 9:00 AM", // Wednesday
    "6:00 AM - 7:30 AM", // Thursday
    "3:00 PM - 4:30 PM", // Friday
    "1:30 PM - 3:00 PM"  // Saturday
  ];
  
  return {
    time: yamaGandaTimings[dayOfWeek],
    warning: "मृत्यु संबंधी कार्यों से बचें"
  };
}

/**
 * Get Gulika timings
 */
function getGulika(dayOfWeek) {
  const gulikaTimings = [
    "3:00 PM - 4:30 PM", // Sunday
    "1:30 PM - 3:00 PM", // Monday
    "12:00 PM - 1:30 PM", // Tuesday
    "10:30 AM - 12:00 PM", // Wednesday
    "9:00 AM - 10:30 AM", // Thursday
    "7:30 AM - 9:00 AM", // Friday
    "6:00 AM - 7:30 AM"  // Saturday
  ];
  
  return {
    time: gulikaTimings[dayOfWeek],
    effect: "शनि का प्रभाव, सावधानी बरतें"
  };
}

/**
 * Get approximate sunrise time
 */
function getSunrise(date) {
  // Simplified calculation for India (Delhi latitude ~28.6°)
  const dayOfYear = getDayOfYear(date);
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear)) / 365 * Math.PI / 180);
  const hourAngle = Math.acos(-Math.tan(28.6 * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
  const sunriseTime = 12 - (hourAngle * 180 / Math.PI) / 15;
  
  const hours = Math.floor(sunriseTime);
  const minutes = Math.floor((sunriseTime - hours) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Get approximate sunset time
 */
function getSunset(date) {
  const dayOfYear = getDayOfYear(date);
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear)) / 365 * Math.PI / 180);
  const hourAngle = Math.acos(-Math.tan(28.6 * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
  const sunsetTime = 12 + (hourAngle * 180 / Math.PI) / 15;
  
  const hours = Math.floor(sunsetTime);
  const minutes = Math.floor((sunsetTime - hours) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Get approximate moonrise time
 */
function getMoonrise(date) {
  const moonPhase = getMoonPhase(date);
  const baseTime = 6 + (moonPhase * 24); // Simplified calculation
  
  const hours = Math.floor(baseTime) % 24;
  const minutes = Math.floor((baseTime - Math.floor(baseTime)) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Get day of year
 */
export function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get sign from day of year (simplified)
 */
function getSignFromDayOfYear(dayOfYear) {
  const signs = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 
                'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];
  return signs[Math.floor((dayOfYear % 365) / 30.4)];
}

/**
 * Check if planet is retrograde (simplified)
 */
function isRetrograde(planet, date) {
  const dayOfYear = getDayOfYear(date);
  const retrogradeRanges = {
    budh: [[80, 90], [170, 180], [260, 270]], // Mercury retrogrades
    shukra: [[150, 190]], // Venus retrograde
    mangal: [[200, 250]], // Mars retrograde
    guru: [[300, 350]], // Jupiter retrograde
    shani: [[100, 200]]  // Saturn retrograde
  };
  
  const ranges = retrogradeRanges[planet] || [];
  return ranges.some(([start, end]) => dayOfYear >= start && dayOfYear <= end);
}

/**
 * Get current planetary positions (enhanced with more realistic calculations)
 */
export function getCurrentPlanetaryPositions(date = new Date()) {
  const dayOfYear = getDayOfYear(date);
  const year = date.getFullYear();
  const daysSinceEpoch = (date - new Date('2000-01-01')) / (1000 * 60 * 60 * 24);
  
  // Enhanced planetary positions using improved orbital calculations
  return {
    surya: calculateEnhancedSunPosition(dayOfYear, year),
    chandra: calculateEnhancedMoonPosition(daysSinceEpoch),
    mangal: calculateEnhancedMarsPosition(daysSinceEpoch),
    budh: calculateEnhancedMercuryPosition(daysSinceEpoch),
    guru: calculateEnhancedJupiterPosition(daysSinceEpoch),
    shukra: calculateEnhancedVenusPosition(daysSinceEpoch),
    shani: calculateEnhancedSaturnPosition(daysSinceEpoch),
    rahu: calculateRahuKetuPosition(daysSinceEpoch, true),
    ketu: calculateRahuKetuPosition(daysSinceEpoch, false)
  };
}

/**
 * Enhanced Sun position calculation
 */
function calculateEnhancedSunPosition(dayOfYear, year) {
  // Mean longitude of Sun (tropical zodiac)
  const meanLongitude = (280.460 + 0.9856474 * dayOfYear) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: false, // Sun never retrogrades
    speed: 0.986 // Average daily motion in degrees
  };
}

/**
 * Enhanced Moon position calculation
 */
function calculateEnhancedMoonPosition(daysSinceEpoch) {
  // Moon's mean longitude (faster moving)
  const meanLongitude = (218.316 + 13.176396 * daysSinceEpoch) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: false, // Moon never retrogrades
    speed: 13.18 // Average daily motion
  };
}

/**
 * Enhanced Mars position calculation
 */
function calculateEnhancedMarsPosition(daysSinceEpoch) {
  const meanLongitude = (355.433 + 0.524033 * daysSinceEpoch) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  // Mars retrograde cycle (approximately every 26 months)
  const retroCycle = daysSinceEpoch % 780; // Synodic period
  const isRetrograde = retroCycle > 700 && retroCycle < 750;
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: isRetrograde,
    speed: isRetrograde ? -0.3 : 0.52
  };
}

/**
 * Enhanced Mercury position calculation
 */
function calculateEnhancedMercuryPosition(daysSinceEpoch) {
  const meanLongitude = (252.251 + 4.092385 * daysSinceEpoch) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  // Mercury retrograde cycle (approximately 3-4 times per year)
  const retroCycle = daysSinceEpoch % 116; // Synodic period
  const isRetrograde = (retroCycle > 100 && retroCycle < 116) || 
                      (retroCycle > 25 && retroCycle < 35) ||
                      (retroCycle > 65 && retroCycle < 75);
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: isRetrograde,
    speed: isRetrograde ? -0.8 : 4.09
  };
}

/**
 * Enhanced Jupiter position calculation
 */
function calculateEnhancedJupiterPosition(daysSinceEpoch) {
  const meanLongitude = (34.351 + 0.083056 * daysSinceEpoch) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  // Jupiter retrograde cycle (approximately 4 months per year)
  const retroCycle = daysSinceEpoch % 399; // Synodic period
  const isRetrograde = retroCycle > 280 && retroCycle < 399;
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: isRetrograde,
    speed: isRetrograde ? -0.05 : 0.083
  };
}

/**
 * Enhanced Venus position calculation
 */
function calculateEnhancedVenusPosition(daysSinceEpoch) {
  const meanLongitude = (181.980 + 1.602136 * daysSinceEpoch) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  // Venus retrograde cycle (approximately every 19 months)
  const retroCycle = daysSinceEpoch % 584; // Synodic period
  const isRetrograde = retroCycle > 530 && retroCycle < 584;
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: isRetrograde,
    speed: isRetrograde ? -0.6 : 1.6
  };
}

/**
 * Enhanced Saturn position calculation
 */
function calculateEnhancedSaturnPosition(daysSinceEpoch) {
  const meanLongitude = (50.077 + 0.033585 * daysSinceEpoch) % 360;
  const sign = getVedicSignFromDegree(meanLongitude);
  
  // Saturn retrograde cycle (approximately 4.5 months per year)
  const retroCycle = daysSinceEpoch % 378; // Synodic period
  const isRetrograde = retroCycle > 240 && retroCycle < 378;
  
  return {
    sign: sign,
    longitude: meanLongitude,
    degree: meanLongitude % 30,
    nakshatra: getNakshatraFromDegree(meanLongitude),
    isRetrograde: isRetrograde,
    speed: isRetrograde ? -0.02 : 0.034
  };
}

/**
 * Calculate Rahu/Ketu positions (shadow planets)
 */
function calculateRahuKetuPosition(daysSinceEpoch, isRahu = true) {
  // Rahu moves backwards through the zodiac
  const meanLongitude = (125.0 - 0.052954 * daysSinceEpoch) % 360;
  const longitude = isRahu ? meanLongitude : (meanLongitude + 180) % 360;
  const sign = getVedicSignFromDegree(longitude);
  
  return {
    sign: sign,
    longitude: longitude,
    degree: longitude % 30,
    nakshatra: getNakshatraFromDegree(longitude),
    isRetrograde: true, // Always retrograde
    speed: -0.053
  };
}

/**
 * Convert tropical longitude to Vedic zodiac sign
 */
function getVedicSignFromDegree(longitude) {
  // Apply ayanamsa (precession correction) - using Lahiri ayanamsa
  const ayanamsa = 24.1; // Approximate current ayanamsa
  const siderealLongitude = (longitude - ayanamsa + 360) % 360;
  
  const signIndex = Math.floor(siderealLongitude / 30);
  const signs = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 
                'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];
  
  return signs[signIndex];
}

/**
 * Get Nakshatra from longitude
 */
function getNakshatraFromDegree(longitude) {
  const ayanamsa = 24.1;
  const siderealLongitude = (longitude - ayanamsa + 360) % 360;
  const nakshatraIndex = Math.floor(siderealLongitude / 13.333333); // 360/27
  
  return nakshatras[nakshatraIndex % 27].name;
}



/**
 * Get auspicious muhurat for the day
 */
export function getAuspiciousMuhurat(date = new Date()) {
  const panchang = getPanchang(date);
  const isAuspicious = panchang.nakshatra.guna === "राजस" && 
                     panchang.yoga.isAuspicious && 
                     panchang.karana.type === "चर";
  
  if (isAuspicious) {
    return {
      isAvailable: true,
      time: "10:30 AM - 12:00 PM",
      purpose: "शुभ कार्य, विवाह, गृह प्रवेश",
      strength: "उत्तम"
    };
  } else {
    return {
      isAvailable: false,
      reason: "आज का दिन सामान्य मुहूर्त के लिए उपयुक्त नहीं है",
      alternative: "कल का पंचांग देखें"
    };
  }
}
